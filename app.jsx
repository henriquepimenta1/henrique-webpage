const { useState, useEffect, useRef } = React;

// ── Site data (from content/home.ts) ──────────────────────────────
const SITE_AUTHOR = "Henrique Sesana Pimenta";
const SITE_EMAIL = "contato@euhenriq.com";

const HOME_CARDS = [
  { href:"/portfolio", label:"Portfolio",  bg:"public/images/portfolio/vista-do-picomateo.jpg", bgPosition:"center", kicker:"Fotografias autorais" },
  { href:"/presets",   label:"Presets",    bg:"public/images/portfolio/observador-itatiaia-chapada-da-lua.jpg",  bgPosition:"center", kicker:"Tratamento de cor" },
  { href:"/expedicoes",label:"Expedições", bg:"public/images/expedicao-lencois.jpg",         bgPosition:"center 32%", kicker:"Viagens guiadas" },
];
const HAND_WORDS = ["explorar","aplicar","caminhar"];

const NAV_LINKS = [
  { label:"Portfolio", href:"/portfolio" },
  { label:"Presets & LUTs", href:"/presets" },
  { label:"Expedições", href:"/expedicoes" },
  { label:"Quadros", href:"/quadros" },
  { label:"Midiakit", href:"/midiakit" },
  { label:"Sobre", href:"/sobre" },
  { label:"Contato", href:"/contato" },
];

// ── Tiny router ───────────────────────────────────────────────────
const RouterCtx = React.createContext({ path:"/", nav:()=>{} });
function useRouter(){ return React.useContext(RouterCtx); }
function Link({ href, children, style, className, onMouseEnter, onMouseLeave }){
  const { nav } = useRouter();
  return <a href={href} className={className} style={{textDecoration:"none",color:"inherit",...style}}
    onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
    onClick={e=>{ e.preventDefault(); nav(href); }}>{children}</a>;
}

// ── Site Nav ──────────────────────────────────────────────────────
function SiteNav({ dark=true }){
  const { path } = useRouter();
  const fg = dark ? "var(--canvas)" : "var(--bark)";
  const bg = dark ? "var(--forest)" : "var(--canvas)";
  const border = dark ? "rgba(232,223,201,.14)" : "rgba(42,33,26,.14)";
  return (
    <header style={{position:"absolute",top:0,left:0,right:0,height:72,display:"flex",
      alignItems:"center",justifyContent:"space-between",padding:"0 40px",zIndex:30,
      background:bg,borderBottom:`1px solid ${border}`}}>
      <Link href="/" style={{display:"flex",alignItems:"center",textDecoration:"none"}}>
        <span style={{fontFamily:"var(--font-hand)",fontSize:28,color:fg,letterSpacing:".02em",lineHeight:1}}>Eu Henriq</span>
      </Link>
      <nav style={{display:"flex",gap:24,fontFamily:"var(--font-ui)",fontSize:10.5,
        letterSpacing:".22em",textTransform:"uppercase",fontWeight:500}} className="nav-links">
        {NAV_LINKS.map(item=>{
          const active = path===item.href || (item.href!=="/" && path.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{color:fg,opacity:active?1:.72,paddingBottom:2,
              borderBottom:active?"1px solid var(--rust-soft)":"1px solid transparent",
              transition:"opacity .2s,border-color .2s",whiteSpace:"nowrap"}}>{item.label}</Link>
          );
        })}
      </nav>
      <style>{`
        @media(max-width:900px){ .nav-name{display:none!important} .nav-links{gap:14px!important;font-size:9px!important} }
        @media(max-width:640px){ .nav-links{display:none!important} }
      `}</style>
    </header>
  );
}

// ── Site Footer ───────────────────────────────────────────────────
function SiteFooter({ dark=false }){
  const bg = dark ? "var(--forest-soft)" : "var(--canvas-deep)";
  const fg = dark ? "var(--canvas)" : "var(--bark)";
  const dim = dark ? "rgba(232,223,201,.45)" : "rgba(42,33,26,.5)";
  const border = dark ? "rgba(232,223,201,.14)" : "rgba(42,33,26,.14)";
  const FOOTER_NAV = NAV_LINKS.slice(0,5);
  return (
    <footer style={{background:bg,color:fg,padding:"64px 56px 40px",borderTop:`1px solid ${border}`,fontFamily:"var(--font-ui)"}}>
      <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40,marginBottom:48}}>
        <div>
          <p style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:26,letterSpacing:"-.01em",lineHeight:1.25,maxWidth:"22ch",margin:"0 0 16px"}}>
            Fotografia de campo, feita com os pés no chão.
          </p>
          <span style={{fontFamily:"var(--font-hand)",fontSize:30,color:"var(--rust-soft)",transform:"rotate(-2deg)",display:"inline-block",lineHeight:1}}>— Henrique</span>
        </div>
        <div>
          <p style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:dim,marginBottom:14,marginTop:0}}>Navegar</p>
          {FOOTER_NAV.map(l=>(<Link key={l.href} href={l.href} style={{display:"block",fontSize:13,lineHeight:2,opacity:.8}}>{l.label}</Link>))}
        </div>
        <div>
          <p style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:dim,marginBottom:14,marginTop:0}}>Contato</p>
          <a href={`mailto:${SITE_EMAIL}`} style={{display:"block",fontSize:13,lineHeight:2,color:fg,textDecoration:"none",opacity:.8}}>{SITE_EMAIL}</a>
          <a href="https://instagram.com/henriq.eu" style={{display:"block",fontSize:13,lineHeight:2,color:fg,textDecoration:"none",opacity:.8}}>Instagram</a>
        </div>
        <div>
          <p style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:dim,marginBottom:14,marginTop:0}}>Base</p>
          <p style={{fontSize:13,lineHeight:2,margin:0}}>São Paulo · BR</p>
          <p style={{fontSize:13,lineHeight:2,margin:0,opacity:.8}}>Atende worldwide</p>
          <p style={{fontSize:13,lineHeight:2,margin:0,opacity:.6}}>Desde 2018</p>
        </div>
      </div>
      <div style={{paddingTop:24,borderTop:`1px solid ${border}`,display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".15em",color:dim,flexWrap:"wrap",gap:8}}>
        <span>© 2026 · Henrique Sesana Pimenta · Todos os direitos reservados</span>
        <span>10°17′S 76°54′W · alt 4 800 m</span>
      </div>
      <style>{`@media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:560px){.footer-grid{grid-template-columns:1fr!important}}`}</style>
    </footer>
  );
}

