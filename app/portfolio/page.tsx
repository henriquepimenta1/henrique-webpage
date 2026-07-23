import Link from "next/link";
import DarkTopNav from "@/components/dark-nav";
import DarkFooter from "@/components/dark-footer";

// Portfolio — Dark Editorial "Fim de Luz". Capítulos por lugar,
// grid irregular de 12 colunas. Portado do protótipo hi-fi (portfolio-dark.jsx).
interface Photo {
  src: string;
  cap: string;
  note: string;
  span: number;
  ar: string;
  drop?: boolean;
}

interface Chapter {
  id: string;
  num: string;
  name: string;
  meta: string;
  years: string;
  intro: string;
  flip?: boolean;
  photos: Photo[];
}

const CHAPTERS: Chapter[] = [
  {
    id: "lencois",
    num: "01",
    name: "Lençóis Maranhenses",
    meta: "Brasil · MA · 2°34′S 43°07′W",
    years: "2025",
    intro: "Deserto com lagoas. Sem neblina, com Via Láctea.",
    photos: [
      { src: "/images/portfolio/lencois-aerial-drone.jpg", cap: "Lençóis · aérea", note: "vista de drone", span: 8, ar: "3/2" },
      { src: "/images/portfolio/o-escolhido-lencois-maranhenses.jpg", cap: "O Escolhido", note: "15h", span: 4, ar: "3/4" },
      { src: "/images/portfolio/via-lactea-lencois-baixa-grande.jpg", cap: "Via Láctea · Baixa Grande", note: "astro", span: 4, ar: "3/4" },
      { src: "/images/portfolio/lencois-caminhando-na-duna.jpg", cap: "Caminhando na duna", note: "travessia", span: 5, ar: "4/3", drop: true },
      { src: "/images/portfolio/lencois-silhueta-pordosol.jpg", cap: "Silhueta ao pôr do sol", note: "18h04", span: 3, ar: "3/4" },
      { src: "/images/portfolio/grupo-caminhando-travesisa-lencois.jpg", cap: "Travessia em grupo", note: "dia 2 de 4", span: 7, ar: "3/2" },
      { src: "/images/portfolio/lagoa-lencois-drone.jpg", cap: "Lagoa · vista aérea", note: "zenital", span: 5, ar: "3/4", drop: true },
    ],
  },
  {
    id: "andes",
    num: "02",
    name: "Andes Peruanos",
    meta: "Peru · Huayhuash & Blanca · 4 000—5 050 m",
    years: "2025",
    intro: "A trilha mais dura, a luz mais limpa.",
    flip: true,
    photos: [
      { src: "/images/portfolio/as3lagunas-huayhuash.jpg", cap: "As três lagunas", note: "10°12′S 76°48′W", span: 5, ar: "4/3", drop: true },
      { src: "/images/portfolio/vista-do-picomateo.jpg", cap: "Vista do Pico Mateo", note: "alt 5 050 m", span: 7, ar: "3/2" },
      { src: "/images/portfolio/acapamento-janca-huayhuash.jpg", cap: "Acampamento Janca", note: "dia 7 de 11", span: 8, ar: "3/2" },
      { src: "/images/portfolio/laguna-acampamento-janca-huayhuash.jpg", cap: "Laguna Janca", note: "6h12", span: 4, ar: "3/4", drop: true },
      { src: "/images/portfolio/cordilheira-blanca-caminho-ate-laguna69-peru2.jpg", cap: "Altitude", note: "Laguna 69", span: 4, ar: "3/4" },
      { src: "/images/portfolio/pordosol-cordilheira-blanca-peru.jpg", cap: "Pôr do sol · Cordilheira", note: "Blanca", span: 8, ar: "3/2" },
    ],
  },
  {
    id: "serras",
    num: "03",
    name: "Serras do Sudeste",
    meta: "Brasil · SP · RJ · PR",
    years: "2023 — 2024",
    intro: "Mantiqueira, Itatiaia, Ibitiraquire. A neblina como matéria-prima.",
    photos: [
      { src: "/images/portfolio/nascer-do-sol-mantiqueira-marinsxitaguaré.jpg", cap: "Nascer do sol", note: "Marins × Itaguaré", span: 8, ar: "3/2" },
      { src: "/images/portfolio/pico-parana-visto-do-topo-serradoibitiraquire.jpg", cap: "Pico Paraná", note: "visto do topo", span: 4, ar: "3/4" },
      { src: "/images/portfolio/vista-para-montanhas-itatiaia.jpg", cap: "Vista para as montanhas", note: "Itatiaia", span: 4, ar: "3/4", drop: true },
      { src: "/images/portfolio/pico-ciririca-serradoibitiraquire.jpg", cap: "Pico Ciririca", note: "Ibitiraquire", span: 8, ar: "3/2" },
      { src: "/images/portfolio/serra-da-mantiqueira-pico-dos-marins.jpg", cap: "Serra da Mantiqueira", note: "Pico dos Marins", span: 6, ar: "4/3" },
      { src: "/images/portfolio/asas-de-hermes-itatiaia.jpg", cap: "Asas de Hermes", note: "Itatiaia", span: 6, ar: "4/3" },
      { src: "/images/portfolio/caverna-do-diabo-petar-eldorado-SP.jpg", cap: "Caverna do Diabo", note: "PETAR · Eldorado SP", span: 12, ar: "21/9" },
    ],
  },
  {
    id: "amazonia",
    num: "04",
    name: "Rondônia",
    meta: "Brasil · Rondônia · Rio Mamoré",
    years: "2023",
    intro: "Rios que se encontram sem se misturar.",
    flip: true,
    photos: [
      { src: "/images/portfolio/ronondia-riopakaas-riomamore.jpg", cap: "Rio Pakaás · Mamoré", note: "encontro", span: 7, ar: "3/2" },
      { src: "/images/portfolio/arara-canindé-rondonia.jpg", cap: "Arara-canindé", note: "10°52′S 65°20′W", span: 5, ar: "3/4", drop: true },
      { src: "/images/portfolio/cachoeira-ratunde-rondonia.jpg", cap: "Cachoeira Ratunde", note: "selva", span: 4, ar: "3/4" },
      { src: "/images/portfolio/hotel-pakaas-ronodonia-riomamore-riopakaas.jpg", cap: "Rio Pakaás", note: "aérea", span: 8, ar: "3/2" },
    ],
  },
];

