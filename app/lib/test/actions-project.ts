import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActionError } from "../errors";
import {
  ApplicationForm,
  PeerReviewForm,
  CreateProjectForm,
  QueryProjectsForm,
} from "../validator/project";

vi.mock("../../lib/actionWrapper", () => ({
  default: (
    action: (user: { id: string }, ...args: unknown[]) => unknown,
    options: { auth?: boolean } = {},
  ) =>
    async (...args: unknown[]) => {
      try {
        let data;
        if (options.auth) {
          data = await action({ id: "test-user-id" }, ...args);
        } else {
          data = await (action as (...a: unknown[]) => unknown)(...args);
        }
        if (data === undefined) {
          return { success: true };
        }
        return { success: true, data };
      } catch (error: unknown) {
        if (error instanceof ActionError) {
          return error.fieldErrors
            ? { success: false, error: error.message, fieldErrors: error.fieldErrors }
            : { success: false, error: error.message };
        }
        console.error("[action error]", error);
        return {
          success: false,
          error: "Something went wrong. Please try again.",
        };
      }
    },
}));

const mocks = vi.hoisted(() => ({
  projectFindUnique: vi.fn(),
  projectFindMany: vi.fn(),
  projectCreate: vi.fn(),
  projectUpdate: vi.fn(),
  projectDelete: vi.fn(),
  applicationFindUnique: vi.fn(),
  applicationFindMany: vi.fn(),
  applicationCreate: vi.fn(),
  applicationDelete: vi.fn(),
  applicationDeleteMany: vi.fn(),
  projectRoleCount: vi.fn(),
  projectRoleUpdateMany: vi.fn(),
  projectRoleFindUnique: vi.fn(),
  projectMemberCreate: vi.fn(),
  projectMemberFindMany: vi.fn(),
  transaction: vi.fn(),
  peerReviewFindUnique: vi.fn(),
  peerReviewCreate: vi.fn(),
  peerReviewAggregate: vi.fn(),
  userUpdate: vi.fn(),
  userUpdateMany: vi.fn(),
  createNotification: vi.fn(),
}));

vi.mock("../notification", () => ({
  createNotification: mocks.createNotification,
}));

vi.mock("../prisma", () => ({
  prisma: {
    project: {
      findUnique: mocks.projectFindUnique,
      findMany: mocks.projectFindMany,
      create: mocks.projectCreate,
      update: mocks.projectUpdate,
      delete: mocks.projectDelete,
    },
    application: {
      findUnique: mocks.applicationFindUnique,
      findMany: mocks.applicationFindMany,
      create: mocks.applicationCreate,
      delete: mocks.applicationDelete,
      deleteMany: mocks.applicationDeleteMany,
    },
    projectRole: {
      count: mocks.projectRoleCount,
    },
    projectMember: {
      create: mocks.projectMemberCreate,
    },
    peerReview: {
      findUnique: mocks.peerReviewFindUnique,
      create: mocks.peerReviewCreate,
      aggregate: mocks.peerReviewAggregate,
    },
    user: {
      update: mocks.userUpdate,
      updateMany: mocks.userUpdateMany,
    },
    $transaction: mocks.transaction,
  },
}));

import {
  acceptApplication,
  completeProject,
  createPeerReview,
  createProject,
  deleteProject,
  fetchProject,
  fetchProjectApplications,
  queryProjects,
  rejectApplication,
  sendApplication,
  updateProject,
} from "../../actions/project";

const project = (): CreateProjectForm => ({
  title: "Test Project",
  description: "A test project",
  deadline: new Date("2030-01-01"),
  categoryId: "category-id",
  onSite: true,
  workHoursPerWeek: 10,
  projectStatusCriteria: ["status-id"],
  projectRoles: [{ roleId: "role-id", slotsAvailable: 2 }],
});

const queryProject = (): QueryProjectsForm => ({
  status: "OPEN_RECRUITMENT",
  projectRoles: ["role-id"],
});

const application = (): ApplicationForm => ({
  roleId: "role-id",
  message: "I can help",
  portfolioLink: "https://example.com/portfolio",
});

const peerReview = (): PeerReviewForm => ({
  projectId: "project-id",
  revieweeId: "reviewee-id",
  commitmentScore: 5,
  feedback: "Great teammate",
});

