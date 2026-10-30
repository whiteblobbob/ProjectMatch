import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  getUser: vi.fn(),
  updateUser: vi.fn(),
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

import { forgotPassword, login, resetPassword, signup } from "../../actions/auth";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.createClient.mockReturnValue({
    auth: {
      signUp: mocks.signUp,
      signInWithPassword: mocks.signInWithPassword,
      resetPasswordForEmail: mocks.resetPasswordForEmail,
      getUser: mocks.getUser,
      updateUser: mocks.updateUser,
    },
  });
  mocks.signUp.mockResolvedValue({ data: { user: { id: "user-id" } }, error: null });
  mocks.signInWithPassword.mockResolvedValue({ error: null });
  mocks.resetPasswordForEmail.mockResolvedValue({ error: null });
  mocks.getUser.mockResolvedValue({ data: { user: { id: "user-id" } }, error: null });
  mocks.updateUser.mockResolvedValue({ error: null });
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

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("forgotPassword", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://projectmatch.example/base/");
  });

  it("sends a recovery email to the fixed callback and returns no account details", async () => {
    expect(await forgotPassword({ email: "user@example.com" })).toEqual({ success: true });
    expect(mocks.resetPasswordForEmail).toHaveBeenCalledWith("user@example.com", {
      redirectTo: "https://projectmatch.example/api/reset-password",
    });
  });

  it("rejects invalid email before calling Supabase", async () => {
    const result = await forgotPassword({ email: "invalid" });
    expect(result).toMatchObject({ success: false, fieldErrors: { email: expect.any(Array) } });
    expect(mocks.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it("requires a configured site URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(await forgotPassword({ email: "user@example.com" })).toMatchObject({ success: false });
    expect(mocks.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it("does not expose provider diagnostics when sending fails", async () => {
    mocks.resetPasswordForEmail.mockResolvedValue({ error: { message: "Private provider details" } });
    expect(await forgotPassword({ email: "user@example.com" })).toEqual({
      success: false,
      error: "Gagal mengirim tautan pemulihan. Silakan coba lagi nanti.",
    });
  });
});

describe("resetPassword", () => {
  const form = { password: "new-password123", confirmPassword: "new-password123" };

  it("updates the authenticated user's password without signing out", async () => {
    expect(await resetPassword(form)).toEqual({ success: true });
    expect(mocks.getUser).toHaveBeenCalled();
    expect(mocks.updateUser).toHaveBeenCalledWith({ password: form.password });
  });

  it.each([
    { data: { user: null }, error: null },
    { data: { user: { id: "user-id" } }, error: { message: "Session expired" } },
  ])("rejects missing or invalid sessions before updating", async (authResponse) => {
    mocks.getUser.mockResolvedValue(authResponse);
    expect(await resetPassword(form)).toEqual({ success: false, error: "User is not authenticated" });
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it.each([
    { password: "short", confirmPassword: "short", field: "password" },
    { password: "new-password123", confirmPassword: "different", field: "confirmPassword" },
  ])("rejects invalid $field before updating", async ({ password, confirmPassword, field }) => {
    expect(await resetPassword({ password, confirmPassword })).toMatchObject({
      success: false,
      fieldErrors: { [field]: expect.any(Array) },
    });
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("surfaces an expected password update error", async () => {
    mocks.updateUser.mockResolvedValue({ error: { message: "New password must be different" } });
    expect(await resetPassword(form)).toEqual({ success: false, error: "New password must be different" });
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
