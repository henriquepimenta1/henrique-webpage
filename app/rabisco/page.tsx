"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./rabisco.module.css";
import ScribbleCanvas from "./scribble-canvas";

// Rabisco — ferramenta de scribble animado para filmmakers.
// O traço vem de paths vetoriais perturbados em tempo real (ver scribble.ts),
// não de glifos alternativos pré-desenhados: é isso que faz o slider de Tremor
// controlar a deformação de verdade. Export real ainda não implementado.
// Layout segue os tokens de .theme-fdl (globals.css).

const FONTS = ["Rabisco Nº1", "Rabisco Nº2", "Rabisco Nº3"];
const DEMO_TEXT = "ação.";
const EXPORT_LIMIT = 3;

function Slider({
  label,
  value,
  valueLabel,
  onChange,
}: {
  label: string;
  value: number;
  valueLabel: string;
  onChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onChange(Math.round(pct * 100));
  };

  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>
        {label} <span className={styles.fieldValue}>{valueLabel}</span>
      </span>
      <div
        ref={trackRef}
        className={styles.sliderTrack}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) setFromClientX(e.clientX);
        }}
        role="slider"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onChange(Math.min(100, value + 2));
          if (e.key === "ArrowLeft") onChange(Math.max(0, value - 2));
        }}
      >
        <div className={styles.sliderFill} style={{ width: `${value}%` }} />
        <div className={styles.sliderHandle} style={{ left: `${value}%` }} />
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="var(--text-3)" strokeWidth="1">
      <rect x="2" y="4.5" width="6" height="4.5" />
      <path d="M3.2 4.5V3a1.8 1.8 0 0 1 3.6 0v1.5" />
    </svg>
  );
}

