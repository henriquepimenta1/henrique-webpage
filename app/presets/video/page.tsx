"use client";

// Outdoor Cinematic LUTs — LP (PT-BR · dark cinema · vídeo-native "mesa de cor")
// 21 LUTs · 6 famílias · 5 perfis log · referência cinematográfica (inspiração, não cópia)
// Cada clipe (.mp4) já é o antes/depois: abre em LOG (chapado) e revela o LUT. Self-reveal — sem wipe.
// Portado de luts-foto.jsx (protótipo) para Next App Router.

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";

// vídeo por LUT — slug derivado do nome bate com /videos/luts/<slug>.mp4
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const VID = (l: Lut) => "/videos/luts/" + slugify(l.name) + ".mp4";
const COVER = (l: Lut) => "/videos/luts/covers/" + slugify(l.name) + "-cover.jpg";
const pad = (n: number) => String(n).padStart(2, "0");

// ── Comercial ───────────────────────────────────────────────
const LUT_PRICE = "37,90";
const LUT_PARCEL = "4,93";
const LUT_N = "9";
const LUT_FROM = "99";
const LUT_CTA = "https://pay.cakto.com.br/6tNxcGs";

// ── As 6 famílias ───────────────────────────────────────────
interface Fam {
  id: string;
  tag: string;
  label: string;
  dot: string;
  note: string;
}
const FAMS: Fam[] = [
  { id: "epic",    tag: "EPIC",    label: "Grandioso",      dot: "#D8924A", note: "vista dramática, cor a serviço da escala" },
  { id: "moody",   tag: "MOODY",   label: "Atmosférico",    dot: "#6FA3D8", note: "frio, névoa, noturno — o ambiente é o personagem" },
  { id: "golden",  tag: "GOLDEN",  label: "Quente",         dot: "#C2803D", note: "luz de fim de tarde e memória afetiva" },
  { id: "vivid",   tag: "VIVID",   label: "Saturado limpo", dot: "#3FA6A6", note: "cor viva, punchy, diurna" },
  { id: "natural", tag: "NATURAL", label: "Fiel",           dot: "#9FB377", note: "base honesta, contida, naturalista" },
  { id: "mono",    tag: "MONO",    label: "Preto & branco", dot: "#B8B5AE", note: "monocromático dramático" },
];
const famOf = (id: string) => FAMS.find((f) => f.id === id)!;

