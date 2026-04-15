'use client'

import Link from 'next/link'
import Image from 'next/image'

const dias = [
  {
    num: '01',
    rota: 'Barreirinhas → Baixa Grande',
    tempo: '8h lancha + 9km caminhada (3h)',
    desc: 'Chegada a Atins de lancha pelo Rio Preguiças. Primeiro contato com as dunas. Caminhada até o primeiro oásis e pernoite sob o céu estrelado.',
    highlight: 'Primeiro oásis + céu estrelado',
    img: '/images/lencois/DSC01537.jpg',
  },
  {
    num: '02',
    rota: 'Baixa Grande → Queimada dos Britos',
    tempo: 'Saída 5h + 10km trekking (5h)',
    desc: 'Nascer do sol nas dunas — o momento mais fotográfico da travessia. Travessia do Rio Negro e chegada às lagoas cristalinas do coração do parque.',
    highlight: 'Nascer do sol nas dunas + lagoas cristalinas',
    img: '/images/lencois/DSC01675.jpg',
  },
  {
    num: '03',
    rota: 'Queimada dos Britos → Betânia',
    tempo: 'Saída 3h + 18km (6h de aventura)',
    desc: 'O dia mais longo e mais épico. Lagoas encantadas que parecem irreais. Comunidades que vivem isoladas entre as dunas há gerações.',
    highlight: 'Lagoas mais espetaculares da região',
    img: '/images/lencois/DJI_20250829042015_0506_D-HDR.jpg',
  },
  {
    num: '04',
    rota: 'Betânia → Santo Amaro',
    tempo: 'Início 7h + 15km finais (4h)',
    desc: 'Os 15km finais com cenários épicos. Chegada triunfal em Santo Amaro — e a sensação de que você atravessou um outro planeta.',
    highlight: 'Cenários épicos + chegada triunfal 11h',
    img: '/images/lencois/DJI_20250828042744_0378_D.jpg',
  },
]

const incluidos = [
  { icon: '🧭', title: 'Guia Especializado', desc: 'Profissionais que conhecem cada duna e lagoa do percurso' },
  { icon: '🚤', title: 'Todos os Transportes', desc: 'Lancha, barcos, veículos 4x4 e caiaque conforme roteiro (a partir de Barreirinhas)' },
  { icon: '🍽️', title: 'Alimentação Completa', desc: 'Todas as refeições preparadas por famílias locais' },
  { icon: '🛶', title: 'Atividade de Caiaque', desc: '15km pelo Rio Alegre com equipamentos inclusos (retorno)' },
  { icon: '🛖', title: 'Hospedagem Autêntica', desc: 'Pernoites em redários nos oásis, experiência única com a natureza' },
  { icon: '📸', title: 'Fotografia Profissional', desc: 'Registro completo da jornada por fotógrafo especializado (registro coletivo)' },
]

const naoIncluidos = [
  'Transporte até Barreirinhas (passagem aérea/ônibus)',
  'Hospedagem antes/depois da travessia',
  'Bebidas extras (refrigerantes, cervejas, energéticos)',
  'Despesas pessoais e lanches adicionais',
]

const equipamentos = [
  { cat: '🎒 Equipamento Base', items: ['Mochila de trekking 40-50L', 'Roupas leves de secagem rápida', 'Tênis para caminhada em areia', 'Sandália de trekking (tipo Papete)'] },
  { cat: '☀️ Proteção Solar', items: ['Chapéu ou boné com aba', 'Óculos de sol com proteção UV', 'Protetor solar FPS 50+ resistente', 'Repelente de insetos'] },
  { cat: '💧 Hidratação', items: ['Garrafa/squeeze de água (1-2L)', 'Lanches extras (barras, castanhas)', 'Eletrólitos/isotônicos em pó (opcional)'] },
  { cat: '🔦 Essenciais', items: ['Lanterna de cabeça / headlamp', 'Capa de chuva leve', 'Sacos estanques para eletrônicos', 'Medicamentos pessoais', 'Toalha de secagem rápida'] },
]

