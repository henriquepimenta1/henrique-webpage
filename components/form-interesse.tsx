"use client";

import { useActionState, useId } from "react";

import { entrarNaLista } from "@/app/expedicoes/acoes";
import { ESTADO_INICIAL } from "@/lib/estado-form";

// Formulário da lista de interesse.
//
// É um <form action={...}> de verdade, não um onSubmit com fetch: assim ele
// envia mesmo que o JavaScript falhe ou ainda não tenha carregado — que é
// justamente quando alguém desiste de preencher.

interface Props {
  expedicao: string;
  // As duas chamadas na página dos Lençóis vivem sobre fundos diferentes
  // (--bark e --forest). O tom troca as cores; a estrutura é a mesma.
  tom?: "escuro" | "floresta";
}

const TONS = {
  escuro: {
    campo: "var(--canvas)",
    campoTexto: "var(--bark)",
    borda: "var(--rust)",
    botao: "var(--rust)",
    botaoTexto: "var(--canvas)",
    rotulo: "var(--rust-soft)",
    apoio: "var(--ashe)",
  },
  floresta: {
    campo: "var(--canvas)",
    campoTexto: "var(--forest)",
    borda: "var(--rust-soft)",
    botao: "var(--rust-soft)",
    botaoTexto: "var(--forest)",
    rotulo: "var(--rust-soft)",
    apoio: "var(--ashe)",
  },
} as const;

export default function FormInteresse({ expedicao, tom = "escuro" }: Props) {
  const [estado, acao, enviando] = useActionState(entrarNaLista, ESTADO_INICIAL);
  const id = useId();
  const cor = TONS[tom];

  if (estado.estado === "ok") {
    return (
      <div
        role="status"
        style={{
          padding: "28px 24px",
          border: `1px solid ${cor.borda}`,
          maxWidth: 440,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 19,
            color: cor.rotulo,
            margin: "0 0 8px",
          }}
        >
          Você está na lista.
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: ".14em",
            lineHeight: 1.7,
            color: cor.apoio,
            margin: 0,
          }}
        >
          Aviso assim que as datas saírem.
        </p>
      </div>
    );
  }

  return (
    <form
      action={acao}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        maxWidth: 440,
        margin: "0 auto",
        textAlign: "left",
      }}
    >
      <input type="hidden" name="expedicao" value={expedicao} />

      {/* Isca para robô. Fora da vista e fora do foco do teclado, mas sem
          display:none — que é o primeiro sinal que um robô decente procura. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor={`${id}-site`}>Não preencha este campo</label>
        <input id={`${id}-site`} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Campo
        id={`${id}-nome`}
        nome="nome"
        rotulo="Nome"
        tipo="text"
        autoComplete="name"
        erro={estado.erros?.nome}
        cor={cor}
      />
      <Campo
        id={`${id}-email`}
        nome="email"
        rotulo="E-mail"
        tipo="email"
        autoComplete="email"
        erro={estado.erros?.email}
        cor={cor}
      />
      <Campo
        id={`${id}-tel`}
        nome="telefone"
        rotulo="WhatsApp"
        tipo="tel"
        autoComplete="tel"
        erro={estado.erros?.telefone}
        cor={cor}
      />

      <button
        type="submit"
        disabled={enviando}
        style={{
          marginTop: 6,
          padding: "16px 36px",
          fontFamily: "var(--font-ui)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          background: cor.botao,
          color: cor.botaoTexto,
          border: `1px solid ${cor.botao}`,
          cursor: enviando ? "wait" : "pointer",
          opacity: enviando ? 0.7 : 1,
        }}
      >
        {enviando ? "Enviando…" : "Entrar na lista →"}
      </button>

      <p aria-live="polite" style={{ margin: 0 }}>
        {estado.mensagem && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: ".12em",
              color: cor.rotulo,
            }}
          >
            {estado.mensagem}
          </span>
        )}
      </p>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: ".12em",
          lineHeight: 1.7,
          color: cor.apoio,
          margin: 0,
          opacity: 0.75,
        }}
      >
        Uso seus dados só para avisar sobre esta expedição. Nada de lista de spam.
      </p>
    </form>
  );
}

function Campo({
  id,
  nome,
  rotulo,
  tipo,
  autoComplete,
  erro,
  cor,
}: {
  id: string;
  nome: string;
  rotulo: string;
  tipo: string;
  autoComplete: string;
  erro?: string;
  cor: (typeof TONS)[keyof typeof TONS];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: cor.rotulo,
        }}
      >
        {rotulo}
      </label>
      <input
        id={id}
        name={nome}
        type={tipo}
        required
        autoComplete={autoComplete}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        style={{
          padding: "13px 14px",
          fontFamily: "var(--font-ui)",
          fontSize: 14,
          background: cor.campo,
          color: cor.campoTexto,
          border: `1px solid ${erro ? cor.borda : "transparent"}`,
          outlineColor: cor.borda,
        }}
      />
      {erro && (
        <span
          id={`${id}-erro`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: ".12em",
            color: cor.rotulo,
          }}
        >
          {erro}
        </span>
      )}
    </div>
  );
}
