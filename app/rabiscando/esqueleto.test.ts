import { describe, expect, it } from "vitest";

import { limparEscadas, linhasDoBitmap, traçar, umSoBloco } from "./esqueleto";

// Os bitmaps vêm de desenhos em texto: '#' é tinta, qualquer outra coisa é
// vazio. Ler o caso de teste importa mais aqui do que escrevê-lo curto — o que
// se está afirmando é sobre a FORMA, e a forma tem que estar à vista.
function desenhar(linhas: string[]): { bits: Uint8Array; w: number; h: number } {
  const w = Math.max(...linhas.map((l) => l.length));
  const h = linhas.length;
  const bits = new Uint8Array(w * h);
  linhas.forEach((linha, y) => {
    [...linha].forEach((c, x) => {
      if (c === "#") bits[y * w + x] = 1;
    });
  });
  return { bits, w, h };
}

function grau(bits: Uint8Array, w: number, h: number, x: number, y: number): number {
  let n = 0;
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const vx = x + dx;
      const vy = y + dy;
      if (vx < 0 || vy < 0 || vx >= w || vy >= h) continue;
      if (bits[vy * w + vx] === 1) n++;
    }
  return n;
}

/** Todo pixel de tinta com três vizinhos ou mais. */
function nós(bits: Uint8Array, w: number, h: number): [number, number][] {
  const achados: [number, number][] = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (bits[y * w + x] === 1 && grau(bits, w, h, x, y) >= 3) achados.push([x, y]);
  return achados;
}

/**
 * Um "v" de esqueleto: dois braços longos que se encontram, e abaixo do
 * encontro a espinha da cunha — a farpa que fazia a letra sair como "y".
 * `espinha` é o comprimento dela, que é o que decide se é farpa ou traço.
 */
function vComEspinha(espinha: number): string[] {
  const braço = 12;
  const largura = braço * 2 + 1;
  const linhas: string[] = [];
  for (let y = 0; y < braço; y++) {
    const cols = Array(largura).fill(".");
    cols[y] = "#";
    cols[largura - 1 - y] = "#";
    linhas.push(cols.join(""));
  }
  for (let i = 0; i <= espinha; i++) {
    const cols = Array(largura).fill(".");
    cols[braço] = "#";
    linhas.push(cols.join(""));
  }
  return linhas;
}

/**
 * Um "v" CHEIO, como vem da fonte: dois traços grossos que convergem e se
 * fundem numa base cega — o entalhe entre eles morre acima da borda de baixo.
 * É a forma que produz a cunha de tinta, e é dela que a afinação tira tanto a
 * espinha quanto os degraus de diagonal.
 */
function vCheio(): string[] {
  const w = 34;
  const h = 30;
  const raio = 3.2;
  const braços: [number, number, number, number][] = [
    [4, 2, 17, 24],
    [29, 2, 17, 24],
  ];
  const perto = (x: number, y: number, [ax, ay, bx, by]: [number, number, number, number]) => {
    const dx = bx - ax;
    const dy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(x - (ax + t * dx), y - (ay + t * dy)) <= raio;
  };

  return Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) => (braços.some((b) => perto(x, y, b)) ? "#" : ".")).join(""),
  );
}

/**
 * Um "x" de esqueleto: quatro diagonais saindo do mesmo pixel, três longas e
 * um toco curto. O toco tem a mesma cara de uma farpa — ramo livre e curto —,
 * mas aqui o encontro é de QUATRO, não de três, e não é cunha nenhuma.
 */
function xComToco(): { linhas: string[]; toco: { x: number; y: number } } {
  const braço = 8;
  const n = braço * 2 + 1;
  const centro = braço;
  const grade = Array.from({ length: n }, () => Array(n).fill("."));
  grade[centro][centro] = "#";
  for (let i = 1; i <= braço; i++) {
    grade[centro - i][centro - i] = "#";
    grade[centro - i][centro + i] = "#";
    grade[centro + i][centro + i] = "#";
  }
  grade[centro + 1][centro - 1] = "#";
  grade[centro + 2][centro - 2] = "#";
  return {
    linhas: grade.map((l) => l.join("")),
    toco: { x: centro - 2, y: centro + 2 },
  };
}

const PONTA_DA_ESPINHA = (espinha: number) => ({ x: 12, y: 12 + espinha });

describe("umSoBloco", () => {
  // VIZINHOS anda em sentido horário a partir do norte:
  // [N, NE, L, SE, S, SO, O, NO]
  it("vê um bloco só onde a contagem de transições do Zhang-Suen erra", () => {
    // Nordeste, leste e sul. Na ordem circular o sul aparece separado por um
    // zero, mas leste (1,0) e sul (0,1) se tocam na diagonal — é um degrau de
    // rasterização, não uma bifurcação. Este é o caso real que fez a primeira
    // tentativa de limpeza não remover pixel nenhum.
    expect(umSoBloco([0, 1, 1, 0, 1, 0, 0, 0])).toBe(true);
  });

  it("vê três blocos num cruzamento de verdade", () => {
    // Norte, sudeste e sudoeste: nenhum encosta no outro.
    expect(umSoBloco([1, 0, 0, 1, 0, 1, 0, 0])).toBe(false);
  });

  it("não trata pixel solto como bloco", () => {
    expect(umSoBloco([0, 0, 0, 0, 0, 0, 0, 0])).toBe(false);
  });
});

