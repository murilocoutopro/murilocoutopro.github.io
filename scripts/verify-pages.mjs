import {readFileSync,existsSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
for(const file of ['dist/index.html','dist/centros-de-cura/index.html']){
 assert.ok(existsSync(file),`Missing real static page: ${file}`);
 const html=readFileSync(file,'utf8');
 assert.ok(html.includes('id="root"'));
 for(const [,url] of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)/g))assert.ok(existsSync('dist'+url),`Missing asset: ${url}`);
}
assert.ok(!existsSync('dist/.env'));
const js=readdirSync('dist/assets').filter(f=>f.endsWith('.js')).map(f=>readFileSync('dist/assets/'+f,'utf8')).join('\n');
assert.ok(js.includes('cxbgtgeetxgbcololdju.supabase.co'),'Backend URL absent');
assert.ok(!/sb_secret_[A-Za-z0-9_-]{16,}/.test(js),'Secret key detected');
assert.ok(!/eyJ[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/.test(js),'JWT detected');
console.log('PASS: both static entrypoints, referenced assets, backend configuration and no secret/JWT in bundle.');
