export {CAMPAIGN,PRIVACY_VERSION,UTM_KEYS,normalizePhone,maskPhone,validateFields,cleanUtms} from '../../supabase/functions/_shared/validation';
export type {RegistrationFields,FieldErrors,Utms} from '../../supabase/functions/_shared/validation';
export const registrationConfig={
  supabaseUrl: (import.meta.env.VITE_SUPABASE_URL ?? '').trim(),
  publishableKey: (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim(),
  turnstileSiteKey: (import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '').trim(),
};
export function registrationEndpoint():string|null {
  try {const u=new URL(registrationConfig.supabaseUrl);if(u.protocol!=='https:'||!/^[-a-z0-9]+\.supabase\.co$/.test(u.hostname))return null;return u.origin+'/functions/v1/register-lead';}catch{return null;}
}
