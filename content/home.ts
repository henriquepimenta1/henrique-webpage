// Fonte canônica dos dados da home e dados globais do site.
// REGRA: nunca altere nome, e-mail, stats ou URLs sem aprovação.

export const SITE_AUTHOR = "Henrique Sesana Pimenta"
export const SITE_EMAIL  = "contato@euhenriq.com"
export const SITE_HANDLE = "@henriq.eu"
export const SITE_BASE   = "Chipre — Disponível Mundialmente"

export const STATS = [
  { value: "2000+", label: "Clientes" },
  { value: "45",    label: "Presets" },
  { value: "2018",  label: "Início" },
]

// 3 cards da home (Portfolio, Presets, Expedições)
// /quadros entra só no Nav/Footer — decisão deliberada do Henrique.
export const HOME_CARDS = [
  {
    href: "/portfolio",
    label: "Portfolio",
    labelColor: "#7EC47E",
    title: "Fotos &",
    titleBold: "Trabalhos",
    desc: "Imagens de lugares, luz e momentos que valeram a viagem.",
    cta: "Explorar",
    bg: "/images/portfolio/vista-do-picomateo.jpg",
    bgPosition: "center",
  },
  {
    href: "/presets",
    label: "Presets",
    labelColor: "#C8905A",
    title: "Outdoor",
    titleBold: "Cinematic",
    desc: "45 presets para Lightroom. Tons honestos, contraste limpo.",
    cta: "R$39,90 — Ver Presets",
    bg: "/images/portfolio/observador-itatiaia-chapada-da-lua.jpg",
    bgPosition: "center",
  },
  {
    href: "/expedicoes",
    label: "Expedições",
    labelColor: "#6FA3D8",
    title: "Aventuras &",
    titleBold: "Trilhas",
    desc: "Registos de lugares remotos, montanhas e natureza selvagem.",
    cta: "Explorar",
    bg: "/images/hiker.jpg",
    bgPosition: "center top",
  },
] as const

export const BRANDS = [
  "Artlist", "DJI", "Expedia", "Framekit", "Nvidia", "Sony", "Canon", "Blackmagic",
]

export const NAV_LINKS = [
  { label: "Portfolio",     href: "/portfolio" },
  { label: "Presets & LUTs", href: "/presets" },
  { label: "Expedições",    href: "/expedicoes" },
  { label: "Quadros",       href: "/quadros" },
  { label: "Midiakit",      href: "/midiakit" },
  { label: "Sobre",         href: "/sobre" },
  { label: "Contato",       href: "/contato" },
]

export const FOOTER_NAV = [
  { label: "Portfolio",     href: "/portfolio" },
  { label: "Presets & LUTs", href: "/presets" },
  { label: "Expedições",    href: "/expedicoes" },
  { label: "Quadros",       href: "/quadros" },
  { label: "Sobre",         href: "/sobre" },
]

export const FOOTER_IMAGES = [
  "/images/desert-dunes.jpg",
  "/images/dunes-aerial.jpg",
  "/images/mountain-lake.jpg",
  "/images/mineral.jpg",
  "/images/hiker.jpg",
  "/images/portrait.jpg",
]

export const SOBRE_BIO = [
  "Nascido em Portugal, cresci entre trilhas e paisagens que me ensinaram a ver antes de fotografar. A câmera veio depois — mas a obsessão por luz, cor e lugares remotos sempre esteve lá.",
  "Hoje fotografo expedições, natureza e viagens. Criei 45 presets para Lightroom que capturam a atmosfera real de cada ambiente — sem filtros artificiais, só tons honestos.",
]
