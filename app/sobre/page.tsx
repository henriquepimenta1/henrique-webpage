import SiteNav from '@/components/nav'
import SiteFooter from '@/components/site-footer'
import SobreClient from './SobreClient'

export const metadata = {
  title: 'Sobre — henriq.eu',
  description: 'Quem está por trás das imagens.',
}

export default function SobrePage() {
  return (
    <main style={{ background: 'var(--bark)', color: 'var(--canvas)', fontFamily: 'var(--font-ui)', minHeight: '100vh' }}>
      <SiteNav dark={true} />

      <SobreClient />

      {/* ── GEAR ── */}
      <section style={{ padding: '80px 56px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)' }}>
          Equipamento
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, marginTop: 40 }}>
          {[
            { name: 'Sony A7 IV',      role: 'corpo principal'              },
            { name: 'DJI Air 3S',      role: 'drone cinematográfico'        },
            { name: 'Comica VM40',     role: 'áudio 32-bit float'           },
            { name: 'DaVinci Resolve', role: 'pós-produção & color grading' },
          ].map(item => (
            <div key={item.name} style={{ borderTop: '1px solid rgba(255,255,255,.15)', paddingTop: 20 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 17, color: 'var(--canvas)', marginBottom: 6 }}>{item.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)' }}>{item.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTATO ── */}
      <div style={{ padding: '64px 56px', borderTop: '1px solid rgba(255,255,255,.1)', display: 'flex', gap: 40, alignItems: 'baseline', flexWrap: 'wrap' }}>
        <a href="https://instagram.com/henriq.eu" target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--canvas)', textDecoration: 'none', borderBottom: '1px solid var(--rust)', paddingBottom: 2 }}>
          @henriq.eu
        </a>
        <a href="mailto:hen.pimenta@gmail.com"
          style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>
          hen.pimenta@gmail.com
        </a>
        <a href="https://wa.me/5511988128064" target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>
          WhatsApp
        </a>
      </div>

      <SiteFooter dark={true} />
    </main>
  )
}
