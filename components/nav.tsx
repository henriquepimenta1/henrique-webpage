"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_AUTHOR } from "@/content/home";

export default function SiteNav({ dark = true }: { dark?: boolean }) {
  const pathname = usePathname();
  const fg = dark ? "var(--canvas)" : "var(--bark)";
  const bg = dark ? "var(--forest)" : "var(--canvas)";
  const border = dark ? "rgba(232,223,201,.14)" : "rgba(42,33,26,.14)";

  return (
    <header style={{ position:"absolute",top:0,left:0,right:0,height:72,display:"flex",
      alignItems:"center",justifyContent:"space-between",padding:"0 40px",zIndex:30,
      background:bg,borderBottom:`1px solid ${border}` }}>

      <Link href="/" style={{ display:"flex",alignItems:"center",gap:10,textDecoration:"none" }}>
        <div style={{ width:32,height:32,border:`1.5px solid ${fg}`,display:"flex",
          alignItems:"center",justifyContent:"center",fontFamily:"var(--font-serif)",
          fontStyle:"italic",fontSize:18,fontWeight:500,color:fg }}>H</div>
        <span style={{ fontFamily:"var(--font-ui)",fontSize:11,letterSpacing:".28em",
          textTransform:"uppercase",fontWeight:600,color:fg,
          display:"none" }} className="md-show">{SITE_AUTHOR}</span>
      </Link>

      <nav style={{ display:"flex",gap:24,fontFamily:"var(--font-ui)",fontSize:10.5,
        letterSpacing:".22em",textTransform:"uppercase",fontWeight:500 }}>
        {NAV_LINKS.map(item => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{ color:fg,textDecoration:"none",
              opacity:active ? 1 : .72,paddingBottom:2,
              borderBottom:active ? `1px solid var(--rust-soft)` : "1px solid transparent",
              transition:"opacity .2s,border-color .2s",whiteSpace:"nowrap" }}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
