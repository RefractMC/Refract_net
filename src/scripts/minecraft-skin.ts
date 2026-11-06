import type { SkinViewer } from 'skinview3d';
type Model = 'default' | 'slim' | 'auto-detect';

class MinecraftSkin extends HTMLElement {
  private cleanup?:()=>void;
  connectedCallback(){
    if(this.cleanup)return;
    const canvas=this.querySelector('canvas')!;
    const stage=this.querySelector<HTMLElement>('.skin-stage')!;
    const loading=this.querySelector<HTMLElement>('.skin-loading')!;
    const toolbar=this.querySelector<HTMLElement>('.skin-toolbar')!;
    const controls=this.querySelector<HTMLElement>('.skin-stage-controls')!;
    const pause=this.querySelector<HTMLButtonElement>('[data-pause]')!;
    const walk=this.querySelector<HTMLButtonElement>('[data-walk]')!;
    const layers=this.querySelector<HTMLButtonElement>('[data-layers]')!;
    const restore=this.querySelector<HTMLButtonElement>('[data-restore]')!;
    const select=this.querySelector<HTMLSelectElement>('[data-model-select]')!;
    const input=this.querySelector<HTMLInputElement>('input[type="file"]')!;
    const status=this.querySelector<HTMLElement>('[data-skin-status]')!;
    const name=this.querySelector<HTMLElement>('[data-skin-name]')!;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const controller=new AbortController(),{signal}=controller;
    let viewer:SkinViewer|null=null,visible=false,started=false,paused=false,walking=false,uploadId=0;
    let skinImage:HTMLImageElement|null=null;
    let library:typeof import('skinview3d')|null=null;
    const report=(message:string,error=false)=>{status.textContent=message;status.dataset.error=String(error);};
    const sync=()=>{
      if(!viewer)return;
      const stopped=paused||preference.matches||!visible||document.hidden;
      if(viewer.animation)viewer.animation.paused=stopped;
      viewer.renderPaused=stopped;
      if(visible&&!document.hidden)viewer.render();
    };
    const outerLayer=()=>{if(viewer){viewer.playerObject.skin.setOuterLayerVisible(layers.getAttribute('aria-pressed')==='true');viewer.render();}};
    const resize=new ResizeObserver(()=>{if(viewer){viewer.setSize(stage.clientWidth,stage.clientHeight);viewer.render();}});
    resize.observe(stage);
    const initialize=async()=>{
      if(started)return;started=true;
      try{
        // Three.js and the viewer are requested only near this section.
        library=await import('skinview3d');
        if(signal.aborted)return;
        viewer=new library.SkinViewer({canvas,width:stage.clientWidth,height:stage.clientHeight,pixelRatio:Math.min(devicePixelRatio,1.75),zoom:.83,fov:45,renderPaused:true});
        viewer.controls.enablePan=false;viewer.controls.enableZoom=false;viewer.controls.enableDamping=false;
        viewer.controls.rotateSpeed=.65;
        // OrbitControls sets touch-action:none. Vertical swipes should still scroll the page.
        canvas.style.touchAction='pan-y';
        viewer.playerObject.rotation.y=.35;
        viewer.globalLight.intensity=2;viewer.cameraLight.intensity=.65;
        viewer.animation=new library.IdleAnimation();viewer.animation.speed=.8;
        await viewer.loadSkin(this.dataset.skin!,{model:this.dataset.model as Model});
        if(signal.aborted)return;
        loading.hidden=true;toolbar.hidden=false;controls.hidden=false;
        viewer.controls.addEventListener('change',()=>{if(viewer?.renderPaused)viewer.render();});
        sync();
      }catch(error){
        console.warn('Minecraft skin preview could not initialize.',error);
        viewer?.dispose();viewer=null;canvas.hidden=true;
        loading.textContent='The 3D skin preview is unavailable in this browser.';
      }
    };
    const observer=new IntersectionObserver(entries=>{
      visible=entries[0].isIntersecting;
      if(visible)void initialize();sync();
    },{rootMargin:'180px'});observer.observe(this);
    pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Resume skin animation':'Pause skin animation');sync();},{signal});
    walk.addEventListener('click',()=>{
      if(!viewer||!library)return;walking=!walking;walk.setAttribute('aria-pressed',String(walking));
      viewer.animation=walking?new library.WalkingAnimation():new library.IdleAnimation();viewer.animation.speed=.8;sync();
    },{signal});
    layers.addEventListener('click',()=>{layers.setAttribute('aria-pressed',String(layers.getAttribute('aria-pressed')!=='true'));outerLayer();},{signal});
    this.querySelector('[data-reset-view]')!.addEventListener('click',()=>{if(viewer){viewer.resetCameraPose();viewer.playerObject.rotation.y=.35;viewer.render();}},{signal});
    canvas.addEventListener('keydown',event=>{if(!viewer||!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();viewer.playerObject.rotation.y+=event.key==='ArrowLeft'?-.2:.2;viewer.render();},{signal});
    select.addEventListener('change',async()=>{
      if(!viewer)return;
      try{await viewer.loadSkin(skinImage??this.dataset.skin!,{model:select.value as Model});outerLayer();report('Arm model updated.');}
      catch{report('Could not change the arm model. Please try again.',true);}
    },{signal});
    input.addEventListener('change',async()=>{
      const file=input.files?.[0];if(!file||!viewer)return;
      const request=++uploadId;
      try{
        if(file.size>2*1024*1024)throw new Error('Choose a PNG smaller than 2 MB.');
        const signature=new Uint8Array(await file.slice(0,8).arrayBuffer());
        if(signature.join(',')!=='137,80,78,71,13,10,26,10')throw new Error('Choose a Minecraft skin saved as a PNG.');
        const source=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Could not read that file.'));reader.readAsDataURL(file);});
        const image=new Image();image.src=source;await image.decode();
        if(image.width<64||image.width>1024||image.width%64!==0||![image.width,image.width/2].includes(image.height))throw new Error('Use a 64×64 or 64×32 skin, or a matching HD size.');
        if(signal.aborted||request!==uploadId||!viewer)return;
        viewer.loadSkin(image,{model:'auto-detect'});skinImage=image;select.value='auto-detect';outerLayer();
        name.textContent=file.name.replace(/\.png$/i,'').slice(0,40);restore.hidden=false;
        canvas.setAttribute('aria-label','Your Minecraft skin. Drag or use left and right arrow keys to rotate.');
        report('Previewing locally. Your skin has not been uploaded.');
      }catch(error){if(request===uploadId)report(error instanceof Error?error.message:'Could not load that skin.',true);}
      finally{input.value='';}
    },{signal});
    restore.addEventListener('click',async()=>{
      if(!viewer)return;++uploadId;
      try{await viewer.loadSkin(this.dataset.skin!,{model:this.dataset.model as Model});skinImage=null;select.value=this.dataset.model!;name.textContent='Clavnerok';restore.hidden=true;outerLayer();canvas.setAttribute('aria-label','Clavnerok’s Minecraft skin. Drag or use left and right arrow keys to rotate.');report('PNG skins stay in your browser.');}
      catch{report('Could not restore the default skin. Please reload.',true);}
    },{signal});
    document.addEventListener('visibilitychange',sync,{signal});
    preference.addEventListener('change',sync,{signal});
    this.cleanup=()=>{controller.abort();observer.disconnect();resize.disconnect();viewer?.dispose();viewer=null;};
  }
  disconnectedCallback(){this.cleanup?.();this.cleanup=undefined;}
}
if(!customElements.get('minecraft-skin'))customElements.define('minecraft-skin',MinecraftSkin);
