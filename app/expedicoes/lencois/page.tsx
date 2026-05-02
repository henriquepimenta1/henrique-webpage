'use client'

import { useState } from 'react'
import Link from 'next/link'
import SiteNav from '@/components/nav'
import SiteFooter from '@/components/site-footer'
import {
  PACOTES,
  ROTEIRO,
  INCLUIDO,
  NAO_INCLUIDO,
  POLITICA_PAGAMENTO,
  FOTOS_GALERIA,
  WA_GERAL,
  waMsg,
} from '@/content/lencois'

/* ─── Mapa do roteiro ─────────────────────────────────────────── */
const ROUTE_POINTS = [
  { id: 'atins',     label: 'Atins',              x: 88,  y: 38, dia: null,  desc: 'Ponto de chegada de barco' },
  { id: 'bandeira',  label: 'Bandeira',            x: 73,  y: 44, dia: null,  desc: 'Início do trekking' },
  { id: 'baixa',     label: 'Baixa Grande',        x: 57,  y: 50, dia: 1,     desc: '9km · 3h · Primeiro oásis + céu estrelado' },
  { id: 'queimada',  label: 'Queimada dos Britos', x: 42,  y: 44, dia: 2,     desc: '10km · 5h · Nascer do sol 5h + Travessia Rio Negro + lagoas cristalinas' },
  { id: 'betania',   label: 'Betânia',             x: 26,  y: 52, dia: 3,     desc: '18km · 6h · Saída 3h · Lagoas mais espetaculares da região' },
  { id: 'stamaro',   label: 'Santo Amaro',         x: 10,  y: 42, dia: 4,     desc: '15km · 4h · Início 7h · Cenários épicos + chegada triunfal 11h' },
]

const DIA_COLORS = ['', 'var(--rust)', '#6FA3D8', '#4A5838', 'var(--rust-soft)']
const DIA_LABELS = ['', 'Dia 1', 'Dia 2', 'Dia 3', 'Dia 4']

