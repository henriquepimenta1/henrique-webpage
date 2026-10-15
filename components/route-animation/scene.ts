// Monta o quadro de anotações a partir do tempo: título, traçado, marcas
// de pernoite e o bloco de texto de cada parada.

import {
  drawTrail,
  drawWalker,
  scribbleArrow,
  scribbleCircle,
  scribbleCross,
  scribbleTriangle,
  span,
  writeText,
  type Pt,
  type TrailDay,
} from "./annotations";
import type { LngLat } from "./geo";
import { walkFraction, type Frame } from "./timeline";

export interface SceneDay {
  n: number;
  km: number;
  kmAcc: number;
  startIdx: number;
  endIdx: number;
  color: string;
}

export interface SceneStop {
  kind: "start" | "night" | "end";
  name: string;
  night: number | null;
  lngLat: LngLat;
}

export interface SceneInput {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  font: string;
  compact: boolean;
  /** Pontos do traçado já projetados na tela. */
  screen: Pt[];
  project: (ll: LngLat) => Pt;
  days: readonly SceneDay[];
  /** stops[0] = saída; stops[d + 1] = fim do dia d. */
  stops: readonly SceneStop[];
  title: string;
  subtitle: string;
  totals: string;
  totalsSub: string;
}

/** Modo estático (movimento reduzido): tudo desenhado, sem escrita progressiva. */
export type StaticView = { kind: "overview" } | { kind: "stop"; day: number };

type Mode = { kind: "animated"; frame: Frame } | { kind: "static"; view: StaticView };

const fmt = (n: number): string => n.toLocaleString("pt-BR");

function sizes(s: SceneInput) {
  const base = s.compact ? s.width / 11 : Math.min(54, Math.max(32, s.width / 26));
  return { big: base, mid: base * 0.62, small: base * 0.44, mark: s.compact ? 11 : 13 };
}

function drawStopCard(s: SceneInput, day: number, local: number, alpha: number): void {
  const { ctx } = s;
  const z = sizes(s);
  const stop = s.stops[day + 1];
  const d = s.days[day];
  const c = s.project(stop.lngLat);
  const r = s.compact ? 22 : 30;
  ctx.save();
  ctx.globalAlpha = alpha;
  scribbleCircle(ctx, c, r, span(local, 0, 0.8), 11 + day * 7);

  const lines: [string, number][] = [
    [stop.name, z.big],
    [stop.kind === "night" ? `noite ${stop.night}` : "chegada", z.mid],
    [`dia ${d.n} · ${fmt(d.km)} km · ${fmt(d.kmAcc)} km no total`, z.small],
  ];
  const gap = 1.08;
  const blockH = lines.reduce((h, [, size]) => h + size * gap, 0);
  let anchor: Pt;
  let align: "left" | "right";
  let arrowFrom: Pt;
  if (s.compact) {
    // Acima da barra de controles (~56 px com o degradê).
    anchor = { x: 18, y: s.height - blockH - 92 };
    align = "left";
    arrowFrom = { x: Math.min(s.width * 0.42, c.x), y: anchor.y - 10 };
  } else {
    const right = c.x < s.width * 0.6;
    align = right ? "left" : "right";
    const x = right ? c.x + r + 70 : c.x - r - 70;
    const y = Math.min(Math.max(c.y - r - 40, 56), s.height - blockH - 70);
    anchor = { x, y };
    arrowFrom = { x: right ? x - 10 : x + 10, y: y + z.big * 0.2 };
  }
  const dir = { x: arrowFrom.x - c.x, y: arrowFrom.y - c.y };
  const dl = Math.hypot(dir.x, dir.y) || 1;
  const arrowTo = { x: c.x + (dir.x / dl) * (r + 6), y: c.y + (dir.y / dl) * (r + 6) };
  if (dl > r + 24) scribbleArrow(ctx, arrowFrom, arrowTo, span(local, 0.6, 1.3), 5 + day);

  let y = anchor.y + lines[0][1];
  const windows: [number, number][] = [
    [1.0, 2.2],
    [2.0, 2.7],
    [2.5, 3.6],
  ];
  lines.forEach(([text, size], i) => {
    writeText(ctx, text, { x: anchor.x, y }, span(local, ...windows[i]), { font: s.font, size, align });
    y += size * gap;
  });
  ctx.restore();
}

