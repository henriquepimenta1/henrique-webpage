"use client";

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { Expedition } from "@/lib/expeditions";

const TerrainMap = dynamic(() => import("./terrain-map"), { ssr: false });

interface Props {
  expedition: Expedition;
  onClose: () => void;
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="text-[#C8905A]">
      {"★".repeat(value)}
      <span className="text-[#2B2420]">{"★".repeat(5 - value)}</span>
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "#141210", border: "1px solid #1E1B17" }}
    >
      <p className="text-[9px] uppercase tracking-[.18em] mb-1.5" style={{ color: "#4C4440" }}>
        {label}
      </p>
      <p className="font-display text-xl font-bold leading-none" style={{ color: "#C8B9AC" }}>
        {value}
      </p>
    </div>
  );
}

function CheckList({ items, type }: { items: string[]; type: "included" | "excluded" }) {
  const isIncluded = type === "included";
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{
              background: isIncluded ? "rgba(200,144,90,.15)" : "rgba(255,255,255,.04)",
              color: isIncluded ? "#C8905A" : "#4C4440",
              border: isIncluded ? "1px solid rgba(200,144,90,.3)" : "1px solid #2B2420",
            }}
          >
            {isIncluded ? "✓" : "×"}
          </span>
          <span className="text-sm leading-relaxed" style={{ color: isIncluded ? "#887E76" : "#4C4440" }}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function ExpeditionDetail({ expedition, onClose }: Props) {
  const whatsappText = encodeURIComponent(
    `Olá! Tenho interesse em agendar a expedição Lençóis Maranhenses ${expedition.stats.days} Dias. Podemos conversar?`
  );

  return (
    <AnimatePresence>
      <motion.section
        key={expedition.id + "-detail"}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative"
        style={{ background: "#0E0C0A", borderTop: "1px solid #1E1B17" }}
      >
        {/* Close bar */}
        <div
          className="flex items-center justify-between px-10 py-5 border-b"
          style={{ borderColor: "#1E1B17" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "#4C4440" }}>
              {expedition.index}
            </span>
            <h2 className="font-display text-lg font-bold tracking-tight" style={{ color: "#E6DDD4" }}>
              {expedition.title1} {expedition.title2}
            </h2>
            <span
              className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(200,144,90,.15)",
                color: "#C8905A",
                border: "1px solid rgba(200,144,90,.3)",
              }}
            >
              Expedição Real
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#4C4440] hover:text-[#E6DDD4] transition-colors text-sm px-3 py-1 rounded-full"
            style={{ border: "1px solid #2B2420" }}
          >
            Fechar ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-10 py-10" style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* ── ROW 1: Description + Map ── */}
          <div className="grid grid-cols-2 gap-12 items-start mb-12">

            {/* LEFT */}
            <div>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "#887E76", lineHeight: 1.85 }}
              >
                {expedition.description}
              </p>

              <blockquote
                className="border-l-2 pl-4 mb-8 italic text-sm leading-relaxed"
                style={{ borderColor: "#C8905A", color: "#60584E" }}
              >
                {expedition.quote}
              </blockquote>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Duração" value={`${expedition.stats.days} dias`} />
                <StatCard label="Distância" value={expedition.stats.distance} />
                <StatCard label={expedition.stats.altOrTempLabel} value={expedition.stats.altOrTemp} />
                <StatCard label="Tipo" value={expedition.stats.type} />
                <StatCard label="Dificuldade" value={<StarRating value={expedition.stats.difficulty} />} />
                <StatCard label="País" value={expedition.country} />
              </div>
            </div>

            {/* RIGHT: terrain map */}
            <div>
              <p
                className="text-[10px] uppercase tracking-[.2em] mb-3"
                style={{ color: "#4C4440" }}
              >
                Rota — {expedition.location}, {expedition.country}
              </p>
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  height: 380,
                  border: "1px solid #1E1B17",
                  boxShadow: "0 8px 40px rgba(0,0,0,.4)",
                }}
              >
                <TerrainMap expedition={expedition} />
              </div>
              <p className="text-[10px] mt-2 text-right" style={{ color: "#3A3028" }}>
                Tiles © Esri · Dados aproximados
              </p>

              {/* GPX notice */}
              <div
                className="mt-4 flex items-start gap-3 rounded-xl p-4"
                style={{ background: "rgba(200,144,90,.08)", border: "1px solid rgba(200,144,90,.2)" }}
              >
                <span className="text-[#C8905A] text-lg leading-none mt-0.5">↓</span>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-[#C8905A] mb-1">
                    GPX em breve
                  </p>
                  <p className="text-xs text-[#746A62] leading-relaxed">
                    O ficheiro GPX real da travessia será adicionado assim que disponível.
                    A rota atual é uma aproximação.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── ROW 2: Included / Not included ── */}
          <div
            className="grid grid-cols-2 gap-8 py-10"
            style={{ borderTop: "1px solid #1E1B17", borderBottom: "1px solid #1E1B17" }}
          >
            {/* Incluído */}
            <div>
              <p className="text-[10px] uppercase tracking-[.22em] mb-5" style={{ color: "#4C4440" }}>
                O que está incluído
              </p>
              <CheckList items={expedition.included} type="included" />
            </div>

            {/* Não incluído */}
            <div>
              <p className="text-[10px] uppercase tracking-[.22em] mb-5" style={{ color: "#4C4440" }}>
                O que não está incluído
              </p>
              <CheckList items={expedition.notIncluded} type="excluded" />
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="py-12 flex flex-col items-center text-center gap-6">
            <div>
              <p
                className="text-[10px] uppercase tracking-[.28em] mb-3"
                style={{ color: "#4C4440" }}
              >
                Pronto para partir?
              </p>
              <h3
                className="font-display text-2xl font-bold tracking-tight mb-2"
                style={{ color: "#E6DDD4" }}
              >
                Fale comigo e agende esta viagem
              </h3>
              <p className="text-sm" style={{ color: "#60584E" }}>
                Lençóis Maranhenses · {expedition.stats.days} Dias · {expedition.stats.distance}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/35799123456?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                style={{
                  background: "#E6DDD4",
                  color: "#0E0C0A",
                }}
              >
                WhatsApp
                <span>→</span>
              </a>
              <a
                href={`mailto:management@henriq.eu?subject=Expedição Lençóis ${expedition.stats.days} Dias&body=${whatsappText}`}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.08)",
                  color: "#887E76",
                }}
              >
                E-mail
              </a>
            </div>

            <p className="text-[11px]" style={{ color: "#3A3028" }}>
              Resposta em menos de 24h · management@henriq.eu
            </p>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
