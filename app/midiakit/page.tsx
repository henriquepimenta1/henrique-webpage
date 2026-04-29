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

/* ─── data ─── */
const REACH_DAILY = [3982,7554,12928,9374,5840,7149,4704,5897,11425,9388,11579,12640,9662,6155,5175,6006,11242,10477,7055,7036,5765,5617,6084,8688,10050,6897,7470,4408,5135,2704];

const TOP_POSTS: Post[] = [
  { id: "DVjv2OIAWjh", url: "https://www.instagram.com/reel/DVjv2OIAWjh/", caption: "Escalando Cabeça de Peixe — Serra dos Órgãos", reach:11352, likes:1540, comments:53, saves:112, shares:204 },
  { id: "DQW1SHdjVkf", url: "https://www.instagram.com/reel/DQW1SHdjVkf/", caption: "Atravessando os Lençóis Maranhenses — Ep. 1",  reach:6857,  likes:481,  comments:51, saves:25,  shares:81  },
  { id: "DTd5iA1EnbI", url: "https://www.instagram.com/reel/DTd5iA1EnbI/", caption: "Cabeça de Peixe — plano B virou a melhor aventura", reach:5911, likes:447, comments:27, saves:20, shares:27 },
  { id: "DU3_3nKkh-W", url: "https://www.instagram.com/reel/DU3_3nKkh-W/", caption: "Memories of Peru — Cordilheira de Huayhuash",  reach:4684,  likes:412,  comments:25, saves:28,  shares:15  },
];

const DESTINATIONS = [
  { name: "Lençóis Maranhenses", loc: "MA, Brasil", note: "UNESCO · agosto/2026", alt: "Dunas e lagoas cristalinas", upcoming: false },
  { name: "Parque Nacional do Itatiaia", loc: "RJ, Brasil", note: "2.791m", alt: "Pico das Agulhas Negras" },
  { name: "Serra dos Órgãos", loc: "RJ, Brasil", note: "Cabeça de Peixe", alt: "Escalada técnica" },
  { name: "Serra do Ibitiraquire", loc: "PR, Brasil", note: "Pico Paraná · 1.877m", alt: "Ponto mais alto do Sul" },
  { name: "Serra do Mar", loc: "SP/RJ, Brasil", note: "Travessia", alt: "Mata Atlântica densa" },
  { name: "Serra da Bocaina", loc: "SP/RJ, Brasil", note: "Trilha Ouro", alt: "Histórico e selvagem" },
  { name: "Serra Fina", loc: "MG, Brasil", note: "Travessia", alt: "Fronteira SP-MG" },
  { name: "Cordillera Blanca", loc: "Peru", note: "5.000m+", alt: "Andes peruanos" },
  { name: "Cordillera Huayhuash", loc: "Peru", note: "Circuito", alt: "Expedição remota" },
  { name: "Atacama", loc: "Chile", note: "5.592m · maio/2026", alt: "Próxima expedição", upcoming: true },
];

