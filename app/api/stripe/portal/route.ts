import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe, baseUrl, METADATA_KEY, type RabiscandoMetadata } from "@/lib/stripe";

// Portal do cliente: cancelar, trocar cartão, ver faturas. Tudo hospedado
// pelo Stripe — não vale a pena reconstruir isso.

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ erro: "não autenticado" }, { status: 401 });
  }

  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const meta = (user.publicMetadata?.[METADATA_KEY] ?? {}) as RabiscandoMetadata;

    if (!meta.stripeCustomerId) {
      return NextResponse.json({ erro: "sem assinatura" }, { status: 404 });
    }

    const sessao = await stripe().billingPortal.sessions.create({
      customer: meta.stripeCustomerId,
      return_url: `${baseUrl()}/rabiscando/app`,
      locale: "pt-BR",
    });

    return NextResponse.json({ url: sessao.url });
  } catch (e) {
    console.error("[stripe/portal]", e);
    return NextResponse.json({ erro: "falha ao abrir portal" }, { status: 500 });
  }
}
