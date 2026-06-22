"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./outdoor-grain.module.css";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--odg-sans" });
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--odg-mono",
});

const IMG = (k: string) => "/images/odg-opt/" + k + ".jpg";

const TOTAL = 21;

interface PresetEntry {
  n: string;
  img: string;
  raw?: string;
}

const P: Record<string, PresetEntry> = {
  basecamp:   { n: "Basecamp",         img: "01-basecamp",         raw: "01-basecamp-raw" },
  highsun:    { n: "High Sun",         img: "05-high-sun",         raw: "05-high-sun-raw" },
  golden:     { n: "Golden Light",     img: "07-golden-light" },
  earth:      { n: "Earth & Rock",     img: "08-earth-rock",       raw: "08-earth-rock-raw" },
  fog:        { n: "Fog & Mist",       img: "12-fog-mist",         raw: "12-fog-mist-raw" },
  analog:     { n: "Analog Snap",      img: "14-analog-snap" },
  silhouette: { n: "Silhouette",       img: "15-silhouette" },
  granite:    { n: "Granite (B&W)",    img: "16-granite-bw",       raw: "16-granite-bw-raw" },
  aerial:     { n: "Aerial Punch",     img: "19-aerial-punch",     raw: "19-aerial-punch-raw" },
  expired:    { n: "Expired Emulsion", img: "21-expired-emulsion", raw: "21-expired-emulsion-raw" },
};

interface BlockItem {
  id: string;
  code: string;
  title: string;
  sub: string;
  items: [string, string, string, string, string][];
}

const BLOCKS: BlockItem[] = [
  { id: "B1", code: "BLK_01", title: "Essencial & Documental", sub: "Arquivos base para o fluxo de expedição.", items: [
    ["01","Basecamp","O coringa do dia a dia. Cores orgânicas, contraste editorial e grão equilibrado.","01-basecamp","01-basecamp-raw"],
    ["02","Expedition","Densidade nas sombras e luz extra — ideal para grandes fotos de aproximação.","02-expedition","02-expedition-raw"],
    ["03","Vivid Trail","Devolve a força das cores em dias cinzentos sem deixar a vegetação plástica.","03-vivid-trail","03-vivid-trail-raw"],
    ["04","Clean Slate","Visual limpo, transição suave para segurar as altas-luzes de forma orgânica.","04-clean-slate","04-clean-slate-raw"],
  ]},
  { id: "B2", code: "BLK_02", title: "Luz Extrema & Clima Sol", sub: "Recuperação para a luz dura da montanha.", items: [
    ["05","High Sun","Achata o contraste agressivo do sol de meio-dia e neutraliza sombras azuladas.","05-high-sun","05-high-sun-raw"],
    ["06","Human Scale","Mantém os tons de pele reais e orgânicos, mesmo sob luz ruim no acampamento.","06-human-scale","06-human-scale-raw"],
    ["18","Glacier Highlight","Salva a exposição em reflexo extremo (neve, gelo) sem amarelar o branco.","18-glacier-highlight","18-glacier-highlight-raw"],
  ]},
  { id: "B3", code: "BLK_03", title: "Tons Terrosos & Fim de Tarde", sub: "Luz de golden hour e texturas minerais.", items: [
    ["07","Golden Light","O aquecimento clássico e sutil para a luz de fim de tarde na trilha.","07-golden-light","07-golden-light-raw"],
    ["08","Earth & Rock","Acentua o micro-contraste e os tons minerais — laranjas e marrons da rocha nua.","08-earth-rock","08-earth-rock-raw"],
    ["09","Warm Fade","Visual de revista. Contraste rebaixado nas altas-luzes com sombras quentes.","09-warm-fade","09-warm-fade-raw"],
  ]},
  { id: "B4", code: "BLK_04", title: "Clima Hostil & Luz Baixa", sub: "Perrengue, penumbra e neblina.", items: [
    ["10","Blue Hour","Segura a onda na penumbra. Retém o amanhecer/anoitecer sem estourar o ruído.","10-blue-hour","10-blue-hour-raw"],
    ["11","Heavy Weather","Grão denso e visual fechado para documentar chuva, tempestade e clima hostil.","11-heavy-weather","11-heavy-weather-raw"],
    ["12","Fog & Mist","Corta o aspecto leitoso da neblina e devolve o contraste para arquivos lavados.","12-fog-mist","12-fog-mist-raw"],
  ]},
  { id: "B5", code: "BLK_05", title: "Editorial & Gráfica", sub: "Alto impacto e imperfeigões analógicas.", items: [
    ["13","Cinematic Wash","Sombras com fade profundo, paleta do documentário independente.","13-cinematic-wash","13-cinematic-wash-raw"],
    ["14","Analog Snap","A estética crua de point-and-shoot para b-roll e fotos de equipamento.","14-analog-snap","14-analog-snap-raw"],
    ["15","Silhouette","Pretos esmagados para destacar só as formas gráficas de montanhas e vales.","15-silhouette","15-silhouette-raw"],
    ["20","Trail Memory","Visual nostálgico com leves desvios de cor para fotos de lifestyle.","20-trail-memory","20-trail-memory-raw"],
    ["21","Expired Emulsion","Filme destruído. Grão severo, contraste melancólico e desvio químico agressivo.","21-expired-emulsion","21-expired-emulsion-raw"],
  ]},
  { id: "B6", code: "BLK_06", title: "P&B & Calibração Aérea", sub: "Monocromático pesado e alinhamento de sensor.", items: [
    ["16","Granite (B&W)","Preto e branco agressivo nos meios-tons — feito para explodir a textura da rocha.","16-granite-bw","16-granite-bw-raw"],
    ["17","Alpine Silver (B&W)","Preto e branco suave, cinzas ricos. Perfeito para retratos e neblina.","17-alpine-silver","17-alpine-silver-raw"],
    ["19","Aerial Punch","Contraste e saturação para nivelar arquivos de drone com os RAWs da câmera.","19-aerial-punch","19-aerial-punch-raw"],
  ]},
];

