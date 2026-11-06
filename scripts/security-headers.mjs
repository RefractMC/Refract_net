import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? htmlFiles(join(directory, entry.name)) : entry.name.endsWith(".html") ? [join(directory, entry.name)] : []))).flat();
}
const files = await htmlFiles("dist");
const documents = await Promise.all(files.map(async path => ({ path, html: await readFile(path, "utf8") })));
const hashes = new Set();
for (const { html } of documents) {
  for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\bsrc\s*=/.test(attributes) && body.trim()) hashes.add("'sha256-" + createHash("sha256").update(body).digest("base64") + "'");
  }
}
const policy = [
  "default-src 'self'", "script-src 'self' https://www.googletagmanager.com " + [...hashes].join(" "),
  "style-src 'self' 'unsafe-inline'", "img-src 'self' data: https://avatars.githubusercontent.com",
  "font-src 'self'", "connect-src 'self' https://api.github.com https://discord.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.googletagmanager.com", "object-src 'none'", "base-uri 'self'", "form-action 'none'"
].join("; ");
// Meta CSP also protects static hosts (including GitHub Pages) without response-header support.
for (const { path, html } of documents) {
  const escaped = policy.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  await writeFile(path, html.replace(/<head>/i, '<head><meta http-equiv="Content-Security-Policy" content="' + escaped + '">'));
}
const headers = {
  "Content-Security-Policy": policy + "; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000"
};
// Cloudflare Pages and Netlify support the same static _headers syntax.
await writeFile("dist/_headers", "/*\n" + Object.entries(headers).map(([key, value]) => "  " + key + ": " + value).join("\n") + "\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n");
console.log(`Added CSP to ${files.length} HTML files; generated static hosting security headers.`);
