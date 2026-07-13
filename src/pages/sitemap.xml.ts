import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { docsCategories } from "@/data/site";

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://refractmc.net");
  const [news, docs] = await Promise.all([getCollection("news"), getCollection("docs")]);
  const tags = [...new Set(news.flatMap((post) => post.data.tags.map((tag) => tag.toLowerCase())))];
  const paths = ["/", "/about/", "/news/", "/tags/", "/download/", "/download/mac/", "/download/linux/", "/download/steam-deck/", "/wiki/", ...news.map((post) => `/news/${post.id}/`), ...tags.map((tag) => `/tags/${tag}/`), ...docsCategories.map((category) => `/wiki/${category.id}/`), ...docs.map((doc) => `/wiki/${doc.id}/`)];
  const body = paths.map((path) => `<url><loc>${new URL(path, base).href}</loc></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
