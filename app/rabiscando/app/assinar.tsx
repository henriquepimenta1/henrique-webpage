"use client";

import { useState } from "react";
// De rabiscando-plano, não de lib/stripe: hoje o import é só de tipo e some
// na compilação, mas basta alguém trocar por um import de valor para o SDK do
// Stripe — e a chave secreta — entrarem no bundle do navegador. O arquivo de
// contrato existe justamente para essa fronteira.
import type { Plano } from "@/lib/rabiscando-plano";

// Botões que levam ao checkout do Stripe. Cliente porque precisa de fetch
// e de redirecionar o navegador para a URL hospedada.

export default function BotoesAssinar() {
  const [carregando, setCarregando] = useState<Plano | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function assinar(plano: Plano) {
    setCarregando(plano);
    setErro(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano }),
      });
      const dados = await res.json();
      if (!res.ok || !dados.url) throw new Error(dados.erro ?? "falha");
      // Redireciona para a página do Stripe (não abre em nova aba: manter
      // o checkout na mesma janela evita bloqueio de pop-up no celular).
      window.location.href = dados.url;
    } catch {
      setErro("não foi possível abrir o pagamento. tente de novo.");
      setCarregando(null);
    }
  }

  const botao = (plano: Plano, rotulo: string, destaque: boolean) => (
    <button
      onClick={() => assinar(plano)}
      disabled={carregando !== null}
      style={{
        fontFamily: "var(--font-ui)",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: ".08em",
        textTransform: "uppercase",
        color: destaque ? "var(--bg)" : "var(--accent)",
        background: destaque ? "var(--accent)" : "none",
        border: `1px solid var(--accent)`,
        padding: "14px 24px",
        cursor: carregando ? "default" : "pointer",
        opacity: carregando && carregando !== plano ? 0.5 : 1,
        transition: "opacity .15s",
      }}
    >
      {carregando === plano ? "abrindo pagamento ···" : rotulo}
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-2)", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap", justifyContent: "center" }}>
        {botao("anual", "Anual · R$ 249", true)}
        {botao("mensal", "Mensal · R$ 29", false)}
      </div>
      {erro && (
        <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "#b5533a", margin: 0 }}>{erro}</p>
      )}
    </div>
  );
}
