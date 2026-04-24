'use client'

import { useState } from 'react'
import SiteNav from '@/components/nav'
import SiteFooter from '@/components/site-footer'

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Tier = 'signature' | 'collectors' | 'open'
type Acabamento = 'essential' | 'gallery' | 'museum'

interface SizeOption {
  id: string
  label: string
  prices: Record<Acabamento, string>
}

interface Print {
  id: string
  img: string
  title: string
  loc: string
  tier: Tier
  ratio: string
  sizes: SizeOption[]
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const TIER_META: Record<Tier, { label: string; limit: string; bg: string; color: string }> = {
  signature: { label: 'Signature Collection', limit: 'Edição limitada — 10 prints', bg: '#5C1E1E', color: '#F5EDD6' },
  collectors: { label: 'Collectors Edition',  limit: 'Edição limitada — 25 prints', bg: '#1A2B4A', color: '#C8D8F0' },
  open:       { label: 'Open Edition',         limit: 'Sem limite de tiragem',       bg: '#1A2E1A', color: '#B8D4B8' },
}

const ACABAMENTOS: Record<Acabamento, {
  label: string
  sub: string
  papel: string
  gramatura: string
  composicao: string
  durabilidade: string
  moldura: string
  vidro: string
  passepartout: string
  certificado: string
  posicionamento: string
  popular: boolean
}> = {
  essential: {
    label: 'Essential',
    sub: 'Qualidade profissional — porta de entrada fine art',
    papel: 'Hahnemühle Photo Matte Fibre 200g',
    gramatura: '200 g/m²',
    composicao: 'Alfa-celulose premium',
    durabilidade: '75+ anos',
    moldura: 'Madeira laqueada, perfil 2cm',
    vidro: 'Cristal 2mm',
    passepartout: 'Simples, livre de ácido',
    certificado: 'Assinado pelo artista',
    posicionamento: 'Porta de entrada — qualidade profissional, papel de excelente custo-benefício',
    popular: false,
  },
  gallery: {
    label: 'Gallery',
    sub: 'O padrão de galeria — papel 100% algodão, o que museus usam',
    papel: 'Hahnemühle Photo Rag 308g',
    gramatura: '308 g/m²',
    composicao: '100% algodão',
    durabilidade: '100+ anos',
    moldura: 'Madeira maciça laqueada, perfil 3cm',
    vidro: 'Antirreflexo 2mm',
    passepartout: '5cm, livre de ácido',
    certificado: 'Hahnemühle com holograma, numerado',
    posicionamento: 'O padrão de galeria — papel 100% algodão, o que museus usam',
    popular: true,
  },
  museum: {
    label: 'Museum',
    sub: 'O topo absoluto — para colecionadores e a peça definitiva',
    papel: 'Hahnemühle Museum Etching 350g',
    gramatura: '350 g/m²',
    composicao: '100% algodão',
    durabilidade: '100+ anos',
    moldura: 'Madeira maciça premium, perfil 4cm',
    vidro: 'Museológico antirreflexo + proteção UV',
    passepartout: 'Duplo (branco + off-white), 5cm, livre de ácido',
    certificado: 'Hahnemühle com holograma, numerado',
    posicionamento: 'O topo absoluto — para colecionadores e quem quer a peça definitiva',
    popular: false,
  },
}

const FRAME_COLORS = [
  { id: 'preta',   label: 'Preta' },
  { id: 'branca',  label: 'Branca' },
  { id: 'natural', label: 'Natural' },
]

const WA_NUM = '5511999999999'

// ─── PRINTS DATA ─────────────────────────────────────────────────────────────

const PRINTS: Print[] = [
  // SIGNATURE
  {
    id: 'camadas-beleza', tier: 'signature',
    img: '/images/quadros/2 CAMADAS DE BELEZA-LENCOIS.jpg',
    title: '2 Camadas de Beleza', loc: 'Lençóis Maranhenses, MA', ratio: '3/4',
    sizes: [
      { id: '60x90',  label: '60×90 cm',  prices: { essential: 'R$ 1.990', gallery: 'R$ 2.900', museum: 'R$ 3.890' } },
      { id: '80x120', label: '80×120 cm', prices: { essential: 'R$ 3.390', gallery: 'R$ 4.900', museum: 'R$ 6.490' } },
    ],
  },
  {
    id: 'a-curva', tier: 'signature',
    img: '/images/quadros/A CURVA-LENCOIS.jpg',
    title: 'A Curva', loc: 'Lençóis Maranhenses, MA', ratio: '4/3',
    sizes: [
      { id: '60x90',  label: '60×90 cm',  prices: { essential: 'R$ 1.990', gallery: 'R$ 2.900', museum: 'R$ 3.890' } },
      { id: '80x120', label: '80×120 cm', prices: { essential: 'R$ 3.390', gallery: 'R$ 4.900', museum: 'R$ 6.490' } },
    ],
  },
  {
    id: 'reflexo-carhuacocha', tier: 'signature',
    img: '/images/quadros/REFLEXO_CARHUACOCHA-HUAYHUASH.jpg',
    title: 'Reflexo Carhuacocha', loc: 'Huayhuash, Peru', ratio: '3/4',
    sizes: [
      { id: '60x90',  label: '60×90 cm',  prices: { essential: 'R$ 1.990', gallery: 'R$ 2.900', museum: 'R$ 3.890' } },
      { id: '80x120', label: '80×120 cm', prices: { essential: 'R$ 3.390', gallery: 'R$ 4.900', museum: 'R$ 6.490' } },
    ],
  },
  {
    id: 'las-3-lagunas', tier: 'signature',
    img: '/images/quadros/LAS 3 LAGUNAS-HUAYHUASH.jpg',
    title: 'Las 3 Lagunas', loc: 'Huayhuash, Peru', ratio: '4/3',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  prices: { essential: 'R$ 1.290', gallery: 'R$ 1.900', museum: 'R$ 2.590' } },
      { id: '60x90',  label: '60×90 cm',  prices: { essential: 'R$ 1.990', gallery: 'R$ 2.900', museum: 'R$ 3.890' } },
    ],
  },
  {
    id: 'sol-toca-tudo', tier: 'signature',
    img: '/images/quadros/O SOL TOCA TUDO_LENCOIS.jpg',
    title: 'O Sol Toca Tudo', loc: 'Lençóis Maranhenses, MA', ratio: '4/3',
    sizes: [
      { id: '60x90',  label: '60×90 cm',  prices: { essential: 'R$ 1.990', gallery: 'R$ 2.900', museum: 'R$ 3.890' } },
      { id: '80x120', label: '80×120 cm', prices: { essential: 'R$ 3.390', gallery: 'R$ 4.900', museum: 'R$ 6.490' } },
    ],
  },

  // COLLECTORS
  {
    id: 'caminhos-agua', tier: 'collectors',
    img: '/images/quadros/CAMINHOS DA AGUA_VISTA-ZENITAL-LENCOIS.jpg',
    title: 'Caminhos da Água', loc: 'Lençóis Maranhenses, MA', ratio: '4/3',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  prices: { essential: 'R$ 1.090', gallery: 'R$ 1.590', museum: 'R$ 2.190' } },
      { id: '60x90',  label: '60×90 cm',  prices: { essential: 'R$ 1.590', gallery: 'R$ 2.390', museum: 'R$ 3.190' } },
    ],
  },
  {
    id: 'el-passo', tier: 'collectors',
    img: '/images/quadros/EL_PASSO_SANTA_ROSA-HUAYHUASH.jpg',
    title: 'El Passo Santa Rosa', loc: 'Huayhuash, Peru', ratio: '4/3',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  prices: { essential: 'R$ 1.090', gallery: 'R$ 1.590', museum: 'R$ 2.190' } },
      { id: '60x90',  label: '60×90 cm',  prices: { essential: 'R$ 1.590', gallery: 'R$ 2.390', museum: 'R$ 3.190' } },
    ],
  },
  {
    id: 'la-montana', tier: 'collectors',
    img: '/images/quadros/LA-MOTANA-VISTA-PICOMATEO.jpg',
    title: 'La Montaña — Vista Pico Mateo', loc: 'Huayhuash, Peru', ratio: '4/3',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  prices: { essential: 'R$ 1.090', gallery: 'R$ 1.590', museum: 'R$ 2.190' } },
      { id: '60x90',  label: '60×90 cm',  prices: { essential: 'R$ 1.590', gallery: 'R$ 2.390', museum: 'R$ 3.190' } },
    ],
  },
  {
    id: 'betania-paradisiaca', tier: 'collectors',
    img: '/images/quadros/BETANIA PARADISIACA-LENCOIS.jpg',
    title: 'Betânia Paradisíaca', loc: 'Lençóis Maranhenses, MA', ratio: '4/3',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  prices: { essential: 'R$ 1.090', gallery: 'R$ 1.590', museum: 'R$ 2.190' } },
      { id: '60x90',  label: '60×90 cm',  prices: { essential: 'R$ 1.590', gallery: 'R$ 2.390', museum: 'R$ 3.190' } },
    ],
  },
  {
    id: 'primeiros-minutos', tier: 'collectors',
    img: '/images/quadros/OS PRIMEIROS MINUTOS DO SOL-LENCOIS.jpg',
    title: 'Os Primeiros Minutos do Sol', loc: 'Lençóis Maranhenses, MA', ratio: '4/3',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  prices: { essential: 'R$ 1.090', gallery: 'R$ 1.590', museum: 'R$ 2.190' } },
      { id: '60x90',  label: '60×90 cm',  prices: { essential: 'R$ 1.590', gallery: 'R$ 2.390', museum: 'R$ 3.190' } },
    ],
  },
  {
    id: 'camp-jahuacocha', tier: 'collectors',
    img: '/images/quadros/CAMP-JAHUACOCHA-HUAYHUASH.jpg',
    title: 'Camp Jahuacocha', loc: 'Huayhuash, Peru', ratio: '3/4',
    sizes: [
      { id: '30x40',  label: '30×40 cm',  prices: { essential: 'R$ 490',   gallery: 'R$ 690',   museum: 'R$ 890' } },
      { id: '50x70',  label: '50×70 cm',  prices: { essential: 'R$ 1.090', gallery: 'R$ 1.590', museum: 'R$ 2.190' } },
    ],
  },
  {
    id: 'observando-infinito', tier: 'collectors',
    img: '/images/quadros/OBSERVANDO O INFINITO-LENCOIS.jpg',
    title: 'Observando o Infinito', loc: 'Lençóis Maranhenses, MA', ratio: '3/2',
    sizes: [
      { id: '50x70',  label: '50×70 cm',  prices: { essential: 'R$ 1.090', gallery: 'R$ 1.590', museum: 'R$ 2.190' } },
      { id: '60x90',  label: '60×90 cm',  prices: { essential: 'R$ 1.590', gallery: 'R$ 2.390', museum: 'R$ 3.190' } },
    ],
  },

  // OPEN
  {
    id: 'a-casa', tier: 'open',
    img: '/images/quadros/A CASA-LENCOIS.jpg',
    title: 'A Casa', loc: 'Lençóis Maranhenses, MA', ratio: '2/3',
    sizes: [
      { id: '30x40', label: '30×40 cm', prices: { essential: 'R$ 390', gallery: 'R$ 590', museum: 'R$ 790' } },
      { id: '50x70', label: '50×70 cm', prices: { essential: 'R$ 690', gallery: 'R$ 990', museum: 'R$ 1.390' } },
    ],
  },
  {
    id: 'a-despedida', tier: 'open',
    img: '/images/quadros/A DESPEDIDA-LENCOIS.jpg',
    title: 'A Despedida', loc: 'Lençóis Maranhenses, MA', ratio: '3/2',
    sizes: [
      { id: '30x40', label: '30×40 cm', prices: { essential: 'R$ 390', gallery: 'R$ 590', museum: 'R$ 790' } },
      { id: '50x70', label: '50×70 cm', prices: { essential: 'R$ 690', gallery: 'R$ 990', museum: 'R$ 1.390' } },
    ],
  },
  {
    id: 'marcas-passado', tier: 'open',
    img: '/images/quadros/MARCAS DO PASSADO-LENCOIS.jpg',
    title: 'Marcas do Passado', loc: 'Lençóis Maranhenses, MA', ratio: '3/4',
    sizes: [
      { id: '30x40', label: '30×40 cm', prices: { essential: 'R$ 390', gallery: 'R$ 590', museum: 'R$ 790' } },
      { id: '50x70', label: '50×70 cm', prices: { essential: 'R$ 690', gallery: 'R$ 990', museum: 'R$ 1.390' } },
    ],
  },
  {
    id: 'betania-fala', tier: 'open',
    img: '/images/quadros/BETANIA FALA-LENCOIS.jpg',
    title: 'Betânia Fala', loc: 'Lençóis Maranhenses, MA', ratio: '4/3',
    sizes: [
      { id: '30x40', label: '30×40 cm', prices: { essential: 'R$ 390', gallery: 'R$ 590', museum: 'R$ 790' } },
      { id: '50x70', label: '50×70 cm', prices: { essential: 'R$ 690', gallery: 'R$ 990', museum: 'R$ 1.390' } },
    ],
  },
  {
    id: 'observadora-arara', tier: 'open',
    img: '/images/quadros/A-OBSERVADORA-ARARA-CANINDE-RONDONIA.jpg',
    title: 'A Observadora — Arara-Canindé', loc: 'Rondônia', ratio: '3/4',
    sizes: [
      { id: '30x40', label: '30×40 cm', prices: { essential: 'R$ 390', gallery: 'R$ 590', museum: 'R$ 790' } },
      { id: '50x70', label: '50×70 cm', prices: { essential: 'R$ 690', gallery: 'R$ 990', museum: 'R$ 1.390' } },
    ],
  },
  {
    id: 'acampamento-gashpapampa', tier: 'open',
    img: '/images/quadros/ACAMPAMENTO_GASHPAPAMPA-HUAYHUASH.jpg',
    title: 'Acampamento Gashpapampa', loc: 'Huayhuash, Peru', ratio: '4/3',
    sizes: [
      { id: '30x40', label: '30×40 cm', prices: { essential: 'R$ 390', gallery: 'R$ 590', museum: 'R$ 790' } },
      { id: '50x70', label: '50×70 cm', prices: { essential: 'R$ 690', gallery: 'R$ 990', museum: 'R$ 1.390' } },
    ],
  },
]

