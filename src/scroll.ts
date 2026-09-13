import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { blendAtmosphere, chapters } from './chapters.js';
import { clamp, roastingTemperature } from './math.js';
import { Cinema } from './cinematic.js';
import type { ParticleSystem } from './particles.js';
gsap.registerPlugin(ScrollTrigger);
interface Binding { element:HTMLElement; trigger:ScrollTrigger; }
export interface StoryController { setPaused(paused:boolean):void;destroy():void; }
export function setupScroll(particles:ParticleSystem|null):StoryController {
 const ids=['hero',...chapters.map(c=>c.id)];
 const elements=ids.map(id=>document.getElementById(id)!);
 const links=Array.from(document.querySelectorAll<HTMLAnchorElement>('.site-header nav a'));
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 const cinema=new Cinema();
 const button=document.querySelector<HTMLButtonElement>('#motion-toggle')!;
 const temperature=document.querySelector<HTMLElement>('#temperature-value')!;
 const progressBar=document.querySelector<HTMLElement>('#journey-progress')!;
 const chapterNumber=document.querySelector<HTMLElement>('#journey-number')!;
 const band=document.querySelector<HTMLElement>('.marquee-band')!;
 const outro=document.getElementById('outro')!;
 const small=window.matchMedia('(max-width:767px)');
 let reduced=media.matches,paused=false,disposed=false;
 let bindings:Binding[]=[],ranges:{start:number;end:number}[]=[];
 let animation:gsap.Context|undefined,decoration:gsap.Context|undefined;
 let travel:gsap.core.Tween|undefined,refreshFrame=0;
 let outroTop=Infinity,bandTop=Infinity,bandHeight=1;
 let dirty=false;
 const requestSync=()=>{dirty=true;};
 const flush=()=>{if(dirty){dirty=false;sync();}};
 function sync():void {
  if(!ranges.length)return;
  const y=window.scrollY;
  let index=0;for(let i=0;i<ranges.length;i++)if(y>=ranges[i].start-1)index=i;
  const r=ranges[index],p=clamp((y-r.start)/Math.max(1,r.end-r.start));
  const chapter=Math.max(0,index-1);
  const blend=reduced?1:clamp(p/.65);
  const scene=index<=1?chapters[0].palette:blendAtmosphere(chapters[Math.max(0,chapter-1)].palette,chapters[chapter].palette,blend);
  const bp=(y+window.innerHeight*.5-bandTop)/bandHeight;
  const dark=bp>0 && bp<1?Math.sin(bp*Math.PI)*.65:0;
  particles?.setScene(scene,dark,p);
  document.documentElement.style.setProperty('--reading-shade',String((1-scene.plume)*.68));
  const out=clamp((y+window.innerHeight*.65-outroTop)/(window.innerHeight*.5));
  cinema.render(index,p,reduced,1-out);
  const roast=ranges[2];temperature.textContent=String(roastingTemperature((y-roast.start)/Math.max(1,roast.end-roast.start)));
  const total=clamp((y-ranges[0].start)/(ranges[4].end-ranges[0].start));
  progressBar.style.transform=`scaleY(${total})`;chapterNumber.textContent=String(index).padStart(2,'0');
  links.forEach((link,i)=>{if(i+1===index)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');});
  document.body.classList.toggle('light-scene',index===4 && (reduced || p>.28));
 }
 function measure():void {
  ranges=bindings.map(b=>({start:b.trigger.start,end:b.trigger.end}));
  bandTop=band.getBoundingClientRect().top+window.scrollY;bandHeight=band.offsetHeight;
  outroTop=outro.getBoundingClientRect().top+window.scrollY;sync();
 }
 function decorative():void {
  decoration?.revert();
  decoration=gsap.context(()=>{
   if(reduced || paused)return;
   gsap.to('.scroll-arrow',{y:8,duration:1.3,repeat:-1,yoyo:true,ease:'sine.inOut'});
   const tween=gsap.to('.marquee-track',{xPercent:-50,duration:16,repeat:-1,ease:'none',paused:true});
   ScrollTrigger.create({trigger:band,start:'top bottom',end:'bottom top',onToggle:self=>tween.paused(!self.isActive)});
  });
 }
 function build():void {
  decoration?.revert();animation?.revert();bindings=[];ranges=[];
  reduced=media.matches;document.body.classList.toggle('reduced-motion',reduced);
  animation=gsap.context(()=>{
   elements.forEach((element,index)=>{
    if(reduced){
     const trigger=ScrollTrigger.create({trigger:element,start:'top center',end:'bottom center'});bindings.push({element,trigger});return;
    }
    const lengths=small.matches?[95,165,170,175,120]:[130,230,240,250,170];
    const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{id:ids[index],trigger:element,start:'top top',end:`+=${lengths[index]}%`,pin:true,scrub:true,invalidateOnRefresh:true,anticipatePin:1}});
    if(index===0){
     tl.to('.word-bean',{xPercent:-110,rotation:-8,duration:1},0).to('.word-cup',{xPercent:100,rotation:8,duration:1},0).to('.hero-note',{opacity:0,duration:.2},.1);
     tl.fromTo('.hero-frame',{clipPath:'inset(8% 5% 8% 5% round 44%)'},{clipPath:'inset(-2% -2% -2% -2% round 0%)',duration:.7},0);
    }else{
     const copy=element.querySelector('.chapter-copy');
     const reveal=index===4?.36:index===2?.14:.02;
     tl.fromTo(element.querySelector('h2'),{clipPath:'inset(100% 0 0 0)',y:45},{clipPath:'inset(0% 0 0 0)',y:0,duration:.2},reveal);
     tl.fromTo(element.querySelector('.chapter-description'),{opacity:0,y:20},{opacity:1,y:0,duration:.16},reveal+.12);
     if(index!==4)tl.to(copy,{opacity:0,y:-65,duration:.16},index===1?.3:index===2?.32:.34);
     tl.fromTo(element.querySelector('.chapter-meter span'),{scaleX:0},{scaleX:1,duration:1},0);
     if(index===1){tl.fromTo('.specimen-label',{opacity:1},{opacity:0,duration:.15},.38);tl.fromTo('.harvest-panorama',{x:'85vw'},{x:'-185vw',duration:.82},.18);tl.fromTo('.field-coordinate',{opacity:0},{opacity:1,duration:.1},.4);tl.to('.field-coordinate',{opacity:0,duration:.1},.86);}
     if(index===2){tl.fromTo('.roast-word',{xPercent:8,rotation:-14},{xPercent:-58,rotation:10,duration:1},0);tl.fromTo('.temperature',{opacity:0,y:20},{opacity:1,y:0,duration:.15},.2);}
     if(index===3){tl.fromTo('.pour-words span',{opacity:0,y:110,rotation:6},{opacity:1,y:0,rotation:0,stagger:.1,duration:.12},.34);tl.to('.pour-words',{scale:2.4,yPercent:-65,opacity:0,duration:.25},.65);}
     if(index===4){tl.fromTo(copy,{xPercent:-20},{xPercent:0,duration:.35},.36);tl.fromTo('.cup-caption',{opacity:0},{opacity:1,duration:.2},.65);}
    }
    bindings.push({element,trigger:tl.scrollTrigger!});
   });
  });
  ScrollTrigger.refresh();measure();updateMotion();
 }
 function updateMotion():void {
  particles?.setAnimated(!reduced && !paused);
  cinema.setAnimated(!reduced && !paused);
  button.disabled=reduced;button.setAttribute('aria-pressed',String(reduced || paused));
  button.innerHTML=reduced?'Reduced motion':paused?'Resume motion <span aria-hidden="true">▷</span>':'Pause motion <span aria-hidden="true">Ⅱ</span>';
  decorative();sync();
 }
 const stopTravel=()=>{travel?.kill();travel=undefined;};
 const key=(event:KeyboardEvent)=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))stopTravel();};
 function navigate(event:MouseEvent):void {
  if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button!==0)return;
  const a=(event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');if(!a)return;
  const id=a.hash.slice(1),element=document.getElementById(id);if(!element)return;
  const index=ids.indexOf(id);event.preventDefault();stopTravel();
  const fraction=index===4?.7:index===0?0:.35;
  const target=index>=0?(reduced?element.getBoundingClientRect().top+window.scrollY-110:ranges[index].start+(ranges[index].end-ranges[index].start)*fraction):element.getBoundingClientRect().top+window.scrollY;
  history.replaceState(null,'',`#${id}`);
  const finish=()=>{const h=element.querySelector<HTMLElement>('h1,h2')??element;h.setAttribute('tabindex','-1');h.focus({preventScroll:true});};
  if(reduced){window.scrollTo(0,target);finish();return;}
  const position={y:window.scrollY};travel=gsap.to(position,{y:target,duration:1.1,ease:'power2.out',onUpdate:()=>window.scrollTo(0,position.y),onComplete:finish});
 }
 const click=()=>{paused=!paused;updateMotion();};
 const change=()=>{stopTravel();build();};
 window.addEventListener('scroll',requestSync,{passive:true});window.addEventListener('wheel',stopTravel,{passive:true});window.addEventListener('touchstart',stopTravel,{passive:true});
 gsap.ticker.add(flush);
 document.addEventListener('keydown',key);document.addEventListener('click',navigate);button.addEventListener('click',click);media.addEventListener('change',change);small.addEventListener('change',change);
 ScrollTrigger.addEventListener('refresh',measure);build();
 document.fonts.ready.then(()=>{if(!disposed)refreshFrame=requestAnimationFrame(()=>ScrollTrigger.refresh());});
 const initial=ids.indexOf(location.hash.slice(1));
 if(initial>=0){const fraction=initial===4?.7:initial===0?0:.35;window.scrollTo(0,reduced?elements[initial].offsetTop-110:ranges[initial].start+(ranges[initial].end-ranges[initial].start)*fraction);sync();}
 return {setPaused(value:boolean){paused=value;updateMotion();},destroy(){cinema.destroy();disposed=true;stopTravel();cancelAnimationFrame(refreshFrame);gsap.ticker.remove(flush);ScrollTrigger.removeEventListener('refresh',measure);decoration?.revert();animation?.revert();window.removeEventListener('scroll',requestSync);window.removeEventListener('wheel',stopTravel);window.removeEventListener('touchstart',stopTravel);document.removeEventListener('keydown',key);document.removeEventListener('click',navigate);button.removeEventListener('click',click);media.removeEventListener('change',change);small.removeEventListener('change',change);}};
}
