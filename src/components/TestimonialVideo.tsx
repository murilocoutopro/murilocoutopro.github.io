import {useEffect,useRef,useState} from 'react';
import type {Testimonial} from '../data/testimonials';
import {youtubeEmbedUrl} from '../lib/youtube';
import {publicMp4Url} from '../lib/video';

function Mp4Video({url,name,poster}:{url:string;name:string;poster?:string}){
 const ref=useRef<HTMLVideoElement>(null);
 const [loading,setLoading]=useState(true);
 const [failed,setFailed]=useState(false);
 const [attempt,setAttempt]=useState(0);
 useEffect(()=>{const video=ref.current;if(video){video.src=url;video.load()}return()=>{if(video){video.pause();video.removeAttribute('src');video.load()}}},[url,attempt]);
 return <>
  <video key={url+attempt} ref={ref} src={url} poster={poster} aria-label={`Testemunho de ${name}`} controls playsInline preload="metadata" onLoadedMetadata={()=>setLoading(false)} onCanPlay={()=>setLoading(false)} onPlaying={()=>setLoading(false)} onWaiting={()=>setLoading(true)} onSeeking={()=>setLoading(true)} onSeeked={()=>setLoading(false)} onError={()=>{setLoading(false);setFailed(true)}}/>
  {loading&&!failed&&<div className="testimony-video-status" role="status">Carregando vídeo…</div>}
  {failed&&<div className="testimony-video-status is-error" role="alert"><p>Não foi possível carregar este vídeo.</p><button type="button" onClick={()=>{setFailed(false);setLoading(true);setAttempt(v=>v+1)}}>Tentar novamente</button></div>}
 </>;
}
export default function TestimonialVideo({testimonial}:{testimonial:Testimonial}){
 const mp4=testimonial.videoSource==='mp4'?publicMp4Url(testimonial.mp4Url):null;
 const embed=testimonial.videoSource!=='mp4'?youtubeEmbedUrl(testimonial.youtubeUrl):null;
 return <div className="testimony-media">
  <div className="testimony-player is-loaded">
   {mp4?<Mp4Video key={mp4} url={mp4} name={testimonial.name} poster={testimonial.thumbnailUrl}/>:embed?<iframe src={embed} title={`Testemunho de ${testimonial.name}`} width="315" height="560" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen/>:<div className="testimony-facade"><p className="testimony-unconfigured">Vídeo não configurado</p></div>}
  </div>
  {embed&&<p className="testimony-video-privacy">YouTube · <a href="https://policies.google.com/privacy?hl=pt-BR" target="_blank" rel="noopener noreferrer">Privacidade ↗</a></p>}
 </div>;
}
