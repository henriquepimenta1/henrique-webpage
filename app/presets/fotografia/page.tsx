"use client";

// Presets Fotografia LP — v2 mobile-premium
// Portado do design (Claude artifact) para Next.js / TSX.
import {
  useState,
  useRef,
  useEffect,
  useMemo,
  Fragment,
  type CSSProperties,
} from "react";
import SiteFooter from "@/components/site-footer";

const PRICE_VISTA = "39,90";
const PRICE_PARCEL = "5,19";
const PRICE_N = "9";
const CTA_URL = "https://pay.cakto.com.br/C4dmPFR";
const TOTAL_PRESETS = 45;

// Helper: monta path das imagens reais do preset
const presetImg = (k: string) => `/images/presets/${k}.jpg`;
const presetImgRAW = (k: string) => `/images/presets/${k}-before.jpg`;

const CAT_COLORS: Record<string, string> = {
  "Tom Verde": "#7EC47E",
  "Tom Azul": "#6FA3D8",
  "Tom Laranja": "#D8924A",
  Aesthetic: "#C8905A",
};

interface PresetCat {
  id: string;
  label: string;
  count: number;
}
const PRESET_CATS: PresetCat[] = [
  { id: "verde", label: "Tom Verde", count: 8 },
  { id: "azul", label: "Tom Azul", count: 13 },
  { id: "laranja", label: "Tom Laranja", count: 6 },
  { id: "aesthetic", label: "Aesthetic", count: 18 },
];

interface Preset {
  key: string;
  cat: string;
  name: string;
  desc: string;
}
const PRESETS: Preset[] = [
  // Tom Verde — 8
  { key: "1-antigo", cat: "Tom Verde", name: "Antigo", desc: "Tons de terra com verde desaturado e contraste suave." },
  { key: "2-bosque", cat: "Tom Verde", name: "Bosque", desc: "Verdes profundos, sombras frias, midtones naturais." },
  { key: "3-refugio-na-selva", cat: "Tom Verde", name: "Refúgio na Selva", desc: "Selva densa, contraste elevado, verdes saturados." },
  { key: "4-pradaria", cat: "Tom Verde", name: "Pradaria", desc: "Pradaria aberta, céu claro, verdes suaves." },
  { key: "5-classico-antigo", cat: "Tom Verde", name: "Clássico Antigo", desc: "Look vintage com esverdeados faded e highlights quentes." },
  { key: "6-dourado-reluzente", cat: "Tom Verde", name: "Dourado Reluzente", desc: "Verde-dourado luminoso para horas mágicas." },
  { key: "7-intenso", cat: "Tom Verde", name: "Intenso", desc: "Verdes vivos com blacks esmagados e drama alto." },
  { key: "8-abissal", cat: "Tom Verde", name: "Abissal", desc: "Floresta profunda quase sem luz, atmosfera densa." },
  // Tom Azul — 13
  { key: "9-harmonia-verde-azul", cat: "Tom Azul", name: "Harmonia Verde-azul", desc: "Equilíbrio entre verdes e azuis oceânicos." },
  { key: "10-frionoturno", cat: "Tom Azul", name: "Frio Noturno", desc: "Azuis frios noturnos com sombras profundas." },
  { key: "11-devaneio", cat: "Tom Azul", name: "Devaneio", desc: "Tons oníricos entre azul e lavanda." },
  { key: "12-ilha-solitaria", cat: "Tom Azul", name: "Ilha Solitária", desc: "Azul oceano isolado com horizonte limpo." },
  { key: "13-luz-do-dia", cat: "Tom Azul", name: "Luz do Dia", desc: "Azul claro diurno com highlights brancos." },
  { key: "14-vista-do-oceano", cat: "Tom Azul", name: "Vista do Oceano", desc: "Profundidade oceânica com azuis saturados." },
  { key: "15-evaporacao", cat: "Tom Azul", name: "Evaporação", desc: "Brumas azuladas suaves sobre água parada." },
  { key: "16-pastelado", cat: "Tom Azul", name: "Pastelado", desc: "Paleta pastel com azuis lavados." },
  { key: "17-nevoa-suave", cat: "Tom Azul", name: "Névoa Suave", desc: "Névoa matinal clara com azuis esmaecidos." },
  { key: "18-nevoa-esmaecida", cat: "Tom Azul", name: "Névoa Esmaecida", desc: "Névoa densa com tons frios." },
  { key: "19-oceano", cat: "Tom Azul", name: "Oceano", desc: "Oceano profundo com azuis intensos." },
  { key: "19-praia-azul", cat: "Tom Azul", name: "Praia Azul", desc: "Praia tropical com turquesa e areia clara." },
  { key: "20-atlantico-tropical", cat: "Tom Azul", name: "Atlântico Tropical", desc: "Tropical saturado com contraste de azul e branco." },
  // Tom Laranja — 5 (com files no repo)
  { key: "21-campo-seco", cat: "Tom Laranja", name: "Campo Seco", desc: "Terra seca, laranja queimado, sombras quentes." },
  { key: "22-amarelo-e-turquesa", cat: "Tom Laranja", name: "Amarelo e Turquesa", desc: "Contraste vibrante entre amarelo e turquesa." },
  { key: "22-poente", cat: "Tom Laranja", name: "Poente", desc: "Pôr do sol intenso com laranja saturado." },
  { key: "23-plantacoes", cat: "Tom Laranja", name: "Plantações", desc: "Campos dourados com luz de tarde quente." },
  { key: "24-orla", cat: "Tom Laranja", name: "Orla", desc: "Linha de costa com laranjas e areia dourada." },
  // Aesthetic — 18
  { key: "1-explorador", cat: "Aesthetic", name: "Explorador", desc: "Look de explorador com tons naturais." },
  { key: "2-verdesuave", cat: "Aesthetic", name: "Verde Suave", desc: "Verde delicado com frescura e calma." },
  { key: "3-caminhante", cat: "Aesthetic", name: "Caminhante", desc: "Tons de trilha com terra e musgo." },
  { key: "4-gelado", cat: "Aesthetic", name: "Gelado", desc: "Frio ártico com azuis pálidos." },
  { key: "5-contador-de-historias", cat: "Aesthetic", name: "Contador de Histórias", desc: "Warm filmic com granulado e peso narrativo." },
  { key: "6-campo-aberto", cat: "Aesthetic", name: "Campo Aberto", desc: "Amplitude e luz aberta com tons dourados." },
  { key: "7-liberdade", cat: "Aesthetic", name: "Liberdade", desc: "Céu aberto, horizonte largo, luz limpa." },
  { key: "8-cinematico", cat: "Aesthetic", name: "Cinemático", desc: "Drama clássico, contraste alto, paleta neutra." },
  { key: "9-verde-desbotado", cat: "Aesthetic", name: "Verde Desbotado", desc: "Verde esmaecido com sensação analógica." },
  { key: "10-suavidade", cat: "Aesthetic", name: "Suavidade", desc: "Paleta suave com altas luzes leves." },
  { key: "11-intermediario", cat: "Aesthetic", name: "Intermediário", desc: "Equilíbrio entre quente e frio, versátil." },
  { key: "12-sonhos", cat: "Aesthetic", name: "Sonhos", desc: "Atmosfera etérea com highlights queimados." },
  { key: "13-nostalgia", cat: "Aesthetic", name: "Nostalgia", desc: "Filme analógico com warmth e grão sutil." },
  { key: "14-montanha-cerrada", cat: "Aesthetic", name: "Montanha Cerrada", desc: "Neblina de altitude com verdes densos e frios." },
  { key: "15-reflexo-artico", cat: "Aesthetic", name: "Reflexo Ártico", desc: "Reflexos azul-gelo com frieza etérea." },
  { key: "16-resiliencia", cat: "Aesthetic", name: "Resiliência", desc: "Terra árida com luz resiliente e tons ocre." },
  { key: "17-duradouro", cat: "Aesthetic", name: "Duradouro", desc: "Permanência com tons terrosos e sombras ricas." },
  { key: "18-areia", cat: "Aesthetic", name: "Areia", desc: "Areia e luz difusa, paleta mínima e quente." },
];

