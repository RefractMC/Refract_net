import { worldModel, characterModel, type Surface, type Vec3 } from "./voxel-models";

class VoxelScene extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    if(this.cleanup)return;
    const canvas=this.querySelector('canvas')!;
    const gl=canvas.getContext('webgl',{alpha:true,antialias:true});
    const fallback=()=>{this.querySelector<HTMLElement>('.scene-fallback')!.hidden=false;canvas.hidden=true;this.querySelector<HTMLElement>('.scene-controls')!.hidden=true;const looks=this.querySelector<HTMLElement>('.looks');if(looks)looks.hidden=true;};
    if(!gl){fallback();return;}
    const shader=(type:number,source:string)=>{
      const shader=gl.createShader(type)!;gl.shaderSource(shader,source);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw new Error('3D shader compilation failed');}return shader;
    };
    let vertex:WebGLShader, fragment:WebGLShader;
    try { vertex=shader(gl.VERTEX_SHADER,'attribute vec4 position; attribute vec3 color; varying vec3 tint; void main(){gl_Position=position;tint=color;}');fragment=shader(gl.FRAGMENT_SHADER,'precision mediump float; varying vec3 tint; void main(){gl_FragColor=vec4(tint,1.0);}'); }
    catch {fallback();return;}
    const program=gl.createProgram()!;
    gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);fallback();return;}
    gl.useProgram(program);
    const buffer=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    const position=gl.getAttribLocation(program,'position'),color=gl.getAttribLocation(program,'color');
    gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,4,gl.FLOAT,false,28,0);
    gl.enableVertexAttribArray(color);gl.vertexAttribPointer(color,3,gl.FLOAT,false,28,16);
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
    const isCharacter=this.dataset.model==='character';
    let surfaces:Surface[]=isCharacter?characterModel():worldModel();
    let data=new Float32Array(surfaces.length*6*7);
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const controller=new AbortController(),{signal}=controller;
    const pause=this.querySelector<HTMLButtonElement>('[data-pause]');
    let width=0,height=0,time=0,frame=0,last=0,lastDraw=0,visible=false,running=!preference.matches;
    let rotation=isCharacter?-.35:-.34,dragging=false,pointerX=0;
    const draw=()=>{
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      if(!width||!height)return;
      const t=time/1000;
      const yaw=rotation+(preference.matches?0:Math.sin(t*.45)*.08);
      const pitch=isCharacter?.12:.32;
      const scale=isCharacter?Math.min(height/5.2,width/3.65):Math.min(width/5.55,height/3.8);
      const cx=width*.5,cy=height*(isCharacter?.87:.60)+(preference.matches?0:Math.sin(t*1.2)*4);
      const cos=Math.cos(yaw),sin=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
      let index=0;
      const transform=(point:Vec3,part?:string):Vec3=>{
        let [x,y,z]=point;
        if(!preference.matches){
          if(part==='boat'){y+=Math.sin(t*1.3)*.07;z+=Math.sin(t*.65)*.07;}
          if(part==='crystal')y+=Math.sin(t*1.6+x)*.10;
          if(part?.startsWith('arm')){
            const angle=Math.sin(t*1.3)*(part==='arm-left'?.07:-.07),dy=y-2.55;
            y=2.55+dy*Math.cos(angle)-z*Math.sin(angle);z=dy*Math.sin(angle)+z*Math.cos(angle);
          }
          if(part==='head'){
            const angle=Math.sin(t*.6)*.06,xx=x*Math.cos(angle)+z*Math.sin(angle);
            z=-x*Math.sin(angle)+z*Math.cos(angle);x=xx;
          }
        }
        const rx=x*cos+z*sin,rz=-x*sin+z*cos;
        return [rx,y*cp-rz*sp,y*sp+rz*cp];
      };
      for(const surface of surfaces){
        const points=surface.points.map(p=>transform(p,surface.part));
        for(const n of [0,1,2,0,2,3]){
          const [x,y,z]=points[n],w=12-z,perspective=12/w;
          data[index++]=((cx+x*scale*perspective)/width*2-1)*w;
          data[index++]=(1-(cy-y*scale*perspective)/height*2)*w;
          data[index++]=(41*w-80)/39;data[index++]=w;
          data[index++]=surface.color[0];data[index++]=surface.color[1];data[index++]=surface.color[2];
        }
      }
      gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,index/7);
    };
    const tick=(now:number)=>{time+=last?Math.min(now-last,50):0;last=now;if(now-lastDraw>=33){draw();lastDraw=now;}if(running&&visible&&!document.hidden)frame=requestAnimationFrame(tick);};
    const sync=()=>{cancelAnimationFrame(frame);last=0;if(running&&visible&&!document.hidden)frame=requestAnimationFrame(tick);};
    const resize=new ResizeObserver(()=>{width=this.clientWidth;height=this.clientHeight;const dpr=Math.min(devicePixelRatio,1.75);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);gl.viewport(0,0,canvas.width,canvas.height);draw();});
    resize.observe(this);
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{rootMargin:'80px'});observer.observe(this);
    pause?.addEventListener('click',()=>{running=!running;pause?.setAttribute('aria-pressed',String(!running));pause?.setAttribute('aria-label',running?'Pause 3D animation':'Resume 3D animation');sync();},{signal});
    preference.addEventListener('change',()=>{running=!preference.matches;pause?.setAttribute('aria-pressed',String(!running));sync();draw();},{signal});
    if(isCharacter){
      canvas.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button!==0)return;dragging=true;pointerX=event.clientX;canvas.setPointerCapture(event.pointerId);},{signal});
      canvas.addEventListener('pointermove',event=>{if(!dragging)return;rotation+=(event.clientX-pointerX)*.012;pointerX=event.clientX;draw();},{signal});
      canvas.addEventListener('pointerup',()=>{dragging=false;},{signal});
      canvas.addEventListener('pointercancel',()=>{dragging=false;},{signal});
      canvas.addEventListener('keydown',event=>{if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;event.preventDefault();rotation+=event.key==='ArrowLeft'?-.2:.2;draw();},{signal});
      this.querySelector('[data-reset]')?.addEventListener('click',()=>{rotation=-.35;draw();},{signal});
      this.querySelectorAll<HTMLButtonElement>('[data-look]').forEach(button=>button.addEventListener('click',()=>{
        surfaces=characterModel(Number(button.dataset.look));data=new Float32Array(surfaces.length*6*7);
        this.querySelectorAll('[data-look]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));draw();
      },{signal}));
    }
    document.addEventListener('visibilitychange',sync,{signal});
    canvas.addEventListener('webglcontextlost',()=>{running=false;sync();fallback();},{signal});
    this.cleanup=()=>{controller.abort();observer.disconnect();resize.disconnect();cancelAnimationFrame(frame);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);};
  }
  disconnectedCallback(){this.cleanup?.();this.cleanup=undefined;}
}
if(!customElements.get('voxel-scene'))customElements.define('voxel-scene',VoxelScene);

