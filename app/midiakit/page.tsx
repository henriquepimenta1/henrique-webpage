"use client";

/* eslint-disable @next/next/no-img-element -- Preserve the approved photography crops and native image URLs. */
import { useEffect, useRef } from "react";
import "./midiakit.css";

export default function MidiakitPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const controller = new AbortController();
    const { signal } = controller;
    const videos = root.querySelectorAll<HTMLVideoElement>("video");
    const buttons = root.querySelectorAll<HTMLButtonElement>(".play");
    buttons.forEach((button) => {
      const video = Array.from(videos).find(
        (item) => item.id === button.dataset.video,
      );
      if (!video) return;
      button.hidden = false;
      video.controls = false;
      button.addEventListener(
        "click",
        () => {
          button.hidden = true;
          video.controls = true;
          void video.play().catch(() => {
            if (!signal.aborted) {
              button.hidden = false;
              video.controls = false;
            }
          });
        },
        { signal },
      );
      video.addEventListener(
        "play",
        () => {
          button.hidden = true;
          videos.forEach((other) => {
            if (other !== video) other.pause();
          });
        },
        { signal },
      );
    });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const showAll = () =>
      root
        .querySelectorAll(".pending")
        .forEach((item) => item.classList.remove("pending"));
    if (!reduced.matches && "IntersectionObserver" in window) {
      root.classList.add("motion-ready");
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove("pending");
              observer?.unobserve(entry.target);
            }
          }),
        { threshold: 0.08 },
      );
      root.querySelectorAll(".reveal").forEach((item) => {
        item.classList.add("pending");
        observer?.observe(item);
      });
      reduced.addEventListener(
        "change",
        (event) => {
          if (event.matches) {
            showAll();
            observer?.disconnect();
          }
        },
        { signal },
      );
    }
    return () => {
      controller.abort();
      observer?.disconnect();
      videos.forEach((video) => {
        video.pause();
        video.controls = true;
      });
      buttons.forEach((button) => {
        button.hidden = true;
      });
      showAll();
      root.classList.remove("motion-ready");
    };
  }, []);
  return (
    <div ref={rootRef} className="media-kit">
      <a className="skip" href="#conteudo">
        {"Pular para o conteúdo"}
      </a>
      <div className="wrap">
        <header className="top">
          <a
            className="wordmark"
            href="https://euhenriq.com/"
            aria-label="Eu Henriq, site principal"
          >
            {"eu henriq."}
          </a>
          <nav className="nav" aria-label="Navegação">
            <a href="#filmes">{"Filmes"}</a>
            <a className="desktop" href="#parcerias">
              {"Parcerias"}
            </a>
            <a className="optional" href="#audiencia">
              {"Audiência"}
            </a>
            <a className="optional" href="/expedicoes/lencois">
              {"Expedições"}
            </a>
            <a className="contact-top" href="#contato">
              {"Vamos conversar ↗"}
            </a>
          </nav>
        </header>
      </div>
      <main id="conteudo">
        <div className="wrap">
          <section className="hero" aria-label="Apresentação">
            <div className="hero-copy">
              <div className="kicker muted">
                {"Henrique Sesana / Mídia kit 2026"}
              </div>
              <h1>
                {"Henrique"}
                <br />
                <span>{"Sesana."}</span>
              </h1>
              <p>
                {
                  "Fotógrafo e filmmaker de aventura, com a engenharia na bagagem. Fotografia, filmes e expedições pelo Brasil, Peru e Chile."
                }
              </p>
              <div className="author">
                {"São Paulo, Brasil "}
                <span className="muted">{"·"}</span>
                {" Em campo, pelo mundo"}
              </div>
            </div>
            <figure className="film">
              <div className="film-shell">
                <video
                  id="atacama"
                  controls
                  playsInline
                  preload="none"
                  poster="/media/midiakit/atacama.jpg"
                  aria-label="Filme Atacama, 42 segundos"
                >
                  <source src="/media/midiakit/atacama.mp4" type="video/mp4" />
                  {"Seu navegador não reproduz este vídeo. "}
                  <a href="/media/midiakit/atacama.mp4">
                    {"Abrir filme Atacama"}
                  </a>
                  {"."}
                </video>
                <button
                  hidden
                  className="play"
                  data-video="atacama"
                  aria-label="Assistir Atacama com áudio"
                >
                  <span className="label">
                    {"Um primeiro olhar sobre o Atacama"}
                    <br />
                    <span className="kicker">
                      {"Assistir ao filme · 00:42"}
                    </span>
                  </span>
                  <span className="circle" aria-hidden="true">
                    {"▶"}
                  </span>
                </button>
              </div>
              <figcaption>
                <span className="film-title">{"Atacama, Chile"}</span>
                <span className="film-meta">{"01 / Filme de viagem"}</span>
              </figcaption>
            </figure>
          </section>
          <div className="hero-bottom">
            <span>{"Fotografia · Cinema · Expedições"}</span>
            <a href="#filmes">{"Conheça meu trabalho ↓"}</a>
            <span>{"@henriq.eu"}</span>
          </div>
          <section className="intro intro-portrait reveal">
            <div className="intro-heading">
              <div className="kicker muted">
                {"01 / De onde vem meu trabalho"}
              </div>
              <h2>
                {"A montanha"}
                <br />
                {"foi o começo."}
              </h2>
            </div>
            <figure className="portrait">
              <img
                src="/media/midiakit/henrique-montanha.jpg"
                width="1536"
                height="2048"
                loading="lazy"
                alt="Henrique de gorro vermelho e mochila, em uma paisagem de montanha"
              />
            </figure>
            <div className="intro-body">
              <p>
                {
                  "Sou engenheiro, fotógrafo e filmmaker. A câmera entrou na minha vida junto com a montanha e, desde 2018, me acompanha em escaladas, travessias e expedições pelo Brasil, Peru e Chile."
                }
              </p>
              <p>
                {
                  "Já caminhei por boa parte das montanhas brasileiras, estive na cordilheira Huayhuash, no Peru, e explorei o Atacama, no Chile. Os Lençóis Maranhenses também fazem parte dessa história — lá, além de fotografar e filmar, organizo expedições."
                }
              </p>
              <p>
                {
                  "Meu trabalho nasce dessas experiências: os dias de caminhada, as pessoas que encontro, o céu à noite e os imprevistos. Produzo fotografia, filmes e timelapses, do registro em campo à edição e à cor. É essa experiência que levo para os projetos com marcas."
                }
              </p>
              <a className="textlink" href="https://euhenriq.com/sobre">
                {"Mais sobre mim ↗"}
              </a>
              <p className="bio-facts">
                {
                  "Desde 2018 · Base em São Paulo · Conteúdo em português e inglês"
                }
                <br />
                {"Sony A7 IV · DJI Air 3S · Comica VM40 · DaVinci Resolve"}
              </p>
            </div>
          </section>
          <section id="filmes">
            <div className="section-head reveal">
              <h2>{"Do lado de fora."}</h2>
              <span className="kicker muted">
                {"02 / Um pouco de aventura"}
              </span>
            </div>
            <div className="feature">
              <figure className="film wide reveal">
                <div className="film-shell">
                  <video
                    id="peixe"
                    controls
                    playsInline
                    preload="none"
                    poster="/media/midiakit/peixe.jpg"
                    aria-label="Filme Cabeça de Peixe, 20 segundos"
                  >
                    <source src="/media/midiakit/peixe.mp4" type="video/mp4" />
                    {"Seu navegador não reproduz este vídeo. "}
                    <a href="/media/midiakit/peixe.mp4">
                      {"Abrir filme Cabeça de Peixe"}
                    </a>
                    {"."}
                  </video>
                  <button
                    hidden
                    className="play"
                    data-video="peixe"
                    aria-label="Assistir Cabeça de Peixe com áudio"
                  >
                    <span className="label kicker">
                      {"Assistir ao filme · 00:20"}
                    </span>
                    <span className="circle" aria-hidden="true">
                      {"▶"}
                    </span>
                  </button>
                </div>
                <figcaption>
                  <span className="film-title">{"Cabeça de Peixe"}</span>
                  <span className="film-meta">{"02 / Aventura"}</span>
                </figcaption>
              </figure>
              <div className="feature-copy reveal">
                <span className="kicker muted">
                  {"Serra dos Órgãos, Brasil"}
                </span>
                <h3>
                  {"A câmera também"}
                  <br />
                  {"vai pra montanha."}
                </h3>
                <p>
                  {
                    "Um trecho da aventura no Cabeça de Peixe. Escalada, conversa e registro do caminho, com a câmera acompanhando o que acontece em campo."
                  }
                </p>
                <a
                  className="textlink"
                  href="https://youtu.be/5bf8usjeb24?si=Q_mUo7LiAM2K2M3i"
                >
                  {"Veja o vídeo completo no YouTube ↗"}
                </a>
              </div>
            </div>
            <div className="feature youtube-feature">
              <div className="youtube-panel reveal">
                <img
                  className="youtube-backdrop"
                  src="/media/midiakit/youtube-vale.jpg"
                  width="3840"
                  height="2160"
                  loading="lazy"
                  alt=""
                />
                <span className="kicker">{"03 / Filme completo · 09:06"}</span>
                <h3>
                  {"O cânion escondido"}
                  <br />
                  {"de Rondônia."}
                </h3>
                <p>{"Vale do Apertado"}</p>
                <a
                  className="watch"
                  href="https://www.youtube.com/watch?v=VTUgiG2NcgY"
                >
                  {"▶ Assistir no YouTube ↗"}
                </a>
              </div>
              <div className="feature-copy reveal">
                <span className="kicker muted">{"YouTube / @henriq_eu"}</span>
                <h3>
                  {"Uma história"}
                  <br />
                  {"com mais tempo."}
                </h3>
                <p>
                  {
                    "Morei 27 anos em Rondônia e descobri esse lugar em um vídeo na internet. Ficava a algumas horas de casa."
                  }
                </p>
                <a
                  className="textlink"
                  href="https://www.youtube.com/@henriq_eu"
                >
                  {"Conheça meu canal ↗"}
                </a>
              </div>
            </div>
            <div className="selected-work reveal">
              <a href="https://www.instagram.com/reel/DdZ7dXShnSO/">
                <span className="kicker muted">
                  {"04 / Reel · Lençóis Maranhenses"}
                </span>
                <h3>{"Rota dos Povoados ↗"}</h3>
                <p>{"As famílias e as histórias que dão nome ao caminho."}</p>
              </a>
              <a href="https://www.instagram.com/p/DdKRdTZHHr3/">
                <span className="kicker muted">
                  {"05 / Carrossel · Lençóis Maranhenses"}
                </span>
                <h3>{"Três dias entre povoados ↗"}</h3>
                <p>
                  {"Do início na Lagoa Bonita ao encontro com Dona Paixão."}
                </p>
              </a>
              <a href="https://www.instagram.com/p/DczVCttHJF2/">
                <span className="kicker muted">
                  {"06 / Carrossel · Mantiqueira"}
                </span>
                <h3>{"Amanhecer no Marinzinho ↗"}</h3>
                <p>
                  {"À espera do sol, durante a travessia Marins × Itaguaré."}
                </p>
              </a>
            </div>
            <div className="photo-portfolio reveal">
              <span className="kicker muted">{"Fotografia / Portfólio"}</span>
              <a className="textlink" href="https://euhenriq.com/portfolio">
                {"Conheça minhas fotografias ↗"}
              </a>
            </div>
          </section>
        </div>
        <section className="metrics" id="audiencia">
          <div className="wrap reveal">
            <div className="section-head">
              <h2>{"Quem acompanha o caminho."}</h2>
              <span className="kicker muted">
                {"03 / Instagram @henriq.eu"}
              </span>
            </div>
            <div className="numbers">
              <div className="number">
                <strong>{"17.867"}</strong>
                <span>
                  {"seguidores "}
                  <sup>{"1"}</sup>
                </span>
              </div>
              <div className="number">
                <strong>{"1,66 mi"}</strong>
                <span>
                  {"visualizações em 30 dias "}
                  <sup>{"1"}</sup>
                </span>
              </div>
              <div className="number">
                <strong>{"6,8%"}</strong>
                <span>
                  {"engajamento médio por Reel "}
                  <sup>{"1"}</sup>
                </span>
              </div>
              <div className="number">
                <strong>{"10,8 mil"}</strong>
                <span>
                  {"visualizações médias por Reel "}
                  <sup>{"1"}</sup>
                </span>
              </div>
            </div>
            <div className="audience-highlights">
              <p>
                <strong>{"150,2 mil"}</strong>
                {" interações em 30 dias "}
                <sup>{"1"}</sup>
              </p>
              <p>
                <strong>{"12,9 mil"}</strong>
                {" salvamentos e 11,7 mil compartilhamentos em 30 dias "}
                <sup>{"1"}</sup>
              </p>
              <p>
                <strong>{"87,5%"}</strong>
                {" das visualizações vêm de quem ainda não segue o perfil "}
                <sup>{"1"}</sup>
              </p>
              <p>
                <strong>{"+2.239"}</strong>
                {" novos seguidores em 30 dias "}
                <sup>{"1"}</sup>
              </p>
            </div>
            <div className="audience-grid">
              <div>
                <h3>{"Uma audiência adulta"}</h3>
                <p className="audience-key">{"74%"}</p>
                <p>
                  {
                    "dos seguidores com idade informada têm entre 25 e 44 anos. "
                  }
                  <sup>{"1"}</sup>
                </p>
                <p>
                  {"25–34: 50% · 35–44: 24%"}
                  <br />
                  {"18–24: 14% · demais faixas: 12%"}
                </p>
              </div>
              <div>
                <h3>{"Presença no Brasil"}</h3>
                <p className="audience-key">{"91,4%"}</p>
                <p>
                  {"dos seguidores estão no Brasil. "}
                  <sup>{"1"}</sup>
                </p>
                <p>
                  {
                    "Principais cidades: São Paulo (11%), Rio de Janeiro e Curitiba."
                  }
                </p>
                <p>
                  {"Fora do Brasil: Portugal (1,7%) e Estados Unidos (0,9%)."}
                </p>
              </div>
              <div>
                <h3>{"Perfil dos seguidores"}</h3>
                <p>
                  {"Masculino: 55%"}
                  <br />
                  {"Feminino: 33%"}
                  <br />
                  {"Não informado: 12% "}
                  <sup>{"1"}</sup>
                </p>
                <p>
                  {
                    "Fotografia, aventura, travessias e céu noturno são os temas que compartilho com esse público."
                  }
                </p>
              </div>
            </div>
            <section className="tiktok-profile" aria-labelledby="tiktok-title">
              <div>
                <span className="kicker muted">
                  {"Também no TikTok / @henriq.eu"}
                </span>
                <h3 id="tiktok-title">{"Mais um jeito de acompanhar."}</h3>
                <a
                  className="textlink"
                  href="https://www.tiktok.com/@henriq.eu"
                >
                  {"Conheça meu TikTok ↗"}
                </a>
              </div>
              <div className="tiktok-stats">
                <div>
                  <strong>{"6.304"}</strong>
                  <span>{"seguidores"}</span>
                </div>
                <div>
                  <strong>{"196,6 mil"}</strong>
                  <span>{"curtidas acumuladas no perfil"}</span>
                </div>
              </div>
              <div className="tiktok-links">
                <a href="https://www.tiktok.com/@henriq.eu/video/7689557935420099848">
                  {"Marins × Itaguaré ↗"}
                </a>
                <a href="https://www.tiktok.com/@henriq.eu/video/7681762766151044359">
                  {"Lençóis Maranhenses ↗"}
                </a>
              </div>
              <p className="tiktok-source">
                {
                  "Fonte: perfil público do TikTok, consultado em 02/10/2026. Curtidas exibidas de forma arredondada pela plataforma."
                }
              </p>
            </section>
            <div className="metric-notes">
              <p>
                <sup>{"1"}</sup>
                {
                  " Instagram via Windsor · últimos 30 dias, consultados em 15/10/2026 (36 publicações). Demografia: base de 16.579 perfis."
                }
              </p>
              <details className="metric-method">
                <summary>{"Sobre os indicadores"}</summary>
                <p>
                  {
                    "O engajamento por Reel soma curtidas, comentários, salvamentos e compartilhamentos: em média, 1.216 interações por Reel, divididas pelos 17.867 seguidores. No período, 114,5 mil contas interagiram com o perfil."
                  }
                </p>
                <p>
                  {
                    "Nos 32 Reels do período, a média é de 10,8 mil visualizações e a mediana, de 3,6 mil: a média é puxada pelos Reels que viralizaram. Os quatro carrosséis tiveram em média 14,4 mil visualizações, 5,6 mil de alcance e cerca de mil interações (5,6%). Visualizações podem incluir repetições."
                  }
                </p>
                <p>
                  {
                    "Os novos seguidores são o valor bruto, sem descontar quem deixou de seguir. A demografia considera só as contas que a Meta consegue identificar: as porcentagens valem para o público todo, mas a base fica abaixo do total de seguidores."
                  }
                </p>
              </details>
            </div>
          </div>
        </section>
        <div className="wrap">
          <section id="parcerias">
            <div className="section-head reveal">
              <h2>{"Marcas no caminho."}</h2>
              <span className="kicker muted">
                {"04 / Trabalhos & parcerias"}
              </span>
            </div>
            <div className="brands" id="brands">
              <figure className="brand reveal">
                <div className="brand-image">
                  <img
                    src="/images/work/OBOTICARIO/OBOTICARIO-001.jpg"
                    alt="O Boticário"
                    loading="lazy"
                  />
                </div>
                <figcaption>
                  <h3>{"O Boticário"}</h3>
                  <p>{"Arbo Puro · Desodorante Colônia"}</p>
                </figcaption>
              </figure>
              <figure className="brand reveal">
                <div className="brand-image">
                  <img
                    src="/images/work/AIUR/MOLETON_MELTON/MOLETON-MELTON-001.jpg"
                    alt="Aiuruocan"
                    loading="lazy"
                  />
                </div>
                <figcaption>
                  <h3>{"Aiuruocan"}</h3>
                  <p>{"White Melton + Colors Blue"}</p>
                </figcaption>
              </figure>
              <figure className="brand reveal">
                <div className="brand-image">
                  <img
                    src="/images/work/OMA-GEAR/OMA-GEAR-001.jpg"
                    alt="OMA Gear"
                    loading="lazy"
                  />
                </div>
                <figcaption>
                  <h3>{"OMA Gear"}</h3>
                  <p>{"Kit Cozinha Ultra Leve"}</p>
                </figcaption>
              </figure>
              <figure className="brand reveal">
                <div className="brand-image">
                  <img
                    src="/images/work/KNF-CONCEPT/KNF-CONCEPT-001.jpg"
                    alt="K&F Concept"
                    loading="lazy"
                  />
                </div>
                <figcaption>
                  <h3>{"K&F Concept"}</h3>
                  <p>{"Tripé Omni Series + FH03"}</p>
                </figcaption>
              </figure>
              <figure className="brand reveal">
                <div className="brand-image">
                  <img
                    src="/images/work/BRIGHTIN-STAR/BRIGHTIN-STAR-001.jpg"
                    alt="Brightin Star"
                    loading="lazy"
                  />
                </div>
                <figcaption>
                  <h3>{"Brightin Star"}</h3>
                  <p>{"Lente 16mm f/2.8"}</p>
                </figcaption>
              </figure>
              <figure className="brand reveal">
                <div className="brand-image">
                  <img
                    src="/images/work/BOTAS-VENTO/BOTA-TITAN/BOTA-TITAN-001.jpg"
                    alt="Botas Vento"
                    loading="lazy"
                  />
                </div>
                <figcaption>
                  <h3>{"Botas Vento"}</h3>
                  <p>{"Titan + Finisterre"}</p>
                </figcaption>
              </figure>
              <figure className="brand reveal">
                <div className="brand-image">
                  <img
                    src="/images/work/ALTO-ESTILO/ALTO-ESTILO-001.jpg"
                    alt="Alto Estilo"
                    loading="lazy"
                  />
                </div>
                <figcaption>
                  <h3>{"Alto Estilo"}</h3>
                  <p>{"Mochila Ataque 40+5L"}</p>
                </figcaption>
              </figure>
              <figure className="brand reveal">
                <div className="brand-image">
                  <img
                    src="/images/work/GORRO-VANS/GORRO-VANS-001.jpg"
                    alt="Gorro Vans"
                    loading="lazy"
                  />
                </div>
                <figcaption>
                  <h3>{"Gorro Vans"}</h3>
                  <p>{"Beanie · Pico Mateo"}</p>
                </figcaption>
              </figure>
            </div>
          </section>
          <details className="archive">
            <summary>
              <span>
                {"Publicações em destaque "}
                <span className="muted">{"/ seleção atual"}</span>
              </span>
            </summary>
            <p className="muted" style={{ fontSize: "12px" }}>
              {
                "Seleção preservada do mídia kit atual. Os resultados abaixo são registros anteriores, sem período informado."
              }
            </p>
            <div className="archive-grid" id="publicacoes">
              <article>
                <img
                  src="/images/portfolio/escalada-cabeca-depeixe.jpg"
                  alt="Escalando Cabeça de Peixe"
                  loading="lazy"
                />
                <h3>{"Escalando Cabeça de Peixe"}</h3>
                <p>{"11.352 de alcance · 1.540 likes · 112 saves"}</p>
              </article>
              <article>
                <img
                  src="/images/portfolio/grupo-caminhando-lencois.jpg"
                  alt="Travessia dos Lençóis, Ep. 1"
                  loading="lazy"
                />
                <h3>{"Travessia dos Lençóis, Ep. 1"}</h3>
                <p>{"6.857 de alcance · 481 likes · 25 saves"}</p>
              </article>
              <article>
                <img
                  src="/images/portfolio/queimada-dos-britos-lencois.jpg"
                  alt="Cabeça de Peixe: plano B"
                  loading="lazy"
                />
                <h3>{"Cabeça de Peixe: plano B"}</h3>
                <p>{"5.911 de alcance · 447 likes · 20 saves"}</p>
              </article>
              <article>
                <img
                  src="/images/portfolio/laguna-acampamento-janca-huayhuash.jpg"
                  alt="Memories of Peru"
                  loading="lazy"
                />
                <h3>{"Memories of Peru"}</h3>
                <p>{"4.684 de alcance · 412 likes · 28 saves"}</p>
              </article>
            </div>
          </details>
          <section className="services">
            <div className="reveal">
              <span className="kicker muted">{"05 / Vamos criar juntos"}</span>
              <h2>
                {"Da ideia"}
                <br />
                {"ao campo."}
              </h2>
            </div>
            <div className="reveal">
              <div className="service">
                <span className="kicker">{"01"}</span>
                <div>
                  <h3>{"Filmes & Reels"}</h3>
                  <p>
                    {
                      "Reels, filmes para YouTube e produção para os canais da marca, com captação em campo, áudio e drone."
                    }
                  </p>
                </div>
              </div>
              <div className="service">
                <span className="kicker">{"02"}</span>
                <div>
                  <h3>{"Fotografia & editoriais"}</h3>
                  <p>
                    {
                      "Ensaios em campo, séries de destino e carrosséis fotográficos."
                    }
                  </p>
                </div>
              </div>
              <div className="service">
                <span className="kicker">{"03"}</span>
                <div>
                  <h3>{"Expedição & produção"}</h3>
                  <p>
                    {
                      "Logística de campo e produção audiovisual integradas. Expedições nos Lençóis Maranhenses e projetos sob medida."
                    }
                  </p>
                  <a className="textlink" href="/expedicoes/lencois">
                    {"Conheça a expedição dos Lençóis ↗"}
                  </a>
                </div>
              </div>
              <div className="service">
                <span className="kicker">{"04"}</span>
                <div>
                  <h3>{"Licenciamento & conteúdo"}</h3>
                  <p>
                    {
                      "Banco de imagens, licenciamento de fotografia e vídeo para campanhas e canais da marca. Conteúdo em português e inglês."
                    }
                  </p>
                </div>
              </div>
              <p className="muted" style={{ fontSize: "12px" }}>
                {"Escopo, direitos de uso e valores definidos por proposta."}
              </p>
            </div>
          </section>
          <footer className="end reveal" id="contato">
            <span className="kicker muted">{"Tem uma história em mente?"}</span>
            <h2>
              {"Vamos transformar cenas"}
              <br />
              <span>{"em experiências."}</span>
            </h2>
            <a className="email" href="mailto:contato@euhenriq.com">
              {"contato@euhenriq.com ↗"}
            </a>
            <div className="footerline">
              <span>{"© 2026 Henrique Sesana Pimenta"}</span>
              <span>{"Fotografia · Filmes · Expedições"}</span>
              <a href="https://instagram.com/henriq.eu">{"@henriq.eu ↗"}</a>
              <a href="https://www.youtube.com/@henriq_eu">{"YouTube ↗"}</a>
              <a href="https://www.tiktok.com/@henriq.eu">{"TikTok ↗"}</a>
              <a href="https://euhenriq.com/">{"euhenriq.com ↗"}</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
