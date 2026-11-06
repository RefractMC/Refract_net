import type { APIRoute } from "astro";
import { getNewsFeed } from "@/data/news";
import { site } from "@/data/site";
const escapeXml = (value: string) => value.replace(/[<>&'"]/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char]!);
export const GET: APIRoute = async () => {
  const posts = await getNewsFeed();
  const items = posts.map(post => '<item><title>' + escapeXml(post.title) + '</title><link>' + escapeXml(post.url) + '</link><guid>' + escapeXml(post.url) + '</guid><pubDate>' + post.date.toUTCString() + '</pubDate><description>' + escapeXml(post.description) + '</description>' + post.tags.map(tag => '<category>' + escapeXml(tag) + '</category>').join('') + '</item>').join('');
  return new Response('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Refract news</title><link>' + site.url + '/news/</link><description>Release notes and project updates from Refract.</description><language>en-us</language>' + items + '</channel></rss>', { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};

