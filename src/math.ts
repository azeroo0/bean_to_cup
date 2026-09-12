export type RGB = readonly [number, number, number];
export const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));
export const lerp = (a: number, b: number, t: number): number => t <= 0 ? a : t >= 1 ? b : a + (b - a) * t;
export const mixColor = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
export const rgba = (color: RGB, alpha = 1): string => `rgba(${color.map(v => Math.round(v)).join(',')},${clamp(alpha)})`;
export function seedRandom(seed: number): () => number {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let n = Math.imul(seed ^ seed >>> 15, 1 | seed); n = n + Math.imul(n ^ n >>> 7, 61 | n) ^ n; return ((n ^ n >>> 14) >>> 0) / 4294967296; };
}
export const deviceScale = (ratio: number): number => Math.min(2, Math.max(1, ratio || 1));
export const particleBudget = (count: number, mobile: boolean): number => count <= 2 ? count : Math.max(2, count * (mobile ? 0.42 : 1));
export const roastingTemperature = (progress: number): number => Math.round(lerp(20, 200, progress));