function drawMarks(s: SceneInput, uptoDay: number, p: number, labels: boolean): void {
  const z = sizes(s);
  const start = s.project(s.stops[0].lngLat);
  scribbleCross(s.ctx, start, z.mark, p);
  if (labels) writeText(s.ctx, s.stops[0].name, { x: start.x + 10, y: start.y + z.small + 6 }, p, { font: s.font, size: z.small });
  for (let d = 0; d <= uptoDay && d < s.days.length; d++) {
    const stop = s.stops[d + 1];
    const at = s.project(stop.lngLat);
    if (stop.kind === "end") scribbleCross(s.ctx, at, z.mark, p);
    else scribbleTriangle(s.ctx, at, z.mark, p);
    if (labels) writeText(s.ctx, stop.name, { x: at.x + 9, y: at.y - 9 }, p, { font: s.font, size: z.small * 0.9 });
  }
}

function drawTitle(s: SceneInput, a: string, b: string, local: number, alpha: number, big: boolean): void {
  const z = sizes(s);
  const x = s.compact ? 18 : s.width * 0.05;
  // Abaixo do HUD, que ocupa o canto superior esquerdo.
  const y = s.compact ? 52 + z.big : s.height * 0.08 + z.big;
  s.ctx.save();
  s.ctx.globalAlpha = alpha;
  const size = big ? z.big * 1.5 : z.big;
  writeText(s.ctx, a, { x, y: y + (big ? z.big * 0.4 : 0) }, span(local, 0.5, 2.4), { font: s.font, size });
  writeText(s.ctx, b, { x, y: y + size * 1.05 + (big ? z.big * 0.3 : 0) }, span(local, 2.2, 3.4), { font: s.font, size: z.mid });
  s.ctx.restore();
}

function trailFor(s: SceneInput, done: (d: number) => number): TrailDay[] {
  return s.days.map((d, i) => ({ start: d.startIdx, end: d.endIdx, color: d.color, done: done(i) }));
}

export function drawScene(s: SceneInput, mode: Mode): void {
  const { ctx } = s;
  ctx.clearRect(0, 0, s.width, s.height);

  if (mode.kind === "static") {
    drawTrail(ctx, s.screen, trailFor(s, () => 1), s.width, s.height);
    if (mode.view.kind === "overview") {
      drawMarks(s, s.days.length - 1, 1, true);
      drawTitle(s, s.title, s.subtitle, 99, 1, false);
    } else {
      drawMarks(s, mode.view.day - 1, 1, true);
      drawStopCard(s, mode.view.day, 99, 1);
    }
    return;
  }

  const { frame } = mode;
  const { phase, local } = frame;
  const head = drawTrail(ctx, s.screen, trailFor(s, (d) => walkFraction(frame, d)), s.width, s.height);

  if (phase.kind === "intro") {
    drawMarks(s, s.days.length - 1, span(local, 3, 4.6), !s.compact);
    drawTitle(s, s.title, s.subtitle, local, 1 - span(local, 5.2, 6), false);
    return;
  }
  if (phase.kind === "outro") {
    drawMarks(s, s.days.length - 1, 1, !s.compact);
    drawTitle(s, s.totals, s.totalsSub, local - 1.2, 1, true);
    return;
  }
  drawMarks(s, phase.day - 1, 1, !s.compact);
  if (phase.kind === "walk" && head) drawWalker(ctx, head);
  if (phase.kind === "stop") {
    const fade = 1 - span(local, phase.end - phase.start - 0.8, phase.end - phase.start);
    drawStopCard(s, phase.day, local, fade);
  }
}
