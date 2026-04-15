'use client'

import Link from 'next/link'

const expeditions = [
  {
    slug: 'lencois',
    location: 'Maranhão, Brasil',
    title: 'Lençóis',
    subtitle: 'Maranhenses',
    tagline: 'Mais do que uma viagem. Um reset completo.',
    stats: [
      { value: '52km', label: 'Travessia' },
      { value: '4 dias', label: 'Base' },
      { value: '3 oásis', label: 'Pernoites' },
    ],
    price: 'a partir de R$3.599',
    difficulty: 'Intermediário',
    difficultyColor: '#C8905A',
    accent: '#C8905A',
    image: '/images/lencois/DJI_20250828174205_0403_D-HDR.jpg',
    badge: 'Agosto 2026 · Vagas Abertas',
    badgeColor: '#7EC47E',
    available: true,
  },
  {
    slug: 'huayhuash',
    location: 'Ancash, Peru',
    title: 'Cordilheira',
    subtitle: 'Huayhuash',
    tagline: 'O circuito mais selvagem dos Andes peruanos.',
    stats: [
      { value: '160km', label: 'Circuito' },
      { value: '10 dias', label: 'Imersão' },
      { value: '5.000m', label: 'Altitude' },
    ],
    price: 'Em breve',
    difficulty: 'Avançado',
    difficultyColor: '#6FA3D8',
    accent: '#6FA3D8',
    image: '/images/hiker.jpg',
    badge: 'Em breve · 2027',
    badgeColor: '#746A62',
    available: false,
  },
]

export default function ExpedicoesPage() {
  return (
    <main style={{ background: '#0E0C0A', minHeight: '100vh', paddingTop: '88px' }}>

      {/* Header */}
      <section style={{ padding: '60px 40px 40px' }}>
        <p style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '.25em',
          textTransform: 'uppercase',
          color: '#4C4440',
          marginBottom: '16px',
        }}>
          Expedições
        </p>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 300,
          color: '#E6DDD4',
          lineHeight: 1.1,
          margin: 0,
        }}>
          Aventuras que<br />
          <strong style={{ fontWeight: 800 }}>ficam pra sempre.</strong>
        </h1>
        <p style={{
          marginTop: '20px',
          fontSize: '14px',
          color: '#746A62',
          lineHeight: 1.8,
          maxWidth: '520px',
        }}>
          Roteiros selecionados a dedo. Grupos pequenos. Fotografia profissional inclusa em cada expedição.
        </p>
      </section>

      {/* Cards */}
      <section style={{
        padding: '0 40px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
        maxWidth: '1400px',
      }}>
        {expeditions.map((exp) => (
          <ExpedicaoCard key={exp.slug} exp={exp} />
        ))}
      </section>

      <style>{`
        .exp-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.06);
          cursor: pointer;
          transition: transform 500ms cubic-bezier(.4,0,.2,1), border-color 400ms;
          text-decoration: none;
          display: block;
          min-height: 580px;
        }
        .exp-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,.14);
        }
        .exp-card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 700ms cubic-bezier(.4,0,.2,1), filter 500ms;
          filter: brightness(.65);
        }
        .exp-card:hover .exp-card-bg {
          transform: scale(1.04);
          filter: brightness(.8);
        }
        .exp-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(14,12,10,.98) 0%, rgba(14,12,10,.6) 50%, rgba(14,12,10,.1) 100%);
          transition: opacity 400ms;
        }
        .exp-stats {
          display: flex;
          gap: 0;
          margin-bottom: 24px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 12px;
          overflow: hidden;
        }
        .exp-stat {
          flex: 1;
          padding: 14px 16px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,.08);
        }
        .exp-stat:last-child { border-right: none; }
        .exp-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .15em;
          text-transform: uppercase;
          transition: opacity 300ms, transform 300ms;
          text-decoration: none;
        }
        .exp-cta:hover { opacity: .85; transform: translateX(3px); }
      `}</style>
    </main>
  )
}

function ExpedicaoCard({ exp }: { exp: typeof expeditions[0] }) {
  const content = (
    <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px' }}>
      {/* Top */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '.2em',
          textTransform: 'uppercase',
          color: exp.badgeColor,
          background: `${exp.badgeColor}18`,
          border: `1px solid ${exp.badgeColor}40`,
          padding: '5px 12px',
          borderRadius: '999px',
        }}>
          {exp.badge}
        </span>
        <span style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          color: exp.difficultyColor,
          background: `${exp.difficultyColor}15`,
          border: `1px solid ${exp.difficultyColor}30`,
          padding: '5px 12px',
          borderRadius: '999px',
        }}>
          {exp.difficulty}
        </span>
      </div>

      {/* Bottom */}
      <div>
        <p style={{ fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#60584E', marginBottom: '8px' }}>
          {exp.location}
        </p>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#E6DDD4', lineHeight: 1.05, marginBottom: '6px' }}>
          {exp.title}<br />
          <strong style={{ fontWeight: 800 }}>{exp.subtitle}</strong>
        </h2>
        <p style={{ fontSize: '13px', color: '#8A8078', lineHeight: 1.7, marginBottom: '24px' }}>
          {exp.tagline}
        </p>

        {/* Stats */}
        <div className="exp-stats" style={{ background: 'rgba(14,12,10,.6)', backdropFilter: 'blur(12px)' }}>
          {exp.stats.map((s) => (
            <div key={s.label} className="exp-stat">
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#E6DDD4', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '9px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#4C4440', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#4C4440', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '3px' }}>Investimento</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: exp.accent }}>{exp.price}</div>
          </div>
          {exp.available ? (
            <span className="exp-cta" style={{ background: exp.accent, color: '#0E0C0A' }}>
              Ver expedição
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          ) : (
            <span className="exp-cta" style={{ border: '1px solid rgba(255,255,255,.12)', color: '#746A62' }}>
              Notificar-me
            </span>
          )}
        </div>
      </div>
    </div>
  )

  return exp.available ? (
    <Link href={`/expedicoes/${exp.slug}`} className="exp-card">
      <div className="exp-card-bg" style={{ backgroundImage: `url(${exp.image})` }} />
      <div className="exp-card-overlay" />
      {content}
    </Link>
  ) : (
    <div className="exp-card">
      <div className="exp-card-bg" style={{ backgroundImage: `url(${exp.image})`, filter: 'brightness(.4) saturate(.5)' }} />
      <div className="exp-card-overlay" />
      {content}
    </div>
  )
}
