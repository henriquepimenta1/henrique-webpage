import SiteNav from '@/components/nav'
import SiteFooter from '@/components/site-footer'

interface Photo {
  src: string
  ar: number
  title: string
  place: string
  year: number
}

const PHOTOS: Photo[] = [
  { src: '/images/lencois/DJI_20250828174205_0403_D-HDR.jpg', ar: 1.78, title: 'Silhueta',         place: 'Lençóis MA',  year: 2025 },
  { src: '/images/lencois/DSC02245.jpg',                       ar: 0.75, title: 'Travesseiro',      place: 'Lençóis MA',  year: 2025 },
  { src: '/images/lencois/DJI_20250826043905_0121_D.jpg',      ar: 1.78, title: 'Vista aérea',      place: 'Lençóis MA',  year: 2025 },
  { src: '/images/lencois/DSC01675.jpg',                       ar: 0.75, title: 'Nascer do sol',    place: 'Lençóis MA',  year: 2025 },
  { src: '/images/lencois/DJI_20250829042015_0506_D-HDR.jpg',  ar: 1.78, title: 'Lagoa espetacular',place: 'Lençóis MA',  year: 2025 },
  { src: '/images/exp-huayhuash.jpg',                          ar: 1.5,  title: 'Cordilheira',      place: 'Peru',        year: 2024 },
  { src: '/images/lencois/DJI_20250828042744_0378_D.jpg',      ar: 1.78, title: 'Chegada',          place: 'Lençóis MA',  year: 2025 },
  { src: '/images/lencois/DSC01537.jpg',                       ar: 0.75, title: 'Primeiro oásis',   place: 'Lençóis MA',  year: 2025 },
  { src: '/images/lencois/DJI_20250828175706_0461_D-Edit-2.jpg', ar: 1.78, title: 'Poente dourado', place: 'Lençóis MA',  year: 2025 },
  { src: '/images/lencois/DSC02529.jpg',                       ar: 1.0,  title: 'Lagoa cristalina', place: 'Lençóis MA',  year: 2025 },
  { src: '/images/lencois/DSC01958.jpg',                       ar: 0.75, title: 'Solidão',          place: 'Lençóis MA',  year: 2025 },
  { src: '/images/presets/22-poente.jpg',                      ar: 1.5,  title: 'Poente',           place: 'Brasil',      year: 2025 },
  { src: '/images/lencois/DSC02599.jpg',                       ar: 0.75, title: 'Caminhar devagar', place: 'Lençóis MA',  year: 2025 },
  { src: '/images/presets/14-vista-do-oceano.jpg',             ar: 1.5,  title: 'Vista do oceano',  place: 'Brasil',      year: 2025 },
  { src: '/images/lencois/DSC03215.jpg',                       ar: 0.75, title: 'Câmera na mão',    place: 'Lençóis MA',  year: 2025 },
  { src: '/images/presets/8-abissal.jpg',                      ar: 1.33, title: 'Abissal',          place: 'Brasil',      year: 2025 },
  { src: '/images/presets/11-devaneio.jpg',                    ar: 0.75, title: 'Devaneio',         place: 'Brasil',      year: 2025 },
  { src: '/images/presets/21-campo-seco.jpg',                  ar: 1.33, title: 'Campo seco',       place: 'Brasil',      year: 2025 },
  { src: '/images/mountain-lake.jpg',                          ar: 1.5,  title: 'Lago de montanha', place: 'Brasil',      year: 2024 },
  { src: '/images/hiker.jpg',                                  ar: 0.67, title: 'Trilheiro',        place: 'Brasil',      year: 2024 },
  { src: '/images/presets/2-bosque.jpg',                       ar: 1.33, title: 'Bosque',           place: 'Brasil',      year: 2025 },
  { src: '/images/desert-dunes.jpg',                           ar: 1.5,  title: 'Dunas',            place: 'Lençóis MA',  year: 2025 },
  { src: '/images/presets/6-dourado-reluzente.jpg',            ar: 1.5,  title: 'Dourado',          place: 'Brasil',      year: 2025 },
  { src: '/images/dunes-aerial.jpg',                           ar: 1.78, title: 'Aérea',            place: 'Lençóis MA',  year: 2025 },
]

function buildRows(photos: Photo[], containerW: number, targetH: number, gap: number): Photo[][] {
  const rows: Photo[][] = []
  let current: Photo[] = []
  let currentAR = 0
  const maxAR = containerW / targetH

  for (const p of photos) {
    current.push(p)
    currentAR += p.ar
    if (currentAR >= maxAR * 0.92) {
      rows.push(current)
      current = []
      currentAR = 0
    }
  }
  if (current.length) rows.push(current)
  return rows
}

export const metadata = {
  title: 'Portfolio — henriq.eu',
  description: 'Lugares, luz e momentos que valeram a viagem.',
}

