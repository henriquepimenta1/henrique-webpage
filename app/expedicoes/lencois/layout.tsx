import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expedição Lençóis Maranhenses — henriq.eu",
  description: "Travessia fotográfica pelos Lençóis Maranhenses em grupo pequeno. Roteiro, o que inclui e como reservar.",
  alternates: { canonical: "/expedicoes/lencois" },
};

export default function ExpedicoesLencoisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
