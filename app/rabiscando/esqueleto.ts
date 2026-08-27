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

/**
 * Farpa de vértice: comprimento máximo em pixels da rasterização, e o quanto
 * ela pode medir em relação aos ramos vizinhos.
 *
 * No fundo do "v" de algumas fontes os dois braços se encontram numa base
 * cega: o entalhe interno para bem acima da borda de baixo, e o que sobra é
 * uma cunha maciça de tinta. A linha de centro de uma cunha é uma espinha
 * vertical — o esqueleto do "v" sai em forma de "y", correto quanto à tinta e
 * errado quanto ao caminho da caneta.
 *
 * As duas medidas juntas separam a farpa de um traço curto legítimo: na
 * Covered By Your Grace a espinha tem 8 pixels contra braços de 30.
 */
const FARPA_MAX = Math.round(RES * 0.25);
const FARPA_FRACAO = 0.4;

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

/**
 * Os vizinhos acesos de um pixel formam um bloco só?
 *
 * Se formam, o pixel do meio não sustenta nada: tudo que passa por ele já se
 * encosta por fora, e apagá-lo não parte o traço. Se formam dois ou três
 * blocos, ele É o cruzamento e tem que ficar.
 *
 * A contagem de transições do Zhang-Suen não serve para isto porque ela lê a
 * ordem circular: um vizinho a leste e outro ao sul aparecem separados por um
 * zero, mas os dois pixels se tocam na diagonal. A vizinhança tem no máximo
 * oito pixels, então aqui se mede a adjacência de verdade.
 */
function umSoBloco(p: number[]): boolean {
  const acesos = VIZINHOS.filter((_, i) => p[i] === 1);
  if (acesos.length === 0) return false;

  const vistos = [acesos[0]];
  for (let i = 0; i < vistos.length; i++) {
    const [ax, ay] = vistos[i];
    for (const v of acesos) {
      if (vistos.includes(v)) continue;
      if (Math.abs(ax - v[0]) <= 1 && Math.abs(ay - v[1]) <= 1) vistos.push(v);
    }
  }
  return vistos.length === acesos.length;
}

/**
 * Tira os degraus que a afinação deixa nas diagonais.
 *
 * Zhang-Suen entrega uma linha de um pixel, mas numa diagonal ela sai em
 * escada e o pixel do canto fica com TRÊS vizinhos. Quem lê o esqueleto como
 * grafo não distingue isso de uma bifurcação: o "v" chegava a ter dezenove
 * falsos cruzamentos, e qualquer decisão tomada ali caía em cima do ruído em
 * vez da forma da letra. Depois desta passada sobram três — o cruzamento de
 * verdade — e os ramos passam a ser mensuráveis.
 */
