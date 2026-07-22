"use client";

import Link from "next/link";
import { useEffect } from "react";
import DarkTopNav from "@/components/dark-nav";
import DarkFooter from "@/components/dark-footer";

// ── Entrada: três painéis full-screen ──────────────────────────────
const ENTRIES = [
  {
    label: "Portfolio",
    kicker: "Fotografias autorais",
    href: "/portfolio",
    img: "/images/portfolio/vista-do-picomateo.jpg",
    pos: "center",
  },
  {
    label: "Presets",
    kicker: "Tratamento de cor",
    href: "/presets",
    img: "/images/portfolio/observador-itatiaia-chapada-da-lua.jpg",
    pos: "center",
  },
  {
    label: "Expedições",
    kicker: "Viagens guiadas",
    href: "/expedicoes",
    img: "/images/expedicao-lencois.jpg",
    pos: "center 32%",
    badge: "Próxima turma · ago 2026",
  },
] as const;

const RECENT = [
  { src: "/images/portfolio/as3lagunas-huayhuash.jpg", cap: "As três lagunas", coord: "10°12′S 76°48′W" },
  { src: "/images/portfolio/acapamento-janca-huayhuash2.jpg", cap: "Janca ao entardecer", coord: "alt 4 350 m" },
  { src: "/images/portfolio/laguna-acampamento-janca-huayhuash.jpg", cap: "Laguna Janca", coord: "dia 7 de 11" },
] as const;

const MORE = [
  {
    num: "№ 04",
    tag: "Impressões fine-art",
    title: "Quadros",
    desc: "Edições limitadas, impressas e assinadas.",
    href: "/quadros",
    img: "/images/quadros/A-OBSERVADORA-ARARA-CANINDE-RONDONIA.jpg",
    pos: "center",
  },
  {
    num: "№ 05",
    tag: "Para marcas e imprensa",
    title: "Midiakit",
    desc: "Números, alcance e trabalhos para parcerias.",
    href: "/midiakit",
    img: "/images/outdoor-grain-capa.jpg",
    pos: "center 40%",
  },
] as const;

const EXP_FACTS: ReadonlyArray<[string, string]> = [
  ["Data", "Agosto 2026"],
  ["Duração", "4 dias"],
  ["Percurso", "52 km"],
  ["Nível", "Intermediário"],
];

