import type { Metadata } from "next";

// A landing é um componente cliente e componente cliente não exporta
// `metadata` — sem este layout, o Rabiscando herdava título, descrição e
// cartão social do site inteiro, e link compartilhado não mostrava o produto.
//
// O layout envolve a rota do editor também, mas lá a metadata é irrelevante:
// /rabiscando/app fica atrás de login e não é compartilhável.

const TITULO = "Rabiscando — texto manuscrito animado para vídeo";
const DESCRICAO =
  "Cartelas escritas à mão que tremem como animação em três, prontas para a timeline: 12 traços, até 4K, PNG transparente e MP4. Feito para filmmakers.";

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
};

export default function RabiscandoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
