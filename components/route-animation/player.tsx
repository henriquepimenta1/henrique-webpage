"use client";

// Só é carregado depois do clique (next/dynamic, ssr:false): é aqui que
// entram o MapLibre, o traçado completo e a fonte manuscrita.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Nanum_Pen_Script } from "next/font/google";

import route from "@/content/lencois-route.json";
import { buildTrack, type LngLat } from "./geo";
import { buildTimeline, dayStart, frameAt, type Timeline } from "./timeline";
import { camAt, stopCam, walkZoomFor, type Cam, type CameraContext } from "./camera";
import { drawScene, type SceneDay, type SceneStop, type StaticView } from "./scene";
import { buildMapStyle } from "./map-style";
import styles from "./route-animation.module.css";

const pen = Nanum_Pen_Script({ weight: "400", subsets: ["latin"], display: "swap", preload: false });

const TRACK = buildTrack(route.route as LngLat[]);
const TIMELINE: Timeline = buildTimeline(route.days.length);
const STOPS: SceneStop[] = route.stops.map((s) => ({
  kind: s.kind as SceneStop["kind"],
  name: s.name,
  night: s.night ?? null,
  lngLat: [s.lon, s.lat],
}));
const OVERVIEW_PITCH = 40;

export interface PlayerProps {
  reducedMotion: boolean;
  dayColors: readonly string[];
  /** Pedido de ir a um dia; `nonce` muda a cada clique, mesmo no mesmo dia. */
  seek: { day: number; nonce: number } | null;
  onActiveDay: (day: number) => void;
  ctaHref: string;
  ctaLabel: string;
  title: string;
  subtitle: string;
}

function pixelRatioCap(): number {
  const small = window.matchMedia("(max-width: 640px), (pointer: coarse)").matches;
  return Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
}

/** O canvas não entende var(--x): resolve o token do site para a cor real. */
function resolveColor(color: string): string {
  const m = /^var\((--[\w-]+)\)$/.exec(color.trim());
  if (!m) return color;
  return getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() || "#A6542B";
}