export default function HomePage() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .reveal-up"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = (el: Element) => el.classList.add("in");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(reveal);
      return;
    }
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((e) => io.observe(e));

    // fallback: nada acima/dentro da viewport fica invisível (scroll rápido, reload restaurado)
    let raf = 0;
    const sweep = () =>
      els.forEach((e) => {
        if (!e.classList.contains("in") && e.getBoundingClientRect().top < window.innerHeight * 0.94) reveal(e);
      });
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        sweep();
      });
    };
    sweep();
    window.addEventListener("load", sweep);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("load", sweep);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="theme-fdl">
      <DarkTopNav active="Home" />

      {/* ── Entrada: três painéis ── */}
      <section className="v3-split">
        <div className="v3-split-grid">
          {ENTRIES.map((c, i) => (
            <Link key={c.label} className="v3-panel" href={c.href}>
              <div className="v3-panel-bg" style={{ backgroundImage: `url(${c.img})`, backgroundPosition: c.pos }} />
              <div className="v3-panel-grad" />
              <div className="v3-panel-top">
                <span>№ {String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="v3-panel-body">
                {"badge" in c && c.badge && <span className="v3-panel-badge">{c.badge}</span>}
                <div className="v3-panel-kicker">{c.kicker}</div>
                <h2 className="v3-panel-title">{c.label}</h2>
                <div className="v3-panel-foot">
                  <span className="v3-panel-cta">Explorar</span>
                  <span className="v2-door-arrow">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="v3-split-band" aria-hidden="true">
          <span>Fotografia de campo · desde 2018</span>
          <span className="v3-band-hand">onde a câmera vai junto →</span>
          <span>10°17′S 76°54′W · alt 4 800 m</span>
        </div>
      </section>

      {/* ── Posicionamento ── */}
      <section className="v3-intro">
        <div className="reveal-up">
          <div className="v2-eyebrow">Henrique Sesana · Fotografia de campo</div>
          <p className="v3-intro-statement">
            Imagens feitas a pé, <em>de onde a estrada acaba</em> — e expedições para levar quem quiser ver a mesma luz.
          </p>
        </div>
        <div className="v3-intro-meta reveal-up" style={{ transitionDelay: ".08s" }}>
          <span>Desde 2018</span>
          <span>+30 expedições</span>
          <span>Base em SP · atende worldwide</span>
        </div>
        <div className="v3-intro-cta reveal-up" style={{ transitionDelay: ".16s" }}>
          <Link className="v2-accent-link" href="/sobre">
            Conhecer o trabalho →
          </Link>
          <Link className="v3-quiet-link" href="/midiakit">
            Midiakit
          </Link>
        </div>
      </section>

      {/* ── Expedição em aberto ── */}
      <section className="v2-exp">
        <div className="v2-exp-img-col reveal-up">
          <img
            src="/images/lencois/DJI_20250828174205_0403_D-HDR.jpg"
            alt="Lençóis Maranhenses vistos do alto"
            loading="lazy"
          />
        </div>
        <div className="v2-exp-body reveal-up" style={{ transitionDelay: ".1s" }}>
          <div className="v2-eyebrow" style={{ color: "var(--accent)" }}>
            Expedição em aberto
          </div>
          <h2 className="v2-exp-h2">
            Lençóis
            <br />
            Maranhenses
          </h2>
          <p className="v2-exp-desc">
            Quatro dias na melhor janela do ano — lagoas cheias, poucos turistas e céu limpo para astrofotografia. Base
            em Barreirinhas, travessia a pé até Santo Amaro. Grupos de no máximo dez pessoas.
          </p>
          <div className="v2-exp-facts">
            {EXP_FACTS.map(([k, v]) => (
              <div key={k}>
                <div className="v2-fact-k">{k}</div>
                <div className="v2-fact-v">{v}</div>
              </div>
            ))}
          </div>
          <div className="v2-exp-cta">
            <div>
              <div className="v2-fact-k">Investimento</div>
              <div className="v2-exp-price">valores sob consulta</div>
            </div>
            <Link className="v2-accent-link" href="/expedicoes/lencois">
              Ver expedição →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Última expedição (frames) ── */}
      <section className="v3-recent">
        <div className="v3-recent-head reveal-up">
          <div>
            <div className="v2-eyebrow">Última expedição · junho 2025</div>
            <h2 className="v3-recent-title">
              Cordillera Huayhuash, <em>Peru.</em>
            </h2>
          </div>
          <Link className="v3-quiet-link" href="/portfolio">
            Ver no portfolio →
          </Link>
        </div>
        <div className="v3-frames">
          {RECENT.map((f, i) => (
            <figure key={f.src} className="v3-frame reveal" style={{ transitionDelay: `${0.12 + i * 0.12}s` }}>
              <img src={f.src} alt={f.cap} loading="lazy" />
              <figcaption>
                <span>{f.cap}</span>
                <span>{f.coord}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Quadros & Midiakit ── */}
      <section className="v3-more">
        <div className="v3-more-grid">
          {MORE.map((m, i) => (
            <Link key={m.title} className="v3-more-card reveal-up" href={m.href} style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="v3-door-bg" style={{ backgroundImage: `url(${m.img})`, backgroundPosition: m.pos }} />
              <div className="v3-door-grad" />
              <div className="v3-more-content">
                <div className="v2-door-num" style={{ color: "rgba(237,231,219,.55)" }}>
                  <span>{m.num}</span>
                  <span>{m.tag}</span>
                </div>
                <div>
                  <h3 className="v3-door-h3">{m.title}</h3>
                  <p className="v3-more-desc">{m.desc}</p>
                  <div className="v3-door-foot">
                    <span>Ver</span>
                    <span className="v2-door-arrow">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA de fechamento ── */}
      <section className="v3-cta">
        <div className="v3-cta-bg" style={{ backgroundImage: "url(/images/dunes-aerial.jpg)" }} />
        <div className="v3-cta-grad" />
        <div className="v3-cta-inner reveal-up">
          <div className="v2-eyebrow">Vamos?</div>
          <h2 className="v3-cta-h">
            Planeje a próxima expedição — ou <em>receba as imagens</em> antes de todo mundo.
          </h2>
          <div className="v3-cta-actions">
            <Link className="v3-btn" href="/contato">
              Falar com o Henrique <span aria-hidden="true">→</span>
            </Link>
            <a className="v3-quiet-link" href="https://open.substack.com/henriq" target="_blank" rel="noreferrer">
              Assinar o diário
            </a>
          </div>
        </div>
      </section>

      <DarkFooter coords="10°17′S 76°54′W · alt 4 800 m" />
    </div>
  );
}
