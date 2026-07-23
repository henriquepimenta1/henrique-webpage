import Link from "next/link";
import DarkTopNav from "@/components/dark-nav";
import DarkFooter from "@/components/dark-footer";

// Expedições — Dark Editorial "Fim de Luz". Portado do protótipo hi-fi.
// Regra de negócio: SOB CONSULTA, SEM PREÇOS. Valores sob consulta.
const EMAIL = "contato@euhenriq.com";

interface Trip {
  id: string;
  href?: string;
  name: string;
  country: string;
  when: string;
  days: number;
  alt: string;
  km: string;
  level: string;
  status: string;
  available: boolean;
  cta?: string;
  hero: string;
  kicker: string;
  desc: string;
}

const TRIPS: Trip[] = [
  {
    id: "01",
    href: "/expedicoes/lencois",
    name: "Lençóis Maranhenses",
    country: "Brasil · MA",
    when: "Ago 2026",
    days: 4,
    alt: "40 m",
    km: "52 km",
    level: "Intermediário",
    status: "Vagas abertas",
    available: true,
    hero: "/images/lencois/DJI_20250828174205_0403_D-HDR.jpg",
    kicker: "Deserto com lagoas. Sem neblina, com Via Láctea.",
    desc: "Quatro dias na melhor janela do ano — lagoas cheias, poucos turistas e astrofotografia garantida. Três pacotes de imersão. Base em Barreirinhas, travessia a pé até Santo Amaro.",
  },
  {
    id: "02",
    name: "Explore Rondônia",
    country: "Brasil · RO",
    when: "2026",
    days: 5,
    alt: "Pakaás",
    km: "Barco · trilhas",
    level: "Iniciante",
    status: "Em formação",
    available: true,
    href: "/expedicoes/rondonia",
    cta: "Quero saber mais →",
    hero: "/images/portfolio/hotel-pakaas-ronodonia-riomamore-riopakaas.jpg",
    kicker: "Amazônia onde quase ninguém vai.",
    desc: "Cinco dias fotografando o Rio Mamoré, o Forte Príncipe da Beira, aldeias ribeirinhas e a mata amazônica — na fronteira entre Brasil e Bolívia. Base no Hotel Pakaás. Datas em definição.",
  },
  {
    id: "03",
    name: "Cordillera Huayhuash",
    country: "Peru",
    when: "2027",
    days: 11,
    alt: "5 050 m",
    km: "130 km",
    level: "Avançado",
    status: "Em breve",
    available: false,
    hero: "/images/exp-huayhuash.jpg",
    kicker: "A trilha mais dura, a luz mais limpa.",
    desc: "Onze dias no circuito clássico da Huayhuash, passando por lagoas de 4.600 m e o vale de Janca. Saímos de Huaraz com mulas carregando o acampamento — você carrega só sua câmera.",
  },
];

const STEPS: ReadonlyArray<[string, string, string]> = [
  ["01", "Conversa", "Você escreve, eu respondo em 48h com um papo por vídeo."],
  ["02", "Reserva", "Condições de reserva e pagamento, sob consulta."],
  ["03", "Preparo", "Kit completo: equipamento, preparo físico, briefing."],
  ["04", "Campo", "Encontro na cidade-base, expedição, álbum digital."],
];

