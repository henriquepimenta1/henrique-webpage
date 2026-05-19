'use client'

import Link from 'next/link'
import SiteNav from '@/components/nav'
import SiteFooter from '@/components/site-footer'

const HERO_IMG = '/images/portfolio/hotel-pakaas-ronodonia-riomamore-riopakaas.jpg'

const WA_NUMBER = '5511988128064'
const WA_MESSAGE = 'Olá Henrique! Vi a página da Expedição Explore Rondônia e quero receber mais informações — roteiro, datas e valores. Obrigado!'
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`

const HIGHLIGHTS = [
  { n: '01', title: 'Forte Príncipe da Beira',  desc: 'Fortificação portuguesa do século XVIII na margem do Guaporé — luz baixa, paredes massivas, história.' },
  { n: '02', title: 'Rio Mamoré',                desc: 'Travessia de barco pela divisa Brasil-Bolívia. Manhãs com névoa, entardeceres incandescentes.' },
  { n: '03', title: 'Aldeias ribeirinhas',       desc: 'Imersão com comunidades que vivem do rio. Retratos, cotidiano, narrativa visual.' },
  { n: '04', title: 'Cachoeiras e igarapés',     desc: 'Quedas escondidas na mata fechada — Macacaquinhos, Ratunde. Luz filtrada, verde úmido.' },
  { n: '05', title: 'Hotel Pakaás (base)',      desc: 'Estrutura confortável na confluência Mamoré-Pakaás. Descanso, edição em campo, churrasco ribeirinho.' },
]

const STATS = [
  { k: 'Duração',  v: '5 dias' },
  { k: 'Base',     v: 'Hotel Pakaás' },
  { k: 'Grupo',    v: 'máx. 8' },
  { k: 'Nível',    v: 'Iniciante' },
]

export default function RondoniaPage() {
  return (
    <main style={{ background: 'var(--canvas)', color: 'var(--bark)', fontFamily: 'var(--font-ui)' }}>
      <style>{`
        .ron-hero-img { transition: transform 1.2s cubic-bezier(.2,.7,.2,1); }
        .ron-img-wrap:hover .ron-hero-img { transform: scale(1.03); }
        .ron-cta:hover { background: var(--rust) !important; }
        @media(max-width:900px){
          .ron-hero-pad   { padding: 100px 24px 56px !important; }
          .ron-pad        { padding: 56px 24px !important; }
          .ron-two        { grid-template-columns: 1fr !important; gap: 40px !important; }
          .ron-stats      { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .ron-cta-grid   { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>

      <SiteNav dark={true} />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: 720, overflow: 'hidden', background: 'var(--forest)' }}>
        <div className="ron-hero-img" style={{ position: 'absolute', inset: 0, backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(30,42,24,.45) 0%, rgba(30,42,24,.08) 40%, rgba(30,42,24,.92) 100%)' }} />

        <div className="ron-hero-pad" style={{ position: 'relative', zIndex: 2, minHeight: 720, padding: '140px 56px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--canvas)' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe)', fontWeight: 500 }}>
            <Link href="/expedicoes" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
              Expedições
            </Link>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--rust-soft)', display: 'inline-block' }} />
            <span>Rondônia · Brasil ⇄ Bolívia</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--rust-soft)', display: 'inline-block' }} />
            <span style={{ color: 'var(--rust-soft)' }}>Em formação · 2026</span>
          </div>

          <div>
            <div style={{ fontFamily: 'var(--font-hand)', fontSize: 42, color: 'var(--rust-soft)', transform: 'rotate(-2deg)', display: 'inline-block', marginBottom: 6 }}>
              divisa, rio, forte—
            </div>
            <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(56px, 9vw, 130px)', letterSpacing: '-.04em', lineHeight: 0.9, margin: 0, color: 'var(--canvas)' }}>
              Explore<br />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--rust-soft)' }}>Rondônia</span>
            </h1>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ashe)', marginTop: 14 }}>
              Expedição Fotográfica
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40, flexWrap: 'wrap' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontStyle: 'italic', lineHeight: 1.5, maxWidth: '50ch', color: 'var(--canvas)', margin: 0 }}>
              Cinco dias fotografando o Rio Mamoré, o Forte Príncipe da Beira, aldeias ribeirinhas e a mata amazônica — na fronteira entre Brasil e Bolívia.
            </p>
            <div className="ron-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 32, flexShrink: 0 }}>
              {STATS.map(s => (
                <div key={s.k}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ashe-dim)', marginBottom: 6 }}>{s.k}</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 18, fontWeight: 600, color: 'var(--canvas)' }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DESCRIÇÃO ── */}
      <section className="ron-pad ron-two" style={{ padding: '80px 56px', borderBottom: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 14 }}>№ 01 · O lugar</div>
          <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 32, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.1, margin: 0, color: 'var(--bark)' }}>
            Amazônia<br />onde quase<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>ninguém vai.</span>
          </h2>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, lineHeight: 1.55, color: 'var(--stone)', margin: '0 0 20px' }}>
            Rondônia ocupa um pedaço da Amazônia que raramente entra em roteiros de fotografia — região da fronteira do Guaporé e Mamoré, divisa com a Bolívia, onde o rio é a única estrada e o silêncio tem peso.
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, lineHeight: 1.6, color: 'var(--stone)', margin: 0 }}>
            A expedição usa o Hotel Pakaás como base — estrutura confortável na confluência dos rios — e parte dali em barco para o Forte Príncipe da Beira, cachoeiras escondidas, igarapés e aldeias ribeirinhas. Foco em fotografia outdoor de natureza, água, fauna e narrativa documental.
          </p>
        </div>
      </section>

      {/* ── HIGHLIGHTS ── */}
      <section style={{ background: 'var(--canvas-deep)', borderBottom: '1px solid var(--line)' }}>
        <div className="ron-pad" style={{ padding: '80px 56px' }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 14 }}>№ 02 · O que tem lá</div>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1, margin: 0, color: 'var(--bark)' }}>
              Cinco <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>cenários</span>.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {HIGHLIGHTS.map((h) => (
              <div key={h.n} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 32, padding: '28px 0', borderTop: '1px solid var(--line)', alignItems: 'baseline' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 48, fontWeight: 500, letterSpacing: '-.04em', lineHeight: 1, color: 'var(--rust)', opacity: .3, userSelect: 'none' }}>
                  {h.n}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 22, fontWeight: 600, color: 'var(--bark)', marginBottom: 6, letterSpacing: '-.01em' }}>{h.title}</div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.6, color: 'var(--stone)', margin: 0, maxWidth: '54ch' }}>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERIA RÁPIDA ── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, borderBottom: '1px solid var(--line)' }}>
        {[
          '/images/portfolio/cachoeira-ratunde-rondonia.jpg',
          '/images/portfolio/arara-canindé-rondonia.jpg',
          '/images/portfolio/ronondia-riopakaas-riomamore.jpg',
          '/images/portfolio/cachoeira-dos-macacaquinhos-rondonia.jpg',
        ].map((src, i) => (
          <div key={i} className="ron-img-wrap" style={{ aspectRatio: '1', overflow: 'hidden' }}>
            <img src={src} alt="" className="ron-hero-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        ))}
      </section>

      {/* ── CTA WHATSAPP ── */}
      <section style={{ background: 'var(--forest)', color: 'var(--canvas)' }}>
        <div className="ron-pad" style={{ padding: '120px 56px' }}>
          <div className="ron-cta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust-soft)', marginBottom: 14 }}>№ 03 · Lista de interesse</div>
              <div style={{ fontFamily: 'var(--font-hand)', fontSize: 38, color: 'var(--rust-soft)', transform: 'rotate(-2deg)', display: 'inline-block', marginBottom: 8 }}>
                bora?
              </div>
              <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '-.04em', lineHeight: 0.92, margin: '0 0 24px', color: 'var(--canvas)' }}>
                Estou montando<br />
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--rust-soft)' }}>o roteiro.</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, lineHeight: 1.6, color: 'var(--ashe)', margin: 0, maxWidth: '46ch' }}>
                Datas e valores ainda em definição. Clica no botão, eu te respondo no WhatsApp com o roteiro detalhado assim que estiver pronto.
              </p>
            </div>

            <div>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ron-cta"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                  padding: '28px 32px',
                  background: 'var(--rust-soft)', color: 'var(--forest)',
                  fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 700,
                  letterSpacing: '.18em', textTransform: 'uppercase',
                  textDecoration: 'none', width: '100%', boxSizing: 'border-box',
                  transition: 'background .2s',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Quero receber mais informações
              </a>
              <div style={{ marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ashe-dim)', textAlign: 'center' }}>
                Abre o WhatsApp · resposta em até 48h
              </div>
            </div>

          </div>
        </div>
      </section>

      <SiteFooter dark={false} />
    </main>
  )
}
