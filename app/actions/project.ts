"use server";
import { User } from "@supabase/supabase-js";
import { prisma } from "../lib/prisma";
import {
  ApplicationForm,
  ApplicationValidator,
  PeerReviewForm,
  PeerReviewValidator,
  ProjectForm,
  CreateProjectValidator,
  UpdateProjectForm,
  UpdateProjectValidator,
  QueryProjectsForm,
  QueryProjectsValidator,
} from "../lib/validator/project";
import actionWrapper from "../utils/actionWrapper";
import { IdValidator } from "../lib/validator/global";
import { createNotification } from "../lib/notification";

export const queryProjects = actionWrapper(async (formData: QueryProjectsForm) => {
  const result = QueryProjectsValidator.safeParse(formData);

  if (!result.success) {
    throw new Error(result.error.message);
  }

  const data = result.data;

  const projects = await prisma.project.findMany({
    where: {
      categoryId: data.categoryId,
      ownerId: data.ownerId,
      onSite: data.onSite,
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
}, { auth: false });

export const fetchProject = actionWrapper(async (projectId: string) => {
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
}, { auth: false });

export const createProject = actionWrapper(async (user: User, formData: ProjectForm) => {
  const result = CreateProjectValidator.safeParse(formData);

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

}, { auth: true });

export const sendApplication = actionWrapper(async (user: User, projectId: string, formData: ApplicationForm) => {
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
    include: {
      projectRoles: true,
      projectMembers: true,
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId === user.id) {
    throw new Error("You cannot apply to your own project");
  }

  if (project.projectMembers.some(member => member.userId === user.id)) {
    throw new Error("You are already a member of this project");
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

  // All-or-nothing: the application and the owner notification commit together.
  await prisma.$transaction(async (tx) => {
    await tx.application.create({
      data: {
        applicantId: user.id,
        projectId: idResult.data,
        roleId: data.roleId,
        message: data.message,
        portfolioLink: data.portfolioLink,
      }
    });

    await createNotification(tx, {
      userId: project.ownerId,
      title: "New Application Received",
      message: `You have received a new application for project "${project.title}".`,
    });
  });
}, { auth: true });

// FLOW: Fetch application -> Check owner -> Accept -> Add member
export const acceptApplication = actionWrapper(async (user: User, applicationId: string) => {
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

  if (application.status !== "PENDING") {
    throw new Error("Application is not pending");
  }

  const project = application.project;

  if (project.ownerId !== user.id) {
    throw new Error("You are not authorized to accept this application");
  }

  // All-or-nothing: slots decrement, membership, application lifecycle and all
  // derived side effects succeed together or not at all.
  await prisma.$transaction(async (tx) => {
    // Conditional decrement: if a concurrent accept just filled the last slot,
    // the update matches 0 rows and the transaction rolls back instead of
    // taking slotsAvailable below zero.
    const updatedRole = await tx.projectRole.updateMany({
      where: {
        projectId: project.id,
        roleId: application.roleId,
        slotsAvailable: { gt: 0 },
      },
      data: {
        slotsAvailable: {
          decrement: 1
        }
      }
    });

    if (updatedRole.count === 0) {
      throw new Error("The role for this application no longer has available slots");
    }

    await tx.projectMember.create({
      data: {
        userId: application.applicantId,
        projectId: application.projectId,
        roleId: application.roleId,
      }
    });

    await tx.application.delete({
      where: { id: result.data },
    });

    const role = await tx.projectRole.findUnique({
      where: { projectId_roleId: { projectId: project.id, roleId: application.roleId } },
    });

    if (role && role.slotsAvailable <= 0) {
      const otherPendingApplications = await tx.application.findMany({
        where: {
          projectId: project.id,
          roleId: application.roleId,
          status: "PENDING",
        },
      });

      if (otherPendingApplications.length > 0) {
        await tx.application.updateMany({
          where: {
            projectId: project.id,
            roleId: application.roleId,
            status: "PENDING",
          },
          data: {
            status: "REJECTED",
          },
        });

        for (const otherApp of otherPendingApplications) {
          await createNotification(tx, {
            userId: otherApp.applicantId,
            title: "Application Rejected",
            message: `Your application for project "${project.title}" has been rejected.`,
          });
        }
      }
    }

    const openRolesCount = await tx.projectRole.count({
      where: {
        projectId: project.id,
        slotsAvailable: { gt: 0 },
      },
    });

    if (openRolesCount === 0 && project.status === "OPEN_RECRUITMENT") {
      await tx.project.update({
        where: { id: project.id },
        data: { status: "IN_PROGRESS" },
      });
    }

    await createNotification(tx, {
      userId: application.applicantId,
      title: "Application Accepted",
      message: `Your application for project "${project.title}" has been accepted.`,
    });
  });
}, { auth: true });

export const rejectApplication = actionWrapper(async (user: User, applicationId: string) => {
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

  if (application.status !== "PENDING") {
    throw new Error("Application is not pending");
  }

  const project = application.project;

  if (project.ownerId !== user.id) {
    throw new Error("You are not authorized to reject this application");
  }

  // All-or-nothing: the rejection and the applicant notification commit together.
  await prisma.$transaction(async (tx) => {
    await tx.application.update({
      where: { id: result.data },
      data: { status: "REJECTED" }
    });

    await createNotification(tx, {
      userId: application.applicantId,
      title: "Application Rejected",
      message: `Your application for project "${project.title}" has been rejected.`,
    });
  });
}, { auth: true });

export const updateProject = actionWrapper(async (user: User, projectId: string, formData: UpdateProjectForm) => {
  const idResult = IdValidator.safeParse(projectId);
  const result = UpdateProjectValidator.safeParse(formData);

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
}, { auth: true });

export const deleteProject = actionWrapper(async (user: User, projectId: string) => {
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
}, { auth: true });

export const createPeerReview = actionWrapper(async (user: User, formData: PeerReviewForm) => {
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

  if (project.status !== "COMPLETED") {
    throw new Error("Peer reviews can only be submitted for completed projects");
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

  // All-or-nothing: the duplicate re-check, review creation and the reviewee's
  // average recompute commit together; the aggregate must see the new review.
  await prisma.$transaction(async (tx) => {
    // Re-check inside the transaction so a concurrent review for the same
    // participant can't slip between the check and the insert.
    const existingReview = await tx.peerReview.findUnique({
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

    await tx.peerReview.create({
      data: {
        projectId: data.projectId,
        reviewerId: user.id,
        revieweeId: data.revieweeId,
        commitmentScore: data.commitmentScore,
        feedback: data.feedback,
      },
    });

    const reviewSummary = await tx.peerReview.aggregate({
      where: { revieweeId: data.revieweeId },
      _avg: { commitmentScore: true },
    });
    
    await tx.user.update({
      where: { id: data.revieweeId },
      data: {
        avgCommitmentScore: reviewSummary._avg.commitmentScore ?? 0,
      },
    });
  });
}, { auth: true });

export const completeProject = actionWrapper(async (user: User, projectId: string) => {
  const result = IdValidator.safeParse(projectId);

  if (!result.success) {
    throw new Error(result.error.message);
  }

  const project = await prisma.project.findUnique({
    where: { id: result.data },
    select: { ownerId: true, status: true },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== user.id) {
    throw new Error("You are not authorized to complete this project");
  }

  if (project.status !== "IN_PROGRESS") {
    throw new Error("Project must be in progress to be marked as completed");
  }

  // All-or-nothing: completion and the participant counters commit together,
  // with the member roster read inside the transaction so the incremented
  // participant set matches committed state.
  await prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: { id: result.data },
      data: { status: "COMPLETED" },
    });

    const members = await tx.projectMember.findMany({
      where: { projectId: result.data },
    });

    const participantIds = Array.from(new Set([
      project.ownerId,
      ...members.map((member) => member.userId),
    ]));

    await tx.user.updateMany({
      where: { id: { in: participantIds } },
      data: {
        totalProjectsCompleted: {
          increment: 1,
        },
      },
    });
  });
}, { auth: true });

export const fetchProjectApplications = actionWrapper(async (user: User, projectId: string) => {
  const result = IdValidator.safeParse(projectId);

  if (!result.success) {
    throw new Error(result.error.message);
  }

  const project = await prisma.project.findUnique({
    where: { id: result.data },
    select: { ownerId: true },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== user.id) {
    throw new Error("You are not authorized to view applications for this project");
  }

  const applications = await prisma.application.findMany({
    where: { projectId: result.data },
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          instance: true,
          bio: true,
          contactInfo: true,
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
  });

  return applications;
}, { auth: true });