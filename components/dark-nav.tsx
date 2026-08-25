"use client";
import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { DARK_NAV_L, DARK_NAV_R } from "@/components/dark-nav-links";

// Chrome "Fim de Luz" — topbar. Divergências por página viram props:
//   active: label da página atual · topStyle: override de posicionamento.
interface DarkTopNavProps {
  active?: string;
  topStyle?: CSSProperties;
  /** Ação opcional à direita da nav. Existe para a landing do Rabiscando
   *  poder oferecer "Assinar" sem que o botão apareça nas outras páginas. */
  acao?: ReactNode;
}

export default function DarkTopNav({ active, topStyle, acao }: DarkTopNavProps) {
  const [open, setOpen] = useState(false);

  const link = (l: { label: string; href: string }) => (
    <Link
      key={l.href}
      className="v2-nav-link"
      href={l.href}
      style={l.label === active ? { opacity: 1, borderColor: "var(--accent)" } : undefined}
    >
      {l.label}
    </Link>
  );

  return (
    <header className="v2-topbar" style={topStyle}>
      <nav className="v2-nav">{DARK_NAV_L.map(link)}</nav>
      {active === "Home" ? (
        <a
          href="#"
          className="v2-logo"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Eu Henriq
        </a>
      ) : (
        <Link href="/" className="v2-logo">
          Eu Henriq
        </Link>
      )}
      <nav className="v2-nav" style={{ justifyContent: "flex-end", alignItems: "center" }}>
        {DARK_NAV_R.map(link)}
        {acao}
      </nav>
      <button className="v2-menu-btn" onClick={() => setOpen(true)}>
        Menu
      </button>
      {open && (
        <div className="v2-menu-overlay">
          <div className="v2-menu-top">
            <span className="v2-logo">Eu Henriq</span>
            <button className="v2-menu-btn" style={{ display: "block" }} onClick={() => setOpen(false)}>
              Fechar
            </button>
          </div>
          <nav className="v2-menu-list">
            {[...DARK_NAV_L, ...DARK_NAV_R].map((l, i) => (
              <Link key={l.href} href={l.href} className="v2-menu-item" onClick={() => setOpen(false)}>
                <span className="v2-menu-num">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="v2-menu-foot">contato@euhenriq.com · @henriq.eu</div>
        </div>
      )}
    </header>
  );
}
