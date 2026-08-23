"use client";

import { useEffect, useMemo, useState } from "react";
import type { Font } from "opentype.js";
import { buildScribble } from "./scribble";

const FONT_URL = "/fonts/Caveat.ttf";

type LoadState = "loading" | "ready" | "error";

interface ScribbleCanvasProps {
  text: string;
  /** 0–100 — amplitude da deformação por letra. */
  tremor: number;
  /** Espessura extra do traço, somada por cima do preenchimento. */
  thickness: "fina" | "regular" | "grossa";
  color: string;
  /** 0–1 — fração das letras já "escritas". */
  progress: number;
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
  thickness,
  color,
  progress,
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

  const built = useMemo(() => {
    if (!font || !text) return null;
    return buildScribble(font, text, tremor, spacing);
  }, [font, text, tremor, spacing]);

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
      <span
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 13,
          color: "#b5533a",
        }}
      >
        traço não carregou. recarregue a página.
      </span>
    );
  }

  if (!built) return null;

  const strokeWidth = STROKE_BY_THICKNESS[thickness];
  const revealed = Math.ceil(progress * built.glyphs.length);

  return (
    <svg
      viewBox={built.viewBox}
      style={{ width: "100%", height: "100%", overflow: "visible" }}
      preserveAspectRatio="xMidYMid meet"
      aria-label={text}
      role="img"
    >
      {built.glyphs.map((g) => (
        <path
          key={`${g.char}-${g.index}`}
          d={g.d}
          fill={color}
          stroke={strokeWidth > 0 ? color : "none"}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={g.index < revealed ? 1 : 0}
        />
      ))}
    </svg>
  );
}