// ── HOME ──────────────────────────────────────────────────────────
function HomePage(){
  const [hover, setHover] = useState(null);
  return (
    <div style={{background:"var(--forest)",color:"var(--canvas)",height:"100svh",overflow:"hidden",fontFamily:"var(--font-ui)"}}>
      <style>{`
        @keyframes kb1{0%,100%{transform:scale(1.05) translate(0%,0%)}50%{transform:scale(1.18) translate(-2%,-1.5%)}}
        @keyframes kb2{0%,100%{transform:scale(1.08) translate(-1%,-1%)}50%{transform:scale(1.2) translate(2%,1%)}}
        @keyframes kb3{0%,100%{transform:scale(1.1) translate(1%,0%)}50%{transform:scale(1.22) translate(-1.5%,-2%)}}
        .hf-card{position:relative;flex:1;height:100%;overflow:hidden;cursor:pointer;
          transition:flex .9s cubic-bezier(.2,.7,.2,1);
          border-right:1px solid rgba(232,223,201,.08)}
        .hf-card:last-child{border-right:0}
        .hf-card.hov{flex:1.4} .hf-card.dim{flex:.85}
        .kb1{animation:kb1 22s ease-in-out infinite}
        .kb2{animation:kb2 25s ease-in-out infinite}
        .kb3{animation:kb3 27s ease-in-out infinite}
        .hf-grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(30,42,24,.4) 0%,rgba(30,42,24,.1) 35%,rgba(30,42,24,.1) 55%,rgba(30,42,24,.88) 100%);transition:background .4s}
        .hf-card.hov .hf-grad{background:linear-gradient(180deg,rgba(30,42,24,.2) 0%,rgba(30,42,24,.04) 35%,rgba(30,42,24,.2) 55%,rgba(30,42,24,.75) 100%)}
        .hf-card.dim .hf-grad{background:linear-gradient(180deg,rgba(30,42,24,.6) 0%,rgba(30,42,24,.35) 35%,rgba(30,42,24,.35) 55%,rgba(30,42,24,.92) 100%)}
        .hf-hand{position:absolute;top:168px;right:24px;font-family:var(--font-hand);font-size:22px;color:var(--rust-soft);transform:rotate(-4deg);opacity:0;transition:opacity .4s .1s,transform .4s;pointer-events:none}
        .hf-card.hov .hf-hand{opacity:1;transform:rotate(-6deg) translateY(-2px)}
        .hf-arrow{font-family:var(--font-serif);font-style:italic;font-size:22px;font-weight:400;transition:transform .3s cubic-bezier(.2,.7,.2,1),color .3s}
        .hf-card.hov .hf-arrow{transform:translateX(8px);color:var(--rust-soft)}
        .hf-nav-link{color:var(--canvas);opacity:.75;font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:500;text-decoration:none;padding-bottom:2px;border-bottom:1px solid transparent;transition:opacity .2s,border-color .2s}
        .hf-nav-link:hover{opacity:1;border-color:var(--rust-soft)}
        @media(max-width:767px){
          .hf-row{flex-direction:column!important;height:auto!important;min-height:100svh}
          .hf-card{flex:none!important;width:100%!important;height:33svh;border-right:0;border-bottom:1px solid rgba(232,223,201,.08)}
          .hf-card:last-child{border-bottom:0}
          .hf-card.hov,.hf-card.dim{flex:none!important}
          .hf-footer-bar{display:none!important}
        }
      `}</style>
      <header className="hf-topbar" style={{position:"absolute",top:0,left:0,right:0,height:72,display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",padding:"0 40px",zIndex:20,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",background:"rgba(30,42,24,.35)",borderBottom:"1px solid rgba(232,223,201,.08)"}}>
        <nav style={{display:"flex",gap:28}}>
          <Link href="/portfolio"  className="hf-nav-link">Portfolio</Link>
          <Link href="/presets"    className="hf-nav-link">Presets</Link>
          <Link href="/expedicoes" className="hf-nav-link">Expedições</Link>
        </nav>
        <Link href="/" style={{textDecoration:"none",color:"inherit",textAlign:"center"}}>
          <span style={{fontFamily:"var(--font-hand)",fontSize:32,color:"var(--canvas)",letterSpacing:".02em",lineHeight:1}}>Eu Henriq</span>
        </Link>
        <nav style={{display:"flex",gap:28,justifyContent:"flex-end"}}>
          <Link href="/quadros"  className="hf-nav-link">Quadros</Link>
          <Link href="/midiakit" className="hf-nav-link">Midiakit</Link>
          <Link href="/sobre"    className="hf-nav-link">Sobre</Link>
          <Link href="/contato"  className="hf-nav-link">Contato</Link>
        </nav>
      </header>

      <div className="hf-row" style={{display:"flex",height:"100%",width:"100%"}} onMouseLeave={()=>setHover(null)}>
        {HOME_CARDS.map((card,i)=>{
          const accents = ["№ 01","№ 02","№ 03"];
          const cls = `hf-card${hover===i?" hov":""}${hover!==null && hover!==i?" dim":""}`;
          return (
            <Link key={card.href} href={card.href} className={cls} onMouseEnter={()=>setHover(i)}>
              <div className={`kb${i+1}`} style={{position:"absolute",inset:0,backgroundImage:`url(${card.bg})`,backgroundSize:"cover",backgroundPosition:card.bgPosition,willChange:"transform"}} />
              <div className="hf-grad" />
              <div style={{position:"absolute",top:110,left:32,zIndex:2}}>
                <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",color:"rgba(232,223,201,.7)"}}>{accents[i]}</div>
                <div style={{width:28,height:1,background:"rgba(232,223,201,.45)",marginTop:8}} />
              </div>
              <div style={{position:"absolute",top:110,right:32,zIndex:2,fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",color:"rgba(232,223,201,.55)"}}>
                {String(i+1).padStart(2,"0")} / 03
              </div>
              <div className="hf-hand">{HAND_WORDS[i]}—</div>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"36px 32px 80px",zIndex:2}}>
                <div style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:15,color:"rgba(232,223,201,.78)",marginBottom:12}}>{card.kicker}</div>
                <h2 style={{fontFamily:"var(--font-ui)",fontWeight:600,fontSize:36,letterSpacing:"-.02em",color:"var(--canvas)",margin:0,lineHeight:1}}>{card.label}</h2>
                <div style={{marginTop:28,display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:18,borderTop:"1px solid rgba(232,223,201,.22)",fontFamily:"var(--font-ui)",fontSize:11,letterSpacing:".22em",textTransform:"uppercase",fontWeight:600,color:"var(--canvas)"}}>
                  <span>Explorar</span><span className="hf-arrow">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="hf-footer-bar" style={{position:"absolute",bottom:0,left:0,right:0,height:56,background:"linear-gradient(180deg,rgba(30,42,24,0) 0%,rgba(30,42,24,.85) 60%,var(--forest) 100%)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 40px",zIndex:15,pointerEvents:"none"}}>
        <div className="hf-tagline" style={{display:"flex",alignItems:"center",gap:14}}>
          <span style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(232,223,201,.5)"}}>Fotografia de campo · desde 2018</span>
        </div>
        <span className="hf-cam-line" style={{fontFamily:"var(--font-hand)",fontSize:26,color:"rgba(232,223,201,.85)",transform:"rotate(-2deg)"}}>onde a câmera vai junto—</span>
        <div className="hf-coords" style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".15em",color:"rgba(232,223,201,.4)"}}>
          10°17′S &nbsp; 76°54′W &nbsp;·&nbsp; alt 4 800 m
        </div>
      </div>
    </div>
  );
}

// ── PORTFOLIO ─────────────────────────────────────────────────────
const PHOTOS = [
  { src:"public/images/portfolio/lencois-aerial-drone.jpg", ar:1.33, title:"Lençóis · aérea", place:"Lençóis Maranhenses, MA", coord:"2°34'S 43°07'W", year:2025 },
  { src:"public/images/portfolio/lencois-silhueta-pordosol.jpg", ar:1.50, title:"Silhueta ao pôr do sol", place:"Lençóis Maranhenses, MA", coord:"2°34'S 43°07'W", year:2025 },
  { src:"public/images/portfolio/cordilheira-blanca-caminho-ate-laguna69-peru.jpg", ar:0.80, title:"Cordilheira Blanca", place:"Laguna 69, Peru", coord:"9°01'S 77°37'W", year:2025 },
  { src:"public/images/portfolio/ocaminhante-lencois.jpg", ar:0.75, title:"O Caminhante", place:"Lençóis Maranhenses, MA", year:2025 },
  { src:"public/images/portfolio/nascer-do-sol-mantiqueira-marinsxitaguaré.jpg", ar:1.60, title:"Nascer do sol", place:"Mantiqueira · Marins, SP", coord:"22°36'S 45°01'W", year:2024 },
  { src:"public/images/portfolio/pessoas-caminhando-travessia-lencois.jpg", ar:1.50, title:"A travessia", place:"Lençóis Maranhenses, MA", year:2025 },
  { src:"public/images/portfolio/acapamento-janca-huayhuash.jpg", ar:1.34, title:"Acampamento Janca", place:"Huayhuash, Peru", coord:"10°12'S 76°48'W", year:2025 },
  { src:"public/images/portfolio/lencois-caminhando-na-duna.jpg", ar:1.50, title:"Caminhando na duna", place:"Lençóis Maranhenses, MA", year:2025 },
  { src:"public/images/portfolio/pico-parana-visto-do-topo-serradoibitiraquire.jpg", ar:1.33, title:"Pico Paraná visto do topo", place:"Serra do Ibitiraquire, PR", coord:"25°14'S 48°49'W", year:2024 },
  { src:"public/images/portfolio/via-lactea-lencois-baixa-grande.jpg", ar:0.80, title:"Via Láctea · Baixa Grande", place:"Lençóis Maranhenses, MA", coord:"2°34'S 43°07'W", year:2025 },
  { src:"public/images/portfolio/grupo-caminhando-lencois.jpg", ar:1.50, title:"Grupo em marcha", place:"Lençóis Maranhenses, MA", year:2025 },
  { src:"public/images/portfolio/acapamento-janca-huayhuash2.jpg", ar:1.50, title:"Janca ao entardecer", place:"Huayhuash, Peru", coord:"10°12'S 76°48'W", year:2025 },
  { src:"public/images/portfolio/lencois-silhueta-pordosol-drone.jpg", ar:1.33, title:"Silhueta · drone", place:"Lençóis Maranhenses, MA", coord:"2°34'S 43°07'W", year:2025 },
  { src:"public/images/portfolio/serra-da-mantiqueira-pico-dos-marins.jpg", ar:1.34, title:"Serra da Mantiqueira", place:"Pico dos Marins, SP", coord:"22°36'S 45°01'W", year:2024 },
  { src:"public/images/portfolio/o-escolhido-lencois-maranhenses.jpg", ar:0.75, title:"O Escolhido", place:"Lençóis Maranhenses, MA", year:2025 },
  { src:"public/images/portfolio/as3lagunas-huayhuash.jpg", ar:1.34, title:"As três lagunas", place:"Huayhuash, Peru", coord:"10°12'S 76°48'W", year:2025 },
  { src:"public/images/portfolio/queimada-dos-britos-lencois.jpg", ar:1.50, title:"Queimada dos Britos", place:"Lençóis Maranhenses, MA", coord:"2°34'S 43°07'W", year:2025 },
  { src:"public/images/portfolio/pordosol-cordilheira-blanca-peru.jpg", ar:1.33, title:"Pôr do sol · Cordilheira", place:"Cordilheira Blanca, Peru", coord:"9°01'S 77°37'W", year:2025 },
  { src:"public/images/portfolio/lagoa-lencois-drone.jpg", ar:0.75, title:"Lagoa · vista aérea", place:"Lençóis Maranhenses, MA", coord:"2°34'S 43°07'W", year:2025 },
  { src:"public/images/portfolio/escalada-cabeca-depeixe.jpg", ar:1.78, title:"Escalada", place:"Cabeça de Peixe, SP", year:2024 },
  { src:"public/images/portfolio/vista-para-montanhas-itatiaia.jpg", ar:1.50, title:"Vista para as montanhas", place:"Parque Itatiaia, RJ", coord:"22°25'S 44°37'W", year:2024 },
  { src:"public/images/portfolio/caminho-para-laguna69-peru.jpg", ar:1.50, title:"Caminho para Laguna 69", place:"Cordilheira Blanca, Peru", coord:"9°01'S 77°37'W", year:2025 },
  { src:"public/images/portfolio/arara-caninde-rondonia.jpg", ar:0.75, title:"Arara-canindé", place:"Rondônia, BR", coord:"10°52'S 65°20'W", year:2023 },
  { src:"public/images/portfolio/laguna-acampamento-janca-huayhuash.jpg", ar:0.75, title:"Laguna Janca", place:"Huayhuash, Peru", coord:"10°12'S 76°48'W", year:2025 },
  { src:"public/images/portfolio/eu-e-oguia-caminhando-no-por-do-sol.jpg", ar:1.33, title:"Guia e fotógrafo", place:"Lençóis Maranhenses, MA", year:2025 },
  { src:"public/images/portfolio/asas-de-hermes-itatiaia.jpg", ar:1.50, title:"Asas de Hermes", place:"Parque Itatiaia, RJ", coord:"22°25'S 44°37'W", year:2024 },
  { src:"public/images/portfolio/observador-itatiaia-chapada-da-lua.jpg", ar:1.50, title:"O Observador", place:"Chapada da Lua, Itatiaia RJ", coord:"22°23'S 44°38'W", year:2024 },
  { src:"public/images/portfolio/via-lactea-lencois1.jpg", ar:1.50, title:"Via Láctea", place:"Lençóis Maranhenses, MA", year:2025 },
  { src:"public/images/portfolio/grupo-caminhando-travesisa-lencois.jpg", ar:1.50, title:"Travessia em grupo", place:"Lençóis Maranhenses, MA", coord:"2°34'S 43°07'W", year:2025 },
  { src:"public/images/portfolio/cordilheira-blanca-caminho-ate-laguna69-peru2.jpg", ar:0.75, title:"Altitude", place:"Cordilheira Blanca, Peru", coord:"9°01'S 77°37'W", year:2025 },
  { src:"public/images/portfolio/pico-ciririca-serradoibitiraquire.jpg", ar:1.50, title:"Pico Ciririca", place:"Serra do Ibitiraquire, PR", coord:"25°14'S 48°49'W", year:2024 },
  { src:"public/images/portfolio/cachoeira-ratunde-rondonia.jpg", ar:0.75, title:"Cachoeira Ratunde", place:"Rondônia, BR", coord:"10°52'S 65°20'W", year:2023 },
  { src:"public/images/portfolio/lencois-caminhate-15hrsdatarde.jpg", ar:1.33, title:"Às 15h da tarde", place:"Lençóis Maranhenses, MA", year:2025 },
  { src:"public/images/portfolio/vista-vilarejo-lencois.jpg", ar:1.33, title:"Vista do vilarejo", place:"Lençóis Maranhenses, MA", year:2025 },
  { src:"public/images/portfolio/hotel-pakaas-ronodonia-riomamore-riopakaas.jpg", ar:1.50, title:"Rio Pakaás · Hotel", place:"Rio Mamoré, Rondônia, BR", year:2023 },
  { src:"public/images/portfolio/vista-do-picomateo.jpg", ar:1.33, title:"Vista do Pico Mateo", place:"Huayhuash, Peru", coord:"10°12'S 76°48'W", year:2025 },
  { src:"public/images/portfolio/cachoeira-dos-macacaquinhos-rondonia.jpg", ar:0.75, title:"Cachoeira dos Macacaquinhos", place:"Rondônia, BR", coord:"10°52'S 65°20'W", year:2023 },
  { src:"public/images/portfolio/caverna-do-diabo-petar-eldorado-SP.jpg", ar:1.50, title:"Caverna do Diabo", place:"PETAR, Eldorado SP", coord:"24°32'S 48°41'W", year:2023 },
  { src:"public/images/portfolio/ronondia-riopakaas-riomamore.jpg", ar:1.60, title:"Rio Pakaás · Mamoré", place:"Rondônia, BR", year:2023 },
  { src:"public/images/portfolio/cachoeira-ratunde-ronodonia-2.jpg", ar:1.33, title:"Ratunde · detalhe", place:"Rondônia, BR", coord:"10°52'S 65°20'W", year:2023 },
];

