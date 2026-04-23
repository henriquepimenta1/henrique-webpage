'use client'

import { useState } from 'react'
import SiteNav from '@/components/nav'
import SiteFooter from '@/components/site-footer'

interface Print {
  id: string
  img: string
  title: string
  loc: string
  price: string
  limit: string | 'open'
}

const PRINTS: Print[] = [
  { id: 'silhueta',   img: '/images/lencois/DJI_20250828174205_0403_D-HDR.jpg',      title: 'Silhueta ao fim do dia', loc: 'Lençóis, 2025',   price: 'R$ 690', limit: '25' },
  { id: 'nascer',     img: '/images/lencois/DSC01675.jpg',                            title: 'Nascer do sol',          loc: 'Lençóis, 2025',   price: 'R$ 890', limit: '15' },
  { id: 'feixe',      img: '/images/lencois/DJI_20250826043905_0121_D.jpg',           title: 'Feixe de luz',           loc: 'Lençóis, 2025',   price: 'R$ 990', limit: '10' },
  { id: 'poente',     img: '/images/lencois/DJI_20250828175706_0461_D-Edit-2.jpg',   title: 'Poente dourado',         loc: 'Lençóis, 2025',   price: 'R$ 790', limit: '20' },
  { id: 'chegada',    img: '/images/lencois/DJI_20250828042744_0378_D.jpg',           title: 'Chegada triunfal',       loc: 'Lençóis, 2025',   price: 'R$ 490', limit: 'open' },
  { id: 'solidao',    img: '/images/lencois/DSC01958.jpg',                            title: 'Solidão',                loc: 'Lençóis, 2025',   price: 'R$ 490', limit: 'open' },
  { id: 'lagoa',      img: '/images/lencois/DJI_20250829042015_0506_D-HDR.jpg',       title: 'Lagoa espetacular',      loc: 'Lençóis, 2025',   price: 'R$ 790', limit: '15' },
  { id: 'camara',     img: '/images/lencois/DSC03215.jpg',                            title: 'Câmera na mão',          loc: 'Lençóis, 2025',   price: 'R$ 490', limit: 'open' },
]

const SIZES = [
  { id: '30x45',  label: '30×45 cm',   price: 'R$ 490' },
  { id: '50x75',  label: '50×75 cm',   price: 'R$ 690' },
  { id: '70x105', label: '70×105 cm',  price: 'R$ 990' },
  { id: '100x150',label: '100×150 cm', price: 'R$ 1.490' },
]

const FRAMES = [
  { id: 'sem',     label: 'Sem moldura',    desc: 'papel fine art apenas', extra: 'incluso' },
  { id: 'natural', label: 'Madeira natural', desc: 'carvalho, seção 3cm',  extra: '+ R$ 180' },
  { id: 'preta',   label: 'Madeira preta',   desc: 'fosca, seção 3cm',     extra: '+ R$ 180' },
]

function PrintCard({ p, onOpen }: { p: Print; onOpen: () => void }) {
  return (
    <article
      className="quad-card"
      onClick={onOpen}
      style={{
        background: 'var(--canvas)', border: '1px solid var(--line)',
        display: 'flex', flexDirection: 'column', cursor: 'pointer',
        transition: 'transform .5s cubic-bezier(.2,.7,.2,1), box-shadow .5s cubic-bezier(.2,.7,.2,1)',
      }}
    >
      {/* frame area */}
      <div style={{ padding: '28px 28px 36px', background: 'var(--canvas-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '4/5', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 16, left: 16,
          padding: '5px 10px',
          background: p.limit === 'open' ? 'transparent' : 'var(--bark)',
          color: p.limit === 'open' ? 'var(--bark)' : 'var(--canvas)',
          border: p.limit === 'open' ? '1px solid var(--bark)' : 'none',
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase',
        }}>
          {p.limit === 'open' ? 'open edition' : `ed. lim. ${p.limit} un.`}
        </div>
        <div className="quad-inner" style={{ background: 'var(--canvas)', padding: 10, boxShadow: '0 16px 32px rgba(30,42,24,.18)', width: '100%', height: '100%', transition: 'transform .6s cubic-bezier(.2,.7,.2,1)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      </div>

      {/* card body */}
      <div style={{ padding: '20px 24px 24px', borderTop: '1px solid var(--line)' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 24, margin: 0, lineHeight: 1.1, color: 'var(--bark)' }}>{p.title}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)' }}>{p.loc}</div>
        </div>
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px dashed var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)' }}>a partir de</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 22, letterSpacing: '-.02em', color: 'var(--bark)' }}>{p.price}</div>
          </div>
          <span className="quad-cta" style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--rust)', display: 'flex', alignItems: 'center', gap: 5, transition: 'transform .4s cubic-bezier(.2,.7,.2,1)' }}>
            Encomendar <span style={{ fontFamily: 'var(--font-hand)', fontSize: 20 }}>→</span>
          </span>
        </div>
      </div>
    </article>
  )
}

