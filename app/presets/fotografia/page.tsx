"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";
import { PRESETS, PRESET_CATS, ACCORDION_ITEMS, CTA_URL } from "@/content/presets";

const PRICE_VISTA   = "39,90";
const PRICE_PARCEL  = "5,19";
const PRICE_N       = "9";
const CTA           = "https://pay.cakto.com.br/C4dmPFR";
const TOTAL_PRESETS = 45;

const SHOWCASE_KEYS = [
  "8-abissal",
  "22-poente",
  "14-vista-do-oceano",
  "6-dourado-reluzente",
  "11-devaneio",
  "21-campo-seco",
];

const TESTIMONIALS = [
  {
    name: "Mariana C.",
    handle: "@mariana.foto",
    text: "Apliquei no meu portfólio inteiro em uma tarde. A consistência entre as fotos é impressionante — parece que saíram da mesma sessão.",
    location: "São Paulo, SP",
  },
  {
    name: "Rafael T.",
    handle: "@rafa_outdoor",
    text: "Tentei vários presets gratuitos antes. Nenhum funcionava bem em RAW de montanha. Esse funciona direto, sem ajuste extra.",
    location: "Curitiba, PR",
  },
  {
    name: "Camila M.",
    handle: "@camila.aventura",
    text: "O guia de instalação salvou minha vida. Em 10 minutos tava rodando no Lightroom Mobile. Recomendo demais.",
    location: "Rio de Janeiro, RJ",
  },
  {
    name: "Pedro L.",
    handle: "@pedroluiz.film",
    text: "Comprei sem muita expectativa, fiquei chocado. A paleta verde é exatamente o que eu procurava pra fotos de mata.",
    location: "Florianópolis, SC",
  },
  {
    name: "Juliana B.",
    handle: "@ju.trail",
    text: "Uso em trabalhos pagos com licença comercial incluída. Sem dor de cabeça. Vale cada centavo.",
    location: "Belo Horizonte, MG",
  },
];

// ─── Countdown ───────────────────────────────────────────────────────────────
const COUNTDOWN_KEY = "presets_cta_deadline";
const COUNTDOWN_MINS = 15;

function useCountdown() {
  const getOrSetDeadline = () => {
    if (typeof window === "undefined") return Date.now() + COUNTDOWN_MINS * 60 * 1000;
    const stored = sessionStorage.getItem(COUNTDOWN_KEY);
    if (stored) return Number(stored);
    const deadline = Date.now() + COUNTDOWN_MINS * 60 * 1000;
    sessionStorage.setItem(COUNTDOWN_KEY, String(deadline));
    return deadline;
  };

  const [secs, setSecs] = useState(() => {
    const deadline = getOrSetDeadline();
    return Math.max(0, Math.floor((deadline - Date.now()) / 1000));
  });

  useEffect(() => {
    const deadline = getOrSetDeadline();
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setSecs(remaining);
      if (remaining === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    m: String(Math.floor(secs / 60)).padStart(2, "0"),
    s: String(secs % 60).padStart(2, "0"),
    expired: secs === 0,
  };
}

function CountdownBanner() {
  const { m, s, expired } = useCountdown();
  if (expired) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "var(--rust)", color: "var(--canvas)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexWrap: "wrap", gap: "6px 12px", padding: "10px 16px",
      fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".12em",
      textTransform: "uppercase",
    }}>
      <span style={{ opacity: .85 }}>Oferta por tempo limitado</span>
      <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: ".06em" }}>{m}:{s}</span>
      <span style={{ opacity: .85 }}>· De R$ 79 por apenas R$ {PRICE_VISTA}</span>
      <a href={CTA} target="_blank" rel="noopener noreferrer"
        style={{ padding: "4px 14px", background: "var(--canvas)", color: "var(--rust)", fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textDecoration: "none", textTransform: "uppercase" }}>
        Comprar →
      </a>
    </div>
  );
}

