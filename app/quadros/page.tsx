import Link from "next/link";
import DarkTopNav from "@/components/dark-nav";
import DarkFooter from "@/components/dark-footer";

// Quadros — Fim de Luz, variante clara (galeria).
// Regra de negócio: sob encomenda — sem preços.
type TierKey = "signature" | "collectors" | "open";

interface Work {
  id: string;
  img: string;
  title: string;
  loc: string;
  tier: TierKey;
}

interface TierMeta {
  num: string;
  label: string;
  limit: string;
  note: string;
}

const QD_WORKS: Work[] = [
  { id: "camadas-beleza", img: "/images/quadros/2%20CAMADAS%20DE%20BELEZA-LENCOIS.jpg", title: "2 Camadas de Beleza", loc: "Lençóis Maranhenses, MA", tier: "signature" },
  { id: "a-curva", img: "/images/quadros/A%20CURVA-LENCOIS.jpg", title: "A Curva", loc: "Lençóis Maranhenses, MA", tier: "signature" },
  { id: "reflexo-carhuacocha", img: "/images/quadros/REFLEXO_CARHUACOCHA-HUAYHUASH.jpg", title: "Reflexo Carhuacocha", loc: "Huayhuash, Peru", tier: "signature" },
  { id: "las-3-lagunas", img: "/images/quadros/LAS%203%20LAGUNAS-HUAYHUASH.jpg", title: "Las 3 Lagunas", loc: "Huayhuash, Peru", tier: "signature" },
  { id: "sol-toca-tudo", img: "/images/quadros/O%20SOL%20TOCA%20TUDO_LENCOIS.jpg", title: "O Sol Toca Tudo", loc: "Lençóis Maranhenses, MA", tier: "signature" },
  { id: "conexao-rios", img: "/images/quadros/CONEXAO_ENTRE_RIOS-PAKAAS-MAMORE-RONDONIA.jpg", title: "Conexão Entre Rios", loc: "Pakaas, Rio Mamoré — Rondônia", tier: "signature" },
  { id: "caminhos-agua", img: "/images/quadros/CAMINHOS%20DA%20AGUA_VISTA-ZENITAL-LENCOIS.jpg", title: "Caminhos da Água", loc: "Lençóis Maranhenses, MA", tier: "collectors" },
  { id: "el-passo", img: "/images/quadros/EL_PASSO_SANTA_ROSA-HUAYHUASH.jpg", title: "El Passo Santa Rosa", loc: "Huayhuash, Peru", tier: "collectors" },
  { id: "la-montana", img: "/images/quadros/LA-MOTANA-VISTA-PICOMATEO.jpg", title: "La Montaña — Vista Pico Mateo", loc: "Huayhuash, Peru", tier: "collectors" },
  { id: "betania-paradisiaca", img: "/images/quadros/BETANIA%20PARADISIACA-LENCOIS.jpg", title: "Betânia Paradisíaca", loc: "Lençóis Maranhenses, MA", tier: "collectors" },
  { id: "primeiros-minutos", img: "/images/quadros/OS%20PRIMEIROS%20MINUTOS%20DO%20SOL-LENCOIS.jpg", title: "Os Primeiros Minutos do Sol", loc: "Lençóis Maranhenses, MA", tier: "collectors" },
  { id: "camp-jahuacocha", img: "/images/quadros/CAMP-JAHUACOCHA-HUAYHUASH.jpg", title: "Camp Jahuacocha", loc: "Huayhuash, Peru", tier: "collectors" },
  { id: "observando-infinito", img: "/images/quadros/OBSERVANDO%20O%20INFINITO-LENCOIS.jpg", title: "Observando o Infinito", loc: "Lençóis Maranhenses, MA", tier: "collectors" },
  { id: "camadas-natureza", img: "/images/quadros/CAMADAS_DA_NATUREZA-PAKAAS-MAMORE-RONDONIA.jpg", title: "Camadas da Natureza", loc: "Pakaas, Rio Mamoré — Rondônia", tier: "collectors" },
  { id: "encontro-rios", img: "/images/quadros/ENCONTR_DOS_RIOS-PAKAAS-MAMORE-RONDONIA.jpg", title: "Encontro dos Rios", loc: "Pakaas, Rio Mamoré — Rondônia", tier: "collectors" },
  { id: "a-casa", img: "/images/quadros/A%20CASA-LENCOIS.jpg", title: "A Casa", loc: "Lençóis Maranhenses, MA", tier: "open" },
  { id: "a-despedida", img: "/images/quadros/A%20DESPEDIDA-LENCOIS.jpg", title: "A Despedida", loc: "Lençóis Maranhenses, MA", tier: "open" },
  { id: "marcas-passado", img: "/images/quadros/MARCAS%20DO%20PASSADO-LENCOIS.jpg", title: "Marcas do Passado", loc: "Lençóis Maranhenses, MA", tier: "open" },
  { id: "betania-fala", img: "/images/quadros/BETANIA%20FALA-LENCOIS.jpg", title: "Betânia Fala", loc: "Lençóis Maranhenses, MA", tier: "open" },
  { id: "observadora-arara", img: "/images/quadros/A-OBSERVADORA-ARARA-CANINDE-RONDONIA.jpg", title: "A Observadora — Arara-Canindé", loc: "Rondônia", tier: "open" },
  { id: "gashpapampa", img: "/images/quadros/ACAMPAMENTO_GASHPAPAMPA-HUAYHUASH.jpg", title: "Acampamento Gashpapampa", loc: "Huayhuash, Peru", tier: "open" },
  { id: "encontro-rios-2", img: "/images/quadros/ENCONTR_DOS_RIOS-PAKAAS-MAMORE-RONDONIA2.jpg", title: "Encontro dos Rios II", loc: "Pakaas, Rio Mamoré — Rondônia", tier: "open" },
];

