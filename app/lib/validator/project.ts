import z from "zod";
import { ActionError } from "../errors";

// Project Validators
export const CollaborationModeValidator = z.enum(["ONLINE", "OFFLINE", "HYBRID"]);
export type CollaborationMode = z.infer<typeof CollaborationModeValidator>;

export const OnlinePlatformValidator = z.enum([
  "GOOGLE_MEET",
  "ZOOM",
  "MICROSOFT_TEAMS",
  "DISCORD",
]);
export type OnlinePlatform = z.infer<typeof OnlinePlatformValidator>;

export const OfflinePlaceValidator = z.enum([
  "SEKOLAH",
  "KAMPUS",
  "RUANG_PUBLIK",
  "KAFE",
]);
export type OfflinePlace = z.infer<typeof OfflinePlaceValidator>;

export const ProjectLinkValidator = z
  .url("Link must be a valid URL")
  .refine(
    (url) => url.startsWith("http://") || url.startsWith("https://"),
    "Link must start with http:// or https://",
  );

export const CreateProjectValidator = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  deadline: z.date(),
  categoryId: z.string().min(1, "Category ID is required"),
  collaborationMode: CollaborationModeValidator,
  onlinePlatform: OnlinePlatformValidator.optional(),
  onlineLink: ProjectLinkValidator.optional(),
  offlinePlace: OfflinePlaceValidator.optional(),
  offlineLink: ProjectLinkValidator.optional(),
  meetDescription: z.string().min(1, "Meeting description is required"),
  collaborationTool: z.string().optional(),
  workHoursPerWeek: z.number().int().positive("Work hours per week must be a positive integer"),
  projectStatusCriteria: z.array(
    z.string().min(1, "Status ID is required"),
  ).min(1, "At least one project status criteria is required"),
  projectRoles: z.array(z.object({
    roleId: z.string().min(1, "Role ID is required"),
    slotsAvailable: z.number().int().positive("Slots left must be a positive integer"),
  })).min(1, "At least one project role is required"),
});
export type CreateProjectForm = z.infer<typeof CreateProjectValidator>;

type MeetingRequirements = {
  collaborationMode: CollaborationMode;
  onlinePlatform?: OnlinePlatform | null;
  onlineLink?: string | null;
  offlinePlace?: OfflinePlace | null;
  offlineLink?: string | null;
};

/**
 * Enforce the per-mode meeting requirements that a flat schema cannot express:
 * online modes need a platform and link, offline modes need a place and map
 * link. Field-level failures are surfaced through ActionError.fieldErrors.
 */
export function validateMeetingRequirements(data: MeetingRequirements) {
  const fieldErrors: Record<string, string[]> = {};

  if (data.collaborationMode === "ONLINE" || data.collaborationMode === "HYBRID") {
    if (!data.onlinePlatform) fieldErrors.onlinePlatform = ["Online platform is required for online collaboration"];
    if (!data.onlineLink) fieldErrors.onlineLink = ["Online meeting link is required for online collaboration"];
  }

  if (data.collaborationMode === "OFFLINE" || data.collaborationMode === "HYBRID") {
    if (!data.offlinePlace) fieldErrors.offlinePlace = ["Offline place is required for offline collaboration"];
    if (!data.offlineLink) fieldErrors.offlineLink = ["Offline map link is required for offline collaboration"];
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new ActionError("Please check your input", fieldErrors);
  }
}

export const UpdateProjectValidator = CreateProjectValidator
  .omit({
    categoryId: true,
  })
  .partial();
export type UpdateProjectForm = z.infer<typeof UpdateProjectValidator>;

export const QueryProjectsValidator = CreateProjectValidator.pick({
  projectStatusCriteria: true,
  collaborationMode: true,
}).extend({
  projectRoles: z.array(z.string().min(1, "Role ID is required"),).min(1),
  ownerId: z.string().min(1, "Owner ID is required"),
  status: z.enum(["OPEN_RECRUITMENT", "IN_PROGRESS", "COMPLETED"]),
}).partial().extend({
  page: z.number().int().min(1, "Page must be at least 1").default(1),
  pageSize: z
    .number()
    .int()
    .min(1, "Page size must be at least 1")
    .max(50, "Page size must be at most 50")
    .default(10),
});
export type QueryProjectsForm = z.input<typeof QueryProjectsValidator>;

// Other Project Related Validators

export const ApplicationValidator = z.object({
  roleId: z.string().min(1, "Role ID is required"),
  message: z.string().optional(),
});
export type ApplicationForm = z.infer<typeof ApplicationValidator>;

export const PeerReviewValidator = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  revieweeId: z.string().min(1, "Reviewee ID is required"),
  commitmentScore: z.number().int().min(1).max(5, "Commitment score must be between 1 and 5"),
  feedback: z.string().optional(),
});
export type PeerReviewForm = z.infer<typeof PeerReviewValidator>;