'use client'

import { useState } from 'react'
import SiteNav from '@/components/nav'
import SiteFooter from '@/components/site-footer'

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Tier = 'signature' | 'collectors' | 'open'

interface SizeOption {
  id: string
  label: string
  price: string
  priceNum: number
}

interface Print {
  id: string
  img: string
  title: string
  loc: string
  tier: Tier
  sizes: SizeOption[]
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const TIER_META: Record<Tier, { label: string; limit: string; bg: string; color: string }> = {
  signature: { label: 'Signature Collection', limit: 'Edição limitada — 10 prints', bg: '#5C1E1E', color: '#F5EDD6' },
  collectors: { label: 'Collectors Edition',  limit: 'Edição limitada — 25 prints', bg: '#1A2B4A', color: '#C8D8F0' },
  open:       { label: 'Open Edition',         limit: 'Sem limite de tiragem',       bg: '#1A2E1A', color: '#B8D4B8' },
}

const PRINTS: Print[] = [
  // ── SIGNATURE ──────────────────────────────────────────────────────────────
  {
    id: 'camadas-beleza',
    img: '/images/quadros/2 CAMADAS DE BELEZA-LENCOIS.jpg',
    title: '2 Camadas de Beleza',
    loc: 'Lençóis Maranhenses, MA',
    tier: 'signature',
    sizes: [
      { id: '60x90',  label: '60×90 cm',  price: 'R$ 2.900', priceNum: 2900 },
      { id: '80x120', label: '80×120 cm', price: 'R$ 4.900', priceNum: 4900 },
    ],
  },
  {
    id: 'a-curva',
    img: '/images/quadros/A CURVA-LENCOIS.jpg',
    title: 'A Curva',
    loc: 'Lençóis Maranhenses, MA',
    tier: 'signature',
    sizes: [
      { id: '60x90',  label: '60×90 cm',  price: 'R$ 2.900', priceNum: 2900 },
      { id: '80x120', label: '80×120 cm', price: 'R$ 4.900', priceNum: 4900 },
    ],
  },
  {
    id: 'reflexo-carhuacocha',
    img: '/images/quadros/REFLEXO_CARHUACOCHA-HUAYHUASH.jpg',
    title: 'Reflexo Carhuacocha',
    loc: 'Huayhuash, Peru',
    tier: 'signature',
    sizes: [
      { id: '60x90',  label: '60×90 cm',  price: 'R$ 2.900', priceNum: 2900 },
      { id: '80x120', label: '80×120 cm', price: 'R$ 4.900', priceNum: 4900 },
    ],
  },
  {
    id: 'las-3-lagunas',
    img: '/images/quadros/LAS 3 LAGUNAS-HUAYHUASH.jpg',
    title: 'Las 3 Lagunas',
    loc: 'Huayhuash, Peru',
    tier: 'signature',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  price: 'R$ 1.900', priceNum: 1900 },
      { id: '60x90',  label: '60×90 cm',  price: 'R$ 2.900', priceNum: 2900 },
    ],
  },
  {
    id: 'sol-toca-tudo',
    img: '/images/quadros/O SOL TOCA TUDO_LENCOIS.jpg',
    title: 'O Sol Toca Tudo',
    loc: 'Lençóis Maranhenses, MA',
    tier: 'signature',
    sizes: [
      { id: '60x90',  label: '60×90 cm',  price: 'R$ 2.900', priceNum: 2900 },
      { id: '80x120', label: '80×120 cm', price: 'R$ 4.900', priceNum: 4900 },
    ],
  },

  // ── COLLECTORS ─────────────────────────────────────────────────────────────
  {
    id: 'caminhos-agua',
    img: '/images/quadros/CAMINHOS DA AGUA_VISTA-ZENITAL-LENCOIS.jpg',
    title: 'Caminhos da Água',
    loc: 'Lençóis Maranhenses, MA',
    tier: 'collectors',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  price: 'R$ 1.590', priceNum: 1590 },
      { id: '60x90',  label: '60×90 cm',  price: 'R$ 2.390', priceNum: 2390 },
    ],
  },
  {
    id: 'el-passo',
    img: '/images/quadros/EL_PASSO_SANTA_ROSA-HUAYHUASH.jpg',
    title: 'El Passo Santa Rosa',
    loc: 'Huayhuash, Peru',
    tier: 'collectors',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  price: 'R$ 1.590', priceNum: 1590 },
      { id: '60x90',  label: '60×90 cm',  price: 'R$ 2.390', priceNum: 2390 },
    ],
  },
  {
    id: 'la-montana',
    img: '/images/quadros/LA-MOTANA-VISTA-PICOMATEO.jpg',
    title: 'La Montaña — Vista Pico Mateo',
    loc: 'Huayhuash, Peru',
    tier: 'collectors',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  price: 'R$ 1.590', priceNum: 1590 },
      { id: '60x90',  label: '60×90 cm',  price: 'R$ 2.390', priceNum: 2390 },
    ],
  },
  {
    id: 'betania-paradisiaca',
    img: '/images/quadros/BETANIA PARADISIACA-LENCOIS.jpg',
    title: 'Betânia Paradisíaca',
    loc: 'Lençóis Maranhenses, MA',
    tier: 'collectors',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  price: 'R$ 1.590', priceNum: 1590 },
      { id: '60x90',  label: '60×90 cm',  price: 'R$ 2.390', priceNum: 2390 },
    ],
  },
  {
    id: 'primeiros-minutos',
    img: '/images/quadros/OS PRIMEIROS MINUTOS DO SOL-LENCOIS.jpg',
    title: 'Os Primeiros Minutos do Sol',
    loc: 'Lençóis Maranhenses, MA',
    tier: 'collectors',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  price: 'R$ 1.590', priceNum: 1590 },
      { id: '60x90',  label: '60×90 cm',  price: 'R$ 2.390', priceNum: 2390 },
    ],
  },
  {
    id: 'camp-jahuacocha',
    img: '/images/quadros/CAMP-JAHUACOCHA-HUAYHUASH.jpg',
    title: 'Camp Jahuacocha',
    loc: 'Huayhuash, Peru',
    tier: 'collectors',
    sizes: [
      { id: '30x40',  label: '30×40 cm',  price: 'R$ 890',   priceNum: 890 },
      { id: '50x70',  label: '50×70 cm',  price: 'R$ 1.590', priceNum: 1590 },
    ],
  },
  {
    id: 'observando-infinito',
    img: '/images/quadros/OBSERVANDO O INFINITO-LENCOIS.jpg',
    title: 'Observando o Infinito',
    loc: 'Lençóis Maranhenses, MA',
    tier: 'collectors',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  price: 'R$ 1.590', priceNum: 1590 },
      { id: '60x90',  label: '60×90 cm',  price: 'R$ 2.390', priceNum: 2390 },
    ],
  },

  // ── OPEN EDITION ───────────────────────────────────────────────────────────
  {
    id: 'a-casa',
    img: '/images/quadros/A CASA-LENCOIS.jpg',
    title: 'A Casa',
    loc: 'Lençóis Maranhenses, MA',
    tier: 'open',
    sizes: [
      { id: '30x40', label: '30×40 cm', price: 'R$ 590', priceNum: 590 },
      { id: '50x70', label: '50×70 cm', price: 'R$ 990', priceNum: 990 },
    ],
  },
  {
    id: 'a-despedida',
    img: '/images/quadros/A DESPEDIDA-LENCOIS.jpg',
    title: 'A Despedida',
    loc: 'Lençóis Maranhenses, MA',
    tier: 'open',
    sizes: [
      { id: '30x40', label: '30×40 cm', price: 'R$ 590', priceNum: 590 },
      { id: '50x70', label: '50×70 cm', price: 'R$ 990', priceNum: 990 },
    ],
  },
  {
    id: 'marcas-passado',
    img: '/images/quadros/MARCAS DO PASSADO-LENCOIS.jpg',
    title: 'Marcas do Passado',
    loc: 'Lençóis Maranhenses, MA',
    tier: 'open',
    sizes: [
      { id: '30x40', label: '30×40 cm', price: 'R$ 590', priceNum: 590 },
      { id: '50x70', label: '50×70 cm', price: 'R$ 990', priceNum: 990 },
    ],
  },
  {
    id: 'betania-fala',
    img: '/images/quadros/BETANIA FALA-LENCOIS.jpg',
    title: 'Betânia Fala',
    loc: 'Lençóis Maranhenses, MA',
    tier: 'open',
    sizes: [
      { id: '30x40', label: '30×40 cm', price: 'R$ 590', priceNum: 590 },
      { id: '50x70', label: '50×70 cm', price: 'R$ 990', priceNum: 990 },
    ],
  },
  {
    id: 'observadora-arara',
    img: '/images/quadros/A-OBSERVADORA-ARARA-CANINDE-RONDONIA.jpg',
    title: 'A Observadora — Arara-Canindé',
    loc: 'Rondônia',
    tier: 'open',
    sizes: [
      { id: '30x40', label: '30×40 cm', price: 'R$ 590', priceNum: 590 },
      { id: '50x70', label: '50×70 cm', price: 'R$ 990', priceNum: 990 },
    ],
  },
  {
    id: 'acampamento-gashpapampa',
    img: '/images/quadros/ACAMPAMENTO_GASHPAPAMPA-HUAYHUASH.jpg',
    title: 'Acampamento Gashpapampa',
    loc: 'Huayhuash, Peru',
    tier: 'open',
    sizes: [
      { id: '30x40', label: '30×40 cm', price: 'R$ 590', priceNum: 590 },
      { id: '50x70', label: '50×70 cm', price: 'R$ 990', priceNum: 990 },
    ],
  },
]

