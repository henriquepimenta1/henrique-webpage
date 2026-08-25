"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../rabiscando.module.css";
import ScribbleCanvas from "../scribble-canvas";
import { useScribbleFont } from "../use-scribble-font";
import { MAX_TREMOR } from "../scribble";
import { cssFamily } from "../fonts";
import Conta from "./conta";
import "../botoes.css";
import { SCRIBBLE_FONTS, DEFAULT_FONT_ID, fontById } from "../fonts";
import { exportPngSequence, exportMp4, canExportMp4, triggerDownload } from "../export";

// Rabiscando — ferramenta de scribble animado para filmmakers.
// O traço vem de paths vetoriais perturbados em tempo real (ver scribble.ts),
// não de glifos alternativos pré-desenhados: é isso que faz o slider de Tremor
// controlar a deformação de verdade. Export real ainda não implementado.
// Layout segue os tokens de .theme-fdl (globals.css).


/** Taxas do arquivo final — independentes do fps do tremor.
 *  24 é o padrão de cinema e continua sendo o default; 25 existe para casar
 *  com material PAL, 30 e 60 para redes sociais e câmera lenta. */
const EXPORT_FPS_OPTIONS = [12, 24, 25, 30, 60] as const;
type ExportFps = (typeof EXPORT_FPS_OPTIONS)[number];
const DEFAULT_EXPORT_FPS: ExportFps = 24;

const RESOLUTIONS = {
  "720": { width: 1280, height: 720 },
  "1080": { width: 1920, height: 1080 },
  "2160": { width: 3840, height: 2160 },
} as const;

type ResolutionKey = keyof typeof RESOLUTIONS;

const RESOLUTION_LABELS: Record<ResolutionKey, string> = {
  "720": "720p",
  "1080": "1080p",
  "2160": "4K",
};

const STROKE_BY_THICKNESS = { fina: 0, regular: 6, grossa: 16 } as const;
const DEMO_TEXT = "ação.";

