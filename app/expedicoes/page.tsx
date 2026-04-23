"use client";

import Link from "next/link";
import SiteNav from "@/components/nav";
import SiteFooter from "@/components/site-footer";

const WHATSAPP = "https://wa.me/5511988128064";

const trips = [
  {
    id: "01",
    slug: "lencois",
    href: "/expedicoes/lencois",
    name: "Lençóis Maranhenses",
    country: "Brasil · MA",
    when: "Ago 2026",
    days: 4,
    alt: "40 m",
    km: 52,
    level: "Intermediário",
    status: "Vagas abertas",
    available: true,
    preco: "a partir de R$ 3.599",
    hero: "/images/lencois/DJI_20250828174205_0403_D-HDR.jpg",
    kicker: "Deserto com lagoas. Sem neblina, com Via Láctea.",
    desc: "Quatro dias na melhor janela do ano — lagoas cheias, poucos turistas e astrofotografia garantida. Três pacotes de imersão. Base em Barreirinhas, travessia a pé até Santo Amaro.",
  },
  {
    id: "02",
    slug: "huayhuash",
    href: "/expedicoes/lencois",
    name: "Cordillera Huayhuash",
    country: "Peru",
    when: "2027",
    days: 11,
    alt: "5 050 m",
    km: 130,
    level: "Avançado",
    status: "Em breve",
    available: false,
    preco: "Em breve",
    hero: "/images/exp-huayhuash.jpg",
    kicker: "A trilha mais dura, a luz mais limpa.",
    desc: "Onze dias no circuito clássico da Huayhuash, passando por lagoas de 4.600 m e o vale de Janca. Saímos de Huaraz com mulas carregando o acampamento — você carrega só sua câmera.",
  },
];

