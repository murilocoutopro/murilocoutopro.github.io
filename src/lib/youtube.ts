/** Parse known YouTube URL shapes; never interpolate an arbitrary URL in an iframe. */
export function youtubeVideoId(value:string):string|null {
 try {
  const url=new URL(value.trim());
  if(url.protocol!=='https:'||url.username||url.password||url.port)return null;
  const host=url.hostname.toLowerCase();const parts=url.pathname.split('/').filter(Boolean);
  let id:string|null=null;
  if(host==='youtu.be'&&parts.length===1)id=parts[0];
  if(['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(host)){
   if(['shorts','embed'].includes(parts[0])&&parts.length===2)id=parts[1];
   else if(parts.length===1&&parts[0]==='watch')id=url.searchParams.get('v');
  }
  return id&&/^[A-Za-z0-9_-]{11}$/.test(id)?id:null;
 }catch{return null;}
}
export function youtubeEmbedUrl(value:string):string|null {
 const id=youtubeVideoId(value);
 return id?`https://www.youtube-nocookie.com/embed/${id}?autoplay=0&controls=1&playsinline=1&rel=0&hl=pt-BR`:null;
}
/** Only same-site covers load before consent. Avoid remote thumbnail tracking. */
export function localVideoCover(value?:string):string|null {
 return value&&/^\/(?!\/)/.test(value)&&!/[\\\u0000-\u001f]/.test(value)?value:null;
}
