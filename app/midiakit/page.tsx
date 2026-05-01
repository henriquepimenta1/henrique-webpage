"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─── types ─── */
interface Post {
  id: string;
  url: string;
  caption: string;
  reach: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
}

interface BrandWork {
  brand: string;
  detail: string;
  type: string;
  product: string;
  description: string;
  stats: { label: string; value: string }[];
  postUrl: string;
  photos: { src: string; caption: string }[];
}

interface LightboxState {
  work: BrandWork;
  photoIdx: number;
}

/* ─── data — atualizado via Windsor.ai · abril/2026 ─── */

const REACH_DAILY = [4704,5897,11425,9388,11579,12640,9662,6155,5175,6006,11242,10477,7055,7036,5765,5617,6084,8688,10050,6897,7470,4408,5135,4425,4399,2867,1560,3304,4365,1897];

const TOP_POSTS: Post[] = [
  { id: "DVjv2OIAWjh", url: "https://www.instagram.com/reel/DVjv2OIAWjh/", caption: "Escalando Cabeça de Peixe — Serra dos Órgãos", reach:11352, likes:1540, comments:53, saves:112, shares:204 },
  { id: "DQW1SHdjVkf", url: "https://www.instagram.com/reel/DQW1SHdjVkf/", caption: "Atravessando os Lençóis Maranhenses — Ep. 1",  reach:6857,  likes:481,  comments:51, saves:25,  shares:81  },
  { id: "DTd5iA1EnbI", url: "https://www.instagram.com/reel/DTd5iA1EnbI/", caption: "Cabeça de Peixe — plano B virou a melhor aventura", reach:5911, likes:447, comments:27, saves:20, shares:27 },
  { id: "DU3_3nKkh-W", url: "https://www.instagram.com/reel/DU3_3nKkh-W/", caption: "Memories of Peru — Cordilheira de Huayhuash",  reach:4684,  likes:412,  comments:25, saves:28,  shares:15  },
];

const DESTINATIONS = [
  { name: "Lençóis Maranhenses", loc: "MA, Brasil", note: "UNESCO · agosto/2026", upcoming: true },
  { name: "Parque Nacional do Itatiaia", loc: "RJ, Brasil", note: "2.791m" },
  { name: "Serra dos Órgãos", loc: "RJ, Brasil", note: "Cabeça de Peixe" },
  { name: "Serra do Ibitiraquire", loc: "PR, Brasil", note: "Pico Paraná · 1.877m" },
  { name: "Serra do Mar", loc: "SP/RJ, Brasil", note: "Travessia" },
  { name: "Serra da Bocaina", loc: "SP/RJ, Brasil", note: "Trilha Ouro" },
  { name: "Serra Fina", loc: "MG, Brasil", note: "Travessia" },
  { name: "Cordillera Blanca", loc: "Peru", note: "5.000m+" },
  { name: "Cordillera Huayhuash", loc: "Peru", note: "Circuito" },
  { name: "Atacama", loc: "Chile", note: "5.592m · maio/2026", upcoming: true },
];

const SERVICES = [
  { name: "Reels de Expedição",           desc: "Vídeos cinematográficos 15–60s com narrativa emocional" },
  { name: "Drone Cinematography",         desc: "Captação aérea profissional com DJI Air 3S" },
  { name: "Carrosséis de Destino",        desc: "Séries fotográficas editoriais para Instagram" },
  { name: "Licenciamento de Conteúdo",    desc: "Uso em campanhas, sites e materiais da marca" },
  { name: "Conteúdo Bilíngue PT/EN",      desc: "Criação e adaptação para mercado internacional" },
  { name: "Guia de Expedição + Produção", desc: "Logística completa + produção audiovisual integrada" },
];

const GEAR = [
  { name: "Sony A7 IV",      cat: "Câmera principal" },
  { name: "DJI Air 3S",      cat: "Drone cinematográfico" },
  { name: "Comica VM40",     cat: "Áudio 32-bit float" },
  { name: "DaVinci Resolve", cat: "Pós-produção" },
  { name: "Lightroom",       cat: "Presets próprios" },
];