const FAQ: [string, string, string][] = [
  ["01","Formato & instalação","Os arquivos vêm em .xmp (Lightroom / Camera Raw) e .dng (Lightroom Mobile). Importação por 'Adicionar predefinições'. Manual de instalação em PDF incluso no .zip."],
  ["02","Compatibilidade","Lightroom Classic, Lightroom CC (desktop + mobile) e Adobe Camera Raw. Não dependem de assinatura — uma vez instalados, são seus."],
  ["03","RAW vs JPEG","Calibrados em arquivos RAW de expedição (Sony A7 IV / DJI). Funcionam em JPEG, mas a margem de recuperação de altas-luzes e sombras é menor."],
  ["04","Drone & câmera no mesmo set","O bloco de Calibração Aérea (19) foi desenhado para nivelar arquivos DNG de drone com os RAWs da câmera principal — cor consistente no mesmo carretel."],
  ["05","Cada foto fica idêntica?","Não. Preset é ponto de partida, não filtro fixo. Exposição e WB do seu arquivo mudam o resultado — por isso o pack traz 21 variações para cada condição."],
  ["06","Atualizações","Vitálias e sem custo. Novas versões do pack entram na mesma pasta de download."],
];

/* ---- PRIMITIVOS ---- */
function Tick({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span style={{ width: 6, height: 6, background: "var(--amber)", borderRadius: "50%", flexShrink: 0 }} />
      <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--ink-3)" }}>{label}</span>
    </div>
  );
}

const cTick = (pos: string) => {
  const s: React.CSSProperties = { position: "absolute", width: 7, height: 7, borderColor: "var(--amber)", borderStyle: "solid", pointerEvents: "none" };
  if (pos === "tl") return { ...s, top: -1, left: -1, borderWidth: "1px 0 0 1px" };
  if (pos === "tr") return { ...s, top: -1, right: -1, borderWidth: "1px 1px 0 0" };
  if (pos === "bl") return { ...s, bottom: -1, left: -1, borderWidth: "0 0 1px 1px" };
  return { ...s, bottom: -1, right: -1, borderWidth: "0 1px 1px 0" };
};

function Corner({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "relative", border: "1px solid var(--line)", background: "var(--panel)", ...style }}>
      <span style={cTick("tl")} /><span style={cTick("tr")} /><span style={cTick("bl")} /><span style={cTick("br")} />
      {children}
    </div>
  );
}

const baLbl = (side: "left" | "right"): React.CSSProperties => ({
  position: "absolute", top: 12, [side]: 12, fontFamily: "var(--mono)", fontSize: 9.5,
  letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink)",
  background: "rgba(10,10,11,.62)", border: "1px solid var(--line-2)", padding: "4px 9px", pointerEvents: "none",
});