function RouteSVG() {
  const [active, setActive] = useState<string | null>(null)
  const activePoint = ROUTE_POINTS.find(p => p.id === active)

  const pathD = ROUTE_POINTS.map((p, i) =>
    `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`
  ).join(' ')

  /* Segmentos coloridos por dia */
  const segments = [
    { from: ROUTE_POINTS[0], to: ROUTE_POINTS[1], color: 'rgba(232,223,201,.3)' },
    { from: ROUTE_POINTS[1], to: ROUTE_POINTS[2], color: DIA_COLORS[1] },
    { from: ROUTE_POINTS[2], to: ROUTE_POINTS[3], color: DIA_COLORS[2] },
    { from: ROUTE_POINTS[3], to: ROUTE_POINTS[4], color: DIA_COLORS[3] },
    { from: ROUTE_POINTS[4], to: ROUTE_POINTS[5], color: DIA_COLORS[4] },
  ]

  return (
    <div style={{ position: 'relative', background: 'var(--forest-soft)', border: '1px solid var(--line-dark)', borderRadius: 2, overflow: 'hidden' }}>
      {/* Fundo texturizado de dunas */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/lencois/DJI_20250828174205_0403_D-HDR.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: .18 }} />

      <svg viewBox="0 0 100 80" style={{ width: '100%', display: 'block', position: 'relative', zIndex: 1 }}>
        {/* Grid sutil */}
        {[20, 40, 60, 80].map(x => (
          <line key={x} x1={x} y1={0} x2={x} y2={80} stroke="rgba(232,223,201,.04)" strokeWidth=".3" />
        ))}

        {/* Trilha base */}
        <polyline points={ROUTE_POINTS.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="rgba(232,223,201,.08)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Segmentos por dia */}
        {segments.map((seg, i) => (
          <line key={i}
            x1={seg.from.x} y1={seg.from.y}
            x2={seg.to.x}   y2={seg.to.y}
            stroke={seg.color} strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray={i === 0 ? "1,1" : undefined}
            opacity={.85}
          />
        ))}

        {/* Pontos */}
        {ROUTE_POINTS.map(p => (
          <g key={p.id} style={{ cursor: 'pointer' }} onClick={() => setActive(active === p.id ? null : p.id)}>
            <circle cx={p.x} cy={p.y} r={3.5} fill="transparent" />
            <circle
              cx={p.x} cy={p.y}
              r={active === p.id ? 3 : 2}
              fill={p.dia ? DIA_COLORS[p.dia] : 'rgba(232,223,201,.4)'}
              stroke={active === p.id ? 'var(--canvas)' : 'transparent'}
              strokeWidth=".5"
              style={{ transition: 'r .2s, fill .2s' }}
            />
            {/* Label */}
            <text
              x={p.x} y={p.y - 3.5}
              textAnchor="middle"
              fontSize="3"
              fill="rgba(232,223,201,.7)"
              fontFamily="var(--font-mono)"
              letterSpacing=".03em"
            >
              {p.label}
            </text>
            {p.dia && (
              <text x={p.x} y={p.y + 5.5} textAnchor="middle" fontSize="2.4" fill={DIA_COLORS[p.dia]} fontFamily="var(--font-mono)" fontWeight="700">
                {DIA_LABELS[p.dia]}
              </text>
            )}
          </g>
        ))}

        {/* Direção */}
        <text x={95} y={34} textAnchor="end" fontSize="2.5" fill="rgba(232,223,201,.3)" fontFamily="var(--font-mono)">Atins</text>
        <text x={5}  y={38} textAnchor="start" fontSize="2.5" fill="rgba(232,223,201,.3)" fontFamily="var(--font-mono)">Santo Amaro</text>
      </svg>

      {/* Legenda */}
      <div style={{ position: 'relative', zIndex: 1, padding: '12px 20px', display: 'flex', gap: 20, flexWrap: 'wrap', borderTop: '1px solid var(--line-dark)' }}>
        {[1,2,3,4].map(d => (
          <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 2, background: DIA_COLORS[d], borderRadius: 1 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.16em', color: 'var(--ashe-dim)', textTransform: 'uppercase' }}>{DIA_LABELS[d]}</span>
          </div>
        ))}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.12em', color: 'var(--ashe-dim)', marginLeft: 'auto' }}>Clique nos pontos para detalhes</span>
      </div>

      {/* Tooltip */}
      {activePoint && (
        <div style={{
          position: 'absolute', bottom: 52, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--forest)', border: '1px solid var(--line-dark)',
          padding: '12px 18px', maxWidth: 280, zIndex: 10,
          /* transform apenas — sem layout props */
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: activePoint.dia ? DIA_COLORS[activePoint.dia] : 'var(--ashe-dim)', marginBottom: 4 }}>
            {activePoint.dia ? DIA_LABELS[activePoint.dia] : 'Ponto de partida'}
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13, color: 'var(--canvas)', marginBottom: 4 }}>{activePoint.label}</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 12, color: 'var(--ashe-dim)', lineHeight: 1.5 }}>{activePoint.desc}</div>
        </div>
      )}
    </div>
  )
}

/* ─── Checklist de equipamentos ────────────────────────────────── */
const GEAR_GROUPS = [
  {
    id: 'base', label: 'Equipamento base',
    items: ['Mochila de trekking 40–50L confortável', 'Roupas leves de secagem rápida', 'Tênis para caminhada em areia', 'Sandália de trekking (tipo Papete)', 'Mochila pequena para day use (opcional)'],
  },
  {
    id: 'solar', label: 'Proteção solar',
    items: ['Chapéu ou boné com aba', 'Óculos de sol com proteção UV', 'Protetor solar FPS 50+ resistente', 'Repelente de insetos'],
  },
  {
    id: 'hidra', label: 'Hidratação & energia',
    items: ['Garrafa/squeeze de água (1–2L)', 'Lanches extras (barras, castanhas, frutas secas)', 'Eletrólitos/isotônicos em pó (opcional)'],
  },
  {
    id: 'essen', label: 'Essenciais',
    items: ['Lanterna de cabeça ou headlamp', 'Capa de chuva leve', 'Sacos estanques para eletrônicos', 'Medicamentos pessoais', 'Kit higiene básico', 'Toalha de secagem rápida (microfibra)'],
  },
]

