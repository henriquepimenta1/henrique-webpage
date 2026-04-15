export interface Expedition {
  id: string;
  index: string;
  title1: string;
  title2: string;
  tagline: string;
  location: string;
  country: string;
  year: number;
  isReal: boolean;
  centerLng: number;
  centerLat: number;
  gradientColors: string[];
  stats: {
    days: number;
    distance: string;
    altOrTemp: string;
    altOrTempLabel: string;
    difficulty: number;
    type: string;
  };
  description: string;
  quote: string;
  included: string[];
  notIncluded: string[];
  heroImage: string;
  mapZoom: number;
  routeCoordinates: [number, number][]; // [lng, lat]
}

export const expeditions: Expedition[] = [
  /* ── 01 · LENÇÓIS MARANHENSES — 5 DIAS ── */
  {
    id: "lencois-5d",
    index: "01",
    title1: "Lençóis",
    title2: "5 Dias",
    tagline: "5 dias · 64 km · Duna da Bandeira → Santo Amaro",
    location: "Maranhão",
    country: "Brasil",
    year: 2025,
    isReal: true,
    centerLng: -43.10,
    centerLat: -2.52,
    gradientColors: ["#0E0C0A", "#1A0A05", "#C8905A", "#6B3015", "#E6DDD4"],
    stats: {
      days: 5,
      distance: "64 km",
      altOrTemp: "38°C",
      altOrTempLabel: "Temperatura máx.",
      difficulty: 3,
      type: "Trekking + Caiaque",
    },
    description:
      "A travessia mais completa dos Lençóis Maranhenses. " +
      "Cinco dias a pé e de caiaque, conectando a Duna da Bandeira a Santo Amaro — " +
      "passando por Baixa Grande, Queimada dos Britos e Betânia. " +
      "Noites em redários nos oásis, nascer do sol sobre dunas infinitas, " +
      "lagoas azul-turquesa e 15 km de descida pelo Rio Alegre em caiaque. " +
      "Fotografia profissional incluída em toda a travessia.",
    quote: "\"Não é um deserto com água. É um oceano de areia com espelhos de céu.\"",
    included: [
      "Guia especializado em toda a travessia",
      "Fotógrafo profissional (5 dias completos)",
      "4 noites em redários nos oásis",
      "Todas as refeições durante a expedição",
      "15 km de caiaque no Rio Alegre",
      "Transporte de bagagem em 4×4",
      "Equipamento de segurança e primeiros socorros",
      "Fotografias editadas da expedição",
    ],
    notIncluded: [
      "Voos e transfers até Barreirinhas",
      "Seguro de viagem (obrigatório)",
      "Equipamento pessoal de trekking",
      "Despesas pessoais e extras",
    ],
    heroImage: "/images/exp-lencois-5d.jpg",
    mapZoom: 10,
    routeCoordinates: [
      [-42.942547, -2.512993],
      [-42.948431, -2.515625],
      [-42.954698, -2.517912],
      [-42.960826, -2.519540],
      [-42.966868, -2.518784],
      [-42.972385, -2.522869],
      [-42.978814, -2.523809],
      [-42.984619, -2.523878],
      [-42.990151, -2.522057],
      [-42.994016, -2.523563],
      [-43.000048, -2.522907],
      [-43.002776, -2.521875],
      [-43.006267, -2.525457],
      [-43.012863, -2.524861],
      [-43.018274, -2.528354],
      [-43.023783, -2.530614],
      [-43.030326, -2.530440],
      [-43.036447, -2.531602],
      [-43.039760, -2.537506],
      [-43.045031, -2.539875],
      [-43.047704, -2.534860],
      [-43.049774, -2.529330],
      [-43.053388, -2.524684],
      [-43.054755, -2.518688],
      [-43.058368, -2.513535],
      [-43.059174, -2.508792],
      [-43.062152, -2.506366],
      [-43.067644, -2.506524],
      [-43.074282, -2.506076],
      [-43.080854, -2.506641],
      [-43.087342, -2.508893],
      [-43.094074, -2.509145],
      [-43.094391, -2.510191],
      [-43.088836, -2.509682],
      [-43.082349, -2.507842],
      [-43.075857, -2.505597],
      [-43.068978, -2.506378],
      [-43.062696, -2.505884],
      [-43.067686, -2.506438],
      [-43.074147, -2.504857],
      [-43.080969, -2.505651],
      [-43.087364, -2.506535],
      [-43.093515, -2.508337],
      [-43.100053, -2.507182],
      [-43.105768, -2.509805],
      [-43.112421, -2.511366],
      [-43.118265, -2.514750],
      [-43.124429, -2.517003],
      [-43.130517, -2.517907],
      [-43.137086, -2.519722],
      [-43.141146, -2.522239],
      [-43.144912, -2.526926],
      [-43.150594, -2.529690],
      [-43.156871, -2.528023],
      [-43.162668, -2.530893],
      [-43.168457, -2.534217],
      [-43.174001, -2.537749],
      [-43.179937, -2.539524],
      [-43.183514, -2.542761],
      [-43.183893, -2.546874],
      [-43.184864, -2.552054],
      [-43.186047, -2.549147],
      [-43.183366, -2.543322],
      [-43.186848, -2.541006],
      [-43.193474, -2.540302],
      [-43.195568, -2.540724],
      [-43.202130, -2.542884],
      [-43.205666, -2.539291],
      [-43.209955, -2.534781],
      [-43.216019, -2.532462],
      [-43.222553, -2.533444],
      [-43.229399, -2.534545],
      [-43.235900, -2.534554],
      [-43.238320, -2.533098],
      [-43.239541, -2.529487],
      [-43.242071, -2.524061],
      [-43.238905, -2.518114],
      [-43.244184, -2.514356],
      [-43.245124, -2.511345],
      [-43.249572, -2.506830],
      [-43.254325, -2.504540],
      [-43.254467, -2.504639],
    ],
  },

  /* ── 02 · LENÇÓIS MARANHENSES — 4 DIAS ── */
  {
    id: "lencois-4d",
    index: "02",
    title1: "Lençóis",
    title2: "4 Dias",
    tagline: "4 dias · 52 km · 3 oásis · Bandeira → Santo Amaro",
    location: "Maranhão",
    country: "Brasil",
    year: 2025,
    isReal: true,
    centerLng: -43.08,
    centerLat: -2.52,
    gradientColors: ["#0E0C0A", "#12080A", "#A07050", "#4A2010", "#E6DDD4"],
    stats: {
      days: 4,
      distance: "52 km",
      altOrTemp: "38°C",
      altOrTempLabel: "Temperatura máx.",
      difficulty: 3,
      type: "Trekking + 4×4",
    },
    description:
      "Quatro dias intensos pelos Lençóis Maranhenses, com três oásis e " +
      "os cenários mais espetaculares da região. De Baixa Grande a Queimada dos Britos " +
      "com nascer do sol às 5h, travessia do Rio Negro e lagoas cristalinas. " +
      "Saída de Betânia às 3h para os últimos 18 km de aventura pura.",
    quote: "\"O silêncio das dunas às 5h da manhã é físico. Consegues ouvi-lo.\"",
    included: [
      "Guia especializado em toda a travessia",
      "Fotógrafo profissional (4 dias completos)",
      "3 noites em redários nos oásis",
      "Todas as refeições durante a expedição",
      "Transfers entre etapas em 4×4",
      "Equipamento de segurança e primeiros socorros",
      "Fotografias editadas da expedição",
    ],
    notIncluded: [
      "Voos e transfers até Barreirinhas",
      "Seguro de viagem (obrigatório)",
      "Equipamento pessoal de trekking",
      "Despesas pessoais e extras",
    ],
    heroImage: "/images/exp-lencois-4d.jpg",
    mapZoom: 10,
    routeCoordinates: [
      [-42.942547, -2.512993],
      [-42.984628, -2.523423],
      [-43.020853, -2.529496],
      [-43.044986, -2.539880],
      [-43.073026, -2.506416],
      [-43.119776, -2.515426],
      [-43.156819, -2.528042],
      [-43.179219, -2.539448],
      [-43.209867, -2.534857],
      [-43.244160, -2.515128],
      [-43.254467, -2.504639],
    ],
  },

  /* ── 02 · HUAYHUASH — CIRCUITO COMPLETO ── */
  {
    id: "huayhuash",
    index: "04",
    title1: "Huayhuash",
    title2: "Peru",
    tagline: "8 dias · 100 km · Circuito Huayhuash · Pico Mateo",
    location: "Cordillera Huayhuash",
    country: "Peru",
    year: 2025,
    isReal: true,
    centerLng: -76.92,
    centerLat: -10.27,
    gradientColors: ["#0E0C0A", "#050A18", "#6FA3D8", "#1A3A60", "#E6DDD4"],
    stats: {
      days: 8,
      distance: "100 km",
      altOrTemp: "5450 m",
      altOrTempLabel: "Altitude máx.",
      difficulty: 5,
      type: "Trekking de Alta Altitude",
    },
    description:
      "O Huayhuash é o circuito de trekking mais selvagem e tecnicamente exigente dos Andes. " +
      "Oito dias em altitude, rodeado pelos segundos picos mais altos do Peru — " +
      "Yerupajá (6635 m), Siula Grande e Pico Mateo — com passagens a mais de 5000 m. " +
      "Noites em acampamento base abaixo de céus repletos de estrelas a 4500 m. " +
      "Isolamento total, glaciares a poucos metros, lagos de altitude cor de safira " +
      "e silêncio que poucos alguma vez experimentaram.",
    quote: "\"A montanha não te testa a força. Testa o que sobra quando a força acaba.\"",
    included: [
      "Guia local certificado em toda a rota",
      "Fotógrafo profissional (12 dias completos)",
      "Acampamentos e equipamento de altitude",
      "Todas as refeições no circuito",
      "Burros de carga para equipamento",
      "Kit de altitude e primeiros socorros",
      "Transporte Huaraz → trailhead → Huaraz",
      "Fotografias editadas da expedição",
    ],
    notIncluded: [
      "Voos internacionais até Lima/Huaraz",
      "Seguro de viagem com cobertura altitude (obrigatório)",
      "Equipamento pessoal de alta montanha",
      "Taxa de acesso ao parque (aprox. $20 USD)",
      "Despesas pessoais em Huaraz",
    ],
    heroImage: "/images/exp-huayhuash.jpg",
    mapZoom: 10,
    routeCoordinates: [
      [-76.9020, -10.1850], // Llamac (start)
      [-76.9150, -10.2050],
      [-76.9250, -10.2200],
      [-76.9300, -10.2380], // Punta Cacananpunta
      [-76.9250, -10.2550],
      [-76.9150, -10.2700],
      [-76.9050, -10.2850], // Mitucocha camp
      [-76.9000, -10.3000],
      [-76.9100, -10.3150],
      [-76.9250, -10.3300], // Punta Carnicero
      [-76.9200, -10.3500],
      [-76.9100, -10.3650], // Carhuacocha
      [-76.9000, -10.3800],
      [-76.8900, -10.3950],
      [-76.8850, -10.4100], // Siula camp
      [-76.8950, -10.4250], // Punta Siula
      [-76.9050, -10.4350],
      [-76.9150, -10.4450],
      [-76.9050, -10.4600], // Huayhuash camp
      [-76.8950, -10.4700],
      [-76.8850, -10.4800], // Punta Tapush
      [-76.8750, -10.4700],
      [-76.8700, -10.4550],
      [-76.8650, -10.4400], // Viconga
      [-76.8700, -10.4200],
      [-76.8800, -10.4050],
      [-76.8850, -10.3900], // Punta Cuyoc (5450m - highest)
      [-76.8800, -10.3750],
      [-76.8750, -10.3600],
      [-76.8800, -10.3450], // Cuartelhuain
      [-76.8900, -10.3300],
      [-76.8950, -10.3150],
      [-76.8900, -10.3000], // Punta Jurau
      [-76.8850, -10.2850],
      [-76.8900, -10.2700],
      [-76.9000, -10.2550], // Jahuacocha
      [-76.9050, -10.2400],
      [-76.9100, -10.2250],
      [-76.9050, -10.2100],
      [-76.9020, -10.1850], // Llamac (return)
    ],
  },

  /* ── 03 · LENÇÓIS MARANHENSES — 3 DIAS ── */
  {
    id: "lencois-3d",
    index: "03",
    title1: "Lençóis",
    title2: "3 Dias",
    tagline: "3 dias · 35 km · 2 oásis · versão express",
    location: "Maranhão",
    country: "Brasil",
    year: 2025,
    isReal: true,
    centerLng: -43.05,
    centerLat: -2.52,
    gradientColors: ["#0E0C0A", "#0A0A15", "#8870A0", "#3A2050", "#E6DDD4"],
    stats: {
      days: 3,
      distance: "35 km",
      altOrTemp: "38°C",
      altOrTempLabel: "Temperatura máx.",
      difficulty: 2,
      type: "Trekking + 4×4",
    },
    description:
      "A versão mais directa da travessia — três dias conectando a Duna da Bandeira " +
      "a Santo Amaro via Lagoa Cajueiro e Queimada dos Britos. " +
      "Ideal para quem quer viver a essência dos Lençóis sem abdicar de nenhum " +
      "dos momentos mais marcantes: nascer do sol nas dunas e lagoas cristalinas.",
    quote: "\"Três dias chegam para mudar completamente a perspectiva.\"",
    included: [
      "Guia especializado em toda a travessia",
      "Fotógrafo profissional (3 dias completos)",
      "2 noites em redários nos oásis",
      "Todas as refeições durante a expedição",
      "Transfers entre etapas em 4×4",
      "Equipamento de segurança e primeiros socorros",
      "Fotografias editadas da expedição",
    ],
    notIncluded: [
      "Voos e transfers até Barreirinhas",
      "Seguro de viagem (obrigatório)",
      "Equipamento pessoal de trekking",
      "Despesas pessoais e extras",
    ],
    heroImage: "/images/exp-lencois-3d.jpg",
    mapZoom: 10,
    routeCoordinates: [
      [-42.942547, -2.512993],
      [-42.984628, -2.523423],
      [-43.020853, -2.529496],
      [-43.044986, -2.539880],
      [-43.073026, -2.506416],
      [-43.119776, -2.515426],
      [-43.156819, -2.528042],
      [-43.244160, -2.515128],
      [-43.254467, -2.504639],
    ],
  },
];
