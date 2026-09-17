import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

// Portão do painel.
//
// Mesmo desenho do portão do Rabiscando: quem decide é o layout lendo `auth()`
// no servidor, não `auth.protect()` no middleware — o protect manda a pessoa
// para a página hospedada do Clerk, fora do domínio e sem o nosso tema.
//
// Aqui o portão é mais estreito: não basta estar logado, é preciso ser um dos
// IDs de ADMIN_USER_IDS. Sem essa variável configurada ninguém entra, que é o
// padrão seguro — falhar fechado, não aberto.

export const metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

function autorizados(): string[] {
  return (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

const moldura: React.CSSProperties = {
  minHeight: "100svh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  padding: 32,
  textAlign: "center",
  background: "var(--bg)",
  color: "var(--text-1)",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <ClerkProvider localization={ptBR}>
        <div style={moldura}>
          <SignIn routing="hash" />
        </div>
      </ClerkProvider>
    );
  }

  if (!autorizados().includes(userId)) {
    return (
      <ClerkProvider localization={ptBR}>
        <div style={moldura}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color: "var(--text-3)", margin: 0 }}>
            Área restrita
          </p>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 24, margin: 0 }}>
            Esta porta não é sua.
          </p>
          <code style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}>{userId}</code>
        </div>
      </ClerkProvider>
    );
  }

  return <ClerkProvider localization={ptBR}>{children}</ClerkProvider>;
}
