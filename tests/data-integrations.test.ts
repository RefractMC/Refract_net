import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const API = "https://api.github.com/repos/RefractMC/Refract_MC";
const REPO = "https://github.com/RefractMC/Refract_MC";
const GUILD = "1507409148331954408";

function asset(id = 1, name = "Refract-Windows-x64.exe", downloadCount = 12) {
  return {
    id, name, size: 2048, state: "uploaded", download_count: downloadCount,
    browser_download_url: `${REPO}/releases/download/v2.0.0/${encodeURIComponent(name)}`
  };
}

function release(id = 1, assets = [asset(id)]) {
  return { id, tag_name: "v2.0.0", name: "Version 2", body: "Verified notes", draft: false, prerelease: false,
    published_at: "2026-08-01T12:00:00Z", html_url: `${REPO}/releases/tag/v2.0.0`, assets };
}

const repository = { html_url: REPO, full_name: "RefractMC/Refract_MC", stargazers_count: 81, forks_count: 7 };
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("GITHUB_TOKEN", "");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("bounded public API fetching", () => {
  it("shares a single in-process request", async () => {
    const fetch = vi.fn(async () => json(repository));
    vi.stubGlobal("fetch", fetch);
    const { fetchGitHubJson } = await import("../src/data/github");
    const results = await Promise.all([fetchGitHubJson(API), fetchGitHubJson(API)]);
    expect(results[0]).toEqual(repository);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0]).toBeDefined();
  });

  it("rejects unsafe and unsupported endpoints before sending credentials", async () => {
    vi.stubEnv("GITHUB_TOKEN", "test-secret");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { fetchGitHubJson } = await import("../src/data/github");
    for (const url of ["http://127.0.0.1/", "https://api.github.com.evil.test/repos/RefractMC/Refract_MC",
      "https://api.github.com/repos/other/repo", `${API}?redirect=evil`, `${API}/releases?page=101`,
      "https://user:password@api.github.com/repos/RefractMC/Refract_MC"]) {
      await expect(fetchGitHubJson(url)).rejects.toThrow();
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it("does not follow redirects", async () => {
    const fetch = vi.fn(async () => json(repository));
    vi.stubGlobal("fetch", fetch);
    const { fetchGitHubJson } = await import("../src/data/github");
    await fetchGitHubJson(API);
    expect(fetch).toHaveBeenCalledWith(API, expect.objectContaining({ redirect: "error" }));
  });

  it("caches rate-limit failures without retrying", async () => {
    vi.stubEnv("GITHUB_TOKEN", "test-secret");
    const fetch = vi.fn(async () => json({ message: "rate limited" }, 429));
    vi.stubGlobal("fetch", fetch);
    const { fetchGitHubJson } = await import("../src/data/github");
    await expect(fetchGitHubJson(API)).rejects.toMatchObject({ status: 429 });
    await expect(fetchGitHubJson(API)).rejects.toMatchObject({ status: 429 });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("aborts a slow request after eight seconds", async () => {
    vi.useFakeTimers();
    const fetch = vi.fn((_url: string, options: RequestInit) => new Promise((_resolve, reject) => {
      options.signal?.addEventListener("abort", () => reject(new Error("Aborted")));
    }));
    vi.stubGlobal("fetch", fetch);
    const { fetchGitHubJson } = await import("../src/data/github");
    const assertion = expect(fetchGitHubJson(API)).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(8_000);
    await assertion;
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("rejects malformed JSON", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("<html>unavailable</html>")));
    const { fetchGitHubJson } = await import("../src/data/github");
    await expect(fetchGitHubJson(API)).rejects.toThrow("invalid JSON");
  });
});

describe("validated release and download data", () => {
  it("identifies explicit architectures and keeps missing or ambiguous ones unknown", async () => {
    const { assetArchitecture } = await import("../src/data/project");
    expect(assetArchitecture("Refract-Linux-x86_64.AppImage")).toBe("x64");
    expect(assetArchitecture("Refract-Linux-amd64.deb")).toBe("x64");
    expect(assetArchitecture("Refract-macOS-arm64.dmg")).toBe("arm64");
    expect(assetArchitecture("Refract_aarch64.AppImage")).toBe("arm64");
    expect(assetArchitecture("Refract-x86.exe")).toBe("x86");
    expect(assetArchitecture("Refract-universal.dmg")).toBe("universal");
    expect(assetArchitecture("Refract-setup.exe")).toBe("unknown");
    expect(assetArchitecture("Refract-arm64-x64.exe")).toBe("unknown");
  });

  it("removes unsafe assets and marks the release incomplete", async () => {
    const { parseRelease } = await import("../src/data/project");
    const payload = release(1, [asset(1), { ...asset(2), browser_download_url: "https://evil.test/setup.exe" }]);
    const parsed = parseRelease(payload);
    expect(parsed.complete).toBe(false);
    expect(parsed.release?.assets).toHaveLength(1);
    expect(parseRelease({ ...payload, html_url: "javascript:alert(1)" }).release).toBeNull();
    expect(parseRelease({ ...payload, published_at: "not a date" }).release).toBeNull();
  });

  it("does not replace missing platforms and never gives ARM AppImages to Steam Deck", async () => {
    const { parseRelease } = await import("../src/data/project");
    const { mapReleaseDownloads } = await import("../src/data/downloads");
    const parsed = parseRelease(release(1, [asset(1, "Refract-arm64.AppImage"), asset(2, "Refract-setup.exe")]));
    const data = mapReleaseDownloads(parsed.release!, "2026-08-01T00:00:00Z");
    expect(data.status).toBe("partial");
    expect(data.platforms.macos).toEqual([]);
    expect(data.platforms.steamDeck).toEqual([]);
    expect(data.platforms.linux[0].architecture).toBe("arm64");
    expect(data.platforms.windows[0].detail).toContain("Architecture unspecified");
    expect(data.platforms.windows[0].recommended).not.toBe(true);
  });

  it("counts only deduplicated installer downloads across paginated releases", async () => {
    const first = Array.from({ length: 100 }, (_, index) => release(index + 1, [asset(index + 1, "Refract-Windows-x64.exe", 1)]));
    const last = release(101, [asset(101, "Refract-x64.dmg", 5), asset(102, "latest.json", 500),
      asset(103, "Refract-x64.app.tar.gz", 50), asset(104, "Refract-x64.exe.sig", 30)]);
    const fetch = vi.fn(async (url: string) => {
      if (url === API) return json(repository);
      if (url.endsWith("/latest")) return json(first[0]);
      if (url.endsWith("page=1")) return json(first);
      if (url.endsWith("page=2")) return json([first[0], last]);
      return json({}, 404);
    });
    vi.stubGlobal("fetch", fetch);
    const { getProjectData } = await import("../src/data/project");
    const data = await getProjectData();
    expect(data.status).toBe("available");
    expect(data.stars).toBe(81);
    expect(data.forks).toBe(7);
    expect(data.downloads).toBe(105);
    expect(data.totalDownloads).toBe(685);
    expect(data.downloadLabel).toBe("GitHub installer downloads");
    expect(data.releases).toHaveLength(101);
    await getProjectData();
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it("hides all-time totals when a later page is rate-limited", async () => {
    const first = Array.from({ length: 100 }, (_, index) => release(index + 1));
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      if (url === API) return json(repository);
      if (url.endsWith("/latest")) return json(first[0]);
      if (url.endsWith("page=1")) return json(first);
      return json({ message: "rate limited" }, 429);
    }));
    const { getProjectData } = await import("../src/data/project");
    const data = await getProjectData();
    expect(data.status).toBe("partial");
    expect(data.downloads).toBeNull();
    expect(data.totalDownloads).toBeNull();
    expect(data.releases).toHaveLength(100);
    expect(data.latestRelease?.version).toBe("2.0.0");
  });

  it("provides official release links and no fabricated values on failure", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({ message: "unavailable" }, 503)));
    const { getProjectData } = await import("../src/data/project");
    const { getDownloadData } = await import("../src/data/downloads");
    const data = await getProjectData();
    expect(data).toMatchObject({ status: "unavailable", stars: null, forks: null, downloads: null, latestRelease: null });
    const downloads = await getDownloadData();
    expect(downloads.version).toBe("");
    expect(downloads.releaseUrl).toBe(`${REPO}/releases`);
    expect(Object.values(downloads.platforms).flat()).toEqual([]);
  });

  it("rejects malformed metric responses and does not invent a latest release", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => url.endsWith("/latest")
      ? json({ ...release(), prerelease: true }) : json({ stars: "100" })));
    const { getProjectData } = await import("../src/data/project");
    expect(await getProjectData()).toMatchObject({ status: "unavailable", stars: null, forks: null, downloads: null, latestRelease: null });
  });
});