const SERVICES = [
  { name: "Reels de Expedição",          desc: "Vídeos cinematográficos 15–60s com narrativa emocional" },
  { name: "Drone Cinematography",        desc: "Captação aérea profissional com DJI Air 3S" },
  { name: "Carrosséis de Destino",       desc: "Séries fotográficas editoriais para Instagram" },
  { name: "Licenciamento de Conteúdo",   desc: "Uso em campanhas, sites e materiais da marca" },
  { name: "Conteúdo Bilíngue PT/EN",     desc: "Criação e adaptação para mercado internacional" },
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
    brand: "Aiuruocan",
    detail: "Parceria de campo",
    type: "Vestuário Outdoor",
    product: "White Melton",
    description: "Moletom em unifloc de garrafas PET recicladas — 84% algodão + 16% poliéster. Slow fashion, produção sob demanda. Testado na Travessia Marins × Itaguaré, Serra da Mantiqueira.",
    stats: [
      { label: "Curtidas", value: "276" },
      { label: "Alcance", value: "3.757" },
      { label: "Salvos", value: "20" },
      { label: "Compartilhamentos", value: "25" },
    ],
    postUrl: "https://www.instagram.com/reel/DKXZmtdO2d9/",
    photos: [
      { src: "/images/work/AIUR/MOLETON_MELTON/MOLETON-MELTON-001.jpg", caption: "White Melton em campo — Travessia Marins × Itaguaré" },
      { src: "/images/work/AIUR/MOLETON_MELTON/MOLETON-MELTON-002.jpg", caption: "Tecido unifloc — reciclagem de garrafas PET" },
      { src: "/images/work/AIUR/MOLETON_MELTON/MOLETON-MELTON-003.jpg", caption: "Serra da Mantiqueira · altitude e conforto" },
    ],
  },
  {
    brand: "Aiuruocan",
    detail: "Parceria de campo",
    type: "Vestuário Outdoor",
    product: "Colors Blue Melton",
    description: "Coleção Aiur Colors inspirada nas tonalidades da natureza — azul vibrante, verdes folhagem e tons terrosos. Unifloc de PET reciclado. Filmado ao entardecer na Serra da Mantiqueira.",
    stats: [
      { label: "Curtidas", value: "254" },
      { label: "Comentários", value: "15" },
    ],
    postUrl: "https://www.instagram.com/reel/C-iZ1ICPbjC/",
    photos: [
      { src: "/images/work/AIUR/MOLETON_MELTON-ESCURO/MOLETON-MELTON-ESCURO-001.jpg", caption: "Colors Blue Melton — pôr do sol na Serra" },
      { src: "/images/work/AIUR/MOLETON_MELTON-ESCURO/MOLETON-MELTON-ESCURO-002.jpg", caption: "Cores da natureza como paleta — Aiuruocan" },
      { src: "/images/work/AIUR/MOLETON_MELTON-ESCURO/MOLETON-MELTON-ESCURO-003.jpg", caption: "Editorial de campo — luz natural" },
    ],
  },
  {
    brand: "Aiuruocan",
    detail: "Parceria de campo",
    type: "Vestuário Outdoor",
    product: "Agulhas Negras Black T-Shirt",
    description: "Camiseta em algodão penteado 30.1 BCI. Nome inspirado nas afiadas formações rochosas do cume mais alto do Rio de Janeiro — 2.791m no Parque Nacional do Itatiaia.",
    stats: [
      { label: "Curtidas", value: "261" },
      { label: "Comentários", value: "11" },
    ],
    postUrl: "https://www.instagram.com/reel/C6jOdhRL46t/",
    photos: [
      { src: "/images/work/AIUR/T-SHIRT_AGULHAS-NEGRAS/T-SHIRT-AGULHAS-NEGRAS-001.jpg", caption: "Agulhas Negras Black — Pico das Agulhas Negras 2.791m" },
      { src: "/images/work/AIUR/T-SHIRT_AGULHAS-NEGRAS/T-SHIRT-AGULHAS-NEGRAS-002.jpg", caption: "Formações rochosas do cume — Itatiaia, RJ" },
      { src: "/images/work/AIUR/T-SHIRT_AGULHAS-NEGRAS/T-SHIRT-AGULHAS-NEGRAS-003.jpg", caption: "Algodão penteado 30.1 BCI — leveza em altitude" },
    ],
  },
  {
    brand: "Aiuruocan",
    detail: "Parceria de campo",
    type: "Vestuário Outdoor",
    product: "Free Riding Team White T-Shirt",
    description: "Camiseta em algodão BCI penteado 30.1 — leve, respirável, feita para quem não para. Cupom exclusivo AIURHENRIQUE10 · 10% off. Filmada no Pico do Lopo, Extrema-MG.",
    stats: [
      { label: "Curtidas", value: "191" },
      { label: "Comentários", value: "7" },
    ],
    postUrl: "https://www.instagram.com/reel/DGJIBq-PhLC/",
    photos: [
      { src: "/images/work/AIUR/T-SHIRT_FREE-RIDING-TEAM/T-SHIRT-FREE-RIDING-TEAM-001.jpg", caption: "Free Riding Team — Pico do Lopo, Extrema-MG" },
      { src: "/images/work/AIUR/T-SHIRT_FREE-RIDING-TEAM/T-SHIRT-FREE-RIDING-TEAM-002.jpg", caption: "Algodão BCI penteado — conforto em montanha" },
      { src: "/images/work/AIUR/T-SHIRT_FREE-RIDING-TEAM/T-SHIRT-FREE-RIDING-TEAM-003.jpg", caption: "Serra da Mantiqueira — vista panorâmica" },
    ],
  },
  {
    brand: "O Boticário",
    detail: "Campanha de produto",
    type: "Beauty & Lifestyle",
    product: "Arbo Puro — Desodorante Colônia 100ml",
    description: "92% ingredientes naturais com refil — fusão do bambu com notas cítricas, Acorde Bambu e Musk. A fragrância que pertence à natureza. Filmado no Rio Marcolino, Mata Atlântica.",
    stats: [
      { label: "Curtidas", value: "2.277" },
      { label: "Comentários", value: "107" },
    ],
    postUrl: "https://www.instagram.com/reel/C3LBa1oMmu6/",
    photos: [
      { src: "/images/work/OBOTICARIO/OBOTICARIO-001.jpg", caption: "Arbo Puro — a essência da natureza ao alcance das mãos" },
      { src: "/images/work/OBOTICARIO/OBOTICARIO-002.jpg", caption: "Rio Marcolino · Mata Atlântica, São Paulo" },
      { src: "/images/work/OBOTICARIO/OBOTICARIO-003.jpg", caption: "92% ingredientes naturais · com refil · #ARboPuroComBoti" },
    ],
  },
  {
    brand: "OMA Gear",
    detail: "Conteúdo de campo",
    type: "Gear & Equipamento",
    product: "Kit Cozinha Ultra Leve",
    description: "149g no total: panela 600ml (112g) + Cone Caldera Inka (22g) + fogareiro ultracompacto (15g). Menos peso muda tudo — do jeito que você caminha ao quanto sobra pra curtir o lugar.",
    stats: [
      { label: "Curtidas", value: "217" },
      { label: "Comentários", value: "20" },
      { label: "Compartilhamentos", value: "4" },
    ],
    postUrl: "https://www.instagram.com/reel/DQC7JWfCYtD/",
    photos: [
      { src: "/images/work/OMA-GEAR/OMA-GEAR-001.jpg", caption: "Kit Cozinha Ultra Leve — 149g no total" },
      { src: "/images/work/OMA-GEAR/OMA-GEAR-002.jpg", caption: "Panela 600ml + Cone Caldera Inka + fogareiro ultracompacto" },
      { src: "/images/work/OMA-GEAR/OMA-GEAR-003.jpg", caption: "Testado em campo — menos peso, mais liberdade" },
    ],
  },
  {
    brand: "Brightin Star",
    detail: "Óptica · parceria",
    type: "Equipamento Fotográfico",
    product: "Lente 16mm f/2.8",
    description: "Wide manual com sharpness excelente ao centro desde f/2.8, distorção mínima para um 16mm e bokeh natural surpreendente. Testada em Sony A7 IV no centro de SP — sem gimbal, sem filtro.",
    stats: [
      { label: "Curtidas", value: "370" },
      { label: "Alcance", value: "4.053" },
      { label: "Salvos", value: "31" },
      { label: "Compartilhamentos", value: "31" },
    ],
    postUrl: "https://www.instagram.com/reel/DPSo5_iDSmY/",
    photos: [
      { src: "/images/work/BRIGHTIN-STAR/BRIGHTIN-STAR-001.jpg", caption: "Brightin Star 16mm f/2.8 — review real, centro de São Paulo" },
      { src: "/images/work/BRIGHTIN-STAR/BRIGHTIN-STAR-002.jpg", caption: "Sharpness, distorção mínima e bokeh — Sony A7 IV handheld" },
    ],
  },
  {
    brand: "Botas Vento",
    detail: "Conteúdo de campo",
    type: "Calçados Outdoor",
    product: "Titan",
    description: "Conteúdo cinematográfico de campo — entre um clique e outro, a VENTO esteve presente em cada passo. Pedra, lama, cansaço real. #voudeVENTO",
    stats: [
      { label: "Curtidas", value: "599" },
      { label: "Comentários", value: "18" },
    ],
    postUrl: "https://www.instagram.com/reel/DLXYsDvOG28/",
    photos: [
      { src: "/images/work/BOTAS-VENTO/BOTA-TITAN/BOTA-TITAN-001.jpg", caption: "Titan em terreno técnico — pedra, lama e trilha real" },
      { src: "/images/work/BOTAS-VENTO/BOTA-TITAN/BOTA-TITAN-002.jpg", caption: "Conteúdo cinematográfico de campo — #voudeVENTO" },
      { src: "/images/work/BOTAS-VENTO/BOTA-TITAN/BOTA-TITAN-003.jpg", caption: "Resistir, apoiar e seguir firme — a arte de fotografar o mundo" },
    ],
  },
  {
    brand: "Botas Vento",
    detail: "Conteúdo de campo",
    type: "Calçados Outdoor",
    product: "Finisterre — cor Caqui",
    description: "Subida Paiolinho — 90% de ascensão pura. Minha favorita, tanto no conforto quanto na cor. Mesmo em terreno agressivo, zero reclamações. A bota que não pede para parar.",
    stats: [
      { label: "Curtidas", value: "367" },
      { label: "Comentários", value: "9" },
    ],
    postUrl: "https://www.instagram.com/reel/DM0lofXveIW/",
    photos: [
      { src: "/images/work/BOTAS-VENTO/BOTA-FINISTERRE/BOTA-FINISTERRE-001.jpg", caption: "Finisterre Caqui — subida Paiolinho" },
      { src: "/images/work/BOTAS-VENTO/BOTA-FINISTERRE/BOTA-FINISTERRE-002.jpg", caption: "Detalhe de produto em terreno exigente" },
      { src: "/images/work/BOTAS-VENTO/BOTA-FINISTERRE/BOTA-FINISTERRE-003.jpg", caption: "Conforto comprovado em 90% de ascensão técnica" },
    ],
  },
  {
    brand: "K&F Concept",
    detail: "Sponsor ativo · cupom HENRIQ",
    type: "Equipamento Fotográfico",
    product: "Tripé Omni Series + Cabeça FH03",
    description: "Fibra de carbono — 1,64kg total com cabeça hidráulica. FH03 aguenta 5kg de rig com pan e tilt de amortecimento suave. Perna central vira monopé quando o terreno não coopera. Cupom HENRIQ · 18% off.",
    stats: [
      { label: "Curtidas", value: "285" },
      { label: "Comentários", value: "16" },
    ],
    postUrl: "https://www.instagram.com/p/DW7asyXDejY/?img_index=1",
    photos: [
      { src: "/images/work/KNF-CONCEPT/KNF-CONCEPT-001.jpg", caption: "K&F Omni Series — fibra de carbono 1,64kg em campo" },
      { src: "/images/work/KNF-CONCEPT/KNF-CONCEPT-002.jpg", caption: "Cabeça hidráulica FH03 — pan e tilt suave, suporta 5kg" },
      { src: "/images/work/KNF-CONCEPT/KNF-CONCEPT-003.jpg", caption: "Review completo — Sony A7 IV + tripé profissional em trilha" },
    ],
  },
  {
    brand: "Alto Estilo",
    detail: "Editorial de moda outdoor",
    type: "Moda & Equipamento",
    product: "Mochila Ataque 40+5L + Pochete Hidro",
    description: "Cordura® 500D — resiste a chuva, galho, pedra e suor. Testada em ataque à Pedra Furada (PNI) e camping de 3 dias. Pochete adaptada para carregar drone Air 3S + controle com acesso instantâneo na trilha.",
    stats: [
      { label: "Curtidas", value: "260" },
      { label: "Alcance", value: "3.423" },
      { label: "Salvos", value: "16" },
    ],
    postUrl: "https://www.instagram.com/p/DM_DwNAJ306/?img_index=1",
    photos: [
      { src: "/images/work/ALTO-ESTILO/ALTO-ESTILO-001.jpg", caption: "Mochila Ataque 40+5L — testada no Parque Nacional do Itatiaia" },
      { src: "/images/work/ALTO-ESTILO/ALTO-ESTILO-002.jpg", caption: "Pochete Hidro adaptada para drone Air 3S + controle" },
      { src: "/images/work/ALTO-ESTILO/ALTO-ESTILO-003.jpg", caption: "Cordura® 500D — 3 dias de camping e zero comprometimento" },
    ],
  },
  {
    brand: "Gorro Vans",
    detail: "Conteúdo de campo",
    type: "Vestuário Outdoor",
    product: "Gorro Beanie",
    description: "Beanie de malha densa com ajuste confortável — testado a mais de 5.000m no Pico Mateo, Cordilheira Blanca, Peru. Onde o vento corta e o frio é real, o estilo não precisa ser sacrificado.",
    stats: [
      { label: "Curtidas", value: "197" },
      { label: "Comentários", value: "12" },
      { label: "Alcance", value: "5.341" },
    ],
    postUrl: "https://www.instagram.com/reel/DEDKNgWOwRn/",
    photos: [
      { src: "/images/work/GORRO-VANS/GORRO-VANS-001.jpg", caption: "Gorro Vans — Pico Mateo 5.150m, Cordilheira Blanca, Peru" },
      { src: "/images/work/GORRO-VANS/GORRO-VANS-002.jpg", caption: "Conforto e estilo a mais de 5.000m de altitude" },
      { src: "/images/work/GORRO-VANS/GORRO-VANS-003.jpg", caption: "Escalada em neve — frio real, proteção real" },
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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── metric card ─── */
function MetricCard({ label, value, suffix = "", prefix = "" }: { label: string; value: number; suffix?: string; prefix?: string }) {
  const { ref, visible } = useVisible();
  const count = useCountUp(value, 1600, visible);
  return (
    <div ref={ref} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(232,223,201,.1)", borderRadius: 2, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(232,223,201,.45)" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-.04em", color: "#E6DDD4", lineHeight: 1 }}>
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
  const x = (i: number) => (i / (data.length - 1)) * W;
  const y = (v: number) => H - ((v - min) / (max - min)) * (H - 8) - 4;
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${path} L${W},${H} L0,${H} Z`;
  return (
    <div ref={ref} style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 280, height: 80, display: "block" }}>
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A6542B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#A6542B" stopOpacity="0" />
          </linearGradient>
          <clipPath id="spark-clip">
            <rect x="0" y="0" width={visible ? W : 0} height={H} style={{ transition: "width 1.4s ease" }} />
          </clipPath>
        </defs>
        <path d={area} fill="url(#spark-fill)" clipPath="url(#spark-clip)" />
        <path d={path} fill="none" stroke="#A6542B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#spark-clip)" />
        {data.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill="#A6542B" opacity={visible ? 0.7 : 0} style={{ transition: `opacity .3s ${i * 0.04}s` }} />
        ))}
      </svg>
    </div>
  );
}

/* ─── post card ─── */
function PostCard({ post }: { post: Post }) {
  const [hovered, setHovered] = useState(false);
  const engagement = ((post.likes + post.comments + post.saves + post.shares) / post.reach * 100).toFixed(1);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", overflow: "hidden", borderRadius: 2, background: "#111", border: "1px solid rgba(232,223,201,.1)", height: 480, cursor: "pointer", transition: "transform .25s, box-shadow .25s", transform: hovered ? "translateY(-4px)" : "translateY(0)", boxShadow: hovered ? "0 12px 40px rgba(0,0,0,.5)" : "0 2px 12px rgba(0,0,0,.3)" }}
    >
      <iframe
        src={`https://www.instagram.com/reel/${post.id}/embed/`}
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        scrolling="no"
        allowFullScreen
        loading="lazy"
      />
      <div style={{ position: "absolute", inset: 0, background: hovered ? "rgba(14,12,10,.88)" : "transparent", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 16, gap: 8, pointerEvents: hovered ? "auto" : "none", transition: "background .2s" }}>
        {hovered && <>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "#E6DDD4", margin: 0, lineHeight: 1.35 }}>{post.caption}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[["Alcance", post.reach.toLocaleString("pt-BR")], ["Curtidas", post.likes.toLocaleString("pt-BR")], ["Salvos", post.saves], ["Engaj.", `${engagement}%`]].map(([k, v]) => (
              <div key={String(k)} style={{ fontFamily: "var(--font-mono)", fontSize: 9 }}>
                <div style={{ color: "rgba(232,223,201,.4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 1 }}>{k}</div>
                <div style={{ color: "#E6DDD4", fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
          <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase", color: "#A6542B", textDecoration: "none" }}>Ver no Instagram →</a>
        </>}
      </div>
    </div>
  );
}

/* ─── fade-in wrapper ─── */
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useVisible(0.15);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity .7s ${delay}s, transform .7s ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── section label ─── */
function SectionLabel({ n, text }: { n: string; text: string }) {
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(232,223,201,.4)", marginBottom: 40, display: "flex", alignItems: "center", gap: 16 }}>
      <span>{n}</span>
      <span style={{ flex: 1, height: 1, background: "rgba(232,223,201,.12)" }} />
      <span>{text}</span>
    </div>
  );
}

/* ─── Brand Lightbox ─── */
function BrandLightbox({ state, onClose }: { state: LightboxState; onClose: () => void }) {
  const { work, photoIdx: initialIdx } = state;
  const [idx, setIdx] = useState(initialIdx);
  const photo = work.photos[idx];
  const hasMultiple = work.photos.length > 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasMultiple) setIdx((i) => (i + 1) % work.photos.length);
      if (e.key === "ArrowLeft" && hasMultiple) setIdx((i) => (i - 1 + work.photos.length) % work.photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [work.photos.length, hasMultiple, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,8,7,.97)", backdropFilter: "blur(20px)", overflowY: "auto", padding: "16px" }}
    >
      <style>{`
        @keyframes lb-in { from { opacity:0 } to { opacity:1 } }
        @keyframes lb-img { from { transform:scale(.97); opacity:0 } to { transform:scale(1); opacity:1 } }
        .lb-wrap { animation: lb-in .18s ease; max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; min-height: 100%; justify-content: center; }
        .lb-img-anim { animation: lb-img .22s ease; }
        .lb-grid { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
        .lb-thumbs { display: flex; gap: 6px; }
        @media(max-width: 700px) {
          .lb-grid { grid-template-columns: 1fr !important; }
          .lb-thumbs { justify-content: center; }
        }
      `}</style>

      <div className="lb-wrap" onClick={(e) => e.stopPropagation()}>

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(232,223,201,.08)" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(232,223,201,.3)", marginBottom: 4 }}>{work.type}</div>
            <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16, color: "#E6DDD4" }}>
              {work.brand} <span style={{ color: "#A6542B" }}>·</span> {work.product}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "1px solid rgba(232,223,201,.2)", color: "rgba(232,223,201,.5)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", padding: "8px 16px", borderRadius: 2, flexShrink: 0 }}
          >
            Fechar · ESC
          </button>
        </div>

        {/* Grid: foto esquerda + sidebar direita */}
        <div className="lb-grid">

          {/* Coluna esquerda: foto + caption + dots */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Foto preservando formato original */}
            <div className="lb-img-anim" key={idx} style={{ position: "relative", background: "#0a0807", borderRadius: 2, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src={photo.src}
                alt={photo.caption}
                style={{ display: "block", width: "100%", height: "auto", maxHeight: "65vh", objectFit: "contain" }}
              />

              {/* Setas */}
              {hasMultiple && (
                <>
                  <button onClick={() => setIdx((i) => (i - 1 + work.photos.length) % work.photos.length)}
                    style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(14,12,10,.8)", border: "1px solid rgba(232,223,201,.15)", color: "#E6DDD4", width: 36, height: 36, borderRadius: 2, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>←</button>
                  <button onClick={() => setIdx((i) => (i + 1) % work.photos.length)}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(14,12,10,.8)", border: "1px solid rgba(232,223,201,.15)", color: "#E6DDD4", width: 36, height: 36, borderRadius: 2, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>→</button>
                </>
              )}
            </div>

            {/* Caption */}
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "rgba(232,223,201,.45)", lineHeight: 1.4, margin: 0, textAlign: "center" }}>{photo.caption}</p>

            {/* Dots + thumbnails */}
            {hasMultiple && (
              <div className="lb-thumbs">
                {work.photos.map((p, i) => (
                  <button key={i} onClick={() => setIdx(i)}
                    style={{ flex: 1, maxWidth: 80, aspectRatio: "1", overflow: "hidden", borderRadius: 2, cursor: "pointer", padding: 0, border: i === idx ? "2px solid #A6542B" : "2px solid rgba(232,223,201,.1)", transition: "border-color .2s", background: "#111" }}>
                    <img src={p.src} alt={p.caption} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar direita */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Descrição */}
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.3)", marginBottom: 8 }}>Produto</div>
              <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "#E6DDD4", marginBottom: 10 }}>{work.product}</div>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "rgba(232,223,201,.55)", lineHeight: 1.65, margin: 0 }}>{work.description}</p>
            </div>

            {/* Métricas */}
            <div style={{ borderTop: "1px solid rgba(232,223,201,.08)", paddingTop: 16 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.3)", marginBottom: 12 }}>Métricas do post</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {work.stats.map((s) => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(232,223,201,.08)", borderRadius: 2, padding: "10px 12px" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(232,223,201,.3)", marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 18, color: "#E6DDD4", letterSpacing: "-.03em" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Instagram */}
            <a href={work.postUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#A6542B", color: "#E6DDD4", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", textDecoration: "none", padding: "14px 20px", borderRadius: 2, transition: "background .2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#C2592B")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#A6542B")}
            >
              Ver publicação no Instagram →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ─── Brand Work Card ─── */
function BrandWorkCard({ work, delay, onOpen }: { work: BrandWork; delay: number; onOpen: (work: BrandWork, idx: number) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onClick={() => onOpen(work, 0)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: "relative", overflow: "hidden", borderRadius: 2, cursor: "pointer", border: `1px solid ${hovered ? "rgba(166,84,43,.5)" : "rgba(232,223,201,.1)"}`, background: hovered ? "rgba(166,84,43,.04)" : "transparent", transition: "border-color .2s, background .2s, transform .25s", transform: hovered ? "translateY(-3px)" : "translateY(0)" }}
      >
        <div style={{ position: "relative", aspectRatio: "4/5", background: "#111", overflow: "hidden" }}>
          <Image src={work.photos[0].src} alt={work.product} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform .4s ease" }} />
          <div style={{ position: "absolute", inset: 0, background: hovered ? "rgba(14,12,10,.55)" : "rgba(14,12,10,.15)", transition: "background .25s", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {hovered && (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", color: "#E6DDD4", border: "1px solid rgba(232,223,201,.4)", padding: "8px 16px", borderRadius: 2 }}>
                Ver trabalho
              </div>
            )}
          </div>
          {work.photos.length > 1 && (
            <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(14,12,10,.75)", fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".14em", color: "rgba(232,223,201,.7)", padding: "4px 8px", borderRadius: 2 }}>
              {work.photos.length} fotos
            </div>
          )}
        </div>
        <div style={{ padding: "16px 18px 18px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.3)", marginBottom: 5 }}>{work.type}</div>
          <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: "#E6DDD4", marginBottom: 2 }}>{work.brand}</div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "rgba(166,84,43,.85)", marginBottom: 8 }}>{work.product}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".14em", color: "rgba(232,223,201,.3)" }}>{work.detail}</div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function MidiaKitPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const openLightbox = useCallback((work: BrandWork, idx: number) => {
    setLightbox({ work, photoIdx: idx });
  }, []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main style={{ background: "var(--bg, #0E0C0A)", color: "#E6DDD4", fontFamily: "var(--font-ui)", overflowX: "hidden" }}>
      <style>{`
        .mk-posts  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .mk-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .mk-services { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .mk-destinations { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .mk-gear { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .mk-works { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .mk-section { padding: 100px 56px; border-bottom: 1px solid rgba(232,223,201,.08); }
        .mk-bio-grid { display: grid; grid-template-columns: 1fr 380px; gap: 64px; align-items: start; }
        .mk-photos { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .mk-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .mk-traj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
        @media(max-width: 1100px) {
          .mk-destinations { grid-template-columns: repeat(3, 1fr) !important; }
          .mk-posts { grid-template-columns: repeat(2, 1fr) !important; }
          .mk-works { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media(max-width: 900px) {
          .mk-bio-grid { grid-template-columns: 1fr !important; }
          .mk-metrics { grid-template-columns: repeat(2, 1fr) !important; }
          .mk-services { grid-template-columns: 1fr 1fr !important; }
          .mk-destinations { grid-template-columns: 1fr 1fr !important; }
          .mk-gear { grid-template-columns: repeat(2, 1fr) !important; }
          .mk-works { grid-template-columns: repeat(2, 1fr) !important; }
          .mk-section { padding: 72px 24px !important; }
          .mk-two-col { grid-template-columns: 1fr !important; }
          .mk-traj-grid { grid-template-columns: 1fr !important; }
          .mk-bio-grid { gap: 32px !important; }
        }
        @media(max-width: 600px) {
          .mk-posts { grid-template-columns: 1fr !important; }
          .mk-metrics { grid-template-columns: 1fr 1fr !important; }
          .mk-services { grid-template-columns: 1fr !important; }
          .mk-destinations { grid-template-columns: 1fr 1fr !important; }
          .mk-gear { grid-template-columns: 1fr 1fr !important; }
          .mk-works { grid-template-columns: 1fr 1fr !important; }
          .mk-section { padding: 56px 20px !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(16px, 4vw, 40px)", zIndex: 50, background: "rgba(14,12,10,.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(232,223,201,.08)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, border: "1.5px solid rgba(232,223,201,.7)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, fontWeight: 500, color: "rgba(232,223,201,.7)" }}>H</div>
        </Link>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(232,223,201,.4)" }}>Media Kit · 2026</span>
        <a href={WA} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "#A6542B", textDecoration: "none", border: "1px solid rgba(166,84,43,.4)", padding: "6px 14px" }}>Contato</a>
      </header>

      {/* ════════ 1. HERO ════════ */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 clamp(20px, 5vw, 56px) clamp(48px, 8vw, 80px)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/images/exp-huayhuash.jpg"
            alt="Expedição nos Andes"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center", transform: `translateY(${scrollY * 0.25}px)`, transition: "transform 0s linear" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,12,10,1) 0%, rgba(14,12,10,.7) 40%, rgba(14,12,10,.3) 100%)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 900 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(232,223,201,.5)", marginBottom: 24 }}>Media Kit · Abril 2026</div>
          <h1 style={{ margin: "0 0 8px", lineHeight: 0.85 }}>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(52px, 8vw, 88px)", color: "rgba(232,223,201,.6)", display: "block", marginBottom: 4 }}>Adventure Filmmaker</span>
            <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(64px, 12vw, 152px)", letterSpacing: "-.05em", textTransform: "uppercase", display: "block", color: "#E6DDD4" }}>HENRIQUE</span>
            <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(64px, 12vw, 152px)", letterSpacing: "-.05em", textTransform: "uppercase", display: "block", color: "#A6542B" }}>SESANA</span>
          </h1>
          <div style={{ marginTop: 32, display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".18em", color: "rgba(232,223,201,.55)" }}>Trekking · Montanhismo · Cinematografia</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".18em", color: "rgba(232,223,201,.35)" }}>São Paulo, Brasil</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".18em", color: "rgba(232,223,201,.35)" }}>PT · EN</span>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 32, right: 56, zIndex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.3)" }}>@henriq.eu</span>
          <div style={{ width: 1, height: 48, background: "rgba(232,223,201,.2)" }} />
        </div>
      </section>

      {/* ════════ 2. BIO + FOTOS ════════ */}
      <section className="mk-section" style={{ padding: "100px 56px" }}>
        <FadeIn>
          <SectionLabel n="01" text="Sobre" />
        </FadeIn>
        <div className="mk-bio-grid">
          <FadeIn>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(17px, 2.2vw, 22px)", lineHeight: 1.65, letterSpacing: "-.01em", color: "#E6DDD4", margin: "0 0 24px" }}>
              Sou fotógrafo, filmmaker e contador de histórias visuais que nascem da terra, do vento e do tempo. Minha estética é contemplativa, minimalista e profundamente conectada à natureza. Gosto de criar imagens que respiram — que convidam à pausa, ao toque, à escuta silenciosa do que está fora e dentro de nós.
            </p>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(13px, 1.6vw, 15px)", lineHeight: 1.7, color: "rgba(232,223,201,.65)", margin: "0 0 20px" }}>
              As cores que escolho dialogam com o ambiente: verdes densos, tons de areia, luz natural e texturas reais. Valorizo a composição espontânea, o detalhe que o olho quase não vê, o instante que carrega uma presença sutil. Minha fotografia não busca impacto, busca permanência.
            </p>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(13px, 1.6vw, 15px)", lineHeight: 1.7, color: "rgba(232,223,201,.65)", margin: "0 0 20px" }}>
              Já produzi campanhas para marcas de vestuário, turismo e cosméticos, sempre propondo um caminho mais poético e imersivo — onde o produto entra na paisagem, e não o contrário. Estudo cinematografia, direção de luz natural, color grading, narrativa visual e composição. Minha escola principal é o mundo natural.
            </p>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "clamp(13px, 1.6vw, 15px)", lineHeight: 1.7, color: "rgba(232,223,201,.65)", margin: "0 0 32px" }}>
              Em agosto de 2026, volto aos Lençóis Maranhenses para guiar três grupos com fotografia integrada — travessia com produção própria de ponta a ponta.
            </p>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 34, color: "var(--rust-soft, #C2803D)", display: "inline-block", transform: "rotate(-2deg)" }}>— Henrique</span>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mk-photos">
              <div style={{ position: "relative", borderRadius: 2, overflow: "hidden", aspectRatio: "3/4" }}>
                <Image src="/images/henrique-portrait-1.jpg" alt="Henrique Sesana em expedição" fill style={{ objectFit: "cover", objectPosition: "center top" }} />
              </div>
              <div style={{ position: "relative", borderRadius: 2, overflow: "hidden", aspectRatio: "3/4", marginTop: 32 }}>
                <Image src="/images/henrique-portrait-2.jpg" alt="Henrique Sesana na montanha" fill style={{ objectFit: "cover", objectPosition: "center top" }} />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════ 3. FILOSOFIA ════════ */}
      <section className="mk-section" style={{ background: "rgba(166,84,43,.04)" }}>
        <FadeIn>
          <SectionLabel n="02" text="Estado de Presença" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="mk-two-col">
            <div>
              <h2 style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(36px, 5vw, 64px)", color: "#E6DDD4", margin: "0 0 24px", lineHeight: 1.1, transform: "rotate(-1deg)", display: "inline-block" }}>Sentir o local através da imagem</h2>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.75, color: "rgba(232,223,201,.65)", margin: 0 }}>
                Minha criação parte de um princípio simples: você não precisa ter estado lá para sentir que estava. Cada frame carrega a temperatura do ar, o peso do silêncio, o cheiro da terra molhada. Trabalho com relatos pessoais, vivência real e uma câmera que respeita o ambiente.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { title: "Lugares que as pessoas não imaginam", desc: "Mostro destinos que saem do roteiro turístico convencional — serras remotas, travessias sem nome, paisagens que exigem dois dias de caminhada para serem alcançadas." },
                { title: "Relatos pessoais como narrativa", desc: "Cada expedição tem uma história humana. Não documento apenas o visual — documento a jornada, o cansaço, a recompensa, o que muda em quem vai." },
                { title: "Presença como método", desc: "Aprofundo meu olhar através de referências do cinema contemplativo, da arte minimalista e do design orgânico. O tempo, o silêncio e a textura são elementos narrativos." },
              ].map(item => (
                <div key={item.title} style={{ borderLeft: "2px solid rgba(166,84,43,.4)", paddingLeft: 20 }}>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "#E6DDD4", marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, lineHeight: 1.6, color: "rgba(232,223,201,.5)" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ════════ 4. EQUIPAMENTO ════════ */}
      <section className="mk-section">
        <FadeIn>
          <SectionLabel n="03" text="Equipamento" />
          <div className="mk-gear">
            {GEAR.map((g, i) => (
              <FadeIn key={g.name} delay={i * 0.07}>
                <div style={{ border: "1px solid rgba(232,223,201,.1)", padding: "20px 18px", borderRadius: 2 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.35)", marginBottom: 8 }}>{g.cat}</div>
                  <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "#E6DDD4" }}>{g.name}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ════════ 5. MÉTRICAS ════════ */}
      <section className="mk-section">
        <FadeIn>
          <SectionLabel n="04" text="Instagram · Abril 2026" />
        </FadeIn>

        <div className="mk-metrics" style={{ marginBottom: 40 }}>
          <MetricCard label="Seguidores"     value={12345} />
          <MetricCard label="Reach mensal"   value={228086} />
          <MetricCard label="Interações/mês" value={41432} />
          <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(232,223,201,.1)", borderRadius: 2, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(232,223,201,.45)" }}>Engagement rate</span>
            <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-.04em", color: "#E6DDD4", lineHeight: 1 }}>18,2%</span>
          </div>
        </div>
        <div className="mk-metrics" style={{ marginBottom: 48 }}>
          <MetricCard label="Reach médio/dia"      value={7603} />
          <MetricCard label="Novos seguidores/mês"  value={1028} prefix="+" />
          <MetricCard label="Posts publicados"      value={432} />
          <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(232,223,201,.1)", borderRadius: 2, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(232,223,201,.45)" }}>Tipo de conta</span>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: 28, color: "#A6542B", lineHeight: 1 }}>Creator</span>
          </div>
        </div>

        <FadeIn delay={0.2}>
          <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(232,223,201,.08)", borderRadius: 2, padding: "32px 28px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(232,223,201,.35)", marginBottom: 20 }}>Reach diário — últimos 30 dias</div>
            <Sparkline data={REACH_DAILY} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(232,223,201,.25)" }}>1 abr</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(232,223,201,.25)" }}>30 abr</span>
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".14em", color: "rgba(232,223,201,.22)", marginTop: 16, marginBottom: 0 }}>Dados via Windsor.ai — atualização abril/2026</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div style={{ marginTop: 24, padding: "20px 24px", border: "1px solid rgba(166,84,43,.3)", borderRadius: 2, background: "rgba(166,84,43,.04)", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#A6542B", flexShrink: 0, boxShadow: "0 0 8px rgba(166,84,43,.6)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".16em", color: "rgba(232,223,201,.6)" }}>
              Conta em crescimento consistente — +1.028 seguidores em abril/2026. Alcance orgânico em expansão semana a semana.
            </span>
          </div>
        </FadeIn>
      </section>

      {/* ════════ 6. TOP POSTS ════════ */}
      <section className="mk-section">
        <FadeIn>
          <SectionLabel n="05" text="Top Posts" />
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".16em", color: "rgba(232,223,201,.35)", marginBottom: 32 }}>Passe o mouse para ver as métricas de cada post.</p>
        </FadeIn>
        <div className="mk-posts">
          {TOP_POSTS.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.08}>
              <PostCard post={post} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
            <Link href="/portfolio" style={{ display: "inline-flex", alignItems: "center", gap: 12, border: "1px solid rgba(232,223,201,.2)", padding: "13px 32px", borderRadius: 2, textDecoration: "none", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(232,223,201,.7)", transition: "border-color .2s, color .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(166,84,43,.6)"; (e.currentTarget as HTMLAnchorElement).style.color = "#E6DDD4"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(232,223,201,.2)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(232,223,201,.7)"; }}
            >
              Ver portfolio completo →
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ════════ 7. EXPEDIÇÕES ════════ */}
      <section className="mk-section">
        <FadeIn>
          <SectionLabel n="06" text="Expedições & Destinos" />
        </FadeIn>
        <div className="mk-destinations">
          {DESTINATIONS.map((d, i) => (
            <FadeIn key={d.name} delay={i * 0.05}>
              <div style={{ border: `1px solid ${d.upcoming ? "rgba(166,84,43,.5)" : "rgba(232,223,201,.1)"}`, borderRadius: 2, padding: "22px 18px", position: "relative", overflow: "hidden" }}>
                {d.upcoming && (
                  <div style={{ position: "absolute", top: 8, right: 8, fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: ".2em", textTransform: "uppercase", color: "#A6542B", border: "1px solid rgba(166,84,43,.5)", padding: "3px 7px" }}>Em breve</div>
                )}
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.35)", marginBottom: 6 }}>{d.loc}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "#E6DDD4", lineHeight: 1.3, marginBottom: 8 }}>{d.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(166,84,43,.85)" }}>{d.note}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════ 8. SERVIÇOS ════════ */}
      <section className="mk-section">
        <FadeIn>
          <SectionLabel n="07" text="Serviços" />
        </FadeIn>
        <div className="mk-services">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.name} delay={i * 0.07}>
              <div
                style={{ border: "1px solid rgba(232,223,201,.1)", borderRadius: 2, padding: "28px 24px", transition: "border-color .2s, background .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(166,84,43,.5)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(166,84,43,.05)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(232,223,201,.1)"; (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "#E6DDD4", marginBottom: 10 }}>{s.name}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "rgba(232,223,201,.55)", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════ 9. TRABALHOS COM MARCAS ════════ */}
      <section className="mk-section">
        <FadeIn>
          <SectionLabel n="08" text="Trabalhos com Marcas" />
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".16em", color: "rgba(232,223,201,.35)", marginBottom: 40 }}>
            Clique em qualquer trabalho para ver as fotos e métricas da publicação.
          </p>
        </FadeIn>
        <div className="mk-works">
          {BRAND_WORKS.map((work, i) => (
            <BrandWorkCard
              key={`${work.brand}-${work.product}`}
              work={work}
              delay={i * 0.05}
              onOpen={openLightbox}
            />
          ))}
        </div>
      </section>

      {/* ════════ 10. CRESCIMENTO / PICO ════════ */}
      <section className="mk-section" style={{ background: "rgba(166,84,43,.03)" }}>
        <FadeIn>
          <SectionLabel n="09" text="Trajetória" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }} className="mk-traj-grid">
            <div>
              <h2 style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(40px, 6vw, 72px)", color: "#E6DDD4", margin: "0 0 24px", lineHeight: 1.05, transform: "rotate(-1.5deg)", display: "inline-block" }}>A conta está crescendo</h2>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.75, color: "rgba(232,223,201,.65)", margin: "0 0 16px" }}>
                O crescimento não é fruto de tendências ou viralizações artificiais — é orgânico, consistente e construído sobre conteúdo real de campo. Cada expedição gera novos seguidores, novos salvamentos, novos compartilhamentos.
              </p>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.75, color: "rgba(232,223,201,.65)", margin: 0 }}>
                Com três expedições guiadas agendadas para 2026 e produções solo em curso, o volume de conteúdo vai aumentar. Entrar agora significa crescer junto.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Crescimento mensal",    val: "+1.028 seguidores",    note: "Orgânico · abril 2026" },
                { label: "Engagement rate",        val: "18,2%",               note: "Muito acima da média (3–5%)" },
                { label: "Alcance vs. seguidores", val: "18,5×",               note: "228k alcance / 12k seguidores" },
                { label: "Próximas expedições",    val: "3 grupos confirmados", note: "Lençóis Maranhenses · agosto 2026" },
              ].map(stat => (
                <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 0", borderBottom: "1px solid rgba(232,223,201,.06)" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.35)", marginBottom: 4 }}>{stat.label}</div>
                    <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 18, color: "#E6DDD4" }}>{stat.val}</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#A6542B", textAlign: "right", maxWidth: 160, lineHeight: 1.4 }}>{stat.note}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ════════ 11. CTA / CONTATO ════════ */}
      <section style={{ padding: "clamp(64px, 10vw, 120px) clamp(20px, 5vw, 56px) clamp(56px, 8vw, 100px)", textAlign: "center" }}>
        <FadeIn>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(232,223,201,.35)", marginBottom: 32 }}>10 · Vamos trabalhar juntos</div>
          <h2 style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(48px, 8vw, 96px)", color: "#E6DDD4", margin: "0 0 16px", transform: "rotate(-1.5deg)", display: "inline-block" }}>Vamos conversar</h2>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, color: "rgba(232,223,201,.6)", marginBottom: 48 }}>
            Para parcerias, licenciamentos e expedições com produção.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#A6542B", color: "#E6DDD4", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, letterSpacing: ".06em", textDecoration: "none", padding: "14px 32px", borderRadius: 2, transition: "background .2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#C2592B")}
              onMouseLeave={e => (e.currentTarget.style.background = "#A6542B")}
            >
              WhatsApp — +55 11 98812-8064
            </a>
            <a href="mailto:hen.pimenta@gmail.com"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(232,223,201,.25)", color: "#E6DDD4", fontFamily: "var(--font-ui)", fontSize: 13, textDecoration: "none", padding: "14px 32px", borderRadius: 2, transition: "border-color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(166,84,43,.7)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(232,223,201,.25)")}
            >
              hen.pimenta@gmail.com
            </a>
          </div>

          <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Instagram", val: "@henriq.eu",     href: "https://instagram.com/henriq.eu" },
              { label: "YouTube",   val: "@henriq_eu",     href: "https://youtube.com/@henriq_eu" },
              { label: "Site",      val: "euhenriq.com.br", href: "https://euhenriq.com.br" },
            ].map(c => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(232,223,201,.35)", marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "rgba(232,223,201,.7)" }}>{c.val}</div>
              </a>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER STRIP ── */}
      <div style={{ padding: "24px clamp(20px, 5vw, 56px)", borderTop: "1px solid rgba(232,223,201,.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.2)" }}>Henrique Sesana · Media Kit 2026</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.2)" }}>euhenriq.com.br</span>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && <BrandLightbox state={lightbox} onClose={closeLightbox} />}
    </main>
  );
}
