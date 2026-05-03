// Fonte canônica dos dados de presets.
// REGRA: nunca altere preços, nomes, descrições ou URLs sem aprovação explícita.

export const CTA_URL = "https://pay.cakto.com.br/C4dmPFR"

export const PRESET_PRICE          = "R$39,90"
export const PRESET_PRICE_ORIGINAL = "R$79,90"

export interface Preset {
  key: string
  name: string
  desc: string
  cat: "Tom Verde" | "Tom Azul" | "Tom Laranja" | "Aesthetic"
}

export const CAT_COLOR: Record<string, string> = {
  "Tom Verde":   "#7EC47E",
  "Tom Azul":    "#6FA3D8",
  "Tom Laranja": "#D8924A",
  "Aesthetic":   "#C8905A",
}

export const PRESETS: Preset[] = [
  // ── Tom Verde (8) ──────────────────────────────────────────────────────────
  { key: "1-antigo",            cat: "Tom Verde",   name: "Tom Verde — Antigo",            desc: "Tons de terra aquecida com verde desaturado e contraste suave." },
  { key: "2-bosque",            cat: "Tom Verde",   name: "Tom Verde — Bosque",            desc: "Verdes profundos com sombras frias e midtones naturais." },
  { key: "3-refugio-na-selva",  cat: "Tom Verde",   name: "Tom Verde — Refúgio na Selva",  desc: "Selva densa com contraste elevado e verdes saturados." },
  { key: "4-pradaria",          cat: "Tom Verde",   name: "Tom Verde — Pradaria",          desc: "Pradaria aberta com céu claro e verdes suaves." },
  { key: "5-classico-antigo",   cat: "Tom Verde",   name: "Tom Verde — Clássico Antigo",   desc: "Look vintage com esverdeados faded e highlights quentes." },
  { key: "6-dourado-reluzente", cat: "Tom Verde",   name: "Tom Verde — Dourado Reluzente", desc: "Verde-dourado luminoso para horas mágicas." },
  { key: "7-intenso",           cat: "Tom Verde",   name: "Tom Verde — Intenso",           desc: "Verdes vivos com blacks esmagados e drama alto." },
  { key: "8-abissal",           cat: "Tom Verde",   name: "Tom Verde — Abissal",           desc: "Floresta profunda quase sem luz, atmosfera densa." },

  // ── Tom Azul (13) ──────────────────────────────────────────────────────────
  { key: "9-harmonia-verde-azul",  cat: "Tom Azul", name: "Tom Azul — Harmonia Verde-azul",  desc: "Equilíbrio entre verdes e azuis oceânicos." },
  { key: "10-frionoturno",         cat: "Tom Azul", name: "Tom Azul — Frio Noturno",         desc: "Azuis frios noturnos com sombras profundas." },
  { key: "11-devaneio",            cat: "Tom Azul", name: "Tom Azul — Devaneio",             desc: "Tons oníricos entre azul e lavanda." },
  { key: "12-ilha-solitaria",      cat: "Tom Azul", name: "Tom Azul — Ilha Solitária",       desc: "Azul oceano isolado com horizonte limpo." },
  { key: "13-luz-do-dia",          cat: "Tom Azul", name: "Tom Azul — Luz do Dia",           desc: "Azul claro diurno com highlights brancos e limpos." },
  { key: "14-vista-do-oceano",     cat: "Tom Azul", name: "Tom Azul — Vista do Oceano",      desc: "Profundidade oceânica com azuis saturados." },
  { key: "15-evaporacao",          cat: "Tom Azul", name: "Tom Azul — Evaporação",           desc: "Brumas azuladas suaves sobre água parada." },
  { key: "16-pastelado",           cat: "Tom Azul", name: "Tom Azul — Pastelado",            desc: "Paleta pastel com azuis lavados e suaves." },
  { key: "17-nevoa-suave",         cat: "Tom Azul", name: "Tom Azul — Névoa Suave",          desc: "Névoa matinal clara com azuis esmaecidos." },
  { key: "18-nevoa-esmaecida",     cat: "Tom Azul", name: "Tom Azul — Névoa Esmaecida",      desc: "Névoa densa com tons esmaecidos e frios." },
  { key: "19-oceano",              cat: "Tom Azul", name: "Tom Azul — Oceano",               desc: "Oceano profundo com azuis intensos." },
  { key: "19-praia-azul",          cat: "Tom Azul", name: "Tom Azul — Praia Azul",           desc: "Praia tropical com azul turquesa e areia clara." },
  { key: "20-atlantico-tropical",  cat: "Tom Azul", name: "Tom Azul — Atlântico Tropical",   desc: "Tropical saturado com contraste de azul e branco." },

  // ── Tom Laranja (6) ────────────────────────────────────────────────────────
  { key: "21-campo-seco",          cat: "Tom Laranja", name: "Tom Laranja — Campo Seco",          desc: "Terra seca com laranja queimado e sombras quentes." },
  { key: "22-amarelo-e-turquesa",  cat: "Tom Laranja", name: "Tom Laranja — Amarelo e Turquesa",  desc: "Contraste vibrante entre amarelo e turquesa." },
  { key: "22-poente",              cat: "Tom Laranja", name: "Tom Laranja — Poente",              desc: "Pôr do sol intenso com laranja-vermelho saturado." },
  { key: "23-plantacoes",          cat: "Tom Laranja", name: "Tom Laranja — Plantações",          desc: "Campos dourados com luz de tarde quente." },
  { key: "24-orla",                cat: "Tom Laranja", name: "Tom Laranja — Orla",                desc: "Linha de costa com laranjas e areia dourada." },

  // ── Aesthetic / Protagonista (18) ───────────────────────────────────────────
  { key: "1-explorador",            cat: "Aesthetic", name: "Aesthetic — Explorador",            desc: "Look de explorador com tons naturais e contraste equilibrado." },
  { key: "2-verdesuave",            cat: "Aesthetic", name: "Aesthetic — Verde Suave",           desc: "Verde delicado com sensação de frescura e calma." },
  { key: "3-caminhante",            cat: "Aesthetic", name: "Aesthetic — Caminhante",            desc: "Tons de trilha com terra e musgo, luz filtrada." },
  { key: "4-gelado",                cat: "Aesthetic", name: "Aesthetic — Gelado",               desc: "Frio ártico com azuis pálidos e ar cristalino." },
  { key: "5-contador-de-historias", cat: "Aesthetic", name: "Aesthetic — Contador de Histórias", desc: "Warm filmic com granulado e peso narrativo." },
  { key: "6-campo-aberto",          cat: "Aesthetic", name: "Aesthetic — Campo Aberto",         desc: "Amplitude e luz aberta com tons dourados." },
  { key: "7-liberdade",             cat: "Aesthetic", name: "Aesthetic — Liberdade",            desc: "Céu aberto, horizonte largo, luz limpa." },
  { key: "8-cinematico",            cat: "Aesthetic", name: "Aesthetic — Cinemático",           desc: "Drama clássico com contraste alto e paleta neutra." },
  { key: "9-verde-desbotado",       cat: "Aesthetic", name: "Aesthetic — Verde Desbotado",      desc: "Verde esmaecido com sensação analógica." },
  { key: "10-suavidade",            cat: "Aesthetic", name: "Aesthetic — Suavidade",            desc: "Paleta suave com altas luzes leves e sombras abertas." },
  { key: "11-intermediario",        cat: "Aesthetic", name: "Aesthetic — Intermediário",        desc: "Equilíbrio entre quente e frio, versátil." },
  { key: "12-sonhos",               cat: "Aesthetic", name: "Aesthetic — Sonhos",              desc: "Atmosfera etérea com highlights queimados." },
  { key: "13-nostalgia",            cat: "Aesthetic", name: "Aesthetic — Nostalgia",           desc: "Filme analógico com warmth e granulado sutil." },
  { key: "14-montanha-cerrada",     cat: "Aesthetic", name: "Aesthetic — Montanha Cerrada",    desc: "Neblina de altitude com verdes densos e frios." },
  { key: "15-reflexo-artico",       cat: "Aesthetic", name: "Aesthetic — Reflexo Ártico",      desc: "Reflexos azul-gelo com frieza etérea." },
  { key: "16-resiliencia",          cat: "Aesthetic", name: "Aesthetic — Resiliência",         desc: "Terra árida com luz resiliente e tons ocre." },
  { key: "17-duradouro",            cat: "Aesthetic", name: "Aesthetic — Duradouro",           desc: "Permanência com tons terrosos e sombras ricas." },
  { key: "18-areia",                cat: "Aesthetic", name: "Aesthetic — Areia",              desc: "Areia e luz difusa, paleta mínima e quente." },
]

