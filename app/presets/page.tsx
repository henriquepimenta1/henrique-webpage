"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";

// ── Data ──────────────────────────────────────────────────────────────────────

const CAT_COLOR: Record<string, string> = {
  "Tom Verde":   "#7EC47E",
  "Tom Azul":    "#6FA3D8",
  "Tom Laranja": "#D8924A",
  "Aesthetic":   "#C8905A",
};

interface Preset { key: string; name: string; desc: string; cat: string }

const PRESETS: Preset[] = [
  // Tom Verde
  { key:"1-antigo",            cat:"Tom Verde",   name:"Tom Verde — Antigo",            desc:"Tons de terra aquecida com verde desaturado e contraste suave." },
  { key:"2-bosque",            cat:"Tom Verde",   name:"Tom Verde — Bosque",            desc:"Verdes profundos com sombras frias e midtones naturais." },
  { key:"3-refugio-na-selva",  cat:"Tom Verde",   name:"Tom Verde — Refúgio na Selva",  desc:"Selva densa com contraste elevado e verdes saturados." },
  { key:"4-pradaria",          cat:"Tom Verde",   name:"Tom Verde — Pradaria",          desc:"Pradaria aberta com céu claro e verdes suaves." },
  { key:"5-classico-antigo",   cat:"Tom Verde",   name:"Tom Verde — Clássico Antigo",   desc:"Look vintage com esverdeados faded e highlights quentes." },
  { key:"6-dourado-reluzente", cat:"Tom Verde",   name:"Tom Verde — Dourado Reluzente", desc:"Verde-dourado luminoso para horas mágicas." },
  { key:"7-intenso",           cat:"Tom Verde",   name:"Tom Verde — Intenso",           desc:"Verdes vivos com blacks esmagados e drama alto." },
  { key:"8-abissal",           cat:"Tom Verde",   name:"Tom Verde — Abissal",           desc:"Floresta profunda quase sem luz, atmosfera densa." },
  // Tom Azul
  { key:"9-harmonia-verde-azul",   cat:"Tom Azul", name:"Tom Azul — Harmonia Verde-azul",  desc:"Equilíbrio entre verdes e azuis oceânicos." },
  { key:"10-frionoturno",          cat:"Tom Azul", name:"Tom Azul — Frio Noturno",         desc:"Azuis frios noturnos com sombras profundas." },
  { key:"11-devaneio",             cat:"Tom Azul", name:"Tom Azul — Devaneio",             desc:"Tons oníricos entre azul e lavanda." },
  { key:"12-ilha-solitaria",       cat:"Tom Azul", name:"Tom Azul — Ilha Solitária",       desc:"Azul oceano isolado com horizonte limpo." },
  { key:"13-luz-do-dia",           cat:"Tom Azul", name:"Tom Azul — Luz do Dia",           desc:"Azul claro diurno com highlights brancos e limpos." },
  { key:"14-vista-do-oceano",      cat:"Tom Azul", name:"Tom Azul — Vista do Oceano",      desc:"Profundidade oceânica com azuis saturados." },
  { key:"15-evaporacao",           cat:"Tom Azul", name:"Tom Azul — Evaporação",           desc:"Brumas azuladas suaves sobre água parada." },
  { key:"16-pastelado",            cat:"Tom Azul", name:"Tom Azul — Pastelado",            desc:"Paleta pastel com azuis lavados e suaves." },
  { key:"17-nevoa-suave",          cat:"Tom Azul", name:"Tom Azul — Névoa Suave",          desc:"Névoa matinal clara com azuis esmaecidos." },
  { key:"18-nevoa-esmaecida",      cat:"Tom Azul", name:"Tom Azul — Névoa Esmaecida",      desc:"Névoa densa com tons esmaecidos e frios." },
  { key:"19-oceano",               cat:"Tom Azul", name:"Tom Azul — Oceano",               desc:"Oceano profundo com azuis intensos." },
  { key:"19-praia-azul",           cat:"Tom Azul", name:"Tom Azul — Praia Azul",           desc:"Praia tropical com azul turquesa e areia clara." },
  { key:"20-atlantico-tropical",   cat:"Tom Azul", name:"Tom Azul — Atlântico Tropical",   desc:"Tropical saturado com contraste de azul e branco." },
  // Tom Laranja
  { key:"21-campo-seco",           cat:"Tom Laranja", name:"Tom Laranja — Campo Seco",          desc:"Terra seca com laranja queimado e sombras quentes." },
  { key:"22-amarelo-e-turquesa",   cat:"Tom Laranja", name:"Tom Laranja — Amarelo e Turquesa",  desc:"Contraste vibrante entre amarelo e turquesa." },
  { key:"22-poente",               cat:"Tom Laranja", name:"Tom Laranja — Poente",              desc:"Pôr do sol intenso com laranja-vermelho saturado." },
  { key:"23-plantacoes",           cat:"Tom Laranja", name:"Tom Laranja — Plantações",          desc:"Campos dourados com luz de tarde quente." },
  { key:"24-orla",                 cat:"Tom Laranja", name:"Tom Laranja — Orla",                desc:"Linha de costa com laranjas e areia dourada." },
  // Aesthetic
  { key:"mountain-lake", cat:"Aesthetic", name:"Aesthetic — Explorador",            desc:"Look de explorador com tons naturais e contraste equilibrado." },
  { key:"hiker",         cat:"Aesthetic", name:"Aesthetic — Verde Suave",           desc:"Verde delicado com sensação de frescura e calma." },
  { key:"hiker",         cat:"Aesthetic", name:"Aesthetic — Caminhante",            desc:"Tons de trilha com terra e musgo, luz filtrada." },
  { key:"mountain-lake", cat:"Aesthetic", name:"Aesthetic — Gelado",               desc:"Frio ártico com azuis pálidos e ar cristalino." },
  { key:"mountain-lake", cat:"Aesthetic", name:"Aesthetic — Contador de Histórias", desc:"Warm filmic com granulado e peso narrativo." },
  { key:"desert-dunes",  cat:"Aesthetic", name:"Aesthetic — Campo Aberto",         desc:"Amplitude e luz aberta com tons dourados." },
  { key:"desert-dunes",  cat:"Aesthetic", name:"Aesthetic — Liberdade",            desc:"Céu aberto, horizonte largo, luz limpa." },
  { key:"mountain-lake", cat:"Aesthetic", name:"Aesthetic — Cinemático",           desc:"Drama clássico com contraste alto e paleta neutra." },
  { key:"hiker",         cat:"Aesthetic", name:"Aesthetic — Verde Desbotado",      desc:"Verde esmaecido com sensação analógica." },
  { key:"desert-dunes",  cat:"Aesthetic", name:"Aesthetic — Suavidade",            desc:"Paleta suave com altas luzes leves e sombras abertas." },
  { key:"mineral",       cat:"Aesthetic", name:"Aesthetic — Intermediário",        desc:"Equilíbrio entre quente e frio, versátil." },
  { key:"mineral",       cat:"Aesthetic", name:"Aesthetic — Sonhos",              desc:"Atmosfera etérea com highlights queimados." },
  { key:"mineral",       cat:"Aesthetic", name:"Aesthetic — Nostalgia",           desc:"Filme analógico com warmth e granulado sutil." },
  { key:"hiker",         cat:"Aesthetic", name:"Aesthetic — Montanha Cerrada",    desc:"Neblina de altitude com verdes densos e frios." },
  { key:"mountain-lake", cat:"Aesthetic", name:"Aesthetic — Reflexo Ártico",      desc:"Reflexos azul-gelo com frieza etérea." },
  { key:"desert-dunes",  cat:"Aesthetic", name:"Aesthetic — Resiliência",         desc:"Terra árida com luz resiliente e tons ocre." },
  { key:"mineral",       cat:"Aesthetic", name:"Aesthetic — Duradouro",           desc:"Permanência com tons terrosos e sombras ricas." },
  { key:"desert-dunes",  cat:"Aesthetic", name:"Aesthetic — Areia",              desc:"Areia e luz difusa, paleta mínima e quente." },
];

