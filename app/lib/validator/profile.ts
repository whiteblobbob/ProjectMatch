import z from "zod";

export const ProfileValidator = z.object({
  name: z.string().min(1, "Name is required"),
  instance: z.string().min(1, "Instance is required"),
  bio: z.string(),
  contactInfo: z.string().optional(),
  statusId: z.string().min(1, "Status ID is required"),
  userRoles: z.array(z.object({
    roleId: z.string().min(1, "Role ID is required"),
  })).min(1, "At least one user role is required"),
});
export type ProfileForm = z.infer<typeof ProfileValidator>;