// Midiakit page — condensed version of the real /midiakit route
const { useState: mkUseState, useEffect: mkUseEffect, useRef: mkUseRef } = React;
const { SiteNav, SiteFooter, Link } = window;

const MK_DATA = {
  reachDaily: [3982,7554,12928,9374,5840,7149,4704,5897,11425,9388,11579,12640,9662,6155,5175,6006,11242,10477,7055,7036,5765,5617,6084,8688,10050,6897,7470,4408,5135,2704],
  metrics: [
    { label:"Seguidores", value:"7,2k", sub:"@henriq.eu" },
    { label:"Alcance/30d", value:"218k", sub:"+34% vs período anterior" },
    { label:"Engajamento médio", value:"6,4%", sub:"acima da média do nicho" },
    { label:"Reels publicados", value:"72", sub:"últimos 12 meses" },
    { label:"Visualizações totais", value:"1,2M", sub:"em 12 meses" },
    { label:"Audiência principal", value:"BR · PT", sub:"+ EN secundário" },
  ],
  topPosts: [
    { caption:"Escalando Cabeça de Peixe — Serra dos Órgãos", reach:"11.352", likes:"1.540", saves:"112" },
    { caption:"Atravessando os Lençóis Maranhenses — Ep. 1", reach:"6.857", likes:"481", saves:"25" },
    { caption:"Cabeça de Peixe — plano B virou a melhor aventura", reach:"5.911", likes:"447", saves:"20" },
    { caption:"Memories of Peru — Cordilheira de Huayhuash", reach:"4.684", likes:"412", saves:"28" },
  ],
  brands: [
    { brand:"O Boticário", type:"Beauty & Lifestyle", product:"Arbo Puro · Desodorante Colônia", img:"public/images/work/OBOTICARIO/OBOTICARIO-001.jpg", likes:"2.277", comments:"107" },
    { brand:"Aiuruocan", type:"Vestuário Outdoor", product:"White Melton + Colors Blue", img:"public/images/work/AIUR/MOLETON_MELTON/MOLETON-MELTON-001.jpg", likes:"276", reach:"3.757" },
    { brand:"OMA Gear", type:"Gear & Equipamento", product:"Kit Cozinha Ultra Leve · 149g", img:"public/images/work/OMA-GEAR/OMA-GEAR-001.jpg", likes:"217", comments:"20" },
    { brand:"K&F Concept", type:"Equipamento Fotográfico", product:"Tripé Omni Series + FH03", img:"public/images/work/KNF-CONCEPT/KNF-CONCEPT-001.jpg", likes:"285", comments:"16" },
    { brand:"Brightin Star", type:"Óptica", product:"Lente 16mm f/2.8", img:"public/images/work/BRIGHTIN-STAR/BRIGHTIN-STAR-001.jpg", reach:"4.053", saves:"31" },
    { brand:"Botas Vento", type:"Calçados Outdoor", product:"Titan + Finisterre", img:"public/images/work/BOTAS-VENTO/BOTA-TITAN/BOTA-TITAN-001.jpg", likes:"599", comments:"18" },
    { brand:"Alto Estilo", type:"Moda & Equipamento", product:"Mochila Ataque 40+5L", img:"public/images/work/ALTO-ESTILO/ALTO-ESTILO-001.jpg", likes:"260", reach:"3.423" },
    { brand:"Gorro Vans", type:"Vestuário Outdoor", product:"Beanie · Pico Mateo 5.150m", img:"public/images/work/GORRO-VANS/GORRO-VANS-001.jpg", likes:"197", reach:"5.341" },
  ],
  services: [
    { name:"Reels de Expedição", desc:"Vídeos cinematográficos 15–60s com narrativa emocional" },
    { name:"Drone Cinematography", desc:"Captação aérea profissional com DJI Air 3S" },
    { name:"Carrosséis de Destino", desc:"Séries fotográficas editoriais para Instagram" },
    { name:"Licenciamento de Conteúdo", desc:"Uso em campanhas, sites e materiais da marca" },
    { name:"Conteúdo Bilíngue PT/EN", desc:"Criação e adaptação para mercado internacional" },
    { name:"Guia + Produção", desc:"Logística completa + audiovisual integrado" },
  ],
  gear: [
    { name:"Sony A7 IV", cat:"Câmera principal" },
    { name:"DJI Air 3S", cat:"Drone cinematográfico" },
    { name:"Comica VM40", cat:"Áudio 32-bit float" },
    { name:"DaVinci Resolve", cat:"Pós-produção" },
    { name:"Lightroom", cat:"Presets próprios" },
  ],
  destinations: [
    "Lençóis Maranhenses · MA","Itatiaia · RJ","Serra dos Órgãos · RJ","Pico Paraná · PR",
    "Serra do Mar · SP/RJ","Serra da Bocaina","Serra Fina · MG","Cordillera Blanca · Peru",
    "Cordillera Huayhuash · Peru","Atacama · Chile",
  ],
};

