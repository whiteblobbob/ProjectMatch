import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  userCreate: vi.fn(),
  schoolInstitutionFindUnique: vi.fn(),
  universityInstitutionFindUnique: vi.fn(),
}));

vi.mock("../../lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));
vi.mock("../prisma", () => {
  const prisma = {
    user: {
      create: mocks.userCreate,
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

import { login, signup } from "../../actions/auth";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.createClient.mockReturnValue({
    auth: {
      signUp: mocks.signUp,
      signInWithPassword: mocks.signInWithPassword,
    },
  });
  mocks.signUp.mockResolvedValue({ data: { user: { id: "user-id" } }, error: null });
  mocks.signInWithPassword.mockResolvedValue({ error: null });
  mocks.userCreate.mockResolvedValue({});
  mocks.schoolInstitutionFindUnique.mockResolvedValue({
    npsn: "20100158",
    name: "SMKN 14 JAKARTA",
  });
  mocks.universityInstitutionFindUnique.mockResolvedValue({
    npsn: "93145",
    name: "Sekolah Tinggi Ilmu Kesehatan Mega Rezky",
  });
});

describe("signup", () => {
  it("creates a Supabase account and local user", async () => {
    const result = await signup({ name: "Jane Doe", email: "user@example.com", password: "password123", educationLevel: "MAHASISWA", institution: "93145", province: "Jawa Barat", city: "Kota Bandung" });

    expect(result).toEqual({ success: true });
    expect(mocks.signUp).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
    expect(mocks.userCreate).toHaveBeenCalledWith({
      data: {
        id: "user-id",
        name: "Jane Doe",
        institution: "93145",
        institutionName: "Sekolah Tinggi Ilmu Kesehatan Mega Rezky",
        educationLevel: "MAHASISWA",
        province: "Jawa Barat",
        city: "Kota Bandung",
        studyProgram: null,
        schoolGrade: null,
        entryYear: null,
        graduationYear: null,
        dateOfBirth: null,
      },
    });
  });

  it("rejects invalid form data without calling external services", async () => {
    const result = await signup({ name: "", email: "not-an-email", password: "short", educationLevel: "MAHASISWA", institution: "93145", province: "Jawa Barat", city: "Kota Bandung" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Please check your input");
      expect(result.fieldErrors?.password).toEqual(["Password must be at least 8 characters long"]);
      expect(result.fieldErrors?.email).toBeDefined();
      expect(result.fieldErrors?.name).toBeDefined();
    }
    expect(mocks.signUp).not.toHaveBeenCalled();
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });

  it("hides unexpected server errors behind a generic message", async () => {
    mocks.signUp.mockRejectedValue(new Error("Internal Prisma internals leaked"));

    const result = await signup({ name: "Jane Doe", email: "user@example.com", password: "password123", educationLevel: "MAHASISWA", institution: "93145", province: "Jawa Barat", city: "Kota Bandung" });

    expect(result).toEqual({
      success: false,
      error: "Something went wrong. Please try again.",
    });
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });

  it("surfaces a Supabase signup error", async () => {
    mocks.signUp.mockResolvedValue({
      data: { user: null },
      error: { message: "Email already registered" },
    });

    const result = await signup({ name: "Jane Doe", email: "user@example.com", password: "password123", educationLevel: "MAHASISWA", institution: "93145", province: "Jawa Barat", city: "Kota Bandung" });

    expect(result).toEqual({ success: false, error: "Email already registered" });
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });

  it("rejects an unknown province before calling external services", async () => {
    const result = await signup({ name: "Jane Doe", email: "user@example.com", password: "password123", educationLevel: "MAHASISWA", institution: "93145", province: "Atlantis", city: "Kota Bandung" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Please check your input");
      expect(result.fieldErrors?.province).toEqual(["Unknown province"]);
    }
    expect(mocks.signUp).not.toHaveBeenCalled();
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });

  it("rejects a city that does not belong to the selected province", async () => {
    const result = await signup({ name: "Jane Doe", email: "user@example.com", password: "password123", educationLevel: "MAHASISWA", institution: "93145", province: "Bali", city: "Kota Bandung" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Please check your input");
      expect(result.fieldErrors?.city).toEqual(["City does not belong to the selected province"]);
    }
    expect(mocks.signUp).not.toHaveBeenCalled();
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });

  it("rejects an institution that is not in the database", async () => {
    mocks.universityInstitutionFindUnique.mockResolvedValue(null);

    const result = await signup({ name: "Jane Doe", email: "user@example.com", password: "password123", educationLevel: "MAHASISWA", institution: "00000000", province: "Jawa Barat", city: "Kota Bandung" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Please check your input");
      expect(result.fieldErrors?.institution).toEqual(["Pilih institusi dari daftar"]);
    }
    expect(mocks.signUp).not.toHaveBeenCalled();
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });
});

describe("login", () => {
  it("signs in with valid credentials", async () => {
    const result = await login({ email: "user@example.com", password: "password123" });

    expect(result).toEqual({ success: true });
    expect(mocks.signInWithPassword).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
  });

  it("rejects invalid form data without calling Supabase", async () => {
    const result = await login({ email: "not-an-email", password: "short" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Please check your input");
      expect(result.fieldErrors?.password).toEqual(["Password must be at least 8 characters long"]);
      expect(result.fieldErrors?.email).toBeDefined();
    }
    expect(mocks.signInWithPassword).not.toHaveBeenCalled();
  });

  it("surfaces a Supabase login error", async () => {
    mocks.signInWithPassword.mockResolvedValue({
      error: { message: "Invalid credentials" },
    });

    const result = await login({ email: "user@example.com", password: "password123" });

    expect(result).toEqual({ success: false, error: "Invalid credentials" });
  });
});