beforeEach(() => {
  vi.clearAllMocks();
  mocks.projectCreate.mockResolvedValue({ id: "project-id" });
  mocks.projectUpdate.mockResolvedValue({});
  mocks.projectDelete.mockResolvedValue({});
  mocks.applicationFindUnique.mockResolvedValue(null);
  mocks.applicationCreate.mockResolvedValue({});
  mocks.applicationDelete.mockResolvedValue({});
  mocks.applicationDeleteMany.mockResolvedValue({ count: 0 });
  mocks.applicationFindMany.mockResolvedValue([]);
  mocks.projectRoleUpdateMany.mockResolvedValue({ count: 1 });
  mocks.projectRoleFindUnique.mockResolvedValue({ slotsAvailable: 1 });
  mocks.projectRoleCount.mockResolvedValue(1);
  mocks.projectMemberCreate.mockResolvedValue({});
  mocks.projectMemberFindMany.mockResolvedValue([]);
  mocks.peerReviewCreate.mockResolvedValue({});
  mocks.peerReviewAggregate.mockResolvedValue({ _avg: { commitmentScore: 4.5 } });
  mocks.userUpdate.mockResolvedValue({});
  mocks.userUpdateMany.mockResolvedValue({ count: 1 });
  mocks.createNotification.mockResolvedValue(undefined);
  // Route every model mock through the transaction client so transactional
  // app code resolves against the same fns as non-transactional code.
  mocks.transaction.mockImplementation(async (callback) => callback({
    project: {
      update: mocks.projectUpdate,
    },
    application: {
      findMany: mocks.applicationFindMany,
      create: mocks.applicationCreate,
      delete: mocks.applicationDelete,
      deleteMany: mocks.applicationDeleteMany,
    },
    projectRole: {
      findUnique: mocks.projectRoleFindUnique,
      updateMany: mocks.projectRoleUpdateMany,
      count: mocks.projectRoleCount,
    },
    projectMember: {
      create: mocks.projectMemberCreate,
      findMany: mocks.projectMemberFindMany,
    },
    peerReview: {
      findUnique: mocks.peerReviewFindUnique,
      create: mocks.peerReviewCreate,
      aggregate: mocks.peerReviewAggregate,
    },
    user: {
      update: mocks.userUpdate,
      updateMany: mocks.userUpdateMany,
    },
  }));
});

describe("queryProjects", () => {
  it("queries projects with provided filters and default pagination", async () => {
    const record = [{
      id: "project-id",
      title: "Test Project",
      projectRoles: [
        { slotsAvailable: 2 },
        { slotsAvailable: 3 },
      ],
    }];
    mocks.projectFindMany.mockResolvedValue(record);

    const result = await queryProjects(queryProject());

    expect(result).toEqual({
      success: true,
      data: {
        projects: [{ ...record[0], totalAvailableSlot: 5 }],
        hasMore: false,
      },
    });
    expect(mocks.projectFindMany).toHaveBeenCalledWith({
      where: expect.objectContaining({
        status: "OPEN_RECRUITMENT",
        projectRoles: {
          some: {
            roleId: { in: ["role-id"] },
          },
        },
      }),
      include: {
        projectRoles: { include: { role: true } },
        owner: { select: { name: true } },
        category: { select: { name: true } },
        _count: { select: { projectMembers: true } },
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      skip: 0,
      take: 11,
    });
  });

  it("applies custom pagination and trims the probe row when a next page exists", async () => {
    const rows = Array.from({ length: 16 }, (_, i) => ({
      id: `project-${i}`,
      projectRoles: [{ slotsAvailable: i % 2 }],
    }));
    mocks.projectFindMany.mockResolvedValue(rows);

    const result = await queryProjects({ page: 3, pageSize: 15 });

    expect(result).toEqual({
      success: true,
      data: {
        projects: rows.slice(0, 15).map(project => ({
          ...project,
          totalAvailableSlot: project.projectRoles[0].slotsAvailable,
        })),
        hasMore: true,
      },
    });
    expect(mocks.projectFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 30,
        take: 16,
      }),
    );
  });

  it.each([
    ["rejects a page below one", { page: 0 }],
    ["rejects a non-integer page", { page: 2.5 }],
    ["rejects a page size below one", { pageSize: 0 }],
    ["rejects a page size over the cap", { pageSize: 51 }],
    ["rejects an unlisted project status", { status: "PENDING" }],
    ["rejects a draft project status", { status: "DRAFT" }],
  ] as Array<[string, Record<string, unknown>]>)("%s without querying the database", async (_name, pagination) => {
    mocks.projectFindMany.mockResolvedValue([]);

    // Intentionally invalid shapes (status outside the query enum, out-of-range
    // pagination) — cast past the input type so the validator is what rejects them.
    const result = await queryProjects(
      { categoryId: "category-id", ...pagination } as unknown as QueryProjectsForm,
    );

    expect(result.success).toBe(false);
    expect(mocks.projectFindMany).not.toHaveBeenCalled();
  });
});

