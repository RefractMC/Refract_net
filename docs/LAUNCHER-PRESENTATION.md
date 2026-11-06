# Launcher homepage presentation

Visual reference: https://millida.net/launcher, reviewed October 31, 2026. The redesign follows its split hero, beveled game controls, saturated feature sections, prominent product imagery, and interactive character presentation. Refract retains its iris logo, purple identity, existing routes, real release data, and original product capabilities. No Millida code, models, or screenshots are bundled.

## Assets and models

- `LauncherShowcase.astro` switches between actual library, mods, and settings screenshots.
- `ModrinthCloud.astro` surrounds the feature heading with linked project artwork from Modrinth. Refresh its six cached assets with `node scripts/fetch-modrinth-art.mjs`; original URLs are saved in `public/images/modrinth/sources.json`. Motion pauses offscreen, in hidden tabs, and through the pause button. Reduced-motion preferences produce a static layout. Mobile uses a compact grid.
- `scripts/prepare-landing-assets.mjs` derives the hero image and eight modpack icons from user-supplied screenshots in `assets/demo/`. Project artwork belongs to its respective creators.
- `fox-model.ts` contains the existing fox and boat geometry, shared with the original `FlyingFox` component.
- `voxel-models.ts` constructs original cuboid models for the floating island. `voxel-scene.ts` renders this scene with native WebGL. Mesh topology and buffers are reused, device pixel ratio is capped, and rendering is limited to about 30 fps. Hidden/offscreen scenes stop rendering.
- `MinecraftSkin.astro` and `minecraft-skin.ts` use lazily imported skinview3d (Three.js) for the actual Minecraft character geometry, texture mapping, and outer layers. The default is Clavnerok's public classic-arm skin, requested by the user and cached locally in `public/images/skins/`. Provenance is stored beside the PNG. Refresh it with `node scripts/fetch-minecraft-skin.mjs Clavnerok`.

The character supports pointer drag, left/right arrow rotation, reset, idle/walk animation, outer-layer visibility, arm models, and pause/resume. Visitors can preview a PNG locally (up to 2 MB; modern, legacy, and matching HD sizes) and restore Clavnerok. Files are decoded only in the browser and never uploaded. Reduced-motion preferences produce static scenes; hidden/offscreen viewers pause. Failed WebGL initialization shows a clear fallback while content and downloads remain usable.

Shared navigation, colors, typography, and beveled controls live in `site-theme.css` under `.refract-site`. Interior routes use `.interior-page` and section accents; homepage scene layouts remain scoped to `.pixel-home`. Documentation retains its reading layout. The original homepage before this redesign is retained locally in ignored `output/redesign/index-before-millida.astro`.

## Verification

Check with `node node_modules/astro/astro.js check`, build with `node node_modules/astro/astro.js build`, then run `node scripts/security-headers.mjs` and `node scripts/check-links.mjs`. Public GitHub access is needed for all release pages. Browser checks cover screenshot switching, 3D controls, mobile layout, navigation, and FAQ disclosures.

