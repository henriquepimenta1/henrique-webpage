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
      flexWrap: "wrap", gap: "4px 10px",
      padding: "8px 16px",
      fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".10em",
      textTransform: "uppercase",
      lineHeight: 1.5,
    }}>
      <span style={{ opacity: .9, whiteSpace: "nowrap" }}>Oferta por tempo limitado</span>
      <span style={{
        fontWeight: 700, fontSize: 14, letterSpacing: ".04em",
        background: "rgba(0,0,0,.2)", padding: "1px 8px", borderRadius: 2,
        whiteSpace: "nowrap",
      }}>{m}:{s}</span>
      <span style={{ opacity: .85, whiteSpace: "nowrap" }}>De R$ 79 por apenas R$ {PRICE_VISTA}</span>
      <a href={CTA} target="_blank" rel="noopener noreferrer"
        style={{
          padding: "5px 14px", background: "var(--canvas)", color: "var(--rust)",
          fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700,
          letterSpacing: ".12em", textDecoration: "none", textTransform: "uppercase",
          whiteSpace: "nowrap", flexShrink: 0,
        }}>
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
  const startX = useRef(0);
  const startPos = useRef(50);

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
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
    };
  }, [move]);

  // Touch — detecta se é arrasto horizontal antes de bloquear scroll
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startPos.current = pos;
      dragging.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startX.current;
      if (!dragging.current && Math.abs(dx) > 8) {
        dragging.current = true;
      }
      if (dragging.current) {
        e.preventDefault();
        move(e.touches[0].clientX);
      }
    };

    const onTouchEnd = () => { dragging.current = false; };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [move, pos]);

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
      onKeyDown={onKey}
      tabIndex={0}
      role="slider"
      aria-label="Comparar antes e depois"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
      style={{
        position: "relative", width: "100%", height,
        overflow: "hidden", cursor: "ew-resize", userSelect: "none",
        background: "var(--forest)", outline: "none",
        touchAction: "pan-y",
      }}
    >
      <img src={after}  alt="Preset aplicado" draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <img src={before} alt="RAW original" draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          clipPath: `inset(0 ${100 - pos}% 0 0)` }} />

      <div style={{ position: "absolute", top: 16, left: 16, padding: "5px 12px",
        background: "rgba(42,33,26,.82)", backdropFilter: "blur(8px)",
        color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 10,
        letterSpacing: ".22em", textTransform: "uppercase" }}>RAW</div>
      <div style={{ position: "absolute", top: 16, right: 16, padding: "5px 12px",
        background: "var(--rust)", color: "var(--canvas)",
        fontFamily: "var(--font-mono)", fontSize: 10,
        letterSpacing: ".22em", textTransform: "uppercase" }}>Tratado</div>

      {/* Divisor */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`,
        width: 2, background: "var(--canvas)", transform: "translateX(-1px)",
        pointerEvents: "none", boxShadow: "0 0 16px rgba(0,0,0,.5)" }} />

      {/* Handle */}
      <div style={{ position: "absolute", top: "50%", left: `${pos}%`,
        width: 44, height: 44, borderRadius: "50%",
        background: "var(--canvas)", transform: "translate(-50%, -50%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", color: "var(--bark)",
        fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700,
        boxShadow: "0 4px 20px rgba(0,0,0,.4)" }}>⇄</div>

      {/* Hint */}
      <div style={{ position: "absolute", bottom: 16, left: "50%",
        transform: "translateX(-50%)", padding: "5px 12px",
        background: "rgba(42,33,26,.72)", backdropFilter: "blur(8px)",
        color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 10,
        letterSpacing: ".18em", textTransform: "uppercase",
        opacity: .85, pointerEvents: "none", whiteSpace: "nowrap" }}>
        Arraste ←→
      </div>
    </div>
  );
}

// ─── TestimonialsSlider ───────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Mariana C.", handle: "@mariana.foto", text: "Apliquei no meu portfólio inteiro em uma tarde. A consistência entre as fotos é impressionante — parece que saíram da mesma sessão.", location: "São Paulo, SP" },
  { name: "Rafael T.", handle: "@rafa_outdoor", text: "Tentei vários presets gratuitos antes. Nenhum funcionava bem em RAW de montanha. Esse funciona direto, sem ajuste extra.", location: "Curitiba, PR" },
  { name: "Camila M.", handle: "@camila.aventura", text: "O guia de instalação salvou minha vida. Em 10 minutos tava rodando no Lightroom Mobile. Recomendo demais.", location: "Rio de Janeiro, RJ" },
  { name: "Pedro L.", handle: "@pedroluiz.film", text: "Comprei sem muita expectativa, fiquei chocado. A paleta verde é exatamente o que eu procurava pra fotos de mata.", location: "Florianópolis, SC" },
  { name: "Juliana B.", handle: "@ju.trail", text: "Uso em trabalhos pagos com licença comercial incluída. Sem dor de cabeça. Vale cada centavo.", location: "Belo Horizonte, MG" },
];

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
    isDragging.current = false;
  };

  const onTouchMove = useCallback((e: TouchEvent) => {
    const dx = e.touches[0].clientX - startX.current;
    if (!isDragging.current && Math.abs(dx) > 8) {
      isDragging.current = true;
    }
    if (isDragging.current) e.preventDefault();
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
      <div ref={trackRef} style={{ overflow: "hidden", touchAction: "pan-y" }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div style={{
          display: "flex",
          transform: `translateX(-${idx * 100}%)`,
          transition: "transform .5s cubic-bezier(.4,0,.2,1)",
          willChange: "transform",
        }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              minWidth: "100%", padding: "28px 24px", boxSizing: "border-box",
              background: "var(--canvas)", border: "1px solid var(--line)",
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              <div style={{ color: "#D4A64A", fontSize: 15, letterSpacing: 2 }}>★★★★★</div>
              <p style={{
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                fontSize: "clamp(15px, 4vw, 19px)", lineHeight: 1.65,
                color: "var(--bark)", margin: 0,
              }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "var(--canvas-deep)", border: "1px solid var(--line)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14,
                  color: "var(--moss)", flexShrink: 0,
                }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--bark)" }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", color: "var(--stone)" }}>{t.handle} · {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, padding: "0 4px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Depoimento ${i + 1}`} style={{
              width: i === idx ? 22 : 8, height: 8, borderRadius: 4, border: "none",
              cursor: "pointer", background: i === idx ? "var(--rust)" : "var(--line)",
              transition: "width .3s, background .3s", padding: 0,
            }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["←", "→"] as const).map((arrow, di) => (
            <button key={arrow}
              onClick={() => setIdx(i => (i + (di === 0 ? -1 : 1) + total) % total)}
              aria-label={di === 0 ? "Anterior" : "Próximo"}
              style={{
                width: 36, height: 36, border: "1px solid var(--line)",
                background: "transparent", cursor: "pointer",
                fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--bark)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{arrow}</button>
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
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%", display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "18px 0", background: "none",
              border: "none", cursor: "pointer", textAlign: "left", gap: 16,
            }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(14px,3.5vw,16px)", fontWeight: 600, letterSpacing: "-.01em", color: "var(--bark)" }}>{item.title}</span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--rust)",
              transform: open === i ? "rotate(45deg)" : "none",
              transition: "transform .25s", display: "block", lineHeight: 1, flexShrink: 0,
            }}>+</span>
          </button>
          {open === i && (
            <div style={{
              paddingBottom: 18, fontFamily: "var(--font-serif)", fontSize: "clamp(13px,3.5vw,15px)",
              lineHeight: 1.7, color: "#3A3530", whiteSpace: "pre-line",
            }}>{item.body}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── GuaranteeBadge ───────────────────────────────────────────────────────────
function GuaranteeBadge() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
      border: "1px solid var(--moss)", background: "rgba(74,88,56,.06)",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--moss)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontSize: 16,
      }}>✓</div>
      <div>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "var(--bark)", marginBottom: 2 }}>Garantia de 14 dias</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", color: "var(--stone)", textTransform: "uppercase" }}>Sem perguntas · Devolução total</div>
      </div>
    </div>
  );
}

