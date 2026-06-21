// OUTDOOR GRAIN PRESETS â film-emulation LP Â· "quiet tech" dark lab aesthetic
const { useState, useRef, useEffect, useCallback } = React;
const IMG = (k) => `/images/odg-opt/${k}.jpg`;

/* âââââââââââ DADOS âââââââââââ */
const TOTAL = 21;

// presets with image keys where we have real edits
const P = {
  basecamp:   { n:"Basecamp",        img:"01-basecamp",        raw:"01-basecamp-raw" },
  highsun:    { n:"High Sun",        img:"05-high-sun",        raw:"05-high-sun-raw" },
  golden:     { n:"Golden Light",    img:"07-golden-light" },
  earth:      { n:"Earth & Rock",    img:"08-earth-rock",      raw:"08-earth-rock-raw" },
  fog:        { n:"Fog & Mist",      img:"12-fog-mist",        raw:"12-fog-mist-raw" },
  analog:     { n:"Analog Snap",     img:"14-analog-snap" },
  silhouette: { n:"Silhouette",      img:"15-silhouette" },
  granite:    { n:"Granite (B&W)",   img:"16-granite-bw",      raw:"16-granite-bw-raw" },
  aerial:     { n:"Aerial Punch",    img:"19-aerial-punch",    raw:"19-aerial-punch-raw" },
  expired:    { n:"Expired Emulsion",img:"21-expired-emulsion",raw:"21-expired-emulsion-raw" },
};

// item = [num, name, desc, afterKey, rawKey]
const BLOCKS = [
  { id:"B1", code:"BLK_01", title:"Essencial & Documental", sub:"Arquivos base para o fluxo de expediÃ§Ã£o.", items:[
    ["01","Basecamp","O coringa do dia a dia. Cores orgÃ¢nicas, contraste editorial e grÃ£o equilibrado.","01-basecamp","01-basecamp-raw"],
    ["02","Expedition","Densidade nas sombras e luz extra â ideal para grandes fotos de aproximaÃ§Ã£o.","02-expedition","02-expedition-raw"],
    ["03","Vivid Trail","Devolve a forÃ§a das cores em dias cinzentos sem deixar a vegetaÃ§Ã£o plÃ¡stica.","03-vivid-trail","03-vivid-trail-raw"],
    ["04","Clean Slate","Visual limpo, transiÃ§Ã£o suave para segurar as altas-luzes de forma orgÃ¢nica.","04-clean-slate","04-clean-slate-raw"],
  ]},
  { id:"B2", code:"BLK_02", title:"Luz Extrema & Clima Sol", sub:"RecuperaÃ§Ã£o para a luz dura da montanha.", items:[
    ["05","High Sun","Achata o contraste agressivo do sol de meio-dia e neutraliza sombras azuladas.","05-high-sun","05-high-sun-raw"],
    ["06","Human Scale","MantÃ©m os tons de pele reais e orgÃ¢nicos, mesmo sob luz ruim no acampamento.","06-human-scale","06-human-scale-raw"],
    ["18","Glacier Highlight","Salva a exposiÃ§Ã£o em reflexo extremo (neve, gelo) sem amarelar o branco.","18-glacier-highlight","18-glacier-highlight-raw"],
  ]},
  { id:"B3", code:"BLK_03", title:"Tons Terrosos & Fim de Tarde", sub:"Luz de golden hour e texturas minerais.", items:[
    ["07","Golden Light","O aquecimento clÃ¡ssico e sutil para a luz de fim de tarde na trilha.","07-golden-light","07-golden-light-raw"],
    ["08","Earth & Rock","Acentua o micro-contraste e os tons minerais â laranjas e marrons da rocha nua.","08-earth-rock","08-earth-rock-raw"],
    ["09","Warm Fade","Visual de revista. Contraste rebaixado nas altas-luzes com sombras quentes.","09-warm-fade","09-warm-fade-raw"],
  ]},
  { id:"B4", code:"BLK_04", title:"Clima Hostil & Luz Baixa", sub:"Perrengue, penumbra e neblina.", items:[
    ["10","Blue Hour","Segura a onda na penumbra. RetÃ©m o amanhecer/anoitecer sem estourar o ruÃ­do.","10-blue-hour","10-blue-hour-raw"],
    ["11","Heavy Weather","GrÃ£o denso e visual fechado para documentar chuva, tempestade e clima hostil.","11-heavy-weather","11-heavy-weather-raw"],
    ["12","Fog & Mist","Corta o aspecto leitoso da neblina e devolve o contraste para arquivos lavados.","12-fog-mist","12-fog-mist-raw"],
  ]},
  { id:"B5", code:"BLK_05", title:"Editorial & GrÃ¡fica", sub:"Alto impacto e imperfeiÃ§Ãµes analÃ³gicas.", items:[
    ["13","Cinematic Wash","Sombras com fade profundo, paleta do documentÃ¡rio independente.","13-cinematic-wash","13-cinematic-wash-raw"],
    ["14","Analog Snap","A estÃ©tica crua de point-and-shoot para b-roll e fotos de equipamento.","14-analog-snap","14-analog-snap-raw"],
    ["15","Silhouette","Pretos esmagados para destacar sÃ³ as formas grÃ¡ficas de montanhas e vales.","15-silhouette","15-silhouette-raw"],
    ["20","Trail Memory","Visual nostÃ¡lgico com leves desvios de cor para fotos de lifestyle.","20-trail-memory","20-trail-memory-raw"],
    ["21","Expired Emulsion","Filme destruÃ­do. GrÃ£o severo, contraste melancÃ³lico e desvio quÃ­mico agressivo.","21-expired-emulsion","21-expired-emulsion-raw"],
  ]},
  { id:"B6", code:"BLK_06", title:"P&B & CalibraÃ§Ã£o AÃ©rea", sub:"MonocromÃ¡tico pesado e alinhamento de sensor.", items:[
    ["16","Granite (B&W)","Preto e branco agressivo nos meios-tons â feito para explodir a textura da rocha.","16-granite-bw","16-granite-bw-raw"],
    ["17","Alpine Silver (B&W)","Preto e branco suave, cinzas ricos. Perfeito para retratos e neblina.","17-alpine-silver","17-alpine-silver-raw"],
    ["19","Aerial Punch","Contraste e saturaÃ§Ã£o para nivelar arquivos de drone com os RAWs da cÃ¢mera.","19-aerial-punch","19-aerial-punch-raw"],
  ]},
];

