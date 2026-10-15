"use client";

// Roteiro animado dos Lençóis. Antes do clique é só uma imagem, um botão e
// a lista de dias — nada de MapLibre no JS da página.

import { useCallback, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

import days from "@/content/lencois-route-days.json";
import styles from "./route-animation.module.css";

const RoutePlayer = dynamic(() => import("./player"), {
  ssr: false,
  loading: () => <p className={styles.loading}>carregando o mapa…</p>,
});

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void): () => void {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export interface RouteAnimationProps {
  /** Cor de cada dia, na ordem — a mesma do roteiro da página. */
  dayColors: readonly string[];
  ctaHref: string;
  ctaLabel: string;
  posterUltra: string;
  posterWide: string;
  posterTall: string;
  title: string;
  subtitle: string;
}

export default function RouteAnimation(props: RouteAnimationProps) {
  const { dayColors, ctaHref, ctaLabel, posterUltra, posterWide, posterTall, title, subtitle } = props;
  const reducedMotion = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
  const [started, setStarted] = useState(false);
  const [seek, setSeek] = useState<{ day: number; nonce: number } | null>(null);
  const [active, setActive] = useState(-1);

  const goToDay = useCallback((day: number) => {
    setStarted(true);
    setSeek((prev) => ({ day, nonce: (prev?.nonce ?? 0) + 1 }));
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.frame}>
        {started ? (
          <RoutePlayer
            reducedMotion={reducedMotion}
            dayColors={dayColors}
            seek={seek}
            onActiveDay={setActive}
            ctaHref={ctaHref}
            ctaLabel={ctaLabel}
            title={title}
            subtitle={subtitle}
          />
        ) : (
          <>
            <picture>
              <source media="(max-width: 640px)" srcSet={posterTall} />
              <source media="(max-width: 1023px)" srcSet={posterWide} />
              <img
                className={styles.poster}
                src={posterUltra}
                alt="Mapa da travessia dos Lençóis Maranhenses, de Atins a Santo Amaro, com os três pernoites marcados"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <button type="button" className={styles.start} onClick={() => setStarted(true)}>
              <span className={styles.startIcon} aria-hidden="true">
                ▶
              </span>
              Ver o roteiro dia a dia
            </button>
          </>
        )}
      </div>

      <ol className={styles.days} aria-label="Roteiro dia a dia">
        {days.map((d, i) => (
          <li key={d.n}>
            <button
              type="button"
              className={styles.day}
              aria-current={active === i ? "step" : undefined}
              onClick={() => goToDay(i)}
              aria-label={`Ir para o dia ${d.n}: ${d.from} até ${d.to}, ${d.km} km`}
            >
              <span className={styles.dot} style={{ background: dayColors[i] }} aria-hidden="true" />
              <span className={styles.dayNum}>Dia {d.n}</span>
              <span className={styles.dayRoute}>
                {d.from} → {d.to}
              </span>
              <span className={styles.dayKm}>{d.km} km</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
