import gsap from 'gsap';
const SESSION_KEY='bean-to-cup.intro';
/** Decorative intro, not a claim about network transfer progress. */
export function playLoader(reduced: boolean): Promise<void> {
  const loader=document.querySelector<HTMLElement>('#loader')!;
  let seen=false;try{seen=sessionStorage.getItem(SESSION_KEY)==='1';}catch{/* Optional storage. */}
  if(seen || reduced){try{sessionStorage.setItem(SESSION_KEY,'1');}catch{/* Optional storage. */}loader.hidden=true;return Promise.resolve();}
  return new Promise(resolve=>{
    const main=document.querySelector<HTMLElement>('#story')!;
    const header=document.querySelector<HTMLElement>('.site-header')!;
    const skip=document.querySelector<HTMLButtonElement>('#loader-skip')!;
    const counter=document.querySelector<HTMLElement>('#loader-count')!;
    const oldOverflow=document.body.style.overflow;
    loader.hidden=false;main.inert=true;header.inert=true;document.body.style.overflow='hidden';skip.focus({preventScroll:true});
    let completed=false;
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const finish=()=>{
      if(completed)return;completed=true;timeline.kill();
      try{sessionStorage.setItem(SESSION_KEY,'1');}catch{/* Optional storage. */}
      loader.hidden=true;main.inert=false;header.inert=false;document.body.style.overflow=oldOverflow;
      skip.removeEventListener('click',finish);document.removeEventListener('keydown',key);media.removeEventListener('change',motionChange);
      document.querySelector<HTMLElement>('#hero-title')?.focus({preventScroll:true});resolve();
    };
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();finish();}if(e.key==='Tab'){e.preventDefault();skip.focus();}};
    const motionChange=()=>{if(media.matches)finish();};
    const progress={value:0};
    const timeline=gsap.timeline({defaults:{ease:'power2.out'},onComplete:finish});
    timeline.to(progress,{value:100,duration:1.65,ease:'none',onUpdate:()=>{counter.textContent=`${Math.round(progress.value)}%`;}}).to(loader,{yPercent:-100,duration:.65},'+=.5');
    skip.addEventListener('click',finish);document.addEventListener('keydown',key);media.addEventListener('change',motionChange);
  });
}
