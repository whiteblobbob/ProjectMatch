export const collaborationModes = ["ONLINE", "OFFLINE", "HYBRID"] as const;

export type CollaborationMode = (typeof collaborationModes)[number];

const collaborationModeLabels: Record<CollaborationMode, string> = {
  ONLINE: "Daring",
  OFFLINE: "Luring",
  HYBRID: "Hybrid",
};

export function getCollaborationModeLabel(mode: CollaborationMode) {
  return collaborationModeLabels[mode];
}

export const onlinePlatforms = ["GOOGLE_MEET", "ZOOM", "MICROSOFT_TEAMS", "DISCORD"] as const;

export type OnlinePlatform = (typeof onlinePlatforms)[number];

const onlinePlatformLabels: Record<OnlinePlatform, string> = {
  GOOGLE_MEET: "Google Meet",
  ZOOM: "Zoom",
  MICROSOFT_TEAMS: "Microsoft Teams",
  DISCORD: "Discord",
};

export function getOnlinePlatformLabel(platform: OnlinePlatform) {
  return onlinePlatformLabels[platform];
}

export const offlinePlaces = ["SEKOLAH", "KAMPUS", "RUANG_PUBLIK", "KAFE"] as const;

export type OfflinePlace = (typeof offlinePlaces)[number];

const offlinePlaceLabels: Record<OfflinePlace, string> = {
  SEKOLAH: "Sekolah",
  KAMPUS: "Kampus",
  RUANG_PUBLIK: "Ruang publik",
  KAFE: "Kafe",
};

export function getOfflinePlaceLabel(place: OfflinePlace) {
  return offlinePlaceLabels[place];
}
