#!/usr/bin/env node
// Gera content/lencois-route.json a partir do GPX da travessia.
//
// Uso: node scripts/lencois-route/build-route.mjs <caminho-do-gpx>
//
// Fonte do traçado: Wikiloc, "Travessia Lençóis Maranhenses 4 dias 3 noites"
// (João Marcelo Maschião) — o mesmo GPX que já desenhava o mapa antigo da
// página. O GPX não entra no repositório; só o JSON derivado.
//
// O traçado serve só para DESENHAR. Os km exibidos vêm do site
// (content/lencois.ts e app/expedicoes/lencois/page.tsx), não do GPS:
// a divisão por dia do GPS não bate com a do site, e o site é a fonte.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const STEP_M = 30;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = join(ROOT, "content", "lencois-route.json");
// Dias em arquivo separado: a lista de dias aparece antes do clique e não
// pode puxar o traçado inteiro para o JS inicial da página.
const OUT_DAYS = join(ROOT, "content", "lencois-route-days.json");

// Pernoites e chegada: mesmas coordenadas do mapa antigo (components/lencois-map.tsx).
const START = { name: "Atins", lon: -42.88649, lat: -2.51442 };
const DAYS = [
  { n: 1, from: "Barreirinhas", to: "Baixa Grande", km: 9, lon: -42.98452, lat: -2.52298 },
  { n: 2, from: "Baixa Grande", to: "Queimada dos Britos", km: 10, lon: -43.06224, lat: -2.5062 },
  { n: 3, from: "Queimada dos Britos", to: "Betânia", km: 18, lon: -43.18214, lat: -2.54223 },
  { n: 4, from: "Betânia", to: "Santo Amaro", km: 15, lon: -43.245, lat: -2.50382 },
];

function haversine(a, b) {
  const R = 6371008.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function parseGpx(xml) {
  const pts = [...xml.matchAll(/<trkpt\s+lat="([-\d.]+)"\s+lon="([-\d.]+)"/g)].map(
    (m) => [Number(m[2]), Number(m[1])],
  );
  if (pts.length < 2) throw new Error("GPX sem <trkpt> suficientes");
  return pts;
}

function resample(pts, step) {
  const out = [pts[0]];
  let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = haversine(a, b);
    if (seg === 0) continue;
    let d = step - carry;
    while (d <= seg) {
      const t = d / seg;
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      d += step;
    }
    carry = seg - (d - step);
  }
  const last = pts[pts.length - 1];
  if (haversine(out[out.length - 1], last) > 1) out.push(last);
  return out;
}

function nearestIndex(pts, p, from) {
  let best = from;
  let bestD = Infinity;
  for (let i = from; i < pts.length; i++) {
    const d = haversine(pts[i], p);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return { index: best, dist: bestD };
}

const round = (v) => Math.round(v * 1e5) / 1e5;

function main() {
  const src = process.argv[2];
  if (!src) {
    console.error("Uso: node scripts/lencois-route/build-route.mjs <arquivo.gpx>");
    process.exit(1);
  }
  const route = resample(parseGpx(readFileSync(src, "utf8")), STEP_M).map(([lon, lat]) => [
    round(lon),
    round(lat),
  ]);

  let cursor = 0;
  let kmAcc = 0;
  const days = DAYS.map((d) => {
    const { index, dist } = nearestIndex(route, [d.lon, d.lat], cursor);
    if (dist > 600) throw new Error(`Pernoite ${d.to} a ${Math.round(dist)} m do traçado`);
    kmAcc += d.km;
    const day = { n: d.n, from: d.from, to: d.to, km: d.km, kmAcc, startIdx: cursor, endIdx: index };
    cursor = index;
    return day;
  });
  days[days.length - 1].endIdx = route.length - 1;

  const stops = [
    { kind: "start", name: START.name, lon: START.lon, lat: START.lat, idx: 0 },
    ...days.map((d, i) => ({
      kind: i === days.length - 1 ? "end" : "night",
      name: d.to,
      night: i === days.length - 1 ? null : d.n,
      lon: DAYS[i].lon,
      lat: DAYS[i].lat,
      idx: d.endIdx,
    })),
  ];

  const lons = route.map((p) => p[0]);
  const lats = route.map((p) => p[1]);
  const json = {
    source: "Wikiloc — Travessia Lençóis Maranhenses 4 dias 3 noites (João Marcelo Maschião)",
    stepMeters: STEP_M,
    bounds: [
      [Math.min(...lons), Math.min(...lats)],
      [Math.max(...lons), Math.max(...lats)],
    ],
    days,
    stops,
    route,
  };
  const text = JSON.stringify(json);
  writeFileSync(OUT, text + "\n");
  const listDays = days.map(({ n, from, to, km, kmAcc }) => ({ n, from, to, km, kmAcc }));
  writeFileSync(OUT_DAYS, JSON.stringify(listDays, null, 2) + "\n");
  console.log(`${route.length} pontos · ${(text.length / 1024).toFixed(1)} KB → ${OUT}`);
  for (const d of days) console.log(`  dia ${d.n}: idx ${d.startIdx}–${d.endIdx} · ${d.km} km (site)`);
}

main();
