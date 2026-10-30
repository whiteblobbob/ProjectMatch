import z from "zod";
import { RoleNamesValidator } from "./role";
import { MAX_PROFILE_CONTACTS } from "../ui/profile-public-info";

export const EducationLevelValidator = z.enum(["SMP", "SMA", "MAHASISWA"]);
export type EducationLevel = z.infer<typeof EducationLevelValidator>;

export const ProfileLinkValidator = z
  .url("Link must be a valid URL")
  .refine(
    (url) => url.startsWith("http://") || url.startsWith("https://"),
    "Link must start with http:// or https://",
  );

export const ProfileValidator = z.object({
  name: z.string().min(1, "Name is required"),
  institution: z.string().min(1, "Institution is required"),
  bio: z.string(),
  province: z.string().optional(),
  city: z.string().optional(),
  portfolioLink: z.union([ProfileLinkValidator, z.literal("")]).optional(),
  contacts: z
    .array(ProfileLinkValidator)
    .max(MAX_PROFILE_CONTACTS, `At most ${MAX_PROFILE_CONTACTS} contacts are allowed`)
    .optional(),
  educationLevel: EducationLevelValidator,
  roles: RoleNamesValidator.refine((roles) => roles.length > 0, "At least one user role is required"),
});
export type ProfileForm = z.infer<typeof ProfileValidator>;
