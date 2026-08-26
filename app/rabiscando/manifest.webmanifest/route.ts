// Manifest do Rabiscando — e SÓ dele.
//
// `app/manifest.ts` (a convenção do Next) só vale na raiz de `app`, e o
// framework injeta o <link rel="manifest"> em TODAS as páginas. Isso tornaria
// o site inteiro instalável, que não é o que se quer: quem instala na tela de
// início está instalando a ferramenta, não o portfólio.
//
// Servido como rota aqui dentro e linkado só pelo layout do Rabiscando
// (`metadata.manifest`), o convite de instalação aparece exclusivamente em
// /rabiscando/*.

import type { MetadataRoute } from "next";

/** `scope` prende o app à ferramenta: link para fora — o portfólio, o
 *  checkout do Stripe — abre no navegador, não dentro da janela instalada. */
const ESCOPO = "/rabiscando/";

const manifest: MetadataRoute.Manifest = {
  name: "Rabiscando — texto manuscrito animado",
  short_name: "Rabiscando",
  description:
    "Cartelas escritas à mão que tremem como animação em três, prontas para a timeline.",
  lang: "pt-BR",
  dir: "ltr",
  scope: ESCOPO,
  // Abre direto no editor, não na página de venda: quem instalou já comprou.
  start_url: "/rabiscando/app",
  display: "standalone",
  orientation: "any",
  background_color: "#0D0C0B",
  theme_color: "#0D0C0B",
  categories: ["graphics", "productivity", "video"],
  icons: [
    { src: "/rabiscando/icone/192", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/rabiscando/icone/512", sizes: "512x512", type: "image/png", purpose: "any" },
    // O `maskable` é o que impede o Android de desenhar o ícone dentro de um
    // quadrado branco. A folga de 22% já está embutida no gerador.
    { src: "/rabiscando/icone/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};

export function GET() {
  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
