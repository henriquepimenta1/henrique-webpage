import SiteNav from '@/components/nav'
import SiteFooter from '@/components/site-footer'
import { SITE_AUTHOR, SITE_EMAIL, SOBRE_BIO } from '@/content/home'

export const metadata = {
  title: 'Sobre — henriq.eu',
  description: 'Quem está por trás das imagens.',
}

const EVENTS = [
  { year: '2018', label: 'Comprei minha primeira câmera séria.', desc: 'Canon 6D, lente 50mm, sem ideia do que estava fazendo. Primeira viagem séria: Chapada Diamantina.' },
  { year: '2020', label: 'Larguei corporativo pra fotografar em tempo integral.', desc: 'Saí da cadeira de gerente de produto. Três meses viajando pelo interior do Brasil. Não foi pandemia — foi decisão.' },
  { year: '2022', label: 'Primeira expedição com grupo: Pico dos Marins.', desc: 'Oito pessoas, duas barracas, uma câmera emprestada. Aprendi que guiar ensina mais do que fotografar.' },
  { year: '2024', label: 'Abri a loja de presets e quadros.', desc: 'Cansei de esconder os LRs no Drive. Comecei a vender o que uso. Trocou a economia do ofício.' },
  { year: '2025', label: 'Lençóis — travessia completa de 52km.', desc: 'A expedição que dividiu minha fotografia em antes e depois. O livro vem aí em 2026.' },
]

const GEAR = [
  {
    cat: 'Câmera',
    items: [
      { name: 'Sony A7 IV',      opinion: 'corpo principal, 4 anos de estrada', tag: '24MP'   },
      { name: 'Sony 24-70 GM II',opinion: 'se fosse só uma lente, seria essa',  tag: 'f/2.8'  },
      { name: 'Sony 70-200 G',   opinion: 'compressão de montanha',              tag: 'f/4'    },
      { name: 'Samyang 14mm',    opinion: 'barato e honesto pra noturno',        tag: 'f/2.8'  },
    ],
  },
  {
    cat: 'Trilha',
    items: [
      { name: 'Osprey Aether 65L',   opinion: 'desde 2019, ainda inteira',              tag: '65L'   },
      { name: 'La Sportiva Trango',  opinion: 'terceira edição, pés viciados',           tag: 'B2'    },
      { name: 'MSR Hubba NX',        opinion: '3 estações, 1.4kg, barraca-de-um',       tag: '1P'    },
      { name: 'Nitecore NU25',       opinion: 'lanterna de cabeça que cabe na camisa',  tag: 'USB-C' },
    ],
  },
  {
    cat: 'Fica em casa',
    items: [
      { name: 'Tripé "profissional"', opinion: 'pesado demais, só uso em hotel',         tag: '3kg'   },
      { name: 'Drone',               opinion: 'já não é mais diferencial',               tag: 'adeus' },
      { name: 'Filtros ND gigantes', opinion: 'resolvo com underexposure',               tag: 'RAW'   },
      { name: 'Segunda câmera',      opinion: 'uma só obriga a escolher',                tag: '—'     },
    ],
  },
]