function BeforeAfter({ afterImg, beforeImg, presetName, autoplay = false, ratio = "3 / 2", rounded = false }: {
  afterImg: string; beforeImg: string; presetName: string; autoplay?: boolean; ratio?: string; rounded?: boolean;
}) {
  const [pos, setPos] = useState(autoplay ? 50 : 55);
  const [live, setLive] = useState(autoplay);
  const wrap = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const raf = useRef(0);

  const moveTo = useCallback((clientX: number) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(3, Math.min(97, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    if (!live) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setPos(50); return; }
    let t0: number | null = null;
    const PERIOD = 9000;
    const tick = (t: number) => {
      if (t0 == null) t0 = t;
      const e = (t - t0) % PERIOD;
      const a = e / PERIOD;
      const v = 50 - Math.cos(a * 2 * Math.PI) * 34;
      setPos(v);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [live]);

  const stop = () => {
    if (live) { setLive(false); cancelAnimationFrame(raf.current); }
  };

  return (
    <div
      ref={wrap}
      onPointerDown={(e) => { drag.current = true; stop(); moveTo(e.clientX); e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => { if (drag.current) moveTo(e.clientX); }}
      onPointerUp={() => { drag.current = false; }}
      style={{
        position: "relative", width: "100%", aspectRatio: ratio, overflow: "hidden",
        background: "#000", cursor: "ew-resize", touchAction: "none", userSelect: "none",
        borderRadius: rounded ? 2 : 0,
      }}
    >
      <img src={IMG(afterImg)} alt={presetName} draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
      <img src={IMG(beforeImg)} alt="Original" draggable={false}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          clipPath: `inset(0 ${100 - pos}% 0 0)`, filter: "saturate(.96)", pointerEvents: "none",
        }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 1, background: "rgba(255,255,255,.7)", pointerEvents: "none" }} />
      <div style={{
        position: "absolute", top: "50%", left: `${pos}%`, transform: "translate(-50%,-50%)",
        width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(255,255,255,.85)",
        background: "rgba(10,10,11,.35)", backdropFilter: "blur(2px)",
        display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none",
      }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "#fff" }}>↔</span>
      </div>
      <span style={baLbl("left")}>ORIGINAL · RAW</span>
      <span style={{ ...baLbl("right"), background: "var(--amber)", color: "#0a0a0b", borderColor: "var(--amber)" }}>ODG · {presetName}</span>
      {live && (
        <span style={{
          position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
          fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase",
          color: "rgba(255,255,255,.7)", background: "rgba(10,10,11,.5)", padding: "3px 9px", pointerEvents: "none",
        }}>arraste pra comparar</span>
      )}
    </div>
  );
}

function Spec({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-3)" }}>{k}</span>
      <span style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: accent ? "var(--amber-soft)" : "var(--ink)", textAlign: "right" }}>{v}</span>
    </div>
  );
}

function Head({ code, kicker, title, style }: { code: string; kicker: string; title: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ marginBottom: 34, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".24em", color: "var(--amber)" }}>{code}</span>
        <span style={{ height: 1, flex: 1, maxWidth: 64, background: "var(--line-2)" }} />
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "var(--ink-3)" }}>{kicker}</span>
      </div>
      <h2 style={{ margin: 0, fontFamily: "var(--sans)", fontWeight: 600, fontSize: "clamp(28px,4.4vw,52px)", lineHeight: 1.02, letterSpacing: "-.02em", color: "var(--ink)", textWrap: "balance" } as React.CSSProperties}>{title}</h2>
    </div>
  );
}

const SECTION: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "clamp(64px,9vw,128px) clamp(20px,5vw,56px)" };

/* ---- NAV ---- */
function Nav() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const f = () => setS(window.scrollY > 40);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: s ? "rgba(10,10,11,.82)" : "transparent",
      backdropFilter: s ? "blur(12px)" : "none",
      borderBottom: s ? "1px solid var(--line)" : "1px solid transparent",
      transition: "all .3s",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px,5vw,56px)", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/presets" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
          <span style={{ width: 9, height: 9, border: "1px solid var(--amber)", position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ width: 3, height: 3, background: "var(--amber)", borderRadius: "50%" }} />
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".22em", color: "var(--ink)", fontWeight: 500 }}>OUTDOOR&nbsp;GRAIN</span>
        </a>
        <nav className="odg-navlinks" style={{ display: "flex", alignItems: "center", gap: 30 }}>
          {([["Ficha","#ficha"],["Calibração","#raiox"],["Log","#log"],["Arquivos","#arquivos"]] as [string,string][]).map(([t, h]) => (
            <a key={h} href={h} style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", textDecoration: "none" }}>{t}</a>
          ))}
        </nav>
        <a href="#checkout" style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--amber-soft)", textDecoration: "none", border: "1px solid var(--line-2)", padding: "9px 16px" }}>Em breve</a>
      </div>
    </header>
  );
}

