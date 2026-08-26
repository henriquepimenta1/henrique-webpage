// Export do Rabiscando. Dois caminhos a partir do mesmo desenho:
//
//   PNG — sequência de quadros com fundo transparente, num ZIP. É o formato
//         para sobrepor no DaVinci/Premiere.
//   MP4 — arquivo único via WebCodecs. H.264 NÃO tem canal alfa, então o
//         quadro é achatado sobre uma cor de fundo.

import type { Font } from "opentype.js";
import { buildScribble, type ScribbleResult } from "./scribble";
import { comprimentoDoCaminho } from "./caminho";

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
  /** Fundo destinado a recorte por cor (chroma key). Ver `paintFrame`. */
  chromaKey?: boolean;
  /** Intervalo entre uma letra e a seguinte, em ms. 0 escreve tudo de uma vez. */
  revelarMs?: number;
  /** "passo" mostra a letra inteira; "varredura" desenha da esquerda para a
   *  direita. Ver `recortesDaVarredura`. */
  modoRevelacao?: "passo" | "varredura";
  /** Fonte de traço único: o glifo é o caminho da caneta. Muda o desenho de
   *  preenchido para riscado, e habilita o desenho progressivo real. */
  tracoUnico?: boolean;
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
      strokeWidth: p.strokeWidth,
    }),
  );
}

function svgMarkup(frame: ScribbleResult, p: ExportParams, ateIndice = Infinity): string {
  const paths = frame.glyphs
    // A caixa (viewBox) continua a do texto INTEIRO: recortar por letra faria
    // o desenho crescer e se reposicionar a cada letra que entra.
    .filter((g) => g.index <= ateIndice)
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

/**
 * Remove a suavização das bordas: todo pixel vira transparente ou opaco,
 * sem meio-termo.
 *
 * É o que torna o fundo verde utilizável. A borda suavizada de um traço é
 * uma faixa de pixels meio traço, meio fundo — e quando o editor remove o
 * verde, essa mistura não some: fica a franja verde no contorno. Num traço
 * trêmulo, que é quase todo borda, isso aparece em cada letra.
 *
 * O custo é serrilhado. Some na prática porque a saída é grande: exportado
 * em 4K e escalado para caber num vídeo vertical, o degrau some. Por isso
 * isto NÃO se aplica a fundo comum, onde a suavização é o que se quer.
 */
function endurecerBordas(ctx: CanvasRenderingContext2D, largura: number, altura: number): void {
  const dados = ctx.getImageData(0, 0, largura, altura);
  const px = dados.data;
  for (let i = 3; i < px.length; i += 4) {
    px[i] = px[i] >= 128 ? 255 : 0;
  }
  ctx.putImageData(dados, 0, 0);
}

function paintFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  p: ExportParams,
  background?: string,
  recortes?: { x: number; y: number; w: number; h: number }[] | null,
  /** Chamado logo depois do traço e ANTES do fundo e do endurecimento de
   *  bordas — senão o que for desenhado aqui ganharia a franja que o modo
   *  chroma existe para eliminar. */
  depoisDoTraco?: () => void,
  /** Substitui o desenho do traço, para fontes de traço único. */
  tracoUnico?: () => void,
): void {
  ctx.clearRect(0, 0, p.width, p.height);

  if (background && p.chromaKey) {
    // O traço entra PRIMEIRO, sobre o transparente: só assim dá para separar
    // o que é borda do que é fundo. O verde entra depois, por baixo.
    desenharTraco(ctx, img, p, recortes, tracoUnico);
    depoisDoTraco?.();
    endurecerBordas(ctx, p.width, p.height);
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, p.width, p.height);
    ctx.restore();
    return;
  }

  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, p.width, p.height);
  }
  desenharTraco(ctx, img, p, recortes, tracoUnico);
  depoisDoTraco?.();

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

