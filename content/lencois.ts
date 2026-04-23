// Fonte canônica dos dados da expedição Lençóis Maranhenses.
// REGRA: nunca altere datas, preços, km, nomes de etapas ou URLs sem aprovação.

export const WA_BASE = "https://wa.me/5511988128064?text="

export const WA_GERAL = WA_BASE + encodeURIComponent(
  "Olá! Tenho interesse na Travessia dos Lençóis Maranhenses. Pode me passar mais informações sobre datas e vagas disponíveis?"
)

export function waMsg(label: string, datas: string, price: string) {
  return WA_BASE + encodeURIComponent(
    `Olá! Tenho interesse na ${label} (${datas}) — ${price}. Ainda tem vagas disponíveis?`
  )
}

export interface Pacote {
  label: string
  datas: string
  dias: string
  km: string
  oasis: string
  price: string
  desc: string
  featured: boolean
}

export const PACOTES: Pacote[] = [
  {
    label: "Travessia Intensiva",
    datas: "8 a 10 de Agosto",
    dias: "3 dias",
    km: "35km",
    oasis: "2 oásis",
    price: "R$ 3.599",
    desc: "Aventura concentrada para quem tem menos tempo. A essência dos Lençóis em 3 dias completos.",
    featured: false,
  },
  {
    label: "Travessia Completa",
    datas: "3 a 6 de Agosto",
    dias: "4 dias",
    km: "52km",
    oasis: "3 oásis",
    price: "R$ 3.899",
    desc: "52km do início ao fim. A experiência mais equilibrada e completa dos Lençóis.",
    featured: true,
  },
  {
    label: "Imersão Total",
    datas: "12 a 16 de Agosto",
    dias: "5 dias",
    km: "64km",
    oasis: "4 oásis",
    price: "R$ 4.499",
    desc: "Ritmo contemplativo, mais tempo em cada oásis. Para quem quer viver cada detalhe.",
    featured: false,
  },
]

export interface DiaRoteiro {
  num: string
  rota: string
  tempo: string
  desc: string
  highlight: string
  img: string
}

export const ROTEIRO: DiaRoteiro[] = [
  {
    num: "01",
    rota: "Barreirinhas → Baixa Grande",
    tempo: "8h lancha + 9km caminhada",
    desc: "Chegada a Atins de lancha pelo Rio Preguiças. Primeiro contato com as dunas. Caminhada até o primeiro oásis e pernoite sob o céu estrelado.",
    highlight: "Primeiro oásis · Céu estrelado",
    img: "/images/lencois/DSC01537.jpg",
  },
  {
    num: "02",
    rota: "Baixa Grande → Queimada dos Britos",
    tempo: "Saída 5h · 10km trekking",
    desc: "Nascer do sol nas dunas — o momento mais fotográfico da travessia. Travessia do Rio Negro e chegada às lagoas cristalinas do coração do parque.",
    highlight: "Nascer do sol · Lagoas cristalinas",
    img: "/images/lencois/DSC01675.jpg",
  },
  {
    num: "03",
    rota: "Queimada dos Britos → Betânia",
    tempo: "Saída 3h · 18km de aventura",
    desc: "O dia mais longo e mais épico. Lagoas encantadas que parecem irreais. Comunidades que vivem isoladas entre as dunas há gerações.",
    highlight: "Lagoas espetaculares · Comunidades locais",
    img: "/images/lencois/DJI_20250829042015_0506_D-HDR.jpg",
  },
  {
    num: "04",
    rota: "Betânia → Santo Amaro",
    tempo: "Início 7h · 15km finais",
    desc: "Os 15km finais com cenários épicos. Chegada triunfal em Santo Amaro — e a sensação de ter atravessado um outro planeta.",
    highlight: "Cenários épicos · Chegada triunfal",
    img: "/images/lencois/DJI_20250828042744_0378_D.jpg",
  },
]

export const INCLUIDO = [
  { title: "Guia Especializado",     desc: "Profissionais que conhecem cada duna e lagoa do percurso" },
  { title: "Todos os Transportes",   desc: "Lancha, barcos e veículos 4x4 durante a travessia, a partir de Barreirinhas" },
  { title: "Alimentação Completa",   desc: "Todas as refeições preparadas por famílias locais" },
  { title: "Hospedagem Autêntica",   desc: "Pernoites em redários nos oásis — experiência única com a natureza" },
  { title: "Fotografia Profissional",desc: "Henrique (@henriq.eu) vai junto registrando cada momento da jornada" },
]

export const NAO_INCLUIDO =
  "Transporte São Luís → Barreirinhas · Hospedagem antes/depois da travessia · Bebidas extras · Despesas pessoais"

export const POLITICA_PAGAMENTO = [
  { title: "25% de sinal",     desc: "Para garantir sua vaga na turma escolhida" },
  { title: "Restante na viagem", desc: "À vista ou parcelado em até 12x*" },
  { title: "Cancelamento",     desc: "Até 30 dias: crédito de 12 meses. 29–15 dias: retenção de 50%" },
]

export const PARCEIROS = "@lencoisexperience · @livinglencois"

// Fotos disponíveis em /public/images/lencois/
export const FOTOS_GALERIA = [
  "/images/lencois/DJI_20250828174205_0403_D-HDR.jpg",  // hero
  "/images/lencois/DSC02245.jpg",
  "/images/lencois/DJI_20250826043905_0121_D.jpg",
  "/images/lencois/DSC02529.jpg",
  "/images/lencois/DSC03215.jpg",                        // foto fotógrafo
  "/images/lencois/DJI_20250828042744_0378_D.jpg",
  "/images/lencois/DJI_20250828175706_0461_D-Edit-2.jpg",
  "/images/lencois/DSC02599.jpg",
  "/images/lencois/DSC01958.jpg",
  "/images/lencois/henrique_sesana1.jpg",
  "/images/lencois/henrique_sesana2.jpg",
  "/images/lencois/henrique_sesana3.jpg",
]
