import Stripe from "stripe";

// Cliente Stripe do servidor. NUNCA importar isto de um componente cliente —
// a chave secreta vazaria no bundle.

function requireEnv(nome: string): string {
  const v = process.env[nome];
  if (!v) throw new Error(`variável de ambiente ausente: ${nome}`);
  return v;
}

let cached: Stripe | null = null;

/**
 * Instanciado sob demanda, não no topo do módulo: assim o build não quebra
 * em ambientes sem as chaves (preview de branch, CI), só a rota que
 * realmente usa Stripe falha.
 */
export function stripe(): Stripe {
  if (!cached) {
    cached = new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
      // Fixar a versão evita que uma atualização da API do Stripe mude o
      // comportamento das rotas sem aviso.
      apiVersion: "2026-07-29.dahlia",
      appInfo: { name: "Rabisco (euhenriq.com.br)" },
    });
  }
  return cached;
}

export type Plano = "mensal" | "anual";

export function priceIdDoPlano(plano: Plano): string {
  return plano === "anual"
    ? requireEnv("STRIPE_PRICE_ANUAL")
    : requireEnv("STRIPE_PRICE_MENSAL");
}

export function webhookSecret(): string {
  return requireEnv("STRIPE_WEBHOOK_SECRET");
}

/**
 * URL base da aplicação. Em produção use NEXT_PUBLIC_APP_URL; o fallback
 * para VERCEL_URL faz os previews de branch funcionarem sem configuração.
 */
export function baseUrl(): string {
  const explicita = process.env.NEXT_PUBLIC_APP_URL;
  if (explicita) return explicita.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** Chave onde o status da assinatura vive no publicMetadata do Clerk. */
export const METADATA_KEY = "rabisco";

export interface RabiscoMetadata {
  /** Só isto decide o acesso. */
  ativo: boolean;
  stripeCustomerId?: string;
  subscriptionId?: string;
  plano?: Plano;
  /** ISO — fim do período pago já contratado. */
  validoAte?: string;
}
