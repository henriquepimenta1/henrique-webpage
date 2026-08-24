"use client";

import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
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
        <button className={styles.contaLink} onClick={abrirPortal} disabled={abrindo}>
          {abrindo ? "abrindo ···" : "gerenciar assinatura"}
        </button>
      )}

      <UserButton />
    </div>
  );
}
