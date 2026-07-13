const releaseBase = "https://github.com/RefractMC/Refract_MC/releases/download/v1.3.0";

export type DownloadItem = {
  name: string;
  detail: string;
  size?: string;
  href: string;
  recommended?: boolean;
};

export const downloadData = {
  version: "1.3.0",
  releasedAt: "2026-07-11",
  platforms: {
    windows: [
      { name: "Windows installer", detail: "Windows 10/11 · x64 · EXE", size: "3.9 MB", href: `${releaseBase}/Refract-Windows-x64.exe`, recommended: true },
      { name: "MSI package", detail: "Windows 10/11 · x64 · MSI", size: "5.4 MB", href: `${releaseBase}/Refract_1.3.0_x64_en-US.msi` }
    ],
    macos: [
      { name: "Apple silicon", detail: "M1 or newer · DMG", size: "4.9 MB", href: `${releaseBase}/Refract-macOS-arm64.dmg`, recommended: true },
      { name: "Intel", detail: "Intel Mac · DMG", size: "5.4 MB", href: `${releaseBase}/Refract-macOS-x64.dmg` }
    ],
    linux: [
      { name: "AppImage", detail: "Portable · x86_64", size: "79.2 MB", href: `${releaseBase}/Refract-Linux-x86_64.AppImage`, recommended: true },
      { name: "Debian package", detail: "Debian / Ubuntu · x86_64", size: "5.4 MB", href: `${releaseBase}/Refract-Linux-amd64.deb` },
      { name: "RPM package", detail: "Fedora / RHEL · x86_64", size: "5.4 MB", href: `${releaseBase}/Refract-1.3.0-1.x86_64.rpm` }
    ],
    steamDeck: [
      { name: "Linux AppImage", detail: "SteamOS desktop mode · x86_64", size: "79.2 MB", href: `${releaseBase}/Refract-Linux-x86_64.AppImage`, recommended: true }
    ]
  }
} satisfies { version: string; releasedAt: string; platforms: Record<string, DownloadItem[]> };

export const downloadTabs = [
  { label: "Windows", href: "/download/", key: "windows" },
  { label: "macOS", href: "/download/mac/", key: "macos" },
  { label: "Linux", href: "/download/linux/", key: "linux" },
  { label: "Steam Deck", href: "/download/steam-deck/", key: "steamDeck" }
] as const;
