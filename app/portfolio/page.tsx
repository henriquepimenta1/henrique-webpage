import SiteNav from '@/components/nav'
import SiteFooter from '@/components/site-footer'

interface Photo {
  src: string
  ar: number
  title: string
  place: string
  coord?: string
  year: number
}

const PHOTOS: Photo[] = [
  { src: '/images/portfolio/lencois-aerial-drone.jpg',                          ar: 1.33, title: 'Lençóis · aérea',            place: 'Lençóis Maranhenses, MA',       coord: '2°34\'S 43°07\'W', year: 2025 },
  { src: '/images/portfolio/lencois-silhueta-pordosol.jpg',                     ar: 1.50, title: 'Silhueta ao pôr do sol',      place: 'Lençóis Maranhenses, MA',       coord: '2°34\'S 43°07\'W', year: 2025 },
  { src: '/images/portfolio/cordilheira-blanca-caminho-ate-laguna69-peru.jpg',  ar: 0.80, title: 'Cordilheira Blanca',          place: 'Laguna 69, Peru',               coord: '9°01\'S 77°37\'W', year: 2025 },
  { src: '/images/portfolio/ocaminhante-lencois.jpg',                           ar: 0.75, title: 'O Caminhante',                place: 'Lençóis Maranhenses, MA',                                  year: 2025 },
  { src: '/images/portfolio/nascer-do-sol-mantiqueira-marinsxitaguaré.jpg',     ar: 1.60, title: 'Nascer do sol',               place: 'Mantiqueira · Marins, SP',      coord: '22°36\'S 45°01\'W', year: 2024 },
  { src: '/images/portfolio/pessoas-caminhando-travessia-lencois.jpg',          ar: 1.50, title: 'A travessia',                 place: 'Lençóis Maranhenses, MA',                                  year: 2025 },
  { src: '/images/portfolio/acapamento-janca-huayhuash.jpg',                    ar: 1.34, title: 'Acampamento Janca',           place: 'Huayhuash, Peru',               coord: '10°12\'S 76°48\'W', year: 2025 },
  { src: '/images/portfolio/lencois-caminhando-na-duna.jpg',                    ar: 1.50, title: 'Caminhando na duna',          place: 'Lençóis Maranhenses, MA',                                  year: 2025 },
  { src: '/images/portfolio/pico-parana-visto-do-topo-serradoibitiraquire.jpg', ar: 1.33, title: 'Pico Paraná visto do topo',   place: 'Serra do Ibitiraquire, PR',     coord: '25°14\'S 48°49\'W', year: 2024 },
  { src: '/images/portfolio/via-lactea-lencois-baixa-grande.jpg',               ar: 0.80, title: 'Via Láctea · Baixa Grande',  place: 'Lençóis Maranhenses, MA',       coord: '2°34\'S 43°07\'W', year: 2025 },
  { src: '/images/portfolio/grupo-caminhando-lencois.jpg',                      ar: 1.50, title: 'Grupo em marcha',             place: 'Lençóis Maranhenses, MA',                                  year: 2025 },
  { src: '/images/portfolio/acapamento-janca-huayhuash2.jpg',                   ar: 1.50, title: 'Janca ao entardecer',         place: 'Huayhuash, Peru',               coord: '10°12\'S 76°48\'W', year: 2025 },
  { src: '/images/portfolio/lencois-silhueta-pordosol-drone.jpg',               ar: 1.33, title: 'Silhueta · drone',            place: 'Lençóis Maranhenses, MA',       coord: '2°34\'S 43°07\'W', year: 2025 },
  { src: '/images/portfolio/serra-da-mantiqueira-pico-dos-marins.jpg',          ar: 1.34, title: 'Serra da Mantiqueira',        place: 'Pico dos Marins, SP',           coord: '22°36\'S 45°01\'W', year: 2024 },
  { src: '/images/portfolio/o-escolhido-lencois-maranhenses.jpg',               ar: 0.75, title: 'O Escolhido',                 place: 'Lençóis Maranhenses, MA',                                  year: 2025 },
  { src: '/images/portfolio/as3lagunas-huayhuash.jpg',                          ar: 1.34, title: 'As três lagunas',             place: 'Huayhuash, Peru',               coord: '10°12\'S 76°48\'W', year: 2025 },
  { src: '/images/portfolio/queimada-dos-britos-lencois.jpg',                   ar: 1.50, title: 'Queimada dos Britos',         place: 'Lençóis Maranhenses, MA',       coord: '2°34\'S 43°07\'W', year: 2025 },
  { src: '/images/portfolio/pordosol-cordilheira-blanca-peru.jpg',              ar: 1.33, title: 'Pôr do sol · Cordilheira',   place: 'Cordilheira Blanca, Peru',      coord: '9°01\'S 77°37\'W', year: 2025 },
  { src: '/images/portfolio/lagoa-lencois-drone.jpg',                           ar: 0.75, title: 'Lagoa · vista aérea',         place: 'Lençóis Maranhenses, MA',       coord: '2°34\'S 43°07\'W', year: 2025 },
  { src: '/images/portfolio/escalada-cabeca-depeixe.jpg',                       ar: 1.78, title: 'Escalada',                    place: 'Cabeça de Peixe, SP',                                      year: 2024 },
  { src: '/images/portfolio/vista-para-montanhas-itatiaia.jpg',                 ar: 1.50, title: 'Vista para as montanhas',     place: 'Parque Itatiaia, RJ',           coord: '22°25\'S 44°37\'W', year: 2024 },
  { src: '/images/portfolio/caminho-para-laguna69-peru.jpg',                    ar: 1.50, title: 'Caminho para Laguna 69',      place: 'Cordilheira Blanca, Peru',      coord: '9°01\'S 77°37\'W', year: 2025 },
  { src: '/images/portfolio/arara-canindé-rondonia.jpg',                        ar: 0.75, title: 'Arara-canindé',               place: 'Rondônia, BR',                  coord: '10°52\'S 65°20\'W', year: 2023 },
  { src: '/images/portfolio/laguna-acampamento-janca-huayhuash.jpg',            ar: 0.75, title: 'Laguna Janca',                place: 'Huayhuash, Peru',               coord: '10°12\'S 76°48\'W', year: 2025 },
  { src: '/images/portfolio/eu-e-oguia-caminhando no por do sol.jpg',           ar: 1.33, title: 'Guia e fotógrafo',            place: 'Lençóis Maranhenses, MA',                                  year: 2025 },
  { src: '/images/portfolio/asas-de-hermes-itatiaia.jpg',                       ar: 1.50, title: 'Asas de Hermes',              place: 'Parque Itatiaia, RJ',           coord: '22°25\'S 44°37\'W', year: 2024 },
  { src: '/images/portfolio/observador-itatiaia-chapada-da-lua.jpg',            ar: 1.50, title: 'O Observador',                place: 'Chapada da Lua, Itatiaia RJ',   coord: '22°23\'S 44°38\'W', year: 2024 },
  { src: '/images/portfolio/via-lactea-lencois1.jpg',                           ar: 1.50, title: 'Via Láctea',                  place: 'Lençóis Maranhenses, MA',                                  year: 2025 },
  { src: '/images/portfolio/grupo-caminhando-travesisa-lencois.jpg',            ar: 1.50, title: 'Travessia em grupo',          place: 'Lençóis Maranhenses, MA',       coord: '2°34\'S 43°07\'W', year: 2025 },
  { src: '/images/portfolio/cordilheira-blanca-caminho-ate-laguna69-peru2.jpg', ar: 0.75, title: 'Altitude',                    place: 'Cordilheira Blanca, Peru',      coord: '9°01\'S 77°37\'W', year: 2025 },
  { src: '/images/portfolio/pico-ciririca-serradoibitiraquire.jpg',             ar: 1.50, title: 'Pico Ciririca',               place: 'Serra do Ibitiraquire, PR',     coord: '25°14\'S 48°49\'W', year: 2024 },
  { src: '/images/portfolio/cachoeira-ratunde-rondonia.jpg',                    ar: 0.75, title: 'Cachoeira Ratunde',           place: 'Rondônia, BR',                  coord: '10°52\'S 65°20\'W', year: 2023 },
  { src: '/images/portfolio/lencois-caminhate-15hrsdatarde.jpg',                ar: 1.33, title: 'Às 15h da tarde',             place: 'Lençóis Maranhenses, MA',                                  year: 2025 },
  { src: '/images/portfolio/vista-vilarejo-lencois.jpg',                        ar: 1.33, title: 'Vista do vilarejo',           place: 'Lençóis Maranhenses, MA',                                  year: 2025 },
  { src: '/images/portfolio/hotel-pakaas-ronodonia-riomamore-riopakaas.jpg',    ar: 1.50, title: 'Rio Pakaás · Hotel',          place: 'Rio Mamoré, Rondônia, BR',                                 year: 2023 },
  { src: '/images/portfolio/vista-do-picomateo.jpg',                            ar: 1.33, title: 'Vista do Pico Mateo',         place: 'Huayhuash, Peru',               coord: '10°12\'S 76°48\'W', year: 2025 },
  { src: '/images/portfolio/cachoeira-dos-macacaquinhos-rondonia.jpg',          ar: 0.75, title: 'Cachoeira dos Macacaquinhos', place: 'Rondônia, BR',                  coord: '10°52\'S 65°20\'W', year: 2023 },
  { src: '/images/portfolio/caverna-do-diabo-petar-eldorado-SP.jpg',            ar: 1.50, title: 'Caverna do Diabo',            place: 'PETAR, Eldorado SP',            coord: '24°32\'S 48°41\'W', year: 2023 },
  { src: '/images/portfolio/ronondia-riopakaas-riomamore.jpg',                  ar: 1.60, title: 'Rio Pakaás · Mamoré',        place: 'Rondônia, BR',                                             year: 2023 },
  { src: '/images/portfolio/cachoeira-ratunde-ronodonia-2.jpg',                 ar: 1.33, title: 'Ratunde · detalhe',           place: 'Rondônia, BR',                  coord: '10°52\'S 65°20\'W', year: 2023 },
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

// derive real counts
const places = new Set(PHOTOS.map(p => p.place.split(',')[0].trim())).size
const countries = new Set(PHOTOS.map(p => {
  const last = p.place.split(',').pop()?.trim()
  if (!last) return 'BR'
  if (['Peru'].includes(last)) return 'PE'
  return 'BR'
})).size + 1 // +1 for the explicit country codes

export const metadata = {
  title: 'Portfolio — henriq.eu',
  description: 'Lugares, luz e momentos que valeram a viagem.',
}

export default function PortfolioPage() {
  const containerW = 1328
  const targetH = 420
  const gap = 6
  const rows = buildRows(PHOTOS, containerW, targetH, gap)

  return (
    <main style={{ background: 'var(--canvas)', color: 'var(--bark)', fontFamily: 'var(--font-ui)' }}>
      <style>{`
        /* ── MOSAIC CELLS ── */
        .port-cell {
          cursor: zoom-in;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
          margin: 0;
        }

        .port-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(.2,.8,.2,1);
          will-change: transform;
        }

        /* hover only on real pointer devices */
        @media (hover: hover) and (pointer: fine) {
          .port-cell:hover .port-img {
            transform: scale(1.05);
          }
          .port-cell:hover .port-overlay {
            opacity: 1;
          }
          .port-cell:hover .port-caption {
            transform: translateY(0);
            opacity: 1;
            filter: blur(0px);
          }
        }

        /* ── OVERLAY — flat, no gradient noise ── */
        .port-overlay {
          position: absolute;
          inset: 0;
          background: rgba(18, 26, 14, 0.72);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 18px;
        }

        /* ── CAPTION — Jakub enter: opacity + y + blur ── */
        .port-caption {
          transform: translateY(10px);
          opacity: 0;
          filter: blur(3px);
          transition:
            transform 0.4s cubic-bezier(.2,.8,.2,1) 0.04s,
            opacity   0.35s ease 0.04s,
            filter    0.35s ease 0.04s;
        }

        /* ── FILTERS — tipografia pura, sem chips ── */
        .port-filter {
          background: none;
          border: none;
          padding: 0;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--stone);
          cursor: pointer;
          position: relative;
          line-height: 1;
        }

        .port-filter::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--bark);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s cubic-bezier(.2,.8,.2,1);
        }

        .port-filter:hover::after,
        .port-filter-on::after {
          transform: scaleX(1);
        }

        .port-filter-on {
          color: var(--bark);
        }

        /* ── STAGGER ENTRANCE — rows fade in sequentially ── */
        @keyframes port-row-in {
          from { opacity: 0; transform: translateY(12px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0px); }
        }

        .port-row {
          animation: port-row-in 0.55s cubic-bezier(.2,.8,.2,1) both;
        }

        /* ── REDUCED MOTION — keep crossfade, kill spatial ── */
        @media (prefers-reduced-motion: reduce) {
          .port-row {
            animation: none;
          }
          .port-img {
            transition: none;
          }
          .port-caption {
            transition: opacity 0.2s ease;
            transform: none;
            filter: none;
          }
          @media (hover: hover) and (pointer: fine) {
            .port-cell:hover .port-caption {
              transform: none;
              filter: none;
            }
          }
        }

        /* ── MOBILE — Instagram 3-col feed ── */
        @media (max-width: 768px) {
          .port-mosaic {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px;
            padding: 0 !important;
          }

          /* dissolve rows into the grid */
          .port-row {
            display: contents;
            animation: none;
          }

          .port-cell {
            width: auto !important;
            height: 120px !important;
            cursor: default;
          }

          /* no hover overlay on mobile feed */
          .port-overlay {
            display: none;
          }

          .port-img {
            transition: none;
          }
        }

        @media (max-width: 480px) {
          .port-cell {
            height: 100px !important;
          }
        }

        /* ── FOCUS STATES ── */
        .port-cell:focus-visible {
          outline: 2px solid var(--rust);
          outline-offset: 2px;
          z-index: 1;
        }

        .port-filter:focus-visible {
          outline: 2px solid var(--rust);
          outline-offset: 4px;
        }
      `}</style>

      <SiteNav dark={false} />

      {/* ── HEADER — editorial seco ── */}
      <header style={{
        padding: 'clamp(80px, 10vw, 120px) 56px 40px',
        borderBottom: '1px solid var(--line)',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'end',
        gap: '24px',
      }}>
        {/* left col */}
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: 'var(--stone)',
            marginBottom: 12,
            fontWeight: 500,
          }}>
            № 01 · Fotografia
          </div>

          <h1 style={{ margin: 0, lineHeight: 0.88 }}>
            <span style={{
              fontFamily: 'var(--font-hand)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: 'var(--rust)',
              transform: 'rotate(-2deg)',
              display: 'inline-block',
              marginBottom: 4,
              letterSpacing: '.01em',
            }}>
              o que eu vi
            </span>
            <br />
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 700,
              fontSize: 'clamp(56px, 10vw, 140px)',
              letterSpacing: '-.05em',
              lineHeight: 0.88,
              display: 'block',
              color: 'var(--bark)',
            }}>
              PORT—FOLIO.
            </span>
          </h1>
        </div>

        {/* right col — metadata discreta */}
        <div style={{
          textAlign: 'right',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--stone)',
          letterSpacing: '.12em',
          lineHeight: 2,
          paddingBottom: 6,
          whiteSpace: 'nowrap',
        }}>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 48px)',
            color: 'var(--bark)',
            letterSpacing: '-.03em',
            lineHeight: 1,
            display: 'block',
            marginBottom: 6,
          }}>
            {PHOTOS.length}
          </span>
          frames publicados<br />
          <span style={{ color: 'var(--rust)' }}>{places} lugares · 4 países</span>
        </div>
      </header>

      {/* ── FILTERS — navegação tipográfica ── */}
      <nav
        aria-label="Filtrar portfolio"
        style={{
          padding: '16px 56px',
          display: 'flex',
          gap: 28,
          alignItems: 'center',
          borderBottom: '1px solid var(--line)',
        }}
      >
        {['Tudo', 'Deserto', 'Montanha', 'Oceano', 'Floresta', 'Noturno'].map((label, i) => (
          <button
            key={label}
            className={`port-filter${i === 0 ? ' port-filter-on' : ''}`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ── MOSAIC ── */}
      <div className="port-mosaic" style={{ padding: '6px 56px 0' }}>
        {rows.map((row, ri) => {
          const rowAR = row.reduce((s, p) => s + p.ar, 0)
          const availableW = containerW - gap * (row.length - 1)
          const rowH = Math.min(availableW / rowAR, 500)

          return (
            <div
              key={ri}
              className="port-row"
              style={{
                display: 'flex',
                gap,
                marginBottom: gap,
                // stagger by row index, cap at 8 rows to avoid long waits
                animationDelay: `${Math.min(ri * 60, 480)}ms`,
              }}
            >
              {row.map((p, pi) => {
                const w = rowH * p.ar
                const num = String(ri * 8 + pi + 1).padStart(3, '0')

                return (
                  <figure
                    key={pi}
                    className="port-cell"
                    style={{ width: w, height: rowH }}
                    tabIndex={0}
                    role="img"
                    aria-label={`${p.title} — ${p.place}, ${p.year}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.src}
                      alt={p.title}
                      className="port-img"
                      loading={ri === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <div className="port-overlay" aria-hidden="true">
                      <div className="port-caption">
                        <div style={{
                          fontFamily: 'var(--font-serif)',
                          fontStyle: 'italic',
                          fontSize: 17,
                          color: 'var(--canvas)',
                          lineHeight: 1.15,
                        }}>
                          {p.title}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          color: 'rgba(232,223,201,.55)',
                          letterSpacing: '.14em',
                          marginTop: 5,
                        }}>
                          № {num} · {p.place} · {p.year}
                        </div>
                        {p.coord && (
                          <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 8,
                            color: 'rgba(232,223,201,.3)',
                            letterSpacing: '.12em',
                            marginTop: 3,
                          }}>
                            {p.coord}
                          </div>
                        )}
                      </div>
                    </div>
                  </figure>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* ── FOOTER COUNTER — discreto ── */}
      <div style={{
        padding: '40px 56px 80px',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
        color: 'var(--stone)',
        borderTop: '1px solid var(--line)',
        marginTop: 6,
      }}>
        {PHOTOS.length} frames · {places} lugares · 4 países · 2023—2025
      </div>

      <SiteFooter dark={false} />
    </main>
  )
}
