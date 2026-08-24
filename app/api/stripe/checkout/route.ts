import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  stripe,
  priceIdDoPlano,
  baseUrl,
  METADATA_KEY,
  type Plano,
  type RabiscoMetadata,
} from "@/lib/stripe";

// Cria a sessão de checkout e devolve a URL hospedada do Stripe.
// O preço vem SEMPRE do servidor (variável de ambiente): se o cliente
// pudesse mandar o valor, daria para assinar por R$ 0,01.

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ erro: "não autenticado" }, { status: 401 });
  }

  let plano: Plano = "mensal";
  try {
    const body = await req.json();
    if (body?.plano === "anual") plano = "anual";
  } catch {
    // corpo ausente ou inválido — segue no mensal
  }

  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const meta = (user.publicMetadata?.[METADATA_KEY] ?? {}) as RabiscoMetadata;

    // Reaproveita o customer para não criar um duplicado a cada tentativa
    // de assinatura (e para o portal encontrar o histórico).
    let customerId = meta.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe().customers.create({
        email: user.primaryEmailAddress?.emailAddress,
        metadata: { clerkUserId: userId },
      });
      customerId = customer.id;
      await clerk.users.updateUser(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          [METADATA_KEY]: { ...meta, stripeCustomerId: customerId } satisfies RabiscoMetadata,
        },
      });
    }

    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceIdDoPlano(plano), quantity: 1 }],
      success_url: `${baseUrl()}/rabisco/app?assinatura=ok`,
      cancel_url: `${baseUrl()}/rabisco?assinatura=cancelada`,
      locale: "pt-BR",
      allow_promotion_codes: true,
      // Necessário para nota fiscal e para o Stripe calcular imposto no BR.
      billing_address_collection: "required",
      // O webhook usa isto para saber a quem creditar a assinatura.
      subscription_data: { metadata: { clerkUserId: userId, plano } },
      metadata: { clerkUserId: userId, plano },
    });

    if (!session.url) {
      return NextResponse.json({ erro: "checkout sem URL" }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[stripe/checkout]", e);
    return NextResponse.json({ erro: "falha ao iniciar checkout" }, { status: 500 });
  }
}