// ── Os 21 LUTs ──────────────────────────────────────────────
interface Lut {
  name: string;
  fam: string;
  grad: string;
  desc: string;
  spot: string;
  use: string;
  ref: string;
  dp: string;
}
const LUTS: Lut[] = [
  // [EPIC] — grandioso
  { name: "Fantasia Light", fam: "epic", grad: "linear-gradient(135deg,#1a1206 0%,#7a5a1e 52%,#e0b15a 100%)",
    desc: "Dourado mítico e céus pesados que dão peso de lenda a uma vista.", spot: "vales & céus de tempestade",
    use: "Vales, vistas amplas, céus de tempestade ao entardecer — qualquer paisagem que conta uma história grande.",
    ref: "The NeverEnding Story (1984)", dp: "Jost Vacano" },
  { name: "Imperial Gold", fam: "epic", grad: "linear-gradient(135deg,#2a0e0e 0%,#8a3a1e 50%,#e0a83a 100%)",
    desc: "Vermelho imperial e dourado quente contra a montanha — cor ousada a serviço da escala.", spot: "montanhas amplas",
    use: "Montanhas, planícies amplas, paisagens largas que pedem cor quente e ousada.",
    ref: "Mulan (2020)", dp: "Mandy Walker" },
  { name: "Crimson Dune", fam: "epic", grad: "linear-gradient(135deg,#2a0814 0%,#8a1e3a 50%,#d9683a 100%)",
    desc: "Wash magenta-vermelho que transforma areia quente em assinatura sobrenatural.", spot: "dunas ao golden hour",
    use: "Dunas, trilhas de areia, deserto ao golden hour. Testado em Lençóis — assenta com blacks levantados e saturação domada.",
    ref: "Mandy (2018)", dp: "Benjamin Loeb" },
  { name: "Wild Expedition", fam: "epic", grad: "linear-gradient(135deg,#13300f 0%,#4a6b1e 50%,#d8b23e 100%)",
    desc: "Verde de selva saturado e luz dourada com energia de expedição.", spot: "mata & cachoeira",
    use: "Trilha de mata aberta, cachoeira, vista de selva — qualquer cena de aventura grandiosa.",
    ref: "Jumanji: Welcome to the Jungle (2017)", dp: "Gyula Pados" },
  // [MOODY] — atmosférico
  { name: "Green Spell", fam: "moody", grad: "linear-gradient(135deg,#0a1a0e 0%,#1d4a2e 52%,#3a6b32 100%)",
    desc: "Verde sobrenatural na névoa contra âmbar quente, com pretos densos.", spot: "mata em neblina",
    use: "Mata em neblina, floresta densa, twilight místico — cenas onde o ambiente domina.",
    ref: "Big Trouble in Little China (1986)", dp: "Dean Cundey" },
  { name: "Cold Vanguard", fam: "moody", grad: "linear-gradient(135deg,#0c1a30 0%,#2f4f6e 52%,#aebec8 100%)",
    desc: "Azul alpino profundo e neve dessaturada — frio que tem peso, não vazio.", spot: "neve de altitude",
    use: "Montanha, geleira, neve, luz fria de altitude, amanhecer gelado.",
    ref: "The Empire Strikes Back (1980)", dp: "Peter Suschitzky" },
  { name: "Grey Sorcery", fam: "moody", grad: "linear-gradient(135deg,#11181c 0%,#2a3f44 52%,#5a6e68 100%)",
    desc: "Azul-cinza desaturado e verde-petróleo sob céu carregado.", spot: "floresta overcast",
    use: "Floresta overcast, cidade enevoada, exteriores melancólicos de luz baixa.",
    ref: "Fantastic Beasts: Crimes of Grindelwald (2018)", dp: "Philippe Rousselot" },
  { name: "Miami Blue", fam: "moody", grad: "linear-gradient(135deg,#0a1228 0%,#1e3a5a 50%,#6a3a5a 100%)",
    desc: "Azul-ciano noturno e jogo magenta-teal sobre pele quente.", spot: "blue hour tropical",
    use: "Blue hour, noite tropical, crepúsculo — cenas íntimas onde a cor fala.",
    ref: "Moonlight (2016)", dp: "James Laxton" },
  // [GOLDEN] — quente
  { name: "Storybook Pastel", fam: "golden", grad: "linear-gradient(135deg,#2a2418 0%,#8a7a4a 52%,#e6d3a0 100%)",
    desc: "Pastel quente e amarelo-manteiga — doçura nostálgica de baixo contraste.", spot: "campos ensolarados",
    use: "Campos ensolarados, vilarejos, cenas outdoor íntimas com clima saudoso.",
    ref: "Jojo Rabbit (2019)", dp: "Mihai Mălaimare Jr." },
  { name: "Deco Amber", fam: "golden", grad: "linear-gradient(135deg,#241608 0%,#7a4a1e 52%,#d9a85a 100%)",
    desc: "Sépia-âmbar e dourado suave com contraste gentil.", spot: "cidade no golden hour",
    use: "Cidade no golden hour, transição interior-exterior quente, cenas nostálgicas.",
    ref: "Fantastic Beasts (2016)", dp: "Philippe Rousselot" },
  { name: "Soft Vigil", fam: "golden", grad: "linear-gradient(135deg,#241e18 0%,#5a4f42 52%,#b89a72 100%)",
    desc: "Luz baixa, macia e melancólica — bruma contemplativa sem nenhum frio.", spot: "neblina contemplativa",
    use: "Overcast, neblina, cenas contemplativas e quietas — tudo no registro quente.",
    ref: "A Ghost Story (2017)", dp: "Andrew Droz Palermo" },
  { name: "Sixties Sun", fam: "golden", grad: "linear-gradient(135deg,#2a1c0a 0%,#8a5a23 52%,#e7c06a 100%)",
    desc: "Sol dourado de fim de tarde com névoa quente e calor retrô.", spot: "estrada ao entardecer",
    use: "Golden hour aberto, estrada ao entardecer, paisagem com sol baixo nostálgico.",
    ref: "Once Upon a Time in Hollywood (2019)", dp: "Robert Richardson" },
  // [VIVID] — saturado limpo
  { name: "English Green", fam: "vivid", grad: "linear-gradient(135deg,#0e2a14 0%,#2e6b2e 50%,#6fb3d8 100%)",
    desc: "Verde-campo forte e céu azul punchy, alto contraste limpo.", spot: "campos diurnos vivos",
    use: "Campos claros, área rural, paisagens diurnas vivas e cheias de cor.",
    ref: "Hot Fuzz (2007)", dp: "Jess Hall" },
  { name: "Ocean Mirror", fam: "vivid", grad: "linear-gradient(135deg,#06222a 0%,#1e6b7a 50%,#7ad0d8 100%)",
    desc: "Água ciano saturada e superfície espelhada sob céu dramático.", spot: "lagoas & espelhos d'água",
    use: "Lagoas de Lençóis, mar, espelhos d'água, qualquer superfície refletiva.",
    ref: "Life of Pi (2012)", dp: "Claudio Miranda" },
  { name: "Tropic Pop", fam: "vivid", grad: "linear-gradient(135deg,#0e2a1a 0%,#2e8a5a 50%,#e0c84a 100%)",
    desc: "Cor tropical luxuosa e saturada — punchy e limpa.", spot: "tropical vibrante",
    use: "Cenas tropicais, cidade vibrante, vegetação e arquitetura com cor cheia.",
    ref: "Crazy Rich Asians (2018)", dp: "Vanja Černjul" },
  { name: "Deep Cyan", fam: "vivid", grad: "linear-gradient(135deg,#04181f 0%,#0e6a8a 50%,#e0b84a 100%)",
    desc: "Ciano elétrico e dourado saturadíssimos — alto impacto.", spot: "submerso & água profunda",
    use: "Submerso, água profunda, cenas aquáticas que pedem cor máxima.",
    ref: "Aquaman (2018)", dp: "Don Burgess" },
  // [NATURAL] — fiel
  { name: "Field Neutral", fam: "natural", grad: "linear-gradient(135deg,#1c2420 0%,#4a5a52 52%,#a8a692 100%)",
    desc: "Pele fiel e leve teal nas sombras — o look que não empurra nada.", spot: "base pra qualquer cena",
    use: "Ponto de partida para qualquer cena, qualquer luz. Base honesta e corretiva.",
    ref: "Taken (2008)", dp: "Michel Abramowicz" },
  { name: "Dust Road", fam: "natural", grad: "linear-gradient(135deg,#241e12 0%,#6b5a3a 52%,#c2a878 100%)",
    desc: "Dourado de poeira fiel e dessaturação leve, sem teal-and-orange forçado.", spot: "Atacama & terreno árido",
    use: "Atacama, terreno árido, trilhas secas, terra e poeira ao sol.",
    ref: "Hell or High Water (2016)", dp: "Giles Nuttgens" },
  { name: "Wet Jungle", fam: "natural", grad: "linear-gradient(135deg,#0e2012 0%,#2e4a22 52%,#7a7a3a 100%)",
    desc: "Verde de selva real, úmido e denso, com terra quente.", spot: "mangue & selva densa",
    use: "Mangue do Maranhão, floresta tropical, vegetação densa real.",
    ref: "Apocalypto (2006)", dp: "Dean Semler" },
  { name: "Earth & Ember", fam: "natural", grad: "linear-gradient(135deg,#241409 0%,#6b3a1e 52%,#c27a4a 100%)",
    desc: "Tons terrosos com corpo — fiel sem ser chapado.", spot: "planícies & terra seca",
    use: "Terreno aberto, planícies, terra seca, paisagem que pede corpo sem virar estilizado.",
    ref: "Killers of the Flower Moon (2023)", dp: "Rodrigo Prieto" },
  // [MONO] — preto & branco
  { name: "Salt & Silver", fam: "mono", grad: "linear-gradient(135deg,#08080a 0%,#44444a 52%,#cacace 100%)",
    desc: "P&B ortocromático — contraste extremo, grão pesado, céus escurecidos.", spot: "costa, rocha, tempestade",
    use: "Costa, rocha, tempestade, qualquer cena monocromática dramática.",
    ref: "The Lighthouse (2019)", dp: "Jarin Blaschke" },
];

const vibe = (ms = 8) => {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* noop */
  }
};

