import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

// Imagens que a HOME carrega. Teto de 2000px no maior lado (nenhum slot do
// layout passa de 1920 CSS px) e qualidade 82 com mozjpeg. O next/image ainda
// vai redimensionar por cima disto — o objetivo aqui é parar de guardar
// arquivos de 4 MB como fonte de um card de 600px.
const ALVOS = [
  "images/outdoor-grain-capa.jpg",
  "images/quadros/A-OBSERVADORA-ARARA-CANINDE-RONDONIA.jpg",
  "images/expedicao-lencois.jpg",
  "images/dunes-aerial.jpg",
  "images/portfolio/as3lagunas-huayhuash.jpg",
  "images/portfolio/acapamento-janca-huayhuash2.jpg",
  "images/portfolio/laguna-acampamento-janca-huayhuash.jpg",
  "images/portfolio/vista-do-picomateo.jpg",
  "images/portfolio/observador-itatiaia-chapada-da-lua.jpg",
  "images/lencois/DJI_20250828174205_0403_D-HDR.jpg",
];

const MAX = 2000;
const BACKUP = "originais-pre-otimizacao";
let totalAntes = 0, totalDepois = 0;

for (const rel of ALVOS) {
  const src = path.join("public", rel);
  const meta = await sharp(src).metadata();
  const antes = (await fs.stat(src)).size;

  const bak = path.join(BACKUP, rel);
  await fs.mkdir(path.dirname(bak), { recursive: true });
  await fs.copyFile(src, bak);

  const buf = await sharp(src)
    .rotate()                                   // aplica orientação EXIF antes de descartar metadata
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toBuffer();

  if (buf.length >= antes) {
    console.log(`= ${rel} — já estava melhor (${(antes/1024).toFixed(0)}K), mantido`);
    totalAntes += antes; totalDepois += antes;
    continue;
  }
  await fs.writeFile(src, buf);
  const d = await sharp(src).metadata();
  totalAntes += antes; totalDepois += buf.length;
  console.log(
    `✓ ${rel}\n    ${meta.width}x${meta.height} ${(antes/1024).toFixed(0)}K` +
    ` → ${d.width}x${d.height} ${(buf.length/1024).toFixed(0)}K` +
    `  (-${(100 - buf.length/antes*100).toFixed(0)}%)`
  );
}
console.log(`\nTOTAL: ${(totalAntes/1024/1024).toFixed(2)}MB → ${(totalDepois/1024/1024).toFixed(2)}MB`);
console.log(`Originais preservados em ./${BACKUP}/`);
