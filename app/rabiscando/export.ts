// Export do Rabiscando. Dois caminhos a partir do mesmo desenho:
//
//   PNG — sequência de quadros com fundo transparente, num ZIP. É o formato
//         para sobrepor no DaVinci/Premiere.
//   MP4 — arquivo único via WebCodecs. H.264 NÃO tem canal alfa, então o
//         quadro é achatado sobre uma cor de fundo.

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
  /** Cor de fundo. Ausente = transparente no PNG; no MP4 vira preto,
   *  porque H.264 não tem canal alfa. */
  background?: string;
  onProgress?: (done: number, total: number) => void;
  /** Devolve true para abortar entre quadros. */
  shouldCancel?: () => boolean;
}

export interface ExportResult {
  blob: Blob;
  filename: string;
  frames: number;
}

const BOIL_FRAMES = 3;

/** WebCodecs + H.264 disponíveis neste browser? */
export function canExportMp4(): boolean {
  return typeof window !== "undefined" && "VideoEncoder" in window;
}

function boilFramesOf(p: ExportParams): ScribbleResult[] {
  // Os desenhos do tremor são só BOIL_FRAMES: gera uma vez e reusa ao longo
  // da sequência, em vez de recalcular os paths a cada quadro exportado.
  return Array.from({ length: p.tremor > 0 ? BOIL_FRAMES : 1 }, (_, f) =>
    buildScribble(p.font, p.text, p.tremor, {
      letterSpacing: p.letterSpacing,
      lineHeight: p.lineHeight,
      frame: f,
    }),
  );
}

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

/** Carrega o SVG como imagem — o passo que exige um blob URL. */
async function svgToImage(markup: string): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("falha ao rasterizar o quadro"));
      img.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function paintFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  p: ExportParams,
  background?: string,
): void {
  ctx.clearRect(0, 0, p.width, p.height);
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, p.width, p.height);
  }
  ctx.drawImage(img, 0, 0, p.width, p.height);

  if (p.watermark) {
    ctx.save();
    ctx.font = `${Math.round(p.height * 0.028)}px system-ui, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("euhenriq.com/rabiscando", p.width - p.height * 0.03, p.height - p.height * 0.03);
    ctx.restore();
  }
}

function makeCanvas(p: ExportParams): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement("canvas");
  canvas.width = p.width;
  canvas.height = p.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas indisponível");
  return { canvas, ctx };
}

function slugOf(text: string): string {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 24) || "rabiscando"
  );
}

/** Qual dos desenhos do tremor cai no quadro `i` da saída. */
function boilIndexAt(i: number, p: ExportParams, count: number): number {
  return Math.floor((i * p.boilFps) / p.exportFps) % count;
}

// ─────────────────────────── PNG ───────────────────────────

export async function exportPngSequence(p: ExportParams): Promise<ExportResult | null> {
  const total = Math.max(1, Math.round(p.durationSeconds * p.exportFps));
  const boil = boilFramesOf(p);
  const { canvas, ctx } = makeCanvas(p);

  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const pad = String(total).length;

  // Só existem `boil.length` imagens possíveis — rasteriza cada uma uma vez.
  const imgs = await Promise.all(boil.map((f) => svgToImage(svgMarkup(f, p))));

  for (let i = 0; i < total; i++) {
    if (p.shouldCancel?.()) return null;

    paintFrame(ctx, imgs[boilIndexAt(i, p, boil.length)], p, p.background);
    const png = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("canvas não gerou PNG"))),
        "image/png",
      );
    });
    zip.file(`rabiscando_${String(i + 1).padStart(pad, "0")}.png`, png);

    p.onProgress?.(i + 1, total);
    await new Promise((r) => setTimeout(r, 0));
  }

  if (p.shouldCancel?.()) return null;

  const blob = await zip.generateAsync({ type: "blob" });
  return {
    blob,
    filename: `${slugOf(p.text)}_${p.width}x${p.height}_${total}f.zip`,
    frames: total,
  };
}

// ─────────────────────────── MP4 ───────────────────────────

/** Do mais capaz para o mais compatível. */
const H264_CODECS = ["avc1.640028", "avc1.4d0028", "avc1.42001f"];

async function pickCodec(width: number, height: number, framerate: number): Promise<string> {
  for (const codec of H264_CODECS) {
    try {
      const { supported } = await VideoEncoder.isConfigSupported({
        codec,
        width,
        height,
        framerate,
      });
      if (supported) return codec;
    } catch {
      // perfil desconhecido neste browser — tenta o próximo
    }
  }
  throw new Error("nenhum perfil H.264 suportado");
}

export async function exportMp4(p: ExportParams): Promise<ExportResult | null> {
  if (!canExportMp4()) throw new Error("WebCodecs indisponível neste browser");

  const total = Math.max(1, Math.round(p.durationSeconds * p.exportFps));
  const boil = boilFramesOf(p);
  const { canvas, ctx } = makeCanvas(p);
  // H.264 não tem alfa: sem cor definida, achata sobre preto.
  const background = p.background ?? "#000000";

  const [{ Muxer, ArrayBufferTarget }, codec] = await Promise.all([
    import("mp4-muxer"),
    pickCodec(p.width, p.height, p.exportFps),
  ]);

  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: { codec: "avc", width: p.width, height: p.height, frameRate: p.exportFps },
    fastStart: "in-memory",
  });

  let encodeError: Error | null = null;
  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (e) => {
      encodeError = e instanceof Error ? e : new Error(String(e));
    },
  });

  encoder.configure({
    codec,
    width: p.width,
    height: p.height,
    framerate: p.exportFps,
    // ~0.1 bit por pixel por quadro: generoso para traço chapado.
    bitrate: Math.round(p.width * p.height * p.exportFps * 0.1),
  });

  try {
    const imgs = await Promise.all(boil.map((f) => svgToImage(svgMarkup(f, p))));
    const frameDuration = 1e6 / p.exportFps;

    for (let i = 0; i < total; i++) {
      if (p.shouldCancel?.()) {
        encoder.close();
        return null;
      }
      if (encodeError) throw encodeError;

      paintFrame(ctx, imgs[boilIndexAt(i, p, boil.length)], p, background);

      const frame = new VideoFrame(canvas, {
        timestamp: Math.round(i * frameDuration),
        duration: Math.round(frameDuration),
      });
      // Keyframe a cada segundo mantém o arquivo navegável na timeline.
      encoder.encode(frame, { keyFrame: i % p.exportFps === 0 });
      frame.close();

      // Sem isso a fila do encoder cresce sem limite e estoura a memória.
      while (encoder.encodeQueueSize > 8) {
        await new Promise((r) => setTimeout(r, 0));
      }
      p.onProgress?.(i + 1, total);
    }

    await encoder.flush();
    if (encodeError) throw encodeError;
    muxer.finalize();

    const { buffer } = muxer.target;
    return {
      blob: new Blob([buffer], { type: "video/mp4" }),
      filename: `${slugOf(p.text)}_${p.width}x${p.height}_${p.exportFps}fps.mp4`,
      frames: total,
    };
  } finally {
    if (encoder.state !== "closed") encoder.close();
  }
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
