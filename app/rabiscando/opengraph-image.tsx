import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { parse as parseFont } from "opentype.js";
import { buildScribble } from "./scribble";

// Cartão social do Rabiscando: a palavra sai da MESMA função que o editor
// usa, com tremor de verdade. Uma imagem estática com a fonte limpa mostraria
// exatamente aquilo que a ferramenta não faz.

export const alt = "Rabiscando — texto manuscrito animado para vídeo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0D0C0B";
const ACENTO = "#C08246";
const TEXTO_3 = "#9A9183";

export default async function Image() {
  const ttf = await readFile(
    path.join(process.cwd(), "public", "fonts", "PermanentMarker-Regular.ttf"),
  );
  // `opentype.parse` quer um ArrayBuffer; o Buffer do Node é uma view sobre um
  // pool compartilhado, então recortar pelo offset é obrigatório.
  const font = parseFont(
    ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength) as ArrayBuffer,
  );

  const desenho = buildScribble(font, "rabiscando", 38, { lineHeight: 1.05 });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
        }}
      >
        <svg width={1000} height={330} viewBox={desenho.viewBox}>
          {desenho.glyphs.map((g, i) => (
            <path key={i} d={g.d} fill={ACENTO} />
          ))}
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: TEXTO_3,
          }}
        >
          texto manuscrito animado · euhenriq.com
        </div>
      </div>
    ),
    size,
  );
}