// ─── BeforeAfter ─────────────────────────────────────────────────────────────
function BeforeAfter({ presetKey, height = 560, variant = "hero" }: {
  presetKey: string; height?: number; variant?: "hero" | "section";
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
    const mu = () => { dragging.current = false; };
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    window.addEventListener("touchend", mu);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("touchend", mu);
    };
  }, [move]);

  // touchmove apenas no elemento — não bloqueia scroll da página
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      if (e.touches[0]) {
        e.preventDefault();
        move(e.touches[0].clientX);
      }
    };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, [move]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft")  setPos(p => Math.max(2, p - 2));
    if (e.key === "ArrowRight") setPos(p => Math.min(98, p + 2));
  };

  const after  = `/images/presets/${presetKey}.jpg`;
  const before = `/images/presets/${presetKey}-before.jpg`;

  return (
    <div
      ref={wrap}
      onMouseDown={e => { dragging.current = true; move(e.clientX); }}
      onTouchStart={e => {
        dragging.current = true;
        if (e.touches[0]) move(e.touches[0].clientX);
      }}
      onKeyDown={onKey}
      tabIndex={0}
      role="slider"
      aria-label="Comparar antes e depois"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
      style={{
        position: "relative", width: "100%", height,
        overflow: "hidden", cursor: "ew-resize", userSelect: "none",
        background: "var(--forest)", outline: "none",
        // permite scroll vertical fora do componente; só bloqueia quando dragging (via listener no elemento)
        touchAction: "pan-y",
      }}
    >
      <img src={after}  alt="Preset aplicado" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <img src={before} alt="RAW original"    draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(0 ${100 - pos}% 0 0)` }} />

      <div style={{ position: "absolute", top: variant === "hero" ? 24 : 16, left: variant === "hero" ? 24 : 16, padding: "6px 14px", background: "rgba(42,33,26,.82)", backdropFilter: "blur(8px)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase" }}>RAW</div>
      <div style={{ position: "absolute", top: variant === "hero" ? 24 : 16, right: variant === "hero" ? 24 : 16, padding: "6px 14px", background: "var(--rust)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase" }}>Tratado</div>

      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "var(--canvas)", transform: "translateX(-1px)", pointerEvents: "none", boxShadow: "0 0 20px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", top: "50%", left: `${pos}%`, width: 48, height: 48, borderRadius: "50%", background: "var(--canvas)", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", color: "var(--bark)", fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, boxShadow: "0 6px 24px rgba(0,0,0,.35)" }}>⇄</div>

      {variant === "hero" && (
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", padding: "6px 14px", background: "rgba(42,33,26,.72)", backdropFilter: "blur(8px)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", opacity: .85, pointerEvents: "none", whiteSpace: "nowrap" }}>
          Arraste ←→
        </div>
      )}
    </div>
  );
}

// ─── TestimonialsSlider ───────────────────────────────────────────────────────
function TestimonialsSlider() {
  const [idx, setIdx] = useState(0);
  const total = TESTIMONIALS.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % total), 4500);
    return () => clearInterval(id);
  }, [total]);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - startX.current;
    if (Math.abs(dx) > 8) e.preventDefault();
  }, []);

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    isDragging.current = false;
    if (dx < -40) setIdx(i => (i + 1) % total);
    if (dx > 40)  setIdx(i => (i - 1 + total) % total);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, [onTouchMove]);

  return (
    <div>
      <div
        ref={trackRef}
        style={{ overflow: "hidden", touchAction: "pan-y" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div style={{
          display: "flex",
          transform: `translateX(-${idx * 100}%)`,
          transition: "transform .5s cubic-bezier(.4,0,.2,1)",
          willChange: "transform",
        }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              minWidth: "100%", padding: "32px 32px", boxSizing: "border-box",
              background: "var(--canvas)", border: "1px solid var(--line)",
              display: "flex", flexDirection: "column", gap: 14,
            }}>
              <div style={{ color: "#D4A64A", fontSize: 16, letterSpacing: 2 }}>★★★★★</div>
              <p style={{
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.6,
                color: "var(--bark)", margin: 0, maxWidth: "60ch",
              }}>
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "var(--canvas-deep)", border: "1px solid var(--line)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15, color: "var(--moss)", flexShrink: 0,
                }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--bark)" }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", color: "var(--stone)" }}>{t.handle} · {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, padding: "0 4px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Depoimento ${i + 1}`} style={{
              width: i === idx ? 22 : 8, height: 8, borderRadius: 4,
              border: "none", cursor: "pointer",
              background: i === idx ? "var(--rust)" : "var(--line)",
              transition: "width .3s, background .3s", padding: 0,
            }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["←", "→"] as const).map((arrow, di) => (
            <button key={arrow} onClick={() => setIdx(i => (i + (di === 0 ? -1 : 1) + total) % total)}
              aria-label={di === 0 ? "Anterior" : "Próximo"}
              style={{ width: 36, height: 36, border: "1px solid var(--line)", background: "transparent", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--bark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {arrow}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ items }: { items: { title: string; body: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ borderTop: "1px solid var(--line)" }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--line)" }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600, letterSpacing: "-.01em", color: "var(--bark)" }}>{item.title}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--rust)", transform: open === i ? "rotate(45deg)" : "none", transition: "transform .25s", display: "block", lineHeight: 1, flexShrink: 0 }}>+</span>
          </button>
          {open === i && (
            <div style={{ paddingBottom: 20, fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.7, color: "#3A3530", whiteSpace: "pre-line", maxWidth: "68ch" }}>
              {item.body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── FilterPill ───────────────────────────────────────────────────────────────
function FilterPill({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: "8px 16px", border: active ? "1px solid var(--bark)" : `1px solid ${color ? color + "55" : "var(--line)"}`, background: active ? (color ?? "var(--bark)") : "transparent", color: active ? "var(--canvas)" : "var(--bark)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}>
      {label}
    </button>
  );
}

// ─── PresetCard ───────────────────────────────────────────────────────────────
function PresetCard({ preset, isActive, onSelect }: { preset: { key: string; name: string; desc: string; cat: string }; isActive: boolean; onSelect: () => void }) {
  const catColors: Record<string, string> = {
    "Tom Verde":   "#7EC47E",
    "Tom Azul":    "#6FA3D8",
    "Tom Laranja": "#D8924A",
    "Aesthetic":   "#C8905A",
  };
  return (
    <button onClick={onSelect} className="preset-card" style={{ background: "var(--canvas)", border: isActive ? "2px solid var(--rust)" : "1px solid var(--line)", overflow: "hidden", cursor: "pointer", padding: 0, textAlign: "left", position: "relative", transition: "border-color .2s" }}>
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
        <img src={`/images/presets/${preset.key}.jpg`} alt={preset.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .6s cubic-bezier(.2,.7,.2,1)" }} className="preset-card-img" />
        <div className="preset-card-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(30,42,24,.8) 0%, transparent 50%)", opacity: 0, transition: "opacity .3s", display: "flex", alignItems: "flex-end", padding: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--canvas)", padding: "4px 10px", background: "var(--rust)" }}>Ver antes/depois →</span>
        </div>
        {isActive && <div style={{ position: "absolute", top: 8, right: 8, padding: "3px 8px", background: "var(--rust)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase" }}>no slider</div>}
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".15em", color: "var(--stone)", marginBottom: 3, display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: catColors[preset.cat] ?? "var(--rust)", flexShrink: 0 }} />
          {preset.cat}
        </div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600, letterSpacing: "-.01em", color: "var(--bark)", marginBottom: 3 }}>{preset.name.split(" — ")[1] ?? preset.name}</div>
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 11, color: "#3A3530", lineHeight: 1.5 }}>{preset.desc}</div>
      </div>
    </button>
  );
}