const fmtKm = (v: number): string => v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function RoutePlayer(props: PlayerProps) {
  const { reducedMotion, dayColors, seek, onActiveDay, ctaHref, ctaLabel, title, subtitle } = props;
  const frameRef = useRef<HTMLDivElement>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const camCtx = useRef<CameraContext | null>(null);
  const timeRef = useRef(0);
  const playingRef = useRef(false);
  const autoPaused = useRef(false);
  const staticView = useRef<StaticView>({ kind: "overview" });
  const activeRef = useRef(-2);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0, compact: false });
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [ready, setReady] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const ctaRef = useRef(false);

  const days: SceneDay[] = useMemo(
    () => route.days.map((d, i) => ({ ...d, color: resolveColor(dayColors[i] ?? "var(--rust)") })),
    [dayColors],
  );
  const daysRef = useRef(days);
  useEffect(() => {
    daysRef.current = days;
  }, [days]);

  const setActive = useCallback(
    (d: number) => {
      if (activeRef.current === d) return;
      activeRef.current = d;
      onActiveDay(d);
    },
    [onActiveDay],
  );

  /** Desenha as anotações para o estado atual. Chamado a cada render do mapa. */
  const draw = useCallback(() => {
    const map = mapRef.current;
    const canvas = canvasRef.current;
    if (!map || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h, compact } = sizeRef.current;
    const ratio = canvas.width / Math.max(w, 1);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const screen = TRACK.points.map((p) => map.project(p));
    const last = daysRef.current[daysRef.current.length - 1];
    drawScene(
      {
        ctx,
        width: w,
        height: h,
        font: pen.style.fontFamily,
        compact,
        screen,
        project: (ll) => map.project(ll),
        days: daysRef.current,
        stops: STOPS,
        title,
        subtitle,
        totals: `${last.kmAcc} km`,
        totalsSub: `${daysRef.current.length} dias · ${STOPS.filter((s) => s.kind === "night").length} noites`,
      },
      reducedMotion
        ? { kind: "static", view: staticView.current }
        : { kind: "animated", frame: frameAt(TIMELINE, timeRef.current) },
    );
  }, [reducedMotion, title, subtitle]);

  /** Posiciona a câmera e o HUD no tempo atual. */
  const renderAt = useCallback(
    (t: number) => {
      const map = mapRef.current;
      const cc = camCtx.current;
      if (!map || !cc) return;
      timeRef.current = t;
      const frame = frameAt(TIMELINE, t);
      const cam: Cam = camAt(cc, TIMELINE, frame);
      map.jumpTo({ center: cam.center, zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing });
      map.triggerRepaint();
      const day = frame.phase.day;
      setActive(day);
      const cta = frame.phase.kind === "outro" && frame.local > 2.5;
      if (cta !== ctaRef.current) {
        ctaRef.current = cta;
        setShowCta(cta);
      }
      if (rangeRef.current) rangeRef.current.value = String(t / TIMELINE.duration);
      if (hudRef.current) {
        const all = daysRef.current;
        const total = all[all.length - 1].kmAcc;
        if (day < 0) {
          hudRef.current.textContent = frame.phase.kind === "outro" ? `${total} km · ${all.length} dias` : `${total} km`;
        } else {
          const d = all[day];
          const walked = frame.phase.kind === "walk" ? d.km * frame.u : d.km;
          hudRef.current.textContent = `Dia ${d.n} de ${all.length} · km ${fmtKm(d.kmAcc - d.km + walked)} / ${total}`;
        }
      }
    },
    [setActive],
  );

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  const loop = useCallback(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const next = timeRef.current + dt;
      if (next >= TIMELINE.duration) {
        renderAt(TIMELINE.duration);
        playingRef.current = false;
        setPlaying(false);
        setEnded(true);
        rafRef.current = 0;
        return;
      }
      renderAt(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [renderAt]);

  const play = useCallback(() => {
    if (reducedMotion || !mapRef.current) return;
    if (timeRef.current >= TIMELINE.duration) timeRef.current = 0;
    playingRef.current = true;
    autoPaused.current = false;
    setPlaying(true);
    setEnded(false);
    if (!rafRef.current) loop();
  }, [loop, reducedMotion]);

  const pause = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    stopLoop();
  }, [stopLoop]);

  const restart = useCallback(() => {
    timeRef.current = 0;
    renderAt(0);
    play();
  }, [play, renderAt]);

  /** Recalcula tamanho, canvas e enquadramento geral. */
  const layout = useCallback(() => {
    const map = mapRef.current;
    const el = frameRef.current;
    const canvas = canvasRef.current;
    if (!map || !el || !canvas) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    const compact = w < 560;
    sizeRef.current = { w, h, compact };
    const ratio = pixelRatioCap();
    canvas.width = Math.round(w * ratio);
    canvas.height = Math.round(h * ratio);
    map.resize();
    const portrait = h > w;
    const bearing = portrait ? 270 : 0;
    const pad = compact
      ? { top: h * 0.26, bottom: h * 0.16, left: 24, right: 24 }
      : { top: h * 0.24, bottom: h * 0.16, left: w * 0.06, right: w * 0.06 };
    const fit = map.cameraForBounds(route.bounds as [LngLat, LngLat], { padding: pad, bearing });
    const center = fit?.center ? maplibregl.LngLat.convert(fit.center) : maplibregl.LngLat.convert(TRACK.points[0]);
    const lat = center.lat;
    const overview: Cam = {
      center: [center.lng, lat],
      // Com a inclinação, o lado de perto cresce; no retrato o traçado já é
      // estreito e cabe sem recuar.
      zoom: (fit?.zoom ?? 10) - (portrait ? 0 : 0.3),
      pitch: OVERVIEW_PITCH,
      bearing,
    };
    const d = daysRef.current;
    camCtx.current = {
      track: TRACK,
      overview,
      walkZoom: walkZoomFor(w, lat),
      days: d.map((day, i) => ({
        from: TRACK.cum[day.startIdx],
        to: TRACK.cum[day.endIdx],
        stop: STOPS[i + 1].lngLat,
      })),
    };
  }, []);

  /** No modo estático, mostra a visão geral ou um dia, sem voo. */
  const showStatic = useCallback(
    (view: StaticView) => {
      const map = mapRef.current;
      const cc = camCtx.current;
      if (!map || !cc) return;
      staticView.current = view;
      const cam = view.kind === "overview" ? cc.overview : stopCam(cc, view.day, 0);
      map.jumpTo({ center: cam.center, zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing });
      map.triggerRepaint();
      setActive(view.kind === "overview" ? -1 : view.day);
    },
    [setActive],
  );

  // Cria o mapa uma vez.
  useEffect(() => {
    const container = mapEl.current;
    if (!container) return;
    const map = new maplibregl.Map({
      container,
      style: buildMapStyle(process.env.NEXT_PUBLIC_MAPBOX_TOKEN),
      interactive: false,
      attributionControl: false,
      pixelRatio: pixelRatioCap(),
      fadeDuration: 0,
      center: TRACK.points[0],
      zoom: 10,
    });
    mapRef.current = map;
    // No topo: embaixo ficam os controles. A atribuição tem de ficar visível.
    map.addControl(new maplibregl.AttributionControl({ compact: false }), "top-right");
    map.on("render", draw);
    let cancelled = false;
    map.once("load", async () => {
      layout();
      try {
        await document.fonts.load(`40px ${pen.style.fontFamily}`);
      } catch {
        // Sem a fonte, o canvas cai na fonte reserva; a animação segue.
      }
      if (cancelled) return;
      setReady(true);
    });
    return () => {
      cancelled = true;
      stopLoop();
      map.remove();
      mapRef.current = null;
    };
  }, [draw, layout, stopLoop]);

  // Primeira imagem: estática ou já tocando.
  useEffect(() => {
    if (!ready) return;
    if (reducedMotion) showStatic(seek ? { kind: "stop", day: seek.day } : { kind: "overview" });
    else {
      renderAt(seek ? dayStart(TIMELINE, seek.day) : 0);
      play();
    }
    // Só no primeiro quadro; os cliques seguintes caem no efeito abaixo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Clique num dia da lista.
  const lastNonce = useRef<number | null>(seek?.nonce ?? null);
  useEffect(() => {
    if (!ready || !seek || seek.nonce === lastNonce.current) return;
    lastNonce.current = seek.nonce;
    if (reducedMotion) showStatic({ kind: "stop", day: seek.day });
    else {
      renderAt(dayStart(TIMELINE, seek.day));
      play();
    }
  }, [seek, ready, reducedMotion, renderAt, play, showStatic]);

  // Redimensionamento.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || !ready) return;
    const ro = new ResizeObserver(() => {
      layout();
      if (reducedMotion) showStatic(staticView.current);
      else renderAt(timeRef.current);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ready, layout, reducedMotion, renderAt, showStatic]);

  // Pausa fora da tela ou com a aba oculta; retoma se tinha sido pausa automática.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || reducedMotion) return;
    let visible = true;
    const sync = () => {
      const shouldRun = visible && document.visibilityState === "visible";
      if (!shouldRun && playingRef.current) {
        autoPaused.current = true;
        pause();
      } else if (shouldRun && autoPaused.current) {
        play();
      }
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    }, { threshold: 0.2 });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reducedMotion, pause, play]);

  const onScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value) * TIMELINE.duration;
    setEnded(t >= TIMELINE.duration);
    renderAt(t);
  };

  return (
    <div ref={frameRef} className={styles.stage}>
      <div ref={mapEl} className={styles.map} />
      <canvas ref={canvasRef} className={styles.notes} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      {!reducedMotion && <div ref={hudRef} className={styles.hud} aria-hidden="true" />}
      {(showCta || ended || reducedMotion) && (
        <a className={styles.cta} href={ctaHref} target="_blank" rel="noopener noreferrer">
          {ctaLabel}
        </a>
      )}
      {!reducedMotion && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.ctrlBtn}
            onClick={playing ? pause : play}
            aria-label={playing ? "Pausar animação do roteiro" : "Tocar animação do roteiro"}
          >
            {playing ? "❚❚" : "▶"}
          </button>
          <button type="button" className={styles.ctrlBtn} onClick={restart} aria-label="Repetir animação do início">
            ↺
          </button>
          <input
            ref={rangeRef}
            className={styles.range}
            type="range"
            min={0}
            max={1}
            step={0.001}
            defaultValue={0}
            onChange={onScrub}
            aria-label="Progresso da animação"
          />
        </div>
      )}
    </div>
  );
}
