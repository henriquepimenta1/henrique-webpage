"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";
import type { Expedition } from "@/lib/expeditions";

interface Props {
  expedition: Expedition;
}

export default function ExpeditionGlobe({ expedition }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);

  const phiRef        = useRef(0);
  const thetaRef      = useRef(0.3);
  const targetPhiRef  = useRef(0);
  const frozenRef     = useRef(false);          // true once globe stops at target
  const dragOffsetRef = useRef({ phi: 0, theta: 0 });
  const pointerRef    = useRef<{ x: number; y: number } | null>(null);
  const isPausedRef   = useRef(false);
  const animIdRef     = useRef<number>(0);

  const lngToPhi = (lng: number) => -lng * (Math.PI / 180);

  // ── Spawn a globe instance ───────────────────────────────────────
  function spawnGlobe(canvas: HTMLCanvasElement, exp: Expedition, keepPhi: boolean) {
    if (globeRef.current) { globeRef.current.destroy(); globeRef.current = null; }
    cancelAnimationFrame(animIdRef.current);

    const size = canvas.offsetWidth;
    if (size === 0) return;

    if (!keepPhi) {
      // First load: start from the opposite side so the intro spin is visible
      phiRef.current = lngToPhi(exp.centerLng) + Math.PI;
    }
    targetPhiRef.current = lngToPhi(exp.centerLng);
    frozenRef.current = false;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: size, height: size,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 1.1,
      mapSamples: 20000,
      mapBrightness: 5,
      baseColor:   [0.14, 0.11, 0.09],
      markerColor: [0.78, 0.56, 0.35],
      glowColor:   [0.35, 0.18, 0.06],
      opacity: 0.9,
      markers: [{ location: [exp.centerLat, exp.centerLng], size: 0.08 }],
    });
    globeRef.current = globe;

    function animate() {
      if (!isPausedRef.current) {
        if (!frozenRef.current) {
          const diff = targetPhiRef.current - phiRef.current;
          if (Math.abs(diff) > 0.003) {
            // Spin toward target (eased)
            phiRef.current += diff * 0.045;
          } else {
            // Reached target — mark done and keep slow auto-rotation
            phiRef.current = targetPhiRef.current;
            frozenRef.current = true;
          }
        } else {
          // Slow continuous rotation after reaching target
          phiRef.current += 0.003;
        }
      }

      globe.update({
        phi:   phiRef.current   + dragOffsetRef.current.phi,
        theta: thetaRef.current + dragOffsetRef.current.theta,
      });
      animIdRef.current = requestAnimationFrame(animate);
    }
    animate();
    requestAnimationFrame(() => { canvas.style.opacity = "1"; });
  }

  // ── Mount ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (canvas.offsetWidth > 0) {
      spawnGlobe(canvas, expedition, false);
    } else {
      const ro = new ResizeObserver((entries) => {
        if ((entries[0]?.contentRect.width ?? 0) > 0) {
          ro.disconnect();
          spawnGlobe(canvas, expedition, false);
        }
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }
    return () => {
      cancelAnimationFrame(animIdRef.current);
      globeRef.current?.destroy();
      globeRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Expedition changed → new spin-to-freeze ──────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.offsetWidth === 0) return;
    spawnGlobe(canvas, expedition, true); // keepPhi: continuous, no jump
  }, [expedition.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Drag ─────────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerRef.current = { x: e.clientX, y: e.clientY };
    isPausedRef.current = true;
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerRef.current) {
      phiRef.current   += dragOffsetRef.current.phi;
      thetaRef.current += dragOffsetRef.current.theta;
      dragOffsetRef.current = { phi: 0, theta: 0 };
      // After drag, freeze at wherever the user left it
      targetPhiRef.current = phiRef.current;
      frozenRef.current = true;
    }
    pointerRef.current = null;
    isPausedRef.current = false;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!pointerRef.current) return;
      dragOffsetRef.current = {
        phi:   (e.clientX - pointerRef.current.x) / 280,
        theta: (e.clientY - pointerRef.current.y) / 900,
      };
    };
    window.addEventListener("pointermove", onMove,       { passive: true });
    window.addEventListener("pointerup",   handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   handlePointerUp);
    };
  }, [handlePointerUp]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%", height: "100%",
          cursor: "grab", opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      <div
        className="absolute left-0 right-0 flex flex-col items-center gap-0.5 pointer-events-none"
        style={{ bottom: -30 }}
      >
        <p className="text-[10px] uppercase tracking-[.2em] font-medium" style={{ color: "#60584E" }}>
          {expedition.country}
        </p>
        <p style={{ color: "#746A62", fontSize: 11 }}>{expedition.location}</p>
      </div>
    </div>
  );
}