describe("fetchProject", () => {
  it("fetches a project with its related users and roles", async () => {
    const record = { id: "project-id", title: "Test Project" };
    mocks.projectFindUnique.mockResolvedValue(record);

    const result = await fetchProject("project-id");

    expect(result).toEqual({ success: true, data: record });
    expect(mocks.projectFindUnique).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "project-id" },
      include: expect.objectContaining({
        owner: expect.any(Object),
        projectStatusCriteria: { include: { status: true } },
        projectRoles: { include: { role: true } },
        projectMembers: expect.any(Object),
      }),
    }));
  });

  it("rejects an invalid project ID", async () => {
    const result = await fetchProject("");

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("ID is required"),
    });
    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
  });

  it("rejects when the project does not exist", async () => {
    mocks.projectFindUnique.mockResolvedValue(null);

    const result = await fetchProject("project-id");

    expect(result).toEqual({ success: false, error: "Project not found" });
  });
});

describe("createProject", () => {
  it("creates a project owned by the authenticated user", async () => {
    const result = await createProject(project());

    expect(result).toEqual({ success: true, data: { id: "project-id" } });
    expect(mocks.projectCreate).toHaveBeenCalledWith({
      data: {
        ownerId: "test-user-id",
        title: "Test Project",
        description: "A test project",
        deadline: new Date("2030-01-01"),
        categoryId: "category-id",
        onSite: true,
        workHoursPerWeek: 10,
        projectStatusCriteria: {
          create: [{ status: { connect: { id: "status-id" } } }],
        },
        projectRoles: {
          create: [{ slotsAvailable: 2, role: { connect: { id: "role-id" } } }],
        },
      },
    });
  });

  it("rejects invalid project data", async () => {
    const result = await createProject({ ...project(), title: "" });

    expect(result).toEqual({
      success: false,
      error: "Please check your input",
      fieldErrors: { title: ["Title is required"] },
    });
    expect(mocks.projectCreate).not.toHaveBeenCalled();
  });
});

