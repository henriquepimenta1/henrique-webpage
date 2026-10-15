// Geometria do traçado: distância acumulada, ponto em uma distância e rumo
// suavizado. Puro, sem MapLibre, para poder testar e reutilizar.

export type LngLat = [number, number];

const EARTH_RADIUS_M = 6371008.8;
const toRad = (d: number): number => (d * Math.PI) / 180;
const toDeg = (r: number): number => (r * 180) / Math.PI;

export function haversine(a: LngLat, b: LngLat): number {
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/** Rumo de a para b, em graus de 0 a 360 (0 = norte, 90 = leste). */
export function bearing(a: LngLat, b: LngLat): number {
  const y = Math.sin(toRad(b[0] - a[0])) * Math.cos(toRad(b[1]));
  const x =
    Math.cos(toRad(a[1])) * Math.sin(toRad(b[1])) -
    Math.sin(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.cos(toRad(b[0] - a[0]));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export interface Track {
  readonly points: readonly LngLat[];
  /** Distância acumulada em metros até cada ponto; cum[0] = 0. */
  readonly cum: Float64Array;
  readonly length: number;
}

export function buildTrack(points: readonly LngLat[]): Track {
  if (points.length < 2) throw new Error("Traçado precisa de pelo menos 2 pontos");
  const cum = new Float64Array(points.length);
  for (let i = 1; i < points.length; i++) {
    cum[i] = cum[i - 1] + haversine(points[i - 1], points[i]);
  }
  return { points, cum, length: cum[cum.length - 1] };
}

/** Índice i tal que cum[i] <= d < cum[i+1] (busca binária). */
function segmentAt(track: Track, d: number): number {
  let lo = 0;
  let hi = track.cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (track.cum[mid] <= d) lo = mid;
    else hi = mid;
  }
  return lo;
}

export function pointAt(track: Track, distance: number): LngLat {
  const d = Math.min(Math.max(distance, 0), track.length);
  const i = segmentAt(track, d);
  const a = track.points[i];
  const b = track.points[Math.min(i + 1, track.points.length - 1)];
  const span = track.cum[Math.min(i + 1, track.cum.length - 1)] - track.cum[i];
  const t = span > 0 ? (d - track.cum[i]) / span : 0;
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/**
 * Rumo médio do caminho em torno de `distance`. Faz a média vetorial de
 * vários trechos curtos numa janela larga, para a câmera não sacudir a cada
 * zigue-zague entre dunas.
 */
export function smoothBearing(track: Track, distance: number, window = 1600): number {
  const samples = 8;
  let sx = 0;
  let sy = 0;
  for (let k = 0; k < samples; k++) {
    const d0 = distance - window / 2 + (window * k) / samples;
    const d1 = d0 + window / samples;
    const b = toRad(bearing(pointAt(track, d0), pointAt(track, d1)));
    sx += Math.cos(b);
    sy += Math.sin(b);
  }
  return (toDeg(Math.atan2(sy, sx)) + 360) % 360;
}

/** Diferença angular mais curta de a para b, em graus (-180, 180]. */
export function angleDelta(a: number, b: number): number {
  const d = (((b - a) % 360) + 540) % 360 - 180;
  return d === -180 ? 180 : d;
}

export function lerpAngle(a: number, b: number, t: number): number {
  return (a + angleDelta(a, b) * t + 360) % 360;
}
