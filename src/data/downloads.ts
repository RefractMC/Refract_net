import { fetchGitHubJson } from "@/data/github";

export type DownloadItem = {
  name: string;
  detail: string;
  size?: string;
  href: string;
  recommended?: boolean;
};

export type PlatformKey = "windows" | "macos" | "linux" | "steamDeck";

export type DownloadData = {
  version: string;
  releasedAt: string;
  releaseUrl: string;
  platforms: Record<PlatformKey, DownloadItem[]>;
};

interface GitHubReleaseAsset {
  name: string;
  state: "uploaded" | "open";
  size: number;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string;
  html_url: string;
  assets: GitHubReleaseAsset[];
}

const latestReleaseEndpoint = "https://api.github.com/repos/RefractMC/Refract_MC/releases/latest";
const fallbackReleaseBase = "https://github.com/RefractMC/Refract_MC/releases/download/v1.3.1";

const fallbackDownloadData: DownloadData = {
  version: "1.3.1",
  releasedAt: "2026-07-16",
  releaseUrl: "https://github.com/RefractMC/Refract_MC/releases/tag/v1.3.1",
  platforms: {
    windows: [
      { name: "Windows installer", detail: "Windows 10/11 · x64 · EXE", size: "3.9 MB", href: `${fallbackReleaseBase}/Refract-Windows-x64.exe`, recommended: true }
    ],
    macos: [
      { name: "Apple silicon", detail: "M1 or newer · DMG", size: "4.9 MB", href: `${fallbackReleaseBase}/Refract-macOS-arm64.dmg`, recommended: true },
      { name: "Intel", detail: "Intel Mac · DMG", size: "5.4 MB", href: `${fallbackReleaseBase}/Refract-macOS-x64.dmg` }
    ],
    linux: [
      { name: "AppImage", detail: "Portable · x86_64", size: "79.3 MB", href: `${fallbackReleaseBase}/Refract-Linux-x86_64.AppImage`, recommended: true },
      { name: "Debian package", detail: "Debian / Ubuntu · x86_64", size: "5.5 MB", href: `${fallbackReleaseBase}/Refract-Linux-amd64.deb` }
    ],
    steamDeck: [
      { name: "Linux AppImage", detail: "SteamOS desktop mode · x86_64", size: "79.3 MB", href: `${fallbackReleaseBase}/Refract-Linux-x86_64.AppImage`, recommended: true }
    ]
  }
};

const formatSize = (bytes: number) => bytes >= 1024 * 1024
  ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const architecture = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("arm64") || normalized.includes("aarch64")) return "arm64";
  if (normalized.includes("x86_64") || normalized.includes("x64") || normalized.includes("amd64")) return "x64";
  return "universal";
};

const extension = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.endsWith(".appimage")) return "AppImage";
  if (normalized.endsWith(".msi")) return "MSI";
  if (normalized.endsWith(".exe")) return "EXE";
  if (normalized.endsWith(".dmg")) return "DMG";
  if (normalized.endsWith(".pkg")) return "PKG";
  if (normalized.endsWith(".deb")) return "DEB";
  if (normalized.endsWith(".rpm")) return "RPM";
  return "Download";
};

const itemFromAsset = (asset: GitHubReleaseAsset, name: string, detail: string): DownloadItem => ({
  name,
  detail,
  size: formatSize(asset.size),
  href: asset.browser_download_url
});

const recommendFirst = (items: DownloadItem[]) => items.map((item, index) => ({ ...item, recommended: index === 0 }));

function mapRelease(release: GitHubRelease): DownloadData {
  const version = release.tag_name.replace(/^v/i, "");
  const assets = release.assets.filter((asset) => asset.state === "uploaded");

  const windowsAssets = assets
    .filter((asset) => /\.(exe|msi)$/i.test(asset.name))
    .sort((a, b) => Number(extension(a.name) === "MSI") - Number(extension(b.name) === "MSI"));
  const macAssets = assets
    .filter((asset) => /\.(dmg|pkg)$/i.test(asset.name))
    .sort((a, b) => Number(architecture(b.name) === "arm64") - Number(architecture(a.name) === "arm64"));
  const linuxAssets = assets
    .filter((asset) => /\.(appimage|deb|rpm)$/i.test(asset.name))
    .sort((a, b) => ["AppImage", "DEB", "RPM"].indexOf(extension(a.name)) - ["AppImage", "DEB", "RPM"].indexOf(extension(b.name)));
  const steamDeckAsset = linuxAssets.find((asset) => extension(asset.name) === "AppImage");

  const windows = recommendFirst(windowsAssets.map((asset) => {
    const kind = extension(asset.name);
    const arch = architecture(asset.name) === "arm64" ? "ARM64" : "x64";
    return itemFromAsset(asset, kind === "MSI" ? "MSI package" : "Windows installer", `Windows 10/11 · ${arch} · ${kind}`);
  }));
  const macos = recommendFirst(macAssets.map((asset) => {
    const arch = architecture(asset.name);
    const name = arch === "arm64" ? "Apple silicon" : arch === "x64" ? "Intel" : "macOS installer";
    const detail = arch === "arm64" ? `M1 or newer · ${extension(asset.name)}` : arch === "x64" ? `Intel Mac · ${extension(asset.name)}` : `Universal · ${extension(asset.name)}`;
    return itemFromAsset(asset, name, detail);
  }));
  const linux = recommendFirst(linuxAssets.map((asset) => {
    const kind = extension(asset.name);
    const name = kind === "AppImage" ? "AppImage" : kind === "DEB" ? "Debian package" : "RPM package";
    const detail = kind === "AppImage" ? "Portable · x86_64" : kind === "DEB" ? "Debian / Ubuntu · x86_64" : "Fedora / RHEL · x86_64";
    return itemFromAsset(asset, name, detail);
  }));
  const steamDeck = steamDeckAsset
    ? [{ ...itemFromAsset(steamDeckAsset, "Linux AppImage", "SteamOS desktop mode · x86_64"), recommended: true }]
    : [];

  if (!version || !release.published_at || !windows.length || !macos.length || !linux.length || !steamDeck.length) {
    throw new Error("Latest release is missing required platform installers");
  }

  return {
    version,
    releasedAt: release.published_at.slice(0, 10),
    releaseUrl: release.html_url,
    platforms: { windows, macos, linux, steamDeck }
  };
}

let downloadDataPromise: Promise<DownloadData> | undefined;

export function getDownloadData(): Promise<DownloadData> {
  downloadDataPromise ??= fetchGitHubJson<GitHubRelease>(latestReleaseEndpoint)
    .then(mapRelease)
    .catch((error) => {
      console.warn(`[releases] Using fallback data: ${error instanceof Error ? error.message : "unknown error"}`);
      return fallbackDownloadData;
    });
  return downloadDataPromise;
}

export const downloadTabs = [
  { label: "Windows", href: "/download/", key: "windows" },
  { label: "macOS", href: "/download/mac/", key: "macos" },
  { label: "Linux", href: "/download/linux/", key: "linux" },
  { label: "Steam Deck", href: "/download/steam-deck/", key: "steamDeck" }
] as const;
