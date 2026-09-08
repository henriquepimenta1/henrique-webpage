import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUTs de Vídeo — henriq.eu",
  description: "LUTs de correção de cor para filmagem outdoor e documental.",
  alternates: { canonical: "/presets/video" },
};

export default function PresetsVideoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
