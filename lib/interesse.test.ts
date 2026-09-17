import { describe, expect, it } from "vitest";

import { soDigitos, validar } from "./interesse";

// A validação é a única parte deste fluxo que se afirma sem banco: é ela que
// decide o que vira linha e o que volta como erro na cara de quem preencheu.

function formulario(campos: Record<string, string>): FormData {
  const form = new FormData();
  for (const [chave, valor] of Object.entries(campos)) form.append(chave, valor);
  return form;
}

const validos = {
  nome: "Henrique Sesana",
  email: "henrique@exemplo.com",
  telefone: "(11) 98765-4321",
  expedicao: "lencois",
};

describe("validar", () => {
  it("aceita um preenchimento completo e devolve os dados limpos", () => {
    const r = validar(formulario(validos));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.dados.nome).toBe("Henrique Sesana");
  });

  it("apara espaço das pontas antes de julgar o campo", () => {
    const r = validar(formulario({ ...validos, nome: "  Henrique  " }));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.dados.nome).toBe("Henrique");
  });

  it("recusa nome de uma letra só", () => {
    const r = validar(formulario({ ...validos, nome: "H" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.erros.nome).toBeDefined();
  });

  it.each(["sem-arroba", "sem@dominio", "@semlocal.com", "com espaco@x.com", ""])(
    "recusa o e-mail %j",
    (email) => {
      const r = validar(formulario({ ...validos, email }));
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.erros.email).toBeDefined();
    },
  );

  it.each(["11987654321", "(11) 98765-4321", "+55 11 98765-4321", "1133334444"])(
    "aceita o telefone %j",
    (telefone) => {
      expect(validar(formulario({ ...validos, telefone })).ok).toBe(true);
    },
  );

  it.each(["987654321", "1", "", "119876543210000"])(
    "recusa o telefone %j",
    (telefone) => {
      const r = validar(formulario({ ...validos, telefone }));
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.erros.telefone).toBeDefined();
    },
  );

  it("recusa quando a expedição não veio no form", () => {
    const r = validar(formulario({ ...validos, expedicao: "" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.erros.expedicao).toBeDefined();
  });

  it("acumula os erros em vez de parar no primeiro", () => {
    const r = validar(formulario({ nome: "", email: "x", telefone: "1", expedicao: "" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.erros)).toHaveLength(4);
  });

  it("recusa campo absurdamente longo", () => {
    const r = validar(formulario({ ...validos, nome: "a".repeat(200) }));
    expect(r.ok).toBe(false);
  });

  it("ignora entrada que não é texto", () => {
    const form = formulario({ email: validos.email, telefone: validos.telefone, expedicao: "x" });
    form.append("nome", new Blob(["arquivo"]));
    expect(validar(form).ok).toBe(false);
  });
});

describe("soDigitos", () => {
  it("tira tudo que não é dígito", () => {
    expect(soDigitos("+55 (11) 98765-4321")).toBe("5511987654321");
  });
});