const TREE = [
  { id: "verde",   label: "Tom Verde",   color: "#7EC47E", count: 8 },
  { id: "azul",    label: "Tom Azul",    color: "#6FA3D8", count: 13 },
  { id: "laranja", label: "Tom Laranja", color: "#D8924A", count: 6 },
];

const ACCORDION = [
  {
    title: "Detalhes do Produto",
    body: "Dois estilos complementares — Tone-Based e Aesthetic. Cada preset foi ajustado manualmente para funcionar em condições externas variadas: hora dourada, céu nublado, sol forte e hora azul. Funciona em RAW e JPEG.",
  },
  {
    title: "Especificações & Compatibilidade",
    body: "• Formato: .xmp (Desktop) + .dng (Mobile)\n• Lightroom Classic, CC e Mobile\n• RAW e JPEG\n• Compra única · Acesso vitalício\n• Download imediato após compra",
  },
  {
    title: "Como obter os melhores resultados",
    body: "Fotografe em RAW sempre que possível. Corrija a exposição antes de aplicar. Ajuste a intensidade com o slider Amount (80–100%). Os presets são pontos de partida — não regras.",
  },
  {
    title: "Política de Reembolso",
    body: "Por se tratar de conteúdo digital, não oferecemos reembolso após download. Se tiver dúvidas antes de comprar, envie um e-mail para management@henriq.eu.",
  },
];

