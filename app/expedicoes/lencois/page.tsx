'use client'

import Link from 'next/link'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { motion } from 'framer-motion'

const pacotes = [
  {
    label: 'Travessia Intensiva',
    datas: '8 a 10 de Agosto',
    dias: '3 dias',
    km: '35km',
    oasis: '2 oásis',
    price: 'R$ 3.599',
    desc: 'Aventura concentrada para quem tem menos tempo. A essência dos Lençóis em 3 dias completos.',
    featured: false,
  },
  {
    label: 'Travessia Completa',
    datas: '3 a 6 de Agosto',
    dias: '4 dias',
    km: '52km',
    oasis: '3 oásis',
    price: 'R$ 3.899',
    desc: '52km do início ao fim. A experiência mais equilibrada e completa dos Lençóis.',
    featured: true,
  },
  {
    label: 'Imersão Total',
    datas: '12 a 16 de Agosto',
    dias: '5 dias',
    km: '64km',
    oasis: '4 oásis',
    price: 'R$ 4.499',
    desc: 'Ritmo contemplativo, mais tempo em cada oásis. Para quem quer viver cada detalhe.',
    featured: false,
  },
]

const dias = [
  {
    num: '01',
    rota: 'Barreirinhas → Baixa Grande',
    tempo: '8h lancha + 9km caminhada',
    desc: 'Chegada a Atins de lancha pelo Rio Preguiças. Primeiro contato com as dunas. Caminhada até o primeiro oásis e pernoite sob o céu estrelado.',
    highlight: 'Primeiro oásis · Céu estrelado',
    img: '/images/lencois/DSC01537.jpg',
  },
  {
    num: '02',
    rota: 'Baixa Grande → Queimada dos Britos',
    tempo: 'Saída 5h · 10km trekking',
    desc: 'Nascer do sol nas dunas — o momento mais fotográfico da travessia. Travessia do Rio Negro e chegada às lagoas cristalinas do coração do parque.',
    highlight: 'Nascer do sol · Lagoas cristalinas',
    img: '/images/lencois/DSC01675.jpg',
  },
  {
    num: '03',
    rota: 'Queimada dos Britos → Betânia',
    tempo: 'Saída 3h · 18km de aventura',
    desc: 'O dia mais longo e mais épico. Lagoas encantadas que parecem irreais. Comunidades que vivem isoladas entre as dunas há gerações.',
    highlight: 'Lagoas espetaculares · Comunidades locais',
    img: '/images/lencois/DJI_20250829042015_0506_D-HDR.jpg',
  },
  {
    num: '04',
    rota: 'Betânia → Santo Amaro',
    tempo: 'Início 7h · 15km finais',
    desc: 'Os 15km finais com cenários épicos. Chegada triunfal em Santo Amaro — e a sensação de ter atravessado um outro planeta.',
    highlight: 'Cenários épicos · Chegada triunfal',
    img: '/images/lencois/DJI_20250828042744_0378_D.jpg',
  },
]

const waBase = 'https://wa.me/5511988128064?text='
const waGeral = waBase + encodeURIComponent('Olá! Tenho interesse na Travessia dos Lençóis Maranhenses. Pode me passar mais informações sobre datas e vagas disponíveis?')

