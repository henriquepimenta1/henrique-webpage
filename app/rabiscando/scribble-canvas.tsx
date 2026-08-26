"use client";

import { useMemo } from "react";
import { buildScribble } from "./scribble";
import { useScribbleFont } from "./use-scribble-font";
import styles from "./rabiscando.module.css";

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
  /** Avanço extra entre letras, fração do corpo (-0.2 a 0.4). */
  letterSpacing?: number;
  /** Distância entre linhas, múltiplo do corpo (0.7 a 2.2). */
  lineHeight?: number;
  /** Intervalo entre uma letra e a seguinte, em ms. 0 mostra tudo de uma vez. */
  revelarMs?: number;
  /** "passo" mostra a letra inteira de uma vez; "varredura" desenha da
   *  esquerda para a direita, como quem escreve. */
  modoRevelacao?: "passo" | "varredura";
  /** Muda para reiniciar a revelação — o preview em loop precisa recomeçar. */
  ciclo?: number;
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
  revelarMs = 0,
  modoRevelacao = "passo",
  ciclo = 0,
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
      // Remontar reinicia a animação de revelação. É o jeito mais simples de
      // fazê-la acompanhar o loop do preview, e custa pouco: o SVG é pequeno.
      key={revelarMs > 0 ? ciclo : undefined}
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
          {frame.glyphs.map((g) => {
            const atraso = (g.index * revelarMs) / 1000;
            const estadoAnimacao = paused ? ("paused" as const) : ("running" as const);
            const varrendo = revelarMs > 0 && modoRevelacao === "varredura";
            // Um id por quadro do tremor E por letra: os três quadros
            // coexistem no DOM, e ids repetidos fariam um mascarar o outro.
            const idMascara = `varre-${f}-${g.index}`;

            const traco = (
              <path
                d={g.d}
                fill={color}
                stroke={strokeWidth > 0 ? color : "none"}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );

            if (!varrendo) {
              return (
                <g
                  key={`${g.char}-${g.index}`}
                  className={revelarMs > 0 ? styles.revelando : undefined}
                  style={
                    revelarMs > 0
                      ? {
                          // O índice conta os espaços também: uma pausa onde há
                          // espaço é o que faz a escrita parecer escrita.
                          animationDelay: `${atraso}s`,
                          animationPlayState: estadoAnimacao,
                        }
                      : undefined
                  }
                >
                  {traco}
                </g>
              );
            }

            return (
              <g key={`${g.char}-${g.index}`}>
                <mask id={idMascara} maskUnits="userSpaceOnUse">
                  <rect
                    className={styles.varredura}
                    x={g.x}
                    y={g.yTopo}
                    width={g.avanco}
                    height={g.yBase - g.yTopo}
                    fill="#fff"
                    style={{
                      // A varredura ocupa a fatia inteira daquela letra: ela
                      // termina exatamente quando a seguinte começa, e a mão
                      // não "para" entre uma e outra.
                      animationDuration: `${revelarMs / 1000}s`,
                      animationDelay: `${atraso}s`,
                      animationPlayState: estadoAnimacao,
                    }}
                  />
                </mask>
                <g mask={`url(#${idMascara})`}>{traco}</g>
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}
