export const collaborationModes = ["REMOTE", "ONSITE", "HYBRID"] as const;

export type CollaborationMode = (typeof collaborationModes)[number];

const collaborationModeLabels: Record<CollaborationMode, string> = {
  REMOTE: "Daring",
  ONSITE: "Luring",
  HYBRID: "Hybrid",
};

export function getCollaborationModeLabel(mode: CollaborationMode) {
  return collaborationModeLabels[mode];
}
