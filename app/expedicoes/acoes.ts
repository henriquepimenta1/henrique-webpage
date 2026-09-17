"use server";

import { registrar, validar, type Erros } from "@/lib/interesse";

export interface EstadoForm {
  estado: "parado" | "ok" | "erro";
  erros?: Erros;
  mensagem?: string;
}

export const ESTADO_INICIAL: EstadoForm = { estado: "parado" };

export async function entrarNaLista(
  _anterior: EstadoForm,
  form: FormData,
): Promise<EstadoForm> {
  // Isca: um campo escondido que pessoa nenhuma vê e robô de formulário
  // preenche. Se veio cheio, responde como sucesso — quem está do outro lado
  // não precisa saber que foi barrado.
  if (typeof form.get("website") === "string" && form.get("website") !== "") {
    return { estado: "ok" };
  }

  const r = validar(form);
  if (!r.ok) return { estado: "erro", erros: r.erros };

  try {
    await registrar(r.dados);
  } catch (e) {
    // O detalhe vai pro log do servidor; quem preencheu recebe uma frase.
    console.error("[lista-interesse] falha ao gravar", e);
    return {
      estado: "erro",
      mensagem: "Não consegui salvar agora. Tente de novo em instantes.",
    };
  }

  return { estado: "ok" };
}
