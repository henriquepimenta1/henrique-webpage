"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import SiteFooter from "@/components/site-footer";
import { PRESETS, PRESET_CATS, ACCORDION_ITEMS } from "@/content/presets";

const PRICE_VISTA  = "39,90";
const PRICE_PARCEL = "5,19";
const PRICE_N      = "9";
const CTA          = "https://pay.cakto.com.br/C4dmPFR";
const TOTAL_PRESETS = 45;

// ─── Countdown ───────────────────────────────────────────────────────────────
const COUNTDOWN_KEY  = "presets_cta_deadline";
const COUNTDOWN_MINS = 15;

function useCountdown() {
  const getOrSet = () => {
    if (typeof window === "undefined") return Date.now() + COUNTDOWN_MINS * 60_000;
    const s = sessionStorage.getItem(COUNTDOWN_KEY);
    if (s) return Number(s);
    const d = Date.now() + COUNTDOWN_MINS * 60_000;
    sessionStorage.setItem(COUNTDOWN_KEY, String(d));
    return d;
  };
  const [secs, setSecs] = useState(() => Math.max(0, Math.floor((getOrSet() - Date.now()) / 1000)));
  useEffect(() => {
    const deadline = getOrSet();
    const id = setInterval(() => {
      const r = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setSecs(r);
      if (r === 0) clearInterval(id);
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

// Banner compacto — 1 linha em qualquer tela
function CountdownBanner() {
  const { m, s, expired } = useCountdown();
  if (expired) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "var(--rust)", color: "var(--canvas)",
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 8, padding: "9px 12px",
      fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em",
      textTransform: "uppercase", flexWrap: "nowrap", overflow: "hidden",
    }}>
      <span style={{ whiteSpace: "nowrap", opacity: .85, fontSize: 10 }}>Oferta limitada</span>
      <span style={{
        fontWeight: 700, fontSize: 13, background: "rgba(0,0,0,.25)",
        padding: "1px 7px", borderRadius: 2, whiteSpace: "nowrap", flexShrink: 0,
      }}>{m}:{s}</span>
      <span style={{ whiteSpace: "nowrap", opacity: .9 }}>R$ {PRICE_VISTA}</span>
      <a href={CTA} target="_blank" rel="noopener noreferrer" style={{
        padding: "4px 12px", background: "var(--canvas)", color: "var(--rust)",
        fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700,
        letterSpacing: ".1em", textDecoration: "none", textTransform: "uppercase",
        whiteSpace: "nowrap", flexShrink: 0, marginLeft: 4,
      }}>Comprar →</a>
    </div>
  );
}

// ─── BeforeAfter ─────────────────────────────────────────────────────────────
function BeforeAfter({ presetKey, aspectRatio = "16/9", variant = "section" }: {
  presetKey: string;
  aspectRatio?: string;
  variant?: "hero" | "section" | "inline";
}) {
  const [pos, setPos] = useState(50);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);

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
    return () => { window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu); };
  }, [move]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onTS = (e: TouchEvent) => { startX.current = e.touches[0].clientX; dragging.current = false; };
    const onTM = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startX.current;
      if (!dragging.current && Math.abs(dx) > 8) dragging.current = true;
      if (dragging.current) { e.preventDefault(); move(e.touches[0].clientX); }
    };
    const onTE = () => { dragging.current = false; };
    el.addEventListener("touchstart", onTS, { passive: true });
    el.addEventListener("touchmove", onTM, { passive: false });
    el.addEventListener("touchend", onTE, { passive: true });
    return () => { el.removeEventListener("touchstart", onTS); el.removeEventListener("touchmove", onTM); el.removeEventListener("touchend", onTE); };
  }, [move]);

  const isInline = variant === "inline";
  const labelPad = isInline ? "2px 6px" : "5px 10px";
  const labelFs  = isInline ? 8 : 10;

  return (
    <div
      ref={wrap}
      onMouseDown={e => { dragging.current = true; move(e.clientX); }}
      onKeyDown={e => { if (e.key==="ArrowLeft") setPos(p=>Math.max(2,p-2)); if (e.key==="ArrowRight") setPos(p=>Math.min(98,p+2)); }}
      tabIndex={0} role="slider"
      aria-label="Comparar antes e depois"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
      style={{ position:"relative", width:"100%", aspectRatio, overflow:"hidden", cursor:"ew-resize", userSelect:"none", background:"var(--forest)", outline:"none", touchAction:"pan-y" }}
    >
      <img src={`/images/presets/${presetKey}.jpg`}  alt="Após preset" draggable={false} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
      <img src={`/images/presets/${presetKey}-before.jpg`} alt="RAW" draggable={false} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", clipPath:`inset(0 ${100-pos}% 0 0)` }} />

      <div style={{ position:"absolute", top:isInline?8:12, left:isInline?8:12, padding:labelPad, background:"rgba(42,33,26,.82)", color:"var(--canvas)", fontFamily:"var(--font-mono)", fontSize:labelFs, letterSpacing:".18em", textTransform:"uppercase" }}>RAW</div>
      <div style={{ position:"absolute", top:isInline?8:12, right:isInline?8:12, padding:labelPad, background:"var(--rust)", color:"var(--canvas)", fontFamily:"var(--font-mono)", fontSize:labelFs, letterSpacing:".18em", textTransform:"uppercase" }}>Tratado</div>

      <div style={{ position:"absolute", top:0, bottom:0, left:`${pos}%`, width:2, background:"var(--canvas)", transform:"translateX(-1px)", pointerEvents:"none", boxShadow:"0 0 12px rgba(0,0,0,.5)" }} />
      <div style={{ position:"absolute", top:"50%", left:`${pos}%`, width:isInline?32:40, height:isInline?32:40, borderRadius:"50%", background:"var(--canvas)", transform:"translate(-50%,-50%)", display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", color:"var(--bark)", fontFamily:"var(--font-mono)", fontSize:isInline?11:14, fontWeight:700, boxShadow:"0 4px 16px rgba(0,0,0,.4)" }}>⇄</div>

      {!isInline && (
        <div style={{ position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", padding:"4px 10px", background:"rgba(42,33,26,.72)", color:"var(--canvas)", fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".16em", textTransform:"uppercase", opacity:.85, pointerEvents:"none", whiteSpace:"nowrap" }}>Arraste ←→</div>
      )}
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name:"Mariana C.", handle:"@mariana.foto",    text:"Apliquei no meu portfólio inteiro em uma tarde. A consistência entre as fotos é impressionante.", location:"São Paulo, SP" },
  { name:"Rafael T.",  handle:"@rafa_outdoor",    text:"Tentei vários presets gratuitos. Nenhum funcionava em RAW de montanha. Esse funciona direto.", location:"Curitiba, PR" },
  { name:"Camila M.",  handle:"@camila.aventura", text:"Em 10 minutos tava rodando no Lightroom Mobile. Recomendo demais.", location:"Rio de Janeiro, RJ" },
  { name:"Pedro L.",   handle:"@pedroluiz.film",  text:"A paleta verde é exatamente o que eu procurava pra fotos de mata. Fiquei chocado.", location:"Florianópolis, SC" },
  { name:"Juliana B.", handle:"@ju.trail",        text:"Uso em trabalhos pagos com licença comercial incluída. Vale cada centavo.", location:"Belo Horizonte, MG" },
];

function TestimonialsSlider() {
  const [idx, setIdx] = useState(0);
  const total = TESTIMONIALS.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDrag = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i+1)%total), 5000);
    return () => clearInterval(id);
  }, [total]);

  const onTM = useCallback((e: TouchEvent) => {
    const dx = e.touches[0].clientX - startX.current;
    if (!isDrag.current && Math.abs(dx) > 8) isDrag.current = true;
    if (isDrag.current) e.preventDefault();
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("touchmove", onTM, { passive: false });
    return () => el.removeEventListener("touchmove", onTM);
  }, [onTM]);

  return (
    <div>
      <div ref={trackRef} style={{ overflow:"hidden", touchAction:"pan-y" }}
        onTouchStart={e => { startX.current = e.touches[0].clientX; isDrag.current = false; }}
        onTouchEnd={e => { const dx = e.changedTouches[0].clientX - startX.current; isDrag.current = false; if (dx < -40) setIdx(i=>(i+1)%total); if (dx > 40) setIdx(i=>(i-1+total)%total); }}>
        <div style={{ display:"flex", transform:`translateX(-${idx*100}%)`, transition:"transform .5s cubic-bezier(.4,0,.2,1)", willChange:"transform" }}>
          {TESTIMONIALS.map((t,i) => (
            <div key={i} style={{ minWidth:"100%", padding:"24px 20px", boxSizing:"border-box", background:"var(--canvas)", border:"1px solid var(--line)", display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ color:"#D4A64A", fontSize:14 }}>★★★★★</div>
              <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"clamp(14px,4vw,17px)", lineHeight:1.65, color:"var(--bark)", margin:0 }}>"{t.text}"</p>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:"var(--canvas-deep)", border:"1px solid var(--line)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-ui)", fontWeight:700, fontSize:13, color:"var(--moss)", flexShrink:0 }}>{t.name[0]}</div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:"var(--font-ui)", fontWeight:600, fontSize:13, color:"var(--bark)" }}>{t.name}</div>
                  {/* handle e location separados em linhas para não truncar */}
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".1em", color:"var(--stone)", marginTop:1 }}>{t.handle}</div>
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".1em", color:"var(--stone)", opacity:.7 }}>{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:10, padding:"0 2px" }}>
        <div style={{ display:"flex", gap:6 }}>
          {TESTIMONIALS.map((_,i) => <button key={i} onClick={() => setIdx(i)} aria-label={`Depoimento ${i+1}`} style={{ width:i===idx?20:7, height:7, borderRadius:4, border:"none", cursor:"pointer", background:i===idx?"var(--rust)":"var(--line)", transition:"width .3s,background .3s", padding:0 }} />)}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {(["←","→"] as const).map((arrow,di) => (
            <button key={arrow} onClick={() => setIdx(i=>(i+(di===0?-1:1)+total)%total)} style={{ width:34, height:34, border:"1px solid var(--line)", background:"transparent", cursor:"pointer", fontFamily:"var(--font-mono)", fontSize:14, color:"var(--bark)", display:"flex", alignItems:"center", justifyContent:"center" }}>{arrow}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ items }: { items: { title: string; body: string }[] }) {
  const [open, setOpen] = useState<number|null>(0);
  return (
    <div style={{ borderTop:"1px solid var(--line)" }}>
      {items.map((item,i) => (
        <div key={i} style={{ borderBottom:"1px solid var(--line)" }}>
          <button onClick={() => setOpen(open===i?null:i)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", background:"none", border:"none", cursor:"pointer", textAlign:"left", gap:12 }}>
            <span style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(13px,3.5vw,15px)", fontWeight:600, color:"var(--bark)", flex:1, lineHeight:1.4 }}>{item.title}</span>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:20, color:"var(--rust)", transform:open===i?"rotate(45deg)":"none", transition:"transform .25s", display:"block", lineHeight:1, flexShrink:0 }}>+</span>
          </button>
          {open===i && <div style={{ paddingBottom:16, fontFamily:"var(--font-serif)", fontSize:"clamp(13px,3.5vw,14px)", lineHeight:1.7, color:"#3A3530", whiteSpace:"pre-line" }}>{item.body}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── Garantia ─────────────────────────────────────────────────────────────────
function GuaranteeBadge() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", border:"1px solid var(--moss)", background:"rgba(74,88,56,.06)" }}>
      <div style={{ width:34, height:34, borderRadius:"50%", border:"2px solid var(--moss)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:15 }}>✓</div>
      <div>
        <div style={{ fontFamily:"var(--font-ui)", fontWeight:700, fontSize:13, color:"var(--bark)", marginBottom:1 }}>Garantia de 14 dias</div>
        <div style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".1em", color:"var(--stone)", textTransform:"uppercase" }}>Sem perguntas · Devolução total</div>
      </div>
    </div>
  );
}

// ─── CTA Button — corrigido para não estourar ─────────────────────────────────
// Problema: botão com texto longo "COMPRAR POR R$ 39,90 →" em container estreito
// Solução: texto mais curto em mobile via CSS, box-sizing border-box garantido
function CTAButton({ size = "md" }: { size?: "sm"|"md"|"lg" }) {
  const py = size === "lg" ? "20px" : size === "sm" ? "13px" : "17px";
  const fs = size === "lg" ? "13px" : "12px";
  return (
    <a href={CTA} target="_blank" rel="noopener noreferrer"
      className="cta-btn-wrap"
      style={{ display:"flex", flexDirection:"column", alignItems:"stretch", gap:5, textDecoration:"none", width:"100%", boxSizing:"border-box" }}>
      <span className="cta-btn-inner" style={{
        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        padding:`${py} 16px`,
        background:"var(--rust-soft)", color:"var(--forest)",
        fontFamily:"var(--font-ui)", fontSize:fs, fontWeight:700,
        letterSpacing:".14em", textTransform:"uppercase",
        width:"100%", boxSizing:"border-box",
        // NUNCA deixa o span crescer além do pai
        minWidth:0, overflow:"hidden",
      }}>
        <span style={{ whiteSpace:"nowrap" }}>Comprar</span>
        <span style={{ fontFamily:"var(--font-mono)", fontWeight:700, fontSize:"1.05em", whiteSpace:"nowrap" }}>R$ {PRICE_VISTA}</span>
        <span style={{ fontSize:"1.1em", flexShrink:0 }}>→</span>
      </span>
      <span style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".1em", color:"var(--stone)", textTransform:"uppercase", textAlign:"center", display:"block" }}>
        ou {PRICE_N}× de R$ {PRICE_PARCEL} · Download imediato
      </span>
    </a>
  );
}

// ─── VS Table — sem min-width fixo ────────────────────────────────────────────
function VsTable() {
  const rows = [
    "Consistência entre fotos",
    "Feito para natureza",
    "Funciona em RAW",
    "Licença comercial",
    "Suporte do autor",
  ];
  const cell = (children: React.ReactNode, extraStyle?: React.CSSProperties) => (
    <div style={{ padding:"11px 10px", borderTop:"1px solid var(--line)", display:"flex", alignItems:"center", justifyContent:"center", ...extraStyle }}>{children}</div>
  );
  return (
    // Wrapper com overflow-x: auto para scroll se necessário em telas muito estreitas
    <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" as any }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto auto", background:"var(--canvas)", border:"1px solid var(--line)", minWidth:260 }}>
        {/* Header */}
        <div style={{ padding:"11px 10px" }} />
        <div style={{ padding:"11px 10px", borderLeft:"1px solid var(--line)", fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".16em", textTransform:"uppercase", color:"var(--stone)", textAlign:"center", whiteSpace:"nowrap" }}>Grátis</div>
        <div style={{ padding:"11px 10px", background:"var(--forest)", color:"var(--rust-soft)", fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".16em", textTransform:"uppercase", textAlign:"center", whiteSpace:"nowrap" }}>Outdoor C.</div>

        {rows.map(row => (
          <>
            {cell(<span style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(11px,3vw,13px)", color:"var(--bark)", lineHeight:1.3 }}>{row}</span>, { justifyContent:"flex-start" })}
            {cell(<span style={{ fontFamily:"var(--font-mono)", fontSize:15, color:"#B05744" }}>×</span>, { borderLeft:"1px solid var(--line)" })}
            {cell(<span style={{ fontFamily:"var(--font-mono)", fontSize:15, color:"var(--rust-soft)", fontWeight:700 }}>✓</span>, { background:"var(--forest)" })}
          </>
        ))}
      </div>
    </div>
  );
}

// ─── Preset List — accordion com expand inline ────────────────────────────────
const CAT_COLORS: Record<string,string> = {
  "Tom Verde":"#7EC47E", "Tom Azul":"#6FA3D8", "Tom Laranja":"#D8924A", "Aesthetic":"#C8905A",
};

function PresetList({ onLoadInHero }: { onLoadInHero: (key: string) => void }) {
  const [openKey, setOpenKey] = useState<string|null>(null);

  const grouped = PRESET_CATS.map(cat => ({
    cat,
    items: PRESETS.filter(p => p.cat === cat.label),
  }));

  return (
    <div>
      {grouped.map(({ cat, items }) => (
        <div key={cat.id}>
          {/* Label da categoria */}
          <div style={{ padding:"8px 0 6px", display:"flex", alignItems:"center", gap:8, borderBottom:"2px solid var(--line)", marginTop:4 }}>
            <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:CAT_COLORS[cat.label] ?? "var(--rust)", flexShrink:0 }} />
            <span style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".2em", textTransform:"uppercase", color:"var(--stone)" }}>{cat.label} · {items.length}</span>
          </div>

          {items.map(preset => {
            const isOpen = openKey === preset.key;
            const shortName = preset.name.split(" — ")[1] ?? preset.name;
            return (
              <div key={preset.key}>
                <button
                  onClick={() => setOpenKey(isOpen ? null : preset.key)}
                  style={{
                    width:"100%", display:"grid",
                    gridTemplateColumns:"44px 1fr 28px",
                    alignItems:"center", gap:10,
                    padding:"11px 0",
                    background: isOpen ? "rgba(166,84,43,.05)" : "transparent",
                    border:"none", borderBottom:"1px solid var(--line)",
                    cursor:"pointer", textAlign:"left", boxSizing:"border-box",
                  }}
                >
                  {/* Thumb */}
                  <div style={{ width:44, height:44, overflow:"hidden", borderRadius:2, border:isOpen?"2px solid var(--rust)":"1px solid var(--line)", flexShrink:0, transition:"border-color .2s" }}>
                    <img src={`/images/presets/${preset.key}.jpg`} alt={shortName}
                      style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transform:isOpen?"scale(1.08)":"scale(1)", transition:"transform .4s" }} />
                  </div>

                  {/* Nome — sem ellipsis, deixa quebrar em 2 linhas se precisar */}
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontFamily:"var(--font-ui)", fontWeight:600, fontSize:"clamp(12px,3vw,14px)", color:"var(--bark)", lineHeight:1.25, marginBottom:2 }}>{shortName}</div>
                    {/* Descrição curta — máx 40 chars para caber */}
                    <div style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"clamp(10px,2.5vw,12px)", color:"var(--stone)", lineHeight:1.3 }}>
                      {preset.desc.length > 42 ? preset.desc.slice(0, 42) + "…" : preset.desc}
                    </div>
                  </div>

                  {/* Botão expand */}
                  <div style={{ width:26, height:26, border:`1px solid ${isOpen?"var(--rust)":"var(--line)"}`, background:isOpen?"var(--rust)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:2, flexShrink:0, transition:"background .2s, border-color .2s" }}>
                    <span style={{ fontFamily:"var(--font-mono)", fontSize:14, color:isOpen?"var(--canvas)":"var(--stone)", transform:isOpen?"rotate(45deg)":"none", transition:"transform .25s, color .2s", display:"block", lineHeight:1 }}>+</span>
                  </div>
                </button>

                {/* Expand — before/after compacto */}
                {isOpen && (
                  <div style={{ padding:"12px 0 16px", borderBottom:"1px solid var(--line)", background:"rgba(166,84,43,.03)" }}>
                    <BeforeAfter presetKey={preset.key} aspectRatio="16/9" variant="inline" />
                    <button
                      onClick={() => onLoadInHero(preset.key)}
                      style={{ marginTop:10, padding:"7px 14px", border:"1px solid var(--stone)", background:"transparent", fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".16em", textTransform:"uppercase", color:"var(--stone)", cursor:"pointer", display:"block" }}
                    >
                      Ver no comparador hero ↑
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function PresetsPage() {
  const [activeKey, setActiveKey] = useState("21-campo-seco");
  const heroRef = useRef<HTMLDivElement>(null);
  const activePreset = PRESETS.find(p => p.key === activeKey);

  const handleLoadInHero = useCallback((key: string) => {
    setActiveKey(key);
    setTimeout(() => heroRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 50);
  }, []);

  const FAQ = [
    ...ACCORDION_ITEMS,
    { title:"Funciona no celular?",               body:"Sim. Os arquivos .dng instalam no Lightroom Mobile (iOS e Android)." },
    { title:"E se eu não gostar?",                body:"Garantia de 14 dias. Escreve pra contato@euhenriq.com e devolvo 100%." },
    { title:"Recebo atualizações futuras?",        body:"Sim. Todo pack novo vai pra você por email automaticamente, sem custo." },
    { title:"Funciona no Camera Raw / Photoshop?", body:"Sim. Os arquivos .xmp são compatíveis com Camera Raw e Photoshop." },
  ];

  return (
    <div className="presets-lp" style={{ background:"var(--canvas)", color:"var(--bark)", fontFamily:"var(--font-ui)", overflowX:"hidden", maxWidth:"100vw" }}>
      <CountdownBanner />

      {/* Nav */}
      <div style={{ paddingTop:40, boxSizing:"border-box" }}>
        <header style={{ height:56, display:"flex", alignItems:"center", padding:"0 clamp(16px,5vw,40px)", background:"transparent", borderBottom:"1px solid rgba(42,33,26,.1)", boxSizing:"border-box" }}>
          <a href="/" style={{ textDecoration:"none" }}>
            <span style={{ fontFamily:"var(--font-hand)", fontSize:24, color:"var(--bark)", letterSpacing:".02em", lineHeight:1 }}>Eu Henriq</span>
          </a>
        </header>
      </div>

      {/* ══ 1. HERO ══ */}
      <section ref={heroRef} style={{ background:"var(--forest)", color:"var(--canvas)", boxSizing:"border-box", width:"100%" }}>
        {/* Mobile: slider em cima, painel de compra embaixo */}
        <div className="hero-grid" style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr" }}>

          <div style={{ position:"relative", minWidth:0 }}>
            <BeforeAfter presetKey={activeKey} aspectRatio="4/3" variant="hero" />
            {activePreset && (
              <div style={{ position:"absolute", bottom:12, left:12, padding:"4px 8px", background:"rgba(14,12,10,.8)", fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".14em", textTransform:"uppercase", color:"rgba(232,223,201,.85)" }}>
                {activePreset.name.split(" — ")[1] ?? activePreset.name}
              </div>
            )}
          </div>

          <div className="hero-panel" style={{ padding:"clamp(16px,3vw,40px) clamp(14px,3vw,32px)", display:"flex", flexDirection:"column", justifyContent:"space-between", gap:20, minWidth:0, boxSizing:"border-box" }}>
            <div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(7px,1.5vw,9px)", letterSpacing:".18em", textTransform:"uppercase", color:"rgba(232,223,201,.4)", marginBottom:10 }}>Outdoor Cinematic · Lightroom</div>
              <h1 style={{ fontFamily:"var(--font-ui)", fontWeight:700, fontSize:"clamp(20px,3.5vw,52px)", letterSpacing:"-.03em", lineHeight:.95, margin:"0 0 10px" }}>
                {TOTAL_PRESETS} presets<br />
                <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:400, color:"var(--rust-soft)", fontSize:".85em" }}>4 anos em campo</span>
              </h1>
              <p style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(11px,1.5vw,14px)", lineHeight:1.55, color:"rgba(232,223,201,.65)", margin:"0 0 14px" }}>
                A cor do meu portfólio, no seu Lightroom.
              </p>
              {/* Specs em 2 cols — clamp agressivo para mobile */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, paddingTop:10, borderTop:"1px solid rgba(232,223,201,.1)" }}>
                {[{ k:"Formato", v:".xmp+.dng" },{ k:"Presets", v:"45 · 2 packs" },{ k:"App", v:"LR Classic+Mobile" },{ k:"Acesso", v:"Vitalício" }].map(s => (
                  <div key={s.k}>
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(6px,1.2vw,8px)", letterSpacing:".16em", textTransform:"uppercase", color:"rgba(232,223,201,.3)", marginBottom:1 }}>{s.k}</div>
                    <div style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(9px,1.5vw,13px)", fontWeight:600 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preço + CTA */}
            <div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(6px,1.2vw,8px)", letterSpacing:".14em", textTransform:"uppercase", color:"rgba(232,223,201,.3)", marginBottom:3 }}>De R$ 79 por</div>
              <div style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(24px,4vw,56px)", fontWeight:700, letterSpacing:"-.03em", lineHeight:.9, marginBottom:12 }}>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(10px,1.5vw,14px)", color:"rgba(232,223,201,.4)", fontWeight:400 }}>R$ </span>
                {PRICE_VISTA}
              </div>
              {/* CTA — totalmente dentro do pai, sem overflow */}
              <CTAButton size="md" />
              <div style={{ marginTop:8, fontFamily:"var(--font-mono)", fontSize:"clamp(6px,1.2vw,9px)", letterSpacing:".1em", color:"rgba(232,223,201,.25)", textTransform:"uppercase" }}>✓ Garantia 14 dias</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. CREDIBILIDADE ══ */}
      <section style={{ borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)", display:"grid", gridTemplateColumns:"repeat(4,1fr)", background:"var(--canvas)", width:"100%", boxSizing:"border-box" }}>
        {[{ v:"4 anos", k:"em campo" },{ v:"45", k:"presets" },{ v:"LR", k:"Classic · CC · Mobile" },{ v:"14d", k:"garantia" }].map((s,i) => (
          <div key={i} style={{ padding:"14px 6px", borderLeft:i===0?"none":"1px solid var(--line)", textAlign:"center" }}>
            <div style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(13px,3.5vw,20px)", fontWeight:700, letterSpacing:"-.01em", color:"var(--bark)", marginBottom:2 }}>{s.v}</div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(6px,1.8vw,9px)", letterSpacing:".1em", textTransform:"uppercase", color:"var(--stone)", lineHeight:1.2 }}>{s.k}</div>
          </div>
        ))}
      </section>

      {/* ══ 3. DEPOIMENTOS ══ */}
      <section style={{ padding:"clamp(40px,6vw,72px) clamp(16px,5vw,48px)", background:"var(--canvas-deep)", borderBottom:"1px solid var(--line)", boxSizing:"border-box", width:"100%" }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontFamily:"var(--font-hand)", fontSize:20, color:"var(--rust)", transform:"rotate(-1.5deg)", display:"inline-block", marginBottom:4 }}>quem já usa—</div>
            <h2 style={{ fontFamily:"var(--font-ui)", fontWeight:600, fontSize:"clamp(22px,5vw,38px)", letterSpacing:"-.02em", lineHeight:1, margin:0, color:"var(--bark)" }}>
              O que estão <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:400, color:"var(--moss)" }}>dizendo</span>.
            </h2>
          </div>
          <TestimonialsSlider />
        </div>
      </section>

      {/* ══ 4. INCLUSO ══ */}
      <section style={{ padding:"clamp(40px,6vw,72px) clamp(16px,5vw,48px)", background:"var(--canvas)", borderBottom:"1px solid var(--line)", boxSizing:"border-box", width:"100%" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(22px,4vw,44px)", fontWeight:600, letterSpacing:"-.02em", lineHeight:1, marginBottom:28, marginTop:0, color:"var(--bark)" }}>
            O que vem na <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:400, color:"var(--moss)" }}>mochila</span>.
          </h2>
          <div className="includes-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"clamp(16px,3vw,28px)" }}>
            {[
              { n:"01", t:"45 presets Lightroom",    d:"Arquivos .xmp para Classic, CC, Mobile e Camera Raw. Dois packs: 18 + 27." },
              { n:"02", t:"Perfis .dng",             d:"Perfis de cor — mais estáveis, não bagunçam seus sliders." },
              { n:"03", t:"Guia de instalação",      d:"PDF passo a passo para cada versão do Lightroom." },
              { n:"04", t:"Videoaula",               d:"Como escolher o preset certo e fazer ajustes finos." },
              { n:"05", t:"Licença comercial",       d:"Use em trabalhos pagos e clientes. Sem pegadinha." },
              { n:"06", t:"Atualizações vitalícias", d:"Todo pack novo vai pra você automaticamente." },
            ].map(it => (
              <div key={it.n} style={{ borderTop:"1px solid var(--line)", paddingTop:14 }}>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".18em", color:"var(--rust)", marginBottom:5 }}>№ {it.n}</div>
                <div style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(13px,2.5vw,18px)", fontWeight:600, marginBottom:4, color:"var(--bark)", lineHeight:1.2 }}>{it.t}</div>
                <div style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(11px,1.8vw,13px)", lineHeight:1.55, color:"#3A3530" }}>{it.d}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:32, paddingTop:24, borderTop:"1px solid var(--line)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14, boxSizing:"border-box" }}>
            <GuaranteeBadge />
            <div style={{ width:"100%", maxWidth:300 }}><CTAButton size="md" /></div>
          </div>
        </div>
      </section>

      {/* ══ 5. DEMO NÉVOA SUAVE ══ */}
      <section style={{ padding:"clamp(40px,6vw,72px) clamp(16px,5vw,48px)", background:"var(--forest)", color:"var(--canvas)", borderBottom:"1px solid rgba(232,223,201,.1)", boxSizing:"border-box", width:"100%" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontFamily:"var(--font-hand)", fontSize:18, color:"var(--rust-soft)", transform:"rotate(-1.5deg)", display:"inline-block", marginBottom:4 }}>veja de verdade—</div>
            <h2 style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(20px,4vw,44px)", fontWeight:600, letterSpacing:"-.02em", lineHeight:1, margin:0 }}>
              Névoa Suave — <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:400, color:"var(--rust-soft)" }}>RAW ao tratado</span>.
            </h2>
            <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"clamp(12px,2vw,15px)", color:"rgba(232,223,201,.7)", marginTop:8, lineHeight:1.5 }}>
              Pontos de branco, shadows e HSL calibrados. Sem ajuste extra.
            </p>
          </div>
          <BeforeAfter presetKey="17-nevoa-suave" aspectRatio="16/9" variant="section" />
        </div>
      </section>

      {/* ══ 6. DEMO CINEMÁTICO ══ */}
      <section style={{ padding:"clamp(40px,6vw,72px) clamp(16px,5vw,48px)", background:"var(--canvas)", borderBottom:"1px solid var(--line)", boxSizing:"border-box", width:"100%" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".2em", textTransform:"uppercase", color:"var(--stone)", marginBottom:8 }}>Aesthetic Pack</div>
            <h2 style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(20px,4vw,44px)", fontWeight:600, letterSpacing:"-.02em", lineHeight:1, margin:0, color:"var(--bark)" }}>
              Cinemático — <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:400, color:"var(--rust)" }}>RAW ao tratado</span>.
            </h2>
            <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"clamp(12px,2vw,15px)", color:"#3A3530", marginTop:8, lineHeight:1.5 }}>
              Contraste alto, paleta neutra — funciona em qualquer luz de campo.
            </p>
          </div>
          {/* portrait para não cortar sujeito vertical */}
          <div style={{ maxWidth:520 }}>
            <BeforeAfter presetKey="8-cinematico" aspectRatio="3/4" variant="section" />
          </div>
        </div>
      </section>

      {/* ══ 7. VS GRÁTIS ══ */}
      <section style={{ padding:"clamp(40px,6vw,72px) clamp(16px,5vw,48px)", background:"var(--canvas-deep)", borderBottom:"1px solid var(--line)", boxSizing:"border-box", width:"100%" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(18px,3.5vw,36px)", fontWeight:600, letterSpacing:"-.02em", lineHeight:1.1, marginBottom:24, marginTop:0, color:"var(--bark)" }}>
            Por que não usar um <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:400, color:"var(--moss)" }}>preset grátis</span>?
          </h2>
          <VsTable />
        </div>
      </section>

      {/* ══ 8. COLEÇÃO — LISTA ACCORDION ══ */}
      <section style={{ padding:"clamp(40px,6vw,72px) clamp(16px,5vw,48px)", background:"var(--canvas)", borderBottom:"1px solid var(--line)", boxSizing:"border-box", width:"100%" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"var(--font-ui)", fontWeight:600, fontSize:"clamp(22px,4vw,40px)", letterSpacing:"-.02em", lineHeight:1, margin:"0 0 6px", color:"var(--bark)" }}>
            A coleção <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:400, color:"var(--moss)" }}>completa</span>.
          </h2>
          <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"clamp(12px,2vw,14px)", color:"var(--stone)", margin:"0 0 24px", lineHeight:1.5 }}>
            Toque num preset para ver o antes e depois.
          </p>
          <PresetList onLoadInHero={handleLoadInHero} />
          <div style={{ marginTop:28 }}><CTAButton size="md" /></div>
        </div>
      </section>

      {/* ══ 9. FAQ ══ */}
      <section style={{ padding:"clamp(40px,6vw,72px) clamp(16px,5vw,48px)", background:"var(--canvas-deep)", boxSizing:"border-box", width:"100%" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <div className="faq-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:48, alignItems:"start" }}>
            <div>
              <h2 style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(20px,3.5vw,36px)", fontWeight:600, letterSpacing:"-.02em", lineHeight:1, margin:0, color:"var(--bark)" }}>
                Tudo que você <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:400, color:"var(--moss)" }}>precisa saber</span>.
              </h2>
              <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"clamp(12px,2vw,14px)", color:"#3A3530", marginTop:12, lineHeight:1.55 }}>
                Dúvida? <a href="mailto:contato@euhenriq.com" style={{ color:"var(--rust)" }}>contato@euhenriq.com</a>
              </p>
              <div style={{ marginTop:20 }}><GuaranteeBadge /></div>
            </div>
            <Accordion items={FAQ} />
          </div>
        </div>
      </section>

      {/* ══ 10. CTA FINAL ══ */}
      <section style={{ padding:"clamp(48px,8vw,80px) clamp(16px,5vw,48px)", background:"var(--forest)", boxSizing:"border-box", width:"100%" }}>
        <div className="cta-final-grid" style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
          <div>
            <h2 style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(32px,6vw,64px)", fontWeight:700, letterSpacing:"-.03em", lineHeight:.92, margin:0, color:"var(--canvas)" }}>
              Pronto pra<br />dar <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:400, color:"var(--rust-soft)" }}>cor</span><br />às suas fotos?
            </h2>
            <p style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(13px,2vw,16px)", color:"rgba(232,223,201,.65)", marginTop:16, lineHeight:1.5 }}>
              Download imediato. Acesso vitalício. Garantia de 14 dias.
            </p>
          </div>

          <div style={{ background:"var(--canvas)", padding:"clamp(18px,4vw,28px)", border:"1px solid rgba(232,223,201,.15)", boxSizing:"border-box" }}>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".18em", textTransform:"uppercase", color:"var(--stone)", marginBottom:5 }}>Outdoor Cinematic Presets</div>
            <div style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(36px,5vw,56px)", fontWeight:700, letterSpacing:"-.03em", color:"var(--bark)", lineHeight:1, marginBottom:3 }}>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(12px,2vw,16px)", color:"var(--stone)", fontWeight:400 }}>R$ </span>{PRICE_VISTA}
            </div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".1em", textTransform:"uppercase", color:"var(--stone)", marginBottom:14 }}>acesso vitalício · download imediato</div>
            <div style={{ borderTop:"1px solid var(--line)", paddingTop:12, marginBottom:14 }}>
              {["45 presets .xmp + .dng","2 packs: 18 + 27","Guia PDF + videoaula","Licença pessoal e comercial","Atualizações vitalícias","Suporte por email"].map(item => (
                <div key={item} style={{ display:"flex", gap:8, padding:"5px 0", fontFamily:"var(--font-serif)", fontSize:"clamp(11px,1.8vw,13px)", color:"#3A3530" }}>
                  <span style={{ color:"var(--moss)", fontWeight:700, flexShrink:0 }}>✓</span><span>{item}</span>
                </div>
              ))}
            </div>
            <CTAButton size="md" />
            <div style={{ marginTop:10 }}><GuaranteeBadge /></div>
          </div>
        </div>
      </section>

      <SiteFooter dark={false} />

      <style>{`
        /* ── Reset global de overflow ── */
        *, *::before, *::after { box-sizing: border-box; }
        .presets-lp { overflow-x: hidden; max-width: 100vw; }

        /* ── Hover só em desktop com pointer fino ── */
        @media (hover: hover) and (pointer: fine) {
          .cta-btn-inner:hover { background: var(--rust) !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }

        /* ── Tablet 900px ── */
        @media (max-width: 900px) {
          .hero-grid        { grid-template-columns: 1fr !important; }
          .hero-panel       { padding: 20px 20px 24px !important; }
          .includes-grid    { grid-template-columns: repeat(2,1fr) !important; }
          .faq-grid         { grid-template-columns: 1fr !important; gap: 28px !important; }
          .cta-final-grid   { grid-template-columns: 1fr !important; gap: 28px !important; }
        }

        /* ── Mobile 600px ── */
        @media (max-width: 600px) {
          /* CTA final: card de compra PRIMEIRO (column-reverse) */
          .cta-final-grid { display: flex !important; flex-direction: column-reverse !important; gap: 24px !important; }
          .includes-grid  { grid-template-columns: 1fr !important; }
          /* Credibility já é 4 cols com clamp — mantém */
        }
      `}</style>
    </div>
  );
}
