"use client";

import { useEffect, useState } from "react";
import type { Font } from "opentype.js";

const FONT_URL = "/fonts/Caveat.ttf";

export type FontState = "loading" | "ready" | "error";

// Cache no módulo: o preview e o export compartilham a mesma fonte, e uma
// remontagem do componente não baixa nem reparseia de novo.
let cached: Promise<Font> | null = null;

function loadFont(): Promise<Font> {
  if (!cached) {
    cached = (async () => {
      const [opentype, res] = await Promise.all([import("opentype.js"), fetch(FONT_URL)]);
      if (!res.ok) throw new Error(`font ${res.status}`);
      return opentype.parse(await res.arrayBuffer());
    })().catch((err) => {
      cached = null; // permite nova tentativa depois de uma falha de rede
      throw err;
    });
  }
  return cached;
}

export function useScribbleFont(): { font: Font | null; state: FontState } {
  const [font, setFont] = useState<Font | null>(null);
  const [state, setState] = useState<FontState>("loading");

  useEffect(() => {
    let cancelled = false;
    loadFont().then(
      (f) => {
        if (cancelled) return;
        setFont(f);
        setState("ready");
      },
      () => {
        if (!cancelled) setState("error");
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return { font, state };
}