export default function RabiscoPage() {
  const [text, setText] = useState("");
  const [fontIdx, setFontIdx] = useState(1);
  const [thickness, setThickness] = useState<"fina" | "regular" | "grossa">("regular");
  const [tremor, setTremor] = useState(32);
  const [speed, setSpeed] = useState(55);
  const [duration, setDuration] = useState(40);
  const [letterDelay, setLetterDelay] = useState(25);
  const [loop, setLoop] = useState(true);
  const [color, setColor] = useState("#c08246");
  const [background, setBackground] = useState<"transparent" | "solid">("transparent");
  const [format, setFormat] = useState<"png" | "mp4">("png");
  const [resolution, setResolution] = useState<"720" | "1080">("1080");
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(38);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exportsUsed, setExportsUsed] = useState(2);
  const [exportState, setExportState] = useState<"idle" | "exporting" | "limited">("idle");
  const [exportFrame, setExportFrame] = useState(0);

  const displayText = text.trim() ? text : DEMO_TEXT;
  const durationSeconds = (0.8 + (duration / 100) * 3.6).toFixed(1);
  const speedLabel = (0.6 + (speed / 100) * 1.8).toFixed(1);
  const delayMs = Math.round(20 + (letterDelay / 100) * 140);

  // Reproduz o preview em loop enquanto "playing" — puramente visual.
  useEffect(() => {
    if (!playing) return;
    const totalMs = Number(durationSeconds) * 1000;
    const start = performance.now() - (progress / 100) * totalMs;
    let raf: number;
    const tick = (now: number) => {
      const pct = ((now - start) / totalMs) % 1;
      setProgress(pct * 100);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, durationSeconds]);

  // Simula export: conta quadros, respeita o limite grátis diário.
  useEffect(() => {
    if (exportState !== "exporting") return;
    const totalFrames = 96;
    const id = setInterval(() => {
      setExportFrame((f) => {
        const next = f + 6;
        if (next >= totalFrames) {
          clearInterval(id);
          setExportState("idle");
          setExportsUsed((u) => u + 1);
          return 0;
        }
        return next;
      });
    }, 90);
    return () => clearInterval(id);
  }, [exportState]);

  const handleExportClick = () => {
    if (exportsUsed >= EXPORT_LIMIT) {
      setExportState("limited");
      return;
    }
    setExportFrame(0);
    setExportState("exporting");
  };

  const controlsSections = (
    <>
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Traço</p>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Espessura</span>
          <div className={styles.tabs}>
            {(["fina", "regular", "grossa"] as const).map((t) => (
              <button key={t} className={styles.tab} data-active={thickness === t ? "1" : "0"} onClick={() => setThickness(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <Slider label="Tremor" value={tremor} valueLabel={`${tremor}%`} onChange={setTremor} />
        <Slider label="Velocidade" value={speed} valueLabel={`${speedLabel}×`} onChange={setSpeed} />
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Animação</p>
        <Slider label="Duração" value={duration} valueLabel={`${durationSeconds}s`} onChange={setDuration} />
        <Slider label="Atraso entre letras" value={letterDelay} valueLabel={`${delayMs}ms`} onChange={setLetterDelay} />
        <div className={styles.field}>
          <div className={styles.toggleRow}>
            <span className={styles.fieldLabel} style={{ display: "block" }}>
              Loop
            </span>
            <button
              className={styles.toggleTrack}
              aria-pressed={loop}
              onClick={() => setLoop((v) => !v)}
            >
              <span className={styles.toggleKnob} style={{ left: loop ? 20 : 2 }} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Aparência</p>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Cor do traço</span>
          <div className={styles.colorRow}>
            <input type="color" className={styles.colorSwatch} value={color} onChange={(e) => setColor(e.target.value)} />
            <span className={styles.colorHex}>{color.toUpperCase()}</span>
          </div>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Fundo do preview</span>
          <div className={styles.chipRow}>
            <button className={styles.chip} data-active={background === "transparent" ? "1" : "0"} onClick={() => setBackground("transparent")}>
              Transparente
            </button>
            <button className={styles.chip} data-active={background === "solid" ? "1" : "0"} onClick={() => setBackground("solid")}>
              Cor sólida
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const exportSection = (
    <div className={styles.section} style={{ borderBottom: "none" }}>
      <p className={styles.sectionTitle}>Exportar</p>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Formato</span>
        <div className={styles.chipRow}>
          <button className={styles.chip} data-active={format === "png" ? "1" : "0"} onClick={() => setFormat("png")}>
            PNG sequência
          </button>
          <button className={styles.chip} data-active={format === "mp4" ? "1" : "0"} onClick={() => setFormat("mp4")}>
            MP4
          </button>
        </div>
      </div>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Resolução</span>
        <div className={styles.chipRow}>
          <button className={styles.chip} data-active={resolution === "1080" ? "1" : "0"} onClick={() => setResolution("1080")}>
            1080p
          </button>
          <button className={styles.chip} data-active={resolution === "720" ? "1" : "0"} onClick={() => setResolution("720")}>
            720p
          </button>
          <span className={styles.chip} data-locked="1">
            <LockIcon /> 4K
          </span>
        </div>
      </div>

      {exportState === "exporting" ? (
        <>
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>renderizando quadro {exportFrame}/96</span>
            <button className={styles.cancelLink} onClick={() => setExportState("idle")}>
              cancelar
            </button>
          </div>
          <div className={styles.sliderTrack} style={{ marginTop: 8, padding: 0, height: 2 }}>
            <div className={styles.sliderFill} style={{ width: `${(exportFrame / 96) * 100}%`, top: 0 }} />
          </div>
        </>
      ) : exportState === "limited" ? (
        <p className={styles.limitMsg}>
          3 exports hoje. Mais amanhã — ou <a className={styles.limitLink}>PRO agora →</a>
        </p>
      ) : (
        <>
          <a className={styles.exportLink} onClick={handleExportClick}>
            Exportar sequência →
          </a>
          <p className={styles.exportNote}>
            Grátis: com marca d&rsquo;água · {exportsUsed}/{EXPORT_LIMIT} exports hoje. Sem cadastro de cartão.
          </p>
        </>
      )}
    </div>
  );

  return (
    <div className="theme-fdl">
      <div className={styles.rabisco}>
        <div className={styles.topbar}>
          <Link className={styles.wordmark} href="/">
            <span className="path">euhenriq.com.br /</span> rabisco
          </Link>
          <span className={styles.planStatus}>
            <span className={styles.planDot} /> gratuito · {exportsUsed}/{EXPORT_LIMIT} exports hoje
          </span>
        </div>

        <div className={styles.main}>
          <div className={styles.canvasCol}>
            <div className={styles.canvasStage} style={background === "solid" ? { backgroundImage: "none", backgroundColor: "var(--surface)" } : undefined}>
              <ScribbleCanvas
                text={displayText}
                tremor={tremor}
                thickness={thickness}
                color={color}
                progress={progress / 100}
              />
            </div>
            <div className={styles.transport}>
              <button className={styles.transportBtn} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "pausar" : "reproduzir"}>
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="2.5" width="3.4" height="11" fill="var(--text-1)" />
                    <rect x="9.6" y="2.5" width="3.4" height="11" fill="var(--text-1)" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 2.5v11l9-5.5-9-5.5z" fill="var(--text-1)" />
                  </svg>
                )}
              </button>
              <div className={styles.transportTrack}>
                <div className={styles.transportFill} style={{ width: `${progress}%` }} />
              </div>
              <div className={styles.transportTime}>
                {(Number(durationSeconds) * (progress / 100)).toFixed(1)}s / {durationSeconds}s
              </div>
              <button className={styles.transportBtn} onClick={() => setLoop((v) => !v)} aria-label="loop" aria-pressed={loop}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={loop ? "var(--accent)" : "var(--text-3)"} strokeWidth="1.4">
                  <path d="M2 6a6 6 0 0 1 11-3.5M2.5 2v3.5H6" />
                  <path d="M14 10a6 6 0 0 1-11 3.5M13.5 14v-3.5H10" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── painel desktop ── */}
          <div className={styles.rail}>
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Texto</p>
              <input className={styles.textInput} placeholder={DEMO_TEXT} value={text} onChange={(e) => setText(e.target.value)} maxLength={60} />
            </div>
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Fonte de traço</p>
              <button className={styles.selectRow} onClick={() => setFontIdx((i) => (i + 1) % FONTS.length)}>
                <span className={styles.selectValue}>{FONTS[fontIdx]}</span>
                <span className={styles.chevron}>⌄</span>
              </button>
            </div>
            {controlsSections}
            {exportSection}
          </div>
        </div>

        {/* ── corpo mobile ── */}
        <div className={styles.mobileBody}>
          <div className={styles.section} style={{ padding: "16px", borderBottom: "1px solid var(--border)" }}>
            <p className={styles.sectionTitle} style={{ marginBottom: 8 }}>
              Texto
            </p>
            <input className={styles.textInput} placeholder={DEMO_TEXT} value={text} onChange={(e) => setText(e.target.value)} maxLength={60} />
          </div>

          <div className={styles.fontScroll}>
            {FONTS.map((f, i) => (
              <button key={f} className={styles.fontChip} data-active={fontIdx === i ? "1" : "0"} onClick={() => setFontIdx(i)}>
                {f}
              </button>
            ))}
          </div>

          <button className={styles.disclosure} onClick={() => setMobileOpen((v) => !v)}>
            <span className={styles.disclosureLabel}>Ajustes avançados · 7</span>
            <span className={styles.chevron}>{mobileOpen ? "︿" : "⌄"}</span>
          </button>
          {mobileOpen && <div style={{ padding: "0 16px" }}>{controlsSections}</div>}

          <div style={{ padding: "0 16px" }}>{exportSection}</div>
        </div>

        <div className={styles.ctaStrip}>
          <span className={styles.ctaMsg}>4K, fonte própria e sem marca d&rsquo;água —</span>
          <a className={styles.ctaLink}>Rabisco PRO →</a>
          <span className={styles.ctaPrice}>a partir de R$19/mês</span>
        </div>
      </div>
    </div>
  );
}
