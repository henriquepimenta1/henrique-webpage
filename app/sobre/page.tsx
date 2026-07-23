import Link from "next/link";
import DarkTopNav from "@/components/dark-nav";
import DarkFooter from "@/components/dark-footer";

export const metadata = {
  title: "Sobre — henriq.eu",
  description: "Quem está por trás das imagens.",
};

// Sobre — Dark Editorial "Fim de Luz". Portado do protótipo hi-fi (sobre-dark.jsx).
interface PathStep {
  n: string;
  t: string;
  d: string;
}

interface GearItem {
  cat: string;
  name: string;
}

const PATH: PathStep[] = [
  {
    n: "01",
    t: "A área técnica",
    d: "Venho da área técnica — ainda executo esse lado, e ele me dá um jeito preciso de pensar e resolver problemas. Foi ali que aprendi método: planejar, medir, executar.",
  },
  {
    n: "02",
    t: "A montanha",
    d: "A câmera entrou na minha vida junto com a montanha. Escalada me ensinou a ler ambiente, luz e risco de um jeito que nenhum curso ensina. A partir daí fui estudar de verdade: color grading, exposição, direção de fotografia, storytelling.",
  },
  {
    n: "03",
    t: "O campo como ofício",
    d: "Lençóis Maranhenses, Itatiaia, Serra dos Órgãos, Huayhuash, Atacama. Cada expedição virou conteúdo — e o conteúdo abriu portas com marcas como Aiuruocan, O Boticário, K&F Concept e Botas Vento.",
  },
];

const GEAR: GearItem[] = [
  { cat: "Corpo principal", name: "Sony A7 IV" },
  { cat: "Drone cinematográfico", name: "DJI Air 3S" },
  { cat: "Áudio 32-bit float", name: "Comica VM40" },
  { cat: "Pós & color grading", name: "DaVinci Resolve" },
];

const FACTS: ReadonlyArray<[string, string]> = [
  ["7+", "anos fotografando"],
  ["10+", "destinos"],
  ["21,3%", "engajamento s/ alcance"],
  ["PT · EN", "conteúdo bilíngue"],
];

function Kicker({ n, label }: { n: string; label: string }) {
  return (
    <div className="sbd-kicker">
      <span>№ {n}</span>
      <span className="rule" />
      <span>{label}</span>
    </div>
  );
}

