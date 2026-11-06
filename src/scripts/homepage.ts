import { parseRelease, type Release } from "../data/project";
import { mapReleaseDownloads } from "../data/downloads";
import { parseDiscordInvite } from "../data/discord";
import { isRecord, isCount } from "../data/github";

const API = "https://api.github.com/repos/RefractMC/Refract_MC";
const REPO = "https://github.com/RefractMC/Refract_MC";
const format = (value: number) => value.toLocaleString("en-US");
const timestamp = () => new Date().toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
const setText = (selector: string, text: string) => document.querySelectorAll(selector).forEach(element => { element.textContent = text; });

/** Anonymous public requests only. No tokens or server environment enter this path. */
async function request(url: string): Promise<unknown> {
  const response = await fetch(url, { credentials: "omit", redirect: "error", signal: AbortSignal.timeout(8000), headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Public API unavailable (${response.status})`);
  return response.json();
}

/** Never describe a partial page of releases as an all-time total. */
export async function fetchTotalReleaseDownloads(fetchJson: (url: string) => Promise<unknown> = request): Promise<number> {
  const counted = new Set<number>();
  let total = 0;
  for (let page = 1; page <= 100; page++) {
    const response = await fetchJson(`${API}/releases?per_page=100&page=${page}`);
    if (!Array.isArray(response)) throw new Error("Invalid release history");
    let added = 0;
    for (const raw of response) {
      const parsed = parseRelease(raw);
      if (!parsed.complete) throw new Error("Incomplete release history");
      for (const asset of parsed.release?.assets ?? []) {
        if (counted.has(asset.id)) continue;
        counted.add(asset.id);
        total += asset.downloadCount;
        added++;
      }
    }
    if (!Number.isSafeInteger(total)) throw new Error("Invalid release total");
    if (response.length < 100) return total;
    if (!added) throw new Error("Release pagination did not advance");
  }
  throw new Error("Release history exceeded pagination limit");
}

function configurePrimaryDownload() {
  const target = document.querySelector<HTMLAnchorElement>("[data-os-download]");
  if (!target) return;
  const ua = navigator.userAgent;
  // Detect OS family only. macOS/Linux architecture remains an explicit choice.
  const mobile = /Android|iPhone|iPad|Mobile/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  const family = mobile ? null : /Windows/i.test(ua) ? "Windows" : /Macintosh|Mac OS X/i.test(ua) ? "macOS" : /Linux/i.test(ua) ? "Linux" : null;
  target.querySelector("span")!.textContent = family ? `Download for ${family}` : "Download Refract";
  target.href = family === "Windows" ? "/download/windows/" : family === "macOS" ? "/download/mac/" : family === "Linux" ? "/download/linux/" : "/download/";
}

function updateRelease(release: Release) {
  setText("[data-release-version], [data-metric='version']", `v${release.version}`);
  document.querySelectorAll<HTMLAnchorElement>("[data-release-link]").forEach(link => { link.href = release.url; });
  const data = mapReleaseDownloads(release, new Date().toISOString());
  document.querySelectorAll<HTMLElement>("[data-download-slot]").forEach(slot => {
    const asset = Object.values(data.platforms).flat().find(item => item.format === slot.dataset.format && item.architecture === slot.dataset.architecture);
    const link = slot.querySelector<HTMLAnchorElement>("[data-asset-link]")!;
    link.href = asset?.href ?? release.url;
    link.setAttribute("aria-label", asset ? `Download ${asset.name} ${asset.architecture} ${asset.format}` : `Check release availability: ${slot.dataset.downloadSlot}`);
    slot.querySelector("[data-asset-action]")!.textContent = asset ? "Download" : "Not in release";
    slot.querySelector("[data-asset-size]")!.textContent = asset?.size ? ` · ${asset.size}` : "";
  });
  setText("[data-release-status]", `Latest release checked ${timestamp()}. Downloads link directly to GitHub release assets.`);
}

export async function refreshHomepage() {
  configurePrimaryDownload();
  // Each data source fails independently; server-rendered, dated data remains usable.
  const latest = request(`${API}/releases/latest`).then(raw => {
    const { release, complete } = parseRelease(raw);
    if (!release || release.prerelease || !complete) throw new Error("Invalid latest release");
    updateRelease(release);
    return release;
  }).catch(() => {
    const status = document.querySelector("[data-release-status]");
    if (status) status.textContent = `Live release check unavailable. ${status.textContent} Check GitHub for newer releases.`;
    return null;
  });

  const repository = request(API).then(raw => {
    if (!isRecord(raw) || raw.full_name !== "RefractMC/Refract_MC" || raw.html_url !== REPO || !isCount(raw.stargazers_count) || !isCount(raw.forks_count)) throw new Error("Invalid repository");
    setText("[data-metric='stars']", format(raw.stargazers_count));
    setText("[data-metric='forks']", format(raw.forks_count));
  });
  const total = fetchTotalReleaseDownloads().then(count => setText("[data-metric='downloads']", format(count)));
  const metrics = Promise.allSettled([repository, total, latest]).then(results => {
    const complete = results[0].status === "fulfilled" && results[1].status === "fulfilled" && results[2].status === "fulfilled" && results[2].value !== null;
    const note = document.querySelector("[data-github-status]");
    if (note) note.textContent = complete
      ? `GitHub data checked ${timestamp()}. Downloads count all published release assets, including updater files, not unique players.`
      : `Some live counts could not be refreshed. Unrefreshed values retain the dated build snapshot. ${note.textContent}`;
  });

  const community = request("https://discord.com/api/v10/invites/S9K3Z9SNPB?with_counts=true").then(raw => {
    const data = parseDiscordInvite(raw);
    if (!data) throw new Error("Invalid Discord invite");
    setText("[data-discord-name]", data.name);
    setText("[data-discord-counts]", data.onlineCount !== null ? `Approximately ${format(data.onlineCount)} online${data.memberCount !== null ? ` / ${format(data.memberCount)} members` : ""}` : "Member counts currently unavailable");
    setText("[data-discord-status]", `Discord data checked ${timestamp()}`);
  }).catch(() => {
    // Presence is ephemeral, so do not leave yesterday's count looking current.
    setText("[data-discord-counts]", "Live member counts currently unavailable");
    setText("[data-discord-status]", "The community invite is still available.");
  });
  await Promise.allSettled([metrics, community]);
}
