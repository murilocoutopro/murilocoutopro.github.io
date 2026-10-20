import {forwardRef,useEffect,useImperativeHandle,useRef,useState} from 'react';
import {groupUrl} from '../config';
import {track} from '../analytics';
import RegistrationForm from './RegistrationForm';
import {redirectAfterSaved} from '../services/registrationRedirect';
import '../styles/registration.css';
export interface RegistrationHandle {open:(placement:string)=>void;}
const RegistrationModal=forwardRef<RegistrationHandle>(function RegistrationModal(_,ref){
 const dialog=useRef<HTMLDialogElement>(null);const [placement,setPlacement]=useState('hero');const [busy,setBusy]=useState(false);const [saved,setSaved]=useState(false);const [opened,setOpened]=useState(false);
 useImperativeHandle(ref,()=>({open(position){setPlacement(position);dialog.current?.showModal();setOpened(true);queueMicrotask(()=>dialog.current?.querySelector<HTMLInputElement>('#registration-full_name')?.focus());track('registration_started',position);}}),[]);
 useEffect(()=>{if(!saved||!opened)return;const timer=setTimeout(()=>redirectAfterSaved(saved,placement),1200);return()=>clearTimeout(timer)},[saved,opened,placement]);
 return <dialog ref={dialog} className="registration-modal" aria-labelledby="registration-title" aria-describedby="registration-description" onCancel={e=>{if(busy)e.preventDefault()}} onClose={()=>setOpened(false)}>
  <button className="registration-close" type="button" aria-label="Fechar formulário" disabled={busy} onClick={()=>dialog.current?.close()}>×</button>
  <p className="eyebrow">FLUXOS DE CURA 2026 · CAUCAIA</p>
  {saved?<div className="registration-success" role="status"><span aria-hidden="true">✓</span><h2 id="registration-title">Inscrição recebida!</h2><p id="registration-description">Estamos direcionando você ao grupo de participação.</p>{groupUrl()&&<a className="button" href={groupUrl()!} onClick={()=>track('whatsapp_redirect',placement)}>Entrar no grupo <span aria-hidden="true">→</span></a>}<p className="registration-security">Se o redirecionamento não abrir, use o botão acima. A entrada no grupo será concluída no WhatsApp.</p></div>:<><h2 id="registration-title">Garanta sua<br/><em>participação.</em></h2><p id="registration-description" className="registration-description">Preencha o formulário para se inscrever nos Fluxos de Cura 2026 e receber acesso ao nosso grupo exclusivo de WhatsApp, onde compartilharemos informações e orientações sobre o evento.</p><RegistrationForm placement={placement} onSaved={()=>setSaved(true)} onBusy={setBusy}/></>}
 </dialog>;
});
export default RegistrationModal;
