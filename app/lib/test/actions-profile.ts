import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileForm } from "../validator/profile";

vi.mock("../../utils/actionWrapper", () => ({
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
        return {
          success: false,
          error: error instanceof Error ? error.message : "An unexpected error occurred",
        };
      }
    },
}));

const mocks = vi.hoisted(() => ({
  userFindUnique: vi.fn(),
  userUpdate: vi.fn(),
  peerReviewFindMany: vi.fn(),
}));

vi.mock("../prisma", () => ({
  prisma: {
    user: {
      findUnique: mocks.userFindUnique,
      update: mocks.userUpdate,
    },
    peerReview: {
      findMany: mocks.peerReviewFindMany,
    },
  },
}));

import { fetchProfile, fetchReviews, updateProfile } from "../../actions/profile";

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
    const result = await fetchProfile();

    expect(result).toEqual({
      success: true,
      data: { id: "test-user-id", name: "Test User" },
    });
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

    const result = await fetchProfile();

    expect(result).toEqual({ success: false, error: "Profile not found" });
  });
});

describe("fetchReviews", () => {
  it("fetches reviews received by the authenticated user with reviewer and project details", async () => {
    const reviews = [{ id: "review-id", feedback: "Great teammate" }];
    mocks.peerReviewFindMany.mockResolvedValue(reviews);

    const result = await fetchReviews();

    expect(result).toEqual({ success: true, data: reviews });
    expect(mocks.peerReviewFindMany).toHaveBeenCalledWith({
      where: { revieweeId: "test-user-id" },
      include: {
        reviewer: {
          select: {
            name: true,
            instance: true,
          },
        },
        project: {
          select: {
            title: true,
          },
        },
      },
    });
  });
});

describe("updateProfile", () => {
  it("updates the authenticated user's profile and roles in prisma", async () => {
    const result = await updateProfile(profile);

    expect(result).toEqual({ success: true });
    expect(mocks.userUpdate).toHaveBeenCalledWith({
      where: { id: "test-user-id" },
      data: {
        name: "Test User",
        instance: "Test University",
        bio: "A test profile",
        contactInfo: undefined,
        statusId: "status-id",
        userRoles: {
          deleteMany: {},
          create: [{ role: { connect: { id: "role-id" } } }],
        },
      },
    });
  });
});
