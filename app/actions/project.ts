import { User } from "@supabase/supabase-js";
import { prisma } from "../lib/prisma";
import {
    ApplicationForm,
    ApplicationValidator,
    PeerReviewForm,
    PeerReviewValidator,
    ProjectForm,
    ProjectValidator,
} from "../lib/validator/project";
import authWrapper from "../utils/authWrapper";
import { IdValidator } from "../lib/validator/global";
import z from "zod";

const QueryProjectsValidator = ProjectValidator.pick({
    categoryId: true,
    projectStatusCriteria: true,
    projectRoles: true,
}).partial();

export async function queryProjects(formData: z.infer<typeof QueryProjectsValidator>) {
    const result = QueryProjectsValidator.safeParse(formData);

    if (!result.success) {
        throw new Error(result.error.message);
    }

    const data = result.data;

    const projects = await prisma.project.findMany({
        where: {
            categoryId: data.categoryId,
            projectStatusCriteria: data.projectStatusCriteria ? {
                some: {
                    statusId: {
                        in: data.projectStatusCriteria.map(criteria => criteria.statusId)
                    }
                }
            } : undefined,
            projectRoles: data.projectRoles ? {
                some: {
                    roleId: {
                        in: data.projectRoles.map(role => role.roleId)
                    }
                }
            } : undefined,
        }
    });

    return projects;
}

export async function fetchProject(projectId: string) {
    const idResult = IdValidator.safeParse(projectId);

    if (!idResult.success) {
        throw new Error(idResult.error.message);
    }

    const project = await prisma.project.findUnique({
        where: { id: idResult.data },
        include: {
            owner: {
                select: {
                    name: true,
                    instance: true,
                    bio: true,
                    status: true,
                    userRoles: {
                        include: { role: true },
                    },
                    avgCommitmentScore: true,
                    totalProjectsCompleted: true,
                },
            },
            projectStatusCriteria: {
                include: { status: true },
            },
            projectRoles: {
                include: { role: true },
            },
            projectMembers: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            instance: true,
                            bio: true,
                            status: true,
                            userRoles: {
                                include: { role: true },
                            },
                            avgCommitmentScore: true,
                            totalProjectsCompleted: true,
                        },
                    },
                    role: true,
                },
            },
        },
    });

    if (!project) {
        throw new Error("Project not found");
    }

    return project;
}

export const createProject = authWrapper(async (user: User, formData: ProjectForm) => {
    const result = ProjectValidator.safeParse(formData);

    if (!result.success) {
        throw new Error(result.error.message);
    }

    const data = result.data;

    await prisma.project.create({
        data: {
            ownerId: user.id,
            title: data.title,
            description: data.description,
            deadline: data.deadline,
            categoryId: data.categoryId,
            onSite: data.onSite,
            workHoursPerWeek: data.workHoursPerWeek,
            projectStatusCriteria: {
                create: data.projectStatusCriteria.map(criteria => ({
                    status: {
                        connect: { id: criteria.statusId }
                    }
                })),
            },
            projectRoles: {
                create: data.projectRoles.map(role => ({
                    slotsAvailable: role.slotsAvailable,
                    role: {
                        connect: { id: role.roleId }
                    }
                })),
            },
        }
    });

});

export const sendApplication = authWrapper(async (user: User, projectId: string, formData: ApplicationForm) => {
    const idResult = IdValidator.safeParse(projectId);
    const result = ApplicationValidator.safeParse(formData);

    if (!idResult.success) {
        throw new Error(idResult.error.message);
    }

    if (!result.success) {
        throw new Error(result.error.message);
    }

    const data = result.data;
    const project = await prisma.project.findUnique({
        where: { id: idResult.data },
        include: { projectRoles: true }
    });

    if (!project) {
        throw new Error("Project not found");
    }

    if (project.ownerId === user.id) {
        throw new Error("You cannot apply to your own project");
    }

    let isAvailable = false;

    for (const role of project.projectRoles) {
        if (role.roleId === data.roleId) {
            if (role.slotsAvailable > 0) {
                isAvailable = true;
            }

            break;
        }
    };

    if (!isAvailable) {
        throw new Error("The selected role is not available for this project");
    }

    await prisma.application.create({
        data: {
            applicantId: user.id,
            projectId: idResult.data,
            roleId: data.roleId,
            message: data.message,
            portfolioLink: data.portfolioLink,
        }
    });
});

