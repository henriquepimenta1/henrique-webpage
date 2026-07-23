"use client";
import { useEffect, useMemo, useRef, useState } from "react";

// Galeria justificada: fotos soltas (sem categorias), embaralhadas a cada
// carregamento; cada linha tem altura uniforme e as larguras variam pela
// proporção (uma horizontal fica do mesmo tamanho vertical de uma retrato ao lado).
const SRCS = [
  "/images/portfolio/lencois-aerial-drone.jpg",
  "/images/portfolio/o-escolhido-lencois-maranhenses.jpg",
  "/images/portfolio/via-lactea-lencois-baixa-grande.jpg",
  "/images/portfolio/lencois-caminhando-na-duna.jpg",
  "/images/portfolio/lencois-silhueta-pordosol.jpg",
  "/images/portfolio/grupo-caminhando-travesisa-lencois.jpg",
  "/images/portfolio/lagoa-lencois-drone.jpg",
  "/images/portfolio/as3lagunas-huayhuash.jpg",
  "/images/portfolio/vista-do-picomateo.jpg",
  "/images/portfolio/acapamento-janca-huayhuash.jpg",
  "/images/portfolio/laguna-acampamento-janca-huayhuash.jpg",
  "/images/portfolio/cordilheira-blanca-caminho-ate-laguna69-peru2.jpg",
  "/images/portfolio/pordosol-cordilheira-blanca-peru.jpg",
  "/images/portfolio/nascer-do-sol-mantiqueira-marinsxitaguaré.jpg",
  "/images/portfolio/pico-parana-visto-do-topo-serradoibitiraquire.jpg",
  "/images/portfolio/vista-para-montanhas-itatiaia.jpg",
  "/images/portfolio/pico-ciririca-serradoibitiraquire.jpg",
  "/images/portfolio/serra-da-mantiqueira-pico-dos-marins.jpg",
  "/images/portfolio/asas-de-hermes-itatiaia.jpg",
  "/images/portfolio/caverna-do-diabo-petar-eldorado-SP.jpg",
  "/images/portfolio/ronondia-riopakaas-riomamore.jpg",
  "/images/portfolio/arara-canindé-rondonia.jpg",
  "/images/portfolio/cachoeira-ratunde-rondonia.jpg",
  "/images/portfolio/hotel-pakaas-ronodonia-riomamore-riopakaas.jpg",
];

const altOf = (src: string) =>
  decodeURIComponent(src.split("/").pop()!.replace(/\.[a-z]+$/i, "")).replace(/[-_]+/g, " ");

const TARGET_H = 320;
const GAP = 10;

interface Tile {
  src: string;
  w: number;
  h: number;
}

export default function PortfolioGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<string[] | null>(null);
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [width, setWidth] = useState(0);

  // embaralha (Fisher-Yates) uma vez por carregamento + pré-carrega proporções
  useEffect(() => {
    const arr = [...SRCS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrder(arr);
    arr.forEach((src) => {
      const im = new Image();
      im.onload = () => setRatios((r) => ({ ...r, [src]: im.naturalWidth / im.naturalHeight }));
      im.src = src;
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver((e) => setWidth(e[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rows = useMemo<Tile[][]>(() => {
    if (!order || width === 0) return [];
    const out: Tile[][] = [];
    let cur: { src: string; ar: number }[] = [];
    let sumAr = 0;
    const flush = (last: boolean) => {
      if (!cur.length) return;
      const avail = width - GAP * (cur.length - 1);
      const h = last ? Math.min(TARGET_H, avail / sumAr) : avail / sumAr;
      out.push(cur.map((c) => ({ src: c.src, w: Math.round(h * c.ar), h: Math.round(h) })));
      cur = [];
      sumAr = 0;
    };
    order.forEach((src) => {
      const ar = ratios[src] ?? 1.5;
      cur.push({ src, ar });
      sumAr += ar;
      if (sumAr * TARGET_H >= width - GAP * (cur.length - 1)) flush(false);
    });
    flush(true);
    return out;
  }, [order, ratios, width]);

  return (
    <div ref={ref} className="pg-wrap">
      <style>{`
        .pg-wrap{padding:0 var(--pad-page) var(--sect-y)}
        .pg-row{display:flex;gap:${GAP}px;margin-bottom:${GAP}px}
        .pg-item{position:relative;overflow:hidden;background:var(--surface);display:block}
        .pg-item img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.1s cubic-bezier(.2,.7,.2,1)}
        .pg-item:hover img{transform:scale(1.04)}
        @media(prefers-reduced-motion:reduce){.pg-item img{transition:none}}
      `}</style>
      {rows.map((row, i) => (
        <div className="pg-row" key={i}>
          {row.map((t) => (
            <a
              className="pg-item"
              key={t.src}
              href={t.src}
              target="_blank"
              rel="noreferrer"
              style={{ width: t.w, height: t.h, flexGrow: t.w }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.src} alt={altOf(t.src)} loading="lazy" />
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
