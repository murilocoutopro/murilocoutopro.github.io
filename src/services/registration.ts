import {registrationEndpoint,registrationConfig,CAMPAIGN,PRIVACY_VERSION,normalizePhone,cleanUtms} from '../lib/registrationConfig';
import type {RegistrationFields,Utms} from '../lib/registrationConfig';
export interface RegistrationSubmission extends RegistrationFields {request_id:string;utms:Utms;website:string;turnstile_token?:string;}
export class RegistrationError extends Error {constructor(message:string,public status=0){super(message);}}
export async function saveRegistration(input:RegistrationSubmission):Promise<void>{
 const endpoint=registrationEndpoint();
 if(!endpoint)throw new RegistrationError('As inscrições pelo site ainda estão sendo preparadas. Seus dados foram mantidos neste formulário. Tente novamente mais tarde.');
 const headers:Record<string,string>={'Content-Type':'application/json'};
 const key=registrationConfig.publishableKey;
 if(key){if(key.startsWith('sb_secret_')||key.startsWith('eyJ'))throw new RegistrationError('A configuração de inscrição precisa ser revisada. Tente novamente mais tarde.');headers.apikey=key;}
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
 try {
  const response=await fetch(endpoint,{method:'POST',headers,signal:controller.signal,body:JSON.stringify({
   request_id:input.request_id,full_name:input.full_name.trim().replace(/\s+/g,' '),email:input.email.trim().toLowerCase(),phone:normalizePhone(input.phone),campaign:CAMPAIGN,utms:cleanUtms(input.utms),event_contact_consent:input.event_contact_consent,privacy_notice_version:PRIVACY_VERSION,future_communications_opt_in:input.future_communications_opt_in,website:input.website,turnstile_token:input.turnstile_token??'',
  })});
  const data=await response.json().catch(()=>null);
  if(!response.ok){
   if(response.status===429)throw new RegistrationError('Recebemos várias tentativas. Aguarde alguns minutos e tente novamente, sem fechar o formulário.',429);
   if(response.status===400)throw new RegistrationError('Confira os campos e a verificação de segurança e tente novamente.',400);
   throw new RegistrationError('Não conseguimos salvar agora. Seus dados continuam no formulário. Tente novamente.',response.status);
  }
  if(data?.saved!==true||data?.receipt!==input.request_id)throw new RegistrationError('Não foi possível confirmar o salvamento. Tente novamente sem fechar o formulário.');
 }catch(error){if(error instanceof RegistrationError)throw error;throw new RegistrationError('A conexão falhou ou demorou demais. Confira a internet e tente novamente. Seus dados foram mantidos.');}finally{clearTimeout(timer);}
}