function PortfolioHeader() {
  const total = CHAPTERS.reduce((s, c) => s + c.photos.length, 0);
  return (
    <section className="pf-head">
      <div className="v2-eyebrow">Portfolio · 2018 — 2026 · {total} fotografias</div>
      <h1 className="pf-h1">
        Lugares por onde passei,
        <br />
        <em>memórias que registrei.</em>
      </h1>
      <p className="pf-intro">
        Não é o acervo — é a seleção que sobreviveu à edição lenta. Organizado por lugar, porque é assim que eu me lembro
        delas.
      </p>
      <nav className="pf-index">
        {CHAPTERS.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="pf-index-item">
            <span className="pf-index-num">№ {c.num}</span>
            <span className="pf-index-name">{c.name}</span>
            <span className="pf-index-count">{c.photos.length}</span>
          </a>
        ))}
      </nav>
    </section>
  );
}

function ChapterSection({ ch }: { ch: Chapter }) {
  return (
    <section className="pf-chapter" id={ch.id}>
      <div className={`pf-ch-head${ch.flip ? " flip" : ""}`}>
        <div>
          <div className="v2-eyebrow">
            № {ch.num} · {ch.years}
          </div>
          <h2 className="pf-ch-name">{ch.name}</h2>
          <p className="pf-ch-intro">{ch.intro}</p>
        </div>
        <div className="pf-ch-meta">{ch.meta}</div>
      </div>
      <div className="pf-grid">
        {ch.photos.map((p) => (
          <figure key={p.src} className={`pf-cell c${p.span}${p.drop ? " drop" : ""}`}>
            <div className="pf-imgwrap" style={{ aspectRatio: p.ar }}>
              <img src={p.src} alt={p.cap} loading="lazy" />
            </div>
            <figcaption>
              <span>{p.cap}</span>
              <span>{p.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function PortfolioEnd() {
  return (
    <section className="pf-end">
      <p className="pf-end-note">O trabalho completo vive no campo — e uma parte dele, em prints.</p>
      <Link className="v2-accent-link" href="/quadros">
        Ver quadros disponíveis →
      </Link>
    </section>
  );
}

export default function PortfolioPage() {
  return (
    <div className="theme-fdl">
      <style>{`
/* ── header da página ── */
.pf-head{padding:var(--s-7) var(--s-5) var(--s-72)}
.pf-h1{font-family:var(--font-serif);font-weight:500;font-size:clamp(44px,6.4vw,92px);letter-spacing:-.02em;line-height:1.02;margin:var(--s-2) 0 0;color:var(--text-1);text-wrap:pretty}
.pf-h1 em{font-style:italic;font-weight:400;color:var(--text-2)}
.pf-intro{font-family:var(--font-serif);font-style:italic;font-size:clamp(15px,1.6vw,18px);line-height:1.6;color:var(--text-2);margin:var(--s-3) 0 0;max-width:46ch}
.pf-index{margin-top:var(--s-56);border-top:1px solid var(--border);display:flex;flex-direction:column}
.pf-index-item{display:grid;grid-template-columns:80px 1fr auto;align-items:baseline;gap:var(--s-2);padding:var(--s-2) 0;border-bottom:1px solid var(--border);text-decoration:none;transition:padding-left .3s cubic-bezier(.2,.7,.2,1)}
.pf-index-item:hover{padding-left:var(--s-2)}
.pf-index-num{font-family:var(--font-mono);font-size:10px;letter-spacing:.2em;color:var(--text-3)}
.pf-index-name{font-family:var(--font-ui);font-weight:600;font-size:clamp(20px,2.2vw,28px);letter-spacing:-.02em;color:var(--text-1)}
.pf-index-item:hover .pf-index-name{color:var(--accent)}
.pf-index-count{font-family:var(--font-mono);font-size:10px;letter-spacing:.15em;color:var(--text-3)}

/* ── capítulos ── */
.pf-chapter{padding:var(--sect-y) var(--s-5) var(--s-6);border-top:1px solid var(--border)}
.pf-ch-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:var(--s-5)}
.pf-ch-head.flip{flex-direction:row-reverse}
.pf-ch-name{font-family:var(--font-serif);font-weight:500;font-size:clamp(34px,4.4vw,58px);letter-spacing:-.015em;line-height:1;margin:var(--s-1) 0 0;color:var(--text-1)}
.pf-ch-intro{font-family:var(--font-serif);font-style:italic;font-size:15.5px;line-height:1.55;color:var(--text-2);margin:var(--s-1) 0 0;max-width:42ch}
.pf-ch-meta{font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-3);padding-bottom:6px}

/* grid irregular 12 colunas */
.pf-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:16px;align-items:start}
.pf-cell{margin:0;grid-column:span 12}
.c3{grid-column:span 3}.c4{grid-column:span 4}.c5{grid-column:span 5}
.c6{grid-column:span 6}.c7{grid-column:span 7}.c8{grid-column:span 8}
.c12{grid-column:span 12}
.pf-cell.drop{margin-top:var(--s-40)}
.pf-imgwrap{overflow:hidden;background:var(--surface)}
.pf-imgwrap img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.1s cubic-bezier(.2,.7,.2,1)}
.pf-cell:hover .pf-imgwrap img{transform:scale(1.035)}
.pf-cell figcaption{display:flex;justify-content:space-between;gap:10px;margin-top:9px;font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-3)}

/* ── encerramento ── */
.pf-end{padding:var(--s-7) var(--s-5) var(--s-7);border-top:1px solid var(--border);text-align:left}
.pf-end-note{font-family:var(--font-serif);font-style:italic;font-size:clamp(19px,2.4vw,26px);color:var(--text-2);margin:0 0 24px;max-width:38ch;line-height:1.45}

/* ── responsive ── */
@media(max-width:960px){
  .pf-grid{gap:var(--s-1)}
  .c3,.c4,.c5{grid-column:span 6}
  .c6,.c7,.c8{grid-column:span 12}
  .pf-cell.drop{margin-top:0}
}
@media(max-width:640px){
  .pf-head{padding:var(--s-56) var(--s-3) var(--s-5)}
  .pf-index-item{grid-template-columns:52px 1fr auto;gap:var(--s-1);padding:var(--s-2) 0}
  .pf-chapter{padding:var(--s-56) var(--s-3) var(--s-40)}
  .pf-grid{gap:10px}
  .c3,.c4,.c5{grid-column:span 12}
  .pf-end{padding:var(--s-6) var(--s-3) var(--s-72)}
}
      `}</style>

      <DarkTopNav
        active="Portfolio"
        topStyle={{ background: "var(--bg)", position: "sticky", borderBottom: "1px solid var(--border)" }}
      />
      <PortfolioHeader />
      {CHAPTERS.map((ch) => (
        <ChapterSection key={ch.id} ch={ch} />
      ))}
      <PortfolioEnd />
      <DarkFooter coords="10°17′S 76°54′W · alt 4 800 m" />
    </div>
  );
}
