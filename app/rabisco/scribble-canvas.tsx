"use client";

import { useEffect, useMemo, useState } from "react";
import type { Font } from "opentype.js";
import { buildScribble } from "./scribble";
import styles from "./rabisco.module.css";

const FONT_URL = "/fonts/Caveat.ttf";

/**
 * Três quadros é o padrão da animação desenhada à mão ("boil" / animação em
 * três). Dois lê como piscada, quatro ou mais já vira ruído.
 */
const BOIL_FRAMES = 3;

type LoadState = "loading" | "ready" | "error";

interface ScribbleCanvasProps {
  text: string;
  /** 0–100 — amplitude da deformação por letra. */
  tremor: number;
  /** Quadros por segundo do tremor. */
  boilFps: number;
  /** Congela o tremor no quadro atual sem perder a fase. */
  paused?: boolean;
  thickness: "fina" | "regular" | "grossa";
  color: string;
  spacing?: number;
}

const STROKE_BY_THICKNESS: Record<ScribbleCanvasProps["thickness"], number> = {
  fina: 0,
  regular: 6,
  grossa: 16,
};

export default function ScribbleCanvas({
  text,
  tremor,
  boilFps,
  paused = false,
  thickness,
  color,
  spacing = 0,
}: ScribbleCanvasProps) {
  const [font, setFont] = useState<Font | null>(null);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [opentype, res] = await Promise.all([
          import("opentype.js"),
          fetch(FONT_URL),
        ]);
        if (!res.ok) throw new Error(`font ${res.status}`);
        const buffer = await res.arrayBuffer();
        if (cancelled) return;
        setFont(opentype.parse(buffer));
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Com tremor 0 os quadros são idênticos — não vale gerar nem animar.
  const frameCount = tremor > 0 ? BOIL_FRAMES : 1;

  const frames = useMemo(() => {
    if (!font || !text) return null;
    return Array.from({ length: frameCount }, (_, f) =>
      buildScribble(font, text, tremor, spacing, f),
    );
  }, [font, text, tremor, spacing, frameCount]);

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
