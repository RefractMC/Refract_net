import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
await mkdir('public/images/landing', { recursive: true });
await sharp('assets/demo/library-dark.png').resize({width:1440}).webp({quality:88}).toFile('public/images/landing/library.webp');
const mods=[['fabulously-optimized',277,334],['cobblemon',927,333],['better-mc',274,547],['sodium-plus',600,547],['vanilla-perfected',927,547],['prominence',275,763],['skyblock',927,763],['slimes-adventure',600,763]];
for(const [name,left,top] of mods) await sharp('assets/demo/modpacks.png').extract({left,top,width:64,height:64}).resize(128,128,{kernel:'nearest'}).webp({quality:94}).toFile(`public/images/landing/${name}.webp`);
console.log('Prepared launcher screenshot and eight modpack icons from supplied screenshots.');
