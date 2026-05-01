"use client";

/**
 * app/presets/fotografia/page.tsx
 * Refatorado: estrutura persuasiva, preço correto, countdown, slider de depoimentos
 */

import { useState, useRef, useEffect, useCallback } from "react";
import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";
import { PRESETS, PRESET_CATS, ACCORDION_ITEMS, CTA_URL } from "@/content/presets";

function imgPath(key: string, cat: string) {
  return cat === "Aesthetic"
    ? `/images/protagonista/${key}`
    : `/images/presets/${key}`;
}

function useCols(): number {
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCols(w >= 1024 ? 4 : w >= 900 ? 3 : w >= 600 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

const PRICE_VISTA   = "39";
const PRICE_PARCEL  = "5,19";
const PRICE_N       = "9";
const CTA           = "https://pay.cakto.com.br/C4dmPFR";
const TOTAL_PRESETS = 45; // 18 + 27

// Presets para galeria comparativa
const SHOWCASE_KEYS = [
  "8-abissal",
  "22-poente",
  "14-vista-do-oceano",
  "6-dourado-reluzente",
  "11-devaneio",
  "21-campo-seco",
];

// Depoimentos — substitua pelos reais via Claude Code
const TESTIMONIALS = [
  {
    name: "Mariana C.",
    handle: "@mariana.foto",
    avatar: "",
    text: "Apliquei no meu portfólio inteiro em uma tarde. A consistência entre as fotos é impressionante — parece que saíram da mesma sessão.",
    location: "São Paulo, SP",
  },
  {
    name: "Rafael T.",
    handle: "@rafa_outdoor",
    avatar: "",
    text: "Tentei vários presets gratuitos antes. Nenhum funcionava bem em RAW de montanha. Esse funciona direto, sem ajuste extra.",
    location: "Curitiba, PR",
  },
  {
    name: "Camila M.",
    handle: "@camila.aventura",
    avatar: "",
    text: "O guia de instalação salvou minha vida. Em 10 minutos tava rodando no Lightroom Mobile. Recomendo demais.",
    location: "Rio de Janeiro, RJ",
  },
  {
    name: "Pedro L.",
    handle: "@pedroluiz.film",
    avatar: "",
    text: "Comprei sem muita expectativa, fiquei chocado. A paleta verde é exatamente o que eu procurava pra fotos de mata.",
    location: "Florianópolis, SC",
  },
  {
    name: "Juliana B.",
    handle: "@ju.trail",
    avatar: "",
    text: "Uso em trabalhos pagos com licença comercial incluída. Sem dor de cabeça. Vale cada centavo.",
    location: "Belo Horizonte, MG",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Countdown — 15 minutos, reseta ao zerar (urgência real como Cakto)
// ─────────────────────────────────────────────────────────────────────────────
function useCountdown(minutes = 15) {
  const total = minutes * 60;
  const [secs, setSecs] = useState(total);
  useEffect(() => {
    const id = setInterval(() => {
      setSecs(s => s <= 1 ? total : s - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [total]);
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return { m, s };
}

function CountdownBanner() {
  const { m, s } = useCountdown(15);
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "var(--rust)", color: "var(--canvas)",
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 12, padding: "10px 24px",
      fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".14em",
      textTransform: "uppercase",
    }}>
      <span style={{ opacity: .8 }}>Oferta por tempo limitado</span>
      <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: ".06em" }}>
        {m}:{s}
      </span>
      <span style={{ opacity: .8 }}>· De R$ 119 por apenas</span>
      <span style={{ fontWeight: 700 }}>R$ {PRICE_VISTA}</span>
      <a href={CTA} target="_blank" rel="noopener noreferrer"
        style={{ marginLeft: 12, padding: "5px 16px", background: "var(--canvas)", color: "var(--rust)", fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textDecoration: "none", textTransform: "uppercase" }}>
        Comprar →
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BeforeAfter slider
// ─────────────────────────────────────────────────────────────────────────────
function BeforeAfter({ presetKey, cat = "", height = 640, variant = "hero" }: {
  presetKey: string; cat?: string; height?: number; variant?: "hero" | "section";
}) {
  const [pos, setPos] = useState(50);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    const mm = (e: MouseEvent) => { if (dragging.current) move(e.clientX); };
    const tm = (e: TouchEvent) => { if (dragging.current && e.touches[0]) move(e.touches[0].clientX); };
    const mu = () => { dragging.current = false; };
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend", mu);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", mu);
    };
  }, [move]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft")  setPos(p => Math.max(2, p - 2));
    if (e.key === "ArrowRight") setPos(p => Math.min(98, p + 2));
  };

  const after  = `${imgPath(presetKey, cat)}.jpg`;
  const before = `${imgPath(presetKey, cat)}-before.jpg`;

  return (
    <div
      ref={wrap}
      onMouseDown={e => { dragging.current = true; move(e.clientX); }}
      onTouchStart={e => { dragging.current = true; if (e.touches[0]) move(e.touches[0].clientX); }}
      onKeyDown={onKey}
      tabIndex={0}
      role="slider"
      aria-label="Comparar antes e depois"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
      style={{ position: "relative", width: "100%", height, overflow: "hidden", cursor: "ew-resize", userSelect: "none", background: "var(--forest)", outline: "none" }}
    >
      <img src={after}  alt="Preset aplicado" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <img src={before} alt="RAW original"    draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(0 ${100 - pos}% 0 0)` }} />

      <div style={{ position: "absolute", top: variant === "hero" ? 24 : 20, left: variant === "hero" ? 24 : 20, padding: "6px 14px", background: "rgba(42,33,26,.82)", backdropFilter: "blur(8px)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase" }}>RAW</div>
      <div style={{ position: "absolute", top: variant === "hero" ? 24 : 20, right: variant === "hero" ? 24 : 20, padding: "6px 14px", background: "var(--rust)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase" }}>Tratado</div>

      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "var(--canvas)", transform: "translateX(-1px)", pointerEvents: "none", boxShadow: "0 0 20px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", top: "50%", left: `${pos}%`, width: 54, height: 54, borderRadius: "50%", background: "var(--canvas)", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", color: "var(--bark)", fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, boxShadow: "0 6px 24px rgba(0,0,0,.35)" }}>⇄</div>

      {variant === "hero" && (
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", padding: "6px 14px", background: "rgba(42,33,26,.72)", backdropFilter: "blur(8px)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", opacity: .85, pointerEvents: "none" }}>
          Arraste ←→
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials slider horizontal
// ─────────────────────────────────────────────────────────────────────────────
function TestimonialsSlider() {
  const [idx, setIdx] = useState(0);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % total), 4500);
    return () => clearInterval(id);
  }, [total]);

  return (
    <div style={{ position: "relative" }}>
      {/* Track */}
      <div style={{ overflow: "hidden" }}>
        <div style={{
          display: "flex",
          transform: `translateX(-${idx * 100}%)`,
          transition: "transform .55s cubic-bezier(.4,0,.2,1)",
        }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              minWidth: "100%",
              padding: "40px 48px",
              background: "var(--canvas)",
              border: "1px solid var(--line)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxSizing: "border-box",
            }}>
              {/* Stars */}
              <div style={{ color: "#D4A64A", fontSize: 18, letterSpacing: 2 }}>★★★★★</div>

              {/* Quote */}
              <p style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(17px, 2vw, 22px)",
                lineHeight: 1.6,
                color: "var(--bark)",
                margin: 0,
                maxWidth: "60ch",
              }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
                {/* Avatar placeholder */}
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "var(--canvas-deep)",
                  border: "1px solid var(--line)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16, color: "var(--moss)",
                }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "var(--bark)" }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", color: "var(--stone)" }}>{t.handle} · {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots + arrows */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, padding: "0 4px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{
              width: i === idx ? 24 : 8, height: 8,
              borderRadius: 4, border: "none", cursor: "pointer",
              background: i === idx ? "var(--rust)" : "var(--line)",
              transition: "width .3s, background .3s", padding: 0,
            }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["←", -1], ["→", 1]].map(([arrow, dir]) => (
            <button key={String(arrow)} onClick={() => setIdx(i => (i + Number(dir) + total) % total)} style={{
              width: 36, height: 36, border: "1px solid var(--line)", background: "transparent",
              cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--bark)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{arrow}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Accordion
// ─────────────────────────────────────────────────────────────────────────────
function Accordion({ items }: { items: { title: string; body: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ borderTop: "1px solid var(--line)" }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--line)" }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 17, fontWeight: 600, letterSpacing: "-.01em", color: "var(--bark)" }}>{item.title}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--rust)", transform: open === i ? "rotate(45deg)" : "none", transition: "transform .25s", display: "block", lineHeight: 1 }}>+</span>
          </button>
          {open === i && (
            <div style={{ paddingBottom: 22, fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 1.7, color: "#3A3530", whiteSpace: "pre-line", maxWidth: "68ch" }}>
              {item.body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FilterPill
// ─────────────────────────────────────────────────────────────────────────────
function FilterPill({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: "9px 18px", border: active ? "1px solid var(--bark)" : `1px solid ${color ? color + "55" : "var(--line)"}`, background: active ? (color ?? "var(--bark)") : "transparent", color: active ? "var(--canvas)" : "var(--bark)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", transition: "all .2s" }}>
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PresetCard
// ─────────────────────────────────────────────────────────────────────────────
function PresetCard({ preset, isActive, onSelect }: { preset: { key: string; name: string; desc: string; cat: string }; isActive: boolean; onSelect: () => void }) {
  const [hover, setHover] = useState(false);
  const catColors: Record<string, string> = {
    "Tom Verde":   "#7EC47E",
    "Tom Azul":    "#6FA3D8",
    "Tom Laranja": "#D8924A",
    "Aesthetic":   "#C8905A",
  };
  return (
    <button onClick={onSelect} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: "var(--canvas)", border: isActive ? "2px solid var(--rust)" : "1px solid var(--line)", overflow: "hidden", cursor: "pointer", padding: 0, textAlign: "left", transform: hover ? "translateY(-4px)" : "translateY(0)", transition: "transform .3s cubic-bezier(.2,.7,.2,1), border-color .2s", position: "relative" }}>
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
        <img src={`${imgPath(preset.key, preset.cat)}.jpg`} alt={preset.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hover ? "scale(1.06)" : "scale(1)", transition: "transform .6s cubic-bezier(.2,.7,.2,1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(30,42,24,.8) 0%, transparent 50%)", opacity: hover ? 1 : 0, transition: "opacity .3s", display: "flex", alignItems: "flex-end", padding: 14 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--canvas)", padding: "5px 10px", background: "var(--rust)" }}>Ver antes/depois →</span>
        </div>
        {isActive && <div style={{ position: "absolute", top: 10, right: 10, padding: "4px 10px", background: "var(--rust)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase" }}>no slider</div>}
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".15em", color: "var(--stone)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: catColors[preset.cat] ?? "var(--rust)" }} />
          {preset.cat}
        </div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, letterSpacing: "-.01em", color: "var(--bark)", marginBottom: 4 }}>{preset.name.split(" — ")[1] ?? preset.name}</div>
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 12, color: "#3A3530", lineHeight: 1.5 }}>{preset.desc}</div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VsRow
// ─────────────────────────────────────────────────────────────────────────────
function VsRow({ label }: { label: string }) {
  return (
    <>
      <div style={{ padding: "18px 24px", borderTop: "1px solid var(--line)", fontFamily: "var(--font-serif)", fontSize: 15, color: "var(--bark)" }}>{label}</div>
      <div style={{ padding: "18px 24px", borderTop: "1px solid var(--line)", borderLeft: "1px solid var(--line)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 18, color: "#B05744" }}>×</div>
      <div style={{ padding: "18px 24px", borderTop: "1px solid rgba(232,223,201,.14)", background: "var(--forest)", color: "var(--rust-soft)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700 }}>✓</div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Guarantee Badge
// ─────────────────────────────────────────────────────────────────────────────
function GuaranteeBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "16px 24px", border: "1px solid var(--moss)", background: "rgba(127,167,127,.06)" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid var(--moss)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 20 }}>✓</span>
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: "var(--bark)", marginBottom: 2 }}>Garantia de 14 dias</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", color: "var(--stone)", textTransform: "uppercase" }}>Sem perguntas · Devolução total</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA Button
// ─────────────────────────────────────────────────────────────────────────────
function CTAButton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const pads: Record<string, string> = { sm: "13px 28px", md: "17px 34px", lg: "20px 44px" };
  const fss:  Record<string, string> = { sm: "11px", md: "12px", lg: "14px" };
  return (
    <a href={CTA} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: pads[size], background: "var(--rust-soft)", color: "var(--forest)", fontFamily: "var(--font-ui)", fontSize: fss[size], fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase" }}>
        Comprar por R$ {PRICE_VISTA}
        <span style={{ fontSize: size === "lg" ? 22 : 18 }}>→</span>
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "rgba(232,223,201,.6)", textTransform: "uppercase" }}>
        ou {PRICE_N}× de R$ {PRICE_PARCEL} · Download imediato
      </span>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PÁGINA
// ─────────────────────────────────────────────────────────────────────────────
export default function PresetsPage() {
  const [activeKey, setActiveKey]   = useState<string>("21-campo-seco");
  const [activeCat, setActiveCat]   = useState<string>("all");
  const heroRef = useRef<HTMLDivElement>(null);

  const filtered = activeCat === "all" ? PRESETS : PRESETS.filter(p => p.cat === activeCat);

  const selectPreset = useCallback((key: string) => {
    setActiveKey(key);
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const selectCategory = useCallback((cat: string) => {
    setActiveCat(cat);
    const first = cat === "all" ? PRESETS[0] : PRESETS.find(p => p.cat === cat);
    if (first) setActiveKey(first.key);
  }, []);

  const activePreset = PRESETS.find(p => p.key === activeKey);

  const FAQ = [
    ...ACCORDION_ITEMS,
    { title: "Funciona no celular?", body: "Sim. Os arquivos .dng instalam no Lightroom Mobile (iOS e Android) — basta abrir no app e o preset fica salvo na sua conta Creative Cloud." },
    { title: "E se eu não gostar?", body: "Garantia de 14 dias. Se não curtir, escreve pra management@henriq.eu e devolvo 100% sem perguntas." },
    { title: "Recebo atualizações futuras?", body: "Sim. Todo pack novo que eu lançar, você recebe por email automaticamente — sem custo adicional." },
    { title: "Funciona no Camera Raw / Photoshop?", body: "Sim. Os arquivos .xmp são compatíveis com Camera Raw e Photoshop." },
  ];

  return (
    <div className="presets-lp" style={{ background: "var(--canvas)", color: "var(--bark)", fontFamily: "var(--font-ui)" }}>

      {/* Countdown banner fixo */}
      <CountdownBanner />

      {/* Nav com offset por causa do banner */}
      <div style={{ paddingTop: 40 }}>
        <SiteNav dark={false} />
      </div>

      {/* ══════════════════════════════════════════════════
          1. HERO — dor + slider + preço visível
      ══════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{ background: "var(--forest)", color: "var(--canvas)" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 0, minHeight: 720 }}>

          {/* Slider */}
          <div style={{ position: "relative" }}>
            <BeforeAfter presetKey={activeKey} cat={activePreset?.cat ?? ""} height={720} variant="hero" />
            {/* Preset name overlay */}
            {activePreset && (
              <div style={{ position: "absolute", bottom: 56, left: 24, padding: "8px 14px", background: "rgba(14,12,10,.75)", backdropFilter: "blur(6px)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.8)" }}>
                {activePreset.name}
              </div>
            )}
          </div>

          {/* Painel direito */}
          <div style={{ padding: "64px 48px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              {/* Kicker */}
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color: "rgba(232,223,201,.5)", marginBottom: 20 }}>
                Outdoor Cinematic · Lightroom
              </div>

              {/* H1 */}
              <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(38px, 3.8vw, 60px)", letterSpacing: "-.03em", lineHeight: 0.96, margin: "0 0 20px" }}>
                {TOTAL_PRESETS} presets<br />
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)", fontSize: "0.9em" }}>
                  4 anos calibrando<br />cada tom em campo
                </span>
              </h1>

              <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 1.6, color: "rgba(232,223,201,.72)", margin: "0 0 28px", maxWidth: "38ch" }}>
                A mesma cor que aparece no meu portfólio — expedições reais, luz natural, RAW direto da câmera.
              </p>

              {/* Especificações */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, paddingTop: 20, borderTop: "1px solid rgba(232,223,201,.12)", marginBottom: 32 }}>
                {[
                  { k: "Formato",    v: ".xmp + .dng" },
                  { k: "Estilos",    v: "2 packs · 45 presets" },
                  { k: "Compatível", v: "LR Classic, CC, Mobile" },
                  { k: "Acesso",     v: "Vitalício" },
                ].map(s => (
                  <div key={s.k}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(232,223,201,.4)", marginBottom: 4 }}>{s.k}</div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preço + CTA */}
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(232,223,201,.4)", marginBottom: 6 }}>
                  De R$ 119 por
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 4 }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 72, fontWeight: 700, letterSpacing: "-.03em", lineHeight: 0.9 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 20, color: "rgba(232,223,201,.5)", fontWeight: 400, marginRight: 4 }}>R$</span>
                    {PRICE_VISTA}
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 14, color: "rgba(232,223,201,.55)", paddingBottom: 8, lineHeight: 1.4 }}>
                    à vista<br />ou {PRICE_N}× de<br />R$ {PRICE_PARCEL}
                  </div>
                </div>
              </div>

              <CTAButton size="md" />

              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", color: "rgba(232,223,201,.35)", textTransform: "uppercase" }}>
                <span style={{ color: "var(--moss)", fontSize: 14 }}>✓</span>
                Garantia 14 dias sem perguntas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. STRIP DE CREDIBILIDADE — sem número inventado
      ══════════════════════════════════════════════════ */}
      <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "var(--canvas)" }}>
        {[
          { v: "4 anos",      k: "desenvolvendo em campo" },
          { v: "45",          k: "presets · 2 packs" },
          { v: "Lightroom",   k: "Classic + CC + Mobile" },
          { v: "14 dias",     k: "garantia total" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "28px 24px", borderLeft: i === 0 ? "none" : "1px solid var(--line)", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 22, fontWeight: 700, letterSpacing: "-.01em", color: "var(--bark)", marginBottom: 4 }}>{s.v}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--stone)" }}>{s.k}</div>
          </div>
        ))}
      </section>

      {/* ══════════════════════════════════════════════════
          3. GALERIA COMPARATIVA — prova visual
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 56px", background: "var(--canvas)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44, flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "var(--font-hand)", fontSize: 30, color: "var(--rust)", marginBottom: 4, transform: "rotate(-2deg)", display: "inline-block" }}>veja de verdade—</div>
              <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 48, letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
                Antes e depois,{" "}
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>sem maquiagem</span>.
              </h2>
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, color: "#3A3530", maxWidth: "44ch", lineHeight: 1.55, margin: 0 }}>
              Clique em qualquer um pra ver em tela cheia no comparador acima.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {SHOWCASE_KEYS.map(key => {
              const preset = PRESETS.find(p => p.key === key);
              const isActive = activeKey === key;
              return (
                <button key={key} onClick={() => selectPreset(key)} style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", cursor: "pointer", border: isActive ? "2px solid var(--rust)" : "1px solid var(--line)", outline: "none", padding: 0, background: "var(--canvas-deep)", transition: "transform .3s" }}>
                  <div style={{ position: "absolute", inset: 0, width: "50%", overflow: "hidden" }}>
                    <img src={`/images/presets/${key}-before.jpg`} alt="" style={{ position: "absolute", left: 0, top: 0, width: "200%", height: "100%", objectFit: "cover", filter: "saturate(.55) brightness(.92)" }} />
                  </div>
                  <div style={{ position: "absolute", inset: 0, left: "50%", width: "50%", overflow: "hidden" }}>
                    <img src={`/images/presets/${key}.jpg`} alt="" style={{ position: "absolute", left: "-100%", top: 0, width: "200%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: "rgba(255,255,255,.6)", transform: "translateX(-.5px)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 18px 14px", background: "linear-gradient(0deg, rgba(30,42,24,.9), transparent)", color: "var(--canvas)", textAlign: "left" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", opacity: .7, marginBottom: 2 }}>{preset?.cat}</div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600 }}>{preset?.name.split(" — ")[1] ?? preset?.name}</div>
                  </div>
                  {isActive && <div style={{ position: "absolute", top: 12, right: 12, padding: "4px 10px", background: "var(--rust)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase" }}>no slider</div>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          4. DEPOIMENTOS — slider horizontal
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 56px", background: "var(--canvas-deep)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: 28, color: "var(--rust)", transform: "rotate(-1.5deg)", display: "inline-block", marginBottom: 8 }}>quem já usa—</div>
            <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 44, letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
              O que estão{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>dizendo</span>.
            </h2>
          </div>
          <TestimonialsSlider />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. O QUE VEM INCLUSO
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 56px", background: "var(--canvas)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 48, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, marginBottom: 48, marginTop: 0, color: "var(--bark)" }}>
            O que vem na{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>mochila</span>.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {[
              { n: "01", t: "45 presets Lightroom", d: "Arquivos .xmp para Lightroom Classic, CC, Mobile e Camera Raw. Dois packs: 18 + 27 presets." },
              { n: "02", t: "Perfis .dng",          d: "Perfis de cor — mais estáveis, não bagunçam seus sliders atuais." },
              { n: "03", t: "Guia de instalação",   d: "PDF passo a passo para cada versão do Lightroom, com prints." },
              { n: "04", t: "Videoaula",            d: "Como escolher o preset certo para cada foto e fazer ajustes finos." },
              { n: "05", t: "Licença comercial",    d: "Use em trabalhos pagos, redes sociais e clientes. Sem pegadinha." },
              { n: "06", t: "Atualizações vitalícias", d: "Todo pack novo que eu lançar, você recebe automaticamente." },
            ].map(it => (
              <div key={it.n} style={{ borderTop: "1px solid var(--line)", paddingTop: 22 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", color: "var(--rust)", marginBottom: 10 }}>№ {it.n}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 22, fontWeight: 600, letterSpacing: "-.01em", marginBottom: 8, color: "var(--bark)" }}>{it.t}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.65, color: "#3A3530" }}>{it.d}</div>
              </div>
            ))}
          </div>

          {/* CTA inline */}
          <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <GuaranteeBadge />
            <CTAButton size="md" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. VS PRESET GRÁTIS
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 56px", background: "var(--canvas-deep)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 44, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.05, marginBottom: 48, marginTop: 0, color: "var(--bark)", maxWidth: "22ch" }}>
            Por que não usar um{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>preset grátis</span>?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 0, background: "var(--canvas)", border: "1px solid var(--line)" }}>
            <div style={{ padding: "18px 24px" }} />
            <div style={{ padding: "18px 24px", borderLeft: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", textAlign: "center" }}>Grátis · Instagram</div>
            <div style={{ padding: "18px 24px", background: "var(--forest)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", textAlign: "center" }}>Outdoor Cinematic</div>
            {[
              "Qualidade consistente entre fotos",
              "Ajustado para fotografia de natureza",
              "Funciona em RAW sem bagunçar sliders",
              "Licença comercial incluída",
              "Suporte direto com o autor",
            ].map(row => <VsRow key={row} label={row} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          7. DEMO AMPLIADA
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 56px", background: "var(--forest)", color: "var(--canvas)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div style={{ marginBottom: 40, maxWidth: 720 }}>
            <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 56, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, margin: 0 }}>
              Névoa Suave —{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>do RAW ao tratado</span>. Um clique.
            </h2>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, color: "rgba(232,223,201,.78)", marginTop: 14, lineHeight: 1.55 }}>
              Os presets já carregam pontos de branco, shadows e HSL calibrados. Sem correção extra — funciona em RAW direto da câmera.
            </p>
          </div>
          <BeforeAfter presetKey="17-nevoa-suave" height={560} variant="section" />
          {activePreset && (
            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(232,223,201,.7)" }}>
              <span>Exibindo:</span>
              <span style={{ color: "var(--rust-soft)", fontWeight: 700 }}>{activePreset.name}</span>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          8. COLEÇÃO COMPLETA
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 56px", background: "var(--canvas-deep)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 24 }}>
            <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 48, letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
              A coleção{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>completa</span>.
            </h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <FilterPill label={`Todos · ${PRESETS.length}`} active={activeCat === "all"} onClick={() => selectCategory("all")} />
              {PRESET_CATS.map(cat => (
                <FilterPill key={cat.id} label={`${cat.label} · ${cat.count}`} color={cat.color} active={activeCat === cat.label} onClick={() => selectCategory(cat.label)} />
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {filtered.map((p, i) => (
              <PresetCard key={`${p.key}-${i}`} preset={p} isActive={activeKey === p.key} onSelect={() => selectPreset(p.key)} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          9. FAQ
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: "96px 56px", background: "var(--canvas)", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 48, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
            Tudo que você{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>precisa saber</span>.
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, color: "#3A3530", marginTop: 20, lineHeight: 1.6, maxWidth: "32ch" }}>
            Se a sua dúvida não estiver aqui, escreve pra{" "}
            <a href="mailto:management@henriq.eu" style={{ color: "var(--rust)", textDecoration: "underline" }}>management@henriq.eu</a>.
            Respondo todas, pessoalmente.
          </p>
          <div style={{ marginTop: 32 }}>
            <GuaranteeBadge />
          </div>
        </div>
        <Accordion items={FAQ} />
      </section>

      {/* ══════════════════════════════════════════════════
          10. CTA FINAL com countdown
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: "112px 56px", background: "var(--forest)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", borderTop: "1px solid rgba(232,223,201,.1)" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 76, fontWeight: 700, letterSpacing: "-.03em", lineHeight: 0.94, margin: 0, color: "var(--canvas)" }}>
            Pronto pra<br />dar{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>cor</span>
            <br />às suas fotos?
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "rgba(232,223,201,.7)", marginTop: 28, maxWidth: "38ch", lineHeight: 1.55 }}>
            Download imediato. Acesso vitalício. Garantia de 14 dias — se não curtir, devolvo sem pergunta.
          </p>
          <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".12em", color: "rgba(232,223,201,.4)", textTransform: "uppercase" }}>
            <span style={{ color: "var(--rust-soft)", fontSize: 14 }}>✓</span>
            Garantia 14 dias · sem perguntas
          </div>
        </div>

        {/* Card de compra */}
        <div style={{ background: "var(--canvas)", padding: 40, border: "1px solid rgba(232,223,201,.15)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 8 }}>
            Outdoor Cinematic Presets
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 4 }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 72, fontWeight: 700, letterSpacing: "-.03em", color: "var(--bark)", lineHeight: 1 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--stone)", fontWeight: 400 }}>R$</span>{" "}{PRICE_VISTA}
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 14, color: "var(--stone)", paddingBottom: 8, lineHeight: 1.5 }}>
              à vista<br />ou {PRICE_N}× de<br />R$ {PRICE_PARCEL}
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 24 }}>
            acesso vitalício · download imediato
          </div>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20, marginBottom: 24 }}>
            {[
              "45 presets em .xmp + .dng",
              "2 packs: 18 + 27 presets",
              "Guia PDF + videoaula",
              "Licença pessoal e comercial",
              "Atualizações vitalícias",
              "Suporte por email",
            ].map(item => (
              <div key={item} style={{ display: "flex", gap: 12, padding: "8px 0", fontFamily: "var(--font-serif)", fontSize: 15, color: "#3A3530" }}>
                <span style={{ color: "var(--moss)", fontWeight: 700 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <a href={CTA} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", padding: "18px 24px", background: "var(--bark)", color: "var(--canvas)", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>
            Comprar agora →
          </a>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <GuaranteeBadge />
          </div>
        </div>
      </section>

      <SiteFooter dark={false} />

      <style>{`
        .presets-lp { --moss: #8B6534; }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 768px) {
          /* Banner */
          .presets-lp [style*="position: fixed"] {
            flex-wrap: wrap;
            gap: 6px;
            padding: 8px 16px;
            font-size: 11px;
          }

          /* Sections padding */
          .presets-lp section {
            padding: 56px 20px !important;
          }

          /* Hero copy */
          .presets-lp section h1,
          .presets-lp section h2 {
            font-size: 36px !important;
          }

          /* Preset grid: 2 colunas no mobile */
          .presets-lp [style*="repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          /* VS table */
          .presets-lp [style*="repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }

          /* CTA buttons full width */
          .presets-lp a[href*="cakto"] {
            width: 100%;
            text-align: center;
            box-sizing: border-box;
          }

          /* Price display */
          .presets-lp [style*="font-size: 96px"] {
            font-size: 64px !important;
          }

          /* Seção demo ampliada: altura menor */
          .presets-lp [style*="height: 560"] {
            height: 280px !important;
          }
        }

        @media (max-width: 480px) {
          .presets-lp section {
            padding: 40px 16px !important;
          }
          .presets-lp section h1,
          .presets-lp section h2 {
            font-size: 28px !important;
          }
          .presets-lp [style*="repeat(4, 1fr)"],
          .presets-lp [style*="repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
