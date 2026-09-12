# BEAN TO CUP — Cinematic Edition

A four-chapter, scroll-driven coffee journal. Built with TypeScript, Vite, GSAP ScrollTrigger, and Canvas 2D. No UI framework, API, WebGL, or paid GSAP plugins. Three original photographic cutouts carry the story between scenes.

## Run locally

Use Node.js 20.19+ or Node.js 22.12+.

```bash
npm ci
npm run dev
```

```bash
npm run test
npm run build
npm run preview
```

## Project structure

```text
bean-to-cup/
  package.json
  package-lock.json
  index.html
  tsconfig.json
  tsconfig.test.json
  public/
    favicon.svg
    assets/cherry.png
    assets/bean.png
    assets/cup.png
  src/
    main.ts
    style.css
    math.ts
    chapters.ts
    cinematic.ts
    steam.ts
    particles.ts
    scroll.ts
    loader.ts
    vite-env.d.ts
  tests/
    core.test.ts
```

## Chapters

| Chapter | Palette | Movement and form | Texture |
| --- | --- | --- | --- |
| Harvest | #2F4A2B → #8FBF6B | About 150 swaying, falling ellipses | Upper-right sunlight and broad dappled light |
| Roasting | #3B2418 → #B5541A | Rising elongated smoke, small embers, decreasing alpha toward the top | Low heat glow, fine grain and heat shimmer |
| Brewing | #1A0F0A → deep brown | Fast narrow downward streaks and a slower upward secondary population | Etched vertical channels and scroll-driven ripples |
| Finished | #E8D3B0 → warm cream | Only two slow, tapered steam ribbons | Fine paper-like grain |

## Architecture

- `chapters.ts`: typed palette and physical parameter presets; pure interpolation; creator configuration.
- `particles.ts`: one persistent seeded particle pool, one Canvas, one requestAnimationFrame loop. Shapes and velocity are changed in parameter space, not by fading two complete scenes.
- `scroll.ts`: a pinned hero plus four `pin: true`, `scrub: true` chapter timelines, with scene-specific scroll lengths. Cached trigger ranges determine background and physics from the current scroll position. Navigation uses those ranges rather than element offsets inside pin spacers.
- `loader.ts`: decorative 0–100% intro, half-second hold, upward exit, session storage, focus handling and skip button.
- `math.ts`: interpolation, color functions, seeded randomness, DPR and density policies.
- `main.ts`: initialization, creator links and HMR cleanup.

Pin lengths are 130% (hero), 230% (harvest), 240% (roasting), 250% (brewing), and 170% (finished). One non-pinned marquee separates Roasting from Brewing; the outro uses normal scrolling. See `docs/visual-direction.md` for the keyframes, asset prompts, and deliberate 2D rendering limits.

## Particle batching

The particle pass calls `beginPath()` once, appends every particle subpath, and calls `fill()` once. A vertical CanvasGradient supplies spatial color/alpha variation; a shared shadowBlur supplies softness. This deliberately avoids a fill call for each particle or color bucket. Background gradient rectangles and texture strokes are separate from the particle pass.

A single path has one paint style, so independent per-particle RGBA colors are not used. Smoke fades with height through the shared gradient; ember silhouettes contract to small points in the same warm field. Brewing has two opposing velocity populations. During the final transition, the first two shapes interpolate into tapered ribbon geometry while the rest shrink away as the population budget decreases.

Desktop pool budgets are 150 / 115 / 160 / 2. Below 768px, ordinary populations scale to 60%; the final two ribbons remain two. DPR is capped at 2. Frame delta is capped after interruptions. Hidden tabs stop rendering. Resizing redraws using the actual canvas dimensions. Grain is generated once and reused as a pattern.

## Motion and keyboard behavior

