import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileForm } from "../validator/profile";

vi.mock("../../utils/authWrapper", () => ({
  default: (handler: (user: { id: string }, ...args: unknown[]) => unknown) =>
    (...args: unknown[]) => handler({ id: "test-user-id" }, ...args),
}));

const mocks = vi.hoisted(() => ({
  userFindUnique: vi.fn(),
  userUpdate: vi.fn(),
}));

vi.mock("../prisma", () => ({
  prisma: {
    user: {
      findUnique: mocks.userFindUnique,
      update: mocks.userUpdate,
    },
  },
}));

import { fetchProfile, updateProfile } from "../../actions/profile";

const profile: Partial<ProfileForm> = {
  name: "Test User",
  instance: "Test University",
  bio: "A test profile",
  statusId: "status-id",
  userRoles: [{ roleId: "role-id" }],
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.userFindUnique.mockResolvedValue({ id: "test-user-id", name: "Test User" });
  mocks.userUpdate.mockResolvedValue({});
});

describe("fetchProfile", () => {
  it("fetches the authenticated user's profile and relations", async () => {
    await expect(fetchProfile()).resolves.toEqual({ id: "test-user-id", name: "Test User" });

    expect(mocks.userFindUnique).toHaveBeenCalledWith({
      where: { id: "test-user-id" },
      include: {
        status: true,
        userRoles: {
          include: { role: true },
        },
      },
    });
  });

  it("rejects when the profile does not exist", async () => {
    mocks.userFindUnique.mockResolvedValue(null);

    await expect(fetchProfile()).rejects.toThrow("Profile not found");
  });
});

describe("updateProfile", () => {
  it("updates the authenticated user's profile and roles", async () => {
    await expect(updateProfile(profile)).resolves.toBeUndefined();

    expect(mocks.userUpdate).toHaveBeenCalledWith({
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

  it("accepts a partial update without roles", async () => {
    await expect(updateProfile({ bio: "Updated bio" })).resolves.toBeUndefined();

    expect(mocks.userUpdate).toHaveBeenCalledWith({
      where: { id: "test-user-id" },
      data: {
        name: undefined,
        instance: undefined,
        bio: "Updated bio",
        statusId: undefined,
        userRoles: {
          deleteMany: {},
          create: undefined,
        },
      },
    });
  });

  it("rejects invalid profile data", async () => {
    await expect(updateProfile({ name: "" })).rejects.toThrow("Name is required");

    expect(mocks.userUpdate).not.toHaveBeenCalled();
  });
});
