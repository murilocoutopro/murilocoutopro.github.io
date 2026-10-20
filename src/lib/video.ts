/** Public MP4 URLs only; no SDK, credentials or download proxy. */
export function publicMp4Url(value?:string):string|null{
 try{const url=new URL(value??'');return url.protocol==='https:'&&!url.username&&!url.password&&/\.mp4$/i.test(url.pathname)?url.href:null}catch{return null}
}