const CTA_URL = "https://pay.cakto.com.br/C4dmPFR";

// ── Before/After Slider ────────────────────────────────────────────────────────

function BASlider({ preset }: { preset: Preset | null }) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const lineRef  = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const wrap  = wrapRef.current;
    const after = afterRef.current;
    const line  = lineRef.current;
    if (!wrap || !after || !line) return;
    const r = wrap.getBoundingClientRect();
    let p = ((clientX - r.left) / r.width) * 100;
    p = Math.min(Math.max(p, 1), 99);
    after.style.clipPath = `inset(0 0 0 ${p}%)`;
    line.style.left = `${p}%`;
  }, []);

  useEffect(() => {
    const onUp       = () => { dragging.current = false; };
    const onMove     = (e: MouseEvent) => { if (dragging.current) move(e.clientX); };
    const onTouchMove = (e: TouchEvent) => { if (dragging.current) move(e.touches[0].clientX); };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchend", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [move]);

  useEffect(() => {
    if (afterRef.current) afterRef.current.style.clipPath = "inset(0 0 0 50%)";
    if (lineRef.current)  lineRef.current.style.left = "50%";
  }, [preset?.name]);

  if (!preset) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed text-center"
        style={{ aspectRatio: "4/3", borderColor: "#2B2420", background: "#161310" }}
      >
        <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#38302C" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm" style={{ color: "#4C4440" }}>Selecione um preset<br />para ver o antes e depois</p>
      </div>
    );
  }

  const imgPath = (key: string, before?: boolean) =>
    key.startsWith("mountain") || key.startsWith("hiker") || key.startsWith("desert") || key.startsWith("mineral")
      ? `/images/${key}.jpg`
      : `/images/presets/${key}${before ? "-before" : ""}.jpg`;

  const color = CAT_COLOR[preset.cat] || "#AAA";

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-base" style={{ color: "#E6DDD4" }}>{preset.name}</p>
          <p className="text-xs mt-0.5 leading-relaxed max-w-xs" style={{ color: "#887E76" }}>{preset.desc}</p>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>{preset.cat}</span>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-xl cursor-col-resize select-none"
        style={{ aspectRatio: "4/3" }}
        onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
        onTouchStart={(e) => { dragging.current = true; move(e.touches[0].clientX); }}
      >
        {/* Before */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${imgPath(preset.key, true)}')` }} />
        {/* After */}
        <div ref={afterRef} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${imgPath(preset.key)}')`, clipPath: "inset(0 0 0 50%)" }} />
        {/* Line */}
        <div ref={lineRef} className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-none" style={{ left: "50%", transform: "translateX(-50%)", width: 2, background: "#fff" }}>
          <div className="w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#A09890" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
            </svg>
          </div>
        </div>
        <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-black/40 text-white">Antes</span>
        <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-white/85 text-[#0E0C0A]">Depois</span>
      </div>
      <p className="text-[10px] text-center" style={{ color: "#4C4440" }}>← Arraste para comparar →</p>
    </div>
  );
}

// ── Accordion ─────────────────────────────────────────────────────────────────

