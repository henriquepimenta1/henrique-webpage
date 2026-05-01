'use client'

import { useState, useMemo } from 'react'
import SiteNav from '@/components/nav'
import SiteFooter from '@/components/site-footer'

type Category = 'Deserto' | 'Montanha' | 'Floresta' | 'Noturno' | 'Água'

interface Photo {
  src: string
  ar: number
  title: string
  place: string
  coord?: string
  year: number
  cat: Category[]
}

// ── categoria inferida por keywords no src + place ──────────────────────────
function inferCats(src: string, place: string): Category[] {
  const s = (src + ' ' + place).toLowerCase()
  const cats: Category[] = []
  if (/lencois|dunas?|atacama|desert/.test(s))                                   cats.push('Deserto')
  if (/montanh|pico|serra|itatiaia|huayhuash|cordilheira|ibitiraquire|marins|blanca/.test(s)) cats.push('Montanha')
  if (/rondonia|floresta|cachoeira|caverna|petar|macacaquinho|arara/.test(s))    cats.push('Floresta')
  if (/via.lactea|lactea|noturno|noite/.test(s))                                 cats.push('Noturno')
  if (/lagoa|laguna|rio|cachoeira|ocean/.test(s))                                cats.push('Água')
  return cats.length ? cats : ['Deserto']
}

