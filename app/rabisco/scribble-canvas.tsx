"use client";

import { useMemo } from "react";
import { buildScribble } from "./scribble";
import { useScribbleFont } from "./use-scribble-font";
import styles from "./rabisco.module.css";

/**
 * Três quadros é o padrão da animação desenhada à mão ("boil" / animação em
 * três). Dois lê como piscada, quatro ou mais já vira ruído.
 */
const BOIL_FRAMES = 3;


interface ScribbleCanvasProps {
  /** Id da fonte no registro (ver fonts.ts). */
  fontId: string;
  text: string;
  /** 0–100 — amplitude da deformação por letra. */
  tremor: number;
  /** Quadros por segundo do tremor. */
  boilFps: number;
  /** Congela o tremor no quadro atual sem perder a fase. */
  paused?: boolean;
  thickness: "fina" | "regular" | "grossa";
  color: string;
  /** Avanço extra entre letras, fração do corpo (-0.05 a 0.4). */
  letterSpacing?: number;
  /** Distância entre linhas, múltiplo do corpo (0.7 a 2.2). */
  lineHeight?: number;
}

const STROKE_BY_THICKNESS: Record<ScribbleCanvasProps["thickness"], number> = {
  fina: 0,
  regular: 6,
  grossa: 16,
};

export default function ScribbleCanvas({
  fontId,
  text,
  tremor,
  boilFps,
  paused = false,
  thickness,
  color,
  letterSpacing = 0,
  lineHeight = 1.15,
}: ScribbleCanvasProps) {
  const { font, state } = useScribbleFont(fontId);

  // Com tremor 0 os quadros são idênticos — não vale gerar nem animar.
  const frameCount = tremor > 0 ? BOIL_FRAMES : 1;

  const frames = useMemo(() => {
    if (!font || !text) return null;
    return Array.from({ length: frameCount }, (_, f) =>
      buildScribble(font, text, tremor, { letterSpacing, lineHeight, frame: f }),
    );
  }, [font, text, tremor, letterSpacing, lineHeight, frameCount]);

  if (state === "loading") {
    return (
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: "var(--text-3)",
        }}
      >
        carregando traço ···
      </span>
    );
  }

  if (state === "error") {
    return (
      <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "#b5533a" }}>
        traço não carregou. recarregue a página.
      </span>
    );
  }

  if (!frames) return null;

  const strokeWidth = STROKE_BY_THICKNESS[thickness];
  const fps = Math.max(1, boilFps);
  const cycle = frameCount / fps;

  return (
    <svg
      viewBox={frames[0].viewBox}
      style={{ width: "100%", height: "100%", overflow: "visible" }}
      preserveAspectRatio="xMidYMid meet"
      aria-label={text}
      role="img"
    >
      {frames.map((frame, f) => (
        <g
          key={f}
          className={frameCount > 1 ? styles.boilFrame : undefined}
          style={
            frameCount > 1
              ? {
                  // Um quadro por vez: cada grupo fica visível 1/N do ciclo,
                  // deslocado por um atraso negativo para já entrar em fase.
                  animationDuration: `${cycle}s`,
                  animationDelay: `${-(f / fps)}s`,
                  animationPlayState: paused ? "paused" : "running",
                }
              : undefined
          }
        >
          {frame.glyphs.map((g) => (
            <path
              key={`${g.char}-${g.index}`}
              d={g.d}
              fill={color}
              stroke={strokeWidth > 0 ? color : "none"}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