describe("limparEscadas", () => {
  it("desfaz o degrau da diagonal sem partir o traço", () => {
    // Um bloco 2x2: todo pixel ali tem três vizinhos, e nenhum é cruzamento.
    const { bits, w, h } = desenhar([".....", ".##..", ".##..", "....."]);
    expect(nós(bits, w, h)).toHaveLength(4);

    limparEscadas(bits, w, h);

    expect(nós(bits, w, h)).toHaveLength(0);
    // Sobra tinta, e conectada: limpar não é apagar.
    expect(bits.reduce((a, b) => a + b, 0)).toBe(3);
  });

  it("remove o degrau que a contagem de transições deixaria passar", () => {
    // O pixel do meio tem tinta a nordeste, a leste e ao sul. Na ordem
    // circular o sul fica separado por um zero — duas transições —, então o
    // teste do Zhang-Suen o manteria. Mas leste e sul se tocam na diagonal:
    // é degrau, e tem que sair.
    const { bits, w, h } = desenhar(["...#.", "..##.", "..#..", "....."]);
    expect(grau(bits, w, h, 2, 1)).toBe(3);

    limparEscadas(bits, w, h);

    expect(bits[1 * w + 2]).toBe(0);
    expect(nós(bits, w, h)).toHaveLength(0);
  });

  it("preserva o cruzamento de verdade", () => {
    const { bits, w, h } = desenhar(vComEspinha(3));
    limparEscadas(bits, w, h);

    // O encontro dos dois braços com a espinha continua lá, e sozinho.
    expect(nós(bits, w, h)).toEqual([[12, 12]]);
  });
});

describe("traçar", () => {
  it("faz os dois braços do v descerem até a ponta da espinha", () => {
    // A regressão: antes, o primeiro braço consumia a espinha e o segundo
    // parava na bifurcação — a letra saía como "y".
    const { bits, w, h } = desenhar(vComEspinha(3));
    limparEscadas(bits, w, h);

    const traços = traçar(bits, w, h);
    const ponta = PONTA_DA_ESPINHA(3);
    const chegamNaPonta = traços.filter((t) =>
      t.some((p) => p.x === ponta.x && p.y === ponta.y),
    );

    expect(traços).toHaveLength(2);
    expect(chegamNaPonta).toHaveLength(2);
  });

  it("limpa o grafo antes de ler a forma", () => {
    // Pelo pipeline inteiro, sem chamar a limpeza à mão: é ele que garante a
    // ordem. Sem a limpeza no meio, os degraus da diagonal viram bifurcações
    // falsas e o segundo braço não chega ao fundo.
    const { bits, w, h } = desenhar(vComEspinha(3));
    const ponta = PONTA_DA_ESPINHA(3);

    const chegamNaPonta = linhasDoBitmap(bits, w, h).filter((t) =>
      t.some((p) => p.x === ponta.x && p.y === ponta.y),
    );

    expect(chegamNaPonta).toHaveLength(2);
  });

  it("fecha o v de uma forma cheia, com os degraus que a afinação cria", () => {
    // O caso de verdade: entra o desenho da letra, não um esqueleto pronto.
    // A afinação deixa a diagonal em escada, e sem a limpeza esses degraus
    // viram bifurcações falsas — foi o que travou os dois primeiros
    // consertos. O fundo aqui é o ponto de tinta mais baixo.
    const { bits, w, h } = desenhar(vCheio());
    const linhas = linhasDoBitmap(bits, w, h);

    const fundo = Math.max(...linhas.flat().map((p) => p.y));
    const chegamNoFundo = linhas.filter((t) => t.some((p) => p.y === fundo));

    // O topo grosso de cada braço se abre em forquilhas curtas — isso já era
    // assim e não é o que está em jogo. O que importa é o fundo.
    expect(chegamNoFundo).toHaveLength(2);
  });

  it("não mexe num cruzamento de quatro", () => {
    // A farpa de vértice é encontro de TRÊS. Num "x" o toco curto se parece
    // com ela, mas compartilhá-lo faria um braço comprido invadir o toco.
    // Correto é o toco continuar sendo o seu próprio tracinho.
    const { linhas: desenho, toco } = xComToco();
    const { bits, w, h } = desenhar(desenho);
    limparEscadas(bits, w, h);

    const noToco = traçar(bits, w, h).filter((t) =>
      t.some((p) => p.x === toco.x && p.y === toco.y),
    );

    expect(noToco).toHaveLength(1);
    expect(noToco[0].length).toBeLessThanOrEqual(3);
  });

  it("não confunde a perna do y com uma farpa", () => {
    // Mesma topologia, mas o ramo de baixo é longo: é traço da letra, e só um
    // dos braços deve descer por ele.
    const { bits, w, h } = desenhar(vComEspinha(12));
    limparEscadas(bits, w, h);

    const ponta = PONTA_DA_ESPINHA(12);
    const chegamNaPonta = traçar(bits, w, h).filter((t) =>
      t.some((p) => p.x === ponta.x && p.y === ponta.y),
    );

    expect(chegamNaPonta).toHaveLength(1);
  });
});