const QD_TIERS: Record<TierKey, TierMeta> = {
  signature: { num: "I", label: "Signature Collection", limit: "Edição limitada de 10 exemplares", note: "As obras centrais do acervo. Impressão fine art em grande formato, assinada à mão e acompanhada de certificado de autenticidade." },
  collectors: { num: "II", label: "Collectors Edition", limit: "Edição limitada de 25 exemplares", note: "Tiragem limitada, assinada e numerada. Para quem coleciona paisagem em estado bruto." },
  open: { num: "III", label: "Open Edition", limit: "Tiragem aberta", note: "Obras em tiragem aberta, com o mesmo cuidado de impressão e acabamento das edições limitadas." },
};

const TIER_ORDER: TierKey[] = ["signature", "collectors", "open"];

function QdWork({ p, tier }: { p: Work; tier: TierMeta }) {
  return (
    <figure className="qd-work">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.img} alt={p.title} loading="lazy" />
      <figcaption className="qd-plaque">
        <h3 className="qd-title">{p.title}</h3>
        <div className="qd-meta">{p.loc}</div>
        <div className="qd-meta qd-meta-dim">{tier.limit}</div>
        <Link className="qd-consult" href="/contato">
          Sob encomenda — consultar
        </Link>
      </figcaption>
    </figure>
  );
}

