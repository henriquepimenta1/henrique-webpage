"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";
import { PRESETS, PRESET_CATS, ACCORDION_ITEMS, CTA_URL } from "@/content/presets";

// ─── Constants ────────────────────────────────────────────────────────────────
const PRICE_VISTA  = "39";
const PRICE_PARCEL = "5,19";
const PRICE_N      = "9";
const CTA          = "https://pay.cakto.com.br/C4dmPFR";

const TONE_COLORS: Record<string, string> = {
  "Tom Verde":   "#6B9E6B",
  "Tom Azul":    "#5A86B8",
  "Tom Laranja": "#C47A3A",
};

const TESTIMONIALS = [
  { name: "Mariana C.",  handle: "@mariana.foto",    location: "São Paulo, SP",      text: "Workflow de pós que levava 2h agora leva 20min. Consistência visual que eu não conseguia nem pagando curso." },
  { name: "Rafael T.",   handle: "@rafa_outdoor",    location: "Curitiba, PR",       text: "Testei em RAW de montanha a -5°C, luz dura, sem correção extra. Saiu direto. É o único preset que funciona no meu processo." },
  { name: "Camila M.",   handle: "@camila.aventura", location: "Rio de Janeiro, RJ", text: "Uso em trabalhos pagos com licença comercial. Cliente nem percebeu que é preset — achou que eu tinha feito tudo na mão." },
  { name: "Pedro L.",    handle: "@pedroluiz.film",  location: "Florianópolis, SC",  text: "Comprei pelo visual, fiquei pela velocidade. A identidade cromática do meu portfólio finalmente tem coerência." },
  { name: "Juliana B.",  handle: "@ju.trail",        location: "Belo Horizonte, MG", text: "Já usei em 3 ensaios outdoor profissionais. Clientes pedem 'aquele estilo' sem saber que é o mesmo preset." },
];

const FAQ_ITEMS = [
  ...ACCORDION_ITEMS,
  { title: "Funciona no Lightroom Mobile?",        body: "Sim. Os arquivos .dng instalam no Lightroom Mobile (iOS e Android) via Creative Cloud. Guia de instalação incluso." },
  { title: "Por que não usar um preset grátis?",   body: "Presets gratuitos são desenvolvidos em fotos de banco, com iluminação controlada. Estes foram calibrados em RAW real — expedições de alta altitude, deserto, luz dura de meio-dia. A diferença é que não precisam de ajuste fino pra funcionar no seu material." },
  { title: "E se eu não gostar?",                  body: "Garantia de 14 dias. Escreve para management@henriq.eu e devolvo 100% sem perguntas." },
  { title: "Recebo atualizações futuras?",          body: "Sim. Todo pack novo que lançar, você recebe automaticamente — sem custo adicional." },
  { title: "Funciona no Camera Raw / Photoshop?",  body: "Sim. Os arquivos .xmp são compatíveis com Camera Raw e Photoshop CC." },
];