function TripCard({ trip }: { trip: Trip }) {
  return (
    <article className="ex-card">
      <div className="ex-card-img">
        <img src={trip.hero} alt={trip.name} loading="lazy" />
      </div>
      <div className="ex-card-body">
        <div className="ex-card-k">
          <span>Expedição № {trip.id}</span>
          <span>{trip.when}</span>
        </div>
        <h3 className="ex-card-name">{trip.name}</h3>
        <p className="ex-card-kicker">{trip.kicker}</p>
        <p className="ex-card-desc">{trip.desc}</p>
        <div className="ex-specs">
          {(
            [
              ["Duração", `${trip.days} dias`],
              ["Percurso", trip.km],
              ["Altitude", trip.alt],
              ["Nível", trip.level],
            ] as ReadonlyArray<[string, string]>
          ).map(([k, v]) => (
            <div key={k}>
              <div className="ex-spec-k">{k}</div>
              <div className="ex-spec-v">{v}</div>
            </div>
          ))}
        </div>
        <div className="ex-card-foot">
          <span className="ex-card-price">{trip.available ? "Valores sob consulta" : trip.status}</span>
          {trip.available && trip.href ? (
            <Link className="ex-card-cta" href={trip.href}>
              Detalhes →
            </Link>
          ) : (
            <a className="ex-card-cta muted" href={`mailto:${EMAIL}`}>
              {trip.cta || "Avisar quando abrir"}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ExpedicoesPage() {
  return (
    <div className="theme-fdl">
      <style>{`
        /* ── hero ── */
        .ex-hero{position:relative;min-height:74vh;display:flex;align-items:flex-end;overflow:hidden;margin-top:-76px}
        .ex-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .ex-hero-grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,12,11,.55) 0%,rgba(13,12,11,0) 38%,rgba(13,12,11,.9) 100%)}
        .ex-hero-body{position:relative;z-index:2;padding:var(--hero-clear) var(--s-5) var(--s-56);width:100%}
        .ex-h1{font-family:var(--font-serif);font-weight:500;font-size:clamp(44px,6.6vw,84px);letter-spacing:-.015em;line-height:1.04;color:var(--text-1);margin:0;max-width:19ch;text-wrap:pretty}
        .ex-h1 em{font-style:italic;font-weight:400}
        .ex-hero-foot{margin-top:var(--s-3);display:flex;align-items:baseline;gap:32px;flex-wrap:wrap}
        .ex-hero-note{font-family:var(--font-serif);font-style:italic;font-size:15px;color:var(--text-2)}

        /* ── agenda ── */
        .ex-section{padding:var(--sect-y) var(--s-5)}
        .ex-h2{font-family:var(--font-serif);font-weight:500;font-size:clamp(30px,4vw,44px);letter-spacing:-.01em;color:var(--text-1);margin:var(--s-1) 0 var(--s-40)}
        .ex-h2 em{font-style:italic;font-weight:400;color:var(--text-2)}
        .ex-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:var(--s-3)}
        .ex-card{background:var(--surface);border:1px solid var(--border);display:flex;flex-direction:column}
        .ex-card-img{height:280px;overflow:hidden}
        .ex-card-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.1s cubic-bezier(.2,.7,.2,1)}
        .ex-card:hover .ex-card-img img{transform:scale(1.035)}
        .ex-card-body{padding:var(--s-3) var(--s-3) var(--s-3);display:flex;flex-direction:column;flex:1}
        .ex-card-k{display:flex;justify-content:space-between;align-items:baseline;font-family:var(--font-mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--text-3)}
        .ex-card-name{font-family:var(--font-serif);font-weight:500;font-size:clamp(24px,3vw,30px);letter-spacing:-.01em;color:var(--text-1);margin:var(--s-1) 0 0;line-height:1.15}
        .ex-card-kicker{font-family:var(--font-serif);font-style:italic;font-size:14.5px;line-height:1.55;color:var(--text-2);margin:8px 0 0}
        .ex-card-desc{font-family:var(--font-serif);font-size:14px;line-height:1.7;color:var(--text-2);margin:var(--s-1) 0 0}
        .ex-specs{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--s-2);margin-top:var(--s-2);padding-top:var(--s-2);border-top:1px solid var(--border)}
        .ex-spec-k{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-3)}
        .ex-spec-v{font-size:14px;font-weight:500;color:var(--text-1);margin-top:4px}
        .ex-card-foot{margin-top:auto;padding-top:var(--s-2);border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:var(--s-1);margin-block-start:20px}
        .ex-card-price{font-family:var(--font-serif);font-style:italic;font-size:14px;color:var(--text-2)}
        .ex-card-cta{font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);text-decoration:none;white-space:nowrap}
        .ex-card-cta.muted{color:var(--text-3)}

        /* ── passos ── */
        .ex-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(var(--s-2),3vw,var(--s-4))}
        .ex-step{border-top:1px solid var(--border);padding-top:16px}
        .ex-step-n{font-family:var(--font-mono);font-size:10px;letter-spacing:.22em;color:var(--text-3);margin-bottom:10px}
        .ex-step-t{font-size:17px;font-weight:600;color:var(--text-1);margin-bottom:6px;line-height:1.2}
        .ex-step-d{font-family:var(--font-serif);font-size:14px;line-height:1.65;color:var(--text-2)}

        /* ── consulta ── */
        .ex-consulta{border-top:1px solid var(--border);padding:var(--sect-xl) var(--s-5);text-align:center}
        .ex-consulta p{font-family:var(--font-serif);font-style:italic;font-size:clamp(20px,2.6vw,28px);line-height:1.55;color:var(--text-2);max-width:40ch;margin:0 auto}

        /* ── responsive ── */
        @media(max-width:960px){
          .ex-cards{grid-template-columns:1fr}
          .ex-steps{grid-template-columns:1fr 1fr}
        }
        @media(max-width:640px){
          .ex-hero-body{padding:var(--hero-clear) var(--s-3) var(--s-5)}
          .ex-section{padding:var(--s-56) var(--s-3)}
          .ex-consulta{padding:var(--s-6) var(--s-3) var(--s-72)}
          .ex-steps{grid-template-columns:1fr}
          .ex-cards{grid-template-columns:1fr}
          .ex-card-img{height:220px}
        }
      `}</style>

      <DarkTopNav active="Expedições" topStyle={{ background: "transparent", position: "relative" }} />

      <section className="ex-hero">
        <img src="/images/lencois/DJI_20250828174205_0403_D-HDR.jpg" alt="Lençóis Maranhenses vistos do alto" />
        <div className="ex-hero-grad" />
        <div className="ex-hero-body">
          <div className="v2-eyebrow" style={{ marginBottom: 20 }}>
            № 02 · Viagens guiadas · grupos de até 10
          </div>
          <h1 className="ex-h1">
            Expedições <em>que ensinam a ver.</em>
          </h1>
          <div className="ex-hero-foot">
            <a className="v2-accent-link" href="#agenda">
              Ver a próxima expedição →
            </a>
            <span className="ex-hero-note">Lençóis Maranhenses · agosto 2026</span>
          </div>
        </div>
      </section>

      <section id="agenda" className="ex-section">
        <div className="v2-eyebrow">Agenda</div>
        <h2 className="ex-h2">Três destinos</h2>
        <div className="ex-cards">
          {TRIPS.map((t) => (
            <TripCard key={t.id} trip={t} />
          ))}
        </div>
      </section>

      <section className="ex-section" style={{ paddingTop: 0 }}>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 48 }}>
          <div className="v2-eyebrow">Como funciona</div>
          <h2 className="ex-h2" style={{ fontSize: "clamp(26px,3.4vw,36px)", marginBottom: 36 }}>
            Quatro passos, do email ao campo
          </h2>
          <div className="ex-steps">
            {STEPS.map(([n, t, d]) => (
              <div key={n} className="ex-step">
                <div className="ex-step-n">№ {n}</div>
                <div className="ex-step-t">{t}</div>
                <div className="ex-step-d">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ex-consulta">
        <p>Datas, itinerários e condições — tudo sob consulta, em conversa direta.</p>
        <a className="v2-accent-link" style={{ marginTop: 32, display: "inline-block" }} href={`mailto:${EMAIL}`}>
          Escrever pra Henrique →
        </a>
      </section>

      <DarkFooter coords="2°34′S 43°07′W · Atins → Santo Amaro" />
    </div>
  );
}
