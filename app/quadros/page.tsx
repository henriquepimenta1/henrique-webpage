'use client'

import { useState } from 'react'
import SiteNav from '@/components/nav'
import SiteFooter from '@/components/site-footer'

type Tier = 'signature' | 'collectors' | 'open'
type Acabamento = 'essential' | 'gallery' | 'museum'

interface SizeOption {
  id: string
  label: string
  prices: Record<Acabamento, string>
  custom?: boolean
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

const CUSTOM_SIZE: SizeOption = {
  id: 'custom',
  label: 'Personalizado',
  prices: { essential: 'Consulte', gallery: 'Consulte', museum: 'Consulte' },
  custom: true,
}

const TIER_META: Record<Tier, { label: string; limit: string; bg: string; color: string; subtitle: string }> = {
  signature: { label: 'Signature Collection', limit: 'Edição limitada — 10 prints', bg: '#5C1E1E', color: '#F5EDD6', subtitle: '6 obras disponíveis · a partir de R$ 1.900' },
  collectors: { label: 'Collectors Edition',  limit: 'Edição limitada — 25 prints', bg: '#1A2B4A', color: '#C8D8F0', subtitle: '9 obras disponíveis · a partir de R$ 550' },
  open:       { label: 'Open Edition',         limit: 'Sem limite de tiragem',       bg: '#1A2E1A', color: '#B8D4B8', subtitle: '7 obras disponíveis · a partir de R$ 450' },
}

const ACABAMENTOS: Record<Acabamento, { label: string; papel: string; gramatura: string; composicao: string; durabilidade: string; moldura: string; vidro: string; passepartout: string; certificado: string; posicionamento: string; popular: boolean }> = {
  essential: { label: 'Essential', papel: 'Hahnemühle Photo Matte Fibre 200g', gramatura: '200 g/m²', composicao: 'Alfa-celulose premium', durabilidade: '75+ anos', moldura: 'Madeira laqueada, perfil 2cm', vidro: 'Cristal 2mm', passepartout: 'Simples, livre de ácido', certificado: 'Assinado pelo artista', posicionamento: 'Porta de entrada — qualidade profissional, papel de excelente custo-benefício', popular: false },
  gallery:   { label: 'Gallery',   papel: 'Hahnemühle Photo Rag 308g',         gramatura: '308 g/m²', composicao: '100% algodão',          durabilidade: '100+ anos', moldura: 'Madeira maciça laqueada, perfil 3cm', vidro: 'Antirreflexo 2mm', passepartout: '5cm, livre de ácido', certificado: 'Hahnemühle com holograma, numerado', posicionamento: 'O padrão de galeria — papel 100% algodão, o que museus usam', popular: true },
  museum:    { label: 'Museum',    papel: 'Hahnemühle Museum Etching 350g',    gramatura: '350 g/m²', composicao: '100% algodão',          durabilidade: '100+ anos', moldura: 'Madeira maciça premium, perfil 4cm', vidro: 'Museológico antirreflexo + UV', passepartout: 'Duplo (branco + off-white), 5cm', certificado: 'Hahnemühle com holograma, numerado', posicionamento: 'O topo absoluto — para colecionadores e quem quer a peça definitiva', popular: false },
}

const FRAME_COLORS = [
  { id: 'preta', label: 'Preta' },
  { id: 'branca', label: 'Branca' },
  { id: 'natural', label: 'Natural' },
]

const WA_NUM = '5511988128064'

const SIG_60_80: SizeOption[] = [
  { id: '60x90',  label: '60×90 cm',  prices: { essential: 'R$ 1.990', gallery: 'R$ 2.900', museum: 'R$ 3.890' } },
  { id: '80x120', label: '80×120 cm', prices: { essential: 'R$ 3.390', gallery: 'R$ 4.900', museum: 'R$ 6.490' } },
  CUSTOM_SIZE,
]
const COL_50_60: SizeOption[] = [
  { id: '50x70', label: '50×70 cm', prices: { essential: 'R$ 1.090', gallery: 'R$ 1.590', museum: 'R$ 2.190' } },
  { id: '60x90', label: '60×90 cm', prices: { essential: 'R$ 1.590', gallery: 'R$ 2.390', museum: 'R$ 3.190' } },
  CUSTOM_SIZE,
]
const OPEN_30_50: SizeOption[] = [
  { id: '30x40', label: '30×40 cm', prices: { essential: 'R$ 450', gallery: 'R$ 650', museum: 'R$ 790' } },
  { id: '50x70', label: '50×70 cm', prices: { essential: 'R$ 750', gallery: 'R$ 1.090', museum: 'R$ 1.390' } },
  CUSTOM_SIZE,
]

const PRINTS: Print[] = [
  // SIGNATURE
  { id: 'camadas-beleza',       tier: 'signature', ratio: '3/4', img: '/images/quadros/2 CAMADAS DE BELEZA-LENCOIS.jpg',                   title: '2 Camadas de Beleza',          loc: 'Lençóis Maranhenses, MA',           sizes: SIG_60_80 },
  { id: 'a-curva',              tier: 'signature', ratio: '4/3', img: '/images/quadros/A CURVA-LENCOIS.jpg',                                title: 'A Curva',                      loc: 'Lençóis Maranhenses, MA',           sizes: SIG_60_80 },
  { id: 'reflexo-carhuacocha', tier: 'signature', ratio: '3/4', img: '/images/quadros/REFLEXO_CARHUACOCHA-HUAYHUASH.jpg',                  title: 'Reflexo Carhuacocha',          loc: 'Huayhuash, Peru',                   sizes: SIG_60_80 },
  {
    id: 'las-3-lagunas', tier: 'signature', ratio: '4/3', img: '/images/quadros/LAS 3 LAGUNAS-HUAYHUASH.jpg', title: 'Las 3 Lagunas', loc: 'Huayhuash, Peru',
    sizes: [
      { id: '50x70', label: '50×70 cm', prices: { essential: 'R$ 1.290', gallery: 'R$ 1.900', museum: 'R$ 2.590' } },
      { id: '60x90', label: '60×90 cm', prices: { essential: 'R$ 1.990', gallery: 'R$ 2.900', museum: 'R$ 3.890' } },
      CUSTOM_SIZE,
    ],
  },
  { id: 'sol-toca-tudo',        tier: 'signature', ratio: '4/3', img: '/images/quadros/O SOL TOCA TUDO_LENCOIS.jpg',                        title: 'O Sol Toca Tudo',              loc: 'Lençóis Maranhenses, MA',           sizes: SIG_60_80 },
  { id: 'conexao-rios',         tier: 'signature', ratio: '4/3', img: '/images/quadros/CONEXAO_ENTRE_RIOS-PAKAAS-MAMORE-RONDONIA.jpg',      title: 'Conexão Entre Rios',           loc: 'Pakaas, Rio Mamoré — Rondônia',    sizes: SIG_60_80 },

  // COLLECTORS
  { id: 'caminhos-agua',        tier: 'collectors', ratio: '4/3', img: '/images/quadros/CAMINHOS DA AGUA_VISTA-ZENITAL-LENCOIS.jpg',         title: 'Caminhos da Água',             loc: 'Lençóis Maranhenses, MA',           sizes: COL_50_60 },
  { id: 'el-passo',             tier: 'collectors', ratio: '4/3', img: '/images/quadros/EL_PASSO_SANTA_ROSA-HUAYHUASH.jpg',                  title: 'El Passo Santa Rosa',          loc: 'Huayhuash, Peru',                   sizes: COL_50_60 },
  { id: 'la-montana',           tier: 'collectors', ratio: '4/3', img: '/images/quadros/LA-MOTANA-VISTA-PICOMATEO.jpg',                      title: 'La Montaña — Vista Pico Mateo', loc: 'Huayhuash, Peru',                  sizes: COL_50_60 },
  { id: 'betania-paradisiaca',  tier: 'collectors', ratio: '4/3', img: '/images/quadros/BETANIA PARADISIACA-LENCOIS.jpg',                   title: 'Betânia Paradisíaca',          loc: 'Lençóis Maranhenses, MA',           sizes: COL_50_60 },
  { id: 'primeiros-minutos',    tier: 'collectors', ratio: '4/3', img: '/images/quadros/OS PRIMEIROS MINUTOS DO SOL-LENCOIS.jpg',            title: 'Os Primeiros Minutos do Sol',  loc: 'Lençóis Maranhenses, MA',           sizes: COL_50_60 },
  {
    id: 'camp-jahuacocha', tier: 'collectors', ratio: '3/4', img: '/images/quadros/CAMP-JAHUACOCHA-HUAYHUASH.jpg', title: 'Camp Jahuacocha', loc: 'Huayhuash, Peru',
    sizes: [
      { id: '30x40', label: '30×40 cm', prices: { essential: 'R$ 550',   gallery: 'R$ 890',   museum: 'R$ 1.090' } },
      { id: '50x70', label: '50×70 cm', prices: { essential: 'R$ 1.090', gallery: 'R$ 1.590', museum: 'R$ 2.190' } },
      CUSTOM_SIZE,
    ],
  },
  { id: 'observando-infinito',  tier: 'collectors', ratio: '3/2', img: '/images/quadros/OBSERVANDO O INFINITO-LENCOIS.jpg',                  title: 'Observando o Infinito',        loc: 'Lençóis Maranhenses, MA',           sizes: COL_50_60 },
  { id: 'camadas-natureza',     tier: 'collectors', ratio: '8/5', img: '/images/quadros/CAMADAS_DA_NATUREZA-PAKAAS-MAMORE-RONDONIA.jpg',     title: 'Camadas da Natureza',          loc: 'Pakaas, Rio Mamoré — Rondônia',    sizes: COL_50_60 },
  { id: 'encontro-rios',        tier: 'collectors', ratio: '3/2', img: '/images/quadros/ENCONTR_DOS_RIOS-PAKAAS-MAMORE-RONDONIA.jpg',        title: 'Encontro dos Rios',            loc: 'Pakaas, Rio Mamoré — Rondônia',    sizes: COL_50_60 },

  // OPEN
  { id: 'a-casa',               tier: 'open', ratio: '2/3', img: '/images/quadros/A CASA-LENCOIS.jpg',                                      title: 'A Casa',                       loc: 'Lençóis Maranhenses, MA',           sizes: OPEN_30_50 },
  { id: 'a-despedida',          tier: 'open', ratio: '3/2', img: '/images/quadros/A DESPEDIDA-LENCOIS.jpg',                                  title: 'A Despedida',                  loc: 'Lençóis Maranhenses, MA',           sizes: OPEN_30_50 },
  { id: 'marcas-passado',       tier: 'open', ratio: '3/4', img: '/images/quadros/MARCAS DO PASSADO-LENCOIS.jpg',                           title: 'Marcas do Passado',            loc: 'Lençóis Maranhenses, MA',           sizes: OPEN_30_50 },
  { id: 'betania-fala',         tier: 'open', ratio: '4/3', img: '/images/quadros/BETANIA FALA-LENCOIS.jpg',                                title: 'Betânia Fala',                 loc: 'Lençóis Maranhenses, MA',           sizes: OPEN_30_50 },
  { id: 'observadora-arara',    tier: 'open', ratio: '3/4', img: '/images/quadros/A-OBSERVADORA-ARARA-CANINDE-RONDONIA.jpg',                 title: 'A Observadora — Arara-Canindé', loc: 'Rondônia',                         sizes: OPEN_30_50 },
  { id: 'gashpapampa',          tier: 'open', ratio: '4/3', img: '/images/quadros/ACAMPAMENTO_GASHPAPAMPA-HUAYHUASH.jpg',                   title: 'Acampamento Gashpapampa',      loc: 'Huayhuash, Peru',                   sizes: OPEN_30_50 },
  { id: 'encontro-rios-2',      tier: 'open', ratio: '3/2', img: '/images/quadros/ENCONTR_DOS_RIOS-PAKAAS-MAMORE-RONDONIA2.jpg',            title: 'Encontro dos Rios II',         loc: 'Pakaas, Rio Mamoré — Rondônia',    sizes: OPEN_30_50 },
]

const FAQ_ITEMS = [
  { q: 'Qual a diferença entre os acabamentos Essential, Gallery e Museum?', a: 'Os três acabamentos diferem no papel, moldura, vidro e certificado. O Essential usa Hahnemühle Photo Matte Fibre 200g (alfa-celulose, 75+ anos) com moldura perfil 2cm e vidro cristal. O Gallery usa Hahnemühle Photo Rag 308g (100% algodão, 100+ anos) com moldura maciça perfil 3cm, vidro antirreflexo e certificado holográfico. O Museum usa Hahnemühle Museum Etching 350g (100% algodão, textura artística) com moldura premium perfil 4cm, vidro museológico com proteção UV e passepartout duplo.' },
  { q: 'Qual a diferença entre Edição Limitada e Open Edition?', a: 'As tiragens Signature (10 prints) e Collectors (25 prints) são numeradas individualmente — quando esgotarem, não serão reeditadas. As Open Edition não têm limite de quantidade, mas são igualmente assinadas e impressas no mesmo nível de qualidade fine art.' },
  { q: 'Posso encomendar um tamanho diferente dos listados?', a: 'Sim! Todos os quadros podem ser produzidos em tamanhos personalizados. Selecione "Personalizado" no seletor de tamanho e clique em "Encomendar" — enviaremos um orçamento sob medida pelo WhatsApp em até 24h. Tamanhos disponíveis vão de 20×30 cm até 150×100 cm, dependendo da resolução da imagem.' },
  { q: 'Posso escolher a cor da moldura?', a: 'Sim. Todos os acabamentos oferecem moldura nas cores preta laqueada, branca laqueada ou madeira natural (carvalho). Informe sua preferência ao encomendar.' },
  { q: 'Como funciona o envio?', a: 'Cada quadro é embalado individualmente com espuma de polietileno e caixa dupla-onda reforçada. O frete é calculado conforme o CEP e informado no orçamento. Enviamos para todo o Brasil.' },
  { q: 'As fotos são assinadas?', a: 'Sim. Todas as obras são assinadas à mão. Os acabamentos Gallery e Museum incluem também o Certificado de Autenticidade Hahnemühle com holograma e numeração individual.' },
  { q: 'Qual o prazo de produção e entrega?', a: 'Produção: 10 a 15 dias úteis após confirmação do pagamento. Entrega: 3 a 7 dias úteis conforme a região. Prazo total estimado: 15 a 25 dias úteis.' },
  { q: 'O que é papel 100% algodão?', a: 'Papel 100% algodão é o padrão utilizado por museus e galerias de arte ao redor do mundo. Sua composição garante neutralidade química, estabilidade dimensional e durabilidade muito superior ao papel convencional (alfa-celulose). A diferença é visível: o papel algodão tem mais peso, textura e profundidade de cor.' },
  { q: 'Vocês fazem Canvas (tela) também?', a: 'Sim! Oferecemos também impressão em Canvas Fine Art (Canson Museum Art 310g) montado em chassi de madeira, sem necessidade de moldura ou vidro. Consulte valores pelo WhatsApp.' },
]

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: Tier }) {
  const m = TIER_META[tier]
  return (
    <span style={{ display: 'inline-block', padding: '4px 10px', background: m.bg, color: m.color, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', fontWeight: 600 }}>
      {m.limit}
    </span>
  )
}

function PickerBtn({ active, onClick, dashed, children }: { active: boolean; onClick: () => void; dashed?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 12px',
      border: active ? '1px solid var(--bark)' : dashed ? '1px dashed var(--stone)' : '1px solid var(--line)',
      background: active ? 'var(--bark)' : 'transparent',
      color: active ? 'var(--canvas)' : dashed ? 'var(--stone)' : 'var(--bark)',
      cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600,
      transition: 'all .2s', letterSpacing: '-.01em',
    }}>
      {children}
    </button>
  )
}