/**
 * Desenho progressivo de fonte de traço único, direto no canvas.
 *
 * Aqui não há rasterização de SVG: os caminhos são desenhados com Path2D e o
 * quanto de cada um já foi escrito sai do tracejado do próprio canvas. Além de
 * mais fiel, é mais barato — o caminho normal precisaria de uma imagem nova
 * por quadro, porque o traço muda continuamente e não em degraus.
 */
function desenharTracoUnico(
  ctx: CanvasRenderingContext2D,
  frame: ScribbleResult,
  p: ExportParams,
  i: number,
): void {
  const { escala, dx, dy } = transformacaoDoViewBox(frame, p);
  const decorridoMs = (i / p.exportFps) * 1000;
  const escrevendo = !!p.revelarMs && p.revelarMs > 0 && p.modoRevelacao === "varredura";

  ctx.save();
  ctx.setTransform(escala, 0, 0, escala, dx, dy);
  ctx.strokeStyle = p.color;
  ctx.lineWidth = Math.max(1, p.strokeWidth);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const g of frame.glyphs) {
    const fracao = escrevendo
      ? (decorridoMs - g.index * p.revelarMs!) / p.revelarMs!
      : 1;
    if (fracao <= 0) continue;

    const caminho = new Path2D(g.d);
    if (fracao >= 1) {
      ctx.setLineDash([]);
    } else {
      // Um traço do tamanho do caminho inteiro, deslocado: o que sobra à
      // vista é exatamente a parte já escrita.
      const comprimento = comprimentoDoCaminho(g.d);
      ctx.setLineDash([comprimento, comprimento]);
      ctx.lineDashOffset = comprimento * (1 - fracao);
    }
    ctx.stroke(caminho);
  }

  ctx.setLineDash([]);
  ctx.restore();
}

