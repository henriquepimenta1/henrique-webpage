import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expedição Rondônia — henriq.eu",
  description: "Expedição fotográfica pela Amazônia rondoniense. Roteiro, o que inclui e como reservar.",
  alternates: { canonical: "/expedicoes/rondonia" },
};

export default function ExpedicoesRondoniaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
