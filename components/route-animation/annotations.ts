// Anotações "caderno de campo" desenhadas num canvas por cima do mapa:
// letra manuscrita escrita aos poucos, círculos e setas rabiscados, × nos
// destaques e triângulo nos pernoites. Cada traço recebe `p` (0 a 1) e
// desenha só a fração já "escrita".

export interface Pt {
  x: number;
  y: number;
}

export const INK = "#141B27";
export const HALO = "rgba(240,233,216,.78)";
export const PEN_RED = "#A6542B";
export const TRAIL_PENDING = "rgba(20,27,39,.5)";

const clamp01 = (v: number): number => Math.min(Math.max(v, 0), 1);

/** Progresso local de um trecho [a, b] dentro de um progresso maior. */
export function span(p: number, a: number, b: number): number {
  return clamp01((p - a) / (b - a));
}

function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Desenha uma polilinha só até a fração p do comprimento. */
function partialPolyline(ctx: CanvasRenderingContext2D, pts: Pt[], p: number): boolean {
  // Sempre começa um caminho novo: sem isso, o inkStroke seguinte
  // repintaria o último caminho desenhado (o traçado inteiro).
  ctx.beginPath();
  if (p <= 0 || pts.length < 2) return false;
  let total = 0;
  const seg: number[] = [];
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    seg.push(d);
    total += d;
  }
  let left = total * clamp01(p);
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length && left > 0; i++) {
    const d = seg[i - 1];
    if (d <= left) {
      ctx.lineTo(pts[i].x, pts[i].y);
      left -= d;
    } else {
      const t = left / d;
      ctx.lineTo(pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t);
      left = 0;
    }
  }
  return true;
}

/** Traço com halo claro por baixo, para ler sobre duna branca e lagoa escura. */
function inkStroke(ctx: CanvasRenderingContext2D, color: string, width: number): void {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = HALO;
  ctx.lineWidth = width + 2.5;
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function scribbleCircle(
  ctx: CanvasRenderingContext2D,
  c: Pt,
  r: number,
  p: number,
  seed: number,
): void {
  if (p <= 0) return;
  const rand = rng(seed);
  const start = rand() * Math.PI * 2;
  const sweep = Math.PI * 2 * 1.18;
  const wob = 2 + rand() * 2;
  const phase = rand() * Math.PI * 2;
  const squash = 0.82 + rand() * 0.12;
  const pts: Pt[] = [];
  const steps = 64;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + sweep * t;
    const rr = r * (1 + 0.06 * Math.sin(wob * a + phase) + 0.1 * t);
    pts.push({ x: c.x + Math.cos(a) * rr, y: c.y + Math.sin(a) * rr * squash });
  }
  if (partialPolyline(ctx, pts, p)) inkStroke(ctx, PEN_RED, 2);
}

export function scribbleArrow(ctx: CanvasRenderingContext2D, from: Pt, to: Pt, p: number, seed: number): void {
  if (p <= 0) return;
  const rand = rng(seed);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const bend = (rand() - 0.5) * 0.5 * len;
  const ctrl = { x: (from.x + to.x) / 2 - (dy / len) * bend, y: (from.y + to.y) / 2 + (dx / len) * bend };
  const pts: Pt[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    pts.push({
      x: (1 - t) ** 2 * from.x + 2 * (1 - t) * t * ctrl.x + t * t * to.x,
      y: (1 - t) ** 2 * from.y + 2 * (1 - t) * t * ctrl.y + t * t * to.y,
    });
  }
  if (partialPolyline(ctx, pts, span(p, 0, 0.8))) inkStroke(ctx, INK, 1.6);
  const head = span(p, 0.8, 1);
  if (head <= 0) return;
  const ang = Math.atan2(to.y - ctrl.y, to.x - ctrl.x);
  const size = 9 * head;
  ctx.beginPath();
  ctx.moveTo(to.x - Math.cos(ang - 0.45) * size, to.y - Math.sin(ang - 0.45) * size);
  ctx.lineTo(to.x, to.y);
  ctx.lineTo(to.x - Math.cos(ang + 0.45) * size, to.y - Math.sin(ang + 0.45) * size);
  inkStroke(ctx, INK, 1.6);
}

export function scribbleCross(ctx: CanvasRenderingContext2D, c: Pt, size: number, p: number): void {
  const s = size / 2;
  if (partialPolyline(ctx, [{ x: c.x - s, y: c.y - s }, { x: c.x + s, y: c.y + s * 0.9 }], span(p, 0, 0.5))) {
    inkStroke(ctx, PEN_RED, 2);
  }
  if (partialPolyline(ctx, [{ x: c.x + s * 0.9, y: c.y - s }, { x: c.x - s, y: c.y + s }], span(p, 0.5, 1))) {
    inkStroke(ctx, PEN_RED, 2);
  }
}

