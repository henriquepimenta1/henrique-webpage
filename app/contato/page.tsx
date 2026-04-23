"use client";

import { useState } from "react";
import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";
import { SITE_EMAIL, SITE_AUTHOR } from "@/content/home";

const INTENTS = [
  { id: "presets", label: "Presets Lightroom" },
  { id: "expedicao", label: "Expedição" },
  { id: "quadros", label: "Quadros & Prints" },
  { id: "trabalho", label: "Trabalho / Parceria" },
  { id: "outro", label: "Outro" },
];

export default function ContatoPage() {
  const [intent, setIntent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const subject = encodeURIComponent(
    intent ? `[${INTENTS.find((i) => i.id === intent)?.label}] Mensagem de ${name || "visitante"}` : `Mensagem de ${name || "visitante"}`
  );
  const body = encodeURIComponent(
    `Nome: ${name}\nEmail: ${email}\nAssunto: ${INTENTS.find((i) => i.id === intent)?.label || "—"}\n\n${message}`
  );

  return (
    <div style={{ background: "var(--forest)", color: "var(--canvas)", minHeight: "100vh" }}>
      <SiteNav dark={true} />

      <div
        className="grid"
        style={{
          gridTemplateColumns: "1fr 380px",
          maxWidth: 1100,
          margin: "0 auto",
          minHeight: "100vh",
          paddingTop: 72,
          gap: 0,
        }}
      >
        {/* ── FORM AREA ── */}
        <div className="px-12 py-24 flex flex-col justify-center">
          <p
            className="font-mono text-[10px] uppercase tracking-widest mb-6"
            style={{ color: "rgba(232,223,201,.4)" }}
          >
            Contacto
          </p>
          <h1
            className="font-light leading-tight mb-10"
            style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", color: "var(--canvas)" }}
          >
            Vamos{" "}
            <em
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              falar
            </em>
          </h1>

          {/* Intent pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {INTENTS.map((i) => (
              <button
                key={i.id}
                onClick={() => setIntent(i.id === intent ? "" : i.id)}
                className="px-4 py-2 rounded-full text-sm transition-colors"
                style={{
                  background: intent === i.id ? "var(--canvas)" : "rgba(232,223,201,.08)",
                  color: intent === i.id ? "var(--forest)" : "var(--canvas)",
                  border: "1px solid rgba(232,223,201,.15)",
                }}
              >
                {i.label}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <label
                  className="font-mono text-[9px] uppercase tracking-widest block mb-2"
                  style={{ color: "rgba(232,223,201,.4)" }}
                >
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="O seu nome"
                  className="w-full px-4 py-3 rounded-lg text-sm bg-transparent outline-none"
                  style={{
                    border: "1px solid rgba(232,223,201,.18)",
                    color: "var(--canvas)",
                  }}
                />
              </div>
              <div>
                <label
                  className="font-mono text-[9px] uppercase tracking-widest block mb-2"
                  style={{ color: "rgba(232,223,201,.4)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-lg text-sm bg-transparent outline-none"
                  style={{
                    border: "1px solid rgba(232,223,201,.18)",
                    color: "var(--canvas)",
                  }}
                />
              </div>
            </div>
            <div>
              <label
                className="font-mono text-[9px] uppercase tracking-widest block mb-2"
                style={{ color: "rgba(232,223,201,.4)" }}
              >
                Mensagem
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Conta-me o que precisas..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg text-sm bg-transparent outline-none resize-none"
                style={{
                  border: "1px solid rgba(232,223,201,.18)",
                  color: "var(--canvas)",
                }}
              />
            </div>
          </div>

          <a
            href={`mailto:${SITE_EMAIL}?subject=${subject}&body=${body}`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--canvas)", color: "var(--forest)", alignSelf: "flex-start" }}
          >
            Enviar mensagem
          </a>
        </div>

        {/* ── SIDE INFO PANEL ── */}
        <div
          className="flex flex-col justify-center px-10 py-24"
          style={{
            borderLeft: "1px solid rgba(232,223,201,.1)",
          }}
        >
          <div className="flex flex-col gap-10">
            <div>
              <p
                className="font-mono text-[9px] uppercase tracking-widest mb-3"
                style={{ color: "rgba(232,223,201,.4)" }}
              >
                Email direto
              </p>
              <a
                href={`mailto:${SITE_EMAIL}`}
                className="text-sm underline underline-offset-4 hover:opacity-70 transition-opacity"
                style={{ color: "var(--canvas)" }}
              >
                {SITE_EMAIL}
              </a>
            </div>

            <div>
              <p
                className="font-mono text-[9px] uppercase tracking-widest mb-3"
                style={{ color: "rgba(232,223,201,.4)" }}
              >
                Disponibilidade
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(232,223,201,.6)" }}>
                Geralmente respondo em 24–48h. Para expedições, contacte com pelo menos 30 dias de antecedência.
              </p>
            </div>

            <div>
              <p
                className="font-mono text-[9px] uppercase tracking-widest mb-3"
                style={{ color: "rgba(232,223,201,.4)" }}
              >
                Localização
              </p>
              <p className="text-sm" style={{ color: "rgba(232,223,201,.6)" }}>
                Chipre — Disponível Mundialmente
              </p>
            </div>

            <div
              className="py-6 px-6 rounded-xl"
              style={{ background: "rgba(232,223,201,.05)", border: "1px solid rgba(232,223,201,.1)" }}
            >
              <p
                className="text-xs leading-relaxed italic"
                style={{
                  fontFamily: "var(--font-hand)",
                  fontSize: "1.1rem",
                  color: "rgba(232,223,201,.7)",
                }}
              >
                "Andar devagar, ver mais."
              </p>
              <p
                className="font-mono text-[9px] uppercase tracking-widest mt-3"
                style={{ color: "rgba(232,223,201,.3)" }}
              >
                — {SITE_AUTHOR}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter dark={true} />
    </div>
  );
}
