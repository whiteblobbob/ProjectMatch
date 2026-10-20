import { beforeEach, expect, it, vi } from "vitest";
import { ProfileForm } from "../validator/profile";

vi.mock("../../utils/authWrapper", () => ({
  default: (
    handler: (user: { id: string }, form: Partial<ProfileForm>) => unknown,
  ) => (form: Partial<ProfileForm>) => handler({ id: "test-user-id" }, form),
}));

vi.mock("../prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
  },
}));

import { updateProfile } from "../../actions/profile";
import { prisma } from "../prisma";

beforeEach(() => {
  vi.clearAllMocks();
});

it("updates the authenticated user's profile", async () => {
  const profile: Partial<ProfileForm> = {
    name: "Test User",
    instance: "Test University",
    bio: "A test profile",
    statusId: "status-id",
    userRoles: [{ roleId: "role-id" }],
  };

  await expect(updateProfile(profile)).resolves.toBeUndefined();

  expect(prisma.user.update).toHaveBeenCalledWith({
    where: { id: "test-user-id" },
    data: {
      name: "Test User",
      instance: "Test University",
      bio: "A test profile",
      statusId: "status-id",
      userRoles: {
        deleteMany: {},
        create: [{ role: { connect: { id: "role-id" } } }],
      },
    },
  });
});