function PrintCard({ p }: { p: Print }) {
  const [sizeId, setSizeId] = useState(p.sizes[0].id)
  const [acabamento, setAcabamento] = useState<Acabamento>('gallery')

  const selectedSize = p.sizes.find(s => s.id === sizeId)!
  const price = selectedSize.prices[acabamento]
  const isCustom = selectedSize.custom === true
  const acabMeta = ACABAMENTOS[acabamento]

  function openWA() {
    const msg = isCustom
      ? `Olá! Tenho interesse no quadro "${p.title}" em tamanho personalizado com acabamento ${acabMeta.label}. Poderia me enviar um orçamento?`
      : `Olá! Tenho interesse no quadro "${p.title}" em ${selectedSize.label} com acabamento ${acabMeta.label} (${price}).`
    window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <article className="qcard" style={{ display: 'flex', flexDirection: 'column', background: 'var(--canvas)', border: '1px solid var(--line)' }}>
      <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--canvas-deep)' }}>
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}><TierBadge tier={p.tier} /></div>
        <div style={{ padding: '20px 20px 24px' }}>
          <div className="qframe" style={{ background: '#1A1612', padding: 8, boxShadow: '0 10px 28px rgba(0,0,0,.3)', width: '100%', aspectRatio: p.ratio, transition: 'transform .6s cubic-bezier(.2,.7,.2,1)' }}>
            <div style={{ padding: 4, background: '#F0EBE0', height: '100%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1, gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 4 }}>{p.loc}</div>
          <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 17, letterSpacing: '-.02em', lineHeight: 1.1, margin: 0, color: 'var(--bark)' }}>{p.title}</h3>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 6 }}>Tamanho</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {p.sizes.map(sz => (
              <PickerBtn key={sz.id} active={sizeId === sz.id} onClick={() => setSizeId(sz.id)} dashed={sz.custom}>
                {sz.label}
              </PickerBtn>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 6 }}>Acabamento</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {(['essential', 'gallery', 'museum'] as Acabamento[]).map(a => (
              <PickerBtn key={a} active={acabamento === a} onClick={() => setAcabamento(a)}>
                {ACABAMENTOS[a].label}{ACABAMENTOS[a].popular && <span style={{ marginLeft: 4, fontSize: 9, opacity: 0.7 }}>★</span>}
              </PickerBtn>
            ))}
          </div>
          <div key={acabamento} style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--stone)', marginTop: 6, lineHeight: 1.4 }}>
            {acabMeta.papel}
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px dashed var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--stone)' }}>valor</div>
            <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: isCustom ? 16 : 22, letterSpacing: '-.02em', color: 'var(--bark)', marginTop: isCustom ? 4 : 0 }}>
              {isCustom ? 'Sob orçamento' : price}
            </div>
          </div>
          <button className="qcta-btn" onClick={openWA} style={{ padding: '10px 18px', background: 'var(--bark)', color: 'var(--canvas)', border: 'none', fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .2s' }}>
            Encomendar →
          </button>
        </div>
      </div>
    </article>
  )
}

