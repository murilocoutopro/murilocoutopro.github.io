import {config} from './config';
type Consent = 'accepted' | 'declined' | null;
type Fn = (...args: unknown[]) => void;
declare global { interface Window {dataLayer?: unknown[][];gtag?: Fn;fbq?: Fn & {queue?: unknown[][];loaded?:boolean;version?:string;push?:Fn;callMethod?:Fn};_fbq?:Fn;} }
let consent: Consent = null;
let started = false;
export function getConsent(): Consent {try {const v=localStorage.getItem('fluxos-consent');return v==='accepted'||v==='declined'?v:null;}catch{return consent;}}
export function setConsent(value: Exclude<Consent,null>) {consent=value;try {localStorage.setItem('fluxos-consent',value);}catch{} if(value==='accepted') startAnalytics(); else if(started) location.reload();}
function script(src:string){const s=document.createElement('script');s.src=src;s.async=true;document.head.append(s);}
export function startAnalytics(){
  if(started||getConsent()!=='accepted')return;started=true;
  const {ga4Id,metaPixelId}=config.analytics;
  if(/^G-[A-Z0-9]+$/.test(ga4Id)) {window.dataLayer=[];window.gtag=(...args)=>window.dataLayer!.push(args);window.gtag('js',new Date());window.gtag('config',ga4Id,{page_location:location.origin+location.pathname,send_page_view:true});script(`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`);}
  if(/^\d+$/.test(metaPixelId)){const fbq:NonNullable<Window['fbq']>=(...args)=>{if(fbq.callMethod)fbq.callMethod(...args);else fbq.queue!.push(args)};fbq.queue=[];fbq.push=fbq;fbq.loaded=true;fbq.version='2.0';window.fbq=fbq;window._fbq=fbq;script('https://connect.facebook.net/en_US/fbevents.js');fbq('init',metaPixelId);fbq('track','PageView');}
}
export function track(name:'contact_whatsapp_click'|'whatsapp_click'|'maps_click'|'instagram_click'|'transmission_click'|'registration_started'|'registration_submitted'|'registration_saved'|'whatsapp_redirect',placement:string){
  if(getConsent()!=='accepted')return;
  const params:Record<string,string>={placement};const query=new URLSearchParams(location.search);
  for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {const v=query.get(key);if(v)params[key]=v.slice(0,150);}
  // Referrer origin only: never send arbitrary query strings or personal form data.
  try {if(document.referrer)params.referrer_origin=new URL(document.referrer).origin;}catch{}
  window.gtag?.('event',name,params);window.fbq?.('trackCustom',name,params);
}