export default function QuadrosPage() {
  const rooms = TIER_ORDER.map((t) => ({
    tier: t,
    meta: QD_TIERS[t],
    works: QD_WORKS.filter((q) => q.tier === t),
  }));

  return (
    <div className="theme-fdl theme-light">
      <style>{`
/* ── entrada ── */
.qd-hero{padding:var(--sect-xl) var(--pad-page) var(--sect-y);display:flex;flex-direction:column;align-items:center;text-align:center}
.qd-kicker{font-family:var(--font-mono);font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--text-3);margin-bottom:var(--s-3)}
.qd-h1{margin:0;font-family:var(--font-serif);font-weight:500;font-size:clamp(52px,8vw,104px);letter-spacing:-.02em;line-height:1;color:var(--text-1)}
.qd-rule{width:56px;height:1px;background:var(--text-1);opacity:.4;margin:var(--s-4) 0}
.qd-lede{font-family:var(--font-serif);font-style:italic;font-weight:400;font-size:19px;color:var(--text-2);max-width:46ch;line-height:1.7;margin:0}

/* ── salas ── */
.qd-room{padding:0 var(--pad-page) var(--sect-xl)}
.qd-room-head{max-width:640px;margin:0 auto var(--s-72);text-align:center;border-top:1px solid var(--border);padding-top:var(--s-5)}
.qd-h2{margin:0;font-family:var(--font-serif);font-weight:500;font-size:clamp(28px,3.4vw,40px);letter-spacing:-.01em;color:var(--text-1)}
.qd-room-limit{margin-top:12px}
.qd-room-note{font-family:var(--font-serif);font-style:italic;font-weight:400;font-size:16px;line-height:1.7;color:var(--text-2);opacity:.85;margin:18px 0 0}

/* ── obras ── */
.qd-solo{display:flex;flex-direction:column;gap:var(--sect-xl);max-width:680px;margin:0 auto}
.qd-grid{display:grid;column-gap:var(--s-5);row-gap:var(--s-7);max-width:1160px;margin:0 auto}
.qd-grid-2{grid-template-columns:1fr 1fr}
.qd-grid-3{grid-template-columns:repeat(3,1fr)}
.qd-work{margin:0}
.qd-work img{display:block;width:100%;height:auto;box-shadow:var(--shadow-gallery);outline:1px solid var(--border);outline-offset:-1px}
.qd-plaque{margin-top:20px;display:flex;flex-direction:column;gap:6px;align-items:center;text-align:center}
.qd-title{font-family:var(--font-serif);font-style:italic;font-weight:400;font-size:21px;margin:0;color:var(--text-1)}
.qd-meta{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-3)}
.qd-meta-dim{opacity:.8}
.qd-consult{margin-top:var(--s-1);font-family:var(--font-mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);text-decoration:none;border-bottom:1px solid var(--border);padding-bottom:3px;transition:color .2s,border-color .2s}
.qd-consult:hover{color:var(--accent-hover);border-color:var(--accent-hover)}

/* ── saída ── */
.qd-exit{border-top:1px solid var(--border);padding:var(--sect-xl) var(--pad-page);display:flex;flex-direction:column;align-items:center;text-align:center}
.qd-exit-quote{font-family:var(--font-serif);font-style:italic;font-weight:400;font-size:clamp(22px,2.6vw,30px);line-height:1.6;color:var(--text-1);max-width:38ch;margin:0}
.qd-exit-cta{margin-top:var(--s-4);display:inline-block;padding:var(--s-2) var(--s-40);border:1px solid var(--text-1);color:var(--text-1);font-family:var(--font-mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;text-decoration:none;transition:background .2s,color .2s}
.qd-exit-cta:hover{background:var(--text-1);color:var(--bg)}

/* ── responsive ── */
@media(max-width:1060px){.qd-grid-3{grid-template-columns:1fr 1fr}}
@media(max-width:640px){
  .qd-grid-2,.qd-grid-3{grid-template-columns:1fr}
  .qd-room,.qd-hero,.qd-exit{padding-left:var(--pad-page);padding-right:var(--pad-page)}
}
      `}</style>

      <DarkTopNav active="Quadros" />

      <header className="qd-hero" data-screen-label="Quadros — Entrada">
        <div className="qd-kicker">№ 04 · Galeria · Fine Art Prints</div>
        <h1 className="qd-h1">Quadros</h1>
        <div className="qd-rule" />
        <p className="qd-lede">
          Vinte e duas obras em três coleções. Cada impressão é produzida sob encomenda, assinada à mão e acompanhada de
          certificado de autenticidade.
        </p>
      </header>

      {rooms.map((room) => (
        <section key={room.tier} className="qd-room" data-screen-label={`Sala ${room.meta.num} — ${room.meta.label}`}>
          <div className="qd-room-head">
            <div className="qd-kicker">Sala {room.meta.num}</div>
            <h2 className="qd-h2">{room.meta.label}</h2>
            <div className="qd-meta qd-room-limit">
              {room.meta.limit} · {room.works.length} obras
            </div>
            <p className="qd-room-note">{room.meta.note}</p>
          </div>
          <div
            className={
              room.tier === "signature"
                ? "qd-solo"
                : room.tier === "open"
                  ? "qd-grid qd-grid-3"
                  : "qd-grid qd-grid-2"
            }
          >
            {room.works.map((p) => (
              <QdWork key={p.id} p={p} tier={room.meta} />
            ))}
          </div>
        </section>
      ))}

      <section className="qd-exit" data-screen-label="Quadros — Consulta">
        <p className="qd-exit-quote">
          Todas as obras são produzidas sob encomenda. Formatos, acabamentos e condições, sob consulta.
        </p>
        <Link className="qd-exit-cta" href="/contato">
          Entrar em contato
        </Link>
      </section>

      <DarkFooter coords="2°29'S 43°07'W — Lençóis Maranhenses" />
    </div>
  );
}
