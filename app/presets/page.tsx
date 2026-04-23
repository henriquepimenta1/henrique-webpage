"use client";

/**
 * app/presets/page.tsx — Landing page /presets
 * Design direction: FIELD
 *
 * IMPLEMENTAÇÃO:
 * - Substitui por completo o arquivo atual app/presets/page.tsx
 * - Mantém a importação de @/content/presets (PRESETS, PRESET_CATS, ACCORDION_ITEMS, CTA_URL)
 * - Mantém SiteNav e SiteFooter de @/components/
 * - Requer tokens CSS globais já aplicados em globals.css (--canvas, --forest, --bark,
 *   --rust, --rust-soft, --moss, --stone, --line, --canvas-deep, --font-ui, --font-serif,
 *   --font-mono, --font-hand)
 *
 * NOVIDADES VS VERSÃO ANTERIOR:
 * 1. Slider before/after RECEBE o preset selecionado como prop (estado global da página)
 * 2. Clicar em qualquer card (galeria comparativa OU grid completa) troca o preset
 *    exibido no slider do hero + faz scroll suave pra ele
 * 3. Card ativo ganha ring visual rust-soft
 * 4. Teclas ← → movem o divisor do slider (acessibilidade)
 * 5. Filtro por categoria reseta o slider pro primeiro preset da categoria ativa
 * 6. Galeria comparativa 3×2 acima do grid (prova rápida)
 * 7. Comparação "Por que não usar preset grátis?" (quebra de objeção)
 * 8. FAQ expandida com 3 perguntas novas
 * 9. Sem "№ 01", "№ 02" espalhados — landing e-commerce, não editorial
 */

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";
import { PRESETS, PRESET_CATS, ACCORDION_ITEMS, CTA_URL } from "@/content/presets";

const PRICE = "59";
const PRICE_ORIGINAL = "119";

// 6 presets escolhidos a dedo para a galeria comparativa do hero
// (contraste visual forte entre before/after — boa primeira impressão)
const SHOWCASE_KEYS = [
  "8-abissal",
  "22-poente",
  "14-vista-do-oceano",
  "6-dourado-reluzente",
  "11-devaneio",
  "21-campo-seco",
];

