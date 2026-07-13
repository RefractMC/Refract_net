import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site } from "@/data/site";

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" })[char]!);

export const GET: APIRoute = async () => {
  const posts = (await getCollection("news")).sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
  const items = posts.map((post) => `<item><title>${escapeXml(post.data.title)}</title><link>${site.url}/news/${post.id}/</link><guid>${site.url}/news/${post.id}/</guid><pubDate>${post.data.publishedAt.toUTCString()}</pubDate><description>${escapeXml(post.data.description)}</description>${post.data.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}</item>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Refract news</title><link>${site.url}/news/</link><description>Release notes and project updates from Refract.</description><language>en-us</language>${items}</channel></rss>`, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
