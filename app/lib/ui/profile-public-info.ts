export const MAX_PROFILE_CONTACTS = 4;

export type ProfilePublicInfo = {
  location: string;
  portfolioUrl: string;
  contacts: string[];
};

type StoredProfilePublicInfo = ProfilePublicInfo & {
  version: 1;
};

const emptyPublicInfo: ProfilePublicInfo = {
  location: "",
  portfolioUrl: "",
  contacts: [],
};

export function decodeProfilePublicInfo(value?: string | null): ProfilePublicInfo {
  const rawValue = value?.trim();
  if (!rawValue) return { ...emptyPublicInfo };

  try {
    const parsed = JSON.parse(rawValue) as Partial<StoredProfilePublicInfo>;
    if (parsed.version === 1) {
      return {
        location: typeof parsed.location === "string" ? parsed.location : "",
        portfolioUrl: typeof parsed.portfolioUrl === "string" ? parsed.portfolioUrl : "",
        contacts: Array.isArray(parsed.contacts)
          ? parsed.contacts.filter((contact): contact is string => typeof contact === "string").slice(0, MAX_PROFILE_CONTACTS)
          : [],
      };
    }
  } catch {
    // Profiles created before structured public info used a single contact string.
  }

  return {
    ...emptyPublicInfo,
    contacts: [rawValue],
  };
}

export function encodeProfilePublicInfo(info: ProfilePublicInfo) {
  const normalized: StoredProfilePublicInfo = {
    version: 1,
    location: info.location.trim(),
    portfolioUrl: normalizePublicUrl(info.portfolioUrl),
    contacts: info.contacts
      .map(normalizePublicUrl)
      .filter(Boolean)
      .slice(0, MAX_PROFILE_CONTACTS),
  };

  if (!normalized.location && !normalized.portfolioUrl && normalized.contacts.length === 0) {
    return "";
  }

  return JSON.stringify(normalized);
}

export function normalizePublicUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidPublicUrl(value: string) {
  if (!value.trim()) return true;

  try {
    const parsed = new URL(normalizePublicUrl(value));
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export type ContactPlatform = {
  id: string;
  label: string;
  mark: string;
};

export function detectContactPlatform(value: string): ContactPlatform {
  const normalized = normalizePublicUrl(value);
  let hostname = "";

  try {
    hostname = new URL(normalized).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return { id: "link", label: "Tautan", mark: "↗" };
  }

  if (hostname === "instagram.com" || hostname.endsWith(".instagram.com")) return { id: "instagram", label: "Instagram", mark: "IG" };
  if (hostname === "linkedin.com" || hostname.endsWith(".linkedin.com")) return { id: "linkedin", label: "LinkedIn", mark: "in" };
  if (hostname === "github.com" || hostname.endsWith(".github.com")) return { id: "github", label: "GitHub", mark: "GH" };
  if (hostname === "behance.net" || hostname.endsWith(".behance.net")) return { id: "behance", label: "Behance", mark: "Be" };
  if (hostname === "dribbble.com" || hostname.endsWith(".dribbble.com")) return { id: "dribbble", label: "Dribbble", mark: "Dr" };
  if (hostname === "tiktok.com" || hostname.endsWith(".tiktok.com")) return { id: "tiktok", label: "TikTok", mark: "TT" };
  if (hostname === "x.com" || hostname === "twitter.com" || hostname.endsWith(".twitter.com")) return { id: "x", label: "X", mark: "X" };
  if (hostname === "youtube.com" || hostname === "youtu.be" || hostname.endsWith(".youtube.com")) return { id: "youtube", label: "YouTube", mark: "YT" };
  if (hostname === "discord.com" || hostname === "discord.gg" || hostname.endsWith(".discord.com")) return { id: "discord", label: "Discord", mark: "DC" };
  if (hostname === "facebook.com" || hostname.endsWith(".facebook.com")) return { id: "facebook", label: "Facebook", mark: "f" };
  if (hostname === "wa.me" || hostname === "whatsapp.com" || hostname.endsWith(".whatsapp.com")) return { id: "whatsapp", label: "WhatsApp", mark: "WA" };
  if (hostname === "t.me" || hostname === "telegram.me" || hostname.endsWith(".telegram.me")) return { id: "telegram", label: "Telegram", mark: "TG" };

  return { id: "link", label: hostname || "Tautan", mark: "↗" };
}
