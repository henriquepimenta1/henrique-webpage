// Fontes disponíveis no Rabiscando. Todas livres para uso comercial —
// SIL OFL ou Apache 2.0 — com os textos de licença em public/fonts/licencas.
//
// `pontos` é a média de pontos de controle por letra, medida com opentype.js.
// Importa porque o tremor deforma esses pontos: quanto mais pontos, mais o
// contorno tende a embolar sob deformação forte. Fica registrado aqui para
// orientar a calibragem, não é usado em runtime.

export interface ScribbleFont {
  id: string;
  /** Nome real da fonte — o usuário pode querer identificá-la. */
  name: string;
  file: string;
  /** Caráter do traço, para escolher sem precisar testar uma a uma. */
  nota: string;
  pontos: number;
  licenca: "OFL" | "Apache 2.0";
}

export const SCRIBBLE_FONTS: ScribbleFont[] = [
  { id: "caveat", name: "Caveat", file: "/fonts/Caveat.ttf", nota: "marcador arredondado", pontos: 45, licenca: "OFL" },
  { id: "reenie-beanie", name: "Reenie Beanie", file: "/fonts/ReenieBeanie.ttf", nota: "a da assinatura do site", pontos: 71, licenca: "OFL" },
  { id: "permanent-marker", name: "Permanent Marker", file: "/fonts/PermanentMarker-Regular.ttf", nota: "o mais grosso e chapado", pontos: 126, licenca: "Apache 2.0" },
  { id: "patrick-hand", name: "Patrick Hand", file: "/fonts/PatrickHand-Regular.ttf", nota: "contorno limpo, a mais legível", pontos: 37, licenca: "OFL" },
  { id: "indie-flower", name: "Indie Flower", file: "/fonts/IndieFlower-Regular.ttf", nota: "arredondada e informal", pontos: 50, licenca: "OFL" },
  { id: "handlee", name: "Handlee", file: "/fonts/Handlee-Regular.ttf", nota: "casual, traço médio", pontos: 43, licenca: "OFL" },
  { id: "architects-daughter", name: "Architects Daughter", file: "/fonts/ArchitectsDaughter-Regular.ttf", nota: "fina, arquitetônica", pontos: 49, licenca: "OFL" },
  { id: "sriracha", name: "Sriracha", file: "/fonts/Sriracha-Regular.ttf", nota: "pincel, traço variável", pontos: 51, licenca: "OFL" },
  { id: "gloria-hallelujah", name: "Gloria Hallelujah", file: "/fonts/GloriaHallelujah.ttf", nota: "escolar, redonda", pontos: 61, licenca: "OFL" },
  { id: "shadows-into-light", name: "Shadows Into Light", file: "/fonts/ShadowsIntoLight.ttf", nota: "a mais fina", pontos: 59, licenca: "OFL" },
  { id: "amatic-sc", name: "Amatic SC", file: "/fonts/AmaticSC-Regular.ttf", nota: "condensada, alta e estreita", pontos: 82, licenca: "OFL" },
  { id: "just-another-hand", name: "Just Another Hand", file: "/fonts/JustAnotherHand-Regular.ttf", nota: "condensada fina", pontos: 93, licenca: "Apache 2.0" },
];

export const DEFAULT_FONT_ID = "caveat";

export function fontById(id: string): ScribbleFont {
  return SCRIBBLE_FONTS.find((f) => f.id === id) ?? SCRIBBLE_FONTS[0];
}
