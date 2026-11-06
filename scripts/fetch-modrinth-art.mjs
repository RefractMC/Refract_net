import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const directory = new URL('../public/images/modrinth/', import.meta.url);
const headers = { 'User-Agent': 'RefractWebsite/1.0 (https://github.com/RefractMC/Refract_net)' };
const selections = [
  ['sodium', 'icon'], ['continuity', 'icon'], ['fresh-animations', 'icon'],
  ['faithful-32x', 'icon'], ['iris', 'gallery'], ['bare-bones', 'gallery'],
];
await mkdir(directory, { recursive: true });
const sources = await Promise.all(selections.map(async ([slug, kind]) => {
  const response = await fetch(`https://api.modrinth.com/v2/project/${slug}`, { headers });
  if (!response.ok) throw new Error(`${slug}: ${response.status}`);
  const project = await response.json();
  const gallery = project.gallery.find(image => image.featured) ?? project.gallery[0];
  const source = kind === 'icon' ? project.icon_url : gallery.url;
  const imageResponse = await fetch(source, { headers });
  if (!imageResponse.ok) throw new Error(`${source}: ${imageResponse.status}`);
  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  await sharp(buffer).resize(kind === 'icon' ? 128 : 350, undefined, { withoutEnlargement: true }).webp({ quality: 88 }).toFile(fileURLToPath(new URL(`${slug}.webp`, directory)));
  return { slug, title: project.title, kind, project: `https://modrinth.com/${project.project_type}/${slug}`, source, galleryTitle: kind === 'gallery' ? gallery.title : null, projectLicense: project.license, fetchedAt: new Date().toISOString() };
}));
await writeFile(new URL('sources.json', directory), JSON.stringify(sources, null, 2) + '\n');
console.log(`Saved ${sources.length} Modrinth artwork assets and their provenance.`);
