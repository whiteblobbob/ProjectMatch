"use server";
import { User } from "@supabase/supabase-js";
import prisma from "../lib/prisma";
import {
  ApplicationForm,
  ApplicationValidator,
  PeerReviewForm,
  PeerReviewValidator,
  CreateProjectForm,
  CreateProjectValidator,
  UpdateProjectForm,
  UpdateProjectValidator,
  QueryProjectsForm,
  QueryProjectsValidator,
  ReportProjectForm,
  ReportProjectValidator,
  validateMeetingRequirements,
  validateRangeRequirements,
} from "../lib/validator/project";
import { checkProjectEligibility, ownsRole } from "../lib/eligibility";
import actionWrapper from "../lib/actionWrapper";
import { IdValidator, parseOrThrow } from "../lib/validator/global";
import { ActionError } from "../lib/errors";
import { createNotification } from "../lib/notification";
import { getUser } from "../lib/supabase/getUser";

export const queryProjects = actionWrapper(async (formData: QueryProjectsForm) => {
  const data = parseOrThrow(QueryProjectsValidator, formData);
  const page = data.page;
  const pageSize = data.pageSize;

  // Deterministic ordering keeps paginated pages stable between requests
  // (the id tiebreaks rows created in the same second).
  // One extra row is fetched purely to detect whether a next page exists.
  const search = data.search?.trim();
  const collaborationTool = data.collaborationTool?.trim();
  const hasWorkHoursRange = data.minWorkHours !== undefined || data.maxWorkHours !== undefined;
  const hasOwnerFilter = Boolean(data.ownerInstitution || data.ownerCity || data.ownerProvince);

  const rows = await prisma.project.findMany({
    omit: { onlinePlatform: true, onlineLink: true, offlinePlace: true, offlineLink: true, meetDescription: true, meetAt: true, meetEndAt: true },
    where: {
      ownerId: data.ownerId,
      collaborationMode: data.collaborationMode,
      status: data.status,
      projectRoles: data.projectRoles ? {
        some: {
          roleId: {
            in: data.projectRoles
          }
        }
      } : undefined,
      educationLevels: data.educationLevels ? {
        hasSome: data.educationLevels
      } : undefined,
      category: data.categoryId ? { id: data.categoryId } : undefined,
      collaborationTool: collaborationTool ? {
        contains: collaborationTool,
        mode: "insensitive",
      } : undefined,
      workHoursPerWeek: hasWorkHoursRange ? {
        gte: data.minWorkHours,
        lte: data.maxWorkHours,
      } : undefined,
      owner: hasOwnerFilter ? {
        institution: data.ownerInstitution ? { equals: data.ownerInstitution } : undefined,
        city: data.ownerCity ? { equals: data.ownerCity, mode: "insensitive" } : undefined,
        province: data.ownerProvince ? { equals: data.ownerProvince, mode: "insensitive" } : undefined,
      } : undefined,
      OR: search ? [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ] : undefined,
    },
    include: {
      projectRoles: {
        include: { role: true },
      },
      owner: {
        select: {
          name: true,
          profileCloudId: true,
          institution: true,
          institutionName: true,
          province: true,
          city: true,
        }
      },
      category: {
        select: {
          name: true,
        }
      },
      _count: {
        select: {
          projectMembers: true,
        }
      }
    },
    orderBy: [
      { createdAt: "desc" },
      { id: "asc" },
    ],
    skip: (page - 1) * pageSize,
    take: pageSize + 1,
  });

  const hasMore = rows.length > pageSize;
  const projects = (hasMore ? rows.slice(0, pageSize) : rows).map(project => ({
    ...project,
    totalAvailableSlot: project.projectRoles.reduce(
      (total, projectRole) => total + projectRole.slotsAvailable,
      0,
    ),
  }));

  return {
    projects,
    hasMore,
  };
}, { auth: false });

export const fetchProject = actionWrapper(async (projectId: string) => {
  const idResult = parseOrThrow(IdValidator, projectId);

  const project = await prisma.project.findUnique({
    where: { id: idResult },
    omit: { onlinePlatform: true, onlineLink: true, offlinePlace: true, offlineLink: true, meetDescription: true, meetAt: true, meetEndAt: true },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          profileCloudId: true,
          institution: true,
          institutionName: true,
          province: true,
          city: true,
          bio: true,
          educationLevel: true,
          userRoles: {
            include: { role: true },
          },
          avgCommitmentScore: true,
          totalProjectsCompleted: true,
        },
      },
      category: {
        select: {
          name: true,
        },
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
          profileCloudId: true,
              institutionName: true,
              bio: true,
              educationLevel: true,
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
    throw new ActionError("Project not found");
  }

  return project;
}, { auth: false });

