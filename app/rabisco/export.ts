// Export da sequência PNG. Cada quadro é o SVG do tremor rasterizado num
// canvas transparente do tamanho final — é isso que entra no DaVinci/Premiere
// como camada por cima do vídeo.

import type { Font } from "opentype.js";
import { buildScribble, type ScribbleResult } from "./scribble";

export interface ExportParams {
  font: Font;
  text: string;
  tremor: number;
  letterSpacing: number;
  lineHeight: number;
  strokeWidth: number;
  color: string;
  /** Quadros por segundo do tremor (o desenho muda nessa taxa). */
  boilFps: number;
  /** Quadros por segundo do arquivo final. */
  exportFps: number;
  durationSeconds: number;
  width: number;
  height: number;
  /** Marca d'água na versão gratuita. */
  watermark: boolean;
  onProgress?: (done: number, total: number) => void;
  /** Devolve true para abortar entre quadros. */
  shouldCancel?: () => boolean;
}

const BOIL_FRAMES = 3;

function svgMarkup(frame: ScribbleResult, p: ExportParams): string {
  const paths = frame.glyphs
    .map(
      (g) =>
        `<path d="${g.d}" fill="${p.color}"` +
        (p.strokeWidth > 0
          ? ` stroke="${p.color}" stroke-width="${p.strokeWidth}" stroke-linejoin="round" stroke-linecap="round"`
          : "") +
        "/>",
    )
    .join("");

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${p.width}" height="${p.height}" ` +
    `viewBox="${frame.viewBox}" preserveAspectRatio="xMidYMid meet">${paths}</svg>`
  );
}

/** Rasteriza um SVG num canvas transparente. */
async function rasterize(
  markup: string,
  width: number,
  height: number,
  watermark: boolean,
): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("falha ao rasterizar o quadro"));
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas indisponível");
    ctx.drawImage(img, 0, 0, width, height);

    if (watermark) {
      ctx.save();
      ctx.font = `${Math.round(height * 0.028)}px system-ui, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText("euhenriq.com.br/rabisco", width - height * 0.03, height - height * 0.03);
      ctx.restore();
    }

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("canvas não gerou PNG"))),
        "image/png",
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export interface ExportResult {
  blob: Blob;
  filename: string;
  frames: number;
}

export async function exportPngSequence(p: ExportParams): Promise<ExportResult | null> {
  const total = Math.max(1, Math.round(p.durationSeconds * p.exportFps));

  // Os desenhos do tremor são só BOIL_FRAMES: gera uma vez e reusa ao longo
  // da sequência, em vez de recalcular os paths a cada quadro exportado.
  const boil = Array.from({ length: p.tremor > 0 ? BOIL_FRAMES : 1 }, (_, f) =>
    buildScribble(p.font, p.text, p.tremor, {
      letterSpacing: p.letterSpacing,
      lineHeight: p.lineHeight,
      frame: f,
    }),
  );

  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const pad = String(total).length;

  for (let i = 0; i < total; i++) {
    if (p.shouldCancel?.()) return null;

    const boilIdx = Math.floor((i * p.boilFps) / p.exportFps) % boil.length;
    const png = await rasterize(
      svgMarkup(boil[boilIdx], p),
      p.width,
      p.height,
      p.watermark,
    );
    zip.file(`rabisco_${String(i + 1).padStart(pad, "0")}.png`, png);

    p.onProgress?.(i + 1, total);
    // Devolve a thread ao browser para a barra de progresso andar.
    await new Promise((r) => setTimeout(r, 0));
  }

  if (p.shouldCancel?.()) return null;

  const blob = await zip.generateAsync({ type: "blob" });
  const slug =
    p.text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 24) || "rabisco";

  return { blob, filename: `${slug}_${p.width}x${p.height}_${total}f.zip`, frames: total };
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // O revoke imediato cancela o download em alguns browsers.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
