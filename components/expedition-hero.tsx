"use client";

import { useRef } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { Expedition } from "@/lib/expeditions";

const ExpeditionGlobe = dynamic(() => import("./expedition-globe"), { ssr: false });

interface Props {
  expedition: Expedition;
  expeditions: Expedition[];
  activeId: string;
  onChangeExpedition: (id: string) => void;
  onExpand: () => void;
  isExpanded: boolean;
}

export default function ExpeditionHero({
  expedition,
  expeditions,
  activeId,
  onChangeExpedition,
  onExpand,
  isExpanded,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height: "100svh", minHeight: 600 }}
    >
      {/* Dark base */}
      <div className="absolute inset-0" style={{ background: "#0E0C0A" }} />

      {/* Hero photo background */}
      {expedition.heroImage && (
        <div
          key={expedition.id + "-photo"}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${expedition.heroImage})`,
            opacity: 0.45,
          }}
        />
      )}

      {/* Shader overlay (subtle, blends with photo) */}
      <MeshGradient
        key={expedition.id + "-gradient"}
        className="absolute inset-0 w-full h-full"
        colors={expedition.gradientColors}
        speed={0.25}
        style={{ opacity: 0.35 } as object}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(14,12,10,.55) 0%, rgba(14,12,10,.1) 50%, rgba(14,12,10,.5) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent 0%, #0E0C0A 100%)" }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-end">
        <div
          className="w-full flex items-end justify-between px-10 pb-16 gap-12"
          style={{ maxWidth: 1280, margin: "0 auto" }}
        >
          {/* LEFT */}
          <div className="flex-1 max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={expedition.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Eyebrow */}
                <p
                  className="text-[10px] uppercase tracking-[.24em] mb-4 font-medium"
                  style={{ color: "#60584E" }}
                >
                  {expedition.index} &mdash; {expedition.location} · {expedition.year}
                </p>

                {/* Title */}
                <h1 className="leading-none mb-2">
                  <span
                    className="font-script block"
                    style={{
                      fontSize: "clamp(3.4rem, 8.5vw, 7.5rem)",
                      color: "#C8B9AC",
                      lineHeight: 1.05,
                    }}
                  >
                    {expedition.title1}
                  </span>
                  <span
                    className="font-display block"
                    style={{
                      fontSize: "clamp(2.8rem, 7vw, 6rem)",
                      color: "#E6DDD4",
                      letterSpacing: "-0.03em",
                      lineHeight: 0.95,
                    }}
                  >
                    {expedition.title2}
                  </span>
                </h1>

                {/* Tagline */}
                <p className="text-sm mb-5 leading-relaxed" style={{ color: "#887E76" }}>
                  {expedition.tagline}
                </p>

                {/* Package switcher */}
                <div className="flex items-center gap-2 mb-7">
                  <span
                    className="text-[9px] uppercase tracking-[.2em] mr-1"
                    style={{ color: "#4C4440" }}
                  >
                    Pacote
                  </span>
                  {expeditions.map((exp) => {
                    const isActive = exp.id === activeId;
                    return (
                      <button
                        key={exp.id}
                        onClick={() => onChangeExpedition(exp.id)}
                        className="relative px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all"
                        style={{
                          background: isActive ? "rgba(200,144,90,.15)" : "rgba(255,255,255,.05)",
                          border: isActive ? "1px solid rgba(200,144,90,.4)" : "1px solid rgba(255,255,255,.08)",
                          color: isActive ? "#C8905A" : "#60584E",
                        }}
                      >
                        {exp.stats.days} Dias
                        {isActive && (
                          <motion.span
                            layoutId="pkgDot"
                            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C8905A]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-5 mb-8">
                  {[
                    { label: "Dias", value: expedition.stats.days },
                    { label: "Distância", value: expedition.stats.distance },
                    { label: expedition.stats.altOrTempLabel, value: expedition.stats.altOrTemp },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col gap-1">
                      <span
                        className="text-[9px] uppercase tracking-[.18em]"
                        style={{ color: "#4C4440" }}
                      >
                        {s.label}
                      </span>
                      <span className="text-sm font-medium" style={{ color: "#B2A89E" }}>
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={onExpand}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: isExpanded ? "rgba(200,144,90,.2)" : "rgba(230,221,212,1)",
                    color: isExpanded ? "#C8905A" : "#0E0C0A",
                    border: isExpanded ? "1px solid rgba(200,144,90,.4)" : "none",
                  }}
                >
                  {isExpanded ? (
                    <>Fechar informações <span className="transition-transform group-hover:-translate-y-0.5">↑</span></>
                  ) : (
                    <>+ mais informações <span className="transition-transform group-hover:translate-y-0.5">↓</span></>
                  )}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: globe */}
          <AnimatePresence mode="wait">
            <motion.div
              key={expedition.id + "-globe"}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex-shrink-0"
              style={{
                width: "clamp(200px, 22vw, 320px)",
                height: "clamp(200px, 22vw, 320px)",
                paddingBottom: 40,
              }}
            >
              <ExpeditionGlobe expedition={expedition} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Ghost index */}
      <div
        className="absolute top-[80px] right-10 font-display font-extrabold pointer-events-none select-none"
        style={{
          fontSize: "clamp(120px, 18vw, 220px)",
          color: "rgba(230,221,212,.04)",
          lineHeight: 1,
          letterSpacing: "-.03em",
        }}
      >
        {expedition.index}
      </div>
    </section>
  );
}
