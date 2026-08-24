import Link from "next/link";
import { DARK_NAV_L, DARK_NAV_R } from "@/components/dark-nav-links";

interface DarkFooterProps {
  coords?: string;
}

export default function DarkFooter({ coords = "10°17′S 76°54′W · alt 4 800 m" }: DarkFooterProps) {
  const navLinks = [...DARK_NAV_L, ...DARK_NAV_R.slice(0, 2)];

  return (
    <footer className="v2-footer">
      <div className="v2-footer-grid">
        <div>
          <p className="v2-footer-tag">Fotografia de campo, feita com os pés no chão.</p>
          <span className="v2-footer-sign">— Henrique</span>
        </div>
        <div>
          <p className="v2-footer-k">Navegar</p>
          {navLinks.map((l) => (
            <Link key={l.href} className="v2-footer-link" href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
        <div>
          <p className="v2-footer-k">Contato</p>
          <a className="v2-footer-link" href="mailto:contato@euhenriq.com">
            contato@euhenriq.com
          </a>
          <a className="v2-footer-link" href="https://instagram.com/henriq.eu" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="v2-footer-link" href="https://open.substack.com/henriq" target="_blank" rel="noreferrer">
            Substack
          </a>
        </div>
        <div>
          <p className="v2-footer-k">Base</p>
          <p className="v2-footer-line">São Paulo · BR</p>
          <p className="v2-footer-line" style={{ opacity: 0.8 }}>
            Atende worldwide
          </p>
          <p className="v2-footer-line" style={{ opacity: 0.6 }}>
            Desde 2018
          </p>
        </div>
      </div>
      <div className="v2-footer-base">
        <span>
          © 2026 · Henrique Sesana Pimenta · Todos os direitos reservados ·{" "}
          <Link className="v2-footer-link" href="/privacidade" style={{ display: "inline" }}>
            Privacidade
          </Link>
        </span>
        <span>{coords}</span>
      </div>
    </footer>
  );
}
