"use client";

import Link from "next/link";
import DarkTopNav from "@/components/dark-nav";
import DarkFooter from "@/components/dark-footer";
import ScribbleCanvas from "./scribble-canvas";
import LandingHero from "./landing-hero";
import "./botoes.css";

// Landing pública do Rabiscando. O editor vive em /rabiscando/app, atrás de
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

// Três passos porque é uma sequência de verdade — a pessoa faz nesta ordem,
// e o terceiro é o que ela quer provar que existe (o arquivo na timeline).
const PASSOS: { n: string; titulo: string; texto: string }[] = [
  {
    n: "01",
    titulo: "Digita a cartela",
    texto:
      "“dia 3 · sem sinal”, o nome do pico, a data. Quebra de linha vira linha de verdade, centralizada.",
  },
  {
    n: "02",
    titulo: "Ajusta o traço",
    texto:
      "Fonte, espessura, tremor, velocidade, espaçamento, cor. Tudo ao vivo — o que você vê na tela é o que sai no arquivo.",
  },
  {
    n: "03",
    titulo: "Exporta e arrasta",
    texto:
      "PNG transparente numerado ou MP4. Cai direto na timeline do DaVinci, Premiere ou Final Cut.",
  },
];

const DUVIDAS: { p: string; r: string }[] = [
  {
    p: "Abre no meu editor?",
    r: "Sim. A sequência PNG entra como camada em qualquer editor sério — DaVinci Resolve, Premiere, Final Cut, After Effects. O MP4 entra em qualquer lugar, inclusive direto no Instagram.",
  },
  {
    p: "O traço fica com fundo?",
    r: "No PNG, não: é alfa de verdade, transparente. O MP4 tem fundo preto porque H.264 não suporta transparência — mas com o modo de composição Screen (ou Add) o preto some e sobra só o traço.",
  },
  {
    p: "Posso usar em trabalho de cliente?",
    r: "Pode. O que você exporta é seu, uso comercial incluído. As doze fontes são licenciadas para uso comercial (SIL OFL ou Apache 2.0) e os textos de licença acompanham os arquivos.",
  },
  {
    p: "Meu texto vai pra algum servidor?",
    r: "Não. O desenho e o arquivo final são gerados dentro do seu navegador, na sua máquina. Nem o texto que você escreve nem o arquivo exportado passam por servidor meu.",
  },
  {
    p: "E se eu cancelar?",
    r: "Você cancela sozinho, num botão dentro da ferramenta, e continua com acesso até o fim do período já pago. Nada de e-mail pedindo para ficar. O que você já exportou continua seu para sempre.",
  },
  {
    p: "Preciso instalar alguma coisa?",
    r: "Nada. Abre no navegador e funciona. Para exportar MP4 é preciso um navegador atual — Chrome, Edge ou Safari recentes; se o seu não suportar, a ferramenta avisa e o PNG continua disponível.",
  },
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

export default function RabiscandoLandingPage() {
  return (
    <div className="theme-fdl">
      <DarkTopNav active="Rabiscando" />

      <style>{`
.rbl-cta-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:var(--s-3);margin:0 0 var(--s-2)}
.rbl-risco{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-3);text-align:center;margin:0 0 var(--s-5)}
@media(max-width:640px){
  .rbl-cta-row{flex-direction:column;gap:var(--s-2)}
  .rbl-cta-row > *{width:100%}
}

.rbl-passos{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr));gap:var(--s-40)}
.rbl-passo-n{font-family:var(--font-mono);font-size:10px;letter-spacing:.2em;color:var(--accent);display:block;margin-bottom:12px}
.rbl-passo-t{font-family:var(--font-serif);font-weight:500;font-size:21px;color:var(--text-1);margin:0 0 10px;line-height:1.25}
.rbl-passo-d{font-family:var(--font-ui);font-size:14px;line-height:1.65;color:var(--text-2);margin:0;max-width:34ch}

.rbl-faq{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:var(--s-40) var(--s-5)}
.rbl-faq-p{font-family:var(--font-ui);font-weight:600;font-size:16px;color:var(--text-1);margin:0 0 8px}
.rbl-faq-r{font-family:var(--font-ui);font-size:14px;line-height:1.7;color:var(--text-2);margin:0;max-width:46ch}

.rbl-sect{padding:var(--sect-y) var(--pad-page);border-top:1px solid var(--border);max-width:1280px;margin:0 auto}
.rbl-sect-h{font-family:var(--font-serif);font-style:italic;font-weight:400;font-size:clamp(22px,2.8vw,34px);color:var(--text-1);margin:var(--s-2) 0 var(--s-5);text-wrap:balance;max-width:24ch}
      `}</style>

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

          {/* CTA antes da demonstração: quem já entendeu pelo título não
              deveria precisar rolar a página inteira para achar o preço. */}
          <div className="rbl-cta-row">
            <Link className="rb-btn rb-btn--primary rb-btn--lg" href="#assinar">
              Assinar · a partir de R$ 29
            </Link>
            <Link className="rb-btn rb-btn--tertiary" href="/rabiscando/app">
              Já assino, entrar
            </Link>
          </div>
          {/* Reversão de risco: numa assinatura, a objeção mais cara não é o
              preço — é o medo de não conseguir sair depois. */}
          <p className="rbl-risco">cancele sozinho, num botão dentro da ferramenta</p>

          <LandingHero />
        </section>

        {/* ── como funciona: a sequência real, três passos ── */}
        <section className="rbl-sect">
          <p className="v2-eyebrow">Como funciona</p>
          <h2 className="rbl-sect-h">Do texto ao arquivo na timeline, em três passos.</h2>

          <div className="rbl-passos">
            {PASSOS.map((p) => (
              <div key={p.n}>
                <span className="rbl-passo-n">{p.n}</span>
                <h3 className="rbl-passo-t">{p.titulo}</h3>
                <p className="rbl-passo-d">{p.texto}</p>
              </div>
            ))}
          </div>
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
              gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
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
              gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
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
              gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
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
              <Link className="rb-btn rb-btn--secondary rb-btn--block" href="/rabiscando/app">
                Assinar mensal
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
                Anual · economize R$ 99
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
              <Link className="rb-btn rb-btn--secondary rb-btn--block" href="/rabiscando/app">
                Assinar anual
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
            Cancele quando quiser, num botão dentro da ferramenta — e siga com acesso até o
            fim do período pago. Pagamento no cartão, processado pelo Stripe.
            {" "}
            <Link className="v2-accent-link" href="/rabiscando/app" style={{ fontSize: 12 }}>
              Já assino, quero entrar
            </Link>
          </p>
        </section>

        {/* ── dúvidas: as objeções reais de quem edita vídeo ── */}
        <section className="rbl-sect">
          <p className="v2-eyebrow">Antes de assinar</p>
          <h2 className="rbl-sect-h">O que costumam perguntar.</h2>

          <div className="rbl-faq">
            {DUVIDAS.map((d) => (
              <div key={d.p}>
                <h3 className="rbl-faq-p">{d.p}</h3>
                <p className="rbl-faq-r">{d.r}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <DarkFooter coords="rabiscando · traço animado" />
    </div>
  );
}
