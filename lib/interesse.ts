import { neon } from "@neondatabase/serverless";

// Lista de interesse das expedições.
//
// A validação mora aqui, separada da Server Action, porque é a parte que se
// testa sem banco nem rede. A Action fica só com o que depende do mundo.

export interface Interesse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  expedicao: string;
  criado_em: string;
}

export interface DadosInteresse {
  nome: string;
  email: string;
  telefone: string;
  expedicao: string;
}

export type Erros = Partial<Record<keyof DadosInteresse, string>>;

export type Validacao =
  | { ok: true; dados: DadosInteresse }
  | { ok: false; erros: Erros };

// Limites generosos: o objetivo é barrar abuso, não recusar nome comprido.
const LIMITES = { nome: 120, email: 160, telefone: 32 } as const;

// Deliberadamente frouxo. Regex de e-mail "correta" é folclore — quem decide
// se o endereço existe é o e-mail de confirmação, não este teste. Aqui só se
// recusa o que é obviamente não-endereço.
const PARECE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Telefone brasileiro depois de tirar tudo que não é dígito: 10 (fixo com
// DDD) a 11 (celular com 9). Com +55 na frente chega a 13.
const DIGITOS_TEL = { min: 10, max: 13 } as const;

function texto(valor: FormDataEntryValue | null): string {
  return typeof valor === "string" ? valor.trim() : "";
}

export function soDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function validar(form: FormData): Validacao {
  const dados: DadosInteresse = {
    nome: texto(form.get("nome")),
    email: texto(form.get("email")),
    telefone: texto(form.get("telefone")),
    expedicao: texto(form.get("expedicao")),
  };

  const erros: Erros = {};

  if (dados.nome.length < 2) erros.nome = "Diga como te chamar.";
  else if (dados.nome.length > LIMITES.nome) erros.nome = "Nome longo demais.";

  if (!PARECE_EMAIL.test(dados.email)) erros.email = "Confira o e-mail.";
  else if (dados.email.length > LIMITES.email) erros.email = "E-mail longo demais.";

  const digitos = soDigitos(dados.telefone);
  if (digitos.length < DIGITOS_TEL.min || digitos.length > DIGITOS_TEL.max) {
    erros.telefone = "Telefone com DDD, por favor.";
  } else if (dados.telefone.length > LIMITES.telefone) {
    erros.telefone = "Telefone longo demais.";
  }

  if (!dados.expedicao) erros.expedicao = "Expedição não informada.";

  if (Object.keys(erros).length > 0) return { ok: false, erros };
  return { ok: true, dados };
}

function conectar() {
  const url = process.env.DATABASE_URL;
  // Inicialização preguiçosa: `neon()` lança se a variável faltar, e o Next
  // avalia o topo do módulo no build. Chamar aqui dentro mantém o build de pé
  // mesmo num ambiente sem a env configurada.
  if (!url) throw new Error("DATABASE_URL ausente");
  return neon(url);
}

export async function registrar(dados: DadosInteresse): Promise<void> {
  const sql = conectar();
  // Reinscrever não é erro: atualiza os dados e segue com uma linha só.
  await sql`
    INSERT INTO interesse_expedicao (nome, email, telefone, expedicao)
    VALUES (${dados.nome}, ${dados.email}, ${dados.telefone}, ${dados.expedicao})
    ON CONFLICT (lower(email), expedicao) DO UPDATE
      SET nome = EXCLUDED.nome,
          telefone = EXCLUDED.telefone,
          criado_em = now()
  `;
}

export async function listar(): Promise<Interesse[]> {
  const sql = conectar();
  const linhas = await sql`
    SELECT id, nome, email, telefone, expedicao, criado_em
    FROM interesse_expedicao
    ORDER BY criado_em DESC
  `;
  return linhas as Interesse[];
}