function Slider({
  label,
  value,
  valueLabel,
  onChange,
  max = 100,
}: {
  label: string;
  value: number;
  valueLabel: string;
  onChange: (v: number) => void;
  /** Sliders normalizados vão a 100; o de Tremor vai além (ver MAX_TREMOR). */
  max?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onChange(Math.round(pct * max));
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
        aria-valuemax={max}
        tabIndex={0}
        onKeyDown={(e) => {
          const passo = Math.max(1, Math.round(max / 50));
          if (e.key === "ArrowRight") onChange(Math.min(max, value + passo));
          if (e.key === "ArrowLeft") onChange(Math.max(0, value - passo));
        }}
      >
        <div className={styles.sliderFill} style={{ width: `${(value / max) * 100}%` }} />
        <div className={styles.sliderHandle} style={{ left: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

export default function RabiscandoEditorPage() {
  const [text, setText] = useState("");
  const [fontId, setFontId] = useState(DEFAULT_FONT_ID);
  const [thickness, setThickness] = useState<"fina" | "regular" | "grossa">("regular");
  const [tremor, setTremor] = useState(32);
  const [speed, setSpeed] = useState(55);
  const [duration, setDuration] = useState(40);
  const [letterSpacingPct, setLetterSpacingPct] = useState(20);
  const [lineHeightPct, setLineHeightPct] = useState(46);
  const [loop, setLoop] = useState(true);
  const [color, setColor] = useState("#c08246");
  const [background, setBackground] = useState<"transparent" | "solid">("transparent");
  const [bgColor, setBgColor] = useState("#0d0c0b");
  const [format, setFormat] = useState<"png" | "mp4">("png");
  const [resolution, setResolution] = useState<ResolutionKey>("1080");
  const [exportFps, setExportFps] = useState<ExportFps>(DEFAULT_EXPORT_FPS);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(38);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exportState, setExportState] = useState<"idle" | "exporting" | "error">("idle");
  const [exportFrame, setExportFrame] = useState(0);
  const cancelExportRef = useRef(false);
  const { font } = useScribbleFont(fontId);
  // Só no cliente: `window.VideoEncoder` não existe no SSR e checar direto
  // no render causaria divergência de hidratação.
  const [mp4Supported, setMp4Supported] = useState(true);
  useEffect(() => setMp4Supported(canExportMp4()), []);

  const displayText = text.trim() ? text : DEMO_TEXT;
  const durationSeconds = (0.8 + (duration / 100) * 3.6).toFixed(1);
  // Abaixo de ~4fps o tremor lê como piscada; acima de ~14 vira vibração.
  const boilFps = Math.round(4 + (speed / 100) * 10);
  // Negativo aperta as letras; o teto evita a palavra virar letras soltas.
  const letterSpacing = -0.05 + (letterSpacingPct / 100) * 0.45;
  // Vai bem abaixo de 1 de propósito: abaixo de ~0.6 as linhas se sobrepõem,
  // que é um efeito legítimo em lettering.
  const lineHeight = 0.25 + (lineHeightPct / 100) * 1.95;
  const exportFrameCount = Math.max(1, Math.round(Number(durationSeconds) * exportFps));

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

  const handleExportClick = async () => {
    if (!font) return;

    cancelExportRef.current = false;
    setExportFrame(0);
    setExportState("exporting");

    try {
      const params = {
        font,
        text: displayText,
        tremor,
        letterSpacing,
        lineHeight,
        strokeWidth: STROKE_BY_THICKNESS[thickness],
        color,
        boilFps,
        exportFps,
        durationSeconds: Number(durationSeconds),
        ...RESOLUTIONS[resolution],
        watermark: false, // acesso é só por assinatura — não há tier grátis
        // H.264 não tem alfa. Preto fixo de propósito: no DaVinci/Premiere o
        // modo de composição Screen/Add derruba o preto, então o overlay sai
        // de graça. No PNG este campo é ignorado.
        background: "#000000",
        onProgress: (done: number) => setExportFrame(done),
        shouldCancel: () => cancelExportRef.current,
      };

      const res = format === "mp4" ? await exportMp4(params) : await exportPngSequence(params);

      if (res) triggerDownload(res.blob, res.filename);
      setExportState("idle");
    } catch {
      setExportState("error");
    }
  };

  const controlsSections = (
    <>
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Traço</p>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Espessura</span>
          <div
            className="rb-toggle rb-toggle--fill rb-toggle--amostra"
            role="group"
            aria-label="Espessura"
            style={{ ["--rbs-familia" as string]: cssFamily(fontId) }}
          >
            {(["fina", "regular", "grossa"] as const).map((t, i) => (
              <button
                key={t}
                className="rb-toggle__opt"
                data-corpo={i + 1}
                aria-pressed={thickness === t}
                onClick={() => setThickness(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <Slider
          label="Tremor"
          value={tremor}
          max={MAX_TREMOR}
          valueLabel={tremor > 100 ? `${tremor}% · exagero` : `${tremor}%`}
          onChange={setTremor}
        />
        <Slider label="Velocidade do tremor" value={speed} valueLabel={`${boilFps} fps`} onChange={setSpeed} />
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Composição</p>
        <Slider
          label="Espaço entre letras"
          value={letterSpacingPct}
          valueLabel={`${letterSpacing >= 0 ? "+" : ""}${Math.round(letterSpacing * 100)}%`}
          onChange={setLetterSpacingPct}
        />
        <Slider
          label="Entrelinha"
          value={lineHeightPct}
          valueLabel={`${lineHeight.toFixed(2)}×`}
          onChange={setLineHeightPct}
        />
        <p className={styles.exportNote} style={{ marginTop: 2 }}>
          Enter no campo de texto cria uma nova linha.
        </p>
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
        {background === "solid" && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Cor do fundo</span>
            <div className={styles.colorRow}>
              <input
                type="color"
                className={styles.colorSwatch}
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
              <span className={styles.colorHex}>{bgColor.toUpperCase()}</span>
            </div>
          </div>
        )}
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
          <button
            className={styles.chip}
            data-active={format === "mp4" ? "1" : "0"}
            data-locked={mp4Supported ? undefined : "1"}
            disabled={!mp4Supported}
            title={mp4Supported ? undefined : "este browser não tem WebCodecs"}
            onClick={() => setFormat("mp4")}
          >
            MP4
          </button>
        </div>
      </div>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Resolução</span>
        <div className="rb-toggle rb-toggle--fill" role="group" aria-label="Resolução">
          {(Object.keys(RESOLUTIONS) as ResolutionKey[]).map((key) => (
            <button
              key={key}
              className="rb-toggle__opt"
              aria-pressed={resolution === key}
              onClick={() => setResolution(key)}
            >
              {RESOLUTION_LABELS[key]}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>
          Quadros por segundo <span className={styles.fieldValue}>{exportFps} fps</span>
        </span>
        <div className="rb-toggle rb-toggle--fill" role="group" aria-label="Quadros por segundo">
          {EXPORT_FPS_OPTIONS.map((f) => (
            <button
              key={f}
              className="rb-toggle__opt"
              aria-pressed={exportFps === f}
              onClick={() => setExportFps(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <Slider
        label="Duração"
        value={duration}
        valueLabel={`${durationSeconds}s · ${exportFrameCount} quadros`}
        onChange={setDuration}
      />

      {exportState === "exporting" ? (
        <>
          <div className={styles.progressRow}>
            <span className={styles.progressLabel}>
              renderizando quadro {exportFrame}/{exportFrameCount}
            </span>
            <button
              className="rb-btn rb-btn--tertiary rb-btn--quiet"
              onClick={() => {
                cancelExportRef.current = true;
                setExportState("idle");
              }}
            >
              cancelar
            </button>
          </div>
          <div className={styles.sliderTrack} style={{ marginTop: 8, padding: 0, height: 2 }}>
            <div
              className={styles.sliderFill}
              style={{ width: `${(exportFrame / exportFrameCount) * 100}%`, top: 0 }}
            />
          </div>
        </>
      ) : (
        <>
          <button
            className="rb-btn rb-btn--primary rb-btn--block"
            onClick={handleExportClick}
            disabled={!font}
          >
            {font ? "Exportar sequência" : "carregando traço ···"}
          </button>
          {exportState === "error" && (
            <p className={styles.errorNote}>
              o render falhou. tente menos fps, uma duração menor ou 720p.
            </p>
          )}
          <p className={styles.exportNote}>
            {format === "mp4" ? (
              <>
                MP4 H.264, {exportFrameCount} quadros a {exportFps}fps, sempre com{" "}
                <strong style={{ color: "var(--text-2)", fontWeight: 500 }}>fundo preto</strong> —
                H.264 não tem transparência. No DaVinci/Premiere, ponha o clipe por cima e use o
                modo de composição <strong style={{ color: "var(--text-2)", fontWeight: 500 }}>Screen</strong>{" "}
                (ou Add): o preto some e sobra só o traço.
              </>
            ) : (
              <>ZIP com {exportFrameCount} PNGs transparentes a {exportFps}fps.</>
            )}
          </p>
        </>
      )}
    </div>
  );

  return (
    <div className="theme-fdl">
      <div className={styles.rabiscando}>
        <div className={styles.topbar}>
          <Link className={styles.wordmark} href="/">
            <span className="path">euhenriq.com /</span> rabiscando
          </Link>
          <Conta />
        </div>

        <div className={styles.main}>
          <div className={styles.canvasCol}>
            <div
              className={styles.canvasStage}
              style={
                background === "solid"
                  ? { backgroundImage: "none", backgroundColor: bgColor }
                  : undefined
              }
            >
              <ScribbleCanvas
                fontId={fontId}
                text={displayText}
                tremor={tremor}
                boilFps={boilFps}
                paused={!playing}
                thickness={thickness}
                color={color}
                letterSpacing={letterSpacing}
                lineHeight={lineHeight}
              />
              {/* O palco declara o que vai sair. Custa 14px de altura e mata a
                  exportação errada — resolução ou fps trocados só aparecem
                  hoje depois do render inteiro. */}
              <p className={styles.saida}>
                {RESOLUTION_LABELS[resolution]} · {exportFps}fps ·{" "}
                {format === "png" ? "alfa" : "H.264"}
              </p>
            </div>
            <div className={styles.transport}>
              <button className="rb-btn rb-btn--icon" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "pausar" : "reproduzir"}>
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="2.5" width="3.4" height="11" fill="var(--accent)" />
                    <rect x="9.6" y="2.5" width="3.4" height="11" fill="var(--accent)" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 2.5v11l9-5.5-9-5.5z" fill="var(--accent)" />
                  </svg>
                )}
              </button>
              <div className={styles.transportTrack}>
                <div className={styles.transportFill} style={{ width: `${progress}%` }} />
              </div>
              <div className={styles.transportTime}>
                {(Number(durationSeconds) * (progress / 100)).toFixed(1)}s / {durationSeconds}s
              </div>
              <button className="rb-btn rb-btn--icon" onClick={() => setLoop((v) => !v)} aria-label="loop" aria-pressed={loop}>
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
              <textarea
              className={styles.textArea}
              placeholder={DEMO_TEXT}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={160}
              rows={2}
            />
            </div>
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Fonte de traço</p>
              <div className={styles.selectRow}>
                {/* O nome da fonte escolhida aparece NA fonte escolhida — ela
                    já está baixada. As opções fechadas seguem na fonte do
                    sistema: escrever as doze na própria letra custaria baixar
                    as doze, 1,6 MB, para desenhar um menu. */}
                <select
                  className={styles.select}
                  value={fontId}
                  onChange={(e) => setFontId(e.target.value)}
                  aria-label="Fonte de traço"
                  style={{ fontFamily: `${cssFamily(fontId)}, var(--font-ui)`, fontSize: 16 }}
                >
                  {SCRIBBLE_FONTS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <span className={styles.chevron}>⌄</span>
              </div>
              <p className={styles.exportNote} style={{ marginTop: 8 }}>
                {fontById(fontId).nota} · {fontById(fontId).licenca}
              </p>
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
            <textarea
              className={styles.textArea}
              placeholder={DEMO_TEXT}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={160}
              rows={2}
            />
          </div>

          <div className="rb-toggle rb-toggle--scroll" role="group" aria-label="Fonte">
            {SCRIBBLE_FONTS.map((f) => (
              <button
                key={f.id}
                className="rb-toggle__opt"
                aria-pressed={fontId === f.id}
                onClick={() => setFontId(f.id)}
              >
                {f.name}
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

      </div>
    </div>
  );
}