const pacotes = [
  { label: '🎒 Travessia Intensiva', dias: '3 dias', desc: 'Aventura concentrada para quem tem menos tempo', price: 'R$ 3.599', featured: false },
  { label: '🏆 Travessia Completa', dias: '4 dias', desc: '52km completos — a experiência mais equilibrada', price: 'R$ 3.899', featured: true },
  { label: '🌊 Travessia Profunda', dias: '5 dias', desc: 'Imersão total com ritmo contemplativo', price: 'Consulte', featured: false },
]

export default function LencoisPage() {
  return (
    <main style={{ background: '#0E0C0A', minHeight: '100vh', color: '#E6DDD4' }}>

      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', height: '100svh', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/lencois/DJI_20250828174205_0403_D-HDR.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(.55)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(14,12,10,1) 0%, rgba(14,12,10,.4) 60%, transparent 100%)',
        }} />
        <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 48px 64px' }}>
          <Link href="/expedicoes" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#746A62', marginBottom: '32px', textDecoration: 'none' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
            Expedições
          </Link>
          <p style={{ fontSize: '11px', letterSpacing: '.25em', textTransform: 'uppercase', color: '#C8905A', marginBottom: '16px' }}>
            Maranhão, Brasil · Agosto 2026
          </p>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 800, lineHeight: .95, margin: '0 0 24px', letterSpacing: '-.02em' }}>
            Travessia dos<br />
            <span style={{ fontWeight: 200 }}>Lençóis</span><br />
            Maranhenses
          </h1>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {[['52km', 'Travessia'], ['4 dias', 'Base'], ['3 oásis', 'Pernoites'], ['15 pessoas', 'Máx. grupo']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: '9px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#746A62', marginTop: '4px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTRO ─── */}
      <section style={{ padding: '80px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', maxWidth: '1280px', margin: '0 auto', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#4C4440', marginBottom: '20px' }}>A experiência</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, lineHeight: 1.1, marginBottom: '28px' }}>
            Mais do que uma viagem.<br />
            <strong style={{ fontWeight: 800 }}>Um reset completo.</strong>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Noites sob céu estrelado nos oásis', 'Nasceres do sol sobre dunas infinitas', 'Lagoas cristalinas que parecem irreais', 'Histórias ao redor da fogueira', 'Conexão genuína com moradores locais'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C8905A', flexShrink: 0 }} />
                <span style={{ fontSize: '15px', color: '#8A8078', lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '28px', fontSize: '14px', color: '#60584E', lineHeight: 1.8 }}>
            Esta é a travessia mais autêntica e completa dos Lençóis Maranhenses. 52km conectando dois mundos.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', gridRow: 'span 2', aspectRatio: '3/4' }}>
            <img src="/images/lencois/DSC02245.jpg" alt="Lençóis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '1' }}>
            <img src="/images/lencois/DJI_20250826043905_0121_D.jpg" alt="Drone Lençóis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '1' }}>
            <img src="/images/lencois/DSC02529.jpg" alt="Lagoa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* ─── ROTEIRO DIA A DIA ─── */}
      <section style={{ padding: '80px 48px', borderTop: '1px solid #1E1A17', background: '#0B0908' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#4C4440', marginBottom: '12px' }}>Roteiro</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, marginBottom: '56px' }}>
            4 dias.<br /><strong style={{ fontWeight: 800 }}>Cada um inesquecível.</strong>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {dias.map((dia, i) => (
              <div key={dia.num} style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 320px',
                gap: '40px',
                padding: '36px 0',
                borderTop: '1px solid #1E1A17',
                alignItems: 'center',
              }}>
                <div style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, color: '#1E1A17', lineHeight: 1, letterSpacing: '-.04em' }}>
                  {dia.num}
                </div>
                <div>
                  <p style={{ fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#C8905A', marginBottom: '8px' }}>{dia.rota}</p>
                  <p style={{ fontSize: '11px', color: '#4C4440', marginBottom: '12px' }}>{dia.tempo}</p>
                  <p style={{ fontSize: '14px', color: '#8A8078', lineHeight: 1.8, maxWidth: '480px' }}>{dia.desc}</p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px',
                    background: 'rgba(200,144,90,.08)', border: '1px solid rgba(200,144,90,.2)',
                    borderRadius: '999px', padding: '6px 14px',
                    fontSize: '11px', color: '#C8905A', fontWeight: 600,
                  }}>
                    ✦ {dia.highlight}
                  </div>
                </div>
                <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '4/3' }}>
                  <img src={dia.img} alt={`Dia ${dia.num}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 500ms', display: 'block' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOTO EXPERIÊNCIA ─── */}
      <section style={{ padding: '80px 48px', borderTop: '1px solid #1E1A17' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '3/4' }}>
            <img src="/images/lencois/DSC03215.jpg" alt="Fotografia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#C8905A', marginBottom: '20px' }}>Diferencial exclusivo</p>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 300, marginBottom: '24px', lineHeight: 1.1 }}>
              Guarda o celular.<br /><strong style={{ fontWeight: 800 }}>Vive de verdade.</strong><br />
              <span style={{ color: '#746A62' }}>A gente cuida das fotos.</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {[
                'Fotógrafo profissional durante TODA a travessia',
                'Cobertura completa: paisagens épicas, momentos espontâneos, interações com comunidades',
                'Fotos tratadas profissionalmente (entregues em até 15 dias)',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ color: '#7EC47E', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '14px', color: '#8A8078', lineHeight: 1.7 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '20px', background: '#161310', borderRadius: '14px', border: '1px solid #2B2420' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                <img src="/images/lencois/henrique_sesana1.jpg" alt="Henrique" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#E6DDD4' }}>Henrique Pimenta</div>
                <div style={{ fontSize: '11px', color: '#746A62' }}>@henriq.eu · Fotógrafo da expedição</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INCLUÍDO ─── */}
      <section style={{ padding: '80px 48px', borderTop: '1px solid #1E1A17', background: '#0B0908' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#4C4440', marginBottom: '12px' }}>Pacote completo</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, marginBottom: '48px' }}>
            O que está <strong style={{ fontWeight: 800 }}>incluído.</strong>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {incluidos.map(item => (
              <div key={item.title} style={{ padding: '28px', background: '#0E0C0A', borderRadius: '16px', border: '1px solid #1E1A17' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#E6DDD4', letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#60584E', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '32px', padding: '28px', background: '#0E0C0A', borderRadius: '16px', border: '1px solid #2B2420' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#746A62', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '16px' }}>❌ Não incluído no pacote</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
              {naoIncluidos.map(item => (
                <div key={item} style={{ fontSize: '13px', color: '#4C4440', display: 'flex', gap: '8px' }}>
                  <span>—</span><span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── O QUE LEVAR ─── */}
      <section style={{ padding: '80px 48px', borderTop: '1px solid #1E1A17' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#4C4440', marginBottom: '12px' }}>Preparação</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, marginBottom: '48px' }}>
            O que você <strong style={{ fontWeight: 800 }}>precisa levar.</strong>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {equipamentos.map(cat => (
              <div key={cat.cat} style={{ padding: '28px', background: '#0B0908', borderRadius: '16px', border: '1px solid #1E1A17' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#C8905A', marginBottom: '16px', letterSpacing: '.05em' }}>{cat.cat}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cat.items.map(item => (
                    <div key={item} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#60584E' }}>
                      <span style={{ color: '#2B2420', flexShrink: 0 }}>☐</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '24px', padding: '24px 28px', background: 'rgba(200,144,90,.06)', border: '1px solid rgba(200,144,90,.2)', borderRadius: '14px', fontSize: '14px', color: '#C8905A' }}>
            💡 <strong>Dica:</strong> Viaje leve! A agência fornece redários, alimentação e toda estrutura de camping. Você só precisa carregar itens pessoais.
          </div>
        </div>
      </section>

      {/* ─── INFORMAÇÕES IMPORTANTES ─── */}
      <section style={{ padding: '80px 48px', borderTop: '1px solid #1E1A17', background: '#0B0908' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#4C4440', marginBottom: '12px' }}>Antes de reservar</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, marginBottom: '48px' }}>
            Informações <strong style={{ fontWeight: 800 }}>importantes.</strong>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { icon: '⚠️', title: 'Nível da Travessia', content: 'Intermediário — caminhadas diárias de 6-8h. Necessário condicionamento físico básico. Se você caminha regularmente, você consegue!' },
              { icon: '📅', title: 'Época Ideal', content: 'Junho a Setembro (lagoas cheias). Grupo mínimo de 4 pessoas para confirmar saída.' },
              { icon: '🌦️', title: 'Condições Climáticas', content: 'Em caso de condições extremas que impeçam a travessia por segurança, a experiência poderá ser remarcada sem custo adicional.' },
              { icon: '💳', title: 'Política de Cancelamento', content: 'Até 30 dias antes: crédito válido por 12 meses. 29-15 dias antes: retenção de 50%. Menos de 14 dias: sem reembolso.' },
            ].map(item => (
              <div key={item.title} style={{ padding: '28px', background: '#0E0C0A', borderRadius: '16px', border: '1px solid #1E1A17' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#E6DDD4', marginBottom: '10px', letterSpacing: '.05em', textTransform: 'uppercase' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#60584E', lineHeight: 1.8 }}>{item.content}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PACOTES + CTA ─── */}
      <section style={{ padding: '80px 48px', borderTop: '1px solid #1E1A17' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#4C4440', marginBottom: '12px' }}>Reserve sua aventura</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, marginBottom: '48px' }}>
            Escolha seu <strong style={{ fontWeight: 800 }}>pacote.</strong>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '56px' }}>
            {pacotes.map(p => (
              <div key={p.label} style={{
                padding: '36px 28px',
                borderRadius: '20px',
                border: p.featured ? '1px solid rgba(200,144,90,.5)' : '1px solid #1E1A17',
                background: p.featured ? 'rgba(200,144,90,.06)' : '#0B0908',
                position: 'relative',
              }}>
                {p.featured && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '28px',
                    background: '#C8905A', color: '#0E0C0A',
                    fontSize: '9px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase',
                    padding: '5px 14px', borderRadius: '999px',
                  }}>
                    Mais popular
                  </div>
                )}
                <div style={{ fontSize: '13px', fontWeight: 700, color: p.featured ? '#C8905A' : '#746A62', marginBottom: '8px' }}>{p.label}</div>
                <div style={{ fontSize: '12px', color: '#4C4440', marginBottom: '16px' }}>{p.dias}</div>
                <div style={{ fontSize: '13px', color: '#60584E', lineHeight: 1.7, marginBottom: '24px' }}>{p.desc}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#E6DDD4', marginBottom: '4px' }}>{p.price}</div>
                <div style={{ fontSize: '10px', color: '#4C4440' }}>em até 12x — taxas por conta do cliente</div>
              </div>
            ))}
          </div>

          {/* CTA final */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            padding: '64px 40px',
            background: '#0B0908', borderRadius: '24px', border: '1px solid #1E1A17',
          }}>
            <div style={{ width: '80px', height: '2px', background: '#C8905A', marginBottom: '32px' }} />
            <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, marginBottom: '16px', lineHeight: 1.1 }}>
              Pronto para<br /><strong style={{ fontWeight: 800 }}>atravessar?</strong>
            </h3>
            <p style={{ fontSize: '15px', color: '#746A62', lineHeight: 1.8, maxWidth: '480px', marginBottom: '40px' }}>
              Vagas limitadas por sustentabilidade. Reserve com antecedência e garanta seu lugar.
            </p>
            <a
              href="https://wa.me/5513997000000?text=Olá!%20Tenho%20interesse%20na%20Travessia%20dos%20Lençóis%20Maranhenses."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '12px',
                background: '#C8905A', color: '#0E0C0A',
                fontSize: '12px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase',
                padding: '18px 40px', borderRadius: '999px', textDecoration: 'none',
                transition: 'opacity 300ms',
              }}
            >
              Reservar via WhatsApp
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
            <p style={{ marginTop: '20px', fontSize: '11px', color: '#4C4440' }}>
              Em parceria com @lencoisexperience · @livinglencois
            </p>
          </div>
        </div>
      </section>

      {/* ─── GALERIA FINAL ─── */}
      <section style={{ padding: '0 0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
          {[
            '/images/lencois/DSC02599.jpg',
            '/images/lencois/DJI_20250828175706_0461_D-Edit-2.jpg',
            '/images/lencois/henrique_sesana2.jpg',
            '/images/lencois/henrique_sesana3.jpg',
          ].map((src, i) => (
            <div key={i} style={{ aspectRatio: '1', overflow: 'hidden' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 600ms', display: 'block' }} />
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
