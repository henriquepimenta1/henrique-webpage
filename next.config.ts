import type { NextConfig } from "next";

// Cabeçalhos de segurança.
//
// Em produção só existia o HSTS, que a Vercel põe sozinha. Os quatro abaixo
// são os que valem para este site sem risco de quebrar nada.
//
// Não há Content-Security-Policy completa de propósito: o Clerk carrega
// script do próprio domínio (clerk.euhenriq.com) e o Stripe redireciona para
// fora, então uma CSP restritiva escrita no escuro derrubaria login ou
// checkout — e a falha apareceria só em produção, no pior momento. O que
// entra aqui é a parte da CSP que é segura sem inventário completo:
// `frame-ancestors`, que não depende de saber de onde vêm os scripts.
const cabecalhos = [
  // Ninguém coloca o editor (ou o checkout) dentro de um iframe alheio.
  // Sem isto, um site clone pode embutir a tela real e capturar cliques.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // O navegador respeita o Content-Type declarado em vez de adivinhar —
  // fecha a porta de um upload virar script executável.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Sai o caminho da página no Referer para outros domínios. Importa aqui
  // porque o Stripe recebe navegação vinda de dentro da área logada.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // A ferramenta não usa câmera, microfone nem localização. Declarar isso
  // impede que um script de terceiro peça em nome do site.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  images: {
    // Só WebP. O AVIF comprime um pouco melhor, mas cada formato extra é
    // outra transformação cobrada e outro tempo de encode no primeiro acesso
    // — e o ganho sobre WebP não paga isso aqui.
    formats: ["image/webp"],
    // Larguras derivadas dos breakpoints REAIS do layout (globals.css usa
    // 640/900/960), não da lista padrão do Next. A padrão inclui 2048 e 3840,
    // que este site nunca serve: a maior imagem em tela cheia num desktop
    // 1920 com DPR 2 pede 1920, e os painéis do hero pedem ~34vw.
    // Menos larguras = menos variantes geradas = menos transformação cobrada.
    deviceSizes: [400, 640, 828, 1080, 1280, 1600, 1920],
    // Usadas só por imagens de tamanho fixo abaixo de 640px (avatares,
    // thumbs). A home é toda `fill`, então esta lista é curta de propósito.
    imageSizes: [128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [{ source: "/:path*", headers: cabecalhos }];
  },
};

export default nextConfig;
