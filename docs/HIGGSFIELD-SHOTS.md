# BEAN TO CUP / Higgsfield footage production brief

## Status

No Higgsfield video or new Higgsfield images were generated for this package. The installed plugin's execution tools were unavailable in this session. All new scenes currently work with existing still images and Canvas. This is an independently runnable Vite extension, not a Higgsfield-hosted application or exported Higgsfield project.

## Shared art direction

Luxury coffee editorial, tactile realism, restrained colour, natural light. No text, typography, captions, logos, hands or people in the footage. Keep titles in HTML so they stay crisp and accessible. Match the existing olive → roasted brown → near-black → cream chapter palette. Keep the important action in the middle-right on desktop; protect centre framing for a separate mobile crop. Avoid rapid cuts, flashing light, optical warping and changing vessel geometry.

### Shot 01 — The grind

Purpose: replace the Canvas grain fall at #grinding. Target 5–7 seconds, 16:9 master; silent, one continuous shot. These are production targets, not guarantees of a particular model's settings.

Prompt:
A single beautifully roasted coffee bean floats in a dark espresso-brown studio, framed centre-right, lit by a narrow warm side light. Begin with the bean intact and almost still. The bean gently breaks apart into many small irregular coffee grounds. The grounds fall downward in a controlled, graceful cascade and gather into a thin bed along the lower part of the composition. Photorealistic macro texture, detailed porous bean surface, believable gravity, restrained dusty particles, deep soft shadows. Locked camera, no cuts, no text, no logos, no hands, no sparks, no explosive blast. End with the grounds settled and the same background and light intact. Leave the left third dark and uncluttered for webpage typography.

Review: bean identity, plausible breakup, stable lighting, no molten material, no sudden cut, readable final frame. This shot is symbolic; do not claim it is a documentary depiction of a grinder.

### Shot 02 — The bloom (priority)

Purpose: replace Canvas surface at #bloom. Target 6–8 seconds, 16:9 master; silent, fixed overhead view.

Prompt:
Extreme overhead macro of freshly ground coffee in a dark circular pour-over filter, positioned centre-right against a nearly black brown background. A fine stream of hot water gently touches the centre. The coffee bed slowly swells and releases tiny realistic bubbles; concentric ripples spread outward, then settle. Rich chestnut grounds, subtle golden wet highlights, natural coffee bloom, delicate wisps of steam. Fixed camera, continuous shot, restrained slow motion, realistic liquid behaviour. No cup morphing, no huge bubbles, no swirling vortex, no latte art, no text, no captions, no logos, no hands. Keep the left third quiet and dark for typography. End with a moist, gently expanded coffee bed.

Review: water direction, tiny bubbles rather than foam balls, fixed circular vessel, no texture swimming, no sudden exposure changes. Select a smooth start/end interval before integrating.

### Shot 03 — Final cup (future enhancement)

Not wired as a replacement in this version: current final cup keeps interactive Canvas steam. Replacing it with video would lose independent pointer response unless the steam remains a separate layer.

Prompt:
A warm ivory ceramic coffee cup on a matching saucer, filled with black coffee, on a muted warm cream tabletop. Camera is gently elevated, looking down at a three-quarter angle. A very slow, subtle pullback reveals the whole saucer. Two delicate translucent wisps of steam rise from the coffee surface, curling naturally and fading into the air. Soft window light from the upper right, authentic ceramic texture, calm premium editorial mood. Cup and handle geometry remain perfectly stable. No people, hands, text, logos or additional objects. No swirling smoke cloud. No abrupt movement or exposure changes.

## Export and integration

1. Create, inspect and select actual footage in Higgsfield. Export silent footage with a stable frame rate. Obtain its real file; never put a guessed remote URL into source.
2. Optimise a short MP4 for the web. A 1280×720 or 1920×1080 landscape master is a sensible starting point; inspect appearance and mobile memory before choosing final output. Frequent keyframes help video seeking but increase file size.
3. Put files at `public/films/grind.mp4` and `public/films/bloom.mp4`. Add posters if available.
4. Edit `src/films.ts`: change the corresponding `src: null` to `/films/grind.mp4` or `/films/bloom.mp4`. The optional poster must also be a real asset path.
5. Run `npm run build`, then `npm run preview`.
6. Verify forward/backward scrubbing on desktop and mobile, reduced motion, loading failures and resize. The optional adapter has not been tested with actual generated footage because none was available.

The adapter only loads near the section, queues seeks instead of stacking them, and removes failed footage so the Canvas scene remains visible. Reduced motion uses the static Canvas fallback. A production film pass still needs device-specific optimisation; this package does not claim frame-perfect video playback.