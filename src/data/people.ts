import { fetchGitHubJson, GITHUB_API_URL, isCount, isRecord, isSafeUrl, type DataStatus } from "./github";

export interface Person {
  name: string;
  handle: string;
  label: "Maintainer" | "Contributor";
  role: string;
  avatar: string;
  href: string;
  contributions?: number;
}

export interface PeopleData {
  status: DataStatus;
  fetchedAt: string;
  people: Person[];
}

export function parseContributor(value: unknown): Person | null {
  if (!isRecord(value) || value.type !== "User" || typeof value.login !== "string" ||
      !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/.test(value.login) || !isCount(value.contributions) ||
      !isSafeUrl(value.html_url, "github.com", `/${value.login}`) ||
      !isSafeUrl(value.avatar_url, "avatars.githubusercontent.com") ||
      !/^\/u\/\d+$/.test(new URL(value.avatar_url).pathname)) return null;
  return {
    name: value.login, handle: value.login, label: "Contributor", href: value.html_url, avatar: value.avatar_url,
    role: `${value.contributions} ${value.contributions === 1 ? "contribution" : "contributions"}`,
    contributions: value.contributions
  };
}

async function loadPeople(): Promise<PeopleData> {
  const people: Person[] = [];
  const logins = new Set<string>();
  let complete = true;
  for (let page = 1; page <= 100; page++) {
    try {
      const response = await fetchGitHubJson(`${GITHUB_API_URL}/contributors?per_page=100&anon=0&page=${page}`);
      if (!Array.isArray(response)) throw new Error("Invalid contributors response");
      for (const value of response) {
        if (isRecord(value) && value.type === "Bot") continue;
        const person = parseContributor(value);
        if (!person) { complete = false; continue; }
        if (!logins.has(person.handle.toLowerCase())) {
          logins.add(person.handle.toLowerCase());
          people.push(person);
        }
      }
      if (response.length < 100) break;
      if (page === 100) complete = false;
    } catch {
      complete = false;
      break;
    }
  }
  people.sort((a, b) => (b.contributions ?? 0) - (a.contributions ?? 0));
  return { status: complete ? "available" : people.length ? "partial" : "unavailable", fetchedAt: new Date().toISOString(), people };
}

let peoplePromise: Promise<PeopleData> | undefined;
export function getPeopleData(): Promise<PeopleData> {
  return peoplePromise ??= loadPeople();
}

export async function getPeople(): Promise<Person[]> {
  return (await getPeopleData()).people;
}
