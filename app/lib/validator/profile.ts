import z from "zod";
import { MAX_PROFILE_CONTACTS } from "../ui/profile-public-info";

export const ProfileEducationLevelValidator = z.enum([
  "JUNIOR_SECONDARY",
  "SENIOR_SECONDARY",
  "HIGHER_EDUCATION",
]);
export type ProfileEducationLevel = z.infer<typeof ProfileEducationLevelValidator>;

export const ProfileLinkValidator = z
  .url("Link must be a valid URL")
  .refine(
    (url) => url.startsWith("http://") || url.startsWith("https://"),
    "Link must start with http:// or https://",
  );

export const ProfileValidator = z.object({
  name: z.string().min(1, "Name is required"),
  instance: z.string().min(1, "Instance is required"),
  bio: z.string(),
  location: z.string().optional(),
  portfolioLink: z.union([ProfileLinkValidator, z.literal("")]).optional(),
  contacts: z
    .array(ProfileLinkValidator)
    .max(MAX_PROFILE_CONTACTS, `At most ${MAX_PROFILE_CONTACTS} contacts are allowed`)
    .optional(),
  statusId: z.string().min(1, "Status ID is required"),
  userRoles: z.array(z.object({
    roleId: z.string().min(1, "Role ID is required"),
  })).min(1, "At least one user role is required"),
});
export type ProfileForm = z.infer<typeof ProfileValidator>;