const BRAND_WORKS: BrandWork[] = [
  {
    brand: "Aiuruocan", detail: "Parceria de campo", type: "Vestuário Outdoor", product: "White Melton",
    description: "Moletom em unifloc de garrafas PET recicladas — 84% algodão + 16% poliéster. Testado na Travessia Marins × Itaguaré, Serra da Mantiqueira.",
    stats: [{ label: "Curtidas", value: "276" }, { label: "Alcance", value: "3.757" }, { label: "Salvos", value: "20" }, { label: "Compartilhamentos", value: "25" }],
    postUrl: "https://www.instagram.com/reel/DKXZmtdO2d9/",
    photos: [
      { src: "/images/work/AIUR/MOLETON_MELTON/MOLETON-MELTON-001.jpg", caption: "White Melton em campo — Travessia Marins × Itaguaré" },
      { src: "/images/work/AIUR/MOLETON_MELTON/MOLETON-MELTON-002.jpg", caption: "Tecido unifloc — reciclagem de garrafas PET" },
      { src: "/images/work/AIUR/MOLETON_MELTON/MOLETON-MELTON-003.jpg", caption: "Serra da Mantiqueira · altitude e conforto" },
    ],
  },
  {
    brand: "O Boticário", detail: "Campanha de produto", type: "Beauty & Lifestyle", product: "Arbo Puro — Desodorante Colônia 100ml",
    description: "92% ingredientes naturais com refil — fusão do bambu com notas cítricas. Filmado no Rio Marcolino, Mata Atlântica.",
    stats: [{ label: "Curtidas", value: "2.277" }, { label: "Comentários", value: "107" }],
    postUrl: "https://www.instagram.com/reel/C3LBa1oMmu6/",
    photos: [
      { src: "/images/work/OBOTICARIO/OBOTICARIO-001.jpg", caption: "Arbo Puro — a essência da natureza ao alcance das mãos" },
      { src: "/images/work/OBOTICARIO/OBOTICARIO-002.jpg", caption: "Rio Marcolino · Mata Atlântica, São Paulo" },
      { src: "/images/work/OBOTICARIO/OBOTICARIO-003.jpg", caption: "92% ingredientes naturais · com refil" },
    ],
  },
  {
    brand: "OMA Gear", detail: "Conteúdo de campo", type: "Gear & Equipamento", product: "Kit Cozinha Ultra Leve",
    description: "149g no total: panela 600ml (112g) + Cone Caldera Inka (22g) + fogareiro ultracompacto (15g).",
    stats: [{ label: "Curtidas", value: "217" }, { label: "Comentários", value: "20" }, { label: "Compartilhamentos", value: "4" }],
    postUrl: "https://www.instagram.com/reel/DQC7JWfCYtD/",
    photos: [
      { src: "/images/work/OMA-GEAR/OMA-GEAR-001.jpg", caption: "Kit Cozinha Ultra Leve — 149g no total" },
      { src: "/images/work/OMA-GEAR/OMA-GEAR-002.jpg", caption: "Panela 600ml + Cone Caldera Inka + fogareiro" },
      { src: "/images/work/OMA-GEAR/OMA-GEAR-003.jpg", caption: "Testado em campo — menos peso, mais liberdade" },
    ],
  },
  {
    brand: "Brightin Star", detail: "Óptica · parceria", type: "Equipamento Fotográfico", product: "Lente 16mm f/2.8",
    description: "Wide manual com sharpness excelente ao centro desde f/2.8. Testada em Sony A7 IV no centro de SP.",
    stats: [{ label: "Curtidas", value: "370" }, { label: "Alcance", value: "4.053" }, { label: "Salvos", value: "31" }, { label: "Compartilhamentos", value: "31" }],
    postUrl: "https://www.instagram.com/reel/DPSo5_iDSmY/",
    photos: [
      { src: "/images/work/BRIGHTIN-STAR/BRIGHTIN-STAR-001.jpg", caption: "Brightin Star 16mm f/2.8 — review real, centro de SP" },
      { src: "/images/work/BRIGHTIN-STAR/BRIGHTIN-STAR-002.jpg", caption: "Sharpness e bokeh — Sony A7 IV handheld" },
    ],
  },
  {
    brand: "Botas Vento", detail: "Conteúdo de campo", type: "Calçados Outdoor", product: "Titan",
    description: "Conteúdo cinematográfico de campo — pedra, lama, cansaço real. #voudeVENTO",
    stats: [{ label: "Curtidas", value: "599" }, { label: "Comentários", value: "18" }],
    postUrl: "https://www.instagram.com/reel/DLXYsDvOG28/",
    photos: [
      { src: "/images/work/BOTAS-VENTO/BOTA-TITAN/BOTA-TITAN-001.jpg", caption: "Titan em terreno técnico — pedra, lama e trilha real" },
      { src: "/images/work/BOTAS-VENTO/BOTA-TITAN/BOTA-TITAN-002.jpg", caption: "Conteúdo cinematográfico de campo — #voudeVENTO" },
      { src: "/images/work/BOTAS-VENTO/BOTA-TITAN/BOTA-TITAN-003.jpg", caption: "Resistir, apoiar e seguir firme" },
    ],
  },
  {
    brand: "K&F Concept", detail: "Sponsor ativo · cupom HENRIQ", type: "Equipamento Fotográfico", product: "Tripé Omni Series + Cabeça FH03",
    description: "Fibra de carbono — 1,64kg total com cabeça hidráulica FH03. Cupom HENRIQ · 18% off.",
    stats: [{ label: "Curtidas", value: "285" }, { label: "Comentários", value: "16" }],
    postUrl: "https://www.instagram.com/p/DW7asyXDejY/?img_index=1",
    photos: [
      { src: "/images/work/KNF-CONCEPT/KNF-CONCEPT-001.jpg", caption: "K&F Omni Series — fibra de carbono 1,64kg em campo" },
      { src: "/images/work/KNF-CONCEPT/KNF-CONCEPT-002.jpg", caption: "Cabeça hidráulica FH03 — suporta 5kg" },
      { src: "/images/work/KNF-CONCEPT/KNF-CONCEPT-003.jpg", caption: "Review completo — Sony A7 IV + tripé profissional" },
    ],
  },
  {
    brand: "Alto Estilo", detail: "Editorial de moda outdoor", type: "Moda & Equipamento", product: "Mochila Ataque 40+5L",
    description: "Cordura® 500D — testada em ataque à Pedra Furada (PNI) e camping de 3 dias.",
    stats: [{ label: "Curtidas", value: "260" }, { label: "Alcance", value: "3.423" }, { label: "Salvos", value: "16" }],
    postUrl: "https://www.instagram.com/p/DM_DwNAJ306/?img_index=1",
    photos: [
      { src: "/images/work/ALTO-ESTILO/ALTO-ESTILO-001.jpg", caption: "Mochila Ataque 40+5L — testada no Itatiaia" },
      { src: "/images/work/ALTO-ESTILO/ALTO-ESTILO-002.jpg", caption: "Pochete Hidro adaptada para drone Air 3S" },
      { src: "/images/work/ALTO-ESTILO/ALTO-ESTILO-003.jpg", caption: "Cordura® 500D — 3 dias de camping" },
    ],
  },
];

const WA = "https://wa.me/5511988128064";

