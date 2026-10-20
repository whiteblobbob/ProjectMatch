import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApplicationForm,
  PeerReviewForm,
  ProjectForm,
} from "../validator/project";

vi.mock("../../utils/authWrapper", () => ({
  default: (handler: (user: { id: string }, ...args: unknown[]) => unknown) =>
    (...args: unknown[]) => handler({ id: "test-user-id" }, ...args),
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
  applicationUpdate: vi.fn(),
  projectRoleUpdate: vi.fn(),
  projectRoleCount: vi.fn(),
  projectMemberCreate: vi.fn(),
  transaction: vi.fn(),
  peerReviewFindUnique: vi.fn(),
  peerReviewCreate: vi.fn(),
  peerReviewAggregate: vi.fn(),
  userUpdate: vi.fn(),
  userUpdateMany: vi.fn(),
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
      update: mocks.applicationUpdate,
    },
    projectRole: {
      update: mocks.projectRoleUpdate,
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

const project = (): ProjectForm => ({
  title: "Test Project",
  description: "A test project",
  deadline: new Date("2030-01-01"),
  categoryId: "category-id",
  onSite: true,
  workHoursPerWeek: 10,
  projectStatusCriteria: [{ statusId: "status-id" }],
  projectRoles: [{ roleId: "role-id", slotsAvailable: 2 }],
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
  mocks.projectCreate.mockResolvedValue({});
  mocks.projectUpdate.mockResolvedValue({});
  mocks.projectDelete.mockResolvedValue({});
  mocks.applicationCreate.mockResolvedValue({});
  mocks.applicationUpdate.mockResolvedValue({});
  mocks.applicationFindMany.mockResolvedValue([]);
  mocks.projectRoleUpdate.mockResolvedValue({});
  mocks.projectRoleCount.mockResolvedValue(1);
  mocks.projectMemberCreate.mockResolvedValue({});
  mocks.peerReviewCreate.mockResolvedValue({});
  mocks.peerReviewAggregate.mockResolvedValue({ _avg: { commitmentScore: 4.5 } });
  mocks.userUpdate.mockResolvedValue({});
  mocks.userUpdateMany.mockResolvedValue({ count: 1 });
  mocks.transaction.mockImplementation(async (callback) => callback({
    peerReview: {
      findUnique: mocks.peerReviewFindUnique,
      create: mocks.peerReviewCreate,
      aggregate: mocks.peerReviewAggregate,
    },
    user: { update: mocks.userUpdate },
  }));
});

describe("fetchProject", () => {
  it("fetches a project with its related users and roles", async () => {
    const record = { id: "project-id", title: "Test Project" };
    mocks.projectFindUnique.mockResolvedValue(record);

    await expect(fetchProject("project-id")).resolves.toBe(record);

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
    await expect(fetchProject("")).rejects.toThrow("ID is required");
    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
  });

  it("rejects when the project does not exist", async () => {
    mocks.projectFindUnique.mockResolvedValue(null);

    await expect(fetchProject("project-id")).rejects.toThrow("Project not found");
  });
});

describe("queryProjects", () => {
  it("queries projects by category, statuses, and roles", async () => {
    const projects = [{ id: "project-id" }];
    mocks.projectFindMany.mockResolvedValue(projects);

    await expect(queryProjects({
      categoryId: "category-id",
      projectStatusCriteria: [{ statusId: "status-id" }],
      projectRoles: [{ roleId: "role-id", slotsAvailable: 1 }],
    })).resolves.toBe(projects);

    expect(mocks.projectFindMany).toHaveBeenCalledWith({
      where: {
        categoryId: "category-id",
        projectStatusCriteria: {
          some: { statusId: { in: ["status-id"] } },
        },
        projectRoles: {
          some: { roleId: { in: ["role-id"] } },
        },
      },
    });
  });

  it("supports an empty query without filters", async () => {
    mocks.projectFindMany.mockResolvedValue([]);

    await expect(queryProjects({})).resolves.toEqual([]);

    expect(mocks.projectFindMany).toHaveBeenCalledWith({
      where: {
        categoryId: undefined,
        projectStatusCriteria: undefined,
        projectRoles: undefined,
      },
    });
  });

  it("rejects invalid query filter data", async () => {
    await expect(queryProjects({
      projectRoles: [{ roleId: "", slotsAvailable: 1 }],
    })).rejects.toThrow("Role ID is required");

    expect(mocks.projectFindMany).not.toHaveBeenCalled();
  });
});

describe("createProject", () => {
  it("creates a project owned by the authenticated user", async () => {
    await expect(createProject(project())).resolves.toBeUndefined();

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
    await expect(createProject({ ...project(), title: "" })).rejects.toThrow("Title is required");
    expect(mocks.projectCreate).not.toHaveBeenCalled();
  });
});

describe("sendApplication", () => {
  it("creates an application for an available role", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      id: "project-id",
      ownerId: "owner-id",
      projectRoles: [{ roleId: "role-id", slotsAvailable: 1 }],
    });

    await expect(sendApplication("project-id", application())).resolves.toBeUndefined();

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

  it("rejects invalid project IDs and application data", async () => {
    await expect(sendApplication("", application())).rejects.toThrow("ID is required");
    await expect(sendApplication("project-id", { roleId: "" })).rejects.toThrow("Role ID is required");
    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
  });

  it("rejects a missing project", async () => {
    mocks.projectFindUnique.mockResolvedValue(null);

    await expect(sendApplication("project-id", application())).rejects.toThrow("Project not found");
  });

  it("rejects applications to the user's own project", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "test-user-id",
      projectRoles: [{ roleId: "role-id", slotsAvailable: 1 }],
    });

    await expect(sendApplication("project-id", application()))
      .rejects.toThrow("You cannot apply to your own project");
  });

  it("rejects applications for unavailable roles", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "owner-id",
      projectRoles: [{ roleId: "other-role-id", slotsAvailable: 1 }],
    });

    await expect(sendApplication("project-id", application()))
      .rejects.toThrow("The selected role is not available for this project");
  });

  it("rejects applications when the selected role has no slots", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "owner-id",
      projectRoles: [{ roleId: "role-id", slotsAvailable: 0 }],
    });

    await expect(sendApplication("project-id", application()))
      .rejects.toThrow("The selected role is not available for this project");
  });
});

