import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  createClient: vi.fn(),
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  userCreate: vi.fn(),
  cookieSet: vi.fn(),
}));

vi.mock("next/headers", () => ({ cookies: mocks.cookies }));
vi.mock("../../lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));
vi.mock("../prisma", () => ({
  prisma: {
    user: {
      create: mocks.userCreate,
    },
  },
}));

import { login, signup } from "../../actions/auth";

beforeEach(() => {
  vi.clearAllMocks();
  delete process.env.ENABLE_DEMO_ACCOUNT;
  delete process.env.DEMO_ACCOUNT_EMAIL;
  delete process.env.DEMO_ACCOUNT_PASSWORD;
  mocks.cookies.mockResolvedValue({ set: mocks.cookieSet });
  mocks.createClient.mockReturnValue({
    auth: {
      signUp: mocks.signUp,
      signInWithPassword: mocks.signInWithPassword,
    },
  });
  mocks.signUp.mockResolvedValue({ data: { user: { id: "user-id" } }, error: null });
  mocks.signInWithPassword.mockResolvedValue({ error: null });
  mocks.userCreate.mockResolvedValue({});
});

describe("signup", () => {
  it("creates a Supabase account and local user", async () => {
    const result = await signup({ email: "user@example.com", password: "password123" });

    expect(result).toEqual({ success: true });
    expect(mocks.signUp).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
    expect(mocks.userCreate).toHaveBeenCalledWith({ data: { id: "user-id" } });
  });

  it("rejects invalid form data without calling external services", async () => {
    const result = await signup({ email: "not-an-email", password: "short" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Please check your input");
      expect(result.fieldErrors?.password).toEqual(["Password must be at least 8 characters long"]);
      expect(result.fieldErrors?.email).toBeDefined();
    }
    expect(mocks.signUp).not.toHaveBeenCalled();
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });

  it("hides unexpected server errors behind a generic message", async () => {
    mocks.signUp.mockRejectedValue(new Error("Internal Prisma internals leaked"));

    const result = await signup({ email: "user@example.com", password: "password123" });

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

    const result = await signup({ email: "user@example.com", password: "password123" });

    expect(result).toEqual({ success: false, error: "Email already registered" });
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });
});

describe("login", () => {
  it("creates a local demo session without calling Supabase", async () => {
    process.env.ENABLE_DEMO_ACCOUNT = "true";
    process.env.DEMO_ACCOUNT_EMAIL = "demo@projectmatch.test";
    process.env.DEMO_ACCOUNT_PASSWORD = "DemoProject123!";

    const result = await login({
      email: "demo@projectmatch.test",
      password: "DemoProject123!",
    });

    expect(result).toEqual({ success: true });
    expect(mocks.cookieSet).toHaveBeenCalledWith(
      "projectmatch-demo-session",
      "active",
      expect.objectContaining({ httpOnly: true, sameSite: "lax", path: "/" }),
    );
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

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