function buildRows(photos, containerW, targetH){
  const rows = []; let cur = []; let curAR = 0;
  const maxAR = containerW / targetH;
  for(const p of photos){
    cur.push(p); curAR += p.ar;
    if(curAR >= maxAR * 0.92){ rows.push(cur); cur=[]; curAR=0; }
  }
  if(cur.length) rows.push(cur);
  return rows;
}

function PortfolioPage(){
  const containerW = Math.min(typeof window !== "undefined" ? window.innerWidth - 112 : 1328, 1328);
  const targetH = 400, gap = 4;
  const rows = buildRows(PHOTOS, containerW, targetH);
  return (
    <main style={{background:"var(--canvas)",color:"var(--bark)",fontFamily:"var(--font-ui)"}}>
      <style>{`
        .port-cell{cursor:zoom-in;overflow:hidden;flex-shrink:0}
        .port-img{display:block;width:100%;height:100%;object-fit:cover;transition:transform 1s cubic-bezier(.2,.7,.2,1)}
        .port-cell:hover .port-img{transform:scale(1.04)}
        .port-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(30,42,24,0) 50%,rgba(30,42,24,.82) 100%);opacity:0;transition:opacity .4s;display:flex;align-items:flex-end;padding:20px}
        .port-cell:hover .port-overlay{opacity:1}
        .port-caption{transform:translateY(10px);opacity:0;transition:transform .5s cubic-bezier(.2,.7,.2,1) .05s,opacity .4s}
        .port-cell:hover .port-caption{transform:translateY(0);opacity:1}
        .port-chip{padding:7px 14px;border:1px solid var(--line);color:var(--stone);background:transparent;font-size:11px;letter-spacing:.12em;cursor:pointer;font-family:var(--font-ui)}
        .port-chip-on{background:var(--bark);color:var(--canvas);border-color:var(--bark)}
        @media(max-width:900px){.port-row{flex-wrap:wrap!important}.port-cell{width:calc(50% - 2px)!important;height:240px!important}}
        @media(max-width:560px){.port-cell{width:100%!important;height:280px!important}}
      `}</style>
      <SiteNav dark={false} />

      <header style={{padding:"140px 56px 56px",borderBottom:"1px solid var(--line)",position:"relative"}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"var(--stone)",marginBottom:16,fontWeight:500}}>№ 01 · Fotografia</div>
        <h1 style={{margin:0,lineHeight:0.9}}>
          <span style={{fontFamily:"var(--font-hand)",fontSize:64,color:"var(--rust)",transform:"rotate(-3deg)",display:"inline-block",marginBottom:4}}>o que eu vi</span>
          <br />
          <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:"clamp(80px,14vw,200px)",letterSpacing:"-.05em",lineHeight:0.88,display:"block",color:"var(--bark)"}}>PORT—</span>
          <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:"clamp(80px,14vw,200px)",letterSpacing:"-.05em",lineHeight:0.88,display:"block",color:"var(--bark)"}}>FOLIO.</span>
        </h1>
        <p style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontWeight:300,fontSize:22,color:"var(--stone)",marginTop:28,maxWidth:"48ch",lineHeight:1.5}}>
          Sete anos caminhando com câmera na mão. {PHOTOS.length * 9} frames que sobreviveram à edição lenta — o resto, o vento levou.
        </p>
      </header>

      <div style={{padding:"20px 56px",display:"flex",gap:8,alignItems:"center",borderBottom:"1px solid var(--line)",flexWrap:"wrap"}}>
        <span style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"var(--stone)",marginRight:8}}>Filtrar</span>
        {[["Tudo",`${PHOTOS.length}`],["Deserto","34"],["Montanha","22"],["Oceano","18"],["Floresta","14"],["Noturno","10"]].map(([l,n])=>(
          <button key={l} className={`port-chip${l==="Tudo"?" port-chip-on":""}`}>{l} · {n}</button>
        ))}
      </div>

      <div style={{padding:"6px 56px 0"}}>
        {rows.map((row,ri)=>{
          const rowAR = row.reduce((s,p)=>s+p.ar,0);
          const availableW = containerW - gap*(row.length-1);
          const rowH = Math.min(availableW/rowAR, 480);
          return (
            <div key={ri} className="port-row" style={{display:"flex",gap,marginBottom:gap}}>
              {row.map((p,pi)=>{
                const w = rowH * p.ar;
                const num = String(ri*8+pi+1).padStart(3,"0");
                return (
                  <figure key={pi} className="port-cell" style={{position:"relative",margin:0,width:w,height:rowH}}>
                    <img src={p.src} alt={p.title} className="port-img" loading={ri===0?"eager":"lazy"} />
                    <div className="port-overlay">
                      <div className="port-caption">
                        <div style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:20,color:"var(--canvas)",lineHeight:1.1}}>{p.title}</div>
                        <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"rgba(232,223,201,.65)",letterSpacing:".15em",marginTop:5}}>№ {num} · {p.place} · {p.year}</div>
                        {p.coord && <div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"rgba(232,223,201,.4)",letterSpacing:".12em",marginTop:3}}>{p.coord}</div>}
                      </div>
                    </div>
                  </figure>
                );
              })}
            </div>
          );
        })}
      </div>

      <div style={{padding:"56px 56px 80px",textAlign:"center"}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".2em",textTransform:"uppercase",color:"var(--stone)",marginBottom:20}}>
          Mostrando {PHOTOS.length} de {PHOTOS.length * 9}
        </div>
        <button style={{display:"inline-flex",alignItems:"center",gap:12,padding:"14px 32px",border:"1px solid var(--bark)",fontFamily:"var(--font-ui)",fontSize:12,fontWeight:600,letterSpacing:".12em",textTransform:"uppercase",color:"var(--bark)",background:"transparent",cursor:"pointer"}}>
          Carregar mais <span style={{fontFamily:"var(--font-hand)",fontSize:22,color:"var(--rust)"}}>↓</span>
        </button>
      </div>

      <SiteFooter dark={false} />
    </main>
  );
}

