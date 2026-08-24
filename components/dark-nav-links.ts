// Dados de navegação do chrome "Fim de Luz" — módulo neutro (server + client).
// A lista da esquerda é o que se compra; a da direita, quem eu sou.
// Rabiscando entra ao lado de Presets por isso — e porque o footer mostra
// a esquerda inteira, então o produto aparece nas duas pontas da página.
export const DARK_NAV_L = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Presets", href: "/presets" },
  { label: "Rabiscando", href: "/rabiscando" },
  { label: "Expedições", href: "/expedicoes" },
] as const;

export const DARK_NAV_R = [
  { label: "Quadros", href: "/quadros" },
  { label: "Midiakit", href: "/midiakit" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
] as const;
