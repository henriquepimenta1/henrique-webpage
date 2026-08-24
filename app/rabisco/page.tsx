"use client";

import Link from "next/link";
import DarkTopNav from "@/components/dark-nav";
import DarkFooter from "@/components/dark-footer";
import ScribbleCanvas from "./scribble-canvas";
import LandingHero from "./landing-hero";

// Landing pública do Rabisco. O editor vive em /rabisco/app, atrás de
// login + assinatura — aqui não há uso gratuito, só demonstração.
// O herói roda a ferramenta de verdade (mesmo componente do editor), não
// um vídeo gravado: é a demonstração mais honesta que dá para fazer.

const PRECO_MENSAL = "29";
const PRECO_ANUAL = "249";

// Só fontes que o herói já baixa — a galeria não custa download nenhum.
const AMOSTRAS: {
  texto: string;
  fonte: string;
  fontId: string;
  thickness: "fina" | "regular" | "grossa";
  tremor: number;
}[] = [
  { texto: "Itatiaia", fonte: "Permanent Marker", fontId: "permanent-marker", thickness: "regular", tremor: 30 },
  { texto: "−8 °C", fonte: "Gloria Hallelujah", fontId: "gloria-hallelujah", thickness: "grossa", tremor: 40 },
  { texto: "km 42", fonte: "Handlee", fontId: "handlee", thickness: "grossa", tremor: 34 },
  { texto: "via láctea", fonte: "Architects Daughter", fontId: "architects-daughter", thickness: "regular", tremor: 28 },
  { texto: "bivaque", fonte: "Shadows Into Light", fontId: "shadows-into-light", thickness: "grossa", tremor: 36 },
  { texto: "fim de luz", fonte: "Permanent Marker", fontId: "permanent-marker", thickness: "fina", tremor: 24 },
];

const RECURSOS: { titulo: string; texto: string }[] = [
  {
    titulo: "Tremor de verdade",
    texto:
      "Cada letra é redesenhada várias vezes por segundo. Não é um filtro balançando a mesma forma — o traço muda, como em animação feita à mão.",
  },
  {
    titulo: "PNG com transparência",
    texto:
      "Sequência numerada pronta para entrar como camada no DaVinci ou Premiere. Sem fundo, sem recorte, sem marca d’água.",
  },
  {
    titulo: "MP4 quando é pra postar",
    texto:
      "Arquivo único em H.264 com fundo preto — no modo de composição Screen o preto some e sobra só o traço.",
  },
  {
    titulo: "12 traços diferentes",
    texto:
      "De marcador gordo a caneta fina. Espessura, tremor, velocidade, espaçamento e entrelinha, todos no controle.",
  },
  {
    titulo: "Até 4K",
    texto: "720p, 1080p e 3840×2160. Mesma nitidez do resto da sua timeline.",
  },
  {
    titulo: "Roda no navegador",
    texto:
      "Nada para instalar, nada para renderizar em fila. O arquivo sai da sua própria máquina.",
  },
];

