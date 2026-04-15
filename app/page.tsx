"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import SiteNav from "@/components/nav";

const CARDS = [
  {
    href: "/portfolio",
    label: "Portfolio",
    labelColor: "#7EC47E",
    title: "Fotos &",
    titleBold: "Trabalhos",
    desc: "Imagens de lugares, luz e momentos que valeram a viagem.",
    cta: "Explorar",
    bg: "/images/mountain-lake.jpg",
    bgPosition: "center",
  },
  {
    href: "/presets",
    label: "Presets",
    labelColor: "#C8905A",
    title: "Outdoor",
    titleBold: "Cinematic",
    desc: "45 presets para Lightroom. Tons honestos, contraste limpo.",
    cta: "$59 — Ver Presets",
    bg: "/images/desert-dunes.jpg",
    bgPosition: "center",
  },
  {
    href: "/expedicoes",
    label: "Expedições",
    labelColor: "#6FA3D8",
    title: "Aventuras &",
    titleBold: "Trilhas",
    desc: "Registos de lugares remotos, montanhas e natureza selvagem.",
    cta: "Explorar",
    bg: "/images/hiker.jpg",
    bgPosition: "center top",
  },
];

const BRANDS = ["Artlist", "DJI", "Expedia", "Framekit", "Nvidia", "Sony", "Canon", "Blackmagic"];

const FOOTER_IMAGES = [
  "/images/desert-dunes.jpg",
  "/images/dunes-aerial.jpg",
  "/images/mountain-lake.jpg",
  "/images/mineral.jpg",
  "/images/hiker.jpg",
  "/images/portrait.jpg",
];