export default function SobrePage() {
  return (
    <main style={{ background: 'var(--canvas)', color: 'var(--bark)', fontFamily: 'var(--font-ui)' }}>
      <style>{`
        .sob-float { animation: sobFloat 6s ease-in-out infinite; }
        @keyframes sobFloat { 0%,100%{transform:rotate(3deg) translateY(0)} 50%{transform:rotate(3deg) translateY(-6px)} }
        @media(max-width:900px){
          .sob-hero { grid-template-columns: 1fr !important; }
          .sob-intro { grid-template-columns: 1fr !important; }
          .sob-strip { grid-template-columns: 1fr 1fr !important; }
          .sob-gear { grid-template-columns: 1fr !important; }
          .sob-pad { padding: 64px 24px !important; }
          .sob-hero-pad { padding: 100px 24px 64px !important; }
          .sob-tl { grid-template-columns: 64px 40px 1fr !important; }
          .sob-tl-desc { display: none !important; }
        }
      `}</style>

      <SiteNav dark={false} />

      {/* ── HERO ── */}
      <section
        className="sob-hero sob-hero-pad"
        style={{ padding: '140px 56px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'end', borderBottom: '1px solid var(--line)' }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 16, fontWeight: 500 }}>№ 05 · Quem escreve</div>
          <h1 style={{ margin: 0, lineHeight: 0.86 }}>
            <span style={{ fontFamily: 'var(--font-hand)', fontSize: 68, color: 'var(--rust)', transform: 'rotate(-3deg)', display: 'inline-block', marginRight: 16 }}>oi, eu sou o</span>
            <br />
            <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(80px, 13vw, 176px)', letterSpacing: '-.05em', lineHeight: 0.86, display: 'block', color: 'var(--bark)', textTransform: 'uppercase' }}>
              HENRIQUE.
            </span>
          </h1>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: 'var(--stone)', marginTop: 28, lineHeight: 1.5, maxWidth: '40ch' }}>
            Fotógrafo de montanha, caminhante profissional, editor de fotos alheias nas horas vagas. Moro em São Paulo, mas trabalho em altitude.
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/lencois/henrique_sesana2.jpg" alt={SITE_AUTHOR} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div className="sob-float" style={{ position: 'absolute', top: -20, right: -20, width: 180, background: '#EDE4CD', padding: '16px 20px', fontFamily: 'var(--font-hand)', fontSize: 22, lineHeight: 1.2, color: 'var(--bark)', transform: 'rotate(3deg)', boxShadow: '0 10px 24px rgba(30,42,24,.12)' }}>
            carregando<br />a mesma mochila<br />desde 2019 :)
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section
        className="sob-intro sob-pad"
        style={{ padding: '96px 56px', borderBottom: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 80 }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--stone)' }}>Manifesto curto</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 22, lineHeight: 1.65, color: 'var(--bark)' }}>
          <span style={{ float: 'left', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 88, lineHeight: 0.82, color: 'var(--rust)', paddingRight: 16, paddingTop: 6 }}>N</span>
          {SOBRE_BIO[0]}
          <br /><br />
          <strong style={{ fontWeight: 500 }}>{SOBRE_BIO[1]}</strong>
        </div>
      </section>

      {/* ── NUMBERS STRIP ── */}
      <section
        className="sob-strip"
        style={{ padding: '56px', background: 'var(--forest)', color: 'var(--canvas)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}
      >
        {[
          { n: '7', acc: 'anos', label: 'Fotografando a sério' },
          { n: '18', acc: '',    label: 'Destinos visitados' },
          { n: '214', acc: '',   label: 'Pessoas guiadas' },
          { n: '1890', acc: 'km', label: 'Caminhados com câmera' },
        ].map(({ n, acc, label }) => (
          <div key={label}>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 88, letterSpacing: '-.04em', lineHeight: 0.9 }}>
              {n}<span style={{ fontFamily: 'var(--font-hand)', fontSize: 42, color: 'var(--rust-soft)', marginLeft: 6, transform: 'rotate(-3deg)', display: 'inline-block' }}>{acc}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ashe-dim)', marginTop: 12 }}>{label}</div>
          </div>
        ))}
      </section>

      {/* ── TIMELINE ── */}
      <section className="sob-pad" style={{ padding: '96px 56px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 88, letterSpacing: '-.04em', textTransform: 'uppercase', margin: 0, lineHeight: 0.9, color: 'var(--bark)' }}>
            Como cheguei aqui
          </h2>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--stone)', marginTop: 16 }}>breve história, sem romantizar demais</div>
        </div>
        {EVENTS.map((e, i) => (
          <div
            key={i}
            className="sob-tl"
            style={{ display: 'grid', gridTemplateColumns: '120px 60px 1fr 1fr', gap: 32, padding: '36px 0', borderBottom: '1px dashed var(--line)', alignItems: 'start' }}
          >
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 44, letterSpacing: '-.03em', color: 'var(--bark)' }}>{e.year}</div>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--rust)', marginTop: 16 }} />
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 24, lineHeight: 1.25, color: 'var(--bark)' }}>{e.label}</div>
            <div className="sob-tl-desc" style={{ fontFamily: 'var(--font-ui)', fontSize: 13, lineHeight: 1.7, color: 'var(--stone)' }}>{e.desc}</div>
          </div>
        ))}
      </section>

      {/* ── GEAR ── */}
      <section className="sob-pad" style={{ padding: '96px 56px', background: 'var(--canvas-deep)', borderBottom: '1px solid var(--line)' }}>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 72, letterSpacing: '-.04em', textTransform: 'uppercase', margin: '0 0 12px', lineHeight: 0.9, color: 'var(--bark)' }}>
          o que levo<span style={{ fontFamily: 'var(--font-hand)', fontSize: 44, color: 'var(--rust)', marginLeft: 12, display: 'inline-block', transform: 'rotate(-2deg)' }}>sempre</span>
        </h2>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--stone)', marginBottom: 48 }}>
          Equipamento que ganhou o lugar com quilômetro rodado. Sem afiliados, sem propaganda.
        </div>
        <div className="sob-gear" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {GEAR.map(col => (
            <div key={col.cat} style={{ borderTop: '2px solid var(--bark)', paddingTop: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.25em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 24, color: 'var(--bark)' }}>{col.cat}</div>
              {col.items.map(item => (
                <div key={item.name} style={{ padding: '14px 0', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 17, color: 'var(--bark)' }}>{item.name}</div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--stone)', marginTop: 2 }}>{item.opinion}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--stone)', letterSpacing: '.1em', whiteSpace: 'nowrap', flexShrink: 0 }}>{item.tag}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <SiteFooter dark={false} />
    </main>
  )
}
