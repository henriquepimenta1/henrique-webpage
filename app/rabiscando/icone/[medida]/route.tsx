import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { parse as parseFont } from "opentype.js";
import { buildScribble } from "../../scribble";

// Ícone do Rabiscando, nas medidas que o manifest e o iOS pedem.
//
// A letra sai da MESMA função de traçado que o editor usa, como já faz o
// cartão social — um "r" desenhado com fonte limpa mostraria justamente o que
// a ferramenta não faz. Gerado em rota (e não como arquivo em /public) porque
// assim o ícone acompanha qualquer mudança no motor de tremor sozinho.
//
// URL estável de propósito: `app/rabiscando/icon.tsx` daria um caminho com
// hash, que o manifest não consegue referenciar.

const BG = "#0D0C0B";
const ACENTO = "#C08246";

/** As três medidas que importam: 180 é o apple-touch-icon, 192 e 512 são o
 *  par mínimo que o Chrome exige para oferecer a instalação. */
const MEDIDAS = [180, 192, 512] as const;

export function generateStaticParams() {
  return MEDIDAS.map((m) => ({ medida: String(m) }));
}

/**
 * Caixa justa em volta da tinta.
 *
 * O `viewBox` que o buildScribble devolve cobre a linha inteira — com o vão
 * do ascendente e do descendente vazio em cima e embaixo. Num cartão social
 * de 1200px isso não aparece; num ícone de 192px o "r" vira uma mancha no
 * meio de muito preto.
 *
 * Todos os comandos do `d` são absolutos e só carregam pares (x, y) — inclusive
 * os pontos de controle do C e do Q. Tomar todos os pares dá uma caixa
 * levemente folgada, que é o lado certo de errar aqui.
 */
function caixaDaTinta(ds: string[]): { x: number; y: number; w: number; h: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const d of ds) {
    const nums = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)?.map(Number) ?? [];
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const x = nums[i];
      const y = nums[i + 1];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (!Number.isFinite(minX)) return { x: 0, y: 0, w: 1, h: 1 };
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

export const dynamicParams = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ medida: string }> },
) {
  const { medida } = await params;
  const px = Number(medida);
  if (!MEDIDAS.includes(px as (typeof MEDIDAS)[number])) {
    return new Response("medida não suportada", { status: 404 });
  }

  const ttf = await readFile(
    path.join(process.cwd(), "public", "fonts", "PermanentMarker-Regular.ttf"),
  );
  // `opentype.parse` quer um ArrayBuffer; o Buffer do Node é uma view sobre um
  // pool compartilhado, então recortar pelo offset é obrigatório.
  const font = parseFont(
    ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength) as ArrayBuffer,
  );

  const desenho = buildScribble(font, "r", 30, { lineHeight: 1 });
  const caixa = caixaDaTinta(desenho.glyphs.map((g) => g.d));

  // 56% da caixa. O Android recorta ícone `maskable` num círculo e come cerca
  // de 20% de cada borda; sobrando esta folga, o "r" nunca perde a perna.
  const arte = Math.round(px * 0.56);
  // A letra é mais larga que alta: encaixar pelo lado maior mantém a proporção
  // e centraliza sozinho, sem esticar o traço.
  const lado = Math.max(caixa.w, caixa.h);
  const vb = [
    caixa.x - (lado - caixa.w) / 2,
    caixa.y - (lado - caixa.h) / 2,
    lado,
    lado,
  ].join(" ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={arte} height={arte} viewBox={vb}>
          {desenho.glyphs.map((g, i) => (
            <path key={i} d={g.d} fill={ACENTO} />
          ))}
        </svg>
      </div>
    ),
    { width: px, height: px },
  );
}
