const baseHeaders: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": "Refract-Website",
  "X-GitHub-Api-Version": "2026-03-10"
};

export async function fetchGitHubJson<T>(url: string): Promise<T> {
  const token = import.meta.env.GITHUB_TOKEN;
  const attempts = token
    ? [{ ...baseHeaders, Authorization: `Bearer ${token}` }, baseHeaders]
    : [baseHeaders];
  let lastError: Error | undefined;

  for (const headers of attempts) {
    try {
      const response = await fetch(url, { headers, signal: AbortSignal.timeout(8_000) });
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      return await response.json() as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown GitHub API error");
    }
  }

  throw lastError ?? new Error("GitHub request failed");
}