const RAW: Omit<Photo, 'cat'>[] = [
  { src: '/images/portfolio/lencois-aerial-drone.jpg',                          ar: 1.33, title: 'Lençóis · aérea',            place: 'Lençóis Maranhenses, MA',      coord: "2°34'S 43°07'W", year: 2025 },
  { src: '/images/portfolio/lencois-silhueta-pordosol.jpg',                     ar: 1.50, title: 'Silhueta ao pôr do sol',      place: 'Lençóis Maranhenses, MA',      coord: "2°34'S 43°07'W", year: 2025 },
  { src: '/images/portfolio/cordilheira-blanca-caminho-ate-laguna69-peru.jpg',  ar: 0.80, title: 'Cordilheira Blanca',          place: 'Laguna 69, Peru',              coord: "9°01'S 77°37'W", year: 2025 },
  { src: '/images/portfolio/ocaminhante-lencois.jpg',                           ar: 0.75, title: 'O Caminhante',                place: 'Lençóis Maranhenses, MA',                               year: 2025 },
  { src: '/images/portfolio/nascer-do-sol-mantiqueira-marinsxitaguaré.jpg',     ar: 1.60, title: 'Nascer do sol',               place: 'Mantiqueira · Marins, SP',     coord: "22°36'S 45°01'W", year: 2024 },
  { src: '/images/portfolio/pessoas-caminhando-travessia-lencois.jpg',          ar: 1.50, title: 'A travessia',                 place: 'Lençóis Maranhenses, MA',                               year: 2025 },
  { src: '/images/portfolio/acapamento-janca-huayhuash.jpg',                    ar: 1.34, title: 'Acampamento Janca',           place: 'Huayhuash, Peru',              coord: "10°12'S 76°48'W", year: 2025 },
  { src: '/images/portfolio/lencois-caminhando-na-duna.jpg',                    ar: 1.50, title: 'Caminhando na duna',          place: 'Lençóis Maranhenses, MA',                               year: 2025 },
  { src: '/images/portfolio/pico-parana-visto-do-topo-serradoibitiraquire.jpg', ar: 1.33, title: 'Pico Paraná visto do topo',   place: 'Serra do Ibitiraquire, PR',    coord: "25°14'S 48°49'W", year: 2024 },
  { src: '/images/portfolio/via-lactea-lencois-baixa-grande.jpg',               ar: 0.80, title: 'Via Láctea · Baixa Grande',  place: 'Lençóis Maranhenses, MA',      coord: "2°34'S 43°07'W", year: 2025 },
  { src: '/images/portfolio/grupo-caminhando-lencois.jpg',                      ar: 1.50, title: 'Grupo em marcha',             place: 'Lençóis Maranhenses, MA',                               year: 2025 },
  { src: '/images/portfolio/acapamento-janca-huayhuash2.jpg',                   ar: 1.50, title: 'Janca ao entardecer',         place: 'Huayhuash, Peru',              coord: "10°12'S 76°48'W", year: 2025 },
  { src: '/images/portfolio/lencois-silhueta-pordosol-drone.jpg',               ar: 1.33, title: 'Silhueta · drone',            place: 'Lençóis Maranhenses, MA',      coord: "2°34'S 43°07'W", year: 2025 },
  { src: '/images/portfolio/serra-da-mantiqueira-pico-dos-marins.jpg',          ar: 1.34, title: 'Serra da Mantiqueira',        place: 'Pico dos Marins, SP',          coord: "22°36'S 45°01'W", year: 2024 },
  { src: '/images/portfolio/o-escolhido-lencois-maranhenses.jpg',               ar: 0.75, title: 'O Escolhido',                 place: 'Lençóis Maranhenses, MA',                               year: 2025 },
  { src: '/images/portfolio/as3lagunas-huayhuash.jpg',                          ar: 1.34, title: 'As três lagunas',             place: 'Huayhuash, Peru',              coord: "10°12'S 76°48'W", year: 2025 },
  { src: '/images/portfolio/queimada-dos-britos-lencois.jpg',                   ar: 1.50, title: 'Queimada dos Britos',         place: 'Lençóis Maranhenses, MA',      coord: "2°34'S 43°07'W", year: 2025 },
  { src: '/images/portfolio/pordosol-cordilheira-blanca-peru.jpg',              ar: 1.33, title: 'Pôr do sol · Cordilheira',   place: 'Cordilheira Blanca, Peru',     coord: "9°01'S 77°37'W", year: 2025 },
  { src: '/images/portfolio/lagoa-lencois-drone.jpg',                           ar: 0.75, title: 'Lagoa · vista aérea',         place: 'Lençóis Maranhenses, MA',      coord: "2°34'S 43°07'W", year: 2025 },
  { src: '/images/portfolio/escalada-cabeca-depeixe.jpg',                       ar: 1.78, title: 'Escalada',                   place: 'Cabeça de Peixe, SP',                                   year: 2024 },
  { src: '/images/portfolio/vista-para-montanhas-itatiaia.jpg',                 ar: 1.50, title: 'Vista para as montanhas',     place: 'Parque Itatiaia, RJ',          coord: "22°25'S 44°37'W", year: 2024 },
  { src: '/images/portfolio/caminho-para-laguna69-peru.jpg',                    ar: 1.50, title: 'Caminho para Laguna 69',      place: 'Cordilheira Blanca, Peru',     coord: "9°01'S 77°37'W", year: 2025 },
  { src: '/images/portfolio/arara-canindé-rondonia.jpg',                        ar: 0.75, title: 'Arara-canindé',               place: 'Rondônia, BR',                 coord: "10°52'S 65°20'W", year: 2023 },
  { src: '/images/portfolio/laguna-acampamento-janca-huayhuash.jpg',            ar: 0.75, title: 'Laguna Janca',                place: 'Huayhuash, Peru',              coord: "10°12'S 76°48'W", year: 2025 },
  { src: '/images/portfolio/eu-e-oguia-caminhando no por do sol.jpg',           ar: 1.33, title: 'Guia e fotógrafo',            place: 'Lençóis Maranhenses, MA',                               year: 2025 },
  { src: '/images/portfolio/asas-de-hermes-itatiaia.jpg',                       ar: 1.50, title: 'Asas de Hermes',              place: 'Parque Itatiaia, RJ',          coord: "22°25'S 44°37'W", year: 2024 },
  { src: '/images/portfolio/observador-itatiaia-chapada-da-lua.jpg',            ar: 1.50, title: 'O Observador',                place: 'Chapada da Lua, Itatiaia RJ',  coord: "22°23'S 44°38'W", year: 2024 },
  { src: '/images/portfolio/via-lactea-lencois1.jpg',                           ar: 1.50, title: 'Via Láctea',                  place: 'Lençóis Maranhenses, MA',                               year: 2025 },
  { src: '/images/portfolio/grupo-caminhando-travesisa-lencois.jpg',            ar: 1.50, title: 'Travessia em grupo',          place: 'Lençóis Maranhenses, MA',      coord: "2°34'S 43°07'W", year: 2025 },
  { src: '/images/portfolio/cordilheira-blanca-caminho-ate-laguna69-peru2.jpg', ar: 0.75, title: 'Altitude',                   place: 'Cordilheira Blanca, Peru',     coord: "9°01'S 77°37'W", year: 2025 },
  { src: '/images/portfolio/pico-ciririca-serradoibitiraquire.jpg',             ar: 1.50, title: 'Pico Ciririca',               place: 'Serra do Ibitiraquire, PR',    coord: "25°14'S 48°49'W", year: 2024 },
  { src: '/images/portfolio/cachoeira-ratunde-rondonia.jpg',                    ar: 0.75, title: 'Cachoeira Ratunde',           place: 'Rondônia, BR',                 coord: "10°52'S 65°20'W", year: 2023 },
  { src: '/images/portfolio/lencois-caminhate-15hrsdatarde.jpg',                ar: 1.33, title: 'Às 15h da tarde',             place: 'Lençóis Maranhenses, MA',                               year: 2025 },
  { src: '/images/portfolio/vista-vilarejo-lencois.jpg',                        ar: 1.33, title: 'Vista do vilarejo',           place: 'Lençóis Maranhenses, MA',                               year: 2025 },
  { src: '/images/portfolio/hotel-pakaas-ronodonia-riomamore-riopakaas.jpg',    ar: 1.50, title: 'Rio Pakaás · Hotel',          place: 'Rio Mamoré, Rondônia, BR',                              year: 2023 },
  { src: '/images/portfolio/vista-do-picomateo.jpg',                            ar: 1.33, title: 'Vista do Pico Mateo',         place: 'Huayhuash, Peru',              coord: "10°12'S 76°48'W", year: 2025 },
  { src: '/images/portfolio/cachoeira-dos-macacaquinhos-rondonia.jpg',          ar: 0.75, title: 'Cachoeira dos Macacaquinhos', place: 'Rondônia, BR',                 coord: "10°52'S 65°20'W", year: 2023 },
  { src: '/images/portfolio/caverna-do-diabo-petar-eldorado-SP.jpg',            ar: 1.50, title: 'Caverna do Diabo',            place: 'PETAR, Eldorado SP',           coord: "24°32'S 48°41'W", year: 2023 },
  { src: '/images/portfolio/ronondia-riopakaas-riomamore.jpg',                  ar: 1.60, title: 'Rio Pakaás · Mamoré',        place: 'Rondônia, BR',                                          year: 2023 },
  { src: '/images/portfolio/cachoeira-ratunde-ronodonia-2.jpg',                 ar: 1.33, title: 'Ratunde · detalhe',           place: 'Rondônia, BR',                 coord: "10°52'S 65°20'W", year: 2023 },
]

