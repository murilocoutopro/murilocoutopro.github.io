import {useCallback,useRef,useState} from 'react';
import type {FormEvent} from 'react';
import {maskPhone,validateFields,cleanUtms,registrationConfig} from '../lib/registrationConfig';
import type {RegistrationFields,FieldErrors} from '../lib/registrationConfig';
import {saveRegistration} from '../services/registration';
import {track} from '../analytics';
import PrivacyNotice from './PrivacyNotice';
import TurnstileChallenge from './TurnstileChallenge';

export default function RegistrationForm({placement,onSaved,onBusy}:{placement:string;onSaved:()=>void;onBusy:(busy:boolean)=>void}){
 const [fields,setFields]=useState<RegistrationFields>({full_name:'',phone:'',email:'',event_contact_consent:false,future_communications_opt_in:false});
 const [errors,setErrors]=useState<FieldErrors>({});const [failure,setFailure]=useState('');const [busy,setBusy]=useState(false);
 const [website,setWebsite]=useState('');const [token,setToken]=useState('');const [challengeVersion,setChallengeVersion]=useState(0);
 const requestId=useRef(crypto.randomUUID());const inFlight=useRef(false);
 const onToken=useCallback((value:string)=>setToken(value),[]);
 function update<K extends keyof RegistrationFields>(key:K,value:RegistrationFields[K]){setFields(v=>({...v,[key]:value}));setErrors(e=>({...e,[key]:undefined}));setFailure('');requestId.current=crypto.randomUUID();}
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(inFlight.current)return;
  const invalid=validateFields(fields);setErrors(invalid);
  const first=Object.keys(invalid)[0];if(first){document.getElementById('registration-'+first)?.focus();return;}
  if(registrationConfig.turnstileSiteKey&&!token){setFailure('Conclua a verificação de segurança antes de confirmar.');return;}
  inFlight.current=true;setBusy(true);onBusy(true);setFailure('');track('registration_submitted',placement);
  const utms=cleanUtms(Object.fromEntries(new URLSearchParams(location.search)));
  try {await saveRegistration({...fields,request_id:requestId.current,website,turnstile_token:token,utms});track('registration_saved',placement);onSaved();}
  catch(error){setFailure(error instanceof Error?error.message:'Não conseguimos salvar agora. Tente novamente.');setToken('');setChallengeVersion(v=>v+1);}
  finally{inFlight.current=false;setBusy(false);onBusy(false);}
 }
 return <form className="registration-form" onSubmit={submit} noValidate aria-busy={busy}>
  <fieldset disabled={busy}>
   <div className="registration-field"><label htmlFor="registration-full_name">Nome completo <span aria-hidden="true">*</span></label><input id="registration-full_name" name="full_name" autoComplete="name" placeholder="Seu nome completo" maxLength={120} autoFocus value={fields.full_name} onChange={e=>update('full_name',e.target.value)} required aria-invalid={!!errors.full_name} aria-describedby={errors.full_name?'error-full_name':undefined}/>{errors.full_name&&<p className="field-error" id="error-full_name">{errors.full_name}</p>}</div>
   <div className="registration-field"><label htmlFor="registration-phone">WhatsApp <span aria-hidden="true">*</span></label><input id="registration-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(85) 99999-9999" value={fields.phone} onChange={e=>update('phone',maskPhone(e.target.value))} required aria-invalid={!!errors.phone} aria-describedby={'phone-hint'+(errors.phone?' error-phone':'')}/><small id="phone-hint">Número do Brasil, com DDD. País: +55.</small>{errors.phone&&<p className="field-error" id="error-phone">{errors.phone}</p>}</div>
   <div className="registration-field"><label htmlFor="registration-email">E-mail <span aria-hidden="true">*</span></label><input id="registration-email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" placeholder="seuemail@exemplo.com" maxLength={254} value={fields.email} onChange={e=>update('email',e.target.value)} required aria-invalid={!!errors.email} aria-describedby={errors.email?'error-email':undefined}/>{errors.email&&<p className="field-error" id="error-email">{errors.email}</p>}</div>
   <div className="registration-honeypot" aria-hidden="true"><label htmlFor="registration-website">Deixe este campo vazio</label><input id="registration-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></div>
   <div className="registration-consents">
    <label className="consent-option"><input id="registration-event_contact_consent" type="checkbox" checked={fields.event_contact_consent} onChange={e=>update('event_contact_consent',e.target.checked)} required aria-invalid={!!errors.event_contact_consent} aria-describedby={errors.event_contact_consent?'error-event_contact_consent':undefined}/><span>Autorizo, de forma específica, a Christ Embassy Caucaia a tratar meu nome, contato e inscrição neste evento religioso para organizar minha participação e comunicar informações do evento, conforme o aviso de privacidade. <strong>Obrigatório para a inscrição.</strong></span></label>
    {errors.event_contact_consent&&<p className="field-error" id="error-event_contact_consent">{errors.event_contact_consent}</p>}
    <label className="consent-option optional"><input type="checkbox" checked={fields.future_communications_opt_in} onChange={e=>update('future_communications_opt_in',e.target.checked)}/><span>Também autorizo receber comunicações futuras da igreja após esta campanha. <strong>Opcional.</strong></span></label>
   </div>
   <details className="registration-notice"><summary>Leia o aviso de privacidade</summary><PrivacyNotice/></details>
   {registrationConfig.turnstileSiteKey&&<TurnstileChallenge key={challengeVersion} siteKey={registrationConfig.turnstileSiteKey} onToken={onToken}/>}
   {failure&&<p className="registration-error" role="alert">{failure}</p>}
   <button className="button registration-submit" type="submit" disabled={busy}>{busy?<><span className="loading-ring" aria-hidden="true"/> Salvando inscrição…</>:<>Confirmar inscrição <span aria-hidden="true">→</span></>}</button>
   <p className="registration-security" role="status">{busy?'Salvando inscrição…':''}</p>
  </fieldset>
 </form>;
}
