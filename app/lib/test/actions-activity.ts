import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../actionWrapper", () => ({
  default: (
    action: (user: { id: string }, ...args: unknown[]) => unknown,
    options: { auth?: boolean } = {},
  ) =>
    async (...args: unknown[]) => {
      try {
        const data = options.auth
          ? await action({ id: "test-user-id" }, ...args)
          : await (action as (...a: unknown[]) => unknown)(...args);

        if (data === undefined) {
          return { success: true };
        }

        return { success: true, data };
      } catch (error: unknown) {
        console.error("[action error]", error);
        return { success: false, error: "Something went wrong. Please try again." };
      }
    },
}));

const mocks = vi.hoisted(() => ({
  applicationFindMany: vi.fn(),
  projectFindMany: vi.fn(),
}));

vi.mock("../prisma", () => {
  const prisma = {
    application: {
      findMany: mocks.applicationFindMany,
    },
    project: {
      findMany: mocks.projectFindMany,
    },
  };
  return { default: prisma, prisma };
});

import { getActivityOverview } from "../../actions/activity";

const deadline = new Date("2030-01-01");

function mockActivityRows() {
  mocks.applicationFindMany.mockImplementation(async (args: { where: Record<string, unknown> }) => {
    if (args.where.applicantId) {
      return [{
        id: "application-outgoing",
        projectId: "project-other",
        role: { name: "Designer" },
        project: {
          title: "Other Project",
          collaborationMode: "HYBRID",
          workHoursPerWeek: 4,
          category: { name: "Design" },
          owner: { name: "Other Owner" },
        },
      }];
    }

    return [{
      id: "application-incoming",
      applicant: { name: "Applicant", institutionName: "Campus" },
      project: { id: "project-open", title: "Open Project" },
      role: { name: "Developer" },
    }];
  });

  mocks.projectFindMany.mockImplementation(async (args: { where: Record<string, unknown> }) => {
    if (typeof args.where.status === "string") {
      return [{
        id: "project-done",
        title: "Finished Project",
        ownerId: "test-user-id",
        deadline,
        collaborationMode: "OFFLINE",
        workHoursPerWeek: 3,
        category: { name: "Data" },
        projectMembers: [],
        _count: { projectMembers: 2 },
      }];
    }

    return [
      {
        id: "project-open",
        title: "Open Project",
        ownerId: "test-user-id",
        status: "OPEN_RECRUITMENT",
        deadline,
        collaborationMode: "ONLINE",
        workHoursPerWeek: 5,
        category: { name: "Web" },
        projectRoles: [{ slotsAvailable: 2, role: { name: "Developer" } }],
        projectMembers: [],
        _count: { applications: 1, projectMembers: 3 },
      },
      {
        id: "project-running",
        title: "Running Project",
        ownerId: "other-owner",
        status: "IN_PROGRESS",
        deadline: null,
        collaborationMode: "HYBRID",
        workHoursPerWeek: 6,
        category: { name: "AI" },
        projectRoles: [],
        projectMembers: [{ role: { name: "Analyst" } }],
        _count: { applications: 0, projectMembers: 4 },
      },
    ];
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockActivityRows();
});

describe("getActivityOverview", () => {
  it("maps applications, active projects, and completed projects", async () => {
    const result = await getActivityOverview();

    expect(result).toEqual({
      success: true,
      data: {
        incomingApplications: [{
          id: "application-incoming",
          projectId: "project-open",
          applicantName: "Applicant",
          applicantInstitution: "Campus",
          projectTitle: "Open Project",
          roleName: "Developer",
        }],
        activeProjectPosts: [
          {
            id: "project-open",
            title: "Open Project",
            categoryName: "Web",
            status: "OPEN_RECRUITMENT",
            deadline,
            collaborationMode: "ONLINE",
            workHoursPerWeek: 5,
            roles: [{ name: "Developer", slotsAvailable: 2 }],
            applicantCount: 1,
            memberCount: 4,
            viewerRole: "OWNER",
            memberRoleName: null,
          },
          {
            id: "project-running",
            title: "Running Project",
            categoryName: "AI",
            status: "IN_PROGRESS",
            deadline: null,
            collaborationMode: "HYBRID",
            workHoursPerWeek: 6,
            roles: [],
            applicantCount: 0,
            memberCount: 5,
            viewerRole: "MEMBER",
            memberRoleName: "Analyst",
          },
        ],
        activeApplications: [{
          id: "application-outgoing",
          projectId: "project-other",
          projectTitle: "Other Project",
          categoryName: "Design",
          ownerName: "Other Owner",
          roleName: "Designer",
          collaborationMode: "HYBRID",
          workHoursPerWeek: 4,
        }],
        completedProjects: [{
          id: "project-done",
          title: "Finished Project",
          categoryName: "Data",
          deadline,
          collaborationMode: "OFFLINE",
          workHoursPerWeek: 3,
          memberCount: 3,
          viewerRole: "OWNER",
          memberRoleName: null,
        }],
      },
    });
  });

  it("loads active projects for owners and members, and completed projects for both", async () => {
    await getActivityOverview();

    expect(mocks.projectFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        status: { in: ["OPEN_RECRUITMENT", "IN_PROGRESS"] },
        OR: [
          { ownerId: "test-user-id" },
          { projectMembers: { some: { userId: "test-user-id" } } },
        ],
      },
    }));

    expect(mocks.projectFindMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        status: "COMPLETED",
        OR: [
          { ownerId: "test-user-id" },
          { projectMembers: { some: { userId: "test-user-id" } } },
        ],
      },
    }));
  });
});
