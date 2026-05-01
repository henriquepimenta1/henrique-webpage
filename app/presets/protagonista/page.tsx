"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";

const CTA          = "https://pay.cakto.com.br/protagonista"; // TODO: URL real
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
  color: string;
}

const PRESETS: Preset[] = [
  { key: "1-explorador",            name: "Explorador",            desc: "Tons de aventura com verde natural e contraste equilibrado.",             cat: "Verde",      color: "#7EC47E" },
  { key: "2-verdesuave",            name: "Verde Suave",           desc: "Verde delicado com sensação de frescura e calma.",                       cat: "Verde",      color: "#7EC47E" },
  { key: "3-caminhante",            name: "Caminhante",            desc: "Floresta com luz filtrada e verdes saturados.",                           cat: "Verde",      color: "#7EC47E" },
  { key: "4-gelado",                name: "Gelado",                desc: "Frios intensos com sombras azuladas e névoa de altitude.",                cat: "Frio",       color: "#6FA3D8" },
  { key: "5-contador-de-historias", name: "Contador de Histórias", desc: "Paleta narrativa com tonalidades quentes e profundidade dramática.",      cat: "Mood",       color: "#C8905A" },
  { key: "6-campo-aberto",          name: "Campo Aberto",          desc: "Pradaria ampla com verdes suaves e céu aberto.",                          cat: "Verde",      color: "#7EC47E" },
  { key: "7-liberdade",             name: "Liberdade",             desc: "Cinematográfico e dramático — destaca silhuetas e horizontes.",           cat: "Cinematico", color: "#2A211A" },
  { key: "8-cinematico",            name: "Cinemático",            desc: "Grade de cinema com blacks esmagados e highlights limpos.",               cat: "Cinematico", color: "#2A211A" },
  { key: "9-verde-desbotado",       name: "Verde Desbotado",       desc: "Verde faded com sensação vintage e textura de filme.",                    cat: "Verde",      color: "#7EC47E" },
  { key: "10-suavidade",            name: "Suavidade",             desc: "Paleta suave e gentil, ideal para retratos na natureza.",                 cat: "Mood",       color: "#C8905A" },
  { key: "11-intermediario",        name: "Intermediário",         desc: "Equilíbrio entre tons quentes e frios — versátil para qualquer cenário.", cat: "Quente",     color: "#D8924A" },
  { key: "12-sonhos",               name: "Sonhos",                desc: "Atmosfera onírica com véu suave sobre as luzes.",                        cat: "Mood",       color: "#C8905A" },
  { key: "13-nostalgia",            name: "Nostalgia",             desc: "Look retrô com amarelos queimados e sombras quentes.",                    cat: "Quente",     color: "#D8924A" },
  { key: "14-montanha-cerrada",     name: "Montanha Cerrada",      desc: "Densa névoa de montanha com frios profundos e contraste alto.",           cat: "Frio",       color: "#6FA3D8" },
  { key: "15-reflexo-artico",       name: "Reflexo Ártico",        desc: "Azuis polares espelhados com sensação de silêncio e vastidão.",           cat: "Frio",       color: "#6FA3D8" },
  { key: "16-resiliencia",          name: "Resiliência",           desc: "Drama cinematográfico com paleta escura e destaque de luz.",              cat: "Cinematico", color: "#2A211A" },
  { key: "17-duradouro",            name: "Duradouro",             desc: "Dourado persistente de fim de tarde com terras quentes.",                 cat: "Quente",     color: "#D8924A" },
  { key: "18-areia",                name: "Areia",                 desc: "Deserto com areia dourada, calor suave e luz lateral.",                   cat: "Quente",     color: "#D8924A" },
];

const CATS: { id: Cat; label: string }[] = [
  { id: "Todos",      label: "Todos"           },
  { id: "Verde",      label: "Verde"           },
  { id: "Frio",       label: "Frio & Altitude" },
  { id: "Cinematico", label: "Cinemático"      },
  { id: "Quente",     label: "Quente"          },
  { id: "Mood",       label: "Mood"            },
];

const HERO_KEYS = ["7-liberdade", "8-cinematico", "15-reflexo-artico"];

