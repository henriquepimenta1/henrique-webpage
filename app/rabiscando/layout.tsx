import type { Metadata, Viewport } from "next";
import { SCRIBBLE_FONTS } from "./fonts";

// A landing é um componente cliente e componente cliente não exporta
// `metadata` — sem este layout, o Rabiscando herdava título, descrição e
// cartão social do site inteiro, e link compartilhado não mostrava o produto.
//
// O layout envolve a rota do editor também, mas lá a metadata é irrelevante:
// /rabiscando/app fica atrás de login e não é compartilhável.

const TITULO = "Rabiscando — texto manuscrito animado para vídeo";
const DESCRICAO =
  `Cartelas escritas à mão que tremem como animação em três, prontas para a timeline: ${SCRIBBLE_FONTS.length} traços, até 4K, PNG transparente e MP4. Feito para filmmakers.`;

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "https://euhenriq.com/rabiscando" },
  openGraph: {
    title: TITULO,
    description: DESCRICAO,
    url: "https://euhenriq.com/rabiscando",
    siteName: "henriq.eu",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
  },

  // Instalável só aqui. O manifest é servido por rota dentro de /rabiscando
  // justamente para este link não aparecer nas páginas do site — ver o
  // comentário em manifest.webmanifest/route.ts.
  manifest: "/rabiscando/manifest.webmanifest",

  icons: {
    icon: [{ url: "/rabiscando/icone/192", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/rabiscando/icone/180", sizes: "180x180", type: "image/png" }],
  },

  appleWebApp: {
    capable: true,
    title: "Rabiscando",
    // A barra de status vira transparente e o conteúdo sobe até o topo da
    // tela. É o que tira a cara de página aberta no Safari — e o que torna
    // obrigatório o `viewportFit: "cover"` com safe-area no CSS abaixo.
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  // `cover` estende a página por baixo do notch e da barra de gestos. Sem ele
  // o iOS reserva duas tarjas pretas e a janela instalada continua parecendo
  // um site. Quem paga essa conta é o CSS, que precisa de env(safe-area-*).
  viewportFit: "cover",
  themeColor: "#0D0C0B",
  // A ferramenta é um canvas: deixar o pinça-para-zoom livre faz a pessoa
  // ampliar a interface sem querer ao tentar ajustar o desenho. Limitar em 2x
  // ainda atende quem precisa aproximar para ler.
  maximumScale: 2,
};

export default function RabiscandoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