// ─────────────────────────────────────────────────────────────────────────────
// BeforeAfter — lógica de drag preservada, visual Field, recebe preset por prop
// ─────────────────────────────────────────────────────────────────────────────
function BeforeAfter({
  presetKey,
  height = 640,
  variant = "hero",
}: {
  presetKey: string;
  height?: number;
  variant?: "hero" | "section";
}) {
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
    const tm = (e: TouchEvent) => {
      if (dragging.current && e.touches[0]) move(e.touches[0].clientX);
    };
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

  // Acessibilidade: arrow keys
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft")  setPos(p => Math.max(2, p - 2));
    if (e.key === "ArrowRight") setPos(p => Math.min(98, p + 2));
  };

  const after  = `/images/presets/${presetKey}.jpg`;
  const before = `/images/presets/${presetKey}-before.jpg`;

  return (
    <div
      ref={wrap}
      onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
      onTouchStart={(e) => {
        dragging.current = true;
        if (e.touches[0]) move(e.touches[0].clientX);
      }}
      onKeyDown={onKey}
      tabIndex={0}
      role="slider"
      aria-label="Comparar antes e depois do preset"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        cursor: "ew-resize",
        userSelect: "none",
        background: "var(--forest)",
        outline: "none",
      }}
    >
      {/* After (direita) */}
      <img
        src={after}
        alt={`Preset ${presetKey} aplicado`}
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Before (RAW) — clipado pela posição do slider */}
      <div style={{ position: "absolute", inset: 0, width: `${pos}%`, overflow: "hidden" }}>
        <img
          src={before}
          alt="RAW antes do tratamento"
          draggable={false}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: `${100 / (pos / 100)}%`,
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* Labels */}
      <div
        style={{
          position: "absolute",
          top: variant === "hero" ? 24 : 20,
          left: variant === "hero" ? 24 : 20,
          padding: "6px 14px",
          background: "rgba(42,33,26,.82)",
          backdropFilter: "blur(8px)",
          color: "var(--canvas)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: ".24em",
          textTransform: "uppercase",
        }}
      >
        RAW
      </div>
      <div
        style={{
          position: "absolute",
          top: variant === "hero" ? 24 : 20,
          right: variant === "hero" ? 24 : 20,
          padding: "6px 14px",
          background: "var(--rust)",
          color: "var(--canvas)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: ".24em",
          textTransform: "uppercase",
        }}
      >
        Tratado
      </div>

      {/* Divisor */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${pos}%`,
          width: 2,
          background: "var(--canvas)",
          transform: "translateX(-1px)",
          pointerEvents: "none",
          boxShadow: "0 0 20px rgba(0,0,0,.4)",
        }}
      />

      {/* Handle */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${pos}%`,
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: "var(--canvas)",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          color: "var(--bark)",
          fontFamily: "var(--font-mono)",
          fontSize: 18,
          fontWeight: 700,
          boxShadow: "0 6px 24px rgba(0,0,0,.35), inset 0 0 0 1px rgba(42,33,26,.1)",
        }}
      >
        ⇄
      </div>

      {/* Hint de arraste (só no hero) */}
      {variant === "hero" && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "6px 14px",
            background: "rgba(42,33,26,.72)",
            backdropFilter: "blur(8px)",
            color: "var(--canvas)",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            opacity: 0.85,
            pointerEvents: "none",
          }}
        >
          Arraste ←→
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Accordion (FAQ)
// ─────────────────────────────────────────────────────────────────────────────
function Accordion({ items }: { items: { title: string; body: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ borderTop: "1px solid var(--line)" }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--line)" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "22px 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "-.01em",
                color: "var(--bark)",
              }}
            >
              {item.title}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 22,
                color: "var(--rust)",
                transform: open === i ? "rotate(45deg)" : "none",
                transition: "transform .25s",
                display: "block",
                lineHeight: 1,
              }}
            >
              +
            </span>
          </button>
          {open === i && (
            <div
              style={{
                paddingBottom: 22,
                fontFamily: "var(--font-serif)",
                fontSize: 16,
                lineHeight: 1.7,
                color: "#3A3530",
                whiteSpace: "pre-line",
                maxWidth: "68ch",
              }}
            >
              {item.body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Página
// ─────────────────────────────────────────────────────────────────────────────
export default function PresetsPage() {
  const [activeKey, setActiveKey] = useState<string>(SHOWCASE_KEYS[0]);
  const [activeCat, setActiveCat] = useState<string>("all");
  const heroRef = useRef<HTMLDivElement>(null);

  const filtered = activeCat === "all"
    ? PRESETS
    : PRESETS.filter(p => p.cat === activeCat);

  const selectPreset = useCallback((key: string) => {
    setActiveKey(key);
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const selectCategory = useCallback((cat: string) => {
    setActiveCat(cat);
    const firstInCat = cat === "all" ? PRESETS[0] : PRESETS.find(p => p.cat === cat);
    if (firstInCat) setActiveKey(firstInCat.key);
  }, []);

  const activePreset = PRESETS.find(p => p.key === activeKey);

  const FAQ = [
    ...ACCORDION_ITEMS,
    {
      title: "Funciona no celular?",
      body: "Sim. Os arquivos .dng instalam no Lightroom Mobile (iOS e Android) — basta abrir no app e o preset fica salvo na sua conta Creative Cloud.",
    },
    {
      title: "E se eu não gostar?",
      body: "Garantia de 14 dias. Se não curtir, escreve pra management@henriq.eu e devolvo 100% sem perguntas.",
    },
    {
      title: "Recebo atualizações futuras?",
      body: "Sim. Todo pack novo que eu lançar, você recebe por email automaticamente — sem custo adicional.",
    },
  ];

  return (
    <div
      style={{
        background: "var(--canvas)",
        color: "var(--bark)",
        fontFamily: "var(--font-ui)",
      }}
    >
      <SiteNav dark={false} />

      {/* ═══ HERO ═══ */}
      <section
        ref={heroRef}
        style={{
          paddingTop: 88,
          background: "var(--forest)",
          color: "var(--canvas)",
        }}
      >
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 0,
            minHeight: 720,
          }}
        >
          <div style={{ position: "relative" }}>
            <BeforeAfter presetKey={activeKey} height={720} variant="hero" />
          </div>

          <div
            style={{
              padding: "64px 56px 56px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: ".24em",
                  textTransform: "uppercase",
                  color: "rgba(232,223,201,.55)",
                  marginBottom: 24,
                }}
              >
                Outdoor Cinematic · Lightroom
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 700,
                  fontSize: "clamp(44px, 4.4vw, 68px)",
                  letterSpacing: "-.03em",
                  lineHeight: 0.94,
                  margin: 0,
                }}
              >
                45 presets<br />
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--rust-soft)",
                  }}
                >
                  saídos das minhas expedições
                </span>
              </h1>

              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 17,
                  lineHeight: 1.55,
                  color: "rgba(232,223,201,.78)",
                  marginTop: 24,
                  maxWidth: "42ch",
                }}
              >
                O mesmo tratamento que aplico no meu portfólio, agora no seu Lightroom.
                Quatro estilos de cor, feitos a partir de anos fotografando luz de campo.
              </p>

              {activePreset && (
                <div
                  style={{
                    marginTop: 28,
                    padding: "14px 18px",
                    background: "rgba(232,223,201,.06)",
                    border: "1px solid rgba(232,223,201,.12)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: ".22em",
                      textTransform: "uppercase",
                      color: "rgba(232,223,201,.5)",
                      marginBottom: 4,
                    }}
                  >
                    exibindo no slider
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--canvas)",
                    }}
                  >
                    {activePreset.name}
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  marginTop: 32,
                  paddingTop: 24,
                  borderTop: "1px solid rgba(232,223,201,.14)",
                }}
              >
                {[
                  { k: "Formato", v: ".xmp + .dng" },
                  { k: "Categorias", v: "4 estilos" },
                  { k: "Compatível", v: "Lightroom + Mobile" },
                  { k: "Acesso", v: "Vitalício" },
                ].map(s => (
                  <div key={s.k}>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: ".22em",
                        textTransform: "uppercase",
                        color: "rgba(232,223,201,.45)",
                        marginBottom: 4,
                      }}
                    >
                      {s.k}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 40 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 22 }}>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: ".22em",
                      textTransform: "uppercase",
                      color: "rgba(232,223,201,.45)",
                      marginBottom: 8,
                    }}
                  >
                    de R$ {PRICE_ORIGINAL} por
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 64,
                      fontWeight: 700,
                      letterSpacing: "-.02em",
                      lineHeight: 0.9,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 18,
                        color: "rgba(232,223,201,.6)",
                        marginRight: 6,
                        fontWeight: 400,
                      }}
                    >
                      R$
                    </span>
                    {PRICE}
                  </div>
                </div>
              </div>

              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "17px 34px",
                  background: "var(--rust-soft)",
                  color: "var(--forest)",
                  fontFamily: "var(--font-ui)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Comprar presets
                <span style={{ fontSize: 18 }}>→</span>
              </a>

              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: ".16em",
                  color: "rgba(232,223,201,.45)",
                  marginTop: 14,
                }}
              >
                Download imediato · Garantia 14 dias
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STRIP DE PROVA ═══ */}
      <section
        style={{
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          background: "var(--canvas)",
        }}
      >
        {[
          { v: "2000+", k: "fotógrafos usando" },
          { v: "45", k: "presets · 4 categorias" },
          { v: "Lightroom", k: "Classic + CC + Mobile" },
          { v: "14 dias", k: "garantia total" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              padding: "28px 24px",
              borderLeft: i === 0 ? "none" : "1px solid var(--line)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-.01em",
                color: "var(--bark)",
                marginBottom: 4,
              }}
            >
              {s.v}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "var(--stone)",
              }}
            >
              {s.k}
            </div>
          </div>
        ))}
      </section>

      {/* ═══ GALERIA COMPARATIVA ═══ */}
      <section style={{ padding: "96px 56px", background: "var(--canvas)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 44,
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-hand)",
                  fontSize: 30,
                  color: "var(--rust)",
                  marginBottom: 4,
                  transform: "rotate(-2deg)",
                  display: "inline-block",
                }}
              >
                veja de verdade—
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 600,
                  fontSize: 48,
                  letterSpacing: "-.02em",
                  lineHeight: 1,
                  margin: 0,
                  color: "var(--bark)",
                }}
              >
                Antes e depois,{" "}
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--moss)",
                  }}
                >
                  sem maquiagem
                </span>
                .
              </h2>
            </div>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 16,
                color: "#3A3530",
                maxWidth: "44ch",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              Clique em qualquer um pra ver em tela cheia no comparador acima.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {SHOWCASE_KEYS.map(key => {
              const preset = PRESETS.find(p => p.key === key);
              const isActive = activeKey === key;
              return (
                <button
                  key={key}
                  onClick={() => selectPreset(key)}
                  style={{
                    position: "relative",
                    aspectRatio: "4/3",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: isActive ? "2px solid var(--rust)" : "1px solid var(--line)",
                    outline: "none",
                    padding: 0,
                    background: "var(--canvas-deep)",
                    transition: "transform .3s",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, width: "50%", overflow: "hidden" }}>
                    <img
                      src={`/images/presets/${key}-before.jpg`}
                      alt=""
                      style={{
                        position: "absolute", left: 0, top: 0,
                        width: "200%", height: "100%", objectFit: "cover",
                        filter: "saturate(.55) brightness(.92)",
                      }}
                    />
                  </div>
                  <div style={{ position: "absolute", inset: 0, left: "50%", width: "50%", overflow: "hidden" }}>
                    <img
                      src={`/images/presets/${key}.jpg`}
                      alt=""
                      style={{
                        position: "absolute", left: "-100%", top: 0,
                        width: "200%", height: "100%", objectFit: "cover",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute", top: 0, bottom: 0, left: "50%",
                      width: 1, background: "rgba(255,255,255,.6)", transform: "translateX(-.5px)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: "18px 18px 14px",
                      background: "linear-gradient(0deg, rgba(30,42,24,.9), transparent)",
                      color: "var(--canvas)", textAlign: "left",
                    }}
                  >
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", opacity: 0.7, marginBottom: 2 }}>
                      {preset?.cat}
                    </div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 600 }}>
                      {preset?.name.split(" — ")[1] ?? preset?.name}
                    </div>
                  </div>
                  {isActive && (
                    <div
                      style={{
                        position: "absolute", top: 12, right: 12,
                        padding: "4px 10px", background: "var(--rust)",
                        color: "var(--canvas)", fontFamily: "var(--font-mono)",
                        fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase",
                      }}
                    >
                      no slider
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ COLEÇÃO COMPLETA ═══ */}
      <section
        style={{
          padding: "96px 56px",
          background: "var(--canvas-deep)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 40,
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 600,
                fontSize: 48,
                letterSpacing: "-.02em",
                lineHeight: 1,
                margin: 0,
                color: "var(--bark)",
              }}
            >
              A coleção{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>
                completa
              </span>
              .
            </h2>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <FilterPill
                label={`Todos · ${PRESETS.length}`}
                active={activeCat === "all"}
                onClick={() => selectCategory("all")}
              />
              {PRESET_CATS.map(cat => (
                <FilterPill
                  key={cat.id}
                  label={`${cat.label} · ${cat.count}`}
                  color={cat.color}
                  active={activeCat === cat.label}
                  onClick={() => selectCategory(cat.label)}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {filtered.map((p, i) => (
              <PresetCard
                key={`${p.key}-${i}`}
                preset={p}
                isActive={activeKey === p.key}
                onSelect={() => selectPreset(p.key)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DEMO AMPLIADA ═══ */}
      <section style={{ padding: "96px 56px", background: "var(--forest)", color: "var(--canvas)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div style={{ marginBottom: 40, maxWidth: 720 }}>
            <h2
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 56,
                fontWeight: 600,
                letterSpacing: "-.02em",
                lineHeight: 1,
                margin: 0,
              }}
            >
              Do RAW ao{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>
                tratado
              </span>
              . Um clique.
            </h2>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, color: "rgba(232,223,201,.78)", marginTop: 14, lineHeight: 1.55 }}>
              Os presets já carregam pontos de branco, shadows e HSL calibrados.
              Sem correção extra — funciona em RAW direto da câmera.
            </p>
          </div>

          <BeforeAfter presetKey={activeKey} height={560} variant="section" />

          {activePreset && (
            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(232,223,201,.7)" }}>
              <span>Exibindo:</span>
              <span style={{ color: "var(--rust-soft)", fontWeight: 700 }}>{activePreset.name}</span>
            </div>
          )}
        </div>
      </section>

      {/* ═══ O QUE VEM INCLUSO ═══ */}
      <section style={{ padding: "96px 56px", background: "var(--canvas)" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 48, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, marginBottom: 48, marginTop: 0, color: "var(--bark)" }}>
            O que vem na{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>mochila</span>.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
            {[
              { n: "01", t: "45 presets Lightroom", d: "Arquivos .xmp para Lightroom Classic, CC, Mobile e Camera Raw." },
              { n: "02", t: "Perfis .dng", d: "Perfis de cor — mais estáveis, não bagunçam seus sliders atuais." },
              { n: "03", t: "Guia de instalação", d: "PDF passo a passo para cada versão do Lightroom, com prints." },
              { n: "04", t: "Videoaula", d: "Como escolher o preset certo para cada foto e fazer ajustes finos." },
              { n: "05", t: "Licença comercial", d: "Use em trabalhos pagos, redes sociais e clientes. Sem pegadinha." },
              { n: "06", t: "Atualizações vitalícias", d: "Todo pack novo que eu lançar, você recebe automaticamente." },
            ].map(it => (
              <div key={it.n} style={{ borderTop: "1px solid var(--line)", paddingTop: 22 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", color: "var(--rust)", marginBottom: 10 }}>№ {it.n}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 22, fontWeight: 600, letterSpacing: "-.01em", marginBottom: 8, color: "var(--bark)" }}>{it.t}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.65, color: "#3A3530" }}>{it.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VS PRESET GRÁTIS ═══ */}
      <section style={{ padding: "96px 56px", background: "var(--canvas-deep)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 44, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.05, marginBottom: 48, marginTop: 0, color: "var(--bark)", maxWidth: "22ch" }}>
            Por que não usar um{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>preset grátis</span>?
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 0, background: "var(--canvas)", border: "1px solid var(--line)" }}>
            <div style={{ padding: "18px 24px" }}></div>
            <div style={{ padding: "18px 24px", borderLeft: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", textAlign: "center" }}>
              Grátis · Instagram
            </div>
            <div style={{ padding: "18px 24px", background: "var(--forest)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", textAlign: "center" }}>
              Outdoor Cinematic
            </div>
            {[
              "Qualidade consistente entre fotos",
              "Ajustado especificamente para natureza",
              "Funciona em RAW sem bagunçar sliders",
              "Licença comercial incluída",
              "Suporte direto com o autor",
            ].map((row) => (
              <VsRow key={row} label={row} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ padding: "96px 56px", background: "var(--canvas)", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 48, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1, margin: 0, color: "var(--bark)" }}>
            Tudo que você{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>precisa saber</span>.
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, color: "#3A3530", marginTop: 20, lineHeight: 1.6, maxWidth: "32ch" }}>
            Se a sua dúvida não estiver aqui, escreva pra{" "}
            <a href="mailto:management@henriq.eu" style={{ color: "var(--rust)", textDecoration: "underline" }}>
              management@henriq.eu
            </a>
            . Respondo todas, pessoalmente.
          </p>
        </div>
        <Accordion items={FAQ} />
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section style={{ padding: "112px 56px", background: "var(--canvas-deep)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", borderTop: "1px solid var(--line)" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 76, fontWeight: 700, letterSpacing: "-.03em", lineHeight: 0.94, margin: 0, color: "var(--bark)" }}>
            Pronto pra<br />
            dar{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>cor</span>
            <br />às suas fotos?
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "#3A3530", marginTop: 28, maxWidth: "38ch", lineHeight: 1.55 }}>
            Download imediato. Acesso vitalício. Garantia de 14 dias — se não curtir, devolvo sem pergunta.
          </p>
        </div>

        <div style={{ background: "var(--canvas)", padding: 40, border: "1px solid var(--line)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)" }}>
            Outdoor Cinematic Presets
          </div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 76, fontWeight: 700, letterSpacing: "-.03em", color: "var(--bark)", lineHeight: 1, marginTop: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--stone)", fontWeight: 400 }}>R$</span>{" "}{PRICE}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--stone)", marginTop: 8 }}>
            acesso vitalício · download imediato
          </div>
          <div style={{ marginTop: 26, borderTop: "1px solid var(--line)", paddingTop: 22 }}>
            {["45 presets em .xmp + .dng", "4 categorias de cor", "Guia PDF + videoaula", "Licença pessoal e comercial", "Atualizações vitalícias", "Suporte por email"].map(item => (
              <div key={item} style={{ display: "flex", gap: 12, padding: "8px 0", fontFamily: "var(--font-serif)", fontSize: 15, color: "#3A3530" }}>
                <span style={{ color: "var(--moss)", fontWeight: 700 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <a
            href={CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", marginTop: 28, width: "100%", padding: "18px 24px", background: "var(--bark)", color: "var(--canvas)", fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", textDecoration: "none", textAlign: "center" }}
          >
            Comprar agora →
          </a>
        </div>
      </section>

      <SiteFooter dark={false} />

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponentes
// ─────────────────────────────────────────────────────────────────────────────

function FilterPill({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 18px",
        border: active ? "1px solid var(--bark)" : `1px solid ${color ? color + "55" : "var(--line)"}`,
        background: active ? (color ?? "var(--bark)") : "transparent",
        color: active ? "var(--canvas)" : "var(--bark)",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: ".2em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all .2s",
      }}
    >
      {label}
    </button>
  );
}

function PresetCard({ preset, isActive, onSelect }: { preset: { key: string; name: string; desc: string; cat: string }; isActive: boolean; onSelect: () => void }) {
  const [hover, setHover] = useState(false);
  const catColors: Record<string, string> = {
    "Tom Verde": "#7EC47E",
    "Tom Azul": "#6FA3D8",
    "Tom Laranja": "#D8924A",
    "Aesthetic": "#C8905A",
  };

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--canvas)",
        border: isActive ? "2px solid var(--rust)" : "1px solid var(--line)",
        overflow: "hidden",
        cursor: "pointer",
        padding: 0,
        textAlign: "left",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition: "transform .3s cubic-bezier(.2,.7,.2,1), border-color .2s",
        position: "relative",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
        <img
          src={`/images/presets/${preset.key}.jpg`}
          alt={preset.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hover ? "scale(1.06)" : "scale(1)", transition: "transform .6s cubic-bezier(.2,.7,.2,1)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(30,42,24,.8) 0%, transparent 50%)", opacity: hover ? 1 : 0, transition: "opacity .3s", display: "flex", alignItems: "flex-end", padding: 14 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--canvas)", padding: "5px 10px", background: "var(--rust)" }}>
            Ver antes/depois →
          </span>
        </div>
        {isActive && (
          <div style={{ position: "absolute", top: 10, right: 10, padding: "4px 10px", background: "var(--rust)", color: "var(--canvas)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase" }}>
            no slider
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".15em", color: "var(--stone)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: catColors[preset.cat] ?? "var(--rust)" }} />
          {preset.cat}
        </div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, letterSpacing: "-.01em", color: "var(--bark)", marginBottom: 4 }}>
          {preset.name.split(" — ")[1] ?? preset.name}
        </div>
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 12, color: "#3A3530", lineHeight: 1.5 }}>
          {preset.desc}
        </div>
      </div>
    </button>
  );
}

function VsRow({ label }: { label: string }) {
  return (
    <>
      <div style={{ padding: "18px 24px", borderTop: "1px solid var(--line)", fontFamily: "var(--font-serif)", fontSize: 15, color: "var(--bark)" }}>
        {label}
      </div>
      <div style={{ padding: "18px 24px", borderTop: "1px solid var(--line)", borderLeft: "1px solid var(--line)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 18, color: "#B05744" }}>
        ×
      </div>
      <div style={{ padding: "18px 24px", borderTop: "1px solid rgba(232,223,201,.14)", background: "var(--forest)", color: "var(--rust-soft)", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700 }}>
        ✓
      </div>
    </>
  );
}