const FAQ_ITEMS = [
  {
    q: 'Qual a diferença entre os acabamentos Essential, Gallery e Museum?',
    a: 'Os três acabamentos diferem no papel, moldura, vidro e certificado. O Essential usa Hahnemühle Photo Matte Fibre 200g (alfa-celulose, 75+ anos de durabilidade) com moldura perfil 2cm e vidro cristal. O Gallery usa Hahnemühle Photo Rag 308g (100% algodão, 100+ anos) com moldura maciça perfil 3cm, vidro antirreflexo e certificado holográfico. O Museum usa Hahnemühle Museum Etching 350g (100% algodão, textura artística) com moldura premium perfil 4cm, vidro museológico com proteção UV e passepartout duplo.',
  },
  {
    q: 'Qual a diferença entre Edição Limitada e Open Edition?',
    a: 'As tiragens Signature (10 prints) e Collectors (25 prints) são numeradas individualmente — quando esgotarem, não serão reeditadas. As Open Edition não têm limite de quantidade, mas são igualmente assinadas e impressas no mesmo nível de qualidade fine art.',
  },
  {
    q: 'Posso escolher a cor da moldura?',
    a: 'Sim. Todos os acabamentos oferecem moldura nas cores preta laqueada, branca laqueada ou madeira natural (carvalho). Informe sua preferência ao encomendar.',
  },
  {
    q: 'Como funciona o envio?',
    a: 'Cada quadro é embalado individualmente com espuma de polietileno e caixa dupla-onda reforçada. O frete é calculado conforme o CEP e informado no orçamento. Enviamos para todo o Brasil.',
  },
  {
    q: 'As fotos são assinadas?',
    a: 'Sim. Todas as obras são assinadas à mão. Os acabamentos Gallery e Museum incluem também o Certificado de Autenticidade Hahnemühle com holograma e numeração individual.',
  },
  {
    q: 'Posso encomendar um tamanho diferente?',
    a: 'Sim, sob consulta. Entre em contato via WhatsApp descrevendo o tamanho e preparamos um orçamento personalizado.',
  },
  {
    q: 'Qual o prazo de produção e entrega?',
    a: 'Produção: 10 a 15 dias úteis após confirmação do pagamento. Entrega: 3 a 7 dias úteis conforme a região. Prazo total estimado: 15 a 25 dias úteis.',
  },
  {
    q: 'O que é papel 100% algodão?',
    a: 'Papel 100% algodão (como o Hahnemühle Photo Rag e Museum Etching) é o padrão utilizado por museus e galerias de arte ao redor do mundo. Sua composição garante neutralidade química, estabilidade dimensional e durabilidade muito superior ao papel convencional (alfa-celulose), que é derivado de madeira. A diferença é visível: o papel algodão tem mais peso, textura e profundidade de cor.',
  },
  {
    q: 'Vocês fazem Canvas (tela) também?',
    a: 'Sim! Oferecemos também impressão em Canvas Fine Art (Canson Museum Art 310g) montado em chassi de madeira, sem necessidade de moldura ou vidro. Consulte valores pelo WhatsApp.',
  },
]

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: Tier }) {
  const m = TIER_META[tier]
  return (
    <span style={{ display: 'inline-block', padding: '4px 10px', background: m.bg, color: m.color, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', fontWeight: 600 }}>
      {m.limit}
    </span>
  )
}

function PickerBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 12px', border: `1px solid ${active ? 'var(--bark)' : 'var(--line)'}`,
        background: active ? 'var(--bark)' : 'transparent',
        color: active ? 'var(--canvas)' : 'var(--bark)',
        cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
        transition: 'all .2s', letterSpacing: '-.01em',
      }}
    >
      {children}
    </button>
  )
}