// ── PRESETS ───────────────────────────────────────────────────────
function PresetsPage(){
  return (
    <main style={{background:"var(--canvas)",color:"var(--bark)",fontFamily:"var(--font-ui)",minHeight:"100vh"}}>
      <style>{`
        .door-img{transition:transform .65s cubic-bezier(.2,.7,.2,1)}
        .door:hover .door-img{transform:scale(1.04)}
        .door-cta-arrow{transition:transform .3s cubic-bezier(.2,.7,.2,1)}
        .door:hover .door-cta-arrow{transform:translateX(6px)}
        .compare-item{overflow:hidden;position:relative}
        .compare-img{transition:transform .65s cubic-bezier(.2,.7,.2,1)}
        .compare-item:hover .compare-img{transform:scale(1.04)}

        /* hero */
        .hub-hero{padding:104px 56px 48px;position:relative;overflow:hidden;background:var(--forest)}
        .hub-hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(3px) brightness(.55) saturate(.85);transform:scale(1.04);z-index:0}
        .hub-hero-grad{position:absolute;inset:0;z-index:0;background:linear-gradient(180deg,rgba(14,12,10,.3) 0%,rgba(14,12,10,.15) 50%,rgba(14,12,10,.6) 100%)}
        .hub-hero-inner{position:relative;z-index:1}
        .hub-eyebrow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-family:var(--font-ui);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:rgba(232,223,201,.6);font-weight:500;margin-bottom:20px}
        .hub-hand{font-family:var(--font-hand);font-size:32px;color:var(--rust-soft);transform:rotate(-2deg);display:inline-block;margin-bottom:6px;letter-spacing:.01em}
        .hub-title{font-family:var(--font-ui);font-weight:700;font-size:clamp(38px,5.4vw,64px);letter-spacing:-.03em;line-height:.95;margin:0;color:var(--canvas)}
        .hub-sub{font-family:var(--font-serif);font-weight:400;font-size:clamp(14px,1.4vw,17px);line-height:1.5;color:rgba(232,223,201,.8);margin-top:16px;max-width:54ch}

        /* rail */
        .rail{padding:22px 56px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);display:grid;grid-template-columns:repeat(4,1fr);gap:32px}
        .rail-k{font-family:var(--font-mono);font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--stone);margin-bottom:3px}
        .rail-v{font-family:var(--font-serif);font-style:italic;font-size:clamp(13px,1.1vw,15px);color:var(--bark);line-height:1.35}

        /* doors */
        .two-door{padding:40px 56px 88px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        .door{position:relative;height:560px;overflow:hidden;cursor:pointer;background:var(--forest)}
        .door-bg{position:absolute;inset:0;background-size:cover;background-position:center}
        .door-overlay{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:32px 32px 36px;z-index:2;color:var(--canvas)}
        .door-h2{font-family:var(--font-ui);font-weight:600;font-size:clamp(30px,4.2vw,44px);letter-spacing:-.02em;line-height:1;margin:0}
        .door-cta{margin-top:24px;padding-top:18px;border-top:1px solid rgba(232,223,201,.25);display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;font-family:var(--font-ui);font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:600}

        /* compare */
        .hub-compare{padding:88px 56px;background:var(--canvas-deep)}
        .hub-compare-h2{font-family:var(--font-ui);font-weight:600;font-size:clamp(32px,5vw,48px);letter-spacing:-.02em;line-height:1.05;color:var(--bark);margin:0 0 14px}
        .compare-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}

        @media(max-width:1024px){
          .hub-hero{padding:104px 40px 72px}
          .rail{padding:32px 40px;grid-template-columns:repeat(2,1fr);gap:28px 32px}
          .two-door{padding:48px 40px 80px;grid-template-columns:1fr}
          .hub-compare{padding:80px 40px}
        }
        @media(max-width:760px){
          .hub-hero{padding:96px 22px 56px}
          .hub-hand{font-size:30px}
          .rail{padding:28px 22px;grid-template-columns:1fr 1fr;gap:22px}
          .two-door{padding:36px 22px 64px;grid-template-columns:1fr;gap:16px}
          .door{height:440px}
          .door-overlay{padding:24px 22px 26px}
          .door-cta{font-size:10px;letter-spacing:.18em}
          .hub-compare{padding:64px 22px}
          .compare-grid{grid-template-columns:repeat(2,1fr);gap:8px}
        }
        @media(max-width:440px){
          .rail{grid-template-columns:1fr;gap:18px}
          .door{height:400px}
          .hub-eyebrow{gap:6px;font-size:9px}
          .compare-grid{grid-template-columns:1fr;gap:8px}
        }
      `}</style>

      <SiteNav dark={false} />

      <div className="hub-hero">
        <div className="hub-hero-bg" style={{backgroundImage:"url(public/images/portfolio/pico-ciririca-serradoibitiraquire.jpg)",backgroundSize:"cover",backgroundPosition:"center"}} />
        <div className="hub-hero-grad" />
        <div className="hub-hero-inner">
          <div className="hub-eyebrow">
            <span>№ 03</span>
            <span style={{width:4,height:4,borderRadius:"50%",background:"var(--rust)",display:"inline-block"}} />
            <span>Cor · tratamento</span>
            <span style={{width:4,height:4,borderRadius:"50%",background:"var(--rust)",display:"inline-block"}} />
            <span style={{color:"var(--rust)"}}>Desde 2022</span>
          </div>
          <div className="hub-hand">a mesma cor que eu uso—</div>
          <h1 className="hub-title">
            Presets & LUTs<br />
            <span style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontWeight:400,color:"var(--rust-soft)"}}>saídos das minhas fotos</span>
          </h1>
          <p className="hub-sub">
            O mesmo tratamento que aplico no meu próprio portfólio, agora no seu Lightroom e no seu Premiere. Três coleções separadas — escolha a que cabe no seu fluxo.
          </p>
        </div>
      </div>

      <div className="rail">
        {[["Compatibilidade","Lightroom · Photoshop · Camera Raw"],["Formato",".xmp · .dng · .cube · .3dl"],["Licença","Pessoal + comercial"],["Atualizações","Vitalícias, sem custo"]].map(([k,v])=>(
          <div key={k}>
            <div className="rail-k">{k}</div>
            <div className="rail-v">{v}</div>
          </div>
        ))}
      </div>

      <div className="two-door">
        <Link href="/presets/fotografia" style={{textDecoration:"none",color:"inherit"}}>
        <div className="door">
          <div className="door-bg door-img" style={{backgroundImage:"url(public/images/portfolio/pico-ciririca-serradoibitiraquire.jpg)"}} />
          <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(30,42,24,.25) 0%,rgba(30,42,24,.1) 40%,rgba(30,42,24,.85) 100%)"}} />
          <div className="door-overlay">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{padding:"5px 10px",border:"1px solid rgba(232,223,201,.5)",fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase"}}>.xmp · .dng</div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",color:"var(--ashe)"}}>№ 01 / 03</div>
            </div>
            <div>
              <div style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:15,color:"var(--ashe)",marginBottom:10}}>Para fotografia · Lightroom</div>
              <h2 className="door-h2">Outdoor Cinematic<br />Presets</h2>
              <div className="door-cta">
                <span>45 presets · R$ 39,90 <span style={{textDecoration:"line-through",opacity:.5,marginLeft:6,fontWeight:400}}>R$ 79,90</span></span>
                <span className="door-cta-arrow" style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:22,fontWeight:400}}>→</span>
              </div>
            </div>
          </div>
        </div>
        </Link>
        <a href="outdoor-grain.html" style={{textDecoration:"none",color:"inherit"}}>
        <div className="door">
          <div className="door-bg door-img" style={{backgroundImage:"url(public/images/outdoor-grain-capa.jpg)",backgroundPosition:"center 38%"}} />
          <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(30,42,24,.22) 0%,rgba(30,42,24,.1) 40%,rgba(30,42,24,.86) 100%)"}} />
          <div className="door-overlay">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{padding:"5px 10px",border:"1px solid rgba(232,223,201,.5)",fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase"}}>.xmp · .dng</div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",color:"var(--ashe)"}}>№ 02 / 03</div>
            </div>
            <div>
              <div style={{fontFamily:"var(--font-hand)",fontSize:24,color:"var(--rust-soft)",transform:"rotate(-2deg)",marginBottom:4,display:"inline-block"}}>grão de cinema—</div>
              <div style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:15,color:"var(--ashe)",marginBottom:10}}>Para fotografia · emulação de filme</div>
              <h2 className="door-h2">Outdoor Grain<br />Presets</h2>
              <p style={{fontFamily:"var(--font-serif)",fontSize:13.5,lineHeight:1.55,color:"var(--ashe)",marginTop:12,marginBottom:0,maxWidth:"36ch"}}>21 emulações de filme analógico — o grão, o halo e a cor da película, calibrados em campo.</p>
              <div className="door-cta">
                <span>21 presets · ver prévia</span>
                <span className="door-cta-arrow" style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:22,fontWeight:400}}>→</span>
              </div>
            </div>
          </div>
        </div>
        </a>
        <div className="door">
          <div className="door-bg door-img" style={{backgroundImage:"url(public/images/portfolio/as3lagunas-huayhuash.jpg)",filter:"brightness(.85)"}} />
          <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(30,42,24,.35) 0%,rgba(30,42,24,.15) 40%,rgba(30,42,24,.9) 100%)"}} />
          <div className="door-overlay">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{padding:"5px 10px",border:"1px solid rgba(232,223,201,.5)",fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase"}}>.cube · .3dl</div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",color:"var(--ashe)"}}>№ 03 / 03</div>
            </div>
            <div>
              <div style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:15,color:"var(--ashe)",marginBottom:10}}>Para vídeo · S-Log · D-Log · GoPro · Rec.709</div>
              <h2 className="door-h2">Outdoor Cinematic<br />LUTs</h2>
              <p style={{fontFamily:"var(--font-serif)",fontSize:13.5,lineHeight:1.55,color:"var(--ashe)",marginTop:12,marginBottom:0,maxWidth:"36ch"}}>16 LUTs cinematográficas feitas em campo — dunas, montanha, névoa, sol forte e pôr do sol. Cor honesta, sem saturação forçada.</p>
              <div className="door-cta">
                <span>16 LUTs · em breve</span>
                <span className="door-cta-arrow" style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:22,fontWeight:400}}>→</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hub-compare">
        <h2 className="hub-compare-h2">
          A mesma <span style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontWeight:400,color:"var(--moss)"}}>paleta</span>,<br />em foto e vídeo.
        </h2>
        <p style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:"clamp(15px,1.6vw,18px)",color:"#3A3530",maxWidth:"52ch",marginTop:14,marginBottom:36,lineHeight:1.55}}>
          Construí as duas coleções a partir do mesmo referencial cinematográfico. Cor de cinema, mas feita em campo — não em estúdio.
        </p>
        <div className="compare-grid">
          {[
            ["public/images/portfolio/acapamento-janca-huayhuash.jpg","Portfolio · Andes"],
            ["public/images/portfolio/laguna-acampamento-janca-huayhuash.jpg","Campo · Huayhuash"],
            ["public/images/portfolio/lencois-silhueta-pordosol.jpg","Lençóis · Pôr do sol"],
            ["public/images/portfolio/vista-para-montanhas-itatiaia.jpg","Itatiaia · Amanhecer"],
          ].map(([img,lbl])=>(
            <div key={lbl} className="compare-item" style={{aspectRatio:"3/4"}}>
              <div className="compare-img" style={{position:"absolute",inset:0,backgroundImage:`url(${img})`,backgroundSize:"cover",backgroundPosition:"center"}} />
              <div style={{position:"absolute",bottom:10,left:10,fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".15em",color:"var(--canvas)",background:"rgba(30,42,24,.75)",padding:"3px 8px"}}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <SiteFooter dark={false} />
    </main>
  );
}

// ── EXPEDIÇÕES ────────────────────────────────────────────────────
const TRIPS = [
  { id:"01", href:"/expedicoes/lencois", name:"Lençóis Maranhenses", country:"Brasil · MA", when:"Ago 2026", days:4, alt:"40 m", km:52, level:"Intermediário", status:"Vagas abertas", available:true, preco:"a partir de R$ 3.599", hero:"public/images/lencois/DJI_20250828174205_0403_D-HDR.jpg", kicker:"Deserto com lagoas. Sem neblina, com Via Láctea.", desc:"Quatro dias na melhor janela do ano — lagoas cheias, poucos turistas e astrofotografia garantida. Três pacotes de imersão. Base em Barreirinhas, travessia a pé até Santo Amaro." },
  { id:"02", name:"Cordillera Huayhuash", country:"Peru", when:"2027", days:11, alt:"5 050 m", km:130, level:"Avançado", status:"Em breve", available:false, preco:"Em breve", hero:"public/images/exp-huayhuash.jpg", kicker:"A trilha mais dura, a luz mais limpa.", desc:"Onze dias no circuito clássico da Huayhuash, passando por lagoas de 4.600 m e o vale de Janca. Saímos de Huaraz com mulas carregando o acampamento — você carrega só sua câmera." },
];
function TripCard({ trip, flip }){
  const imgCol = (
    <div className="exp-trip-img" style={{position:"relative",overflow:"hidden",minHeight:380}}>
      <img src={trip.hero} alt={trip.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
      <div style={{position:"absolute",top:16,left:16,background:"var(--canvas)",color:"var(--bark)",padding:"5px 12px",fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em"}}>Expedição № {trip.id}</div>
      <div className="exp-trip-id" style={{position:"absolute",bottom:14,right:18,color:"var(--canvas)",fontFamily:"var(--font-mono)",fontSize:"clamp(40px,9vw,72px)",fontWeight:500,letterSpacing:"-.04em",lineHeight:1,mixBlendMode:"difference"}}>{trip.id}</div>
    </div>
  );
  const bodyCol = (
    <div className="exp-trip-body" style={{padding:"clamp(24px,4vw,44px) clamp(20px,4vw,48px) clamp(28px,4vw,40px)",display:"flex",flexDirection:"column",justifyContent:"space-between",background:"var(--canvas)",borderTop:"1px solid var(--line)"}}>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap",marginBottom:18}}>
          <span style={{fontFamily:"var(--font-mono)",fontSize:"clamp(9px,2vw,10px)",letterSpacing:".22em",textTransform:"uppercase",color:"var(--stone)"}}>{trip.country} · {trip.when}</span>
          <span style={{padding:"4px 10px",background:trip.available?"var(--rust)":"transparent",color:trip.available?"var(--canvas)":"var(--stone)",border:trip.available?"none":"1px solid var(--stone)",fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{trip.status}</span>
        </div>
        <h3 style={{fontFamily:"var(--font-ui)",fontSize:"clamp(30px,5vw,48px)",fontWeight:700,letterSpacing:"-.03em",lineHeight:0.95,color:"var(--bark)",margin:0}}>{trip.name}</h3>
        <div style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:"clamp(16px,2.5vw,20px)",color:"var(--moss)",marginTop:10,marginBottom:16,lineHeight:1.35}}>{trip.kicker}</div>
        <p style={{fontFamily:"var(--font-serif)",fontSize:"clamp(14px,1.8vw,16px)",lineHeight:1.6,color:"#3A3530",margin:0}}>{trip.desc}</p>
        <div className="exp-trip-stats" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginTop:24,paddingTop:20,borderTop:"1px solid var(--line)"}}>
          {[["Dias",String(trip.days)],["Altitude",trip.alt],["Caminhada",`${trip.km} km`],["Nível",trip.level]].map(([k,v])=>(
            <div key={k}>
              <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"var(--stone)",marginBottom:4}}>{k}</div>
              <div style={{fontFamily:"var(--font-ui)",fontSize:"clamp(14px,2vw,17px)",fontWeight:600,color:"var(--bark)",lineHeight:1.2}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="exp-trip-cta" style={{marginTop:24,paddingTop:18,borderTop:"1px solid var(--line)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"var(--stone)",marginBottom:4}}>Investimento</div>
          <div style={{fontFamily:"var(--font-ui)",fontSize:"clamp(22px,3.5vw,28px)",fontWeight:700,letterSpacing:"-.02em",color:"var(--bark)"}}>{trip.preco}</div>
        </div>
        {trip.available ? (
          <Link href={trip.href||"/expedicoes"} style={{padding:"12px 18px",background:"var(--bark)",color:"var(--canvas)",fontFamily:"var(--font-ui)",fontSize:11,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",textDecoration:"none",whiteSpace:"nowrap"}}>
            Ver detalhes →
          </Link>
        ) : (
          <a href={`mailto:${SITE_EMAIL}`} style={{padding:"12px 18px",background:"transparent",color:"var(--stone)",border:"1px solid var(--stone)",fontFamily:"var(--font-ui)",fontSize:11,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",textDecoration:"none",whiteSpace:"nowrap"}}>
            Avisar quando abrir
          </a>
        )}
      </div>
    </div>
  );
  return (
    <div className="trip-grid" style={{display:"grid",gridTemplateColumns:flip?"1fr 1.1fr":"1.1fr 1fr",marginBottom:48,borderTop:"1px solid var(--line)"}}>
      {flip ? <>{bodyCol}{imgCol}</> : <>{imgCol}{bodyCol}</>}
    </div>
  );
}

function ExpedicoesPage(){
  return (
    <div style={{background:"var(--canvas)",color:"var(--bark)",fontFamily:"var(--font-ui)"}}>
      <style>{`
        .exp-hero{position:relative;min-height:560px;overflow:hidden;background:var(--forest)}
        .exp-hero-inner{position:absolute;inset:0;padding:140px 56px 48px;display:flex;flex-direction:column;justify-content:space-between;color:var(--canvas);z-index:2}
        .exp-hero h1{font-family:var(--font-ui);font-weight:700;font-size:clamp(48px,9vw,140px);letter-spacing:-.04em;line-height:.92;margin:0}
        .exp-hero-hand{font-family:var(--font-hand);color:var(--rust-soft);transform:rotate(-2deg);display:inline-block;margin-bottom:4px;font-size:clamp(28px,5vw,42px)}
        .exp-hero-sub{font-family:var(--font-serif);font-style:italic;line-height:1.5;max-width:46ch;margin:0;font-size:clamp(15px,2.2vw,21px)}
        .exp-sec{padding:clamp(56px,8vw,96px) clamp(20px,5vw,56px)}
        .exp-sec-tight{padding:clamp(48px,7vw,80px) clamp(20px,5vw,56px)}
        .exp-h2{font-family:var(--font-ui);font-weight:600;letter-spacing:-.02em;line-height:1;margin:0;font-size:clamp(34px,6vw,56px)}
        .exp-eyebrow{font-family:var(--font-mono);font-size:10px;letter-spacing:.22em;text-transform:uppercase;margin-bottom:12px}
        .exp-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(20px,3vw,32px)}
        .exp-cta-final{padding:clamp(72px,10vw,120px) clamp(20px,5vw,56px);background:var(--forest);color:var(--canvas);text-align:center;border-top:1px solid rgba(232,223,201,.08)}
        .exp-cta-final h2{font-family:var(--font-ui);font-weight:700;letter-spacing:-.04em;line-height:.92;margin:0;font-size:clamp(48px,10vw,80px)}
        @media(max-width:900px){
          .trip-grid{grid-template-columns:1fr!important}
          .exp-trip-img{min-height:300px}
          .exp-steps{grid-template-columns:1fr 1fr}
          .exp-hero-inner{padding:120px 24px 36px}
          .exp-hero{min-height:520px}
        }
        @media(max-width:560px){
          .exp-trip-img{min-height:240px}
          .exp-trip-stats{grid-template-columns:1fr 1fr!important;gap:14px!important}
          .exp-trip-cta{flex-direction:column!important;align-items:stretch!important;gap:14px!important}
          .exp-trip-cta a{text-align:center}
          .exp-steps{grid-template-columns:1fr!important}
          .exp-hero-inner{padding:104px 20px 28px}
          .exp-hero{min-height:480px}
        }
      `}</style>
      <SiteNav dark={true} />
      <section className="exp-hero">
        <img src="public/images/lencois/DJI_20250828174205_0403_D-HDR.jpg" alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(30,42,24,.35) 0%,rgba(30,42,24,.05) 40%,rgba(30,42,24,.85) 100%)"}} />
        <div className="exp-hero-inner">
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(232,223,201,.6)"}}>
              <span>№ 02</span><span style={{width:4,height:4,borderRadius:"50%",background:"var(--rust-soft)"}} /><span>Viagens guiadas</span>
            </div>
            <div style={{marginTop:24}}>
              <div className="exp-hero-hand">andar devagar, ver mais—</div>
              <h1>Expedições<br /><span style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontWeight:400,color:"var(--rust-soft)"}}>que ensinam</span></h1>
            </div>
          </div>
          <p className="exp-hero-sub">Grupos pequenos, nunca mais de 10 pessoas. Itinerários que priorizam a luz, não o ticket de atração.</p>
        </div>
      </section>
      <section className="exp-sec">
        <div style={{marginBottom:40}}>
          <div className="exp-eyebrow" style={{color:"var(--rust)"}}>№ 02 · Agenda 2026</div>
          <h2 className="exp-h2">Dois <span style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontWeight:400,color:"var(--moss)"}}>destinos</span>.</h2>
        </div>
        {TRIPS.map((t,i)=>(<TripCard key={t.id} trip={t} flip={i%2===1} />))}
      </section>
      <section className="exp-sec-tight" style={{background:"var(--forest)",color:"var(--canvas)"}}>
        <div className="exp-eyebrow" style={{color:"var(--rust-soft)"}}>№ 03 · Como funciona</div>
        <h2 className="exp-h2" style={{margin:"0 0 32px",fontSize:"clamp(28px,5vw,48px)"}}>
          Quatro passos, do email ao <span style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontWeight:400,color:"var(--rust-soft)"}}>cume</span>.
        </h2>
        <div className="exp-steps">
          {[["01","Conversa","Você escreve, eu respondo em 48h com um papo por vídeo."],["02","Reserva","Sinal de 30% garante a vaga. Restante em 60 dias."],["03","Preparo","Kit completo: equipamento, preparo físico, briefing."],["04","Campo","Encontro na cidade-base, expedição, álbum digital."]].map(([n,t,d])=>(
            <div key={n} style={{borderTop:"1px solid rgba(232,223,201,.14)",paddingTop:16}}>
              <div style={{fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:".22em",color:"var(--rust-soft)",marginBottom:8}}>№ {n}</div>
              <div style={{fontFamily:"var(--font-ui)",fontSize:"clamp(18px,2.5vw,22px)",fontWeight:600,marginBottom:6,lineHeight:1.2}}>{t}</div>
              <div style={{fontFamily:"var(--font-serif)",fontSize:14,lineHeight:1.55,color:"rgba(232,223,201,.7)"}}>{d}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="exp-cta-final">
        <div style={{fontFamily:"var(--font-hand)",fontSize:"clamp(28px,5vw,38px)",color:"var(--rust-soft)",transform:"rotate(-2deg)",display:"inline-block",marginBottom:8}}>bora?</div>
        <h2>Sua próxima<br /><span style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontWeight:400,color:"var(--rust-soft)"}}>expedição</span></h2>
        <a href={`mailto:${SITE_EMAIL}`} style={{marginTop:36,display:"inline-block",padding:"16px 32px",background:"var(--rust-soft)",color:"var(--forest)",fontFamily:"var(--font-ui)",fontSize:12,fontWeight:700,letterSpacing:".22em",textTransform:"uppercase",textDecoration:"none"}}>
          Escrever pra Henrique →
        </a>
      </section>
      <SiteFooter dark={true} />
    </div>
  );
}

// ── SOBRE ─────────────────────────────────────────────────────────
function SobrePage(){
  return (
    <main style={{background:"var(--bark)",color:"var(--canvas)",fontFamily:"var(--font-ui)",minHeight:"100vh"}}>
      <SiteNav dark={true} />
      <style>{`
        .sob-hero{display:grid;grid-template-columns:1fr 1fr;min-height:100vh;position:relative;overflow:hidden}
        .sob-photo{position:relative;overflow:hidden}
        .sob-photo img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block;filter:grayscale(100%) contrast(1.05)}
        .sob-photo::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,var(--bark) 0%,transparent 30%)}
        @media(max-width:900px){.sob-hero{grid-template-columns:1fr}.sob-photo{height:70vw}.sob-photo::after{background:linear-gradient(to top,var(--bark) 0%,transparent 40%)}.sob-left{padding:48px 24px 64px!important}}
      `}</style>
      <div className="sob-hero">
        <div className="sob-left" style={{padding:"140px 56px 80px",display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",zIndex:2}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"var(--rust)",marginBottom:20}}>Adventure Filmmaker · São Paulo</div>
          <h1 style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:"clamp(56px,7vw,96px)",letterSpacing:"-.04em",lineHeight:0.88,textTransform:"uppercase",color:"var(--canvas)",margin:"0 0 32px"}}>
            HENRIQUE<br />SESANA.
          </h1>
          <div style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontWeight:300,fontSize:17,lineHeight:1.75,color:"rgba(255,255,255,.65)",maxWidth:"44ch",margin:"0 0 48px"}}>
            <p style={{margin:"0 0 18px"}}>Venho da área técnica — ainda executo esse lado, e ele me dá um jeito preciso de pensar e resolver problemas. Mas fotografia e cinematografia são onde minha cabeça realmente está.</p>
            <p style={{margin:"0 0 18px"}}>A câmera entrou na minha vida junto com a montanha. Escalada me ensinou a ler ambiente, luz e risco de um jeito que nenhum curso ensina. A partir daí fui estudar de verdade: color grading, exposição, direção de fotografia, storytelling.</p>
            <p style={{margin:0}}>Lençóis Maranhenses, Itatiaia, Serra dos Órgãos, Huayhuash, Atacama. Cada expedição virou conteúdo — e o conteúdo abriu portas com marcas como Aiuruocan, O Boticário, K&F Concept e Botas Vento.</p>
          </div>
          <div style={{display:"flex",background:"var(--rust)",width:"fit-content"}}>
            {[["7+","Anos fotografando"],["10+","Destinos"],["18,2%","Engagement"]].map(([n,l])=>(
              <div key={l} style={{padding:"18px 28px",borderRight:"1px solid rgba(0,0,0,.15)"}}>
                <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:32,letterSpacing:"-.03em",color:"var(--canvas)",lineHeight:1}}>{n}</div>
                <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="sob-photo">
          <img src="public/images/henrique-portrait-1.jpg" alt="Henrique Sesana" />
        </div>
      </div>
      <section style={{padding:"80px 56px",borderTop:"1px solid rgba(255,255,255,.1)"}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".25em",textTransform:"uppercase",color:"rgba(255,255,255,.4)"}}>Equipamento</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:32,marginTop:40}} className="gear-grid">
          {[["Sony A7 IV","corpo principal"],["DJI Air 3S","drone cinematográfico"],["Comica VM40","áudio 32-bit float"],["DaVinci Resolve","pós-produção & color grading"]].map(([n,r])=>(
            <div key={n} style={{borderTop:"1px solid rgba(255,255,255,.15)",paddingTop:20}}>
              <div style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:17,color:"var(--canvas)",marginBottom:6}}>{n}</div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".15em",textTransform:"uppercase",color:"rgba(255,255,255,.4)"}}>{r}</div>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:900px){.gear-grid{grid-template-columns:1fr 1fr!important}}`}</style>
      </section>
      <SiteFooter dark={true} />
    </main>
  );
}

// ── CONTATO ───────────────────────────────────────────────────────
function ContatoPage(){
  const [sent, setSent] = useState(false);
  return (
    <main style={{background:"var(--forest)",color:"var(--canvas)",fontFamily:"var(--font-ui)",position:"relative",overflow:"hidden",minHeight:"100vh"}}>
      <style>{`
        .cnt-input{width:100%;padding:14px 0 10px;background:transparent;border:none;border-bottom:1px solid var(--line-dark);color:var(--canvas);font-family:var(--font-serif);font-weight:300;font-size:20px;outline:none;box-sizing:border-box;transition:border-bottom-color .3s}
        .cnt-input::placeholder{color:var(--ashe-dim);font-style:italic}
        .cnt-input:focus{border-bottom-color:var(--canvas)}
        @media(max-width:900px){
          .cnt-grid{grid-template-columns:1fr!important;gap:48px!important;padding:48px 24px 80px!important}
          .cnt-head{padding:110px 24px 40px!important}
          .cnt-hero-h1 span:last-child{font-size:clamp(56px,17vw,120px)!important}
        }
      `}</style>
      <div style={{position:"absolute",inset:0,backgroundImage:"url(public/images/lencois/DJI_20250828174205_0403_D-HDR.jpg)",backgroundSize:"cover",backgroundPosition:"center",opacity:0.18,filter:"grayscale(.4)"}} />
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(30,42,24,.55) 0%,rgba(30,42,24,.92) 60%,var(--forest) 100%)"}} />

      <SiteNav dark={true} />

      <header className="cnt-head" style={{position:"relative",padding:"140px 56px 48px",maxWidth:880}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"var(--ashe-dim)",marginBottom:14}}>№ 06 · Manda mensagem</div>
        <h1 className="cnt-hero-h1" style={{margin:0,lineHeight:0.88}}>
          <span style={{fontFamily:"var(--font-hand)",fontSize:54,color:"var(--rust-soft)",transform:"rotate(-3deg)",display:"inline-block",marginBottom:6}}>pode falar—</span>
          <br />
          <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:"clamp(72px,12vw,160px)",letterSpacing:"-.05em",lineHeight:0.88,display:"block",textTransform:"uppercase"}}>CONTATO.</span>
        </h1>
        <p style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:19,color:"var(--ashe)",marginTop:24,maxWidth:"42ch",lineHeight:1.55}}>
          Reserva de expedição, dúvida sobre preset, parceria ou um papo. Tudo chega na mesma caixa.
        </p>
      </header>

      <div className="cnt-grid" style={{position:"relative",padding:"56px 56px 120px",display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:96,maxWidth:1280}}>
        {!sent ? (
          <form style={{display:"flex",flexDirection:"column",gap:36}} onSubmit={e=>{e.preventDefault();setSent(true);}}>
            <div>
              <label style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"var(--ashe)",display:"block",marginBottom:8}}>Nome</label>
              <input required className="cnt-input" type="text" placeholder="Seu nome" />
            </div>
            <div>
              <label style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"var(--ashe)",display:"block",marginBottom:8}}>Email</label>
              <input required className="cnt-input" type="email" placeholder="voce@exemplo.com" />
            </div>
            <div>
              <label style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"var(--ashe)",display:"block",marginBottom:8}}>Mensagem</label>
              <textarea required className="cnt-input" placeholder="Conta um pouco sobre o que tá procurando..." style={{minHeight:140,resize:"none",paddingTop:14,display:"block"}} />
            </div>
            <div>
              <button type="submit" style={{padding:"18px 32px",background:"var(--canvas)",color:"var(--bark)",border:"none",fontFamily:"var(--font-ui)",fontSize:12,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",display:"inline-flex",alignItems:"center",gap:14,cursor:"pointer"}}>
                Enviar <span style={{fontFamily:"var(--font-hand)",fontSize:28,color:"var(--rust)",transform:"rotate(-2deg)",display:"inline-block"}}>→</span>
              </button>
            </div>
          </form>
        ) : (
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"center",padding:"40px 0"}}>
            <div style={{fontFamily:"var(--font-hand)",fontSize:88,color:"var(--rust-soft)",lineHeight:1,transform:"rotate(-4deg)"}}>obrigado!</div>
            <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:42,letterSpacing:"-.04em",marginTop:24,lineHeight:0.95,textTransform:"uppercase"}}>mensagem<br />enviada.</div>
            <p style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:17,color:"var(--ashe)",marginTop:20,maxWidth:"36ch",lineHeight:1.55}}>
              Em até 48h você recebe minha resposta.
            </p>
            <button onClick={()=>setSent(false)} style={{marginTop:28,padding:"12px 22px",border:"1px solid var(--canvas)",color:"var(--canvas)",background:"transparent",fontFamily:"var(--font-ui)",fontSize:11,fontWeight:600,letterSpacing:".18em",textTransform:"uppercase",cursor:"pointer"}}>Nova mensagem</button>
          </div>
        )}

        <aside style={{display:"flex",flexDirection:"column",gap:36}}>
          <div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"var(--ashe-dim)",marginBottom:10}}>Email direto</div>
            <a href={`mailto:${SITE_EMAIL}`} style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:22,lineHeight:1.3,color:"var(--canvas)",textDecoration:"none",borderBottom:"1px solid var(--rust-soft)",paddingBottom:2}}>{SITE_EMAIL}</a>
          </div>
          <div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"var(--ashe-dim)",marginBottom:10}}>Onde me achar</div>
            <div style={{display:"flex",flexDirection:"column",gap:6,fontFamily:"var(--font-serif)",fontSize:17,color:"var(--ashe)"}}>
              <a href="https://instagram.com/henriq.eu" style={{color:"inherit",textDecoration:"none"}}>@henriq.eu — Instagram</a>
              <a href="#" style={{color:"inherit",textDecoration:"none"}}>Henrique Sesana — YouTube</a>
              <a href="#" style={{color:"inherit",textDecoration:"none"}}>open.substack.com/henriq</a>
            </div>
          </div>
          <div style={{paddingTop:16,borderTop:"1px solid var(--line-dark)"}}>
            <div style={{fontFamily:"var(--font-hand)",fontSize:22,color:"var(--ashe)",lineHeight:1.3,transform:"rotate(-1deg)",display:"inline-block"}}>resposta em até 48h, prometido.</div>
          </div>
        </aside>
      </div>
      <SiteFooter dark={true} />
    </main>
  );
}

// ── QUADROS (Fine art prints) ─────────────────────────────────────
const QUADROS = [
  // Signature — 6 obras
  { id:"camadas-beleza", img:"public/images/quadros/2 CAMADAS DE BELEZA-LENCOIS.jpg", title:"2 Camadas de Beleza", loc:"Lençóis Maranhenses, MA", tier:"signature", price:"R$ 2.900" },
  { id:"a-curva", img:"public/images/quadros/A CURVA-LENCOIS.jpg", title:"A Curva", loc:"Lençóis Maranhenses, MA", tier:"signature", price:"R$ 2.900" },
  { id:"reflexo-carhuacocha", img:"public/images/quadros/REFLEXO_CARHUACOCHA-HUAYHUASH.jpg", title:"Reflexo Carhuacocha", loc:"Huayhuash, Peru", tier:"signature", price:"R$ 2.900" },
  { id:"las-3-lagunas", img:"public/images/quadros/LAS 3 LAGUNAS-HUAYHUASH.jpg", title:"Las 3 Lagunas", loc:"Huayhuash, Peru", tier:"signature", price:"R$ 2.900" },
  { id:"sol-toca-tudo", img:"public/images/quadros/O SOL TOCA TUDO_LENCOIS.jpg", title:"O Sol Toca Tudo", loc:"Lençóis Maranhenses, MA", tier:"signature", price:"R$ 2.900" },
  { id:"conexao-rios", img:"public/images/quadros/CONEXAO_ENTRE_RIOS-PAKAAS-MAMORE-RONDONIA.jpg", title:"Conexão Entre Rios", loc:"Pakaas, Rio Mamoré — Rondônia", tier:"signature", price:"R$ 2.900" },
  // Collectors — 9 obras
  { id:"caminhos-agua", img:"public/images/quadros/CAMINHOS DA AGUA_VISTA-ZENITAL-LENCOIS.jpg", title:"Caminhos da Água", loc:"Lençóis Maranhenses, MA", tier:"collectors", price:"R$ 1.590" },
  { id:"el-passo", img:"public/images/quadros/EL_PASSO_SANTA_ROSA-HUAYHUASH.jpg", title:"El Passo Santa Rosa", loc:"Huayhuash, Peru", tier:"collectors", price:"R$ 1.590" },
  { id:"la-montana", img:"public/images/quadros/LA-MOTANA-VISTA-PICOMATEO.jpg", title:"La Montaña — Vista Pico Mateo", loc:"Huayhuash, Peru", tier:"collectors", price:"R$ 1.590" },
  { id:"betania-paradisiaca", img:"public/images/quadros/BETANIA PARADISIACA-LENCOIS.jpg", title:"Betânia Paradisíaca", loc:"Lençóis Maranhenses, MA", tier:"collectors", price:"R$ 1.590" },
  { id:"primeiros-minutos", img:"public/images/quadros/OS PRIMEIROS MINUTOS DO SOL-LENCOIS.jpg", title:"Os Primeiros Minutos do Sol", loc:"Lençóis Maranhenses, MA", tier:"collectors", price:"R$ 1.590" },
  { id:"camp-jahuacocha", img:"public/images/quadros/CAMP-JAHUACOCHA-HUAYHUASH.jpg", title:"Camp Jahuacocha", loc:"Huayhuash, Peru", tier:"collectors", price:"R$ 1.590" },
  { id:"observando-infinito", img:"public/images/quadros/OBSERVANDO O INFINITO-LENCOIS.jpg", title:"Observando o Infinito", loc:"Lençóis Maranhenses, MA", tier:"collectors", price:"R$ 1.590" },
  { id:"camadas-natureza", img:"public/images/quadros/CAMADAS_DA_NATUREZA-PAKAAS-MAMORE-RONDONIA.jpg", title:"Camadas da Natureza", loc:"Pakaas, Rio Mamoré — Rondônia", tier:"collectors", price:"R$ 1.590" },
  { id:"encontro-rios", img:"public/images/quadros/ENCONTR_DOS_RIOS-PAKAAS-MAMORE-RONDONIA.jpg", title:"Encontro dos Rios", loc:"Pakaas, Rio Mamoré — Rondônia", tier:"collectors", price:"R$ 1.590" },
  // Open — 7 obras
  { id:"a-casa", img:"public/images/quadros/A CASA-LENCOIS.jpg", title:"A Casa", loc:"Lençóis Maranhenses, MA", tier:"open", price:"R$ 650" },
  { id:"a-despedida", img:"public/images/quadros/A DESPEDIDA-LENCOIS.jpg", title:"A Despedida", loc:"Lençóis Maranhenses, MA", tier:"open", price:"R$ 650" },
  { id:"marcas-passado", img:"public/images/quadros/MARCAS DO PASSADO-LENCOIS.jpg", title:"Marcas do Passado", loc:"Lençóis Maranhenses, MA", tier:"open", price:"R$ 650" },
  { id:"betania-fala", img:"public/images/quadros/BETANIA FALA-LENCOIS.jpg", title:"Betânia Fala", loc:"Lençóis Maranhenses, MA", tier:"open", price:"R$ 650" },
  { id:"observadora-arara", img:"public/images/quadros/A-OBSERVADORA-ARARA-CANINDE-RONDONIA.jpg", title:"A Observadora — Arara-Canindé", loc:"Rondônia", tier:"open", price:"R$ 650" },
  { id:"gashpapampa", img:"public/images/quadros/ACAMPAMENTO_GASHPAPAMPA-HUAYHUASH.jpg", title:"Acampamento Gashpapampa", loc:"Huayhuash, Peru", tier:"open", price:"R$ 650" },
  { id:"encontro-rios-2", img:"public/images/quadros/ENCONTR_DOS_RIOS-PAKAAS-MAMORE-RONDONIA2.jpg", title:"Encontro dos Rios II", loc:"Pakaas, Rio Mamoré — Rondônia", tier:"open", price:"R$ 650" },
];
const TIER_META = {
  signature:{ label:"Signature Collection", limit:"Edição limitada — 10 prints", bg:"#5C1E1E", color:"#F5EDD6" },
  collectors:{ label:"Collectors Edition", limit:"Edição limitada — 25 prints", bg:"#1A2B4A", color:"#C8D8F0" },
  open:{ label:"Open Edition", limit:"Sem limite de tiragem", bg:"#1A2E1A", color:"#B8D4B8" },
};
function QuadrosPage(){
  return (
    <main style={{background:"var(--canvas)",color:"var(--bark)",fontFamily:"var(--font-ui)",minHeight:"100vh"}}>
      <SiteNav dark={false} />
      <header style={{position:"relative",minHeight:"70vh",display:"flex",alignItems:"flex-end",overflow:"hidden"}}>
        <img src="public/images/quadros/2 CAMADAS DE BELEZA-LENCOIS.jpg" alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.3) 60%,rgba(0,0,0,.1) 100%)"}} />
        <div style={{position:"relative",zIndex:2,padding:"0 56px 64px",width:"100%"}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(255,255,255,.6)",marginBottom:16}}>№ 04 · Fine Art Prints · Assinados & Numerados</div>
          <h1 style={{margin:0,lineHeight:0.9}}>
            <span style={{fontFamily:"var(--font-hand)",fontSize:54,color:"var(--rust)",transform:"rotate(-2deg)",display:"inline-block",marginBottom:6}}>para a sua parede—</span>
            <br />
            <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:"clamp(72px,14vw,180px)",letterSpacing:"-.05em",lineHeight:0.86,display:"block",textTransform:"uppercase",color:"#fff"}}>QUADROS.</span>
          </h1>
          <p style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontWeight:300,fontSize:18,color:"rgba(255,255,255,.75)",marginTop:28,maxWidth:"52ch",lineHeight:1.65}}>
            Três níveis de acabamento. 22 obras. Impressão assinada à mão com certificado de autenticidade.
          </p>
        </div>
      </header>
      <div style={{padding:"64px 56px"}}>
        <div className="qgrid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
          {QUADROS.map(p=>{
            const m = TIER_META[p.tier];
            return (
              <article key={p.id} style={{display:"flex",flexDirection:"column",background:"var(--canvas)",border:"1px solid var(--line)"}}>
                <div style={{position:"relative",background:"var(--canvas-deep)"}}>
                  <div style={{position:"absolute",top:12,left:12,zIndex:2,padding:"4px 10px",background:m.bg,color:m.color,fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".2em",textTransform:"uppercase",fontWeight:600}}>{m.limit}</div>
                  <div style={{padding:"20px 20px 24px"}}>
                    <div style={{background:"#1A1612",padding:8,boxShadow:"0 10px 28px rgba(0,0,0,.3)",aspectRatio:"4/3"}}>
                      <div style={{padding:4,background:"#F0EBE0",height:"100%"}}>
                        <img src={p.img} alt={p.title} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} loading="lazy" />
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{padding:"16px 18px 20px",display:"flex",flexDirection:"column",flex:1,gap:12}}>
                  <div>
                    <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"var(--stone)",marginBottom:4}}>{p.loc}</div>
                    <h3 style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:17,letterSpacing:"-.02em",margin:0,color:"var(--bark)"}}>{p.title}</h3>
                  </div>
                  <div style={{marginTop:"auto",paddingTop:12,borderTop:"1px dashed var(--line)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".15em",textTransform:"uppercase",color:"var(--stone)"}}>a partir de</div>
                      <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:22,letterSpacing:"-.02em",color:"var(--bark)"}}>{p.price}</div>
                    </div>
                    <button style={{padding:"10px 18px",background:"var(--bark)",color:"var(--canvas)",border:"none",fontFamily:"var(--font-ui)",fontSize:10,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",cursor:"pointer"}}>Encomendar →</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <style>{`@media(max-width:1060px){.qgrid{grid-template-columns:1fr 1fr!important}}@media(max-width:620px){.qgrid{grid-template-columns:1fr!important}}`}</style>
      </div>
      <SiteFooter dark={false} />
    </main>
  );
}

// ── ROUTES ────────────────────────────────────────────────────────
const ROUTES = {
  "/": HomePage,
  "/portfolio": PortfolioPage,
  "/presets": PresetsPage,
  "/expedicoes": ExpedicoesPage,
  "/quadros": QuadrosPage,
  "/sobre": SobrePage,
  "/contato": ContatoPage,
  "/midiakit": (props)=> {
    const C = window.MidiakitPage;
    return C ? <C {...props} /> : <div style={{padding:80,fontFamily:"sans-serif"}}>Loading…</div>;
  },
  "/presets/fotografia": (props)=> {
    const C = window.PresetsFotografiaPage;
    return C ? <C {...props} /> : <div style={{padding:80,fontFamily:"sans-serif"}}>Loading…</div>;
  },
  "/expedicoes/lencois": (props)=> {
    const C = window.LencoisPage;
    return C ? <C {...props} /> : <div style={{padding:80,fontFamily:"sans-serif"}}>Loading…</div>;
  },
};

function App(){
  const [path, setPath] = useState(window.location.hash.replace("#","") || "/");
  useEffect(()=>{
    const onHash = ()=> setPath(window.location.hash.replace("#","") || "/");
    window.addEventListener("hashchange", onHash);
    return ()=> window.removeEventListener("hashchange", onHash);
  },[]);
  const nav = (p)=>{
    window.location.hash = p;
    window.scrollTo(0,0);
  };
  // pick best matching route
  let Page = ROUTES[path];
  if(!Page){
    const match = Object.keys(ROUTES).find(r=> r!=="/" && path.startsWith(r));
    Page = match ? ROUTES[match] : HomePage;
  }
  return (
    <RouterCtx.Provider value={{ path, nav }}>
      <div data-screen-label={path === "/" ? "Home" : path.replace("/","")}>
        <Page />
      </div>
    </RouterCtx.Provider>
  );
}

// expose for cross-script use (midiakit.jsx etc)
Object.assign(window, { SiteNav, SiteFooter, Link, useRouter });

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