export default function PortfolioPage() {
  const containerW = 1328 // 1440 - 56*2
  const targetH = 400
  const gap = 4
  const rows = buildRows(PHOTOS, containerW, targetH, gap)

  return (
    <main style={{ background: 'var(--canvas)', color: 'var(--bark)', fontFamily: 'var(--font-ui)' }}>
      <style>{`
        .port-cell { cursor: zoom-in; overflow: hidden; flex-shrink: 0; }
        .port-img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 1s cubic-bezier(.2,.7,.2,1); }
        .port-cell:hover .port-img { transform: scale(1.04); }
        .port-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(30,42,24,0) 50%, rgba(30,42,24,.82) 100%); opacity: 0; transition: opacity .4s cubic-bezier(.2,.7,.2,1); display: flex; align-items: flex-end; padding: 20px; }
        .port-cell:hover .port-overlay { opacity: 1; }
        .port-caption { transform: translateY(10px); opacity: 0; transition: transform .5s cubic-bezier(.2,.7,.2,1) .05s, opacity .4s; }
        .port-cell:hover .port-caption { transform: translateY(0); opacity: 1; }
        .port-chip { padding: 7px 14px; border: 1px solid var(--line); color: var(--stone); background: transparent; font-size: 11px; letter-spacing: .12em; cursor: pointer; font-family: var(--font-ui); }
        .port-chip-on { background: var(--bark); color: var(--canvas); border-color: var(--bark); }
        @media(max-width:900px){
          .port-row { flex-wrap: wrap !important; }
          .port-cell { width: calc(50% - 2px) !important; height: 240px !important; }
        }
        @media(max-width:560px){
          .port-cell { width: 100% !important; height: 280px !important; }
        }
      `}</style>

      <SiteNav dark={false} />

      {/* ── HEADER ── */}
      <header style={{ padding: '140px 56px 56px', borderBottom: '1px solid var(--line)', position: 'relative' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 16, fontWeight: 500 }}>
          № 01 · Fotografia
        </div>
        <h1 style={{ margin: 0, lineHeight: 0.9 }}>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 64, color: 'var(--rust)', transform: 'rotate(-3deg)', display: 'inline-block', marginBottom: 4, letterSpacing: '.01em' }}>
            o que eu vi
          </span>
          <br />
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(80px, 14vw, 200px)', letterSpacing: '-.05em', lineHeight: 0.88, display: 'block', color: 'var(--bark)' }}>
            PORT—
          </span>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(80px, 14vw, 200px)', letterSpacing: '-.05em', lineHeight: 0.88, display: 'block', color: 'var(--bark)' }}>
            FOLIO.
          </span>
        </h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: 'var(--stone)', marginTop: 28, maxWidth: '48ch', lineHeight: 1.5 }}>
          Sete anos caminhando com câmera na mão. {PHOTOS.length * 9} frames que sobreviveram à edição lenta — o resto, o vento levou.
        </p>
        <div style={{ position: 'absolute', right: 56, top: 140, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stone)', letterSpacing: '.1em', lineHeight: 1.8 }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 56, color: 'var(--bark)', letterSpacing: '-.03em', lineHeight: 1, display: 'block', marginBottom: 8 }}>
            135
          </span>
          frames publicados<br />
          <span style={{ color: 'var(--rust)' }}>18 lugares · 4 países</span>
        </div>
      </header>

      {/* ── FILTERS ── */}
      <div style={{ padding: '20px 56px', display: 'flex', gap: 8, alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginRight: 8 }}>Filtrar</span>
        {[['Tudo', `${PHOTOS.length}`], ['Deserto', '34'], ['Montanha', '22'], ['Oceano', '18'], ['Floresta', '14'], ['Noturno', '10']].map(([label, n]) => (
          <button key={label} className={`port-chip${label === 'Tudo' ? ' port-chip-on' : ''}`}>
            {label} · {n}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stone)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
          Ordenar · <span style={{ color: 'var(--bark)' }}>Aleatório</span>
        </span>
      </div>

      {/* ── MOSAIC ── */}
      <div style={{ padding: '6px 56px 0' }}>
        {rows.map((row, ri) => {
          const rowAR = row.reduce((s, p) => s + p.ar, 0)
          const availableW = containerW - gap * (row.length - 1)
          const rowH = Math.min(availableW / rowAR, 480)
          return (
            <div key={ri} className="port-row" style={{ display: 'flex', gap, marginBottom: gap }}>
              {row.map((p, pi) => {
                const w = rowH * p.ar
                const num = String(ri * 8 + pi + 1).padStart(3, '0')
                return (
                  <figure
                    key={pi}
                    className="port-cell"
                    style={{ position: 'relative', margin: 0, width: w, height: rowH }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt={p.title} className="port-img" loading={ri === 0 ? 'eager' : 'lazy'} />
                    <div className="port-overlay">
                      <div className="port-caption">
                        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--canvas)', lineHeight: 1.1 }}>{p.title}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(232,223,201,.65)', letterSpacing: '.15em', marginTop: 5 }}>
                          № {num} · {p.place} · {p.year}
                        </div>
                      </div>
                    </div>
                  </figure>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* ── LOAD MORE ── */}
      <div style={{ padding: '56px 56px 80px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 20 }}>
          Mostrando {PHOTOS.length} de {PHOTOS.length * 9}
        </div>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '14px 32px', border: '1px solid var(--bark)',
          fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase',
          color: 'var(--bark)', background: 'transparent', cursor: 'pointer',
        }}>
          Carregar mais
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 22, color: 'var(--rust)' }}>↓</span>
        </button>
      </div>

      <SiteFooter dark={false} />
    </main>
  )
}
