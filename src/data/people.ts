export interface Person {
  name: string;
  handle: string;
  label: "Maintainer" | "Contributor";
  role: string;
  avatar: string;
  href: string;
  contributions?: number;
}

interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  type: "User" | "Bot";
  contributions: number;
}

const contributorsEndpoint = "https://api.github.com/repos/RefractMC/Refract_MC/contributors?per_page=100&anon=0";

const fallbackPeople: Person[] = [
  { name: "Ruslan Shevchuk", handle: "ShevRuslan1", label: "Maintainer", role: "Creator & lead maintainer", avatar: "/images/people/shevruslan1.png", href: "https://github.com/ShevRuslan1" },
  { name: "tozetsu", handle: "tozetsu", label: "Contributor", role: "Contributor", avatar: "/images/people/tozetsu.png", href: "https://github.com/tozetsu" },
  { name: "Oleh Shulha", handle: "ShulhaOleh", label: "Contributor", role: "Contributor", avatar: "/images/people/shulhaoleh.png", href: "https://github.com/ShulhaOleh" },
  { name: "Ruslan4234", handle: "Ruslan4234", label: "Contributor", role: "Contributor", avatar: "/images/people/ruslan4234.png", href: "https://github.com/Ruslan4234" }
];

const profileOverrides: Record<string, Pick<Person, "name" | "label" | "role">> = {
  shevruslan1: { name: "Ruslan Shevchuk", label: "Maintainer", role: "Creator & lead maintainer" },
  shulhaoleh: { name: "Oleh Shulha", label: "Contributor", role: "Contributor" }
};

const isBot = (contributor: GitHubContributor) => contributor.type === "Bot" || contributor.login.endsWith("[bot]");

export async function getPeople(): Promise<Person[]> {
  const token = import.meta.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Refract-Website",
    "X-GitHub-Api-Version": "2026-03-10"
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(contributorsEndpoint, { headers, signal: AbortSignal.timeout(8_000) });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const contributors = await response.json() as GitHubContributor[];
    if (!Array.isArray(contributors) || contributors.length === 0) throw new Error("GitHub returned no contributors");

    return contributors
      .filter((contributor) => contributor.login && !isBot(contributor))
      .map((contributor) => {
        const override = profileOverrides[contributor.login.toLowerCase()];
        const label = override?.label ?? "Contributor";
        const role = override?.role ?? `${contributor.contributions} ${contributor.contributions === 1 ? "contribution" : "contributions"}`;

        return {
          name: override?.name ?? contributor.login,
          handle: contributor.login,
          label,
          role,
          avatar: contributor.avatar_url,
          href: contributor.html_url,
          contributions: contributor.contributions
        };
      })
      .sort((a, b) => Number(b.label === "Maintainer") - Number(a.label === "Maintainer") || (b.contributions ?? 0) - (a.contributions ?? 0));
  } catch (error) {
    console.warn(`[contributors] Using fallback data: ${error instanceof Error ? error.message : "unknown error"}`);
    return fallbackPeople;
  }
}
