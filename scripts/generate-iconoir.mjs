import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Stable application names mapped to unmodified official Iconoir regular SVGs.
const icons = {
  ArrowDownToLine:'download', ArrowUpRight:'arrow-up-right', ArrowRight:'arrow-right', ArrowLeft:'arrow-left',
  Coffee:'coffee-cup', PackageOpen:'package', Star:'star', GitFork:'git-fork', Blocks:'packages',
  Paintbrush:'palette', Library:'book-stack', CodeXml:'code', Gamepad2:'gamepad', Check:'check', ChevronDown:'nav-arrow-down',
  Copy:'copy', Search:'search', Expand:'expand', Pause:'pause', Play:'play', Menu:'menu',
  PanelsTopLeft:'view-grid', Settings2:'settings', RotateCcw:'restart', Upload:'upload', Layers:'color-filter',
  Footprints:'walking', MoveHorizontal:'drag', Monitor:'computer', Laptop:'laptop', Terminal:'terminal',
  X:'xmark', Bug:'bug', GitPullRequest:'git-pull-request', MessagesSquare:'chat-bubble',
  Home:'home-simple', Book:'book', GitHub:'github', Discord:'discord'
};
const out = new URL('../src/components/icons/', import.meta.url);
await mkdir(out,{recursive:true});
for (const [name,file] of Object.entries(icons)) {
  await readFile(require.resolve(`iconoir/icons/regular/${file}.svg`),'utf8'); // Fail if an upstream glyph disappears.
  await writeFile(new URL(`${name}.astro`,out),`---
// Iconoir ${file}; rendered on the server, no client icon runtime.
import source from 'iconoir/icons/regular/${file}.svg?raw';
import type { HTMLAttributes } from 'astro/types';
type Props = HTMLAttributes<'svg'> & { size?: number; };
const { size=20, class:className, ...props } = Astro.props;
const body=source.slice(source.indexOf('>')+1,source.lastIndexOf('</svg>'));
---
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke-width="1.5" class:list={['iconoir',className]} aria-hidden="true" focusable="false" {...props} set:html={body}/>
`);
}
await writeFile(new URL('index.ts',out),Object.keys(icons).map(name=>`export { default as ${name} } from './${name}.astro';`).join('\n')+'\n');
console.log(`Generated ${Object.keys(icons).length} Iconoir components.`);