export function scribbleTriangle(ctx: CanvasRenderingContext2D, c: Pt, size: number, p: number): void {
  const h = size * 0.9;
  const pts: Pt[] = [
    { x: c.x, y: c.y - h * 0.66 },
    { x: c.x + size / 2, y: c.y + h * 0.34 },
    { x: c.x - size / 2 - 1, y: c.y + h * 0.36 },
    { x: c.x + 1, y: c.y - h * 0.6 },
  ];
  if (partialPolyline(ctx, pts, p)) inkStroke(ctx, INK, 1.6);
}

export interface WriteOptions {
  font: string;
  size: number;
  align?: "left" | "right" | "center";
  color?: string;
  alpha?: number;
}

/**
 * Escreve um texto revelando da esquerda para a direita, como a mão
 * escrevendo. Devolve a largura do texto para quem precisa posicionar setas.
 */
export function writeText(
  ctx: CanvasRenderingContext2D,
  text: string,
  at: Pt,
  p: number,
  opts: WriteOptions,
): number {
  ctx.font = `${opts.size}px ${opts.font}`;
  const width = ctx.measureText(text).width;
  if (p <= 0) return width;
  const align = opts.align ?? "left";
  const left = align === "left" ? at.x : align === "right" ? at.x - width : at.x - width / 2;
  ctx.save();
  ctx.globalAlpha = opts.alpha ?? 1;
  ctx.beginPath();
  ctx.rect(left - 4, at.y - opts.size * 1.2, (width + 8) * clamp01(p), opts.size * 1.6);
  ctx.clip();
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.lineJoin = "round";
  ctx.strokeStyle = HALO;
  ctx.lineWidth = Math.max(3, opts.size * 0.12);
  ctx.strokeText(text, left, at.y);
  ctx.fillStyle = opts.color ?? INK;
  ctx.fillText(text, left, at.y);
  ctx.restore();
  return width;
}

export interface TrailDay {
  start: number;
  end: number;
  color: string;
  /** Fração já caminhada do dia, 0 a 1. */
  done: number;
}

/**
 * Traçado inteiro: o que falta em tracejado fino de tinta, o que já foi
 * percorrido na cor de cada dia. Sem brilho, só o halo mínimo de leitura.
 */
/**
 * Com a câmera inclinada, pontos muito além do enquadramento projetam em
 * coordenadas absurdas e viram retas cruzando a tela. Esses trechos são
 * pulados: a linha recomeça quando o ponto volta a ser plausível.
 */
function plausible(p: Pt, w: number, h: number): boolean {
  return Number.isFinite(p.x) && Number.isFinite(p.y) && p.x > -w && p.x < 2 * w && p.y > -h && p.y < 2 * h;
}

function tracePath(ctx: CanvasRenderingContext2D, screen: Pt[], from: number, to: number, w: number, h: number): void {
  let pen = false;
  for (let i = from; i <= to; i++) {
    const p = screen[i];
    if (!plausible(p, w, h)) {
      pen = false;
      continue;
    }
    if (pen) ctx.lineTo(p.x, p.y);
    else ctx.moveTo(p.x, p.y);
    pen = true;
  }
}

export function drawTrail(
  ctx: CanvasRenderingContext2D,
  screen: Pt[],
  days: TrailDay[],
  w: number,
  h: number,
): Pt | null {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  tracePath(ctx, screen, 0, screen.length - 1, w, h);
  ctx.setLineDash([4, 5]);
  ctx.strokeStyle = TRAIL_PENDING;
  ctx.lineWidth = 1.3;
  ctx.stroke();
  ctx.setLineDash([]);

  let head: Pt | null = null;
  for (const d of days) {
    if (d.done <= 0) continue;
    const endF = d.start + (d.end - d.start) * d.done;
    const last = Math.floor(endF);
    ctx.beginPath();
    tracePath(ctx, screen, d.start, last, w, h);
    const frac = endF - last;
    if (frac > 0 && last + 1 < screen.length && plausible(screen[last], w, h) && plausible(screen[last + 1], w, h)) {
      const a = screen[last];
      const b = screen[last + 1];
      head = { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
      ctx.lineTo(head.x, head.y);
    } else {
      head = screen[last];
    }
    inkStroke(ctx, d.color, 2.4);
  }
  return head;
}

export function drawWalker(ctx: CanvasRenderingContext2D, at: Pt): void {
  ctx.beginPath();
  ctx.arc(at.x, at.y, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = INK;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = HALO;
  ctx.stroke();
}
