'use client'

import { useState } from 'react'
import SiteNav from '@/components/nav'
import SiteFooter from '@/components/site-footer'
import { SITE_EMAIL } from '@/content/home'

export default function ContatoPage() {
  const [sent, setSent] = useState(false)

  return (
    <main style={{ background: 'var(--forest)', color: 'var(--canvas)', fontFamily: 'var(--font-ui)', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .cnt-input { width: 100%; padding: 16px 0 12px; background: transparent; border: none; border-bottom: 1px solid var(--line-dark); color: var(--canvas); font-family: var(--font-serif); font-weight: 300; font-size: 22px; outline: none; box-sizing: border-box; }
        .cnt-input::placeholder { color: var(--ashe-dim); font-style: italic; }
        .cnt-input:focus { border-bottom-color: var(--canvas); transition: border-bottom-color .3s; }
        @media(max-width:900px){
          .cnt-grid { grid-template-columns: 1fr !important; gap: 56px !important; }
          .cnt-head { padding: 100px 24px 56px !important; }
          .cnt-body { padding: 56px 24px 80px !important; }
        }
      `}</style>

      {/* background photo — ghosted */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/lencois/DJI_20250828174205_0403_D-HDR.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.22, filter: 'grayscale(.3)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(30,42,24,.45) 0%, rgba(30,42,24,.88) 60%, var(--forest) 100%)' }} />

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
          Expedição, preset, parceria ou só um papo sobre fotografia. Tudo chega na mesma caixa.
        </p>
      </header>

      {/* ── BODY ── */}
      <div className="cnt-body cnt-grid" style={{ position: 'relative', padding: '80px 56px 120px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80 }}>

        {/* FORM */}
        {!sent ? (
          <form
            style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
            onSubmit={e => { e.preventDefault(); setSent(true) }}
          >
            {/* name */}
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe)', display: 'block', marginBottom: 10 }}>Seu nome</label>
              <input required className="cnt-input" type="text" placeholder="Maria da Silva" />
            </div>

            {/* email */}
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe)', display: 'block', marginBottom: 10 }}>Email</label>
              <input required className="cnt-input" type="email" placeholder="maria@exemplo.com" />
            </div>

            {/* message */}
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe)', display: 'block', marginBottom: 10 }}>Mensagem</label>
              <textarea
                required
                className="cnt-input"
                placeholder="Me conta o que você precisa..."
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
              Em até 48h você recebe minha resposta.
            </p>
            <button
              onClick={() => setSent(false)}
              style={{ marginTop: 32, padding: '14px 24px', border: '1px solid var(--canvas)', color: 'var(--canvas)', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer' }}
            >Nova mensagem</button>
          </div>
        )}

        {/* SIDEBAR — minimal */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe-dim)', marginBottom: 14 }}>Email direto</div>
            <a href={`mailto:${SITE_EMAIL}`} style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 18, color: 'var(--canvas)', borderBottom: '1px solid var(--rust-soft)', paddingBottom: 2, textDecoration: 'none' }}>
              {SITE_EMAIL}
            </a>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe-dim)', marginBottom: 14 }}>Instagram</div>
            <a
              href="https://instagram.com/henriq.eu"
              target="_blank"
              rel="noreferrer"
              style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 18, color: 'var(--canvas)', borderBottom: '1px solid var(--rust-soft)', paddingBottom: 2, textDecoration: 'none' }}
            >
              @henriq.eu
            </a>
          </div>
        </aside>
      </div>

      <SiteFooter dark={true} />
    </main>
  )
}
