import type { ExportParams } from "./export";
import type { ScribbleResult } from "./scribble";

// O lápis que acompanha a varredura.
//
// A geometria vive aqui, e não no componente, porque o preview desenha em SVG
// e o export desenha em canvas — dois caminhos de código que precisam produzir
// exatamente a mesma forma. Duplicar os pontos seria garantir que um dia eles
// divergissem, e a divergência só apareceria no arquivo final.

/**
 * Silhueta do lápis, em unidades do corpo da fonte (200 = altura de uma
 * letra). A ponta é a origem (0,0) e o corpo sobe para a direita, no ângulo
 * de quem escreve com a mão direita.
 */
export const LAPIS: [number, number][] = [
  [0, 0], // ponta, onde o traço nasce
  [9, -14],
  [19, -9],
  [10, 5],
];

/** Corpo do lápis, atrás da ponta. */
export const LAPIS_CORPO: [number, number][] = [
  [9, -14],
  [19, -9],
  [55, -47],
  [45, -52],
];

/**
 * Onde a ponta do lápis está no quadro `i`, em unidades do viewBox.
 * Devolve null quando não há escrita acontecendo — antes do início, depois do
 * fim, ou com a revelação desligada. O lápis some quando a palavra acaba: ele
 * é a mão escrevendo, e mão parada em cena vira adereço.
 */
export function pontaDoLapis(
  frame: ScribbleResult,
  p: ExportParams,
  i: number,
): { x: number; y: number } | null {
  if (!p.revelarMs || p.revelarMs <= 0 || p.modoRevelacao !== "varredura") return null;

  const decorridoMs = (i / p.exportFps) * 1000;

  for (const g of frame.glyphs) {
    const inicio = g.index * p.revelarMs;
    const progresso = (decorridoMs - inicio) / p.revelarMs;
    // A letra que está sendo escrita AGORA — só uma existe por vez.
    if (progresso >= 0 && progresso < 1) {
      // Na linha de base, não no pé da faixa: a faixa é generosa para o
      // recorte não cortar a letra, e usar o pé dela solta o lápis do traço.
      return { x: g.x + g.avanco * progresso, y: g.yLinha };
    }
  }

  return null;
}
