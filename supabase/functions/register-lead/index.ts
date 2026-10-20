import {createRegistrationHandler} from './handler.ts';

let secretKey='';
try {secretKey=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')??'{}').default??'';}catch{ /* fail closed below */ }
secretKey ||= Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')??'';
// Derive a separate HMAC key from the server-only key when no custom salt is
// configured. No secret is copied into source code or the browser bundle.
let rateLimitSalt=Deno.env.get('REGISTRATION_RATE_LIMIT_SALT')??'';
if(!rateLimitSalt&&secretKey){
 const enc=new TextEncoder();
 const key=await crypto.subtle.importKey('raw',enc.encode(secretKey),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const digest=await crypto.subtle.sign('HMAC',key,enc.encode('fluxos2026:registration-hmac:v1'));
 rateLimitSalt=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
}
const defaultOrigins=[
 'https://fluxos-cura-caucaia-2026.alertteal3.chatgpt.site',
 'https://murilocoutopro.github.io',
 'http://localhost:5188','http://127.0.0.1:5188',
];
Deno.serve(createRegistrationHandler({config:{
 supabaseUrl:(Deno.env.get('SUPABASE_URL')??'').replace(/\/$/,''),
 serviceKey:secretKey,
 allowedOrigins:Deno.env.get('ALLOWED_ORIGINS')?.split(',').map(s=>s.trim()).filter(Boolean)??defaultOrigins,
 rateLimitSalt,
 turnstileSecret:Deno.env.get('TURNSTILE_SECRET_KEY')??'',
}}));
