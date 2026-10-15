import { describe, expect, it } from "vitest";

import route from "../../content/lencois-route.json";
import days from "../../content/lencois-route-days.json";
import { angleDelta, buildTrack, haversine, lerpAngle, pointAt, smoothBearing, type LngLat } from "./geo";
import { buildTimeline, dayStart, frameAt, stopStart, TIMING, walkFraction } from "./timeline";

describe("dados do trajeto", () => {
  it("usa os km do site: 9 + 10 + 18 + 15 = 52", () => {
    expect(days.map((d) => d.km)).toEqual([9, 10, 18, 15]);
    expect(days[days.length - 1].kmAcc).toBe(52);
  });

  it("tem pontos a cerca de 30 m e fica leve", () => {
    const pts = route.route as LngLat[];
    const gaps = pts.slice(1).map((p, i) => haversine(pts[i], p));
    const median = [...gaps].sort((a, b) => a - b)[Math.floor(gaps.length / 2)];
    expect(median).toBeGreaterThan(28);
    expect(median).toBeLessThan(32);
    expect(JSON.stringify(route).length).toBeLessThan(100 * 1024);
  });

  it("encadeia os dias sem buraco e termina no último ponto", () => {
    route.days.forEach((d, i) => {
      if (i > 0) expect(d.startIdx).toBe(route.days[i - 1].endIdx);
      expect(d.endIdx).toBeGreaterThan(d.startIdx);
    });
    expect(route.days[route.days.length - 1].endIdx).toBe(route.route.length - 1);
  });

  it("marca 3 pernoites, a saída em Atins e a chegada em Santo Amaro", () => {
    expect(route.stops.map((s) => s.kind)).toEqual(["start", "night", "night", "night", "end"]);
    expect(route.stops[0].name).toBe("Atins");
    expect(route.stops[4].name).toBe("Santo Amaro");
  });
});

describe("geometria", () => {
  const track = buildTrack([
    [0, 0],
    [0.01, 0],
    [0.02, 0],
  ]);

  it("acha o ponto no meio do traçado", () => {
    const [lon, lat] = pointAt(track, track.length / 2);
    expect(lon).toBeCloseTo(0.01, 6);
    expect(lat).toBeCloseTo(0, 6);
  });

  it("prende a distância nas pontas", () => {
    expect(pointAt(track, -50)).toEqual([0, 0]);
    expect(pointAt(track, track.length + 50)).toEqual([0.02, 0]);
  });

  it("dá rumo leste para um caminho que vai para leste", () => {
    expect(smoothBearing(track, track.length / 2, 400)).toBeCloseTo(90, 0);
  });

  it("gira pelo caminho mais curto", () => {
    expect(angleDelta(350, 10)).toBe(20);
    expect(angleDelta(10, 350)).toBe(-20);
    expect(lerpAngle(350, 10, 0.5)).toBeCloseTo(0, 6);
  });
});

describe("linha do tempo", () => {
  const tl = buildTimeline(4);

  it("dura entre 60 e 90 s", () => {
    expect(tl.duration).toBeGreaterThanOrEqual(60);
    expect(tl.duration).toBeLessThanOrEqual(90);
  });

  it("gasta mais tempo parado do que andando", () => {
    expect(TIMING.stop).toBeGreaterThan(TIMING.walk);
  });

  it("começa na abertura e acaba no encerramento", () => {
    expect(frameAt(tl, 0).phase.kind).toBe("intro");
    expect(frameAt(tl, tl.duration).phase.kind).toBe("outro");
    expect(frameAt(tl, tl.duration + 10).u).toBe(1);
  });

  it("pula para o início de cada dia", () => {
    for (let d = 0; d < 4; d++) {
      const f = frameAt(tl, dayStart(tl, d));
      expect(f.phase).toMatchObject({ kind: "walk", day: d });
      expect(frameAt(tl, stopStart(tl, d)).phase).toMatchObject({ kind: "stop", day: d });
    }
  });

  it("caminha do zero ao dia completo, e os dias seguintes esperam", () => {
    const start = dayStart(tl, 1);
    expect(walkFraction(frameAt(tl, start), 1)).toBeCloseTo(0, 6);
    expect(walkFraction(frameAt(tl, start + TIMING.walk / 2), 1)).toBeCloseTo(0.5, 6);
    expect(walkFraction(frameAt(tl, stopStart(tl, 1)), 1)).toBe(1);
    expect(walkFraction(frameAt(tl, start), 2)).toBe(0);
    expect(walkFraction(frameAt(tl, start), 0)).toBe(1);
  });
});
