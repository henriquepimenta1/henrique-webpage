import type { Metadata } from "next";
import { Inter, Reenie_Beanie, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Reenie Beanie — handwritten script, only weight 400
const reenieBeanie = Reenie_Beanie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "henriq.eu",
  description: "Fotógrafo & Explorador Outdoor. Portfolio, Presets e Expedições.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt" className={cn(inter.variable, reenieBeanie.variable, "font-sans", geist.variable)}>
      <body style={{ background: "#0E0C0A", color: "#E6DDD4" }}>
        {children}
      </body>
    </html>
  );
}