// ─── BeforeAfter Slider ───────────────────────────────────────────────────────
function BeforeAfter({ presetKey, height = 640 }: { presetKey: string; height?: number }) {
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

  return (
    <div
      ref={wrap}
      onMouseDown={e => { dragging.current = true; move(e.clientX); }}
      onTouchStart={e => { dragging.current = true; if (e.touches[0]) move(e.touches[0].clientX); }}
      onKeyDown={e => {
        if (e.key === "ArrowLeft")  setPos(p => Math.max(2, p - 2));
        if (e.key === "ArrowRight") setPos(p => Math.min(98, p + 2));
      }}
      tabIndex={0}
      role="slider"
      aria-label="Comparar antes e depois"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
      style={{ position: "relative", width: "100%", height, overflow: "hidden", cursor: "ew-resize", userSelect: "none", outline: "none", background: "#0e0c0a" }}
    >
      {/* After */}
      <img src={`/images/presets/${presetKey}.jpg`} alt="Preset aplicado" draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
      {/* Before */}
      <img src={`/images/presets/${presetKey}-before.jpg`} alt="RAW original" draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(0 ${100 - pos}% 0 0)`, pointerEvents: "none" }} />

      {/* Labels */}
      <div style={{ position: "absolute", top: 20, left: 20, padding: "5px 12px", background: "rgba(14,12,10,.8)", backdropFilter: "blur(6px)", color: "rgba(232,223,201,.9)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase" }}>RAW</div>
      <div style={{ position: "absolute", top: 20, right: 20, padding: "5px 12px", background: "var(--rust)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase" }}>Tratado</div>

      {/* Divider */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "rgba(232,223,201,.9)", transform: "translateX(-1px)", pointerEvents: "none" }} />

      {/* Handle */}
      <div style={{ position: "absolute", top: "50%", left: `${pos}%`, width: 48, height: 48, borderRadius: "50%", background: "var(--canvas)", transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", color: "var(--bark)", fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,.4)" }}>⇄</div>

      {/* Hint */}
      <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", padding: "5px 12px", background: "rgba(14,12,10,.65)", backdropFilter: "blur(6px)", color: "rgba(232,223,201,.7)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", pointerEvents: "none", whiteSpace: "nowrap" }}>
        Arraste ←→
      </div>
    </div>
  );
}

// ─── Preset Card ──────────────────────────────────────────────────────────────
function PresetCard({ preset, isActive, onSelect }: {
  preset: { key: string; name: string; desc: string; cat: string };
  isActive: boolean;
  onSelect: () => void;
}) {
  const dotColor = TONE_COLORS[preset.cat] ?? "var(--rust)";
  const shortName = preset.name.split(" — ")[1] ?? preset.name;

  return (
    <button
      onClick={onSelect}
      className={`preset-card${isActive ? " preset-card--active" : ""}`}
      aria-pressed={isActive}
    >
      {/* Image — split preview */}
      <div className="preset-card__img-wrap">
        {/* before — left half */}
        <div style={{ position: "absolute", inset: 0, width: "50%", overflow: "hidden" }}>
          <img src={`/images/presets/${preset.key}-before.jpg`} alt="" style={{ position: "absolute", left: 0, top: 0, width: "200%", height: "100%", objectFit: "cover", filter: "saturate(.5) brightness(.9)" }} />
        </div>
        {/* after — right half */}
        <div style={{ position: "absolute", inset: 0, left: "50%", width: "50%", overflow: "hidden" }}>
          <img src={`/images/presets/${preset.key}.jpg`} alt="" style={{ position: "absolute", right: 0, top: 0, width: "200%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* divider */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: "rgba(255,255,255,.5)", transform: "translateX(-.5px)", zIndex: 1 }} />
        {/* active badge */}
        {isActive && (
          <div style={{ position: "absolute", top: 8, right: 8, padding: "3px 8px", background: "var(--rust)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", zIndex: 2 }}>
            no slider
          </div>
        )}
        {/* hover label */}
        <div className="preset-card__hover-label">Ver em tela cheia →</div>
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, flexShrink: 0, display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--stone)" }}>{preset.cat}</span>
        </div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600, color: "var(--bark)", marginBottom: 3, letterSpacing: "-.01em" }}>{shortName}</div>
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 11, color: "#5A5248", lineHeight: 1.45 }}>{preset.desc}</div>
      </div>
    </button>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const [idx, setIdx] = useState(0);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % total), 5000);
    return () => clearInterval(id);
  }, [total]);

  const t = TESTIMONIALS[idx];

  return (
    <div style={{ position: "relative" }}>
      <div style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", transition: "transform .5s cubic-bezier(.4,0,.2,1)", transform: `translateX(-${idx * 100}%)` }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ minWidth: "100%", padding: "40px 48px", background: "var(--canvas)", border: "1px solid var(--line)", boxSizing: "border-box" }}>
              <div style={{ color: "#C49A3A", fontSize: 16, letterSpacing: 3, marginBottom: 20 }}>★★★★★</div>
              <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.65, color: "var(--bark)", margin: "0 0 24px", maxWidth: "58ch" }}>
                "{t.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--canvas-deep)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 15, color: "var(--moss)", flexShrink: 0 }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--bark)" }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", color: "var(--stone)", textTransform: "uppercase" }}>{t.handle} · {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 22 : 7, height: 7, borderRadius: 4, border: "none", cursor: "pointer", background: i === idx ? "var(--rust)" : "var(--line)", transition: "width .3s, background .3s", padding: 0 }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["←", "→"] as const).map((arrow, d) => (
            <button key={arrow} onClick={() => setIdx(i => (i + (d === 0 ? -1 : 1) + total) % total)}
              style={{ width: 34, height: 34, border: "1px solid var(--line)", background: "transparent", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--bark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ borderTop: "1px solid var(--line)" }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--line)" }}>
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600, color: "var(--bark)", letterSpacing: "-.01em" }}>{item.title}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 20, color: "var(--rust)", transform: open === i ? "rotate(45deg)" : "none", transition: "transform .22s", flexShrink: 0, lineHeight: 1 }}>+</span>
          </button>
          {open === i && (
            <div style={{ paddingBottom: 20, fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.7, color: "#3A3530", maxWidth: "64ch" }}>
              {item.body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── CTA Button ───────────────────────────────────────────────────────────────
function CTAButton({ size = "md", block = false }: { size?: "sm" | "md" | "lg"; block?: boolean }) {
  const pad = { sm: "12px 26px", md: "16px 32px", lg: "19px 42px" }[size];
  const fs  = { sm: "11px", md: "12px", lg: "13px" }[size];
  return (
    <a href={CTA} target="_blank" rel="noopener noreferrer"
      style={{ display: block ? "flex" : "inline-flex", flexDirection: "column", alignItems: "center", gap: 5, textDecoration: "none", width: block ? "100%" : undefined }}>
      <span style={{ display: block ? "flex" : "inline-flex", width: block ? "100%" : undefined, justifyContent: "center", alignItems: "center", gap: 10, padding: pad, background: "var(--bark)", color: "var(--canvas)", fontFamily: "var(--font-ui)", fontSize: fs, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", boxSizing: "border-box" }}>
        Comprar por R$ {PRICE_VISTA}
        <span style={{ fontSize: size === "lg" ? 20 : 16 }}>→</span>
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".14em", color: "var(--stone)", textTransform: "uppercase" }}>
        ou {PRICE_N}× de R$ {PRICE_PARCEL} · Download imediato
      </span>
    </a>
  );
}

// ─── Guarantee ────────────────────────────────────────────────────────────────
function Guarantee({ inverted = false }: { inverted?: boolean }) {
  const fg   = inverted ? "rgba(232,223,201,.8)" : "var(--bark)";
  const sub  = inverted ? "rgba(232,223,201,.4)" : "var(--stone)";
  const bdr  = inverted ? "rgba(232,223,201,.25)" : "var(--line)";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${bdr}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>✓</div>
      <div>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: fg, marginBottom: 2 }}>Garantia de 14 dias</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", color: sub, textTransform: "uppercase" }}>Sem perguntas · Devolução total</div>
      </div>
    </div>
  );
}

// ─── Library Section ──────────────────────────────────────────────────────────
type LibTab = "aesthetic" | "tone";
type ToneFilter = "all" | "Tom Verde" | "Tom Azul" | "Tom Laranja";

function LibrarySection({ activeKey, onSelect }: {
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  const [tab, setTab] = useState<LibTab>("aesthetic");
  const [toneFilter, setToneFilter] = useState<ToneFilter>("all");

  const aestheticPresets = PRESETS.filter(p => p.cat === "Aesthetic");
  const tonePresets      = PRESETS.filter(p => p.cat !== "Aesthetic");
  const toneFiltered     = toneFilter === "all" ? tonePresets : tonePresets.filter(p => p.cat === toneFilter);

  const toneSubCats: ToneFilter[] = ["all", "Tom Verde", "Tom Azul", "Tom Laranja"];

  const displayed = tab === "aesthetic" ? aestheticPresets : toneFiltered;

  return (
    <section style={{ padding: "96px 0 0", background: "var(--canvas-deep)", borderTop: "1px solid var(--line)" }}>
      {/* Header */}
      <div style={{ padding: "0 56px 48px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12 }}>
          № 03 · Biblioteca completa
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(32px,4vw,52px)", letterSpacing: "-.03em", lineHeight: 0.96, margin: 0, color: "var(--bark)" }}>
            Escolha sua<br />
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>identidade visual.</span>
          </h2>
          <CTAButton size="sm" />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 56px", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", gap: 0 }}>
          {(["aesthetic", "tone"] as LibTab[]).map(t => {
            const active = tab === t;
            const count  = t === "aesthetic" ? aestheticPresets.length : tonePresets.length;
            const label  = t === "aesthetic" ? "Aesthetic" : "Tone Based";
            const desc   = t === "aesthetic" ? "Mood, atmosfera, estilo visual" : "Baseado em paleta de cor";
            return (
              <button
                key={t}
                onClick={() => { setTab(t); if (t === "aesthetic") setToneFilter("all"); }}
                className={`lib-tab${active ? " lib-tab--active" : ""}`}
              >
                <span className="lib-tab__label">{label}</span>
                <span className="lib-tab__meta">{desc} · {count} presets</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone sub-filters */}
      <div style={{
        padding: "0 56px",
        height: tab === "tone" ? "52px" : "0px",
        overflow: "hidden",
        transition: "height .3s cubic-bezier(.2,.8,.2,1)",
        borderBottom: tab === "tone" ? "1px solid var(--line)" : "none",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        {toneSubCats.map(f => {
          const active = toneFilter === f;
          const dot    = f !== "all" ? TONE_COLORS[f] : undefined;
          const label  = f === "all" ? `Todos · ${tonePresets.length}` : `${f.replace("Tom ", "")} · ${tonePresets.filter(p => p.cat === f).length}`;
          return (
            <button
              key={f}
              onClick={() => setToneFilter(f)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 14px", border: "1px solid",
                borderColor: active ? "var(--bark)" : "var(--line)",
                background: active ? "var(--bark)" : "transparent",
                color: active ? "var(--canvas)" : "var(--stone)",
                fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase",
                cursor: "pointer", transition: "all .18s",
              }}
            >
              {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? "var(--canvas)" : dot, flexShrink: 0, display: "inline-block" }} />}
              {label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ padding: "28px 56px 80px" }}>
        {/* Category description */}
        <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 14, color: "var(--stone)", margin: "0 0 24px", lineHeight: 1.5 }}>
          {tab === "aesthetic"
            ? `${aestheticPresets.length} presets com identidade visual forte — para quem quer autenticidade e mood cinematográfico consistente.`
            : `${toneFiltered.length} presets calibrados por paleta de cor — para quem trabalha com briefing cromático específico de clientes.`}
        </p>

        <div className="preset-grid">
          {displayed.map((p, i) => (
            <PresetCard key={`${p.key}-${i}`} preset={p} isActive={activeKey === p.key} onSelect={() => onSelect(p.key)} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PresetsPage() {
  const [activeKey, setActiveKey] = useState("21-campo-seco");
  const heroRef = useRef<HTMLDivElement>(null);

  const selectPreset = useCallback((key: string) => {
    setActiveKey(key);
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const activePreset = PRESETS.find(p => p.key === activeKey);

  return (
    <div style={{ background: "var(--canvas)", color: "var(--bark)", fontFamily: "var(--font-ui)" }}>
      <SiteNav dark={false} />

      <style>{`
        /* ── Preset card ── */
        .preset-card {
          background: var(--canvas);
          border: 1px solid var(--line);
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          text-align: left;
          transition: transform .3s cubic-bezier(.2,.8,.2,1), border-color .2s;
          position: relative;
        }
        .preset-card:hover { transform: translateY(-3px); }
        .preset-card--active { border: 2px solid var(--rust); }

        .preset-card__img-wrap {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
        }
        .preset-card__hover-label {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding: 12px;
          background: rgba(14,12,10,.6);
          opacity: 0;
          transition: opacity .25s;
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--canvas);
          z-index: 2;
        }
        .preset-card:hover .preset-card__hover-label { opacity: 1; }

        /* ── Library tabs ── */
        .lib-tab {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 16px 32px 16px 0;
          margin-right: 32px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          text-align: left;
          transition: border-color .2s;
        }
        .lib-tab--active { border-bottom-color: var(--rust); }
        .lib-tab__label {
          font-family: var(--font-ui);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -.01em;
          color: var(--bark);
        }
        .lib-tab__meta {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--stone);
        }
        .lib-tab--active .lib-tab__label { color: var(--rust); }

        /* ── Preset grid — responsive ── */
        .preset-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        /* ── Mobile ── */
        @media (max-width: 1024px) {
          .preset-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .lp-hero-grid   { grid-template-columns: 1fr !important; }
          .lp-section     { padding: 56px 20px !important; }
          .lp-section-pad { padding: 0 20px 56px !important; }
          .lp-header      { padding: 0 20px 36px !important; }
          .lp-tab-wrap    { padding: 0 20px !important; }
          .lp-grid-pad    { padding: 24px 20px 64px !important; }
          .lp-sub-filter  { padding: 0 20px !important; }
          .lp-faq-grid    { grid-template-columns: 1fr !important; gap: 40px !important; }
          .lp-final-grid  { grid-template-columns: 1fr !important; gap: 40px !important; }
          .lp-strip       { grid-template-columns: repeat(2, 1fr) !important; }
          .preset-grid    { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .lib-tab        { padding: 14px 20px 14px 0; margin-right: 20px; }
          .lib-tab__label { font-size: 14px; }
        }
        @media (max-width: 480px) {
          .preset-grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
          .lp-strip    { grid-template-columns: 1fr !important; }
        }

        /* ── Focus ── */
        .preset-card:focus-visible,
        .lib-tab:focus-visible {
          outline: 2px solid var(--rust);
          outline-offset: 2px;
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .preset-card { transition: none; }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════
          1. HERO — acima da dobra, headline de ganho, CTA visível
      ════════════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{ background: "var(--forest)", color: "var(--canvas)" }}>
        <div className="lp-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", minHeight: 680 }}>

          {/* Slider */}
          <div style={{ position: "relative" }}>
            <BeforeAfter presetKey={activeKey} height={680} />
            {activePreset && (
              <div style={{ position: "absolute", bottom: 48, left: 20, padding: "6px 12px", background: "rgba(14,12,10,.72)", backdropFilter: "blur(6px)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.75)" }}>
                {activePreset.name}
              </div>
            )}
          </div>

          {/* Painel direito */}
          <div style={{ padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 32 }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".24em", textTransform: "uppercase", color: "rgba(232,223,201,.4)", marginBottom: 16 }}>
                Outdoor Cinematic · Lightroom
              </div>

              <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(32px,3.2vw,50px)", letterSpacing: "-.03em", lineHeight: 1, margin: "0 0 16px" }}>
                Sua pós-produção<br />em minutos.
                <span style={{ display: "block", fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)", fontSize: "0.85em", lineHeight: 1.2, marginTop: 6 }}>
                  Cor de expedição real,<br />não de estúdio.
                </span>
              </h1>

              <p style={{ fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.65, color: "rgba(232,223,201,.65)", margin: "0 0 24px", maxWidth: "36ch" }}>
                45 presets desenvolvidos em campo — Lençóis, Huayhuash, Atacama — em RAW real, luz natural. Para fotógrafos outdoor que levam identidade visual a sério.
              </p>

              {/* Specs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", paddingTop: 20, borderTop: "1px solid rgba(232,223,201,.1)", marginBottom: 28 }}>
                {[
                  { k: "Formato",    v: ".xmp + .dng" },
                  { k: "Packs",      v: "2 · 45 presets" },
                  { k: "Compatível", v: "LR Classic, CC, Mobile" },
                  { k: "Acesso",     v: "Vitalício" },
                ].map(s => (
                  <div key={s.k}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(232,223,201,.3)", marginBottom: 3 }}>{s.k}</div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preço + CTA */}
            <div>
              {/* Prova rápida */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ color: "#C49A3A", fontSize: 13, letterSpacing: 2 }}>★★★★★</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".14em", color: "rgba(232,223,201,.45)", textTransform: "uppercase" }}>
                  +100 fotógrafos usam em portfólio profissional
                </div>
              </div>

              {/* Preço */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(232,223,201,.35)", marginBottom: 6 }}>
                  De R$ 119 por
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 60, fontWeight: 700, letterSpacing: "-.03em", lineHeight: 0.9, color: "var(--canvas)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "rgba(232,223,201,.4)", fontWeight: 400 }}>R$</span>{PRICE_VISTA}
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 13, color: "rgba(232,223,201,.5)", paddingBottom: 6, lineHeight: 1.4 }}>
                    à vista<br />ou {PRICE_N}× de<br />R$ {PRICE_PARCEL}
                  </div>
                </div>
              </div>

              <a href={CTA} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 28px", background: "var(--canvas)", color: "var(--bark)", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", textDecoration: "none", marginBottom: 14 }}>
                Comprar por R$ {PRICE_VISTA} →
              </a>

              <Guarantee inverted />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. STRIP DE CREDIBILIDADE
      ════════════════════════════════════════════════════════ */}
      <div className="lp-strip" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid var(--line)" }}>
        {[
          { v: "+100",       k: "fotógrafos profissionais" },
          { v: "45",         k: "presets · 2 packs" },
          { v: "4 anos",     k: "desenvolvendo em campo" },
          { v: "14 dias",    k: "garantia total" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "24px 20px", borderLeft: i === 0 ? "none" : "1px solid var(--line)", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 20, fontWeight: 700, letterSpacing: "-.01em", color: "var(--bark)", marginBottom: 3 }}>{s.v}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--stone)" }}>{s.k}</div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          3. BIBLIOTECA COMPLETA
      ════════════════════════════════════════════════════════ */}
      <LibrarySection activeKey={activeKey} onSelect={selectPreset} />

      {/* ════════════════════════════════════════════════════════
          4. PARA QUEM É
      ════════════════════════════════════════════════════════ */}
      <section className="lp-section" style={{ padding: "96px 56px", background: "var(--canvas)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12 }}>
            № 04 · Para quem
          </div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", letterSpacing: "-.03em", lineHeight: 0.96, margin: "0 0 48px", color: "var(--bark)" }}>
            Feito para quem leva<br />
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>o processo a sério.</span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--line)" }}>
            {[
              {
                n: "01",
                t: "Fotógrafo outdoor profissional",
                d: "Workflow de pós-produção que precisa ser rápido entre expedições. Identidade cromática consistente em todo o portfólio.",
                tag: "Workflow",
              },
              {
                n: "02",
                t: "Entusiasta e criador de conteúdo",
                d: "Quer que as fotos da trilha ou viagem tenham aquele look cinematográfico — sem gastar horas no Lightroom.",
                tag: "Visual",
              },
              {
                n: "03",
                t: "Cinéfilo e diretor de fotografia",
                d: "Busca referência de cor calibrada em locação real, não em estúdio. Autenticidade de expedição no seu trabalho.",
                tag: "Autenticidade",
              },
            ].map(it => (
              <div key={it.n} style={{ background: "var(--canvas)", padding: "36px 32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", color: "var(--rust)", textTransform: "uppercase" }}>№ {it.n}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".18em", color: "var(--stone)", textTransform: "uppercase", padding: "3px 8px", border: "1px solid var(--line)" }}>{it.tag}</span>
                </div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 18, fontWeight: 600, letterSpacing: "-.01em", color: "var(--bark)", marginBottom: 12, lineHeight: 1.2 }}>{it.t}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 14, lineHeight: 1.65, color: "#4A4440" }}>{it.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          5. O QUE VEM INCLUSO
      ════════════════════════════════════════════════════════ */}
      <section className="lp-section" style={{ padding: "96px 56px", background: "var(--canvas-deep)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12 }}>
            № 05 · Incluso
          </div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", letterSpacing: "-.03em", lineHeight: 0.96, margin: "0 0 48px", color: "var(--bark)" }}>
            O que vem na{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>mochila.</span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 40px" }}>
            {[
              { n: "01", t: "45 presets .xmp + .dng",     d: "Dois packs: 18 + 27 presets. Compatível com Lightroom Classic, CC, Mobile e Camera Raw." },
              { n: "02", t: "Guia de instalação PDF",      d: "Passo a passo para cada versão do Lightroom, com prints. Instalado em menos de 10 minutos." },
              { n: "03", t: "Videoaula de aplicação",      d: "Como escolher o preset certo para cada foto e fazer ajustes finos sem perder a identidade." },
              { n: "04", t: "Licença comercial incluída",  d: "Use em trabalhos pagos, entregáveis de clientes e redes sociais. Sem custo adicional." },
              { n: "05", t: "Atualizações vitalícias",     d: "Todo pack novo que lançar, você recebe automaticamente — sem pagar de novo." },
              { n: "06", t: "Suporte por email",           d: "Dúvida de instalação ou uso? Respondo pessoalmente em até 48h." },
            ].map(it => (
              <div key={it.n} style={{ borderTop: "1px solid var(--line)", paddingTop: 24, paddingBottom: 32 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", color: "var(--rust)", marginBottom: 10, textTransform: "uppercase" }}>№ {it.n}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 17, fontWeight: 600, letterSpacing: "-.01em", marginBottom: 8, color: "var(--bark)" }}>{it.t}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 13, lineHeight: 1.65, color: "#4A4440" }}>{it.d}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, paddingTop: 36, borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <Guarantee />
            <CTAButton size="md" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          6. DEPOIMENTOS
      ════════════════════════════════════════════════════════ */}
      <section className="lp-section" style={{ padding: "96px 56px", background: "var(--canvas)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12 }}>
            № 06 · Prova social
          </div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", letterSpacing: "-.03em", lineHeight: 0.96, margin: "0 0 40px", color: "var(--bark)" }}>
            +100 fotógrafos.{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>No portfólio deles.</span>
          </h2>
          <Testimonials />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          7. FAQ
      ════════════════════════════════════════════════════════ */}
      <section className="lp-section lp-faq-grid" style={{ padding: "96px 56px", background: "var(--canvas-deep)", borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12 }}>
            № 07 · FAQ
          </div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(28px,3vw,42px)", letterSpacing: "-.03em", lineHeight: 0.96, margin: "0 0 16px", color: "var(--bark)" }}>
            Tudo que você<br />
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>precisa saber.</span>
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 14, color: "#4A4440", marginTop: 16, lineHeight: 1.6, maxWidth: "30ch" }}>
            Outra dúvida?{" "}
            <a href="mailto:management@henriq.eu" style={{ color: "var(--rust)", textDecoration: "underline" }}>management@henriq.eu</a>.
            Respondo pessoalmente.
          </p>
          <div style={{ marginTop: 32 }}>
            <Guarantee />
          </div>
        </div>
        <Accordion items={FAQ_ITEMS} />
      </section>

      {/* ════════════════════════════════════════════════════════
          8. CTA FINAL
      ════════════════════════════════════════════════════════ */}
      <section className="lp-section lp-final-grid" style={{ padding: "96px 56px", background: "var(--forest)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", borderTop: "1px solid rgba(232,223,201,.1)" }}>

        {/* Copy */}
        <div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(40px,5.5vw,72px)", letterSpacing: "-.03em", lineHeight: 0.94, margin: "0 0 20px", color: "var(--canvas)" }}>
            Identidade<br />visual que<br />
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>você criou</span>.
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "rgba(232,223,201,.6)", margin: 0, maxWidth: "34ch", lineHeight: 1.6 }}>
            Download imediato. Acesso vitalício. 14 dias de garantia — se não curtir, devolvo sem pergunta.
          </p>
        </div>

        {/* Card de compra */}
        <div style={{ background: "var(--canvas)", padding: "40px 36px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 8 }}>
            Outdoor Cinematic Presets
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 4 }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 64, fontWeight: 700, letterSpacing: "-.03em", color: "var(--bark)", lineHeight: 1 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--stone)", fontWeight: 400 }}>R$</span>{PRICE_VISTA}
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 13, color: "var(--stone)", paddingBottom: 6, lineHeight: 1.5 }}>
              à vista<br />ou {PRICE_N}× de<br />R$ {PRICE_PARCEL}
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 24 }}>
            acesso vitalício · download imediato
          </div>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 18, marginBottom: 20 }}>
            {["45 presets .xmp + .dng", "2 packs: Aesthetic + Tone Based", "Guia PDF + videoaula", "Licença pessoal e comercial", "Atualizações vitalícias"].map(item => (
              <div key={item} style={{ display: "flex", gap: 10, padding: "7px 0", fontFamily: "var(--font-serif)", fontSize: 14, color: "#3A3530" }}>
                <span style={{ color: "var(--moss)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <a href={CTA} target="_blank" rel="noopener noreferrer"
            style={{ display: "block", width: "100%", padding: "17px 24px", background: "var(--bark)", color: "var(--canvas)", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", textDecoration: "none", textAlign: "center", boxSizing: "border-box", marginBottom: 20 }}>
            Comprar agora →
          </a>

          <div style={{ textAlign: "center" }}>
            <Guarantee />
          </div>
        </div>
      </section>

      <SiteFooter dark={false} />
    </div>
  );
}