function TierSection({ tier, prints }: { tier: Tier; prints: Print[] }) {
  const meta = TIER_META[tier]
  return (
    <section style={{ marginBottom: 72 }}>
      <div style={{ paddingBottom: 24, borderBottom: '1px solid var(--line)', marginBottom: 32, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <TierBadge tier={tier} />
          <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 30, letterSpacing: '-.03em', margin: '10px 0 0', color: 'var(--bark)' }}>{meta.label}</h2>
          {tier === 'signature' && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--stone)', marginTop: 6 }}>
              Preços reajustados a cada 20% da tiragem vendida
            </div>
          )}
        </div>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--stone)' }}>{meta.subtitle}</span>
      </div>
      <div className="qgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}>
        {prints.map(p => <PrintCard key={p.id} p={p} />)}
      </div>
    </section>
  )
}

function AcabamentosAccordion() {
  const [open, setOpen] = useState(false)
  return (
    <section style={{ borderBottom: '1px solid var(--line)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: 'var(--canvas-deep)', border: 'none', cursor: 'pointer', padding: '32px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 8 }}>
            Três acabamentos disponíveis para todas as obras
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 20, letterSpacing: '-.02em', color: 'var(--bark)' }}>
            Conheça os acabamentos
          </div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--stone)', transition: 'transform .3s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>↓</span>
      </button>

      <div style={{ maxHeight: open ? 2000 : 0, overflow: 'hidden', transition: 'max-height .4s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ padding: '48px 56px 56px', background: 'var(--canvas-deep)' }}>
          <div className="acab-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {(['essential', 'gallery', 'museum'] as Acabamento[]).map(key => {
              const a = ACABAMENTOS[key]
              return (
                <div key={key} style={{ padding: '28px 24px 32px', border: a.popular ? '1px solid var(--rust-soft)' : '1px solid var(--line)', position: 'relative' }}>
                  {a.popular && <div style={{ position: 'absolute', top: -1, right: 20, background: 'var(--rust)', color: 'var(--canvas)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', padding: '4px 10px', fontWeight: 700 }}>Mais escolhido</div>}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 8 }}>{key}</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 28, letterSpacing: '-.02em', color: 'var(--bark)', marginBottom: 8 }}>{a.label}</div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--stone)', margin: '0 0 24px', lineHeight: 1.5 }}>{a.posicionamento}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[['Papel', a.papel], ['Gramatura', a.gramatura], ['Composição', a.composicao], ['Durabilidade', a.durabilidade], ['Moldura', a.moldura], ['Vidro', a.vidro], ['Passepartout', a.passepartout], ['Certificado', a.certificado]].map(([k, v]) => (
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
        </div>
      </div>
    </section>
  )
}