describe("sendApplication", () => {
  it("creates an application for an available role and notifies the owner", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      id: "project-id",
      title: "Test Project",
      ownerId: "owner-id",
      status: "OPEN_RECRUITMENT",
      projectMembers: [],
      projectRoles: [{ roleId: "role-id", slotsAvailable: 1 }],
    });

    const result = await sendApplication("project-id", application());

    expect(result).toEqual({ success: true });
    expect(mocks.applicationCreate).toHaveBeenCalledWith({
      data: {
        applicantId: "test-user-id",
        projectId: "project-id",
        roleId: "role-id",
        message: "I can help",
        portfolioLink: "https://example.com/portfolio",
      },
    });
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.anything(),
      {
        userId: "owner-id",
        title: "New Application Received",
        message: 'You have received a new application for project "Test Project".',
      },
    );
  });

  it("rejects invalid project IDs and application data without sending notifications", async () => {
    const idResult = await sendApplication("", application());
    expect(idResult).toEqual({
      success: false,
      error: expect.stringContaining("ID is required"),
    });

    const dataResult = await sendApplication("project-id", { roleId: "" });
    expect(dataResult.success).toBe(false);

    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
    expect(mocks.createNotification).not.toHaveBeenCalled();
  });

  it.each([
    ["javascript", "javascript:alert(1)"],
    ["ftp", "ftp://files.example.com/cv.pdf"],
    ["data", "data:text/html;base64,PHNjcmlwdD4="],
    ["malformed", "not-a-valid-url"],
  ])("rejects invalid portfolio URL scheme (%s)", async (_scheme, portfolioLink) => {
    const result = await sendApplication("project-id", {
      ...application(),
      portfolioLink,
    });

    expect(result.success).toBe(false);
    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
  });

  it("allows non-member users to apply when other members are in the team", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      id: "project-id",
      title: "Test Project",
      ownerId: "owner-id",
      status: "OPEN_RECRUITMENT",
      projectMembers: [{ userId: "other-member-id" }],
      projectRoles: [{ roleId: "role-id", slotsAvailable: 1 }],
    });

    const result = await sendApplication("project-id", application());

    expect(result).toEqual({ success: true });
    expect(mocks.applicationCreate).toHaveBeenCalledWith({
      data: {
        applicantId: "test-user-id",
        projectId: "project-id",
        roleId: "role-id",
        message: "I can help",
        portfolioLink: "https://example.com/portfolio",
      },
    });
  });

  it("rejects a missing project", async () => {
    mocks.projectFindUnique.mockResolvedValue(null);

    const result = await sendApplication("project-id", application());

    expect(result).toEqual({ success: false, error: "Project not found" });
    expect(mocks.createNotification).not.toHaveBeenCalled();
  });

  it("rejects applications to the user's own project", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "test-user-id",
      status: "OPEN_RECRUITMENT",
      projectMembers: [],
      projectRoles: [{ roleId: "role-id", slotsAvailable: 1 }],
    });

    const result = await sendApplication("project-id", application());

    expect(result).toEqual({
      success: false,
      error: "You cannot apply to your own project",
    });
    expect(mocks.createNotification).not.toHaveBeenCalled();
  });

  it("rejects applications from users who are already in the team", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "owner-id",
      status: "OPEN_RECRUITMENT",
      projectMembers: [{ userId: "test-user-id" }],
      projectRoles: [{ roleId: "role-id", slotsAvailable: 1 }],
    });

    const result = await sendApplication("project-id", application());

    expect(result).toEqual({
      success: false,
      error: "You are already a member of this project",
    });
    expect(mocks.createNotification).not.toHaveBeenCalled();
  });

  it("rejects applications when the project is not open for applications", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      id: "project-id",
      title: "Test Project",
      ownerId: "owner-id",
      status: "IN_PROGRESS",
      projectMembers: [],
      projectRoles: [{ roleId: "role-id", slotsAvailable: 1 }],
    });

    const result = await sendApplication("project-id", application());

    expect(result).toEqual({
      success: false,
      error: "This project is not open for applications",
    });
    expect(mocks.createNotification).not.toHaveBeenCalled();
  });

  it("rejects applications when the project deadline has passed", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      id: "project-id",
      title: "Test Project",
      ownerId: "owner-id",
      status: "OPEN_RECRUITMENT",
      deadline: new Date("2020-01-01"),
      projectMembers: [],
      projectRoles: [{ roleId: "role-id", slotsAvailable: 1 }],
    });

    const result = await sendApplication("project-id", application());

    expect(result).toEqual({
      success: false,
      error: "The deadline for this project has passed",
    });
    expect(mocks.applicationCreate).not.toHaveBeenCalled();
    expect(mocks.createNotification).not.toHaveBeenCalled();
  });

  it("rejects duplicate applications from the same user", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      id: "project-id",
      title: "Test Project",
      ownerId: "owner-id",
      status: "OPEN_RECRUITMENT",
      projectMembers: [],
      projectRoles: [{ roleId: "role-id", slotsAvailable: 1 }],
    });
    mocks.applicationFindUnique.mockResolvedValue({ id: "existing-app-id" });

    const result = await sendApplication("project-id", application());

    expect(result).toEqual({
      success: false,
      error: "You have already applied to this project",
    });
    expect(mocks.applicationCreate).not.toHaveBeenCalled();
    expect(mocks.createNotification).not.toHaveBeenCalled();
  });

  it("rejects applications for unavailable roles", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "owner-id",
      status: "OPEN_RECRUITMENT",
      projectMembers: [],
      projectRoles: [{ roleId: "other-role-id", slotsAvailable: 1 }],
    });

    const result = await sendApplication("project-id", application());

    expect(result).toEqual({
      success: false,
      error: "The selected role is not available for this project",
    });
    expect(mocks.createNotification).not.toHaveBeenCalled();
  });

  it("rejects applications when the selected role has no slots", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "owner-id",
      status: "OPEN_RECRUITMENT",
      projectMembers: [],
      projectRoles: [{ roleId: "role-id", slotsAvailable: 0 }],
    });

    const result = await sendApplication("project-id", application());

    expect(result).toEqual({
      success: false,
      error: "The selected role is not available for this project",
    });
    expect(mocks.createNotification).not.toHaveBeenCalled();
  });
});

describe.each([
  ["accept", acceptApplication, "accept"],
  ["reject", rejectApplication, "reject"],
] as const)("%sApplication", (_name, action, verb) => {
  it("rejects an invalid application ID", async () => {
    const result = await action("");

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("ID is required"),
    });
    expect(mocks.applicationFindUnique).not.toHaveBeenCalled();
    expect(mocks.createNotification).not.toHaveBeenCalled();
  });

  it("rejects a missing application", async () => {
    mocks.applicationFindUnique.mockResolvedValue(null);

    const result = await action("application-id");

    expect(result).toEqual({ success: false, error: "Application not found" });
    expect(mocks.createNotification).not.toHaveBeenCalled();
  });

  it("rejects a non-owner", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      applicantId: "applicant-id",
      roleId: "role-id",
      projectId: "project-id",
      project: { id: "project-id", ownerId: "other-user-id" },
    });

    const result = await action("application-id");

    expect(result).toEqual({
      success: false,
      error: `You are not authorized to ${verb} this application`,
    });
    expect(mocks.createNotification).not.toHaveBeenCalled();
  });
});

