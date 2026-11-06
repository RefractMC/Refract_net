# Third-party notices

## shadcn/ui

The Button and Tabs source components in src/components/ui are adapted from shadcn/ui: https://github.com/shadcn-ui/ui

MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Project screenshots and identity

The Refract logo and screenshots are first-party assets already in RefractMC/Refract_net. WebP copies change encoding only. Screenshot provenance is recorded in docs/IMPLEMENTATION.md.

## Installed packages

Dependencies retain their own license and notice files in their distributed packages. Geist fonts are distributed by Fontsource under the font's SIL Open Font License. Interface icons use the official Iconoir and iconoir-react packages under the MIT license; the full notice ships in `public/licenses/iconoir.txt`. Astro icons render the official SVG paths at build time using the mapping in `scripts/generate-iconoir.mjs`.

## Ecosystem logos

The ecosystem strip identifies compatible content platforms and loaders; it does not imply endorsement or partnership. Brand marks remain the property of their respective owners. These unmodified files were downloaded October 28, 2026:

- Modrinth: https://fabricmc.net/assets/icons/modrinth-logo.svg
- CurseForge: https://fabricmc.net/assets/icons/curseforge-logo.svg
- FTB: https://www.feed-the-beast.com/fav/android-icon-192x192.png
- Fabric: https://fabricmc.net/assets/logo.png
- Forge: https://files.minecraftforge.net/static/images/apple-touch-icon.png
- NeoForge: https://neoforged.net/img/authors/neoforged.png
- Quilt: https://raw.githubusercontent.com/QuiltMC/quiltmc.org/main/public/assets/img/logo-square.png

GDLauncher was inspected for composition and spacing only. None of its source code, artwork, brand assets, or written content is included.

## Minecraft skin preview

The interactive character uses skinview3d 3.4.2 and skinview-utils 0.7.1 (Copyright 2014–2018 Kent Rasmussen; 2017–2022 Haowei Wen, Sean Boult and contributors) and Three.js 0.156.1 (Copyright 2010–2023 three.js authors). Full MIT licenses ship in `public/licenses/skinview3d.txt`, `public/licenses/skinview-utils.txt`, and `public/licenses/three.txt`.

Clavnerok's public Minecraft skin is displayed at the user's request. It was retrieved through Mojang's public profile and texture services; the source texture URL and UUID are recorded in `public/images/skins/clavnerok.json`. The skin artwork remains the property of its creator. Minecraft is a trademark of Mojang/Microsoft; this website is not affiliated with or endorsed by them.

## Featured Modrinth artwork

The homepage displays project icons and gallery images for Sodium, Iris Shaders, Continuity, Fresh Animations, Faithful 32x, and Bare Bones, retrieved from their public Modrinth listings. Each image links to its project. Artwork remains the property of the respective creators; project code licenses do not imply that gallery images are licensed under the same terms. Original asset URLs, project URLs, and retrieval dates are recorded in `public/images/modrinth/sources.json`. Images are locally cached, resized, and encoded as WebP by `scripts/fetch-modrinth-art.mjs`. Their inclusion identifies community content available through the launcher and does not imply endorsement.

## Minecraft scene artwork

The fox, oak boat, leaves, logs, grass, dirt, stone, and amethyst use original Minecraft Java 1.21.5 texture pixels extracted from the official Mojang client. Source metadata and original PNG files are in `public/images/minecraft/`. Minecraft artwork remains © Mojang AB / Microsoft, separate from the website source license. Geometry and animation are custom. Leaf alpha is respected by omitting transparent texels, allowing the background and branches to show through. Rebuild texture data with `node scripts/prepare-minecraft-textures.mjs`.
