import {CAMPAIGN,PRIVACY_VERSION,validateFields,normalizePhone,cleanUtms} from '../_shared/validation.ts';
export interface RuntimeConfig {supabaseUrl:string;serviceKey:string;allowedOrigins:string[];rateLimitSalt:string;turnstileSecret?:string;}
export interface HandlerDependencies {config:RuntimeConfig;fetcher?:typeof fetch;}
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
async function readJson(req:Request):Promise<unknown>{
 const reader=req.body?.getReader();if(!reader)throw new Error('body');let bytes=0;const chunks:Uint8Array[]=[];
 while(true){const item=await reader.read();if(item.done)break;bytes+=item.value.length;if(bytes>8192){await reader.cancel();throw new Error('size')}chunks.push(item.value)}
 const all=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){all.set(chunk,offset);offset+=chunk.length}
 return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(all));
}
async function hmac(secret:string,value:string):Promise<string>{const enc=new TextEncoder();const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const digest=await crypto.subtle.sign('HMAC',key,enc.encode(value));return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');}
export function createRegistrationHandler({config,fetcher=fetch}:HandlerDependencies){
 const origins=new Set(config.allowedOrigins.filter(Boolean));
 return async function handle(req:Request):Promise<Response>{
  const origin=req.headers.get('origin')??'';const allowed=origins.has(origin);
  const headers:Record<string,string>={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'};
  if(allowed){headers['Access-Control-Allow-Origin']=origin;headers['Access-Control-Allow-Methods']='POST, OPTIONS';headers['Access-Control-Allow-Headers']='content-type,apikey';}
  const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers});
  if(!allowed)return reply(403,{error:'origin_not_allowed'});
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(req.method!=='POST')return reply(405,{error:'method_not_allowed'});
  if(!config.supabaseUrl||!config.serviceKey||config.rateLimitSalt.length<32)return reply(503,{error:'configuration_required'});
  if(!req.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return reply(415,{error:'json_required'});
  if(Number(req.headers.get('content-length')??0)>8192)return reply(413,{error:'request_too_large'});
  let raw:unknown;try{raw=await readJson(req)}catch{return reply(400,{error:'invalid_request'})}
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return reply(400,{error:'invalid_request'});
  const body=raw as Record<string,unknown>;
  if(typeof body.website!=='string'||body.website!==''||typeof body.request_id!=='string'||!UUID.test(body.request_id)||body.campaign!==CAMPAIGN||body.privacy_notice_version!==PRIVACY_VERSION)return reply(400,{error:'invalid_request'});
  if(typeof body.full_name!=='string'||typeof body.email!=='string'||typeof body.phone!=='string'||typeof body.future_communications_opt_in!=='boolean'||body.event_contact_consent!==true)return reply(400,{error:'invalid_fields'});
  const fields={full_name:body.full_name.trim().replace(/\s+/g,' '),email:body.email.trim().toLowerCase(),phone:body.phone,event_contact_consent:true,future_communications_opt_in:body.future_communications_opt_in};
  if(Object.keys(validateFields(fields)).length)return reply(400,{error:'invalid_fields'});
  const phone=normalizePhone(fields.phone)!;
  const adminHeaders:Record<string,string>={'Content-Type':'application/json',apikey:config.serviceKey};
  // New secret keys use apikey; the legacy service-role JWT also needs Bearer.
  if(config.serviceKey.startsWith('eyJ'))adminHeaders.Authorization='Bearer '+config.serviceKey;
  async function rpc(name:string,args:unknown):Promise<unknown>{const response=await fetcher(config.supabaseUrl+'/rest/v1/rpc/'+name,{method:'POST',headers:adminHeaders,body:JSON.stringify(args),signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error('storage unavailable');return response.json();}
  try {
   // CORS is not authentication. Limits are persisted server-side and do not
   // trust an IP header that could be spoofed. Optional Turnstile adds bot proof.
   const globalKey=await hmac(config.rateLimitSalt,'rate:global:'+CAMPAIGN);
   if(await rpc('consume_registration_rate_limit',{p_key:globalKey,p_limit:400,p_window_seconds:600})!==true)return reply(429,{error:'try_later'});
   const contactKey=await hmac(config.rateLimitSalt,'rate:phone:'+phone);
   if(await rpc('consume_registration_rate_limit',{p_key:contactKey,p_limit:5,p_window_seconds:600})!==true)return reply(429,{error:'try_later'});
   if(config.turnstileSecret){
    if(typeof body.turnstile_token!=='string'||!body.turnstile_token||body.turnstile_token.length>2048)return reply(400,{error:'security_check_required'});
    const captcha=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:config.turnstileSecret,response:body.turnstile_token}),signal:AbortSignal.timeout(10000)});
    const result=await captcha.json();const hostnames=new Set([...origins].map(o=>new URL(o).hostname));
    if(!captcha.ok||result.success!==true||!hostnames.has(result.hostname)||result.action!=='event_registration')return reply(400,{error:'security_check_failed'});
   }
   const utms=cleanUtms(body.utms);
   const payload={full_name:fields.full_name,email:fields.email,phone,campaign:CAMPAIGN,utm_source:utms.utm_source??null,utm_medium:utms.utm_medium??null,utm_campaign:utms.utm_campaign??null,utm_content:utms.utm_content??null,utm_term:utms.utm_term??null,event_contact_consent:true,privacy_notice_version:PRIVACY_VERSION,future_communications_opt_in:fields.future_communications_opt_in};
   const hash=await hmac(config.rateLimitSalt,'submission:'+JSON.stringify(payload));
   const id=await rpc('save_event_registration',{p_request_id:body.request_id,p_submission_hash:hash,p_payload:payload});
   if(typeof id!=='string'||!UUID.test(id))throw new Error('unconfirmed persistence');
   // No names, contacts, raw IPs, database details or tokens are logged/returned.
   return reply(200,{saved:true,receipt:body.request_id});
  }catch{return reply(503,{error:'unable_to_save'})}
 };
}
