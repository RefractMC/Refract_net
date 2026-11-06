import textures from './minecraft-textures.json';
export type TextureName = keyof typeof textures;
export function alpha(name:TextureName,x:number,y:number):number {
  const t=textures[name];
  if(x<0||y<0||x>=t.width||y>=t.height)return 0;
  return t.pixels[(Math.floor(y)*t.width+Math.floor(x))*4+3];
}
export function texel(name:TextureName,x:number,y:number,tint=[1,1,1]):string {
  const texture=textures[name];
  const offset=((Math.floor(y)%texture.height)*texture.width+Math.floor(x)%texture.width)*4;
  return '#'+texture.pixels.slice(offset,offset+3).map((n,i)=>Math.round(n*tint[i]).toString(16).padStart(2,'0')).join('');
}