const MATERIALS = [
  { id: 'photo-rag',  label: 'Fine Art — Photo Rag',  desc: 'Hahnemühle 308g · 100% algodão · fosco', tag: 'recomendado' },
  { id: 'baryta',     label: 'Fine Art — Baryta',      desc: 'Hahnemühle 315g · semi-brilhante · cores vivas', tag: '' },
  { id: 'canvas',     label: 'Canvas',                 desc: 'Tecido esticado em chassi de madeira · sem moldura', tag: '' },
]

const FRAMES = [
  { id: 'preta',   label: 'Moldura preta',    desc: 'Madeira maciça laqueada', extra: 'incluso' },
  { id: 'branca',  label: 'Moldura branca',   desc: 'Madeira maciça laqueada', extra: 'incluso' },
  { id: 'natural', label: 'Moldura natural',  desc: 'Madeira maciça carvalho', extra: 'incluso' },
  { id: 'sem',     label: 'Sem moldura',      desc: 'Só a impressão, sem acabamento', extra: '' },
]

const WA_BASE = 'https://wa.me/5511999999999?text='

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: Tier }) {
  const meta = TIER_META[tier]
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      background: meta.bg,
      color: meta.color,
      fontFamily: 'var(--font-mono)',
      fontSize: 9,
      letterSpacing: '.2em',
      textTransform: 'uppercase',
      fontWeight: 600,
    }}>
      {meta.limit}
    </span>
  )
}