const FAQ = [
  ["01","Formato & instalaÃ§Ã£o","Os arquivos vÃªm em .xmp (Lightroom / Camera Raw) e .dng (Lightroom Mobile). ImportaÃ§Ã£o por 'Adicionar predefiniÃ§Ãµes'. Manual de instalaÃ§Ã£o em PDF incluso no .zip."],
  ["02","Compatibilidade","Lightroom Classic, Lightroom CC (desktop + mobile) e Adobe Camera Raw. NÃ£o dependem de assinatura â uma vez instalados, sÃ£o seus."],
  ["03","RAW vs JPEG","Calibrados em arquivos RAW de expediÃ§Ã£o (Sony A7 IV / DJI). Funcionam em JPEG, mas a margem de recuperaÃ§Ã£o de altas-luzes e sombras Ã© menor."],
  ["04","Drone & cÃ¢mera no mesmo set","O bloco de CalibraÃ§Ã£o AÃ©rea (19) foi desenhado para nivelar arquivos DNG de drone com os RAWs da cÃ¢mera principal â cor consistente no mesmo carretel."],
  ["05","Cada foto fica idÃªntica?","NÃ£o. Preset Ã© ponto de partida, nÃ£o filtro fixo. ExposiÃ§Ã£o e WB do seu arquivo mudam o resultado â por isso o pack traz 21 variaÃ§Ãµes para cada condiÃ§Ã£o."],
  ["06","AtualizaÃ§Ãµes","VitalÃ­cias e sem custo. Novas versÃµes do pack entram na mesma pasta de download."],
];

/* âââââââââââ PRIMITIVOS âââââââââââ */
function Tick({label}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:9}}>
      <span style={{width:6,height:6,background:"var(--amber)",borderRadius:"50%",flexShrink:0}} />
      <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"var(--ink-3)"}}>{label}</span>
    </div>
  );
}

function Corner({children, style}){
  // panel with brutalist corner ticks
  return (
    <div style={{position:"relative",border:"1px solid var(--line)",background:"var(--panel)",...style}}>
      <span style={cTick("tl")} /><span style={cTick("tr")} /><span style={cTick("bl")} /><span style={cTick("br")} />
      {children}
    </div>
  );
}
const cTick = (pos)=>{
  const s={position:"absolute",width:7,height:7,borderColor:"var(--amber)",borderStyle:"solid",pointerEvents:"none"};
  if(pos==="tl")return{...s,top:-1,left:-1,borderWidth:"1px 0 0 1px"};
  if(pos==="tr")return{...s,top:-1,right:-1,borderWidth:"1px 1px 0 0"};
  if(pos==="bl")return{...s,bottom:-1,left:-1,borderWidth:"0 0 1px 1px"};
  return{...s,bottom:-1,right:-1,borderWidth:"0 1px 1px 0"};
};

/* Before/After â arrasta pra revelar. Rotula ORIGINAL vs nome do preset. */
function BeforeAfter({afterImg, beforeImg, presetName, autoplay=false, ratio="3 / 2", rounded=false}){
  const [pos,setPos]=useState(autoplay?50:55);
  const [live,setLive]=useState(autoplay);
  const wrap=useRef(null), drag=useRef(false), raf=useRef(0);
  const moveTo=(clientX)=>{ const el=wrap.current; if(!el)return; const r=el.getBoundingClientRect();
    setPos(Math.max(3,Math.min(97,((clientX-r.left)/r.width)*100))); };
  // autoplay sweep
  useEffect(()=>{
    if(!live) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduce){ setPos(50); return; }
    let t0=null; const PERIOD=9000;
    const tick=(t)=>{ if(t0==null)t0=t; const e=(t-t0)%PERIOD; const a=e/PERIOD;
      const v=50 - Math.cos(a*2*Math.PI)*34; setPos(v); raf.current=requestAnimationFrame(tick); };
    raf.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(raf.current);
  },[live]);
  const stop=()=>{ if(live){ setLive(false); cancelAnimationFrame(raf.current);} };
  return (
    <div ref={wrap}
      onPointerDown={e=>{drag.current=true;stop();moveTo(e.clientX);e.currentTarget.setPointerCapture(e.pointerId);}}
      onPointerMove={e=>{if(drag.current)moveTo(e.clientX);}}
      onPointerUp={()=>{drag.current=false;}}
      style={{position:"relative",width:"100%",aspectRatio:ratio,overflow:"hidden",background:"#000",
        cursor:"ew-resize",touchAction:"none",userSelect:"none",borderRadius:rounded?2:0}}>
      {/* AFTER (preset) base */}
      <img src={IMG(afterImg)} alt={presetName} draggable={false}
        style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",pointerEvents:"none"}} />
      {/* BEFORE (original) clipped left */}
      <img src={IMG(beforeImg)} alt="Original" draggable={false}
        style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",
          clipPath:`inset(0 ${100-pos}% 0 0)`,filter:"saturate(.96)",pointerEvents:"none"}} />
      {/* divider */}
      <div style={{position:"absolute",top:0,bottom:0,left:`${pos}%`,width:1,background:"rgba(255,255,255,.7)",pointerEvents:"none"}} />
      <div style={{position:"absolute",top:"50%",left:`${pos}%`,transform:"translate(-50%,-50%)",
        width:34,height:34,borderRadius:"50%",border:"1px solid rgba(255,255,255,.85)",background:"rgba(10,10,11,.35)",
        backdropFilter:"blur(2px)",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
        <span style={{fontFamily:"var(--mono)",fontSize:13,color:"#fff"}}>â</span>
      </div>
      {/* labels */}
      <span style={baLbl("left")}>ORIGINAL Â· RAW</span>
      <span style={{...baLbl("right"),background:"var(--amber)",color:"#0a0a0b",borderColor:"var(--amber)"}}>ODG Â· {presetName}</span>
      {live && <span style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",fontFamily:"var(--mono)",fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.7)",background:"rgba(10,10,11,.5)",padding:"3px 9px",pointerEvents:"none"}}>arraste pra comparar</span>}
    </div>
  );
}
const baLbl=(side)=>({position:"absolute",top:12,[side]:12,fontFamily:"var(--mono)",fontSize:9.5,
  letterSpacing:".14em",textTransform:"uppercase",color:"var(--ink)",background:"rgba(10,10,11,.62)",
  border:"1px solid var(--line-2)",padding:"4px 9px",pointerEvents:"none"});