describe.each([
  ["accept", acceptApplication, "accept"],
  ["reject", rejectApplication, "reject"],
] as const)("%sApplication", (_name, action, verb) => {
  it("rejects an invalid application ID", async () => {
    await expect(action("")).rejects.toThrow("ID is required");
    expect(mocks.applicationFindUnique).not.toHaveBeenCalled();
  });

  it("rejects a missing application", async () => {
    mocks.applicationFindUnique.mockResolvedValue(null);

    await expect(action("application-id")).rejects.toThrow("Application not found");
  });

  it("rejects a non-owner", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      applicantId: "applicant-id",
      roleId: "role-id",
      projectId: "project-id",
      project: { id: "project-id", ownerId: "other-user-id" },
    });

    await expect(action("application-id")).rejects.toThrow(
      `You are not authorized to ${verb} this application`,
    );
  });
});

describe("acceptApplication", () => {
  it("decrements the role, accepts the application, and adds the member", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      applicantId: "applicant-id",
      roleId: "role-id",
      projectId: "project-id",
      project: { id: "project-id", ownerId: "test-user-id", status: "OPEN_RECRUITMENT" },
    });
    mocks.projectRoleCount.mockResolvedValue(1);

    await expect(acceptApplication("application-id")).resolves.toBeUndefined();

    expect(mocks.projectRoleUpdate).toHaveBeenCalledWith({
      where: { projectId_roleId: { projectId: "project-id", roleId: "role-id" } },
      data: { slotsAvailable: { decrement: 1 } },
    });
    expect(mocks.applicationUpdate).toHaveBeenCalledWith({
      where: { id: "application-id" },
      data: { status: "ACCEPTED" },
    });
    expect(mocks.projectMemberCreate).toHaveBeenCalledWith({
      data: { userId: "applicant-id", projectId: "project-id", roleId: "role-id" },
    });
    expect(mocks.projectRoleCount).toHaveBeenCalledWith({
      where: {
        projectId: "project-id",
        slotsAvailable: { gt: 0 },
      },
    });
    expect(mocks.projectUpdate).not.toHaveBeenCalled();
  });

  it("automatically updates project status to IN_PROGRESS when all slots are filled", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      applicantId: "applicant-id",
      roleId: "role-id",
      projectId: "project-id",
      project: { id: "project-id", ownerId: "test-user-id", status: "OPEN_RECRUITMENT" },
    });
    mocks.projectRoleCount.mockResolvedValue(0);

    await expect(acceptApplication("application-id")).resolves.toBeUndefined();

    expect(mocks.projectUpdate).toHaveBeenCalledWith({
      where: { id: "project-id" },
      data: { status: "IN_PROGRESS" },
    });
  });

  it("does not update project status if project is not OPEN_RECRUITMENT", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      applicantId: "applicant-id",
      roleId: "role-id",
      projectId: "project-id",
      project: { id: "project-id", ownerId: "test-user-id", status: "IN_PROGRESS" },
    });
    mocks.projectRoleCount.mockResolvedValue(0);

    await expect(acceptApplication("application-id")).resolves.toBeUndefined();

    expect(mocks.projectUpdate).not.toHaveBeenCalled();
  });
});

