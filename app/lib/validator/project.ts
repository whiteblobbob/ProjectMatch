import z from "zod";

// Project Validators
export const CreateProjectValidator = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  deadline: z.date(),
  categoryId: z.string().min(1, "Category ID is required"),
  onSite: z.boolean().optional(),
  workHoursPerWeek: z.number().int().positive("Work hours per week must be a positive integer"),
  projectStatusCriteria: z.array(z.object({
    statusId: z.string().min(1, "Status ID is required"),
  })).min(1, "At least one project status criteria is required"),
  projectRoles: z.array(z.object({
    roleId: z.string().min(1, "Role ID is required"),
    slotsAvailable: z.number().int().positive("Slots left must be a positive integer"),
  })).min(1, "At least one project role is required"),
});
export type ProjectForm = z.infer<typeof CreateProjectValidator>;

export const UpdateProjectValidator = CreateProjectValidator
  .omit({
    categoryId: true,

  })
  .partial();
export type UpdateProjectForm = z.infer<typeof UpdateProjectValidator>;

export const QueryProjectsValidator = CreateProjectValidator.pick({
  categoryId: true,
  projectStatusCriteria: true,
  projectRoles: true,
  onSite: true,
}).extend({
  ownerId: z.string().min(1, "Owner ID is required").optional(),
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
  portfolioLink: z
    .url("Portfolio link must be a valid URL")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "Portfolio link must start with http:// or https://"
    )
    .optional(),
});
export type ApplicationForm = z.infer<typeof ApplicationValidator>;

export const PeerReviewValidator = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  revieweeId: z.string().min(1, "Reviewee ID is required"),
  commitmentScore: z.number().int().min(1).max(5, "Commitment score must be between 1 and 5"),
  feedback: z.string().optional(),
});
export type PeerReviewForm = z.infer<typeof PeerReviewValidator>;