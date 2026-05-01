"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";

const CTA = "https://pay.cakto.com.br/protagonista"; // TODO: URL real
const PRICE_VISTA  = "39";
const PRICE_PARCEL = "5,19";
const PRICE_N      = "9";

// ─── Dados ───────────────────────────────────────────────────────────────────

type Cat = "Todos" | "Verde" | "Frio" | "Cinematico" | "Quente" | "Mood";

interface Preset {
  key: string;
  name: string;
  desc: string;
  cat: Exclude<Cat, "Todos">;
}

const PRESETS: Preset[] = [
  { key: "1-explorador",            name: "Explorador",            desc: "Tons de aventura com verde natural e contraste equilibrado.",            cat: "Verde"     },
  { key: "2-verdesuave",            name: "Verde Suave",           desc: "Verde delicado com sensação de frescura e calma.",                      cat: "Verde"     },
  { key: "3-caminhante",            name: "Caminhante",            desc: "Floresta com luz filtrada e verdes saturados.",                          cat: "Verde"     },
  { key: "4-gelado",                name: "Gelado",                desc: "Frios intensos com sombras azuladas e névoa de altitude.",               cat: "Frio"      },
  { key: "5-contador-de-historias", name: "Contador de Histórias", desc: "Paleta narrativa com tonalidades quentes e profundidade dramática.",     cat: "Mood"      },
  { key: "6-campo-aberto",          name: "Campo Aberto",          desc: "Pradaria ampla com verdes suaves e céu aberto.",                         cat: "Verde"     },
  { key: "7-liberdade",             name: "Liberdade",             desc: "Cinematográfico e dramático — destaca silhuetas e horizontes.",          cat: "Cinematico"},
  { key: "8-cinematico",            name: "Cinemático",            desc: "Grade de cinema com blacks esmagados e highlights limpos.",              cat: "Cinematico"},
  { key: "9-verde-desbotado",       name: "Verde Desbotado",       desc: "Verde faded com sensação vintage e textura de filme.",                   cat: "Verde"     },
  { key: "10-suavidade",            name: "Suavidade",             desc: "Paleta suave e gentil, ideal para retratos na natureza.",                cat: "Mood"      },
  { key: "11-intermediario",        name: "Intermediário",         desc: "Equilíbrio entre tons quentes e frios — versátil para qualquer cenário.",cat: "Quente"    },
  { key: "12-sonhos",               name: "Sonhos",                desc: "Atmosfera onírica com véu suave sobre as luzes.",                       cat: "Mood"      },
  { key: "13-nostalgia",            name: "Nostalgia",             desc: "Look retrô com amarelos queimados e sombras quentes.",                   cat: "Quente"    },
  { key: "14-montanha-cerrada",     name: "Montanha Cerrada",      desc: "Densa névoa de montanha com frios profundos e contraste alto.",          cat: "Frio"      },
  { key: "15-reflexo-artico",       name: "Reflexo Ártico",        desc: "Azuis polares espelhados com sensação de silêncio e vastidão.",          cat: "Frio"      },
  { key: "16-resiliencia",          name: "Resiliência",           desc: "Drama cinematográfico com paleta escura e destaque de luz.",             cat: "Cinematico"},
  { key: "17-duradouro",            name: "Duradouro",             desc: "Dourado persistente de fim de tarde com terras quentes.",                cat: "Quente"    },
  { key: "18-areia",                name: "Areia",                 desc: "Deserto com areia dourada, calor suave e luz lateral.",                  cat: "Quente"    },
];

const CATS: Cat[] = ["Todos", "Verde", "Frio", "Cinematico", "Quente", "Mood"];

const CAT_LABEL: Record<Cat, string> = {
  Todos:      "Todos",
  Verde:      "Verde",
  Frio:       "Frio & Altitude",
  Cinematico: "Cinemático",
  Quente:     "Quente",
  Mood:       "Mood",
};

const CAT_COLOR: Record<Exclude<Cat, "Todos">, string> = {
  Verde:      "#7EC47E",
  Frio:       "#6FA3D8",
  Cinematico: "#2A211A",
  Quente:     "#D8924A",
  Mood:       "#C8905A",
};

// 3 mais impactantes para o hero
const HERO_KEYS = ["7-liberdade", "8-cinematico", "15-reflexo-artico"];