interface FaqItem {
  q: string;
  a: string;
}
const FAQ: FaqItem[] = [
  { q: "Quais formatos vêm?", a: "Vem em .xmp pra Lightroom Classic, CC, Camera Raw e Photoshop. E .dng pra Lightroom Mobile (iOS e Android)." },
  { q: "Funciona no celular?", a: "Sim! O Lightroom Mobile abre os .dng direto. Eu uso assim em campo, sem laptop." },
  { q: "E se eu não gostar?", a: "Manda email pra contato@euhenriq.com em até 14 dias e devolvo 100%. Sem pergunta nenhuma." },
  { q: "Posso usar comercialmente?", a: "Pode. Licença pessoal + comercial inclusa. Use em clientes, marcas, agências, sem restrição." },
  { q: "Recebo atualizações futuras?", a: "Sim. Todo pack novo que eu lançar vai automático pro seu email. Sem custo extra." },
  { q: "E se eu fotografo em JPEG?", a: "Funciona também! Os presets foram ajustados pra responder bem tanto em RAW quanto JPEG." },
];

interface VsRow {
  k: string;
  free: string;
  paid: string;
}
const VS_ROWS: VsRow[] = [
  { k: "Consistência entre fotos", free: "Cada foto vira uma versão diferente", paid: "Mesmo look em 100 fotos. Predictable." },
  { k: "Feito pra natureza outdoor", free: "Genéricos, pensados pra Instagram", paid: "4 anos calibrando em montanha, dunas e mata." },
  { k: "Funciona em RAW", free: "Trava ou exagera, precisa retocar", paid: "Pontos de branco, shadows e HSL calibrados." },
  { k: "Licença comercial", free: "Quase nunca incluída", paid: "Pessoal + comercial — clientes, marcas, agências." },
  { k: "Suporte do autor", free: "Inexistente", paid: "Email direto, resposta em 48h." },
];

// Util: vibração suave (graceful no-op se não suportar)
const vibe = (ms = 8) => {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* vibrate não suportado */
  }
};

const EXT = { target: "_blank", rel: "noopener noreferrer" } as const;

