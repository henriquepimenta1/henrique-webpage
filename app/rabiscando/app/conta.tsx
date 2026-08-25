"use client";

import { useState } from "react";
import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import { METADATA_KEY, type RabiscandoMetadata } from "@/lib/rabiscando-plano";
import styles from "../rabiscando.module.css";

// Canto direito da topbar do editor: estado da assinatura + porta de saída.
//
// Cancelar, trocar cartão e ver faturas acontecem TUDO no portal hospedado
// do Stripe (/api/stripe/portal). Reconstruir isso aqui significaria lidar
// com pró-rata, período de carência e retentativa de cobrança — regras que
// o Stripe já implementa e que erram feio quando reimplementadas.

const ROTULO_PLANO: Record<string, string> = {
  anual: "assinante · anual",
  mensal: "assinante · mensal",
};

export default function Conta() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [abrindo, setAbrindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const meta = (user?.publicMetadata?.[METADATA_KEY] ?? {}) as RabiscandoMetadata;
  const ativo = meta.ativo === true;

  async function abrirPortal() {
    setAbrindo(true);
    setErro(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const dados = await res.json();
      if (!res.ok || !dados.url) throw new Error(dados.erro ?? "falha");
      // Mesma janela, como no checkout: nova aba apanha de bloqueador de
      // pop-up no celular.
      window.location.href = dados.url;
    } catch {
      setErro("não abriu. tente de novo.");
      setAbrindo(false);
    }
  }

  return (
    <div className={styles.conta}>
      {erro && <span className={styles.contaErro}>{erro}</span>}

      <span className={styles.planStatus}>
        <span className={styles.planDot} data-on={ativo ? "1" : "0"} />
        {/* Antes de `isLoaded` não dá para afirmar nada sobre o plano;
            afirmar "assinante" e corrigir depois pisca informação errada. */}
        <span className={styles.planLabel}>
          {!isLoaded
            ? "carregando"
            : ativo
              ? ROTULO_PLANO[meta.plano ?? ""] ?? "assinante"
              : "sem assinatura"}
        </span>
      </span>

      {ativo && (
        <button className="rb-btn rb-btn--tertiary" onClick={abrirPortal} disabled={abrindo}>
          {abrindo ? "abrindo ···" : "gerenciar assinatura"}
        </button>
      )}

      <UserButton />

      {/* Sair explícito, além do que existe dentro do UserButton. Aquele fica
          atrás de um clique no avatar, e ninguém procura ali no meio de uma
          edição. Volta para a landing, não para o portão de login: sair e
          cair numa tela pedindo para entrar de novo é confuso. */}
      <button
        className="rb-btn rb-btn--icon"
        onClick={() => signOut({ redirectUrl: "/rabiscando" })}
        aria-label="Sair da conta"
        title="Sair da conta"
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M6 14H3.2A1.2 1.2 0 0 1 2 12.8V3.2A1.2 1.2 0 0 1 3.2 2H6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M10.5 11 14 8l-3.5-3M13.6 8H6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
