import { useEffect, useState } from "react";
import { Download as ArrowDownToLine, Computer as Monitor, Laptop, Terminal, ArrowUpRight, InfoCircle as Info, IconoirProvider } from "iconoir-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { DownloadData, DownloadItem, PlatformKey } from "@/data/downloads";

const platforms = [
  { key: "windows", label: "Windows", icon: Monitor, note: "Match the installer architecture to your processor under Settings → System → About." },
  { key: "macos", label: "macOS", icon: Laptop, note: "Choose your processor in Apple menu → About This Mac. Apple silicon and Intel installers are separate." },
  { key: "linux", label: "Linux", icon: Terminal, note: "Choose a package for your distribution and match its architecture to your processor." }
] as const;
const expected: Record<string, { name: string; format: string; architecture: string; detail: string }[]> = {
  windows: [{ name: "Windows installer", format: "EXE", architecture: "x64", detail: "Windows · x64 · EXE" }],
  macos: [{ name: "Apple silicon", format: "DMG", architecture: "arm64", detail: "M-series Macs · arm64 · DMG" }, { name: "Intel Mac", format: "DMG", architecture: "x64", detail: "Intel Macs · x64 · DMG" }],
  linux: [{ name: "AppImage", format: "AppImage", architecture: "x64", detail: "Portable Linux · x64" }, { name: "Debian package", format: "DEB", architecture: "x64", detail: "Debian / Ubuntu · x64" }, { name: "RPM package", format: "RPM", architecture: "x64", detail: "Fedora / RHEL · x64" }]
};

export default function DownloadSelector({ data }: { data: DownloadData }) {
  const [platform, setPlatform] = useState("windows");
  const [detected, setDetected] = useState<string | null>(null);
  useEffect(() => {
    // Detect only the OS family; browser user-agent data does not reliably reveal CPU architecture.
    const ua = navigator.userAgent;
    if (/Android|iPhone|iPad|Mobile/i.test(ua)) return;
    const family = /Windows/i.test(ua) ? "windows" : /Macintosh|Mac OS X/i.test(ua) ? "macos" : /Linux/i.test(ua) ? "linux" : null;
    if (family) { setPlatform(family); setDetected(platforms.find(item => item.key === family)!.label); }
  }, []);
  return <IconoirProvider iconProps={{ strokeWidth: 1.5, width: 20, height: 20, 'aria-hidden': true, focusable: false }}><div>
    <p className="mb-4 min-h-6 text-xs text-muted-foreground" aria-live="polite">{detected ? `Your browser reports ${detected}. Choose the platform you want to install on.` : "Choose your desktop platform. Check the architecture before downloading."}</p>
    <Tabs value={platform} onValueChange={setPlatform}>
      <TabsList aria-label="Operating system">{platforms.map(item => <TabsTrigger key={item.key} value={item.key}><item.icon /><span>{item.label}</span></TabsTrigger>)}</TabsList>
      {platforms.map(item => {
        const assets = data.platforms[item.key as PlatformKey];
        const slots = expected[item.key];
        const extras = assets.filter(asset => !slots.some(slot => slot.format === asset.format && slot.architecture === asset.architecture));
        return <TabsContent key={item.key} value={item.key}>
          <p className="mb-5 flex items-start gap-2 text-sm text-muted-foreground"><Info className="mt-1 size-4 shrink-0" />{item.note}</p>
          <div className="space-y-3">
            {slots.map(slot => <DownloadRow key={slot.name} item={assets.find(asset => asset.format === slot.format && asset.architecture === slot.architecture)} fallback={slot} />)}
            {extras.map(asset => <DownloadRow key={asset.href} item={asset} fallback={asset} />)}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#bd9cf8]">
            <a className="inline-flex min-h-11 items-center gap-1" href={item.key === "macos" ? "/download/mac/" : item.key === "linux" ? "/download/linux/" : "/wiki/getting-started/installing/"}>Installation guide <ArrowUpRight className="size-4" /></a>
            <a className="inline-flex min-h-11 items-center gap-1" href={data.releaseUrl}>All release assets <ArrowUpRight className="size-4" /></a>
          </div>
        </TabsContent>;
      })}
    </Tabs>
  </div></IconoirProvider>;
}

function DownloadRow({ item, fallback }: { item?: DownloadItem; fallback: { name: string; detail: string } }) {
  return <article className="flex flex-col items-start justify-between gap-5 rounded-lg border border-border bg-[#1a191e] p-5 sm:flex-row sm:items-center">
    <div><h3 className="mb-2 text-lg font-medium tracking-tight">{item?.name ?? fallback.name}</h3><p className="mb-0 font-mono text-xs text-muted-foreground">{item?.detail ?? fallback.detail}{item?.size ? ` · ${item.size}` : ""}</p></div>
    {item ? <Button asChild className="w-full shrink-0 sm:w-auto"><a href={item.href} aria-label={`Download ${item.name} ${item.format} ${item.architecture}`}><ArrowDownToLine />Download {item.format}</a></Button> : <Button disabled variant="outline" className="w-full sm:w-auto">Currently unavailable</Button>}
  </article>;
}
