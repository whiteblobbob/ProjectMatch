import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "@supabase/supabase-js";
import { Prisma } from "@/generated/prisma/client";

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  findUniqueOrThrow: vi.fn(),
  create: vi.fn(),
  findInstitution: vi.fn(),
}));

vi.mock("../prisma", () => ({
  default: { user: { findUnique: mocks.findUnique, findUniqueOrThrow: mocks.findUniqueOrThrow, create: mocks.create } },
}));
vi.mock("../institution", async (importOriginal) => ({
  ...await importOriginal<typeof import("../institution")>(),
  findInstitution: mocks.findInstitution,
}));

import { ensureAppUser } from "../supabase/ensureAppUser";

const registrationProfile = {
  name: "Jane Doe",
  educationLevel: "MAHASISWA",
  institution: "93145",
  province: "Jawa Barat",
  city: "Kota Bandung",
  studyProgram: "Computer Science",
  schoolGrade: "",
  entryYear: 2020,
  graduationYear: 2024,
  dateOfBirth: "2000-02-29",
};

function authUser(profile: unknown = registrationProfile): User {
  return {
    id: "authenticated-id",
    email: "user@example.com",
    app_metadata: {},
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00Z",
    user_metadata: { registrationProfile: profile },
  };
}

function conflict(target: string[]) {
  return new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
    code: "P2002", clientVersion: "7.10.0", meta: { target },
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.findUnique.mockResolvedValue(null);
  mocks.findInstitution.mockResolvedValue({ npsn: "93145", name: "Canonical institution" });
  mocks.create.mockImplementation(async ({ data }) => ({ ...data, role: "USER", verified: false }));
});

describe("ensureAppUser", () => {
  it("restores validated profile fields using the authenticated identity and canonical institution", async () => {
    const result = await ensureAppUser(authUser());
    expect(result).toMatchObject({
      id: "authenticated-id",
      ...registrationProfile,
      institutionName: "Canonical institution",
      schoolGrade: null,
      dateOfBirth: new Date("2000-02-29"),
      role: "USER",
      verified: false,
    });
    expect(mocks.findInstitution).toHaveBeenCalledWith("93145", "university");
  });

  it("returns an existing profile without validating stale metadata or writing", async () => {
    const existing = { id: "authenticated-id", name: "Edited name", role: "ADMIN", verified: true };
    mocks.findUnique.mockResolvedValue(existing);
    expect(await ensureAppUser(authUser())).toBe(existing);
    expect(await ensureAppUser(authUser({ name: "Different name" }))).toBe(existing);
    expect(mocks.findInstitution).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("never copies identity, privileges, verification or statistics from metadata", async () => {
    await ensureAppUser({
      ...authUser(),
      user_metadata: {
        registrationProfile: {
          ...registrationProfile,
          id: "someone-else",
          role: "ADMIN",
          verified: true,
          verificationToken: "attacker-token",
          totalProjectsCompleted: 100,
          avgCommitmentScore: 5,
          institutionName: "Unverified institution name",
        },
        role: "ADMIN",
        verified: true,
      },
    });
    const data = mocks.create.mock.calls[0][0].data;
    expect(data.id).toBe("authenticated-id");
    expect(data.institutionName).toBe("Canonical institution");
    for (const key of ["role", "verified", "verificationToken", "totalProjectsCompleted", "avgCommitmentScore"]) {
      expect(data).not.toHaveProperty(key);
    }
  });

  it.each([undefined, null, [], "invalid", { name: {} }])("recovers a basic profile from unusable metadata: %j", async (profile) => {
    await ensureAppUser({ ...authUser(), user_metadata: { registrationProfile: profile } });
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({
      id: "authenticated-id", name: "user@example.com", institution: null, dateOfBirth: null,
    }) });
  });

  it("uses a valid legacy name, then a generic name if email and metadata are unavailable", async () => {
    await ensureAppUser({ ...authUser(null), user_metadata: { name: "Legacy name" } });
    expect(mocks.create.mock.calls[0][0].data.name).toBe("Legacy name");
    await ensureAppUser({ ...authUser(null), email: undefined });
    expect(mocks.create.mock.calls[1][0].data.name).toBe("Pengguna");
  });

  it("drops malformed optional fields without discarding valid details", async () => {
    await ensureAppUser(authUser({ ...registrationProfile, dateOfBirth: "2025-02-30", entryYear: "2020", studyProgram: {} }));
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({
      name: "Jane Doe", institution: "93145", province: "Jawa Barat",
      dateOfBirth: null, entryYear: null, studyProgram: null, graduationYear: 2024,
    }) });
  });

  it.each([
    { province: "Atlantis", city: "Kota Bandung" },
    { province: "Bali", city: "Kota Bandung" },
    { province: "Jawa Barat", city: undefined },
  ])("discards invalid region pairs: %j", async (region) => {
    await ensureAppUser(authUser({ ...registrationProfile, ...region }));
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ province: null, city: null }) });
  });

  it("leaves institution unset when it is no longer in the catalog", async () => {
    mocks.findInstitution.mockResolvedValue(null);
    await ensureAppUser(authUser());
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ institution: null, institutionName: null }) });
  });

  it("does not guess an institution kind when the education level is invalid", async () => {
    await ensureAppUser(authUser({ ...registrationProfile, educationLevel: "invalid" }));
    expect(mocks.findInstitution).not.toHaveBeenCalled();
    expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ educationLevel: null, institution: null }) });
  });

  it("returns the winning record when simultaneous requests race to create the same user", async () => {
    const winner = { id: "authenticated-id", name: "Winning profile" };
    // Both initial reads see no record; one insert wins the primary-key race.
    mocks.create.mockResolvedValueOnce(winner).mockRejectedValueOnce(conflict(["id"]));
    mocks.findUniqueOrThrow.mockResolvedValue(winner);
    const results = await Promise.all([ensureAppUser(authUser()), ensureAppUser(authUser())]);
    expect(results).toEqual([winner, winner]);
    expect(mocks.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: "authenticated-id" } });
  });

  it("does not swallow unrelated unique conflicts", async () => {
    const error = conflict(["verification_token"]);
    mocks.create.mockRejectedValue(error);
    await expect(ensureAppUser(authUser())).rejects.toBe(error);
    expect(mocks.findUniqueOrThrow).not.toHaveBeenCalled();
  });

  it("propagates database failures so an authenticated action cannot continue", async () => {
    const error = new Error("Database unavailable");
    mocks.findUnique.mockRejectedValue(error);
    await expect(ensureAppUser(authUser())).rejects.toBe(error);
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
