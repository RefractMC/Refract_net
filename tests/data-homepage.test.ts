import { describe, expect, it } from "vitest";
import { fetchTotalReleaseDownloads } from "../src/scripts/homepage";
const repo = "https://github.com/RefractMC/Refract_MC";
const asset = (id: number, name: string, count: number) => ({ id, name, state: "uploaded", size: 100, download_count: count, browser_download_url: `${repo}/releases/download/v1.0.0/${name}` });
const release = (id: number, assets: ReturnType<typeof asset>[]) => ({ id, tag_name: "v1.0.0", name: "Release", body: "", published_at: "2026-01-01T00:00:00Z", draft: false, prerelease: false, html_url: `${repo}/releases/tag/v1.0.0`, assets });

describe("live homepage release totals", () => {
  it("includes updater files and deduplicates overlapping pages", async () => {
    const first = Array.from({ length: 100 }, (_, i) => release(i, [asset(i, "Refract-x64.exe", 1)]));
    const total = await fetchTotalReleaseDownloads(async url => url.endsWith("page=1") ? first : [first[0], release(100, [asset(100, "latest.json", 25), asset(101, "Refract-arm64.app.tar.gz", 10)])]);
    expect(total).toBe(135);
  });
  it("rejects a truncated history instead of displaying a partial total", async () => {
    const first = Array.from({ length: 100 }, (_, i) => release(i, [asset(i, "Refract-x64.exe", 1)]));
    await expect(fetchTotalReleaseDownloads(async url => {
      if (url.endsWith("page=1")) return first;
      throw new Error("Rate limited");
    })).rejects.toThrow("Rate limited");
  });
  it("rejects malformed counts and unsafe download links", async () => {
    await expect(fetchTotalReleaseDownloads(async () => [release(1, [{ ...asset(1, "Refract-x64.exe", 3), browser_download_url: "https://untrusted.example/installer.exe" }])])).rejects.toThrow("Incomplete");
    await expect(fetchTotalReleaseDownloads(async () => [release(1, [asset(1, "Refract-x64.exe", -1)])])).rejects.toThrow("Incomplete");
  });
  it("treats an empty history as zero downloads", async () => {
    expect(await fetchTotalReleaseDownloads(async () => [])).toBe(0);
  });
});
