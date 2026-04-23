"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";
import { PRESETS, PRESET_CATS, ACCORDION_ITEMS, CTA_URL } from "@/content/presets";

const PRICE = "R$ 59";
const PRICE_ORIGINAL = "R$ 119";

// ── Before / After Slider ────────────────────────────────────────────────────
// Lógica de drag preservada; visual reestilizado com tokens Field.
function BeforeAfter({ imgKey, height = 520 }: { imgKey: string; height?: number }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const onMove = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100)));
  };

  useEffect(() => {
    const mm = (e: MouseEvent) => { if (dragging.current) onMove(e.clientX); };
    const mu = () => { dragging.current = false; };
    const tm = (e: TouchEvent) => { if (dragging.current && e.touches[0]) onMove(e.touches[0].clientX); };
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
  }, []);

  const afterSrc = `/images/presets/${imgKey}.jpg`;
  const beforeSrc = `/images/presets/${imgKey}-before.jpg`;

  return (
    <div
      ref={ref}
      onMouseDown={(e) => { dragging.current = true; onMove(e.clientX); }}
      onTouchStart={(e) => { dragging.current = true; if (e.touches[0]) onMove(e.touches[0].clientX); }}
      style={{ position: "relative", width: "100%", height, overflow: "hidden",
        cursor: "ew-resize", userSelect: "none", background: "var(--forest)" }}
    >
      {/* After (direita — tratado) */}
      <img src={afterSrc} alt="depois" draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", display: "block" }} />

      {/* Before (esquerda — RAW) — clipPath preserva a lógica original */}
      <div style={{ position: "absolute", inset: 0, width: `${pos}%`, overflow: "hidden" }}>
        <img src={beforeSrc} alt="antes" draggable={false}
          style={{ position: "absolute", left: 0, top: 0,
            width: `${100 / (pos / 100)}%`, height: "100%",
            objectFit: "cover", display: "block",
            filter: "saturate(.55) brightness(.88) contrast(.92)" }} />
      </div>

      {/* Labels */}
      <div style={{ position: "absolute", top: 20, left: 20, padding: "5px 12px",
        background: "rgba(42,33,26,.8)", backdropFilter: "blur(8px)",
        color: "var(--canvas)", fontFamily: "var(--font-mono)",
        fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase" }}>
        Antes · RAW
      </div>
      <div style={{ position: "absolute", top: 20, right: 20, padding: "5px 12px",
        background: "var(--rust)", color: "var(--canvas)",
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em",
        textTransform: "uppercase" }}>
        Depois · Preset
      </div>

      {/* Divisor */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`,
        width: 2, background: "var(--canvas)", transform: "translateX(-1px)",
        pointerEvents: "none" }} />

      {/* Handle */}
      <div style={{ position: "absolute", top: "50%", left: `${pos}%`,
        width: 48, height: 48, borderRadius: "50%",
        background: "var(--canvas)", transform: "translate(-50%, -50%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", color: "var(--bark)",
        fontFamily: "var(--font-mono)", fontSize: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,.4)" }}>
        ⇄
      </div>
    </div>
  );
}

// ── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ items }: { items: typeof ACCORDION_ITEMS }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ borderTop: "1px solid var(--line)" }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--line)" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: "100%", display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "20px 0", background: "none",
              border: "none", cursor: "pointer", textAlign: "left" }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600,
              letterSpacing: "-.01em", color: "var(--bark)" }}>{item.title}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 18,
              color: "var(--rust)", transform: open === i ? "rotate(45deg)" : "none",
              transition: "transform .25s", display: "block", lineHeight: 1 }}>+</span>
          </button>
          {open === i && (
            <div style={{ paddingBottom: 20, fontFamily: "var(--font-serif)",
              fontSize: 15, lineHeight: 1.65, color: "#3A3530",
              whiteSpace: "pre-line" }}>
              {item.body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function PresetsPage() {
  const [activeCat, setActiveCat] = useState<string>("all");

  const filtered = activeCat === "all"
    ? PRESETS
    : PRESETS.filter(p => p.cat === activeCat);

  return (
    <div style={{ background: "var(--canvas)", color: "var(--bark)",
      fontFamily: "var(--font-ui)" }}>

      <SiteNav dark={false} />

      {/* ── HERO ── */}
      <section style={{ paddingTop: 72 }}>
        <div style={{ position: "relative", minHeight: 560, background: "var(--forest)",
          overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr" }}>

          {/* Esquerda — foto */}
          <div style={{ position: "relative", minHeight: 560 }}>
            <img src="/images/presets/1-antigo.jpg" alt="preset sample"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0,
              background: "linear-gradient(90deg, rgba(30,42,24,.15) 0%, rgba(30,42,24,.9) 100%)" }} />
          </div>

          {/* Direita — texto */}
          <div style={{ padding: "72px 56px 56px", display: "flex",
            flexDirection: "column", justifyContent: "space-between",
            color: "var(--canvas)", zIndex: 2 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10,
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em",
                textTransform: "uppercase", color: "rgba(232,223,201,.6)",
                marginBottom: 20 }}>
                <span>№ 03</span>
                <span style={{ width: 4, height: 4, borderRadius: "50%",
                  background: "var(--rust-soft)", display: "block" }} />
                <span>Cor · tratamento</span>
                <span style={{ width: 4, height: 4, borderRadius: "50%",
                  background: "var(--rust-soft)", display: "block" }} />
                <span style={{ color: "var(--rust-soft)" }}>Desde 2022</span>
              </div>

              <div style={{ fontFamily: "var(--font-hand)", fontSize: 34,
                color: "var(--rust-soft)", transform: "rotate(-2deg)",
                display: "inline-block", marginBottom: 8 }}>
                a mesma cor que eu uso—
              </div>

              <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700,
                fontSize: "clamp(48px, 5vw, 68px)", letterSpacing: "-.03em",
                lineHeight: 0.96, margin: 0 }}>
                Presets & LUTs
                <br />
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
                  fontWeight: 400, color: "var(--rust-soft)" }}>
                  saídos das minhas fotos
                </span>
              </h1>

              <p style={{ fontFamily: "var(--font-serif)", fontSize: 17,
                lineHeight: 1.55, color: "rgba(232,223,201,.8)",
                marginTop: 24, maxWidth: "44ch" }}>
                45 presets para Lightroom, feitos a partir das minhas próprias expedições. O mesmo tratamento, agora no seu fluxo.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: 20, marginTop: 32, paddingTop: 24,
                borderTop: "1px solid rgba(232,223,201,.14)" }}>
                {[
                  { k: "Formato", v: ".xmp + .dng" },
                  { k: "Categorias", v: "4 estilos" },
                  { k: "Compatibilidade", v: "Lightroom + Camera Raw" },
                  { k: "Acesso", v: "Vitalício" },
                ].map(s => (
                  <div key={s.k}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9,
                      letterSpacing: ".22em", textTransform: "uppercase",
                      color: "rgba(232,223,201,.45)", marginBottom: 4 }}>{s.k}</div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 16,
                      fontWeight: 600 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 40 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16,
                marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9,
                    letterSpacing: ".22em", textTransform: "uppercase",
                    color: "rgba(232,223,201,.45)", marginBottom: 6 }}>
                    de {PRICE_ORIGINAL} por
                  </div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 52,
                    fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 16,
                      color: "rgba(232,223,201,.6)", marginRight: 4 }}>R$</span>
                    59
                  </div>
                </div>
              </div>

              <a href={CTA_URL} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 12,
                  padding: "15px 28px", background: "var(--rust-soft)",
                  color: "var(--forest)", fontFamily: "var(--font-ui)",
                  fontSize: 11, fontWeight: 700, letterSpacing: ".18em",
                  textTransform: "uppercase", textDecoration: "none" }}>
                Comprar presets →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── RAIL TÉCNICO ── */}
      <section style={{ padding: "36px 56px",
        borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
        {[
          { k: "Compatibilidade", v: "Lightroom · Photoshop · Camera Raw" },
          { k: "Formato",         v: ".xmp · .dng" },
          { k: "Licença",         v: "Pessoal + comercial" },
          { k: "Atualizações",    v: "Vitalícias, sem custo" },
        ].map(s => (
          <div key={s.k}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: ".22em", textTransform: "uppercase",
              color: "var(--stone)", marginBottom: 6 }}>{s.k}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontSize: 18, color: "var(--bark)" }}>{s.v}</div>
          </div>
        ))}
      </section>

      {/* ── GRID DE PRESETS ── */}
      <section style={{ padding: "80px 56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: ".22em", textTransform: "uppercase",
              color: "var(--rust)", marginBottom: 12 }}>
              № 01 · {filtered.length} presets
            </div>
            <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600,
              fontSize: 48, letterSpacing: "-.02em", lineHeight: 1, margin: 0 }}>
              A coleção{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
                fontWeight: 400, color: "var(--moss)" }}>completa</span>.
            </h2>
          </div>

          {/* Filtro de categorias */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap",
            justifyContent: "flex-end" }}>
            <button
              onClick={() => setActiveCat("all")}
              style={{ padding: "8px 16px", border: "1px solid var(--line)",
                background: activeCat === "all" ? "var(--bark)" : "transparent",
                color: activeCat === "all" ? "var(--canvas)" : "var(--bark)",
                fontFamily: "var(--font-mono)", fontSize: 10,
                letterSpacing: ".18em", textTransform: "uppercase",
                cursor: "pointer", transition: "all .2s" }}>
              Todos · 45
            </button>
            {PRESET_CATS.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.label)}
                style={{ padding: "8px 16px",
                  border: `1px solid ${cat.color}40`,
                  background: activeCat === cat.label ? cat.color : "transparent",
                  color: activeCat === cat.label ? "#fff" : "var(--bark)",
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  letterSpacing: ".18em", textTransform: "uppercase",
                  cursor: "pointer", transition: "all .2s" }}>
                {cat.label} · {cat.count}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {filtered.map((p, i) => (
            <PresetCard key={p.key + i} preset={p} />
          ))}
        </div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section style={{ padding: "0 56px 80px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10,
          letterSpacing: ".22em", textTransform: "uppercase",
          color: "var(--rust)", marginBottom: 12 }}>
          № 02 · Antes e depois
        </div>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 48, fontWeight: 600,
          letterSpacing: "-.02em", color: "var(--bark)", lineHeight: 1,
          marginBottom: 8, marginTop: 0 }}>
          Do RAW ao{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
            color: "var(--moss)", fontWeight: 400 }}>tratado</span>.
        </h2>
        <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
          fontSize: 17, color: "#3A3530", marginBottom: 32, maxWidth: "46ch",
          lineHeight: 1.55 }}>
          Arraste o divisor. Um clique — sem ajustes extras.
        </p>
        <BeforeAfter imgKey="1-antigo" height={520} />
      </section>

      {/* ── O QUE VEM INCLUSO ── */}
      <section style={{ padding: "80px 56px", background: "var(--forest)",
        color: "var(--canvas)" }}>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 48, fontWeight: 600,
          letterSpacing: "-.02em", lineHeight: 1, marginBottom: 48, marginTop: 0 }}>
          O que vem na{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
            fontWeight: 400, color: "var(--rust-soft)" }}>mochila</span>.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 40 }}>
          {[
            { n: "01", t: "45 presets Lightroom",  d: "Arquivos .xmp para Lightroom Classic, CC, Mobile e Camera Raw." },
            { n: "02", t: "Perfis .dng",            d: "Perfis de cor — mais estáveis, não bagunçam sliders existentes." },
            { n: "03", t: "Guia de instalação",     d: "PDF com passo a passo para cada versão do Lightroom." },
            { n: "04", t: "Videoaula",              d: "Como escolher o preset certo para cada foto, ajustes finos." },
            { n: "05", t: "Licença comercial",      d: "Use em trabalhos pagos, redes sociais e clientes. Sem pegadinha." },
            { n: "06", t: "Atualizações vitalícias", d: "Todo pack novo que eu lançar, você recebe automaticamente." },
          ].map(it => (
            <div key={it.n} style={{ borderTop: "1px solid rgba(232,223,201,.14)",
              paddingTop: 20 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10,
                letterSpacing: ".22em", color: "var(--rust-soft)", marginBottom: 8 }}>
                № {it.n}
              </div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 20,
                fontWeight: 600, letterSpacing: "-.01em", marginBottom: 6 }}>
                {it.t}
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 14,
                lineHeight: 1.6, color: "rgba(232,223,201,.7)" }}>
                {it.d}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACORDEÃO / FAQ ── */}
      <section style={{ padding: "80px 56px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80,
        alignItems: "start" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: ".22em", textTransform: "uppercase",
            color: "var(--rust)", marginBottom: 12 }}>
            № 03 · Detalhes
          </div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 48, fontWeight: 600,
            letterSpacing: "-.02em", lineHeight: 1, margin: 0 }}>
            Tudo que você{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontWeight: 400, color: "var(--moss)" }}>precisa saber</span>.
          </h2>
        </div>
        <Accordion items={ACCORDION_ITEMS} />
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: "100px 56px", background: "var(--canvas-deep)",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80,
        alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: ".22em", textTransform: "uppercase",
            color: "var(--rust)", marginBottom: 16 }}>
            № 04 · Levar pra casa
          </div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 72, fontWeight: 700,
            letterSpacing: "-.03em", lineHeight: 0.95, margin: 0,
            color: "var(--bark)" }}>
            Pronto pra
            <br />
            dar{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontWeight: 400, color: "var(--moss)" }}>cor</span>
            <br />
            às suas fotos?
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 18,
            color: "#3A3530", marginTop: 28, maxWidth: "38ch",
            lineHeight: 1.55 }}>
            Download imediato. Acesso vitalício. Garantia de 14 dias — se não curtir, devolvo.
          </p>
        </div>

        <div style={{ background: "var(--canvas)", padding: 40,
          border: "1px solid var(--line)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: ".22em", textTransform: "uppercase",
            color: "var(--stone)" }}>
            Outdoor Cinematic Presets
          </div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 72,
            fontWeight: 700, letterSpacing: "-.03em", color: "var(--bark)",
            lineHeight: 1, marginTop: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 22,
              color: "var(--stone)" }}>R$</span> 59
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--stone)", marginTop: 8 }}>
            acesso vitalício · download imediato
          </div>
          <div style={{ marginTop: 24, borderTop: "1px solid var(--line)",
            paddingTop: 20 }}>
            {["45 presets em .xmp + .dng", "4 categorias de cor",
              "Guia PDF + videoaula", "Licença pessoal e comercial",
              "Atualizações vitalícias"].map(item => (
              <div key={item} style={{ display: "flex", gap: 12, padding: "8px 0",
                fontFamily: "var(--font-serif)", fontSize: 15, color: "#3A3530" }}>
                <span style={{ color: "var(--moss)", fontWeight: 600 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <a href={CTA_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "block", marginTop: 24, width: "100%",
              padding: "16px 24px", background: "var(--bark)",
              color: "var(--canvas)", fontFamily: "var(--font-ui)",
              fontSize: 12, fontWeight: 700, letterSpacing: ".22em",
              textTransform: "uppercase", textDecoration: "none",
              textAlign: "center" }}>
            Comprar agora →
          </a>
        </div>
      </section>

      <SiteFooter dark={false} />
    </div>
  );
}

// ── Preset Card ──────────────────────────────────────────────────────────────
function PresetCard({ preset }: { preset: { key: string; name: string; desc: string; cat: string } }) {
  const [hover, setHover] = useState(false);
  const catColors: Record<string, string> = {
    "Tom Verde":   "#7EC47E",
    "Tom Azul":    "#6FA3D8",
    "Tom Laranja": "#D8924A",
    "Aesthetic":   "#C8905A",
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: "var(--canvas-deep)", border: "1px solid var(--line)",
        overflow: "hidden", cursor: "pointer",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "transform .3s cubic-bezier(.2,.7,.2,1)" }}>
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
        <img
          src={`/images/presets/${preset.key}.jpg`}
          alt={preset.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", display: "block",
            transform: hover ? "scale(1.05)" : "scale(1)",
            transition: "transform .6s cubic-bezier(.2,.7,.2,1)" }}
        />
        <div style={{ position: "absolute", top: 10, left: 10,
          padding: "3px 8px", background: "rgba(30,42,24,.75)",
          fontFamily: "var(--font-mono)", fontSize: 9,
          letterSpacing: ".15em", color: "var(--canvas)" }}>
          {preset.cat}
        </div>
      </div>
      <div style={{ padding: "16px 18px 18px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9,
          letterSpacing: ".15em", color: "var(--stone)", marginBottom: 4 }}>
          <span style={{ display: "inline-block", width: 8, height: 8,
            borderRadius: "50%", background: catColors[preset.cat] ?? "var(--rust)",
            marginRight: 6, verticalAlign: "middle" }} />
          {preset.cat}
        </div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 15,
          fontWeight: 600, letterSpacing: "-.01em", color: "var(--bark)",
          marginBottom: 4 }}>
          {preset.name.split(" — ")[1] ?? preset.name}
        </div>
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
          fontSize: 12, color: "#3A3530", lineHeight: 1.5 }}>
          {preset.desc}
        </div>
      </div>
    </div>
  );
}
