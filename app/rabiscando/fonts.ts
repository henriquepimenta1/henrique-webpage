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
  /**
   * Fonte de TRAÇO ÚNICO: o glifo é o caminho da caneta, não o contorno da
   * letra. É a única família em que dá para desenhar a letra do jeito que ela
   * é escrita — o "A" sai como duas diagonais e depois a barra — porque só
   * nela existe a informação de por onde a ponta passa.
   */
  tracoUnico?: boolean;
  /**
   * A linha de centro desta fonte pode ser extraída com qualidade aceitável
   * (ver esqueleto.ts). Só vale para traço fino e de espessura constante —
   * numa fonte de pincel o esqueleto sai com farpas nas junções.
   */
  esqueletoOk?: boolean;
}

export const SCRIBBLE_FONTS: ScribbleFont[] = [
  { id: "caveat", name: "Caveat", file: "/fonts/Caveat.ttf", nota: "marcador arredondado", pontos: 45, licenca: "OFL" },
  { id: "reenie-beanie", name: "Reenie Beanie", file: "/fonts/ReenieBeanie.ttf", nota: "a da assinatura do site · desenha de verdade", pontos: 71, licenca: "OFL", esqueletoOk: true },
  { id: "permanent-marker", name: "Permanent Marker", file: "/fonts/PermanentMarker-Regular.ttf", nota: "o mais grosso e chapado", pontos: 126, licenca: "Apache 2.0" },
  { id: "patrick-hand", name: "Patrick Hand", file: "/fonts/PatrickHand-Regular.ttf", nota: "contorno limpo, a mais legível", pontos: 37, licenca: "OFL" },
  { id: "indie-flower", name: "Indie Flower", file: "/fonts/IndieFlower-Regular.ttf", nota: "arredondada e informal", pontos: 50, licenca: "OFL" },
  { id: "handlee", name: "Handlee", file: "/fonts/Handlee-Regular.ttf", nota: "casual, traço médio", pontos: 43, licenca: "OFL" },
  { id: "architects-daughter", name: "Architects Daughter", file: "/fonts/ArchitectsDaughter-Regular.ttf", nota: "fina, arquitetônica · desenha de verdade", pontos: 49, licenca: "OFL", esqueletoOk: true },
  { id: "sriracha", name: "Sriracha", file: "/fonts/Sriracha-Regular.ttf", nota: "pincel, traço variável", pontos: 51, licenca: "OFL" },
  { id: "gloria-hallelujah", name: "Gloria Hallelujah", file: "/fonts/GloriaHallelujah.ttf", nota: "escolar, redonda", pontos: 61, licenca: "OFL" },
  { id: "shadows-into-light", name: "Shadows Into Light", file: "/fonts/ShadowsIntoLight.ttf", nota: "a mais fina · desenha de verdade", pontos: 59, licenca: "OFL", esqueletoOk: true },
  { id: "amatic-sc", name: "Amatic SC", file: "/fonts/AmaticSC-Regular.ttf", nota: "condensada, alta e estreita", pontos: 82, licenca: "OFL" },
  { id: "just-another-hand", name: "Just Another Hand", file: "/fonts/JustAnotherHand-Regular.ttf", nota: "condensada fina", pontos: 93, licenca: "Apache 2.0" },
  { id: "kalam", name: "Kalam", file: "/fonts/Kalam-Regular.ttf", nota: "caneta de ponta larga, inclinada", pontos: 39, licenca: "OFL" },
  { id: "caveat-brush", name: "Caveat Brush", file: "/fonts/CaveatBrush-Regular.ttf", nota: "pincel encorpado, a irmã grossa da Caveat", pontos: 113, licenca: "OFL" },
  { id: "gochi-hand", name: "Gochi Hand", file: "/fonts/GochiHand-Regular.ttf", nota: "traço curto e anguloso", pontos: 77, licenca: "OFL" },
  { id: "covered-by-your-grace", name: "Covered By Your Grace", file: "/fonts/CoveredByYourGrace-Regular.ttf", nota: "caneta fina, letra apressada · desenha de verdade", pontos: 71, licenca: "OFL", esqueletoOk: true },
  { id: "rock-salt", name: "Rock Salt", file: "/fonts/RockSalt-Regular.ttf", nota: "giz cru, a mais irregular — embola com tremor alto", pontos: 246, licenca: "Apache 2.0" },

  // Traço único: desenham de verdade, letra por letra, no caminho da caneta.
  { id: "relief-single", name: "Relief SingleLine", file: "/fonts/ReliefSingleLine-CAD.ttf", nota: "traço único · caneta técnica, desenha de verdade", pontos: 8, licenca: "OFL", tracoUnico: true },
  { id: "mistral-single", name: "Mistral SingleLine", file: "/fonts/MistralSingleLine.otf", nota: "traço único · cursiva, desenha de verdade", pontos: 46, licenca: "OFL", tracoUnico: true },
];

export const DEFAULT_FONT_ID = "caveat";

/**
 * Nome da família com que a fonte é registrada no CSS. O prefixo evita
 * colidir com uma fonte de mesmo nome já instalada na máquina de quem usa —
 * "Caveat" instalada localmente sequestraria o preview sem aviso.
 */
export function cssFamily(id: string): string {
  return `rbs-${id}`;
}

// Registro das fontes que a pessoa trouxe nesta aba.
//
// É estado de módulo, e isso é deliberado: `fontById` é chamado de dentro do
// ScribbleCanvas, do carregador de fontes e do export — três lugares que não
// se conhecem. Passar a lista por props exigiria enfiá-la em toda a árvore, e
// esquecer UM caller faz a fonte cair silenciosamente na padrão, sem erro
// nenhum. Foi exatamente o que aconteceu.
//
// Seguro porque é por aba: existe um editor por página, as fontes vivem só
// enquanto ela está aberta, e nada disto roda no servidor.
const trazidas = new Map<string, ScribbleFont>();

export function registrarFonteTrazida(fonte: ScribbleFont): void {
  trazidas.set(fonte.id, fonte);
}

export function esquecerFonteTrazida(id: string): void {
  trazidas.delete(id);
}

export function fontById(id: string): ScribbleFont {
  return trazidas.get(id) ?? SCRIBBLE_FONTS.find((f) => f.id === id) ?? SCRIBBLE_FONTS[0];
}