export default function QuadrosPage() {
  const [modal, setModal] = useState<Print | null>(null)
  const [size, setSize] = useState('50x75')
  const [frame, setFrame] = useState('natural')
  const [step, setStep] = useState(0)

  const openModal = (p: Print) => { setModal(p); setStep(0); setSize('50x75'); setFrame('natural') }
  const closeModal = () => setModal(null)

  const selectedSize = SIZES.find(s => s.id === size)!
  const selectedFrame = FRAMES.find(f => f.id === frame)!

  return (
    <main style={{ background: 'var(--canvas)', color: 'var(--bark)', fontFamily: 'var(--font-ui)' }}>
      <style>{`
        .quad-card:hover { transform: translateY(-6px); box-shadow: 0 30px 60px rgba(30,42,24,.12); }
        .quad-card:hover .quad-inner { transform: scale(1.03); }
        .quad-card:hover .quad-cta { transform: translateX(4px); }
        .quad-chip { padding: 7px 14px; border: 1px solid var(--line); color: var(--stone); background: transparent; font-size: 11px; letter-spacing: .12em; cursor: pointer; font-family: var(--font-ui); }
        .quad-chip-on { background: var(--bark); color: var(--canvas); border-color: var(--bark); }
        @media(max-width:900px){
          .quad-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
        }
        @media(max-width:560px){
          .quad-grid { grid-template-columns: 1fr !important; }
          .quad-header { padding: 100px 24px 48px !important; }
          .quad-toolbar { padding: 16px 24px !important; }
          .quad-pad { padding: 40px 24px 80px !important; }
        }
      `}</style>

      <SiteNav dark={false} />

      {/* ── HEADER ── */}
      <header className="quad-header" style={{ padding: '140px 56px 56px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 16, fontWeight: 500 }}>
          № 04 · Impressos autorais
        </div>
        <h1 style={{ margin: 0, lineHeight: 0.88 }}>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 72, color: 'var(--rust)', transform: 'rotate(-3deg)', display: 'inline-block', marginRight: 20, letterSpacing: '.01em' }}>
            pra sua parede
          </span>
          <br />
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(80px, 15vw, 220px)', letterSpacing: '-.05em', lineHeight: 0.86, display: 'block', color: 'var(--bark)', textTransform: 'uppercase' }}>
            QUADROS.
          </span>
        </h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: 'var(--stone)', marginTop: 28, maxWidth: '52ch', lineHeight: 1.5 }}>
          Fine art em papel algodão 310g, edição limitada assinada e numerada. Cada peça é impressa sob encomenda em ateliê próprio em São Paulo.
        </p>
      </header>

      {/* ── TOOLBAR ── */}
      <div className="quad-toolbar" style={{ padding: '20px 56px', background: 'var(--canvas-deep)', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['Todos', `${PRINTS.length}`], ['Ed. limitada', '5'], ['Open edition', '3'], ['Lençóis', '8']].map(([label, n]) => (
            <button key={label} className={`quad-chip${label === 'Todos' ? ' quad-chip-on' : ''}`}>
              {label} · {n}
            </button>
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--stone)' }}>
          Ordenar · <span style={{ color: 'var(--bark)', fontWeight: 600 }}>Mais recentes</span>
        </span>
      </div>

      {/* ── GRID ── */}
      <div className="quad-pad" style={{ padding: '48px 56px 96px' }}>
        <div className="quad-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
          {PRINTS.map((p, i) => (
            <PrintCard key={p.id} p={p} onOpen={() => openModal(p)} />
          ))}
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <div
          onClick={closeModal}
          style={{ position: 'fixed', inset: 0, background: 'rgba(30,42,24,.75)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: 1100, maxWidth: '100%', maxHeight: '90vh', background: 'var(--canvas)', color: 'var(--bark)', display: 'grid', gridTemplateColumns: '1.1fr 1fr', overflow: 'hidden', position: 'relative', fontFamily: 'var(--font-ui)' }}
          >
            {/* close */}
            <button
              onClick={closeModal}
              style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, background: 'var(--bark)', color: 'var(--canvas)', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}
            >×</button>

            {/* LEFT: preview */}
            <div style={{ background: 'var(--canvas-deep)', padding: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{
                padding: frame === 'sem' ? 0 : 16,
                background: frame === 'sem' ? 'transparent' : frame === 'natural' ? '#C9B48A' : '#1A1612',
                boxShadow: '0 20px 40px rgba(30,42,24,.25)',
                aspectRatio: '4/5', width: '80%',
              }}>
                <div style={{ padding: frame === 'sem' ? 0 : 12, background: 'var(--canvas)', height: '100%' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={modal.img} alt={modal.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 24, left: 24, fontFamily: 'var(--font-hand)', fontSize: 28, color: 'var(--stone)', transform: 'rotate(-3deg)' }}>
                preview em {size.replace('x', '×')}cm
              </div>
            </div>

            {/* RIGHT: form */}
            <div style={{ padding: '40px 40px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {step === 0 && (
                <>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 12 }}>
                    {modal.limit === 'open' ? 'Open edition' : `Edição limitada · ${modal.limit} un.`}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 44, letterSpacing: '-.04em', margin: 0, lineHeight: 0.95, textTransform: 'uppercase', color: 'var(--bark)' }}>
                    {modal.title}
                  </h3>
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--stone)', marginTop: 8 }}>{modal.loc}</div>

                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.7, color: 'var(--stone)', marginTop: 24 }}>
                    Impressão fine art em papel algodão Hahnemühle 310g, tinta pigmentada certificada. Assinada à mão e acompanhada de certificado de autenticidade numerado.
                  </p>

                  {/* size picker */}
                  <div style={{ marginTop: 28 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 12 }}>01 · Tamanho</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {SIZES.map(sz => (
                        <button
                          key={sz.id}
                          onClick={() => setSize(sz.id)}
                          style={{ padding: '12px 14px', border: `1px solid ${size === sz.id ? 'var(--bark)' : 'var(--line)'}`, background: size === sz.id ? 'var(--bark)' : 'transparent', color: size === sz.id ? 'var(--canvas)' : 'var(--bark)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: 'var(--font-ui)' }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{sz.label}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{sz.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* frame picker */}
                  <div style={{ marginTop: 24 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 12 }}>02 · Moldura</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {FRAMES.map(f => (
                        <button
                          key={f.id}
                          onClick={() => setFrame(f.id)}
                          style={{ padding: '12px 14px', border: `1px solid ${frame === f.id ? 'var(--bark)' : 'var(--line)'}`, background: frame === f.id ? 'var(--bark)' : 'transparent', color: frame === f.id ? 'var(--canvas)' : 'var(--bark)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-ui)', textAlign: 'left' }}
                        >
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{f.label}</div>
                            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12, opacity: 0.7, marginTop: 2 }}>{f.desc}</div>
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, flexShrink: 0 }}>{f.extra}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: 28, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)' }}>Total estimado</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 28, letterSpacing: '-.03em', color: 'var(--bark)' }}>
                        {selectedSize.price}
                        {frame !== 'sem' && <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--stone)', marginLeft: 8 }}>+ moldura</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      style={{ padding: '14px 24px', background: 'var(--bark)', color: 'var(--canvas)', border: 'none', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}
                    >
                      Encomendar <span style={{ fontFamily: 'var(--font-hand)', fontSize: 22, color: 'var(--rust-soft)' }}>→</span>
                    </button>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 12 }}>Passo 2 de 2 · seus dados</div>
                  <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 40, letterSpacing: '-.04em', margin: 0, lineHeight: 0.95, textTransform: 'uppercase' }}>
                    quase lá <span style={{ fontFamily: 'var(--font-hand)', fontSize: 44, color: 'var(--rust)', transform: 'rotate(-3deg)', display: 'inline-block' }}>:)</span>
                  </h3>
                  <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--stone)', marginTop: 12 }}>
                    Você não paga agora. Em até 24h eu te mando um orçamento exato com prazo de produção e link de pagamento.
                  </p>

                  <div style={{ marginTop: 20, padding: '16px 20px', background: 'var(--canvas-deep)', border: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--bark)' }}>{modal.title}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--stone)', marginTop: 4 }}>
                        {size.replace('x', '×')}cm · {selectedFrame.label.toLowerCase()}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 20, color: 'var(--bark)' }}>{selectedSize.price}</span>
                  </div>

                  <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {[['Nome completo', 'text', ''], ['Email', 'email', ''], ['WhatsApp', 'tel', '+55 11 9...'], ['Cidade de entrega', 'text', 'São Paulo, SP']].map(([label, type, ph]) => (
                      <div key={label}>
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', display: 'block', marginBottom: 8 }}>{label}</label>
                        <input
                          type={type}
                          placeholder={ph}
                          style={{ width: '100%', padding: '10px 0 8px', border: 'none', borderBottom: '1px solid var(--bark)', background: 'transparent', fontFamily: 'var(--font-serif)', fontSize: 18, outline: 'none', color: 'var(--bark)', boxSizing: 'border-box' }}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', display: 'block', marginBottom: 8 }}>Observações (opcional)</label>
                      <textarea
                        placeholder="Presente, dedicatória, prazo..."
                        style={{ width: '100%', padding: '10px 0 8px', border: 'none', borderBottom: '1px solid var(--bark)', background: 'transparent', fontFamily: 'var(--font-serif)', fontSize: 16, outline: 'none', resize: 'none', minHeight: 60, color: 'var(--bark)', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => setStep(0)}
                      style={{ padding: '12px 20px', border: '1px solid var(--bark)', color: 'var(--bark)', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer' }}
                    >← voltar</button>
                    <button
                      onClick={() => setStep(2)}
                      style={{ flex: 1, padding: '14px 24px', background: 'var(--rust)', color: 'var(--canvas)', border: 'none', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                    >
                      Enviar pedido <span style={{ fontFamily: 'var(--font-hand)', fontSize: 22 }}>→</span>
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 30px' }}>
                  <div style={{ fontFamily: 'var(--font-hand)', fontSize: 96, color: 'var(--rust)', lineHeight: 1, transform: 'rotate(-4deg)' }}>obrigado!</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 48, letterSpacing: '-.04em', marginTop: 24, lineHeight: 0.95, textTransform: 'uppercase', color: 'var(--bark)' }}>
                    pedido<br />enviado.
                  </div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--stone)', marginTop: 24, maxWidth: '36ch', lineHeight: 1.5 }}>
                    Em até 24h você recebe um email com orçamento detalhado, prazo de produção e link de pagamento. Qualquer urgência, chama no WhatsApp.
                  </p>
                  <button
                    onClick={closeModal}
                    style={{ marginTop: 36, padding: '14px 28px', border: '1px solid var(--bark)', color: 'var(--bark)', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer' }}
                  >Fechar</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <SiteFooter dark={false} />
    </main>
  )
}
