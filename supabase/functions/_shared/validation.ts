// Pure validation shared by browser and Edge Function. No credentials here.
export const CAMPAIGN = 'fluxos2026_presencial';
export const PRIVACY_VERSION = '2026-10-19-v1';
export const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'] as const;
export type Utms = Partial<Record<typeof UTM_KEYS[number],string>>;
export interface RegistrationFields {
  full_name:string; email:string; phone:string;
  event_contact_consent:boolean; future_communications_opt_in:boolean;
}
export type FieldErrors = Partial<Record<keyof RegistrationFields,string>>;
export function normalizePhone(value:string):string|null {
  if(!/^[\d\s()+.-]+$/.test(value))return null;
  let n=value.replace(/\D/g,'');
  if((n.length===12||n.length===13)&&n.startsWith('55'))n=n.slice(2);
  const valid=/^[1-9]\d(?:9\d{8}|[2-5]\d{7})$/.test(n);
  return valid&&!/^(\d)\1+$/.test(n)?'+55'+n:null;
}
export function maskPhone(value:string):string {
  let n=value.replace(/\D/g,'');
  if(n.length>11&&n.startsWith('55'))n=n.slice(2);
  n=n.slice(0,11);if(!n)return '';
  if(n.length<3)return '('+n;
  const local=n.slice(2),split=local.length>8?5:4;
  return '('+n.slice(0,2)+') '+local.slice(0,split)+(local.length>split?'-'+local.slice(split):'');
}
export function validateFields(v:RegistrationFields):FieldErrors {
  const errors:FieldErrors={};const name=v.full_name.trim().replace(/\s+/g,' ');
  if(name.length<5||name.length>120||!/^\p{L}[\p{L}\p{M}'’ .-]+$/u.test(name)||name.split(' ').filter(t=>/\p{L}{2}/u.test(t)).length<2)errors.full_name='Informe seu nome e sobrenome.';
  if(v.email.length>254||! /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(v.email.trim()))errors.email='Informe um e-mail válido.';
  if(!normalizePhone(v.phone))errors.phone='Informe um telefone brasileiro válido, com DDD.';
  if(v.event_contact_consent!==true)errors.event_contact_consent='Sua autorização é necessária para registrar a inscrição.';
  return errors;
}
export function cleanUtms(value:unknown):Utms {
  const result:Utms={};
  if(!value||typeof value!=='object'||Array.isArray(value))return result;
  for(const key of UTM_KEYS){const v=(value as Record<string,unknown>)[key];if(typeof v==='string')result[key]=v.replace(/[\x00-\x1f\x7f]/g,'').slice(0,150);}
  return result;
}
