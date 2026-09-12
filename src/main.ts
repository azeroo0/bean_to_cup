import './style.css';
import './extended.css';
import { mountExtended, setupExtended } from './extended.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { creator } from './chapters.js';
import { playLoader } from './loader.js';
import { ParticleSystem } from './particles.js';
import { setupScroll } from './scroll.js';
async function initialize(): Promise<void> {
mountExtended();
const name=document.querySelector<HTMLElement>('#creator-name')!;
name.textContent=`Built by ${creator.name}`;
document.querySelector<HTMLAnchorElement>('#github-link')!.href=creator.github;
document.querySelector<HTMLAnchorElement>('#email-link')!.href=`mailto:${creator.email}`;
let particles:ParticleSystem|null=null;
try{particles=new ParticleSystem(document.querySelector<HTMLCanvasElement>('#atmosphere')!);}catch(error){console.warn('Canvas unavailable: the readable story remains available.',error);document.body.classList.add('canvas-unavailable');}
particles?.setAnimated(false);
// Decode the hero while the intro plays; native image requests also prepare later objects.
const images=Array.from(document.querySelectorAll<HTMLImageElement>('.story-object'));
await Promise.all([playLoader(window.matchMedia('(prefers-reduced-motion: reduce)').matches), ...images.map(image=>image.decode().catch(()=>{image.style.visibility='hidden';console.warn('A story image could not be decoded; the text and atmosphere remain available.');}))]);
const extended=setupExtended();
const story=setupScroll(particles);
ScrollTrigger.sort();ScrollTrigger.refresh();
if(import.meta.hot){import.meta.hot.dispose(()=>{story.destroy();extended();particles?.destroy();});}

}
void initialize();