export default function ExpedicoesPage() {
  return (
    <div style={{ background: "var(--canvas)", color: "var(--bark)", fontFamily: "var(--font-ui)" }}>
      <SiteNav dark={true} />

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: 820, overflow: "hidden",
        background: "var(--forest)" }}>
        <img src="/images/lencois/DJI_20250828174205_0403_D-HDR.jpg" alt="expedição"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(30,42,24,.35) 0%, rgba(30,42,24,.05) 40%, rgba(30,42,24,.85) 100%)" }} />

        <div style={{ position: "absolute", inset: 0, padding: "140px 56px 48px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          color: "var(--canvas)", zIndex: 2 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10,
              fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".22em",
              textTransform: "uppercase", color: "rgba(232,223,201,.6)" }}>
              <span>№ 02</span>
              <span style={{ width: 4, height: 4, borderRadius: "50%",
                background: "var(--rust-soft)", display: "block" }} />
              <span>Viagens guiadas de fotografia</span>
              <span style={{ width: 4, height: 4, borderRadius: "50%",
                background: "var(--rust-soft)", display: "block" }} />
              <span style={{ color: "var(--rust-soft)" }}>Agenda 2026</span>
            </div>
            <div style={{ marginTop: 32 }}>
              <div style={{ fontFamily: "var(--font-hand)", fontSize: 42,
                color: "var(--rust-soft)", transform: "rotate(-2deg)",
                display: "inline-block", marginBottom: 4 }}>
                andar devagar, ver mais—
              </div>
              <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700,
                fontSize: "clamp(72px, 9vw, 140px)", letterSpacing: "-.04em",
                lineHeight: 0.9, margin: 0 }}>
                Expedições
                <br />
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
                  fontWeight: 400, color: "var(--rust-soft)" }}>que ensinam</span>
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", gap: 40 }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 21,
              fontStyle: "italic", lineHeight: 1.5, maxWidth: "46ch",
              color: "var(--canvas)", margin: 0 }}>
              Grupos pequenos, nunca mais de 10 pessoas. Itinerários que priorizam a luz, não o ticket de atração.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 32 }}>
              {[
                { k: "Desde",      v: "2019" },
                { k: "Expedições", v: "18 destinos" },
                { k: "Fotógrafos", v: "214+" },
              ].map(m => (
                <div key={m.k}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9,
                    letterSpacing: ".22em", textTransform: "uppercase",
                    color: "rgba(232,223,201,.45)", marginBottom: 6 }}>{m.k}</div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 20,
                    fontWeight: 600 }}>{m.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section style={{ padding: "72px 56px", borderBottom: "1px solid var(--line)",
        display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: ".22em", textTransform: "uppercase",
            color: "var(--rust)", marginBottom: 14 }}>№ 01 · Como é</div>
          <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 32, fontWeight: 600,
            letterSpacing: "-.02em", lineHeight: 1.1, margin: 0 }}>
            Aulas de campo,{" "}
            <br />não{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontWeight: 400, color: "var(--moss)" }}>aulas de slide.</span>
          </h2>
        </div>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 20, lineHeight: 1.55,
          color: "#3A3530", margin: 0 }}>
          Não é workshop. Não é tour. É expedição de fotografia — itinerário pensado pela luz, tempo pra esperar a foto acontecer, e alguém ao seu lado pra te ajudar a ler o que está na frente. Em três anos na Huayhuash, aprendi que a coisa mais valiosa que posso oferecer é{" "}
          <em>o tempo certo no lugar certo</em>.
        </p>
      </section>

      {/* ── TRIPS ── */}
      <section style={{ padding: "96px 56px" }}>
        <div style={{ marginBottom: 56, display: "flex", justifyContent: "space-between",
          alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: ".22em", textTransform: "uppercase",
              color: "var(--rust)", marginBottom: 12 }}>№ 02 · Agenda 2026</div>
            <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 56, fontWeight: 600,
              letterSpacing: "-.02em", lineHeight: 1, margin: 0 }}>
              Dois{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
                fontWeight: 400, color: "var(--moss)" }}>destinos</span>.
            </h2>
          </div>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
            fontSize: 17, color: "#3A3530", maxWidth: "36ch",
            lineHeight: 1.5, margin: 0 }}>
            Pouco, bem feito. Cada viagem é desenhada por mim, sem operação de terceiros no meio.
          </p>
        </div>

        {trips.map((t, idx) => (
          <TripCard key={t.id} trip={t} flip={idx % 2 === 1} />
        ))}
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section style={{ padding: "96px 56px", background: "var(--forest)",
        color: "var(--canvas)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10,
          letterSpacing: ".22em", textTransform: "uppercase",
          color: "var(--rust-soft)", marginBottom: 14 }}>
          № 03 · Como funciona
        </div>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 48, fontWeight: 600,
          letterSpacing: "-.02em", lineHeight: 1, margin: 0, marginBottom: 12 }}>
          Quatro passos,{" "}
          <br />do email ao{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
            fontWeight: 400, color: "var(--rust-soft)" }}>cume</span>.
        </h2>
        <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
          fontSize: 18, color: "rgba(232,223,201,.7)", maxWidth: "54ch",
          marginBottom: 56, lineHeight: 1.5 }}>
          Sem mistério. O processo é simples, direto, e você nunca fica sem resposta.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {[
            { n: "01", t: "Conversa",  d: "Você escreve, eu respondo em 48h com um papo por vídeo pra entender sua experiência e expectativa." },
            { n: "02", t: "Reserva",   d: "Sinal de 30% garante a vaga. O restante em até 60 dias antes da saída, sem juros." },
            { n: "03", t: "Preparo",   d: "Um mês antes mando o kit completo: lista de equipamento, preparo físico, briefing fotográfico." },
            { n: "04", t: "Campo",     d: "Encontro na cidade-base, expedição, e álbum digital pós-viagem com as melhores fotos do grupo." },
          ].map(st => (
            <div key={st.n} style={{ borderTop: "1px solid rgba(232,223,201,.14)", paddingTop: 20 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: ".22em", color: "var(--rust-soft)", marginBottom: 10 }}>
                № {st.n}
              </div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 22,
                fontWeight: 600, letterSpacing: "-.01em", marginBottom: 8 }}>
                {st.t}
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 14,
                lineHeight: 1.55, color: "rgba(232,223,201,.7)" }}>
                {st.d}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INCLUSO / NÃO INCLUSO ── */}
      <section style={{ padding: "96px 56px", display: "grid",
        gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div style={{ background: "var(--canvas-deep)", padding: 40,
          border: "1px solid var(--line)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: ".22em", textTransform: "uppercase",
            color: "var(--stone)", marginBottom: 14 }}>
            № 04.a · Na mochila
          </div>
          <h3 style={{ fontFamily: "var(--font-ui)", fontSize: 28, fontWeight: 600,
            letterSpacing: "-.01em", margin: "0 0 20px" }}>
            O que está{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontWeight: 400 }}>incluso</span>.
          </h3>
          {["Acomodação em lodge ou camping premium", "Todas as refeições durante a expedição",
            "Guia local + transfers dentro do destino", "Mentoria fotográfica 1:1 em campo",
            "Edição conjunta pós-viagem", "Álbum digital com melhores fotos do grupo",
            "Seguro viagem com cobertura outdoor"].map(item => (
            <div key={item} style={{ display: "flex", gap: 12, padding: "10px 0",
              borderBottom: "1px solid var(--line)", fontFamily: "var(--font-serif)",
              fontSize: 15, color: "#3A3530" }}>
              <span style={{ color: "var(--moss)", fontWeight: 600 }}>✓</span>
              {item}
            </div>
          ))}
        </div>
        <div style={{ padding: 40, border: "1px dashed var(--stone)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: ".22em", textTransform: "uppercase",
            color: "var(--stone)", marginBottom: 14 }}>
            № 04.b · Por sua conta
          </div>
          <h3 style={{ fontFamily: "var(--font-ui)", fontSize: 28, fontWeight: 600,
            letterSpacing: "-.01em", margin: "0 0 20px" }}>
            O que{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontWeight: 400 }}>não</span> está.
          </h3>
          {["Passagem aérea até a cidade-base", "Equipamento fotográfico",
            "Vistos e documentação internacional", "Bebidas e extras pessoais",
            "Gorjetas para guias locais (sugeridas)"].map(item => (
            <div key={item} style={{ display: "flex", gap: 12, padding: "10px 0",
              borderBottom: "1px solid var(--line)", fontFamily: "var(--font-serif)",
              fontSize: 15, color: "var(--stone)" }}>
              <span>—</span>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: "120px 56px", background: "var(--forest)",
        color: "var(--canvas)", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-hand)", fontSize: 38,
          color: "var(--rust-soft)", transform: "rotate(-2deg)",
          display: "inline-block", marginBottom: 8 }}>
          bora?
        </div>
        <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 80, fontWeight: 700,
          letterSpacing: "-.04em", lineHeight: 0.92, margin: 0 }}>
          Sua próxima
          <br />
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
            fontWeight: 400, color: "var(--rust-soft)" }}>expedição</span>
        </h2>
        <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
          fontSize: 20, color: "rgba(232,223,201,.7)", marginTop: 24,
          maxWidth: "50ch", marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
          Grupo pequeno, vaga garantida. Reserve antes da próxima janela de luz fechar.
        </p>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
          style={{ marginTop: 40, display: "inline-block", padding: "18px 40px",
            background: "var(--rust-soft)", color: "var(--forest)",
            fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700,
            letterSpacing: ".24em", textTransform: "uppercase",
            textDecoration: "none" }}>
          Escrever pra Henrique →
        </a>
      </section>

      <SiteFooter dark={true} />
    </div>
  );
}

