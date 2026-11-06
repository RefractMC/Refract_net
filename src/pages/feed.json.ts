import type { APIRoute } from "astro";
import { getNewsFeed } from "@/data/news";
import { site } from "@/data/site";
export const GET: APIRoute = async () => {
  const posts = await getNewsFeed();
  return new Response(JSON.stringify({ version: "https://jsonfeed.org/version/1.1", title: "Refract news", home_page_url: site.url + "/news/", feed_url: site.url + "/feed.json", items: posts.map(post => ({ id: post.url, url: post.url, title: post.title, summary: post.description, content_text: post.description, date_published: post.date.toISOString(), tags: post.tags })) }), { headers: { "Content-Type": "application/feed+json; charset=utf-8" } });
};

