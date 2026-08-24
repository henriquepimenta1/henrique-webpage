import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Next 16 renomeou `middleware.ts` para `proxy.ts` (ver
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
//
// O matcher é DELIBERADAMENTE estreito. O exemplo padrão do Clerk casa com
// o site inteiro, o que faria as 18 páginas estáticas (portfolio, presets,
// expedições...) passarem pelo middleware e potencialmente perderem o
// prerender. Aqui só a área da ferramenta e as rotas de pagamento entram.

// `/rabiscando/app` NÃO entra aqui de propósito. `auth.protect()` redireciona
// o deslogado para a página hospedada do Clerk (accounts.dev), que ignora
// nosso tema e tira a pessoa do domínio no meio do fluxo. O portão daquela
// área é o layout: ele lê `auth()` no servidor e renderiza a nossa tela de
// entrada. O middleware continua rodando na rota — é ele que popula a sessão
// que o layout lê —, só não decide o redirecionamento.
const rotasProtegidas = createRouteMatcher([
  "/api/stripe/checkout",
  "/api/stripe/portal",
]);

export default clerkMiddleware(async (auth, req) => {
  // O webhook fica de fora de propósito: quem chama é o Stripe, não um
  // usuário logado. Ele se defende pela verificação de assinatura HMAC.
  if (rotasProtegidas(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/rabiscando/app/:path*", "/api/stripe/:path*"],
};
