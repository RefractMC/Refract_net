import sharp from 'sharp';
import {writeFile,readFile} from 'node:fs/promises';
const textures={};
for(const name of ['fox','oak','oak_log','oak_log_top','oak_leaves','oak_planks','grass_block_top','grass_block_side','grass_block_side_overlay','dirt','stone','amethyst_block','moss_block']){
 const {data,info}=await sharp(`public/images/minecraft/${name}.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 textures[name]={width:info.width,height:info.height,pixels:[...data]};
}
await writeFile('src/scripts/minecraft-textures.json',JSON.stringify(textures));
await writeFile('public/images/minecraft/sources.json',JSON.stringify({version:'1.21.5',source:JSON.parse(await readFile('output/minecraft-textures/client-source.json','utf8')),copyright:'Minecraft textures © Mojang AB / Microsoft. Not covered by the website source license.',paths:Object.keys(textures)},null,2));

