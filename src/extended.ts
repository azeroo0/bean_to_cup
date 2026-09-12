import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clamp, lerp, seedRandom } from './math.js';
import { filmAssets } from './films.js';
gsap.registerPlugin(ScrollTrigger);
const art=(id:string)=>`<canvas class="beat-canvas" data-art="${id}" aria-hidden="true"></canvas>`;
const top=(n:string,title:string)=>`<div class="beat-label"><span>${n}</span><span>${title}</span></div>`;
export function mountExtended():void {
 document.querySelector('#hero')!.insertAdjacentHTML('afterend',`<section class="breathing-page" aria-labelledby="season-title"><p>BEFORE THE FIRST SIP</p><h2 id="season-title">A season of sun.<br />A little rain.<br /><i>A world within.</i></h2><div class="season-notes"><span>EARTH GIVES.</span><span>TIME SHAPES.</span><span>WE LISTEN.</span></div></section>`);
 document.querySelector('#harvest')!.insertAdjacentHTML('afterend',`<section class="extended-beat sorting-beat" id="sorting" aria-labelledby="sorting-title">${top('01.2','THE SORTING TABLE')}<div class="beat-intro"><h2 id="sorting-title">Every seed.<br /><i>A place.</i></h2><p>From the scattered harvest,<br />a quiet order emerges.</p></div><div class="sorting-field" aria-hidden="true">${Array.from({length:15},(_,i)=>`<img class="sorted-bean" src="/assets/bean.png" alt="" width="160" height="160" data-index="${i}" />`).join('')}</div><div class="beat-foot"><span>SCATTER → ALIGN → SELECT</span><span class="sort-count">15 / 15</span></div></section>`);
 document.querySelector('#roasting')!.insertAdjacentHTML('afterend',`<section class="crack-page" aria-labelledby="crack-title"><p>THE TURNING POINT</p><h2 id="crack-title">First<br /><i>crack.</i></h2><p class="crack-copy">A small break.<br />An entirely new character.</p><div class="crack-rule" aria-hidden="true"></div></section><section class="extended-beat grinding-beat" id="grinding" aria-labelledby="grinding-title">${top('02.2','THE GRIND')}${art('grind')}<div class="beat-intro"><h2 id="grinding-title">Break down.<br /><i>Open up.</i></h2><p>A thousand small beginnings.<br />Ready to meet the water.</p></div><img class="grind-bean" src="/assets/bean.png" alt="" width="1024" height="1024" /><div class="beat-foot"><span>ONE BEAN / A THOUSAND POSSIBILITIES</span><span>KEEP GOING ↓</span></div></section>`);
 document.querySelector('#brewing')!.insertAdjacentHTML('beforebegin',`<section class="extended-beat bloom-beat" id="bloom" aria-labelledby="bloom-title">${top('03.1','THE BLOOM')}${art('bloom')}<div class="beat-intro"><h2 id="bloom-title">Let it<br /><i>breathe.</i></h2><p>The first pour opens the surface.<br />Give the moment a little room.</p></div><div class="bloom-word" aria-hidden="true">bloom</div><div class="beat-foot"><span>POUR → OPEN → SETTLE</span><span>A MOMENT, EXPANDED.</span></div></section>`);
 document.querySelector('#finished')!.insertAdjacentHTML('afterend',`<section class="ritual" id="ritual" aria-labelledby="ritual-title"><div class="ritual-heading"><p>THE NEXT CHAPTER IS YOURS.</p><h2 id="ritual-title">Find your<br /><i>everyday.</i></h2></div><div class="ritual-controls" role="group" aria-label="Choose your coffee"><button type="button" data-ritual="filter" aria-pressed="true">01 / Filter</button><button type="button" data-ritual="espresso" aria-pressed="false">02 / Espresso</button><button type="button" data-ritual="latte" aria-pressed="false">03 / Latte</button></div><div class="ritual-details"><div class="ritual-number" aria-hidden="true">01</div><div class="ritual-result" aria-live="polite" aria-atomic="true"><h3>Room to slow down.</h3><p>A clear, unhurried cup. Let the morning unfold.</p><dl><div><dt>CHARACTER</dt><dd>Light & layered</dd></div><div><dt>YOUR MOMENT</dt><dd>The slow morning</dd></div></dl></div></div><a class="ritual-replay" href="#hero">Experience it again <span aria-hidden="true">↗</span></a></section>`);
}
export function setupExtended():()=>void {
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');let context:gsap.Context|undefined;
 const canvases=Array.from(document.querySelectorAll<HTMLCanvasElement>('.beat-canvas'));
 const progresses=new Map<HTMLCanvasElement,number>();
 const visible=new Map<HTMLCanvasElement,boolean>();
 const random=seedRandom(715);const grains=Array.from({length:650},()=>({x:random(),y:random(),r:random(),a:random()*Math.PI*2}));
 function paint(canvas:HTMLCanvasElement,p:number):void {
  progresses.set(canvas,p);
  // These grinding/bloom scenes only pin while near the viewport, so skip the per-grain draw work otherwise.
  if(visible.get(canvas)===false)return;
  const c=canvas.getContext('2d');if(!c)return;
  const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
  const mobile=w<768, cx=w*(mobile?.5:.67),cy=h*(mobile?.66:.53),count=mobile?390:650;
  if(canvas.dataset.art==='grind'){
   const t=clamp((p-.13)/.75);c.fillStyle='#c1936e';c.beginPath();
   grains.slice(0,count).forEach(g=>{
    const release=clamp((t-g.r*.2)/.8),fall=release*release;
    const x=cx+(g.x-.5)*lerp(25,w*.76,release);
    const y=lerp(h*.38+g.y*40,h*.84+g.y*h*.07,fall);
    const size=(1.1+g.r*2.1)*clamp(t*5);
    c.moveTo(x+size,y);c.ellipse(x,y,size,size*.72,g.a,0,Math.PI*2);
   });c.fill();
  }else{
   const radius=Math.min(w*(mobile?.42:.23),h*.3),expand=.78+Math.sin(p*Math.PI)*.19;
   const surface=c.createRadialGradient(cx,cy,0,cx,cy,radius);surface.addColorStop(0,'#99613c');surface.addColorStop(.78,'#4e2b19');surface.addColorStop(1,'#1c100a');
   c.fillStyle=surface;c.beginPath();c.arc(cx,cy,radius,0,Math.PI*2);c.fill();
   c.fillStyle='#cf9d67';c.beginPath();
   grains.slice(0,count).forEach(g=>{
    const d=Math.sqrt(g.r)*radius*.95*expand,x=cx+Math.cos(g.a)*d,y=cy+Math.sin(g.a)*d;
    const size=(.7+g.x*4)*(1+Math.sin(p*Math.PI)*1.7);
    c.moveTo(x+size,y);c.arc(x,y,size,0,Math.PI*2);
   });c.fill();
   c.strokeStyle='rgba(239,198,151,.45)';c.lineWidth=1.5;c.beginPath();
   for(let i=0;i<4;i++){const r=radius*clamp((p-i*.12)*1.4);c.moveTo(cx+r,cy);c.arc(cx,cy,r,0,Math.PI*2);}c.stroke();
  }
 }
 const observer=new ResizeObserver(()=>canvases.forEach(c=>paint(c,progresses.get(c)??0)));canvases.forEach(c=>observer.observe(c));
 const visibility=new IntersectionObserver(entries=>{
  for(const entry of entries){
   const canvas=entry.target as HTMLCanvasElement;
   visible.set(canvas,entry.isIntersecting);
   if(entry.isIntersecting)paint(canvas,progresses.get(canvas)??0);
  }
 },{rootMargin:'60% 0px'});
 canvases.forEach(c=>visibility.observe(c));
 // Media is optional and absent by default. No placeholder downloads or fabricated URLs.
 const filmCleanups:(()=>void)[]=[];
 for(const entry of filmAssets){
  if(!entry.src)continue;const section=document.getElementById(entry.section);if(!section)continue;
  const video=document.createElement('video');video.className='beat-film';video.muted=true;video.playsInline=true;video.preload='none';video.setAttribute('aria-hidden','true');if(entry.poster)video.poster=entry.poster;
  section.prepend(video);let wanted=0,loaded=false;
  const seek=()=>{if(video.readyState>=2&&!video.seeking&&Number.isFinite(video.duration)){video.currentTime=Math.min(wanted,Math.max(0,video.duration-.04));}};
  video.addEventListener('seeked',()=>{if(Math.abs(video.currentTime-wanted)>.08)seek();});
  const load=()=>{if(!loaded&&!media.matches){loaded=true;video.src=entry.src!;video.load();}};
  const ready=()=>{section.classList.add('film-ready');seek();};
  video.addEventListener('loadeddata',ready);video.addEventListener('error',()=>{section.classList.remove('film-ready');video.removeAttribute('src');});
  const st=ScrollTrigger.create({trigger:section,start:'top bottom',end:'bottom top',onEnter:load,onEnterBack:load,onUpdate:self=>{if(media.matches)return;wanted=self.progress*Math.max(0,(video.duration||0)-.04);if(Math.abs(video.currentTime-wanted)>.04)seek();}});
  if(st.isActive)load();filmCleanups.push(()=>{st.kill();video.remove();});
 }
 function build():void {
  context?.revert();context=gsap.context(()=>{
   if(media.matches)gsap.set('.crack-rule',{scaleX:1});
   else gsap.fromTo('.crack-rule',{scaleX:.05},{scaleX:1,ease:'none',scrollTrigger:{trigger:'.crack-page',start:'top 70%',end:'bottom 40%',scrub:true}});
   const sorting=document.querySelector<HTMLElement>('#sorting')!;
   const beans=Array.from(sorting.querySelectorAll<HTMLElement>('.sorted-bean'));
   if(media.matches){beans.forEach((bean,i)=>gsap.set(bean,{x:`${(i%5-2)*15}vw`,y:`${(Math.floor(i/5)-1)*15}vh`,rotation:i*7}));canvases.forEach(c=>paint(c,.72));return;}
   const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:sorting,start:'top top',end:'+=150%',pin:true,scrub:true,invalidateOnRefresh:true,onUpdate:self=>{sorting.querySelector('.sort-count')!.textContent=self.progress>.88?'01 / 15':'15 / 15';}}});
   beans.forEach((bean,i)=>{
    tl.fromTo(bean,{x:()=>Math.sin(i*4.17)*innerWidth*.36,y:()=>Math.cos(i*2.41)*innerHeight*.25,rotation:i*53},{x:()=>((i%5)-2)*Math.min(innerWidth*.145,175),y:()=>(Math.floor(i/5)-1)*Math.min(innerHeight*.14,120),rotation:25,duration:.58},0);
    if(i!==7)tl.to(bean,{y:()=>innerHeight*.72,opacity:0,duration:.24},.68+(i%3)*.025);
    else tl.to(bean,{x:0,y:0,scale:1.8,rotation:0,duration:.3},.7);
   });

   for(const canvas of canvases){
    const section=canvas.closest<HTMLElement>('.extended-beat')!;
    const model={p:0};const t=gsap.timeline({scrollTrigger:{trigger:section,start:'top top',end:canvas.dataset.art==='grind'?'+=150%':'+=120%',pin:true,scrub:true,onUpdate:self=>paint(canvas,self.progress)}});
    t.to(model,{p:1,duration:1,ease:'none'});
    if(canvas.dataset.art==='grind')t.to('.grind-bean',{scale:.1,rotation:95,opacity:0,duration:.36},.1);
    else t.fromTo('.bloom-word',{xPercent:25},{xPercent:-25,duration:1},0);
   }
  });ScrollTrigger.sort();ScrollTrigger.refresh();
 }
 build();media.addEventListener('change',build);
 const drinks={filter:{n:'01',title:'Room to slow down.',body:'A clear, unhurried cup. Let the morning unfold.',character:'Light & layered',moment:'The slow morning',bg:'#e8d3b0',ink:'#302416'},espresso:{n:'02',title:'Small cup. Full presence.',body:'A brief pause with a lasting impression.',character:'Bold & concentrated',moment:'The afternoon reset',bg:'#38241b',ink:'#fff2df'},latte:{n:'03',title:'A softer kind of morning.',body:'Coffee and milk, with a little room for comfort.',character:'Soft & rounded',moment:'A moment together',bg:'#c6a783',ink:'#2c2119'}};
 const buttons=Array.from(document.querySelectorAll<HTMLButtonElement>('[data-ritual]'));
 const ritual=document.querySelector<HTMLElement>('.ritual')!;
 function choose(event:Event):void {
  const button=event.currentTarget as HTMLButtonElement,key=button.dataset.ritual as keyof typeof drinks,d=drinks[key];
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  ritual.querySelector('.ritual-number')!.textContent=d.n;ritual.querySelector('h3')!.textContent=d.title;
  ritual.querySelector('.ritual-result p')!.textContent=d.body;
  const values=ritual.querySelectorAll('dd');values[0].textContent=d.character;values[1].textContent=d.moment;
  gsap.killTweensOf(ritual);gsap.to(ritual,{backgroundColor:d.bg,color:d.ink,duration:media.matches?0:.45,ease:'power2.out'});
 }
 buttons.forEach(b=>b.addEventListener('click',choose));
 return ()=>{context?.revert();observer.disconnect();visibility.disconnect();media.removeEventListener('change',build);buttons.forEach(b=>b.removeEventListener('click',choose));gsap.killTweensOf(ritual);filmCleanups.forEach(fn=>fn());};
}