// FLOW: Fetch application -> Check owner -> Accept -> Add member
export const acceptApplication = authWrapper(async (user: User, applicationId: string) => {
    const result = IdValidator.safeParse(applicationId);

    if (!result.success) {
        throw new Error(result.error.message);
    }
    
    const application = await prisma.application.findUnique({
        where: { id: result.data },
        include: { project: true }
    });

    if (!application) {
        throw new Error("Application not found");
    }

    const project = application.project;

    if (project.ownerId !== user.id) {
        throw new Error("You are not authorized to accept this application");
    }

    await prisma.projectRole.update({
        where: { projectId_roleId: { projectId: project.id, roleId: application.roleId } },
        data: {
            slotsAvailable: {
                decrement: 1
            }
        }
    });

    await prisma.application.update({
        where: { id: result.data },
        data: { status: "ACCEPTED" }
    });

    await prisma.projectMember.create({
        data: {
            userId: application.applicantId,
            projectId: application.projectId,
            roleId: application.roleId,
        }
    });
});

export const rejectApplication = authWrapper(async (user: User, applicationId: string) => {
    const result = IdValidator.safeParse(applicationId);

    if (!result.success) {
        throw new Error(result.error.message);
    }

    const application = await prisma.application.findUnique({
        where: { id: result.data },
        include: { project: true }
    });

    if (!application) {
        throw new Error("Application not found");
    }

    const project = application.project;

    if (project.ownerId !== user.id) {
        throw new Error("You are not authorized to reject this application");
    }

    await prisma.application.update({
        where: { id: result.data },
        data: { status: "REJECTED" }
    });
});

export const updateProject = authWrapper(async (user: User, projectId: string, formData: Partial<ProjectForm>) => {
    const idResult = IdValidator.safeParse(projectId);
    const result = ProjectValidator.partial().safeParse(formData);

    if (!idResult.success) {
        throw new Error(idResult.error.message);
    }

    if (!result.success) {
        throw new Error(result.error.message);
    }

    const data = result.data;
    const record = await prisma.project.findUnique({
        where: { id: idResult.data }
    });

    if (!record) {
        throw new Error("Project not found");
    }

    if (record.ownerId !== user.id) {
        throw new Error("You are not authorized to update this project");
    }

    await prisma.project.update({
        where: { id: idResult.data },
        data: {
            title: data.title,
            description: data.description,
            deadline: data.deadline,
            workHoursPerWeek: data.workHoursPerWeek,
            onSite: data.onSite,
            projectStatusCriteria: {
                deleteMany: {},
                create: data.projectStatusCriteria?.map(criteria => ({
                    status: {
                        connect: { id: criteria.statusId }
                    }
                })),
            },
            projectRoles: {
                deleteMany: {},
                create: data.projectRoles?.map(role => ({
                    slotsAvailable: role.slotsAvailable,
                    role: {
                        connect: { id: role.roleId }
                    }
                })),
            },
        }
    });
});

export const deleteProject = authWrapper(async (user: User, projectId: string) => {
    const idResult = IdValidator.safeParse(projectId);

    if (!idResult.success) {
        throw new Error(idResult.error.message);
    }

    const record = await prisma.project.findUnique({
        where: { id: idResult.data }
    });

    if (!record) {
        throw new Error("Project not found");
    }

    if (record.ownerId !== user.id) {
        throw new Error("You are not authorized to delete this project");
    }

    await prisma.project.delete({
        where: { id: idResult.data }
    });
});

export const createPeerReview = authWrapper(async (user: User, formData: PeerReviewForm) => {
    const result = PeerReviewValidator.safeParse(formData);

    if (!result.success) {
        throw new Error(result.error.message);
    }

    const data = result.data;
    const project = await prisma.project.findUnique({
        where: { id: data.projectId },
        include: { projectMembers: true },
    });

    if (!project) {
        throw new Error("Project not found");
    }

    const participantIds = new Set([
        project.ownerId,
        ...project.projectMembers.map(member => member.userId),
    ]);

    if (!participantIds.has(user.id)) {
        throw new Error("You are not authorized to submit a review for this project");
    }

    if (!participantIds.has(data.revieweeId)) {
        throw new Error("The reviewee is not a participant in this project");
    }

    if (user.id === data.revieweeId) {
        throw new Error("You cannot review yourself");
    }

    await prisma.$transaction(async transaction => {
        const existingReview = await transaction.peerReview.findUnique({
            where: {
                projectId_reviewerId_revieweeId: {
                    projectId: data.projectId,
                    reviewerId: user.id,
                    revieweeId: data.revieweeId,
                },
            },
        });

        if (existingReview) {
            throw new Error("You have already reviewed this participant for this project");
        }

        await transaction.peerReview.create({
            data: {
                projectId: data.projectId,
                reviewerId: user.id,
                revieweeId: data.revieweeId,
                commitmentScore: data.commitmentScore,
                feedback: data.feedback,
            },
        });

        const reviewSummary = await transaction.peerReview.aggregate({
            where: { revieweeId: data.revieweeId },
            _avg: { commitmentScore: true },
        });

        await transaction.user.update({
            where: { id: data.revieweeId },
            data: {
                avgCommitmentScore: reviewSummary._avg.commitmentScore ?? 0,
            },
        });
    });
});