import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL ausente");
const sql = neon(url);
const texto = readFileSync("db/001-interesse-expedicao.sql", "utf8");
for (const stmt of texto.split(";").map((s) => s.trim()).filter((s) => s && !s.split("\n").every((l) => l.startsWith("--")))) {
  await sql.query(stmt);
  console.log("ok:", stmt.split("\n").filter(l=>!l.startsWith("--"))[0].slice(0, 60));
}