const FAQ_ITEMS = [
  { q: "Funciona no Lightroom Mobile?",      a: "Sim. Os arquivos .dng instalam no Lightroom Mobile (iOS e Android) — basta abrir no app e o preset fica salvo na sua conta Creative Cloud." },
  { q: "Precisa ser fotógrafo profissional?", a: "Não. Os presets foram feitos para funcionar direto no RAW — sem precisar ajustar nada. Você aplica, vê o resultado e, se quiser, faz ajustes finos." },
  { q: "Funciona no Camera Raw / Photoshop?", a: "Sim. Os arquivos .xmp são compatíveis com Camera Raw e Photoshop." },
  { q: "E se eu não gostar?",                a: "Garantia de 14 dias. Se não curtir, escreve pra management@henriq.eu e devolvo 100% sem perguntas." },
  { q: "Recebo atualizações futuras?",        a: "Sim. Todo pack novo que eu lançar, você recebe por email automaticamente — sem custo adicional." },
  { q: "Posso usar em trabalhos comerciais?", a: "Sim. Licença comercial está incluída — portfólios, redes sociais, trabalhos para clientes e campanhas pagas." },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useCountdown(minutes = 15) {
  const total = minutes * 60;
  const [secs, setSecs] = useState(total);
  useEffect(() => {
    const id = setInterval(() => setSecs(s => s <= 1 ? total : s - 1), 1000);
    return () => clearInterval(id);
  }, [total]);
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.08 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return visible;
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

// ─── Scroll reveal wrapper ────────────────────────────────────────────────────

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useReveal(ref as React.RefObject<HTMLElement>);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity .55s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform .55s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Countdown strip ─────────────────────────────────────────────────────────

function CountdownStrip() {
  const time = useCountdown(15);
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      background: "var(--rust)", color: "var(--canvas)",
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 16, padding: "10px 24px",
      fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".14em",
      textTransform: "uppercase", flexWrap: "wrap",
    }}>
      <span style={{ opacity: .75 }}>Oferta por tempo limitado</span>
      <span style={{ fontWeight: 500, fontSize: 17, letterSpacing: ".06em", minWidth: 52, textAlign: "center" }}>{time}</span>
      <span style={{ opacity: .75 }}>· De R$&nbsp;119 por apenas</span>
      <strong>R$&nbsp;{PRICE_VISTA}</strong>
      <a href={CTA} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, padding: "5px 16px", background: "var(--canvas)", color: "var(--rust)", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", textDecoration: "none" }}>
        Comprar →
      </a>
    </div>
  );
}

// ─── BeforeAfter slider ───────────────────────────────────────────────────────

