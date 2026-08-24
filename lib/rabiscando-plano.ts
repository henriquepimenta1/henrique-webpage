// Contrato da assinatura, SEM o SDK do Stripe junto.
//
// Existe separado de lib/stripe.ts porque a topbar do editor é um componente
// cliente e precisa ler `publicMetadata[METADATA_KEY]`. Importar lib/stripe
// de lá arrastaria o SDK (e a chave secreta) para o bundle do navegador —
// ver o aviso no topo daquele arquivo.

export type Plano = "mensal" | "anual";

/** Chave onde o status da assinatura vive no publicMetadata do Clerk. */
export const METADATA_KEY = "rabiscando";

export interface RabiscandoMetadata {
  /** Só isto decide o acesso. */
  ativo: boolean;
  stripeCustomerId?: string;
  subscriptionId?: string;
  plano?: Plano;
  /** ISO — fim do período pago já contratado. */
  validoAte?: string;
}