// ── Sparkline ─────────────────────────────────────────────────────
function Sparkline({ data }){
  const max = Math.max(...data), min = Math.min(...data);
  const W = 600, H = 80;
  const x = (i) => (i / (data.length - 1)) * W;
  const y = (v) => H - ((v - min) / (max - min)) * (H - 8) - 4;
  const path = data.map((v,i)=> `${i===0?"M":"L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${path} L${W},${H} L0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:80,display:"block"}}>
      <defs>
        <linearGradient id="mk-spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--rust)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--rust)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#mk-spark)" />
      <path d={path} fill="none" stroke="var(--rust)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v,i)=>(<circle key={i} cx={x(i)} cy={y(v)} r="2" fill="var(--rust)" opacity={.6} />))}
    </svg>
  );
}

function MidiakitPage(){
  const D = MK_DATA;
  return (
    <main style={{background:"var(--forest)",color:"var(--canvas)",fontFamily:"var(--font-ui)",minHeight:"100vh"}}>
      <style>{`
        .mk-bio{display:grid;grid-template-columns:1.3fr 1fr;gap:80px}
        .mk-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(232,223,201,.1)}
        .mk-metrics > *{background:var(--forest);padding:36px 28px}
        .mk-posts{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        .mk-brands{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(232,223,201,.1)}
        .mk-services{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(232,223,201,.1)}
        .mk-services > *{background:var(--forest);padding:32px 28px}
        .mk-gear{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
        .mk-dest{display:grid;grid-template-columns:repeat(2,1fr);gap:0}
        @media(max-width:1100px){
          .mk-bio{grid-template-columns:1fr;gap:48px}
          .mk-metrics,.mk-services{grid-template-columns:repeat(2,1fr)}
          .mk-posts,.mk-brands{grid-template-columns:repeat(2,1fr)}
          .mk-gear{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:640px){
          .mk-metrics,.mk-services,.mk-posts,.mk-brands,.mk-gear,.mk-dest{grid-template-columns:1fr!important}
        }
      `}</style>
      <SiteNav dark={true} />

      {/* HERO */}
      <section style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"0 56px 80px",overflow:"hidden"}}>
        <img src="public/images/exp-huayhuash.jpg" alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,var(--forest) 0%,rgba(30,42,24,.7) 40%,rgba(30,42,24,.3) 100%)"}} />
        <div style={{position:"relative",zIndex:2,maxWidth:980}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".28em",textTransform:"uppercase",color:"rgba(232,223,201,.55)",marginBottom:24}}>Media Kit · 2026</div>
          <h1 style={{margin:"0 0 8px",lineHeight:0.85}}>
            <span style={{fontFamily:"var(--font-hand)",fontSize:"clamp(48px,7vw,84px)",color:"rgba(232,223,201,.7)",display:"block",marginBottom:6,transform:"rotate(-2deg)"}}>adventure filmmaker—</span>
            <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:"clamp(72px,13vw,168px)",letterSpacing:"-.05em",textTransform:"uppercase",display:"block",color:"var(--canvas)"}}>HENRIQUE</span>
            <span style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:"clamp(72px,13vw,168px)",letterSpacing:"-.05em",textTransform:"uppercase",display:"block",color:"var(--rust)"}}>SESANA</span>
          </h1>
          <div style={{marginTop:32,display:"flex",gap:32,flexWrap:"wrap",fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".18em",color:"rgba(232,223,201,.55)"}}>
            <span>Trekking · Montanhismo · Cinematografia</span>
            <span style={{opacity:.65}}>São Paulo, BR</span>
            <span style={{opacity:.65}}>PT · EN</span>
          </div>
        </div>
        <div style={{position:"absolute",bottom:32,right:56,zIndex:2,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
          <span style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(232,223,201,.45)"}}>@henriq.eu</span>
          <div style={{width:1,height:48,background:"rgba(232,223,201,.25)"}} />
        </div>
      </section>

      {/* SOBRE */}
      <section style={{padding:"120px 56px",borderTop:"1px solid var(--line-dark)"}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(232,223,201,.4)",marginBottom:48,display:"flex",alignItems:"center",gap:16}}>
          <span>01</span>
          <span style={{flex:1,height:1,background:"rgba(232,223,201,.12)"}} />
          <span>Sobre</span>
        </div>
        <div className="mk-bio">
          <div>
            <p style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:24,lineHeight:1.55,letterSpacing:"-.01em",color:"var(--canvas)",margin:"0 0 28px"}}>
              Fotógrafo, filmmaker e contador de histórias visuais que nascem da terra, do vento e do tempo. Estética contemplativa, minimalista, profundamente conectada à natureza.
            </p>
            <p style={{fontSize:14.5,lineHeight:1.75,color:"rgba(232,223,201,.7)",margin:"0 0 18px"}}>
              As cores que escolho dialogam com o ambiente: verdes densos, tons de areia, luz natural e texturas reais. Composição espontânea, detalhe que o olho quase não vê, instante que carrega presença sutil. Minha fotografia não busca impacto — busca permanência.
            </p>
            <p style={{fontSize:14.5,lineHeight:1.75,color:"rgba(232,223,201,.7)",margin:"0 0 18px"}}>
              Já produzi campanhas para marcas de vestuário, turismo e cosméticos, sempre propondo um caminho mais poético e imersivo — onde o produto entra na paisagem, e não o contrário.
            </p>
            <p style={{fontSize:14.5,lineHeight:1.75,color:"rgba(232,223,201,.7)",margin:"0 0 36px"}}>
              Em agosto de 2026, volto aos Lençóis Maranhenses para guiar três grupos com fotografia integrada — travessia com produção própria de ponta a ponta.
            </p>
            <span style={{fontFamily:"var(--font-hand)",fontSize:38,color:"var(--rust-soft)",display:"inline-block",transform:"rotate(-2deg)"}}>— Henrique</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:24}}>
            <img src="public/images/henrique-portrait-1.jpg" alt="" style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",objectPosition:"center top"}} />
            <img src="public/images/portrait.jpg" alt="" style={{width:"100%",aspectRatio:"3/4",objectFit:"cover",objectPosition:"center top",marginLeft:"15%",marginTop:-40}} />
          </div>
        </div>
      </section>

      {/* MÉTRICAS */}
      <section style={{padding:"120px 56px",background:"rgba(166,84,43,.04)",borderTop:"1px solid var(--line-dark)",borderBottom:"1px solid var(--line-dark)"}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(232,223,201,.4)",marginBottom:48,display:"flex",alignItems:"center",gap:16}}>
          <span>02</span>
          <span style={{flex:1,height:1,background:"rgba(232,223,201,.12)"}} />
          <span>Métricas · Instagram</span>
        </div>
        <div className="mk-metrics" style={{marginBottom:64}}>
          {D.metrics.map(m=>(
            <div key={m.label}>
              <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(232,223,201,.4)",marginBottom:12}}>{m.label}</div>
              <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:48,letterSpacing:"-.04em",color:"var(--canvas)",lineHeight:1,marginBottom:8}}>{m.value}</div>
              <div style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:13,color:"rgba(232,223,201,.55)"}}>{m.sub}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:14}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(232,223,201,.5)"}}>Alcance diário · últimos 30 dias</span>
            <span style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:14,color:"var(--rust-soft)"}}>pico em 12.928</span>
          </div>
          <Sparkline data={D.reachDaily} />
        </div>
      </section>

      {/* TOP POSTS */}
      <section style={{padding:"120px 56px"}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(232,223,201,.4)",marginBottom:48,display:"flex",alignItems:"center",gap:16}}>
          <span>03</span>
          <span style={{flex:1,height:1,background:"rgba(232,223,201,.12)"}} />
          <span>Reels em destaque</span>
        </div>
        <div className="mk-posts">
          {D.topPosts.map((p,i)=>(
            <div key={i} style={{aspectRatio:"9/16",background:"#111",border:"1px solid rgba(232,223,201,.1)",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:18}}>
              <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,rgba(0,0,0,.2) 0%,rgba(0,0,0,.85) 100%),url(public/images/portfolio/${["lencois-silhueta-pordosol","grupo-caminhando-lencois","queimada-dos-britos-lencois","laguna-acampamento-janca"][i]}.jpg)`,backgroundSize:"cover",backgroundPosition:"center"}} />
              <div style={{position:"relative",zIndex:2,display:"flex",flexDirection:"column",gap:14}}>
                <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(232,223,201,.5)"}}>Reel · #{i+1}</div>
                <p style={{fontSize:13,lineHeight:1.4,color:"var(--canvas)",margin:0}}>{p.caption}</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,paddingTop:12,borderTop:"1px solid rgba(232,223,201,.2)"}}>
                  {[["Alcance",p.reach],["Likes",p.likes],["Saves",p.saves]].map(([k,v])=>(
                    <div key={k}>
                      <div style={{fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:".15em",textTransform:"uppercase",color:"rgba(232,223,201,.45)",marginBottom:2}}>{k}</div>
                      <div style={{fontFamily:"var(--font-ui)",fontWeight:600,fontSize:13,color:"var(--canvas)"}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section style={{padding:"120px 56px",background:"rgba(166,84,43,.04)",borderTop:"1px solid var(--line-dark)",borderBottom:"1px solid var(--line-dark)"}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(232,223,201,.4)",marginBottom:16,display:"flex",alignItems:"center",gap:16}}>
          <span>04</span>
          <span style={{flex:1,height:1,background:"rgba(232,223,201,.12)"}} />
          <span>Marcas · Parcerias</span>
        </div>
        <h2 style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:"clamp(40px,5vw,64px)",letterSpacing:"-.03em",lineHeight:0.95,margin:"0 0 56px",color:"var(--canvas)"}}>
          marcas que <span style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontWeight:400,color:"var(--rust-soft)"}}>caminharam junto</span>.
        </h2>
        <div className="mk-brands">
          {D.brands.map((b,i)=>(
            <article key={i} style={{background:"var(--forest)",position:"relative",aspectRatio:"4/5",overflow:"hidden",cursor:"pointer"}}>
              <img src={b.img} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.7)",transition:"transform .8s,filter .3s"}} onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.05)";e.currentTarget.style.filter="brightness(.85)"}} onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.filter="brightness(.7)"}} />
              <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,.1) 30%,rgba(0,0,0,.85) 100%)",pointerEvents:"none"}} />
              <div style={{position:"absolute",inset:0,padding:20,display:"flex",flexDirection:"column",justifyContent:"space-between",pointerEvents:"none"}}>
                <span style={{fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(232,223,201,.7)",border:"1px solid rgba(232,223,201,.3)",padding:"4px 8px",alignSelf:"flex-start"}}>{b.type}</span>
                <div>
                  <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:22,letterSpacing:"-.02em",color:"var(--canvas)",marginBottom:4}}>{b.brand}</div>
                  <div style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:13,color:"rgba(232,223,201,.7)",marginBottom:14,lineHeight:1.35}}>{b.product}</div>
                  <div style={{display:"flex",gap:14,fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".15em",color:"rgba(232,223,201,.6)"}}>
                    {b.likes && <span>♥ {b.likes}</span>}
                    {b.reach && <span>◎ {b.reach}</span>}
                    {b.comments && <span>✎ {b.comments}</span>}
                    {b.saves && <span>⌘ {b.saves}</span>}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SERVIÇOS */}
      <section style={{padding:"120px 56px"}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(232,223,201,.4)",marginBottom:48,display:"flex",alignItems:"center",gap:16}}>
          <span>05</span>
          <span style={{flex:1,height:1,background:"rgba(232,223,201,.12)"}} />
          <span>Serviços</span>
        </div>
        <div className="mk-services">
          {D.services.map(s=>(
            <div key={s.name}>
              <div style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:18,color:"var(--canvas)",marginBottom:10,letterSpacing:"-.01em"}}>{s.name}</div>
              <div style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:14,color:"rgba(232,223,201,.65)",lineHeight:1.55}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GEAR + DESTINOS */}
      <section style={{padding:"120px 56px",background:"rgba(166,84,43,.04)",borderTop:"1px solid var(--line-dark)"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80}} className="mk-bio">
          <div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(232,223,201,.4)",marginBottom:32}}>06 · Equipamento</div>
            <div className="mk-gear" style={{gridTemplateColumns:"1fr 1fr"}}>
              {D.gear.map(g=>(
                <div key={g.name} style={{border:"1px solid rgba(232,223,201,.12)",padding:"20px 18px"}}>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(232,223,201,.4)",marginBottom:8}}>{g.cat}</div>
                  <div style={{fontFamily:"var(--font-ui)",fontWeight:600,fontSize:14,color:"var(--canvas)"}}>{g.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(232,223,201,.4)",marginBottom:32}}>07 · Destinos · 2024–2026</div>
            <ul style={{listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column"}}>
              {D.destinations.map((d,i)=>(
                <li key={d} style={{padding:"14px 0",borderBottom:i<D.destinations.length-1?"1px solid rgba(232,223,201,.1)":"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:18,color:"var(--canvas)"}}>{d}</span>
                  <span style={{fontFamily:"var(--font-mono)",fontSize:9,letterSpacing:".18em",color:"rgba(232,223,201,.4)"}}>№ {String(i+1).padStart(2,"0")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"140px 56px",position:"relative",overflow:"hidden"}}>
        <img src="public/images/lencois/DJI_20250828174205_0403_D-HDR.jpg" alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.18}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,var(--forest) 0%,rgba(30,42,24,.7) 100%)"}} />
        <div style={{position:"relative",zIndex:2,maxWidth:780}}>
          <span style={{fontFamily:"var(--font-hand)",fontSize:48,color:"var(--rust-soft)",transform:"rotate(-2deg)",display:"inline-block",lineHeight:1,marginBottom:18}}>vamos conversar—</span>
          <h2 style={{fontFamily:"var(--font-ui)",fontWeight:700,fontSize:"clamp(56px,9vw,108px)",letterSpacing:"-.04em",lineHeight:0.9,margin:"0 0 32px",textTransform:"uppercase",color:"var(--canvas)"}}>
            sua marca,<br /><span style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontWeight:400,textTransform:"none",color:"var(--rust-soft)",letterSpacing:"-.02em"}}>na paisagem.</span>
          </h2>
          <p style={{fontFamily:"var(--font-serif)",fontStyle:"italic",fontSize:20,lineHeight:1.55,color:"rgba(232,223,201,.75)",maxWidth:"52ch",marginTop:0,marginBottom:40}}>
            Briefings personalizados, prazos honestos, conteúdo que dura mais que um ciclo de algoritmo.
          </p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            <Link href="/contato" style={{padding:"18px 32px",background:"var(--canvas)",color:"var(--bark)",fontFamily:"var(--font-ui)",fontSize:13,fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",display:"inline-flex",alignItems:"center",gap:12}}>
              Briefing & contato <span style={{fontFamily:"var(--font-hand)",fontSize:28,color:"var(--rust)"}}>→</span>
            </Link>
            <a href="mailto:management@henriq.eu" style={{padding:"18px 32px",border:"1px solid rgba(232,223,201,.4)",color:"var(--canvas)",fontFamily:"var(--font-ui)",fontSize:13,fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",textDecoration:"none"}}>
              management@henriq.eu
            </a>
          </div>
        </div>
      </section>

      <SiteFooter dark={true} />
    </main>
  );
}

window.MidiakitPage = MidiakitPage;
