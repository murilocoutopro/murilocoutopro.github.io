import {defineConfig} from 'vite';
export default defineConfig({
 base:'/',
 plugins:[{name:'github-pages-metadata',transformIndexHtml(html){return process.env.GITHUB_ACTIONS==='true'?html.replaceAll('https://fluxos-cura-caucaia-2026.alertteal3.chatgpt.site','https://murilocoutopro.github.io'):html}}],
 build:{rollupOptions:{input:{main:'index.html',centers:'centros-de-cura/index.html'}}},
});