- Chapter links use GSAP scrolling and arrive after the title's initial reveal.
- Wheel, touch and scroll-navigation keys interrupt a programmatic scroll.
- Native page scrolling remains available; scrolling is not hijacked.
- The active chapter link uses `aria-current="step"`.
- Title focus moves after link navigation without causing a second scroll.
- Pause motion stops autonomous particles, marquees and the scroll arrow. Explicit scroll-driven transitions remain tied to the user's scroll.
- `prefers-reduced-motion` skips the intro, shows text immediately, disables autonomous animation, and redraws only static particle frames when the scene/viewport changes. Pinning is removed in reduced-motion mode, making the story a regular readable document.
- The loader has a skip button, Escape support and temporary focus containment. `sessionStorage` key: `bean-to-cup.intro`. Storage restrictions do not break the site.
- Canvas and repeated marquee text are decorative and hidden from assistive technologies. All narrative text exists in HTML.
- Temperature is illustrative, not measured: 20–200°C as a pure function of Roasting scroll progress.

## Typography and contrast

Cormorant Garamond is used for headlines; DM Sans is used for body text. Both load from Google Fonts, with local serif/sans-serif fallbacks. No essential content depends on fonts loading successfully.

Light chapter text is backed by a dark reading gradient; the Finished chapter has a cream reading surface and dark text. Header controls retain a dark backdrop across chapters. Small metadata is at least 12px. Browser-level contrast and layout verification remains recommended before showcasing on all target devices.

## Personalize the footer

Edit `creator` in `src/chapters.ts`:

```ts
export const creator = {
  name: 'Your Name',
  github: 'https://github.com/',
  email: 'hello@example.com'
};
```

These are explicit sample identity/contact values, not the owner's real details. Update them before using this project as your personal portfolio. Also update the matching HTML fallback text in `index.html` if you want no-JavaScript output to use your identity.

## Validation

`npm run test` checks:
- interpolation endpoints and physical midpoint values;
- distinct chapter directions and opposing brewing flows;
- reverse-scroll temperature behavior and clamping;
- mobile density and DPR limits;
- deterministic particle seeds;
- continuity between all cinematic scenes;
- reverse-scroll object poses and final cup visibility.

`npm run build` type-checks all application code and creates `dist/`.

No browser automation was run in this environment. Recommended manual checks: 390px and 1440px, reverse scrolling, chapter navigation, short-height landscape screens, reduced motion, pause/resume, returning within the same session, keyboard focus, and browser zoom at 200%.

## Deployment

This is a static Vite build. Serve `dist/` from any static hosting provider. There are no secrets or runtime bindings. The downloadable source archive excludes the environment-specific hosting manifest and Git metadata.

## Cup steam

`src/steam.ts` adds cup-anchored foreground steam, above the cup image and below narrative text. Three gray-brown ribbons (two on mobile) fade as they rise, using one Canvas path/fill per frame. The emitter follows the cup position and scale during the final zoom. The existing atmospheric ribbons remain behind the scene.

GSAP ticker drives the continuous upward flow, even when scrolling stops. Fine mouse pointers gently deflect nearby steam; touch input does not. Pause motion freezes the flow and pointer response. Reduced motion renders a static frame. Hidden tabs and inactive steam remove their ticker callback. ResizeObserver updates canvas size with DPR capped at 2, and disposal removes all listeners. No new dependencies or external assets.

## Extended Journey edition

Read `START-HERE-KO.md` for the exact delivery status and run instructions. New sections are mounted by `src/extended.ts`, with isolated styles in `src/extended.css`: an editorial seasonal pause, sorting, first crack, grinding, bloom, and a three-way ritual selector. Existing core chapters and steam are preserved. Additional pinned scroll distances: sorting 150%, grinding 150%, bloom 120%; editorial and ritual sections scroll normally.

`src/films.ts` has nullable optional film paths; actual footage is **not bundled**. See `docs/HIGGSFIELD-SHOTS.md` for production prompts and integration steps. The footage adapter is unverified with actual video. Higgsfield generation was unavailable; this is a standalone Vite project, not a Higgsfield export.