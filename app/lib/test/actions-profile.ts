import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActionError } from "../errors";
import { ProfileForm } from "../validator/profile";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("../../lib/actionWrapper", () => ({
  default: (
    action: (user: { id: string; email: string }, ...args: unknown[]) => unknown,
    options: { auth?: boolean } = {},
  ) =>
    async (...args: unknown[]) => {
      try {
        const data = options.auth
          ? await action({ id: "test-user-id", email: "test@example.com" }, ...args)
          : await (action as (...values: unknown[]) => unknown)(...args);
        return data === undefined ? { success: true } : { success: true, data };
      } catch (error: unknown) {
        if (error instanceof ActionError) {
          return error.fieldErrors
            ? { success: false, error: error.message, fieldErrors: error.fieldErrors }
            : { success: false, error: error.message };
        }
        return { success: false, error: "Something went wrong. Please try again." };
      }
    },
}));

const mocks = vi.hoisted(() => ({
  userFindUnique: vi.fn(),
  userUpdate: vi.fn(),
  peerReviewFindMany: vi.fn(),
  statusFindFirst: vi.fn(),
  statusCreate: vi.fn(),
  roleFindFirst: vi.fn(),
  roleCreate: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("../prisma", () => ({
  prisma: {
    user: { findUnique: mocks.userFindUnique },
    peerReview: { findMany: mocks.peerReviewFindMany },
    $transaction: mocks.transaction,
  },
}));

import { fetchProfile, fetchReviews, updateProfile } from "../../actions/profile";

const form: ProfileForm = {
  name: "Test User",
  instance: "Test University",
  educationLevel: "HIGHER_EDUCATION",
  bio: "A test profile",
  contactInfo: "instagram.com/test-user",
  skills: ["Illustration", "Public speaking"],
};

const persistedProfile = {
  name: "Test User",
  instance: "Test University",
  bio: "A test profile",
  contactInfo: "instagram.com/test-user",
  status: { id: "status-id", name: "Mahasiswa" },
  userRoles: [
    { role: { id: "role-1", name: "Illustration" } },
    { role: { id: "role-2", name: "Public speaking" } },
  ],
  totalProjectsCompleted: 2,
  avgCommitmentScore: 4.5,
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.userFindUnique.mockResolvedValue(persistedProfile);
  mocks.statusFindFirst.mockResolvedValue({ id: "status-id" });
  mocks.roleFindFirst
    .mockResolvedValueOnce({ id: "role-1" })
    .mockResolvedValueOnce({ id: "role-2" });
  mocks.userUpdate.mockResolvedValue(persistedProfile);
  mocks.transaction.mockImplementation((callback) => callback({
    status: { findFirst: mocks.statusFindFirst, create: mocks.statusCreate },
    role: { findFirst: mocks.roleFindFirst, create: mocks.roleCreate },
    user: { update: mocks.userUpdate },
  }));
});

describe("fetchProfile", () => {
  it("maps the authenticated user's profile to the editable profile view", async () => {
    const result = await fetchProfile();

    expect(result).toEqual({
      success: true,
      data: {
        ...form,
        email: "test@example.com",
        totalProjectsCompleted: 2,
        avgCommitmentScore: 4.5,
      },
    });
    expect(mocks.userFindUnique).toHaveBeenCalledWith({
      where: { id: "test-user-id" },
      include: {
        status: true,
        userRoles: { include: { role: true } },
      },
    });
  });

  it("rejects when the profile does not exist", async () => {
    mocks.userFindUnique.mockResolvedValue(null);

    const result = await fetchProfile();

    expect(result).toEqual({ success: false, error: "Profil tidak ditemukan" });
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
        reviewer: { select: { name: true, instance: true } },
        project: { select: { title: true } },
      },
    });
  });
});

describe("updateProfile", () => {
  it("reuses custom skills and updates the authenticated profile atomically", async () => {
    const result = await updateProfile(form);

    expect(result).toEqual({
      success: true,
      data: {
        ...form,
        email: "test@example.com",
        totalProjectsCompleted: 2,
        avgCommitmentScore: 4.5,
      },
    });
    expect(mocks.statusFindFirst).toHaveBeenCalledWith({
      where: { name: { equals: "Mahasiswa", mode: "insensitive" } },
      select: { id: true },
    });
    expect(mocks.userUpdate).toHaveBeenCalledWith({
      where: { id: "test-user-id" },
      data: {
        name: form.name,
        instance: form.instance,
        bio: form.bio,
        contactInfo: form.contactInfo,
        statusId: "status-id",
        userRoles: {
          deleteMany: {},
          create: [
            { role: { connect: { id: "role-1" } } },
            { role: { connect: { id: "role-2" } } },
          ],
        },
      },
      include: {
        status: true,
        userRoles: { include: { role: true } },
      },
    });
  });
});
