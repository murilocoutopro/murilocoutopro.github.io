import {youtubeVideoId} from '../lib/youtube';
import {publicMp4Url} from '../lib/video';

export interface Testimonial {
 id:string;
 name:string;
 description:string;
 youtubeUrl:string;
 videoSource?:'youtube'|'mp4';
 mp4Url?:string;
 /** Prefer /assets/cover.jpg: external images are not fetched before consent. */
 thumbnailUrl?:string;
 context?:string;
 isDemo?:boolean;
 /** Set true only after the participant/material publication is authorized. */
 publicationAuthorized?:boolean;
}

// Add the definitive, authorized records here. No visual component edits needed.
// youtubeUrl accepts https://www.youtube.com/shorts/ followed by a real video ID.
const approvedTestimonials:Testimonial[]=[
 {id:'natalia',videoSource:'mp4',mp4Url:'https://cxbgtgeetxgbcololdju.supabase.co/storage/v1/object/public/testemunhos/Natalia.mp4',name:'Natália',description:'Natália conta que conviveu com ansiedade, depressão e transtorno bipolar, com uso diário de medicamentos. Ao participar dos Fluxos de Cura, relata que foi curada e que hoje não necessita mais de medicamentos.',context:'Um relato pessoal de fé e esperança',youtubeUrl:'https://youtube.com/shorts/QsXfDiwOD2g',publicationAuthorized:true},
 {id:'stefanny',videoSource:'youtube',mp4Url:'https://cxbgtgeetxgbcololdju.supabase.co/storage/v1/object/public/testemunhos/Stefanny.mp4',name:'Stefanny',description:'Após o diagnóstico de ovários policísticos e a perda de uma gestação, Stefanny conta que serviu na organização dos Fluxos de Cura e pediu oração ao pastor. No mês seguinte, descobriu a gravidez de sua filha — uma notícia que compartilha como um testemunho de fé e esperança.',context:'Uma história de esperança e maternidade',youtubeUrl:'https://youtube.com/shorts/TlnKxb9ZT2g?feature=share',publicationAuthorized:true},
 {id:'recomeco',videoSource:'youtube',mp4Url:'https://cxbgtgeetxgbcololdju.supabase.co/storage/v1/object/public/testemunhos/Samira.mp4',name:'Samira',description:'Depois de enfrentar depressão, ansiedade e um período de profundo sofrimento, Samira compartilha uma mudança de vida a partir do contato com a Palavra de Deus. Uma história sobre o amor de Deus, esperança e recomeço.',context:'Relato pessoal de transformação',youtubeUrl:'https://youtu.be/EctQzPu5W7M',publicationAuthorized:true},
];

// DEV is a Vite compile-time constant: these records are removed from production.
const demoTestimonials:Testimonial[]=import.meta.env.DEV?[
 {id:'demo-ana',name:'Ana — pessoa fictícia',description:'Espaço reservado para um breve relato de fé e esperança. Este texto serve apenas para avaliar a composição da seção.',context:'Demonstração de conteúdo · 01',youtubeUrl:'',isDemo:true},
 {id:'demo-marcos',name:'Marcos — pessoa fictícia',description:'Aqui entrará um resumo do testemunho autorizado, com as informações que você fornecer. Nenhuma história real está sendo apresentada.',context:'Demonstração de conteúdo · 02',youtubeUrl:'',isDemo:true},
 {id:'demo-beatriz',name:'Beatriz — pessoa fictícia',description:'Uma prévia de como nome, vídeo e contexto vão aparecer juntos. O conteúdo definitivo será incluído após a revisão dos materiais.',context:'Demonstração de conteúdo · 03',youtubeUrl:'',isDemo:true},
]:[];

export function visibleTestimonials(items:Testimonial[],allowDemo:boolean):Testimonial[]{
 const ids=new Set<string>();
 return items.filter(item=>{
  if(!item.id||ids.has(item.id))return false;
  const visible=item.isDemo===true?allowDemo:item.publicationAuthorized===true&&(item.videoSource==='mp4'?!!publicMp4Url(item.mp4Url):!!youtubeVideoId(item.youtubeUrl));
  if(visible)ids.add(item.id);
  return visible;
 });
}
export const testimonials=visibleTestimonials(approvedTestimonials.length?approvedTestimonials:demoTestimonials,import.meta.env.DEV);