const CheckIcon = () => (
  <svg style={{ flexShrink: 0, marginTop: '3px' }} width="15" height="15" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" stroke="#8B6F47" strokeWidth="1.5" />
    <path d="M8 12l3 3 5-5" stroke="#8B6F47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

export default function LencoisPage() {
  return (
    <main style={{ background: '#F5F0E8', minHeight: '100vh', color: '#2C2016' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap');
        .rn { font-family: 'Reenie Beanie', cursive; }
        .hover-scale { transition: transform 600ms cubic-bezier(.4,0,.2,1); }
        .img-wrap:hover .hover-scale { transform: scale(1.04); }
        .pack-card { transition: transform 300ms ease, box-shadow 300ms ease; }
        .pack-card:hover { transform: translateY(-5px); box-shadow: 0 20px 60px rgba(44,32,22,.12); }
        .wa-btn { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; transition: opacity 250ms, transform 250ms; }
        .wa-btn:hover { opacity: .88; transform: translateY(-2px); }
        .wa-btn-full { display: flex; align-items: center; justify-content: center; gap: 10px; text-decoration: none; transition: opacity 250ms, transform 250ms; width: 100%; box-sizing: border-box; }
        .wa-btn-full:hover { opacity: .88; }
        .divider { border-top: 1px solid #DDD5C4; }
        @media(max-width:768px){
          .two-col { grid-template-columns: 1fr !important; gap: 40px !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .dia-grid { grid-template-columns: 1fr !important; }
          .hero-pad { padding: 0 24px 56px !important; }
          .sec-pad { padding: 64px 24px !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>

      {/* ══════════════════ HERO ══════════════════ */}
export function HeroLencois() {
  return (
    <section style={{ position: 'relative', height: '100svh', overflow: 'hidden' }}>
      {/* Foto de fundo — anima com zoom suave na entrada */}
      <motion.div
        initial={{ scale: 1.06, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/lencois/DJI_20250828174205_0403_D-HDR.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
          filter: 'brightness(.68) saturate(.85)',
        }}
      />

      {/* Gradiente areia */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, #F5F0E8 0%, rgba(245,240,232,.25) 52%, transparent 100%)',
      }} />

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{ position: 'absolute', top: '104px', left: '48px', zIndex: 20 }}
      >
        <Link href="/expedicoes" style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase',
          color: 'rgba(44,32,22,.4)', textDecoration: 'none',
        }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Expedições
        </Link>
      </motion.div>

      {/* Conteúdo principal */}
      <div style={{
        position: 'relative', zIndex: 10, height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '0 48px 72px',
      }}>
        {/* Tag location — blur-slide */}
        <AnimatedGroup
          preset="blur-slide"
          variants={{ container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } } }}
          style={{ display: 'contents' }}
        >
          {/* Location */}
          <p style={{ fontSize: '11px', letterSpacing: '.28em', textTransform: 'uppercase', color: '#8B6F47', marginBottom: '12px' }}>
            Maranhão, Brasil · Agosto 2026
          </p>

          {/* Título Reenie Beanie */}
          <h1 style={{ margin: '0 0 12px', lineHeight: .9 }}>
            <span className="rn" style={{ fontSize: 'clamp(4rem, 10vw, 9rem)', fontWeight: 400, color: '#2C2016', display: 'block' }}>
              Travessia dos
            </span>
            <span style={{ fontSize: 'clamp(2rem, 5.5vw, 5.2rem)', fontWeight: 800, letterSpacing: '-.03em', color: '#2C2016', display: 'block' }}>
              Lençóis Maranhenses
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '14px', color: '#8B6F47', marginBottom: '44px', fontStyle: 'italic' }}>
            Fotografia profissional inclusa · Grupos de até 10 pessoas
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            {[['35–64km', 'Distância'], ['3–5 dias', 'Duração'], ['2–4 oásis', 'Pernoites'], ['máx. 10', 'Por turma']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#2C2016', lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: '9px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#A08060', marginTop: '5px' }}>{l}</div>
              </div>
            ))}
          </div>
        </AnimatedGroup>
      </div>
    </section>
  )
}
      {/* ══════════════════ INTRO ══════════════════ */}
      <section className="sec-pad" style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="two-col">
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '.25em', textTransform: 'uppercase', color: '#A08060', marginBottom: '20px' }}>A experiência</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '6px' }}>
              Mais do que uma viagem.
            </h2>
            <div className="rn" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#8B6F47', lineHeight: 1.1, marginBottom: '32px' }}>
              Um reset completo.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              {['Noites sob céu estrelado nos oásis', 'Nasceres do sol sobre dunas infinitas', 'Lagoas cristalinas que parecem irreais', 'Histórias ao redor da fogueira', 'Conexão genuína com moradores locais'].map(item => (
                <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckIcon />
                  <span style={{ fontSize: '15px', color: '#6B5040', lineHeight: 1.65 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '14px', color: '#A08060', lineHeight: 1.9 }}>
              52km conectando Atins a Santo Amaro — a travessia mais autêntica dos Lençóis Maranhenses.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="img-wrap" style={{ borderRadius: '16px', overflow: 'hidden', gridRow: 'span 2', aspectRatio: '3/4' }}>
              <img src="/images/lencois/DSC02245.jpg" alt="Lençóis" className="hover-scale" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="img-wrap" style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '1' }}>
              <img src="/images/lencois/DJI_20250826043905_0121_D.jpg" alt="Drone" className="hover-scale" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="img-wrap" style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '1' }}>
              <img src="/images/lencois/DSC02529.jpg" alt="Lagoa" className="hover-scale" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ ROTEIRO — foto de fundo discreta ══════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/lencois/DJI_20250828042744_0378_D.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(.28) saturate(.5)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(245,240,232,.93)' }} />

        <div className="sec-pad" style={{ position: 'relative', zIndex: 5, padding: '96px 48px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <p style={{ fontSize: '10px', letterSpacing: '.25em', textTransform: 'uppercase', color: '#A08060', marginBottom: '10px' }}>Roteiro base</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, marginBottom: '64px' }}>
              4 dias.<br /><strong style={{ fontWeight: 800 }}>Cada um inesquecível.</strong>
            </h2>
            {dias.map((dia) => (
              <div key={dia.num} className="divider dia-grid" style={{
                display: 'grid', gridTemplateColumns: '64px 1fr 260px',
                gap: '40px', padding: '40px 0', alignItems: 'center',
              }}>
                <div style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, color: '#DDD5C4', lineHeight: 1, letterSpacing: '-.04em' }}>
                  {dia.num}
                </div>
                <div>
                  <p style={{ fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#8B6F47', marginBottom: '5px' }}>{dia.rota}</p>
                  <p style={{ fontSize: '11px', color: '#A08060', marginBottom: '12px' }}>{dia.tempo}</p>
                  <p style={{ fontSize: '14px', color: '#6B5040', lineHeight: 1.85, maxWidth: '440px' }}>{dia.desc}</p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px',
                    background: 'rgba(139,111,71,.07)', border: '1px solid rgba(139,111,71,.18)',
                    borderRadius: '999px', padding: '5px 14px',
                    fontSize: '11px', color: '#8B6F47', fontWeight: 600,
                  }}>
                    {dia.highlight}
                  </div>
                </div>
                <div className="img-wrap hide-mobile" style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '4/3' }}>
                  <img src={dia.img} alt={`Dia ${dia.num}`} className="hover-scale" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FOTOGRAFIA ══════════════════ */}
      <section className="sec-pad" style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="two-col">
          <div className="img-wrap" style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '3/4' }}>
            <img src="/images/lencois/DSC03215.jpg" alt="Fotografia" className="hover-scale" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '.25em', textTransform: 'uppercase', color: '#A08060', marginBottom: '20px' }}>Diferencial exclusivo</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '6px' }}>
              Guarda o celular.
            </h2>
            <div className="rn" style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', color: '#8B6F47', lineHeight: 1.05, marginBottom: '6px' }}>
              Vive de verdade.
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '32px' }}>
              A gente cuida das fotos.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
              {[
                'Fotógrafo profissional durante toda a travessia',
                'Cobertura completa: paisagens épicas, momentos espontâneos, interações com comunidades',
                'Fotos tratadas profissionalmente, entregues em até 15 dias',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckIcon />
                  <span style={{ fontSize: '14px', color: '#6B5040', lineHeight: 1.75 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '20px 24px', background: '#EDE7DB', borderRadius: '16px', border: '1px solid #DDD5C4', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="img-wrap" style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #DDD5C4' }}>
                <img src="/images/lencois/henrique_sesana1.jpg" alt="Henrique" className="hover-scale" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#2C2016' }}>Henrique Pimenta</div>
                <div style={{ fontSize: '11px', color: '#A08060' }}>@henriq.eu · Fotógrafo e guia da expedição</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ INCLUÍDO ══════════════════ */}
      <section className="sec-pad" style={{ padding: '96px 48px', background: '#EDE7DB', borderTop: '1px solid #DDD5C4', borderBottom: '1px solid #DDD5C4' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '10px', letterSpacing: '.25em', textTransform: 'uppercase', color: '#A08060', marginBottom: '10px' }}>Pacote</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, marginBottom: '48px' }}>
            O que está <strong style={{ fontWeight: 800 }}>incluído.</strong>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            {[
              { svg: <svg width="20" height="20" fill="none" stroke="#8B6F47" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>, title: 'Guia Especializado', desc: 'Profissionais que conhecem cada duna e lagoa do percurso' },
              { svg: <svg width="20" height="20" fill="none" stroke="#8B6F47" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>, title: 'Todos os Transportes', desc: 'Lancha, barcos e veículos 4x4 durante a travessia, a partir de Barreirinhas' },
              { svg: <svg width="20" height="20" fill="none" stroke="#8B6F47" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>, title: 'Alimentação Completa', desc: 'Todas as refeições preparadas por famílias locais' },
              { svg: <svg width="20" height="20" fill="none" stroke="#8B6F47" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, title: 'Hospedagem Autêntica', desc: 'Pernoites em redários nos oásis — experiência única com a natureza' },
              { svg: <svg width="20" height="20" fill="none" stroke="#8B6F47" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>, title: 'Fotografia Profissional', desc: 'Henrique (@henriq.eu) vai junto registrando cada momento da jornada' },
            ].map(item => (
              <div key={item.title} style={{ padding: '28px', background: '#F5F0E8', borderRadius: '16px', border: '1px solid #DDD5C4' }}>
                <div style={{ marginBottom: '14px' }}>{item.svg}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#2C2016', letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#7A6050', lineHeight: 1.75 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '22px 28px', background: '#F5F0E8', borderRadius: '14px', border: '1px solid #DDD5C4' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#A08060', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Não incluído</div>
            <p style={{ fontSize: '13px', color: '#A08060', lineHeight: 1.85 }}>
              Transporte São Luís → Barreirinhas · Hospedagem antes/depois da travessia · Bebidas extras · Despesas pessoais
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════ PACOTES ══════════════════ */}
      <section className="sec-pad" style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '10px', letterSpacing: '.25em', textTransform: 'uppercase', color: '#A08060', marginBottom: '10px' }}>Datas · Agosto 2026</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, marginBottom: '12px' }}>
            Escolha seu <strong style={{ fontWeight: 800 }}>pacote.</strong>
          </h2>
          <p style={{ fontSize: '13px', color: '#A08060', marginBottom: '48px' }}>
            Máximo 10 pessoas por turma · 25% de sinal para reservar a vaga
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '40px' }} className="three-col">
            {pacotes.map(p => (
              <div key={p.label} className="pack-card" style={{
                padding: '36px 28px', borderRadius: '20px', position: 'relative',
                border: p.featured ? '1.5px solid #8B6F47' : '1px solid #DDD5C4',
                background: p.featured ? '#2C2016' : '#EDE7DB',
              }}>
                {p.featured && (
                  <div style={{
                    position: 'absolute', top: '-13px', left: '28px',
                    background: '#8B6F47', color: '#F5F0E8',
                    fontSize: '9px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase',
                    padding: '5px 14px', borderRadius: '999px',
                  }}>Mais popular</div>
                )}
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#A08060', marginBottom: '8px' }}>{p.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: p.featured ? '#F5F0E8' : '#2C2016', marginBottom: '10px' }}>{p.datas}</div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {[p.dias, p.km, p.oasis].map(v => (
                    <span key={v} style={{
                      fontSize: '10px', borderRadius: '999px', padding: '3px 10px',
                      color: p.featured ? '#A08060' : '#7A6050',
                      background: p.featured ? 'rgba(255,255,255,.05)' : 'rgba(139,111,71,.07)',
                      border: `1px solid ${p.featured ? 'rgba(255,255,255,.09)' : '#DDD5C4'}`,
                    }}>{v}</span>
                  ))}
                </div>
                <p style={{ fontSize: '13px', color: p.featured ? '#A08060' : '#7A6050', lineHeight: 1.75, marginBottom: '28px' }}>{p.desc}</p>
                <div style={{ fontSize: '32px', fontWeight: 800, color: p.featured ? '#F5F0E8' : '#2C2016', marginBottom: '4px' }}>{p.price}</div>
                <div style={{ fontSize: '10px', color: p.featured ? '#60503C' : '#A08060', marginBottom: '28px' }}>por pessoa · até 12x (taxas por conta do cliente)</div>
                <a
                  href={waBase + encodeURIComponent(`Olá! Tenho interesse na ${p.label} (${p.datas}) — ${p.price}. Ainda tem vagas disponíveis?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-btn-full"
                  style={{
                    padding: '14px 24px', borderRadius: '999px',
                    fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
                    background: p.featured ? '#8B6F47' : 'transparent',
                    color: p.featured ? '#F5F0E8' : '#8B6F47',
                    border: p.featured ? 'none' : '1px solid #8B6F47',
                  }}
                >
                  Reservar esta data
                  <ArrowIcon />
                </a>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {[
              { svg: <svg width="18" height="18" fill="none" stroke="#8B6F47" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>, title: '25% de sinal', desc: 'Para garantir sua vaga na turma escolhida' },
              { svg: <svg width="18" height="18" fill="none" stroke="#8B6F47" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>, title: 'Restante na viagem', desc: 'À vista ou parcelado em até 12x*' },
              { svg: <svg width="18" height="18" fill="none" stroke="#8B6F47" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>, title: 'Cancelamento', desc: 'Até 30 dias: crédito de 12 meses. 29–15 dias: retenção de 50%' },
            ].map(item => (
              <div key={item.title} style={{ padding: '20px 22px', background: '#EDE7DB', borderRadius: '14px', border: '1px solid #DDD5C4', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ marginTop: '1px', flexShrink: 0 }}>{item.svg}</div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#2C2016', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#A08060', lineHeight: 1.7 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: '#C4B89A', marginTop: '12px' }}>*Taxas de parcelamento por conta do cliente</p>
        </div>
      </section>

      {/* ══════════════════ CTA FINAL — foto de fundo ══════════════════ */}
      <section style={{ padding: '0 48px 96px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', minHeight: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url(/images/lencois/DJI_20250828175706_0461_D-Edit-2.jpg)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'brightness(.42) saturate(.75)',
            }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(44,32,22,.42)' }} />
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '72px 40px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, color: '#F5F0E8', marginBottom: '6px', lineHeight: 1.05 }}>
                Pronto para
              </h2>
              <div className="rn" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', color: '#C4A878', lineHeight: .9, marginBottom: '28px' }}>
                atravessar?
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(245,240,232,.6)', maxWidth: '400px', margin: '0 auto 44px', lineHeight: 1.85 }}>
                Vagas limitadas a 10 pessoas por turma. Agosto 2026 — reserve com antecedência.
              </p>
              <a href={waGeral} target="_blank" rel="noopener noreferrer" className="wa-btn" style={{
                background: '#C4A878', color: '#2C2016',
                fontSize: '12px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase',
                padding: '18px 48px', borderRadius: '999px',
              }}>
                Falar no WhatsApp
                <ArrowIcon />
              </a>
              <p style={{ marginTop: '24px', fontSize: '10px', color: 'rgba(245,240,232,.22)', letterSpacing: '.1em' }}>
                Em parceria com @lencoisexperience · @livinglencois
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ GALERIA FINAL ══════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px' }}>
        {['/images/lencois/DSC02599.jpg', '/images/lencois/DSC01958.jpg', '/images/lencois/henrique_sesana2.jpg', '/images/lencois/henrique_sesana3.jpg'].map((src, i) => (
          <div key={i} className="img-wrap" style={{ aspectRatio: '1', overflow: 'hidden' }}>
            <img src={src} alt="" className="hover-scale" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        ))}
      </div>

    </main>
  )
}
