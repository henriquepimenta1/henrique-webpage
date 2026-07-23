import Link from "next/link";
import DarkTopNav from "@/components/dark-nav";
import DarkFooter from "@/components/dark-footer";

// Loja Presets & LUTs — Dark Editorial "Fim de Luz".
// Preços/URLs Cakto confirmados no handoff: 39,00 · 34,90 · 37,90.
interface Collection {
  num: string;
  name: string;
  forWhat: string;
  formats: string;
  count: string;
  href: string;
  buy: string;
  img: string;
  imgPos?: string;
  desc: string;
  now: string;
  from?: string;
  parcel: string;
}

const COLLECTIONS: Collection[] = [
  {
    num: "01",
    name: "Outdoor Cinematic Presets",
    forWhat: "Fotografia · Lightroom",
    formats: ".xmp · .dng",
    count: "45 presets",
    href: "/presets/fotografia",
    buy: "https://pay.cakto.com.br/C4dmPFR",
    img: "/images/portfolio/pico-ciririca-serradoibitiraquire.jpg",
    desc: "O mesmo tratamento do portfólio — duna, lagoa, montanha, selva e golden hour — no seu Lightroom.",
    now: "39,00",
    from: "79,90",
    parcel: "9× R$ 5,19",
  },
  {
    num: "02",
    name: "Outdoor Grain Presets",
    forWhat: "Fotografia · emulação de filme",
    formats: ".xmp · .dng",
    count: "21 presets",
    href: "/presets/outdoor-grain",
    buy: "https://pay.cakto.com.br/458hrkh_938519",
    img: "/images/outdoor-grain-capa.jpg",
    imgPos: "center 38%",
    desc: "Emulações de filme analógico — o grão, o halo e a cor da película, calibrados em campo.",
    now: "34,90",
    parcel: "9× R$ 4,55",
  },
  {
    num: "03",
    name: "Outdoor Cinematic LUTs",
    forWhat: "Vídeo · 5 perfis log",
    formats: ".cube · .3dl",
    count: "21 LUTs",
    href: "/presets/video",
    buy: "https://pay.cakto.com.br/6tNxcGs",
    img: "/images/portfolio/as3lagunas-huayhuash.jpg",
    desc: "21 LUTs em 6 famílias, compatíveis com C-Log, RED, S-Log2/3 e Rec.709. Cor de cinema, feita em campo.",
    now: "37,90",
    from: "99,00",
    parcel: "9× R$ 4,93",
  },
];

const TRUST = [
  "Download imediato",
  "Garantia de 14 dias",
  "Licença pessoal + comercial",
  "Atualizações vitalícias",
];

const PALETTE: ReadonlyArray<[string, string]> = [
  ["/images/portfolio/acapamento-janca-huayhuash.jpg", "Portfolio · Andes"],
  ["/images/portfolio/laguna-acampamento-janca-huayhuash.jpg", "Campo · Huayhuash"],
  ["/images/portfolio/lencois-silhueta-pordosol.jpg", "Lençóis · Pôr do sol"],
  ["/images/portfolio/vista-para-montanhas-itatiaia.jpg", "Itatiaia · Amanhecer"],
];

function priceDiscount(now: string, from: string): number {
  return Math.round((1 - parseFloat(now.replace(",", ".")) / parseFloat(from.replace(",", "."))) * 100);
}

function PriceBlock({ now, from, parcel }: { now: string; from?: string; parcel: string }) {
  return (
    <div className="prd-price">
      <div className="prd-price-row">
        {from && <span className="prd-price-from">R$ {from}</span>}
        <span className="prd-price-now">
          <span className="prd-price-cur">R$</span>
          {now}
        </span>
      </div>
      {parcel && <div className="prd-price-parcel">ou {parcel}</div>}
    </div>
  );
}

export default function PresetsPage() {
  return (
    <div className="theme-fdl">
      <DarkTopNav active="Presets" />

      <header className="prd-head" style={{ position: "relative", overflow: "hidden" }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/portfolio/pico-ciririca-serradoibitiraquire.jpg"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        >
          <source src="/videos/VIDEO-HERO2-web.mp4" type="video/mp4" />
        </video>
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "linear-gradient(180deg,rgba(13,12,11,.70) 0%,rgba(13,12,11,.55) 45%,rgba(13,12,11,.9) 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="v2-eyebrow" style={{ marginBottom: 22 }}>
            № 03 · Cor · tratamento · desde 2022
          </div>
          <h1 className="prd-h1">
            A mesma cor que eu uso,
            <br />
            <em>no seu fluxo de trabalho.</em>
          </h1>
          <p className="prd-sub">
            O tratamento que aplico no meu próprio portfólio, pronto pro seu Lightroom e pro seu Premiere. Três coleções —
            escolha a que cabe no seu fluxo, ou leve tudo.
          </p>
        </div>
      </header>

      <div className="prd-trust">
        {TRUST.map((t) => (
          <span key={t} className="prd-trust-item">
            <span className="prd-trust-dot">✓</span>
            {t}
          </span>
        ))}
      </div>

      <section className="prd-grid">
        {COLLECTIONS.map((c) => (
          <article key={c.num} className="prd-card">
            <Link className="prd-card-media" href={c.href} aria-label={`Ver ${c.name}`}>
              <img
                src={c.img}
                alt={c.name}
                style={c.imgPos ? { objectPosition: c.imgPos } : undefined}
                loading="lazy"
              />
              {c.from && <span className="prd-badge">-{priceDiscount(c.now, c.from)}%</span>}
              <span className="prd-card-num">№ {c.num} / 03</span>
            </Link>
            <div className="prd-card-body">
              <div className="prd-card-meta">
                {c.count} · {c.formats}
              </div>
              <h2 className="prd-card-name">{c.name}</h2>
              <div className="prd-card-for">{c.forWhat}</div>
              <p className="prd-card-desc">{c.desc}</p>
              <div className="prd-card-foot">
                <PriceBlock now={c.now} from={c.from} parcel={c.parcel} />
                <div className="prd-card-actions">
                  <a className="prd-btn" href={c.buy} target="_blank" rel="noreferrer">
                    Comprar <span aria-hidden="true">→</span>
                  </a>
                  <Link className="prd-link-detail" href={c.href}>
                    Ver detalhes
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="prd-palette">
        <div className="v2-eyebrow">A prova</div>
        <h2 className="prd-h2">
          A mesma paleta, <em>em foto e vídeo.</em>
        </h2>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 16,
            lineHeight: 1.6,
            color: "var(--text-2)",
            maxWidth: "52ch",
            margin: "18px 0 0",
          }}
        >
          Construí as coleções a partir do mesmo referencial cinematográfico. Cor de cinema, mas feita em campo — não em
          estúdio.
        </p>
        <div className="prd-pal-grid">
          {PALETTE.map(([img, lbl]) => (
            <div key={lbl} className="prd-pal-item">
              <img src={img} alt={lbl} loading="lazy" />
              <div className="prd-pal-cap">{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      <DarkFooter coords="calibrado em campo · não em estúdio" />
    </div>
  );
}
