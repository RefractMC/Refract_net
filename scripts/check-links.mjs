import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize, resolve } from "node:path";

const root = resolve("dist");
if (!existsSync(root)) throw new Error("dist/ does not exist. Run the production build first.");
const htmlFiles = [];
const walk = (dir) => readdirSync(dir).forEach((name) => { const path = join(dir, name); statSync(path).isDirectory() ? walk(path) : name.endsWith(".html") && htmlFiles.push(path); });
walk(root);
const broken = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const raw = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(raw)) continue;
    const path = raw.split(/[?#]/)[0];
    let target = path.startsWith("/") ? join(root, path) : resolve(dirname(file), path);
    if (path.endsWith("/")) target = join(target, "index.html");
    else if (!normalize(target).split(/[\\/]/).pop().includes(".")) target = join(target, "index.html");
    if (!existsSync(target)) broken.push(`${file.replace(root, "dist")} -> ${raw}`);
  }
}
if (broken.length) { console.error(`Broken internal links (${broken.length}):\n${broken.join("\n")}`); process.exit(1); }
console.log(`Validated ${htmlFiles.length} HTML files with no broken internal links.`);
