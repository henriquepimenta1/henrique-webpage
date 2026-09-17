import type { Erros } from "./interesse";

// Estado do formulário da lista de interesse.
//
// Mora FORA de `app/expedicoes/acoes.ts` de propósito: um arquivo com
// "use server" só pode exportar funções assíncronas — o Next transforma todo
// export num ponteiro para o servidor. Uma constante exportada de lá chega no
// cliente como proxy de função, não como o objeto, e o primeiro acesso a um
// campo dela derruba a página. Tipos podem morar lá (somem na compilação);
// valores, não.

export interface EstadoForm {
  estado: "parado" | "ok" | "erro";
  erros?: Erros;
  mensagem?: string;
}

export const ESTADO_INICIAL: EstadoForm = { estado: "parado" };
