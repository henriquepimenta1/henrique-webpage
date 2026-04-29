import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Kit — Henrique Sesana | Adventure Filmmaker",
  description: "Cineasta de aventura e guia de expedições. Métricas, portfólio e serviços para parcerias com marcas outdoor.",
  openGraph: {
    title: "Media Kit — Henrique Sesana | Adventure Filmmaker",
    description: "Cineasta de aventura e guia de expedições. Métricas, portfólio e serviços para parcerias com marcas outdoor.",
    url: "https://euhenriq.com.br/midiakit",
    siteName: "henriq.eu",
    images: [{ url: "/images/exp-huayhuash.jpg", width: 1200, height: 630, alt: "Henrique Sesana — Adventure Filmmaker" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Kit — Henrique Sesana",
    description: "Adventure Filmmaker & Expedition Guide · São Paulo",
    images: ["/images/exp-huayhuash.jpg"],
  },
};

export default function MidiaKitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