function ComparisonTable() {
  const rows: [string, string, string, string][] = [
    ['Papel', 'Hahnemühle Photo Matte Fibre 200g', 'Hahnemühle Photo Rag 308g', 'Hahnemühle Museum Etching 350g'],
    ['Composição', 'Alfa-celulose premium', '100% algodão', '100% algodão'],
    ['Gramatura', '200 g/m²', '308 g/m²', '350 g/m²'],
    ['Textura', 'Lisa, fosca', 'Lisa, fosca', 'Texturizada, artística'],
    ['Durabilidade', '75+ anos', '100+ anos', '100+ anos'],
    ['Moldura', 'Laqueada, perfil 2cm', 'Maciça laqueada, perfil 3cm', 'Maciça premium, perfil 4cm'],
    ['Vidro', 'Cristal 2mm', 'Antirreflexo 2mm', 'Museológico + UV'],
    ['Passepartout', 'Simples, livre de ácido', '5cm, livre de ácido', 'Duplo, 5cm, livre de ácido'],
    ['Certificado', 'Assinado pelo artista', 'Hahnemühle holográfico', 'Hahnemühle holográfico'],
    ['Ideal para', 'Decoração com qualidade', 'Colecionadores e décor premium', 'Colecionadores e galerias'],
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
                {ACABAMENTOS[k].label}{ACABAMENTOS[k].popular && <span style={{ marginLeft: 8, fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--rust)', fontWeight: 600 }}>★ popular</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, e, g, m], i) => (
            <tr key={label} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--canvas-deep)' }}>
              <td style={{ padding: '10px 16px 10px 0', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--stone)', borderBottom: '1px solid var(--line)' }}>{label}</td>
              {[e, g, m].map((v, j) => <td key={j} style={{ padding: '10px 16px', fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--bark)', borderBottom: '1px solid var(--line)', borderLeft: '1px solid var(--line)', lineHeight: 1.4 }}>{v}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', textAlign: 'left', padding: '20px 0', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 15, color: 'var(--bark)' }}>
            {item.q}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--stone)', flexShrink: 0, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform .3s', display: 'block', lineHeight: 1 }}>+</span>
          </button>
          {open === i && <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.75, color: 'var(--stone)', margin: '0 0 20px', maxWidth: '70ch' }}>{item.a}</p>}
        </div>
      ))}
    </div>
  )
}

