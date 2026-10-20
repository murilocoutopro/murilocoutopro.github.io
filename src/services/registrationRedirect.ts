import {groupUrl} from '../config';
import {track} from '../analytics';
export function redirectAfterSaved(saved:boolean,placement:string,navigate:(url:string)=>void=url=>window.location.assign(url)):boolean{
 const url=groupUrl();if(!saved||!url)return false;
 track('whatsapp_redirect',placement);try{navigate(url);return true;}catch{return false;}
}
