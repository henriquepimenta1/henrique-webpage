import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Presets de Fotografia — henriq.eu",
  description: "Pacote de presets de Lightroom para fotografia outdoor, montanha e viagem.",
  alternates: { canonical: "/presets/fotografia" },
};

export default function PresetsFotografiaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
