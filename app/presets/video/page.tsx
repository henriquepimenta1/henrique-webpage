"use client";

import { useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";

const LUTS = [
  { id: "01", name: "Cordillera",    kicker: "Montanha · amber + teal",   img: "/images/portfolio/acapamento-janca-huayhuash.jpg" },
  { id: "02", name: "Dunefield",     kicker: "Desertos · warm haze",       img: "/images/portfolio/lencois-silhueta-pordosol-drone.jpg" },
  { id: "03", name: "High Latitude", kicker: "Tons frios · glaciar",        img: "/images/portfolio/as3lagunas-huayhuash.jpg" },
  { id: "04", name: "Vale Escuro",   kicker: "Mata · verde úmido",          img: "/images/portfolio/cachoeira-dos-macacaquinhos-rondonia.jpg" },
  { id: "05", name: "Golden Hour",   kicker: "Pôr do sol · warm matte",    img: "/images/portfolio/lencois-silhueta-pordosol.jpg" },
  { id: "06", name: "Night Sky",     kicker: "Astrofoto · deep blue",       img: "/images/portfolio/via-lactea-lencois1.jpg" },
];

export default function LutsPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSent(true);
  }

  return (
    <main style={{ background: "var(--forest)", color: "var(--canvas)", fontFamily: "var(--font-ui)", minHeight: "100vh" }}>
      <style>{`
        .lut-img { transition: transform .6s cubic-bezier(.2,.7,.2,1); }
        .lut-card:hover .lut-img { transform: scale(1.06); }
        .lut-arrow { transition: transform .3s cubic-bezier(.2,.7,.2,1); }
        .back-link:hover .lut-arrow { transform: translateX(-4px); }
        @media(max-width:900px){
          .lut-grid { grid-template-columns: repeat(2,1fr) !important; }
          .tech-rail { grid-template-columns: repeat(2,1fr) !important; }
          .buy-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .compat-grid { gap: 20px !important; }
          .luts-hero-title { font-size: clamp(64px,14vw,120px) !important; }
        }
        @media(max-width:560px){
          .lut-grid { grid-template-columns: 1fr !important; }
          .luts-hero, .luts-section { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>

      <SiteNav dark={true} />

      {/* ── HERO ── */}
      <div className="luts-hero" style={{ padding: "120px 56px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-ui)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--ashe)", fontWeight: 500, marginBottom: 24 }}>
          <Link href="/presets" className="back-link" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ashe)", textDecoration: "none" }}>
            <span className="lut-arrow">←</span> Presets & LUTs
          </Link>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--rust-soft)", display: "inline-block" }} />
          <span style={{ color: "var(--rust-soft)" }}>LUTs · Vídeo</span>
        </div>

        {/* Badge em breve */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", border: "1px solid var(--rust-soft)", marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rust-soft)", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--rust-soft)" }}>Em breve · lançamento em 2025</span>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>

        <div style={{ fontFamily: "var(--font-hand)", fontSize: 36, color: "var(--rust-soft)", transform: "rotate(-2deg)", display: "inline-block", marginBottom: 8, letterSpacing: ".01em" }}>
          cinema em qualquer câmera—
        </div>
        <h1 className="luts-hero-title" style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 120, letterSpacing: "-.04em", lineHeight: 0.92, margin: 0 }}>
          Outdoor Cinematic<br />
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>LUTs</span>
        </h1>
        <p style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 21, lineHeight: 1.5, color: "var(--ashe)", marginTop: 28, maxWidth: "58ch" }}>
          12 LUTs 3D no formato .cube, para Premiere, DaVinci Resolve, Final Cut e praticamente qualquer software de edição. Feitos pra footage outdoor — LOG, Rec.709, S-Log3, D-Log, V-Log.
        </p>
      </div>

      {/* ── REEL PLACEHOLDER ── */}
      <div className="luts-section" style={{ padding: "0 56px 96px" }}>
        <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "#000" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/portfolio/acapamento-janca-huayhuash.jpg)", backgroundSize: "cover", backgroundPosition: "center", opacity: .7 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(30,42,24,.3) 0%, rgba(30,42,24,.1) 50%, rgba(30,42,24,.7) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{ width: 96, height: 96, borderRadius: "50%", border: "2px solid var(--canvas)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(30,42,24,.4)" }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M8 5 L22 14 L8 23 Z" fill="white"/></svg>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".22em", color: "var(--ashe-dim)", textTransform: "uppercase" }}>Reel em produção</div>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 32, left: 32, right: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 2 }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".22em", color: "var(--canvas)" }}>LUTS IN ACTION · EXPEDITION REEL</div>
              <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 22, color: "var(--canvas)", marginTop: 6 }}>Huayhuash · Peru · 2025</div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".15em", color: "var(--ashe)", padding: "4px 10px", border: "1px solid var(--ashe-dim)" }}>em breve</div>
          </div>
        </div>
      </div>

      {/* ── TECH RAIL ── */}
      <div className="tech-rail" style={{ padding: "40px 56px", background: "var(--forest-soft)", borderTop: "1px solid var(--line-dark)", borderBottom: "1px solid var(--line-dark)", display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 32 }}>
        {[
          { k: "Formato",    v: ".cube", vit: " + .3dl" },
          { k: "Resolução",  v: "33×",  vit: " · 3D LUT" },
          { k: "Entrada",    v: "LOG",   vit: " + Rec.709" },
          { k: "Câmeras",    v: "Sony · Canon", vit: " · BMD · DJI" },
          { k: "Software",   v: "Premiere · DaVinci", vit: " · FCP · AE" },
        ].map(({ k, v, vit }) => (
          <div key={k}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--ashe-dim)", marginBottom: 6 }}>{k}</div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600, color: "var(--canvas)" }}>
              {v}<span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>{vit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── LUT CARDS ── */}
      <div className="luts-section" style={{ padding: "96px 56px" }}>
        <div style={{ marginBottom: 56, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--rust-soft)", marginBottom: 12 }}>№ 01 · As doze LUTs</div>
            <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 56, letterSpacing: "-.02em", lineHeight: 1, margin: 0 }}>
              Uma para cada <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--rust-soft)" }}>terreno</span>.
            </h2>
          </div>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 17, color: "var(--ashe)", maxWidth: "44ch", lineHeight: 1.5, margin: 0 }}>
            Nomeadas pelo ambiente em que foram desenhadas. Use a que combina com a luz que você está filmando.
          </p>
        </div>
        <div className="lut-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {LUTS.map((l) => (
            <div key={l.id} className="lut-card" style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", cursor: "default", background: "#000" }}>
              <div className="lut-img" style={{ position: "absolute", inset: 0, backgroundImage: `url(${l.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(30,42,24,0) 40%, rgba(30,42,24,.85) 100%)" }} />
              <div style={{ position: "absolute", top: 16, left: 16, right: 16, display: "flex", justifyContent: "space-between", zIndex: 2 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", color: "var(--canvas)", padding: "4px 10px", border: "1px solid rgba(232,223,201,.5)" }}>.cube</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ashe)", letterSpacing: ".22em" }}>№ {l.id} / 12</div>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24, color: "var(--canvas)", zIndex: 2 }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 30, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1 }}>{l.name}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 14, color: "var(--ashe)", marginTop: 6 }}>{l.kicker}</div>
              </div>
            </div>
          ))}
          {/* Placeholder 7-12 */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`ph-${i}`} style={{ position: "relative", aspectRatio: "16/10", background: "rgba(255,255,255,.04)", border: "1px solid var(--line-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", color: "var(--ashe-dim)", textTransform: "uppercase" }}>
                № {String(7 + i).padStart(2, "0")} / 12 · Em produção
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── COMPATIBILIDADE ── */}
      <div style={{ padding: "80px 56px", background: "var(--forest-soft)", borderTop: "1px solid var(--line-dark)", borderBottom: "1px solid var(--line-dark)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--rust-soft)", marginBottom: 10, textAlign: "center" }}>
          № 02 · Onde roda
        </div>
        <h3 style={{ fontFamily: "var(--font-ui)", fontSize: 32, fontWeight: 600, letterSpacing: "-.02em", marginBottom: 8, textAlign: "center", margin: "0 0 8px" }}>
          Funciona em <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--rust-soft)", fontWeight: 400 }}>tudo</span>.
        </h3>
        <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 15, color: "var(--ashe)", textAlign: "center", marginBottom: 40 }}>
          Testado nas principais suítes de edição — .cube é padrão aberto.
        </p>
        <div className="compat-grid" style={{ display: "flex", justifyContent: "space-around", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          {["Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "After Effects", "Sony Vegas", "FilmConvert"].map((sw) => (
            <div key={sw} style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600, color: "var(--canvas)", textAlign: "center" }}>{sw}</div>
          ))}
        </div>
      </div>

      {/* ── AVISE-ME ── */}
      <div className="buy-grid" style={{ padding: "120px 56px", background: "var(--canvas)", color: "var(--bark)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--rust)", marginBottom: 16 }}>
            № 03 · Lançamento em breve
          </div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 72, letterSpacing: "-.03em", lineHeight: 0.95, margin: "0 0 28px" }}>
            Cor de<br /><span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>cinema</span><br />em um clique.
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "#3A3530", maxWidth: "38ch", lineHeight: 1.55, margin: 0 }}>
            Estou finalizando os 12 LUTs. Deixa seu email — você recebe na hora do lançamento com 20% de desconto exclusivo.
          </p>
        </div>

        <div style={{ background: "var(--canvas-deep)", padding: 40, border: "1px solid var(--line)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 8 }}>
            Outdoor Cinematic LUTs
          </div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 72, fontWeight: 700, letterSpacing: "-.03em", color: "var(--bark)", lineHeight: 1, marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--stone)" }}>R$</span> 299
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--stone)", marginBottom: 28 }}>
            ou 6× de R$ 54,80 sem juros · Pix 10% off
          </div>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20, marginBottom: 28 }}>
            {["12 LUTs 3D em .cube", "Compatível com todo editor", "PDF de instalação + videoaula 36min", "Para LOG e Rec.709", "Licença pessoal e comercial", "20% off para lista de espera"].map((item) => (
              <div key={item} style={{ display: "flex", gap: 12, padding: "8px 0", fontFamily: "var(--font-serif)", fontSize: 15, color: "#3A3530" }}>
                <span style={{ color: "var(--moss)", fontWeight: 600 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {!sent ? (
            <form onSubmit={handleNotify} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: "13px 16px", border: "1px solid var(--line)", background: "transparent",
                  fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--bark)", outline: "none",
                  width: "100%", boxSizing: "border-box",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "16px 24px", background: "var(--bark)", color: "var(--canvas)",
                  fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700,
                  letterSpacing: ".22em", textTransform: "uppercase", cursor: "pointer",
                  border: "none", width: "100%",
                }}
              >
                Avise-me no lançamento →
              </button>
            </form>
          ) : (
            <div style={{ padding: "20px", background: "var(--forest)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, color: "var(--canvas)", lineHeight: 1.5 }}>
                Anotado. Você será o primeiro a saber.
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", color: "var(--ashe)", marginTop: 8, textTransform: "uppercase" }}>
                + 20% de desconto garantido
              </div>
            </div>
          )}

          <div style={{ marginTop: 16, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".15em", color: "var(--stone)", textTransform: "uppercase" }}>
            Sem spam · Só avisamos no lançamento
          </div>
        </div>
      </div>

      <SiteFooter dark={true} />
    </main>
  );
}