// ─── VsRow ────────────────────────────────────────────────────────────────────
function VsRow({ label }: { label: string }) {
  return (
    <>
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--line)", fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--bark)" }}>{label}</div>
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--line)", borderLeft: "1px solid var(--line)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 16, color: "#B05744" }}>×</div>
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(232,223,201,.14)", background: "var(--forest)", color: "var(--rust-soft)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700 }}>✓</div>
    </>
  );
}

// ─── GuaranteeBadge ───────────────────────────────────────────────────────────
function GuaranteeBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 20px", border: "1px solid var(--moss)", background: "rgba(127,167,127,.06)" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid var(--moss)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>✓</div>
      <div>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "var(--bark)", marginBottom: 2 }}>Garantia de 14 dias</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", color: "var(--stone)", textTransform: "uppercase" }}>Sem perguntas · Devolução total</div>
      </div>
    </div>
  );
}

// ─── CTAButton ────────────────────────────────────────────────────────────────
function CTAButton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const pads: Record<string, string> = { sm: "12px 24px", md: "16px 32px", lg: "20px 44px" };
  const fss:  Record<string, string> = { sm: "10px", md: "11px", lg: "13px" };
  return (
    <a href={CTA} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none", width: "100%" }}>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: pads[size], background: "var(--rust-soft)", color: "var(--forest)", fontFamily: "var(--font-ui)", fontSize: fss[size], fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", width: "100%", boxSizing: "border-box" }}>
        Comprar por R$ {PRICE_VISTA}
        <span style={{ fontSize: size === "lg" ? 20 : 16 }}>→</span>
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", color: "rgba(232,223,201,.55)", textTransform: "uppercase", textAlign: "center" }}>
        ou {PRICE_N}× de R$ {PRICE_PARCEL} · Download imediato
      </span>
    </a>
  );
}

