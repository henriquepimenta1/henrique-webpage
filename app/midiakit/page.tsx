import Link from "next/link";
import DarkTopNav from "@/components/dark-nav";
import DarkFooter from "@/components/dark-footer";

// Midiakit — Dark Editorial "Fim de Luz". Portado do protótipo hi-fi.
// Sparkline e gráficos usam âmbar var(--accent).

interface Metric {
  label: string;
  value: string;
  sub: string;
}

interface TopPost {
  caption: string;
  reach: string;
  likes: string;
  saves: string;
  img: string;
}

interface Brand {
  brand: string;
  type: string;
  product: string;
  img: string;
  likes?: string;
  comments?: string;
  reach?: string;
  saves?: string;
}

interface Service {
  name: string;
  desc: string;
}

interface Gear {
  name: string;
  cat: string;
}

interface MidiakitData {
  reachDaily: number[];
  metrics: Metric[];
  topPosts: TopPost[];
  brands: Brand[];
  services: Service[];
  gear: Gear[];
  destinations: string[];
}

const D: MidiakitData = {
  reachDaily: [
    3388, 6427, 10998, 7975, 4968, 6082, 4002, 5017, 9720, 7987, 9850, 10753, 8220, 5236, 4402, 5109,
    9564, 8913, 6002, 5986, 4904, 4778, 5176, 7391, 8550, 5867, 6354, 3750, 4368, 2300,
  ],
  metrics: [
    { label: "Seguidores", value: "15.458", sub: "@henriq.eu · Criador de Conteúdo Digital" },
    { label: "Alcance mensal", value: "194k", sub: "194.030 · últimos 30 dias" },
    { label: "Interações/mês", value: "55,8k", sub: "likes · saves · comentários" },
    { label: "Engagement rate", value: "28,8%", sub: "muito acima da média do nicho" },
    { label: "Alcance médio/dia", value: "~6.468", sub: "contas alcançadas/dia" },
    { label: "Posts publicados", value: "458", sub: "total no perfil" },
  ],
  topPosts: [
    { caption: "Escalando Cabeça de Peixe — Serra dos Órgãos", reach: "11.352", likes: "1.540", saves: "112", img: "escalada-cabeca-depeixe" },
    { caption: "Atravessando os Lençóis Maranhenses — Ep. 1", reach: "6.857", likes: "481", saves: "25", img: "grupo-caminhando-lencois" },
    { caption: "Cabeça de Peixe — plano B virou a melhor aventura", reach: "5.911", likes: "447", saves: "20", img: "queimada-dos-britos-lencois" },
    { caption: "Memories of Peru — Cordilheira de Huayhuash", reach: "4.684", likes: "412", saves: "28", img: "laguna-acampamento-janca-huayhuash" },
  ],
  brands: [
    { brand: "O Boticário", type: "Beauty & Lifestyle", product: "Arbo Puro · Desodorante Colônia", img: "/images/work/OBOTICARIO/OBOTICARIO-001.jpg", likes: "2.277", comments: "107" },
    { brand: "Aiuruocan", type: "Vestuário Outdoor", product: "White Melton + Colors Blue", img: "/images/work/AIUR/MOLETON_MELTON/MOLETON-MELTON-001.jpg", likes: "276", reach: "3.757" },
    { brand: "OMA Gear", type: "Gear & Equipamento", product: "Kit Cozinha Ultra Leve · 149g", img: "/images/work/OMA-GEAR/OMA-GEAR-001.jpg", likes: "217", comments: "20" },
    { brand: "K&F Concept", type: "Equipamento Fotográfico", product: "Tripé Omni Series + FH03", img: "/images/work/KNF-CONCEPT/KNF-CONCEPT-001.jpg", likes: "285", comments: "16" },
    { brand: "Brightin Star", type: "Óptica", product: "Lente 16mm f/2.8", img: "/images/work/BRIGHTIN-STAR/BRIGHTIN-STAR-001.jpg", reach: "4.053", saves: "31" },
    { brand: "Botas Vento", type: "Calçados Outdoor", product: "Titan + Finisterre", img: "/images/work/BOTAS-VENTO/BOTA-TITAN/BOTA-TITAN-001.jpg", likes: "599", comments: "18" },
    { brand: "Alto Estilo", type: "Moda & Equipamento", product: "Mochila Ataque 40+5L", img: "/images/work/ALTO-ESTILO/ALTO-ESTILO-001.jpg", likes: "260", reach: "3.423" },
    { brand: "Gorro Vans", type: "Vestuário Outdoor", product: "Beanie · Pico Mateo 5.150m", img: "/images/work/GORRO-VANS/GORRO-VANS-001.jpg", likes: "197", reach: "5.341" },
  ],
  services: [
    { name: "Reels de Expedição", desc: "Vídeos cinematográficos 15–60s com narrativa emocional" },
    { name: "Drone Cinematography", desc: "Captação aérea profissional com DJI Air 3S" },
    { name: "Carrosséis de Destino", desc: "Séries fotográficas editoriais para Instagram" },
    { name: "Licenciamento de Conteúdo", desc: "Uso em campanhas, sites e materiais da marca" },
    { name: "Conteúdo Bilíngue PT/EN", desc: "Criação e adaptação para mercado internacional" },
    { name: "Guia + Produção", desc: "Logística completa + audiovisual integrado" },
  ],
  gear: [
    { name: "Sony A7 IV", cat: "Câmera principal" },
    { name: "DJI Air 3S", cat: "Drone cinematográfico" },
    { name: "Comica VM40", cat: "Áudio 32-bit float" },
    { name: "DaVinci Resolve", cat: "Pós-produção" },
    { name: "Lightroom", cat: "Presets próprios" },
  ],
  destinations: [
    "Lençóis Maranhenses · MA", "Serra da Mantiqueira · SP/MG", "PN Itatiaia · RJ", "PN Serra dos Órgãos · RJ",
    "Serra do Ibitiraquire · PR", "Serra da Bocaina · SP/RJ", "Cordilheira Blanca · Peru", "Cordilheira Huayhuash · Peru",
    "Atacama · Chile",
  ],
};

