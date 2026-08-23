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
  /** Linha a que a letra pertence (0-based). */
  line: number;
}

export interface ScribbleResult {
  glyphs: GlyphInstance[];
  viewBox: string;
  /** Dimensões da caixa em unidades do viewBox — usadas no export. */
  width: number;
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

export interface ScribbleOptions {
  /** Avanço extra entre letras, como fração do corpo da fonte (-0.05 a 0.4). */
  letterSpacing?: number;
  /** Distância entre linhas, múltiplo do corpo (0.7 a 2.2). */
  lineHeight?: number;
  /** Índice do quadro do tremor. */
  frame?: number;
}

interface Placed {
  char: string;
  advance: number;
  glyph: ReturnType<Font["charToGlyph"]>;
}

/** Mede uma linha sem desenhar — necessário para centralizar. */
function measureLine(font: Font, line: string, extra: number): { items: Placed[]; width: number } {
  let width = 0;
  const items = Array.from(line).map((char) => {
    const glyph = font.charToGlyph(char);
    const advance = ((glyph.advanceWidth ?? 0) / font.unitsPerEm) * FONT_SIZE + extra;
    width += advance;
    return { char, advance, glyph };
  });
  return { items, width: Math.max(0, width - extra) };
}

/**
 * Monta o texto inteiro. `tremor` vai de 0 (fonte original, limpa) a 100.
 * Quebras de linha em `text` viram linhas de verdade, centralizadas entre si.
 *
 * `frame` gera uma versão alternativa da MESMA palavra: ciclar entre alguns
 * quadros a ~8-12fps produz o "boil" da animação desenhada à mão — é o que
 * faz a letra parecer que está tremendo, e não apenas torta.
 */
export function buildScribble(
  font: Font,
  text: string,
  tremor: number,
  options: ScribbleOptions = {},
): ScribbleResult {
  const { letterSpacing = 0, lineHeight = 1.15, frame = 0 } = options;
  const amp = Math.max(0, Math.min(100, tremor)) / 100;
  const extra = letterSpacing * FONT_SIZE;
  const lineStep = lineHeight * FONT_SIZE;

  const rawLines = text.split("\n");
  const measured = rawLines.map((l) => measureLine(font, l, extra));
  const maxWidth = Math.max(...measured.map((m) => m.width), 1);

  const glyphs: GlyphInstance[] = [];
  let index = 0;

  measured.forEach((line, lineIdx) => {
    const baselineY = lineIdx * lineStep;
    // Centraliza cada linha em relação à mais larga.
    let cursorX = (maxWidth - line.width) / 2;

    line.items.forEach((item) => {
      if (item.char.trim() !== "") {
        const path = item.glyph.getPath(cursorX, baselineY, FONT_SIZE);
        // A semente combina caractere, posição e quadro: o mesmo "a" em
        // posições diferentes ganha formas diferentes, e cada quadro redesenha
        // a letra de outro jeito (é daí que vem o tremor). Determinística —
        // não pisca a cada keystroke.
        const seed = item.char.codePointAt(0)! * 31 + index * 97 + lineIdx * 383 + frame * 7919;
        glyphs.push({
          d: perturbToPathData(path, amp, seed, cursorX + item.advance / 2, baselineY),
          char: item.char,
          index,
          line: lineIdx,
        });
      }
      cursorX += item.advance;
      index += 1;
    });
  });

  // A caixa é generosa de propósito: o warp e a rotação empurram o traço
  // para fora das métricas nominais da fonte.
  const ascent = (font.ascender / font.unitsPerEm) * FONT_SIZE;
  const descent = (font.descender / font.unitsPerEm) * FONT_SIZE;
  const lastBaseline = (rawLines.length - 1) * lineStep;
  const minY = -ascent - PADDING;
  const maxY = lastBaseline - descent + PADDING;

  return {
    glyphs,
    viewBox: `${-PADDING} ${minY} ${maxWidth + PADDING * 2} ${maxY - minY}`,
    width: maxWidth + PADDING * 2,
    height: maxY - minY,
  };
}
