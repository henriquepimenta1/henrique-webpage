import type { ReactNode } from "react";
import Link from "next/link";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { auth, currentUser } from "@clerk/nextjs/server";
import { METADATA_KEY, type RabiscandoMetadata } from "@/lib/stripe";
import PortaoLogin from "./portao-login";
import { SCRIBBLE_FONTS } from "../fonts";
import "./clerk-tema.css";
import "./login.css";

// Portão do editor.
//
// O ClerkProvider fica AQUI e não no layout raiz de propósito: no raiz ele
// alcançaria as 18 páginas estáticas do site (portfolio, presets, expedições)
// e poderia tirá-las do prerender. Escopado aqui, o custo do login fica
// restrito à área que realmente precisa dele.

const enquadre: React.CSSProperties = {
  minHeight: "100svh",
  background: "var(--bg)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "var(--s-5) var(--pad-page)",
  textAlign: "center",
  gap: "var(--s-3)",
};

const sobrancelha: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: ".24em",
  textTransform: "uppercase",
  color: "var(--text-3)",
  margin: 0,
};

const titulo: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 400,
  fontSize: "clamp(26px, 3.6vw, 40px)",
  color: "var(--text-1)",
  margin: 0,
  maxWidth: "20ch",
  textWrap: "balance",
};

export default async function EditorLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  // `localization`: o formulário do Clerk vem em inglês por padrão, e o resto
  // da ferramenta é todo em português.
  return (
    <ClerkProvider localization={ptBR}>
      {!userId ? (
        <div className="theme-fdl">
          <PortaoLogin />
        </div>
      ) : (
        <ChecagemAssinatura>{children}</ChecagemAssinatura>
      )}
    </ClerkProvider>
  );
}

async function ChecagemAssinatura({ children }: { children: ReactNode }) {
  const user = await currentUser();
  const meta = (user?.publicMetadata?.[METADATA_KEY] ?? {}) as RabiscandoMetadata;

  if (meta.ativo) return <>{children}</>;

  // Importado aqui embaixo para o bundle do editor não carregar os botões
  // de assinatura quando o usuário já é assinante.
  const { default: BotoesAssinar } = await import("./assinar");

  return (
    <div className="theme-fdl">
      <div style={enquadre}>
        <div style={{ position: "absolute", top: "var(--s-3)", right: "var(--pad-page)" }}>
          <UserButton />
        </div>

        <p style={sobrancelha}>Rabiscando · assinatura</p>
        <h1 style={titulo}>Falta assinar para entrar no editor.</h1>
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 14,
            color: "var(--text-2)",
            maxWidth: "44ch",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Acesso completo: {SCRIBBLE_FONTS.length} traços, até 4K, export em PNG transparente e
          MP4. Sem versão
          capada e sem marca d&rsquo;água.
        </p>

        <BotoesAssinar />

        <Link
          href="/rabiscando"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--text-3)",
            textDecoration: "none",
            marginTop: "var(--s-2)",
          }}
        >
          ← ver o que a ferramenta faz
        </Link>
      </div>
    </div>
  );
}
