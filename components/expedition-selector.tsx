"use client";

import { motion } from "framer-motion";
import type { Expedition } from "@/lib/expeditions";

interface Props {
  expeditions: Expedition[];
  activeId: string;
  onChange: (id: string) => void;
}

function groupByDestination(expeditions: Expedition[]) {
  const map = new Map<string, Expedition[]>();
  for (const exp of expeditions) {
    if (!map.has(exp.title1)) map.set(exp.title1, []);
    map.get(exp.title1)!.push(exp);
  }
  return Array.from(map.entries());
}

export default function ExpeditionSelector({ expeditions, activeId, onChange }: Props) {
  const groups = groupByDestination(expeditions);
  const activeExp = expeditions.find((e) => e.id === activeId)!;
  const activeDestination = activeExp.title1;
  const activeGroup = groups.find(([dest]) => dest === activeDestination)![1];

  function handleDestinationClick(dest: string) {
    const group = groups.find(([d]) => d === dest)![1];
    // Select first expedition of that destination
    onChange(group[0].id);
  }

  return (
    <div
      style={{
        background: "rgba(14,12,10,.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,.05)",
      }}
    >
      {/* ── ROW 1: Roteiro ── */}
      <div
        className="flex items-center px-10"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          borderBottom: "1px solid rgba(255,255,255,.04)",
          gap: 0,
        }}
      >
        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[.2em] transition-colors group mr-8"
          style={{ color: "#4C4440", background: "none", border: "none", cursor: "pointer", padding: "12px 0" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#887E76")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#4C4440")}
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          Voltar
        </button>

        {/* Label */}
        <span
          className="text-[9px] uppercase tracking-[.22em] mr-4"
          style={{ color: "#38302C" }}
        >
          Roteiro
        </span>

        {/* Destination tabs */}
        {groups.map(([dest, exps]) => {
          const isActive = dest === activeDestination;
          return (
            <button
              key={dest}
              onClick={() => handleDestinationClick(dest)}
              className="relative flex items-center gap-2.5 px-5 py-3 text-xs font-medium tracking-wide transition-colors"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isActive ? "#E6DDD4" : "#4C4440",
                borderBottom: isActive ? "2px solid #C8905A" : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              <span className="font-bold uppercase tracking-wider text-[11px]">{dest}</span>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-widest"
                style={{
                  background: isActive ? "rgba(200,144,90,.15)" : "rgba(255,255,255,.04)",
                  color: isActive ? "#C8905A" : "#38302C",
                }}
              >
                {exps[0].country}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── ROW 2: Dias ── */}
      <div
        className="flex items-center gap-3 px-10 py-2.5"
        style={{ maxWidth: 1280, margin: "0 auto" }}
      >
        <span
          className="text-[9px] uppercase tracking-[.22em] mr-1"
          style={{ color: "#38302C" }}
        >
          Duração
        </span>

        {activeGroup.map((exp) => {
          const isActive = exp.id === activeId;
          return (
            <button
              key={exp.id}
              onClick={() => onChange(exp.id)}
              className="relative flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-medium transition-all"
              style={{
                background: isActive ? "rgba(200,144,90,.15)" : "rgba(255,255,255,.04)",
                border: isActive ? "1px solid rgba(200,144,90,.4)" : "1px solid rgba(255,255,255,.06)",
                color: isActive ? "#C8905A" : "#60584E",
                cursor: "pointer",
              }}
            >
              <span className="font-bold">{exp.stats.days}</span>
              <span>Dias</span>
              {isActive && (
                <motion.span
                  layoutId="activeDot"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C8905A]"
                />
              )}
            </button>
          );
        })}

        {/* Spacer + stats */}
        <div className="ml-auto flex items-center gap-3 text-[10px]" style={{ color: "#38302C" }}>
          <span>{activeExp.stats.distance}</span>
          <span>·</span>
          <span>{activeExp.stats.altOrTemp}</span>
          <span>·</span>
          <span>
            {"▪".repeat(activeExp.stats.difficulty)}{"▫".repeat(5 - activeExp.stats.difficulty)}
          </span>
        </div>
      </div>
    </div>
  );
}