// ─── BeforeAfter slider ───────────────────────────────────────────────────────

function BeforeAfter({ presetKey, height = 640, variant = "hero" }: {
  presetKey: string;
  height?: number;
  variant?: "hero" | "section";
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

  const after  = `/images/protagonista/${presetKey}.jpg`;
  const before = `/images/protagonista/${presetKey}-before.jpg`;

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

// ─── Hero: 3 sliders com thumbnails ──────────────────────────────────────────

function HeroSliders() {
  const [active, setActive] = useState(0);
  const heroPresets = HERO_KEYS.map(k => PRESETS.find(p => p.key === k)!);

  return (
    <section style={{ background: "var(--forest)" }}>
      <div style={{ position: "relative" }}>
        <BeforeAfter presetKey={HERO_KEYS[active]} height={640} variant="hero" />
        {heroPresets[active] && (
          <div style={{ position: "absolute", bottom: 56, left: 24, padding: "8px 14px", background: "rgba(14,12,10,.75)", backdropFilter: "blur(6px)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.8)" }}>
            {heroPresets[active].name}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", background: "var(--forest-soft)", borderTop: "1px solid rgba(232,223,201,.1)" }}>
        {heroPresets.map((p, i) => (
          <button
            key={p.key}
            onClick={() => setActive(i)}
            style={{ position: "relative", height: 80, border: "none", padding: 0, cursor: "pointer", outline: active === i ? "2px solid var(--rust)" : "none", outlineOffset: -2, overflow: "hidden", borderLeft: i > 0 ? "1px solid rgba(232,223,201,.1)" : "none" }}
          >
            <img
              src={`/images/protagonista/${p.key}.jpg`}
              alt={p.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: active === i ? "none" : "brightness(.45) saturate(.5)", transition: "filter .3s" }}
            />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--canvas)", textShadow: "0 1px 6px rgba(0,0,0,.9)" }}>
              {p.name}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── PresetCard ───────────────────────────────────────────────────────────────

function PresetCard({ preset, isActive, onSelect }: { preset: Preset; isActive: boolean; onSelect: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: "var(--canvas)", border: isActive ? "2px solid var(--rust)" : "1px solid var(--line)", overflow: "hidden", cursor: "pointer", padding: 0, textAlign: "left", transform: hover ? "translateY(-4px)" : "translateY(0)", transition: "transform .3s cubic-bezier(.2,.7,.2,1), border-color .2s", position: "relative" }}
    >
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
        <img
          src={`/images/protagonista/${preset.key}.jpg`}
          alt={preset.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hover ? "scale(1.06)" : "scale(1)", transition: "transform .6s cubic-bezier(.2,.7,.2,1)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(30,42,24,.8) 0%, transparent 50%)", opacity: hover ? 1 : 0, transition: "opacity .3s", display: "flex", alignItems: "flex-end", padding: 14 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--canvas)", padding: "5px 10px", background: "var(--rust)" }}>Ver antes/depois →</span>
        </div>
        {isActive && <div style={{ position: "absolute", top: 10, right: 10, padding: "4px 10px", background: "var(--rust)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase" }}>no slider</div>}
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".15em", color: "var(--stone)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: CAT_COLOR[preset.cat] }} />
          {CAT_LABEL[preset.cat]}
        </div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, letterSpacing: "-.01em", color: "var(--bark)", marginBottom: 4 }}>{preset.name}</div>
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 12, color: "#3A3530", lineHeight: 1.5 }}>{preset.desc}</div>
      </div>
    </button>
  );
}

// ─── FilterPill ───────────────────────────────────────────────────────────────

function FilterPill({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ padding: "9px 18px", border: active ? "1px solid var(--bark)" : `1px solid ${color ? color + "55" : "var(--line)"}`, background: active ? (color ?? "var(--bark)") : "transparent", color: active ? "var(--canvas)" : "var(--bark)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", transition: "all .2s" }}
    >
      {label}
    </button>
  );
}

// ─── Modal: painel lateral (desktop) ou fullscreen (mobile) ──────────────────