function Accordion({ items }: { items: typeof ACCORDION }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ borderTop: "1px solid #2B2420" }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: "1px solid #2B2420" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-sm transition-colors"
            style={{ color: open === i ? "#C8905A" : "#E6DDD4" }}
          >
            <span>{item.title}</span>
            <svg
              className="w-4 h-4 transition-transform duration-300"
              style={{ transform: open === i ? "rotate(180deg)" : "none", color: "#4C4440" }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className="overflow-hidden transition-all duration-300 text-[13px] leading-relaxed whitespace-pre-line"
            style={{ maxHeight: open === i ? 300 : 0, opacity: open === i ? 1 : 0, color: "#8A8078", paddingBottom: open === i ? 16 : 0 }}
          >
            {item.body}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PresetsPage() {
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(PRESETS[0]);
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({
    tone: true, verde: true, azul: true, laranja: true, aesthetic: true,
  });

  const toggleCat = (id: string) => setOpenCats((p) => ({ ...p, [id]: !p[id] }));
  const byLabel   = (label: string) => PRESETS.filter((p) => p.cat === label);

  return (
    <div style={{ background: "#0E0C0A", color: "#E6DDD4", minHeight: "100vh" }}>

      {/* ── STICKY BAR (nav + CTA combinados) ── */}
      <header
        className="sticky z-50 px-8"
        style={{ top: 0, background: "rgba(22,19,16,.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid #2B2420" }}
        id="cta"
      >
        <div className="flex items-center justify-between h-14" style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Logo */}
          <Link href="/" className="font-semibold text-sm tracking-wide flex-shrink-0" style={{ color: "#E6DDD4" }}>
            henriq.eu
          </Link>

          {/* Produto info */}
          <div className="hidden md:flex items-center gap-4 text-[11px]" style={{ color: "#60584E" }}>
            <span style={{ color: "#746A62" }}>Cinematic Essence</span>
            {[
              { color: "#7EC47E", label: "Verde", n: 8 },
              { color: "#6FA3D8", label: "Azul", n: 13 },
              { color: "#D8924A", label: "Laranja", n: 6 },
              { color: "#C8905A", label: "Aesthetic", n: 18 },
            ].map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span style={{ color: "#2B2420" }}>·</span>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                {c.label} {c.n}
              </span>
            ))}
          </div>

          {/* Preço + CTA */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm" style={{ color: "#E6DDD4" }}>R$39,90</span>
              <span className="line-through text-xs" style={{ color: "#4C4440" }}>R$79,90</span>
              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: "rgba(200,144,90,.18)", color: "#C8905A" }}>50% off</span>
            </div>
            <a
              href={CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold uppercase tracking-widest px-5 py-2 rounded-full transition-all hover:opacity-90"
              style={{ background: "#E6DDD4", color: "#0E0C0A" }}
            >
              Obter Agora
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#0E0C0A", borderBottom: "1px solid #2B2420" }}
      >
        {/* bg image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/desert-dunes.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(.18)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center px-8 py-32" style={{ maxWidth: 900, margin: "0 auto" }}>
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-[.22em] mb-6 px-4 py-1.5 rounded-full"
            style={{ border: "1px solid #2B2420", color: "#C8905A" }}
          >
            Coleção Completa · 45 Presets para Lightroom
          </span>
          <h1 className="font-light leading-tight mb-6" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", color: "#E6DDD4" }}>
            Traz profundidade, cor<br />e <span className="font-bold">atmosfera</span> para as tuas fotos.
          </h1>
          <p className="text-base leading-relaxed mb-4 max-w-xl" style={{ color: "#A09890" }}>
            Criados em condições reais — sol intenso, névoa, dunas, floresta, montanhas.
            Sem look artificial. Só tons honestos, contraste limpo
            e o mood cinemático que faz uma cena respirar.
          </p>
          <p className="text-sm mb-10" style={{ color: "#60584E" }}>
            RAW ou JPEG · Mobile ou Desktop · Um clique.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href={CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-semibold px-8 py-4 rounded-full transition-all hover:opacity-90 text-sm uppercase tracking-wider"
              style={{ background: "#E6DDD4", color: "#0E0C0A" }}
            >
              Obter a Coleção — R$39,90
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
            <a
              href="#presets"
              className="text-sm transition-colors hover:text-[#E6DDD4]"
              style={{ color: "#60584E" }}
            >
              Ver os 45 presets ↓
            </a>
          </div>
          <p className="mt-6 text-[11px]" style={{ color: "#38302C" }}>Compra única · Acesso vitalício · Download imediato</p>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="px-8 py-4" style={{ borderBottom: "1px solid #2B2420", background: "#0E0C0A" }}>
        <div className="flex items-center justify-center gap-8 flex-wrap text-[10px] uppercase tracking-widest" style={{ color: "#38302C" }}>
          {["Sem look artificial", "Tons honestos", "Contraste limpo", "RAW & JPEG", "Mobile & Desktop", "Um clique"].map((t, i) => (
            <span key={i} className="flex items-center gap-3">
              {i > 0 && <span>·</span>}
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── PROBLEMA → SOLUÇÃO ── */}
      <section className="py-24 px-8" style={{ background: "#0E0C0A", borderBottom: "1px solid #2B2420" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p className="text-[10px] uppercase tracking-widest mb-8 text-center" style={{ color: "#60584E" }}>O Problema</p>
          <h2 className="text-3xl md:text-4xl font-light leading-tight text-center mb-16" style={{ color: "#E6DDD4" }}>
            Cansado de filtros que deixam<br />as tuas fotos <span className="font-semibold">genéricas e sem alma?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "✗",
                title: "Filtros de Instagram",
                desc: "Saturação artificial, cores plásticas. O resultado parece igual a milhões de outras fotos.",
              },
              {
                icon: "✗",
                title: "Packs Genéricos",
                desc: "Criados em estúdio para looks trend. Falham em condições reais de exterior — luz dura, neblina, hora azul.",
              },
              {
                icon: "✗",
                title: "Edição manual hora a hora",
                desc: "Cada foto do zero. Sem coerência entre imagens, sem identidade visual consistente na galeria.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl p-6"
                style={{ border: "1px solid #2B2420", background: "#161310" }}
              >
                <span className="text-lg mb-3 block" style={{ color: "#3A2E28" }}>{item.icon}</span>
                <p className="font-semibold text-sm mb-2" style={{ color: "#746A62" }}>{item.title}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "#4C4440" }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg font-light mb-2" style={{ color: "#E6DDD4" }}>
              Este não é um pack de filtros simples.
            </p>
            <p className="text-base" style={{ color: "#887E76" }}>
              É a <strong style={{ color: "#C8905A", fontWeight: 600 }}>Cinematic Essence</strong> — uma coleção construída num único princípio:
            </p>
            <p className="text-xl font-semibold mt-3" style={{ color: "#E6DDD4" }}>
              O Mood é a Mensagem.
            </p>
          </div>
        </div>
      </section>

      {/* ── PRODUTO PRINCIPAL ── */}
      <section className="py-24 px-8" style={{ background: "#161310", borderBottom: "1px solid #2B2420" }} id="produto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start" style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* LEFT sticky images */}
          <div className="space-y-3" style={{ position: "sticky", top: 72 }}>
            <div className="rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/desert-dunes.jpg" alt="Desert dunes" className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["/images/dunes-aerial.jpg", "/images/hiker.jpg", "/images/mineral.jpg"].map((src, i) => (
                <div key={i} className="rounded-lg overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover" style={{ objectPosition: i === 1 ? "top" : "center" }} />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8 pt-1">
            <div>
              <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#60584E" }}>Coleção Completa · 45 Presets</p>
              <h2 className="text-4xl font-light leading-tight mb-4" style={{ color: "#E6DDD4" }}>
                Outdoor <span className="font-bold">Cinematic Presets</span>
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: "#A09890" }}>
                Não edites só a exposição — dirge a cena.
                Cada preset é nomeado pela sensação e ambiente que foi criado para evocar.
                Não estás apenas a ajustar temperatura e saturação.
                Estás a dar ao teu público <em style={{ color: "#E6DDD4" }}>uma cena para entrar.</em>
              </p>
            </div>

            {/* Dois estilos */}
            <div className="space-y-3">
              {[
                {
                  color: "#7EC47E",
                  tag: "Tone-Based · 27 Presets",
                  title: "Moldam o Ambiente",
                  desc: "Alteram a atmosfera visual da cena — tons quentes, verdes profundos, azuis oceânicos, dourado do pôr do sol, névoa, dunas, luz fria. Trabalham o ambiente.",
                  examples: ["Horizon Drift", "Evergreen Mist", "Dunes Gold"],
                },
                {
                  color: "#C8905A",
                  tag: "Aesthetic · 18 Presets",
                  title: "Moldam o Sentimento",
                  desc: "Criam uma atmosfera sentimental — calor suave, nostalgia, drama silencioso, peso narrativo. Não mudam o que vês. Mudam o que sentes.",
                  examples: ["Old Memory Film", "Reverie Glow", "Deep Cinema"],
                },
              ].map((card) => (
                <div key={card.title} className="rounded-xl p-6" style={{ border: "1px solid #2B2420", background: "#0E0C0A" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: card.color }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: card.color }}>{card.tag}</span>
                  </div>
                  <p className="font-semibold text-base mb-2" style={{ color: "#E6DDD4" }}>{card.title}</p>
                  <p className="text-[13px] leading-relaxed mb-3" style={{ color: "#746A62" }}>{card.desc}</p>
                  <div className="flex gap-2 flex-wrap">
                    {card.examples.map((ex) => (
                      <span key={ex} className="text-[10px] px-2 py-1 rounded" style={{ background: "#1E1B17", color: "#60584E" }}>{ex}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Preço + CTA */}
            <div className="rounded-xl p-6 space-y-4" style={{ border: "1px solid #2B2420", background: "#0E0C0A" }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold" style={{ color: "#E6DDD4" }}>R$39,90</span>
                <span className="line-through text-lg" style={{ color: "#4C4440" }}>R$79,90</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: "#E6DDD4", color: "#0E0C0A" }}>50% OFF</span>
              </div>
              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 font-semibold py-4 rounded-full w-full text-sm uppercase tracking-wider transition-all hover:opacity-90"
                style={{ background: "#E6DDD4", color: "#0E0C0A" }}
              >
                Obter a Coleção Completa
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
              <p className="text-[11px] text-center" style={{ color: "#4C4440" }}>Compra única · Acesso vitalício · Download imediato</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {["RAW", "JPEG", "Lightroom Mobile", "Lightroom Classic", "Acesso vitalício", ".xmp + .dng"].map((tag) => (
                <span key={tag} className="text-[10px] rounded-full px-3 py-1" style={{ color: "#887E76", border: "1px solid #2B2420", background: "#1E1B17" }}>{tag}</span>
              ))}
            </div>

            <Accordion items={ACCORDION} />
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="py-24 px-8" style={{ background: "#0E0C0A", borderBottom: "1px solid #2B2420" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p className="text-[10px] uppercase tracking-widest mb-3 text-center" style={{ color: "#60584E" }}>Liberdade criativa, não regras</p>
          <h2 className="text-3xl font-light leading-tight text-center mb-4" style={{ color: "#E6DDD4" }}>
            Para de editar.<br /><span className="font-bold">Começa a dirigir.</span>
          </h2>
          <p className="text-sm leading-relaxed text-center mb-16 max-w-xl mx-auto" style={{ color: "#746A62" }}>
            Os presets são ferramentas criativas flexíveis — não receitas fixas.
            Experimentar um "Tom Quente" numa foto de dia de chuva pode criar resultados artísticos inesperados e poderosos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Profundidade Emocional",
                desc: "Detalhes ricos nas sombras, transições de cor suaves e o rácio perfeito contraste/cor que captura atenção e prende o olhar.",
              },
              {
                num: "02",
                title: "Coerência Narrativa",
                desc: "Mesmo ao misturar presets diferentes — paisagem com retrato — a galeria mantém uma linguagem visual consistente e de alto nível.",
              },
              {
                num: "03",
                title: "Resultados em Segundos",
                desc: "Fotografa em RAW. Aplica o preset. Ajusta o Amount. É o ponto de partida, não o fim — mas chega lá muito mais rápido.",
              },
            ].map((item) => (
              <div key={item.num}>
                <span className="block text-5xl font-light mb-4" style={{ color: "#2B2420" }}>{item.num}</span>
                <p className="font-semibold mb-2 text-sm" style={{ color: "#E6DDD4" }}>{item.title}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "#60584E" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESET EXPLORER ── */}
      <section className="py-24 px-8" style={{ background: "#161310", borderTop: "1px solid #2B2420" }} id="presets">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#60584E" }}>Explorador Interativo</p>
            <h2 className="text-3xl font-light" style={{ color: "#E6DDD4" }}>Vê os <span className="font-bold">45 Presets</span></h2>
            <p className="text-sm mt-2" style={{ color: "#887E76" }}>Clica em qualquer preset para ver o antes e depois. Arrasta para comparar.</p>
          </div>

          <div className="grid gap-10 items-start" style={{ gridTemplateColumns: "280px 1fr" }}>

            {/* TREE */}
            <div className="space-y-1 select-none" style={{ position: "sticky", top: 72 }}>

              {/* Tone-Based */}
              <div>
                <button
                  onClick={() => toggleCat("tone")}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors"
                  style={{ background: openCats.tone ? "#1E1B17" : "transparent" }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#E6DDD4" }}>Tone-Based</span>
                    <span className="text-[10px]" style={{ color: "#4C4440" }}>27</span>
                  </div>
                  <svg className="w-3.5 h-3.5 transition-transform duration-250" style={{ transform: openCats.tone ? "rotate(180deg)" : "none", color: "#4C4440" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {openCats.tone && (
                  <div className="pl-3 space-y-0.5 mt-0.5">
                    {TREE.map((sub) => (
                      <div key={sub.id}>
                        <button onClick={() => toggleCat(sub.id)} className="w-full flex items-center gap-2 py-2 px-3 rounded-lg transition-colors hover:bg-[#1E1B17]">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sub.color }} />
                          <span className="text-xs font-medium" style={{ color: "#B2A89E" }}>{sub.label}</span>
                          <span className="text-[10px] ml-auto" style={{ color: "#38302C" }}>{sub.count}</span>
                          <svg className="w-3 h-3 transition-transform duration-250" style={{ transform: openCats[sub.id] ? "rotate(180deg)" : "none", color: "#4C4440" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {openCats[sub.id] && (
                          <div className="pl-4 space-y-0.5">
                            {byLabel(sub.label).map((p) => (
                              <button
                                key={p.key + p.name}
                                onClick={() => setSelectedPreset(p)}
                                className="w-full text-left py-1.5 px-3 rounded-md text-[12px] transition-colors hover:bg-[#1E1B17]"
                                style={{ color: selectedPreset?.name === p.name ? "#E6DDD4" : "#887E76", fontWeight: selectedPreset?.name === p.name ? 600 : 400 }}
                              >
                                {selectedPreset?.name === p.name && <span style={{ marginRight: 6, fontSize: 10 }}>→</span>}
                                {p.name.split(" — ")[1]}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Aesthetic */}
              <div className="mt-2">
                <button
                  onClick={() => toggleCat("aesthetic")}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors"
                  style={{ background: openCats.aesthetic ? "#1E1B17" : "transparent" }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#E6DDD4" }}>Aesthetic</span>
                    <span className="text-[10px]" style={{ color: "#4C4440" }}>18</span>
                  </div>
                  <svg className="w-3.5 h-3.5 transition-transform duration-250" style={{ transform: openCats.aesthetic ? "rotate(180deg)" : "none", color: "#4C4440" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {openCats.aesthetic && (
                  <div className="pl-3 space-y-0.5 mt-0.5">
                    {byLabel("Aesthetic").map((p) => (
                      <button
                        key={p.key + p.name}
                        onClick={() => setSelectedPreset(p)}
                        className="w-full text-left py-1.5 px-3 rounded-md text-[12px] transition-colors hover:bg-[#1E1B17]"
                        style={{ color: selectedPreset?.name === p.name ? "#E6DDD4" : "#887E76", fontWeight: selectedPreset?.name === p.name ? 600 : 400 }}
                      >
                        {selectedPreset?.name === p.name && <span style={{ marginRight: 6, fontSize: 10 }}>→</span>}
                        {p.name.split(" — ")[1]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* B/A PANEL */}
            <div style={{ position: "sticky", top: 72 }}>
              <BASlider preset={selectedPreset} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        className="relative overflow-hidden py-32 px-8 text-center"
        style={{ background: "#0E0C0A", borderTop: "1px solid #2B2420" }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: "url(/images/mountain-lake.jpg)", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(.12)" }} />
        <div className="relative z-10" style={{ maxWidth: 700, margin: "0 auto" }}>
          <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: "#60584E" }}>Transforma o feeling. Afina a história.</p>
          <h2 className="text-3xl md:text-4xl font-light leading-tight mb-6" style={{ color: "#E6DDD4" }}>
            Pronto para transformar o teu<br />conteúdo em <span className="font-bold">storytelling cinemático?</span>
          </h2>
          <p className="text-sm leading-relaxed mb-10" style={{ color: "#746A62" }}>
            45 presets. Dois estilos complementares. Uma compra.<br />
            Começa a trabalhar com identidade visual hoje.
          </p>
          <a
            href={CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-semibold px-10 py-4 rounded-full text-sm uppercase tracking-wider transition-all hover:opacity-90"
            style={{ background: "#E6DDD4", color: "#0E0C0A" }}
          >
            Obter por R$39,90
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <p className="mt-5 text-[11px]" style={{ color: "#38302C" }}>Compra única · Acesso vitalício · Download imediato</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