/* spec row for ficha tÃ©cnica */
function Spec({k,v,accent}){
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:16,padding:"11px 0",borderBottom:"1px solid var(--line)"}}>
      <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"var(--ink-3)"}}>{k}</span>
      <span style={{fontFamily:"var(--mono)",fontSize:12.5,color:accent?"var(--amber-soft)":"var(--ink)",textAlign:"right"}}>{v}</span>
    </div>
  );
}

/* section heading */
function Head({code,kicker,title,accent,style}){
  return (
    <div style={{marginBottom:34,...style}}>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
        <span style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:".24em",color:"var(--amber)"}}>{code}</span>
        <span style={{height:1,flex:1,maxWidth:64,background:"var(--line-2)"}} />
        <span style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:".24em",textTransform:"uppercase",color:"var(--ink-3)"}}>{kicker}</span>
      </div>
      <h2 style={{margin:0,fontFamily:"var(--sans)",fontWeight:600,fontSize:"clamp(28px,4.4vw,52px)",lineHeight:1.02,letterSpacing:"-.02em",color:"var(--ink)",textWrap:"balance"}}>{title}</h2>
    </div>
  );
}

const SECTION = {maxWidth:1200,margin:"0 auto",padding:"clamp(64px,9vw,128px) clamp(20px,5vw,56px)"};

/* âââââââââââ NAV âââââââââââ */
function Nav(){
  const [s,setS]=useState(false);
  useEffect(()=>{ const f=()=>setS(window.scrollY>40); window.addEventListener("scroll",f); return ()=>window.removeEventListener("scroll",f); },[]);
  return (
    <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,
      background:s?"rgba(10,10,11,.82)":"transparent",backdropFilter:s?"blur(12px)":"none",
      borderBottom:s?"1px solid var(--line)":"1px solid transparent",transition:"all .3s"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 clamp(20px,5vw,56px)",height:62,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <a href="site.html#/presets" style={{display:"flex",alignItems:"center",gap:11,textDecoration:"none"}}>
          <span style={{width:9,height:9,border:"1px solid var(--amber)",position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{width:3,height:3,background:"var(--amber)",borderRadius:"50%"}} />
          </span>
          <span style={{fontFamily:"var(--mono)",fontSize:12,letterSpacing:".22em",color:"var(--ink)",fontWeight:500}}>OUTDOOR&nbsp;GRAIN</span>
        </a>
        <nav className="odg-navlinks" style={{display:"flex",alignItems:"center",gap:30}}>
          {[["Ficha","#ficha"],["CalibraÃ§Ã£o","#raiox"],["Log","#log"],["Arquivos","#arquivos"]].map(([t,h])=>(
            <a key={h} href={h} style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"var(--ink-3)",textDecoration:"none"}}>{t}</a>
          ))}
        </nav>
        <a href="#checkout" style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"var(--amber-soft)",textDecoration:"none",border:"1px solid var(--line-2)",padding:"9px 16px"}}>Em breve</a>
      </div>
    </header>
  );
}

