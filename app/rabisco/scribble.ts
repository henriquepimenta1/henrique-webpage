// Núcleo do Rabisco: transforma texto em paths vetoriais perturbados.
//
// A variação de forma NÃO vem de glifos alternativos pré-desenhados na fonte
// (isso limitaria a 2-3 formas fixas por letra e deixaria o slider de tremor
// sem função). Vem de deformar os pontos de controle das curvas Bézier a cada
// ocorrência da letra — assim a amplitude é controlável ao vivo e o número de
// variações é ilimitado.

import type { Font, Path } from "opentype.js";

/** Comando de path no formato que a opentype.js produz. */
export interface PathCommand {
  type: "M" | "L" | "C" | "Q" | "Z";
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

export interface GlyphInstance {
  /** `d` do <path> já perturbado e posicionado. */
  d: string;
  /** Caractere de origem — usado como key estável no React. */
  char: string;
  /** Ordem de escrita, para revelar letra a letra. */
  index: number;
}

export interface ScribbleResult {
  glyphs: GlyphInstance[];
  viewBox: string;
  /** Altura da caixa em unidades do viewBox — usado para escalar o stroke. */
  height: number;
}

/**
 * Ruído coerente barato: pontos próximos recebem deslocamento parecido, o que
 * lê como "mão trêmula". Ruído independente por ponto leria como serrilhado.
 */
function warp(x: number, y: number, seed: number, freq: number): number {
  return (
    Math.sin(x * freq + seed * 1.7) * 0.6 +
    Math.sin(y * freq * 1.3 + seed * 2.9) * 0.4 +
    Math.sin((x + y) * freq * 0.5 + seed * 4.1) * 0.3
  );
}

/** PRNG determinístico — mesma saída no servidor e no cliente. */
function seeded(n: number): number {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}

const MAX_WARP_PX = 7;
const MAX_ROTATE_DEG = 5;
const MAX_BASELINE_PX = 6;

/** Aplica o campo de deformação a um único ponto. */
function warpPoint(x: number, y: number, amp: number, seed: number): [number, number] {
  if (amp === 0) return [x, y];
  const scale = amp * MAX_WARP_PX;
  const dx = warp(x, y, seed, 0.045) * scale;
  const dy = warp(y, x, seed + 13.3, 0.045) * scale;
  return [x + dx, y + dy];
}

/**
 * Deforma um path da opentype.js e devolve o atributo `d`.
 * A rotação/deslocamento rígido por letra é o que o olho mais lê como
 * "escrito à mão" — o warp sozinho parece borracha derretida.
 */
function perturbToPathData(
  path: Path,
  amp: number,
  seed: number,
  pivotX: number,
  baselineY: number,
): string {
  const rot = ((seeded(seed) * 2 - 1) * MAX_ROTATE_DEG * amp * Math.PI) / 180;
  const dyBase = (seeded(seed + 5) * 2 - 1) * MAX_BASELINE_PX * amp;
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);

  const rigid = (x: number, y: number): [number, number] => {
    const ox = x - pivotX;
    const oy = y - baselineY;
    return [pivotX + ox * cos - oy * sin, baselineY + ox * sin + oy * cos + dyBase];
  };

  const at = (x: number, y: number): string => {
    const [wx, wy] = warpPoint(x, y, amp, seed);
    const [rx, ry] = rigid(wx, wy);
    return `${rx.toFixed(2)} ${ry.toFixed(2)}`;
  };

  const out: string[] = [];
  for (const raw of path.commands as PathCommand[]) {
    switch (raw.type) {
      case "M":
        out.push(`M${at(raw.x!, raw.y!)}`);
        break;
      case "L":
        out.push(`L${at(raw.x!, raw.y!)}`);
        break;
      case "C":
        out.push(`C${at(raw.x1!, raw.y1!)} ${at(raw.x2!, raw.y2!)} ${at(raw.x!, raw.y!)}`);
        break;
      case "Q":
        out.push(`Q${at(raw.x1!, raw.y1!)} ${at(raw.x!, raw.y!)}`);
        break;
      case "Z":
        out.push("Z");
        break;
    }
  }
  return out.join(" ");
}

const FONT_SIZE = 200;
const PADDING = 40;

/**
 * Monta o texto inteiro. `tremor` vai de 0 (fonte original, limpa) a 100.
 * `spacing` é o ajuste extra de avanço entre letras, em unidades do viewBox.
 *
 * `frame` gera uma versão alternativa da MESMA palavra: ciclar entre alguns
 * quadros a ~8-12fps produz o "boil" da animação desenhada à mão — é o que
 * faz a letra parecer que está tremendo, e não apenas torta.
 */
export function buildScribble(
  font: Font,
  text: string,
  tremor: number,
  spacing = 0,
  frame = 0,
): ScribbleResult {
  const amp = Math.max(0, Math.min(100, tremor)) / 100;
  const glyphs: GlyphInstance[] = [];
  const baselineY = 0;
  let cursorX = 0;

  const chars = Array.from(text);
  chars.forEach((char, i) => {
    const glyph = font.charToGlyph(char);
    const advance = ((glyph.advanceWidth ?? 0) / font.unitsPerEm) * FONT_SIZE;

    if (char.trim() !== "") {
      const path = glyph.getPath(cursorX, baselineY, FONT_SIZE);
      // A semente combina caractere, posição e quadro: o mesmo "a" em
      // posições diferentes ganha formas diferentes, e cada quadro redesenha
      // a letra de outro jeito (é daí que vem o tremor). Determinística —
      // não pisca a cada keystroke.
      const seed = char.codePointAt(0)! * 31 + i * 97 + frame * 7919;
      glyphs.push({
        d: perturbToPathData(path, amp, seed, cursorX + advance / 2, baselineY),
        char,
        index: i,
      });
    }

    cursorX += advance + spacing;
  });

  // A caixa é generosa de propósito: o warp e a rotação empurram o traço
  // para fora das métricas nominais da fonte.
  const ascent = (font.ascender / font.unitsPerEm) * FONT_SIZE;
  const descent = (font.descender / font.unitsPerEm) * FONT_SIZE;
  const minY = baselineY - ascent - PADDING;
  const height = ascent - descent + PADDING * 2;
  const width = Math.max(cursorX, 1) + PADDING * 2;

  return {
    glyphs,
    viewBox: `${-PADDING} ${minY} ${width} ${height}`,
    height,
  };
}