// ─── PÁGINA ───────────────────────────────────────────────────────────────────
export default function PresetsPage() {
  const [activeKey, setActiveKey] = useState<string>("21-campo-seco");
  const [activeCat, setActiveCat] = useState<string>("all");
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
    { title: "E se eu não gostar?", body: "Garantia de 14 dias. Se não curtir, escreve pra contato@euhenriq.com e devolvo 100% sem perguntas." },
    { title: "Recebo atualizações futuras?", body: "Sim. Todo pack novo que eu lançar, você recebe por email automaticamente — sem custo adicional." },
    { title: "Funciona no Camera Raw / Photoshop?", body: "Sim. Os arquivos .xmp são compatíveis com Camera Raw e Photoshop." },
  ];

  return (
    <div className="presets-lp" style={{ background: "var(--canvas)", color: "var(--bark)", fontFamily: "var(--font-ui)" }}>

      <CountdownBanner />

      {/* Nav minimalista — só logo, sem links que tiram do funil */}
      <div style={{ paddingTop: 40, position: "relative", zIndex: 30 }}>
        <header style={{ height: 72, display: "flex", alignItems: "center", padding: "0 40px", background: "transparent", borderBottom: "1px solid rgba(42,33,26,.1)" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 28, color: "var(--bark)", letterSpacing: ".02em", lineHeight: 1 }}>
              Eu Henriq
            </span>
          </a>
        </header>
      </div>

      {/* ══ 1. HERO ══════════════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{ background: "var(--forest)", color: "var(--canvas)" }}>
        {/* Mobile: stack vertical. Desktop: grid 1.4fr 1fr */}
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", minHeight: 560 }}>

          {/* Slider — com padding lateral para respirar */}
          <div style={{ position: "relative", padding: "24px 0 24px 24px" }}>
            <BeforeAfter
              presetKey={activeKey}
              height={512}
              variant="hero"
            />
            {activePreset && (
              <div style={{ position: "absolute", bottom: 44, left: 44, padding: "6px 12px", background: "rgba(14,12,10,.75)", backdropFilter: "blur(6px)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.8)" }}>
                {activePreset.name}
              </div>
            )}
          </div>

          {/* Painel direito */}
          <div className="hero-panel" style={{ padding: "48px 36px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".24em", textTransform: "uppercase", color: "rgba(232,223,201,.45)", marginBottom: 16 }}>
                Outdoor Cinematic · Lightroom
              </div>
              <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(32px, 3.2vw, 56px)", letterSpacing: "-.03em", lineHeight: 0.96, margin: "0 0 16px" }}>
                {TOTAL_PRESETS} presets<br />
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)", fontSize: "0.88em" }}>
                  4 anos calibrando<br />cada tom em campo
                </span>
              </h1>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.6, color: "rgba(232,223,201,.68)", margin: "0 0 24px", maxWidth: "38ch" }}>
                A mesma cor que aparece no meu portfólio — expedições reais, luz natural, RAW direto da câmera.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(232,223,201,.1)", marginBottom: 24 }}>
                {[
                  { k: "Formato",    v: ".xmp + .dng" },
                  { k: "Estilos",    v: "2 packs · 45" },
                  { k: "Compatível", v: "LR Classic, CC" },
                  { k: "Acesso",     v: "Vitalício" },
                ].map(s => (
                  <div key={s.k}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(232,223,201,.35)", marginBottom: 3 }}>{s.k}</div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preço + CTA */}
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(232,223,201,.35)", marginBottom: 4 }}>De R$ 79 por</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 4 }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(48px,5vw,64px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 0.9 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "rgba(232,223,201,.45)", fontWeight: 400, marginRight: 3 }}>R$</span>
                    {PRICE_VISTA}
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 13, color: "rgba(232,223,201,.5)", paddingBottom: 6, lineHeight: 1.4 }}>
                    à vista<br />ou {PRICE_N}× de<br />R$ {PRICE_PARCEL}
                  </div>
                </div>
              </div>
              <CTAButton size="md" />
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", color: "rgba(232,223,201,.3)", textTransform: "uppercase" }}>
                <span style={{ color: "var(--moss)", fontSize: 12 }}>✓</span>
                Garantia 14 dias sem perguntas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. CREDIBILIDADE ═════════════════════════════════════════════════ */}
      <section className="credibility-strip" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "var(--canvas)" }}>
        {[
          { v: "4 anos",    k: "desenvolvendo em campo" },
          { v: "45",        k: "presets · 2 packs" },
          { v: "Lightroom", k: "Classic + CC + Mobile" },
          { v: "14 dias",   k: "garantia total" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "24px 16px", borderLeft: i === 0 ? "none" : "1px solid var(--line)", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(16px,2.5vw,22px)", fontWeight: 700, letterSpacing: "-.01em", color: "var(--bark)", marginBottom: 3 }}>{s.v}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--stone)" }}>{s.k}</div>
          </div>
        ))}
      </section>

      {/* ══ 3. GALERIA COMPARATIVA ═══════════════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "80px 48px", background: "var(--canvas)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ fontFamily: "var(--font-hand)", fontSize: 26, color: "var(--rust)", marginBottom: 4, transform: "rotate(-2deg)", display: "inline-block" }}>veja de verdade—</div>
              <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "clamp(32px,4vw,48px)", letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
                Antes e depois,{" "}
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>sem maquiagem</span>.
              </h2>
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 15, color: "#3A3530", maxWidth: "44ch", lineHeight: 1.55, margin: 0 }}>
              Toque em qualquer um pra ver no comparador acima.
            </p>
          </div>
          <div className="showcase-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {SHOWCASE_KEYS.map(key => {
              const preset = PRESETS.find(p => p.key === key);
              const isActive = activeKey === key;
              return (
                <button key={key} onClick={() => selectPreset(key)} style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", cursor: "pointer", border: isActive ? "2px solid var(--rust)" : "1px solid var(--line)", outline: "none", padding: 0, background: "var(--canvas-deep)" }}>
                  <div style={{ position: "absolute", inset: 0, width: "50%", overflow: "hidden" }}>
                    <img src={`/images/presets/${key}-before.jpg`} alt="" style={{ position: "absolute", left: 0, top: 0, width: "200%", height: "100%", objectFit: "cover", filter: "saturate(.55) brightness(.92)" }} />
                  </div>
                  <div style={{ position: "absolute", inset: 0, left: "50%", width: "50%", overflow: "hidden" }}>
                    <img src={`/images/presets/${key}.jpg`} alt="" style={{ position: "absolute", left: "-100%", top: 0, width: "200%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: "rgba(255,255,255,.6)", transform: "translateX(-.5px)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 14px 12px", background: "linear-gradient(0deg, rgba(30,42,24,.9), transparent)", color: "var(--canvas)", textAlign: "left" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", opacity: .7, marginBottom: 2 }}>{preset?.cat}</div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600 }}>{preset?.name.split(" — ")[1] ?? preset?.name}</div>
                  </div>
                  {isActive && <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 8px", background: "var(--rust)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase" }}>no slider</div>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 4. DEPOIMENTOS ═══════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "80px 48px", background: "var(--canvas-deep)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: 24, color: "var(--rust)", transform: "rotate(-1.5deg)", display: "inline-block", marginBottom: 6 }}>quem já usa—</div>
            <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "clamp(30px,4vw,44px)", letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
              O que estão{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>dizendo</span>.
            </h2>
          </div>
          <TestimonialsSlider />
        </div>
      </section>

      {/* ══ 5. O QUE VEM INCLUSO ═════════════════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "80px 48px", background: "var(--canvas)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(32px,4vw,48px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, marginBottom: 40, marginTop: 0, color: "var(--bark)" }}>
            O que vem na{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>mochila</span>.
          </h2>
          <div className="includes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              { n: "01", t: "45 presets Lightroom",    d: "Arquivos .xmp para Lightroom Classic, CC, Mobile e Camera Raw. Dois packs: 18 + 27 presets." },
              { n: "02", t: "Perfis .dng",             d: "Perfis de cor — mais estáveis, não bagunçam seus sliders atuais." },
              { n: "03", t: "Guia de instalação",      d: "PDF passo a passo para cada versão do Lightroom, com prints." },
              { n: "04", t: "Videoaula",               d: "Como escolher o preset certo para cada foto e fazer ajustes finos." },
              { n: "05", t: "Licença comercial",       d: "Use em trabalhos pagos, redes sociais e clientes. Sem pegadinha." },
              { n: "06", t: "Atualizações vitalícias", d: "Todo pack novo que eu lançar, você recebe automaticamente." },
            ].map(it => (
              <div key={it.n} style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", color: "var(--rust)", marginBottom: 8 }}>№ {it.n}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 20, fontWeight: 600, letterSpacing: "-.01em", marginBottom: 6, color: "var(--bark)" }}>{it.t}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, lineHeight: 1.65, color: "#3A3530" }}>{it.d}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <GuaranteeBadge />
            <div style={{ minWidth: 280 }}><CTAButton size="md" /></div>
          </div>
        </div>
      </section>

      {/* ══ 6. VS PRESET GRÁTIS ══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "80px 48px", background: "var(--canvas-deep)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.05, marginBottom: 40, marginTop: 0, color: "var(--bark)", maxWidth: "22ch" }}>
            Por que não usar um{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>preset grátis</span>?
          </h2>
          <div className="vs-table" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", background: "var(--canvas)", border: "1px solid var(--line)", overflowX: "auto" }}>
            <div style={{ padding: "16px 20px" }} />
            <div style={{ padding: "16px 20px", borderLeft: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", textAlign: "center" }}>Grátis</div>
            <div style={{ padding: "16px 20px", background: "var(--forest)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", textAlign: "center" }}>Outdoor Cinematic</div>
            {[
              "Consistência entre fotos",
              "Feito para fotografia de natureza",
              "Funciona em RAW sem ajuste extra",
              "Licença comercial incluída",
              "Suporte direto com o autor",
            ].map(row => <VsRow key={row} label={row} />)}
          </div>
        </div>
      </section>

      {/* ══ 7. DEMO AMPLIADA ═════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "80px 48px", background: "var(--forest)", color: "var(--canvas)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div style={{ marginBottom: 32, maxWidth: 680 }}>
            <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, margin: 0 }}>
              Névoa Suave —{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>do RAW ao tratado</span>. Um clique.
            </h2>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, color: "rgba(232,223,201,.75)", marginTop: 12, lineHeight: 1.55 }}>
              Os presets já carregam pontos de branco, shadows e HSL calibrados. Sem correção extra.
            </p>
          </div>
          <BeforeAfter presetKey="17-nevoa-suave" height={480} variant="section" />
        </div>
      </section>

      {/* ══ 7b. DEMO AESTHETIC ═══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "80px 48px", background: "var(--canvas)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div style={{ marginBottom: 32, maxWidth: 680 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".24em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12 }}>Aesthetic Pack</div>
            <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
              Cinemático —{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust)" }}>do RAW ao tratado</span>. Um clique.
            </h2>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, color: "#3A3530", marginTop: 12, lineHeight: 1.55 }}>
              Drama clássico com contraste alto e paleta neutra — funciona em qualquer luz de campo.
            </p>
          </div>
          <BeforeAfter presetKey="8-cinematico" height={480} variant="section" />
        </div>
      </section>

      {/* ══ 8. COLEÇÃO COMPLETA ══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "80px 48px", background: "var(--canvas-deep)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 20 }}>
            <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "clamp(30px,4vw,48px)", letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
              A coleção{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>completa</span>.
            </h2>
            <div className="filter-scroll" style={{ display: "flex", gap: 8, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 4, WebkitOverflowScrolling: "touch" as any }}>
              <FilterPill label={`Todos · ${PRESETS.length}`} active={activeCat === "all"} onClick={() => selectCategory("all")} />
              {PRESET_CATS.map(cat => (
                <FilterPill key={cat.id} label={`${cat.label} · ${cat.count}`} color={cat.color} active={activeCat === cat.label} onClick={() => selectCategory(cat.label)} />
              ))}
            </div>
          </div>
          <div className="presets-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {filtered.map((p, i) => (
              <PresetCard key={`${p.key}-${i}`} preset={p} isActive={activeKey === p.key} onSelect={() => selectPreset(p.key)} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ 9. FAQ ═══════════════════════════════════════════════════════════ */}
      <section className="section-pad faq-grid" style={{ padding: "80px 48px", background: "var(--canvas)", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64, alignItems: "start" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
            Tudo que você{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>precisa saber</span>.
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 15, color: "#3A3530", marginTop: 16, lineHeight: 1.6, maxWidth: "32ch" }}>
            Se a sua dúvida não estiver aqui, escreve pra{" "}
            <a href="mailto:contato@euhenriq.com" style={{ color: "var(--rust)", textDecoration: "underline" }}>contato@euhenriq.com</a>.
          </p>
          <div style={{ marginTop: 28 }}>
            <GuaranteeBadge />
          </div>
        </div>
        <Accordion items={FAQ} />
      </section>

      {/* ══ 10. CTA FINAL ════════════════════════════════════════════════════ */}
      <section className="section-pad cta-final-grid" style={{ padding: "96px 48px", background: "var(--forest)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", borderTop: "1px solid rgba(232,223,201,.1)" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(48px,6vw,72px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 0.94, margin: 0, color: "var(--canvas)" }}>
            Pronto pra<br />dar{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>cor</span>
            <br />às suas fotos?
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "rgba(232,223,201,.7)", marginTop: 24, maxWidth: "38ch", lineHeight: 1.55 }}>
            Download imediato. Acesso vitalício. Garantia de 14 dias.
          </p>
          <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", color: "rgba(232,223,201,.35)", textTransform: "uppercase" }}>
            <span style={{ color: "var(--rust-soft)", fontSize: 12 }}>✓</span>
            Garantia 14 dias · sem perguntas
          </div>
        </div>

        {/* Card de compra */}
        <div style={{ background: "var(--canvas)", padding: 32, border: "1px solid rgba(232,223,201,.15)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 6 }}>
            Outdoor Cinematic Presets
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 4 }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(48px,5vw,64px)", fontWeight: 700, letterSpacing: "-.03em", color: "var(--bark)", lineHeight: 1 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--stone)", fontWeight: 400 }}>R$</span>{" "}{PRICE_VISTA}
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 13, color: "var(--stone)", paddingBottom: 6, lineHeight: 1.5 }}>
              à vista<br />ou {PRICE_N}× de<br />R$ {PRICE_PARCEL}
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 20 }}>
            acesso vitalício · download imediato
          </div>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16, marginBottom: 20 }}>
            {[
              "45 presets em .xmp + .dng",
              "2 packs: 18 + 27 presets",
              "Guia PDF + videoaula",
              "Licença pessoal e comercial",
              "Atualizações vitalícias",
              "Suporte por email",
            ].map(item => (
              <div key={item} style={{ display: "flex", gap: 10, padding: "7px 0", fontFamily: "var(--font-serif)", fontSize: 14, color: "#3A3530" }}>
                <span style={{ color: "var(--moss)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <CTAButton size="md" />
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <GuaranteeBadge />
          </div>
        </div>
      </section>

      <SiteFooter dark={false} />

      <style>{`
        /* ── Hover apenas em dispositivos com pointer fino ── */
        @media (hover: hover) and (pointer: fine) {
          .preset-card:hover { transform: translateY(-3px); }
          .preset-card:hover .preset-card-img { transform: scale(1.05); }
          .preset-card:hover .preset-card-overlay { opacity: 1 !important; }
        }

        /* ── reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* ── Tablet ── */
        @media (max-width: 900px) {
          .hero-grid        { grid-template-columns: 1fr !important; min-height: unset !important; }
          .hero-panel       { padding: 32px 24px !important; }
          .credibility-strip { grid-template-columns: repeat(2, 1fr) !important; }
          .credibility-strip > div:nth-child(3) { border-left: none !important; border-top: 1px solid var(--line); }
          .credibility-strip > div:nth-child(4) { border-top: 1px solid var(--line); }
          .showcase-grid    { grid-template-columns: repeat(2, 1fr) !important; }
          .includes-grid    { grid-template-columns: repeat(2, 1fr) !important; }
          .vs-table         { grid-template-columns: 1fr 80px 80px !important; }
          .faq-grid         { grid-template-columns: 1fr !important; gap: 40px !important; }
          .cta-final-grid   { grid-template-columns: 1fr !important; gap: 40px !important; }
          .presets-grid     { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .section-pad      { padding: 48px 20px !important; }
          .showcase-grid    { grid-template-columns: 1fr !important; }
          .includes-grid    { grid-template-columns: 1fr !important; }
          .credibility-strip { grid-template-columns: repeat(2, 1fr) !important; }
          .filter-scroll    { -webkit-overflow-scrolling: touch; scrollbar-width: none; }
          .filter-scroll::-webkit-scrollbar { display: none; }
          .vs-table         { font-size: 12px; }
          /* Hero mobile: remove padding lateral do slider, empilha */
          .hero-grid > div:first-child { padding: 16px 16px 0 !important; }
        }

        /* ── Preset card transition (hover only on desktop) ── */
        .preset-card { transition: transform .3s cubic-bezier(.2,.7,.2,1), border-color .2s; }
        .preset-card-img { transition: transform .6s cubic-bezier(.2,.7,.2,1); }
        .preset-card-overlay { transition: opacity .3s; }
      `}</style>
    </div>
  );
}
