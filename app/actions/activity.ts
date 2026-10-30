"use server";

import { User } from "@supabase/supabase-js";

import actionWrapper from "../lib/actionWrapper";
import prisma from "../lib/prisma";
import type { CollaborationMode } from "../lib/validator/project";

export type IncomingApplication = {
  id: string;
  projectId: string;
  applicantName: string | null;
  applicantInstitution: string | null;
  projectTitle: string;
  roleName: string;
};

export type ActiveProjectStatus = "OPEN_RECRUITMENT" | "IN_PROGRESS";

export type ActiveProjectPost = {
  id: string;
  title: string;
  categoryName: string;
  status: ActiveProjectStatus;
  deadline: Date | null;
  collaborationMode: CollaborationMode;
  workHoursPerWeek: number;
  roles: Array<{ name: string; slotsAvailable: number }>;
  applicantCount: number;
  memberCount: number;
  viewerRole: "OWNER" | "MEMBER";
  memberRoleName: string | null;
};

export type ActiveApplication = {
  id: string;
  projectId: string;
  projectTitle: string;
  categoryName: string;
  ownerName: string | null;
  roleName: string;
  collaborationMode: CollaborationMode;
  workHoursPerWeek: number;
};

export type CompletedProject = {
  id: string;
  title: string;
  categoryName: string;
  deadline: Date | null;
  collaborationMode: CollaborationMode;
  workHoursPerWeek: number;
  memberCount: number;
  viewerRole: "OWNER" | "MEMBER";
  memberRoleName: string | null;
};

export type ActivityOverview = {
  incomingApplications: IncomingApplication[];
  activeProjectPosts: ActiveProjectPost[];
  activeApplications: ActiveApplication[];
  completedProjects: CompletedProject[];
};

export const getActivityOverview = actionWrapper(
  async (user: User): Promise<ActivityOverview> => {
    const [incomingRows, activeRows, applicationRows, completedRows] = await Promise.all([
      prisma.application.findMany({
        where: {
          project: {
            ownerId: user.id,
            status: "OPEN_RECRUITMENT",
          },
        },
        select: {
          id: true,
          applicant: {
            select: { name: true, institutionName: true },
          },
          project: {
            select: { id: true, title: true },
          },
          role: {
            select: { name: true },
          },
        },
      }),
      prisma.project.findMany({
        where: {
          status: { in: ["OPEN_RECRUITMENT", "IN_PROGRESS"] },
          OR: [
            { ownerId: user.id },
            { projectMembers: { some: { userId: user.id } } },
          ],
        },
        select: {
          id: true,
          title: true,
          ownerId: true,
          status: true,
          deadline: true,
          collaborationMode: true,
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
          projectMembers: {
            where: { userId: user.id },
            select: {
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
          applicantId: user.id,
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
              collaborationMode: true,
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
      prisma.project.findMany({
        where: {
          status: "COMPLETED",
          OR: [
            { ownerId: user.id },
            { projectMembers: { some: { userId: user.id } } },
          ],
        },
        select: {
          id: true,
          title: true,
          ownerId: true,
          deadline: true,
          collaborationMode: true,
          workHoursPerWeek: true,
          category: {
            select: { name: true },
          },
          projectMembers: {
            where: { userId: user.id },
            select: {
              role: {
                select: { name: true },
              },
            },
          },
          _count: {
            select: { projectMembers: true },
          },
        },
        orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      }),
    ]);

    return {
      incomingApplications: incomingRows.map((application) => ({
        id: application.id,
        projectId: application.project.id,
        applicantName: application.applicant.name,
        applicantInstitution: application.applicant.institutionName,
        projectTitle: application.project.title,
        roleName: application.role.name,
      })),
      activeProjectPosts: activeRows.map((project) => ({
        id: project.id,
        title: project.title,
        categoryName: project.category.name,
        status: project.status === "IN_PROGRESS" ? "IN_PROGRESS" : "OPEN_RECRUITMENT",
        deadline: project.deadline,
        collaborationMode: project.collaborationMode,
        workHoursPerWeek: project.workHoursPerWeek,
        roles: project.projectRoles.map((projectRole) => ({
          name: projectRole.role.name,
          slotsAvailable: projectRole.slotsAvailable,
        })),
        applicantCount: project._count.applications,
        memberCount: project._count.projectMembers + 1,
        viewerRole: project.ownerId === user.id ? "OWNER" : "MEMBER",
        memberRoleName:
          project.ownerId === user.id ? null : (project.projectMembers[0]?.role.name ?? null),
      })),
      activeApplications: applicationRows.map((application) => ({
        id: application.id,
        projectId: application.projectId,
        projectTitle: application.project.title,
        categoryName: application.project.category.name,
        ownerName: application.project.owner.name,
        roleName: application.role.name,
        collaborationMode: application.project.collaborationMode,
        workHoursPerWeek: application.project.workHoursPerWeek,
      })),
      completedProjects: completedRows.map((project) => ({
        id: project.id,
        title: project.title,
        categoryName: project.category.name,
        deadline: project.deadline,
        collaborationMode: project.collaborationMode,
        workHoursPerWeek: project.workHoursPerWeek,
        memberCount: project._count.projectMembers + 1,
        viewerRole: project.ownerId === user.id ? "OWNER" : "MEMBER",
        memberRoleName:
          project.ownerId === user.id ? null : (project.projectMembers[0]?.role.name ?? null),
      })),
    };
  },
  { auth: true },
);