// ────────────────────────────────────────────────────────────
// ClipVideo — o .mp4 que se revela (LOG → LUT). mode: auto | hover
// ────────────────────────────────────────────────────────────
function ClipVideo({
  src,
  grad,
  mode = "auto",
  loop = true,
  onEnded,
}: {
  src: string;
  grad?: string;
  mode?: "auto" | "hover";
  loop?: boolean;
  onEnded?: () => void;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const wrap = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(mode === "auto");
  // cards (hover) só montam o vídeo ao chegar perto da viewport
  useEffect(() => {
    if (mode === "auto") {
      setMounted(true);
      return;
    }
    const el = wrap.current;
    if (!el || !("IntersectionObserver" in window)) {
      setMounted(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            setMounted(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "320px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);
  useEffect(() => {
    const v = ref.current;
    if (!v || !mounted) return;
    if (mode === "auto") {
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
      if (!reduce) {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      }
    }
  }, [src, mode, mounted]);
  const enter = () => {
    if (mode === "hover") {
      const v = ref.current;
      if (v) {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      }
    }
  };
  const leave = () => {
    if (mode === "hover") {
      const v = ref.current;
      if (v) {
        v.pause();
        try {
          v.currentTime = 0;
        } catch {
          /* noop */
        }
      }
    }
  };
  return (
    <div className="lut-clip" ref={wrap} onPointerEnter={enter} onPointerLeave={leave}>
      {grad && <div className="lut-clip-bg" style={{ background: grad }} />}
      {mounted && (
        <video ref={ref} className="lut-clip-v" src={src} muted loop={loop} playsInline preload="metadata" onEnded={onEnded} />
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// CineFrame — moldura cinemascope (barras · timecode · badge) c/ o clipe
// ────────────────────────────────────────────────────────────
function CineFrame({
  src,
  grad,
  ratio = "16 / 9",
  mode = "auto",
  loop = true,
  onEnded,
  name,
  fam,
  n,
  total = "21",
}: {
  src: string;
  grad?: string;
  ratio?: string;
  mode?: "auto" | "hover";
  loop?: boolean;
  onEnded?: () => void;
  name?: string;
  fam?: string;
  n?: number;
  total?: string;
}) {
  const f = fam ? famOf(fam) : null;
  return (
    <div className="lut-frame" style={{ aspectRatio: ratio }}>
      <div className="lut-bars lut-bars-top" />
      <ClipVideo src={src} grad={grad} mode={mode} loop={loop} onEnded={onEnded} />
      <div className="lut-bars lut-bars-bot" />
      <div className="lut-frame-badge">
        <b>log</b> → lut
      </div>
      {f && (
        <div className="lut-frame-fam">
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: f.dot }} />
          {f.tag}
        </div>
      )}
      <div className="lut-tc">
        <span>{name ? name.toUpperCase() : "OUTDOOR CINEMATIC"}</span>
        <div className="lut-tc-ticks">
          {Array.from({ length: 44 }).map((_, i) => (
            <span key={i} style={{ opacity: i % 4 === 0 ? 0.8 : 0.3 }} />
          ))}
        </div>
        <span>{n ? "№ " + pad(n) + " / " + total : total + " LUTS"}</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// HeroReel — auto-cicla picks EPIC/MOODY com crossfade (sem tela preta:
// os clipes ficam montados e só trocam de opacidade). Clicável + pausa no hover.
// ────────────────────────────────────────────────────────────
function HeroReel() {
  const picks = ["Crimson Dune", "Cold Vanguard", "Wild Expedition", "Miami Blue"]
    .map((nm) => LUTS.find((l) => l.name === nm))
    .filter(Boolean) as Lut[];
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const cur = picks[i];
  const f = famOf(cur.fam);

  // auto-ciclo
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (reduce || hold) return;
    const id = setInterval(() => setI((p) => (p + 1) % picks.length), 5200);
    return () => clearInterval(id);
  }, [hold, picks.length]);

  // só o clipe ativo toca
  useEffect(() => {
    vids.current.forEach((v, idx) => {
      if (!v) return;
      if (idx === i) {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        try {
          v.pause();
        } catch {
          /* noop */
        }
      }
    });
  }, [i]);

  return (
    <>
      <div
        className="lut-frame"
        style={{ aspectRatio: "16 / 9" }}
        onPointerEnter={() => setHold(true)}
        onPointerLeave={() => setHold(false)}
      >
        {picks.map((p, idx) => (
          <div
            key={p.name}
            className="lut-clip lut-clip-stack"
            style={{ opacity: idx === i ? 1 : 0, zIndex: idx === i ? 1 : 0 }}
          >
            <div className="lut-clip-bg" style={{ background: p.grad }} />
            <video
              ref={(el) => {
                vids.current[idx] = el;
              }}
              className="lut-clip-v"
              src={VID(p)}
              poster={COVER(p)}
              muted
              loop
              playsInline
              preload="auto"
              autoPlay
            />
          </div>
        ))}
        <div className="lut-bars lut-bars-top" />
        <div className="lut-bars lut-bars-bot" />
        {/* nome do LUT em uso — topo */}
        <div className="lut-frame-now">
          <span className="lut-frame-now-dot" style={{ background: f.dot }} />
          <span className="lut-frame-now-name">{cur.name}</span>
          <span className="lut-frame-now-fam">{f.tag}</span>
        </div>
        <div className="lut-frame-badge">
          <b>log</b> → lut
        </div>
        <div className="lut-tc">
          <span>EM USO · {cur.name.toUpperCase()}</span>
          <div className="lut-tc-ticks">
            {Array.from({ length: 44 }).map((_, k) => (
              <span key={k} style={{ opacity: k % 4 === 0 ? 0.8 : 0.3 }} />
            ))}
          </div>
          <span>№ {pad(LUTS.indexOf(cur) + 1)} / 21</span>
        </div>
      </div>
      <div className="lut-reel-chips">
        {picks.map((p, idx) => (
          <button
            key={p.name}
            className={"lut-reel-chip" + (idx === i ? " on" : "")}
            onClick={() => {
              setI(idx);
              vibe(8);
            }}
          >
            <span style={{ background: famOf(p.fam).dot }} />
            {p.name}
          </button>
        ))}
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Sticky bottom CTA (mobile)
// ────────────────────────────────────────────────────────────
function LutSticky() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onS = () => {
      const t = document.documentElement.scrollHeight - window.innerHeight;
      setShow(t > 0 && window.scrollY / t > 0.16);
    };
    window.addEventListener("scroll", onS, { passive: true });
    onS();
    return () => window.removeEventListener("scroll", onS);
  }, []);
  return (
    <div className="lut-sticky" style={{ transform: show ? "translateY(0)" : "translateY(110%)" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(232,223,201,.5)" }}>
          21 LUTs .cube · de R$ {LUT_FROM}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, color: "var(--canvas)" }}>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 21, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1 }}>R$ {LUT_PRICE}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(232,223,201,.5)" }}>{LUT_N}× R$ {LUT_PARCEL}</span>
        </div>
      </div>
      <a
        href={LUT_CTA}
        onClick={() => vibe(15)}
        style={{ padding: "13px 18px", background: "var(--rust-soft)", color: "#10140d", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap" }}
      >
        Comprar →
      </a>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Faixa de perfurações (sprockets) — identidade de filme
// ────────────────────────────────────────────────────────────
function Sprockets() {
  return (
    <div className="lut-sprockets" aria-hidden="true">
      {Array.from({ length: 60 }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Card de LUT (contact-sheet) — vídeo no hover, abre lightbox
// ────────────────────────────────────────────────────────────
function LutCard({ lut, n, onOpen }: { lut: Lut; n: number; onOpen: () => void }) {
  const f = famOf(lut.fam);
  return (
    <button
      className="lut-card"
      onClick={() => {
        onOpen();
        vibe(8);
      }}
    >
      <div className="lut-card-bg" style={{ background: lut.grad }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lut-card-cover" src={COVER(lut)} alt={lut.name + " — log vs lut"} loading="lazy" />
      <ClipVideo src={VID(lut)} grad={lut.grad} mode="hover" loop />
      <div className="lut-card-top">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", color: "rgba(245,241,232,.7)" }}>№ {String(n).padStart(2, "0")}</span>
        <span className="lut-card-play">▷</span>
      </div>
      <div className="lut-card-meta">
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: f.dot }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(245,241,232,.7)" }}>{f.tag}</span>
        </div>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 15, color: "var(--canvas)", lineHeight: 1.05 }}>{lut.name}</div>
        <div className="lut-card-spot">{lut.spot}</div>
      </div>
    </button>
  );
}

// ────────────────────────────────────────────────────────────
// Lightbox de comparação
// ────────────────────────────────────────────────────────────
function LutLightbox({ index, onClose, onNav }: { index: number; onClose: () => void; onNav: (d: number) => void }) {
  const lut = LUTS[index];
  const f = famOf(lut.fam);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);
  return (
    <div className="lut-lb" onClick={onClose}>
      <div className="lut-lb-inner" onClick={(e) => e.stopPropagation()}>
        <div className="lut-lb-head">
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: f.dot }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(232,223,201,.6)" }}>
              {f.tag} · {f.label} · № {String(index + 1).padStart(2, "0")} / 21
            </span>
          </div>
          <button onClick={onClose} className="lut-lb-x" aria-label="Fechar">
            ×
          </button>
        </div>
        <CineFrame key={lut.name} src={VID(lut)} grad={lut.grad} ratio="16 / 9" mode="auto" loop name={lut.name} fam={lut.fam} n={index + 1} total="21" />
        <div className="lut-lb-foot">
          <button onClick={() => onNav(-1)} className="lut-lb-nav" aria-label="Anterior">
            ‹
          </button>
          <div style={{ textAlign: "center", minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "clamp(22px,4vw,30px)", letterSpacing: "-.02em", color: "var(--canvas)", lineHeight: 1 }}>{lut.name}</div>
            <div className="lut-lb-use">{lut.use}</div>
            <div className="lut-lb-ref">ref: {lut.ref} · {lut.dp}</div>
          </div>
          <button onClick={() => onNav(1)} className="lut-lb-nav" aria-label="Próximo">
            ›
          </button>
        </div>
        <div className="lut-lb-hint">o clipe revela log → lut · ← → navegar · esc fecha</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// CTA reutilizável
// ────────────────────────────────────────────────────────────
function LutBuy({ block }: { block?: boolean }) {
  return (
    <a href={LUT_CTA} onClick={() => vibe(15)} className="lut-buy" style={block ? { width: "100%" } : undefined}>
      <span className="lut-buy-main">
        <span style={{ whiteSpace: "nowrap" }}>Comprar LUT Pack</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>R$ {LUT_PRICE}</span>
        <span style={{ fontSize: "1.1em" }}>→</span>
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", color: "rgba(232,223,201,.5)", textTransform: "uppercase", textAlign: "center" }}>
        ou {LUT_N}× R$ {LUT_PARCEL} · download imediato
      </span>
    </a>
  );
}

// ── FAQ ─────────────────────────────────────────────────────
function LutFaq() {
  const QA: [string, string][] = [
    ["Em que formato vêm?", "Arquivos .cube — o padrão universal de LUT 3D. Funcionam em DaVinci Resolve, Premiere Pro, Lightroom e praticamente qualquer editor. Não são preset de Lightroom (.xmp); são LUTs de cor."],
    ["Quais perfis de entrada são cobertos?", "Cada LUT vem em 5 perfis: C-Log (Canon), RED REDlogFilm, S-Log2, S-Log3 (Sony) e Standard/Rec.709. Use a pasta do seu perfil de câmera — um leve ajuste de exposição e a imagem alinha."],
    ["São os LUTs oficiais dos filmes citados?", "Não. São interpretações criativas autorais inspiradas na linguagem de cor do cinema — não produtos oficiais, licenciados ou afiliados. Os títulos, filmes e nomes citados pertencem aos seus donos e servem só como referência estética."],
    ["Por que cada um cita um diretor de fotografia?", "Porque o ponto de partida de cada look é o trabalho cromático de um DP que admiro. É estudo de ofício: eu traduzo aquela leitura de cor pro terreno outdoor que fotografo. A autoria do look é minha."],
    ["Posso usar comercialmente?", "Pode. Licença pessoal + comercial: filmes, clientes, marcas e agências, sem restrição."],
    ["E se eu não gostar?", "Você tem 14 dias. Manda um email pra contato@euhenriq.com e devolvo 100%, sem pergunta."],
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="lut-faq">
      <h2 className="lut-faq-h">
        Perguntas <span className="ital">diretas</span>.
      </h2>
      <div className="lut-faq-list">
        {QA.map(([q, a], i) => {
          const on = open === i;
          return (
            <div key={i} className={"lut-faq-item" + (on ? " on" : "")}>
              <button
                onClick={() => {
                  setOpen(on ? -1 : i);
                  vibe(6);
                }}
              >
                <span>{q}</span>
                <span className="lut-faq-pl">{on ? "–" : "+"}</span>
              </button>
              <div className="lut-faq-a" style={{ maxHeight: on ? 260 : 0 }}>
                <p>{a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// PÁGINA
// ════════════════════════════════════════════════════════════
export default function LutsPage() {
  const [lb, setLb] = useState<number | null>(null);
  const openLb = (i: number) => setLb(i);
  const nav = (d: number) => setLb((p) => (p === null ? p : (p + d + LUTS.length) % LUTS.length));

  const COMPAT = [
    { g: "Entrada · 5 perfis", items: ["C-Log", "RED REDlogFilm", "S-Log2", "S-Log3", "Rec.709"] },
    { g: "Softwares", items: ["DaVinci Resolve", "Premiere Pro", "Lightroom"] },
    { g: "Formato", items: [".cube", "LUT 3D"] },
  ];

  const wetJungle = LUTS.find((l) => l.name === "Wet Jungle")!;

  return (
    <div className="lut-lp">
      <style>{LUT_CSS}</style>

      {/* Nav mínima */}
      <header className="lut-nav">
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--font-hand)", fontSize: 24, color: "var(--canvas)", lineHeight: 1 }}>Eu Henriq</span>
        </Link>
        <Link href="/presets" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,223,201,.55)", textDecoration: "none" }}>
          ← Presets &amp; LUTs
        </Link>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="lut-hero">
        <div className="lut-hero-head">
          <div className="lut-eyebrow">
            <span>№ 04</span>
            <i />
            <span>21 looks · 6 famílias</span>
            <i />
            <span style={{ color: "var(--rust-soft)" }}>5 perfis log</span>
          </div>
          <div className="lut-hand">molde a luz—</div>
          <h1 className="lut-h1">
            21 LUTs que traduzem o <span className="ital">DNA de cor do cinema</span> pro seu terreno.
          </h1>
          <p className="lut-sub">
            Inspirados na linguagem cromática de grandes diretores de fotografia e calibrados em campo — duna, lagoa, montanha, selva, neve, golden hour. Cada look em 5 perfis de entrada, prontos pra DaVinci, Premiere e Lightroom.
          </p>
        </div>

        <div className="lut-hero-media">
          <HeroReel />
        </div>

        <div className="lut-hero-cta">
          <LutBuy />
          <div className="lut-price-aside">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "rgba(232,223,201,.45)", textDecoration: "line-through" }}>R$ {LUT_FROM}</span>
            <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 30, letterSpacing: "-.02em", color: "var(--canvas)", lineHeight: 1 }}>R$ {LUT_PRICE}</span>
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 13, color: "rgba(232,223,201,.55)" }}>download imediato · garantia 14 dias</span>
          </div>
        </div>
      </section>

      {/* ═══ COMPATIBILIDADE ═══ */}
      <section className="lut-compat">
        {COMPAT.map((col) => (
          <div key={col.g} className="lut-compat-col">
            <div className="lut-compat-g">{col.g}</div>
            <div className="lut-compat-row">
              {col.items.map((it) => (
                <span key={it} className="lut-chip">{it}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <Sprockets />

      {/* ═══ MANIFESTO ═══ */}
      <section className="lut-manifesto">
        <div className="lut-mani-kicker">inspiração, não cópia</div>
        <h2 className="lut-mani-h">
          Minha leitura da <span className="ital">cor do cinema</span> —<br />
          aplicada ao mundo que eu fotografo.
        </h2>
        <div className="lut-mani-grid">
          <p>Cada LUT parte da linguagem cromática de um filme — o trabalho de um diretor de fotografia — e traduz esse mood pra terreno real: deserto, lagoa, montanha, mata, neve e fim de tarde.</p>
          <p><strong>São interpretações autorais, não réplicas.</strong> Cor honesta, contraste natural e o clima de cinema, calibrados em campo e não em estúdio.</p>
        </div>
        <div className="lut-mani-tags">
          {["inspirado em cinema", "traduzido pra campo", "5 perfis de entrada", "autoral"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </section>

      {/* ═══ BIBLIOTECA (21) ═══ */}
      <section className="lut-lib">
        <div className="lut-lib-head">
          <div>
            <div className="lut-hand2">a biblioteca—</div>
            <h2 className="lut-lib-h">
              21 looks,&nbsp;<span className="ital">6 famílias</span>.
            </h2>
          </div>
          <p className="lut-lib-hint">passe o mouse pra ver revelar · toque pra ampliar</p>
        </div>

        {FAMS.map((f) => {
          const items = LUTS.filter((l) => l.fam === f.id);
          return (
            <div key={f.id} className="lut-mood">
              <div className="lut-mood-label">
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: f.dot }} />
                <span style={{ color: "var(--rust-soft)" }}>[{f.tag}]</span>
                <span>{f.label}</span>
                <span style={{ color: "rgba(232,223,201,.45)", fontFamily: "var(--font-serif)", fontStyle: "italic", letterSpacing: 0, textTransform: "none" }}>— {f.note}</span>
                <div className="lut-mood-line" />
                <span style={{ color: "rgba(232,223,201,.35)" }}>{items.length}</span>
              </div>
              <div className="lut-grid">
                {items.map((l) => {
                  const n = LUTS.indexOf(l) + 1;
                  return <LutCard key={l.name} lut={l} n={n} onOpen={() => openLb(LUTS.indexOf(l))} />;
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* ═══ COMO APLICAR ═══ */}
      <section className="lut-how">
        <h2 className="lut-how-h">
          Poucos ajustes e a imagem <span className="ital">se alinha.</span>
        </h2>
        <div className="lut-how-grid">
          {[
            ["01", "Importe o .cube", "Arraste pro DaVinci, Premiere ou Lightroom. Funciona como nó, camada de ajuste ou perfil."],
            ["02", "Escolha o seu perfil", "Cada look vem em 5 entradas — C-Log, RED REDlogFilm, S-Log2, S-Log3 e Rec.709. Use a pasta da sua câmera/perfil."],
            ["03", "Acerte a exposição", "Um leve ajuste de exposição e contraste e a cena assenta. Rápido, intencional, expressivo."],
          ].map(([n, t, d]) => (
            <div key={n} className="lut-step">
              <div className="lut-step-n">{n}</div>
              <div className="lut-step-t">{t}</div>
              <div className="lut-step-d">{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CLIPE EM DESTAQUE ═══ */}
      <section className="lut-feature">
        <div className="lut-feature-copy">
          <div className="lut-hand2">a transformação—</div>
          <h2 className="lut-feature-h">
            Do log chapado<br />
            <span className="ital">ao cinema.</span>
          </h2>
          <p>Cada clipe começa no material em log, cru e chapado, e revela o LUT aplicado na mesma cena — mesma luz, mesmo frame. Sem wipe falso: é a cor real entrando.</p>
          <LutBuy />
        </div>
        <CineFrame src={VID(wetJungle)} grad={wetJungle.grad} ratio="16 / 9" mode="auto" loop name="Wet Jungle" fam="natural" total="21" />
      </section>

      {/* ═══ INCLUSO ═══ */}
      <section className="lut-incl">
        <div className="lut-incl-inner">
          <h2 className="lut-incl-h">
            No seu <span className="ital">download</span>.
          </h2>
          <div className="lut-incl-grid">
            {[
              ["21 LUTs cinematográficos", ".cube — padrão universal, prontos pra timeline."],
              ["6 famílias de cor", "EPIC · MOODY · GOLDEN · VIVID · NATURAL · MONO."],
              ["5 perfis de entrada", "C-Log · RED REDlogFilm · S-Log2 · S-Log3 · Rec.709."],
              ["Qualquer editor", "DaVinci Resolve, Premiere Pro, Lightroom e mais."],
              ["Guia de instalação", "Passo a passo pra cada software."],
              ["Licença comercial", "Use em filmes, clientes e marcas."],
            ].map(([t, d], i) => (
              <div key={i} className="lut-incl-item">
                <span className="lut-incl-check">✓</span>
                <div>
                  <div className="lut-incl-t">{t}</div>
                  <div className="lut-incl-d">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AUTOR ═══ */}
      <section className="lut-author">
        <div className="lut-author-hand">quem colorou—</div>
        <p className="lut-author-p">
          Não sou revendedor de LUT — sou fotógrafo de campo. Levei essa cor pra Lençóis, Itatiaia, Huayhuash e Atacama, com trabalho documental no Maranhão e nas minhas produções e clientes. Os mesmos looks que uso nos meus filmes, calibrados na luz real.
        </p>
        <div className="lut-author-sign">— Henrique Pimenta</div>
        <div className="lut-author-ig">
          marque{" "}
          <a href="https://instagram.com/henriq.eu" target="_blank" rel="noreferrer">@henriq.eu</a> — quero ver o que você criar
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <LutFaq />

      {/* ═══ CTA FINAL ═══ */}
      <section className="lut-final">
        <div className="lut-final-grid">
          <div>
            <h2 className="lut-final-h">
              Dê à sua história<br />o <span className="ital">peso</span> que ela merece.
            </h2>
            <p className="lut-final-p">Molde a luz. Defina o clima. Download imediato, acesso vitalício, garantia de 14 dias.</p>
          </div>
          <div className="lut-final-card">
            <div className="lut-final-tag">Outdoor Cinematic LUT Pack</div>
            <div className="lut-final-price">
              <span>R$ </span>
              {LUT_PRICE}
            </div>
            <div className="lut-final-sub">de R$ {LUT_FROM} · ou {LUT_N}× R$ {LUT_PARCEL}</div>
            <div className="lut-final-list">
              {["21 LUTs .cube", "6 famílias · 1 mono", "5 perfis: C-Log · RED · S-Log2/3 · Rec.709", "DaVinci · Premiere · Lightroom", "Licença pessoal e comercial", "Suporte rápido"].map((x) => (
                <div key={x}>
                  <span>✓</span>
                  {x}
                </div>
              ))}
            </div>
            <LutBuy block />
          </div>
        </div>
      </section>

      {/* ═══ DISCLAIMER LEGAL ═══ */}
      <section className="lut-disclaimer">
        Estes LUTs são interpretações criativas autorais inspiradas na linguagem visual do cinema. Não são produtos oficiais, licenciados ou afiliados a nenhum filme, estúdio ou detentor de direitos. Marcas e títulos citados pertencem a seus respectivos donos e servem apenas como referência estética.
      </section>

      <SiteFooter dark={true} />
      <div style={{ height: 74 }} />
      <LutSticky />

      {lb !== null && <LutLightbox index={lb} onClose={() => setLb(null)} onNav={nav} />}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CSS
// ════════════════════════════════════════════════════════════
const LUT_CSS = `
.lut-lp{ --bg:#0a0c0b; --bg2:#0e110f; --surf:#13160f; --hair:rgba(232,223,201,.12);
  --tx:#ECE3CE; --mut:rgba(232,223,201,.6); --dim:rgba(232,223,201,.42);
  position:relative; background:var(--bg); color:var(--tx); font-family:var(--font-ui); overflow-x:hidden; max-width:100vw; }
.lut-lp *{ box-sizing:border-box; }
.lut-lp .ital{ font-family:var(--font-serif); font-style:italic; font-weight:400; color:var(--rust-soft); }
.lut-lp::after{ content:""; position:fixed; inset:0; z-index:7; pointer-events:none; opacity:.05; mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size:200px 200px; }
.lut-lp::before{ content:""; position:fixed; inset:0; z-index:7; pointer-events:none; box-shadow:inset 0 0 200px rgba(0,0,0,.55); }

.lut-nav{ height:58px; display:flex; align-items:center; justify-content:space-between; padding:0 clamp(16px,5vw,40px); border-bottom:1px solid var(--hair); position:relative; z-index:10; }

/* clip + frame de cinema */
.lut-frame{ position:relative; border:1px solid var(--hair); background:#000; overflow:hidden; box-shadow:0 30px 80px -30px rgba(0,0,0,.9); }
.lut-clip{ position:absolute; inset:0; overflow:hidden; background:#0c0b08; }
.lut-clip-stack{ transition:opacity .9s ease; }
.lut-clip-bg{ position:absolute; inset:0; }
.lut-clip-v{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; z-index:1; }
.lut-frame-badge,.lut-frame-fam{ position:absolute; top:24px; z-index:5; display:flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:8px; letter-spacing:.18em; text-transform:uppercase; color:rgba(245,241,232,.82); background:rgba(12,10,7,.5); padding:4px 9px; pointer-events:none; }
.lut-frame-badge{ left:12px; } .lut-frame-fam{ right:12px; }
.lut-frame-badge b{ color:var(--rust-soft); font-weight:700; }

/* reel da hero */
.lut-hero-media{ position:relative; }
.lut-reel-chips{ display:flex; flex-wrap:wrap; gap:8px; margin-top:14px; justify-content:center; }
.lut-reel-chip{ display:inline-flex; align-items:center; gap:7px; padding:7px 12px; background:transparent; border:1px solid var(--hair); color:var(--mut); font-family:var(--font-mono); font-size:9px; letter-spacing:.12em; text-transform:uppercase; cursor:pointer; transition:border-color .2s,color .2s,background .2s; }
.lut-reel-chip span{ width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.lut-reel-chip:hover{ border-color:var(--rust-soft); color:var(--canvas); }
.lut-reel-chip.on{ border-color:var(--rust-soft); color:var(--canvas); background:rgba(206,140,74,.1); }

/* hero — vídeo protagonista, empilhado e centrado */
.lut-hero{ display:flex; flex-direction:column; align-items:center; gap:clamp(22px,3vw,34px); padding:clamp(26px,4vw,52px) clamp(16px,5vw,56px) clamp(40px,5vw,72px); position:relative; z-index:1; text-align:center; }
.lut-hero-head{ max-width:880px; }
.lut-hero-media{ position:relative; width:100%; max-width:1180px; }
.lut-bars{ position:absolute; left:0; right:0; height:14px; background:#000; z-index:3; pointer-events:none; }
.lut-bars-top{ top:0; } .lut-bars-bot{ bottom:0; }
.lut-tc{ position:absolute; left:0; right:0; bottom:14px; z-index:4; display:flex; align-items:center; gap:10px; padding:7px 14px; background:linear-gradient(0deg,rgba(8,7,5,.82),transparent); font-family:var(--font-mono); font-size:9px; letter-spacing:.14em; color:rgba(245,241,232,.7); pointer-events:none; }
.lut-tc-ticks{ flex:1; display:flex; gap:3px; align-items:flex-end; height:12px; }
.lut-tc-ticks span{ flex:1; height:100%; background:rgba(245,241,232,.6); }
.lut-eyebrow{ display:flex; align-items:center; gap:9px; flex-wrap:wrap; font-family:var(--font-mono); font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:var(--dim); margin-bottom:14px; justify-content:center; }
.lut-eyebrow i{ width:4px; height:4px; border-radius:50%; background:var(--rust); }
.lut-hand,.lut-hand2{ font-family:var(--font-hand); color:var(--rust-soft); transform:rotate(-2deg); display:inline-block; text-shadow:0 0 24px rgba(194,128,61,.45); }
.lut-hand{ font-size:clamp(26px,3.4vw,34px); margin-bottom:2px; }
.lut-hand2{ font-size:clamp(22px,3vw,28px); margin-bottom:2px; }
.lut-h1{ margin:0 0 14px; font-family:var(--font-ui); font-weight:700; font-size:clamp(34px,5vw,58px); letter-spacing:-.035em; line-height:.96; color:var(--canvas); text-shadow:0 2px 30px rgba(0,0,0,.5), 0 0 46px rgba(206,140,74,.18); }
.lut-sub{ font-family:var(--font-serif); font-size:clamp(15px,1.7vw,18px); line-height:1.55; color:var(--mut); margin:0 auto; max-width:62ch; }
.lut-hero-cta{ display:flex; align-items:center; justify-content:center; gap:clamp(20px,3vw,36px); flex-wrap:wrap; }
.lut-price-aside{ display:flex; flex-direction:column; gap:2px; }

/* buy */
.lut-buy{ display:inline-flex; flex-direction:column; gap:5px; text-decoration:none; }
.lut-buy-main{ display:inline-flex; align-items:center; justify-content:center; gap:9px; padding:16px 26px; background:var(--rust-soft); color:#10140d; font-family:var(--font-ui); font-size:12px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; transition:background .2s; }
.lut-buy:hover .lut-buy-main{ background:var(--rust); color:var(--paper); }

/* compat */
.lut-compat{ display:grid; grid-template-columns:repeat(3,1fr); gap:24px; padding:24px clamp(16px,5vw,56px); border-top:1px solid var(--hair); border-bottom:1px solid var(--hair); background:var(--bg2); position:relative; z-index:1; }
.lut-compat-g{ font-family:var(--font-mono); font-size:9px; letter-spacing:.2em; text-transform:uppercase; color:var(--dim); margin-bottom:10px; }
.lut-compat-row{ display:flex; flex-wrap:wrap; gap:7px; }
.lut-chip{ font-family:var(--font-mono); font-size:10px; letter-spacing:.08em; color:var(--mut); border:1px solid var(--hair); padding:5px 10px; white-space:nowrap; }

/* sprockets */
.lut-sprockets{ display:flex; gap:0; justify-content:center; overflow:hidden; padding:9px 0; background:#070806; }
.lut-sprockets span{ flex:0 0 auto; width:13px; height:9px; border-radius:2px; background:rgba(232,223,201,.12); margin:0 7px; }

/* manifesto */
.lut-manifesto{ padding:clamp(56px,8vw,100px) clamp(16px,5vw,56px); text-align:center; position:relative; z-index:1; }
.lut-mani-kicker{ font-family:var(--font-mono); font-size:10px; letter-spacing:.24em; text-transform:uppercase; color:var(--rust-soft); margin-bottom:16px; }
.lut-mani-h{ margin:0 auto; font-family:var(--font-ui); font-weight:700; font-size:clamp(28px,4.6vw,52px); letter-spacing:-.03em; line-height:1.02; color:var(--canvas); max-width:20ch; }
.lut-mani-grid{ display:grid; grid-template-columns:1fr 1fr; gap:clamp(20px,4vw,48px); max-width:820px; margin:32px auto 0; text-align:left; }
.lut-mani-grid p{ margin:0; font-family:var(--font-serif); font-size:clamp(14px,1.7vw,17px); line-height:1.65; color:var(--mut); }
.lut-mani-grid strong{ color:var(--canvas); font-weight:600; }
.lut-mani-tags{ display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:34px; }
.lut-mani-tags span{ font-family:var(--font-mono); font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:var(--mut); border:1px solid var(--hair); padding:6px 12px; }

/* biblioteca */
.lut-lib{ padding:clamp(40px,5vw,72px) clamp(16px,5vw,56px) clamp(56px,7vw,88px); border-top:1px solid var(--hair); background:var(--bg2); position:relative; z-index:1; }
.lut-lib-head{ display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:30px; }
.lut-lib-h{ margin:0; font-family:var(--font-ui); font-weight:700; font-size:clamp(28px,4.4vw,48px); letter-spacing:-.03em; line-height:1; color:var(--canvas); white-space:nowrap; }
.lut-lib-hint{ margin:0; font-family:var(--font-mono); font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--dim); }
.lut-mood{ margin-bottom:30px; }
.lut-mood-label{ display:flex; align-items:center; gap:9px; margin-bottom:14px; font-family:var(--font-mono); font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:var(--mut); flex-wrap:wrap; }
.lut-mood-line{ flex:1; min-width:30px; height:1px; background:var(--hair); margin-left:6px; }
/* grade horizontal — cards 16:9 lado a lado (capa antes/depois log→lut) */
.lut-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.lut-card{ position:relative; aspect-ratio:16/9; overflow:hidden; border:none; padding:0; cursor:pointer; background:#15140f; }
.lut-card .lut-clip{ inset:0; }
.lut-card .lut-clip-bg{ display:none; }
.lut-card .lut-clip-v{ opacity:0; transition:opacity .45s ease; }
.lut-card:hover .lut-clip-v{ opacity:1; }
.lut-card-bg{ position:absolute; inset:0; z-index:0; }
.lut-card-cover{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:1; display:block; }
.lut-card-top{ position:absolute; top:0; left:0; right:0; z-index:4; display:flex; justify-content:space-between; align-items:flex-start; padding:10px 11px; }
.lut-card-play{ width:22px; height:22px; border-radius:50%; background:rgba(12,10,7,.5); border:1px solid rgba(245,241,232,.5); color:#fff; font-size:9px; display:flex; align-items:center; justify-content:center; padding-left:2px; opacity:0; transition:opacity .3s; }
.lut-card:hover .lut-card-play{ opacity:1; }
/* nome do LUT em uso — topo do hero */
.lut-frame-now{ position:absolute; top:24px; left:50%; transform:translateX(-50%); z-index:6; display:flex; align-items:center; gap:8px; padding:6px 14px; background:rgba(12,10,7,.6); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); border:1px solid rgba(232,223,201,.16); pointer-events:none; max-width:80%; }
.lut-frame-now-dot{ width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.lut-frame-now-name{ font-family:var(--font-ui); font-weight:600; font-size:13px; letter-spacing:-.01em; color:var(--canvas); white-space:nowrap; }
.lut-frame-now-fam{ font-family:var(--font-mono); font-size:8px; letter-spacing:.18em; text-transform:uppercase; color:var(--rust-soft); }
.lut-card-meta{ position:absolute; left:0; right:0; bottom:0; z-index:4; padding:12px 12px 13px; text-align:left; background:linear-gradient(0deg,rgba(8,7,5,.88) 0%,rgba(8,7,5,.2) 72%,transparent 100%); }
.lut-card-spot{ font-family:var(--font-serif); font-style:italic; font-size:11px; color:rgba(245,241,232,.66); line-height:1.25; margin-top:3px; }
.lut-card::after{ content:""; position:absolute; inset:0; box-shadow:inset 0 0 0 1px rgba(0,0,0,0); transition:box-shadow .3s; z-index:5; pointer-events:none; }
.lut-card:hover::after{ box-shadow:inset 0 0 0 1px rgba(206,140,74,.4); }

/* como */
.lut-how{ padding:clamp(56px,8vw,96px) clamp(16px,5vw,56px); position:relative; z-index:1; }
.lut-how-h{ margin:0 0 36px; font-family:var(--font-ui); font-weight:700; font-size:clamp(26px,4.2vw,46px); letter-spacing:-.03em; line-height:1.05; color:var(--canvas); max-width:20ch; }
.lut-how-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(16px,3vw,28px); }
.lut-step{ border-top:1px solid var(--hair); padding-top:18px; }
.lut-step-n{ font-family:var(--font-mono); font-size:11px; letter-spacing:.2em; color:var(--rust); margin-bottom:12px; }
.lut-step-t{ font-family:var(--font-ui); font-weight:600; font-size:clamp(17px,2.4vw,22px); color:var(--canvas); margin-bottom:8px; letter-spacing:-.01em; }
.lut-step-d{ font-family:var(--font-serif); font-size:clamp(13px,1.6vw,15px); line-height:1.6; color:var(--mut); }

/* feature */
.lut-feature{ display:grid; grid-template-columns:.85fr 1.15fr; gap:clamp(24px,4vw,56px); align-items:center; padding:clamp(40px,6vw,80px) clamp(16px,5vw,56px); border-top:1px solid var(--hair); background:var(--bg2); position:relative; z-index:1; }
.lut-feature-h{ margin:6px 0 14px; font-family:var(--font-ui); font-weight:700; font-size:clamp(28px,4.4vw,52px); letter-spacing:-.03em; line-height:.95; color:var(--canvas); }
.lut-feature-copy p{ font-family:var(--font-serif); font-size:clamp(14px,1.7vw,17px); line-height:1.6; color:var(--mut); margin:0 0 24px; max-width:42ch; }

/* incluso */
.lut-incl{ padding:clamp(56px,8vw,96px) clamp(16px,5vw,56px); position:relative; z-index:1; }
.lut-incl-inner{ max-width:1000px; margin:0 auto; }
.lut-incl-h{ margin:0 0 28px; font-family:var(--font-ui); font-weight:700; font-size:clamp(26px,4.2vw,46px); letter-spacing:-.03em; color:var(--canvas); }
.lut-incl-grid{ display:grid; grid-template-columns:1fr 1fr; gap:clamp(16px,3vw,26px) clamp(24px,4vw,48px); }
.lut-incl-item{ display:flex; gap:13px; border-top:1px solid var(--hair); padding-top:16px; }
.lut-incl-check{ flex-shrink:0; width:22px; height:22px; border-radius:50%; border:1.5px solid var(--rust-soft); color:var(--rust-soft); display:flex; align-items:center; justify-content:center; font-size:12px; }
.lut-incl-t{ font-family:var(--font-ui); font-weight:600; font-size:clamp(15px,2vw,18px); color:var(--canvas); margin-bottom:3px; }
.lut-incl-d{ font-family:var(--font-serif); font-size:clamp(13px,1.6vw,14px); line-height:1.5; color:var(--mut); }

/* autor */
.lut-author{ padding:clamp(48px,7vw,84px) clamp(16px,5vw,56px); text-align:center; border-top:1px solid var(--hair); background:var(--bg2); position:relative; z-index:1; }
.lut-author-hand{ font-family:var(--font-hand); font-size:clamp(24px,3.4vw,32px); color:var(--rust-soft); transform:rotate(-2deg); display:inline-block; margin-bottom:8px; }
.lut-author-p{ max-width:60ch; margin:0 auto; font-family:var(--font-serif); font-size:clamp(16px,2.2vw,22px); font-style:italic; line-height:1.55; color:var(--canvas); }
.lut-author-sign{ font-family:var(--font-hand); font-size:clamp(26px,3.6vw,34px); color:var(--rust-soft); transform:rotate(-2deg); display:inline-block; margin-top:18px; }
.lut-author-ig{ font-family:var(--font-mono); font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--dim); margin-top:14px; }
.lut-author-ig a{ color:var(--rust-soft); }

/* faq */
.lut-faq{ padding:clamp(48px,7vw,84px) clamp(16px,5vw,56px); position:relative; z-index:1; }
.lut-faq-h{ margin:0 0 24px; text-align:center; font-family:var(--font-ui); font-weight:700; font-size:clamp(26px,4.2vw,44px); letter-spacing:-.03em; color:var(--canvas); }
.lut-faq-list{ max-width:680px; margin:0 auto; }
.lut-faq-item{ border-top:1px solid var(--hair); }
.lut-faq-item:last-child{ border-bottom:1px solid var(--hair); }
.lut-faq-item button{ width:100%; display:flex; justify-content:space-between; align-items:center; gap:16px; padding:18px 4px; background:none; border:none; cursor:pointer; text-align:left; color:var(--canvas); font-family:var(--font-ui); font-weight:600; font-size:clamp(15px,2vw,18px); }
.lut-faq-pl{ font-family:var(--font-mono); font-size:20px; color:var(--rust-soft); flex-shrink:0; }
.lut-faq-a{ overflow:hidden; transition:max-height .3s cubic-bezier(.4,0,.2,1); }
.lut-faq-a p{ margin:0; padding:0 4px 18px; font-family:var(--font-serif); font-size:clamp(13px,1.7vw,15px); line-height:1.6; color:var(--mut); }

/* final */
.lut-final{ padding:clamp(56px,9vw,110px) clamp(16px,5vw,56px); background:linear-gradient(180deg,#0c0f0a 0%,#0a0c0b 100%); border-top:1px solid var(--hair); position:relative; z-index:1; }
.lut-final-grid{ max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center; }
.lut-final-h{ margin:0; font-family:var(--font-ui); font-weight:700; font-size:clamp(32px,5.4vw,58px); letter-spacing:-.035em; line-height:.95; color:var(--canvas); }
.lut-final-p{ font-family:var(--font-serif); font-size:clamp(14px,1.8vw,17px); line-height:1.55; color:var(--mut); margin-top:16px; max-width:42ch; }
.lut-final-card{ background:var(--surf); border:1px solid var(--hair); padding:clamp(22px,4vw,32px); }
.lut-final-tag{ font-family:var(--font-mono); font-size:9px; letter-spacing:.18em; text-transform:uppercase; color:var(--dim); margin-bottom:6px; }
.lut-final-price{ font-family:var(--font-ui); font-weight:700; font-size:clamp(44px,6vw,64px); letter-spacing:-.03em; color:var(--canvas); line-height:1; }
.lut-final-price span{ font-family:var(--font-mono); font-size:.32em; color:var(--dim); font-weight:400; }
.lut-final-sub{ font-family:var(--font-mono); font-size:10px; letter-spacing:.06em; color:var(--dim); text-transform:uppercase; margin:6px 0 16px; }
.lut-final-list{ border-top:1px solid var(--hair); padding-top:14px; margin-bottom:18px; }
.lut-final-list > div{ display:flex; gap:9px; align-items:center; padding:5px 0; font-family:var(--font-serif); font-size:14px; color:var(--mut); }
.lut-final-list span{ color:var(--rust-soft); font-weight:700; }

/* disclaimer */
.lut-disclaimer{ max-width:760px; margin:0 auto; padding:clamp(28px,5vw,44px) clamp(16px,5vw,56px) clamp(36px,6vw,56px); text-align:center; font-family:var(--font-mono); font-size:10px; line-height:1.7; letter-spacing:.04em; color:rgba(232,223,201,.34); position:relative; z-index:1; }

/* sticky */
.lut-sticky{ position:fixed; bottom:0; left:0; right:0; z-index:90; display:flex; align-items:center; gap:10px; padding:10px 14px calc(10px + env(safe-area-inset-bottom)); background:rgba(10,12,9,.96); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); border-top:1px solid var(--hair); transition:transform .35s cubic-bezier(.4,0,.2,1); }
@media(min-width:781px){ .lut-sticky{ display:none; } }

/* lightbox */
.lut-lb{ position:fixed; inset:0; z-index:200; background:rgba(6,7,5,.95); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:clamp(14px,4vw,40px); }
.lut-lb-inner{ width:100%; max-width:1000px; }
.lut-lb-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.lut-lb-x{ width:34px; height:34px; border-radius:50%; border:1px solid var(--hair); background:transparent; color:var(--canvas); font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.lut-lb .lut-frame{ border:1px solid var(--hair); }
.lut-lb-foot{ display:flex; align-items:center; justify-content:space-between; gap:14px; margin-top:16px; }
.lut-lb-nav{ width:46px; height:46px; border-radius:50%; border:1px solid var(--hair); background:transparent; color:var(--canvas); font-size:22px; cursor:pointer; flex-shrink:0; }
.lut-lb-nav:hover{ border-color:var(--rust-soft); color:var(--rust-soft); }
.lut-lb-use{ font-family:var(--font-serif); font-size:clamp(13px,1.6vw,15px); line-height:1.45; color:rgba(232,223,201,.72); margin:8px auto 0; max-width:46ch; }
.lut-lb-ref{ font-family:var(--font-mono); font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:rgba(232,223,201,.4); margin-top:7px; }
.lut-lb-hint{ text-align:center; font-family:var(--font-mono); font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:rgba(232,223,201,.3); margin-top:12px; }

@media(max-width:900px){
  .lut-feature{ grid-template-columns:1fr; }
  .lut-final-grid{ grid-template-columns:1fr; gap:28px; }
  .lut-grid{ grid-template-columns:repeat(2,1fr); }
}
@media(max-width:760px){
  .lut-compat{ grid-template-columns:1fr; gap:16px; }
  .lut-mani-grid{ grid-template-columns:1fr; }
  .lut-how-grid{ grid-template-columns:1fr; }
  .lut-incl-grid{ grid-template-columns:1fr; }
}
@media(max-width:560px){
  .lut-grid{ grid-template-columns:1fr; }
  .lut-hero-cta{ gap:16px; }
  .lut-final-card{ order:-1; }
  .lut-reel-chip{ padding:10px 14px; font-size:10px; }
  .lut-lb-x{ width:40px; height:40px; }
}
`;