describe("acceptApplication", () => {
  it("decrements the role, deletes the application, adds the member, and notifies the applicant", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      applicantId: "applicant-id",
      roleId: "role-id",
      projectId: "project-id",
      project: { id: "project-id", title: "Test Project", ownerId: "test-user-id", status: "OPEN_RECRUITMENT" },
    });
    mocks.projectRoleUpdateMany.mockResolvedValue({ count: 1 });
    mocks.projectRoleFindUnique.mockResolvedValue({ slotsAvailable: 1 });
    mocks.projectRoleCount.mockResolvedValue(1);

    const result = await acceptApplication("application-id");

    expect(result).toEqual({ success: true });
    expect(mocks.projectRoleUpdateMany).toHaveBeenCalledWith({
      where: {
        projectId: "project-id",
        roleId: "role-id",
        slotsAvailable: { gt: 0 },
      },
      data: { slotsAvailable: { decrement: 1 } },
    });
    expect(mocks.projectRoleFindUnique).toHaveBeenCalledWith({
      where: { projectId_roleId: { projectId: "project-id", roleId: "role-id" } },
    });
    expect(mocks.projectMemberCreate).toHaveBeenCalledWith({
      data: { userId: "applicant-id", projectId: "project-id", roleId: "role-id" },
    });
    expect(mocks.applicationDelete).toHaveBeenCalledWith({
      where: { id: "application-id" },
    });
    expect(mocks.applicationDeleteMany).not.toHaveBeenCalled();
    expect(mocks.applicationFindMany).not.toHaveBeenCalled();
    expect(mocks.projectRoleCount).toHaveBeenCalledWith({
      where: {
        projectId: "project-id",
        slotsAvailable: { gt: 0 },
      },
    });
    expect(mocks.projectUpdate).not.toHaveBeenCalled();
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.anything(),
      {
        userId: "applicant-id",
        title: "Application Accepted",
        message: 'Your application for project "Test Project" has been accepted.',
      },
    );
  });

  it("auto-deletes other applications for the role when slots reach 0 and notifies each applicant", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      applicantId: "applicant-id",
      roleId: "role-id",
      projectId: "project-id",
      project: { id: "project-id", title: "Test Project", ownerId: "test-user-id", status: "OPEN_RECRUITMENT" },
    });
    mocks.projectRoleFindUnique.mockResolvedValue({ slotsAvailable: 0 });
    mocks.applicationFindMany.mockResolvedValue([
      { id: "other-app-1", applicantId: "comp-user-1", roleId: "role-id" },
      { id: "other-app-2", applicantId: "comp-user-2", roleId: "role-id" },
    ]);
    mocks.projectRoleCount.mockResolvedValue(1);

    const result = await acceptApplication("application-id");

    expect(result).toEqual({ success: true });
    expect(mocks.applicationFindMany).toHaveBeenCalledWith({
      where: {
        projectId: "project-id",
        roleId: "role-id",
      },
    });
    expect(mocks.applicationDeleteMany).toHaveBeenCalledWith({
      where: {
        projectId: "project-id",
        roleId: "role-id",
      },
    });
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.anything(),
      {
        userId: "comp-user-1",
        title: "Application Rejected",
        message: 'Your application for project "Test Project" has been rejected.',
      },
    );
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.anything(),
      {
        userId: "comp-user-2",
        title: "Application Rejected",
        message: 'Your application for project "Test Project" has been rejected.',
      },
    );
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.anything(),
      {
        userId: "applicant-id",
        title: "Application Accepted",
        message: 'Your application for project "Test Project" has been accepted.',
      },
    );
  });

  it("does not delete other applications when slots reach 0 if there are none", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      applicantId: "applicant-id",
      roleId: "role-id",
      projectId: "project-id",
      project: { id: "project-id", title: "Test Project", ownerId: "test-user-id", status: "OPEN_RECRUITMENT" },
    });
    mocks.projectRoleFindUnique.mockResolvedValue({ slotsAvailable: 0 });
    mocks.applicationFindMany.mockResolvedValue([]);
    mocks.projectRoleCount.mockResolvedValue(1);

    const result = await acceptApplication("application-id");

    expect(result).toEqual({ success: true });
    expect(mocks.applicationFindMany).toHaveBeenCalledWith({
      where: {
        projectId: "project-id",
        roleId: "role-id",
      },
    });
    expect(mocks.applicationDeleteMany).not.toHaveBeenCalled();
    expect(mocks.createNotification).toHaveBeenCalledTimes(1);
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.anything(),
      {
        userId: "applicant-id",
        title: "Application Accepted",
        message: 'Your application for project "Test Project" has been accepted.',
      },
    );
  });

  it("does not reject competing applications if slots remain available after acceptance", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      applicantId: "applicant-id",
      roleId: "role-id",
      projectId: "project-id",
      project: { id: "project-id", title: "Test Project", ownerId: "test-user-id", status: "OPEN_RECRUITMENT" },
    });
    mocks.projectRoleFindUnique.mockResolvedValue({ slotsAvailable: 2 });
    mocks.projectRoleCount.mockResolvedValue(1);

    const result = await acceptApplication("application-id");

    expect(result).toEqual({ success: true });
    expect(mocks.applicationFindMany).not.toHaveBeenCalled();
    expect(mocks.applicationDeleteMany).not.toHaveBeenCalled();
    expect(mocks.createNotification).toHaveBeenCalledTimes(1);
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.anything(),
      {
        userId: "applicant-id",
        title: "Application Accepted",
        message: 'Your application for project "Test Project" has been accepted.',
      },
    );
  });

  it("automatically updates project status to IN_PROGRESS when all slots are filled", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      applicantId: "applicant-id",
      roleId: "role-id",
      projectId: "project-id",
      project: { id: "project-id", title: "Test Project", ownerId: "test-user-id", status: "OPEN_RECRUITMENT" },
    });
    mocks.projectRoleFindUnique.mockResolvedValue({ slotsAvailable: 0 });
    mocks.projectRoleCount.mockResolvedValue(0);

    const result = await acceptApplication("application-id");

    expect(result).toEqual({ success: true });
    expect(mocks.projectUpdate).toHaveBeenCalledWith({
      where: { id: "project-id" },
      data: { status: "IN_PROGRESS" },
    });
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.anything(),
      {
        userId: "applicant-id",
        title: "Application Accepted",
        message: 'Your application for project "Test Project" has been accepted.',
      },
    );
  });

  it("does not update project status if project is not OPEN_RECRUITMENT", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      applicantId: "applicant-id",
      roleId: "role-id",
      projectId: "project-id",
      project: { id: "project-id", title: "Test Project", ownerId: "test-user-id", status: "IN_PROGRESS" },
    });
    mocks.projectRoleFindUnique.mockResolvedValue({ slotsAvailable: 0 });
    mocks.projectRoleCount.mockResolvedValue(0);

    const result = await acceptApplication("application-id");

    expect(result).toEqual({ success: true });
    expect(mocks.projectUpdate).not.toHaveBeenCalled();
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.anything(),
      {
        userId: "applicant-id",
        title: "Application Accepted",
        message: 'Your application for project "Test Project" has been accepted.',
      },
    );
  });

  it("rejects the application when the role no longer has available slots (guard)", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      applicantId: "applicant-id",
      roleId: "role-id",
      projectId: "project-id",
      project: { id: "project-id", title: "Test Project", ownerId: "test-user-id", status: "OPEN_RECRUITMENT" },
    });
    // A concurrent accept filled the last slot: the conditional decrement
    // matches 0 rows and the transaction rolls back.
    mocks.projectRoleUpdateMany.mockResolvedValue({ count: 0 });

    const result = await acceptApplication("application-id");

    expect(result).toEqual({
      success: false,
      error: "The role for this application no longer has available slots",
    });
    expect(mocks.projectMemberCreate).not.toHaveBeenCalled();
    expect(mocks.applicationDelete).not.toHaveBeenCalled();
    expect(mocks.createNotification).not.toHaveBeenCalled();
  });
});

