import sharp from "sharp";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { once } from "node:events";
import { resolve } from "node:path";

// Reconstructed navigation, using supplied screenshots. No live app recording.
const encoder = process.env.FFMPEG_PATH || resolve("output/video-tools/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe");
const width = 1440, height = 776, fps = 30;
const output = resolve("public/videos");
await mkdir(output, { recursive: true });
const screens = {};
const sources = Object.fromEntries([
  ...["library", "browse", "settings"].map(name => [name, `public/images/screenshots/${name}.png`]),
  ...["library-dark", "instance-mods", "instance-updates", "news", "modpacks", "modpack-details", "themes-custom", "themes-dark"].map(name => [name, `assets/demo/${name}.png`])
]);
const transforms = {};
for (const [name, source] of Object.entries(sources)) {
  const metadata = await sharp(source).metadata();
  const scale = Math.min(width / metadata.width, height / metadata.height);
  transforms[name] = { scale, left: (width - metadata.width * scale) / 2, top: (height - metadata.height * scale) / 2 };
  screens[name] = await sharp(source)
    .resize(width, height, { fit: "contain", background: "#0f0f12" }).ensureAlpha().raw().toBuffer();
}
const clips = [
  { name: "navigation", start: "library-dark", duration: 18, clicks: [
    { time: 2.2, screen: "modpacks", x: 100, y: 297 },
    { time: 6, screen: "modpack-details", x: 1102, y: 560 },
    { time: 10, screen: "modpacks", x: 1406, y: 169 },
    { time: 13, screen: "news", x: 100, y: 262 },
    { time: 16, screen: "library-dark", x: 90, y: 182 }
  ] },
  { name: "modpacks", start: "library-dark", duration: 15, clicks: [
    { time: 2.2, screen: "modpacks", x: 100, y: 297 },
    { time: 6, screen: "modpack-details", x: 1102, y: 560 },
    { time: 10, screen: "modpacks", x: 1406, y: 169 },
    { time: 13, screen: "library-dark", x: 100, y: 182 }
  ] },
  { name: "library", start: "library-dark", duration: 15, clicks: [
    { time: 2.2, screen: "instance-mods", x: 310, y: 635 },
    { time: 6, screen: "instance-updates", x: 1175, y: 265 },
    { time: 10, screen: "instance-mods", x: 462, y: 265 },
    { time: 13, screen: "library-dark", x: 1467, y: 174 }
  ] },
  { name: "browse", duration: 9, clicks: [
    { time: 2.2, screen: "browse", x: 100, y: 222 },
    { time: 6, screen: "library", x: 100, y: 182 }
  ] },
  { name: "settings", duration: 23, clicks: [
    { time: 2.2, screen: "settings", x: 80, y: 914 },
    { time: 5.5, screen: "themes-custom", x: 744, y: 326 },
    { time: 9, screen: "themes-dark", x: 644, y: 510 },
    { time: 12.5, screen: "themes-custom", x: 1058, y: 555 },
    { time: 16, screen: "settings", x: 1347, y: 631 },
    { time: 20, screen: "library", x: 100, y: 182 }
  ] }
];
const center = { x: width * .55, y: height * .52 };
const ease = t => t * t * (3 - 2 * t);
for (const clip of clips) {
  clip.start ||= "library";
  let previous = clip.start;
  for (const click of clip.clicks) {
    const transform = transforms[previous];
    click.x = click.x * transform.scale + transform.left;
    click.y = click.y * transform.scale + transform.top;
    previous = click.screen;
  }
  const path = [{ time: 0, ...center }];
  for (const click of clip.clicks) {
    path.push({ time: click.time - 1.25, ...center }, { time: click.time, x: click.x, y: click.y },
      { time: click.time + .42, x: click.x, y: click.y }, { time: click.time + 1.35, ...center });
  }
  path.push({ time: clip.duration, ...center });
  const destination = resolve(output, `${clip.name}.mp4`);
  const ffmpeg = spawn(encoder, ["-y", "-hide_banner", "-loglevel", "error", "-f", "rawvideo", "-pixel_format", "rgba",
    "-video_size", `${width}x${height}`, "-framerate", String(fps), "-i", "pipe:0", "-an", "-c:v", "libx264",
    "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", destination],
    { stdio: ["pipe", "ignore", "pipe"], windowsHide: true });
  let errors = "";
  ffmpeg.stderr.on("data", chunk => { errors += chunk.toString(); });
  const completion = once(ffmpeg, "close");
  for (let frame = 0; frame < clip.duration * fps; frame++) {
    const time = frame / fps;
    const selected = clip.clicks.filter(click => time >= click.time + .12).at(-1)?.screen || clip.start;
    const segment = path.findIndex((point, i) => i < path.length - 1 && time >= point.time && time < path[i + 1].time);
    const a = path[Math.max(0, segment)], b = path[Math.max(0, segment) + 1];
    const t = ease(Math.min(1, Math.max(0, (time - a.time) / (b.time - a.time))));
    const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
    const click = clip.clicks.find(click => time >= click.time && time < click.time + .5);
    const pulse = click ? (time - click.time) / .5 : 0;
    const shrink = click && pulse < .25 ? .88 : 1;
    const ring = click ? `<circle cx="${click.x}" cy="${click.y}" r="${9 + pulse * 24}" fill="none" stroke="#cbb6ff" stroke-width="3" opacity="${1 - pulse}"/>` : "";
    const overlay = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${ring}<g transform="translate(${x} ${y}) scale(${shrink})"><path d="M 0 0 L 0 29 L 7 22 L 13 35 L 19 32 L 13 20 L 24 19 Z" fill="white" stroke="#15151c" stroke-width="2" stroke-linejoin="round"/></g></svg>`);
    const pixels = await sharp(screens[selected], { raw: { width, height, channels: 4 } }).composite([{ input: overlay }]).raw().toBuffer();
    if (!ffmpeg.stdin.write(pixels)) await once(ffmpeg.stdin, "drain");
  }
  ffmpeg.stdin.end();
  const [code] = await completion;
  if (code !== 0) throw new Error(`FFmpeg failed (${code}): ${errors}`);
  await sharp(sources[clip.start]).resize(width, height, { fit: "contain", background: "#0f0f12" }).webp({ quality: 90 }).toFile(resolve(output, `${clip.name}-poster.webp`));
  console.log(`${clip.name}.mp4: ${clip.duration}s, ${width}×${height}, ${fps}fps`);
}