export const PRESET_CATS = [
  { id: "verde",   label: "Tom Verde",   color: CAT_COLOR["Tom Verde"],   count: 8 },
  { id: "azul",    label: "Tom Azul",    color: CAT_COLOR["Tom Azul"],    count: 13 },
  { id: "laranja", label: "Tom Laranja", color: CAT_COLOR["Tom Laranja"], count: 6 },
  { id: "aesthetic", label: "Aesthetic", color: CAT_COLOR["Aesthetic"],   count: 18 },
]

export const ACCORDION_ITEMS = [
  {
    title: "Detalhes do Produto",
    body: "Dois estilos complementares — Tone-Based e Aesthetic. Cada preset foi ajustado manualmente para funcionar em condições externas variadas: hora dourada, céu nublado, sol forte e hora azul. Funciona em RAW e JPEG.",
  },
  {
    title: "Especificações & Compatibilidade",
    body: "• Formato: .xmp (Desktop) + .dng (Mobile)\n• Lightroom Classic, CC e Mobile\n• RAW e JPEG\n• Compra única · Acesso vitalício\n• Download imediato após compra",
  },
  {
    title: "Como obter os melhores resultados",
    body: "Fotografe em RAW sempre que possível. Corrija a exposição antes de aplicar. Ajuste a intensidade com o slider Amount (80–100%). Os presets são pontos de partida — não regras.",
  },
  {
    title: "Política de Reembolso",
    body: "Por se tratar de conteúdo digital, não oferecemos reembolso após download. Se tiver dúvidas antes de comprar, envie um e-mail para contato@euhenriq.com.",
  },
]
