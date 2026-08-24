import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  stripe,
  webhookSecret,
  METADATA_KEY,
  type Plano,
  type RabiscoMetadata,
} from "@/lib/stripe";

// Webhook do Stripe: é ISTO que concede e revoga o acesso.
//
// A verificação de assinatura não é opcional — sem ela qualquer pessoa
// poderia dar POST aqui com um JSON forjado e liberar a própria conta.

/** O SDK do Stripe precisa do crypto do Node; não pode rodar no edge. */
export const runtime = "nodejs";

/**
 * `past_due` mantém o acesso de propósito: o Stripe ainda vai tentar cobrar
 * por cerca de duas semanas, e cortar na primeira falha de cartão puniria
 * quem só teve o cartão recusado uma vez.
 */
const STATUS_COM_ACESSO: ReadonlySet<Stripe.Subscription.Status> = new Set([
  "active",
  "trialing",
  "past_due",
]);

/** Em versões recentes da API o período migrou para o item da assinatura. */
function fimDoPeriodo(sub: Stripe.Subscription): string | undefined {
  const doItem = sub.items?.data?.[0]?.current_period_end;
  const bruto = doItem ?? (sub as unknown as { current_period_end?: number }).current_period_end;
  return typeof bruto === "number" ? new Date(bruto * 1000).toISOString() : undefined;
}

async function aplicarNoClerk(clerkUserId: string, patch: Partial<RabiscoMetadata>) {
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(clerkUserId);
  const atual = (user.publicMetadata?.[METADATA_KEY] ?? {}) as RabiscoMetadata;
  await clerk.users.updateUser(clerkUserId, {
    publicMetadata: {
      ...user.publicMetadata,
      [METADATA_KEY]: { ...atual, ...patch } satisfies RabiscoMetadata,
    },
  });
}

async function sincronizarAssinatura(sub: Stripe.Subscription) {
  const clerkUserId = sub.metadata?.clerkUserId;
  if (!clerkUserId) {
    // Sem o vínculo não há a quem creditar. Devolver 200 mesmo assim evita
    // que o Stripe fique reenviando um evento que nunca vai ser resolvido.
    console.warn("[stripe/webhook] assinatura sem clerkUserId:", sub.id);
    return;
  }

  await aplicarNoClerk(clerkUserId, {
    ativo: STATUS_COM_ACESSO.has(sub.status),
    subscriptionId: sub.id,
    stripeCustomerId: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
    plano: (sub.metadata?.plano as Plano | undefined) ?? undefined,
    validoAte: fimDoPeriodo(sub),
  });
}

export async function POST(req: Request) {
  const assinatura = req.headers.get("stripe-signature");
  if (!assinatura) {
    return NextResponse.json({ erro: "sem assinatura" }, { status: 400 });
  }

  // Precisa ser o corpo CRU: qualquer parse antes disso invalida o HMAC.
  const cru = await req.text();

  let evento: Stripe.Event;
  try {
    evento = stripe().webhooks.constructEvent(cru, assinatura, webhookSecret());
  } catch (e) {
    console.error("[stripe/webhook] assinatura inválida", e);
    return NextResponse.json({ erro: "assinatura inválida" }, { status: 400 });
  }

  try {
    switch (evento.type) {
      case "checkout.session.completed": {
        const sessao = evento.data.object;
        if (sessao.subscription) {
          const id =
            typeof sessao.subscription === "string"
              ? sessao.subscription
              : sessao.subscription.id;
          // Relê do Stripe em vez de confiar no que veio na sessão: garante
          // status e período atuais mesmo se eventos chegarem fora de ordem.
          await sincronizarAssinatura(await stripe().subscriptions.retrieve(id));
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await sincronizarAssinatura(evento.data.object);
        break;

      default:
        // Eventos não tratados retornam 200 para o Stripe parar de reenviar.
        break;
    }
  } catch (e) {
    // 500 faz o Stripe reenviar — correto para falha transitória (ex.: Clerk fora).
    console.error("[stripe/webhook] falha ao processar", evento.type, e);
    return NextResponse.json({ erro: "falha ao processar" }, { status: 500 });
  }

  return NextResponse.json({ recebido: true });
}