function Kicker({ n, label }: { n: string; label: string }) {
  return (
    <div className="mkd-kicker">
      <span>№ {n}</span>
      <span className="rule" />
      <span>{label}</span>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const W = 600;
  const H = 80;
  const x = (i: number) => (i / (data.length - 1)) * W;
  const y = (v: number) => H - ((v - min) / (max - min)) * (H - 8) - 4;
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${path} L${W},${H} L0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 80, display: "block" }}>
      <defs>
        <linearGradient id="mkd-spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#mkd-spark)" />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="2" fill="var(--accent)" opacity={0.55} />
      ))}
    </svg>
  );
}

export default function MidiakitPage() {
  return (
    <div className="theme-fdl">
      <style>{`
/* ── hero ── */
.mkd-hero{position:relative;min-height:82vh;display:flex;align-items:flex-end;overflow:hidden;margin-top:-76px}
.mkd-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 35%}
.mkd-hero-grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,12,11,.72) 0%,rgba(13,12,11,.08) 42%,rgba(13,12,11,.94) 100%)}
.mkd-hero-body{position:relative;z-index:2;padding:var(--hero-clear) var(--s-5) var(--s-56);width:100%}
.mkd-h1{font-family:var(--font-serif);font-weight:500;font-size:clamp(48px,7.5vw,104px);letter-spacing:-.015em;line-height:1.02;color:var(--text-1);margin:0;text-wrap:pretty}
.mkd-h1 em{font-style:italic;font-weight:400;color:var(--text-2)}
.mkd-hero-meta{margin-top:var(--s-3);display:flex;gap:var(--s-3);flex-wrap:wrap;font-family:var(--font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-2)}

/* ── seções ── */
.mkd-section{padding:var(--sect-y) var(--s-5);border-top:1px solid var(--border)}
.mkd-kicker{display:flex;align-items:center;gap:16px;font-family:var(--font-mono);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--text-3);margin-bottom:48px}
.mkd-kicker .rule{flex:1;height:1px;background:var(--border)}
.mkd-h2{font-family:var(--font-serif);font-weight:500;font-size:clamp(30px,4vw,46px);letter-spacing:-.01em;line-height:1.1;color:var(--text-1);margin:0 0 48px}
.mkd-h2 em{font-style:italic;font-weight:400;color:var(--text-2)}

/* sobre */
.mkd-bio{display:grid;grid-template-columns:1.3fr 1fr;gap:var(--s-72)}
.mkd-bio-lead{font-family:var(--font-serif);font-style:italic;font-weight:400;font-size:clamp(20px,2.2vw,25px);line-height:1.55;letter-spacing:-.01em;color:var(--text-1);margin:0 0 var(--s-3)}
.mkd-bio p.body{font-family:var(--font-serif);font-size:15px;line-height:1.75;color:var(--text-2);margin:0 0 var(--s-2)}
.mkd-sign{font-family:var(--font-hand);font-size:38px;color:var(--accent);display:inline-block;transform:rotate(-2deg)}
.mkd-portraits{display:flex;flex-direction:column;gap:24px}
.mkd-portraits img{width:100%;aspect-ratio:4/5;object-fit:cover;object-position:center 22%;border:1px solid var(--border)}
.mkd-portrait-2{margin-left:15%;margin-top:-40px}

/* métricas */
.mkd-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border);margin-bottom:64px}
.mkd-metric{background:var(--bg);padding:var(--s-4) var(--s-3)}
.mkd-metric-k{font-family:var(--font-mono);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--text-3);margin-bottom:var(--s-2)}
.mkd-metric-v{font-family:var(--font-serif);font-weight:500;font-size:46px;letter-spacing:-.02em;color:var(--text-1);line-height:1;margin-bottom:10px}
.mkd-metric-s{font-family:var(--font-serif);font-style:italic;font-size:13px;color:var(--text-3)}
.mkd-spark-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:var(--s-2);gap:16px;flex-wrap:wrap}

/* reels */
.mkd-posts{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.mkd-post{aspect-ratio:9/16;border:1px solid var(--border);position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:var(--s-2);background:var(--surface)}
.mkd-post-bg{position:absolute;inset:0;background-size:cover;background-position:center 62%}
.mkd-post-grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,12,11,.15) 0%,rgba(13,12,11,.9) 100%)}
.mkd-post-body{position:relative;z-index:2;display:flex;flex-direction:column;gap:var(--s-1)}
.mkd-post-cap{font-family:var(--font-serif);font-size:14px;line-height:1.45;color:var(--text-1);margin:0}
.mkd-post-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;padding-top:var(--s-1);border-top:1px solid var(--border-strong)}

/* marcas */
.mkd-brands{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--border);border:1px solid var(--border)}
.mkd-brand{background:var(--bg);position:relative;aspect-ratio:4/5;overflow:hidden}
.mkd-brand img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 30%;filter:brightness(.68);transition:transform .9s cubic-bezier(.2,.7,.2,1),filter .3s}
.mkd-brand:hover img{transform:scale(1.045);filter:brightness(.85)}
.mkd-brand-grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,12,11,.1) 30%,rgba(13,12,11,.88) 100%);pointer-events:none}
.mkd-brand-body{position:absolute;inset:0;padding:var(--s-2);display:flex;flex-direction:column;justify-content:space-between;pointer-events:none}
.mkd-brand-type{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-2);border:1px solid var(--border-strong);padding:4px 8px;align-self:flex-start}
.mkd-brand-name{font-family:var(--font-serif);font-weight:500;font-size:23px;letter-spacing:-.01em;color:var(--text-1);margin-bottom:4px}
.mkd-brand-prod{font-family:var(--font-serif);font-style:italic;font-size:13px;color:var(--text-2);margin-bottom:var(--s-2);line-height:1.35}
.mkd-brand-stats{display:flex;gap:var(--s-2);font-family:var(--font-mono);font-size:10px;letter-spacing:.15em;color:var(--text-3)}

/* serviços */
.mkd-services{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border)}
.mkd-service{background:var(--bg);padding:var(--s-4) var(--s-3)}
.mkd-service-n{font-family:var(--font-ui);font-weight:600;font-size:16px;color:var(--text-1);margin-bottom:10px;letter-spacing:-.01em}
.mkd-service-d{font-family:var(--font-serif);font-style:italic;font-size:14px;color:var(--text-2);line-height:1.55}

/* gear + destinos */
.mkd-split{display:grid;grid-template-columns:1fr 1fr;gap:var(--s-72)}
.mkd-gear{display:grid;grid-template-columns:1fr 1fr;gap:var(--s-2)}
.mkd-gear-item{border:1px solid var(--border);padding:var(--s-2) var(--s-2)}
.mkd-dest-item{padding:var(--s-2) 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.mkd-dest-item:last-child{border-bottom:none}

/* cta */
.mkd-cta{position:relative;overflow:hidden;border-top:1px solid var(--border)}
.mkd-cta img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.16}
.mkd-cta-grad{position:absolute;inset:0;background:linear-gradient(180deg,var(--bg) 0%,rgba(13,12,11,.72) 100%)}
.mkd-cta-body{position:relative;z-index:2;padding:var(--sect-xl) var(--s-5);max-width:880px}
.mkd-cta-h{font-family:var(--font-serif);font-weight:500;font-size:clamp(44px,7vw,92px);letter-spacing:-.015em;line-height:1.03;margin:0 0 var(--s-3);color:var(--text-1)}
.mkd-cta-h em{font-style:italic;font-weight:400;color:var(--text-2)}
.mkd-cta-p{font-family:var(--font-serif);font-style:italic;font-size:18px;line-height:1.6;color:var(--text-2);max-width:48ch;margin:0 0 var(--s-40)}
.mkd-btn{display:inline-block;padding:var(--s-2) var(--s-4);background:var(--accent);color:var(--bg);font-family:var(--font-ui);font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;transition:background .2s}
.mkd-btn:hover{background:var(--accent-hover)}
.mkd-btn-ghost{display:inline-block;padding:var(--s-2) var(--s-4);border:1px solid var(--border-strong);color:var(--text-1);font-family:var(--font-ui);font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;text-decoration:none}

/* ── responsive ── */
@media(max-width:1100px){
  .mkd-bio{grid-template-columns:1fr;gap:48px}
  .mkd-metrics{grid-template-columns:1fr 1fr}
  .mkd-posts,.mkd-brands{grid-template-columns:1fr 1fr}
  .mkd-services{grid-template-columns:1fr 1fr}
  .mkd-split{grid-template-columns:1fr;gap:var(--s-56)}
  .mkd-portraits{flex-direction:row;gap:16px}
  .mkd-portraits img{flex:1;min-width:0}
  .mkd-portrait-2{margin-left:0;margin-top:48px}
}
@media(max-width:640px){
  .mkd-hero{min-height:88vh}
  .mkd-hero-body{padding:var(--hero-clear) var(--s-3) var(--s-40)}
  .mkd-hero-meta{gap:10px var(--s-2);font-size:10px}
  .mkd-section{padding:var(--s-56) var(--s-3)}
  .mkd-kicker{margin-bottom:32px}
  .mkd-h2{margin-bottom:32px}
  .mkd-metrics,.mkd-services{grid-template-columns:1fr}
  .mkd-posts,.mkd-brands{grid-template-columns:1fr 1fr;gap:10px}
  .mkd-posts{gap:10px}
  .mkd-post{padding:var(--s-1)}
  .mkd-post-cap{font-size:11.5px;line-height:1.35}
  .mkd-post-stats{grid-template-columns:1fr 1fr;gap:4px}
  .mkd-post-stats > div:nth-child(3){display:none}
  .mkd-brand-name{font-size:17px}
  .mkd-brand-prod{font-size:11px;margin-bottom:10px}
  .mkd-brand-body{padding:var(--s-2)}
  .mkd-brand-stats{gap:10px;font-size:10px;letter-spacing:.14em;flex-wrap:wrap}
  .mkd-gear{grid-template-columns:1fr 1fr;gap:10px}
  .mkd-gear-item{padding:var(--s-2) var(--s-2)}
  .mkd-portraits{flex-direction:row;gap:10px}
  .mkd-portrait-2{margin-top:var(--s-3)}
  .mkd-metric-v{font-size:38px}
  .mkd-metric{padding:var(--s-3) var(--s-3)}
  .mkd-dest-item span:first-child{font-size:16px}
  .mkd-cta-body{padding:var(--s-72) var(--s-3)}
}
      `}</style>

      <DarkTopNav active="Midiakit" />

      {/* HERO */}
      <section className="mkd-hero">
        <img src="/images/exp-huayhuash.jpg" alt="Cordilheira Huayhuash" />
        <div className="mkd-hero-grad" />
        <div className="mkd-hero-body">
          <div className="v2-eyebrow" style={{ marginBottom: 22, color: "var(--text-2)", textShadow: "0 1px 12px rgba(13,12,11,.8)" }}>
            Media Kit · 2026 · @henriq.eu
          </div>
          <h1 className="mkd-h1">
            Henrique Sesana,
            <br />
            <em>adventure filmmaker.</em>
          </h1>
          <div className="mkd-hero-meta">
            <span>Trekking · Montanhismo · Cinematografia</span>
            <span style={{ opacity: 0.65 }}>São Paulo, BR</span>
            <span style={{ opacity: 0.65 }}>PT · EN</span>
          </div>
        </div>
      </section>

      {/* № 01 SOBRE */}
      <section className="mkd-section">
        <Kicker n="01" label="Sobre" />
        <div className="mkd-bio">
          <div>
            <p className="mkd-bio-lead">
              Fotógrafo, filmmaker e contador de histórias visuais que nascem da terra, do vento e do tempo. Estética
              contemplativa, minimalista, profundamente conectada à natureza.
            </p>
            <p className="body">
              As cores que escolho dialogam com o ambiente: verdes densos, tons de areia, luz natural e texturas reais.
              Composição espontânea, detalhe que o olho quase não vê, instante que carrega presença sutil. Minha
              fotografia não busca impacto — busca permanência.
            </p>
            <p className="body">
              Já produzi campanhas para marcas de vestuário, turismo e cosméticos, sempre propondo um caminho mais
              poético e imersivo — onde o produto entra na paisagem, e não o contrário.
            </p>
            <p className="body" style={{ marginBottom: 36 }}>
              Em agosto de 2026, volto aos Lençóis Maranhenses para guiar três grupos com fotografia integrada —
              travessia com produção própria de ponta a ponta.
            </p>
            <span className="mkd-sign">— Henrique</span>
          </div>
          <div className="mkd-portraits">
            <img src="/images/portrait.jpg" alt="Henrique em campo" />
          </div>
        </div>
      </section>

      {/* № 02 MÉTRICAS */}
      <section className="mkd-section">
        <Kicker n="02" label="Métricas · Instagram" />
        <div className="mkd-metrics">
          {D.metrics.map((m) => (
            <div key={m.label} className="mkd-metric">
              <div className="mkd-metric-k">{m.label}</div>
              <div className="mkd-metric-v">{m.value}</div>
              <div className="mkd-metric-s">{m.sub}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="mkd-spark-head">
            <span className="v2-eyebrow">Alcance diário · últimos 30 dias</span>
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 14, color: "var(--accent)" }}>
              média de ~6.468/dia
            </span>
          </div>
          <Sparkline data={D.reachDaily} />
        </div>
      </section>

      {/* № 03 REELS */}
      <section className="mkd-section">
        <Kicker n="03" label="Reels em destaque" />
        <div className="mkd-posts">
          {D.topPosts.map((p, i) => (
            <div key={i} className="mkd-post">
              <div className="mkd-post-bg" style={{ backgroundImage: `url(/images/portfolio/${p.img}.jpg)` }} />
              <div className="mkd-post-grad" />
              <div className="mkd-post-body">
                <div className="v2-eyebrow" style={{ fontSize: 9 }}>
                  Reel · #{i + 1}
                </div>
                <p className="mkd-post-cap">{p.caption}</p>
                <div className="mkd-post-stats">
                  {([["Alcance", p.reach], ["Likes", p.likes], ["Saves", p.saves]] as const).map(([k, v]) => (
                    <div key={k}>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 8,
                          letterSpacing: ".15em",
                          textTransform: "uppercase",
                          color: "var(--text-3)",
                          marginBottom: 2,
                        }}
                      >
                        {k}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-1)" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* № 04 MARCAS */}
      <section className="mkd-section">
        <Kicker n="04" label="Marcas · Parcerias" />
        <h2 className="mkd-h2">
          Marcas que <em>caminharam junto.</em>
        </h2>
        <div className="mkd-brands">
          {D.brands.map((b, i) => (
            <article key={i} className="mkd-brand">
              <img src={b.img} alt={b.brand} loading="lazy" />
              <div className="mkd-brand-grad" />
              <div className="mkd-brand-body">
                <span className="mkd-brand-type">{b.type}</span>
                <div>
                  <div className="mkd-brand-name">{b.brand}</div>
                  <div className="mkd-brand-prod">{b.product}</div>
                  <div className="mkd-brand-stats">
                    {b.likes && <span>♥ {b.likes}</span>}
                    {b.reach && <span>◎ {b.reach}</span>}
                    {b.comments && <span>✎ {b.comments}</span>}
                    {b.saves && <span>⌘ {b.saves}</span>}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* № 05 SERVIÇOS */}
      <section className="mkd-section">
        <Kicker n="05" label="Serviços" />
        <div className="mkd-services">
          {D.services.map((s) => (
            <div key={s.name} className="mkd-service">
              <div className="mkd-service-n">{s.name}</div>
              <div className="mkd-service-d">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* № 06/07 GEAR + DESTINOS */}
      <section className="mkd-section">
        <div className="mkd-split">
          <div>
            <Kicker n="06" label="Equipamento" />
            <div className="mkd-gear">
              {D.gear.map((g) => (
                <div key={g.name} className="mkd-gear-item">
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: ".2em",
                      textTransform: "uppercase",
                      color: "var(--text-3)",
                      marginBottom: 8,
                    }}
                  >
                    {g.cat}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>{g.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Kicker n="07" label="Destinos · 2024–2026" />
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {D.destinations.map((d, i) => (
                <li key={d} className="mkd-dest-item">
                  <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, color: "var(--text-1)" }}>
                    {d}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", color: "var(--text-3)" }}>
                    № {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mkd-cta">
        <img src="/images/lencois/DJI_20250828174205_0403_D-HDR.jpg" alt="" />
        <div className="mkd-cta-grad" />
        <div className="mkd-cta-body">
          <div className="v2-eyebrow" style={{ marginBottom: 22 }}>
            Vamos conversar
          </div>
          <h2 className="mkd-cta-h">
            Sua marca,
            <br />
            <em>na paisagem.</em>
          </h2>
          <p className="mkd-cta-p">
            Briefings personalizados, prazos honestos, conteúdo que dura mais que um ciclo de algoritmo.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link className="mkd-btn" href="/contato">
              Briefing & contato →
            </Link>
            <a className="mkd-btn-ghost" href="mailto:management@henriq.eu">
              management@henriq.eu
            </a>
          </div>
        </div>
      </section>

      <DarkFooter coords="10°17′S 76°54′W · alt 4 800 m" />
    </div>
  );
}
