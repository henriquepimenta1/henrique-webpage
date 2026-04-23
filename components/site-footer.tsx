import Link from "next/link";
import { FOOTER_NAV, SITE_EMAIL } from "@/content/home";

export default function SiteFooter({ dark = false }: { dark?: boolean }) {
  const bg     = dark ? "var(--forest-soft)" : "var(--canvas-deep)";
  const fg     = dark ? "var(--canvas)"      : "var(--bark)";
  const dim    = dark ? "rgba(232,223,201,.45)" : "rgba(42,33,26,.5)";
  const border = dark ? "rgba(232,223,201,.14)" : "rgba(42,33,26,.14)";

  return (
    <footer style={{ background:bg,color:fg,padding:"64px 56px 40px",
      borderTop:`1px solid ${border}`,fontFamily:"var(--font-ui)" }}>
      <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:40,marginBottom:48,
        flexWrap:"wrap" }}>

        <div>
          <p style={{ fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:26,
            letterSpacing:"-.01em",lineHeight:1.25,maxWidth:"22ch",margin:"0 0 20px" }}>
            Fotografia de campo, feita com os pés no chão.
          </p>
          <span style={{ fontFamily:"var(--font-hand)",fontSize:30,color:"var(--rust-soft)",
            transform:"rotate(-2deg)",display:"inline-block" }}>— Henrique</span>
        </div>

        <div>
          <p style={{ fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",
            textTransform:"uppercase",color:dim,marginBottom:14,marginTop:0 }}>Navegar</p>
          {FOOTER_NAV.map(l => (
            <Link key={l.href} href={l.href} style={{ display:"block",fontSize:13,
              lineHeight:2,color:fg,textDecoration:"none",opacity:.8 }}>{l.label}</Link>
          ))}
        </div>

        <div>
          <p style={{ fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",
            textTransform:"uppercase",color:dim,marginBottom:14,marginTop:0 }}>Contato</p>
          <a href={`mailto:${SITE_EMAIL}`} style={{ display:"block",fontSize:13,
            lineHeight:2,color:fg,textDecoration:"none",opacity:.8 }}>{SITE_EMAIL}</a>
          <p style={{ fontSize:13,lineHeight:2,opacity:.8,margin:0 }}>São Paulo · BR</p>
          <p style={{ fontSize:13,lineHeight:2,opacity:.5,margin:0 }}>Atende worldwide · desde 2018</p>
        </div>
      </div>

      <div style={{ paddingTop:24,borderTop:`1px solid ${border}`,display:"flex",
        justifyContent:"space-between",alignItems:"center",
        fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".15em",color:dim,
        flexWrap:"wrap",gap:8 }}>
        <span>© 2026 · Henrique Sesana Pimenta · Todos os direitos reservados</span>
        <span>10°17′S &nbsp;76°54′W · alt 4 800 m</span>
      </div>
    </footer>
  );
}
