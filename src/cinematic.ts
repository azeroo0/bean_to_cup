import { CupSteam } from './steam.js';
import { clamp, lerp } from './math.js';
export interface Pose { x:number;y:number;scale:number;rotation:number;cherry:number;bean:number;cup:number;green:number;drop:number;dropY:number;dropScale:number;water:number;ripple:number;orbit:number;portal:number;swarm:number; }
interface Keyframe { at:number; pose:Pose; }
const initial:Pose={x:.66,y:.49,scale:1,rotation:-15,cherry:1,bean:0,cup:0,green:0,drop:0,dropY:.45,dropScale:1,water:0,ripple:0,orbit:.35,portal:0,swarm:0};
const pose=(changes:Partial<Pose>):Pose=>({...initial,...changes});
const harvestStart=pose({x:.76,y:.54,scale:1.35,rotation:32});
const harvestEnd=pose({x:.5,y:.5,scale:5.6,rotation:110,cherry:0,bean:1,green:.55,orbit:0});
const roastEnd=pose({x:.5,y:.48,scale:.55,rotation:300,cherry:0,bean:1,orbit:0});
const brewEnd=pose({x:.5,y:.5,scale:.12,rotation:340,cherry:0,bean:0,drop:0,dropY:.5,dropScale:35,orbit:0,portal:1});
export const choreography:Keyframe[][]=[
 [{at:0,pose:initial},{at:.5,pose:pose({x:.5,y:.5,scale:2.2,rotation:18})},{at:1,pose:harvestStart}],
 [{at:0,pose:harvestStart},{at:.24,pose:pose({x:.27,y:.52,scale:1.45,rotation:-28})},{at:.56,pose:pose({x:.73,y:.57,scale:1.15,rotation:65,cherry:0,bean:1,green:1,orbit:.15})},{at:.8,pose:pose({x:.5,y:.52,scale:1.8,rotation:100,cherry:0,bean:1,green:.8,orbit:0})},{at:1,pose:harvestEnd}],
 [{at:0,pose:harvestEnd},{at:.18,pose:pose({x:.5,y:.48,scale:.85,rotation:140,cherry:0,bean:1,green:.45,orbit:.8,swarm:1})},{at:.62,pose:pose({x:.5,y:.48,scale:1.1,rotation:250,cherry:0,bean:1,orbit:1,swarm:1})},{at:1,pose:roastEnd}],
 [{at:0,pose:roastEnd},{at:.25,pose:pose({x:.5,y:.38,scale:.45,rotation:320,cherry:0,bean:1,water:1,orbit:0})},{at:.6,pose:pose({x:.5,y:.56,scale:.12,rotation:340,cherry:0,bean:.5,drop:1,dropY:.56,dropScale:3,water:1,orbit:0})},{at:.8,pose:pose({x:.5,y:.5,scale:.12,cherry:0,drop:1,dropY:.5,dropScale:18,portal:.3,orbit:0})},{at:1,pose:brewEnd}],
 [{at:0,pose:brewEnd},{at:.12,pose:pose({x:.5,y:.5,scale:4.8,cherry:0,cup:1,ripple:1,orbit:0,portal:1})},{at:.27,pose:pose({x:.5,y:.5,scale:3.2,cherry:0,cup:1,ripple:.8,orbit:0,portal:1})},{at:.62,pose:pose({x:.68,y:.54,scale:1.35,cherry:0,cup:1,ripple:0,orbit:0,portal:1})},{at:1,pose:pose({x:.68,y:.54,scale:1.35,cherry:0,cup:1,ripple:0,orbit:0,portal:1})}]
];
/** Geometry is a pure function of scroll. Reverse scroll reproduces identical poses. */
export function samplePose(scene:number,progress:number):Pose {
 const frames=choreography[Math.max(0,Math.min(4,scene))];const p=clamp(progress);
 let right=frames.findIndex(frame=>frame.at>=p);if(right<=0)return {...frames[0].pose};
 const a=frames[right-1],b=frames[right],t=(p-a.at)/(b.at-a.at);const result={...a.pose};
 for(const key of Object.keys(result) as (keyof Pose)[])result[key]=lerp(a.pose[key],b.pose[key],t);
 return result;
}
export class Cinema {
 private swarm=Array.from(document.querySelectorAll<HTMLElement>('.swarm-bean'));
 private iris=document.querySelector<HTMLElement>('#iris')!;
 private root=document.querySelector<HTMLElement>('#cinema')!;
 private steam=new CupSteam(this.root);
 setAnimated(value:boolean):void {this.steam.setAnimated(value);}
 destroy():void {this.steam.destroy();}
 private foreground=document.querySelector<HTMLElement>('#foreground-branch')!;
 private position=document.querySelector<HTMLElement>('#object-position')!;
 private spin=document.querySelector<HTMLElement>('#object-spin')!;
 private cherry=document.querySelector<HTMLElement>('#cherry-object')!;
 private bean=document.querySelector<HTMLElement>('#bean-object')!;
 private cup=document.querySelector<HTMLElement>('#cup-object')!;
 private drop=document.querySelector<HTMLElement>('#coffee-drop')!;
 private water=document.querySelector<HTMLElement>('#water-thread')!;
 private ripple=document.querySelector<HTMLElement>('#ripple')!;
 render(scene:number,progress:number,reduced:boolean,visibility=1):void {
  const p=samplePose(scene,reduced?(scene===0?0:scene===1?.3:scene===2?.5:scene===3?.35:.85):progress);
  const mobile=window.innerWidth<768;
  this.iris.style.clipPath=`circle(${(reduced?0:p.portal)*150}% at 50% 50%)`;
  this.swarm.forEach((bean,i)=>{
   const angle=(i/this.swarm.length*Math.PI*2)+(p.rotation/180*Math.PI);
   const radius=(mobile?29:34)*p.swarm;
   bean.style.opacity=String(reduced?0:p.swarm*.85);
   bean.style.transform=`translate(-50%,-50%) translate(${Math.cos(angle)*radius}vw,${Math.sin(angle)*radius*.78}svh) rotate(${p.rotation+i*41}deg) scale(${.55+(i%3)*.2})`;
  });
  const x=mobile?.5+(p.x-.5)*.6:p.x;
  const y=mobile?.68+(p.y-.5)*.4:p.y;
  this.root.style.opacity=String(visibility);
  const steamOpacity=scene===4?p.cup*(reduced?1:clamp((progress-.2)/.2)):0;
  this.steam.setPose(x*window.innerWidth,y*this.root.clientHeight,this.spin.clientWidth*p.scale,steamOpacity*visibility,reduced);
  this.foreground.style.opacity=String(scene<2?(scene===0?.28:.28*(1-progress)):0);
  this.foreground.style.transform=`translate3d(${-progress*80}px,${progress*110}px,0) rotate(-24deg)`;
  this.position.style.transform=`translate3d(${x*100}vw,${y*100}svh,0)`;
  this.spin.style.transform=`translate(-50%,-50%) rotate(${p.rotation}deg) scale(${p.scale})`;
  this.cherry.style.opacity=String(p.cherry);this.bean.style.opacity=String(p.bean);this.cup.style.opacity=String(p.cup);
  this.cup.style.transform=`rotate(${-p.rotation}deg)`;
  this.bean.style.filter=`sepia(${p.green*.65}) saturate(${1-p.green*.4}) hue-rotate(${p.green*40}deg)`;
  this.drop.style.opacity=String(p.drop);this.drop.style.transform=`translate(-50%,-50%) scale(${p.dropScale})`;
  this.drop.style.left=`${x*100}%`;this.drop.style.top=`${(mobile?.68+(p.dropY-.5)*.4:p.dropY)*100}%`;
  this.water.style.left=`${x*100}%`;this.water.style.opacity=String(p.water);this.water.style.transform=`scaleY(${p.water})`;
  this.ripple.style.left=`${x*100}%`;this.ripple.style.top=`${mobile?74:74}%`;this.ripple.style.opacity=String(p.ripple);
  this.ripple.style.transform=`translate(-50%,-50%) scale(${1+(1-p.ripple)*4})`;
  this.root.style.setProperty('--orbit-opacity',String(p.orbit));this.root.style.setProperty('--orbit-angle',`${p.rotation*2}deg`);
 }
}
