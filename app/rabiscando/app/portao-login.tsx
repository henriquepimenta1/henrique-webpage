"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import ScribbleCanvas from "../scribble-canvas";

// Tela de entrada do editor.
//
// Duas colunas: à esquerda a ferramenta rodando de verdade (a mesma prova
// que a landing dá, agora enquanto a pessoa digita a senha), à direita o
// formulário. No celular a arte vira uma faixa curta no topo — ela ilustra,
// não pode empurrar o campo de e-mail para fora da dobra.
//
// Só UMA fonte aqui, ao contrário do herói da landing: cada fonte é um
// download, e uma tela de login não é lugar de desfile tipográfico.

const FONTE = "permanent-marker";
const INTERVALO_MS = 3200;

const PALAVRAS = ["rabiscando", "primeira luz", "dia 3", "chegamos"] as const;

const CONSULTA_MOVIMENTO = "(prefers-reduced-motion: reduce)";

const grafico: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, var(--surface) 25%, transparent 25%), linear-gradient(-45deg, var(--surface) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--surface) 75%), linear-gradient(-45deg, transparent 75%, var(--surface) 75%)",
  backgroundSize: "26px 26px",
  backgroundPosition: "0 0, 0 13px, 13px -13px, -13px 0",
  backgroundColor: "var(--bg)",
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
  fontSize: "clamp(26px, 3.4vw, 38px)",
  lineHeight: 1.15,
  color: "var(--text-1)",
  margin: 0,
  maxWidth: "18ch",
  textWrap: "balance",
};

const apoio: React.CSSProperties = {
  fontFamily: "var(--font-ui)",
  fontSize: 14,
  lineHeight: 1.6,
  color: "var(--text-2)",
  maxWidth: "34ch",
  margin: 0,
};

const voltar: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: "var(--text-3)",
  textDecoration: "none",
};

/** Alterna as palavras da arte; devolve a que está em cena. */
function usePalavra(): string {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia(CONSULTA_MOVIMENTO).matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % PALAVRAS.length), INTERVALO_MS);
    return () => clearInterval(id);
  }, []);

  return PALAVRAS[i];
}

export default function PortaoLogin() {
  const palavra = usePalavra();

  return (
    <div className="rbs-login">
      <aside className="rbs-login__arte" style={grafico} aria-hidden="true">
        <ScribbleCanvas
          fontId={FONTE}
          text={palavra}
          tremor={32}
          boilFps={10}
          thickness="regular"
          color="#C08246"
          lineHeight={1.05}
        />
        <span className="rbs-login__legenda">isto é a ferramenta rodando, não um vídeo</span>
      </aside>

      <main className="rbs-login__form">
        <header className="rbs-login__cabecalho">
          <p style={sobrancelha}>Rabiscando · acesso</p>
          <h1 style={titulo}>Entra que o editor está do outro lado.</h1>
          <p style={apoio}>
            12 traços, até 4K, PNG transparente e MP4. Sua conta guarda os ajustes entre uma
            sessão e outra.
          </p>
        </header>

        {/* As cores base vêm daqui; o resto do ajuste está em clerk-tema.css,
            que explica por que não usamos o pacote de temas oficial. */}
        {/* Sem os `forceRedirectUrl` o Clerk manda para "/" depois de
            autenticar — a home do site, não o editor de onde a pessoa veio.
            `signUp*` cobre quem chega por "Registre-se" no rodapé do card. */}
        <SignIn
          routing="hash"
          forceRedirectUrl="/rabiscando/app"
          signUpForceRedirectUrl="/rabiscando/app"
          appearance={{
            variables: {
              colorBackground: "#171412",
              colorPrimary: "#C08246",
              borderRadius: "0px",
            },
          }}
        />

        <Link href="/rabiscando" style={voltar}>
          ← ver o que a ferramenta faz
        </Link>
      </main>
    </div>
  );
}
