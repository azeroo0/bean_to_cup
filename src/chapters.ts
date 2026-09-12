import { clamp, lerp, mixColor, type RGB } from './math.js';
export type ChapterId = 'harvest' | 'roasting' | 'brewing' | 'finished';
export interface Physics {
  count: number; vy: number; secondaryVy: number; sway: number; frequency: number;
  rx: number; ry: number; secondaryRx: number; secondaryRy: number;
  rotation: number; alphaTop: number; alphaBottom: number; blur: number;
  sun: number; heat: number; rain: number; paper: number; plume: number;
}
export interface Atmosphere extends Physics { top: RGB; bottom: RGB; particle: RGB; }
export interface Chapter { id: ChapterId; palette: Atmosphere; }
export const chapters: Chapter[] = [
  { id: 'harvest', palette: {top:[47,74,43],bottom:[143,191,107],particle:[244,232,171],count:150,vy:23,secondaryVy:18,sway:28,frequency:0.7,rx:4.8,ry:2.1,secondaryRx:3.5,secondaryRy:1.6,rotation:0.8,alphaTop:0.68,alphaBottom:0.5,blur:0,sun:1,heat:0,rain:0,paper:0,plume:0}},
  { id: 'roasting', palette: {top:[59,36,24],bottom:[181,84,26],particle:[255,182,93],count:115,vy:-33,secondaryVy:-49,sway:38,frequency:1.15,rx:12,ry:26,secondaryRx:1.5,secondaryRy:1.5,rotation:0.16,alphaTop:0.015,alphaBottom:0.32,blur:12,sun:0,heat:1,rain:0,paper:0,plume:0}},
  { id: 'brewing', palette: {top:[26,15,10],bottom:[38,25,18],particle:[230,214,186],count:160,vy:340,secondaryVy:-19,sway:1.5,frequency:0.4,rx:0.6,ry:23,secondaryRx:16,secondaryRy:24,rotation:0,alphaTop:0.48,alphaBottom:0.12,blur:2,sun:0,heat:0,rain:1,paper:0,plume:0}},
  { id: 'finished', palette: {top:[232,211,176],bottom:[246,235,215],particle:[123,93,63],count:2,vy:-7,secondaryVy:-7,sway:12,frequency:0.3,rx:8,ry:80,secondaryRx:8,secondaryRy:80,rotation:0,alphaTop:0.08,alphaBottom:0.2,blur:14,sun:0,heat:0,rain:0,paper:1,plume:1}}
];
const numericKeys: (keyof Physics)[] = ['count','vy','secondaryVy','sway','frequency','rx','ry','secondaryRx','secondaryRy','rotation','alphaTop','alphaBottom','blur','sun','heat','rain','paper','plume'];
/** Parameter-space interpolation: a single evolving simulation, never two faded scenes. */
export function blendAtmosphere(from: Atmosphere, to: Atmosphere, progress: number): Atmosphere {
  const t = clamp(progress);
  const result = {...from,top:mixColor(from.top,to.top,t),bottom:mixColor(from.bottom,to.bottom,t),particle:mixColor(from.particle,to.particle,t)};
  for (const key of numericKeys) result[key] = lerp(from[key],to[key],t);
  return result;
}
export const creator = { name: 'Your Name', github: 'https://github.com/', email: 'hello@example.com' };
