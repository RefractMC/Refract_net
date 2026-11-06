import { texel, alpha, type TextureName } from './minecraft-texture';
export type Point = [number,number,number];
export type Block = { part?:'tail'|'oar' };
export const foxSurfaces:{points:Point[];color:string;part?:Block['part']}[]=[];
// Unwrap in Minecraft model pixels first, then rotate the complete cuboid.
// This keeps one texture pixel square on every model face.
function cuboid(p:Point, dimensions:Point, uv:[number,number], texture:TextureName, rotate:boolean|'floor'|'long'=false, part?:Block['part'], scale=.1){
 const [w,h,d]=dimensions,[u,v]=uv;
 const corners:Point[]=[[-w/2,-h/2,-d/2],[w/2,-h/2,-d/2],[w/2,h/2,-d/2],[-w/2,h/2,-d/2],[-w/2,-h/2,d/2],[w/2,-h/2,d/2],[w/2,h/2,d/2],[-w/2,h/2,d/2]];
 const faces=[{ids:[0,1,2,3],r:[u+d,v+d,w,h]}, {ids:[5,4,7,6],r:[u+2*d+w,v+d,w,h]}, {ids:[4,5,1,0],r:[u+d,v,w,d]}, {ids:[3,2,6,7],r:[u+d+w,v,w,d]}, {ids:[4,0,3,7],r:[u,v+d,d,h]}, {ids:[1,5,6,2],r:[u+d+w,v+d,d,h]}];
 for(const face of faces){
  const a=face.ids.map(i=>corners[i]);const [tx,ty,cols,rows]=face.r;
  const at=(s:number,t:number):Point=>{const q=a[0].map((n,i)=>n+(a[1][i]-n)*s+(a[3][i]-n)*t);return rotate==='floor'?[p[0]+q[0]*scale,p[1]+q[2]*scale,p[2]+q[1]*scale]:rotate==='long'?[p[0]+q[0]*scale,p[1]-q[1]*scale,p[2]+q[2]*scale]:rotate?[p[0]-q[1]*scale,p[1]+q[2]*scale,p[2]+q[0]*scale]:[p[0]-q[2]*scale,p[1]-q[1]*scale,p[2]+q[0]*scale];};
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
   if(alpha(texture,tx+x,ty+y)<128)continue;
   const hex=texel(texture,tx+x,ty+y),n=parseInt(hex.slice(1),16);
   foxSurfaces.push({points:[at(x/cols,y/rows),at((x+1)/cols,y/rows),at((x+1)/cols,(y+1)/rows),at(x/cols,(y+1)/rows)],color:`rgb(${n>>16},${(n>>8)&255},${n&255})`,part});
  }
 }
}
// Boat boards use their complete atlas islands, not a repeated arbitrary crop.
cuboid([0,.02,0],[28,16,3],[0,0],'oak','floor',undefined,.085);
for(const z of [-.68,.68])cuboid([0,.28,z],[28,6,2],[0,19],'oak','long',undefined,.085);
for(const x of [-1.16,1.16])cuboid([x,.28,0],[16,6,2],[0,27],'oak',false,undefined,.085);
for(const z of [-1,1]){cuboid([0,.42,z],[2,2,12],[0,0],'oak_planks',false,'oar',.065);cuboid([-.5,.42,z],[5,1,7],[0,0],'oak_planks',false,'oar',.065);}
// Rotate the torso with its cream chest facing down; each ear has its own atlas island.
// Original Java fox texture dimensions: torso 6×11×6, tail 4×9×5.
cuboid([-.28,1.04,0],[6,11,6],[24,15],'fox',true);
for(const x of [-.68,.12])for(const z of [-.2,.2])cuboid([x,.57,z],[2,6,2],[13,24],'fox');
cuboid([-1.18,1.1,0],[4,9,5],[30,0],'fox',true,'tail');
cuboid([.57,1,0],[8,6,6],[1,5],'fox');
cuboid([.96,.8,0],[4,2,3],[6,18],'fox');
cuboid([.4,1.4,-.3],[2,2,1],[8,1],'fox');
cuboid([.4,1.4,.3],[2,2,1],[15,1],'fox');
