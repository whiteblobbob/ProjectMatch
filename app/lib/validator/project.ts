import z from "zod";

export const ProjectValidator = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    deadline: z.date(),
    projectStatusCriteria: z.array(z.object({
        statusId: z.string().min(1, "Status ID is required"),
    })).min(1, "At least one project status criteria is required"),
    projectRoles: z.array(z.object({
        roleId: z.string().min(1, "Role ID is required"),
        slotsAvailable: z.number().int().positive("Slots left must be a positive integer"),
    })).min(1, "At least one project role is required"),
});
export type ProjectForm = z.infer<typeof ProjectValidator>;

export const ApplicationValidator = z.object({
    roleId: z.string().min(1, "Role ID is required"),
    message: z.string().optional(),
    portfolioLink: z.url("Portfolio link must be a valid URL").optional(),
});
export type ApplicationForm = z.infer<typeof ApplicationValidator>;

export const PeerReviewValidator = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    revieweeId: z.string().min(1, "Reviewee ID is required"),
    commitmentScore: z.number().int().min(1).max(5, "Commitment score must be between 1 and 5"),
    feedback: z.string().optional(),
});
export type PeerReviewForm = z.infer<typeof PeerReviewValidator>;