// ────────────────────────────────────────────────────────────────
// Countdown banner
// ────────────────────────────────────────────────────────────────
function CountdownBanner() {
  const KEY = "pf_deadline_v2";
  const deadline = useMemo(() => {
    if (typeof window === "undefined") return Date.now() + 15 * 60_000;
    const s = sessionStorage.getItem(KEY);
    if (s) return Number(s);
    const d = Date.now() + 15 * 60_000;
    sessionStorage.setItem(KEY, String(d));
    return d;
  }, []);
  const [secs, setSecs] = useState(() => Math.max(0, Math.floor((deadline - Date.now()) / 1000)));
  useEffect(() => {
    const id = setInterval(() => setSecs(Math.max(0, Math.floor((deadline - Date.now()) / 1000))), 1000);
    return () => clearInterval(id);
  }, [deadline]);
  if (secs === 0) return null;
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "var(--rust)", color: "var(--canvas)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px 12px", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", flexWrap: "nowrap", overflow: "hidden" }}>
      <span style={{ opacity: .85, fontSize: 10, whiteSpace: "nowrap" }}>Oferta limitada</span>
      <span style={{ fontWeight: 700, fontSize: 13, background: "rgba(0,0,0,.25)", padding: "1px 7px", borderRadius: 2, whiteSpace: "nowrap" }}>{m}:{s}</span>
      <span style={{ opacity: .9, whiteSpace: "nowrap" }}>R$ {PRICE_VISTA}</span>
      <a href={CTA_URL} {...EXT} onClick={() => vibe(12)} style={{ padding: "4px 12px", background: "var(--canvas)", color: "var(--rust)", fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textDecoration: "none", textTransform: "uppercase", whiteSpace: "nowrap", marginLeft: 4 }}>Comprar →</a>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Sticky bottom CTA — aparece após scroll (mobile)
// ────────────────────────────────────────────────────────────────
function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const sc = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setShow(total > 0 && sc / total > 0.18);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="pf-sticky" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90, background: "rgba(30,42,24,.96)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", borderTop: "1px solid rgba(232,223,201,.15)", transform: show ? "translateY(0)" : "translateY(100%)", transition: "transform .35s cubic-bezier(.4,0,.2,1)", padding: "10px 14px env(safe-area-inset-bottom, 10px)", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(232,223,201,.55)", marginBottom: 1 }}>De R$ 79 por</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, color: "var(--canvas)" }}>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 22, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1 }}>R$ {PRICE_VISTA}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".06em", color: "rgba(232,223,201,.5)", whiteSpace: "nowrap" }}>ou {PRICE_N}× R$ {PRICE_PARCEL}</span>
        </div>
      </div>
      <a href={CTA_URL} {...EXT} onClick={() => vibe(15)} style={{ padding: "13px 18px", background: "var(--rust-soft)", color: "var(--forest)", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", textDecoration: "none", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6 }}>
        Comprar <span style={{ fontSize: "1.15em" }}>→</span>
      </a>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Try It — preview real com before/after (foto original vs editada)
// ────────────────────────────────────────────────────────────────
const TRYIT_ORIGINAL = "/images/presets/tryit-original.jpg";
interface TryItPreset {
  key: string;
  name: string;
  dot: string;
  tone: string;
}
const TRYIT_PRESETS: TryItPreset[] = [
  { key: "tryit-duradouro", name: "Duradouro", dot: "#D8924A", tone: "quente" },
  { key: "tryit-reflexo-artico", name: "Reflexo Ártico", dot: "#6FA3D8", tone: "frio" },
  { key: "tryit-nostalgia", name: "Nostalgia", dot: "#C8905A", tone: "quente" },
  { key: "tryit-verde-desbotado", name: "Verde Desbotado", dot: "#7EC47E", tone: "frio" },
  { key: "tryit-montanha-cerrada", name: "Montanha Cerrada", dot: "#D8924A", tone: "quente" },
  { key: "tryit-cinematico", name: "Cinemático", dot: "#6FA3D8", tone: "frio" },
  { key: "tryit-resiliencia", name: "Resiliência", dot: "#C8905A", tone: "quente" },
];
function TryItSection() {
  const [active, setActive] = useState(TRYIT_PRESETS[0].key);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const activePreset = TRYIT_PRESETS.find(p => p.key === active);

  const moveTo = (clientX: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section style={{ padding: "clamp(48px,7vw,80px) clamp(16px,5vw,48px)", background: "var(--canvas-deep)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 18, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--rust)", transform: "rotate(-1.5deg)", display: "inline-block", marginBottom: 4 }}>experimenta antes—</div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "clamp(22px,4.5vw,38px)", letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
            Veja o look <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>na sua frente</span>.
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(12px,2vw,15px)", color: "var(--stone)", marginTop: 10, marginBottom: 0, lineHeight: 1.5 }}>Escolha um preset e arraste pra comparar com a foto original — mesma cena, RAW de verdade.</p>
        </div>

        <div
          onPointerDown={e => { dragging.current = true; moveTo(e.clientX, e.currentTarget); e.currentTarget.setPointerCapture(e.pointerId); }}
          onPointerMove={e => { if (dragging.current) moveTo(e.clientX, e.currentTarget); }}
          onPointerUp={() => { dragging.current = false; }}
          style={{ position: "relative", width: "100%", aspectRatio: "3/2", overflow: "hidden", background: "var(--forest)", borderRadius: 2, marginBottom: 14, cursor: "ew-resize", touchAction: "none", userSelect: "none" }}>
          {TRYIT_PRESETS.map(p => (
            <img key={p.key} src={presetImg(p.key)} alt={p.name} draggable={false}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: active === p.key ? 1 : 0, transition: "opacity .45s ease", pointerEvents: "none" }} />
          ))}
          <img src={TRYIT_ORIGINAL} alt="Original" draggable={false}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(0 ${100 - pos}% 0 0)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "rgba(245,241,232,.85)", boxShadow: "0 0 10px rgba(0,0,0,.45)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: `${pos}%`, width: 38, height: 38, borderRadius: "50%", border: "1.5px solid rgba(245,241,232,.95)", background: "rgba(20,14,8,.3)", backdropFilter: "blur(2px)", transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 14, pointerEvents: "none" }}>⇄</div>
          <div style={{ position: "absolute", top: 10, left: 10, padding: "4px 9px", background: "rgba(42,33,26,.82)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", pointerEvents: "none" }}>Original</div>
          <div style={{ position: "absolute", top: 10, right: 10, padding: "4px 9px", background: "var(--rust)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", pointerEvents: "none" }}>{activePreset?.name}</div>
        </div>

        <div style={{ display: "flex", gap: 8, overflowX: "auto", overflowY: "hidden", paddingBottom: 8, scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" } as CSSProperties} className="pf-chip-scroll">
          {TRYIT_PRESETS.map(p => {
            const on = active === p.key;
            return (
              <button key={p.key} onClick={() => { setActive(p.key); setPos(50); vibe(10); }} style={{ flexShrink: 0, scrollSnapAlign: "start", padding: "9px 14px", border: "1px solid " + (on ? p.dot : "var(--line)"), background: on ? p.dot : "transparent", color: on ? "var(--forest)" : "var(--bark)", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: on ? "var(--forest)" : p.dot, opacity: on ? .9 : 1 }} />
                {p.name}
              </button>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", color: "var(--stone)", textTransform: "uppercase" }}>↔ Deslize pra ver todos · arraste a foto pra comparar</div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// VS Carousel — cards single-criterio com swipe
// ────────────────────────────────────────────────────────────────
function VsCarousel() {
  const [idx, setIdx] = useState(0);
  const total = VS_ROWS.length;
  const startX = useRef(0);

  return (
    <section style={{ padding: "clamp(48px,7vw,80px) clamp(16px,5vw,48px)", background: "var(--canvas-deep)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(20px,4vw,36px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.1, marginBottom: 6, marginTop: 0, color: "var(--bark)" }}>
            Por que não usar um <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>preset grátis</span>?
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 13, color: "var(--stone)", margin: 0 }}>Deslize pra comparar critério por critério</p>
        </div>

        <div style={{ position: "relative", overflow: "hidden" }}
          onTouchStart={e => { startX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - startX.current;
            if (dx < -40 && idx < total - 1) { setIdx(idx + 1); vibe(8); }
            else if (dx > 40 && idx > 0) { setIdx(idx - 1); vibe(8); }
          }}>
          <div style={{ display: "flex", transform: `translateX(-${idx * 100}%)`, transition: "transform .45s cubic-bezier(.4,0,.2,1)" }}>
            {VS_ROWS.map((row, i) => (
              <div key={i} style={{ minWidth: "100%", padding: "4px", boxSizing: "border-box" }}>
                <div style={{ background: "var(--canvas)", border: "1px solid var(--line)", padding: "clamp(20px,4vw,28px)", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--rust)" }}>№ {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</div>
                  <h3 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(18px,3.5vw,26px)", fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.2, margin: 0, color: "var(--bark)" }}>{row.k}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 6 }}>
                    <div style={{ padding: "14px 12px", border: "1px solid #d3c5a8", background: "rgba(176,87,68,.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#B05744", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>×</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase", color: "#B05744", fontWeight: 700 }}>Grátis</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(12px,2.5vw,14px)", lineHeight: 1.45, color: "#3A3530" }}>{row.free}</div>
                    </div>
                    <div style={{ padding: "14px 12px", background: "var(--forest)", color: "var(--canvas)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--rust-soft)", color: "var(--forest)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>✓</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--rust-soft)", fontWeight: 700 }}>Outdoor C.</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(12px,2.5vw,14px)", lineHeight: 1.45 }}>{row.paid}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
          {VS_ROWS.map((_, i) => (<button key={i} onClick={() => { setIdx(i); vibe(6); }} aria-label={`Critério ${i + 1}`} style={{ width: i === idx ? 22 : 7, height: 7, borderRadius: 4, border: "none", cursor: "pointer", background: i === idx ? "var(--rust)" : "var(--line)", transition: "width .3s,background .3s", padding: 0 }} />))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// FAQ Chat — balões iMessage style
// ────────────────────────────────────────────────────────────────
function FaqChat() {
  const [revealed, setRevealed] = useState<number[]>([0]);
  const reveal = (i: number) => {
    if (!revealed.includes(i)) {
      setRevealed(r => [...r, i]);
      vibe(10);
    }
  };
  return (
    <section style={{ padding: "clamp(48px,7vw,80px) clamp(16px,5vw,48px)", background: "var(--canvas-deep)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--rust)", transform: "rotate(-1.5deg)", display: "inline-block", marginBottom: 4 }}>me pergunta—</div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "clamp(22px,4.5vw,38px)", letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
            Conversa <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>direta</span>.
          </h2>
        </div>

        <div style={{ background: "var(--canvas)", border: "1px solid var(--line)", padding: "14px 12px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--canvas-deep)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-hand)", fontSize: 20, color: "var(--rust)" }}>H</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "var(--bark)" }}>Henrique</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".08em", color: "var(--moss)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--moss)" }} />online · responde em ~48h
              </div>
            </div>
          </div>

          {FAQ.map((item, i) => {
            const open = revealed.includes(i);
            return (
              <Fragment key={i}>
                <div style={{ alignSelf: "flex-end", maxWidth: "82%" }}>
                  <button onClick={() => reveal(i)} style={{ background: "#A6542B", color: "var(--canvas)", padding: "9px 13px", borderRadius: "14px 14px 4px 14px", border: "none", cursor: open ? "default" : "pointer", textAlign: "left", fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 500, lineHeight: 1.4, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
                    {item.q}
                  </button>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--stone)", textAlign: "right", marginTop: 2, paddingRight: 4 }}>Você</div>
                </div>
                {open && (
                  <div style={{ alignSelf: "flex-start", maxWidth: "82%", animation: "pf-chat-in .3s ease" }}>
                    <div style={{ background: "var(--canvas-deep)", color: "var(--bark)", padding: "10px 13px", borderRadius: "14px 14px 14px 4px", fontFamily: "var(--font-serif)", fontSize: 13.5, lineHeight: 1.5, boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
                      {item.a}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--stone)", marginTop: 2, paddingLeft: 4 }}>Henrique · agora</div>
                  </div>
                )}
              </Fragment>
            );
          })}

          {revealed.length < FAQ.length && (
            <div style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--stone)", marginTop: 8, opacity: .7 }}>
              ↑ toque numa pergunta acima
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 18, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 13, color: "#3A3530" }}>
          Outra dúvida? <a href="mailto:contato@euhenriq.com" style={{ color: "var(--rust)" }}>contato@euhenriq.com</a>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// CTA Button (reusável)
// ────────────────────────────────────────────────────────────────
function CTAButton({ label = "Comprar" }: { label?: string }) {
  return (
    <a href={CTA_URL} {...EXT} onClick={() => vibe(15)} className="pf-cta" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 5, textDecoration: "none", width: "100%", boxSizing: "border-box" }}>
      <span className="pf-cta-inner" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "17px 16px", background: "var(--rust-soft)", color: "var(--forest)", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", width: "100%", boxSizing: "border-box", minWidth: 0, overflow: "hidden" }}>
        <span style={{ whiteSpace: "nowrap" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.05em", whiteSpace: "nowrap" }}>R$ {PRICE_VISTA}</span>
        <span style={{ fontSize: "1.1em" }}>→</span>
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", color: "var(--stone)", textTransform: "uppercase", textAlign: "center" }}>ou {PRICE_N}× de R$ {PRICE_PARCEL} · Download imediato</span>
    </a>
  );
}

function GuaranteeBadge() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1px solid var(--moss)", background: "rgba(74,88,56,.06)" }}>
      <div style={{ width: 34, height: 34, borderRadius: "50%", border: "2px solid var(--moss)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>✓</div>
      <div>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, color: "var(--bark)", marginBottom: 1 }}>Garantia de 14 dias</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".1em", color: "var(--stone)", textTransform: "uppercase" }}>Sem perguntas · Devolução total</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Hero redesenhado — full-bleed editorial (desktop + mobile)
// ────────────────────────────────────────────────────────────────
// Hero: foto da laguna tratada (base) + foto RAW que faz o wipe por cima via
// --rev (varredura senoidal automática, pausável ao tocar/arrastar).
const HERO_IMG = "/images/presets/hero-laguna.jpg";
const HERO_RAW = "/images/presets/hero-laguna-raw.jpg";
function HeroRedesigned() {
  const [rawOk, setRawOk] = useState(true);
  const secRef = useRef<HTMLElement>(null);
  const interacting = useRef(false);
  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (reduce) { sec.style.setProperty("--rev", "36%"); return; }
    const MIN = 16, MAX = 82, PERIOD = 13000;
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      if (!interacting.current) {
        const phase = ((t - start) % PERIOD) / PERIOD;
        const e = (1 - Math.cos(phase * 2 * Math.PI)) / 2;
        sec.style.setProperty("--rev", (MIN + (MAX - MIN) * e).toFixed(2) + "%");
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rawOk]);
  const setRev = (clientX: number) => {
    const sec = secRef.current;
    if (!sec) return;
    const r = sec.getBoundingClientRect();
    const p = Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100));
    sec.style.setProperty("--rev", p + "%");
  };
  return (
    <section className="pf-hero2" ref={secRef}
      onPointerDown={e => { if (!rawOk) return; interacting.current = true; setRev(e.clientX); }}
      onPointerMove={e => { if (interacting.current) setRev(e.clientX); }}
      onPointerUp={() => { interacting.current = false; }}
      onPointerLeave={() => { interacting.current = false; }}>
      <img className="pf-hero2-img" src={HERO_IMG} alt="" draggable={false} />
      {rawOk ? <img className="pf-hero2-raw" src={HERO_RAW} alt="" draggable={false} onError={() => setRawOk(false)} /> : null}
      {rawOk ? (
        <>
          <div className="pf-hero2-divider" />
          <div className="pf-hero2-handle">⇄</div>
          <span className="pf-hero2-lbl pf-hero2-lbl-raw">raw</span>
          <span className="pf-hero2-lbl pf-hero2-lbl-trt">tratado</span>
        </>
      ) : null}
      <div className="pf-hero2-grad" />

      <div className="pf-hero2-bottom">
        <div className="pf-hero2-content">
          <div style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(24px,3.6vw,30px)", color: "var(--rust-soft)", transform: "rotate(-2deg)", marginBottom: 2, textShadow: "0 1px 8px rgba(0,0,0,.5)" }}>a cor que eu uso—</div>
          <h1 style={{ margin: "0 0 12px", color: "var(--canvas)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(40px,7vw,76px)", letterSpacing: "-.035em", lineHeight: .9, textShadow: "0 2px 20px rgba(0,0,0,.45)" }}>
            {TOTAL_PRESETS} presets <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)", fontSize: ".72em", letterSpacing: "-.01em" }}>nascidos<br />de 4 anos em campo.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(15px,2.2vw,18px)", lineHeight: 1.5, color: "rgba(245,241,232,.85)", margin: 0, maxWidth: "40ch", textShadow: "0 1px 10px rgba(0,0,0,.5)" }}>A mesma cor do meu portfólio — agora no seu Lightroom, em RAW de montanha ou JPEG.</p>
        </div>
        <div className="pf-hero2-offer">
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--stone)", textDecoration: "line-through" }}>R$ 79</span>
            <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(28px,4vw,38px)", letterSpacing: "-.02em", color: "var(--bark)", lineHeight: 1 }}>R$ {PRICE_VISTA}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".04em", color: "var(--stone)", whiteSpace: "nowrap" }}>ou {PRICE_N}× R$ {PRICE_PARCEL}</span>
          </div>
          <div className="pf-hero2-spacer" style={{ flex: 1 }} />
          <span className="pf-hero2-guar" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 14, color: "var(--stone)" }}>download imediato · garantia 14 dias</span>
          <a href={CTA_URL} {...EXT} onClick={() => vibe(15)} className="pf-hero2-cta" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "15px 26px", background: "var(--rust)", color: "var(--paper)", fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase", textDecoration: "none" }}>Quero a coleção <span style={{ fontSize: "1.2em" }}>→</span></a>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// Quem sou eu — autor real
// ────────────────────────────────────────────────────────────────
function AboutAuthor() {
  return (
    <section className="pf-about" style={{ background: "var(--forest)", color: "var(--canvas)", borderBottom: "1px solid rgba(232,223,201,.1)" }}>
      <div className="pf-about-grid">
        <div className="pf-about-photo">
          <img src="/images/henrique-portrait-1.jpg" alt="Henrique Sesana" draggable={false} />
        </div>
        <div className="pf-about-text">
          <div style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(22px,3.4vw,30px)", color: "var(--rust-soft)", transform: "rotate(-1.5deg)", display: "inline-block", marginBottom: 6 }}>quem tratou essas cores—</div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(28px,4.5vw,48px)", letterSpacing: "-.03em", lineHeight: .95, margin: "0 0 20px" }}>
            Eu sou o <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>Henrique</span>.
          </h2>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(14px,2vw,17px)", lineHeight: 1.7, color: "rgba(232,223,201,.75)", maxWidth: "46ch" }}>
            <p style={{ margin: "0 0 16px" }}>A câmera entrou na minha vida junto com a montanha. Escalada me ensinou a ler ambiente, luz e risco de um jeito que nenhum curso ensina — e daí fui estudar de verdade: color grading, exposição, direção de fotografia.</p>
            <p style={{ margin: 0 }}>Estes {TOTAL_PRESETS} presets são esse olhar. A mesma cor que levei pra Lençóis, Itatiaia, Huayhuash e Atacama — calibrada em campo, não em estúdio, pronta pro seu Lightroom.</p>
          </div>
          <div className="pf-about-stats">
            {[["5+", "anos em campo"], ["50+", "destinos"], [String(TOTAL_PRESETS), "presets"]].map(([n, l]) => (
              <div key={l} style={{ padding: "14px 22px", borderRight: "1px solid rgba(0,0,0,.18)" }}>
                <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(22px,3vw,30px)", letterSpacing: "-.03em", color: "var(--canvas)", lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,.7)", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22, fontFamily: "var(--font-hand)", fontSize: "clamp(26px,3.6vw,34px)", color: "var(--rust-soft)", transform: "rotate(-2deg)", display: "inline-block", lineHeight: 1 }}>— Henrique</div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────
// Master-detail collection — treeview + preview before/after (hover/tap)
// ────────────────────────────────────────────────────────────────
function MasterDetailCollection() {
  const grouped = PRESET_CATS.map(cat => ({ cat, items: PRESETS.filter(p => p.cat === cat.label) }));
  const allItems = grouped.flatMap(g => g.items);
  const [open, setOpen] = useState<Record<string, boolean>>(() => ({ "Tom Verde": true, "Tom Azul": true, "Tom Laranja": false, Aesthetic: false }));
  const [sel, setSel] = useState(allItems[0]?.key);
  const [pos, setPos] = useState(52);
  const [rawOk, setRawOk] = useState(true);
  const dragging = useRef(false);
  const selPreset = PRESETS.find(p => p.key === sel);
  const selCat = selPreset?.cat;
  const catColor = (selCat && CAT_COLORS[selCat]) || "var(--rust)";

  useEffect(() => { setPos(52); setRawOk(true); }, [sel]);

  const moveTo = (clientX: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setPos(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };

  const pick = (k: string) => { setSel(k); vibe(6); };

  return (
    <div className="pf-mdc">
      <div className="pf-mdc-tree">
        {grouped.map(({ cat, items }) => {
          const isOpen = open[cat.label];
          return (
            <div key={cat.id} style={{ marginBottom: 6 }}>
              <button onClick={() => { setOpen(o => ({ ...o, [cat.label]: !o[cat.label] })); vibe(6); }}
                style={{ width: "100%", appearance: "none", border: "none", background: "none", cursor: "pointer", textAlign: "left", padding: "9px 0", display: "flex", alignItems: "center", gap: 10, borderBottom: "2px solid var(--line)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--rust)", width: 10, display: "inline-block", transition: "transform .15s", transform: isOpen ? "rotate(90deg)" : "none" }}>▸</span>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: CAT_COLORS[cat.label] || "var(--rust)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--bark)", fontWeight: 500, whiteSpace: "nowrap" }}>{cat.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", color: "var(--stone)", whiteSpace: "nowrap" }}>· {items.length}</span>
              </button>
              {isOpen && (
                <div style={{ position: "relative", paddingLeft: 13, marginTop: 2 }}>
                  <div style={{ position: "absolute", left: 4, top: 0, bottom: 16, width: 1, background: "var(--line)" }} />
                  {items.map((p, j) => {
                    const last = j === items.length - 1, on = sel === p.key;
                    return (
                      <button key={p.key}
                        onMouseEnter={() => setSel(p.key)}
                        onClick={() => pick(p.key)}
                        style={{ position: "relative", width: "100%", appearance: "none", border: "none", cursor: "pointer", textAlign: "left", display: "grid", gridTemplateColumns: "32px 1fr", alignItems: "center", gap: 11, padding: "7px 8px 7px 16px", background: on ? "rgba(166,84,43,.10)" : "transparent", borderLeft: on ? "2px solid var(--rust)" : "2px solid transparent", transition: "background .15s" }}>
                        <div style={{ position: "absolute", left: 4, top: "50%", width: 11, height: 1, background: "var(--line)" }} />
                        {last && <div style={{ position: "absolute", left: 4, top: "calc(50% + 1px)", bottom: 0, width: 1, background: "var(--canvas)" }} />}
                        <div style={{ width: 32, height: 32, overflow: "hidden", border: on ? "1px solid var(--rust)" : "1px solid var(--line)", flexShrink: 0 }}>
                          <img src={presetImg(p.key)} alt={p.name} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontFamily: "var(--font-ui)", fontWeight: on ? 700 : 600, fontSize: 13, lineHeight: 1.1, color: on ? "var(--rust)" : "var(--bark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pf-mdc-preview"
        onPointerDown={e => { if (!rawOk) return; dragging.current = true; moveTo(e.clientX, e.currentTarget); e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={e => { if (dragging.current) moveTo(e.clientX, e.currentTarget); }}
        onPointerUp={() => { dragging.current = false; }}
        style={{ position: "relative", overflow: "hidden", background: "var(--forest-soft, #2a3820)", cursor: rawOk ? "ew-resize" : "default", touchAction: "none", userSelect: "none" }}>
        <img key={"t-" + sel} src={presetImg(sel)} alt={selPreset?.name} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
        {rawOk ? <img key={"r-" + sel} src={presetImgRAW(sel)} alt="" draggable={false} onError={() => setRawOk(false)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(0 ${100 - pos}% 0 0)`, pointerEvents: "none" }} /> : null}
        {rawOk ? (
          <>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "rgba(245,241,232,.85)", boxShadow: "0 0 10px rgba(0,0,0,.45)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "42%", left: `${pos}%`, width: 36, height: 36, borderRadius: "50%", border: "1.5px solid rgba(245,241,232,.95)", background: "rgba(20,14,8,.3)", backdropFilter: "blur(2px)", transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 13, pointerEvents: "none" }}>⇄</div>
            <div style={{ position: "absolute", top: 14, left: 14, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(245,241,232,.9)", background: "rgba(20,14,8,.45)", padding: "3px 8px", pointerEvents: "none" }}>RAW</div>
            <div style={{ position: "absolute", top: 14, right: 14, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--canvas)", background: "var(--rust)", padding: "3px 8px", pointerEvents: "none" }}>Tratado</div>
          </>
        ) : null}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(14,12,10,.86) 0%,rgba(14,12,10,.14) 38%,rgba(14,12,10,0) 64%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 18, pointerEvents: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(245,241,232,.85)", marginBottom: 6, textShadow: "0 1px 6px rgba(0,0,0,.5)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: catColor }} />{selCat}
          </div>
          <div className="pf-mdc-title" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--canvas)", lineHeight: 1, marginBottom: 5, textShadow: "0 2px 14px rgba(0,0,0,.5)" }}>{selPreset?.name}</div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "rgba(245,241,232,.85)", textShadow: "0 1px 8px rgba(0,0,0,.6)", maxWidth: "40ch", lineHeight: 1.4 }}>{selPreset?.desc}</div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────────
export default function PresetsFotografiaPage() {
  return (
    <div className="pf-lp" style={{ background: "var(--canvas)", color: "var(--bark)", fontFamily: "var(--font-ui)", overflowX: "hidden", maxWidth: "100vw", paddingBottom: 88 }}>
      <style>{`
        .pf-lp *,.pf-lp *::before,.pf-lp *::after{box-sizing:border-box}
        @keyframes pf-chat-in { from{ opacity:0; transform:translateY(8px) } to{ opacity:1; transform:translateY(0) } }
        .pf-chip-scroll::-webkit-scrollbar{ height:4px } .pf-chip-scroll::-webkit-scrollbar-thumb{ background:var(--rust);border-radius:2px }
        @media(hover:hover) and (pointer:fine){
          .pf-cta-inner:hover{ background:var(--rust)!important }
        }
        @media (prefers-reduced-motion: reduce){
          *,*::before,*::after{ animation-duration:0.01ms!important; transition-duration:0.01ms!important }
        }
        .pf-cta-final{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
        .pf-mdc{display:flex;border:1px solid var(--line);background:var(--canvas)}
        .pf-mdc-tree{flex:0 0 40%;border-right:1px solid var(--line);max-height:560px;overflow-y:auto;padding:14px 22px 28px}
        .pf-mdc-preview{flex:1;min-width:0;min-height:560px}
        .pf-mdc-title{font-size:38px}
        .pf-sticky-spacer{height:0}
        @media(min-width:781px){ .pf-sticky{display:none!important} }
        .pf-hero2{position:relative;height:clamp(580px,90vh,820px);background:var(--forest);overflow:hidden}
        .pf-hero2-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}
        .pf-hero2-raw{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;clip-path:inset(0 calc(100% - var(--rev,24%)) 0 0)}
        .pf-hero2-divider{position:absolute;top:0;bottom:0;left:var(--rev,24%);width:2px;background:rgba(245,241,232,.75);box-shadow:0 0 12px rgba(0,0,0,.4)}
        .pf-hero2-handle{position:absolute;top:46%;left:var(--rev,24%);width:38px;height:38px;border-radius:50%;border:1.5px solid rgba(245,241,232,.95);background:rgba(20,14,8,.28);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;color:var(--canvas);font-family:var(--font-mono);font-size:14px}
        .pf-hero2-lbl{position:absolute;top:50%;font-family:var(--font-serif);font-style:italic;font-size:14px;color:rgba(245,241,232,.92);text-shadow:0 1px 6px rgba(0,0,0,.6);white-space:nowrap;pointer-events:none}
        .pf-hero2-lbl-raw{left:calc(var(--rev,24%) - 14px);transform:translate(-100%,-50%)}
        .pf-hero2-lbl-trt{left:calc(var(--rev,24%) + 14px);transform:translateY(-50%)}
        .pf-hero2-grad{position:absolute;inset:0;background:linear-gradient(90deg,rgba(20,14,8,.72) 0%,rgba(20,14,8,.30) 38%,rgba(20,14,8,0) 60%),linear-gradient(0deg,rgba(20,14,8,.85) 0%,rgba(20,14,8,.15) 42%,rgba(20,14,8,0) 70%)}
        .pf-hero2-bottom{position:absolute;left:0;right:0;bottom:0}
        .pf-hero2-content{padding:0 clamp(20px,5vw,48px) 28px;max-width:760px}
        .pf-hero2-offer{display:flex;align-items:center;gap:28px;background:rgba(245,241,232,.94);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border-top:1px solid rgba(42,33,26,.12);padding:16px clamp(20px,5vw,48px)}
        .pf-about-grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:0.82fr 1fr;gap:0;align-items:stretch}
        .pf-about-photo{position:relative;min-height:480px;overflow:hidden}
        .pf-about-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}
        .pf-about-text{padding:clamp(40px,5vw,64px) clamp(20px,4vw,52px);display:flex;flex-direction:column;justify-content:center}
        .pf-about-stats{display:flex;background:var(--rust);width:fit-content;margin-top:28px}
        .pf-about-stats > div:last-child{border-right:none!important}
        @media(max-width:900px){
          .pf-includes{grid-template-columns:repeat(2,1fr)}
          .pf-cta-final{grid-template-columns:1fr;gap:24px}
        }
        @media(max-width:780px){
          .pf-mdc{flex-direction:column}
          .pf-mdc-tree{flex:none;order:2;border-right:none;border-top:1px solid var(--line);max-height:380px;padding:12px 16px 18px}
          .pf-mdc-preview{order:1;min-height:0;aspect-ratio:4/3}
          .pf-mdc-title{font-size:30px}
          .pf-sticky-spacer{height:72px}
          .pf-hero2{height:auto;min-height:88vh;display:flex;flex-direction:column}
          .pf-hero2-raw,.pf-hero2-divider,.pf-hero2-lbl,.pf-hero2-handle{display:none}
          .pf-hero2-img{position:absolute}
          .pf-hero2-grad{background:linear-gradient(0deg,rgba(20,14,8,.92) 0%,rgba(20,14,8,.25) 46%,rgba(20,14,8,.08) 100%)}
          .pf-hero2-bottom{position:relative;margin-top:auto}
          .pf-hero2-offer{flex-wrap:wrap;gap:10px 14px;padding:14px 20px 16px}
          .pf-hero2-spacer{display:none}
          .pf-hero2-guar{order:3;width:100%;text-align:left}
          .pf-hero2-cta{order:2;flex:1;min-width:160px}
          .pf-about-grid{grid-template-columns:1fr}
          .pf-about-photo{min-height:0;aspect-ratio:4/3}
          .pf-about-stats{width:100%}
          .pf-about-stats > div{flex:1;text-align:center}
        }
        @media(max-width:600px){
          .pf-includes{grid-template-columns:1fr!important}
          .pf-cta-final{display:flex!important;flex-direction:column-reverse!important;gap:20px!important}
        }
      `}</style>
      <CountdownBanner />

      {/* Minimal nav */}
      <div style={{ paddingTop: 40 }}>
        <header style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(16px,5vw,40px)", borderBottom: "1px solid rgba(42,33,26,.1)" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 24, color: "var(--bark)", letterSpacing: ".02em", lineHeight: 1 }}>Eu Henriq</span>
          </a>
          <a href="/presets" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--stone)", textDecoration: "none" }}>← Presets</a>
        </header>
      </div>

      {/* ═══ HERO ═══ */}
      <HeroRedesigned />

      {/* ═══ CREDIBILIDADE ═══ */}
      <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "var(--canvas)" }}>
        {[{ v: "4 anos", k: "em campo" }, { v: "45", k: "presets" }, { v: "LR", k: "Classic · CC · Mobile" }, { v: "14d", k: "garantia" }].map((s, i) => (
          <div key={i} style={{ padding: "14px 6px", borderLeft: i === 0 ? "none" : "1px solid var(--line)", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(14px,3.5vw,20px)", fontWeight: 700, letterSpacing: "-.01em", color: "var(--bark)", marginBottom: 2 }}>{s.v}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(7px,1.8vw,9px)", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--stone)", lineHeight: 1.2 }}>{s.k}</div>
          </div>
        ))}
      </section>

      {/* ═══ TRY IT ═══ */}
      <TryItSection />

      {/* ═══ INCLUSO ═══ */}
      <section style={{ padding: "clamp(48px,7vw,80px) clamp(16px,5vw,48px)", background: "var(--canvas)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(24px,4vw,44px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, marginBottom: 28, marginTop: 0, color: "var(--bark)" }}>
            O que vem na <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>mochila</span>.
          </h2>
          <div className="pf-includes" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(16px,3vw,28px)" }}>
            {[
              { n: "01", t: "45 presets Lightroom", d: "Arquivos .xmp para Classic, CC, Mobile e Camera Raw. Dois packs: 18 + 27." },
              { n: "02", t: "Perfis .dng", d: "Perfis de cor — mais estáveis, não bagunçam seus sliders." },
              { n: "03", t: "Guia de instalação", d: "PDF passo a passo para cada versão do Lightroom." },
              { n: "04", t: "Videoaula", d: "Como escolher o preset certo e fazer ajustes finos." },
              { n: "05", t: "Licença comercial", d: "Use em trabalhos pagos e clientes. Sem pegadinha." },
              { n: "06", t: "Atualizações vitalícias", d: "Todo pack novo vai pra você automaticamente." },
            ].map(it => (
              <div key={it.n} style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".18em", color: "var(--rust)", marginBottom: 5 }}>№ {it.n}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(14px,2.5vw,18px)", fontWeight: 600, marginBottom: 4, color: "var(--bark)", lineHeight: 1.2 }}>{it.t}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(12px,1.8vw,13px)", lineHeight: 1.55, color: "#3A3530" }}>{it.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUEM SOU EU ═══ */}
      <AboutAuthor />

      {/* ═══ VS CAROUSEL ═══ */}
      <VsCarousel />

      {/* ═══ COLEÇÃO ═══ */}
      <section style={{ padding: "clamp(48px,7vw,80px) clamp(16px,5vw,48px)", background: "var(--canvas)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: "var(--font-hand)", fontSize: 20, color: "var(--rust)", transform: "rotate(-1.5deg)", display: "inline-block", marginBottom: 2 }}>tudo que tem—</div>
              <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "clamp(24px,4vw,40px)", letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
                A coleção <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>completa</span>.
              </h2>
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--stone)", margin: 0, paddingBottom: 4 }}>passe o mouse · arraste pra comparar</p>
          </div>
          <MasterDetailCollection />
          <div style={{ marginTop: 24, maxWidth: 340 }}><CTAButton /></div>
        </div>
      </section>

      {/* ═══ FAQ CHAT ═══ */}
      <FaqChat />

      {/* ═══ CTA FINAL ═══ */}
      <section style={{ padding: "clamp(56px,8vw,90px) clamp(16px,5vw,48px)", background: "var(--forest)" }}>
        <div className="pf-cta-final">
          <div>
            <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(34px,6vw,62px)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: .92, margin: 0, color: "var(--canvas)" }}>
              Pronto pra<br />dar <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>cor</span><br />às suas fotos?
            </h2>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 15, color: "rgba(232,223,201,.65)", marginTop: 14, lineHeight: 1.5 }}>Download imediato. Acesso vitalício. Garantia de 14 dias.</p>
          </div>
          <div style={{ background: "var(--canvas)", padding: "clamp(18px,4vw,28px)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 5 }}>Outdoor Cinematic Presets</div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(38px,5vw,56px)", fontWeight: 700, letterSpacing: "-.03em", color: "var(--bark)", lineHeight: 1, marginBottom: 3 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".3em", color: "var(--stone)", fontWeight: 400 }}>R$ </span>{PRICE_VISTA}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 14 }}>acesso vitalício · download imediato</div>
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, marginBottom: 14 }}>
              {["45 presets .xmp + .dng", "2 packs: 18 + 27", "Guia PDF + videoaula", "Licença pessoal e comercial", "Atualizações vitalícias", "Suporte por email"].map(item => (
                <div key={item} style={{ display: "flex", gap: 8, padding: "5px 0", fontFamily: "var(--font-serif)", fontSize: 13, color: "#3A3530" }}>
                  <span style={{ color: "var(--moss)", fontWeight: 700, flexShrink: 0 }}>✓</span><span>{item}</span>
                </div>
              ))}
            </div>
            <CTAButton />
            <div style={{ marginTop: 10 }}><GuaranteeBadge /></div>
          </div>
        </div>
      </section>

      <SiteFooter dark={false} />
      <div className="pf-sticky-spacer" />
      <StickyCTA />
    </div>
  );
}
