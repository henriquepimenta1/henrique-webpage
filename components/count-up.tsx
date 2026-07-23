"use client";
import { useEffect, useRef, useState } from "react";

// Anima um número (count-up) quando entra na viewport. Aceita o valor já
// formatado (ex.: "15.458", "194k", "55,8k", "28,8%", "~6.468") e preserva
// prefixo/sufixo, casas decimais e agrupamento pt-BR.
interface Parsed {
  prefix: string;
  suffix: string;
  target: number;
  decimals: number;
}

function parse(value: string): Parsed {
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
  const suffix = value.match(/[^0-9]*$/)?.[0] ?? "";
  const core = value.slice(prefix.length, value.length - suffix.length);
  const decimals = core.includes(",") ? core.split(",")[1].length : 0;
  const target = parseFloat(core.replace(/\./g, "").replace(",", "."));
  return { prefix, suffix, target: Number.isFinite(target) ? target : 0, decimals };
}

function fmt(n: number, decimals: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export default function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const { prefix, suffix, target, decimals } = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => `${prefix}${fmt(0, decimals)}${suffix}`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const final = `${prefix}${fmt(target, decimals)}${suffix}`;
    if (reduce || !("IntersectionObserver" in window)) {
      setDisplay(final);
      return;
    }
    let raf = 0;
    let started = false;
    const run = (t0: number) => {
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(`${prefix}${fmt(target * eased, decimals)}${suffix}`);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            raf = requestAnimationFrame(run);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [prefix, suffix, target, decimals, duration]);

  return <span ref={ref}>{display}</span>;
}
