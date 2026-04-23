'use client'

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

export default function LencoisPage() {
  return (
    <main style={{ background: 'var(--canvas)', color: 'var(--bark)', fontFamily: 'var(--font-ui)' }}>
      <style>{`
        .lenc-trip-img { transition: transform 1s cubic-bezier(.2,.7,.2,1); }
        .lenc-img-wrap:hover .lenc-trip-img { transform: scale(1.04); }
        .lenc-pack:hover { outline: 1px solid var(--rust); }
        .lenc-cta-btn:hover { opacity: .88; }
        @media(max-width:768px){
          .lenc-two { grid-template-columns: 1fr !important; gap: 48px !important; }
          .lenc-four { grid-template-columns: 1fr 1fr !important; }
          .lenc-pad { padding: 64px 24px !important; }
          .lenc-hero-pad { padding: 120px 24px 56px !important; }
          .lenc-day { grid-template-columns: 48px 1fr !important; }
          .lenc-day-img { display: none !important; }
          .lenc-packs { grid-template-columns: 1fr !important; }
          .lenc-pol { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <SiteNav dark={true} />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: 820, overflow: 'hidden', background: 'var(--forest)' }}>
        <div
          className="lenc-trip-img"
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${FOTOS_GALERIA[0]})`,
            backgroundSize: 'cover', backgroundPosition: 'center 30%',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(30,42,24,.45) 0%, rgba(30,42,24,.05) 40%, rgba(30,42,24,.9) 100%)',
        }} />

        <div
          className="lenc-hero-pad"
          style={{
            position: 'relative', zIndex: 2, minHeight: 820,
            padding: '140px 56px 56px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            color: 'var(--canvas)',
          }}
        >
          {/* breadcrumb */}
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

          {/* title block */}
          <div>
            <div style={{ fontFamily: 'var(--font-hand)', fontSize: 44, color: 'var(--rust-soft)', transform: 'rotate(-2deg)', display: 'inline-block', marginBottom: 6 }}>
              deserto com lagoas, Via Láctea garantida—
            </div>
            <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(64px, 10vw, 140px)', letterSpacing: '-.04em', lineHeight: 0.9, margin: 0, color: 'var(--canvas)' }}>
              Lençóis<br />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--rust-soft)' }}>Maranhenses</span>
            </h1>
          </div>

          {/* bottom: lead + stats */}
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

      {/* ── INTRO ── */}
      <section
        className="lenc-pad"
        style={{ padding: '72px 56px', borderBottom: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 14 }}>№ 01 · O lugar</div>
          <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 32, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.1, margin: 0, color: 'var(--bark)' }}>
            Deserto branco<br />com lagoas<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>de safira.</span>
          </h2>
        </div>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, lineHeight: 1.55, color: '#3A3530', margin: 0 }}>
          Os Lençóis Maranhenses são um dos lugares mais irreais do planeta — um deserto de dunas brancas que, entre janeiro e setembro, se preenche com lagoas de água doce cristalina. A travessia a pé conecta Atins a Santo Amaro pelos caminhos internos do parque, passando por comunidades que vivem isoladas há gerações. Não existe trilha marcada. Você segue guias locais, o vento e a cor da água.
        </p>
      </section>

      {/* ── ROTEIRO ── */}
      <section style={{ background: 'var(--canvas-deep)', borderBottom: '1px solid var(--line)' }}>
        <div className="lenc-pad" style={{ padding: '96px 56px' }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 14 }}>№ 02 · Roteiro</div>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 56, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1, margin: 0, color: 'var(--bark)' }}>
              4 dias.<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>Cada um inesquecível.</span>
            </h2>
          </div>

          {ROTEIRO.map((dia) => (
            <div
              key={dia.num}
              className="lenc-day"
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 300px',
                gap: 40, padding: '40px 0',
                borderTop: '1px solid var(--line)',
                alignItems: 'center',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 72, fontWeight: 500, letterSpacing: '-.04em', lineHeight: 1, color: 'var(--line)', userSelect: 'none' }}>
                {dia.num}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 4 }}>{dia.rota}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', color: 'var(--stone)', marginBottom: 16 }}>{dia.tempo}</div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.65, color: '#3A3530', margin: '0 0 16px', maxWidth: '52ch' }}>{dia.desc}</p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(166,84,43,.08)', border: '1px solid rgba(166,84,43,.2)',
                  padding: '5px 14px',
                  fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', color: 'var(--rust)',
                }}>
                  {dia.highlight}
                </div>
              </div>
              <div
                className="lenc-img-wrap lenc-day-img"
                style={{ overflow: 'hidden', aspectRatio: '4/3' }}
              >
                <img
                  src={dia.img}
                  alt={`Dia ${dia.num}`}
                  className="lenc-trip-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOTOGRAFIA ── */}
      <section
        className="lenc-pad lenc-two"
        style={{ padding: '96px 56px', borderBottom: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}
      >
        <div className="lenc-img-wrap" style={{ overflow: 'hidden', aspectRatio: '3/4' }}>
          <img
            src="/images/lencois/DSC03215.jpg"
            alt="Fotografia"
            className="lenc-trip-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 14 }}>№ 03 · Diferencial</div>
          <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 42, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.05, margin: '0 0 10px', color: 'var(--bark)' }}>
            Fotografia<br /><span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>profissional inclusa.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, lineHeight: 1.6, color: '#3A3530', marginBottom: 32 }}>
            Henrique (@henriq.eu) vai junto na travessia como fotógrafo e guia — você vive a experiência, a gente cuida das imagens. Cobertura completa: dunas ao nascer do sol, lagoas, momentos espontâneos, comunidades locais.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Fotógrafo profissional durante toda a travessia', 'Fotos tratadas profissionalmente — entregues em até 15 dias', 'Álbum digital com as melhores fotos do grupo'].map(item => (
              <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontFamily: 'var(--font-serif)', fontSize: 15, color: '#3A3530', lineHeight: 1.6 }}>
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

      {/* ── INCLUÍDO / NÃO INCLUÍDO ── */}
      <section
        className="lenc-pad"
        style={{ padding: '96px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}
      >
        {/* Incluído */}
        <div style={{ background: 'var(--canvas-deep)', padding: 40, border: '1px solid var(--line)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 18 }}>№ 04.a · Na mochila</div>
          <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 600, letterSpacing: '-.01em', margin: '0 0 20px', color: 'var(--bark)' }}>
            O que está <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>incluso.</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {INCLUIDO.map(item => (
              <div
                key={item.title}
                style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line)', fontFamily: 'var(--font-serif)', fontSize: 15, color: '#3A3530', alignItems: 'flex-start' }}
              >
                <span style={{ color: 'var(--moss)', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>✓</span>
                <div>
                  <strong style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700, color: 'var(--bark)', display: 'block', marginBottom: 2 }}>{item.title}</strong>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Não incluído */}
        <div style={{ padding: 40, border: '1px dashed var(--stone)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 18 }}>№ 04.b · Por sua conta</div>
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

      {/* ── PACOTES ── */}
      <section style={{ background: 'var(--canvas-deep)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="lenc-pad" style={{ padding: '96px 56px' }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: 14 }}>№ 05 · Datas · Agosto 2026</div>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 56, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1, margin: 0, color: 'var(--bark)' }}>
              Escolha seu <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)' }}>pacote.</span>
            </h2>
          </div>

          <div
            className="lenc-packs"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 32 }}
          >
            {PACOTES.map(p => (
              <div
                key={p.label}
                className="lenc-pack"
                style={{
                  padding: '40px 32px',
                  position: 'relative',
                  background: p.featured ? 'var(--bark)' : 'var(--canvas)',
                  borderTop: p.featured ? '3px solid var(--rust)' : '3px solid transparent',
                  outline: p.featured ? '1px solid var(--rust)' : '1px solid var(--line)',
                }}
              >
                {p.featured && (
                  <div style={{
                    position: 'absolute', top: -13, left: 32,
                    background: 'var(--rust)', color: 'var(--canvas)',
                    fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase',
                    padding: '5px 14px',
                  }}>Mais popular</div>
                )}
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: p.featured ? 'var(--rust-soft)' : 'var(--stone)', marginBottom: 8 }}>{p.label}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 22, fontWeight: 700, color: p.featured ? 'var(--canvas)' : 'var(--bark)', marginBottom: 10 }}>{p.datas}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                  {[p.dias, p.km, p.oasis].map(v => (
                    <span key={v} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em',
                      padding: '3px 10px',
                      color: p.featured ? 'var(--canvas)' : 'var(--stone)',
                      border: `1px solid ${p.featured ? 'var(--forest-soft)' : 'var(--line)'}`,
                    }}>{v}</span>
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.6, color: p.featured ? 'var(--ashe)' : '#3A3530', marginBottom: 28 }}>{p.desc}</p>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 36, fontWeight: 700, letterSpacing: '-.02em', color: p.featured ? 'var(--canvas)' : 'var(--bark)', marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.12em', color: p.featured ? 'var(--ashe-dim)' : 'var(--stone)', marginBottom: 28 }}>por pessoa · até 12x</div>
                <a
                  href={waMsg(p.label, p.datas, p.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lenc-cta-btn"
                  style={{
                    display: 'block', textAlign: 'center', textDecoration: 'none',
                    padding: '14px 24px',
                    fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase',
                    background: p.featured ? 'var(--rust)' : 'transparent',
                    color: p.featured ? 'var(--canvas)' : 'var(--bark)',
                    border: `1px solid ${p.featured ? 'var(--rust)' : 'var(--bark)'}`,
                  }}
                >
                  Reservar esta data →
                </a>
              </div>
            ))}
          </div>

          {/* política pagamento */}
          <div
            className="lenc-pol"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}
          >
            {POLITICA_PAGAMENTO.map(item => (
              <div key={item.title} style={{ padding: '20px 24px', background: 'var(--canvas)', border: '1px solid var(--line)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, color: 'var(--bark)', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--stone)', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
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
        <a
          href={WA_GERAL}
          target="_blank"
          rel="noopener noreferrer"
          className="lenc-cta-btn"
          style={{
            marginTop: 40, display: 'inline-block',
            padding: '18px 40px',
            background: 'var(--rust-soft)', color: 'var(--forest)',
            fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Falar no WhatsApp →
        </a>
        <div style={{ marginTop: 28, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', color: 'var(--ashe-dim)' }}>
          Em parceria com @lencoisexperience · @livinglencois
        </div>
      </section>

      {/* ── GALERIA ── */}
      <div
        className="lenc-four"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}
      >
        {FOTOS_GALERIA.slice(8, 12).map((src, i) => (
          <div key={i} className="lenc-img-wrap" style={{ aspectRatio: '1', overflow: 'hidden' }}>
            <img
              src={src}
              alt=""
              className="lenc-trip-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))}
      </div>

      <SiteFooter dark={false} />
    </main>
  )
}