describe("Discord and contributor fallbacks", () => {
  it("uses validated public invite counts and caches the request", async () => {
    const fetch = vi.fn(async () => json({ code: "S9K3Z9SNPB", guild: { id: GUILD, name: "Refract MC" },
      approximate_member_count: 32, approximate_presence_count: 7 }));
    vi.stubGlobal("fetch", fetch);
    const { getDiscordData } = await import("../src/data/discord");
    expect(await getDiscordData()).toMatchObject({ status: "available", memberCount: 32, onlineCount: 7, source: "invite" });
    await getDiscordData();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("rejects the wrong guild and uses only the widget's online count", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => url.includes("/invites/")
      ? json({ code: "S9K3Z9SNPB", guild: { id: "other", name: "Unrelated" }, approximate_member_count: 9999 })
      : json({ id: GUILD, name: "Refract MC", presence_count: 5, instant_invite: "https://evil.test" })));
    const { getDiscordData } = await import("../src/data/discord");
    expect(await getDiscordData()).toMatchObject({ status: "partial", memberCount: null, onlineCount: 5,
      source: "widget", inviteUrl: "https://discord.gg/S9K3Z9SNPB" });
  });

  it("keeps the official invite and hides unavailable counts after rate limits", async () => {
    const fetch = vi.fn(async () => json({ message: "rate limited" }, 429));
    vi.stubGlobal("fetch", fetch);
    const { getDiscordData } = await import("../src/data/discord");
    expect(await getDiscordData()).toMatchObject({ status: "unavailable", memberCount: null, onlineCount: null,
      inviteUrl: "https://discord.gg/S9K3Z9SNPB", source: "unavailable" });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("does not turn missing counts into zero", async () => {
    const { parseDiscordInvite } = await import("../src/data/discord");
    expect(parseDiscordInvite({ code: "S9K3Z9SNPB", guild: { id: GUILD, name: "Refract" },
      approximate_member_count: "32", approximate_presence_count: -1 })).toMatchObject({
      status: "partial", memberCount: null, onlineCount: null
    });
  });

  it("shows public contributor handles without inventing names or biographies", async () => {
    const { parseContributor } = await import("../src/data/people");
    const raw = { login: "ShevRuslan1", type: "User", html_url: "https://github.com/ShevRuslan1",
      avatar_url: "https://avatars.githubusercontent.com/u/123?v=4", contributions: 12 };
    expect(parseContributor(raw)).toMatchObject({ name: "ShevRuslan1", label: "Contributor", role: "12 contributions" });
    expect(parseContributor({ ...raw, type: "Bot" })).toBeNull();
    expect(parseContributor({ ...raw, avatar_url: "https://evil.test/avatar.png" })).toBeNull();
    expect(parseContributor({ ...raw, contributions: "12" })).toBeNull();
  });

  it("returns an explicit empty contributor state during outages", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({}, 503)));
    const { getPeopleData } = await import("../src/data/people");
    expect(await getPeopleData()).toMatchObject({ status: "unavailable", people: [] });
  });
});

