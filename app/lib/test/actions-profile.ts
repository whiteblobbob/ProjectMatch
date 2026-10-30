import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActionError } from "../errors";
import { ProfileForm } from "../validator/profile";

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
  userFindUnique: vi.fn(),
  userUpdate: vi.fn(),
  peerReviewFindMany: vi.fn(),
  schoolInstitutionFindUnique: vi.fn(),
  universityInstitutionFindUnique: vi.fn(),
  uploadImage: vi.fn(),
  destroyImage: vi.fn(),
}));

vi.mock("../cloudinary", () => ({
  uploadImage: mocks.uploadImage,
  destroyImage: mocks.destroyImage,
}));

vi.mock("../prisma", () => {
  const prisma = {
    user: {
      findUnique: mocks.userFindUnique,
      update: mocks.userUpdate,
    },
    peerReview: {
      findMany: mocks.peerReviewFindMany,
    },
    schoolInstitution: {
      findUnique: mocks.schoolInstitutionFindUnique,
    },
    universityInstitution: {
      findUnique: mocks.universityInstitutionFindUnique,
    },
  };
  return { default: prisma, prisma };
});

import { fetchProfile, fetchReviews, updateProfile } from "../../actions/profile";

const profile: Partial<ProfileForm> = {
  name: "Test User",
  institution: "93145",
  bio: "A test profile",
  educationLevel: "MAHASISWA",
  roles: ["Custom Developer"],
};

function avatarFile() {
  return new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], "avatar.png", {
    type: "image/png",
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.userFindUnique.mockResolvedValue({ id: "test-user-id", name: "Test User" });
  mocks.userUpdate.mockResolvedValue({});
  mocks.schoolInstitutionFindUnique.mockResolvedValue({
    npsn: "20100158",
    name: "SMKN 14 JAKARTA",
  });
  mocks.universityInstitutionFindUnique.mockResolvedValue({
    npsn: "93145",
    name: "Sekolah Tinggi Ilmu Kesehatan Mega Rezky",
  });
  mocks.uploadImage.mockResolvedValue("projectmatch/avatars/test-user-id/avatar");
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
        contactInfos: true,
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
            institutionName: true,
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
  it("saves custom roles directly without a catalog relation", async () => {
    expect(await updateProfile({ roles: ["  Robotics Mentor  "] })).toEqual({ success: true });
    expect(mocks.userUpdate).toHaveBeenCalledWith({
      where: { id: "test-user-id" },
      data: expect.objectContaining({ roles: ["Robotics Mentor"] }),
    });
    expect(mocks.userUpdate.mock.calls[0][0].data).not.toHaveProperty("userRoles");
  });

  it("keeps existing roles when a partial update omits them", async () => {
    expect(await updateProfile({ bio: "Updated bio" })).toEqual({ success: true });
    expect(mocks.userUpdate.mock.calls[0][0].data.roles).toBeUndefined();
  });

  it("updates the authenticated user's profile and roles in prisma", async () => {
    const result = await updateProfile(profile);

    expect(result).toEqual({ success: true });
    expect(mocks.userUpdate).toHaveBeenCalledWith({
      where: { id: "test-user-id" },
      data: {
        name: "Test User",
        institution: "93145",
        institutionName: "Sekolah Tinggi Ilmu Kesehatan Mega Rezky",
        bio: "A test profile",
        province: undefined,
        city: undefined,
        portfolioLink: undefined,
        educationLevel: "MAHASISWA",
        roles: ["Custom Developer"],
        contactInfos: undefined,
      },
    });
  });

  it("writes a valid province and city pair", async () => {
    const result = await updateProfile({ ...profile, province: "Bali", city: "Kota Denpasar" });

    expect(result).toEqual({ success: true });
    expect(mocks.userUpdate).toHaveBeenCalledWith({
      where: { id: "test-user-id" },
      data: expect.objectContaining({
        province: "Bali",
        city: "Kota Denpasar",
      }),
    });
  });

  it("rejects a city that does not belong to the selected province", async () => {
    const result = await updateProfile({ ...profile, province: "Bali", city: "Kota Bandung" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Please check your input");
      expect(result.fieldErrors?.city).toEqual(["City does not belong to the selected province"]);
    }
    expect(mocks.userUpdate).not.toHaveBeenCalled();
  });

  it("rejects an institution that is not in the database", async () => {
    mocks.universityInstitutionFindUnique.mockResolvedValue(null);

    const result = await updateProfile({ ...profile, institution: "00000000" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Please check your input");
      expect(result.fieldErrors?.institution).toEqual(["Pilih institusi dari daftar"]);
    }
    expect(mocks.userUpdate).not.toHaveBeenCalled();
  });

  it("uploads an avatar and stores its Cloudinary id", async () => {
    const file = avatarFile();

    const result = await updateProfile(profile, { avatar: file });

    expect(result).toEqual({
      success: true,
      data: { profileCloudId: "projectmatch/avatars/test-user-id/avatar" },
    });
    expect(mocks.uploadImage).toHaveBeenCalledWith(file, { userId: "test-user-id", kind: "avatar" });
    expect(mocks.userUpdate).toHaveBeenCalledWith({
      where: { id: "test-user-id" },
      data: expect.objectContaining({ profileCloudId: "projectmatch/avatars/test-user-id/avatar" }),
    });
    expect(mocks.destroyImage).not.toHaveBeenCalled();
  });

  it("removes the avatar and destroys the previous asset", async () => {
    mocks.userFindUnique.mockResolvedValue({
      id: "test-user-id",
      profileCloudId: "projectmatch/avatars/test-user-id/old",
    });

    const result = await updateProfile(profile, { removeAvatar: true });

    expect(result).toEqual({ success: true, data: { profileCloudId: null } });
    expect(mocks.userUpdate).toHaveBeenCalledWith({
      where: { id: "test-user-id" },
      data: expect.objectContaining({ profileCloudId: null }),
    });
    expect(mocks.destroyImage).toHaveBeenCalledWith("projectmatch/avatars/test-user-id/old");
  });

  it("destroys the previous asset when the avatar is replaced", async () => {
    mocks.userFindUnique.mockResolvedValue({
      id: "test-user-id",
      profileCloudId: "projectmatch/avatars/test-user-id/old",
    });

    await updateProfile(profile, { avatar: avatarFile() });

    expect(mocks.destroyImage).toHaveBeenCalledWith("projectmatch/avatars/test-user-id/old");
  });

  it("leaves the avatar untouched when no media is provided", async () => {
    await updateProfile(profile);

    expect(mocks.userFindUnique).not.toHaveBeenCalled();
    expect(mocks.uploadImage).not.toHaveBeenCalled();
    expect(mocks.userUpdate.mock.calls[0][0].data).not.toHaveProperty("profileCloudId");
  });

  it("surfaces an invalid avatar without updating the profile", async () => {
    mocks.uploadImage.mockRejectedValue(new ActionError("Format foto harus JPG atau PNG."));

    const result = await updateProfile(profile, { avatar: avatarFile() });

    expect(result).toEqual({ success: false, error: "Format foto harus JPG atau PNG." });
    expect(mocks.userUpdate).not.toHaveBeenCalled();
  });
});
