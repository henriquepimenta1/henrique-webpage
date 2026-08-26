// Geometria de um atributo `d`: comprimento e ponto ao longo dele.
//
// Existe porque o desenho progressivo precisa das duas coisas em DOIS lugares
// que não compartilham DOM: o preview (que poderia usar getTotalLength) e o
// export (que desenha em canvas, sem elemento SVG nenhum). Medir de dois
// jeitos diferentes faria o lápis do arquivo final não bater com o da tela.

const PASSOS_POR_CURVA = 12;

type Ponto = { x: number; y: number };

interface Segmento {
  pontos: Ponto[];
  comprimentos: number[];
  total: number;
}

function distancia(a: Ponto, b: Ponto): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function quadratica(p0: Ponto, c: Ponto, p1: Ponto, t: number): Ponto {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
    y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y,
  };
}

function cubica(p0: Ponto, c1: Ponto, c2: Ponto, p1: Ponto, t: number): Ponto {
  const u = 1 - t;
  return {
    x: u ** 3 * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t ** 3 * p1.x,
    y: u ** 3 * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t ** 3 * p1.y,
  };
}

/**
 * Reduz o `d` a uma polilinha. As curvas são amostradas em passos fixos: doze
 * por curva é bastante para um traço de 200 unidades, e o erro que sobra é
 * menor que a espessura da caneta.
 */
function amostrar(d: string): Segmento {
  const pontos: Ponto[] = [];
  const comprimentos: number[] = [0];
  let total = 0;
  let atual: Ponto = { x: 0, y: 0 };
  let inicioSub: Ponto = { x: 0, y: 0 };

  const empurrar = (p: Ponto) => {
    if (pontos.length > 0) {
      total += distancia(pontos[pontos.length - 1], p);
      comprimentos.push(total);
    }
    pontos.push(p);
  };

  // Aceita os comandos que o opentype.js emite: M, L, Q, C e Z.
  const tokens = d.match(/[MLQCZ][^MLQCZ]*/gi) ?? [];

  for (const token of tokens) {
    const tipo = token[0].toUpperCase();
    const n = (token.slice(1).match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map(Number);

    if (tipo === "M") {
      atual = { x: n[0], y: n[1] };
      inicioSub = atual;
      empurrar(atual);
    } else if (tipo === "L") {
      atual = { x: n[0], y: n[1] };
      empurrar(atual);
    } else if (tipo === "Q") {
      const c = { x: n[0], y: n[1] };
      const fim = { x: n[2], y: n[3] };
      for (let i = 1; i <= PASSOS_POR_CURVA; i++) {
        empurrar(quadratica(atual, c, fim, i / PASSOS_POR_CURVA));
      }
      atual = fim;
    } else if (tipo === "C") {
      const c1 = { x: n[0], y: n[1] };
      const c2 = { x: n[2], y: n[3] };
      const fim = { x: n[4], y: n[5] };
      for (let i = 1; i <= PASSOS_POR_CURVA; i++) {
        empurrar(cubica(atual, c1, c2, fim, i / PASSOS_POR_CURVA));
      }
      atual = fim;
    } else if (tipo === "Z") {
      empurrar(inicioSub);
      atual = inicioSub;
    }
  }

  return { pontos, comprimentos, total };
}

const cache = new Map<string, Segmento>();

function medido(d: string): Segmento {
  const pronto = cache.get(d);
  if (pronto) return pronto;
  const seg = amostrar(d);
  // O `d` muda a cada quadro do tremor e a cada ajuste de slider; sem teto, o
  // cache cresceria pela sessão inteira.
  if (cache.size > 600) cache.clear();
  cache.set(d, seg);
  return seg;
}

/** Comprimento total do traço, nas unidades do próprio `d`. */
export function comprimentoDoCaminho(d: string): number {
  return medido(d).total;
}

/**
 * Onde a caneta está depois de percorrer `fracao` (0 a 1) do traço.
 * Devolve null para caminho degenerado — um ponto sem extensão.
 */
export function pontoNaFracao(d: string, fracao: number): Ponto | null {
  const { pontos, comprimentos, total } = medido(d);
  if (total <= 0 || pontos.length === 0) return null;

  const alvo = Math.max(0, Math.min(1, fracao)) * total;

  // Busca binária: os comprimentos acumulados estão em ordem crescente.
  let baixo = 0;
  let alto = comprimentos.length - 1;
  while (baixo < alto - 1) {
    const meio = (baixo + alto) >> 1;
    if (comprimentos[meio] <= alvo) baixo = meio;
    else alto = meio;
  }

  const trecho = comprimentos[alto] - comprimentos[baixo];
  const t = trecho > 0 ? (alvo - comprimentos[baixo]) / trecho : 0;
  return {
    x: pontos[baixo].x + (pontos[alto].x - pontos[baixo].x) * t,
    y: pontos[baixo].y + (pontos[alto].y - pontos[baixo].y) * t,
  };
}