/* ─── count-up hook ─── */
function useCountUp(target: number, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [active, target, duration]);
  return val;
}

/* ─── intersection observer hook ─── */
function useVisible(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── fade-in wrapper ─── */
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useVisible(0.15);
  return (
    <div ref={ref} style={{
      /* transform + opacity apenas — sem width/height/padding */
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity .65s ${delay}s, transform .65s ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ─── section label ─── */
function SectionLabel({ n, text }: { n: string; text: string }) {
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--ashe-dim)", marginBottom: 40, display: "flex", alignItems: "center", gap: 16 }}>
      <span>{n}</span>
      <span style={{ flex: 1, height: 1, background: "var(--line-dark)" }} />
      <span>{text}</span>
    </div>
  );
}

/* ─── metric card ─── */
function MetricCard({ label, value, suffix = "", prefix = "" }: { label: string; value: number; suffix?: string; prefix?: string }) {
  const { ref, visible } = useVisible();
  const count = useCountUp(value, 1600, visible);
  return (
    <div ref={ref} style={{
      background: "rgba(255,255,255,.04)",
      border: "1px solid var(--line-dark)",
      borderRadius: 2,
      padding: "28px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--ashe-dim)" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-.04em", color: "var(--canvas)", lineHeight: 1 }}>
        {prefix}{count.toLocaleString("pt-BR")}{suffix}
      </span>
    </div>
  );
}

/* ─── sparkline ─── */
function Sparkline({ data }: { data: number[] }) {
  const { ref, visible } = useVisible(0.3);
  const max = Math.max(...data);
  const min = Math.min(...data);
  const W = 600, H = 80;
  const px = (i: number) => (i / (data.length - 1)) * W;
  const py = (v: number) => H - ((v - min) / (max - min)) * (H - 8) - 4;
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
  const area = `${path} L${W},${H} L0,${H} Z`;
  return (
    <div ref={ref} style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 280, height: 80, display: "block" }}>
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--rust)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--rust)" stopOpacity="0" />
          </linearGradient>
          <clipPath id="spark-clip">
            <rect x="0" y="0" width={visible ? W : 0} height={H} style={{ transition: "width 1.4s ease" }} />
          </clipPath>
        </defs>
        <path d={area} fill="url(#spark-fill)" clipPath="url(#spark-clip)" />
        <path d={path} fill="none" stroke="var(--rust)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#spark-clip)" />
        {data.map((v, i) => (
          <circle key={i} cx={px(i)} cy={py(v)} r="2.5" fill="var(--rust)" opacity={visible ? 0.7 : 0}
            style={{ transition: `opacity .3s ${i * 0.04}s` }} />
        ))}
      </svg>
    </div>
  );
}

/* ─── post card ─── */
function PostCard({ post }: { post: Post }) {
  const [hovered, setHovered] = useState(false);
  const eng = ((post.likes + post.comments + post.saves + post.shares) / post.reach * 100).toFixed(1);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", overflow: "hidden", borderRadius: 2,
        background: "var(--forest)", border: "1px solid var(--line-dark)",
        height: 480, cursor: "pointer",
        /* transform+opacity — sem layout props */
        transition: "transform .25s, box-shadow .25s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,.5)" : "0 2px 12px rgba(0,0,0,.3)",
      }}
    >
      <iframe src={`https://www.instagram.com/reel/${post.id}/embed/`}
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        scrolling="no" allowFullScreen loading="lazy" />
      <div style={{
        position: "absolute", inset: 0,
        /* overlay de var(--forest) */
        background: hovered ? "rgba(30,42,24,.9)" : "transparent",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: 16, gap: 8,
        pointerEvents: hovered ? "auto" : "none",
        transition: "background .2s",
      }}>
        {hovered && <>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--canvas)", margin: 0, lineHeight: 1.35 }}>{post.caption}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[["Alcance", post.reach.toLocaleString("pt-BR")], ["Curtidas", post.likes], ["Salvos", post.saves], ["Engaj.", `${eng}%`]].map(([k, v]) => (
              <div key={String(k)} style={{ fontFamily: "var(--font-mono)", fontSize: 9 }}>
                <div style={{ color: "var(--ashe-dim)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 1, fontSize: 8 }}>{k}</div>
                <div style={{ color: "var(--canvas)", fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
          <a href={post.url} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--rust)", textDecoration: "none" }}>
            Ver no Instagram →
          </a>
        </>}
      </div>
    </div>
  );
}

/* ─── brand work card ─── */
function BrandWorkCard({ work, delay, onOpen }: { work: BrandWork; delay: number; onOpen: (w: BrandWork, i: number) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onClick={() => onOpen(work, 0)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          overflow: "hidden", borderRadius: 2, cursor: "pointer",
          border: `1px solid ${hovered ? "rgba(166,84,43,.5)" : "var(--line-dark)"}`,
          background: hovered ? "rgba(166,84,43,.04)" : "transparent",
          /* transform+opacity */
          transition: "border-color .2s, background .2s, transform .25s",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
        }}
      >
        <div style={{ position: "relative", aspectRatio: "4/5", background: "var(--forest-soft)", overflow: "hidden" }}>
          <Image src={work.photos[0].src} alt={work.product} fill
            style={{ objectFit: "cover", objectPosition: "center",
              /* transform apenas — sem scale de layout */
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform .4s ease",
            }} />
          <div style={{
            position: "absolute", inset: 0,
            /* overlay de var(--forest) */
            background: hovered ? "rgba(30,42,24,.55)" : "rgba(30,42,24,.15)",
            transition: "background .25s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {hovered && (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--canvas)", border: "1px solid rgba(232,223,201,.4)", padding: "8px 16px", borderRadius: 2 }}>
                Ver trabalho
              </div>
            )}
          </div>
          {work.photos.length > 1 && (
            <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(30,42,24,.8)" /* overlay forest */, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".14em", color: "var(--ashe)", padding: "4px 8px", borderRadius: 2 }}>
              {work.photos.length} fotos
            </div>
          )}
        </div>
        <div style={{ padding: "16px 18px 18px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ashe-dim)", marginBottom: 5 }}>{work.type}</div>
          <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: "var(--canvas)", marginBottom: 2 }}>{work.brand}</div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--rust-soft)", marginBottom: 8 }}>{work.product}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".14em", color: "var(--ashe-dim)" }}>{work.detail}</div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── lightbox ─── */
