import { fetchPublicJson, isCount, isRecord, type DataStatus } from "./github";

export const DISCORD_INVITE_URL = "https://discord.gg/S9K3Z9SNPB";
export const DISCORD_GUILD_ID = "1507409148331954408";
export interface DiscordData {
  status: DataStatus;
  fetchedAt: string;
  inviteUrl: string;
  name: string;
  memberCount: number | null;
  onlineCount: number | null;
  source: "invite" | "widget" | "unavailable";
}

export function parseDiscordInvite(value: unknown): Omit<DiscordData, "fetchedAt"> | null {
  if (!isRecord(value) || value.code !== "S9K3Z9SNPB" || !isRecord(value.guild) ||
      value.guild.id !== DISCORD_GUILD_ID || typeof value.guild.name !== "string" || !value.guild.name.trim()) return null;
  const memberCount = isCount(value.approximate_member_count) ? value.approximate_member_count : null;
  const onlineCount = isCount(value.approximate_presence_count) ? value.approximate_presence_count : null;
  return {
    status: memberCount !== null && onlineCount !== null ? "available" : "partial", inviteUrl: DISCORD_INVITE_URL,
    name: value.guild.name, memberCount, onlineCount, source: "invite"
  };
}

async function loadDiscordData(): Promise<DiscordData> {
  try {
    const invite = parseDiscordInvite(await fetchPublicJson(
      "https://discord.com/api/v10/invites/S9K3Z9SNPB?with_counts=true", "discord"
    ));
    if (invite) return { ...invite, fetchedAt: new Date().toISOString() };
  } catch {
    // The optional public widget may still be available when the invite API fails.
  }
  try {
    const widget = await fetchPublicJson(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`, "discord");
    if (isRecord(widget) && widget.id === DISCORD_GUILD_ID && typeof widget.name === "string" && widget.name.trim()) {
      return {
        status: "partial", fetchedAt: new Date().toISOString(), inviteUrl: DISCORD_INVITE_URL,
        name: widget.name, memberCount: null, onlineCount: isCount(widget.presence_count) ? widget.presence_count : null,
        source: "widget"
      };
    }
  } catch {
    // Widgets can be disabled by the server owner. Keep the known official invite.
  }
  return {
    status: "unavailable", fetchedAt: new Date().toISOString(), inviteUrl: DISCORD_INVITE_URL,
    name: "Refract community", memberCount: null, onlineCount: null, source: "unavailable"
  };
}

let discordPromise: Promise<DiscordData> | undefined;
export function getDiscordData(): Promise<DiscordData> {
  return discordPromise ??= loadDiscordData();
}