/* âââââââââââ HERO âââââââââââ */
function Hero(){
  return (
    <section style={{position:"relative",minHeight:"100svh",display:"flex",flexDirection:"column",justifyContent:"flex-end",overflow:"hidden"}}>
      <img src={IMG("hero")} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 40%"}} />
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,.74) 0%,rgba(10,10,11,.18) 30%,rgba(10,10,11,.42) 64%,rgba(10,10,11,.96) 100%)"}} />
      <div style={{position:"absolute",inset:0,opacity:.5,backgroundImage:"linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px)",backgroundSize:"clamp(60px,8vw,120px) clamp(60px,8vw,120px)",maskImage:"radial-gradient(ellipse 70% 60% at 50% 45%,transparent 30%,#000 100%)",WebkitMaskImage:"radial-gradient(ellipse 70% 60% at 50% 45%,transparent 30%,#000 100%)",pointerEvents:"none"}} />

      <div style={{position:"relative",maxWidth:1200,width:"100%",margin:"0 auto",padding:"0 clamp(20px,5vw,56px) clamp(48px,7vw,88px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24,flexWrap:"wrap"}}>
          <Tick label="Film Emulation Â· LR / ACR" />
          <span style={{height:1,width:40,background:"var(--line-2)"}} />
          <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".22em",color:"var(--ink-3)"}}>v1.0 / 2026</span>
        </div>
        <h1 style={{margin:0,fontFamily:"var(--sans)",fontWeight:700,fontSize:"clamp(40px,10.5vw,128px)",lineHeight:.92,letterSpacing:"-.04em",color:"var(--ink)"}}>
          Outdoor Grain<span style={{color:"var(--amber)"}}>.</span>
        </h1>
        <p style={{margin:"22px 0 0",maxWidth:"54ch",fontFamily:"var(--sans)",fontSize:"clamp(15px,2.1vw,21px)",lineHeight:1.5,color:"var(--ink-2)"}}>
          <span style={{color:"var(--ink)"}}>{TOTAL} emulaÃ§Ãµes de filme</span> calibradas em campo â sol de meio-dia, neblina, breu e drone. O grÃ£o, o halo e a quÃ­mica do analÃ³gico. Sem laboratÃ³rio.
        </p>
        <div style={{display:"flex",flexWrap:"wrap",gap:14,marginTop:34}}>
          <a href="#checkout" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"16px 26px",background:"var(--amber)",color:"#0a0a0b",fontFamily:"var(--sans)",fontWeight:600,fontSize:14,letterSpacing:".02em",textDecoration:"none"}}>
            Em breve
          </a>
          <a href="#arquivos" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"16px 26px",border:"1px solid var(--line-2)",color:"var(--ink)",fontFamily:"var(--mono)",fontSize:12,letterSpacing:".12em",textTransform:"uppercase",textDecoration:"none",whiteSpace:"nowrap"}}>
            Ver os {TOTAL} arquivos
          </a>
        </div>
        <div className="odg-hero-meta" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginTop:"clamp(40px,6vw,72px)",border:"1px solid var(--line)",background:"var(--line)"}}>
          {[["Arquivos",TOTAL],["Formato",".xmp Â· .dng"],["Plataforma","LR Â· ACR"],["LicenÃ§a","VitalÃ­cia"]].map(([k,v])=>(
            <div key={k} style={{background:"var(--bg)",padding:"16px 18px"}}>
              <div style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"var(--ink-3)",marginBottom:7}}>{k}</div>
              <div style={{fontFamily:"var(--mono)",fontSize:15,color:"var(--ink)"}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* âââââââââââ 02 Â· FICHA TÃCNICA âââââââââââ */
function Ficha(){
  return (
    <section id="ficha" style={SECTION}>
      <Head code="REF_02" kicker="Ficha tÃ©cnica" title={<>Cada arquivo Ã© uma <span style={{color:"var(--amber)"}}>receita</span>, nÃ£o um filtro.</>} />
      <div className="odg-ficha" style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:1,border:"1px solid var(--line)",background:"var(--line)"}}>
        <div style={{background:"var(--bg)"}}>
          <BeforeAfter afterImg={P.earth.img} beforeImg={P.earth.raw} presetName="Earth & Rock" ratio="3 / 2" />
        </div>
        <div style={{background:"var(--panel)",padding:"clamp(22px,3vw,34px)",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"var(--amber)",marginBottom:6}}>ODG Â· 08</div>
          <div style={{fontFamily:"var(--sans)",fontWeight:600,fontSize:24,letterSpacing:"-.01em",marginBottom:18}}>Earth &amp; Rock</div>
          <Spec k="Equipamento" v="Sony A7 IV" />
          <Spec k="Lente" v="24mm f/4" />
          <Spec k="Preset aplicado" v="ODG Â· Earth & Rock" accent />
          <Spec k="NÃ­vel de grÃ£o" v="MÃDIO âââââ" />
          <Spec k="Aspereza" v="ALTA / mineral" accent />
          <Spec k="SaÃ­da" v=".xmp Â· nÃ£o destrutivo" />
          <p style={{margin:"18px 0 0",fontFamily:"var(--sans)",fontSize:14,lineHeight:1.55,color:"var(--ink-2)"}}>Acentua o micro-contraste e puxa os tons minerais â laranjas e marrons da rocha nua sob luz direta.</p>
        </div>
      </div>
    </section>
  );
}

