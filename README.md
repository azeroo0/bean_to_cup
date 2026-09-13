# Bean to Cup

A four-chapter, scroll-driven journey through how coffee is made — from harvest to the finished cup — where the background physically transforms with every scroll.

**Live:** https://beantocup.vercel.app

## Overview

Bean to Cup treats each stage of coffee-making as its own cinematic scene. Harvest, Roasting, Brewing, and Finished aren't just different colors — each has its own particle physics, motion, and texture, driven by scroll position rather than triggered by a simple fade.

An extended edition continues the story further: sorting, first crack, grinding, a bloom moment, and a final ritual selector (Filter / Espresso / Latte) that reshapes the ending based on your choice.

## Features

- **Four cinematic chapters** — Harvest, Roasting, Brewing, and Finished each pinned to the scroll, with color, particle shape, and motion physically interpolating from one into the next
- **One particle system, one canvas** — a single persistent, seeded particle pool changes shape and velocity in parameter space instead of cross-fading between separate scenes, batched into one draw call per frame
- **Cup-anchored steam** — a foreground steam layer that follows the cup through its final zoom, gently deflected by a mouse pointer
- **Extended journey** — additional pinned scenes for sorting, first crack, grinding, and bloom, ending in a three-way ritual selector
- **Full motion control** — a pause-motion toggle, and a complete `prefers-reduced-motion` fallback that turns the story into a plain, readable, unpinned document
- **Accessibility-first** — keyboard-navigable chapter links, focus management through the intro loader, and all narrative text living in real HTML rather than canvas
- **Performance-tuned** — capped device pixel ratio, reduced particle density on mobile, paused rendering on hidden tabs, and frame-delta capping after interruptions

## Tech stack

- TypeScript + Vite
- GSAP + ScrollTrigger
- HTML5 Canvas 2D
- Node's built-in test runner (`node:test`) for interpolation and physics logic
- Deployed on Vercel

## Getting started

```bash
npm ci
npm run dev
```

```bash
npm run test
npm run build
npm run preview
```