function BeforeAfter({
  presetKey, height = 640, autoplay = false, startPos = 50,
}: {
  presetKey: string; height?: number; autoplay?: boolean; startPos?: number;
}) {
  const [pos, setPos] = useState(autoplay ? 0 : startPos);
  const [hintVisible, setHintVisible] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const autoPlayed = useRef(false);

  const update = useCallback((p: number) => {
    setPos(Math.max(2, Math.min(98, p)));
  }, []);

  const getPos = useCallback((clientX: number) => {
    const el = wrap.current;
    if (!el) return 50;
    const r = el.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * 100;
  }, []);

  useEffect(() => {
    const mm = (e: MouseEvent) => { if (dragging.current) update(getPos(e.clientX)); };
    const tm = (e: TouchEvent) => { if (dragging.current && e.touches[0]) update(getPos(e.touches[0].clientX)); };
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
  }, [update, getPos]);

  // Autoplay reveal
  useEffect(() => {
    if (!autoplay || autoPlayed.current) return;
    const t = setTimeout(() => {
      autoPlayed.current = true;
      setPos(68);
      setTimeout(() => setHintVisible(true), 1800);
    }, 800);
    return () => clearTimeout(t);
  }, [autoplay]);

  const after  = `/images/protagonista/${presetKey}.jpg`;
  const before = `/images/protagonista/${presetKey}-before.jpg`;

  return (
    <div
      ref={wrap}
      onMouseDown={e => { dragging.current = true; autoPlayed.current = true; update(getPos(e.clientX)); }}
      onTouchStart={e => { dragging.current = true; autoPlayed.current = true; if (e.touches[0]) update(getPos(e.touches[0].clientX)); }}
      onKeyDown={e => {
        if (e.key === "ArrowLeft")  update(pos - 2);
        if (e.key === "ArrowRight") update(pos + 2);
      }}
      tabIndex={0}
      role="slider"
      aria-label="Comparar antes e depois"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
      style={{ position: "relative", width: "100%", height, overflow: "hidden", cursor: "ew-resize", userSelect: "none", background: "var(--forest)", outline: "none" }}
    >
      <img src={after}  alt="Preset aplicado" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <img src={before} alt="RAW original"    draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(0 ${100 - pos}% 0 0)`, transition: autoplay && !autoPlayed.current ? "clip-path 1.6s cubic-bezier(0.16,1,0.3,1)" : "none" }} />

      <div style={{ position: "absolute", top: 20, left: 20, padding: "5px 13px", background: "rgba(20,16,12,.78)", backdropFilter: "blur(6px)", color: "rgba(232,220,188,.9)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".26em", textTransform: "uppercase" }}>RAW</div>
      <div style={{ position: "absolute", top: 20, right: 20, padding: "5px 13px", background: "var(--rust)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".26em", textTransform: "uppercase" }}>Tratado</div>

      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "white", transform: "translateX(-1px)", pointerEvents: "none", boxShadow: "0 0 24px rgba(0,0,0,.5)", transition: autoplay && !autoPlayed.current ? "left 1.6s cubic-bezier(0.16,1,0.3,1)" : "none" }} />
      <div style={{ position: "absolute", top: "50%", left: `${pos}%`, width: 52, height: 52, borderRadius: "50%", background: "white", transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", color: "var(--rust)", fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, boxShadow: "0 6px 28px rgba(0,0,0,.4)", transition: autoplay && !autoPlayed.current ? "left 1.6s cubic-bezier(0.16,1,0.3,1)" : "none" }}>⇄</div>

      <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", padding: "5px 14px", background: "rgba(14,12,10,.55)", backdropFilter: "blur(6px)", color: "rgba(232,220,188,.6)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", pointerEvents: "none", whiteSpace: "nowrap", opacity: hintVisible || !autoplay ? (autoplay ? (hintVisible ? 1 : 0) : .85) : 0, transition: "opacity .4s" }}>
        Arraste ←→
      </div>
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
        <BeforeAfter presetKey={HERO_KEYS[active]} height={640} autoplay={active === 0} />
        <div style={{ position: "absolute", bottom: 56, left: 24, padding: "5px 16px", background: "rgba(14,12,10,.6)", backdropFilter: "blur(8px)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(232,220,188,.7)", whiteSpace: "nowrap", pointerEvents: "none" }}>
          {heroPresets[active]?.name}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", background: "var(--forest-soft)", borderTop: "1px solid rgba(232,223,201,.1)" }}>
        {heroPresets.map((p, i) => (
          <button
            key={p.key}
            onClick={() => setActive(i)}
            style={{ position: "relative", height: 80, border: "none", padding: 0, cursor: "pointer", outline: active === i ? "2px solid var(--rust)" : "none", outlineOffset: -2, overflow: "hidden", borderLeft: i > 0 ? "1px solid rgba(232,223,201,.08)" : "none" }}
          >
            <img src={`/images/protagonista/${p.key}.jpg`} alt={p.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: active === i ? "none" : "brightness(.4) saturate(.5)", transition: "filter .3s" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--canvas)", textShadow: "0 1px 6px rgba(0,0,0,.9)" }}>
              {p.name}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Trust strip ─────────────────────────────────────────────────────────────

function TrustStrip() {
  const cells = [
    { v: "18",        k: "presets no pack"       },
    { v: "Lightroom", k: "Classic + CC + Mobile" },
    { v: "RAW",       k: "calibrado em campo"    },
    { v: "14 dias",   k: "garantia total"        },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--canvas)" }}>
      {cells.map((c, i) => (
        <div key={i} style={{ padding: "clamp(20px,3vw,28px) clamp(16px,2.5vw,24px)", textAlign: "center", borderLeft: i === 0 ? "none" : "1px solid var(--line)" }}>
          <div style={{ fontSize: "clamp(18px,2.2vw,24px)", fontWeight: 700, letterSpacing: "-.01em", color: "var(--bark)", marginBottom: 3 }}>{c.v}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--stone)" }}>{c.k}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Inline Drawer ────────────────────────────────────────────────────────────

function InlineDrawer({ preset, onClose }: { preset: Preset; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setOpen(true));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (open && ref.current) {
      setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 120);
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 420);
  };

  return (
    <div
      ref={ref}
      style={{
        gridColumn: "1 / -1",
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        transition: "grid-template-rows .42s cubic-bezier(0.16,1,0.3,1)",
        overflow: "hidden",
      }}
    >
      <div style={{ overflow: "hidden", background: "var(--forest)", border: "1px solid var(--forest-soft)" }}>
        <div className="drawer-content" style={{ display: "grid", gridTemplateColumns: "1fr 300px", minHeight: 380 }}>
          {/* Slider */}
          <div style={{ position: "relative", overflow: "hidden", background: "var(--forest-soft)", minHeight: 380 }}>
            <BeforeAfter presetKey={preset.key} height={380} startPos={50} />
            <button
              onClick={handleClose}
              style={{ position: "absolute", top: 14, right: 14, width: 32, height: 32, background: "rgba(232,223,201,.12)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(232,220,188,.9)", fontFamily: "var(--font-mono)", fontSize: 16, zIndex: 2 }}
            >✕</button>
          </div>

          {/* Info */}
          <div style={{ padding: "28px 28px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "var(--forest)", color: "rgba(232,223,201,.9)", borderLeft: "1px solid rgba(232,223,201,.08)" }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: preset.color, marginBottom: 6, opacity: .9 }}>
                {CATS.find(c => c.id === preset.cat)?.label}
              </div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 24, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.1, marginBottom: 8 }}>{preset.name}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 14, color: "rgba(232,223,201,.6)", lineHeight: 1.6 }}>{preset.desc}</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.3)", marginBottom: 20 }}>Arraste o comparador ←→</div>
              <a href={CTA} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "14px 20px", background: "var(--rust-soft)", color: "var(--forest)", fontWeight: 700, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", textAlign: "center", textDecoration: "none" }}>
                Comprar todos os presets →
              </a>
              <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(232,223,201,.3)", textAlign: "center" }}>
                R$&nbsp;{PRICE_VISTA} à vista · garantia 14 dias
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Preset Card ─────────────────────────────────────────────────────────────

function PresetCard({ preset, isActive, onSelect }: { preset: Preset; isActive: boolean; onSelect: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: "var(--canvas)", border: isActive ? "2px solid var(--rust)" : "1px solid var(--line)", overflow: "hidden", cursor: "pointer", padding: 0, textAlign: "left", transform: hover ? "translateY(-4px)" : "none", transition: "transform .28s cubic-bezier(0.16,1,0.3,1), border-color .2s", position: "relative" }}
    >
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
        <img src={`/images/protagonista/${preset.key}.jpg`} alt={preset.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hover ? "scale(1.06)" : "scale(1)", transition: "transform .6s cubic-bezier(0.16,1,0.3,1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(14,20,8,.8),transparent 50%)", opacity: hover ? 1 : 0, transition: "opacity .28s", display: "flex", alignItems: "flex-end", padding: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "white", padding: "4px 9px", background: "var(--rust)" }}>Ver antes/depois →</span>
        </div>
        {isActive && (
          <div style={{ position: "absolute", top: 8, right: 8, padding: "3px 8px", background: "var(--rust)", color: "white", fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase" }}>no slider</div>
        )}
      </div>
      <div style={{ padding: "12px 14px 16px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".15em", color: "var(--stone)", marginBottom: 4 }}>
          <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: preset.color, marginRight: 5, verticalAlign: "middle" }} />
          <span style={{ verticalAlign: "middle" }}>{CATS.find(c => c.id === preset.cat)?.label}</span>
        </div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 700, letterSpacing: "-.01em", color: "var(--bark)", margin: "4px 0 3px" }}>{preset.name}</div>
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 11, color: "var(--stone)", lineHeight: 1.5 }}>{preset.desc}</div>
      </div>
    </button>
  );
}

// ─── Coleção com inline drawer ────────────────────────────────────────────────

function ColecaoSection() {
  const [activeCat, setActiveCat] = useState<Cat>("Todos");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const cols = useCols();

  const filtered = activeCat === "Todos" ? PRESETS : PRESETS.filter(p => p.cat === activeCat);

  const handleSelect = (i: number) => {
    setSelectedIdx(prev => prev === i ? null : i);
  };

  const handleCatChange = (cat: Cat) => {
    setActiveCat(cat);
    setSelectedIdx(null);
  };

  // Which index to insert drawer after (last card in the row of selectedIdx)
  const drawerAfterIdx = selectedIdx !== null
    ? Math.min((Math.floor(selectedIdx / cols) + 1) * cols - 1, filtered.length - 1)
    : -1;

  // Build render list: cards + drawer injection
  const items: Array<{ type: "card"; preset: Preset; idx: number } | { type: "drawer" }> = [];
  filtered.forEach((preset, idx) => {
    items.push({ type: "card", preset, idx });
    if (idx === drawerAfterIdx && selectedIdx !== null) {
      items.push({ type: "drawer" });
    }
  });

  return (
    <section style={{ padding: "clamp(64px,8vw,96px) clamp(24px,5vw,72px)", background: "var(--canvas-deep)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>

        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 24 }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(30px,4vw,52px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.02, margin: 0, color: "var(--bark)" }}>
                A coleção{" "}
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>completa</span>.
              </h2>
              <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 13, color: "var(--stone)", marginTop: 8 }}>Clique em qualquer preset para abrir o comparador aqui mesmo.</p>
            </div>

            {/* Filter pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATS.map(cat => {
                const count = cat.id === "Todos" ? PRESETS.length : PRESETS.filter(p => p.cat === cat.id).length;
                const isActive = activeCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCatChange(cat.id)}
                    className={`filter-pill${isActive ? " active" : ""}`}
                    style={{ padding: "8px 17px", border: "1px solid var(--line)", background: isActive ? "var(--bark)" : "transparent", color: isActive ? "var(--canvas)" : "var(--bark)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", borderColor: isActive ? "var(--bark)" : "var(--line)", transition: "all .18s" }}
                  >
                    {cat.label} · {count}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {items.map((item, i) =>
            item.type === "card" ? (
              <PresetCard
                key={item.preset.key}
                preset={item.preset}
                isActive={selectedIdx === item.idx}
                onSelect={() => handleSelect(item.idx)}
              />
            ) : (
              <InlineDrawer
                key="drawer"
                preset={filtered[selectedIdx!]}
                onClose={() => setSelectedIdx(null)}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────

function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ borderTop: "1px solid var(--line)" }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--line)" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
          >
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600, letterSpacing: "-.01em", color: "var(--bark)" }}>{item.q}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--rust)", transform: open === i ? "rotate(45deg)" : "none", transition: "transform .28s cubic-bezier(0.16,1,0.3,1)", flexShrink: 0, lineHeight: 1 }}>+</span>
          </button>
          <div style={{ overflow: "hidden", display: "grid", gridTemplateRows: open === i ? "1fr" : "0fr", transition: "grid-template-rows .32s cubic-bezier(0.16,1,0.3,1)" }}>
            <div style={{ overflow: "hidden", paddingBottom: open === i ? 20 : 0, fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.75, color: "#3A3530" }}>
              {item.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FAQ section ─────────────────────────────────────────────────────────────

function FAQSection() {
  return (
    <section style={{ padding: "clamp(64px,8vw,96px) clamp(24px,5vw,72px)", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "clamp(40px,8vw,96px)", alignItems: "start" }}>
      <Reveal>
        <div style={{ position: "sticky", top: 64 }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(30px,4vw,52px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.02, margin: 0, color: "var(--bark)" }}>
            Tudo que você{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>precisa saber</span>.
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 15, color: "var(--stone)", marginTop: 20, lineHeight: 1.6, maxWidth: "32ch" }}>
            Se a sua dúvida não estiver aqui, escreve pra{" "}
            <a href="mailto:management@henriq.eu" style={{ color: "var(--rust)", textDecoration: "underline" }}>management@henriq.eu</a>.
            Respondo todas, pessoalmente.
          </p>
          <div style={{ marginTop: 32, display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 22px", border: "1px solid var(--moss)", background: "rgba(74,88,56,.06)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", border: "2px solid var(--moss)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--moss)", flexShrink: 0 }}>✓</div>
            <div>
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: "var(--bark)", marginBottom: 2 }}>Garantia de 14 dias</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--stone)" }}>Sem perguntas · Devolução total</div>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <Accordion items={FAQ_ITEMS} />
      </Reveal>
    </section>
  );
}

// ─── CTA final ────────────────────────────────────────────────────────────────

function CTAFinal() {
  return (
    <section style={{ padding: "clamp(64px,8vw,96px) clamp(24px,5vw,72px)", background: "var(--forest)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,8vw,96px)", alignItems: "center", borderTop: "1px solid rgba(232,223,201,.08)" }}>
      <Reveal>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(42px,5.5vw,80px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: .94, margin: 0, color: "white" }}>
          Pronto pra dar<br />
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>cor</span>
          <br />às suas fotos?
        </h2>
        <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 17, color: "rgba(232,223,201,.65)", marginTop: 24, maxWidth: "40ch", lineHeight: 1.6 }}>
          Download imediato. Acesso vitalício. Garantia de 14 dias — se não curtir, devolvo sem pergunta.
        </p>
        <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(232,223,201,.35)" }}>
          <span style={{ color: "var(--rust-soft)", fontSize: 14 }}>✓</span>
          Garantia 14 dias · sem perguntas
        </div>
      </Reveal>

      <Reveal>
        <div style={{ background: "var(--canvas)", padding: "clamp(24px,4vw,44px)", border: "1px solid rgba(232,223,201,.14)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 6 }}>Pack Protagonista</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 4 }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(52px,6vw,76px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: .9, color: "var(--bark)" }}>
              <small style={{ fontFamily: "var(--font-mono)", fontSize: ".28em", fontWeight: 400, color: "var(--stone)" }}>R$</small>{PRICE_VISTA}
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 13, color: "var(--stone)", paddingBottom: 8, lineHeight: 1.5 }}>
              à vista<br />ou {PRICE_N}× de<br />R$&nbsp;{PRICE_PARCEL}
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 24 }}>
            acesso vitalício · download imediato
          </div>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20, marginBottom: 24 }}>
            {["18 presets em .xmp + .dng", "Guia PDF de instalação", "Licença pessoal e comercial", "Atualizações vitalícias", "Suporte por email"].map(item => (
              <div key={item} style={{ display: "flex", gap: 10, padding: "7px 0", fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--bark)" }}>
                <span style={{ color: "var(--moss)", fontWeight: 700 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <a
            href={CTA}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", width: "100%", padding: 18, background: "var(--bark)", color: "var(--canvas)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}
          >
            Comprar agora →
          </a>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 20px", border: "1px solid var(--moss)", background: "rgba(74,88,56,.06)" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid var(--moss)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "var(--moss)", flexShrink: 0 }}>✓</div>
              <div>
                <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "var(--bark)", marginBottom: 2 }}>Garantia de 14 dias</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--stone)" }}>Sem perguntas · Devolução total</div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProtagonistePage() {
  return (
    <div style={{ background: "var(--canvas)", color: "var(--bark)", fontFamily: "var(--font-ui)" }}>
      <CountdownStrip />

      <div style={{ paddingTop: 41 }}>
        <SiteNav dark={false} />
      </div>

      {/* Headline */}
      <section style={{ background: "var(--forest)", color: "var(--canvas)", padding: "clamp(48px,6vw,80px) clamp(24px,5vw,56px) clamp(32px,4vw,56px)", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".28em", color: "rgba(232,223,201,.45)", textTransform: "uppercase", marginBottom: 20 }}>
            Presets · Pack Protagonista
          </div>
          <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "clamp(36px,5vw,68px)", letterSpacing: "-.03em", lineHeight: .94, margin: "0 0 20px", color: "white" }}>
            18 presets para quem leva{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)", fontSize: ".88em" }}>a fotografia a sério.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 15, color: "rgba(232,223,201,.72)", margin: "0 0 32px", maxWidth: "48ch", marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 }}>
            Do verde de mata fechada ao frio de altitude. Testados em RAW, calibrados em campo.
          </p>
          <a href={CTA} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "17px 34px", background: "var(--rust-soft)", color: "var(--forest)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase" }}>
              Comprar por R$&nbsp;{PRICE_VISTA} <span style={{ fontSize: 20 }}>→</span>
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".13em", textTransform: "uppercase", color: "rgba(232,223,201,.42)" }}>
              ou {PRICE_N}× de R$&nbsp;{PRICE_PARCEL} · Download imediato
            </span>
          </a>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(232,223,201,.35)" }}>
            <span style={{ color: "var(--moss)", fontSize: 14 }}>✓</span>
            Garantia 14 dias sem perguntas
          </div>
        </div>
      </section>

      <HeroSliders />
      <TrustStrip />
      <ColecaoSection />
      <FAQSection />
      <CTAFinal />

      <SiteFooter dark={false} />

      <style>{`
        @media (max-width: 900px) {
          .drawer-content { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          [style*="repeat(4,1fr)"] { grid-template-columns: repeat(3,1fr) !important; }
        }
        @media (max-width: 768px) {
          [style*="1fr 1.4fr"] { grid-template-columns: 1fr !important; }
          [style*="1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          [style*="repeat(4,1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
          [style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 420px) {
          [style*="repeat(4,1fr)"] { grid-template-columns: 1fr !important; }
        }
        .filter-pill:hover:not(.active) { border-color: var(--rust) !important; color: var(--rust) !important; }
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