/* âââââââââââ 03 Â· RAIO-X DE CALIBRAÃÃO (SOLO vs AÃREO) âââââââââââ */
function RaioX(){
  // mesmo lugar (estrada de Atacama), fontes diferentes â leitura idÃªntica prova o match
  const readout=[["WB Â· Temp","5400 K"],["WB Â· Tint","+6"],["Curva","+12 / -8"],["HSL Â· Laranja","+18 sat"],["GrÃ£o","MÃDIO"]];
  const cols=[
    {tag:"SOLO Â· RAW", src:"calib-camera", body:"CÃ¢mera Â· Sony A7 IV", code:"07 Â· Golden Light"},
    {tag:"AÃREO Â· DNG", src:"calib-drone", body:"Drone Â· DJI Air 3S", code:"07 Â· Golden Light"},
  ];
  return (
    <section id="raiox" style={{background:"var(--panel)",borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)"}}>
      <div style={SECTION}>
        <Head code="CAL_03" kicker="Raio-X de calibraÃ§Ã£o" title={<>Mesmo lugar. Sensores diferentes. <span style={{color:"var(--amber)"}}>Zero</span> desvio.</>} />
        <p style={{margin:"-14px 0 36px",maxWidth:"62ch",fontFamily:"var(--sans)",fontSize:"clamp(14px,1.8vw,17px)",lineHeight:1.6,color:"var(--ink-2)"}}>
          A mesma estrada no Atacama, fotografada do chÃ£o (A7 IV) e do ar (DJI Air 3S). Dois sensores, dois arquivos â e a <span style={{color:"var(--ink)"}}>mesma leitura de cor</span>. Ã isso que mantÃ©m um carretel misto consistente.
        </p>
        <div className="odg-raiox" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,border:"1px solid var(--line)",background:"var(--line)"}}>
          {cols.map((c)=>(
            <div key={c.tag} style={{background:"var(--bg)"}}>
              <div style={{position:"relative",aspectRatio:"3 / 2",overflow:"hidden"}}>
                <img src={IMG(c.src)} alt={c.tag} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                <span style={{position:"absolute",top:12,left:12,fontFamily:"var(--mono)",fontSize:10,letterSpacing:".16em",color:"var(--ink)",background:"rgba(10,10,11,.62)",border:"1px solid var(--line-2)",padding:"4px 9px"}}>{c.tag}</span>
                <span style={{position:"absolute",top:12,right:12,fontFamily:"var(--mono)",fontSize:9.5,letterSpacing:".12em",color:"#0a0a0b",background:"var(--amber)",padding:"4px 9px"}}>ODG Â· {c.code.split(" Â· ")[1]}</span>
              </div>
              <div style={{padding:"16px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:".06em",color:"var(--ink-2)"}}>{c.body}</span>
                <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".12em",color:"var(--ink-3)"}}>{c.code.split(" Â· ")[0]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* leitura idÃªntica â a prova em nÃºmero */}
        <div style={{marginTop:1,border:"1px solid var(--line)",borderTop:"none",background:"var(--panel-2)",padding:"18px clamp(14px,2vw,22px)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"var(--amber)"}} />
            <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"var(--ink-3)"}}>Leitura do perfil Â· idÃªntica nos dois arquivos</span>
          </div>
          <div className="odg-readout" style={{display:"grid",gridTemplateColumns:`repeat(${readout.length},1fr)`,gap:1,background:"var(--line)",border:"1px solid var(--line)"}}>
            {readout.map(([k,v])=>(
              <div key={k} style={{background:"var(--bg)",padding:"12px 14px"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:".16em",textTransform:"uppercase",color:"var(--ink-3)",marginBottom:6}}>{k}</div>
                <div style={{fontFamily:"var(--mono)",fontSize:14,color:"var(--amber-soft)"}}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:12,marginTop:18,justifyContent:"center"}}>
          <span style={{height:1,flex:1,background:"var(--line)"}} />
          <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"var(--ink-3)"}}>Î cor â nulo Â· mesmo carretel</span>
          <span style={{height:1,flex:1,background:"var(--line)"}} />
        </div>
      </div>
    </section>
  );
}

/* âââââââââââ 04 Â· LOG DE EXPEDIÃÃO (PROVA DE ESTRESSE) âââââââââââ */
function LogExp(){
  const rows=[
    { tag:"CONTRALUZ", time:"08:12", env:"ManhÃ£ Â· sol baixo, contra a luz", preset:"High Sun", a:P.highsun.img, b:P.highsun.raw, note:"RealÃ§a as altas-luzes e o brilho do sol da manhÃ£ sem estourar â segura o contraluz e mantÃ©m o calor da cena." },
    { tag:"NEBLINA", time:"06:51", env:"NÃ©voa densa Â· arquivo lavado", preset:"Fog & Mist", a:P.fog.img, b:P.fog.raw, note:"Aspecto leitoso cortado. Contraste devolvido sem inventar detalhe que nÃ£o existe." },
  ];
  return (
    <section id="log" style={SECTION}>
      <Head code="LOG_04" kicker="Log de expediÃ§Ã£o" title={<>Provado onde <span style={{color:"var(--amber)"}}>quebra</span>.</>} />
      <div style={{display:"flex",flexDirection:"column",gap:1,border:"1px solid var(--line)",background:"var(--line)"}}>
        {rows.map((r,i)=>(
          <div key={i} className="odg-log-row" style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:1,background:"var(--line)"}}>
            <div style={{background:"var(--bg)"}}>
              <BeforeAfter afterImg={r.a} beforeImg={r.b} presetName={r.preset} ratio="16 / 10" />
            </div>
            <div style={{background:"var(--panel)",padding:"clamp(20px,2.6vw,30px)",display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".16em",color:"#0a0a0b",background:"var(--safelight)",padding:"3px 9px"}}>{r.tag}</span>
                <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-3)"}}>T+{r.time}</span>
              </div>
              <Spec k="CondiÃ§Ã£o" v={r.env} />
              <Spec k="Arquivo" v={`ODG Â· ${r.preset}`} accent />
              <p style={{margin:"16px 0 0",fontFamily:"var(--sans)",fontSize:14,lineHeight:1.55,color:"var(--ink-2)"}}>{r.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* âââââââââââ 05 Â· OS 21 ARQUIVOS â carretel completo (master-detail) âââââââââââ */
const ALL_PRESETS = BLOCKS.flatMap(b => b.items.map(it => ({ num:it[0], name:it[1], desc:it[2], after:it[3], raw:it[4], blk:b.code, blkTitle:b.title })));

function Arquivos(){
  const [sel,setSel]=useState(ALL_PRESETS[0]);
  return (
    <section id="arquivos" style={{background:"var(--panel)",borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)"}}>
      <div style={SECTION}>
        <Head code="IDX_05" kicker={`${TOTAL} arquivos Â· 6 blocos`} title={<>O carretel <span style={{color:"var(--amber)"}}>completo</span>.</>} />
        <p style={{margin:"-14px 0 32px",maxWidth:"58ch",fontFamily:"var(--sans)",fontSize:"clamp(14px,1.8vw,17px)",lineHeight:1.6,color:"var(--ink-2)"}}>
          Toque em qualquer arquivo abaixo e <span style={{color:"var(--ink)"}}>arraste pra comparar</span> o RAW original com a versÃ£o tratada.
        </p>

        {/* VISOR â before/after do preset selecionado */}
        <div style={{border:"1px solid var(--line)",background:"var(--bg)"}}>
          <BeforeAfter key={sel.num} afterImg={sel.after} beforeImg={sel.raw} presetName={sel.name} ratio="16 / 10" autoplay />
          <div className="odg-arq-cap" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:18,padding:"16px clamp(16px,2.2vw,24px)",borderTop:"1px solid var(--line)",flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"baseline",gap:14,minWidth:0}}>
              <span style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:".18em",color:"var(--amber)",flexShrink:0}}>ODG Â· {sel.num}</span>
              <span style={{fontFamily:"var(--sans)",fontWeight:600,fontSize:"clamp(17px,2.2vw,22px)",color:"var(--ink)",letterSpacing:"-.01em"}}>{sel.name}</span>
            </div>
            <p style={{margin:0,fontFamily:"var(--sans)",fontSize:13.5,lineHeight:1.45,color:"var(--ink-3)",maxWidth:"52ch"}}>{sel.desc}</p>
          </div>
        </div>

        {/* FILM ROLL â 21 frames num Ãºnico carretel horizontal */}
        <div style={{marginTop:26}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"var(--ink-3)"}}>Carretel Â· {TOTAL} frames</span>
            <span style={{height:1,flex:1,background:"var(--line)"}} />
            <span className="odg-roll-hint" style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"var(--ink-4)"}}>â role o filme</span>
          </div>
          <div className="odg-roll">
            <div className="odg-perf" />
            <div className="odg-roll-track">
              {ALL_PRESETS.map(p=>{
                const on=sel.num===p.num;
                return (
                  <button key={p.num} className="odg-frame" data-on={on?"1":"0"} onClick={()=>setSel(p)} aria-label={`${p.num} ${p.name}`}>
                    <div className="odg-frame-img">
                      <img src={IMG(p.after+'-thumb')} alt={p.name} loading="lazy" />
                      <span className="odg-frame-num">{p.num}</span>
                    </div>
                    <span className="odg-frame-cap">{p.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="odg-perf" />
          </div>
        </div>

        <style>{`
          .odg-roll{position:relative;background:#141416;border:1px solid var(--line)}
          .odg-perf{height:15px;background-image:radial-gradient(circle at center, #000 0 3.2px, transparent 3.6px);background-size:21px 15px;background-position:center;opacity:.85}
          .odg-roll-track{display:flex;gap:2px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x proximity;padding:9px;background:#0d0d0e;-webkit-overflow-scrolling:touch}
          .odg-roll-track::-webkit-scrollbar{height:5px}
          .odg-roll-track::-webkit-scrollbar-track{background:#141416}
          .odg-roll-track::-webkit-scrollbar-thumb{background:var(--line-2)}
          .odg-roll-track::-webkit-scrollbar-thumb:hover{background:var(--amber)}
          .odg-frame{flex-shrink:0;width:138px;scroll-snap-align:center;appearance:none;border:none;background:none;cursor:pointer;padding:0;display:flex;flex-direction:column;gap:6px}
          .odg-frame-img{position:relative;aspect-ratio:3 / 2;overflow:hidden;outline:1px solid var(--line);outline-offset:-1px;transition:outline-color .2s}
          .odg-frame-img img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.85) brightness(.62);transition:filter .25s,transform .35s}
          .odg-frame-num{position:absolute;top:0;left:0;font-family:var(--mono);font-size:8.5px;letter-spacing:.05em;color:var(--ink-2);background:rgba(10,10,11,.72);padding:2px 5px}
          .odg-frame-cap{font-family:var(--mono);font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-4);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .2s}
          .odg-frame:hover .odg-frame-img img{filter:saturate(.95) brightness(.82)}
          .odg-frame:hover .odg-frame-cap{color:var(--ink-3)}
          .odg-frame[data-on="1"] .odg-frame-img{outline:2px solid var(--amber);outline-offset:-2px}
          .odg-frame[data-on="1"] .odg-frame-img img{filter:none}
          .odg-frame[data-on="1"] .odg-frame-num{color:#0a0a0b;background:var(--amber)}
          .odg-frame[data-on="1"] .odg-frame-cap{color:var(--amber-soft)}
          @media(max-width:600px){ .odg-frame{width:118px} .odg-roll-hint{display:none} }
        `}</style>
      </div>
    </section>
  );
}

/* âââââââââââ 06 Â· FAQ + RODAPÃ TÃTICO âââââââââââ */
function FaqFooter(){
  const [open,setOpen]=useState(0);
  return (
    <React.Fragment>
      <section id="faq" style={SECTION}>
        <Head code="MAN_06" kicker="Manual tÃ©cnico" title="Antes de instalar." />
        <div style={{border:"1px solid var(--line)"}}>
          {FAQ.map(([num,q,a],i)=>{
            const isOpen=open===i;
            return (
              <div key={num} style={{borderBottom:i<FAQ.length-1?"1px solid var(--line)":"none"}}>
                <button onClick={()=>setOpen(isOpen?-1:i)} style={{width:"100%",appearance:"none",border:"none",background:"transparent",cursor:"pointer",textAlign:"left",padding:"20px clamp(18px,2.4vw,28px)",display:"flex",alignItems:"center",gap:18}}>
                  <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--amber)",flexShrink:0}}>{num}</span>
                  <span style={{fontFamily:"var(--sans)",fontWeight:500,fontSize:"clamp(14px,1.9vw,18px)",color:"var(--ink)",flex:1}}>{q}</span>
                  <span style={{fontFamily:"var(--mono)",fontSize:13,color:"var(--ink-3)",transform:isOpen?"rotate(45deg)":"none",transition:"transform .2s"}}>+</span>
                </button>
                {isOpen && <p style={{margin:0,padding:"0 clamp(18px,2.4vw,28px) 22px 56px",maxWidth:"72ch",fontFamily:"var(--sans)",fontSize:14.5,lineHeight:1.6,color:"var(--ink-2)"}}>{a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section id="checkout" style={{position:"relative",overflow:"hidden",borderTop:"1px solid var(--line)",background:"var(--bg)"}}>
        <img src={IMG("bg-texture")} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,.92) 0%,rgba(10,10,11,.84) 50%,rgba(10,10,11,.94) 100%),radial-gradient(120% 90% at 100% 100%,rgba(10,10,11,.96) 0%,rgba(10,10,11,0) 45%)"}} />
        <div style={{position:"relative",maxWidth:1200,margin:"0 auto",padding:"clamp(64px,9vw,120px) clamp(20px,5vw,56px)"}}>
          <Corner style={{padding:"clamp(32px,5vw,64px)",background:"var(--panel)"}}>
            <div className="odg-cta" style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:"clamp(32px,5vw,64px)",alignItems:"center"}}>
              <div>
                <Tick label="Pack completo Â· lanÃ§amento" />
                <h2 style={{margin:"18px 0 0",fontFamily:"var(--sans)",fontWeight:700,fontSize:"clamp(30px,4.6vw,56px)",lineHeight:1,letterSpacing:"-.03em"}}>
                  {TOTAL} filmstocks.<br/><span style={{color:"var(--amber)"}}>Um</span> carretel.
                </h2>
                <p style={{margin:"20px 0 0",maxWidth:"46ch",fontFamily:"var(--sans)",fontSize:15,lineHeight:1.55,color:"var(--ink-2)"}}>
                  Sol, neblina, breu e drone â calibrados em expediÃ§Ã£o real. .xmp + .dng, licenÃ§a vitalÃ­cia, atualizaÃ§Ãµes sem custo.
                </p>
              </div>
              <div>
                <div style={{display:"flex",flexDirection:"column",gap:1,background:"var(--line)",border:"1px solid var(--line)",marginBottom:22}}>
                  {[["Arquivos",`${TOTAL} presets`],["Formato",".xmp Â· .dng"],["CompatÃ­vel","LR Classic Â· CC Â· ACR"],["LicenÃ§a","Pessoal + comercial"]].map(([k,v])=>(
                    <div key={k} style={{background:"var(--bg)",display:"flex",justifyContent:"space-between",padding:"11px 16px"}}>
                      <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".16em",textTransform:"uppercase",color:"var(--ink-3)"}}>{k}</span>
                      <span style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--ink)"}}>{v}</span>
                    </div>
                  ))}
                </div>
                <a href="#" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"17px",background:"var(--amber)",color:"#0a0a0b",fontFamily:"var(--sans)",fontWeight:600,fontSize:14,letterSpacing:".02em",textDecoration:"none"}}>
                  Em breve
                </a>
                <div style={{textAlign:"center",marginTop:11,fontFamily:"var(--mono)",fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--ink-3)"}}>LanÃ§amento em breve Â· entre na lista sem custo</div>
              </div>
            </div>
          </Corner>
        </div>
      </section>

      <footer style={{borderTop:"1px solid var(--line)",background:"var(--bg)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"48px clamp(20px,5vw,56px)"}}>
          <div className="odg-foot" style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr",gap:32,alignItems:"start"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:14}}>
                <span style={{width:9,height:9,border:"1px solid var(--amber)",display:"inline-flex",alignItems:"center",justifyContent:"center"}}><span style={{width:3,height:3,background:"var(--amber)",borderRadius:"50%"}} /></span>
                <span style={{fontFamily:"var(--mono)",fontSize:12,letterSpacing:".22em",color:"var(--ink)"}}>OUTDOOR&nbsp;GRAIN</span>
              </div>
              <p style={{margin:0,maxWidth:"38ch",fontFamily:"var(--sans)",fontSize:13.5,lineHeight:1.55,color:"var(--ink-3)"}}>EmulaÃ§Ãµes de filme para fotografia de outdoor e expediÃ§Ã£o. Calibradas em campo por Henrique Sesana.</p>
            </div>
            <div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"var(--ink-3)",marginBottom:14}}>Specs</div>
              {[["FORMATO",".xmp Â· .dng Â· .cube"],["PLATAFORMA","LR Â· ACR Â· Mobile"],["VERSÃO","1.0 / 2026"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontFamily:"var(--mono)",fontSize:11}}>
                  <span style={{color:"var(--ink-3)"}}>{k}</span><span style={{color:"var(--ink-2)"}}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"var(--ink-3)",marginBottom:14}}>Contato</div>
              <a href="mailto:contato@euhenriq.com" style={{display:"block",fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-2)",textDecoration:"none",padding:"6px 0"}}>contato@euhenriq.com</a>
              <a href="https://instagram.com/euhenriq" target="_blank" rel="noopener noreferrer" style={{display:"block",fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-2)",textDecoration:"none",padding:"6px 0"}}>@euhenriq</a>
            </div>
          </div>
          <div style={{marginTop:40,paddingTop:20,borderTop:"1px solid var(--line)",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".14em",color:"var(--ink-4)"}}>Â© 2026 EU HENRIQ â TODOS OS DIREITOS RESERVADOS</span>
            <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".14em",color:"var(--ink-4)"}}>23Â°33â²S Â· 46Â°38â²W Â· ALT 760M</span>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}