// ─── CTAButton ────────────────────────────────────────────────────────────────
function CTAButton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const pads: Record<string, string> = { sm: "14px 24px", md: "18px 32px", lg: "22px 44px" };
  const fss:  Record<string, string> = { sm: "11px", md: "13px", lg: "14px" };
  return (
    <a href={CTA} target="_blank" rel="noopener noreferrer"
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textDecoration: "none", width: "100%" }}>
      <span style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        padding: pads[size], background: "var(--rust-soft)", color: "var(--forest)",
        fontFamily: "var(--font-ui)", fontSize: fss[size], fontWeight: 700,
        letterSpacing: ".18em", textTransform: "uppercase",
        width: "100%", boxSizing: "border-box",
        transition: "background .2s",
      }}>
        Comprar por R$ {PRICE_VISTA}
        <span style={{ fontSize: size === "lg" ? 20 : 18 }}>→</span>
      </span>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em",
        color: "var(--stone)", textTransform: "uppercase", textAlign: "center",
      }}>
        ou {PRICE_N}× de R$ {PRICE_PARCEL} · Download imediato
      </span>
    </a>
  );
}

// ─── FilterPill ───────────────────────────────────────────────────────────────
function FilterPill({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", border: active ? "1px solid var(--bark)" : `1px solid ${color ? color + "55" : "var(--line)"}`,
      background: active ? (color ?? "var(--bark)") : "transparent",
      color: active ? "var(--canvas)" : "var(--bark)",
      fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".18em",
      textTransform: "uppercase", cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap",
    }}>{label}</button>
  );
}

