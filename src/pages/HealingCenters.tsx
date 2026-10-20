import {useEffect,useState} from 'react';
import {config} from '../config';
import {healingCentersConfig as centers} from '../healingCentersConfig';
import '../styles/healing-centers.css';

export default function HealingCenters(){
 const [message,setMessage]=useState('');
 const [manualUrl,setManualUrl]=useState('');
 const [sharing,setSharing]=useState(false);
 useEffect(()=>{const previous=document.title;document.title=centers.title;return()=>{document.title=previous}},[]);
 async function copyAddress(){
  const url=new URL('/centros-de-cura',location.origin).href;setManualUrl('');
  try{await navigator.clipboard.writeText(url);setMessage('Link copiado. Envie para alguém especial.')}catch{setManualUrl(url);setMessage('Copie o endereço abaixo para compartilhar.')} 
 }
 async function invite(){
  if(sharing)return;setSharing(true);setMessage('');setManualUrl('');
  const url=new URL('/centros-de-cura',location.origin).href;
  try{
   if(navigator.share){
    try{await navigator.share({title:centers.title,text:centers.shareText,url});setMessage('Convite compartilhado.');return}
    catch(error){if(error instanceof DOMException&&error.name==='AbortError')return}
   }
   await copyAddress();
  }finally{setSharing(false)}
 }
 const shareButton=(className='button button-outline')=><button className={className} type="button" onClick={invite} disabled={sharing}>Convide alguém <span aria-hidden="true">↗</span></button>;
 return <div className="centers-page">
  <a className="skip" href="#centers-content">Pular para o conteúdo</a>
  <header className="centers-header wrap"><a href="/" aria-label="Christ Embassy Caucaia — página inicial"><img src="/assets/christ-embassy-caucaia-dourada.png" alt="Christ Embassy Caucaia / Loveworld" width="398" height="104"/></a><nav aria-label="Navegação dos Centros de Cura"><a href="/">Encontro em Caucaia <span aria-hidden="true">↗</span></a><a href="#como-organizar">Como organizar</a></nav></header>
  <main id="centers-content">
   <section className="centers-hero" aria-labelledby="centers-title">
    <div className="centers-hero-photo" aria-hidden="true"><img src={config.images.campaign} alt="" width="1152" height="2048" fetchPriority="high"/></div>
    <div className="centers-hero-light" aria-hidden="true"/>
    <div className="wrap centers-hero-inner"><p className="centers-kicker">FLUXOS DE CURA 2026</p><h1 id="centers-title">A fé pode<br/>reunir pessoas.<br/><em>Comece na<br className="centers-mobile-break"/> sua casa.</em></h1><p className="centers-hero-intro">Faça da sua casa ou igreja<br/>um <strong>Centro de Cura.</strong></p><p className="centers-hero-copy">Abra as portas. Convide pessoas. Acompanhe os Fluxos de Cura e compartilhe um tempo de oração, Palavra de Deus e esperança.</p><a className="button" href="#como-organizar">Descubra como organizar <span aria-hidden="true">↓</span></a></div>
    <div className="wrap centers-airtime"><div><strong>23 · 24 · 25</strong><span>OUTUBRO DE 2026</span></div><div><strong>{centers.time}</strong><span>HORÁRIO DE BRASÍLIA</span></div><div><strong>{centers.channel}</strong><span>TRANSMISSÃO DUBLADA EM PORTUGUÊS</span></div></div>
   </section>
   <section className="centers-introduction wrap"><h2>Um lugar de encontro.<br/><em>Uma oportunidade de esperança.</em></h2><div><p>Um Centro de Cura é um espaço onde pessoas se reúnem para acompanhar a transmissão dos Fluxos de Cura, participar das orações e ouvir a Palavra de Deus.</p><p>Pode ser na sua sala, na sua igreja ou em outro ambiente adequado. O convite é simples: prepare o lugar e receba as pessoas.</p></div></section>
   <section className="centers-guide" id="como-organizar" aria-labelledby="centers-guide-title"><div className="wrap"><div className="centers-guide-heading"><h2 id="centers-guide-title">Prepare o espaço.<br/><em>Compartilhe a fé.</em></h2><p>Quatro passos para organizar<br/>o seu Centro de Cura.</p></div><ol className="centers-steps">{centers.steps.map((step,index)=><li key={step.title}><span className="centers-step-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol><aside className="centers-prayer-note"><h3>Durante a oração</h3><p>O responsável pelo Centro poderá orar com os presentes e, quando apropriado, realizar imposição de mãos conforme as orientações ministeriais, sempre respeitando o consentimento de cada pessoa.</p></aside></div></section>
   <section className="centers-broadcast wrap"><div><p className="centers-kicker">RESERVE ESSE MOMENTO</p><h2>Três dias.<br/><em>Um convite para reunir.</em></h2></div><div className="centers-broadcast-details"><p>{centers.dates}</p><strong>Às {centers.time}</strong><span>{centers.timezone}</span><h3>{centers.channel}</h3><p>A transmissão será disponibilizada dublada em português pelo canal Loveworld Brasil, a partir das 14h.</p></div></section>
   <section className="centers-final"><div className="wrap"><span className="centers-spark" aria-hidden="true">✦</span><h2>O próximo convite<br/>pode partir <em>de você.</em></h2><p>Pense em alguém com quem você gostaria de compartilhar esse momento.<br/>Envie o convite e preparem-se para participar juntos.</p>{shareButton('button')}<button type="button" className="centers-copy-button" onClick={copyAddress}>Copiar link</button><p className="centers-share-status" role="status" aria-live="polite">{message}</p>{manualUrl&&<label className="centers-copy-label">Endereço para compartilhar<input readOnly value={manualUrl} onFocus={event=>event.currentTarget.select()}/></label>}</div></section>
  </main>
  <footer className="centers-footer wrap"><a href="/" className="centers-footer-home">Christ Embassy Caucaia<span>Fluxos de Cura 2026</span></a><div><a href={config.instagram} target="_blank" rel="noopener noreferrer">{config.instagramHandle} ↗</a><a href={config.contactWhatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp {config.churchPhone} ↗</a></div><p>{config.address}</p></footer>
 </div>;
}
