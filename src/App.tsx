import {useEffect,useRef,useState} from 'react';
import {config,mapsUrl} from './config';
import {getConsent,setConsent,startAnalytics,track} from './analytics';
import GroupButton from './components/GroupButton';
import CampaignVisual from './components/CampaignVisual';
import RegistrationModal from './components/RegistrationModal';
import type {RegistrationHandle} from './components/RegistrationModal';
import PrivacyNotice from './components/PrivacyNotice';
import Brand from './components/Brand';
import TestimonialsCarousel from './components/TestimonialsCarousel';

export default function App(){
 const [consentOpen,showConsent]=useState(false);
 const registration=useRef<RegistrationHandle>(null);
 const privacy=useRef<HTMLDialogElement>(null);
 useEffect(()=>{startAnalytics();if(!getConsent()&&(config.analytics.ga4Id||config.analytics.metaPixelId))showConsent(true)},[]);
 const openRegistration=(placement:string)=>registration.current?.open(placement);
 const choose=(v:'accepted'|'declined')=>{setConsent(v);showConsent(false)};

 return <>
  <a className="skip" href="#conteudo">Pular para o conteúdo</a>
  <header className="topbar wrap">
   <Brand/>
   <nav className="header-nav" aria-label="Navegação principal"><a className="header-link" href="#encontro">O encontro</a><a className="header-link" href="#sobre">Testemunhos</a><a className="header-centers" href="/centros-de-cura/">Faça um centro de cura <span aria-hidden="true">↗</span></a><button className="header-register" type="button" onClick={()=>openRegistration('header')}>Quero participar <span aria-hidden="true">→</span></button></nav>
  </header>
  <main id="conteudo">
   <section className="hero" aria-labelledby="event-title">
    <div className="hero-atmosphere" aria-hidden="true"/>
    <div className="hero-inner wrap">
     <CampaignVisual/>
     <div className="hero-copy">
      <p className="eyebrow hero-eyebrow"><span/> UM ENCONTRO PRESENCIAL EM CAUCAIA</p>
      <h1 className="event-title" id="event-title"><span className="title-fluxos">FLUXOS</span><span className="title-second"><small>DE</small><span>CURA</span></span></h1>
      <p className="hero-tagline">{config.heroTitle}</p>
      <div className="hero-details">
       <div className="hero-date"><span className="detail-label">{config.date.weekday}</span><time dateTime={config.date.iso}>{config.date.day} <span>de {config.date.month}</span></time></div>
       <div className="hero-time"><span className="detail-label">ÀS</span><strong>{config.time}</strong></div>
      </div>
      <p className="hero-address"><span aria-hidden="true">⌖</span><span><strong>RUA TAMPICO, 440 — CAUCAIA</strong><small>{config.church}</small></span></p>
      <GroupButton placement="hero" onRegister={openRegistration}/>
      <p className="button-note">{config.groupHint}</p>
      <p className="host-note">Encontro local com o <strong>{config.localHost}</strong>.</p>
     </div>
    </div>
    <div className="hero-bottom wrap"><p>{config.participationNote}</p><a href="#experiencia" aria-label="Conheça o encontro">CONHEÇA O ENCONTRO <span aria-hidden="true">↓</span></a></div>
   </section>

   <section className="experience section" id="experiencia">
    <div className="wrap experience-grid">
     <div><h2>Uma experiência<br/>de <em>fé e esperança.</em></h2></div>
     <div className="experience-copy"><span className="small-star" aria-hidden="true">✦</span><p className="lead">Há momentos que nos convidam<br className="desktop"/> a parar. A ouvir. A crer.</p><p>{config.heroDescription}</p><p>Venha como está. Traga alguém especial e viva esse tempo de comunhão conosco.</p></div>
    </div>
   </section>

   <TestimonialsCarousel onRegister={openRegistration}/>

   <section className="meeting section" id="encontro">
    <div className="wrap"><div className="meeting-grid">
     <div className="meeting-date"><span className="meeting-day">{config.date.day}</span><div><span>DE {config.date.month.toUpperCase()}</span><strong>{config.date.weekday.toUpperCase()} <span>—</span> {config.time.toUpperCase()}</strong><small>{config.year} · {config.timezone}</small></div></div>
     <div className="meeting-location"><h2>{config.church}</h2><p>Rua Tampico, 440<br/>Caucaia, Ceará</p><a className="button button-outline" href={mapsUrl} target="_blank" rel="noopener noreferrer" onClick={()=>track('maps_click','meeting')}>Como chegar <span aria-hidden="true">→</span></a></div>
    </div></div>
   </section>

   <section className="final-cta"><div className="wrap"><p className="eyebrow">{config.localDate.toUpperCase()} · {config.time.toUpperCase()} · CAUCAIA</p><h2>Um encontro de fé.<br/>Um convite <em>para você.</em></h2><p>Prepare-se para os Fluxos de Cura.<br/>Inscreva-se e receba acesso ao grupo exclusivo do encontro.</p><GroupButton placement="footer" onRegister={openRegistration}>Quero participar dos Fluxos de Cura</GroupButton></div></section>
  </main>

  <footer className="footer wrap"><div><Brand/><p>{config.address}</p></div><div className="footer-contacts"><a className="instagram-link" href={config.instagram} target="_blank" rel="noopener noreferrer" onClick={()=>track('instagram_click','footer')}>{config.instagramHandle} ↗</a><a className="whatsapp-link" href={config.contactWhatsappUrl} target="_blank" rel="noopener noreferrer" onClick={()=>track('contact_whatsapp_click','footer')}>WhatsApp {config.churchPhone} <span aria-hidden="true">↗</span></a></div><div className="footer-meta"><span>{config.name}</span><button className="plain" onClick={()=>privacy.current?.showModal()}>Privacidade</button></div></footer>
  <div className="mobile-cta"><span>{config.date.day} {config.date.monthShort} · {config.time.toUpperCase()}<small>R. Tampico, 440<br/>Caucaia</small></span><GroupButton placement="mobile_fixed" onRegister={openRegistration}/></div>

  <RegistrationModal ref={registration}/>
  <dialog ref={privacy} className="modal" aria-labelledby="privacy-dialog-title"><h2 id="privacy-dialog-title">Sua privacidade</h2><PrivacyNotice/><p>Medição opcional: quando configurada, utiliza Meta Pixel e Google Analytics somente após sua escolha. Podemos medir visitas, origem da campanha e cliques. Um clique no convite não confirma entrada no grupo.</p><p>Sua preferência é guardada neste navegador. Você pode alterá-la abaixo. Dados de medição são tratados pelos respectivos provedores conforme suas políticas.</p><button className="plain" onClick={()=>{privacy.current?.close();showConsent(true)}}>Alterar preferência de medição</button><button className="button" onClick={()=>privacy.current?.close()}>Fechar</button></dialog>
  {consentOpen&&<aside className="consent" aria-label="Preferências de privacidade"><p>Podemos usar medição opcional para entender visitas e cliques da campanha?</p><div><button onClick={()=>choose('declined')}>Recusar</button><button onClick={()=>choose('accepted')}>Aceitar medição</button></div></aside>}
 </>;
}
