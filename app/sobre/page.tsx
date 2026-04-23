import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";
import { SITE_AUTHOR, SITE_EMAIL, STATS, SOBRE_BIO } from "@/content/home";

export const metadata = {
  title: "Sobre — henriq.eu",
  description: "Quem está por trás das imagens.",
};

export default function SobrePage() {
  return (
    <div style={{ background: "var(--canvas)", color: "var(--bark)", minHeight: "100vh" }}>
      <SiteNav dark={false} />

      {/* ── HERO SPLIT ── */}
      <section
        className="grid"
        style={{
          gridTemplateColumns: "1fr 1fr",
          minHeight: "100vh",
          paddingTop: 72,
        }}
      >
        {/* LEFT — text */}
        <div
          className="flex flex-col justify-center px-16 py-24"
          style={{ maxWidth: 640 }}
        >
          <p
            className="font-mono text-[10px] uppercase tracking-widest mb-6"
            style={{ color: "var(--stone)" }}
          >
            Sobre
          </p>

          <h1
            className="font-light leading-tight mb-8"
            style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", color: "var(--bark)" }}
          >
            {SITE_AUTHOR.split(" ")[0]}{" "}
            <em
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 300,
                display: "block",
              }}
            >
              {SITE_AUTHOR.split(" ").slice(1).join(" ")}
            </em>
          </h1>

          <div className="flex flex-col gap-5 mb-12">
            {SOBRE_BIO.map((paragraph, i) => (
              <p
                key={i}
                className="text-base leading-relaxed"
                style={{ color: "var(--stone)" }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <a
            href={`mailto:${SITE_EMAIL}`}
            className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
            style={{ color: "var(--bark)" }}
          >
            {SITE_EMAIL}
          </a>
        </div>

        {/* RIGHT — portrait */}
        <div className="relative" style={{ background: "var(--canvas-deep)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/portrait.jpg"
            alt={SITE_AUTHOR}
            className="w-full h-full object-cover object-top"
            style={{ position: "absolute", inset: 0 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--canvas) 0%, transparent 20%)",
            }}
          />
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section
        style={{
          background: "var(--forest)",
          borderTop: "1px solid rgba(232,223,201,.08)",
        }}
      >
        <div
          className="grid py-16 px-8"
          style={{
            maxWidth: 960,
            margin: "0 auto",
            gridTemplateColumns: `repeat(${STATS.length}, 1fr)`,
          }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="font-light mb-1"
                style={{
                  fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                  color: "var(--canvas)",
                  fontFamily: "var(--font-ui)",
                }}
              >
                {stat.value}
              </p>
              <p
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "rgba(232,223,201,.5)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="py-24 px-8" style={{ maxWidth: 720, margin: "0 auto" }}>
        <p
          className="font-mono text-[10px] uppercase tracking-widest mb-8"
          style={{ color: "var(--stone)" }}
        >
          Método
        </p>
        <blockquote
          className="font-light leading-relaxed"
          style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            color: "var(--bark)",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            borderLeft: "2px solid var(--rust-soft)",
            paddingLeft: "1.5rem",
          }}
        >
          Andar devagar, ver mais. A melhor foto é a que existe — não a que foi fabricada.
        </blockquote>
      </section>

      {/* ── GEAR / TOOLS ── */}
      <section
        style={{
          background: "var(--canvas-deep)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="py-20 px-8" style={{ maxWidth: 960, margin: "0 auto" }}>
          <p
            className="font-mono text-[10px] uppercase tracking-widest mb-10"
            style={{ color: "var(--stone)" }}
          >
            Ferramentas
          </p>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {[
              { cat: "Câmeras", items: ["Sony A7 IV", "DJI Mavic 3 Pro"] },
              { cat: "Lentes", items: ["Sony 16-35mm f/2.8 GM", "Sony 85mm f/1.4 GM"] },
              { cat: "Software", items: ["Lightroom Classic", "Capture One"] },
            ].map(({ cat, items }) => (
              <div key={cat}>
                <p
                  className="font-mono text-[9px] uppercase tracking-widest mb-3"
                  style={{ color: "var(--stone)" }}
                >
                  {cat}
                </p>
                {items.map((item) => (
                  <p key={item} className="text-sm mb-1" style={{ color: "var(--bark)" }}>
                    {item}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
