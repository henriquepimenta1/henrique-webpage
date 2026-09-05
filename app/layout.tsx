import type { Metadata } from "next";
import { Work_Sans, Newsreader, IBM_Plex_Mono, Reenie_Beanie } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  // Sem preload de propósito. São quatro faces (com itálico), a família
  // mais pesada do site, e o LCP da home é uma IMAGEM — prearregá-las
  // colocava ~100 KB de fonte na frente da imagem que define o LCP.
  // Acima da dobra o serif só aparece num kicker pequeno, então a troca
  // via font-display:swap passa despercebida.
  preload: false,
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const reenieBeanie = Reenie_Beanie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hand",
});

export const metadata: Metadata = {
  // Sem metadataBase o Next resolve imagens de OG contra localhost em
  // desenvolvimento e emite aviso no build; com ela, os caminhos relativos
  // de cada página viram URL absoluta sozinhos.
  metadataBase: new URL("https://euhenriq.com"),
  title: "henriq.eu",
  description: "Fotógrafo & Explorador Outdoor. Portfolio, Presets e Expedições.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt"
      className={cn(
        workSans.variable,
        newsreader.variable,
        ibmPlexMono.variable,
        reenieBeanie.variable,
      )}
    >
      <body>{children}</body>
    </html>
  );
}
