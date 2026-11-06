import { fetchGitHubJson, GITHUB_API_URL, REPOSITORY_URL, isCount, isRecord, isSafeUrl, type DataStatus } from "./github";

export type Architecture = "x64" | "arm64" | "x86" | "universal" | "unknown";
export type AssetFormat = "EXE" | "MSI" | "DMG" | "PKG" | "AppImage" | "DEB" | "RPM" | "other";

export interface ReleaseAsset {
  id: number;
  name: string;
  size: number;
  url: string;
  downloadCount: number;
  architecture: Architecture;
  format: AssetFormat;
}

export interface Release {
  id: number;
  slug: string;
  tag: string;
  version: string;
  name: string;
  body: string;
  publishedAt: string;
  url: string;
  prerelease: boolean;
  assets: ReleaseAsset[];
}

export interface ProjectData {
  status: DataStatus;
  fetchedAt: string;
  repositoryUrl: string;
  stars: number | null;
  forks: number | null;
  downloads: number | null;
  totalDownloads: number | null;
  downloadLabel: "GitHub installer downloads";
  releases: Release[];
  latestRelease: Release | null;
}

/** Only filename-declared architectures are shown. Missing metadata is not x64. */
export function assetArchitecture(name: string): Architecture {
  const normalized = name.toLowerCase();
  const hasArm = /(?:^|[-_. ])(?:arm64|aarch64)(?=[-_. ]|$)/.test(normalized);
  const hasX64 = /(?:^|[-_. ])(?:x86_64|x64|amd64)(?=[-_. ]|$)/.test(normalized);
  const hasX86 = /(?:^|[-_. ])(?:x86|i[3-6]86|ia32)(?=[-. ]|$)/.test(normalized);
  if (Number(hasArm) + Number(hasX64) + Number(hasX86) > 1) return "unknown";
  if (hasArm) return "arm64";
  if (hasX64) return "x64";
  if (hasX86) return "x86";
  if (/(?:^|[-_. ])(?:universal|universal2)(?=[-_. ]|$)/.test(normalized)) return "universal";
  return "unknown";
}

export function assetFormat(name: string): AssetFormat {
  const extension = name.split(".").pop()?.toLowerCase();
  const formats: Record<string, AssetFormat> = { exe: "EXE", msi: "MSI", dmg: "DMG", pkg: "PKG", appimage: "AppImage", deb: "DEB", rpm: "RPM" };
  return formats[extension ?? ""] ?? "other";
}

/** Installer totals exclude updater archives, manifests, signatures and source archives. */
export function isInstallerAsset(asset: ReleaseAsset): boolean {
  return asset.format !== "other";
}

function parseAsset(value: unknown, tag: string): ReleaseAsset | null {
  if (!isRecord(value) || value.state !== "uploaded" || typeof value.name !== "string" || !value.name ||
      !isCount(value.id) || !isCount(value.size) || !isCount(value.download_count)) return null;
  const path = `/RefractMC/Refract_MC/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(value.name)}`;
  if (!isSafeUrl(value.browser_download_url, "github.com", path) || new URL(value.browser_download_url).search) return null;
  return {
    id: value.id, name: value.name, size: value.size, url: value.browser_download_url,
    downloadCount: value.download_count, architecture: assetArchitecture(value.name), format: assetFormat(value.name)
  };
}

export function parseRelease(value: unknown): { release: Release | null; complete: boolean } {
  if (!isRecord(value)) return { release: null, complete: false };
  if (value.draft === true) return { release: null, complete: true };
  if (value.draft !== false || typeof value.prerelease !== "boolean" || !isCount(value.id) ||
      typeof value.tag_name !== "string" || !value.tag_name.trim() ||
      typeof value.published_at !== "string" || !Number.isFinite(Date.parse(value.published_at)) ||
      !Array.isArray(value.assets) || !(typeof value.body === "string" || value.body === null) ||
      !(typeof value.name === "string" || value.name === null) ||
      !isSafeUrl(value.html_url, "github.com", `/RefractMC/Refract_MC/releases/tag/${encodeURIComponent(value.tag_name)}`) ||
      new URL(value.html_url).search) return { release: null, complete: false };
  const assets: ReleaseAsset[] = [];
  let complete = true;
  const ids = new Set<number>();
  for (const rawAsset of value.assets) {
    // Open uploads are not yet public download assets and are intentionally ignored.
    if (isRecord(rawAsset) && rawAsset.state === "open") continue;
    const asset = parseAsset(rawAsset, value.tag_name);
    if (!asset) { complete = false; continue; }
    if (ids.has(asset.id)) continue;
    ids.add(asset.id);
    assets.push(asset);
  }
  return {
    complete,
    release: {
      id: value.id, slug: `${value.tag_name.replace(/[^a-zA-Z0-9._-]/g, "-")}-${value.id}`,
      tag: value.tag_name, version: value.tag_name.replace(/^v(?=\d)/i, ""),
      name: value.name || value.tag_name, body: value.body ?? "", publishedAt: value.published_at,
      url: value.html_url, prerelease: value.prerelease, assets
    }
  };
}