/* ---- HERO ---- */
function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
      <img src={IMG("hero")} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,10,11,.74) 0%,rgba(10,10,11,.18) 30%,rgba(10,10,11,.42) 64%,rgba(10,10,11,.96) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, opacity: .5, backgroundImage: "linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px)", backgroundSize: "clamp(60px,8vw,120px) clamp(60px,8vw,120px)", maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%,transparent 30%,#000 100%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%,transparent 30%,#000 100%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 1200, width: "100%", margin: "0 auto", padding: "0 clamp(20px,5vw,56px) clamp(48px,7vw,88px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
          <Tick label="Film Emulation · LR / ACR" />
          <span style={{ height: 1, width: 40, background: "var(--line-2)" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".22em", color: "var(--ink-3)" }}>v1.0 / 2026</span>
        </div>
        <h1 style={{ margin: 0, fontFamily: "var(--sans)", fontWeight: 700, fontSize: "clamp(40px,10.5vw,128px)", lineHeight: .92, letterSpacing: "-.04em", color: "var(--ink)" }}>
          Outdoor Grain<span style={{ color: "var(--amber)" }}>.</span>
        </h1>
        <p style={{ margin: "22px 0 0", maxWidth: "54ch", fontFamily: "var(--sans)", fontSize: "clamp(15px,2.1vw,21px)", lineHeight: 1.5, color: "var(--ink-2)" }}>
          <span style={{ color: "var(--ink)" }}>{TOTAL} emulações de filme</span> calibradas em campo — sol de meio-dia, neblina, breu e drone. O grão, o halo e a química do analógico. Sem laboratório.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 34 }}>
          <a href="#checkout" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 26px", background: "var(--amber)", color: "#0a0a0b", fontFamily: "var(--sans)", fontWeight: 600, fontSize: 14, letterSpacing: ".02em", textDecoration: "none" }}>Em breve</a>
          <a href="#arquivos" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 26px", border: "1px solid var(--line-2)", color: "var(--ink)", fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", textDecoration: "none", whiteSpace: "nowrap" }}>Ver os {TOTAL} arquivos</a>
        </div>
        <div className="odg-hero-meta" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, marginTop: "clamp(40px,6vw,72px)", border: "1px solid var(--line)", background: "var(--line)" }}>
          {([["Arquivos",TOTAL],["Formato",".xmp · .dng"],["Plataforma","LR · ACR"],["Licença","Vitálícia"]] as [string,string|number][]).map(([k, v]) => (
            <div key={String(k)} style={{ background: "var(--bg)", padding: "16px 18px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 7 }}>{k}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--ink)" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- FICHA TECNICA ---- */
function Ficha() {
  return (
    <section id="ficha" style={SECTION}>
      <Head code="REF_02" kicker="Ficha técnica" title={<>Cada arquivo é uma <span style={{ color: "var(--amber)" }}>receita</span>, não um filtro.</>} />
      <div className="odg-ficha" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 1, border: "1px solid var(--line)", background: "var(--line)" }}>
        <div style={{ background: "var(--bg)" }}>
          <BeforeAfter afterImg={P.earth.img} beforeImg={P.earth.raw!} presetName="Earth & Rock" ratio="3 / 2" />
        </div>
        <div style={{ background: "var(--panel)", padding: "clamp(22px,3vw,34px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--amber)", marginBottom: 6 }}>ODG · 08</div>
          <div style={{ fontFamily: "var(--sans)", fontWeight: 600, fontSize: 24, letterSpacing: "-.01em", marginBottom: 18 }}>Earth &amp; Rock</div>
          <Spec k="Equipamento" v="Sony A7 IV" />
          <Spec k="Lente" v="24mm f/4" />
          <Spec k="Preset aplicado" v="ODG · Earth & Rock" accent />
          <Spec k="Nível de grão" v="MÉDIO —————" />
          <Spec k="Aspereza" v="ALTA / mineral" accent />
          <Spec k="Saída" v=".xmp · não destrutivo" />
          <p style={{ margin: "18px 0 0", fontFamily: "var(--sans)", fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)" }}>Acentua o micro-contraste e puxa os tons minerais — laranjas e marrons da rocha nua sob luz direta.</p>
        </div>
      </div>
    </section>
  );
}

/* ---- RAIO-X ---- */
function RaioX() {
  const readout: [string, string][] = [["WB · Temp","5400 K"],["WB · Tint","+6"],["Curva","+12 / -8"],["HSL · Laranja","+18 sat"],["Grão","MÉDIO"]];
  const cols = [
    { tag: "SOLO · RAW",   src: "calib-camera", body: "Câmera · Sony A7 IV",  code: "07 · Golden Light" },
    { tag: "AÉREO · DNG", src: "calib-drone",  body: "Drone · DJI Air 3S",  code: "07 · Golden Light" },
  ];
  return (
    <section id="raiox" style={{ background: "var(--panel)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div style={SECTION}>
        <Head code="CAL_03" kicker="Raio-X de calibração" title={<>Mesmo lugar. Sensores diferentes. <span style={{ color: "var(--amber)" }}>Zero</span> desvio.</>} />
        <p style={{ margin: "-14px 0 36px", maxWidth: "62ch", fontFamily: "var(--sans)", fontSize: "clamp(14px,1.8vw,17px)", lineHeight: 1.6, color: "var(--ink-2)" }}>
          A mesma estrada no Atacama, fotografada do chão (A7 IV) e do ar (DJI Air 3S). Dois sensores, dois arquivos — e a <span style={{ color: "var(--ink)" }}>mesma leitura de cor</span>. É isso que mantém um carretel misto consistente.
        </p>
        <div className="odg-raiox" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, border: "1px solid var(--line)", background: "var(--line)" }}>
          {cols.map((c) => (
            <div key={c.tag} style={{ background: "var(--bg)" }}>
              <div style={{ position: "relative", aspectRatio: "3 / 2", overflow: "hidden" }}>
                <img src={IMG(c.src)} alt={c.tag} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: 12, left: 12, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".16em", color: "var(--ink)", background: "rgba(10,10,11,.62)", border: "1px solid var(--line-2)", padding: "4px 9px" }}>{c.tag}</span>
                <span style={{ position: "absolute", top: 12, right: 12, fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".12em", color: "#0a0a0b", background: "var(--amber)", padding: "4px 9px" }}>ODG · {c.code.split(" · ")[1]}</span>
              </div>
              <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--ink-2)" }}>{c.body}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".12em", color: "var(--ink-3)" }}>{c.code.split(" · ")[0]}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 1, border: "1px solid var(--line)", borderTop: "none", background: "var(--panel-2)", padding: "18px clamp(14px,2vw,22px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--amber)" }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--ink-3)" }}>Leitura do perfil · idêntica nos dois arquivos</span>
          </div>
          <div className="odg-readout" style={{ display: "grid", gridTemplateColumns: `repeat(${readout.length},1fr)`, gap: 1, background: "var(--line)", border: "1px solid var(--line)" }}>
            {readout.map(([k, v]) => (
              <div key={k} style={{ background: "var(--bg)", padding: "12px 14px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 6 }}>{k}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--amber-soft)" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, justifyContent: "center" }}>
          <span style={{ height: 1, flex: 1, background: "var(--line)" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-3)" }}>Δ cor — nulo · mesmo carretel</span>
          <span style={{ height: 1, flex: 1, background: "var(--line)" }} />
        </div>
      </div>
    </section>
  );
}

/* ---- LOG EXPEDICAO ---- */
function LogExp() {
  const rows = [
    { tag: "CONTRALUZ", time: "08:12", env: "Manhã · sol baixo, contra a luz", preset: "High Sun", a: P.highsun.img, b: P.highsun.raw!, note: "Realça as altas-luzes e o brilho do sol da manhã sem estourar — segura o contraluz e mantém o calor da cena." },
    { tag: "NEBLINA",   time: "06:51", env: "Névoa densa · arquivo lavado",   preset: "Fog & Mist", a: P.fog.img, b: P.fog.raw!, note: "Aspecto leitoso cortado. Contraste devolvido sem inventar detalhe que não existe." },
  ];
  return (
    <section id="log" style={SECTION}>
      <Head code="LOG_04" kicker="Log de expedição" title={<>Provado onde <span style={{ color: "var(--amber)" }}>quebra</span>.</>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 1, border: "1px solid var(--line)", background: "var(--line)" }}>
        {rows.map((r, i) => (
          <div key={i} className="odg-log-row" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 1, background: "var(--line)" }}>
            <div style={{ background: "var(--bg)" }}>
              <BeforeAfter afterImg={r.a} beforeImg={r.b} presetName={r.preset} ratio="16 / 10" />
            </div>
            <div style={{ background: "var(--panel)", padding: "clamp(20px,2.6vw,30px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".16em", color: "#0a0a0b", background: "var(--safelight)", padding: "3px 9px" }}>{r.tag}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>T+{r.time}</span>
              </div>
              <Spec k="Condição" v={r.env} />
              <Spec k="Arquivo" v={`ODG · ${r.preset}`} accent />
              <p style={{ margin: "16px 0 0", fontFamily: "var(--sans)", fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)" }}>{r.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---- ARQUIVOS (FILM ROLL) ---- */
interface PresetItem { num: string; name: string; desc: string; after: string; raw: string; blk: string; blkTitle: string; }
const ALL_PRESETS: PresetItem[] = BLOCKS.flatMap(b => b.items.map(it => ({ num: it[0], name: it[1], desc: it[2], after: it[3], raw: it[4], blk: b.code, blkTitle: b.title })));

function Arquivos() {
  const [sel, setSel] = useState<PresetItem>(ALL_PRESETS[0]);
  return (
    <section id="arquivos" style={{ background: "var(--panel)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div style={SECTION}>
        <Head code="IDX_05" kicker={`${TOTAL} arquivos · 6 blocos`} title={<>O carretel <span style={{ color: "var(--amber)" }}>completo</span>.</>} />
        <p style={{ margin: "-14px 0 32px", maxWidth: "58ch", fontFamily: "var(--sans)", fontSize: "clamp(14px,1.8vw,17px)", lineHeight: 1.6, color: "var(--ink-2)" }}>
          Toque em qualquer arquivo abaixo e <span style={{ color: "var(--ink)" }}>arraste pra comparar</span> o RAW original com a versão tratada.
        </p>
        <div style={{ border: "1px solid var(--line)", background: "var(--bg)" }}>
          <BeforeAfter key={sel.num} afterImg={sel.after} beforeImg={sel.raw} presetName={sel.name} ratio="16 / 10" autoplay />
          <div className="odg-arq-cap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "16px clamp(16px,2.2vw,24px)", borderTop: "1px solid var(--line)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, minWidth: 0 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".18em", color: "var(--amber)", flexShrink: 0 }}>ODG · {sel.num}</span>
              <span style={{ fontFamily: "var(--sans)", fontWeight: 600, fontSize: "clamp(17px,2.2vw,22px)", color: "var(--ink)", letterSpacing: "-.01em" }}>{sel.name}</span>
            </div>
            <p style={{ margin: 0, fontFamily: "var(--sans)", fontSize: 13.5, lineHeight: 1.45, color: "var(--ink-3)", maxWidth: "52ch" }}>{sel.desc}</p>
          </div>
        </div>
        <div style={{ marginTop: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-3)" }}>Carretel · {TOTAL} frames</span>
            <span style={{ height: 1, flex: 1, background: "var(--line)" }} />
            <span className="odg-roll-hint" style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ink-4)" }}>← role o filme</span>
          </div>
          <div className="odg-roll">
            <div className="odg-perf" />
            <div className="odg-roll-track">
              {ALL_PRESETS.map(p => {
                const on = sel.num === p.num;
                return (
                  <button key={p.num} className="odg-frame" data-on={on ? "1" : "0"} onClick={() => setSel(p)} aria-label={`${p.num} ${p.name}`}>
                    <div className="odg-frame-img">
                      <img src={IMG(p.after + "-thumb")} alt={p.name} loading="lazy" />
                      <span className="odg-frame-num">{p.num}</span>
                    </div>
                    <span className="odg-frame-cap">{p.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="odg-perf" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- ORIGEM / MANIFESTO ---- */
function Origem() {
  const lineage = [
    { stocks: ["Kodak Portra", "Fuji Pro 400H"], title: "A herança documental",
      body: "Mata o aspecto nítido e artificial do sensor moderno. Corrige os verdes radioativos da vegetação para um oliva e ciano contido — e devolve tons de pele orgânicos.",
      maps: "Blocos 01–04 · Essencial & Documental" },
    { stocks: ["Kodak Gold", "UltraMax"], title: "O calor do 35 mm",
      body: "Simulações de filme de consumo para golden hour e lifestyle: a nostalgia, os desvios químicos e o contraste tátil de acampamento e equipamento.",
      maps: "Blocos 07–09 · 13–15 · 20–21" },
    { stocks: ["Ilford HP5", "Cinema stock"], title: "Textura P&B & cinema",
      body: "Para clima hostil, neblina e alta montanha: estrutura de grão áspero e densidades de sombra lavada, focadas em explodir o micro-contraste na rocha nua.",
      maps: "Blocos 10–12 · 16–17 · P&B" },
  ];
  return (
    <section id="origem" style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--line)" }}>
      <img src={IMG("bg-manifesto")} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,10,11,.88) 0%,rgba(10,10,11,.80) 45%,rgba(10,10,11,.92) 100%),radial-gradient(120% 90% at 100% 100%,rgba(10,10,11,.96) 0%,rgba(10,10,11,0) 45%)" }} />
      <div style={{ position: "relative", ...SECTION }}>
        <Head code="DOC_00" kicker="Sobre o pack" title={<>Do laboratório <span style={{ color: "var(--amber)" }}>para a trilha</span>.</>} />
        <p style={{ margin: "-14px 0 14px", maxWidth: "66ch", fontFamily: "var(--sans)", fontSize: "clamp(15px,2vw,19px)", lineHeight: 1.6, color: "var(--ink)" }}>
          O ODG não nasceu de saturação aleatória nem de filtro genérico. A arquitetura cruza duas realidades: a <span style={{ color: "var(--amber-soft)" }}>engenharia de cor das películas analógicas</span> e as dores técnicas de documentar uma expedição real.
        </p>
        <p style={{ margin: "0 0 40px", maxWidth: "66ch", fontFamily: "var(--sans)", fontSize: "clamp(13px,1.6vw,15px)", lineHeight: 1.6, color: "var(--ink-3)" }}>Cada bloco tem raiz no comportamento físico do filme — mapeado, não imitado.</p>
        <div className="odg-lineage" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, border: "1px solid var(--line)", background: "var(--line)" }}>
          {lineage.map((l, i) => (
            <div key={i} style={{ background: "rgba(18,18,20,.86)", backdropFilter: "blur(2px)", padding: "clamp(22px,2.6vw,30px)", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {l.stocks.map(s => (<span key={s} style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".08em", color: "var(--amber-soft)", border: "1px solid var(--line-2)", padding: "4px 9px" }}>{s}</span>))}
              </div>
              <h3 style={{ margin: 0, fontFamily: "var(--sans)", fontWeight: 600, fontSize: "clamp(18px,2.2vw,22px)", letterSpacing: "-.01em", color: "var(--ink)" }}>{l.title}</h3>
              <p style={{ margin: 0, fontFamily: "var(--sans)", fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", flex: 1 }}>{l.body}</p>
              <div style={{ paddingTop: 14, borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ width: 5, height: 5, background: "var(--amber)", borderRadius: "50%", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".1em", color: "var(--ink-3)" }}>{l.maps}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 1, border: "1px solid var(--line)", borderTop: "none", background: "rgba(18,18,20,.86)", backdropFilter: "blur(2px)", padding: "clamp(22px,3vw,34px)" }}>
          <p style={{ margin: 0, maxWidth: "78ch", fontFamily: "var(--sans)", fontSize: "clamp(15px,1.9vw,19px)", lineHeight: 1.55, color: "var(--ink)" }}>
            Mais do que emular o passado, os 21 arquivos foram estruturados como <span style={{ color: "var(--amber-soft)" }}>ferramentas de salvamento</span> para os piores cenários de luz do outdoor. O resultado é um ecossistema de <span style={{ color: "var(--amber)" }}>Quiet Tech</span>: menos saturação digital, zero floreio artificial, foco absoluto na textura e na crueza do documentarismo.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---- FAQ + FOOTER ---- */
function FaqFooter() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <section id="faq" style={SECTION}>
        <Head code="MAN_06" kicker="Manual técnico" title="Antes de instalar." />
        <div style={{ border: "1px solid var(--line)" }}>
          {FAQ.map(([num, q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={num} style={{ borderBottom: i < FAQ.length - 1 ? "1px solid var(--line)" : "none" }}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} style={{ width: "100%", appearance: "none" as const, border: "none", background: "transparent", cursor: "pointer", textAlign: "left" as const, padding: "20px clamp(18px,2.4vw,28px)", display: "flex", alignItems: "center", gap: 18 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--amber)", flexShrink: 0 }}>{num}</span>
                  <span style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(14px,1.9vw,18px)", color: "var(--ink)", flex: 1 }}>{q}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--ink-3)", transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
                </button>
                {isOpen && <p style={{ margin: 0, padding: "0 clamp(18px,2.4vw,28px) 22px 56px", maxWidth: "72ch", fontFamily: "var(--sans)", fontSize: 14.5, lineHeight: 1.6, color: "var(--ink-2)" }}>{a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section id="checkout" style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--line)", background: "var(--bg)" }}>
        <img src={IMG("bg-texture")} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,10,11,.92) 0%,rgba(10,10,11,.84) 50%,rgba(10,10,11,.94) 100%),radial-gradient(120% 90% at 100% 100%,rgba(10,10,11,.96) 0%,rgba(10,10,11,0) 45%)" }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "clamp(64px,9vw,120px) clamp(20px,5vw,56px)" }}>
          <Corner style={{ padding: "clamp(32px,5vw,64px)", background: "var(--panel)" }}>
            <div className="odg-cta" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "clamp(32px,5vw,64px)", alignItems: "center" }}>
              <div>
                <Tick label="Pack completo · lançamento" />
                <h2 style={{ margin: "18px 0 0", fontFamily: "var(--sans)", fontWeight: 700, fontSize: "clamp(30px,4.6vw,56px)", lineHeight: 1, letterSpacing: "-.03em" }}>
                  {TOTAL} filmstocks.<br /><span style={{ color: "var(--amber)" }}>Um</span> carretel.
                </h2>
                <p style={{ margin: "20px 0 0", maxWidth: "46ch", fontFamily: "var(--sans)", fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)" }}>Sol, neblina, breu e drone — calibrados em expedição real. .xmp + .dng, licença vitálícia, atualizações sem custo.</p>
              </div>
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--line)", border: "1px solid var(--line)", marginBottom: 22 }}>
                  {([["Arquivos", `${TOTAL} presets`],["Formato",".xmp · .dng"],["Compatível","LR Classic · CC · ACR"],["Licença","Pessoal + comercial"]] as [string,string][]).map(([k, v]) => (
                    <div key={k} style={{ background: "var(--bg)", display: "flex", justifyContent: "space-between", padding: "11px 16px" }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ink-3)" }}>{k}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink)" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "17px", background: "var(--amber)", color: "#0a0a0b", fontFamily: "var(--sans)", fontWeight: 600, fontSize: 14, letterSpacing: ".02em", textDecoration: "none" }}>Em breve</a>
                <div style={{ textAlign: "center", marginTop: 11, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-3)" }}>Lançamento em breve · entre na lista sem custo</div>
              </div>
            </div>
          </Corner>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--line)", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px clamp(20px,5vw,56px)" }}>
          <div className="odg-foot" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 32, alignItems: "start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                <span style={{ width: 9, height: 9, border: "1px solid var(--amber)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><span style={{ width: 3, height: 3, background: "var(--amber)", borderRadius: "50%" }} /></span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".22em", color: "var(--ink)" }}>OUTDOOR&nbsp;GRAIN</span>
              </div>
              <p style={{ margin: 0, maxWidth: "38ch", fontFamily: "var(--sans)", fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-3)" }}>Emulações de filme para fotografia de outdoor e expedição. Calibradas em campo por Henrique Sesana.</p>
            </div>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 14 }}>Specs</div>
              {([["FORMATO",".xmp · .dng · .cube"],["PLATAFORMA","LR · ACR · Mobile"],["VERSÃO","1.0 / 2026"]] as [string,string][]).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontFamily: "var(--mono)", fontSize: 11 }}>
                  <span style={{ color: "var(--ink-3)" }}>{k}</span><span style={{ color: "var(--ink-2)" }}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 14 }}>Contato</div>
              <a href="mailto:contato@euhenriq.com" style={{ display: "block", fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-2)", textDecoration: "none", padding: "6px 0" }}>contato@euhenriq.com</a>
              <a href="https://instagram.com/euhenriq" target="_blank" rel="noopener noreferrer" style={{ display: "block", fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-2)", textDecoration: "none", padding: "6px 0" }}>@euhenriq</a>
            </div>
          </div>
          <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".14em", color: "var(--ink-4)" }}>© 2026 EU HENRIQ — TODOS OS DIREITOS RESERVADOS</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".14em", color: "var(--ink-4)" }}>23°33′S · 46°38′W · ALT 760M</span>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ---- PAGE EXPORT ---- */
export default function OutdoorGrainPage() {
  return (
    <div
      className={[styles.odg, spaceGrotesk.variable, ibmPlexMono.variable].join(" ")}
      style={{ ["--mono" as string]: "var(--odg-mono, 'IBM Plex Mono', ui-monospace, monospace)", ["--sans" as string]: "var(--odg-sans, 'Space Grotesk', system-ui, sans-serif)" }}
    >
      <Nav />
      <Hero />
      <Ficha />
      <RaioX />
      <LogExp />
      <Origem />
      <Arquivos />
      <FaqFooter />
    </div>
  );
}
// test line
