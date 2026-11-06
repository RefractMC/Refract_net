import { alpha, texel, type TextureName } from './minecraft-texture';
import { foxSurfaces } from "./fox-model";
export type Vec3 = [number, number, number];
export type Surface = { points: Vec3[]; color: number[]; part?: string };
const faces = [[0,1,2,3],[5,4,7,6],[0,4,5,1],[3,2,6,7],[1,5,6,2],[4,0,3,7]];
const lighting = [.68, .92, .48, 1.13, .85, .72];
const rgb = (color:string) => { const n=parseInt(color.replace('#',''),16); return [n>>16,(n>>8)&255,n&255].map(n=>n/255); };
function cube(out:Surface[], p:Vec3, size:Vec3, hex:string, part?:string, textured=false, texture?:TextureName) {
  const [x,y,z]=p,[w,h,d]=size.map(n=>n/2), color=rgb(hex);
  const v:Vec3[]=[[x-w,y-h,z-d],[x+w,y-h,z-d],[x+w,y+h,z-d],[x-w,y+h,z-d],[x-w,y-h,z+d],[x+w,y-h,z+d],[x+w,y+h,z+d],[x-w,y+h,z+d]];
  faces.forEach((indices,f)=>{
    const points=indices.map(i=>v[i]);
    const cols=texture?16:textured?Math.max(1,Math.round(size[f<2?0:f<4?0:2]*8)):1;
    const rows=texture?16:textured?Math.max(1,Math.round(size[f<2?1:f<4?2:1]*8)):1;
    const at=(u:number,t:number)=>points[0].map((a,i)=>a+(points[1][i]-a)*u+(points[3][i]-a)*t) as Vec3;
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
      let tile=texture==='oak_log'&&(f===2||f===3)?'oak_log_top':texture;
      if(texture==='grass_block_top')tile=f===3?'grass_block_top':f===2?'dirt':'grass_block_side';
      if(tile&&alpha(tile,c,15-r)<128)continue;
      let pixel=tile?texel(tile,c,15-r,tile==='oak_leaves'||tile==='grass_block_top'?[.48,.72,.25]:[1,1,1]):hex;
      if(tile==='grass_block_side'&&alpha('grass_block_side_overlay',c,15-r)>128)pixel=texel('grass_block_side_overlay',c,15-r,[.48,.72,.25]);
      const shade=textured?[1,.96,1.04,.91,1,1.07][(r*17+c*7+f*3)%6]:1;
      out.push({points:[at(c/cols,r/rows),at((c+1)/cols,r/rows),at((c+1)/cols,(r+1)/rows),at(c/cols,(r+1)/rows)],color:(texture?rgb(pixel):color).map(n=>Math.min(1,n*lighting[f]*(texture?1:shade))),part});
    }
  });
}
export function worldModel():Surface[] {
  const out:Surface[]=[];
  // Full cubic blocks: each face maps a native 16×16 texture without stretching.
  const unit=.47;
  for(let x=-2;x<=2;x++)for(let z=-1;z<=1;z++){
    if(Math.abs(x)===2&&z===-1)continue;
    cube(out,[x*unit+.8,-.25,z*unit],[unit,unit,unit],'#ffffff',undefined,false,'grass_block_top');
    if(Math.abs(x)<2)cube(out,[x*unit+.8,-.72,z*unit],[unit,unit,unit],'#ffffff',undefined,false,(x+z)%2?'dirt':'stone');
  }
  cube(out,[.8,-1.19,0],[unit,unit,unit],'#ffffff',undefined,false,'stone');
  for(let y=0;y<3;y++)cube(out,[1.27,.22+y*unit,0],[unit,unit,unit],'#ffffff',undefined,false,'oak_log');
  for(let y=0;y<2;y++)for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++){
    if(y===1&&Math.abs(x)+Math.abs(z)>1)continue;
    cube(out,[1.27+x*unit,1.16+y*unit,z*unit],[unit,unit,unit],'#ffffff',undefined,false,'oak_leaves');
  }
  for(const [x,y,z] of [[-.25,-.72,.8],[1.65,-.88,-.65],[2.15,.75,.25]])cube(out,[x,y,z],[unit*.5,unit*.5,unit*.5],'#ffffff','crystal',false,'amethyst_block');
  // The existing fox and boat remain the scene's travelling companion.
  foxSurfaces.forEach(face=>out.push({points:face.points.map(([x,y,z])=>[x*.54-1.25,y*.54+.12,z*.54+.72]),color:face.color.match(/\d+/g)!.map(Number).map(n=>n/255),part:'boat'}));
  return out;
}
export function characterModel(look=0):Surface[] {
  const out:Surface[]=[];
  const coat=['#d87b2c','#9466ce','#548c66'][look], bright=['#ed963d','#b28ae9','#85b986'][look];
  const skin='#e8bd94', cream='#f2e5cf', dark='#33303a';
  // Minecraft player proportions: 8px head, 8x12 torso, 4x12 limbs.
  cube(out,[-.255,.72,0],[.48,1.35,.5],'#343343','leg-left',true);
  cube(out,[.255,.72,0],[.48,1.35,.5],'#343343','leg-right',true);
  for(const x of [-.255,.255]) {
    cube(out,[x,.12,.045],[.5,.24,.6],'#282830');
    cube(out,[x,.22,.303],[.48,.08,.025],cream);
    cube(out,[x,.69,.26],[.26,.19,.025],'#4e4b60');
  }
  cube(out,[0,2.02,0],[1.02,1.28,.54],coat,undefined,true);
  cube(out,[0,2.01,.278],[.53,1.01,.035],cream);
  cube(out,[0,1.64,.31],[.57,.2,.045],bright);
  for(const x of [-.225,.225])cube(out,[x,2.44,.32],[.045,.3,.045],dark);
  for(const side of [-1,1]) {
    const part=side<0?'arm-left':'arm-right';
    cube(out,[side*.77,2.05,0],[.46,1.2,.52],coat,part,true);
    cube(out,[side*.77,1.52,0],[.47,.22,.53],dark,part);
    cube(out,[side*.77,1.34,.015],[.42,.21,.46],skin,part);
    cube(out,[side*.77,2.58,0],[.47,.17,.53],bright,part);
  }
  cube(out,[0,3.2,0],[1.07,1.06,1.01],coat,'head',true);
  cube(out,[0,3.12,.515],[.83,.74,.035],skin,'head');
  cube(out,[0,3.49,.55],[.83,.13,.05],'#54382f','head');
  cube(out,[-.29,3.36,.55],[.22,.17,.05],'#54382f','head');
  for(const side of [-1,1]) {
    cube(out,[side*.26,3.19,.552],[.2,.1,.025],cream,'head');
    cube(out,[side*.22,3.19,.57],[.085,.105,.025],'#39564c','head');
    cube(out,[side*.39,3.92,0],[.29,.38,.34],coat,'head');
    cube(out,[side*.39,4.12,0],[.29,.12,.34],dark,'head');
    cube(out,[side*.39,3.93,.18],[.15,.23,.025],cream,'head');
  }
  cube(out,[0,2.92,.55],[.23,.07,.025],'#a76e58','head');
  // Small backpack and two straps give the model a recognisable back view.
  cube(out,[0,1.98,-.48],[.78,.88,.4],'#66503e',undefined,true);
  cube(out,[0,1.74,-.7],[.59,.31,.09],'#9d7e51');
  cube(out,[0,1.79,-.755],[.12,.14,.035],'#e6c97f');
  return out;
}
