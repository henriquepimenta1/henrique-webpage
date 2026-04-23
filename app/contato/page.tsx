'use client'

import { useState } from 'react'
import SiteNav from '@/components/nav'
import SiteFooter from '@/components/site-footer'
import { SITE_EMAIL } from '@/content/home'

const INTENTS = [
  { id: 'expedicao', label: 'Expedição',        sub: 'reservar vaga'     },
  { id: 'presets',   label: 'Presets / LUTs',   sub: 'dúvida ou suporte' },
  { id: 'parceria',  label: 'Parceria',          sub: 'marca ou agência'  },
  { id: 'outro',     label: 'Outro',             sub: 'conversa livre'    },
]

const EXPEDITIONS = [
  'Lençóis · ago 2026',
  'Huayhuash · jul 2026',
  'Mantiqueira · set 2026',
  'Nenhuma ainda',
]

export default function ContatoPage() {
  const [intent, setIntent] = useState('expedicao')
  const [expedition, setExpedition] = useState('Lençóis · ago 2026')
  const [sent, setSent] = useState(false)

  return (
    <main style={{ background: 'var(--forest)', color: 'var(--canvas)', fontFamily: 'var(--font-ui)', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .cnt-input { width: 100%; padding: 16px 0 12px; background: transparent; border: none; border-bottom: 1px solid var(--line-dark); color: var(--canvas); font-family: var(--font-serif); font-weight: 300; font-size: 22px; outline: none; box-sizing: border-box; }
        .cnt-input::placeholder { color: var(--ashe-dim); font-style: italic; }
        .cnt-input:focus { border-bottom-color: var(--canvas); transition: border-bottom-color .3s; }
        .cnt-intent { padding: 14px 16px; border: 1px solid var(--line-dark); background: transparent; font-family: var(--font-ui); font-size: 12px; letter-spacing: .05em; color: var(--ashe); text-align: left; line-height: 1.4; cursor: pointer; }
        .cnt-intent-on { background: var(--canvas); color: var(--bark); border-color: var(--canvas); }
        .cnt-exp { padding: 10px 14px; border: 1px solid var(--line-dark); background: transparent; font-family: var(--font-mono); font-size: 11px; letter-spacing: .1em; color: var(--ashe); cursor: pointer; }
        .cnt-exp-on { background: var(--rust); color: var(--canvas); border-color: var(--rust); }
        @media(max-width:900px){
          .cnt-grid { grid-template-columns: 1fr !important; }
          .cnt-head { padding: 100px 24px 56px !important; }
          .cnt-body { padding: 56px 24px 80px !important; }
          .cnt-intent-grid { grid-template-columns: 1fr 1fr !important; }
          .cnt-name-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* background photo — ghosted */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/lencois/DJI_20250828174205_0403_D-HDR.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.22, filter: 'grayscale(.3)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(30,42,24,.45) 0%, rgba(30,42,24,.88) 60%, var(--forest) 100%)' }} />

      {/* floating sticky note */}
      <div style={{ position: 'absolute', right: 56, top: 160, width: 200, background: '#EDE4CD', color: 'var(--bark)', padding: '18px 22px', fontFamily: 'var(--font-hand)', fontSize: 24, lineHeight: 1.2, transform: 'rotate(3deg)', boxShadow: '0 12px 32px rgba(0,0,0,.4)', zIndex: 5 }}>
        responde todo mundo<br />em até 48h, prometido.<br />— H.
      </div>

      <SiteNav dark={true} />

      {/* ── HEADER ── */}
      <header className="cnt-head" style={{ position: 'relative', padding: '140px 56px 56px', borderBottom: '1px solid var(--line-dark)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe-dim)', marginBottom: 16 }}>
          № 06 · Manda mensagem
        </div>
        <h1 style={{ margin: 0, lineHeight: 0.85 }}>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 72, color: 'var(--rust-soft)', transform: 'rotate(-3deg)', display: 'inline-block', marginRight: 20 }}>pode falar—</span>
          <br />
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(80px, 15vw, 220px)', letterSpacing: '-.05em', lineHeight: 0.85, display: 'block', textTransform: 'uppercase' }}>
            CONTATO.
          </span>
        </h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 24, color: 'var(--ashe)', marginTop: 28, maxWidth: '50ch', lineHeight: 1.5 }}>
          Reserva de expedição, dúvida sobre preset, proposta de parceria ou só papo sobre fotografia. Tudo chega na mesma caixa.
        </p>
      </header>

      {/* ── BODY ── */}
      <div className="cnt-body cnt-grid" style={{ position: 'relative', padding: '80px 56px 120px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80 }}>

        {/* FORM */}
        {!sent ? (
          <form
            style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
            onSubmit={e => { e.preventDefault(); setSent(true) }}
          >
            {/* intent */}
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe)', display: 'block', marginBottom: 12 }}>01 · Sobre o que é?</label>
              <div className="cnt-intent-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {INTENTS.map(it => (
                  <button
                    key={it.id}
                    type="button"
                    className={`cnt-intent${intent === it.id ? ' cnt-intent-on' : ''}`}
                    onClick={() => setIntent(it.id)}
                  >
                    {it.label}
                    <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13, display: 'block', marginTop: 4, opacity: 0.7 }}>{it.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* name */}
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe)', display: 'block', marginBottom: 10 }}>02 · Seu nome</label>
              <input required className="cnt-input" type="text" placeholder="Maria da Silva" />
            </div>

            {/* email + whatsapp */}
            <div className="cnt-name-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe)', display: 'block', marginBottom: 10 }}>03 · Email</label>
                <input required className="cnt-input" type="email" placeholder="maria@exemplo.com" />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe)', display: 'block', marginBottom: 10 }}>04 · WhatsApp (opcional)</label>
                <input className="cnt-input" type="tel" placeholder="+55 11 9 ..." />
              </div>
            </div>

            {/* expedition picker (only if intent === expedicao) */}
            {intent === 'expedicao' && (
              <div>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe)', display: 'block', marginBottom: 12 }}>05 · Qual expedição?</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {EXPEDITIONS.map(ex => (
                    <button
                      key={ex}
                      type="button"
                      className={`cnt-exp${expedition === ex ? ' cnt-exp-on' : ''}`}
                      onClick={() => setExpedition(ex)}
                    >{ex}</button>
                  ))}
                </div>
              </div>
            )}

            {/* message */}
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe)', display: 'block', marginBottom: 10 }}>
                {intent === 'expedicao' ? '06' : '05'} · Me conta mais
              </label>
              <textarea
                required
                className="cnt-input"
                placeholder="Experiência em trilha, o que te chamou atenção, dúvidas..."
                style={{ minHeight: 120, resize: 'none', paddingTop: 16, display: 'block' }}
              />
            </div>

            <div>
              <button
                type="submit"
                style={{ padding: '18px 32px', background: 'var(--canvas)', color: 'var(--bark)', border: 'none', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
              >
                Enviar mensagem <span style={{ fontFamily: 'var(--font-hand)', fontSize: 28, color: 'var(--rust)', transform: 'rotate(-2deg)', display: 'inline-block' }}>→</span>
              </button>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ashe-dim)', letterSpacing: '.05em', marginTop: 12 }}>
                Ao enviar, você aceita receber a resposta no email informado. Nada de spam.
              </div>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 0' }}>
            <div style={{ fontFamily: 'var(--font-hand)', fontSize: 96, color: 'var(--rust-soft)', lineHeight: 1, transform: 'rotate(-4deg)' }}>obrigado!</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 48, letterSpacing: '-.04em', marginTop: 24, lineHeight: 0.95, textTransform: 'uppercase' }}>
              mensagem<br />enviada.
            </div>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ashe)', marginTop: 24, maxWidth: '40ch', lineHeight: 1.5 }}>
              Em até 48h você recebe minha resposta. Qualquer urgência, chama no WhatsApp.
            </p>
            <button
              onClick={() => setSent(false)}
              style={{ marginTop: 32, padding: '14px 24px', border: '1px solid var(--canvas)', color: 'var(--canvas)', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer' }}
            >Nova mensagem</button>
          </div>
        )}

        {/* SIDEBAR */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div style={{ paddingBottom: 32, borderBottom: '1px solid var(--line-dark)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe-dim)', marginBottom: 14 }}>Resposta direta</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 26, lineHeight: 1.3, color: 'var(--canvas)', marginBottom: 14 }}>Se preferir, manda email direto:</div>
            <a href={`mailto:${SITE_EMAIL}`} style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 16, color: 'var(--canvas)', borderBottom: '1px solid var(--rust-soft)', paddingBottom: 2, textDecoration: 'none' }}>
              {SITE_EMAIL}
            </a>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--ashe)', marginTop: 8, lineHeight: 1.5 }}>Para propostas comerciais: management@henriq.eu</div>
          </div>

          <div style={{ paddingBottom: 32, borderBottom: '1px solid var(--line-dark)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe-dim)', marginBottom: 14 }}>Base de operação</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 26, lineHeight: 1.3, color: 'var(--canvas)' }}>São Paulo, SP</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--ashe)', marginTop: 8, lineHeight: 1.5 }}>
              Agenda em campo de junho a setembro — respostas podem demorar 72h nesse período.
            </div>
          </div>

          <div style={{ paddingBottom: 32, borderBottom: '1px solid var(--line-dark)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe-dim)', marginBottom: 14 }}>Onde mais me achar</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--ashe)' }}>
              {[['IG', '@henriq.eu'], ['YT', 'Henrique Sesana Pimenta'], ['VS', 'henriqsesana'], ['SB', 'open.substack.com/henriq']].map(([k, v]) => (
                <div key={k}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', color: 'var(--ashe-dim)', marginRight: 14 }}>{k}</span>
                  {v}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe-dim)', marginBottom: 14 }}>FAQ rápido</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.7, color: 'var(--ashe)', marginTop: 10 }}>
              <em>"Dá pra pagar em parcelas?"</em> Sim, até 12×.<br />
              <em>"Preciso ter experiência?"</em> Depende da expedição — cada uma tem nível indicado.<br />
              <em>"Os presets funcionam no celular?"</em> Sim, Lightroom mobile inclusive.
            </div>
          </div>
        </aside>
      </div>

      <SiteFooter dark={true} />
    </main>
  )
}