const PHOTOS: Photo[] = RAW.map(p => ({ ...p, cat: inferCats(p.src, p.place) }))

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

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

const FILTERS: Array<'Tudo' | Category> = ['Tudo', 'Deserto', 'Montanha', 'Floresta', 'Noturno', 'Água']
const CONTAINER_W = 1328
const TARGET_H    = 420
const GAP         = 6

export default function PortfolioPage() {
  const photos = useMemo(() => shuffle(PHOTOS), [])

  const [activeFilter, setActiveFilter] = useState<'Tudo' | Category>('Tudo')
  const [expandedSrc, setExpandedSrc]   = useState<string | null>(null)

  const filtered = activeFilter === 'Tudo'
    ? photos
    : photos.filter(p => p.cat.includes(activeFilter))

  const rows    = buildRows(filtered, CONTAINER_W, TARGET_H, GAP)
  const places  = new Set(PHOTOS.map(p => p.place.split(',')[0].trim())).size

  function toggleExpand(src: string) {
    setExpandedSrc(prev => prev === src ? null : src)
  }

  return (
    <main style={{ background: 'var(--canvas)', color: 'var(--bark)', fontFamily: 'var(--font-ui)' }}>
      <style>{`
        .port-cell {
          cursor: zoom-in;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
          margin: 0;
          transition: transform 0.45s cubic-bezier(.2,.8,.2,1);
          z-index: 0;
        }
        .port-cell-expanded {
          transform: scale(1.08);
          z-index: 10;
          cursor: zoom-out;
          box-shadow: 0 24px 64px rgba(18,26,14,0.45);
        }
        .port-img {
          display: block; width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(.2,.8,.2,1);
          will-change: transform;
          pointer-events: none;
        }
        @media (hover: hover) and (pointer: fine) {
          .port-cell:not(.port-cell-expanded):hover .port-img { transform: scale(1.05); }
          .port-cell:hover .port-overlay { opacity: 1; }
          .port-cell:hover .port-caption { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        .port-cell-expanded .port-overlay { opacity: 1; }
        .port-cell-expanded .port-caption { transform: translateY(0); opacity: 1; filter: blur(0); }

        .port-overlay {
          position: absolute; inset: 0;
          background: rgba(18,26,14,0.68);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex; align-items: flex-end; padding: 16px;
          pointer-events: none;
        }
        .port-caption {
          transform: translateY(10px); opacity: 0; filter: blur(3px);
          transition:
            transform 0.4s cubic-bezier(.2,.8,.2,1) 0.04s,
            opacity   0.35s ease 0.04s,
            filter    0.35s ease 0.04s;
        }

        .port-filter {
          background: none; border: none; padding: 0;
          font-family: var(--font-mono); font-size: 10px;
          letter-spacing: .18em; text-transform: uppercase;
          color: var(--stone); cursor: pointer;
          position: relative; line-height: 1;
          transition: color 0.2s ease;
        }
        .port-filter::after {
          content: ''; position: absolute; bottom: -3px; left: 0;
          width: 100%; height: 1px; background: var(--bark);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.25s cubic-bezier(.2,.8,.2,1);
        }
        .port-filter:hover { color: var(--bark); }
        .port-filter:hover::after,
        .port-filter-on::after { transform: scaleX(1); }
        .port-filter-on { color: var(--bark); }

        @keyframes port-row-in {
          from { opacity: 0; transform: translateY(10px); filter: blur(3px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
        .port-row { animation: port-row-in 0.5s cubic-bezier(.2,.8,.2,1) both; }

        @media (prefers-reduced-motion: reduce) {
          .port-row, .port-cell, .port-img { animation: none; transition: none; }
          .port-caption { transition: opacity 0.15s ease; transform: none; filter: none; }
        }

        .port-cell:focus-visible  { outline: 2px solid var(--rust); outline-offset: 2px; z-index: 1; }
        .port-filter:focus-visible { outline: 2px solid var(--rust); outline-offset: 4px; }

        /* ── MOBILE feed 3-col ── */
        @media (max-width: 768px) {
          .port-header       { padding: 80px 20px 24px !important; grid-template-columns: 1fr !important; }
          .port-header-meta  { display: none !important; }
          .port-filters-wrap { padding: 12px 20px !important; gap: 16px !important; }
          .port-mosaic-wrap  { padding: 0 !important; }
          .port-mosaic       { display: grid !important; grid-template-columns: repeat(3,1fr) !important; gap: 2px !important; }
          .port-row          { display: contents !important; animation: none !important; }
          .port-cell         { width: auto !important; height: 110px !important; transform: none !important; transition: none !important; }
          .port-cell-expanded { transform: none !important; box-shadow: none !important; }
          .port-overlay      { display: none !important; }
          .port-img          { transition: none !important; }
          .port-footer-bar   { padding: 20px 20px 56px !important; }
        }
        @media (max-width: 420px) {
          .port-cell { height: 90px !important; }
        }
      `}</style>

      <SiteNav dark={false} />

      {/* HEADER */}
      <header
        className="port-header"
        style={{
          padding: 'clamp(80px,10vw,120px) 56px 40px',
          borderBottom: '1px solid var(--line)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'end',
          gap: 24,
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 12 }}>
            № 01 · Fotografia
          </div>
          <h1 style={{ margin: 0, lineHeight: 0.88 }}>
            <span style={{ fontFamily: 'var(--font-hand)', fontSize: 'clamp(22px,3.2vw,38px)', color: 'var(--rust)', transform: 'rotate(-2deg)', display: 'inline-block', marginBottom: 4, letterSpacing: '.01em' }}>
              o que eu vi
            </span>
            <br />
            <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(48px,8.5vw,120px)', letterSpacing: '-.05em', lineHeight: 0.88, display: 'block', color: 'var(--bark)' }}>
              PORT—FOLIO.
            </span>
          </h1>
        </div>

        <div className="port-header-meta" style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stone)', letterSpacing: '.12em', lineHeight: 2, paddingBottom: 4, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,44px)', color: 'var(--bark)', letterSpacing: '-.03em', lineHeight: 1, display: 'block', marginBottom: 6 }}>
            {PHOTOS.length}
          </span>
          frames publicados<br />
          <span style={{ color: 'var(--rust)' }}>{places} lugares</span>
        </div>
      </header>

      {/* FILTERS */}
      <nav
        aria-label="Filtrar portfolio"
        className="port-filters-wrap"
        style={{ padding: '16px 56px', display: 'flex', gap: 28, alignItems: 'center', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}
      >
        {FILTERS.map(label => (
          <button
            key={label}
            className={`port-filter${activeFilter === label ? ' port-filter-on' : ''}`}
            onClick={() => { setActiveFilter(label); setExpandedSrc(null) }}
            aria-pressed={activeFilter === label}
          >
            {label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stone)', letterSpacing: '.14em' }}>
          {filtered.length} frames
        </span>
      </nav>

      {/* MOSAIC */}
      <div className="port-mosaic-wrap" style={{ padding: '6px 56px 0' }}>
        <div className="port-mosaic">
          {rows.map((row, ri) => {
            const rowAR      = row.reduce((s, p) => s + p.ar, 0)
            const availableW = CONTAINER_W - GAP * (row.length - 1)
            const rowH       = Math.min(availableW / rowAR, 500)

            return (
              <div
                key={ri}
                className="port-row"
                style={{ display: 'flex', gap: GAP, marginBottom: GAP, animationDelay: `${Math.min(ri * 55, 440)}ms` }}
              >
                {row.map((p, pi) => {
                  const w        = rowH * p.ar
                  const num      = String(ri * 8 + pi + 1).padStart(3, '0')
                  const expanded = expandedSrc === p.src

                  return (
                    <figure
                      key={pi}
                      className={`port-cell${expanded ? ' port-cell-expanded' : ''}`}
                      style={{ width: w, height: rowH }}
                      onClick={() => toggleExpand(p.src)}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleExpand(p.src)}
                      tabIndex={0}
                      role="button"
                      aria-pressed={expanded}
                      aria-label={`${p.title} — ${p.place}, ${p.year}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.src} alt={p.title} className="port-img" loading={ri === 0 ? 'eager' : 'lazy'} decoding="async" />
                      <div className="port-overlay" aria-hidden="true">
                        <div className="port-caption">
                          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--canvas)', lineHeight: 1.15 }}>
                            {p.title}
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(232,223,201,.5)', letterSpacing: '.14em', marginTop: 5 }}>
                            № {num} · {p.place} · {p.year}
                          </div>
                          {p.coord && (
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(232,223,201,.28)', letterSpacing: '.12em', marginTop: 3 }}>
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
      </div>

      {/* FOOTER BAR */}
      <div
        className="port-footer-bar"
        style={{ padding: '40px 56px 80px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--stone)', borderTop: '1px solid var(--line)', marginTop: 6 }}
      >
        {PHOTOS.length} frames · {places} lugares · 2023—2025
      </div>

      <SiteFooter dark={false} />
    </main>
  )
}