describe("rejectApplication", () => {
  it("marks an owner's application as rejected", async () => {
    mocks.applicationFindUnique.mockResolvedValue({
      project: { ownerId: "test-user-id" },
    });

    await expect(rejectApplication("application-id")).resolves.toBeUndefined();

    expect(mocks.applicationUpdate).toHaveBeenCalledWith({
      where: { id: "application-id" },
      data: { status: "REJECTED" },
    });
  });
});

describe("updateProject", () => {
  it("updates an owned project and replaces its nested records", async () => {
    mocks.projectFindUnique.mockResolvedValue({ ownerId: "test-user-id" });

    await expect(updateProject("project-id", project())).resolves.toBeUndefined();

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
    await expect(updateProject("", project())).rejects.toThrow("ID is required");
    await expect(updateProject("project-id", { title: "" })).rejects.toThrow("Title is required");
    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
  });

  it("rejects a missing project", async () => {
    mocks.projectFindUnique.mockResolvedValue(null);

    await expect(updateProject("project-id", project())).rejects.toThrow("Project not found");
  });

  it("rejects a non-owner", async () => {
    mocks.projectFindUnique.mockResolvedValue({ ownerId: "other-user-id" });

    await expect(updateProject("project-id", project()))
      .rejects.toThrow("You are not authorized to update this project");
  });
});

describe("deleteProject", () => {
  it("deletes an owned project", async () => {
    mocks.projectFindUnique.mockResolvedValue({ ownerId: "test-user-id" });

    await expect(deleteProject("project-id")).resolves.toBeUndefined();
    expect(mocks.projectDelete).toHaveBeenCalledWith({ where: { id: "project-id" } });
  });

  it("rejects invalid IDs, missing projects, and non-owners", async () => {
    await expect(deleteProject("")).rejects.toThrow("ID is required");

    mocks.projectFindUnique.mockResolvedValueOnce(null);
    await expect(deleteProject("project-id")).rejects.toThrow("Project not found");

    mocks.projectFindUnique.mockResolvedValueOnce({ ownerId: "other-user-id" });
    await expect(deleteProject("project-id"))
      .rejects.toThrow("You are not authorized to delete this project");
  });
});

