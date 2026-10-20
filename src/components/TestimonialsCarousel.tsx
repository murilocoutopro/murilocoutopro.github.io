import {useRef,useState} from 'react';
import type {KeyboardEvent,TouchEvent} from 'react';
import {testimonials} from '../data/testimonials';
import GroupButton from './GroupButton';
import TestimonialVideo from './TestimonialVideo';
import '../styles/testimonials.css';

export default function TestimonialsCarousel({onRegister}:{onRegister:(placement:string)=>void}){
 const [index,setIndex]=useState(0);
 const touch=useRef<{x:number;y:number}|null>(null);
 const total=testimonials.length;
 if(!total)return null; // No demo or unauthorized story can reach production.
 const current=testimonials[index];
 const move=(delta:number)=>setIndex(value=>(value+delta+total)%total);
 const keyboard=(event:KeyboardEvent<HTMLElement>)=>{
  // Do not take the arrow keys from the player, links, or native controls.
  if(event.target!==event.currentTarget)return;
  if(event.key==='ArrowRight'){event.preventDefault();move(1)}
  if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}
  if(event.key==='Home'){event.preventDefault();setIndex(0)}
  if(event.key==='End'){event.preventDefault();setIndex(total-1)}
 };
 const start=(event:TouchEvent)=>{if(event.touches.length===1)touch.current={x:event.touches[0].clientX,y:event.touches[0].clientY};else touch.current=null};
 const end=(event:TouchEvent)=>{
  const from=touch.current;touch.current=null;if(!from||event.changedTouches.length!==1)return;
  const dx=event.changedTouches[0].clientX-from.x,dy=event.changedTouches[0].clientY-from.y;
  if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4)move(dx<0?1:-1);
 };
 return <section className="testimonials section" id="sobre" aria-labelledby="testimonials-title">
  <div className="wrap testimonials-wrap">
   <header className="testimonials-heading"><h2 id="testimonials-title">Histórias reais.<br/><em>Fé que inspira.</em></h2><p>Conheça testemunhos compartilhados durante os Fluxos de Cura.</p></header>
   {current.isDemo&&<p className="testimonials-demo-banner">EXEMPLO DEMONSTRATIVO — NÃO PUBLICAR <span>Prévia de layout. Nomes e textos fictícios; nenhum testemunho real.</span></p>}
   <div className="testimonials-stage" role="region" aria-roledescription="carrossel" aria-label="Testemunhos em vídeo. Use as setas do teclado para navegar." tabIndex={0} onKeyDown={keyboard} onTouchStart={start} onTouchEnd={end} onTouchCancel={()=>{touch.current=null}}>
    {/* Replacing this keyed subtree destroys the previous iframe immediately. */}
    <div className="testimonials-slide" key={current.id} role="group" aria-roledescription="slide" aria-label={`${index+1} de ${total}`}>
     <TestimonialVideo key={current.id+current.youtubeUrl} testimonial={current}/>
     <div className="testimony-copy"><span className="testimony-quote" aria-hidden="true">“</span><h3>{current.name}</h3><p className="testimony-description">{current.description}</p><span className="testimony-rule" aria-hidden="true"/></div>
    </div>
    <nav className="testimonials-controls" aria-label="Navegar pelos testemunhos">
     <span className="testimony-counter" aria-live="polite" aria-atomic="true"><strong>{String(index+1).padStart(2,'0')}</strong><span>/ {String(total).padStart(2,'0')}</span><span className="sr-testimony"> — {current.name}</span></span>
     <div className="testimony-dots">{testimonials.map((item,i)=><button type="button" key={item.id} aria-label={`Ver testemunho ${i+1}`} aria-current={i===index?'true':undefined} onClick={()=>setIndex(i)}><span/></button>)}</div>
     <div className="testimony-arrows"><button type="button" aria-label="Testemunho anterior" disabled={total<2} onClick={()=>move(-1)}>←</button><button type="button" aria-label="Próximo testemunho" disabled={total<2} onClick={()=>move(1)}>→</button></div>
    </nav>
   </div>
   <div className="testimonials-invite"><p>VENHA VIVER ESSE MOMENTO CONOSCO.</p><GroupButton placement="testimonials" onRegister={onRegister}/></div>
  </div>
 </section>;
}
