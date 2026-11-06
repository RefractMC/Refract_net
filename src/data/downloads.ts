import { REPOSITORY_URL, type DataStatus } from "./github";
import { getProjectData, type Architecture, type AssetFormat, type Release, type ReleaseAsset } from "./project";

export type DownloadItem = {
  name: string;
  detail: string;
  size?: string;
  href: string;
  recommended?: boolean;
  architecture: Architecture;
  format: AssetFormat;
};

export type PlatformKey = "windows" | "macos" | "linux" | "steamDeck";
export type DownloadData = {
  status: DataStatus;
  fetchedAt: string;
  version: string;
  releasedAt: string;
  releaseUrl: string;
  platforms: Record<PlatformKey, DownloadItem[]>;
};

const formatSize = (bytes: number) => bytes >= 1024 * 1024
  ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  : `${Math.max(1, Math.round(bytes / 1024))} KB`;

function itemFromAsset(asset: ReleaseAsset, name: string, context: string): DownloadItem {
  const architecture = asset.architecture === "unknown" ? "Architecture unspecified" : asset.architecture;
  return { name, detail: `${context} · ${architecture} · ${asset.format}`, size: formatSize(asset.size), href: asset.url,
    architecture: asset.architecture, format: asset.format };
}

/** Partial releases keep their valid platforms. A missing installer never gets a guessed URL. */
export function mapReleaseDownloads(release: Release, fetchedAt: string): DownloadData {
  const windows = release.assets.filter((asset) => ["EXE", "MSI"].includes(asset.format))
    .map((asset) => itemFromAsset(asset, asset.format === "MSI" ? "MSI package" : "Windows installer", "Windows"));
  const macos = release.assets.filter((asset) => ["DMG", "PKG"].includes(asset.format)).map((asset) => {
    const name = asset.architecture === "arm64" ? "Apple silicon" : asset.architecture === "x64" ? "Intel Mac" : "macOS installer";
    return itemFromAsset(asset, name, "macOS");
  });
  const linux = release.assets.filter((asset) => ["AppImage", "DEB", "RPM"].includes(asset.format)).map((asset) => {
    const name = asset.format === "DEB" ? "Debian package" : asset.format === "RPM" ? "RPM package" : "AppImage";
    const context = asset.format === "DEB" ? "Debian / Ubuntu" : asset.format === "RPM" ? "Fedora / RHEL" : "Portable Linux";
    return itemFromAsset(asset, name, context);
  });
  const steamDeck = release.assets.filter((asset) => asset.format === "AppImage" && asset.architecture === "x64")
    .map((asset) => ({ ...itemFromAsset(asset, "Linux AppImage", "SteamOS desktop mode"), recommended: true }));
  return {
    status: windows.length && macos.length && linux.length && steamDeck.length ? "available" : "partial",
    fetchedAt, version: release.version, releasedAt: release.publishedAt.slice(0, 10), releaseUrl: release.url,
    platforms: { windows, macos, linux, steamDeck }
  };
}

export async function getDownloadData(): Promise<DownloadData> {
  const project = await getProjectData();
  if (project.latestRelease) return mapReleaseDownloads(project.latestRelease, project.fetchedAt);
  return {
    status: "unavailable", fetchedAt: project.fetchedAt, version: "", releasedAt: "",
    releaseUrl: `${REPOSITORY_URL}/releases`, platforms: { windows: [], macos: [], linux: [], steamDeck: [] }
  };
}

export const downloadTabs = [
  { label: "Windows", href: "/download/", key: "windows" },
  { label: "macOS", href: "/download/mac/", key: "macos" },
  { label: "Linux", href: "/download/linux/", key: "linux" },
  { label: "Steam Deck", href: "/download/steam-deck/", key: "steamDeck" }
] as const;