function BrandLightbox({ state, onClose }: { state: LightboxState; onClose: () => void }) {
  const { work, photoIdx: initialIdx } = state;
  const [idx, setIdx] = useState(initialIdx);
  const photo = work.photos[idx];
  const multi = work.photos.length > 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && multi) setIdx(i => (i + 1) % work.photos.length);
      if (e.key === "ArrowLeft"  && multi) setIdx(i => (i - 1 + work.photos.length) % work.photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [work.photos.length, multi, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(11,10,8,.97)" /* rgba de var(--ink) */, backdropFilter: "blur(20px)", overflowY: "auto", padding: 16 }}>
      <style>{`
        @keyframes lb-in  { from { opacity:0 } to { opacity:1 } }
        @keyframes lb-img { from { transform:scale(.97);opacity:0 } to { transform:scale(1);opacity:1 } }
        .lb-inner { animation:lb-in .18s ease; max-width:1100px; margin:0 auto; display:flex; flex-direction:column; min-height:100%; justify-content:center; }
        .lb-img-k { animation:lb-img .22s ease; }
        .lb-grid  { display:grid; grid-template-columns:1fr 300px; gap:24px; align-items:start; }
        .lb-thumbs { display:flex; gap:6px; }
        @media(max-width:700px){ .lb-grid{grid-template-columns:1fr!important;} .lb-thumbs{justify-content:center;} }
      `}</style>
      <div className="lb-inner" onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, paddingBottom:16, borderBottom:"1px solid var(--line-dark)" }}>
          <div>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".28em", textTransform:"uppercase", color:"var(--ashe-dim)", marginBottom:4 }}>{work.type}</div>
            <div style={{ fontFamily:"var(--font-ui)", fontWeight:700, fontSize:16, color:"var(--canvas)" }}>
              {work.brand} <span style={{ color:"var(--rust)" }}>·</span> {work.product}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"1px solid rgba(232,223,201,.2)", color:"var(--ashe-dim)", cursor:"pointer", fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".2em", textTransform:"uppercase", padding:"8px 16px", borderRadius:2 }}>
            Fechar · ESC
          </button>
        </div>

        <div className="lb-grid">
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div className="lb-img-k" key={idx} style={{ position:"relative", background:"var(--forest)", borderRadius:2, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <img src={photo.src} alt={photo.caption} style={{ display:"block", width:"100%", height:"auto", maxHeight:"65vh", objectFit:"contain" }} />
              {multi && <>
                <button onClick={() => setIdx(i => (i - 1 + work.photos.length) % work.photos.length)}
                  style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", background:"rgba(30,42,24,.8)" /* overlay forest */, border:"1px solid var(--line-dark)", color:"var(--canvas)", width:36, height:36, borderRadius:2, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", zIndex:2 }}>←</button>
                <button onClick={() => setIdx(i => (i + 1) % work.photos.length)}
                  style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"rgba(30,42,24,.8)" /* overlay forest */, border:"1px solid var(--line-dark)", color:"var(--canvas)", width:36, height:36, borderRadius:2, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", zIndex:2 }}>→</button>
              </>}
            </div>
            <p style={{ fontFamily:"var(--font-ui)", fontSize:12, color:"var(--ashe-dim)", lineHeight:1.4, margin:0, textAlign:"center" }}>{photo.caption}</p>
            {multi && (
              <div className="lb-thumbs">
                {work.photos.map((p, i) => (
                  <button key={i} onClick={() => setIdx(i)} style={{ flex:1, maxWidth:80, aspectRatio:"1", overflow:"hidden", borderRadius:2, cursor:"pointer", padding:0, border: i===idx ? "2px solid var(--rust)" : "2px solid var(--line-dark)", transition:"border-color .2s", background:"var(--forest-soft)" }}>
                    <img src={p.src} alt={p.caption} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".2em", textTransform:"uppercase", color:"var(--ashe-dim)", marginBottom:8 }}>Produto</div>
              <div style={{ fontFamily:"var(--font-ui)", fontWeight:600, fontSize:14, color:"var(--canvas)", marginBottom:10 }}>{work.product}</div>
              <p style={{ fontFamily:"var(--font-ui)", fontSize:12, color:"var(--ashe-dim)", lineHeight:1.65, margin:0 }}>{work.description}</p>
            </div>
            <div style={{ borderTop:"1px solid var(--line-dark)", paddingTop:16 }}>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".2em", textTransform:"uppercase", color:"var(--ashe-dim)", marginBottom:12 }}>Métricas</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {work.stats.map(s => (
                  <div key={s.label} style={{ background:"rgba(255,255,255,.03)", border:"1px solid var(--line-dark)", borderRadius:2, padding:"10px 12px" }}>
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:7, letterSpacing:".18em", textTransform:"uppercase", color:"var(--ashe-dim)", marginBottom:4 }}>{s.label}</div>
                    <div style={{ fontFamily:"var(--font-ui)", fontWeight:700, fontSize:18, color:"var(--canvas)", letterSpacing:"-.03em" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <a href={work.postUrl} target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:10, background:"var(--rust)", color:"var(--canvas)", fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", textDecoration:"none", padding:"14px 20px", borderRadius:2, transition:"background .2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--rust-soft)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--rust)")}
            >
              Ver no Instagram →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function MidiaKitPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const openLightbox = useCallback((work: BrandWork, idx: number) => setLightbox({ work, photoIdx: idx }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main style={{ background: "var(--forest)", color: "var(--canvas)", fontFamily: "var(--font-ui)", overflowX: "hidden" }}>
      {/*
        NOTA: token '#10008' mencionado no plano não foi encontrado neste arquivo.
        Verificar outros arquivos do projeto (ex: componentes, layout.tsx).
      */}
      <style>{`
        .mk-section      { padding: 100px 56px; border-bottom: 1px solid rgba(232,223,201,.08); }
        .mk-metrics      { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        .mk-services     { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
        .mk-destinations { display: grid; grid-template-columns: repeat(5,1fr); gap: 12px; }
        .mk-gear         { display: grid; grid-template-columns: repeat(5,1fr); gap: 10px; }
        .mk-works        { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        .mk-bio-grid     { display: grid; grid-template-columns: 1fr 380px; gap: 64px; align-items: start; }
        .mk-photos       { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .mk-two-col      { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .mk-traj-grid    { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
        .mk-posts        { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        @media(max-width:1100px){
          .mk-destinations { grid-template-columns:repeat(3,1fr)!important; }
          .mk-posts        { grid-template-columns:repeat(2,1fr)!important; }
          .mk-works        { grid-template-columns:repeat(3,1fr)!important; }
        }
        @media(max-width:900px){
          .mk-bio-grid  { grid-template-columns:1fr!important; gap:32px!important; }
          .mk-metrics   { grid-template-columns:repeat(2,1fr)!important; }
          .mk-services  { grid-template-columns:1fr 1fr!important; }
          .mk-destinations { grid-template-columns:1fr 1fr!important; }
          .mk-gear      { grid-template-columns:repeat(2,1fr)!important; }
          .mk-works     { grid-template-columns:repeat(2,1fr)!important; }
          .mk-section   { padding:72px 24px!important; }
          .mk-two-col   { grid-template-columns:1fr!important; }
          .mk-traj-grid { grid-template-columns:1fr!important; }
        }
        @media(max-width:600px){
          .mk-posts    { grid-template-columns:1fr!important; }
          .mk-metrics  { grid-template-columns:1fr 1fr!important; }
          .mk-services { grid-template-columns:1fr!important; }
          .mk-gear     { grid-template-columns:1fr 1fr!important; }
          .mk-works    { grid-template-columns:1fr 1fr!important; }
          .mk-section  { padding:56px 20px!important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <header style={{ position:"fixed", top:0, left:0, right:0, height:60, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 clamp(16px,4vw,40px)", zIndex:50, background:"rgba(30,42,24,.9)" /* overlay forest */, backdropFilter:"blur(12px)", borderBottom:"1px solid var(--line-dark)" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:28, height:28, border:"1.5px solid var(--ashe)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:16, fontWeight:500, color:"var(--ashe)" }}>H</div>
        </Link>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".28em", textTransform:"uppercase", color:"var(--ashe-dim)" }}>Media Kit · 2026</span>
        <a href={WA} target="_blank" rel="noopener noreferrer" style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:"var(--rust)", textDecoration:"none", border:"1px solid rgba(166,84,43,.4)", padding:"6px 14px" }}>Contato</a>
      </header>

      {/* ════════ 1. HERO ════════ */}
      <section ref={heroRef} style={{ position:"relative", minHeight:"100svh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"0 clamp(20px,5vw,56px) clamp(48px,8vw,80px)", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, zIndex:0 }}>
          <Image src="/images/exp-huayhuash.jpg" alt="Expedição nos Andes" fill priority
            style={{ objectFit:"cover", objectPosition:"center", transform:`translateY(${scrollY * 0.25}px)`, transition:"transform 0s linear" }} />
          {/* gradiente: rgba de var(--ink) #0B0A08 */}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(11,10,8,1) 0%, rgba(11,10,8,.7) 40%, rgba(11,10,8,.3) 100%)" }} />
        </div>
        <div style={{ position:"relative", zIndex:1, maxWidth:900 }}>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".28em", textTransform:"uppercase", color:"var(--ashe-dim)", marginBottom:24 }}>Media Kit · Abril 2026</div>
          <h1 style={{ margin:"0 0 8px", lineHeight:.85 }}>
            <span style={{ fontFamily:"var(--font-hand)", fontSize:"clamp(52px,8vw,88px)", color:"var(--ashe)", display:"block", marginBottom:4 }}>Adventure Filmmaker</span>
            <span style={{ fontFamily:"var(--font-ui)", fontWeight:700, fontSize:"clamp(64px,12vw,152px)", letterSpacing:"-.05em", textTransform:"uppercase", display:"block", color:"var(--canvas)" }}>HENRIQUE</span>
            <span style={{ fontFamily:"var(--font-ui)", fontWeight:700, fontSize:"clamp(64px,12vw,152px)", letterSpacing:"-.05em", textTransform:"uppercase", display:"block", color:"var(--rust)" }}>SESANA</span>
          </h1>
          <div style={{ marginTop:32, display:"flex", gap:32, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:".18em", color:"var(--ashe-dim)" }}>Trekking · Montanhismo · Cinematografia</span>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:".18em", color:"var(--stone)" }}>São Paulo, Brasil</span>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:".18em", color:"var(--stone)" }}>PT · EN</span>
          </div>
        </div>
        <div style={{ position:"absolute", bottom:32, right:56, zIndex:1, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".2em", textTransform:"uppercase", color:"var(--stone)" }}>@henriq.eu</span>
          <div style={{ width:1, height:48, background:"var(--line-dark)" }} />
        </div>
      </section>

      {/* ════════ 2. BIO ════════ */}
      <section className="mk-section">
        <FadeIn><SectionLabel n="01" text="Sobre" /></FadeIn>
        <div className="mk-bio-grid">
          <FadeIn>
            <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"clamp(17px,2.2vw,22px)", lineHeight:1.65, letterSpacing:"-.01em", color:"var(--canvas)", margin:"0 0 24px" }}>
              Sou fotógrafo, filmmaker e contador de histórias visuais que nascem da terra, do vento e do tempo. Minha estética é contemplativa, minimalista e profundamente conectada à natureza.
            </p>
            <p style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(13px,1.6vw,15px)", lineHeight:1.7, color:"var(--ashe-dim)", margin:"0 0 20px" }}>
              As cores que escolho dialogam com o ambiente: verdes densos, tons de areia, luz natural e texturas reais. Valorizo a composição espontânea, o detalhe que o olho quase não vê, o instante que carrega uma presença sutil.
            </p>
            <p style={{ fontFamily:"var(--font-ui)", fontSize:"clamp(13px,1.6vw,15px)", lineHeight:1.7, color:"var(--ashe-dim)", margin:"0 0 32px" }}>
              Em agosto de 2026, volto aos Lençóis Maranhenses para guiar três grupos com fotografia integrada — travessia com produção própria de ponta a ponta.
            </p>
            <span style={{ fontFamily:"var(--font-hand)", fontSize:34, color:"var(--rust-soft)", display:"inline-block", transform:"rotate(-2deg)" }}>— Henrique</span>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="mk-photos">
              <div style={{ position:"relative", borderRadius:2, overflow:"hidden", aspectRatio:"3/4" }}>
                <Image src="/images/henrique-portrait-1.jpg" alt="Henrique Sesana em expedição" fill style={{ objectFit:"cover", objectPosition:"center top" }} />
              </div>
              <div style={{ position:"relative", borderRadius:2, overflow:"hidden", aspectRatio:"3/4", marginTop:32 }}>
                <Image src="/images/henrique-portrait-2.jpg" alt="Henrique Sesana na montanha" fill style={{ objectFit:"cover", objectPosition:"center top" }} />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════ 3. FILOSOFIA ════════ */}
      <section className="mk-section" style={{ background:"rgba(166,84,43,.04)" }}>
        <FadeIn>
          <SectionLabel n="02" text="Estado de Presença" />
          <div className="mk-two-col">
            <div>
              <h2 style={{ fontFamily:"var(--font-hand)", fontSize:"clamp(36px,5vw,64px)", color:"var(--canvas)", margin:"0 0 24px", lineHeight:1.1, transform:"rotate(-1deg)", display:"inline-block" }}>
                Sentir o local através da imagem
              </h2>
              <p style={{ fontFamily:"var(--font-ui)", fontSize:14, lineHeight:1.75, color:"var(--ashe-dim)", margin:0 }}>
                Minha criação parte de um princípio simples: você não precisa ter estado lá para sentir que estava. Cada frame carrega a temperatura do ar, o peso do silêncio, o cheiro da terra molhada.
              </p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { title:"Lugares que as pessoas não imaginam", desc:"Mostro destinos que saem do roteiro turístico convencional — serras remotas, travessias sem nome, paisagens que exigem dois dias de caminhada." },
                { title:"Relatos pessoais como narrativa",     desc:"Cada expedição tem uma história humana. Não documento apenas o visual — documento a jornada, o cansaço, a recompensa." },
                { title:"Presença como método",                desc:"Aprofundo meu olhar através de referências do cinema contemplativo, da arte minimalista e do design orgânico." },
              ].map(item => (
                /*
                  CORREÇÃO impeccable BAN 1: border-left removido.
                  Substituído por background tint no container inteiro.
                */
                <div key={item.title} style={{ background:"rgba(166,84,43,.06)", borderRadius:2, padding:"16px 20px" }}>
                  <div style={{ fontFamily:"var(--font-ui)", fontWeight:600, fontSize:13, color:"var(--canvas)", marginBottom:6 }}>{item.title}</div>
                  <div style={{ fontFamily:"var(--font-ui)", fontSize:12, lineHeight:1.6, color:"var(--ashe-dim)" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ════════ 4. EQUIPAMENTO ════════ */}
      <section className="mk-section">
        <FadeIn><SectionLabel n="03" text="Equipamento" /></FadeIn>
        <div className="mk-gear">
          {GEAR.map((g, i) => (
            <FadeIn key={g.name} delay={i * 0.07}>
              <div style={{ border:"1px solid var(--line-dark)", padding:"20px 18px", borderRadius:2 }}>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".2em", textTransform:"uppercase", color:"var(--ashe-dim)", marginBottom:8 }}>{g.cat}</div>
                <div style={{ fontFamily:"var(--font-ui)", fontWeight:600, fontSize:13, color:"var(--canvas)" }}>{g.name}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════ 5. MÉTRICAS ════════ */}
      <section className="mk-section">
        <FadeIn><SectionLabel n="04" text="Instagram · Abril 2026" /></FadeIn>
        <div className="mk-metrics" style={{ marginBottom:24 }}>
          <MetricCard label="Seguidores"     value={12388} />
          <MetricCard label="Reach mensal"   value={201372} />
          <MetricCard label="Interações/mês" value={34139} />
          <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid var(--line-dark)", borderRadius:2, padding:"28px 24px", display:"flex", flexDirection:"column", gap:8 }}>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".22em", textTransform:"uppercase", color:"var(--ashe-dim)" }}>Engagement rate</span>
            <span style={{ fontFamily:"var(--font-ui)", fontWeight:700, fontSize:"clamp(28px,4vw,42px)", letterSpacing:"-.04em", color:"var(--canvas)", lineHeight:1 }}>17,0%</span>
          </div>
        </div>
        <div className="mk-metrics" style={{ marginBottom:40 }}>
          <MetricCard label="Reach médio/dia"     value={6712} />
          <MetricCard label="Novos seguidores/mês" value={2848} prefix="+" />
          <MetricCard label="Posts publicados"     value={432} />
          <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid var(--line-dark)", borderRadius:2, padding:"28px 24px", display:"flex", flexDirection:"column", gap:8 }}>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".22em", textTransform:"uppercase", color:"var(--ashe-dim)" }}>Tipo de conta</span>
            <span style={{ fontFamily:"var(--font-hand)", fontSize:28, color:"var(--rust)", lineHeight:1 }}>Creator</span>
          </div>
        </div>
        <FadeIn delay={0.2}>
          <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid var(--line-dark)", borderRadius:2, padding:"32px 28px" }}>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".22em", textTransform:"uppercase", color:"var(--ashe-dim)", marginBottom:20 }}>Reach diário — abril 2026</div>
            <Sparkline data={REACH_DAILY} />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:8, color:"var(--stone)" }}>1 abr</span>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:8, color:"var(--stone)" }}>30 abr</span>
            </div>
            <p style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".14em", color:"var(--stone)", marginTop:16, marginBottom:0 }}>Dados via Windsor.ai — atualização abril/2026</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div style={{ marginTop:20, padding:"18px 24px", border:"1px solid rgba(166,84,43,.3)", borderRadius:2, background:"rgba(166,84,43,.04)", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--rust)", flexShrink:0, boxShadow:"0 0 8px rgba(166,84,43,.6)" }} />
            <span style={{ fontFamily:"var(--font-mono)", fontSize:10, letterSpacing:".14em", color:"var(--ashe-dim)" }}>
              +2.848 seguidores em abril/2026. Alcance orgânico 201k em expansão semana a semana.
            </span>
          </div>
        </FadeIn>
      </section>

      {/* ════════ 6. TOP POSTS ════════ */}
      <section className="mk-section">
        <FadeIn>
          <SectionLabel n="05" text="Top Posts" />
          <p style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".16em", color:"var(--stone)", marginBottom:32 }}>Passe o mouse para ver as métricas.</p>
        </FadeIn>
        <div className="mk-posts">
          {TOP_POSTS.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.08}><PostCard post={post} /></FadeIn>
          ))}
        </div>
        <FadeIn delay={0.2}>
          <div style={{ marginTop:32, display:"flex", justifyContent:"center" }}>
            <Link href="/portfolio"
              style={{ display:"inline-flex", alignItems:"center", gap:12, border:"1px solid var(--line-dark)", padding:"13px 32px", borderRadius:2, textDecoration:"none", fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".22em", textTransform:"uppercase", color:"var(--ashe)", transition:"border-color .2s, color .2s" }}
              onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.borderColor="rgba(166,84,43,.6)"; a.style.color="var(--canvas)"; }}
              onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.borderColor="var(--line-dark)"; a.style.color="var(--ashe)"; }}
            >
              Ver portfolio completo →
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ════════ 7. EXPEDIÇÕES ════════ */}
      <section className="mk-section">
        <FadeIn><SectionLabel n="06" text="Expedições & Destinos" /></FadeIn>
        <div className="mk-destinations">
          {DESTINATIONS.map((d, i) => (
            <FadeIn key={d.name} delay={i * 0.05}>
              <div style={{ border:`1px solid ${d.upcoming ? "rgba(166,84,43,.5)" : "var(--line-dark)"}`, borderRadius:2, padding:"22px 18px", position:"relative" }}>
                {d.upcoming && <div style={{ position:"absolute", top:8, right:8, fontFamily:"var(--font-mono)", fontSize:7, letterSpacing:".2em", textTransform:"uppercase", color:"var(--rust)", border:"1px solid rgba(166,84,43,.5)", padding:"3px 7px" }}>Em breve</div>}
                <div style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".2em", textTransform:"uppercase", color:"var(--stone)", marginBottom:6 }}>{d.loc}</div>
                <div style={{ fontFamily:"var(--font-ui)", fontWeight:600, fontSize:13, color:"var(--canvas)", lineHeight:1.3, marginBottom:8 }}>{d.name}</div>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"var(--rust-soft)" }}>{d.note}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════ 8. SERVIÇOS ════════ */}
      <section className="mk-section">
        <FadeIn><SectionLabel n="07" text="Serviços" /></FadeIn>
        <div className="mk-services">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.name} delay={i * 0.07}>
              <div
                style={{ border:"1px solid var(--line-dark)", borderRadius:2, padding:"28px 24px", transition:"border-color .2s, background .2s" }}
                onMouseEnter={e => { const d=e.currentTarget as HTMLDivElement; d.style.borderColor="rgba(166,84,43,.5)"; d.style.background="rgba(166,84,43,.05)"; }}
                onMouseLeave={e => { const d=e.currentTarget as HTMLDivElement; d.style.borderColor="var(--line-dark)"; d.style.background="transparent"; }}
              >
                <div style={{ fontFamily:"var(--font-ui)", fontWeight:600, fontSize:14, color:"var(--canvas)", marginBottom:10 }}>{s.name}</div>
                <div style={{ fontFamily:"var(--font-ui)", fontSize:12, color:"var(--ashe-dim)", lineHeight:1.5 }}>{s.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════ 9. TRABALHOS COM MARCAS ════════ */}
      <section className="mk-section">
        <FadeIn>
          <SectionLabel n="08" text="Trabalhos com Marcas" />
          <p style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".16em", color:"var(--stone)", marginBottom:40 }}>Clique para ver fotos e métricas.</p>
        </FadeIn>
        <div className="mk-works">
          {BRAND_WORKS.map((work, i) => (
            <BrandWorkCard key={`${work.brand}-${work.product}`} work={work} delay={i * 0.05} onOpen={openLightbox} />
          ))}
        </div>
      </section>

      {/* ════════ 10. TRAJETÓRIA ════════ */}
      <section className="mk-section" style={{ background:"rgba(166,84,43,.03)" }}>
        <FadeIn>
          <SectionLabel n="09" text="Trajetória" />
          <div className="mk-traj-grid">
            <div>
              <h2 style={{ fontFamily:"var(--font-hand)", fontSize:"clamp(40px,6vw,72px)", color:"var(--canvas)", margin:"0 0 24px", lineHeight:1.05, transform:"rotate(-1.5deg)", display:"inline-block" }}>A conta está crescendo</h2>
              <p style={{ fontFamily:"var(--font-ui)", fontSize:14, lineHeight:1.75, color:"var(--ashe-dim)", margin:"0 0 16px" }}>
                O crescimento não é fruto de tendências ou viralizações artificiais — é orgânico, consistente e construído sobre conteúdo real de campo.
              </p>
              <p style={{ fontFamily:"var(--font-ui)", fontSize:14, lineHeight:1.75, color:"var(--ashe-dim)", margin:0 }}>
                Com três expedições guiadas agendadas para 2026 e produções solo em curso, o volume de conteúdo vai aumentar. Entrar agora significa crescer junto.
              </p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { label:"Crescimento mensal",    val:"+2.848 seguidores",     note:"Orgânico · abril 2026" },
                { label:"Engagement rate",        val:"17,0%",                note:"Média do setor: 3–5%" },
                { label:"Alcance vs. seguidores", val:"16,3×",                note:"201k alcance / 12,4k seguidores" },
                { label:"Próximas expedições",    val:"3 grupos confirmados",  note:"Lençóis · agosto 2026" },
              ].map(stat => (
                <div key={stat.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"16px 0", borderBottom:"1px solid rgba(232,223,201,.06)" }}>
                  <div>
                    <div style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".2em", textTransform:"uppercase", color:"var(--stone)", marginBottom:4 }}>{stat.label}</div>
                    <div style={{ fontFamily:"var(--font-ui)", fontWeight:700, fontSize:18, color:"var(--canvas)" }}>{stat.val}</div>
                  </div>
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"var(--rust-soft)", textAlign:"right", maxWidth:160, lineHeight:1.4 }}>{stat.note}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ════════ 11. CTA ════════ */}
      <section style={{ padding:"clamp(64px,10vw,120px) clamp(20px,5vw,56px) clamp(56px,8vw,100px)", textAlign:"center" }}>
        <FadeIn>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".28em", textTransform:"uppercase", color:"var(--stone)", marginBottom:32 }}>10 · Vamos trabalhar juntos</div>
          <h2 style={{ fontFamily:"var(--font-hand)", fontSize:"clamp(48px,8vw,96px)", color:"var(--canvas)", margin:"0 0 16px", transform:"rotate(-1.5deg)", display:"inline-block" }}>Vamos conversar</h2>
          <p style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:18, color:"var(--ashe-dim)", marginBottom:48 }}>Para parcerias, licenciamentos e expedições com produção.</p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", marginBottom:48 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-flex", alignItems:"center", gap:10, background:"var(--rust)", color:"var(--canvas)", fontFamily:"var(--font-ui)", fontWeight:600, fontSize:13, letterSpacing:".06em", textDecoration:"none", padding:"14px 32px", borderRadius:2, transition:"background .2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--rust-soft)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--rust)")}
            >
              WhatsApp — +55 11 98812-8064
            </a>
            <a href="mailto:hen.pimenta@gmail.com"
              style={{ display:"inline-flex", alignItems:"center", gap:10, border:"1px solid rgba(232,223,201,.25)", color:"var(--canvas)", fontFamily:"var(--font-ui)", fontSize:13, textDecoration:"none", padding:"14px 32px", borderRadius:2, transition:"border-color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(166,84,43,.7)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(232,223,201,.25)")}
            >
              hen.pimenta@gmail.com
            </a>
          </div>
          <div style={{ display:"flex", gap:32, justifyContent:"center", flexWrap:"wrap" }}>
            {[
              { label:"Instagram", val:"@henriq.eu",      href:"https://instagram.com/henriq.eu" },
              { label:"YouTube",   val:"@henriq_eu",      href:"https://youtube.com/@henriq_eu" },
              { label:"Site",      val:"euhenriq.com.br", href:"https://euhenriq.com.br" },
            ].map(c => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", textAlign:"center" }}>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".22em", textTransform:"uppercase", color:"var(--stone)", marginBottom:4 }}>{c.label}</div>
                <div style={{ fontFamily:"var(--font-ui)", fontSize:13, color:"var(--ashe)" }}>{c.val}</div>
              </a>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ── */}
      <div style={{ padding:"24px clamp(20px,5vw,56px)", borderTop:"1px solid rgba(232,223,201,.06)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".2em", textTransform:"uppercase", color:"var(--stone)" }}>Henrique Sesana · Media Kit 2026</span>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:".2em", textTransform:"uppercase", color:"var(--stone)" }}>euhenriq.com.br</span>
      </div>

      {lightbox && <BrandLightbox state={lightbox} onClose={closeLightbox} />}
    </main>
  );
}
