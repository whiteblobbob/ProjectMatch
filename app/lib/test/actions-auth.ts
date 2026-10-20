import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  createClient: vi.fn(),
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  userCreate: vi.fn(),
}));

vi.mock("next/headers", () => ({ cookies: mocks.cookies }));
vi.mock("../../utils/supabase/server", () => ({
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
  mocks.cookies.mockResolvedValue({});
  mocks.createClient.mockReturnValue({
    auth: {
      signUp: mocks.signUp,
      signInWithPassword: mocks.signInWithPassword,
    },
  });
  mocks.signUp.mockResolvedValue({ data: { user: { id: "user-id" } }, error: null });
  mocks.signInWithPassword.mockResolvedValue({ error: null });
});

describe("signup", () => {
  it("creates a Supabase account and local user", async () => {
    await expect(signup({ email: "user@example.com", password: "password123" })).resolves.toBeUndefined();

    expect(mocks.signUp).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
    expect(mocks.userCreate).toHaveBeenCalledWith({ data: { id: "user-id" } });
  });

  it("rejects invalid form data without calling external services", async () => {
    await expect(signup({ email: "not-an-email", password: "short" })).rejects.toThrow();

    expect(mocks.signUp).not.toHaveBeenCalled();
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });

  it("surfaces a Supabase signup error", async () => {
    mocks.signUp.mockResolvedValue({
      data: { user: null },
      error: { message: "Email already registered" },
    });

    await expect(signup({ email: "user@example.com", password: "password123" }))
      .rejects.toThrow("Email already registered");

    expect(mocks.userCreate).not.toHaveBeenCalled();
  });
});

describe("login", () => {
  it("signs in with valid credentials", async () => {
    await expect(login({ email: "user@example.com", password: "password123" })).resolves.toBeUndefined();

    expect(mocks.signInWithPassword).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
  });

  it("rejects invalid form data without calling Supabase", async () => {
    await expect(login({ email: "not-an-email", password: "short" })).rejects.toThrow();

    expect(mocks.signInWithPassword).not.toHaveBeenCalled();
  });

  it("surfaces a Supabase login error", async () => {
    mocks.signInWithPassword.mockResolvedValue({
      error: { message: "Invalid credentials" },
    });

    await expect(login({ email: "user@example.com", password: "password123" }))
      .rejects.toThrow("Invalid credentials");
  });
});
