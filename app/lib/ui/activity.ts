import "server-only";

import { prisma } from "../prisma";

export type IncomingApplication = {
  id: string;
  applicantName: string | null;
  applicantInstance: string | null;
  projectTitle: string;
  roleName: string;
};

export type ActiveProjectPost = {
  id: string;
  title: string;
  categoryName: string;
  deadline: Date | null;
  onSite: boolean;
  workHoursPerWeek: number;
  roles: Array<{ name: string; slotsAvailable: number }>;
  applicantCount: number;
  memberCount: number;
};

export type ActiveApplication = {
  id: string;
  projectId: string;
  projectTitle: string;
  categoryName: string;
  ownerName: string | null;
  roleName: string;
  onSite: boolean;
  workHoursPerWeek: number;
};

export type ActivityOverview = {
  incomingApplications: IncomingApplication[];
  activeProjectPosts: ActiveProjectPost[];
  activeApplications: ActiveApplication[];
};

export async function getActivityOverview(userId: string): Promise<ActivityOverview> {
  const [incomingRows, projectRows, applicationRows] = await Promise.all([
    prisma.application.findMany({
      where: {
        project: {
          ownerId: userId,
          status: "OPEN_RECRUITMENT",
        },
      },
      select: {
        id: true,
        applicant: {
          select: { name: true, instance: true },
        },
        project: {
          select: { title: true },
        },
        role: {
          select: { name: true },
        },
      },
    }),
    prisma.project.findMany({
      where: {
        ownerId: userId,
        status: "OPEN_RECRUITMENT",
      },
      select: {
        id: true,
        title: true,
        deadline: true,
        onSite: true,
        workHoursPerWeek: true,
        category: {
          select: { name: true },
        },
        projectRoles: {
          where: { slotsAvailable: { gt: 0 } },
          select: {
            slotsAvailable: true,
            role: {
              select: { name: true },
            },
          },
        },
        _count: {
          select: {
            applications: true,
            projectMembers: true,
          },
        },
      },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    }),
    prisma.application.findMany({
      where: {
        applicantId: userId,
        project: { status: "OPEN_RECRUITMENT" },
      },
      select: {
        id: true,
        projectId: true,
        role: {
          select: { name: true },
        },
        project: {
          select: {
            title: true,
            onSite: true,
            workHoursPerWeek: true,
            category: {
              select: { name: true },
            },
            owner: {
              select: { name: true },
            },
          },
        },
      },
    }),
  ]);

  return {
    incomingApplications: incomingRows.map((application) => ({
      id: application.id,
      applicantName: application.applicant.name,
      applicantInstance: application.applicant.instance,
      projectTitle: application.project.title,
      roleName: application.role.name,
    })),
    activeProjectPosts: projectRows.map((project) => ({
      id: project.id,
      title: project.title,
      categoryName: project.category.name,
      deadline: project.deadline,
      onSite: project.onSite,
      workHoursPerWeek: project.workHoursPerWeek,
      roles: project.projectRoles.map((projectRole) => ({
        name: projectRole.role.name,
        slotsAvailable: projectRole.slotsAvailable,
      })),
      applicantCount: project._count.applications,
      memberCount: project._count.projectMembers,
    })),
    activeApplications: applicationRows.map((application) => ({
      id: application.id,
      projectId: application.projectId,
      projectTitle: application.project.title,
      categoryName: application.project.category.name,
      ownerName: application.project.owner.name,
      roleName: application.role.name,
      onSite: application.project.onSite,
      workHoursPerWeek: application.project.workHoursPerWeek,
    })),
  };
}
