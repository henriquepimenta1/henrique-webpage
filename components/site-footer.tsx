import Link from "next/link";

const NAV_LINKS = [
  { label: "Portfolio",   href: "/portfolio" },
  { label: "Presets",     href: "/presets" },
  { label: "Expedições",  href: "/expedicoes" },
  { label: "Sobre",       href: "/#sobre" },
];

const SOCIAL_LINKS = ["Instagram", "Twitter", "Behance"];

interface Props {
  /** Show the 6-photo grid strip (home only) */
  photoStrip?: string[];
}

export default function SiteFooter({ photoStrip }: Props) {
  return (
    <footer className="py-16 px-8" style={{ borderTop: "1px solid #2B2420", background: "#0E0C0A" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="grid grid-cols-3 gap-12 mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[.2em] mb-5" style={{ color: "#4C4440" }}>
              Páginas
            </p>
            <div className="space-y-2">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="block text-sm transition-colors hover:text-[#E6DDD4]"
                  style={{ color: "#887E76" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[.2em] mb-5" style={{ color: "#4C4440" }}>
              Localização
            </p>
            <div className="space-y-1.5">
              <p className="text-sm" style={{ color: "#887E76" }}>Disponível Mundialmente</p>
              <a
                href="mailto:management@henriq.eu"
                className="block text-sm transition-colors hover:text-[#E6DDD4]"
                style={{ color: "#887E76" }}
              >
                management@henriq.eu
              </a>
              <p className="text-sm" style={{ color: "#4C4440" }}>Chipre</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[.2em] mb-5" style={{ color: "#4C4440" }}>
              Redes Sociais
            </p>
            <div className="space-y-2">
              {SOCIAL_LINKS.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-sm transition-colors hover:text-[#E6DDD4] underline underline-offset-2"
                  style={{ color: "#887E76", textDecorationColor: "#2B2420" }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Optional photo strip */}
        {photoStrip && (
          <div className="grid grid-cols-6 gap-2 mb-10">
            {photoStrip.map((src, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ objectPosition: i >= 4 ? "top" : "center" }}
                />
              </div>
            ))}
          </div>
        )}

        <div
          className="flex items-center justify-between pt-6"
          style={{ borderTop: "1px solid #2B2420" }}
        >
          <p className="text-xs" style={{ color: "#4C4440" }}>@henriq.eu</p>
          <p className="text-xs" style={{ color: "#4C4440" }}>henriq.eu</p>
        </div>
      </div>
    </footer>
  );
}