function ArrowIcon() {
  return (
    <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#4C4440" }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

export default function HomePage() {
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <div style={{ background: "#0E0C0A", color: "#E6DDD4", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        .cat-card { flex: 1; transition: flex 600ms cubic-bezier(.4,0,.2,1), border-color 400ms; }
        .cards-row:hover .cat-card { flex: .55; }
        .cards-row:hover .cat-card:hover { flex: 2.2; border-color: rgba(255,255,255,.18); }
        .cat-card:hover .cat-glass { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); background: rgba(14,12,10,.08); }
        .cat-card-bg { transition: transform 700ms cubic-bezier(.4,0,.2,1), filter 500ms; filter: brightness(.7); }
        .cat-card:hover .cat-card-bg { transform: scale(1.05); filter: brightness(.9); }
        .cat-card-overlay { transition: opacity 400ms; }
        .cat-card:hover .cat-card-overlay { opacity: .85; }
        .cat-desc { max-height: 0; overflow: hidden; opacity: 0; transition: max-height 500ms cubic-bezier(.4,0,.2,1), opacity 400ms; }
        .cat-card:hover .cat-desc { max-height: 80px; opacity: 1; }
        .cat-pill { opacity: 0; transform: translateY(6px); transition: opacity 350ms 100ms, transform 350ms 100ms; }
        .cat-card:hover .cat-pill { opacity: 1; transform: translateY(0); }
        @keyframes cardIn { from { opacity:0; transform: translateY(32px) scale(.97); } to { opacity:1; transform: translateY(0) scale(1); } }
        .cat-card:nth-child(1) { animation: cardIn .75s cubic-bezier(.4,0,.2,1) .25s both; }
        .cat-card:nth-child(2) { animation: cardIn .75s cubic-bezier(.4,0,.2,1) .4s both; }
        .cat-card:nth-child(3) { animation: cardIn .75s cubic-bezier(.4,0,.2,1) .55s both; }
        @keyframes marquee { to { transform: translateX(-50%); } }
        .logo-track { animation: marquee 28s linear infinite; }
        .logo-track:hover { animation-play-state: paused; }
        .fade-lr { -webkit-mask-image: linear-gradient(to right, transparent, black 240px, black calc(100% - 240px), transparent); mask-image: linear-gradient(to right, transparent, black 240px, black calc(100% - 240px), transparent); }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
        .reveal-visible { opacity: 1; transform: translateY(0); }
      `}</style>

      <SiteNav />

      {/* ── HERO: 3 expanding cards ── */}
      <section style={{ height: "100svh", overflow: "hidden" }}>
        <div
          className="relative h-full flex flex-col px-8"
          style={{ paddingTop: 88, paddingBottom: 28 }}
        >
          <div className="cards-row flex gap-2.5 w-full flex-1">
            {CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="cat-card relative overflow-hidden rounded-2xl cursor-pointer no-underline"
                style={{ border: "1px solid rgba(255,255,255,.07)" }}
              >
                {/* BG image */}
                <div
                  className="cat-card-bg absolute inset-0"
                  style={{
                    backgroundImage: `url(${card.bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: card.bgPosition,
                  }}
                />
                {/* Glass */}
                <div
                  className="cat-glass absolute inset-0"
                  style={{ background: "rgba(14,12,10,.18)" }}
                />
                {/* Overlay */}
                <div
                  className="cat-card-overlay absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(14,12,10,.95) 0%, rgba(14,12,10,.5) 50%, rgba(14,12,10,.05) 100%)",
                  }}
                />
                {/* Content */}
                <div
                  className="relative z-10 h-full flex flex-col justify-between"
                  style={{ padding: 28 }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: ".2em",
                        textTransform: "uppercase",
                        color: card.labelColor,
                      }}
                    >
                      {card.label}
                    </span>
                    <ExternalIcon />
                  </div>
                  <div>
                    <h2
                      className="font-display"
                      style={{
                        fontSize: "1.65rem",
                        fontWeight: 400,
                        color: "#E6DDD4",
                        lineHeight: 1.2,
                        marginBottom: 10,
                      }}
                    >
                      {card.title}
                      <br />
                      <strong style={{ fontWeight: 800 }}>{card.titleBold}</strong>
                    </h2>
                    <p
                      className="cat-desc"
                      style={{ color: "#8A8078", fontSize: 12, lineHeight: 1.7, marginBottom: 14 }}
                    >
                      {card.desc}
                    </p>
                    <span
                      className="cat-pill inline-flex items-center gap-2"
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: ".16em",
                        textTransform: "uppercase",
                        color: "#E6DDD4",
                        border: "1px solid rgba(255,255,255,.15)",
                        borderRadius: 999,
                        padding: "6px 16px",
                      }}
                    >
                      {card.cta}
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRANDS marquee ── */}
      <section
        className="py-20 overflow-hidden"
        style={{ background: "#0E0C0A", borderTop: "1px solid #2B2420" }}
      >
        <p
          ref={addReveal}
          className="reveal text-center text-[10px] uppercase tracking-[.2em] mb-10"
          style={{ color: "#4C4440" }}
        >
          Marcas com quem já trabalhei
        </p>
        <div className="relative overflow-hidden fade-lr">
          <div className="logo-track flex gap-16 py-1 whitespace-nowrap">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span
                key={i}
                className="flex-shrink-0 font-bold text-2xl tracking-widest uppercase"
                style={{ color: "#38302C" }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section
        id="sobre"
        className="py-24 px-8"
        style={{ background: "#161310", borderTop: "1px solid #2B2420" }}
      >
        <div
          className="grid grid-cols-2 gap-20 items-start"
          style={{ maxWidth: 1280, margin: "0 auto" }}
        >
          <div ref={addReveal} className="reveal space-y-6">
            <div>
              <p
                className="text-[10px] uppercase tracking-widest mb-3"
                style={{ color: "#60584E" }}
              >
                Sobre
              </p>
              <h2 className="text-4xl font-light leading-tight" style={{ color: "#E6DDD4" }}>
                Fotógrafo
                <br />
                <span className="font-semibold">&amp; Explorador</span>
                <br />
                <span className="font-light" style={{ color: "#746A62" }}>
                  Outdoor
                </span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#8A8078", lineHeight: 1.85 }}>
              Nascido em Portugal, cresci entre trilhas e paisagens que me ensinaram a ver antes de fotografar.
              A câmera veio depois — mas a obsessão por luz, cor e lugares remotos sempre esteve lá.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#8A8078", lineHeight: 1.85 }}>
              Hoje fotografo expedições, natureza e viagens. Criei 45 presets para Lightroom que capturam
              a atmosfera real de cada ambiente — sem filtros artificiais, só tons honestos.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="mailto:management@henriq.eu"
                className="text-sm font-medium px-6 py-3 rounded-full transition-all hover:opacity-90"
                style={{ background: "#E6DDD4", color: "#0E0C0A" }}
              >
                Entrar em Contacto
              </a>
              <span className="text-sm" style={{ color: "#4C4440" }}>
                management@henriq.eu
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden" style={{ height: 520 }}>
              <Image
                src="/images/portrait.jpg"
                alt="Henrique"
                width={600}
                height={520}
                className="w-full h-full object-cover object-top"
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "2000+", label: "Clientes" },
                { value: "45", label: "Presets" },
                { value: "2018", label: "Início" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-4 text-center"
                  style={{ border: "1px solid #2B2420", background: "#161310" }}
                >
                  <div className="font-semibold text-xl mb-0.5" style={{ color: "#E6DDD4" }}>
                    {s.value}
                  </div>
                  <div
                    className="text-[11px] uppercase tracking-wider"
                    style={{ color: "#4C4440" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 px-8" style={{ borderTop: "1px solid #2B2420", background: "#0E0C0A" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="grid grid-cols-3 gap-12 mb-12">
            <div>
              <p className="text-[10px] uppercase tracking-[.2em] mb-5" style={{ color: "#4C4440" }}>
                Páginas
              </p>
              <div className="space-y-2">
                {[
                  { label: "Portfolio", href: "/portfolio" },
                  { label: "Presets", href: "/presets" },
                  { label: "Expedições", href: "/expedicoes" },
                  { label: "Sobre", href: "#sobre" },
                ].map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="block text-sm transition-colors hover:text-[#E6DDD4]"
                    style={{ color: "#887E76" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[.2em] mb-5" style={{ color: "#4C4440" }}>
                Localização
              </p>
              <div className="space-y-1.5">
                <p className="text-sm" style={{ color: "#887E76" }}>Disponível Mundialmente</p>
                <a
                  href="mailto:management@henriq.eu"
                  className="block text-sm transition-colors hover:text-[#E6DDD4]"
                  style={{ color: "#887E76" }}
                >
                  management@henriq.eu
                </a>
                <p className="text-sm" style={{ color: "#4C4440" }}>Chipre</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[.2em] mb-5" style={{ color: "#4C4440" }}>
                Redes Sociais
              </p>
              <div className="space-y-2">
                {["Instagram", "Twitter", "Behance"].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-sm transition-colors hover:text-[#E6DDD4] underline underline-offset-2"
                    style={{ color: "#887E76", textDecorationColor: "#2B2420" }}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Photo strip */}
          <div className="grid grid-cols-6 gap-2 mb-10">
            {FOOTER_IMAGES.map((src, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden">
                <Image
                  src={src}
                  alt=""
                  width={200}
                  height={200}
                  className="w-full h-full"
                  style={{ objectFit: "cover", objectPosition: i >= 4 ? "top" : "center" }}
                />
              </div>
            ))}
          </div>

          <div
            className="flex items-center justify-between pt-6"
            style={{ borderTop: "1px solid #2B2420" }}
          >
            <p className="text-xs" style={{ color: "#4C4440" }}>@henriq.eu</p>
            <p className="text-xs" style={{ color: "#4C4440" }}>henriq.eu</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
