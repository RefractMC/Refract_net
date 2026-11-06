import { foxSurfaces, type Point, type Block } from "./fox-model";
const surfaces = foxSurfaces;
class FlyingFox extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    if (this.cleanup) return;
    const canvas = this.querySelector("canvas")!;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) { this.style.display = "none"; return; }
    const shader = (type: number, source: string) => {
      const result = gl.createShader(type)!;
      gl.shaderSource(result, source); gl.compileShader(result);
      return result;
    };
    const vertex = shader(gl.VERTEX_SHADER, "attribute vec4 position; attribute vec4 color; varying vec4 tint; void main(){ gl_Position=position; tint=color; }");
    const fragment = shader(gl.FRAGMENT_SHADER, "precision mediump float; varying vec4 tint; void main(){ gl_FragColor=tint; }");
    const program = gl.createProgram()!;
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program); gl.useProgram(program);
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const position = gl.getAttribLocation(program, "position"), color = gl.getAttribLocation(program, "color");
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 4, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(color); gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 32, 16);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const colors = new Map(surfaces.map(surface => [surface.color, surface.color.match(/\d+/g)!.map(Number).map(v => v / 255)]));
    const button = this.querySelector("button")!;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const controller = new AbortController();
    const { signal } = controller;
    const duration = 4800;
    let width = 0, height = 0, flightY = 0, frame = 0, elapsed = preference.matches ? duration : 0, last = 0, lastDraw = 0, visible = false;
    let running = !preference.matches;
    button.hidden = preference.matches;

    const draw = () => {
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (!width || !height) return;
      const vertices: number[] = [];
      const triangle = (points: Point[], tint: number[]) => {
        for (const [x, y, z] of points) {
          // Preserve clip-space w so depth interpolates correctly across the
          // muzzle and fur tiles; affine depth caused stray white face pixels.
          const w = 10 - z;
          vertices.push((x / width * 2 - 1) * w, (1 - y / height * 2) * w, (31 * w - 60) / 29, w, ...tint);
        }
      };
      const progress = Math.min(elapsed / duration, 1);
      const idle = Math.max(0, elapsed - duration) / 1000;
      const ease = 1 - Math.pow(1 - progress, 3);
      const scale = width < 600 ? 31 : 43;
      const destination = width < 600 ? width * .82 : width * .86;
      const cx = -130 + (destination + 130) * ease + Math.sin(idle * .8) * 7;
      const wave = Math.sin(progress * Math.PI * 4) * (1 - progress);
      const cy = flightY + scale * .6 + wave * 14 + Math.sin(idle * 1.4) * 7;
      const yaw = -.58 + Math.sin(progress * Math.PI * 2) * .25 + Math.sin(idle) * .04;
      const pitch = .35;
      const bank = wave * .085 + Math.sin(idle * 1.2) * .025;
      const time = elapsed / 1000;
      const transform = (point: Point, part?: Block["part"]): Point => {
        let [x, y, z] = point;
        const activity = 1 - progress * .8;
        if (part === "tail") { y += Math.sin(time * 3) * .08 * activity; z += Math.sin(time * 2) * .12 * activity; }
        if (part === "oar") y += Math.sin(time * 3 + Math.sign(z)) * .15 * activity;
        const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
        const rz = -x * Math.sin(yaw) + z * Math.cos(yaw);
        const ry = y * Math.cos(pitch) - rz * Math.sin(pitch);
        return [rx * Math.cos(bank) - ry * Math.sin(bank), rx * Math.sin(bank) + ry * Math.cos(bank), y * Math.sin(pitch) + rz * Math.cos(pitch)];
      };
      if (progress < 1) for (let i = 0; i < 8; i++) {
        const x = cx - 90 - i * 22, y = cy - 18 + Math.sin(time * 3 - i) * 7;
        const tint = [.68,.57,.94,(1-progress)*(1-i/8)*.45];
        triangle([[x,y,-7],[x+4,y,-7],[x+4,y+4,-7]],tint);
        triangle([[x,y,-7],[x+4,y+4,-7],[x,y+4,-7]],tint);
      }
      for (const surface of surfaces) {
        const points: Point[] = surface.points.map(p => {
          const [x,y,z] = transform(p, surface.part), perspective = 10 / (10 - z);
          return [cx + x * scale * perspective, cy - y * scale * perspective, z];
        });
        const tint = [...colors.get(surface.color)!, 1];
        triangle([points[0],points[1],points[2]],tint);
        triangle([points[0],points[2],points[3]],tint);
      }
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 8);
    };
    const tick = (now: number) => {
      elapsed += last ? Math.min(now - last, 50) : 0;
      last = now;
      if (now - lastDraw >= 32) { draw(); lastDraw = now; }
      if (running && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame); last = 0;
      if (running && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(() => {
      width = this.clientWidth; height = this.clientHeight;
      const action = this.parentElement?.querySelector(".hero-actions .button")?.getBoundingClientRect();
      flightY = action ? action.top - this.getBoundingClientRect().top + action.height / 2 : height * .7;
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height); draw();
    });
    resize.observe(this);
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
    observer.observe(this);
    button.addEventListener("click", () => {
      if (preference.matches) return;
      running = !running;
      button.setAttribute("aria-pressed", String(!running));
      button.setAttribute("aria-label", running ? "Pause fox animation" : "Resume fox animation");
      button.querySelector("span")!.textContent = running ? "Pause fox" : "Resume fox";
      sync();
    }, { signal });
    preference.addEventListener("change", () => {
      running = !preference.matches; elapsed = duration; button.hidden = preference.matches;
      button.setAttribute("aria-pressed", String(!running));
      button.setAttribute("aria-label", running ? "Pause fox animation" : "Resume fox animation");
      button.querySelector("span")!.textContent = running ? "Pause fox" : "Resume fox";
      sync(); draw();
    }, { signal });
    document.addEventListener("visibilitychange", sync, { signal });
    this.cleanup = () => { controller.abort(); observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame); gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment); };
  }
  disconnectedCallback() { this.cleanup?.(); this.cleanup = undefined; }
}
if (!customElements.get("flying-fox")) customElements.define("flying-fox", FlyingFox);
