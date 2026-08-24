import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // O editor e as rotas de pagamento não têm nada que buscador deva ver:
      // a primeira exige assinatura, as outras só respondem a POST.
      disallow: ["/rabiscando/app", "/api/"],
    },
    sitemap: "https://euhenriq.com/sitemap.xml",
  };
}
