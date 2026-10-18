import { beforeEach, expect, it, vi } from "vitest";
import { ProjectForm } from "../validator/project";

vi.mock("../../utils/authWrapper", () => ({
  default: (handler: (user: { id: string }, form: ProjectForm) => unknown) =>
    (form: ProjectForm) => handler({ id: "test-user-id" }, form),
}));

vi.mock("../prisma", () => ({
  prisma: {
    project: {
      create: vi.fn(),
    },
  },
}));

import { createProject } from "../../actions/project";
import { prisma } from "../prisma";

const project = (): ProjectForm => ({
  title: "Test Project",
  description: "This is a test project",
  deadline: new Date(),
  projectStatusCriteria: [
    {
      statusId: "status-id",
    },
  ],
  projectRoles: [
    {
      roleId: "role-id",
      slotsAvailable: 5,
    },
  ],
});

beforeEach(() => {
  vi.clearAllMocks();
});

it("creates a new project", async () => {
  await expect(createProject(project())).resolves.toBeUndefined();

  expect(prisma.project.create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      ownerId: "test-user-id",
      title: "Test Project",
      description: "This is a test project",
    }),
  });
});

it("rejects an invalid project", async () => {
  await expect(
    createProject({ ...project(), title: "" }),
  ).rejects.toThrow("Title is required");
});