/** Desenha o traço inteiro, ou só as áreas já escritas. */
function desenharTraco(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  p: ExportParams,
  recortes?: { x: number; y: number; w: number; h: number }[] | null,
  tracoUnico?: () => void,
): void {
  if (tracoUnico) {
    tracoUnico();
    return;
  }
  if (!recortes) {
    ctx.drawImage(img, 0, 0, p.width, p.height);
    return;
  }
  if (recortes.length === 0) return;

  ctx.save();
  ctx.beginPath();
  for (const r of recortes) ctx.rect(r.x, r.y, r.w, r.h);
  ctx.clip();
  ctx.drawImage(img, 0, 0, p.width, p.height);
  ctx.restore();
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

/**
 * Reproduz em números o que o `preserveAspectRatio="xMidYMid meet"` faz no
 * SVG: escala uniforme pelo lado que couber, centralizada nos dois eixos.
 * É o que permite converter posição de letra em pixel do canvas.
 */
function transformacaoDoViewBox(frame: ScribbleResult, p: ExportParams) {
  const [vx, vy, vw, vh] = frame.viewBox.split(/\s+/).map(Number);
  const escala = Math.min(p.width / vw, p.height / vh);
  return {
    escala,
    dx: (p.width - vw * escala) / 2 - vx * escala,
    dy: (p.height - vh * escala) / 2 - vy * escala,
  };
}

/**
 * Os retângulos que devem ficar VISÍVEIS no quadro `i`, em pixels do canvas.
 *
 * A varredura não exige uma imagem por quadro: a imagem é sempre a do texto
 * inteiro, e o que muda é o recorte. Num dado instante todas as letras
 * anteriores estão completas — um retângulo só as cobre — e no máximo uma
 * está pela metade. Dois recortes por quadro, contra centenas de
 * rasterizações em 4K.
 */
function recortesDaVarredura(
  frame: ScribbleResult,
  p: ExportParams,
  i: number,
): { x: number; y: number; w: number; h: number }[] | null {
  if (!p.revelarMs || p.revelarMs <= 0 || p.modoRevelacao !== "varredura") return null;

  const decorridoMs = (i / p.exportFps) * 1000;
  const { escala, dx, dy } = transformacaoDoViewBox(frame, p);
  const areas: { x: number; y: number; w: number; h: number }[] = [];

  for (const g of frame.glyphs) {
    const inicio = g.index * p.revelarMs;
    const progresso = (decorridoMs - inicio) / p.revelarMs;
    if (progresso <= 0) continue;
    const fatia = Math.min(1, progresso);
    areas.push({
      x: g.x * escala + dx,
      y: g.yTopo * escala + dy,
      w: g.avanco * fatia * escala,
      h: (g.yBase - g.yTopo) * escala,
    });
  }

  return areas;
}

/**
 * Até que índice de letra o quadro `i` mostra. Espelha a conta do preview:
 * uma letra a cada `revelarMs`, contando os espaços. Sem revelação, tudo.
 */
function revelacaoAt(i: number, p: ExportParams): number {
  // Na varredura o corte é geométrico, não por índice: a imagem é sempre a
  // do texto inteiro e quem esconde é o recorte.
  if (!p.revelarMs || p.revelarMs <= 0 || p.modoRevelacao === "varredura") return Infinity;
  return Math.floor((i / p.exportFps) * 1000 / p.revelarMs);
}

/** Qual dos desenhos do tremor cai no quadro `i` da saída. */
function boilIndexAt(i: number, p: ExportParams, count: number): number {
  return Math.floor((i * p.boilFps) / p.exportFps) % count;
}

/**
 * Devolve, para cada quadro de saída, a imagem já rasterizada — reaproveitando
 * as repetidas. Sem revelação são `boil.length` imagens no total.
 */
async function cacheDeImagens(
  boil: ScribbleResult[],
  p: ExportParams,
  total: number,
): Promise<(i: number) => HTMLImageElement> {
  const combinacoes = new Map<string, HTMLImageElement>();
  const chaveDe = (i: number) => `${boilIndexAt(i, p, boil.length)}:${revelacaoAt(i, p)}`;

  const chaves = new Set<string>();
  for (let i = 0; i < total; i++) chaves.add(chaveDe(i));

  await Promise.all(
    [...chaves].map(async (chave) => {
      const [b, ate] = chave.split(":");
      const img = await svgToImage(svgMarkup(boil[Number(b)], p, Number(ate)));
      combinacoes.set(chave, img);
    }),
  );

  return (i: number) => combinacoes.get(chaveDe(i))!;
}

// ─────────────────────────── PNG ───────────────────────────

export async function exportPngSequence(p: ExportParams): Promise<ExportResult | null> {
  const total = Math.max(1, Math.round(p.durationSeconds * p.exportFps));
  const boil = boilFramesOf(p);
  const { canvas, ctx } = makeCanvas(p);

  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const pad = String(total).length;

  // Com revelação, cada combinação de (quadro do tremor × letras visíveis) é
  // uma imagem diferente. São poucas — 3 quadros vezes o número de letras —,
  // então o cache resolve; rasterizar por quadro de saída seria centenas.
  const cache = await cacheDeImagens(boil, p, total);

  for (let i = 0; i < total; i++) {
    if (p.shouldCancel?.()) return null;

    const quadroBoil = boil[boilIndexAt(i, p, boil.length)];
    paintFrame(
      ctx,
      cache(i),
      p,
      p.background,
      recortesDaVarredura(quadroBoil, p, i),
      undefined,
      p.tracoUnico ? () => desenharTracoUnico(ctx, quadroBoil, p, i) : undefined,
    );
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
    const cache = await cacheDeImagens(boil, p, total);
    const frameDuration = 1e6 / p.exportFps;

    for (let i = 0; i < total; i++) {
      if (p.shouldCancel?.()) {
        encoder.close();
        return null;
      }
      if (encodeError) throw encodeError;

      const quadroBoil = boil[boilIndexAt(i, p, boil.length)];
      paintFrame(
        ctx,
        cache(i),
        p,
        background,
        recortesDaVarredura(quadroBoil, p, i),
        undefined,
        p.tracoUnico ? () => desenharTracoUnico(ctx, quadroBoil, p, i) : undefined,
      );

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
