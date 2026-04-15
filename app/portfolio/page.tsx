import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";

const LEFT_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&auto=format&fit=crop",
];

const CENTER_IMAGES = [
  "https://images.unsplash.com/photo-1682686581660-3693f0c588d2?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476180814856-a36609db0493?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop",
];

const RIGHT_IMAGES = [
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&auto=format&fit=crop",
];

export const metadata = {
  title: "Portfolio — henriq.eu",
  description: "Lugares, luz e momentos que valeram a viagem.",
};

export default function PortfolioPage() {
  return (
    <div style={{ background: "#0E0C0A", color: "#E6DDD4", minHeight: "100vh" }}>
      <SiteNav />

      {/* ── PAGE HEADER ── */}
      <div className="pt-40 pb-12 px-8" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#60584E" }}>
          Portfolio
        </p>
        <h1 className="text-5xl font-light leading-tight" style={{ color: "#E6DDD4" }}>
          Fotos &amp; <span className="font-semibold">Trabalhos</span>
        </h1>
        <p className="text-sm mt-3 max-w-md leading-relaxed" style={{ color: "#746A62" }}>
          Lugares, luz e momentos que valeram a viagem. Fotografia outdoor, natureza e expedições pelo mundo.
        </p>
      </div>

      {/* ── STICKY SCROLL GALLERY ── */}
      <section className="px-2" style={{ background: "#0E0C0A" }}>
        <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>

          {/* LEFT — scrolls normally */}
          <div className="flex flex-col gap-2">
            {LEFT_IMAGES.map((src, i) => (
              <figure key={i} className="w-full m-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="w-full object-cover rounded-md"
                  style={{ height: 384 }}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>

          {/* CENTER — sticky */}
          <div
            className="flex flex-col gap-2"
            style={{ position: "sticky", top: 0, height: "100vh" }}
          >
            {CENTER_IMAGES.map((src, i) => (
              <figure key={i} className="w-full m-0" style={{ flex: 1, minHeight: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover rounded-md"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </figure>
            ))}
          </div>

          {/* RIGHT — scrolls normally */}
          <div className="flex flex-col gap-2">
            {RIGHT_IMAGES.map((src, i) => (
              <figure key={i} className="w-full m-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="w-full object-cover rounded-md"
                  style={{ height: 384 }}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>

        </div>
      </section>

      <div style={{ marginTop: 8 }}>
        <SiteFooter />
      </div>
    </div>
  );
}
