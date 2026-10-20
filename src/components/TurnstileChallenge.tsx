import {useEffect,useRef,useState} from 'react';
type WidgetOptions={sitekey:string;theme:string;action:string;callback:(token:string)=>void;'expired-callback':()=>void;'error-callback':()=>void;};
declare global {interface Window {turnstile?:{render:(element:HTMLElement,options:WidgetOptions)=>string;remove:(id:string)=>void;};}}
let loading:Promise<void>|null=null;
function load(){
 if(window.turnstile)return Promise.resolve();
 if(!loading)loading=new Promise<void>((resolve,reject)=>{const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';s.async=true;s.onload=()=>resolve();s.onerror=()=>{loading=null;reject(new Error('challenge unavailable'));};document.head.append(s);});
 return loading;
}
export default function TurnstileChallenge({siteKey,onToken}:{siteKey:string;onToken:(token:string)=>void}){
 const element=useRef<HTMLDivElement>(null);const [failed,setFailed]=useState(false);
 useEffect(()=>{let disposed=false;let id:string|undefined;load().then(()=>{if(!disposed&&element.current&&window.turnstile)id=window.turnstile.render(element.current,{sitekey:siteKey,theme:'dark',action:'event_registration',callback:onToken,'expired-callback':()=>onToken(''),'error-callback':()=>{onToken('');setFailed(true)}});}).catch(()=>{if(!disposed)setFailed(true)});return()=>{disposed=true;if(id)window.turnstile?.remove(id)};},[siteKey,onToken]);
 return <div className="security-challenge"><div ref={element}/>{failed&&<p role="alert">Não foi possível carregar a verificação de segurança. Confira sua conexão e abra o formulário novamente.</p>}</div>;
}
