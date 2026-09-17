"use client";

import { useMemo, useState } from "react";

import type { Interesse } from "@/lib/interesse";

// A busca e o CSV moram no cliente de propósito: a lista inteira já veio do
// servidor, e nesse tamanho filtrar em memória é instantâneo. Ida ao servidor
// a cada tecla não compraria nada.

function formatarData(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Campo entre aspas com aspas internas dobradas: é o que o Excel entende, e
// impede que uma vírgula no nome quebre a coluna.
function campoCSV(valor: string): string {
  return `"${valor.replace(/"/g, '""')}"`;
}

function montarCSV(linhas: Interesse[]): string {
  const cabecalho = ["nome", "email", "telefone", "expedicao", "inscrito_em"];
  const corpo = linhas.map((l) =>
    [l.nome, l.email, l.telefone, l.expedicao, formatarData(l.criado_em)].map(campoCSV).join(","),
  );
  // BOM na frente para o Excel abrir os acentos certos.
  return "﻿" + [cabecalho.join(","), ...corpo].join("\n");
}

const celula: React.CSSProperties = {
  padding: "12px 14px",
  borderBottom: "1px solid var(--border)",
  fontFamily: "var(--font-ui)",
  fontSize: 13,
  textAlign: "left",
  verticalAlign: "top",
};

const cabecalhoCelula: React.CSSProperties = {
  ...celula,
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: "var(--text-3)",
  whiteSpace: "nowrap",
};

export default function TabelaInteresse({ linhas }: { linhas: Interesse[] }) {
  const [busca, setBusca] = useState("");

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return linhas;
    return linhas.filter((l) =>
      [l.nome, l.email, l.telefone, l.expedicao].some((c) => c.toLowerCase().includes(termo)),
    );
  }, [linhas, busca]);

  function baixarCSV() {
    const blob = new Blob([montarCSV(filtradas)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lista-interesse-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, e-mail, telefone…"
          aria-label="Buscar na lista"
          style={{
            flex: "1 1 240px",
            padding: "11px 14px",
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            background: "var(--bg-2, transparent)",
            color: "var(--text-1)",
            border: "1px solid var(--border)",
          }}
        />
        <button
          type="button"
          onClick={baixarCSV}
          disabled={filtradas.length === 0}
          style={{
            padding: "11px 22px",
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            background: "var(--accent)",
            color: "var(--bg)",
            border: "none",
            cursor: filtradas.length === 0 ? "not-allowed" : "pointer",
            opacity: filtradas.length === 0 ? 0.5 : 1,
          }}
        >
          Exportar CSV
        </button>
      </div>

      {filtradas.length === 0 ? (
        <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 17, color: "var(--text-3)" }}>
          {linhas.length === 0 ? "Ninguém se inscreveu ainda." : "Nada bate com essa busca."}
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={cabecalhoCelula} scope="col">Nome</th>
                <th style={cabecalhoCelula} scope="col">E-mail</th>
                <th style={cabecalhoCelula} scope="col">WhatsApp</th>
                <th style={cabecalhoCelula} scope="col">Expedição</th>
                <th style={cabecalhoCelula} scope="col">Inscrito em</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((l) => (
                <tr key={l.id}>
                  <td style={celula}>{l.nome}</td>
                  <td style={celula}>
                    <a href={`mailto:${l.email}`} style={{ color: "var(--accent)" }}>{l.email}</a>
                  </td>
                  <td style={celula}>{l.telefone}</td>
                  <td style={{ ...celula, fontFamily: "var(--font-mono)", fontSize: 11 }}>{l.expedicao}</td>
                  <td style={{ ...celula, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", whiteSpace: "nowrap" }}>
                    {formatarData(l.criado_em)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
