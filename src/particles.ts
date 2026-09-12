import { chapters, type Atmosphere } from './chapters.js';
import { clamp, deviceScale, lerp, mixColor, particleBudget, rgba, seedRandom } from './math.js';
interface Particle { x: number; y: number; seed: number; size: number; phase: number; }
/** One persistent pool; one beginPath/fill for all particle geometry per frame. */
export class ParticleSystem {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly pool: Particle[];
  private readonly grain: HTMLCanvasElement;
  private width = 1;
  private height = 1;
  private mobile = false;
  private phase = 0;
  private frame = 0;
  private previous = 0;
  private enabled = true;
  private scene: Atmosphere = chapters[0].palette;
  private darkness = 0;
  private progress = 0;
  private readonly observer: ResizeObserver;
  private readonly onVisibility = () => { this.previous=0; if(document.hidden) this.stop(); else this.start(); };
  constructor(private readonly canvas: HTMLCanvasElement) {
    const ctx=canvas.getContext('2d',{alpha:false});
    if(!ctx) throw new Error('Canvas 2D is not supported.');
    this.ctx=ctx;
    const random=seedRandom(1471);
    this.pool=Array.from({length:170},(_,i)=>({x:random(),y:random(),seed:random(),size:0.6+random()*0.8,phase:i*2.39996}));
    this.grain=document.createElement('canvas'); this.grain.width=128; this.grain.height=128;
    const grainCtx=this.grain.getContext('2d')!;
    for(let y=0;y<128;y+=2) for(let x=0;x<128;x+=2) { grainCtx.fillStyle=`rgba(255,255,255,${random()*0.13})`; grainCtx.fillRect(x,y,1,1); }
    this.observer=new ResizeObserver(()=>this.resize()); this.observer.observe(canvas);
    document.addEventListener('visibilitychange',this.onVisibility);
    this.resize(); this.start();
  }
  setScene(scene: Atmosphere, darkness: number, progress: number): void {
    this.scene=scene; this.darkness=darkness; this.progress=progress;
    if(!this.enabled) this.draw(0);
  }
  setAnimated(animated: boolean): void {
    this.enabled=animated;
    if(animated) this.start(); else {this.stop();this.draw(0);}
  }
  private resize(): void {
    this.width=this.canvas.clientWidth; this.height=this.canvas.clientHeight; this.mobile=this.width<768;
    const dpr=deviceScale(window.devicePixelRatio);
    this.canvas.width=Math.round(this.width*dpr); this.canvas.height=Math.round(this.height*dpr);
    this.ctx.setTransform(dpr,0,0,dpr,0,0); this.draw(0);
  }
  private start(): void { if(!this.enabled || this.frame || document.hidden) return; this.previous=0;this.frame=requestAnimationFrame(this.tick); }
  private stop(): void {cancelAnimationFrame(this.frame);this.frame=0;}
  private readonly tick=(time:number):void=>{
    this.frame=0;
    const dt=this.previous?Math.min((time-this.previous)/1000,0.04):0;this.previous=time;
    this.draw(dt);this.startFrame();
  };
  private startFrame():void { if(this.enabled && !document.hidden) this.frame=requestAnimationFrame(this.tick); }
  private background():void {
    const c=this.ctx,s=this.scene,w=this.width,h=this.height;
    const gradient=c.createLinearGradient(0,0,0,h);
    gradient.addColorStop(0,rgba(mixColor(s.top,[12,9,7],this.darkness)));
    gradient.addColorStop(1,rgba(mixColor(s.bottom,[12,9,7],this.darkness)));
    c.fillStyle=gradient;c.fillRect(0,0,w,h);
    // Harvest: broad sunlight and dappled, slowly shifting pools of light.
    if(s.sun>0.001) {
      const light=c.createRadialGradient(w*0.89,h*0.08,0,w*0.89,h*0.08,w*0.78);
      light.addColorStop(0,`rgba(255,243,181,${s.sun*0.29*(1-this.darkness)})`);light.addColorStop(1,'rgba(255,243,181,0)');
      c.fillStyle=light;c.fillRect(0,0,w,h);
      for(let i=0;i<3;i++) {const x=w*(0.64+i*0.17)+Math.sin(this.phase*0.12+i)*28,y=h*(0.2+i*0.28);const g=c.createRadialGradient(x,y,0,x,y,w*0.28);g.addColorStop(0,`rgba(24,54,24,${s.sun*0.17})`);g.addColorStop(1,'rgba(24,54,24,0)');c.fillStyle=g;c.fillRect(0,0,w,h);}
    }
    // Roasting: a low ember glow and horizontal heat shimmer, not falling leaves.
    if(s.heat>0.001) {
      const heat=c.createRadialGradient(w*0.72,h*1.05,0,w*0.72,h*1.05,h*0.9);heat.addColorStop(0,`rgba(255,107,21,${s.heat*0.32*(1-this.darkness)})`);heat.addColorStop(1,'rgba(255,107,21,0)');c.fillStyle=heat;c.fillRect(0,0,w,h);
      c.beginPath();for(let i=0;i<12;i++){const y=h*(i/12);c.moveTo(w*0.45,y);c.bezierCurveTo(w*.62,y+Math.sin(this.phase+i)*10,w*.82,y-8,w,y+5);}c.strokeStyle=`rgba(255,186,114,${s.heat*0.035})`;c.lineWidth=1;c.stroke();
    }
    // Brewing: vertical etched water channels and scroll-driven concentric ripples.
    if(s.rain>0.001) {
      c.beginPath();for(let i=0;i<25;i++){const x=w*(0.42+i*0.028);c.moveTo(x,0);c.lineTo(x,h);}c.strokeStyle=`rgba(220,206,180,${s.rain*0.025})`;c.lineWidth=0.7;c.stroke();
      c.beginPath();for(let i=0;i<3;i++){const radius=20+(this.progress*90+i*43)%150;c.moveTo(w*.74+radius,h*.75);c.ellipse(w*.74,h*.75,radius,radius*.24,0,0,Math.PI*2);}c.strokeStyle=`rgba(233,218,189,${s.rain*0.12})`;c.stroke();
    }
    // Finished: fine stationery-like grain, without heat or rain texture.
    const pattern=c.createPattern(this.grain,'repeat');if(pattern){c.globalAlpha=0.35+s.paper*0.35+s.heat*0.2;c.fillStyle=pattern;c.fillRect(0,0,w,h);c.globalAlpha=1;}
  }
  private draw(dt:number):void {
    const c=this.ctx,s=this.scene,w=this.width,h=this.height;
    if(!w || !h) return;
    this.phase+=dt;this.background();
    const count=particleBudget(s.count,this.mobile);
    const gradient=c.createLinearGradient(0,0,0,h);
    gradient.addColorStop(0,rgba(s.particle,s.alphaTop*(1-this.darkness)));
    gradient.addColorStop(0.65,rgba(s.particle,lerp(s.alphaTop,s.alphaBottom,0.65)*(1-this.darkness)));
    gradient.addColorStop(1,rgba(s.particle,s.alphaBottom*(1-this.darkness)));
    c.fillStyle=gradient;c.shadowColor=rgba(s.particle,0.2);c.shadowBlur=s.blur;
    c.beginPath(); // Batch every ellipse, streak, smoke shape and ribbon into ONE path.
    for(let i=0;i<this.pool.length;i++) {
      const p=this.pool[i]; const secondary=i%5===4; const spark=i%17===4;
      const vy=secondary?s.secondaryVy:s.vy;
      p.y+=vy*(0.65+p.seed*0.7)*dt/h;
      if(p.y>1.15)p.y=-0.15;if(p.y<-.15)p.y=1.15;
      const visibility=clamp(count-i);if(visibility<=0)continue;
      let x=p.x*w+Math.sin(this.phase*s.frequency+p.phase)*s.sway;
      let y=p.y*h;
      // Secondary brewing population remains low, rising gently beneath fast droplets.
      y=lerp(y,h*(0.65+((p.y+0.15)/1.3)*0.43),secondary?s.rain:0);
      let rx=(secondary?s.secondaryRx:s.rx)*p.size*visibility;
      let ry=(secondary?s.secondaryRy:s.ry)*p.size*visibility;
      // A few roasting particles contract into bright pinpoint embers.
      const ember=s.heat*(spark?1:0);
      rx=lerp(rx,1.4+0.6*Math.sin(this.phase*4+p.phase),ember);ry=lerp(ry,rx,ember);
      const plume=s.plume*(i<2?1:0);
      x=lerp(x,w*(0.67+i*0.12)+Math.sin(this.phase*.23+i)*9,plume);
      y=lerp(y,h*.68,plume);
      const rotation=Math.sin(this.phase*.4+p.phase)*s.rotation;
      if(plume>0.001) {
        // A continuous shape morph: ellipse silhouette -> two tapered steam ribbons.
        const height=Math.min(240,h*.32);
        for(let j=0;j<=40;j++) {
          const theta=j/40*Math.PI*2;
          const ex=Math.cos(theta)*rx,ey=Math.sin(theta)*ry;
          const q=(Math.sin(theta)+1)/2;
          const side=Math.cos(theta)>=0?1:-1;
          const taper=Math.sin(q*Math.PI);
          const ribbonX=Math.sin(q*9-this.phase*.65+i)*18+side*(3+q*5)*taper;
          const ribbonY=(q-.5)*height;
          const px=x+lerp(ex,ribbonX,plume),py=y+lerp(ey,ribbonY,plume);
          if(j===0)c.moveTo(px,py);else c.lineTo(px,py);
        }
        c.closePath();
      } else {
        c.moveTo(x+Math.cos(rotation)*rx,y+Math.sin(rotation)*rx);
        c.ellipse(x,y,Math.max(.02,rx),Math.max(.02,ry),rotation,0,Math.PI*2);
        c.closePath();
      }
    }
    c.fill(); // Exactly one particle fill per frame; gradients provide height-dependent alpha.
    c.shadowBlur=0;
  }
  destroy():void {this.stop();this.observer.disconnect();document.removeEventListener('visibilitychange',this.onVisibility);}
}