function PrintCard({ p, onOpen }: { p: Print; onOpen: () => void }) {
  const minPrice = p.sizes[0].price
  return (
    <article className="qcard" onClick={onOpen} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', background: 'var(--canvas)', border: '1px solid var(--line)' }}>
      {/* image area */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--canvas-deep)' }}>
        <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 2 }}>
          <TierBadge tier={p.tier} />
        </div>
        <div style={{ padding: '24px 24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 260 }}>
          {/* simulated frame */}
          <div className="qframe" style={{
            background: '#1A1612',
            padding: 10,
            boxShadow: '0 12px 32px rgba(0,0,0,.35)',
            width: '100%',
            aspectRatio: '3/2',
            transition: 'transform .6s cubic-bezier(.2,.7,.2,1)',
          }}>
            <div style={{ padding: 4, background: '#F0EBE0', height: '100%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.img}
                alt={p.title}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* card body */}
      <div style={{ padding: '18px 20px 22px', borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 6 }}>
          {p.loc}
        </div>
        <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18, letterSpacing: '-.02em', lineHeight: 1.1, margin: 0, color: 'var(--bark)', flex: 1 }}>
          {p.title}
        </h3>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--stone)' }}>a partir de</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 20, letterSpacing: '-.02em', color: 'var(--bark)', marginTop: 2 }}>{minPrice}</div>
          </div>
          <span className="qcta" style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--rust)', transition: 'transform .3s cubic-bezier(.2,.7,.2,1)' }}>
            Encomendar →
          </span>
        </div>
      </div>
    </article>
  )
}

