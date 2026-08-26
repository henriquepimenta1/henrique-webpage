import type { Font } from "opentype.js";

// Linha de centro de um glifo — o caminho que a caneta percorreu.
//
// Fonte comum guarda o CONTORNO da letra, não o traço. Para desenhar a letra
// sendo escrita é preciso o miolo: rasteriza o glifo, afina até sobrar um
// pixel de espessura, e converte o que sobrou em polilinhas.
//
// Roda uma vez por letra e fica em cache. Só no navegador: depende de canvas,
// e quem chamar no servidor recebe null e desenha o contorno como antes.

/** Resolução da rasterização. 110 dá detalhe suficiente num corpo de letra
 *  e mantém a afinação em poucos milissegundos. */
const RES = 110;
const MARGEM = 6;

export type Polilinha = { x: number; y: number }[];

const cache = new Map<string, Polilinha[] | null>();

/** Vizinhos em sentido horário, começando no norte. */
const VIZINHOS = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
] as const;

function transicoes(p: number[]): number {
  let n = 0;
  for (let i = 0; i < 8; i++) if (p[i] === 0 && p[(i + 1) % 8] === 1) n++;
  return n;
}

/**
 * Zhang-Suen: remove pixels da borda em duas passadas até o desenho ficar com
 * um pixel de espessura, sem quebrar a conectividade nem encurtar as pontas.
 */
function afinar(bits: Uint8Array, w: number, h: number): void {
  const idx = (x: number, y: number) => y * w + x;
  let mudou = true;

  while (mudou) {
    mudou = false;
    for (const passada of [0, 1]) {
      const remover: number[] = [];
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          if (bits[idx(x, y)] !== 1) continue;
          const p = VIZINHOS.map(([dx, dy]) => bits[idx(x + dx, y + dy)]);
          const vizinhos = p.reduce((a, b) => a + b, 0);
          if (vizinhos < 2 || vizinhos > 6) continue;
          if (transicoes(p) !== 1) continue;
          // p[0]=N p[2]=L p[4]=S p[6]=O
          const a = passada === 0 ? p[0] * p[2] * p[4] : p[0] * p[2] * p[6];
          const b = passada === 0 ? p[2] * p[4] * p[6] : p[0] * p[4] * p[6];
          if (a === 0 && b === 0) remover.push(idx(x, y));
        }
      }
      if (remover.length) {
        for (const i of remover) bits[i] = 0;
        mudou = true;
      }
    }
  }
}

/** Segue o esqueleto a partir das pontas, produzindo traços contínuos. */
function traçar(bits: Uint8Array, w: number, h: number): Polilinha[] {
  const idx = (x: number, y: number) => y * w + x;
  const vizinhosDe = (x: number, y: number) =>
    VIZINHOS.map(([dx, dy]) => [x + dx, y + dy] as const).filter(
      ([vx, vy]) => vx >= 0 && vy >= 0 && vx < w && vy < h && bits[idx(vx, vy)] === 1,
    );

  const restante = new Uint8Array(bits);
  const linhas: Polilinha[] = [];

  const caminhar = (x0: number, y0: number) => {
    const linha: Polilinha = [];
    let x = x0;
    let y = y0;
    for (;;) {
      linha.push({ x, y });
      restante[idx(x, y)] = 0;
      const proximo = VIZINHOS.map(([dx, dy]) => [x + dx, y + dy] as const).find(
        ([vx, vy]) => vx >= 0 && vy >= 0 && vx < w && vy < h && restante[idx(vx, vy)] === 1,
      );
      if (!proximo) break;
      [x, y] = proximo;
    }
    if (linha.length > 2) linhas.push(linha);
  };

  // Primeiro as pontas: um traço que começa numa ponta sai inteiro e na
  // ordem certa. Começar no meio partiria a letra em dois pedaços.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (restante[idx(x, y)] === 1 && vizinhosDe(x, y).length === 1) caminhar(x, y);
    }
  }
  // O que sobrou é fechado — um "o", por exemplo. Começa em qualquer ponto.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (restante[idx(x, y)] === 1) caminhar(x, y);
    }
  }

  return linhas;
}

/** Tira os degraus de um pixel que a rasterização deixa. */
function suavizar(linha: Polilinha): Polilinha {
  if (linha.length < 5) return linha;
  const saida: Polilinha = [linha[0]];
  for (let i = 1; i < linha.length - 1; i++) {
    const a = linha[i - 1];
    const b = linha[i];
    const c = linha[i + 1];
    saida.push({ x: (a.x + 2 * b.x + c.x) / 4, y: (a.y + 2 * b.y + c.y) / 4 });
  }
  saida.push(linha[linha.length - 1]);
  // Um ponto a cada dois: a polilinha vem com um ponto por pixel, e metade
  // deles não muda a forma.
  return saida.filter((_, i) => i % 2 === 0 || i === saida.length - 1);
}

/**
 * Devolve os traços da letra em unidades da fonte, com a linha de base em 0 e
 * o começo em x=0 — o mesmo sistema do `getPath` do opentype.
 */
export function esqueletoDoGlifo(
  chaveFonte: string,
  font: Font,
  char: string,
  corpo: number,
): Polilinha[] | null {
  const chave = `${chaveFonte}:${char}:${corpo}`;
  const pronto = cache.get(chave);
  if (pronto !== undefined) return pronto;

  if (typeof document === "undefined") return null;

  const glifo = font.charToGlyph(char);
  if (!glifo || glifo.index === 0) {
    cache.set(chave, null);
    return null;
  }

  const escalaBmp = RES / corpo;
  const caminho = glifo.getPath(0, 0, corpo);
  const bbox = caminho.getBoundingBox();
  const largura = Math.ceil((bbox.x2 - bbox.x1) * escalaBmp) + MARGEM * 2;
  const altura = Math.ceil((bbox.y2 - bbox.y1) * escalaBmp) + MARGEM * 2;
  if (largura < 3 || altura < 3 || largura > 800 || altura > 800) {
    cache.set(chave, null);
    return null;
  }

  const cv = document.createElement("canvas");
  cv.width = largura;
  cv.height = altura;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.fillStyle = "#000";
  ctx.setTransform(escalaBmp, 0, 0, escalaBmp, MARGEM - bbox.x1 * escalaBmp, MARGEM - bbox.y1 * escalaBmp);
  ctx.fill(new Path2D(caminho.toPathData(2)));

  const px = ctx.getImageData(0, 0, largura, altura).data;
  const bits = new Uint8Array(largura * altura);
  // Alfa acima da metade conta como tinta: a borda suavizada não deve
  // engrossar o esqueleto.
  for (let i = 0; i < bits.length; i++) bits[i] = px[i * 4 + 3] > 127 ? 1 : 0;

  afinar(bits, largura, altura);

  const linhas = traçar(bits, largura, altura)
    .map(suavizar)
    // De volta às unidades da fonte.
    .map((l) =>
      l.map((pt) => ({
        x: (pt.x - MARGEM) / escalaBmp + bbox.x1,
        y: (pt.y - MARGEM) / escalaBmp + bbox.y1,
      })),
    )
    // Da esquerda para a direita: é a ordem em que se escreve, e nenhum
    // algoritmo de esqueleto sabe disso sozinho.
    .sort((a, b) => Math.min(...a.map((p) => p.x)) - Math.min(...b.map((p) => p.x)));

  const resultado = linhas.length ? linhas : null;
  cache.set(chave, resultado);
  return resultado;
}
