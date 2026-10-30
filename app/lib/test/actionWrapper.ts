import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActionError } from "../errors";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getUser: vi.fn(),
  ensureAppUser: vi.fn(),
}));

vi.mock("../supabase/server", () => ({
  createClient: mocks.createClient,
}));
vi.mock("../supabase/ensureAppUser", () => ({
  ensureAppUser: mocks.ensureAppUser,
}));

import actionWrapper from "../actionWrapper";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.ensureAppUser.mockResolvedValue({ id: "user-id" });
  mocks.createClient.mockReturnValue({
    auth: {
      getUser: mocks.getUser,
    },
  });
  mocks.getUser.mockResolvedValue({
    data: { user: { id: "user-id" } },
    error: null,
  });
});

describe("actionWrapper", () => {
  it("passes the authenticated user to authenticated actions", async () => {
    const action = actionWrapper(
      async (user: { id: string }, value: string) => `${user.id}:${value}`,
      { auth: true },
    );

    const result = await action("value");

    expect(result).toEqual({ success: true, data: "user-id:value" });
    expect(mocks.createClient).toHaveBeenCalledOnce();
    expect(mocks.getUser).toHaveBeenCalledOnce();
    expect(mocks.ensureAppUser).toHaveBeenCalledWith({ id: "user-id" });
  });

  it("rejects authenticated actions when Supabase returns no user", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Session expired" },
    });
    const action = actionWrapper(async () => "not reached", { auth: true });

    const result = await action();

    expect(result).toEqual({ success: false, error: "User is not authenticated" });
    expect(mocks.ensureAppUser).not.toHaveBeenCalled();
  });

  it("does not execute application actions if profile recovery fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.ensureAppUser.mockRejectedValue(new Error("database unavailable"));
    const handler = vi.fn();
    const action = actionWrapper(handler, { auth: true });

    expect(await action()).toEqual({ success: false, error: "Something went wrong. Please try again." });
    expect(handler).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("authenticates auth-only actions without recovering a profile", async () => {
    mocks.ensureAppUser.mockRejectedValue(new Error("database unavailable"));
    const action = actionWrapper(async (user) => user.id, { auth: true, ensureProfile: false });

    expect(await action()).toEqual({ success: true, data: "user-id" });
    expect(mocks.getUser).toHaveBeenCalledOnce();
    expect(mocks.ensureAppUser).not.toHaveBeenCalled();
  });

  it("does not initialize Supabase for public actions", async () => {
    const action = actionWrapper(async (value: string) => value, { auth: false });

    const result = await action("public");

    expect(result).toEqual({ success: true, data: "public" });
    expect(mocks.createClient).not.toHaveBeenCalled();
    expect(mocks.ensureAppUser).not.toHaveBeenCalled();
  });

  it("returns expected ActionError messages and field errors", async () => {
    const action = actionWrapper(async () => {
      throw new ActionError("Invalid input", { title: ["Title is required"] });
    });

    const result = await action();

    expect(result).toEqual({
      success: false,
      error: "Invalid input",
      fieldErrors: { title: ["Title is required"] },
    });
  });

  it("hides unexpected errors behind the generic response", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const action = actionWrapper(async () => {
      throw new Error("database details");
    });

    const result = await action();

    expect(result).toEqual({
      success: false,
      error: "Something went wrong. Please try again.",
    });
    expect(errorSpy).toHaveBeenCalledWith("[action error]", expect.any(Error));
    errorSpy.mockRestore();
  });
});
