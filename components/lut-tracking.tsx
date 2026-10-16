"use client";

import Script from "next/script";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type ComponentProps } from "react";
import { LUT_PIXEL_ID, lutCheckoutUrl } from "@/lib/lut-tracking";
import { readMarketingConsent as readConsent, subscribeMarketingConsent as subscribe, chooseMarketingConsent as choose } from "@/lib/marketing-consent";
import { scheduleLutView } from "@/lib/meta-lut-events";

function useConsent() {
  return useSyncExternalStore(subscribe, readConsent, () => null);
}

// No script, tracking request or advertising cookie is created before acceptance.
const bootstrap = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
if(!window.__henriqLutPixel){
window.fbq('set','autoConfig',false,'${LUT_PIXEL_ID}');
window.fbq('init','${LUT_PIXEL_ID}');window.__henriqLutPixel=true;
}`;

export function LutTracking() {
  const consent = useConsent();
  const [editing, setEditing] = useState(false);
  const sent = useRef(false);
  const open = consent === null || editing;
  return <>
    {consent === "accepted" && <Script id="henriq-luts-meta" strategy="afterInteractive" onReady={() => scheduleLutView(sent)}>{bootstrap}</Script>}
    {open ? <section aria-label="Preferências de publicidade" style={{position:"fixed",bottom:88,left:16,right:16,maxWidth:440,zIndex:1000,padding:20,background:"#191816",color:"#e8dfc9",border:"1px solid #625646",borderRadius:12,fontFamily:"var(--font-ui)",fontSize:14,boxShadow:"0 8px 32px #0008"}}>
      <p style={{margin:"0 0 12px"}}>Podemos usar o Pixel da Meta para medir visitas aos LUTs e melhorar nossos anúncios? Você pode recusar e comprar normalmente. <Link href="/privacidade" style={{textDecoration:"underline"}}>Privacidade</Link></p>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        <button type="button" onClick={() => {choose("declined");setEditing(false);}} style={{padding:"10px 16px",border:"1px solid #a99a83",borderRadius:6,cursor:"pointer"}}>Recusar</button>
        <button type="button" onClick={() => {choose("accepted");setEditing(false);}} style={{padding:"10px 16px",border:"1px solid #a99a83",borderRadius:6,cursor:"pointer"}}>Aceitar</button>
      </div>
    </section> : <button type="button" onClick={() => setEditing(true)} style={{position:"fixed",bottom:88,left:16,zIndex:1000,padding:"6px 10px",borderRadius:6,background:"#191816",color:"#e8dfc9",border:"1px solid #625646",fontSize:12,cursor:"pointer"}}>Preferências de publicidade</button>}
  </>;
}

const subscribeLocation = () => () => {};
const readSearch = () => window.location.search;
export function LutCheckoutLink(props: ComponentProps<"a">) {
  const consent = useConsent();
  const search = useSyncExternalStore(subscribeLocation, readSearch, () => "");
  // InitiateCheckout belongs to Cakto when its checkout opens, never to this click.
  return <a {...props} href={lutCheckoutUrl(search, consent === "accepted")} />;
}
