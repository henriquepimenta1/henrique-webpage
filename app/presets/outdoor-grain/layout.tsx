import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outdoor Grain — Presets — henriq.eu",
  description: "Preset com textura e grão analógico para fotografia outdoor.",
  alternates: { canonical: "/presets/outdoor-grain" },
};

export default function PresetsOutdoorGrainLayout({ children }: { children: React.ReactNode }) {
  return children;
}
