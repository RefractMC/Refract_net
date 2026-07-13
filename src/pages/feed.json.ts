import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site } from "@/data/site";

export const GET: APIRoute = async () => {
  const posts = (await getCollection("news")).sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
  return new Response(JSON.stringify({ version: "https://jsonfeed.org/version/1.1", title: "Refract news", home_page_url: `${site.url}/news/`, feed_url: `${site.url}/feed.json`, items: posts.map((post) => ({ id: `${site.url}/news/${post.id}/`, url: `${site.url}/news/${post.id}/`, title: post.data.title, summary: post.data.description, date_published: post.data.publishedAt.toISOString(), tags: post.data.tags })) }), { headers: { "Content-Type": "application/feed+json; charset=utf-8" } });
};
