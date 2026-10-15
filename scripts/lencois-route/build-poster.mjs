#!/usr/bin/env node
// Gera os pôsteres estáticos do roteiro (o que aparece antes do clique):
//   public/images/lencois/rota-poster-ultra.jpg (21:9, desktop)
//   public/images/lencois/rota-poster-wide.jpg  (16:9, tablet)
//   public/images/lencois/rota-poster-tall.jpg  (4:5, oeste para cima)
//
// Com MAPBOX_TOKEN no ambiente, o fundo é o satélite da Mapbox (Static
// Images API, uma chamada por pôster). Sem token, fundo de areia liso.
//
// Uso: MAPBOX_TOKEN=pk... node scripts/lencois-route/build-poster.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const data = JSON.parse(readFileSync(join(ROOT, "content", "lencois-route.json"), "utf8"));
const OUT_DIR = join(ROOT, "public", "images", "lencois");

// Mesmas cores do roteiro da página (DIA_COLORS em app/expedicoes/lencois/page.tsx).
const DAY_COLORS = ["#A6542B", "#6FA3D8", "#4A5838", "#C2803D"];
const INK = "#141B27";
const HALO = "rgba(240,233,216,.8)";
const SAND = "#DCCFB0";

const POSTERS = [
  { file: "rota-poster-ultra.jpg", w: 2100, h: 900, westUp: false },
  { file: "rota-poster-wide.jpg", w: 1600, h: 900, westUp: false },
  { file: "rota-poster-tall.jpg", w: 1080, h: 1350, westUp: true },
];

const mercX = (lon) => (lon + 180) / 360;
const mercY = (lat) => {
  const s = Math.sin((lat * Math.PI) / 180);
  return 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI);
};

/** Projeção simples que enquadra o traçado com margem. */
function makeProjector({ w, h, westUp }) {
  const pts = data.route.map(([lon, lat]) => {
    const x = mercX(lon);
    const y = mercY(lat);
    // Oeste para cima: a câmera olha para oeste, o norte fica à direita.
    return westUp ? [-y, x] : [x, y];
  });
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const pad = 0.12;
  const scale = Math.min((w * (1 - 2 * pad)) / (maxX - minX), (h * (1 - 2 * pad)) / (maxY - minY));
  const ox = (w - (maxX - minX) * scale) / 2;
  const oy = (h - (maxY - minY) * scale) / 2;
  const proj = ([lon, lat]) => {
    const x = mercX(lon);
    const y = mercY(lat);
    const [a, b] = westUp ? [-y, x] : [x, y];
    return [ox + (a - minX) * scale, oy + (b - minY) * scale];
  };
  const unproj = ([px, py]) => {
    const a = (px - ox) / scale + minX;
    const b = (py - oy) / scale + minY;
    const [x, y] = westUp ? [b, -a] : [a, b];
    const lon = x * 360 - 180;
    const lat = (Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180) / Math.PI;
    return [lon, lat];
  };
  return { proj, unproj, scale };
}

function overlaySvg(poster, proj) {
  const path = (from, to) =>
    data.route
      .slice(from, to + 1)
      .map((p, i) => `${i ? "L" : "M"}${proj(p).map((v) => v.toFixed(1)).join(",")}`)
      .join("");
  const lines = data.days
    .map((d, i) => {
      const dpath = path(d.startIdx, d.endIdx);
      return `<path d="${dpath}" stroke="${HALO}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${dpath}" stroke="${DAY_COLORS[i]}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    })
    .join("\n");
  const marks = data.stops
    .map((s) => {
      const [x, y] = proj([s.lon, s.lat]);
      if (s.kind === "night") {
        const z = 16;
        return `<path d="M${x},${y - z * 0.6} L${x + z / 2},${y + z * 0.32} L${x - z / 2 - 1},${y + z * 0.34} Z" fill="none" stroke="${HALO}" stroke-width="5" stroke-linejoin="round"/>
<path d="M${x},${y - z * 0.6} L${x + z / 2},${y + z * 0.32} L${x - z / 2 - 1},${y + z * 0.34} Z" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`;
      }
      const z = 8;
      const cross = `M${x - z},${y - z} L${x + z},${y + z} M${x + z},${y - z} L${x - z},${y + z}`;
      return `<path d="${cross}" stroke="${HALO}" stroke-width="5.5" stroke-linecap="round"/>
<path d="${cross}" stroke="#A6542B" stroke-width="2.6" stroke-linecap="round"/>`;
    })
    .join("\n");
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${poster.w}" height="${poster.h}">
<defs><radialGradient id="v" cx="50%" cy="50%" r="75%"><stop offset="60%" stop-color="#121a28" stop-opacity="0"/><stop offset="100%" stop-color="#121a28" stop-opacity=".45"/></radialGradient></defs>
${lines}
${marks}
<rect width="100%" height="100%" fill="url(#v)"/>
<rect width="100%" height="100%" fill="#121a28" opacity=".22"/>
</svg>`);
}

/**
 * Fundo de satélite no mesmo recorte do desenho. `scale` é pixels por
 * largura de mundo Mercator; a Static API com @2x desenha 512·2^z pixels
 * lógicos (metade dos reais), daí z = log2(scale / 1024).
 */
async function satelliteBackground(poster, unproj, scale, token) {
  const [lon, lat] = unproj([poster.w / 2, poster.h / 2]);
  const zoom = Math.log2(scale / 1024);
  const bearing = poster.westUp ? 270 : 0;
  const url =
    `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lon.toFixed(5)},${lat.toFixed(5)},${zoom.toFixed(3)},${bearing},0/` +
    `${Math.round(poster.w / 2)}x${Math.round(poster.h / 2)}@2x?attribution=false&logo=false&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mapbox Static Images respondeu ${res.status}`);
  const img = Buffer.from(await res.arrayBuffer());
  return sharp(img).resize(poster.w, poster.h, { fit: "cover" }).modulate({ saturation: 0.82 }).toBuffer();
}

async function main() {
  const token = process.env.MAPBOX_TOKEN;
  for (const poster of POSTERS) {
    const { proj, unproj, scale } = makeProjector(poster);
    const base = token
      ? await satelliteBackground(poster, unproj, scale, token)
      : await sharp({ create: { width: poster.w, height: poster.h, channels: 3, background: SAND } }).png().toBuffer();
    const out = join(OUT_DIR, poster.file);
    await sharp(base)
      .composite([{ input: overlaySvg(poster, proj) }])
      .jpeg({ quality: 78, progressive: true, mozjpeg: true })
      .toFile(out);
    console.log(`${token ? "satélite" : "areia"} → ${out}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