// ─── PresetCard ───────────────────────────────────────────────────────────────
function PresetCard({ preset, isActive, onSelect }: {
  preset: { key: string; name: string; desc: string; cat: string };
  isActive: boolean;
  onSelect: () => void;
}) {
  const catColors: Record<string, string> = {
    "Tom Verde":   "#7EC47E",
    "Tom Azul":    "#6FA3D8",
    "Tom Laranja": "#D8924A",
    "Aesthetic":   "#C8905A",
  };
  return (
    <button onClick={onSelect} className="preset-card"
      style={{ background: "var(--canvas)", border: isActive ? "2px solid var(--rust)" : "1px solid var(--line)", overflow: "hidden", cursor: "pointer", padding: 0, textAlign: "left", position: "relative", transition: "border-color .2s" }}>
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
        <img src={`/images/presets/${preset.key}.jpg`} alt={preset.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .6s cubic-bezier(.2,.7,.2,1)" }}
          className="preset-card-img" />
        <div className="preset-card-overlay"
          style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(30,42,24,.8) 0%, transparent 50%)", opacity: 0, transition: "opacity .3s", display: "flex", alignItems: "flex-end", padding: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--canvas)", padding: "4px 10px", background: "var(--rust)" }}>Ver antes/depois →</span>
        </div>
        {isActive && (
          <div style={{ position: "absolute", top: 8, right: 8, padding: "3px 8px", background: "var(--rust)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase" }}>no slider</div>
        )}
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".14em", color: "var(--stone)", marginBottom: 3, display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: catColors[preset.cat] ?? "var(--rust)", flexShrink: 0 }} />
          {preset.cat}
        </div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(11px,3vw,13px)", fontWeight: 600, letterSpacing: "-.01em", color: "var(--bark)", marginBottom: 2 }}>{preset.name.split(" — ")[1] ?? preset.name}</div>
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(10px,2.5vw,11px)", color: "#3A3530", lineHeight: 1.4 }}>{preset.desc}</div>
      </div>
    </button>
  );
}

