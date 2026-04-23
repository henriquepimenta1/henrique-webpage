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
