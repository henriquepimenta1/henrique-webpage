"use client";

import Link from "next/link";
import { useState } from "react";
import { HOME_CARDS, NAV_LINKS, SITE_AUTHOR } from "@/content/home";

const HAND_WORDS = ["explorar", "caminhar", "aplicar"] as const;

export default function HomePage() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div
      style={{ background: "var(--forest)", color: "var(--canvas)", height: "100svh", overflow: "hidden", fontFamily: "var(--font-ui)" }}
    >
      <style>{`
        @keyframes kb1 { 0%,100%{transform:scale(1.05) translate(0%,0%)} 50%{transform:scale(1.18) translate(-2%,-1.5%)} }
        @keyframes kb2 { 0%,100%{transform:scale(1.08) translate(-1%,-1%)} 50%{transform:scale(1.2) translate(2%,1%)} }
        @keyframes kb3 { 0%,100%{transform:scale(1.1) translate(1%,0%)} 50%{transform:scale(1.22) translate(-1.5%,-2%)} }

        .hf-card { position:relative; flex:1; height:100%; overflow:hidden; cursor:pointer;
          transition:flex .9s cubic-bezier(.2,.7,.2,1);
          border-right:1px solid rgba(232,223,201,.08); }
        .hf-card:last-child { border-right:0; }
        .hf-card.hov  { flex:1.4; }
        .hf-card.dim  { flex:.85; }

        .kb1 { animation:kb1 22s ease-in-out infinite; }
        .kb2 { animation:kb2 25s ease-in-out infinite; }
        .kb3 { animation:kb3 27s ease-in-out infinite; }

        .hf-grad { position:absolute;inset:0;
          background:linear-gradient(180deg,rgba(30,42,24,.4) 0%,rgba(30,42,24,.1) 35%,rgba(30,42,24,.1) 55%,rgba(30,42,24,.88) 100%);
          transition:background .4s; }
        .hf-card.hov .hf-grad { background:linear-gradient(180deg,rgba(30,42,24,.2) 0%,rgba(30,42,24,.04) 35%,rgba(30,42,24,.2) 55%,rgba(30,42,24,.75) 100%); }
        .hf-card.dim .hf-grad { background:linear-gradient(180deg,rgba(30,42,24,.6) 0%,rgba(30,42,24,.35) 35%,rgba(30,42,24,.35) 55%,rgba(30,42,24,.92) 100%); }

        .hf-hand { position:absolute;top:168px;right:24px;
          font-family:var(--font-hand);font-size:22px;color:var(--rust-soft);
          transform:rotate(-4deg);opacity:0;transition:opacity .4s .1s,transform .4s;pointer-events:none; }
        .hf-card.hov .hf-hand { opacity:1;transform:rotate(-6deg) translateY(-2px); }

        .hf-arrow { font-family:var(--font-serif);font-style:italic;font-size:22px;font-weight:400;
          transition:transform .3s cubic-bezier(.2,.7,.2,1),color .3s; }
        .hf-card.hov .hf-arrow { transform:translateX(8px);color:var(--rust-soft); }

        .hf-nav-link { color:var(--canvas);opacity:.75;font-size:11px;letter-spacing:.22em;
          text-transform:uppercase;font-weight:500;text-decoration:none;
          padding-bottom:2px;border-bottom:1px solid transparent;
          transition:opacity .2s,border-color .2s; }
        .hf-nav-link:hover { opacity:1;border-color:var(--rust-soft); }

        /* Mobile */
        @media(max-width:767px){
          .hf-row { flex-direction:column !important; height:auto !important; }
          .hf-card { flex:none !important; width:100% !important; height:260px; border-right:0;
            border-bottom:1px solid rgba(232,223,201,.08); }
          .hf-card:last-child { border-bottom:0; }
          .hf-card.hov,.hf-card.dim { flex:none !important; }
          .hf-tagline { display:none !important; }
          .hf-coords  { display:none !important; }
          .hf-topbar-name { display:none !important; }
        }
      `}</style>

      {/* ── Topbar ── */}
      <header className="hf-topbar" style={{
        position:"absolute",top:0,left:0,right:0,height:72,
        display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",
        padding:"0 40px",zIndex:20,
        backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
        background:"rgba(30,42,24,.35)",
        borderBottom:"1px solid rgba(232,223,201,.08)",
      }}>
        {/* Nav esquerda */}
        <nav style={{ display:"flex",gap:28 }}>
          <Link href="/portfolio"  className="hf-nav-link">Portfolio</Link>
          <Link href="/presets"    className="hf-nav-link">Presets</Link>
          <Link href="/expedicoes" className="hf-nav-link">Expedições</Link>
        </nav>

        {/* Centro — logo manuscrito */}
        <Link href="/" style={{ textDecoration:"none",color:"inherit",textAlign:"center" }}>
          <span style={{ fontFamily:"var(--font-hand)",fontSize:32,color:"var(--canvas)",
            letterSpacing:".02em",lineHeight:1 }}>
            Eu Henriq
          </span>
        </Link>

        {/* Nav direita */}
        <nav style={{ display:"flex",gap:28,justifyContent:"flex-end" }}>
          <Link href="/quadros"  className="hf-nav-link">Quadros</Link>
          <Link href="/midiakit" className="hf-nav-link">Midiakit</Link>
          <Link href="/sobre"    className="hf-nav-link">Sobre</Link>
          <Link href="/contato"  className="hf-nav-link">Contato</Link>
        </nav>
      </header>

      {/* ── Cards ── */}
      <div className="hf-row" style={{ display:"flex",height:"100%",width:"100%" }}
        onMouseLeave={() => setHover(null)}>
        {HOME_CARDS.map((card, i) => {
          const kickers = ["Fotografias autorais", "Tratamento de cor", "Viagens guiadas"] as const;
          const accents = ["№ 01", "№ 02", "№ 03"] as const;
          const kbClass = `kb${i + 1}`;
          const cls = `hf-card hf-card-${i+1}${hover === i ? " hov" : ""}${hover !== null && hover !== i ? " dim" : ""}`;

          return (
            <Link key={card.href} href={card.href} className={cls}
              style={{ textDecoration:"none",color:"inherit" }}
              onMouseEnter={() => setHover(i)}>

              {/* BG com Ken Burns */}
              <div className={kbClass} style={{ position:"absolute",inset:0,
                backgroundImage:`url(${card.bg})`,backgroundSize:"cover",
                backgroundPosition:card.bgPosition,willChange:"transform" }} />

              <div className="hf-grad" />

              {/* Accent top-left */}
              <div style={{ position:"absolute",top:110,left:32,zIndex:2 }}>
                <div style={{ fontFamily:"var(--font-mono)",fontSize:10,
                  letterSpacing:".22em",color:"rgba(232,223,201,.7)" }}>
                  {accents[i]}
                </div>
                <div style={{ width:28,height:1,background:"rgba(232,223,201,.45)",marginTop:8 }} />
              </div>

              {/* Counter top-right */}
              <div style={{ position:"absolute",top:110,right:32,zIndex:2,
                fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",
                color:"rgba(232,223,201,.55)" }}>
                {String(i+1).padStart(2,"0")} / 03
              </div>

              {/* Manuscrita hover */}
              <div className="hf-hand">{HAND_WORDS[i]}—</div>

              {/* Conteúdo inferior */}
              <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",
                justifyContent:"flex-end",padding:"36px 32px",zIndex:2 }}>
                <div style={{ fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:15,
                  color:"rgba(232,223,201,.78)",marginBottom:12,letterSpacing:".01em" }}>
                  {kickers[i]}
                </div>
                <h2 style={{ fontFamily:"var(--font-ui)",fontWeight:600,fontSize:36,
                  letterSpacing:"-.02em",color:"var(--canvas)",margin:0,lineHeight:1 }}>
                  {card.label}
                </h2>
                <div style={{ marginTop:28,display:"flex",alignItems:"center",
                  justifyContent:"space-between",paddingTop:18,
                  borderTop:"1px solid rgba(232,223,201,.22)",
                  fontFamily:"var(--font-ui)",fontSize:11,letterSpacing:".22em",
                  textTransform:"uppercase",fontWeight:600,color:"var(--canvas)" }}>
                  <span>Explorar</span>
                  <span className="hf-arrow">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Tagline inferior esquerda ── */}
      <div className="hf-tagline" style={{ position:"absolute",bottom:24,left:40,
        display:"flex",alignItems:"center",gap:14,zIndex:15,pointerEvents:"none" }}>
        <span style={{ fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",
          textTransform:"uppercase",color:"rgba(232,223,201,.5)" }}>
          Fotografia de campo · desde 2018
        </span>
        <span style={{ fontFamily:"var(--font-hand)",fontSize:26,
          color:"rgba(232,223,201,.8)",transform:"rotate(-2deg)" }}>
          onde a câmera vai junto—
        </span>
      </div>

      {/* ── Coordenadas inferior direita ── */}
      <div className="hf-coords" style={{ position:"absolute",bottom:24,right:40,
        fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".15em",
        color:"rgba(232,223,201,.4)",zIndex:15 }}>
        10°17′S &nbsp; 76°54′W &nbsp;·&nbsp; alt 4 800 m
      </div>
    </div>
  );
}
