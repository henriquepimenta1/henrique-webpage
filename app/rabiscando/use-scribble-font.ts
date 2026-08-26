"use client";

import { useEffect, useState } from "react";
import type { Font } from "opentype.js";
import { DEFAULT_FONT_ID, fontById, cssFamily } from "./fonts";

export type FontState = "loading" | "ready" | "error";

// Cache por fonte: cada uma é baixada e parseada uma única vez, e o preview
// e o export compartilham a mesma instância. Trocar de fonte e voltar não
// baixa de novo.
const cache = new Map<string, Promise<Font>>();

function loadFont(id: string): Promise<Font> {
  const existing = cache.get(id);
  if (existing) return existing;

  const promise = (async () => {
    const [opentype, res] = await Promise.all([
      import("opentype.js"),
      fetch(fontById(id).file),
    ]);
    if (!res.ok) throw new Error(`font ${res.status}`);
    const bytes = await res.arrayBuffer();
    // Os MESMOS bytes viram também uma fonte do CSS: assim a interface pode
    // escrever com o traço escolhido — o seletor de espessura mostra "fina/
    // regular/grossa" na própria letra — sem um segundo download. Falhar aqui
    // não pode derrubar o preview, que é o que realmente importa.
    registrarNoCss(id, bytes).catch(() => {});
    return opentype.parse(bytes);
  })().catch((err) => {
    cache.delete(id); // permite nova tentativa depois de uma falha de rede
    throw err;
  });

  cache.set(id, promise);
  return promise;
}

const registradas = new Set<string>();

async function registrarNoCss(id: string, bytes: ArrayBuffer): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  const familia = cssFamily(id);
  if (registradas.has(familia)) return;
  registradas.add(familia);
  const face = new FontFace(familia, bytes);
  await face.load();
  document.fonts.add(face);
}

export function useScribbleFont(id: string = DEFAULT_FONT_ID): {
  font: Font | null;
  state: FontState;
} {
  // Guarda a fonte JUNTO do id que a originou. Assim o estado é derivado da
  // comparação com o id pedido, em vez de ser sincronizado à mão dentro do
  // efeito — e a fonte anterior continua na tela enquanto a nova baixa, sem
  // o canvas piscar em branco a cada troca.
  const [loaded, setLoaded] = useState<{ id: string; font: Font } | null>(null);
  const [failedId, setFailedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadFont(id).then(
      (font) => {
        if (!cancelled) setLoaded({ id, font });
      },
      () => {
        if (!cancelled) setFailedId(id);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [id]);

  const state: FontState =
    failedId === id ? "error" : loaded?.id === id ? "ready" : "loading";

  return { font: loaded?.font ?? null, state };
}