export default function QuadrosPage() {
  const byTier = (t: Tier) => PRINTS.filter(p => p.tier === t)
  return (
    <main style={{ background: 'var(--canvas)', color: 'var(--bark)', fontFamily: 'var(--font-ui)', minHeight: '100vh' }}>
      <style>{`
        .qcard { transition: transform .5s cubic-bezier(.2,.7,.2,1), box-shadow .5s cubic-bezier(.2,.7,.2,1); }
        .qcard:hover { transform: translateY(-4px); box-shadow: 0 20px 44px rgba(30,42,24,.1); }
        .qcard:hover .qframe { transform: scale(1.04); }
        .qcta-btn:hover { background: var(--rust) !important; }
        @media(max-width:1060px){ .qgrid { grid-template-columns: 1fr 1fr !important; gap: 18px !important; } .acab-grid { grid-template-columns: 1fr !important; gap: 16px !important; } }
        @media(max-width:620px){ .qgrid { grid-template-columns: 1fr !important; } }
        @media(max-width:700px){ .quad-pad { padding: 40px 24px 60px !important; } }
      `}</style>

      <SiteNav dark={false} />

      {/* HERO */}
      <header style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/quadros/2 CAMADAS DE BELEZA-LENCOIS.jpg" alt="2 Camadas de Beleza — Lençóis Maranhenses" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.3) 60%, rgba(0,0,0,.1) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '0 56px 64px', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 16 }}>
            № 04 · Fine Art Prints · Assinados & Numerados
          </div>
          <h1 style={{ margin: 0, lineHeight: 0.9 }}>
            <span style={{ fontFamily: 'var(--font-hand)', fontSize: 54, color: 'var(--rust)', transform: 'rotate(-2deg)', display: 'inline-block', marginBottom: 6 }}>para a sua parede—</span>
            <br />
            <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 'clamp(72px, 14vw, 180px)', letterSpacing: '-.05em', lineHeight: 0.86, display: 'block', textTransform: 'uppercase', color: '#fff' }}>QUADROS.</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: 'rgba(255,255,255,.75)', marginTop: 28, maxWidth: '52ch', lineHeight: 1.65 }}>
            Três níveis de acabamento. 22 obras. Impressão assinada à mão com certificado de autenticidade.
          </p>
        </div>
      </header>

      {/* ACABAMENTOS ACCORDION */}
      <AcabamentosAccordion />

      {/* PRODUCTS */}
      <div className="quad-pad" style={{ padding: '64px 56px 32px' }}>
        <TierSection tier="signature" prints={byTier('signature')} />
        <TierSection tier="collectors" prints={byTier('collectors')} />
        <TierSection tier="open" prints={byTier('open')} />
      </div>

      {/* COMPARISON */}
      <ComparisonTable />

      {/* COMO FUNCIONA */}
      <section style={{ padding: '72px 56px', background: 'var(--canvas-deep)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 16 }}>Processo</div>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 40, letterSpacing: '-.03em', margin: '0 0 48px', lineHeight: 1 }}>Como funciona</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 36 }}>
          {[['01','Escolha','Selecione a obra, tamanho, acabamento e cor da moldura.'], ['02','Encomenda','Finalize pelo WhatsApp — sem pagamento agora. Orçamento em até 24h.'], ['03','Produção','Impressão artesanal em laboratório fine art. Prazo: 10–15 dias úteis.'], ['04','Entrega','Embalagem reforçada. Envio para todo o Brasil.']].map(([n,t,d]) => (
            <div key={n}>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 68, letterSpacing: '-.05em', lineHeight: 0.9, color: 'var(--line)', marginBottom: 14 }}>{n}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 17, color: 'var(--bark)', marginBottom: 8 }}>{t}</div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 14, lineHeight: 1.65, color: 'var(--stone)', margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CREDIBILIDADE */}
      <section style={{ padding: '40px 56px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
        {[['Hahnemühle Certified','Papel e certificado autênticos'], ['100+ anos','Durabilidade das tintas pigmentadas'], ['Assinado & Numerado','Cada obra com identidade única'], ['Laboratório Fine Art','Impressão profissional especializada']].map(([t,d]) => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: 'var(--canvas-deep)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-hand)', fontSize: 20, color: 'var(--rust)' }}>✓</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13, color: 'var(--bark)' }}>{t}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--stone)', marginTop: 2 }}>{d}</div>
            </div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section style={{ padding: '72px 56px 96px', maxWidth: 880 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 16 }}>Dúvidas frequentes</div>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 40, letterSpacing: '-.03em', margin: '0 0 36px', lineHeight: 1 }}>FAQ</h2>
        <FaqAccordion />
      </section>

      {/* WA FLOAT */}
      <a href={`https://wa.me/${WA_NUM}?text=${encodeURIComponent('Olá! Tenho interesse em um quadro fine art.')}`} target="_blank" rel="noopener noreferrer"
        style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 100, width: 54, height: 54, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}
        aria-label="Contato via WhatsApp">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      <SiteFooter dark={false} />
    </main>
  )
}