// ── Trip Card ────────────────────────────────────────────────────────────────
function TripCard({ trip, flip }: { trip: typeof trips[0]; flip: boolean }) {
  const imgCol = (
    <div style={{ position: "relative", overflow: "hidden", minHeight: 560 }}>
      <img src={trip.hero} alt={trip.name}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover" }} />
      <div style={{ position: "absolute", top: 24, left: 24,
        background: "var(--canvas)", color: "var(--bark)",
        padding: "6px 14px", fontFamily: "var(--font-mono)",
        fontSize: 10, letterSpacing: ".22em" }}>
        Expedição № {trip.id}
      </div>
      <div style={{ position: "absolute", bottom: 24, right: 24,
        color: "var(--canvas)", fontFamily: "var(--font-mono)",
        fontSize: 72, fontWeight: 500, letterSpacing: "-.04em",
        lineHeight: 1, mixBlendMode: "difference" }}>
        {trip.id}
      </div>
    </div>
  );

  const bodyCol = (
    <div style={{ padding: "44px 48px 40px", display: "flex",
      flexDirection: "column", justifyContent: "space-between",
      background: "var(--canvas)", borderTop: "1px solid var(--line)" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 24 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: ".22em", textTransform: "uppercase",
            color: "var(--stone)" }}>
            {trip.country} · {trip.when}
          </span>
          <span style={{ padding: "4px 10px",
            background: trip.available ? "var(--rust)" : "transparent",
            color: trip.available ? "var(--canvas)" : "var(--stone)",
            border: trip.available ? "none" : "1px solid var(--stone)",
            fontFamily: "var(--font-mono)", fontSize: 9,
            letterSpacing: ".22em", textTransform: "uppercase" }}>
            {trip.status}
          </span>
        </div>

        <h3 style={{ fontFamily: "var(--font-ui)", fontSize: 48, fontWeight: 700,
          letterSpacing: "-.03em", lineHeight: 0.95, color: "var(--bark)",
          margin: 0 }}>
          {trip.name}
        </h3>
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic",
          fontSize: 20, color: "var(--moss)", marginTop: 10, marginBottom: 20 }}>
          {trip.kicker}
        </div>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 16,
          lineHeight: 1.6, color: "#3A3530", margin: 0 }}>
          {trip.desc}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20, marginTop: 28, paddingTop: 24,
          borderTop: "1px solid var(--line)" }}>
          {[
            { k: "Dias",      v: String(trip.days) },
            { k: "Altitude",  v: trip.alt },
            { k: "Caminhada", v: `${trip.km} km` },
            { k: "Nível",     v: trip.level },
          ].map(s => (
            <div key={s.k}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9,
                letterSpacing: ".22em", textTransform: "uppercase",
                color: "var(--stone)", marginBottom: 4 }}>{s.k}</div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 17,
                fontWeight: 600, color: "var(--bark)" }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 28, paddingTop: 20,
        borderTop: "1px solid var(--line)",
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9,
            letterSpacing: ".22em", textTransform: "uppercase",
            color: "var(--stone)", marginBottom: 4 }}>
            Investimento
          </div>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 28,
            fontWeight: 700, letterSpacing: "-.02em", color: "var(--bark)" }}>
            {trip.preco}
          </div>
        </div>
        {trip.available ? (
          <Link href={trip.href}
            style={{ padding: "12px 20px", background: "var(--bark)",
              color: "var(--canvas)", fontFamily: "var(--font-ui)",
              fontSize: 11, fontWeight: 700, letterSpacing: ".22em",
              textTransform: "uppercase", textDecoration: "none" }}>
            Ver detalhes →
          </Link>
        ) : (
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
            style={{ padding: "12px 20px", border: "1px solid var(--stone)",
              color: "var(--stone)", fontFamily: "var(--font-ui)",
              fontSize: 11, fontWeight: 600, letterSpacing: ".22em",
              textTransform: "uppercase", textDecoration: "none" }}>
            Avisar quando abrir
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: "grid",
      gridTemplateColumns: flip ? "1fr 1.1fr" : "1.1fr 1fr",
      marginBottom: 64, borderTop: "1px solid var(--line)" }}>
      {flip ? <>{bodyCol}{imgCol}</> : <>{imgCol}{bodyCol}</>}
    </div>
  );
}