export default function SobrePage() {
  return (
    <div className="theme-fdl">
      <style>{`
/* ── hero split ── */
.sbd-hero{display:grid;grid-template-columns:1.15fr 1fr;min-height:calc(100vh - 76px)}
.sbd-hero-left{padding:var(--sect-y) var(--s-5) var(--sect-y);display:flex;flex-direction:column;justify-content:center}
.sbd-h1{font-family:var(--font-serif);font-weight:500;font-size:clamp(46px,6vw,84px);letter-spacing:-.015em;line-height:1.04;color:var(--text-1);margin:0 0 32px;text-wrap:pretty}
.sbd-h1 em{font-style:italic;font-weight:400;color:var(--text-2)}
.sbd-lead{font-family:var(--font-serif);font-style:italic;font-size:clamp(17px,1.6vw,20px);line-height:1.65;color:var(--text-2);max-width:46ch;margin:0 0 var(--s-2)}
.sbd-body{font-family:var(--font-serif);font-size:15px;line-height:1.75;color:var(--text-2);max-width:52ch;margin:0 0 var(--s-2)}
.sbd-photo{position:relative;overflow:hidden;border-left:1px solid var(--border)}
.sbd-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 25%}
.sbd-photo::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,var(--bg) 0%,transparent 22%)}
.sbd-photo-cap{position:absolute;bottom:20px;right:20px;z-index:2;font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:rgba(237,231,219,.6);text-shadow:0 1px 8px rgba(13,12,11,.8)}

/* ── facts strip ── */
.sbd-facts{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.sbd-fact{background:var(--bg);padding:32px 48px}
.sbd-fact-v{font-family:var(--font-serif);font-weight:500;font-size:38px;letter-spacing:-.02em;line-height:1;color:var(--text-1);margin-bottom:8px}
.sbd-fact-k{font-family:var(--font-mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--text-3)}

/* ── seções ── */
.sbd-section{padding:var(--sect-y) var(--s-5)}
.sbd-kicker{display:flex;align-items:center;gap:16px;font-family:var(--font-mono);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--text-3);margin-bottom:var(--s-5)}
.sbd-kicker .rule{flex:1;height:1px;background:var(--border)}

/* caminho (timeline) */
.sbd-path{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(24px,3.5vw,48px)}
.sbd-step{border-top:1px solid var(--border);padding-top:var(--s-2)}
.sbd-step-n{font-family:var(--font-mono);font-size:10px;letter-spacing:.22em;color:var(--text-3);margin-bottom:var(--s-2)}
.sbd-step-t{font-family:var(--font-serif);font-weight:500;font-size:22px;letter-spacing:-.01em;color:var(--text-1);margin-bottom:10px}
.sbd-step-d{font-family:var(--font-serif);font-size:14.5px;line-height:1.7;color:var(--text-2)}

/* equipamento */
.sbd-gear{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border)}
.sbd-gear-item{background:var(--bg);padding:var(--s-3) var(--s-3)}
.sbd-gear-cat{font-family:var(--font-mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--text-3);margin-bottom:10px}
.sbd-gear-name{font-family:var(--font-serif);font-style:italic;font-size:18px;color:var(--text-1)}

/* quote */
.sbd-quote{border-top:1px solid var(--border);text-align:center;padding:var(--sect-xl) var(--s-5)}
.sbd-quote p{font-family:var(--font-serif);font-style:italic;font-weight:300;font-size:clamp(24px,3.2vw,34px);line-height:1.45;letter-spacing:-.01em;color:var(--text-1);max-width:34ch;margin:0 auto}
.sbd-quote .sign{font-family:var(--font-hand);font-size:40px;color:var(--accent);display:inline-block;transform:rotate(-2deg);margin-top:32px}

/* ── responsive ── */
@media(max-width:1000px){
  .sbd-hero{grid-template-columns:1fr;min-height:0}
  .sbd-photo{border-left:none;border-top:1px solid var(--border);aspect-ratio:4/5;position:relative}
  .sbd-photo::after{background:linear-gradient(to bottom,var(--bg) 0%,transparent 25%)}
  .sbd-facts{grid-template-columns:1fr 1fr}
  .sbd-path{grid-template-columns:1fr}
  .sbd-gear{grid-template-columns:1fr 1fr}
}
@media(max-width:640px){
  .sbd-hero-left{padding:var(--s-40) var(--s-3) var(--s-5)}
  .sbd-section{padding:var(--s-56) var(--s-3)}
  .sbd-fact{padding:24px 24px}
  .sbd-fact-v{font-size:30px}
  .sbd-quote{padding:var(--s-72) var(--s-3)}
}
      `}</style>

      <DarkTopNav active="Sobre" />

      {/* HERO */}
      <section className="sbd-hero">
        <div className="sbd-hero-left">
          <div className="v2-eyebrow" style={{ marginBottom: 22 }}>
            № 05 · Sobre · Adventure filmmaker · São Paulo
          </div>
          <h1 className="sbd-h1">
            Henrique <em>Sesana.</em>
          </h1>
          <p className="sbd-lead">
            Fotógrafo, filmmaker e contador de histórias visuais que nascem da terra, do vento e do tempo.
          </p>
          <p className="sbd-body">
            Minha fotografia não busca impacto — busca permanência. As cores dialogam com o ambiente: verdes densos,
            tons de areia, luz natural e texturas reais. Composição espontânea, o detalhe que o olho quase não vê.
          </p>
          <Link className="v2-accent-link" style={{ alignSelf: "flex-start", marginTop: 18 }} href="/contato">
            Falar comigo →
          </Link>
        </div>
        <div className="sbd-photo">
          <img src="/images/portrait.jpg" alt="Henrique Sesana em campo" />
          <div className="sbd-photo-cap">Serra do Ibitiraquire · PR</div>
        </div>
      </section>

      {/* FACTS */}
      <div className="sbd-facts">
        {FACTS.map(([v, k]) => (
          <div key={k} className="sbd-fact">
            <div className="sbd-fact-v">{v}</div>
            <div className="sbd-fact-k">{k}</div>
          </div>
        ))}
      </div>

      {/* CAMINHO */}
      <section className="sbd-section">
        <Kicker n="01" label="O caminho até aqui" />
        <div className="sbd-path">
          {PATH.map((s) => (
            <div key={s.n} className="sbd-step">
              <div className="sbd-step-n">№ {s.n}</div>
              <div className="sbd-step-t">{s.t}</div>
              <div className="sbd-step-d">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EQUIPAMENTO */}
      <section className="sbd-section" style={{ paddingTop: 0 }}>
        <Kicker n="02" label="Equipamento" />
        <div className="sbd-gear">
          {GEAR.map((g) => (
            <div key={g.name} className="sbd-gear-item">
              <div className="sbd-gear-cat">{g.cat}</div>
              <div className="sbd-gear-name">{g.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <section className="sbd-quote">
        <p>&ldquo;Transformando minhas aventuras em experiências sensoriais.&rdquo;</p>
        <span className="sign">— Henrique</span>
      </section>

      <DarkFooter coords="23°33′S 46°38′W · São Paulo" />
    </div>
  );
}
