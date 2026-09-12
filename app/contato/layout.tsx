import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato — henriq.eu",
  description: "Reserva de expedição, dúvida sobre preset, parceria de marca ou orçamento de quadro.",
  alternates: { canonical: "/contato" },
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
