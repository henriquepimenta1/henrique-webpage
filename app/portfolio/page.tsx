import DarkTopNav from "@/components/dark-nav";
import DarkFooter from "@/components/dark-footer";
import PortfolioGallery from "@/components/portfolio-gallery";

export default function PortfolioPage() {
  return (
    <div className="theme-fdl">
      <DarkTopNav active="Portfolio" />

      <header style={{ padding: "var(--hero-clear) var(--pad-page) var(--sect-y)" }}>
        <div className="v2-eyebrow" style={{ marginBottom: 22 }}>
          № 01 · Fotografias autorais
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 500,
            fontSize: "clamp(46px,7vw,92px)",
            letterSpacing: "-.015em",
            lineHeight: 1.03,
            color: "var(--text-1)",
            margin: 0,
            maxWidth: "18ch",
          }}
        >
          O que a câmera viu, <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--text-2)" }}>a pé.</em>
        </h1>
      </header>

      <PortfolioGallery />

      <DarkFooter coords="10°17′S 76°54′W · alt 4 800 m" />
    </div>
  );
}