describe("rejectApplication", () => {
  it("deletes an owner's application and notifies the applicant", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      applicantId: "applicant-id",
      project: { ownerId: "test-user-id", title: "Test Project" },
    });

    const result = await rejectApplication("application-id");

    expect(result).toEqual({ success: true });
    expect(mocks.applicationDelete).toHaveBeenCalledWith({
      where: { id: "application-id" },
    });
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.anything(),
      {
        userId: "applicant-id",
        title: "Application Rejected",
        message: 'Your application for project "Test Project" has been rejected.',
      },
    );
  });
});

describe("updateProject", () => {
  it("updates an owned project and replaces its nested records", async () => {
    mocks.projectFindUnique.mockResolvedValue({ ownerId: "test-user-id", status: "OPEN_RECRUITMENT" });

    const result = await updateProject("project-id", project());

    expect(result).toEqual({ success: true });
    expect(mocks.projectUpdate).toHaveBeenCalledWith({
      where: { id: "project-id" },
      data: {
        title: "Test Project",
        description: "A test project",
        deadline: new Date("2030-01-01"),
        workHoursPerWeek: 10,
        onSite: true,
        projectStatusCriteria: {
          deleteMany: {},
          create: [{ status: { connect: { id: "status-id" } } }],
        },
        projectRoles: {
          deleteMany: {},
          create: [{ slotsAvailable: 2, role: { connect: { id: "role-id" } } }],
        },
      },
    });
  });

  it("rejects invalid IDs and form data", async () => {
    const idResult = await updateProject("", project());
    expect(idResult).toEqual({
      success: false,
      error: "ID is required",
    });

    const formResult = await updateProject("project-id", { title: "" });
    expect(formResult).toEqual({
      success: false,
      error: "Please check your input",
      fieldErrors: { title: ["Title is required"] },
    });

    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
  });

  it("rejects a missing project", async () => {
    mocks.projectFindUnique.mockResolvedValue(null);

    const result = await updateProject("project-id", project());

    expect(result).toEqual({ success: false, error: "Project not found" });
  });

  it("rejects a non-owner", async () => {
    mocks.projectFindUnique.mockResolvedValue({ ownerId: "other-user-id" });

    const result = await updateProject("project-id", project());

    expect(result).toEqual({
      success: false,
      error: "You are not authorized to update this project",
    });
    expect(mocks.projectUpdate).not.toHaveBeenCalled();
  });

  it("rejects updating a project that is in progress or completed", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "test-user-id",
      status: "IN_PROGRESS",
    });

    const result = await updateProject("project-id", project());

    expect(result).toEqual({
      success: false,
      error: "You cannot update a project that is in progress or completed",
    });
    expect(mocks.projectUpdate).not.toHaveBeenCalled();
  });
});