function PresetModal({ preset, onClose, onPrev, onNext }: {
  preset: Preset;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft")  onPrev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  const navButtons = (
    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={onPrev} style={{ flex: 1, padding: "10px 16px", background: "none", border: "1px solid var(--line)", color: "var(--bark)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", cursor: "pointer" }}>← Anterior</button>
      <button onClick={onNext} style={{ flex: 1, padding: "10px 16px", background: "none", border: "1px solid var(--line)", color: "var(--bark)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", cursor: "pointer" }}>Próximo →</button>
    </div>
  );

  if (isMobile) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--canvas)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--line)" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", color: "var(--stone)", textTransform: "uppercase", marginBottom: 2 }}>{CAT_LABEL[preset.cat]}</div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 20, fontWeight: 700, color: "var(--bark)" }}>{preset.name}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid var(--line)", color: "var(--bark)", fontSize: 20, cursor: "pointer", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <BeforeAfter presetKey={preset.key} height={window.innerHeight - 170} variant="section" />
        </div>
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", display: "flex", gap: 10 }}>
          <button onClick={onPrev} style={{ flex: 1, padding: "12px", background: "none", border: "1px solid var(--line)", color: "var(--bark)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", cursor: "pointer" }}>← Anterior</button>
          <button onClick={onNext} style={{ flex: 1, padding: "12px", background: "none", border: "1px solid var(--line)", color: "var(--bark)", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", cursor: "pointer" }}>Próximo →</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(30,42,24,.5)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 151, width: "min(580px, 54vw)", background: "var(--canvas)", display: "flex", flexDirection: "column", boxShadow: "-12px 0 48px rgba(0,0,0,.2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 28px", borderBottom: "1px solid var(--line)" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", color: "var(--stone)", textTransform: "uppercase", marginBottom: 4 }}>{CAT_LABEL[preset.cat]}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: "var(--bark)" }}>{preset.name}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid var(--line)", color: "var(--bark)", fontSize: 20, cursor: "pointer", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <BeforeAfter presetKey={preset.key} height={400} variant="section" />
        </div>
        <div style={{ padding: "22px 28px", borderTop: "1px solid var(--line)" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 15, color: "#3A3530", margin: "0 0 18px", lineHeight: 1.65 }}>{preset.desc}</p>
          <div style={{ marginBottom: 16 }}>{navButtons}</div>
          <a href={CTA} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", padding: "15px 24px", background: "var(--bark)", color: "var(--canvas)", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>
            Quero o Pack Protagonista →
          </a>
        </div>
      </div>
    </>
  );
}

// ─── Coleção completa com filtros ─────────────────────────────────────────────