// ─── VsRow ────────────────────────────────────────────────────────────────────
function VsRow({ label }: { label: string }) {
  return (
    <>
      <div style={{ padding: "14px 16px", borderTop: "1px solid var(--line)", fontFamily: "var(--font-serif)", fontSize: "clamp(12px,3vw,14px)", color: "var(--bark)" }}>{label}</div>
      <div style={{ padding: "14px 16px", borderTop: "1px solid var(--line)", borderLeft: "1px solid var(--line)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 16, color: "#B05744" }}>×</div>
      <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(232,223,201,.14)", background: "var(--forest)", color: "var(--rust-soft)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700 }}>✓</div>
    </>
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

      <div style={{ paddingTop: 40 }}>
        <SiteNav dark={false} />
      </div>

      {/* ══ 1. HERO ══════════════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{ background: "var(--forest)", color: "var(--canvas)" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr" }}>

          {/* Slider */}
          <div style={{ position: "relative" }}>
            <BeforeAfter presetKey={activeKey} height={520} variant="hero" />
            {activePreset && (
              <div style={{
                position: "absolute", bottom: 36, left: 36, padding: "5px 10px",
                background: "rgba(14,12,10,.75)", backdropFilter: "blur(6px)",
                fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em",
                textTransform: "uppercase", color: "rgba(232,223,201,.8)",
              }}>{activePreset.name}</div>
            )}
          </div>

          {/* Painel direito */}
          <div className="hero-panel" style={{
            padding: "40px 32px",
            display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24,
          }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(232,223,201,.45)", marginBottom: 14 }}>
                Outdoor Cinematic · Lightroom
              </div>
              <h1 style={{
                fontFamily: "var(--font-ui)", fontWeight: 700,
                fontSize: "clamp(28px, 2.8vw, 52px)", letterSpacing: "-.03em",
                lineHeight: 0.96, margin: "0 0 14px",
              }}>
                {TOTAL_PRESETS} presets<br />
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)", fontSize: "0.88em" }}>
                  4 anos calibrando<br />cada tom em campo
                </span>
              </h1>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(13px,1.4vw,15px)", lineHeight: 1.6, color: "rgba(232,223,201,.68)", margin: "0 0 20px", maxWidth: "38ch" }}>
                A mesma cor que aparece no meu portfólio — expedições reais, luz natural, RAW direto da câmera.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingTop: 14, borderTop: "1px solid rgba(232,223,201,.1)", marginBottom: 20 }}>
                {[
                  { k: "Formato",    v: ".xmp + .dng" },
                  { k: "Estilos",    v: "2 packs · 45" },
                  { k: "Compatível", v: "LR Classic, CC" },
                  { k: "Acesso",     v: "Vitalício" },
                ].map(s => (
                  <div key={s.k}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.35)", marginBottom: 2 }}>{s.k}</div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(11px,1.2vw,13px)", fontWeight: 600 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preço + CTA */}
            <div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(232,223,201,.35)", marginBottom: 4 }}>De R$ 79 por</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 4 }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(40px,4.5vw,60px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 0.9 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "rgba(232,223,201,.45)", fontWeight: 400, marginRight: 2 }}>R$</span>
                    {PRICE_VISTA}
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 12, color: "rgba(232,223,201,.5)", paddingBottom: 5, lineHeight: 1.4 }}>
                    à vista<br />ou {PRICE_N}× de<br />R$ {PRICE_PARCEL}
                  </div>
                </div>
              </div>
              <CTAButton size="md" />
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", color: "rgba(232,223,201,.3)", textTransform: "uppercase" }}>
                <span style={{ color: "var(--moss)", fontSize: 12 }}>✓</span>
                Garantia 14 dias sem perguntas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. CREDIBILIDADE ═════════════════════════════════════════════════ */}
      <section className="credibility-strip" style={{
        borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "var(--canvas)",
      }}>
        {[
          { v: "4 anos",    k: "em campo" },
          { v: "45",        k: "presets · 2 packs" },
          { v: "Lightroom", k: "Classic · CC · Mobile" },
          { v: "14 dias",   k: "garantia total" },
        ].map((s, i) => (
          <div key={i} style={{
            padding: "20px 12px", borderLeft: i === 0 ? "none" : "1px solid var(--line)",
            textAlign: "center",
          }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(14px,2vw,20px)", fontWeight: 700, letterSpacing: "-.01em", color: "var(--bark)", marginBottom: 3 }}>{s.v}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(7px,1.5vw,9px)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--stone)", lineHeight: 1.3 }}>{s.k}</div>
          </div>
        ))}
      </section>

      {/* ══ 3. DEPOIMENTOS ═══════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "72px clamp(20px,5vw,48px)", background: "var(--canvas-deep)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--rust)", transform: "rotate(-1.5deg)", display: "inline-block", marginBottom: 6 }}>quem já usa—</div>
            <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "clamp(26px,5vw,40px)", letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
              O que estão{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>dizendo</span>.
            </h2>
          </div>
          <TestimonialsSlider />
        </div>
      </section>

      {/* ══ 4. O QUE VEM INCLUSO ═════════════════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "72px clamp(20px,5vw,48px)", background: "var(--canvas)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(26px,4vw,44px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, marginBottom: 36, marginTop: 0, color: "var(--bark)" }}>
            O que vem na{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>mochila</span>.
          </h2>
          <div className="includes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(20px,3vw,32px)" }}>
            {[
              { n: "01", t: "45 presets Lightroom",    d: "Arquivos .xmp para Lightroom Classic, CC, Mobile e Camera Raw. Dois packs: 18 + 27 presets." },
              { n: "02", t: "Perfis .dng",             d: "Perfis de cor — mais estáveis, não bagunçam seus sliders atuais." },
              { n: "03", t: "Guia de instalação",      d: "PDF passo a passo para cada versão do Lightroom, com prints." },
              { n: "04", t: "Videoaula",               d: "Como escolher o preset certo para cada foto e fazer ajustes finos." },
              { n: "05", t: "Licença comercial",       d: "Use em trabalhos pagos, redes sociais e clientes. Sem pegadinha." },
              { n: "06", t: "Atualizações vitalícias", d: "Todo pack novo que eu lançar, você recebe automaticamente." },
            ].map(it => (
              <div key={it.n} style={{ borderTop: "1px solid var(--line)", paddingTop: 18 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", color: "var(--rust)", marginBottom: 7 }}>№ {it.n}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 600, letterSpacing: "-.01em", marginBottom: 5, color: "var(--bark)" }}>{it.t}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(12px,1.8vw,14px)", lineHeight: 1.65, color: "#3A3530" }}>{it.d}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, paddingTop: 28, borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <GuaranteeBadge />
            <div style={{ minWidth: "min(100%, 280px)", flex: "0 0 auto" }}><CTAButton size="md" /></div>
          </div>
        </div>
      </section>

      {/* ══ 5. DEMO ANTES/DEPOIS — NÉVOA SUAVE ══════════════════════════════ */}
      <section className="section-pad" style={{ padding: "72px clamp(20px,5vw,48px)", background: "var(--forest)", color: "var(--canvas)", borderBottom: "1px solid rgba(232,223,201,.1)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 28, maxWidth: 580 }}>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--rust-soft)", transform: "rotate(-1.5deg)", display: "inline-block", marginBottom: 6 }}>veja de verdade—</div>
            <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(26px,4vw,48px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, margin: 0 }}>
              Névoa Suave —{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>do RAW ao tratado</span>.
            </h2>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(14px,2vw,16px)", color: "rgba(232,223,201,.75)", marginTop: 10, lineHeight: 1.55 }}>
              Os presets já carregam pontos de branco, shadows e HSL calibrados. Sem correção extra.
            </p>
          </div>
          <BeforeAfter presetKey="17-nevoa-suave" height={440} variant="section" />
        </div>
      </section>

      {/* ══ 6. DEMO AESTHETIC ════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "72px clamp(20px,5vw,48px)", background: "var(--canvas)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 28, maxWidth: 580 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 10 }}>Aesthetic Pack</div>
            <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(26px,4vw,48px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
              Cinemático —{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust)" }}>do RAW ao tratado</span>.
            </h2>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(14px,2vw,16px)", color: "#3A3530", marginTop: 10, lineHeight: 1.55 }}>
              Drama clássico com contraste alto e paleta neutra — funciona em qualquer luz de campo.
            </p>
          </div>
          <BeforeAfter presetKey="8-cinematico" height={440} variant="section" />
        </div>
      </section>

      {/* ══ 7. VS PRESET GRÁTIS ══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "72px clamp(20px,5vw,48px)", background: "var(--canvas-deep)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(22px,3.5vw,40px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.05, marginBottom: 36, marginTop: 0, color: "var(--bark)", maxWidth: "24ch" }}>
            Por que não usar um{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>preset grátis</span>?
          </h2>
          <div className="vs-table" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", background: "var(--canvas)", border: "1px solid var(--line)", overflowX: "auto" }}>
            <div style={{ padding: "14px 16px" }} />
            <div style={{ padding: "14px 16px", borderLeft: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: "clamp(8px,1.5vw,9px)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--stone)", textAlign: "center" }}>Grátis</div>
            <div style={{ padding: "14px 16px", background: "var(--forest)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: "clamp(8px,1.5vw,9px)", letterSpacing: ".2em", textTransform: "uppercase", textAlign: "center" }}>Outdoor Cinematic</div>
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

      {/* ══ 8. COLEÇÃO COMPLETA ══════════════════════════════════════════════ */}
      <section className="section-pad" style={{ padding: "72px clamp(20px,5vw,48px)", background: "var(--canvas-deep)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
            <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "clamp(24px,4vw,44px)", letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
              A coleção{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>completa</span>.
            </h2>
            <div className="filter-scroll" style={{ display: "flex", gap: 6, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 4 }}>
              <FilterPill label={`Todos · ${PRESETS.length}`} active={activeCat === "all"} onClick={() => selectCategory("all")} />
              {PRESET_CATS.map(cat => (
                <FilterPill key={cat.id} label={`${cat.label} · ${cat.count}`} color={cat.color} active={activeCat === cat.label} onClick={() => selectCategory(cat.label)} />
              ))}
            </div>
          </div>
          <div className="presets-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {filtered.map((p, i) => (
              <PresetCard key={`${p.key}-${i}`} preset={p} isActive={activeKey === p.key} onSelect={() => selectPreset(p.key)} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ 9. FAQ ═══════════════════════════════════════════════════════════ */}
      <section className="section-pad faq-grid" style={{ padding: "72px clamp(20px,5vw,48px)", background: "var(--canvas)", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "start" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
            Tudo que você{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>precisa saber</span>.
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(13px,2vw,15px)", color: "#3A3530", marginTop: 14, lineHeight: 1.6, maxWidth: "32ch" }}>
            Se a sua dúvida não estiver aqui, escreve pra{" "}
            <a href="mailto:contato@euhenriq.com" style={{ color: "var(--rust)", textDecoration: "underline" }}>contato@euhenriq.com</a>.
          </p>
          <div style={{ marginTop: 24 }}>
            <GuaranteeBadge />
          </div>
        </div>
        <Accordion items={FAQ} />
      </section>

      {/* ══ 10. CTA FINAL ════════════════════════════════════════════════════ */}
      <section className="section-pad cta-final-grid" style={{
        padding: "80px clamp(20px,5vw,48px)",
        background: "var(--forest)", display: "grid",
        gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center",
        borderTop: "1px solid rgba(232,223,201,.1)",
      }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(40px,6vw,68px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 0.94, margin: 0, color: "var(--canvas)" }}>
            Pronto pra<br />dar{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>cor</span>
            <br />às suas fotos?
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(14px,2vw,16px)", color: "rgba(232,223,201,.7)", marginTop: 20, maxWidth: "38ch", lineHeight: 1.55 }}>
            Download imediato. Acesso vitalício. Garantia de 14 dias.
          </p>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", color: "rgba(232,223,201,.35)", textTransform: "uppercase" }}>
            <span style={{ color: "var(--rust-soft)", fontSize: 12 }}>✓</span>
            Garantia 14 dias · sem perguntas
          </div>
        </div>

        {/* Card de compra */}
        <div style={{ background: "var(--canvas)", padding: "clamp(20px,4vw,32px)", border: "1px solid rgba(232,223,201,.15)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 5 }}>
            Outdoor Cinematic Presets
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 4 }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(44px,5vw,60px)", fontWeight: 700, letterSpacing: "-.03em", color: "var(--bark)", lineHeight: 1 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--stone)", fontWeight: 400 }}>R$</span>{" "}{PRICE_VISTA}
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 12, color: "var(--stone)", paddingBottom: 5, lineHeight: 1.5 }}>
              à vista<br />ou {PRICE_N}× de<br />R$ {PRICE_PARCEL}
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 18 }}>
            acesso vitalício · download imediato
          </div>
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, marginBottom: 18 }}>
            {[
              "45 presets em .xmp + .dng",
              "2 packs: 18 + 27 presets",
              "Guia PDF + videoaula",
              "Licença pessoal e comercial",
              "Atualizações vitalícias",
              "Suporte por email",
            ].map(item => (
              <div key={item} style={{ display: "flex", gap: 10, padding: "6px 0", fontFamily: "var(--font-serif)", fontSize: "clamp(12px,1.8vw,14px)", color: "#3A3530" }}>
                <span style={{ color: "var(--moss)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <CTAButton size="md" />
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
            <GuaranteeBadge />
          </div>
        </div>
      </section>

      <SiteFooter dark={false} />

      <style>{`
        /* ═══ MOBILE-FIRST — landing page para campanha ═══ */

        /* ── Touch hover apenas em desktop ── */
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

        .preset-card { transition: transform .3s cubic-bezier(.2,.7,.2,1), border-color .2s; }
        .preset-card-img { transition: transform .6s cubic-bezier(.2,.7,.2,1); }
        .preset-card-overlay { transition: opacity .3s; }

        /* ── Tablet 900px ── */
        @media (max-width: 900px) {
          .hero-grid        { grid-template-columns: 1fr !important; }
          .hero-panel       { padding: 28px 24px 32px !important; }
          .credibility-strip { grid-template-columns: repeat(2, 1fr) !important; }
          .credibility-strip > div:nth-child(3) { border-left: none !important; border-top: 1px solid var(--line) !important; }
          .credibility-strip > div:nth-child(4) { border-top: 1px solid var(--line) !important; }
          .includes-grid    { grid-template-columns: repeat(2, 1fr) !important; }
          .faq-grid         { grid-template-columns: 1fr !important; gap: 36px !important; }
          .cta-final-grid   { grid-template-columns: 1fr !important; gap: 36px !important; }
          .presets-grid     { grid-template-columns: repeat(2, 1fr) !important; }
          .vs-table         { font-size: 12px; }
        }

        /* ── Mobile 600px ── */
        @media (max-width: 600px) {
          /* Countdown banner: empilha em 2 linhas max */
          .presets-lp [style*="position: fixed"] {
            padding: 8px 12px !important;
            font-size: 10px !important;
          }

          /* Hero: slider full-width, sem padding */
          .hero-grid > div:first-child { padding: 0 !important; }
          .hero-panel { padding: 20px 20px 28px !important; }

          /* Credibility: 2×2 limpo */
          .credibility-strip > div { padding: 16px 10px !important; }

          /* Includes: 1 coluna */
          .includes-grid { grid-template-columns: 1fr !important; }

          /* Presets grid: 2 colunas mantém legibilidade */
          .presets-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }

          /* FAQ: padding menor */
          .section-pad { padding-left: 20px !important; padding-right: 20px !important; }

          /* CTA final: card de compra primeiro no mobile */
          .cta-final-grid { display: flex !important; flex-direction: column-reverse !important; gap: 32px !important; }

          /* Vs table: scroll horizontal */
          .vs-table { font-size: 11px !important; min-width: 320px; }

          /* Filter scroll: sem scrollbar visível */
          .filter-scroll { -webkit-overflow-scrolling: touch; scrollbar-width: none; }
          .filter-scroll::-webkit-scrollbar { display: none; }
        }

        /* ── Mobile estreito 480px ── */
        @media (max-width: 480px) {
          /* Presets grid: 1 coluna em telas muito estreitas */
          .presets-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
