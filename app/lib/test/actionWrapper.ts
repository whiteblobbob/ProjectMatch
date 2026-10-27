import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActionError } from "../errors";

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  createClient: vi.fn(),
  getUser: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: mocks.cookies,
}));

vi.mock("../supabase/server", () => ({
  createClient: mocks.createClient,
}));

import actionWrapper from "../actionWrapper";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.cookies.mockResolvedValue("cookie-store");
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
    expect(mocks.cookies).toHaveBeenCalledOnce();
    expect(mocks.createClient).toHaveBeenCalledWith("cookie-store");
    expect(mocks.getUser).toHaveBeenCalledOnce();
  });

  it("rejects authenticated actions when Supabase returns no user", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Session expired" },
    });
    const action = actionWrapper(async () => "not reached", { auth: true });

    const result = await action();

    expect(result).toEqual({ success: false, error: "User is not authenticated" });
  });

  it("does not initialize Supabase for public actions", async () => {
    const action = actionWrapper(async (value: string) => value, { auth: false });

    const result = await action("public");

    expect(result).toEqual({ success: true, data: "public" });
    expect(mocks.cookies).not.toHaveBeenCalled();
    expect(mocks.createClient).not.toHaveBeenCalled();
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
