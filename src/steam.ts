import gsap from 'gsap';
import { clamp } from './math.js';

/** Cup-local steam: one batched ribbon path, with a shared height fade. */
export class CupSteam {
 private canvas=document.createElement('canvas');
 private ctx:CanvasRenderingContext2D|null;
 private width=0; private height=0; private phase=2.4;
 private x=0; private y=0; private size=0; private opacity=0;
 private animated=true; private reduced=false; private running=false;
 private pointer={x:-10000,y:-10000}; private drift=0;
 private fine=window.matchMedia('(hover: hover) and (pointer: fine)');
 private observer:ResizeObserver;
 constructor(root:HTMLElement){
  this.canvas.className='cup-steam';this.canvas.setAttribute('aria-hidden','true');
  root.append(this.canvas);this.ctx=this.canvas.getContext('2d');
  this.observer=new ResizeObserver(this.resize);this.observer.observe(this.canvas);
  window.addEventListener('pointermove',this.move,{passive:true});
  document.addEventListener('pointerout',this.leave);window.addEventListener('blur',this.resetPointer);
  document.addEventListener('visibilitychange',this.schedule);
 }
 private resize=()=>{
  this.width=this.canvas.clientWidth;this.height=this.canvas.clientHeight;
  const dpr=Math.min(window.devicePixelRatio||1,2);
  this.canvas.width=Math.round(this.width*dpr);this.canvas.height=Math.round(this.height*dpr);
  this.ctx?.setTransform(dpr,0,0,dpr,0,0);this.draw();
 };
 private move=(event:PointerEvent)=>{
  if(this.fine.matches && event.pointerType==='mouse' && !this.reduced && this.animated){
   this.pointer.x=event.clientX;this.pointer.y=event.clientY;
  }
 };
 private resetPointer=()=>{this.pointer.x=-10000;this.pointer.y=-10000;};
 private leave=(event:PointerEvent)=>{if(!event.relatedTarget)this.resetPointer();};
 setPose(x:number,y:number,size:number,opacity:number,reduced:boolean):void{
  this.x=x;this.y=y-size*.13;this.size=size;this.opacity=clamp(opacity);this.reduced=reduced;
  if(reduced){this.phase=2.4;this.drift=0;this.resetPointer();}
  this.schedule();this.draw();
 }
 setAnimated(value:boolean):void{this.animated=value;if(!value)this.resetPointer();this.schedule();}
 private schedule=()=>{
  const shouldRun=!!this.ctx && this.animated && !this.reduced && !document.hidden && this.opacity>.001;
  if(shouldRun===this.running)return;
  this.running=shouldRun;
  if(shouldRun)gsap.ticker.add(this.tick);else gsap.ticker.remove(this.tick);
 };
 private tick=(_time:number,delta:number)=>{
  const dt=Math.min(delta/1000,.04);this.phase+=dt;
  const height=Math.min(this.height*.36,this.size*.48,310);
  const dx=this.x-this.pointer.x,dy=this.y-height*.45-this.pointer.y;
  const force=this.fine.matches?Math.max(0,1-Math.hypot(dx,dy)/180):0;
  const target=Math.sign(dx||1)*force*65;
  this.drift+=(target-this.drift)*(1-Math.exp(-dt*3));this.draw();
 };
 private draw():void{
  const c=this.ctx,w=this.width,h=this.height;if(!c||!w||!h)return;
  c.clearRect(0,0,w,h);if(this.opacity<=.001)return;
  const mobile=w<768,count=mobile?2:3;
  const height=Math.min(h*.36,this.size*.48,310);
  const spread=Math.min(this.size*.09,mobile?25:45);
  const fade=c.createLinearGradient(0,this.y,0,this.y-height);
  fade.addColorStop(0,'rgba(112,95,78,0)');
  fade.addColorStop(.13,'rgba(112,95,78,.25)');
  fade.addColorStop(.45,'rgba(112,95,78,.19)');
  fade.addColorStop(1,'rgba(112,95,78,0)');
  c.fillStyle=fade;c.globalAlpha=this.opacity;c.beginPath();
  for(let i=0;i<count;i++){
   const offset=(i-(count-1)/2)*spread;
   const ribbonHeight=height*(.87+i*.055);
   // Ascending phase makes bends travel up the ribbon; widening edges dissolve above it.
   for(let side=0;side<2;side++)for(let j=0;j<=40;j++){
    const q=side===0?j/40:1-j/40;
    const wave=(Math.sin(q*8-this.phase*.7+i*2.3)+.35*Math.sin(q*15-this.phase*.43+i))*q*18;
    const halfWidth=(2.5+q*6)*Math.sin(Math.PI*q)*Math.min(1.5,Math.max(.65,this.size/800));
    const x=this.x+offset+wave+this.drift*q*q+(side===0?1:-1)*halfWidth;
    const y=this.y-q*ribbonHeight;
    if(side===0&&j===0)c.moveTo(x,y);else c.lineTo(x,y);
   }
   c.closePath();
  }
  c.fill();c.globalAlpha=1;
 }
 destroy():void{
  gsap.ticker.remove(this.tick);this.observer.disconnect();
  window.removeEventListener('pointermove',this.move);document.removeEventListener('pointerout',this.leave);
  window.removeEventListener('blur',this.resetPointer);document.removeEventListener('visibilitychange',this.schedule);
  this.canvas.remove();
 }
}
