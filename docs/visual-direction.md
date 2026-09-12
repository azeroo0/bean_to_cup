# Bean to Cup · cinematic edition

The second edition replaces four repeated title screens with one continuous subject: cherry, bean, falling drop, and cup. Existing particle physics remain a separate atmosphere layer.

## Choreography

- Hero, +100%: two headline lines separate as the cherry shifts toward the next scene.
- Harvest, +180%: the cherry moves, a stylized seed transition appears, then the bean fills the frame.
- Roasting, +210%: the enlarged bean settles, turns in the image plane, darkens, and gains heat. Oversized outline text moves behind the narrative.
- One interlude: an outline JUST ADD WATER band separates fire from flow.
- Brewing, +220%: the bean contracts below a water thread; a drop gathers and falls.
- Finished, +160%: expanding rings meet a magnified overhead coffee surface; pulling back reveals the cup and saucer. Text enters only after the main reveal.

`cinematic.ts` owns deterministic normalized keyframes. Each scene's final pose equals the next scene's first pose. Scroll position, rather than accumulated animation time, determines the object's geometry and image mix. The ambient particles retain a time-dependent component, paused separately.

## Intentional limits

These are photographic cutouts with 2D translations, in-plane rotations, masking through scale, and opacity transitions. They are not real-time 3D, an out-of-plane rotation sequence, or an anatomically accurate bean-processing simulation. The green-tinted intermediate bean is a poetic compression of processing, not a scientific illustration. The cup reveal is an overhead image zoom-out, not a change in camera angle.

## Generated imagery

The three assets were generated with the built-in image-generation tool and retain alpha transparency. Original output resolution: 1254×1254. Actual files:

- public/assets/cherry.png
- public/assets/bean.png
- public/assets/cup.png

Shared prompt: “Use case: product-mockup. Asset type: photographic cutout story object for a cinematic coffee website. Square 1024x1024 image. Object centered, whole silhouette fully in frame with ample margins. Genuinely transparent background with true alpha channel; isolated clean cutout, no canvas background, no checkerboard, no cast shadow or drop shadow, no text, no watermark, no other objects.”

Subjects:
1. Single ripe deep burgundy red coffee cherry with short stem and exactly two elegantly curved dark glossy green coffee leaves. Macro botanical commercial studio photograph, warm side light, three-quarter angle.
2. Single large roasted coffee bean, seam toward camera, three-quarter angle, richly textured brown surface, warm studio rim lighting. Expensive macro commercial photography.
3. Directly overhead photograph of ivory ceramic espresso cup and matching saucer filled with dark coffee with a fine crema edge. Handle at 3 o'clock. Minimal and expensive commercial photography.

## Accessibility and performance

- Text remains semantic HTML; generated images and motion layers are decorative.
- Reduced motion removes pinning and motion-heavy transforms, presenting one fixed representative object per reading section.
- Scene durations vary to match their transformations.
- Mobile shifts the object below the primary copy; large-screen compositions use the right half of the viewport.
- Only three images are decoded; no large animation-frame sequence is loaded.
- Images are requested from the first document. Decoding runs alongside the intro, with fallback to readable narrative on failure.
- Hidden tabs stop the Canvas animation; no WebGL context is required.
- Scroll navigation remains interruptible with native wheel, touch, and keyboard input.

## Verification

The source tests cover keyframe continuity, reverse-scroll determinism, finite values, final visibility, atmosphere interpolation, device budgets, and temperature bounds. TypeScript and a production Vite build are checked. Browser-based visual and performance testing has not been run for this edition; no frame-rate or Lighthouse claim is made.

## Director's cut — spatial choreography

The third iteration replaces repeated left-copy transitions with five distinct movements: split hero type and an opening aperture, a 270vw harvest typography traverse, orbiting bean cutouts collapsing to the centre, a scroll-driven expanding circular portal, and a macro-to-wide cup reveal. These are 2D image transforms, not a WebGL or 3D model. The Shopify reference was inspected directly: its stable visual field and repositioning editorial content informed the separation of image and typography layers. No reference assets or code are copied.

All object geometry and portal progress are deterministic functions of scroll, including reverse scrolling. Reduced motion removes pins, the portal, swarm, and oversized moving typography. Mobile uses smaller spatial travel and separate type placement. Validation: TypeScript, eight node tests, production build. No automated browser layout or performance validation was performed for this iteration.
