"use server";

import { User } from "@supabase/supabase-js";

import actionWrapper from "../lib/actionWrapper";
import prisma from "../lib/prisma";
import type { CollaborationMode } from "../lib/validator/project";

export type IncomingApplication = {
  id: string;
  projectId: string;
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
  collaborationMode: CollaborationMode;
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
  collaborationMode: CollaborationMode;
  workHoursPerWeek: number;
};

export type ActivityOverview = {
  incomingApplications: IncomingApplication[];
  activeProjectPosts: ActiveProjectPost[];
  activeApplications: ActiveApplication[];
};

export const getActivityOverview = actionWrapper(
  async (user: User): Promise<ActivityOverview> => {
    const [incomingRows, projectRows, applicationRows] = await Promise.all([
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
            select: { name: true, instance: true },
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
          ownerId: user.id,
          status: "OPEN_RECRUITMENT",
        },
        select: {
          id: true,
          title: true,
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
    ]);

    return {
      incomingApplications: incomingRows.map((application) => ({
        id: application.id,
        projectId: application.project.id,
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
        collaborationMode: project.collaborationMode,
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
        collaborationMode: application.project.collaborationMode,
        workHoursPerWeek: application.project.workHoursPerWeek,
      })),
    };
  },
  { auth: true },
);