describe("deleteProject", () => {
  it("deletes an owned project", async () => {
    mocks.projectFindUnique.mockResolvedValue({ ownerId: "test-user-id", status: "OPEN_RECRUITMENT" });

    const result = await deleteProject("project-id");

    expect(result).toEqual({ success: true });
    expect(mocks.projectDelete).toHaveBeenCalledWith({
      where: { id: "project-id" },
    });
  });

  it("rejects deleting a project that is in progress or completed", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "test-user-id",
      status: "COMPLETED",
    });

    const result = await deleteProject("project-id");

    expect(result).toEqual({
      success: false,
      error: "You cannot delete a project that is in progress or completed",
    });
    expect(mocks.projectDelete).not.toHaveBeenCalled();
  });

  it("rejects invalid IDs, missing projects, and non-owners", async () => {
    const idResult = await deleteProject("");
    expect(idResult).toEqual({
      success: false,
      error: expect.stringContaining("ID is required"),
    });

    mocks.projectFindUnique.mockResolvedValueOnce(null);
    const notFoundResult = await deleteProject("project-id");
    expect(notFoundResult).toEqual({ success: false, error: "Project not found" });

    mocks.projectFindUnique.mockResolvedValueOnce({ ownerId: "other-user-id" });
    const authResult = await deleteProject("project-id");
    expect(authResult).toEqual({
      success: false,
      error: "You are not authorized to delete this project",
    });

    expect(mocks.projectDelete).not.toHaveBeenCalled();
  });
});

describe("createPeerReview", () => {
  it("creates a review and updates the reviewee's average", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "owner-id",
      status: "COMPLETED",
      projectMembers: [{ userId: "test-user-id" }, { userId: "reviewee-id" }],
    });
    mocks.peerReviewFindUnique.mockResolvedValue(null);

    const result = await createPeerReview(peerReview());

    expect(result).toEqual({ success: true });
    expect(mocks.transaction).toHaveBeenCalled();
    expect(mocks.peerReviewCreate).toHaveBeenCalledWith({
      data: {
        projectId: "project-id",
        reviewerId: "test-user-id",
        revieweeId: "reviewee-id",
        commitmentScore: 5,
        feedback: "Great teammate",
      },
    });
    expect(mocks.userUpdate).toHaveBeenCalledWith({
      where: { id: "reviewee-id" },
      data: { avgCommitmentScore: 4.5 },
    });
  });

  it("rejects invalid review data", async () => {
    const result = await createPeerReview({ ...peerReview(), commitmentScore: 6 });

    expect(result).toEqual({
      success: false,
      error: "Please check your input",
      fieldErrors: { commitmentScore: ["Commitment score must be between 1 and 5"] },
    });
    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
  });

  it("rejects a missing project", async () => {
    mocks.projectFindUnique.mockResolvedValue(null);

    const result = await createPeerReview(peerReview());

    expect(result).toEqual({ success: false, error: "Project not found" });
  });

  it.each(["DRAFT", "OPEN_RECRUITMENT", "IN_PROGRESS"] as const)(
    "rejects peer reviews for project with non-completed status: %s",
    async (status) => {
      mocks.projectFindUnique.mockResolvedValue({
        ownerId: "owner-id",
        status,
        projectMembers: [{ userId: "test-user-id" }, { userId: "reviewee-id" }],
      });

      const result = await createPeerReview(peerReview());

      expect(result).toEqual({
        success: false,
        error: "Peer reviews can only be submitted for completed projects",
      });
      expect(mocks.peerReviewCreate).not.toHaveBeenCalled();
    },
  );

  it("rejects reviewers who are not project participants", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "owner-id",
      status: "COMPLETED",
      projectMembers: [{ userId: "another-user-id" }],
    });

    const result = await createPeerReview(peerReview());

    expect(result).toEqual({
      success: false,
      error: "You are not authorized to submit a review for this project",
    });
  });

  it("rejects reviewees who are not project participants", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "owner-id",
      status: "COMPLETED",
      projectMembers: [{ userId: "test-user-id" }],
    });

    const result = await createPeerReview(peerReview());

    expect(result).toEqual({
      success: false,
      error: "The reviewee is not a participant in this project",
    });
  });

  it("rejects self-reviews", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "test-user-id",
      status: "COMPLETED",
      projectMembers: [],
    });

    const result = await createPeerReview({ ...peerReview(), revieweeId: "test-user-id" });

    expect(result).toEqual({
      success: false,
      error: "You cannot review yourself",
    });
  });

  it("rejects duplicate reviews before creating a new review", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "owner-id",
      status: "COMPLETED",
      projectMembers: [{ userId: "test-user-id" }, { userId: "reviewee-id" }],
    });
    mocks.peerReviewFindUnique.mockResolvedValue({ id: "existing-review" });

    const result = await createPeerReview(peerReview());

    expect(result).toEqual({
      success: false,
      error: "You have already reviewed this participant for this project",
    });
    expect(mocks.peerReviewCreate).not.toHaveBeenCalled();
    expect(mocks.userUpdate).not.toHaveBeenCalled();
  });
});