describe("createPeerReview", () => {
  it("creates a review and updates the reviewee's average", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "owner-id",
      projectMembers: [{ userId: "test-user-id" }, { userId: "reviewee-id" }],
    });
    mocks.peerReviewFindUnique.mockResolvedValue(null);

    await expect(createPeerReview(peerReview())).resolves.toBeUndefined();

    expect(mocks.transaction).not.toHaveBeenCalled();

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
    await expect(createPeerReview({ ...peerReview(), commitmentScore: 6 }))
      .rejects.toThrow("Commitment score must be between 1 and 5");
    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
  });

  it("rejects a missing project", async () => {
    mocks.projectFindUnique.mockResolvedValue(null);

    await expect(createPeerReview(peerReview())).rejects.toThrow("Project not found");
  });

  it("rejects reviewers who are not project participants", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "owner-id",
      projectMembers: [{ userId: "another-user-id" }],
    });

    await expect(createPeerReview(peerReview()))
      .rejects.toThrow("You are not authorized to submit a review for this project");
  });

  it("rejects reviewees who are not project participants", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "owner-id",
      projectMembers: [{ userId: "test-user-id" }],
    });

    await expect(createPeerReview(peerReview()))
      .rejects.toThrow("The reviewee is not a participant in this project");
  });

  it("rejects self-reviews", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "test-user-id",
      projectMembers: [],
    });

    await expect(createPeerReview({ ...peerReview(), revieweeId: "test-user-id" }))
      .rejects.toThrow("You cannot review yourself");
  });

  it("rejects duplicate reviews before creating a new review", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "owner-id",
      projectMembers: [{ userId: "test-user-id" }, { userId: "reviewee-id" }],
    });
    mocks.peerReviewFindUnique.mockResolvedValue({ id: "existing-review" });

    await expect(createPeerReview(peerReview()))
      .rejects.toThrow("You have already reviewed this participant for this project");

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
      projectMembers: [{ userId: "member-1" }, { userId: "member-2" }],
    });

    await expect(completeProject("project-id")).resolves.toBeUndefined();

    expect(mocks.projectFindUnique).toHaveBeenCalledWith({
      where: { id: "project-id" },
      include: { projectMembers: true },
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
    await expect(completeProject("")).rejects.toThrow("ID is required");
    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
  });

  it("rejects when the project does not exist", async () => {
    mocks.projectFindUnique.mockResolvedValue(null);

    await expect(completeProject("project-id")).rejects.toThrow("Project not found");
    expect(mocks.projectUpdate).not.toHaveBeenCalled();
  });

  it("rejects when called by a non-owner", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      id: "project-id",
      ownerId: "other-user-id",
      status: "IN_PROGRESS",
      projectMembers: [],
    });

    await expect(completeProject("project-id"))
      .rejects.toThrow("You are not authorized to complete this project");
    expect(mocks.projectUpdate).not.toHaveBeenCalled();
  });

  it("rejects when the project is not in progress", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      id: "project-id",
      ownerId: "test-user-id",
      status: "OPEN_RECRUITMENT",
      projectMembers: [],
    });

    await expect(completeProject("project-id"))
      .rejects.toThrow("Project must be in progress to be marked as completed");
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

    await expect(fetchProjectApplications("project-id")).resolves.toBe(sampleApplications);

    expect(mocks.projectFindUnique).toHaveBeenCalledWith({
      where: { id: "project-id" },
      select: { ownerId: true },
    });
    expect(mocks.applicationFindMany).toHaveBeenCalledWith({
      where: { projectId: "project-id" },
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
    await expect(fetchProjectApplications("")).rejects.toThrow("ID is required");
    expect(mocks.projectFindUnique).not.toHaveBeenCalled();
  });

  it("rejects when the project does not exist", async () => {
    mocks.projectFindUnique.mockResolvedValue(null);

    await expect(fetchProjectApplications("project-id")).rejects.toThrow("Project not found");
    expect(mocks.applicationFindMany).not.toHaveBeenCalled();
  });

  it("rejects when called by a non-owner", async () => {
    mocks.projectFindUnique.mockResolvedValue({
      ownerId: "other-user-id",
    });

    await expect(fetchProjectApplications("project-id"))
      .rejects.toThrow("You are not authorized to view applications for this project");
    expect(mocks.applicationFindMany).not.toHaveBeenCalled();
  });
});