export const fetchActivityProject = actionWrapper(async (user: User, projectId: string) => {
  const idResult = parseOrThrow(IdValidator, projectId);

  const project = await prisma.project.findUnique({
    where: { id: idResult },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          profileCloudId: true,
          institution: true,
          institutionName: true,
          province: true,
          city: true,
          bio: true,
          educationLevel: true,
          userRoles: {
            include: { role: true },
          },
          avgCommitmentScore: true,
          totalProjectsCompleted: true,
        },
      },
      category: {
        select: {
          name: true,
        },
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
          profileCloudId: true,
              institutionName: true,
              bio: true,
              educationLevel: true,
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
    throw new ActionError("Project not found");
  }

  if (project.ownerId !== user.id && !project.projectMembers.some(member => member.userId === user.id)) {
    throw new ActionError("You are not authorized to view this project");
  }
  return project;
}, { auth: true });

export const createProject = actionWrapper(async (user: User, formData: CreateProjectForm) => {
  const userData = await getUser(user);

  if (!userData.verified) {
    throw new ActionError("You are not verified");
  }

  const data = parseOrThrow(CreateProjectValidator, formData);
  const projectRange = data.range ?? "ALL";
  validateMeetingRequirements(data);
  validateRangeRequirements({ range: projectRange, allowedInstitutions: data.allowedInstitutions });

  const project = await prisma.project.create({
    data: {
      ownerId: user.id,
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      categoryId: data.categoryId,
      collaborationMode: data.collaborationMode,
      onlinePlatform: data.onlinePlatform,
      onlineLink: data.onlineLink,
      offlinePlace: data.offlinePlace,
      offlineLink: data.offlineLink,
      meetDescription: data.meetDescription,
      meetAt: data.meetAt,
      meetEndAt: data.meetEndAt,
      collaborationTool: data.collaborationTool,
      workHoursPerWeek: data.workHoursPerWeek,
      educationLevels: data.educationLevels,
      range: projectRange,
      allowedInstitutions: projectRange === "INSTITUTIONS" ? (data.allowedInstitutions ?? []) : [],
      extraCriteria: data.extraCriteria,
      sourceLink: data.sourceLink,
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

  return { id: project.id };
}, { auth: true });

export const sendApplication = actionWrapper(async (user: User, projectId: string, formData: ApplicationForm) => {
  const userData = await getUser(user);

  if (!userData.verified) {
    throw new ActionError("You are not verified");
  }

  const validatedProjectId = parseOrThrow(IdValidator, projectId);
  const data = parseOrThrow(ApplicationValidator, formData);
  const applicant = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      educationLevel: true,
      institution: true,
      province: true,
      city: true,
      userRoles: { select: { roleId: true } },
    },
  });

  if (!applicant) {
    throw new ActionError("Profile not found");
  }

  const project = await prisma.project.findUnique({
    where: { id: validatedProjectId },
    include: {
      projectRoles: true,
      projectMembers: true,
      owner: {
        select: { institution: true, province: true, city: true },
      },
    }
  });

  if (!project) {
    throw new ActionError("Project not found");
  }

  if (project.status !== "OPEN_RECRUITMENT") {
    throw new ActionError("This project is not open for applications");
  }

  if (project.deadline && project.deadline < new Date()) {
    throw new ActionError("The deadline for this project has passed");
  }

  if (project.ownerId === user.id) {
    throw new ActionError("You cannot apply to your own project");
  }

  const application = await prisma.application.findUnique({
    where: {
      projectId_applicantId: {
        applicantId: user.id,
        projectId: validatedProjectId,
      }
    }
  });

  if (application) {
    throw new ActionError("You have already applied to this project");
  }

  if (project.projectMembers.some(member => member.userId === user.id)) {
    throw new ActionError("You are already a member of this project");
  }

  const roleIds = (applicant.userRoles ?? []).map((userRole) => userRole.roleId);
  const eligibility = checkProjectEligibility(
    { ...applicant, roleIds },
    project,
  );

  if (!eligibility.education) {
    throw new ActionError("You do not meet the education requirements for this project");
  }

  if (!eligibility.audience) {
    throw new ActionError("This project is limited to a different audience");
  }

  if (!ownsRole({ ...applicant, roleIds }, data.roleId)) {
    throw new ActionError("You do not have the required role for this position");
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
    throw new ActionError("The selected role is not available for this project");
  }

  // All-or-nothing: the application and the owner notification commit together.
  await prisma.$transaction(async (tx) => {
    await tx.application.create({
      data: {
        applicantId: user.id,
        projectId: validatedProjectId,
        roleId: data.roleId,
        message: data.message,
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
  const result = parseOrThrow(IdValidator, applicationId);
  
  const application = await prisma.application.findUnique({
    where: { id: result },
    include: { project: true }
  });

  if (!application) {
    throw new ActionError("Application not found");
  }

  const project = application.project;

  if (project.ownerId !== user.id) {
    throw new ActionError("You are not authorized to accept this application");
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
      throw new ActionError("The role for this application no longer has available slots");
    }

    await tx.projectMember.create({
      data: {
        userId: application.applicantId,
        projectId: application.projectId,
        roleId: application.roleId,
      }
    });

    await tx.application.delete({
      where: { id: result },
    });

    const role = await tx.projectRole.findUnique({
      where: { projectId_roleId: { projectId: project.id, roleId: application.roleId } },
    });

    if (role && role.slotsAvailable <= 0) {
      // The role just filled up: remove all remaining applications for it
      // (the accepted one is already deleted above) and notify their owners.
      const otherApplications = await tx.application.findMany({
        where: {
          projectId: project.id,
          roleId: application.roleId,
        },
      });

      if (otherApplications.length > 0) {
        await tx.application.deleteMany({
          where: {
            projectId: project.id,
            roleId: application.roleId,
          },
        });

        for (const otherApp of otherApplications) {
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
  const result = parseOrThrow(IdValidator, applicationId);

  const application = await prisma.application.findUnique({
    where: { id: result },
    include: { project: true }
  });

  if (!application) {
    throw new ActionError("Application not found");
  }

  const project = application.project;

  if (project.ownerId !== user.id) {
    throw new ActionError("You are not authorized to reject this application");
  }

  // All-or-nothing: the rejection (row deletion — applications have no status
  // anymore) and the applicant notification commit together.
  await prisma.$transaction(async (tx) => {
    await tx.application.delete({
      where: { id: result },
    });

    await createNotification(tx, {
      userId: application.applicantId,
      title: "Application Rejected",
      message: `Your application for project "${project.title}" has been rejected.`,
    });
  });
}, { auth: true });

export const updateProject = actionWrapper(async (user: User, projectId: string, formData: UpdateProjectForm) => {
  const idResult = parseOrThrow(IdValidator, projectId);
  const data = parseOrThrow(UpdateProjectValidator, formData);

  if (data.collaborationMode) {
    validateMeetingRequirements({
      collaborationMode: data.collaborationMode,
      onlinePlatform: data.onlinePlatform,
      onlineLink: data.onlineLink,
      offlinePlace: data.offlinePlace,
      offlineLink: data.offlineLink,
    });
  }

  if (data.range === "INSTITUTIONS") {
    validateRangeRequirements(data);
  }

  const record = await prisma.project.findUnique({
    where: { id: idResult }
  });

  if (!record) {
    throw new ActionError("Project not found");
  }

  if (record.ownerId !== user.id) {
    throw new ActionError("You are not authorized to update this project");
  }

  if (record.status !== "OPEN_RECRUITMENT") {
    throw new ActionError("You cannot update a project that is in progress or completed");
  }

  await prisma.project.update({
    where: { id: idResult },
    data: {
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      workHoursPerWeek: data.workHoursPerWeek,
      meetAt: data.meetAt,
      meetEndAt: data.meetEndAt,
      collaborationMode: data.collaborationMode,
      ...(data.collaborationMode ? {
        onlinePlatform: data.collaborationMode === "OFFLINE" ? null : data.onlinePlatform,
        onlineLink: data.collaborationMode === "OFFLINE" ? null : data.onlineLink,
        offlinePlace: data.collaborationMode === "ONLINE" ? null : data.offlinePlace,
        offlineLink: data.collaborationMode === "ONLINE" ? null : data.offlineLink,
        meetDescription: data.meetDescription,
        collaborationTool: data.collaborationTool,
      } : {}),
      educationLevels: data.educationLevels,
      range: data.range,
      allowedInstitutions: data.range
        ? (data.range === "INSTITUTIONS" ? (data.allowedInstitutions ?? []) : [])
        : data.allowedInstitutions,
      extraCriteria: data.extraCriteria,
      sourceLink: data.sourceLink,
    }
  });
}, { auth: true });

export const deleteProject = actionWrapper(async (user: User, projectId: string) => {
  const idResult = parseOrThrow(IdValidator, projectId);

  const record = await prisma.project.findUnique({
    where: { id: idResult }
  });

  if (!record) {
    throw new ActionError("Project not found");
  }

  if (record.ownerId !== user.id) {
    throw new ActionError("You are not authorized to delete this project");
  }

  if (record.status !== "OPEN_RECRUITMENT") {
    throw new ActionError("You cannot delete a project that is in progress or completed");
  }

  await prisma.project.delete({
    where: { id: idResult }
  });
}, { auth: true });

export const createPeerReview = actionWrapper(async (user: User, formData: PeerReviewForm) => {
  const data = parseOrThrow(PeerReviewValidator, formData);
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
    include: { projectMembers: true },
  });

  if (!project) {
    throw new ActionError("Project not found");
  }

  if (project.status !== "COMPLETED") {
    throw new ActionError("Peer reviews can only be submitted for completed projects");
  }

  const participantIds = new Set([
    project.ownerId,
    ...project.projectMembers.map(member => member.userId),
  ]);

  if (!participantIds.has(user.id)) {
    throw new ActionError("You are not authorized to submit a review for this project");
  }

  if (!participantIds.has(data.revieweeId)) {
    throw new ActionError("The reviewee is not a participant in this project");
  }

  if (user.id === data.revieweeId) {
    throw new ActionError("You cannot review yourself");
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
      throw new ActionError("You have already reviewed this participant for this project");
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
  const result = parseOrThrow(IdValidator, projectId);

  const project = await prisma.project.findUnique({
    where: { id: result },
    select: { ownerId: true, status: true },
  });

  if (!project) {
    throw new ActionError("Project not found");
  }

  if (project.ownerId !== user.id) {
    throw new ActionError("You are not authorized to complete this project");
  }

  if (project.status !== "IN_PROGRESS") {
    throw new ActionError("Project must be in progress to be marked as completed");
  }

  // All-or-nothing: completion and the participant counters commit together,
  // with the member roster read inside the transaction so the incremented
  // participant set matches committed state.
  await prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: { id: result },
      data: { status: "COMPLETED" },
    });

    const members = await tx.projectMember.findMany({
      where: { projectId: result },
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
  const result = parseOrThrow(IdValidator, projectId);

  const project = await prisma.project.findUnique({
    where: { id: result },
    select: { ownerId: true },
  });

  if (!project) {
    throw new ActionError("Project not found");
  }

  if (project.ownerId !== user.id) {
    throw new ActionError("You are not authorized to view applications for this project");
  }

  const applications = await prisma.application.findMany({
    where: { projectId: result },
    orderBy: {
      applicant: {
        avgCommitmentScore: "desc",
      },
    },
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          profileCloudId: true,
          institutionName: true,
          bio: true,
          province: true,
          city: true,
          portfolioLink: true,
          contactInfos: {
            select: { value: true },
          },
          educationLevel: true,
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
export const fetchProjectPeerReviews = actionWrapper(async (user: User, projectId: string) => {
  const result = parseOrThrow(IdValidator, projectId);

  const project = await prisma.project.findUnique({
    where: { id: result },
    select: {
      status: true,
      ownerId: true,
      projectMembers: { select: { userId: true } },
    },
  });

  if (!project) {
    throw new ActionError("Project not found");
  }

  if (project.status !== "COMPLETED") {
    throw new ActionError("Peer reviews are only available for completed projects");
  }

  const isParticipant =
    project.ownerId === user.id ||
    project.projectMembers.some((member) => member.userId === user.id);

  if (!isParticipant) {
    throw new ActionError("You are not authorized to view reviews for this project");
  }

  return prisma.peerReview.findMany({
    where: { projectId: result, reviewerId: user.id },
    select: {
      revieweeId: true,
      commitmentScore: true,
      feedback: true,
    },
  });
}, { auth: true });
export const reportProject = actionWrapper(async (user: User, formData: ReportProjectForm) => {
  const data = parseOrThrow(ReportProjectValidator, formData);

  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
    select: { id: true },
  });

  if (!project) {
    throw new ActionError("Project not found");
  }

  await prisma.projectReport.create({
    data: {
      projectId: data.projectId,
      reporterId: user.id,
      reason: data.reason,
      details: data.details,
    },
  });
}, { auth: true });
