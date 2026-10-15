// Linha do tempo da animação. A caminhada passa rápido; quem segura o
// ritmo são as paradas. Tudo é função pura do tempo `t` (segundos), o que
// deixa pular para um dia, voltar e repetir sem estado escondido.

export const TIMING = {
  intro: 6,
  walk: 6,
  stop: 9,
  outro: 8,
} as const;

export type PhaseKind = "intro" | "walk" | "stop" | "outro";

export interface Phase {
  readonly kind: PhaseKind;
  /** Índice do dia (0-based) para walk/stop; -1 em intro/outro. */
  readonly day: number;
  readonly start: number;
  readonly end: number;
}

export interface Timeline {
  readonly phases: readonly Phase[];
  readonly duration: number;
}

export function buildTimeline(dayCount: number): Timeline {
  if (dayCount < 1) throw new Error("A travessia precisa de pelo menos um dia");
  const phases: Phase[] = [];
  let t = 0;
  const push = (kind: PhaseKind, day: number, len: number) => {
    phases.push({ kind, day, start: t, end: t + len });
    t += len;
  };
  push("intro", -1, TIMING.intro);
  for (let d = 0; d < dayCount; d++) {
    push("walk", d, TIMING.walk);
    push("stop", d, TIMING.stop);
  }
  push("outro", -1, TIMING.outro);
  return { phases, duration: t };
}

export interface Frame {
  readonly index: number;
  readonly phase: Phase;
  /** Progresso dentro da fase, 0 a 1. */
  readonly u: number;
  /** Segundos desde o início da fase. */
  readonly local: number;
}

export function frameAt(timeline: Timeline, time: number): Frame {
  const t = Math.min(Math.max(time, 0), timeline.duration);
  const { phases } = timeline;
  let index = phases.findIndex((p) => t < p.end);
  if (index === -1) index = phases.length - 1;
  const phase = phases[index];
  const len = phase.end - phase.start;
  return { index, phase, u: len > 0 ? (t - phase.start) / len : 1, local: t - phase.start };
}

/** Instante em que começa a caminhada do dia (0-based). */
export function dayStart(timeline: Timeline, day: number): number {
  const phase = timeline.phases.find((p) => p.kind === "walk" && p.day === day);
  if (!phase) throw new Error(`Dia ${day + 1} fora da linha do tempo`);
  return phase.start;
}

/** Instante da parada (pernoite ou chegada) do dia, já com a câmera assentada. */
export function stopStart(timeline: Timeline, day: number): number {
  const phase = timeline.phases.find((p) => p.kind === "stop" && p.day === day);
  if (!phase) throw new Error(`Dia ${day + 1} fora da linha do tempo`);
  return phase.start;
}

/** Dia em destaque na lista: o da caminhada ou da parada em curso; -1 fora deles. */
export function activeDay(frame: Frame): number {
  return frame.phase.day;
}

export const easeInOutSine = (x: number): number => -(Math.cos(Math.PI * x) - 1) / 2;
export const easeOutCubic = (x: number): number => 1 - (1 - x) ** 3;

/** Fração do dia já caminhada, dado o quadro (0 antes do dia, 1 depois). */
export function walkFraction(frame: Frame, day: number): number {
  const { phase } = frame;
  if (phase.kind === "intro") return 0;
  if (phase.kind === "outro") return 1;
  if (phase.day > day) return 1;
  if (phase.day < day) return 0;
  return phase.kind === "walk" ? easeInOutSine(frame.u) : 1;
}

/** Interpolação suave entre dois números, com o fator já limitado. */
export function blend(a: number, b: number, t: number): number {
  const k = Math.min(Math.max(t, 0), 1);
  return a + (b - a) * k;
}