function ColecaoSection() {
  const [activeCat, setActiveCat] = useState<Cat>("Todos");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = activeCat === "Todos" ? PRESETS : PRESETS.filter(p => p.cat === activeCat);

  const close = () => setSelected(null);
  const prev  = () => setSelected(i => i === null ? null : (i - 1 + filtered.length) % filtered.length);
  const next  = () => setSelected(i => i === null ? null : (i + 1) % filtered.length);

  return (
    <section style={{ padding: "96px 56px", background: "var(--canvas-deep)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 24 }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 48, letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
            A coleção{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>completa</span>.
          </h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <FilterPill label={`Todos · ${PRESETS.length}`} active={activeCat === "Todos"} onClick={() => setActiveCat("Todos")} />
            {(["Verde", "Frio", "Cinematico", "Quente", "Mood"] as Exclude<Cat, "Todos">[]).map(cat => (
              <FilterPill
                key={cat}
                label={`${CAT_LABEL[cat]} · ${PRESETS.filter(p => p.cat === cat).length}`}
                color={CAT_COLOR[cat]}
                active={activeCat === cat}
                onClick={() => setActiveCat(cat)}
              />
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {filtered.map((p, i) => (
            <PresetCard
              key={`${p.key}-${i}`}
              preset={p}
              isActive={selected === i}
              onSelect={() => setSelected(i)}
            />
          ))}
        </div>
      </div>

      {selected !== null && (
        <PresetModal
          preset={filtered[selected]}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}

// ─── CTA final ────────────────────────────────────────────────────────────────

function CTAFinal() {
  return (
    <section style={{ padding: "112px 56px", background: "var(--forest)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", borderTop: "1px solid rgba(232,223,201,.1)" }}>
      <div>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 76, fontWeight: 700, letterSpacing: "-.03em", lineHeight: 0.94, margin: 0, color: "var(--canvas)" }}>
          Pronto pra<br />dar{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>cor</span>
          <br />às suas fotos?
        </h2>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "rgba(232,223,201,.7)", marginTop: 28, maxWidth: "38ch", lineHeight: 1.55 }}>
          18 presets desenvolvidos em campo. Download imediato. Garantia de 14 dias — se não curtir, devolvo sem pergunta.
        </p>
        <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".12em", color: "rgba(232,223,201,.4)", textTransform: "uppercase" }}>
          <span style={{ color: "var(--rust-soft)", fontSize: 14 }}>✓</span>
          Garantia 14 dias · sem perguntas
        </div>
      </div>

      <div style={{ background: "var(--canvas)", padding: 40, border: "1px solid rgba(232,223,201,.15)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 8 }}>
          Pack Protagonista
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
          {["18 presets em .xmp + .dng", "Guia PDF de instalação", "Licença pessoal e comercial", "Atualizações vitalícias", "Suporte por email"].map(item => (
            <div key={item} style={{ display: "flex", gap: 12, padding: "8px 0", fontFamily: "var(--font-serif)", fontSize: 15, color: "#3A3530" }}>
              <span style={{ color: "var(--moss)", fontWeight: 700 }}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <a href={CTA} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", padding: "18px 24px", background: "var(--bark)", color: "var(--canvas)", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>
          Comprar agora →
        </a>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProtagonistePage() {
  return (
    <div className="protagonista-lp" style={{ background: "var(--canvas)", color: "var(--bark)", fontFamily: "var(--font-ui)" }}>

      <SiteNav dark={false} />

      {/* Headline */}
      <section style={{ background: "var(--forest)", color: "var(--canvas)", padding: "80px 56px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".28em", color: "rgba(232,223,201,.45)", textTransform: "uppercase", marginBottom: 20 }}>
            Presets · Pack Protagonista
          </div>
          <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(38px, 5vw, 72px)", letterSpacing: "-.03em", lineHeight: 0.94, margin: "0 0 20px" }}>
            18 presets para quem leva{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>a fotografia a sério</span>.
          </h1>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: "rgba(232,223,201,.72)", margin: "0 0 32px", maxWidth: "48ch", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Do verde de mata fechada ao frio de altitude. Testados em RAW, calibrados em campo.
          </p>
          <a href={CTA} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "17px 34px", background: "var(--rust-soft)", color: "var(--forest)", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", textDecoration: "none" }}>
            Comprar por R$ {PRICE_VISTA}
            <span style={{ fontSize: 18 }}>→</span>
          </a>
          <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", color: "rgba(232,223,201,.4)", textTransform: "uppercase" }}>
            ou {PRICE_N}× de R$ {PRICE_PARCEL} · Download imediato · Garantia 14 dias
          </div>
        </div>
      </section>

      {/* Hero sliders */}
      <HeroSliders />

      {/* Strip credibilidade */}
      <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "var(--canvas)" }}>
        {[
          { v: "18",          k: "presets no pack" },
          { v: "Lightroom",   k: "Classic + CC + Mobile" },
          { v: "RAW",         k: "calibrado em campo" },
          { v: "14 dias",     k: "garantia total" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "28px 24px", borderLeft: i === 0 ? "none" : "1px solid var(--line)", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 22, fontWeight: 700, letterSpacing: "-.01em", color: "var(--bark)", marginBottom: 4 }}>{s.v}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--stone)" }}>{s.k}</div>
          </div>
        ))}
      </section>

      {/* Coleção completa */}
      <ColecaoSection />

      {/* CTA final */}
      <CTAFinal />

      <SiteFooter dark={false} />

      <style>{`
        @media (max-width: 900px) {
          .protagonista-lp [style*="repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .protagonista-lp [style*="1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .protagonista-lp [style*="repeat(4, 1fr)"][style*="28px 24px"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          .protagonista-lp section {
            padding: 56px 20px !important;
          }
          .protagonista-lp section h1,
          .protagonista-lp section h2 {
            font-size: 36px !important;
          }
        }

        @media (max-width: 480px) {
          .protagonista-lp section {
            padding: 40px 16px !important;
          }
          .protagonista-lp section h1,
          .protagonista-lp section h2 {
            font-size: 28px !important;
          }
          .protagonista-lp [style*="repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