/* âââââââââââ 4.5 Â· A ORIGEM (MANIFESTO) âââââââââââ */
function Origem(){
  const lineage=[
    { stocks:["Kodak Portra","Fuji Pro 400H"], title:"A heranÃ§a documental",
      body:"Mata o aspecto nÃ­tido e artificial do sensor moderno. Corrige os verdes radioativos da vegetaÃ§Ã£o para um oliva e ciano contido â e devolve tons de pele orgÃ¢nicos.",
      maps:"Blocos 01â04 Â· Essencial & Documental" },
    { stocks:["Kodak Gold","UltraMax"], title:"O calor do 35 mm",
      body:"SimulaÃ§Ãµes de filme de consumo para golden hour e lifestyle: a nostalgia, os desvios quÃ­micos e o contraste tÃ¡til de acampamento e equipamento.",
      maps:"Blocos 07â09 Â· 13â15 Â· 20â21" },
    { stocks:["Ilford HP5","Cinema stock"], title:"Textura P&B & cinema",
      body:"Para clima hostil, neblina e alta montanha: estrutura de grÃ£o Ã¡spero e densidades de sombra lavada, focadas em explodir o micro-contraste na rocha nua.",
      maps:"Blocos 10â12 Â· 16â17 Â· P&B" },
  ];
  return (
    <section id="origem" style={{position:"relative",overflow:"hidden",borderTop:"1px solid var(--line)"}}>
      <img src={IMG("bg-manifesto")} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 30%"}} />
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,10,11,.88) 0%,rgba(10,10,11,.80) 45%,rgba(10,10,11,.92) 100%),radial-gradient(120% 90% at 100% 100%,rgba(10,10,11,.96) 0%,rgba(10,10,11,0) 45%)"}} />
      <div style={{position:"relative",...SECTION}}>
        <Head code="DOC_00" kicker="Sobre o pack" title={<>Do laboratÃ³rio <span style={{color:"var(--amber)"}}>para a trilha</span>.</>} />
        <p style={{margin:"-14px 0 14px",maxWidth:"66ch",fontFamily:"var(--sans)",fontSize:"clamp(15px,2vw,19px)",lineHeight:1.6,color:"var(--ink)"}}>
          O ODG nÃ£o nasceu de saturaÃ§Ã£o aleatÃ³ria nem de filtro genÃ©rico. A arquitetura cruza duas realidades: a <span style={{color:"var(--amber-soft)"}}>engenharia de cor das pelÃ­culas analÃ³gicas</span> e as dores tÃ©cnicas de documentar uma expediÃ§Ã£o real.
        </p>
        <p style={{margin:"0 0 40px",maxWidth:"66ch",fontFamily:"var(--sans)",fontSize:"clamp(13px,1.6vw,15px)",lineHeight:1.6,color:"var(--ink-3)"}}>
          Cada bloco tem raiz no comportamento fÃ­sico do filme â mapeado, nÃ£o imitado.
        </p>
        <div className="odg-lineage" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,border:"1px solid var(--line)",background:"var(--line)"}}>
          {lineage.map((l,i)=>(
            <div key={i} style={{background:"rgba(18,18,20,.86)",backdropFilter:"blur(2px)",padding:"clamp(22px,2.6vw,30px)",display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {l.stocks.map(s=>(
                  <span key={s} style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".08em",color:"var(--amber-soft)",border:"1px solid var(--line-2)",padding:"4px 9px"}}>{s}</span>
                ))}
              </div>
              <h3 style={{margin:0,fontFamily:"var(--sans)",fontWeight:600,fontSize:"clamp(18px,2.2vw,22px)",letterSpacing:"-.01em",color:"var(--ink)"}}>{l.title}</h3>
              <p style={{margin:0,fontFamily:"var(--sans)",fontSize:14,lineHeight:1.55,color:"var(--ink-2)",flex:1}}>{l.body}</p>
              <div style={{paddingTop:14,borderTop:"1px solid var(--line)",display:"flex",alignItems:"center",gap:9}}>
                <span style={{width:5,height:5,background:"var(--amber)",borderRadius:"50%",flexShrink:0}} />
                <span style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".1em",color:"var(--ink-3)"}}>{l.maps}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:1,border:"1px solid var(--line)",borderTop:"none",background:"rgba(18,18,20,.86)",backdropFilter:"blur(2px)",padding:"clamp(22px,3vw,34px)"}}>
          <p style={{margin:0,maxWidth:"78ch",fontFamily:"var(--sans)",fontSize:"clamp(15px,1.9vw,19px)",lineHeight:1.55,color:"var(--ink)"}}>
            Mais do que emular o passado, os 21 arquivos foram estruturados como <span style={{color:"var(--amber-soft)"}}>ferramentas de salvamento</span> para os piores cenÃ¡rios de luz do outdoor. O resultado Ã© um ecossistema de <span style={{color:"var(--amber)"}}>Quiet Tech</span>: menos saturaÃ§Ã£o digital, zero floreio artificial, foco absoluto na textura e na crueza do documentarismo.
          </p>
        </div>
      </div>
    </section>
  );
}