describe("completeProject", () => {
  it("completes an in-progress project and increments totalProjectsCompleted for owner and members", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      id: "project-id",
      ownerId: "test-user-id",
      status: "IN_PROGRESS",
    });
    mocks.projectMemberFindMany.mockResolvedValue([
      { userId: "member-1" },
      { userId: "member-2" },
    ]);

    const result = await completeProject("project-id");

    expect(result).toEqual({ success: true });
    expect(mocks.projectFindUnique).toHaveBeenCalledWith({
      where: { id: "project-id" },
      select: { ownerId: true, status: true },
    });
    expect(mocks.projectMemberFindMany).toHaveBeenCalledWith({
      where: { projectId: "project-id" },
    });
    expect(mocks.projectUpdate).toHaveBeenCalledWith({
      where: { id: "project-id" },
      data: { status: "COMPLETED" },
    });
    expect(mocks.userUpdateMany).toHaveBeenCalledWith({
      where: { id: { in: ["test-user-id", "member-1", "member-2"] } },
      data: { totalProjectsCompleted: { increment: 1 } },
    });
  });

  it("rejects an invalid project ID", async () => {
    const result = await completeProject("");

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("ID is required"),
    });
    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
  });

  it("rejects when the project does not exist", async () => {
    mocks.projectFindUnique.mockResolvedValue(null);

    const result = await completeProject("project-id");

    expect(result).toEqual({ success: false, error: "Project not found" });
    expect(mocks.projectUpdate).not.toHaveBeenCalled();
  });

  it("rejects when called by a non-owner", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      id: "project-id",
      ownerId: "other-user-id",
      status: "IN_PROGRESS",
      projectMembers: [],
    });

    const result = await completeProject("project-id");

    expect(result).toEqual({
      success: false,
      error: "You are not authorized to complete this project",
    });
    expect(mocks.projectUpdate).not.toHaveBeenCalled();
  });

  it("rejects when the project is not in progress", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      id: "project-id",
      ownerId: "test-user-id",
      status: "OPEN_RECRUITMENT",
      projectMembers: [],
    });

    const result = await completeProject("project-id");

    expect(result).toEqual({
      success: false,
      error: "Project must be in progress to be marked as completed",
    });
    expect(mocks.projectUpdate).not.toHaveBeenCalled();
  });
});

describe("fetchProjectApplications", () => {
  it("fetches applications for the project when called by owner", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "test-user-id",
    });
    const sampleApplications = [
      { id: "app-1", applicant: { name: "Alice" }, role: { roleName: "Developer" } },
    ];
    mocks.applicationFindMany.mockResolvedValue(sampleApplications);

    const result = await fetchProjectApplications("project-id");

    expect(result).toEqual({ success: true, data: sampleApplications });
    expect(mocks.projectFindUnique).toHaveBeenCalledWith({
      where: { id: "project-id" },
      select: { ownerId: true },
    });
    expect(mocks.applicationFindMany).toHaveBeenCalledWith({
      where: { projectId: "project-id" },
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
  });

  it("rejects an invalid project ID", async () => {
    const result = await fetchProjectApplications("");

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("ID is required"),
    });
    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
  });

  it("rejects when the project does not exist", async () => {
    mocks.projectFindUnique.mockResolvedValue(null);

    const result = await fetchProjectApplications("project-id");

    expect(result).toEqual({ success: false, error: "Project not found" });
    expect(mocks.applicationFindMany).not.toHaveBeenCalled();
  });

  it("rejects when called by a non-owner", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "other-user-id",
    });

    const result = await fetchProjectApplications("project-id");

    expect(result).toEqual({
      success: false,
      error: "You are not authorized to view applications for this project",
    });
    expect(mocks.applicationFindMany).not.toHaveBeenCalled();
  });
});
