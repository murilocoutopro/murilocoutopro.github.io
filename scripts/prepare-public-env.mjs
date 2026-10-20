import {readFileSync,writeFileSync} from 'node:fs';
const defaults=JSON.parse(readFileSync(new URL('../config/public-build.json',import.meta.url),'utf8').replace(/^\uFEFF/,''));
const values={};
for(const key of ['VITE_SUPABASE_URL','VITE_SUPABASE_PUBLISHABLE_KEY','VITE_TURNSTILE_SITE_KEY'])values[key]=(process.env[key]||defaults[key]||'').trim();
if(!/^https:\/\/[-a-z0-9]+\.supabase\.co$/.test(values.VITE_SUPABASE_URL))throw new Error('Invalid public Supabase URL');
if(!/^sb_publishable_[A-Za-z0-9_-]+$/.test(values.VITE_SUPABASE_PUBLISHABLE_KEY))throw new Error('Use a publishable key only. Secret/service_role keys are forbidden.');
if(Object.values(values).some(v=>/[\r\n]/.test(v)))throw new Error('Multiline values are forbidden');
writeFileSync('.env.production.local',Object.entries(values).map(([k,v])=>`${k}=${JSON.stringify(v)}`).join('\n')+'\n');
console.log('Public build configuration validated. No server credentials included.');
