import type { MetadataRoute } from "next";

// Rotas públicas do site. O editor (/rabiscando/app) fica FORA: está atrás de
// login e assinatura, e indexá-lo só geraria resultado de busca que leva a uma
// tela de acesso negado.

const BASE = "https://euhenriq.com";

const ROTAS: { caminho: string; prioridade: number }[] = [
  { caminho: "/", prioridade: 1 },
  { caminho: "/rabiscando", prioridade: 0.9 },
  { caminho: "/portfolio", prioridade: 0.8 },
  { caminho: "/presets", prioridade: 0.8 },
  { caminho: "/expedicoes", prioridade: 0.8 },
  { caminho: "/quadros", prioridade: 0.7 },
  { caminho: "/midiakit", prioridade: 0.6 },
  { caminho: "/sobre", prioridade: 0.6 },
  { caminho: "/contato", prioridade: 0.5 },
  { caminho: "/privacidade", prioridade: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  return ROTAS.map(({ caminho, prioridade }) => ({
    url: `${BASE}${caminho}`,
    lastModified: agora,
    changeFrequency: "monthly",
    priority: prioridade,
  }));
}
