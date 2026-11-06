/** Build-time only. Tokens and upstream requests never run in the browser. */
export const REPOSITORY_URL = "https://github.com/RefractMC/Refract_MC";
export const GITHUB_API_URL = "https://api.github.com/repos/RefractMC/Refract_MC";
export type DataStatus = "available" | "partial" | "unavailable";

export class PublicApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "PublicApiError";
  }
}

const requests = new Map<string, Promise<unknown>>();
const githubPaths = new Set([
  "/repos/RefractMC/Refract_MC", "/repos/RefractMC/Refract_MC/releases",
  "/repos/RefractMC/Refract_MC/releases/latest", "/repos/RefractMC/Refract_MC/contributors"
]);
const discordEndpoints = new Set([
  "https://discord.com/api/v10/invites/S9K3Z9SNPB?with_counts=true",
  "https://discord.com/api/guilds/1507409148331954408/widget.json"
]);

function assertAllowedEndpoint(input: string, service: "github" | "discord"): void {
  const url = new URL(input);
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.hash) {
    throw new PublicApiError("Unsafe public API URL");
  }
  if (service === "discord") {
    if (!discordEndpoints.has(input)) throw new PublicApiError("Unsupported Discord endpoint");
    return;
  }
  if (url.hostname !== "api.github.com" || !githubPaths.has(url.pathname)) {
    throw new PublicApiError("Unsupported GitHub endpoint");
  }
  const queryAllowed = url.pathname.endsWith("/releases") || url.pathname.endsWith("/contributors");
  for (const [key, value] of url.searchParams) {
    if (!queryAllowed || !["per_page", "page", "anon"].includes(key) || !/^\d+$/.test(value)) {
      throw new PublicApiError("Unsupported GitHub query");
    }
    if ((key === "per_page" && (Number(value) < 1 || Number(value) > 100)) ||
        (key === "page" && (Number(value) < 1 || Number(value) > 100)) ||
        (key === "anon" && (value !== "0" || !url.pathname.endsWith("/contributors")))) {
      throw new PublicApiError("Unsupported GitHub query");
    }
  }
}

async function requestJson(url: string, service: "github" | "discord"): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  const headers: Record<string, string> = service === "github"
    ? { Accept: "application/vnd.github+json", "User-Agent": "Refract-Website", "X-GitHub-Api-Version": "2026-03-10" }
    : { Accept: "application/json" };
  const token = service === "github" ? import.meta.env.GITHUB_TOKEN : undefined;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    let response = await fetch(url, { headers, signal: controller.signal, redirect: "error" });
    // An expired optional token may fall back to public access. Rate limits never retry.
    if (response.status === 401 && token) {
      delete headers.Authorization;
      response = await fetch(url, { headers, signal: controller.signal, redirect: "error" });
    }
    if (!response.ok) throw new PublicApiError(`${service} returned HTTP ${response.status}`, response.status);
    const payload: unknown = await response.json();
    return payload;
  } catch (error) {
    if (controller.signal.aborted) throw new PublicApiError(`${service} request timed out`);
    if (error instanceof PublicApiError) throw error;
    throw new PublicApiError(`${service} request failed or returned invalid JSON`);
  } finally {
    clearTimeout(timeout);
  }
}

/** Cache successes and failures for this build to avoid repeating rate-limited calls. */
export function fetchPublicJson(url: string, service: "github" | "discord"): Promise<unknown> {
  try {
    if (import.meta.env.SSR === false) throw new PublicApiError("Public API data is build-time only");
    assertAllowedEndpoint(url, service);
  } catch (error) {
    return Promise.reject(error);
  }
  const key = `${service}:${url}`;
  let result = requests.get(key);
  if (!result) {
    result = requestJson(url, service);
    requests.set(key, result);
  }
  return result;
}

export function fetchGitHubJson(url: string): Promise<unknown> {
  return fetchPublicJson(url, "github");
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

export function isSafeUrl(value: unknown, hostname: string, pathname?: string): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === hostname && !url.username && !url.password &&
      !url.port && !url.hash && (!pathname || url.pathname === pathname);
  } catch {
    return false;
  }
}
