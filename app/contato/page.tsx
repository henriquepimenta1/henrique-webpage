'use client'

import { useState } from 'react'
import DarkTopNav from '@/components/dark-nav'
import DarkFooter from '@/components/dark-footer'

// Contato — Dark Editorial "Fim de Luz". Portado do protótipo hi-fi.
// Aside (correção de negócio): Email · Parcerias & marcas · Instagram · Base.
export default function ContatoPage() {
  const [sent, setSent] = useState(false)

  return (
    <div className="theme-fdl">
      <style>{`
/* ── layout ── */
.ctd-wrap{display:grid;grid-template-columns:1.2fr 1fr;gap:clamp(48px,7vw,110px);padding:var(--sect-y) var(--s-5) var(--sect-xl);max-width:1360px}
.ctd-h1{font-family:var(--font-serif);font-weight:500;font-size:clamp(48px,7vw,96px);letter-spacing:-.015em;line-height:1.03;color:var(--text-1);margin:0 0 24px;text-wrap:pretty}
.ctd-h1 em{font-style:italic;font-weight:400;color:var(--text-2)}
.ctd-sub{font-family:var(--font-serif);font-style:italic;font-size:18px;line-height:1.6;color:var(--text-2);max-width:42ch;margin:0 0 var(--s-56)}

/* form */
.ctd-label{font-family:var(--font-mono);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--text-3);display:block;margin-bottom:10px}
.ctd-input{width:100%;padding:var(--s-2) 0 var(--s-1);background:transparent;border:none;border-bottom:1px solid var(--border-strong);color:var(--text-1);font-family:var(--font-serif);font-weight:400;font-size:19px;outline:none;transition:border-bottom-color .3s;border-radius:0}
.ctd-input::placeholder{color:var(--text-3);font-style:italic}
.ctd-input:focus{border-bottom-color:var(--accent)}
.ctd-btn{padding:var(--s-2) var(--s-4);background:var(--accent);color:var(--bg);border:none;font-family:var(--font-ui);font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:background .2s;display:inline-flex;align-items:center;gap:var(--s-1)}
.ctd-btn:hover{background:var(--accent-hover)}

/* aside */
.ctd-aside{display:flex;flex-direction:column;gap:var(--s-40);padding-top:var(--s-1)}
.ctd-block{border-top:1px solid var(--border);padding-top:24px}
.ctd-block-k{font-family:var(--font-mono);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--text-3);margin-bottom:var(--s-1)}
.ctd-block a{font-family:var(--font-serif);font-size:19px;color:var(--text-1);text-decoration:none;border-bottom:1px solid transparent;transition:border-color .2s}
.ctd-block a:hover{border-color:var(--accent)}
.ctd-block p{font-family:var(--font-serif);font-style:italic;font-size:14.5px;line-height:1.6;color:var(--text-2);margin:8px 0 0}
.ctd-sign{font-family:var(--font-hand);font-size:44px;color:var(--accent);transform:rotate(-2deg);display:inline-block;line-height:1}

/* sent state */
.ctd-sent-h{font-family:var(--font-serif);font-weight:500;font-size:clamp(38px,5vw,60px);letter-spacing:-.015em;line-height:1.05;color:var(--text-1);margin:16px 0 0}
.ctd-sent-h em{font-style:italic;font-weight:400;color:var(--text-2)}
.ctd-ghost{margin-top:var(--s-4);padding:var(--s-2) var(--s-3);border:1px solid var(--border-strong);background:transparent;color:var(--text-1);font-family:var(--font-ui);font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;cursor:pointer}

/* ── responsive ── */
@media(max-width:1000px){
  .ctd-wrap{grid-template-columns:1fr;gap:64px}
}
@media(max-width:640px){
  .ctd-wrap{padding:var(--s-5) var(--s-3) var(--s-72)}
  .ctd-sub{margin-bottom:var(--s-40)}
}
      `}</style>

      <DarkTopNav active="Contato" />

      <main className="ctd-wrap" data-screen-label="Contato">
        {/* FORM */}
        <div>
          <div className="v2-eyebrow" style={{ marginBottom: 22 }}>
            № 06 · Manda mensagem
          </div>
          <h1 className="ctd-h1">
            Pode falar <em>— tudo chega na mesma caixa.</em>
          </h1>
          <p className="ctd-sub">
            Reserva de expedição, dúvida sobre preset, parceria de marca ou só um papo sobre montanha.
          </p>

          {!sent ? (
            <form
              style={{ display: 'flex', flexDirection: 'column', gap: 36 }}
              onSubmit={e => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <div>
                <label className="ctd-label" htmlFor="ctd-nome">
                  Nome
                </label>
                <input id="ctd-nome" required className="ctd-input" type="text" placeholder="Seu nome" />
              </div>
              <div>
                <label className="ctd-label" htmlFor="ctd-email">
                  Email
                </label>
                <input id="ctd-email" required className="ctd-input" type="email" placeholder="voce@exemplo.com" />
              </div>
              <div>
                <label className="ctd-label" htmlFor="ctd-msg">
                  Mensagem
                </label>
                <textarea
                  id="ctd-msg"
                  required
                  className="ctd-input"
                  placeholder="Conta um pouco sobre o que tá procurando..."
                  style={{ minHeight: 140, resize: 'none', display: 'block' }}
                />
              </div>
              <div>
                <button type="submit" className="ctd-btn">
                  Enviar{' '}
                  <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18 }}>→</span>
                </button>
              </div>
            </form>
          ) : (
            <div>
              <span className="ctd-sign">obrigado!</span>
              <h2 className="ctd-sent-h">
                Mensagem <em>enviada.</em>
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 16,
                  color: 'var(--text-2)',
                  marginTop: 18,
                  maxWidth: '36ch',
                  lineHeight: 1.6,
                }}
              >
                Em até 48h você recebe minha resposta.
              </p>
              <button className="ctd-ghost" onClick={() => setSent(false)}>
                Nova mensagem
              </button>
            </div>
          )}
        </div>

        {/* ASIDE */}
        <aside className="ctd-aside">
          <div className="ctd-block">
            <div className="ctd-block-k">Email</div>
            <a href="mailto:contato@euhenriq.com">contato@euhenriq.com</a>
            <p>Respondo em até 48h, direto do campo quando dá.</p>
          </div>
          <div className="ctd-block">
            <div className="ctd-block-k">Parcerias &amp; marcas</div>
            <a href="mailto:contato@euhenriq.com">contato@euhenriq.com</a>
            <p>Briefings, licenciamento e campanhas.</p>
          </div>
          <div className="ctd-block">
            <div className="ctd-block-k">Instagram</div>
            <a href="https://instagram.com/henriq.eu" target="_blank" rel="noreferrer">
              @henriq.eu
            </a>
            <p>Bastidores das expedições, quase em tempo real.</p>
          </div>
          <div className="ctd-block">
            <div className="ctd-block-k">Base</div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 19, color: 'var(--text-1)' }}>
              São Paulo · BR
            </span>
            <p>Atende worldwide. Desde 2018.</p>
          </div>
        </aside>
      </main>

      <DarkFooter coords="23°33′S 46°38′W · São Paulo" />
    </div>
  )
}