function GearChecklist() {
  const total = GEAR_GROUPS.reduce((acc, g) => acc + g.items.length, 0)
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (key: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const pct = Math.round((checked.size / total) * 100)

  return (
    <div>
      {/* Progresso */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)' }}>
            {checked.size}/{total} itens
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.16em', color: pct === 100 ? 'var(--moss)' : 'var(--rust)', fontWeight: 700 }}>
            {pct === 100 ? 'Mochila pronta ✓' : `${pct}%`}
          </span>
        </div>
        <div style={{ height: 2, background: 'var(--line)', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'var(--moss)' : 'var(--rust)', transition: 'width .3s ease' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="gear-grid">
        {GEAR_GROUPS.map(group => (
          <div key={group.id}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 10 }}>{group.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {group.items.map(item => {
                const key = `${group.id}:${item}`
                const done = checked.has(key)
                return (
                  <button
                    key={key}
                    onClick={() => toggle(key)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0',
                      background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    <div style={{
                      width: 14, height: 14, border: `1px solid ${done ? 'var(--moss)' : 'var(--stone)'}`,
                      background: done ? 'var(--moss)' : 'transparent',
                      flexShrink: 0, marginTop: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      /* transform apenas */
                      transition: 'background .15s, border-color .15s',
                    }}>
                      {done && <span style={{ color: 'var(--canvas)', fontSize: 8, lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-serif)', fontSize: 13, lineHeight: 1.4,
                      color: done ? 'var(--stone)' : 'var(--bark)',
                      textDecoration: done ? 'line-through' : 'none',
                      transition: 'color .15s',
                    }}>{item}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(74,88,56,.08)', border: '1px solid rgba(74,88,56,.25)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ color: 'var(--moss)', fontSize: 16, flexShrink: 0 }}>✓</span>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stone)', margin: 0, lineHeight: 1.5 }}>
          Viaje leve! A agência fornece redários, alimentação e toda estrutura de camping. Lista detalhada completa enviada após confirmação da reserva.
        </p>
      </div>
    </div>
  )
}

/* ─── Pacotes alternativos ─────────────────────────────────────── */
const OUTROS_PACOTES = [
  {
    id: 'intensiva',
    label: 'Travessia Intensiva',
    dias: '3 dias',
    km: '~38km',
    desc: 'Aventura concentrada para quem tem menos tempo. Fotografia profissional também inclusa.',
    price: null,
    cta: 'Consultar valores',
  },
  {
    id: 'profunda',
    label: 'Travessia Profunda',
    dias: '5 dias',
    km: '~65km',
    desc: 'Imersão total com ritmo contemplativo. Fotografia profissional também inclusa. Vagas limitadas — apenas 1 grupo.',
    price: null,
    cta: 'Consultar valores',
  },
]

/* ─── Política de cancelamento ─────────────────────────────────── */
const CANCELAMENTO = [
  { prazo: 'Até 30 dias antes', condicao: 'Crédito válido por 12 meses' },
  { prazo: '29 a 15 dias antes', condicao: 'Retenção de 50%' },
  { prazo: 'Menos de 14 dias', condicao: 'Sem reembolso' },
]

/* ─── NOT / IS ─────────────────────────────────────────────────── */
const NOT_IS = {
  nao: ['Passeio de 2h', 'Tour de ônibus', 'Grupo de 40', 'Lagoas lotadas', 'Fotos clichês da internet', 'Turismo mais do mesmo'],
  e:   ['4 dias de imersão completa', 'Caminhada consciente', 'Máximo 10 pessoas', 'Oásis secretos fora do roteiro', 'Fotógrafo profissional incluso', 'Transformação real'],
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════ */
export default function LencoisPage() {
  return (
    <main style={{ background: 'var(--canvas)', color: 'var(--bark)', fontFamily: 'var(--font-ui)' }}>
      <style>{`
        .lenc-trip-img { transition: transform 1s cubic-bezier(.2,.7,.2,1); }
        .lenc-img-wrap:hover .lenc-trip-img { transform: scale(1.04); }
        .lenc-pack:hover { outline: 1px solid var(--rust); }
        .lenc-cta-btn:hover { opacity: .88; }
        @media(max-width:768px){
          .lenc-two   { grid-template-columns: 1fr !important; gap: 48px !important; }
          .lenc-four  { grid-template-columns: 1fr 1fr !important; }
          .lenc-pad   { padding: 64px 24px !important; }
          .lenc-hero-pad { padding: 120px 24px 56px !important; }
          .lenc-day   { grid-template-columns: 48px 1fr !important; }
          .lenc-day-img  { display: none !important; }
          .lenc-packs { grid-template-columns: 1fr !important; }
          .lenc-pol   { grid-template-columns: 1fr !important; }
          .gear-grid  { grid-template-columns: 1fr !important; }
          .notis-grid { grid-template-columns: 1fr !important; }
          .outros-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <SiteNav dark={true} />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: 820, overflow: 'hidden', background: 'var(--forest)' }}>
        <div className="lenc-trip-img" style={{ position: 'absolute', inset: 0, backgroundImage: `url(${FOTOS_GALERIA[0]})`, backgroundSize: 'cover', backgroundPosition: 'center 30%' }} />
        {/* gradiente: rgba de var(--forest) #1E2A18 */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(30,42,24,.45) 0%, rgba(30,42,24,.05) 40%, rgba(30,42,24,.9) 100%)' }} />

        <div className="lenc-hero-pad" style={{ position: 'relative', zIndex: 2, minHeight: 820, padding: '140px 56px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--canvas)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe)', fontWeight: 500 }}>
            <Link href="/expedicoes" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
              Expedições
            </Link>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--rust-soft)', display: 'inline-block' }} />
            <span>Lençóis Maranhenses</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--rust-soft)', display: 'inline-block' }} />
            <span style={{ color: 'var(--rust-soft)' }}>Agosto 2026</span>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-hand)', fontSize: 44, color: 'var(--rust-soft)', transform: 'rotate(-2deg)', display: 'inline-block', marginBottom: 6 }}>
              deserto com lagoas, Via Láctea garantida—
            </div>
            <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(64px, 10vw, 140px)', letterSpacing: '-.04em', lineHeight: 0.9, margin: 0, color: 'var(--canvas)' }}>
              Lençóis<br />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--rust-soft)' }}>Maranhenses</span>
            </h1>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, flexWrap: 'wrap' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontStyle: 'italic', lineHeight: 1.5, maxWidth: '46ch', color: 'var(--canvas)', margin: 0 }}>
              Travessia a pé entre dunas brancas e lagoas de água doce — o parque que parece outro planeta, com fotografia profissional inclusa.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 32, flexShrink: 0 }}>
              {[['35–64km', 'Distância'], ['3–5 dias', 'Duração'], ['2–4 oásis', 'Pernoites'], ['máx. 10', 'Por turma']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe-dim)', marginBottom: 6 }}>{l}</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 20, fontWeight: 600, color: 'var(--canvas)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── O QUE ESTA TRAVESSIA NÃO É ── */}
      <section className="lenc-pad" style={{ padding: '80px 56px', background: 'var(--forest)', borderBottom: '1px solid var(--line-dark)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust-soft)', marginBottom: 14 }}>№ 00 · Antes de tudo</div>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-.02em', lineHeight: 1.05, margin: '0 0 40px', color: 'var(--canvas)' }}>
          O que esta travessia <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--rust-soft)' }}>não é</span> — e o que ela realmente é.
        </h2>
        <div className="notis-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {/* NÃO É */}
          <div style={{ padding: '32px 36px', background: 'rgba(11,10,8,.4)', border: '1px solid var(--line-dark)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 20 }}>❌ Não é</div>
            {NOT_IS.nao.map(item => (
              <div key={item} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--line-dark)', fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stone)', lineHeight: 1.4 }}>
                <span style={{ flexShrink: 0, opacity: .4 }}>—</span>
                {item}
              </div>
            ))}
          </div>
          {/* É */}
          <div style={{ padding: '32px 36px', background: 'rgba(74,88,56,.12)', border: '1px solid rgba(74,88,56,.3)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--moss)', marginBottom: 20 }}>✓ É</div>
            {NOT_IS.e.map(item => (
              <div key={item} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(74,88,56,.15)', fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--canvas)', lineHeight: 1.4 }}>
                <span style={{ color: 'var(--moss)', flexShrink: 0, fontWeight: 700 }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
        {/* Detalhes técnicos */}
        <div style={{ marginTop: 2, padding: '20px 36px', background: 'rgba(166,84,43,.06)', border: '1px solid rgba(166,84,43,.2)', display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          {[['52km totais', 'Distância'], ['4 dias completos', 'Duração'], ['Grupos pequenos e intimistas', 'Formato']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--rust-soft)', marginBottom: 4 }}>{l}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16, color: 'var(--canvas)' }}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="lenc-pad" style={{ padding: '72px 56px', borderBottom: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 14 }}>№ 01 · O lugar</div>
          <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 32, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.1, margin: 0, color: 'var(--bark)' }}>
            Deserto branco<br />com lagoas<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>de safira.</span>
          </h2>
        </div>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, lineHeight: 1.55, color: 'var(--stone)', margin: 0 }}>
          Os Lençóis Maranhenses são um dos lugares mais irreais do planeta — um deserto de dunas brancas que, entre janeiro e setembro, se preenche com lagoas de água doce cristalina. A travessia a pé conecta Atins a Santo Amaro pelos caminhos internos do parque, passando por comunidades que vivem isoladas há gerações. Não existe trilha marcada. Você segue guias locais, o vento e a cor da água.
        </p>
      </section>

      {/* ── MAPA DO ROTEIRO ── */}
      <section style={{ background: 'var(--forest)', borderBottom: '1px solid var(--line-dark)' }}>
        <div className="lenc-pad" style={{ padding: '80px 56px' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust-soft)', marginBottom: 14 }}>№ 02 · Mapa</div>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 'clamp(28px, 3.5vw, 42px)', letterSpacing: '-.02em', lineHeight: 1, margin: 0, color: 'var(--canvas)' }}>
              52km. Atins → Santo Amaro.{' '}
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--rust-soft)' }}>4 dias, 4 cores.</span>
            </h2>
          </div>
          <RouteSVG />
        </div>
      </section>

      {/* ── ROTEIRO DIA A DIA ── */}
      <section style={{ background: 'var(--canvas-deep)', borderBottom: '1px solid var(--line)' }}>
        <div className="lenc-pad" style={{ padding: '96px 56px' }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 14 }}>№ 03 · Roteiro</div>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1, margin: 0, color: 'var(--bark)' }}>
              4 dias.<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>Cada um inesquecível.</span>
            </h2>
          </div>

          {/* Roteiro estático com dados do PDF */}
          {[
            { num: '01', cor: DIA_COLORS[1], rota: 'Barreirinhas → Baixa Grande', tempo: '8h lancha + 9km caminhada · 3h', desc: 'Travessia de lancha pelo Rio Preguiças até Atins, depois trekking pelas primeiras dunas até o oásis de Baixa Grande. Primeiro pernoite em redário sob o céu estrelado — longe de qualquer luz artificial.', highlight: 'Primeiro oásis · Via Láctea garantida', img: FOTOS_GALERIA[1] },
            { num: '02', cor: DIA_COLORS[2], rota: 'Baixa Grande → Queimada dos Britos', tempo: 'Saída 5h · 10km trekking · 5h', desc: 'O dia começa antes do sol. Saída às 5h para capturar o nascer do sol sobre as dunas — a cena mais fotografada da travessia. Travessia do Rio Negro e chegada às lagoas cristalinas do segundo oásis.', highlight: 'Nascer do sol nas dunas · Rio Negro', img: FOTOS_GALERIA[2] },
            { num: '03', cor: DIA_COLORS[3], rota: 'Queimada dos Britos → Betânia', tempo: 'Saída 3h · 18km · 6h de aventura', desc: 'O dia mais longo e mais espetacular. Saída ainda na escuridão, às 3h da madrugada, para cruzar 18km de paisagem lunar. As lagoas desta etapa são as mais impressionantes do circuito — poucas pessoas chegam aqui.', highlight: 'Lagoas mais espetaculares da região', img: FOTOS_GALERIA[3] },
            { num: '04', cor: DIA_COLORS[4], rota: 'Betânia → Santo Amaro', tempo: 'Início 7h · 15km finais · 4h', desc: 'O encerramento triunfal. 15km finais em ritmo mais tranquilo — a travessia já está no corpo. Chegada às 11h em Santo Amaro, com transfer de volta para Barreirinhas. Álbum fotográfico entregue em até 15 dias.', highlight: 'Chegada triunfal 11h · Cenários épicos', img: FOTOS_GALERIA[4] },
          ].map((dia) => (
            <div key={dia.num} className="lenc-day" style={{ display: 'grid', gridTemplateColumns: '80px 1fr 300px', gap: 40, padding: '40px 0', borderTop: '1px solid var(--line)', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 72, fontWeight: 500, letterSpacing: '-.04em', lineHeight: 1, color: dia.cor, opacity: .35, userSelect: 'none' }}>
                {dia.num}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: dia.cor, marginBottom: 4 }}>{dia.rota}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', color: 'var(--stone)', marginBottom: 16 }}>{dia.tempo}</div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.65, color: 'var(--stone)', margin: '0 0 16px', maxWidth: '52ch' }}>{dia.desc}</p>
                {/* rgba de var(--rust) #A6542B */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(166,84,43,.08)', border: '1px solid rgba(166,84,43,.2)', padding: '5px 14px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', color: 'var(--rust)' }}>
                  {dia.highlight}
                </div>
              </div>
              <div className="lenc-img-wrap lenc-day-img" style={{ overflow: 'hidden', aspectRatio: '4/3' }}>
                <img src={dia.img} alt={`Dia ${dia.num}`} className="lenc-trip-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOTOGRAFIA ── */}
      <section className="lenc-pad lenc-two" style={{ padding: '96px 56px', borderBottom: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div className="lenc-img-wrap" style={{ overflow: 'hidden', aspectRatio: '3/4' }}>
          <img src="/images/lencois/DSC03215.jpg" alt="Fotografia" className="lenc-trip-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 14 }}>№ 04 · Diferencial</div>
          <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.05, margin: '0 0 10px', color: 'var(--bark)' }}>
            Guarda o celular.<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>A gente cuida das fotos.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, lineHeight: 1.6, color: 'var(--stone)', marginBottom: 32 }}>
            Henrique (@henriq.eu) vai junto na travessia como fotógrafo e guia — você vive a experiência, a gente cuida das imagens. Todas as fotos desta página foram feitas nas travessias anteriores.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Fotógrafo profissional durante TODA a travessia',
              'Cobertura completa: paisagens épicas, momentos espontâneos, comunidades',
              'Fotos tratadas profissionalmente — entregues em até 15 dias',
              'Álbum digital com as melhores fotos do grupo',
            ].map(item => (
              <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stone)', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--moss)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div style={{ padding: '16px 20px', background: 'var(--canvas-deep)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="lenc-img-wrap" style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--line)' }}>
              <img src="/images/lencois/henrique_sesana1.jpg" alt="Henrique" className="lenc-trip-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700, color: 'var(--bark)' }}>Henrique Pimenta</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', color: 'var(--stone)', marginTop: 2 }}>@henriq.eu · Fotógrafo e guia da expedição</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NÍVEL FÍSICO ── */}
      <section className="lenc-pad" style={{ padding: '64px 56px', background: 'var(--canvas-deep)', borderBottom: '1px solid var(--line)', display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 auto' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 6 }}>Nível da travessia</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 22, color: 'var(--bark)' }}>Intermediário</div>
        </div>
        <div style={{ width: 1, height: 40, background: 'var(--line)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--stone)', margin: 0, lineHeight: 1.6 }}>
            Caminhadas diárias de 6–8h em areia. Necessário condicionamento físico básico.{' '}
            <strong style={{ color: 'var(--bark)', fontWeight: 600 }}>Se você caminha regularmente, você consegue.</strong>
          </p>
        </div>
        <div style={{ flex: '0 0 auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['Areia grossa', '6–8h/dia', 'Sem altitude'].map(tag => (
            <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', padding: '5px 12px', border: '1px solid var(--line)', color: 'var(--stone)' }}>{tag}</span>
          ))}
        </div>
      </section>

      {/* ── INCLUÍDO / NÃO INCLUÍDO ── */}
      <section className="lenc-pad" style={{ padding: '96px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
        <div style={{ background: 'var(--canvas-deep)', padding: 40, border: '1px solid var(--line)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 18 }}>№ 05.a · Na mochila</div>
          <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 600, letterSpacing: '-.01em', margin: '0 0 20px', color: 'var(--bark)' }}>
            O que está <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>incluso.</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {INCLUIDO.map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line)', fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stone)', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--moss)', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>✓</span>
                <div>
                  <strong style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700, color: 'var(--bark)', display: 'block', marginBottom: 2 }}>{item.title}</strong>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: 40, border: '1px dashed var(--stone)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 18 }}>№ 05.b · Por sua conta</div>
          <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 600, letterSpacing: '-.01em', margin: '0 0 20px', color: 'var(--bark)' }}>
            O que <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--stone)' }}>não</span> está.
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {NAO_INCLUIDO.split(' · ').map(item => (
              <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stone)', lineHeight: 1.5 }}>
                <span style={{ flexShrink: 0, marginTop: 3 }}>—</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── O QUE LEVAR ── */}
      <section style={{ background: 'var(--canvas-deep)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="lenc-pad" style={{ padding: '80px 56px' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 14 }}>№ 06 · Preparo</div>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1, margin: 0, color: 'var(--bark)' }}>
              O que levar na{' '}
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>mochila</span>.
            </h2>
          </div>
          <GearChecklist />
        </div>
      </section>

      {/* ── PACOTES ── */}
      <section style={{ background: 'var(--canvas-deep)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="lenc-pad" style={{ padding: '96px 56px' }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 14 }}>№ 07 · Datas · Agosto 2026</div>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1, margin: 0, color: 'var(--bark)' }}>
              Escolha seu <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>pacote.</span>
            </h2>
          </div>

          <div className="lenc-packs" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 32 }}>
            {PACOTES.map(p => (
              <div key={p.label} className="lenc-pack" style={{ padding: '40px 32px', position: 'relative', background: p.featured ? 'var(--bark)' : 'var(--canvas)', borderTop: p.featured ? '3px solid var(--rust)' : '3px solid transparent', outline: p.featured ? '1px solid var(--rust)' : '1px solid var(--line)' }}>
                {p.featured && <div style={{ position: 'absolute', top: -13, left: 32, background: 'var(--rust)', color: 'var(--canvas)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', padding: '5px 14px' }}>Mais popular</div>}
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: p.featured ? 'var(--rust-soft)' : 'var(--stone)', marginBottom: 8 }}>{p.label}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 22, fontWeight: 700, color: p.featured ? 'var(--canvas)' : 'var(--bark)', marginBottom: 10 }}>{p.datas}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                  {[p.dias, p.km, p.oasis].map(v => (
                    <span key={v} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', padding: '3px 10px', color: p.featured ? 'var(--canvas)' : 'var(--stone)', border: `1px solid ${p.featured ? 'var(--forest-soft)' : 'var(--line)'}` }}>{v}</span>
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.6, color: p.featured ? 'var(--ashe)' : 'var(--stone)', marginBottom: 28 }}>{p.desc}</p>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-.02em', color: p.featured ? 'var(--canvas)' : 'var(--bark)', marginBottom: 4 }}>R$ 3.899</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.12em', color: p.featured ? 'var(--ashe-dim)' : 'var(--stone)', marginBottom: 28 }}>por pessoa · até 12x</div>
                <a href={waMsg(p.label, p.datas, 'R$ 3.899')} target="_blank" rel="noopener noreferrer" className="lenc-cta-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '14px 24px', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', background: p.featured ? 'var(--rust)' : 'transparent', color: p.featured ? 'var(--canvas)' : 'var(--bark)', border: `1px solid ${p.featured ? 'var(--rust)' : 'var(--bark)'}` }}>
                  Reservar esta data →
                </a>
              </div>
            ))}
          </div>

          {/* Política pagamento */}
          <div className="lenc-pol" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {POLITICA_PAGAMENTO.map(item => (
              <div key={item.title} style={{ padding: '20px 24px', background: 'var(--canvas)', border: '1px solid var(--line)' }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, color: 'var(--bark)', marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stone)', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUTROS PACOTES ── */}
      <section className="lenc-pad" style={{ padding: '64px 56px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 20 }}>Outros pacotes disponíveis</div>
        <div className="outros-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {OUTROS_PACOTES.map(p => (
            <div key={p.id} style={{ padding: '32px 36px', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 6 }}>{p.dias} · {p.km}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 20, color: 'var(--bark)', marginBottom: 8 }}>{p.label}</div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--stone)', lineHeight: 1.55, margin: 0 }}>{p.desc}</p>
              </div>
              <a href={WA_GERAL} target="_blank" rel="noopener noreferrer" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--rust)', textDecoration: 'none', border: '1px solid rgba(166,84,43,.3)', padding: '7px 16px' }}>
                {p.cta} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── POLÍTICA DE CANCELAMENTO ── */}
      <section style={{ background: 'var(--canvas-deep)', borderBottom: '1px solid var(--line)' }}>
        <div className="lenc-pad" style={{ padding: '64px 56px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 24 }}>Política de cancelamento</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 600 }}>
            {CANCELAMENTO.map((c, i) => (
              <div key={c.prazo} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '16px 0', borderTop: i === 0 ? '1px solid var(--line)' : '1px solid var(--line)', borderBottom: i === CANCELAMENTO.length - 1 ? '1px solid var(--line)' : 'none', gap: 24 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--stone)' }}>{c.prazo}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--bark)', textAlign: 'right' }}>{c.condicao}</div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.12em', color: 'var(--stone)', marginTop: 16 }}>
            Condições climáticas extremas: experiência remarcada sem custo adicional. Grupo mínimo: 4 pessoas para confirmar saída. Época ideal: junho a setembro.
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: '120px 56px', background: 'var(--forest)', color: 'var(--canvas)', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-hand)', fontSize: 42, color: 'var(--rust-soft)', transform: 'rotate(-2deg)', display: 'inline-block', marginBottom: 8 }}>bora?</div>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(48px, 8vw, 88px)', letterSpacing: '-.04em', lineHeight: 0.92, margin: 0 }}>
          Sua próxima<br />
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--rust-soft)' }}>expedição</span>
        </h2>
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--ashe)', marginTop: 24, maxWidth: '50ch', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
          Vagas limitadas a 10 pessoas por turma. Agosto 2026 — reserve com antecedência.
        </p>
        <a href={WA_GERAL} target="_blank" rel="noopener noreferrer" className="lenc-cta-btn" style={{ marginTop: 40, display: 'inline-block', padding: '18px 40px', background: 'var(--rust-soft)', color: 'var(--forest)', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', textDecoration: 'none' }}>
          Falar no WhatsApp →
        </a>
        <div style={{ marginTop: 28, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', color: 'var(--ashe-dim)' }}>
          Em parceria com @lencoisexperience · @livinglencois
        </div>
      </section>

      {/* ── GALERIA ── */}
      <div className="lenc-four" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
        {FOTOS_GALERIA.slice(8, 12).map((src, i) => (
          <div key={i} className="lenc-img-wrap" style={{ aspectRatio: '1', overflow: 'hidden' }}>
            <img src={src} alt="" className="lenc-trip-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        ))}
      </div>

      <SiteFooter dark={false} />
    </main>
  )
}
