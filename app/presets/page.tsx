"use client";

import Link from "next/link";
import { useState } from "react";
import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";

export default function PresetsHubPage() {
  const [hoverA, setHoverA] = useState(false);
  const [hoverB, setHoverB] = useState(false);

  return (
    <main style={{ background: "var(--canvas)", color: "var(--bark)", fontFamily: "var(--font-ui)", minHeight: "100vh" }}>
      <style>{`
        .door-img { transition: transform 1s cubic-bezier(.2,.7,.2,1); }
        .door:hover .door-img { transform: scale(1.06); }
        .door-cta-arrow { transition: transform .3s cubic-bezier(.2,.7,.2,1); }
        .door:hover .door-cta-arrow { transform: translateX(6px); }
        .compare-item { overflow: hidden; }
        .compare-img { transition: transform 1s cubic-bezier(.2,.7,.2,1); }
        .compare-item:hover .compare-img { transform: scale(1.05); }
        @media(max-width:900px){
          .two-door { grid-template-columns: 1fr !important; }
          .door { height: 480px !important; }
          .compare-grid { grid-template-columns: repeat(2,1fr) !important; }
          .rail { grid-template-columns: repeat(2,1fr) !important; }
          .hub-title { font-size: clamp(52px,12vw,84px) !important; }
        }
        @media(max-width:560px){
          .compare-grid { grid-template-columns: 1fr !important; }
          .hub-hero { padding: 100px 24px 48px !important; }
          .hub-rail, .hub-compare, .hub-doors { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>

      <SiteNav dark={false} />

      {/* ── EYEBROW ── */}
      <div style={{ padding: "100px 56px 0", display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-ui)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", fontWeight: 500 }}>
        <span>№ 03</span>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--rust)", display: "inline-block" }} />
        <span>Cor · tratamento</span>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--rust)", display: "inline-block" }} />
        <span style={{ color: "var(--rust)" }}>Desde 2022</span>
      </div>

      {/* ── HERO ── */}
      <div className="hub-hero" style={{ padding: "28px 56px 64px", position: "relative" }}>
        <div style={{ fontFamily: "var(--font-hand)", fontSize: 38, color: "var(--rust)", transform: "rotate(-2deg)", display: "inline-block", marginBottom: 6, letterSpacing: ".01em" }}>
          a mesma cor que eu uso—
        </div>
        <h1 className="hub-title" style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 84, letterSpacing: "-.03em", lineHeight: 0.95, margin: 0, color: "var(--bark)" }}>
          Presets & LUTs<br />
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>saídos das minhas fotos</span>
        </h1>
        <p style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 19, lineHeight: 1.5, color: "#3A3530", marginTop: 28, maxWidth: "58ch" }}>
          O mesmo tratamento que aplico no meu próprio portfólio, agora no seu Lightroom e no seu Premiere. Dois pacotes separados — escolha o que cabe no seu fluxo.
        </p>
      </div>

      {/* ── RAIL TÉCNICO ── */}
      <div className="hub-rail rail" style={{ padding: "40px 56px", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40 }}>
        {[
          { k: "Compatibilidade", v: "Lightroom · Photoshop · Camera Raw" },
          { k: "Formato",          v: ".xmp · .dng · .cube · .3dl" },
          { k: "Licença",          v: "Pessoal + comercial" },
          { k: "Atualizações",     v: "Vitalícias, sem custo" },
        ].map(({ k, v }) => (
          <div key={k}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 6 }}>{k}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 19, color: "var(--bark)" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── DUAS PORTAS ── */}
      <div className="hub-doors two-door" style={{ padding: "56px 56px 96px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Porta 1 · Presets */}
        <Link href="/presets/fotografia" style={{ textDecoration: "none" }}>
          <div
            className="door"
            style={{ position: "relative", height: 540, overflow: "hidden", cursor: "pointer", background: "var(--forest)" }}
            onMouseEnter={() => setHoverA(true)}
            onMouseLeave={() => setHoverA(false)}
          >
            <div
              className="door-img"
              style={{
                position: "absolute", inset: 0,
                backgroundImage: "url(/images/portfolio/pico-ciririca-serradoibitiraquire.jpg)",
                backgroundSize: "cover", backgroundPosition: "center",
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(30,42,24,.25) 0%, rgba(30,42,24,.1) 40%, rgba(30,42,24,.85) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "32px 32px 36px", zIndex: 2, color: "var(--canvas)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ padding: "5px 10px", border: "1px solid rgba(232,223,201,.5)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase" }}>.xmp · .dng</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", color: "var(--ashe)" }}>№ 01 / 02</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, color: "var(--ashe)", marginBottom: 12 }}>Para fotografia · Lightroom</div>
                <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 44, letterSpacing: "-.02em", lineHeight: 1, margin: 0, marginBottom: 4 }}>
                  Outdoor Cinematic<br />Presets
                </h2>
                <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid rgba(232,223,201,.25)", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", fontWeight: 600 }}>
                  <span>54 presets · R$ 249</span>
                  <span className="door-cta-arrow" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 22, fontWeight: 400 }}>→</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Porta 2 · LUTs (Em breve) */}
        <Link href="/presets/video" style={{ textDecoration: "none" }}>
          <div
            className="door"
            style={{ position: "relative", height: 540, overflow: "hidden", cursor: "pointer", background: "var(--forest)" }}
            onMouseEnter={() => setHoverB(true)}
            onMouseLeave={() => setHoverB(false)}
          >
            <div
              className="door-img"
              style={{
                position: "absolute", inset: 0,
                backgroundImage: "url(/images/portfolio/as3lagunas-huayhuash.jpg)",
                backgroundSize: "cover", backgroundPosition: "center",
                filter: "brightness(.85)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(30,42,24,.35) 0%, rgba(30,42,24,.15) 40%, rgba(30,42,24,.9) 100%)" }} />

            {/* Badge em breve */}
            <div style={{ position: "absolute", top: 32, right: 32, zIndex: 3, padding: "6px 14px", background: "var(--rust)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--canvas)" }}>
              Em breve
            </div>

            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "32px 32px 36px", zIndex: 2, color: "var(--canvas)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ padding: "5px 10px", border: "1px solid rgba(232,223,201,.5)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase" }}>.cube · .3dl</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em", color: "var(--ashe)" }}>№ 02 / 02</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, color: "var(--ashe)", marginBottom: 12 }}>Para vídeo · Premiere · DaVinci · FCP</div>
                <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 44, letterSpacing: "-.02em", lineHeight: 1, margin: 0, marginBottom: 4 }}>
                  Outdoor Cinematic<br />LUTs
                </h2>
                <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid rgba(232,223,201,.25)", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-ui)", fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", fontWeight: 600 }}>
                  <span>12 LUTs · R$ 299</span>
                  <span className="door-cta-arrow" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 22, fontWeight: 400 }}>→</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ── A MESMA PALETA ── */}
      <div className="hub-compare" style={{ padding: "96px 56px", background: "var(--canvas-deep)" }}>
        <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 48, letterSpacing: "-.02em", lineHeight: 1, marginBottom: 14, color: "var(--bark)", margin: 0 }}>
          A mesma <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}>paleta</span>,<br />em foto e vídeo.
        </h2>
        <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, color: "#3A3530", maxWidth: "52ch", marginTop: 14, marginBottom: 40, lineHeight: 1.55 }}>
          Construí as duas coleções a partir do mesmo referencial cinematográfico. Cor de cinema, mas feita em campo — não em estúdio.
        </p>
        <div className="compare-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { img: "/images/portfolio/acapamento-janca-huayhuash.jpg",    lbl: "Portfolio · Andes" },
            { img: "/images/portfolio/laguna-acampamento-janca-huayhuash.jpg", lbl: "Campo · Huayhuash" },
            { img: "/images/portfolio/lencois-silhueta-pordosol.jpg",     lbl: "Lençóis · Pôr do sol" },
            { img: "/images/portfolio/vista-para-montanhas-itatiaia.jpg", lbl: "Itatiaia · Amanhecer" },
          ].map(({ img, lbl }) => (
            <div key={lbl} className="compare-item" style={{ aspectRatio: "3/4", position: "relative" }}>
              <div
                className="compare-img"
                style={{ position: "absolute", inset: 0, backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}
              />
              <div style={{ position: "absolute", bottom: 10, left: 10, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".15em", color: "var(--canvas)", background: "rgba(30,42,24,.75)", padding: "3px 8px" }}>
                {lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SiteFooter dark={false} />
    </main>
  );
}