function TierSection({ tier, prints, onOpen }: { tier: Tier; prints: Print[]; onOpen: (p: Print) => void }) {
  const meta = TIER_META[tier]
  return (
    <section style={{ marginBottom: 80 }}>
      {/* tier header */}
      <div style={{ padding: '32px 0 28px', borderBottom: '1px solid var(--line)', marginBottom: 36, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <TierBadge tier={tier} />
          <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 32, letterSpacing: '-.03em', margin: '10px 0 0', color: 'var(--bark)' }}>
            {meta.label}
          </h2>
        </div>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--stone)' }}>
          {prints.length} obras disponíveis
        </span>
      </div>

      <div className="qgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
        {prints.map(p => (
          <PrintCard key={p.id} p={p} onOpen={() => onOpen(p)} />
        ))}
      </div>
    </section>
  )
}

// ─── MODAL ───────────────────────────────────────────────────────────────────

function OrderModal({ print, onClose }: { print: Print; onClose: () => void }) {
  const [sizeId, setSizeId] = useState(print.sizes[0].id)
  const [materialId, setMaterialId] = useState('photo-rag')
  const [frameId, setFrameId] = useState('preta')
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '', cidade: '', obs: '' })

  const selectedSize = print.sizes.find(s => s.id === sizeId)!
  const selectedMaterial = MATERIALS.find(m => m.id === materialId)!
  const selectedFrame = FRAMES.find(f => f.id === frameId)!
  const tierMeta = TIER_META[print.tier]

  function buildWaMessage() {
    return encodeURIComponent(
      `Olá! Tenho interesse em encomendar um quadro fine art.\n\n` +
      `*Obra:* ${print.title}\n` +
      `*Tamanho:* ${selectedSize.label}\n` +
      `*Material:* ${selectedMaterial.label}\n` +
      `*Moldura:* ${selectedFrame.label}\n` +
      `*Valor:* ${selectedSize.price}\n\n` +
      `*Nome:* ${form.nome}\n` +
      `*Cidade:* ${form.cidade}\n` +
      (form.obs ? `*Obs:* ${form.obs}` : '')
    )
  }

  function handleSubmit() {
    window.open(WA_BASE + buildWaMessage(), '_blank')
    setStep(2)
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,.8)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: 1060, maxWidth: '100%', maxHeight: '92vh', background: 'var(--canvas)', color: 'var(--bark)', display: 'grid', gridTemplateColumns: '1.1fr 1fr', overflow: 'auto', position: 'relative' }}
        className="qmodal"
      >
        {/* close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 18, right: 18, width: 36, height: 36, background: 'var(--bark)', color: 'var(--canvas)', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, fontFamily: 'var(--font-ui)' }}
        >×</button>

        {/* LEFT: photo preview */}
        <div style={{ background: 'var(--canvas-deep)', padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, minHeight: 480 }}>
          <div style={{
            background: frameId === 'branca' ? '#FFFFFF' : frameId === 'natural' ? '#C9B48A' : '#1A1612',
            padding: 14,
            boxShadow: '0 24px 60px rgba(0,0,0,.45)',
            width: '85%',
            aspectRatio: '3/2',
            transition: 'background .4s',
          }}>
            <div style={{ padding: 8, background: '#F4EEE2', height: '100%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={print.img} alt={print.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-hand)', fontSize: 22, color: 'var(--stone)', transform: 'rotate(-2deg)' }}>
            preview · {selectedSize.label}
          </div>
          <div style={{ display: 'inline-block' }}>
            <TierBadge tier={print.tier} />
          </div>
        </div>

        {/* RIGHT: form */}
        <div style={{ padding: '40px 36px 36px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {step === 0 && (
            <>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 10 }}>
                {tierMeta.limit}
              </div>
              <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 28, letterSpacing: '-.03em', margin: 0, lineHeight: 1, color: 'var(--bark)' }}>
                {print.title}
              </h3>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--stone)', marginTop: 6, marginBottom: 24 }}>
                {print.loc}
              </div>

              {/* size picker */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 10 }}>01 · Tamanho</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {print.sizes.map(sz => (
                    <button
                      key={sz.id}
                      onClick={() => setSizeId(sz.id)}
                      style={{
                        padding: '12px 14px',
                        border: `1px solid ${sizeId === sz.id ? 'var(--bark)' : 'var(--line)'}`,
                        background: sizeId === sz.id ? 'var(--bark)' : 'transparent',
                        color: sizeId === sz.id ? 'var(--canvas)' : 'var(--bark)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontFamily: 'var(--font-ui)',
                        transition: 'all .2s',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{sz.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>{sz.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* material picker */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 10 }}>02 · Material de impressão</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {MATERIALS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMaterialId(m.id)}
                      style={{
                        padding: '10px 14px',
                        border: `1px solid ${materialId === m.id ? 'var(--bark)' : 'var(--line)'}`,
                        background: materialId === m.id ? 'var(--bark)' : 'transparent',
                        color: materialId === m.id ? 'var(--canvas)' : 'var(--bark)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontFamily: 'var(--font-ui)',
                        transition: 'all .2s',
                        textAlign: 'left',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{m.label}</div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 11, opacity: 0.7, marginTop: 2 }}>{m.desc}</div>
                      </div>
                      {m.tag && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', flexShrink: 0, opacity: 0.7 }}>{m.tag}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* frame picker */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 10 }}>03 · Moldura</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {FRAMES.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFrameId(f.id)}
                      style={{
                        padding: '10px 14px',
                        border: `1px solid ${frameId === f.id ? 'var(--bark)' : 'var(--line)'}`,
                        background: frameId === f.id ? 'var(--bark)' : 'transparent',
                        color: frameId === f.id ? 'var(--canvas)' : 'var(--bark)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontFamily: 'var(--font-ui)',
                        transition: 'all .2s',
                        textAlign: 'left',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{f.label}</div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 11, opacity: 0.7, marginTop: 2 }}>{f.desc}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, flexShrink: 0, opacity: 0.6 }}>{f.extra}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)' }}>Valor total</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 26, letterSpacing: '-.03em', color: 'var(--bark)', marginTop: 2 }}>
                    {selectedSize.price}
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--stone)', marginTop: 2 }}>
                    Inclui impressão + moldura + certificado
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  style={{ padding: '13px 22px', background: 'var(--bark)', color: 'var(--canvas)', border: 'none', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Encomendar →
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 10 }}>
                Passo 2 de 2
              </div>
              <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 28, letterSpacing: '-.03em', margin: '0 0 6px', color: 'var(--bark)' }}>
                Seus dados
              </h3>
              <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--stone)', margin: '0 0 20px', lineHeight: 1.5 }}>
                Você não paga agora. Em até 24h envio orçamento com link de pagamento e prazo exato.
              </p>

              <div style={{ padding: '12px 16px', background: 'var(--canvas-deep)', border: '1px solid var(--line)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14, color: 'var(--bark)' }}>{print.title}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stone)', marginTop: 3 }}>
                    {selectedSize.label} · {selectedMaterial.label} · {selectedFrame.label}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18, color: 'var(--bark)', flexShrink: 0 }}>{selectedSize.price}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {([
                  ['Nome completo', 'text', 'nome', ''],
                  ['Email', 'email', 'email', ''],
                  ['WhatsApp', 'tel', 'whatsapp', '+55 11 9...'],
                  ['Cidade de entrega', 'text', 'cidade', 'São Paulo, SP'],
                ] as const).map(([label, type, field, ph]) => (
                  <div key={field}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', display: 'block', marginBottom: 7 }}>{label}</label>
                    <input
                      type={type}
                      placeholder={ph}
                      value={form[field]}
                      onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                      style={{ width: '100%', padding: '9px 0 7px', border: 'none', borderBottom: '1px solid var(--bark)', background: 'transparent', fontFamily: 'var(--font-serif)', fontSize: 16, outline: 'none', color: 'var(--bark)', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', display: 'block', marginBottom: 7 }}>Observações (opcional)</label>
                  <textarea
                    placeholder="Presente, dedicatória, urgência..."
                    value={form.obs}
                    onChange={e => setForm(prev => ({ ...prev, obs: e.target.value }))}
                    style={{ width: '100%', padding: '9px 0 7px', border: 'none', borderBottom: '1px solid var(--bark)', background: 'transparent', fontFamily: 'var(--font-serif)', fontSize: 15, outline: 'none', resize: 'none', minHeight: 56, color: 'var(--bark)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setStep(0)}
                  style={{ padding: '12px 18px', border: '1px solid var(--bark)', color: 'var(--bark)', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer' }}
                >← Voltar</button>
                <button
                  onClick={handleSubmit}
                  style={{ flex: 1, padding: '13px 20px', background: '#25D366', color: '#fff', border: 'none', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Enviar via WhatsApp
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontFamily: 'var(--font-hand)', fontSize: 80, color: 'var(--rust)', lineHeight: 1, transform: 'rotate(-3deg)' }}>obrigado!</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 36, letterSpacing: '-.04em', marginTop: 20, lineHeight: 0.95, textTransform: 'uppercase', color: 'var(--bark)' }}>
                Pedido enviado.
              </div>
              <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--stone)', marginTop: 20, maxWidth: '34ch', lineHeight: 1.6 }}>
                Você será redirecionado ao WhatsApp. Respondo em até 24h com todos os detalhes.
              </p>
              <button
                onClick={onClose}
                style={{ marginTop: 32, padding: '13px 26px', border: '1px solid var(--bark)', color: 'var(--bark)', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer' }}
              >Fechar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  { q: 'Qual a diferença entre Edição Limitada e Open Edition?', a: 'As Signature (10 prints) e Collectors (25 prints) são tiragens numeradas e certificadas individualmente — quando esgotarem, não serão reeditadas. As Open Edition não têm limite de quantidade, mas são igualmente assinadas e impressas no mesmo papel fine art.' },
  { q: 'Posso escolher a cor da moldura?', a: 'Sim. Oferecemos moldura de madeira maciça nas opções: preta laqueada, branca laqueada ou madeira natural (carvalho). O preço inclui a moldura no acabamento escolhido.' },
  { q: 'Como funciona o envio?', a: 'Cada quadro é embalado individualmente com espuma de polietileno e caixas dupla-onda reforçadas. O frete é calculado conforme o CEP e informado no orçamento. Enviamos para todo o Brasil.' },
  { q: 'As fotos são assinadas?', a: 'Sim. Todas as obras incluem assinatura à mão e o Certificado de Autenticidade Hahnemühle — documento numerado com holograma que acompanha a obra como garantia de originalidade.' },
  { q: 'Posso encomendar um tamanho diferente dos listados?', a: 'Sim, sob consulta. Entre em contato via WhatsApp ou e-mail descrevendo o tamanho desejado e preparamos um orçamento personalizado.' },
  { q: 'Qual o prazo de produção e entrega?', a: 'Produção: 10 a 15 dias úteis após confirmação do pagamento. Entrega: 3 a 7 dias úteis dependendo da região. Prazo total estimado: 15 a 25 dias úteis.' },
]

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', textAlign: 'left', padding: '20px 0', background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 16, letterSpacing: '-.01em', color: 'var(--bark)',
            }}
          >
            {item.q}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: 'var(--stone)', flexShrink: 0, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform .3s', display: 'block' }}>+</span>
          </button>
          {open === i && (
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.7, color: 'var(--stone)', margin: '0 0 20px', maxWidth: '68ch' }}>
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function QuadrosPage() {
  const [modal, setModal] = useState<Print | null>(null)

  const byTier = (t: Tier) => PRINTS.filter(p => p.tier === t)

  return (
    <main style={{ background: 'var(--canvas)', color: 'var(--bark)', fontFamily: 'var(--font-ui)', minHeight: '100vh' }}>
      <style>{`
        .qcard { transition: transform .5s cubic-bezier(.2,.7,.2,1), box-shadow .5s cubic-bezier(.2,.7,.2,1); }
        .qcard:hover { transform: translateY(-5px); box-shadow: 0 24px 48px rgba(30,42,24,.12); }
        .qcard:hover .qframe { transform: scale(1.03); }
        .qcard:hover .qcta { transform: translateX(4px); }
        @media(max-width:960px){ .qgrid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; } }
        @media(max-width:580px){ .qgrid { grid-template-columns: 1fr !important; } .qmodal { grid-template-columns: 1fr !important; } }
        @media(max-width:720px){ .qmodal { grid-template-columns: 1fr !important; } }
      `}</style>

      <SiteNav dark={false} />

      {/* ── HERO ── */}
      <header style={{ padding: '140px 56px 64px', borderBottom: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 20, fontWeight: 500 }}>
          № 04 · Fine Art Prints · Assinados & Numerados
        </div>
        <h1 style={{ margin: 0, lineHeight: 0.9 }}>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 56, color: 'var(--rust)', transform: 'rotate(-2deg)', display: 'inline-block', letterSpacing: '.01em', marginBottom: 8 }}>
            para a sua parede—
          </span>
          <br />
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(72px, 14vw, 200px)', letterSpacing: '-.05em', lineHeight: 0.86, display: 'block', color: 'var(--bark)', textTransform: 'uppercase' }}>
            QUADROS.
          </span>
        </h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 20, color: 'var(--stone)', marginTop: 32, maxWidth: '54ch', lineHeight: 1.6 }}>
          Impressão fine art em papel Hahnemühle Photo Rag 308g — 100% algodão. Cada obra é numerada, assinada à mão e acompanha certificado de autenticidade com selo holográfico.
        </p>
      </header>

      {/* ── SOBRE OS PRINTS ── */}
      <section style={{ padding: '72px 56px', background: 'var(--canvas-deep)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start', maxWidth: 1200 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 16 }}>O que você está comprando</div>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 40, letterSpacing: '-.03em', margin: '0 0 24px', lineHeight: 1 }}>
              Qualidade de museu.<br />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>Para a sua casa.</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, lineHeight: 1.75, color: 'var(--stone)' }}>
              Cada quadro é produzido sob encomenda em laboratório fine art especializado, com materiais certificados que garantem durabilidade superior a 100 anos sem desbotamento.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              ['Papel', 'Hahnemühle Photo Rag 308g — 100% algodão, livre de ácido'],
              ['Tinta', 'Pigmentada certificada — durabilidade superior a 100 anos'],
              ['Moldura', 'Madeira maciça laqueada — preta, branca ou natural'],
              ['Vidro', 'Antirreflexo 2mm — proteção sem comprometer a imagem'],
              ['Passepartout', 'Livre de ácido — preserva a integridade da impressão'],
              ['Certificado', 'Hahnemühle com holograma — numerado e assinado pelo artista'],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '16px 0', borderBottom: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '140px 1fr', gap: 20, alignItems: 'baseline' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--stone)', fontWeight: 600 }}>{k}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--bark)', lineHeight: 1.4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLEÇÕES ── */}
      <div style={{ padding: '72px 56px 32px' }}>
        <TierSection tier="signature" prints={byTier('signature')} onOpen={setModal} />
        <TierSection tier="collectors" prints={byTier('collectors')} onOpen={setModal} />
        <TierSection tier="open" prints={byTier('open')} onOpen={setModal} />
      </div>

      {/* ── COMO FUNCIONA ── */}
      <section style={{ padding: '72px 56px', background: 'var(--canvas-deep)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 16 }}>Processo</div>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 40, letterSpacing: '-.03em', margin: '0 0 48px', lineHeight: 1 }}>
          Como funciona
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}>
          {[
            ['01', 'Escolha', 'Selecione a obra, o tamanho e a cor da moldura diretamente nesta página.'],
            ['02', 'Encomenda', 'Finalize pelo WhatsApp — sem pagamento agora. Em até 24h envio o orçamento completo.'],
            ['03', 'Produção', 'Impressão artesanal em laboratório fine art certificado. Prazo: 10 a 15 dias úteis.'],
            ['04', 'Entrega', 'Embalagem reforçada com espuma e caixa dupla-onda. Envio para todo o Brasil.'],
          ].map(([num, title, desc]) => (
            <div key={num}>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 72, letterSpacing: '-.05em', lineHeight: 0.9, color: 'var(--line)', marginBottom: 16 }}>{num}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 18, letterSpacing: '-.01em', color: 'var(--bark)', marginBottom: 10 }}>{title}</div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.65, color: 'var(--stone)', margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CREDIBILIDADE ── */}
      <section style={{ padding: '48px 56px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
        {[
          ['Hahnemühle Certified', 'Papel e certificado autênticos'],
          ['+100 anos', 'Durabilidade das tintas pigmentadas'],
          ['Assinado & Numerado', 'Cada obra tem identidade única'],
          ['Laboratório fine art', 'Impressão profissional especializada'],
        ].map(([title, desc]) => (
          <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, background: 'var(--canvas-deep)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: 22, color: 'var(--rust)' }}>✓</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13, letterSpacing: '-.01em', color: 'var(--bark)' }}>{title}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--stone)', marginTop: 2 }}>{desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '72px 56px 96px', maxWidth: 860 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 16 }}>Dúvidas frequentes</div>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 40, letterSpacing: '-.03em', margin: '0 0 40px', lineHeight: 1 }}>
          FAQ
        </h2>
        <FaqAccordion />
      </section>

      {/* ── WA FLOAT ── */}
      <a
        href={WA_BASE + encodeURIComponent('Olá! Tenho interesse em um quadro fine art.')}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 100,
          width: 56, height: 56, borderRadius: '50%', background: '#25D366',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,.2)',
          transition: 'transform .3s, box-shadow .3s',
        }}
        className="wa-btn"
        aria-label="Contato via WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      <SiteFooter dark={false} />

      {modal && <OrderModal print={modal} onClose={() => setModal(null)} />}
    </main>
  )
}
