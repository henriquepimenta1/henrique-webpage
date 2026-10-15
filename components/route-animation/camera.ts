// Câmera em função do tempo. Lençóis é quase plano: sem terreno 3D, pitch
// entre 40° e 50°, e zoom parecido perto e longe.

import { lerpAngle, pointAt, smoothBearing, type LngLat, type Track } from "./geo";
import { blend, easeInOutSine, type Frame, type Phase, type Timeline } from "./timeline";

export interface Cam {
  center: LngLat;
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface RouteDay {
  /** Distância (m) no traçado onde o dia começa e termina. */
  from: number;
  to: number;
  stop: LngLat;
}

export interface CameraContext {
  track: Track;
  days: readonly RouteDay[];
  overview: Cam;
  /** Zoom da caminhada, calculado pela largura do container. */
  walkZoom: number;
}

const WALK_PITCH = 45;
const STOP_PITCH = 48;
const ORBIT_DEG = 32;
/** A câmera olha um pouco à frente de quem caminha. */
const LOOK_AHEAD_M = 250;

/** Largura visível na caminhada: ~7 km no desktop, ~4,5 km no celular. */
export function walkZoomFor(widthPx: number, lat: number): number {
  const targetM = Math.max(4500, Math.min(8000, widthPx * 6.5));
  const metersPerPxAtZ0 = 78271.517 * Math.cos((lat * Math.PI) / 180);
  return Math.log2((metersPerPxAtZ0 * widthPx) / targetM);
}

function walkCam(ctx: CameraContext, day: number, frac: number): Cam {
  const d = ctx.days[day];
  const dist = d.from + (d.to - d.from) * easeInOutSine(frac);
  return {
    center: pointAt(ctx.track, dist + LOOK_AHEAD_M),
    zoom: ctx.walkZoom,
    pitch: WALK_PITCH,
    bearing: smoothBearing(ctx.track, dist + LOOK_AHEAD_M),
  };
}

export function stopCam(ctx: CameraContext, day: number, u: number): Cam {
  const d = ctx.days[day];
  const arrival = smoothBearing(ctx.track, d.to - 400);
  return {
    center: d.stop,
    zoom: ctx.walkZoom + 0.55,
    pitch: STOP_PITCH,
    bearing: (arrival + ORBIT_DEG * easeInOutSine(u) + 360) % 360,
  };
}

function rawCam(ctx: CameraContext, phase: Phase, u: number): Cam {
  switch (phase.kind) {
    case "intro":
      return { ...ctx.overview, zoom: ctx.overview.zoom + 0.12 * u };
    case "walk":
      return walkCam(ctx, phase.day, u);
    case "stop":
      return stopCam(ctx, phase.day, u);
    case "outro":
      return ctx.overview;
  }
}

/** Quanto tempo (s) a câmera leva para sair do enquadramento anterior. */
function blendSeconds(prev: Phase, cur: Phase): number {
  if (cur.kind === "outro") return 3;
  if (prev.kind === "intro") return 2.4;
  if (cur.kind === "stop") return 1.8;
  return 1.6;
}

export function lerpCam(a: Cam, b: Cam, t: number): Cam {
  return {
    center: [blend(a.center[0], b.center[0], t), blend(a.center[1], b.center[1], t)],
    zoom: blend(a.zoom, b.zoom, t),
    pitch: blend(a.pitch, b.pitch, t),
    bearing: lerpAngle(a.bearing, b.bearing, Math.min(Math.max(t, 0), 1)),
  };
}

export function camAt(ctx: CameraContext, timeline: Timeline, frame: Frame): Cam {
  const raw = rawCam(ctx, frame.phase, frame.u);
  if (frame.index === 0) return raw;
  const prev = timeline.phases[frame.index - 1];
  const secs = blendSeconds(prev, frame.phase);
  if (frame.local >= secs) return raw;
  return lerpCam(rawCam(ctx, prev, 1), raw, easeInOutSine(frame.local / secs));
}
