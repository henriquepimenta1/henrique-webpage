import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Kit — Henrique Sesana | Adventure Filmmaker",
  description:
    "Fotógrafo e filmmaker de aventura. Filmes, fotografia e expedições pelo Brasil, Peru e Chile. Métricas e parcerias com marcas.",
  openGraph: {
    title: "Media Kit — Henrique Sesana | Adventure Filmmaker",
    description:
      "Fotógrafo e filmmaker de aventura. Filmes, fotografia e expedições pelo Brasil, Peru e Chile. Métricas e parcerias com marcas.",
    url: "https://euhenriq.com/midiakit",
    siteName: "henriq.eu",
    images: [
      {
        url: "/images/exp-huayhuash.jpg",
        width: 1200,
        height: 630,
        alt: "Henrique Sesana — Adventure Filmmaker",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Kit — Henrique Sesana",
    description: "Fotografia, filmes e expedições · São Paulo",
    images: ["/images/exp-huayhuash.jpg"],
  },
};

export default function MidiaKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
