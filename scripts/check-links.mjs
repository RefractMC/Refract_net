import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve("dist");
if (!existsSync(root)) throw new Error("dist/ does not exist. Run the production build first.");
const htmlFiles = [];
const walk = (dir) => readdirSync(dir).forEach((name) => { const path = join(dir, name); statSync(path).isDirectory() ? walk(path) : name.endsWith(".html") && htmlFiles.push(path); });
walk(root);
const broken = [];
const ids = new Map(htmlFiles.map(file => [file, new Set([...readFileSync(file, "utf8").matchAll(/\b(?:id|name)=["']([^"']+)["']/g)].map(match => match[1]))]));
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const raw = match[1].replace(/&amp;/g, "&");
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(raw)) continue;
    const base = "https://local.test/" + relative(root, file).replace(/\\/g, "/");
    const url = new URL(raw, base);
    const path = decodeURIComponent(url.pathname);
    let target = join(root, path);
    if (path.endsWith("/") || !path.split("/").pop().includes(".")) target = join(target, "index.html");
    if (!existsSync(target)) broken.push(`${file.replace(root, "dist")} -> ${raw}`);
    else if (url.hash && ids.has(target) && !ids.get(target).has(decodeURIComponent(url.hash.slice(1)))) broken.push(`${file.replace(root, "dist")} -> missing anchor ${raw}`);
  }
}
if (broken.length) { console.error(`Broken internal links (${broken.length}):\n${broken.join("\n")}`); process.exit(1); }
console.log(`Validated ${htmlFiles.length} HTML files with no broken internal links or anchors.`);
