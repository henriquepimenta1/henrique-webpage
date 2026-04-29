'use client'

import { useEffect, useRef } from 'react'

export default function SobreClient() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = heroRef.current?.querySelectorAll('[data-anim]')
    if (!els) return
    els.forEach((el, i) => {
      const e = el as HTMLElement
      e.style.opacity = '0'
      e.style.transform = 'translateY(28px)'
      e.style.transition = `opacity .7s ease ${i * 0.12}s, transform .7s ease ${i * 0.12}s`
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          e.style.opacity = '1'
          e.style.transform = 'translateY(0)'
        })
      })
    })
  }, [])

  return (
    <div ref={heroRef}>
      <style>{`
        .sob-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        .sob-left {
          padding: 140px 56px 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 2;
        }
        .sob-photo {
          position: relative;
          overflow: hidden;
        }
        .sob-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          filter: grayscale(100%) contrast(1.05);
        }
        .sob-photo::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, var(--bark) 0%, transparent 30%);
        }
        .sob-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--rust);
          margin-bottom: 20px;
        }
        .sob-name {
          font-family: var(--font-ui);
          font-weight: 700;
          font-size: clamp(56px, 7vw, 96px);
          letter-spacing: -.04em;
          line-height: 0.88;
          text-transform: uppercase;
          color: var(--canvas);
          margin: 0 0 32px;
        }
        .sob-bio {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 300;
          font-size: 17px;
          line-height: 1.75;
          color: rgba(255,255,255,.65);
          max-width: 44ch;
          margin: 0 0 48px;
        }
        .sob-bio p { margin: 0 0 18px; }
        .sob-bio p:last-child { margin: 0; }
        .sob-stats {
          display: flex;
          background: var(--rust);
          width: fit-content;
        }
        .sob-stat {
          padding: 18px 28px;
          border-right: 1px solid rgba(0,0,0,.15);
        }
        .sob-stat:last-child { border-right: none; }
        .sob-stat-n {
          font-family: var(--font-ui);
          font-weight: 700;
          font-size: 32px;
          letter-spacing: -.03em;
          color: var(--canvas);
          line-height: 1;
        }
        .sob-stat-l {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: rgba(255,255,255,.7);
          margin-top: 4px;
        }
        @media(max-width:900px){
          .sob-hero { grid-template-columns: 1fr; min-height: auto; }
          .sob-photo { height: 70vw; }
          .sob-photo::after { background: linear-gradient(to top, var(--bark) 0%, transparent 40%); }
          .sob-left { padding: 48px 24px 64px; }
        }
      `}</style>

      <div className="sob-hero">
        {/* Esquerda */}
        <div className="sob-left">
          <div className="sob-tag" data-anim>Adventure Filmmaker · São Paulo</div>
          <h1 className="sob-name" data-anim>
            HENRIQUE<br />SESANA.
          </h1>
          <div className="sob-bio" data-anim>
            <p>Venho da área técnica — ainda executo esse lado, e ele me dá um jeito preciso de pensar e resolver problemas. Mas fotografia e cinematografia são onde minha cabeça realmente está.</p>
            <p>A câmera entrou na minha vida junto com a montanha. Escalada me ensinou a ler ambiente, luz e risco de um jeito que nenhum curso ensina. A partir daí fui estudar de verdade: color grading, exposição, direção de fotografia, storytelling, teoria de cores.</p>
            <p>Lençóis Maranhenses, Itatiaia, Serra dos Órgãos, Huayhuash, Atacama. Cada expedição virou conteúdo — e o conteúdo abriu portas com marcas como Aiuruocan, O Boticário, K&F Concept e Botas Vento. O YouTube é onde a narrativa longa se forma.</p>
          </div>
          <div className="sob-stats" data-anim>
            {[
              { n: '7+',    l: 'Anos fotografando' },
              { n: '10+',   l: 'Destinos' },
              { n: '18,2%', l: 'Engagement' },
            ].map(s => (
              <div className="sob-stat" key={s.l}>
                <div className="sob-stat-n">{s.n}</div>
                <div className="sob-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Foto sangrada */}
        <div className="sob-photo" data-anim>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/henrique-portrait-1.jpg" alt="Henrique Sesana" />
        </div>
      </div>
    </div>
  )
}
