"use client";

import { useState } from "react";
import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";
import { SITE_EMAIL } from "@/content/home";

const PRINTS = [
  {
    id: 1,
    title: "Lençóis Maranhenses",
    location: "Maranhão, BR",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    ratio: "3/2",
  },
  {
    id: 2,
    title: "Dunas ao Amanhecer",
    location: "Deserto, MA",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop",
    ratio: "4/5",
  },
  {
    id: 3,
    title: "Vale da Névoa",
    location: "Serra da Canastra, BR",
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop",
    ratio: "3/2",
  },
  {
    id: 4,
    title: "Luz Dourada",
    location: "Chapada dos Veadeiros, BR",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop",
    ratio: "4/5",
  },
  {
    id: 5,
    title: "Horizonte Alpino",
    location: "Alpes, CH",
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop",
    ratio: "3/2",
  },
  {
    id: 6,
    title: "Pico entre Nuvens",
    location: "Himalaia",
    src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&auto=format&fit=crop",
    ratio: "3/2",
  },
  {
    id: 7,
    title: "Floresta Profunda",
    location: "Amazônia, BR",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop",
    ratio: "4/5",
  },
  {
    id: 8,
    title: "Mar de Areia",
    location: "Sahara, MA",
    src: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&auto=format&fit=crop",
    ratio: "3/2",
  },
];

const SIZES = ["20×30 cm", "30×45 cm", "50×75 cm", "70×105 cm"];
const FRAMES = ["Sem moldura", "Moldura preta", "Moldura branca", "Moldura madeira"];

type Print = (typeof PRINTS)[number];

function PrintModal({ print, onClose }: { print: Print; onClose: () => void }) {
  const [size, setSize] = useState(SIZES[1]);
  const [frame, setFrame] = useState(FRAMES[0]);

  const subject = encodeURIComponent(`Encomenda: ${print.title} — ${size} / ${frame}`);
  const body = encodeURIComponent(
    `Olá,\n\nGostaria de encomendar o print:\n\nFoto: ${print.title}\nLocalização: ${print.location}\nTamanho: ${size}\nMoldura: ${frame}\n\nObrigado!`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(30,42,24,.72)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden"
        style={{ background: "var(--paper)", boxShadow: "0 32px 80px rgba(30,42,24,.4)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full"
          style={{ background: "var(--canvas-deep)", color: "var(--stone)" }}
          aria-label="Fechar"
        >
          ×
        </button>

        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={print.src}
            alt={print.title}
            className="w-full h-full object-cover"
            style={{ aspectRatio: "3/4" }}
          />

          <div className="p-8 flex flex-col gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--stone)" }}>
                {print.location}
              </p>
              <h2 className="text-2xl font-light" style={{ color: "var(--bark)" }}>
                {print.title}
              </h2>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--stone)" }}>
                Tamanho
              </p>
              <div className="flex flex-col gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className="text-left px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{
                      background: size === s ? "var(--bark)" : "var(--canvas-deep)",
                      color: size === s ? "var(--canvas)" : "var(--bark)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--stone)" }}>
                Moldura
              </p>
              <div className="flex flex-col gap-2">
                {FRAMES.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrame(f)}
                    className="text-left px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{
                      background: frame === f ? "var(--bark)" : "var(--canvas-deep)",
                      color: frame === f ? "var(--canvas)" : "var(--bark)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <a
              href={`mailto:${SITE_EMAIL}?subject=${subject}&body=${body}`}
              className="mt-auto text-center py-3 px-6 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: "var(--rust)", color: "var(--canvas)" }}
            >
              Encomendar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuadrosPage() {
  const [selected, setSelected] = useState<Print | null>(null);

  return (
    <div style={{ background: "var(--paper)", color: "var(--bark)", minHeight: "100vh" }}>
      <SiteNav dark={false} />

      {selected && <PrintModal print={selected} onClose={() => setSelected(null)} />}

      {/* ── HEADER ── */}
      <div className="pt-40 pb-12 px-8" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--stone)" }}>
          Quadros & Prints
        </p>
        <h1 className="text-5xl font-light leading-tight" style={{ color: "var(--bark)" }}>
          Fotografias para{" "}
          <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 300 }}>
            a sua parede
          </em>
        </h1>
        <p className="text-sm mt-4 max-w-md leading-relaxed" style={{ color: "var(--stone)" }}>
          Impressão profissional em papel Fine Art 300g. Cada print é verificado e assinado antes do envio.
        </p>
      </div>

      {/* ── GRID ── */}
      <section className="px-8 pb-24" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {PRINTS.map((print) => (
            <button
              key={print.id}
              onClick={() => setSelected(print)}
              className="group text-left rounded-xl overflow-hidden"
              style={{ background: "var(--canvas-deep)", border: "1px solid var(--line)" }}
            >
              <div className="overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={print.src}
                  alt={print.title}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ aspectRatio: print.ratio, display: "block" }}
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: "var(--stone)" }}>
                  {print.location}
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--bark)" }}>
                  {print.title}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm" style={{ color: "var(--stone)" }}>
            Print personalizado? Escreva para{" "}
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="underline underline-offset-4 hover:opacity-70 transition-opacity"
              style={{ color: "var(--bark)" }}
            >
              {SITE_EMAIL}
            </a>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
