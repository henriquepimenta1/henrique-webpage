"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import ScribbleCanvas from "./scribble-canvas";

// Herói da landing: alterna cartelas curtas — do tipo que um filme de
// expedição usa de verdade — trocando de fonte a cada uma. Demonstra o
// tremor e a variedade de traços ao mesmo tempo, rodando a ferramenta real.
//
// As fontes aqui são um subconjunto DELIBERADO: cada uma vira um download
// quando entra em cena, então uma landing pública não pode desfilar as 12
// (1,6 MB). Estas cinco são as mais distintas entre as mais leves, ~264 KB
// somadas, e ainda assim chegam progressivamente.

interface Cartela {
  texto: string;
  fontId: string;
  thickness: "fina" | "regular" | "grossa";
  tremor: number;
}

const CARTELAS: Cartela[] = [
  { texto: "primeira luz", fontId: "permanent-marker", thickness: "regular", tremor: 30 },
  { texto: "dia 3\nsem sinal", fontId: "architects-daughter", thickness: "regular", tremor: 42 },
  { texto: "Huayhuash", fontId: "handlee", thickness: "grossa", tremor: 26 },
  { texto: "4.800 m", fontId: "gloria-hallelujah", thickness: "regular", tremor: 38 },
  { texto: "acampamento", fontId: "shadows-into-light", thickness: "grossa", tremor: 34 },
  { texto: "a última luz\ndo dia", fontId: "permanent-marker", thickness: "fina", tremor: 22 },
  { texto: "Lençóis", fontId: "handlee", thickness: "regular", tremor: 45 },
  { texto: "só o vento", fontId: "architects-daughter", thickness: "grossa", tremor: 30 },
  { texto: "chegamos", fontId: "gloria-hallelujah", thickness: "grossa", tremor: 36 },
  { texto: "travessia\nRondônia", fontId: "shadows-into-light", thickness: "regular", tremor: 28 },
];

const INTERVALO_MS = 2800;
const CONSULTA_MOVIMENTO = "(prefers-reduced-motion: reduce)";

/**
 * `matchMedia` é um store externo — lê-lo com useSyncExternalStore em vez de
 * um useEffect+setState mantém o valor correto na hidratação e ainda reage
 * se a pessoa mudar a preferência com a página aberta.
 */
function useMenosMovimento(): boolean {
  return useSyncExternalStore(
    (aoMudar) => {
      const mq = window.matchMedia(CONSULTA_MOVIMENTO);
      mq.addEventListener("change", aoMudar);
      return () => mq.removeEventListener("change", aoMudar);
    },
    () => window.matchMedia(CONSULTA_MOVIMENTO).matches,
    () => false, // no servidor não dá para saber; assume movimento permitido
  );
}

export default function LandingHero() {
  const [i, setI] = useState(0);
  const menosMovimento = useMenosMovimento();
  const animar = !menosMovimento;

  useEffect(() => {
    // Quem pediu menos movimento vê uma cartela só, parada.
    if (menosMovimento) return;
    const id = setInterval(() => setI((v) => (v + 1) % CARTELAS.length), INTERVALO_MS);
    return () => clearInterval(id);
  }, [menosMovimento]);

  const c = CARTELAS[i];

  return (
    <>
      <div
        style={{
          height: "clamp(220px, 34vw, 360px)",
          border: "1px solid var(--border)",
          backgroundImage:
            "linear-gradient(45deg, var(--surface) 25%, transparent 25%), linear-gradient(-45deg, var(--surface) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--surface) 75%), linear-gradient(-45deg, transparent 75%, var(--surface) 75%)",
          backgroundSize: "26px 26px",
          backgroundPosition: "0 0, 0 13px, 13px -13px, -13px 0",
          backgroundColor: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          overflow: "hidden",
        }}
      >
        <ScribbleCanvas
          fontId={c.fontId}
          text={c.texto}
          tremor={c.tremor}
          boilFps={10}
          thickness={c.thickness}
          color="#C08246"
          lineHeight={1.05}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--s-2)",
          marginTop: "var(--s-2)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: ".18em",
          textTransform: "uppercase",
          color: "var(--text-3)",
        }}
      >
        <span>isto é a ferramenta rodando, não um vídeo</span>
        {animar && (
          <span aria-hidden="true" style={{ display: "flex", gap: 4 }}>
            {CARTELAS.map((_, n) => (
              <span
                key={n}
                style={{
                  width: 12,
                  height: 1,
                  background: n === i ? "var(--accent)" : "var(--border-strong)",
                  transition: "background-color .3s",
                }}
              />
            ))}
          </span>
        )}
      </div>
    </>
  );
}
