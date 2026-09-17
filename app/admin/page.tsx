import { listar } from "@/lib/interesse";
import TabelaInteresse from "./tabela";

// Sem cache: a lista muda o tempo todo e é vista por uma pessoa só.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const linhas = await listar();

  return (
    <main style={{ minHeight: "100svh", background: "var(--bg)", color: "var(--text-1)", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color: "var(--text-3)", margin: "0 0 8px" }}>
          Painel · Lista de interesse
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(28px, 4vw, 44px)", margin: "0 0 32px" }}>
          {linhas.length} {linhas.length === 1 ? "pessoa na lista" : "pessoas na lista"}
        </h1>
        <TabelaInteresse linhas={linhas} />
      </div>
    </main>
  );
}
