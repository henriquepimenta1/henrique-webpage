import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Este arquivo existe por causa de um bug que passou por tsc e por
// `next build` e só apareceu no navegador: havia uma CONSTANTE exportada de
// um arquivo "use server". O Next transforma todo export desse arquivo num
// ponteiro para o servidor, então a constante chegava no cliente como proxy
// de função e derrubava a página no primeiro acesso a um campo dela.
//
// Nenhuma ferramenta do projeto reclamou. Então a afirmação vira teste —
// sobre o texto do arquivo, que é o que o compilador do Next vai ler.

const fonte = readFileSync(new URL("./acoes.ts", import.meta.url), "utf8");

describe('o arquivo "use server"', () => {
  it("declara a diretiva na primeira linha", () => {
    expect(fonte.split("\n")[0].trim()).toBe('"use server";');
  });

  it("não exporta const, let, var, class nem default", () => {
    expect(fonte.match(/^export\s+(const|let|var|class|default)\b/gm)).toBeNull();
  });

  it("todo export de função é async", () => {
    const funcoes = [...fonte.matchAll(/^export\s+(async\s+)?function\s+(\w+)/gm)];
    expect(funcoes.length).toBeGreaterThan(0);
    for (const [, async, nome] of funcoes) {
      expect(async, `export "${nome}" precisa ser async`).toBeDefined();
    }
  });

  it("exporta a ação do formulário", () => {
    expect(fonte).toMatch(/^export async function entrarNaLista/m);
  });
});