function limparEscadas(bits: Uint8Array, w: number, h: number): void {
  const idx = (x: number, y: number) => y * w + x;
  let mudou = true;

  while (mudou) {
    mudou = false;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        if (bits[idx(x, y)] !== 1) continue;
        const p = VIZINHOS.map(([dx, dy]) => bits[idx(x + dx, y + dy)]);
        // Menos de três vizinhos é linha simples, não degrau.
        if (p.reduce((a, b) => a + b, 0) < 3) continue;
        if (!umSoBloco(p)) continue;
        bits[idx(x, y)] = 0;
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

  // --- farpas de vértice ---------------------------------------------------
  //
  // Com o grafo limpo dá para medir os ramos e reconhecer a espinha da cunha:
  // ela sai de um cruzamento de três, morre numa ponta solta, e é muito mais
  // curta que os dois braços.
  //
  // A farpa não pode ser apagada — a ponta dela é o fundo real da letra, e
  // cortá-la deixaria o "v" raso. O que se faz é liberá-la para os DOIS
  // braços: cada um desce por ela até a ponta, que é por onde a caneta
  // passaria. É a única parte do esqueleto percorrida duas vezes.
  const reutilizavel = new Uint8Array(w * h);
  const naoSemear = new Uint8Array(w * h);

  const grauDe = (i: number) => vizinhosDe(i % w, Math.floor(i / w)).length;

  // Ramos: as sequências de pixels de passagem entre dois pontos de grau ≠ 2.
  interface Ramo {
    pixels: number[];
    pontas: number[];
  }
  const ramos: Ramo[] = [];
  const emRamo = new Uint8Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const inicio = idx(x, y);
      if (bits[inicio] !== 1 || emRamo[inicio] || grauDe(inicio) !== 2) continue;

      const pixels = [inicio];
      emRamo[inicio] = 1;
      const pontas: number[] = [];

      // Dos dois lados do pixel de partida até esbarrar num nó.
      for (const partida of vizinhosDe(x, y)) {
        let [px, py] = partida;
        let anterior = inicio;
        for (;;) {
          const i = idx(px, py);
          if (grauDe(i) !== 2) {
            pontas.push(i);
            break;
          }
          pixels.push(i);
          emRamo[i] = 1;
          const seg = vizinhosDe(px, py).filter(([vx, vy]) => idx(vx, vy) !== anterior);
          if (seg.length !== 1) break;
          anterior = i;
          [px, py] = seg[0];
        }
      }
      ramos.push({ pixels, pontas });
    }
  }

  // Um cruzamento pode ocupar mais de um pixel. Os ramos que encostam em
  // pixels vizinhos entre si são ramos do MESMO cruzamento.
  const mesmoNo = (a: number, b: number) =>
    Math.abs((a % w) - (b % w)) <= 1 && Math.abs(Math.floor(a / w) - Math.floor(b / w)) <= 1;

  for (const ramo of ramos) {
    for (const ponta of ramo.pontas) {
      const vizinhança = ramos.filter(
        (outro) => outro !== ramo && outro.pontas.some((o) => mesmoNo(o, ponta)),
      );
      // Cunha é encontro de três: a farpa e os dois braços.
      if (vizinhança.length !== 2) continue;
      // A farpa morre numa ponta solta do outro lado.
      const solta = ramo.pontas.find((o) => o !== ponta && grauDe(o) === 1);
      if (solta === undefined) continue;

      const meu = ramo.pixels.length;
      const menorVizinho = Math.min(...vizinhança.map((o) => o.pixels.length));
      if (meu > FARPA_MAX || meu > menorVizinho * FARPA_FRACAO) continue;

      for (const i of ramo.pixels) reutilizavel[i] = 1;
      reutilizavel[ponta] = 1;
      naoSemear[solta] = 1;
    }
  }

  const caminhar = (x0: number, y0: number) => {
    const linha: Polilinha = [];
    // Um pixel por passada: a farpa fica de pé, e sem isto a caneta poderia
    // dar meia-volta e andar em círculo dentro dela.
    const jaAqui = new Set<number>();
    let x = x0;
    let y = y0;
    // Direção do último passo. Numa junção, seguir reto é o que mantém o
    // traço inteiro: escolher o primeiro vizinho da lista faz a caneta virar
    // à toa, partir a letra ali e deixar o resto como cacos soltos.
    let dirX = 0;
    let dirY = 0;

    for (;;) {
      linha.push({ x, y });
      jaAqui.add(idx(x, y));
      // A farpa continua disponível para o braço seguinte passar por ela.
      if (!reutilizavel[idx(x, y)]) restante[idx(x, y)] = 0;

      const candidatos = VIZINHOS.map(([dx, dy]) => [x + dx, y + dy, dx, dy] as const).filter(
        ([vx, vy]) =>
          vx >= 0 &&
          vy >= 0 &&
          vx < w &&
          vy < h &&
          restante[idx(vx, vy)] === 1 &&
          !jaAqui.has(idx(vx, vy)),
      );
      if (candidatos.length === 0) break;

      const proximo =
        dirX === 0 && dirY === 0
          ? candidatos[0]
          : candidatos.reduce((melhor, c) =>
              // Produto escalar: quanto maior, mais o passo continua a
              // direção que a caneta já vinha seguindo.
              c[2] * dirX + c[3] * dirY > melhor[2] * dirX + melhor[3] * dirY ? c : melhor,
            );

      dirX = proximo[2];
      dirY = proximo[3];
      x = proximo[0];
      y = proximo[1];
    }

    // Dois pontos já são um traço. O corte anterior, em três, jogava fora os
    // pedaços curtos que sobram das junções — e eram partes da letra.
    if (linha.length >= 2) linhas.push(linha);
  };

  // Primeiro as pontas: um traço que começa numa ponta sai inteiro e na
  // ordem certa. Começar no meio partiria a letra em dois pedaços.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (naoSemear[idx(x, y)]) continue;
      if (restante[idx(x, y)] === 1 && vizinhosDe(x, y).length === 1) caminhar(x, y);
    }
  }
  // O que sobrou é fechado — um "o", por exemplo. Começa em qualquer ponto.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (restante[idx(x, y)] === 1 && !reutilizavel[idx(x, y)]) caminhar(x, y);
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
  limparEscadas(bits, largura, altura);

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