async function loadReleaseHistory(): Promise<{ releases: Release[]; complete: boolean }> {
  const releases: Release[] = [];
  const ids = new Set<number>();
  let complete = true;
  for (let page = 1; page <= 100; page++) {
    try {
      const response = await fetchGitHubJson(`${GITHUB_API_URL}/releases?per_page=100&page=${page}`);
      if (!Array.isArray(response)) throw new Error("Invalid releases response");
      let added = 0;
      for (const raw of response) {
        const parsed = parseRelease(raw);
        complete &&= parsed.complete;
        if (parsed.release && !ids.has(parsed.release.id)) {
          ids.add(parsed.release.id);
          releases.push(parsed.release);
          added++;
        }
      }
      if (response.length < 100) return { releases, complete };
      if (added === 0) return { releases, complete: false };
    } catch {
      return { releases, complete: false };
    }
  }
  return { releases, complete: false };
}

async function loadProjectData(): Promise<ProjectData> {
  const [repository, history, latest] = await Promise.allSettled([
    fetchGitHubJson(GITHUB_API_URL), loadReleaseHistory(), fetchGitHubJson(`${GITHUB_API_URL}/releases/latest`)
  ]);
  const repo = repository.status === "fulfilled" && isRecord(repository.value) ? repository.value : null;
  const validRepo = repo && isSafeUrl(repo.html_url, "github.com", "/RefractMC/Refract_MC") &&
    repo.full_name === "RefractMC/Refract_MC";
  const stars = validRepo && isCount(repo.stargazers_count) ? repo.stargazers_count : null;
  const forks = validRepo && isCount(repo.forks_count) ? repo.forks_count : null;
  const { releases, complete } = history.status === "fulfilled" ? history.value : { releases: [], complete: false };
  releases.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const parsedLatest = latest.status === "fulfilled" ? parseRelease(latest.value) : { release: null, complete: false };
  const latestRelease = parsedLatest.release && !parsedLatest.release.prerelease ? parsedLatest.release : null;
  // Asset IDs are globally unique; deduplication also protects against overlapping pages.
  const counted = new Set<number>();
  let downloads: number | null = complete ? 0 : null;
  let totalDownloads: number | null = complete ? 0 : null;
  if (downloads !== null) {
    for (const release of releases) for (const asset of release.assets) {
      if (counted.has(asset.id)) continue;
      counted.add(asset.id);
      totalDownloads! += asset.downloadCount;
      if (isInstallerAsset(asset)) downloads += asset.downloadCount;
    }
    if (!Number.isSafeInteger(downloads)) downloads = null;
    if (!Number.isSafeInteger(totalDownloads)) totalDownloads = null;
  }
  const fullyAvailable = stars !== null && forks !== null && complete && !!latestRelease && parsedLatest.complete;
  return {
    status: fullyAvailable ? "available" : stars !== null || forks !== null || releases.length > 0 || latestRelease ? "partial" : "unavailable",
    fetchedAt: new Date().toISOString(), repositoryUrl: REPOSITORY_URL, stars, forks, downloads, totalDownloads,
    downloadLabel: "GitHub installer downloads", releases, latestRelease
  };
}

let projectPromise: Promise<ProjectData> | undefined;
export function getProjectData(): Promise<ProjectData> {
  return projectPromise ??= loadProjectData();
}

export async function getReleases(): Promise<Release[]> {
  return (await getProjectData()).releases;
}