/* âââââââââââ PAGE âââââââââââ */
function App(){
  return (
    <React.Fragment>
      <Nav />
      <Hero />
      <Ficha />
      <RaioX />
      <LogExp />
      <Origem />
      <Arquivos />
      <FaqFooter />
      <style>{`
        html{scroll-behavior:smooth}
        a:hover{color:var(--amber-soft)}
        section[id]{scroll-margin-top:72px}
        @media(max-width:860px){
          .odg-navlinks{display:none!important}
          .odg-ficha,.odg-raiox,.odg-log-row,.odg-cta,.odg-foot{grid-template-columns:1fr!important}
          .odg-hero-meta{grid-template-columns:repeat(2,1fr)!important}
          .odg-blk-grid{grid-template-columns:1fr!important}
          .odg-blk-sub{display:none!important}
          .odg-arq-grid{grid-template-columns:repeat(2,1fr)!important}
          .odg-readout{grid-template-columns:repeat(2,1fr)!important}
          .odg-lineage{grid-template-columns:1fr!important}
        }
        @media(max-width:600px){
          /* carretel: legenda empilha limpa */
          .odg-arq-cap{flex-direction:column;align-items:flex-start!important;gap:8px!important}
          .odg-arq-cap p{max-width:100%!important}
          /* readout em 2 col jÃ¡; calib stack ok */
          .odg-foot{gap:26px!important}
        }
        @media(max-width:440px){
          .odg-hero-meta{grid-template-columns:repeat(2,1fr)!important}
        }
      `}</style>
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