// ─── PRINT CARD ──────────────────────────────────────────────────────────────

function PrintCard({ p, onOrder }: { p: Print; onOrder: (p: Print, sizeId: string, acabamento: Acabamento) => void }) {
  const [sizeId, setSizeId] = useState(p.sizes[0].id)
  const [acabamento, setAcabamento] = useState<Acabamento>('gallery')

  const selectedSize = p.sizes.find(s => s.id === sizeId)!
  const price = selectedSize.prices[acabamento]
  const acabMeta = ACABAMENTOS[acabamento]

  return (
    <article className="qcard" style={{ display: 'flex', flexDirection: 'column', background: 'var(--canvas)', border: '1px solid var(--line)', cursor: 'default' }}>
      {/* photo */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--canvas-deep)' }}>
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
          <TierBadge tier={p.tier} />
        </div>
        <div style={{ padding: '20px 20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="qframe" style={{ background: '#1A1612', padding: 8, boxShadow: '0 10px 28px rgba(0,0,0,.3)', width: '100%', aspectRatio: p.ratio, transition: 'transform .6s cubic-bezier(.2,.7,.2,1)' }}>
            <div style={{ padding: 4, background: '#F0EBE0', height: '100%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1, gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 4 }}>{p.loc}</div>
          <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 17, letterSpacing: '-.02em', lineHeight: 1.1, margin: 0, color: 'var(--bark)' }}>{p.title}</h3>
        </div>

        {/* size picker */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 6 }}>Tamanho</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {p.sizes.map(sz => (
              <PickerBtn key={sz.id} active={sizeId === sz.id} onClick={() => setSizeId(sz.id)}>
                {sz.label}
              </PickerBtn>
            ))}
          </div>
        </div>

        {/* acabamento picker */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 6 }}>Acabamento</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {(['essential', 'gallery', 'museum'] as Acabamento[]).map(a => (
              <PickerBtn key={a} active={acabamento === a} onClick={() => setAcabamento(a)}>
                {ACABAMENTOS[a].label}
                {ACABAMENTOS[a].popular && <span style={{ marginLeft: 4, fontSize: 9, opacity: 0.7 }}>★</span>}
              </PickerBtn>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 11, color: 'var(--stone)', marginTop: 5, lineHeight: 1.4 }}>
            {acabMeta.papel}
          </div>
        </div>

        {/* price + cta */}
        <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px dashed var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--stone)' }}>valor</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 22, letterSpacing: '-.02em', color: 'var(--bark)' }}>{price}</div>
          </div>
          <button
            className="qcta-btn"
            onClick={() => onOrder(p, sizeId, acabamento)}
            style={{ padding: '10px 18px', background: 'var(--bark)', color: 'var(--canvas)', border: 'none', fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .2s' }}
          >
            Encomendar →
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── TIER SECTION ────────────────────────────────────────────────────────────

function TierSection({ tier, prints, onOrder }: { tier: Tier; prints: Print[]; onOrder: (p: Print, sizeId: string, a: Acabamento) => void }) {
  const meta = TIER_META[tier]
  return (
    <section style={{ marginBottom: 72 }}>
      <div style={{ paddingBottom: 24, borderBottom: '1px solid var(--line)', marginBottom: 32, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <TierBadge tier={tier} />
          <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 30, letterSpacing: '-.03em', margin: '10px 0 0', color: 'var(--bark)' }}>{meta.label}</h2>
        </div>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--stone)' }}>{prints.length} obras disponíveis</span>
      </div>
      <div className="qgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}>
        {prints.map(p => <PrintCard key={p.id} p={p} onOrder={onOrder} />)}
      </div>
    </section>
  )
}

// ─── ORDER MODAL ─────────────────────────────────────────────────────────────

interface OrderState { print: Print; sizeId: string; acabamento: Acabamento }

function OrderModal({ state, onClose }: { state: OrderState; onClose: () => void }) {
  const { print, sizeId, acabamento } = state
  const [frameColor, setFrameColor] = useState('preta')
  const [step, setStep] = useState<0 | 1>(0)
  const [form, setForm] = useState({ nome: '', whatsapp: '', cidade: '', obs: '' })

  const selectedSize = print.sizes.find(s => s.id === sizeId)!
  const price = selectedSize.prices[acabamento]
  const acabMeta = ACABAMENTOS[acabamento]
  const frameMeta = FRAME_COLORS.find(f => f.id === frameColor)!

  function openWhatsApp() {
    const msg = encodeURIComponent(
      `Olá! Tenho interesse em encomendar um quadro fine art.\n\n` +
      `*Obra:* ${print.title}\n` +
      `*Tamanho:* ${selectedSize.label}\n` +
      `*Acabamento:* ${acabMeta.label} — ${acabMeta.papel}\n` +
      `*Moldura:* ${frameMeta.label}\n` +
      `*Valor:* ${price}\n\n` +
      `*Nome:* ${form.nome}\n` +
      `*WhatsApp:* ${form.whatsapp}\n` +
      `*Cidade:* ${form.cidade}\n` +
      (form.obs ? `*Obs:* ${form.obs}` : '')
    )
    window.open(`https://wa.me/${WA_NUM}?text=${msg}`, '_blank')
    onClose()
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,.82)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} className="qmodal" style={{ width: 1020, maxWidth: '100%', maxHeight: '92vh', background: 'var(--canvas)', color: 'var(--bark)', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'auto', position: 'relative' }}>

        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 34, height: 34, background: 'var(--bark)', color: 'var(--canvas)', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>×</button>

        {/* LEFT: preview */}
        <div style={{ background: 'var(--canvas-deep)', padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, minHeight: 460 }}>
          <div style={{ background: frameColor === 'branca' ? '#FFF' : frameColor === 'natural' ? '#C9B48A' : '#1A1612', padding: 12, boxShadow: '0 20px 50px rgba(0,0,0,.4)', width: '82%', aspectRatio: '3/2', transition: 'background .3s' }}>
            <div style={{ padding: 6, background: '#F4EEE2', height: '100%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={print.img} alt={print.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-hand)', fontSize: 20, color: 'var(--stone)', transform: 'rotate(-2deg)' }}>
            preview · {selectedSize.label}
          </div>
          <TierBadge tier={print.tier} />
        </div>

        {/* RIGHT */}
        <div style={{ padding: '36px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {step === 0 && (
            <>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 8 }}>Confirmar encomenda</div>
              <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 26, letterSpacing: '-.03em', margin: '0 0 4px', lineHeight: 1 }}>{print.title}</h3>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--stone)', marginBottom: 22 }}>{print.loc}</div>

              {/* summary */}
              <div style={{ padding: '14px 16px', background: 'var(--canvas-deep)', border: '1px solid var(--line)', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  ['Tamanho', selectedSize.label],
                  ['Acabamento', `${acabMeta.label} — ${acabMeta.papel}`],
                  ['Durabilidade', acabMeta.durabilidade],
                  ['Vidro', acabMeta.vidro],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--stone)' }}>{k}</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--bark)', textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* frame color */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 8 }}>Cor da moldura</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {FRAME_COLORS.map(fc => (
                    <PickerBtn key={fc.id} active={frameColor === fc.id} onClick={() => setFrameColor(fc.id)}>{fc.label}</PickerBtn>
                  ))}
                </div>
              </div>

              {/* price */}
              <div style={{ padding: '16px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)' }}>Total — inclui impressão + moldura + certificado</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 24, letterSpacing: '-.02em', color: 'var(--bark)', flexShrink: 0 }}>{price}</div>
              </div>

              {/* form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                {([['Nome', 'text', 'nome', ''], ['WhatsApp', 'tel', 'whatsapp', '+55 11 9...'], ['Cidade de entrega', 'text', 'cidade', 'São Paulo, SP']] as const).map(([label, type, field, ph]) => (
                  <div key={field}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', display: 'block', marginBottom: 6 }}>{label}</label>
                    <input type={type} placeholder={ph} value={form[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                      style={{ width: '100%', padding: '8px 0 6px', border: 'none', borderBottom: '1px solid var(--bark)', background: 'transparent', fontFamily: 'var(--font-serif)', fontSize: 16, outline: 'none', color: 'var(--bark)', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', display: 'block', marginBottom: 6 }}>Observações (opcional)</label>
                  <textarea placeholder="Presente, dedicatória, urgência..." value={form.obs} onChange={e => setForm(prev => ({ ...prev, obs: e.target.value }))}
                    style={{ width: '100%', padding: '8px 0 6px', border: 'none', borderBottom: '1px solid var(--bark)', background: 'transparent', fontFamily: 'var(--font-serif)', fontSize: 14, outline: 'none', resize: 'none', minHeight: 50, color: 'var(--bark)', boxSizing: 'border-box' }} />
                </div>
              </div>

              <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--stone)', margin: '0 0 16px', lineHeight: 1.5 }}>
                Você não paga agora — em até 24h envio orçamento com link de pagamento e prazo exato.
              </p>

              <button onClick={openWhatsApp} style={{ padding: '14px 20px', background: '#25D366', color: '#fff', border: 'none', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Finalizar via WhatsApp
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── ACABAMENTOS SECTION ─────────────────────────────────────────────────────

function AcabamentosSection() {
  return (
    <section style={{ padding: '72px 56px', background: 'var(--canvas-deep)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 16 }}>Acabamentos disponíveis</div>
      <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 40, letterSpacing: '-.03em', margin: '0 0 40px', lineHeight: 1 }}>
        Escolha o nível de acabamento.<br />
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--moss)', fontSize: 36 }}>A foto é a mesma. O acabamento é seu.</span>
      </h2>
      <div className="acab-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {(['essential', 'gallery', 'museum'] as Acabamento[]).map(key => {
          const a = ACABAMENTOS[key]
          return (
            <div key={key} style={{
              padding: '28px 24px 32px',
              border: a.popular ? '1px solid var(--rust-soft)' : '1px solid var(--line)',
              background: a.popular ? 'rgba(var(--rust-rgb, 180,80,40),.04)' : 'transparent',
              position: 'relative',
            }}>
              {a.popular && (
                <div style={{ position: 'absolute', top: -1, right: 20, background: 'var(--rust)', color: 'var(--canvas)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', padding: '4px 10px', fontWeight: 700 }}>
                  Mais escolhido
                </div>
              )}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 8 }}>{key}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 28, letterSpacing: '-.02em', color: 'var(--bark)', marginBottom: 8 }}>{a.label}</div>
              <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--stone)', margin: '0 0 24px', lineHeight: 1.5 }}>{a.posicionamento}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  ['Papel', `${a.papel}`],
                  ['Gramatura', a.gramatura],
                  ['Composição', a.composicao],
                  ['Durabilidade', a.durabilidade],
                  ['Moldura', a.moldura],
                  ['Vidro', a.vidro],
                  ['Passepartout', a.passepartout],
                  ['Certificado', a.certificado],
                ].map(([k, v]) => (
                  <div key={k} style={{ padding: '9px 0', borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '108px 1fr', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--stone)' }}>{k}</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--bark)', lineHeight: 1.35 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─── COMPARISON TABLE ────────────────────────────────────────────────────────

function ComparisonTable() {
  const rows: [string, string, string, string][] = [
    ['Papel',          'Hahnemühle Photo Matte Fibre 200g', 'Hahnemühle Photo Rag 308g',      'Hahnemühle Museum Etching 350g'],
    ['Composição',     'Alfa-celulose premium',             '100% algodão',                   '100% algodão'],
    ['Gramatura',      '200 g/m²',                          '308 g/m²',                       '350 g/m²'],
    ['Textura',        'Lisa, fosca',                       'Lisa, fosca',                    'Texturizada, artística'],
    ['Durabilidade',   '75+ anos',                          '100+ anos',                      '100+ anos'],
    ['Moldura',        'Laqueada, perfil 2cm',              'Maciça laqueada, perfil 3cm',    'Maciça premium, perfil 4cm'],
    ['Vidro',          'Cristal 2mm',                       'Antirreflexo 2mm',               'Museológico + UV'],
    ['Passepartout',   'Simples, livre de ácido',           '5cm, livre de ácido',            'Duplo, 5cm, livre de ácido'],
    ['Certificado',    'Assinado pelo artista',             'Hahnemühle holográfico',         'Hahnemühle holográfico'],
    ['Ideal para',     'Decoração com qualidade',           'Colecionadores e décor premium', 'Colecionadores e galerias'],
  ]
  return (
    <section style={{ padding: '72px 56px', borderBottom: '1px solid var(--line)', overflowX: 'auto' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 16 }}>Comparativo</div>
      <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 40, letterSpacing: '-.03em', margin: '0 0 36px', lineHeight: 1 }}>Essential · Gallery · Museum</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
        <thead>
          <tr>
            <th style={{ padding: '10px 16px 10px 0', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', fontWeight: 500, borderBottom: '2px solid var(--line)' }}></th>
            {(['essential', 'gallery', 'museum'] as Acabamento[]).map(k => (
              <th key={k} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 14, color: 'var(--bark)', borderBottom: '2px solid var(--line)', borderLeft: '1px solid var(--line)' }}>
                {ACABAMENTOS[k].label}
                {ACABAMENTOS[k].popular && <span style={{ marginLeft: 8, fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--rust)', fontWeight: 600 }}>★ popular</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, essential, gallery, museum], i) => (
            <tr key={label} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--canvas-deep)' }}>
              <td style={{ padding: '10px 16px 10px 0', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--stone)', borderBottom: '1px solid var(--line)' }}>{label}</td>
              {[essential, gallery, museum].map((v, j) => (
                <td key={j} style={{ padding: '10px 16px', fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--bark)', borderBottom: '1px solid var(--line)', borderLeft: '1px solid var(--line)', lineHeight: 1.4 }}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{ width: '100%', textAlign: 'left', padding: '20px 0', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, letterSpacing: '-.01em', color: 'var(--bark)' }}>
            {item.q}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--stone)', flexShrink: 0, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform .3s', display: 'block', lineHeight: 1 }}>+</span>
          </button>
          {open === i && (
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.75, color: 'var(--stone)', margin: '0 0 20px', maxWidth: '70ch' }}>{item.a}</p>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function QuadrosPage() {
  const [orderState, setOrderState] = useState<OrderState | null>(null)

  const byTier = (t: Tier) => PRINTS.filter(p => p.tier === t)

  function handleOrder(p: Print, sizeId: string, acabamento: Acabamento) {
    setOrderState({ print: p, sizeId, acabamento })
  }

  return (
    <main style={{ background: 'var(--canvas)', color: 'var(--bark)', fontFamily: 'var(--font-ui)', minHeight: '100vh' }}>
      <style>{`
        .qcard { transition: transform .5s cubic-bezier(.2,.7,.2,1), box-shadow .5s cubic-bezier(.2,.7,.2,1); }
        .qcard:hover { transform: translateY(-4px); box-shadow: 0 20px 44px rgba(30,42,24,.1); }
        .qcard:hover .qframe { transform: scale(1.04); }
        .qcta-btn:hover { background: var(--rust) !important; }
        @media(max-width:1060px){ .qgrid { grid-template-columns: 1fr 1fr !important; gap: 18px !important; } .acab-grid { grid-template-columns: 1fr !important; gap: 16px !important; } }
        @media(max-width:620px){ .qgrid { grid-template-columns: 1fr !important; } .qmodal { grid-template-columns: 1fr !important; } }
        @media(max-width:780px){ .qmodal { grid-template-columns: 1fr !important; } }
        @media(max-width:700px){ .quad-hero { padding: 100px 24px 48px !important; } .quad-pad { padding: 40px 24px 60px !important; } }
      `}</style>

      <SiteNav dark={false} />

      {/* ── HERO ── */}
      <header className="quad-hero" style={{ padding: '140px 56px 64px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 20 }}>
          № 04 · Fine Art Prints · Assinados & Numerados
        </div>
        <h1 style={{ margin: 0, lineHeight: 0.9 }}>
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: 54, color: 'var(--rust)', transform: 'rotate(-2deg)', display: 'inline-block', marginBottom: 6 }}>
            para a sua parede—
          </span>
          <br />
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(72px, 14vw, 200px)', letterSpacing: '-.05em', lineHeight: 0.86, display: 'block', textTransform: 'uppercase' }}>
            QUADROS.
          </span>
        </h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 20, color: 'var(--stone)', marginTop: 32, maxWidth: '52ch', lineHeight: 1.65 }}>
          Três níveis de acabamento. Dezoito obras. Uma impressão assinada à mão com certificado de autenticidade.
          Produzida sob encomenda em laboratório fine art especializado.
        </p>
      </header>

      {/* ── ACABAMENTOS ── */}
      <AcabamentosSection />

      {/* ── PRODUCTS ── */}
      <div className="quad-pad" style={{ padding: '64px 56px 32px' }}>
        <TierSection tier="signature" prints={byTier('signature')} onOrder={handleOrder} />
        <TierSection tier="collectors" prints={byTier('collectors')} onOrder={handleOrder} />
        <TierSection tier="open" prints={byTier('open')} onOrder={handleOrder} />
      </div>

      {/* ── COMPARISON ── */}
      <ComparisonTable />

      {/* ── COMO FUNCIONA ── */}
      <section style={{ padding: '72px 56px', background: 'var(--canvas-deep)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 16 }}>Processo</div>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 40, letterSpacing: '-.03em', margin: '0 0 48px', lineHeight: 1 }}>Como funciona</h2>
        <div className="como-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 36 }}>
          {[
            ['01', 'Escolha', 'Selecione a obra, o tamanho, o acabamento e a cor da moldura diretamente nesta página.'],
            ['02', 'Encomenda', 'Finalize pelo WhatsApp — sem pagamento agora. Em até 24h envio o orçamento completo.'],
            ['03', 'Produção', 'Impressão artesanal em laboratório fine art certificado. Prazo: 10 a 15 dias úteis.'],
            ['04', 'Entrega', 'Embalagem reforçada com espuma e caixa dupla-onda. Envio para todo o Brasil.'],
          ].map(([num, title, desc]) => (
            <div key={num}>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 68, letterSpacing: '-.05em', lineHeight: 0.9, color: 'var(--line)', marginBottom: 14 }}>{num}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 17, color: 'var(--bark)', marginBottom: 8 }}>{title}</div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.65, color: 'var(--stone)', margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CREDIBILIDADE ── */}
      <section style={{ padding: '40px 56px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
        {[
          ['Hahnemühle Certified', 'Papel e certificado autênticos'],
          ['100+ anos', 'Durabilidade das tintas pigmentadas'],
          ['Assinado & Numerado', 'Cada obra com identidade única'],
          ['Laboratório Fine Art', 'Impressão profissional especializada'],
        ].map(([title, desc]) => (
          <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: 'var(--canvas-deep)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: 20, color: 'var(--rust)' }}>✓</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13, color: 'var(--bark)' }}>{title}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--stone)', marginTop: 2 }}>{desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '72px 56px 96px', maxWidth: 880 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 16 }}>Dúvidas frequentes</div>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 40, letterSpacing: '-.03em', margin: '0 0 36px', lineHeight: 1 }}>FAQ</h2>
        <FaqAccordion />
      </section>

      {/* ── WA FLOAT ── */}
      <a href={`https://wa.me/${WA_NUM}?text=${encodeURIComponent('Olá! Tenho interesse em um quadro fine art.')}`} target="_blank" rel="noopener noreferrer"
        style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 100, width: 54, height: 54, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}
        aria-label="Contato via WhatsApp">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      <SiteFooter dark={false} />

      {orderState && <OrderModal state={orderState} onClose={() => setOrderState(null)} />}
    </main>
  )
}
