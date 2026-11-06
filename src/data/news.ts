import { getCollection } from "astro:content";
import { getReleases } from "./project";
import { site } from "./site";
export async function getNewsFeed() {
  const [posts, releases] = await Promise.all([getCollection("news"), getReleases()]);
  return [
    ...posts.map(post => ({ title: post.data.title, url: `${site.url}/news/${post.id}/`, description: post.data.description, date: post.data.publishedAt, tags: post.data.tags })),
    ...releases.map(release => ({ title: release.name, url: `${site.url}/news/releases/${release.slug}/`, description: `Official release notes for Refract ${release.version}.`, date: new Date(release.publishedAt), tags: [release.prerelease ? "prerelease" : "release"] }))
  ].sort((a, b) => b.date.valueOf() - a.date.valueOf());
}