export default function RabiscoLandingPage() {
  return (
    <div className="theme-fdl">
      <DarkTopNav />

      <main style={{ paddingTop: "var(--hero-clear)" }}>
        {/* ── herói: a ferramenta se apresenta escrevendo ── */}
        <section
          style={{
            padding: "0 var(--pad-page)",
            maxWidth: 1280,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p className="v2-eyebrow">Ferramenta · assinatura</p>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(34px, 5.2vw, 62px)",
              lineHeight: 1.08,
              letterSpacing: "-.02em",
              margin: "var(--s-3) auto var(--s-2)",
              maxWidth: "16ch",
              textWrap: "balance",
            }}
          >
            Texto manuscrito <em style={{ color: "var(--text-2)" }}>que treme</em>, pronto
            pra timeline.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "clamp(14px, 1.5vw, 17px)",
              color: "var(--text-2)",
              maxWidth: "52ch",
              margin: "0 auto var(--s-5)",
              lineHeight: 1.6,
            }}
          >
            Você digita, ajusta o traço e exporta uma sequência PNG transparente ou um MP4.
            Sem After Effects, sem plugin, sem esperar render.
          </p>

          <LandingHero />
        </section>

        {/* ── o que faz ── */}
        <section
          style={{
            padding: "var(--sect-y) var(--pad-page)",
            borderTop: "1px solid var(--border)",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "var(--s-5) var(--s-40)",
            }}
          >
            {RECURSOS.map((r) => (
              <div key={r.titulo}>
                <h2
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 600,
                    fontSize: 17,
                    letterSpacing: "-.01em",
                    margin: "0 0 var(--s-1)",
                    color: "var(--text-1)",
                  }}
                >
                  {r.titulo}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: "var(--text-2)",
                    margin: 0,
                  }}
                >
                  {r.texto}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── galeria: mesmas fontes já carregadas pelo herói, zero download extra ── */}
        <section
          style={{
            padding: "var(--sect-y) var(--pad-page)",
            borderTop: "1px solid var(--border)",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <p className="v2-eyebrow" style={{ textAlign: "center" }}>
            Alguns traços
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(22px, 2.8vw, 34px)",
              textAlign: "center",
              margin: "var(--s-2) auto var(--s-5)",
              maxWidth: "24ch",
              color: "var(--text-1)",
              textWrap: "balance",
            }}
          >
            Doze fontes manuscritas, todas com o mesmo tremor por baixo.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 1,
              background: "var(--border)",
              border: "1px solid var(--border)",
            }}
          >
            {AMOSTRAS.map((a) => (
              <figure key={a.texto} style={{ margin: 0, background: "var(--bg)" }}>
                <div
                  style={{
                    height: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px 16px",
                    overflow: "hidden",
                  }}
                >
                  <ScribbleCanvas
                    fontId={a.fontId}
                    text={a.texto}
                    tremor={a.tremor}
                    boilFps={8}
                    thickness={a.thickness}
                    color="#C08246"
                    lineHeight={1.05}
                  />
                </div>
                <figcaption
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "var(--text-3)",
                    padding: "0 16px 14px",
                    textAlign: "center",
                  }}
                >
                  {a.fonte}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── preço ── */}
        <section
          id="assinar"
          style={{
            padding: "var(--sect-xl) var(--pad-page)",
            borderTop: "1px solid var(--border)",
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p className="v2-eyebrow">Assinatura</p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(26px, 3.4vw, 40px)",
              margin: "var(--s-2) 0 var(--s-5)",
              color: "var(--text-1)",
            }}
          >
            Acesso completo, sem versão capada.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 1,
              background: "var(--border)",
              border: "1px solid var(--border)",
              textAlign: "left",
            }}
          >
            <div style={{ background: "var(--bg)", padding: "var(--s-4)" }}>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "var(--text-3)",
                  margin: "0 0 var(--s-2)",
                }}
              >
                Mensal
              </p>
              <p style={{ margin: "0 0 var(--s-3)", display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-2)" }}>R$</span>
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 600,
                    fontSize: 42,
                    letterSpacing: "-.03em",
                    color: "var(--text-1)",
                    lineHeight: 1,
                  }}
                >
                  {PRECO_MENSAL}
                </span>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-3)" }}>/mês</span>
              </p>
              <Link className="v2-accent-link" href="/rabisco/app">
                Assinar mensal →
              </Link>
            </div>

            <div style={{ background: "var(--surface)", padding: "var(--s-4)" }}>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  margin: "0 0 var(--s-2)",
                }}
              >
                Anual · 2 meses grátis
              </p>
              <p style={{ margin: "0 0 var(--s-3)", display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-2)" }}>R$</span>
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 600,
                    fontSize: 42,
                    letterSpacing: "-.03em",
                    color: "var(--text-1)",
                    lineHeight: 1,
                  }}
                >
                  {PRECO_ANUAL}
                </span>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-3)" }}>/ano</span>
              </p>
              <Link className="v2-accent-link" href="/rabisco/app">
                Assinar anual →
              </Link>
            </div>
          </div>

          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "var(--text-3)",
              marginTop: "var(--s-3)",
              lineHeight: 1.6,
            }}
          >
            Cancele quando quiser, direto no seu painel. Pagamento no cartão via Stripe.
          </p>
        </section>
      </main>

      <DarkFooter coords="rabisco · traço animado" />
    </div>
  );
}
