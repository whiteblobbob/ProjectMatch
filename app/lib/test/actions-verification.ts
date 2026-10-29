import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActionError } from "../errors";

const mocks = vi.hoisted(() => ({
  userUpdate: vi.fn(),
  resendSend: vi.fn(),
}));

// Inject a fixed authenticated user, mirroring app/lib/test/actions-project.ts.
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
        return { success: false, error: "Something went wrong. Please try again." };
      }
    },
}));

vi.mock("../prisma", () => {
  const prisma = {
    user: {
      update: mocks.userUpdate,
    },
  };
  return { default: prisma, prisma };
});

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.resendSend };
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({ get: () => "localhost:3000" })),
}));

import { sendVerificationEmail } from "../../actions/verification";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.userUpdate.mockResolvedValue({});
  mocks.resendSend.mockResolvedValue({ data: { id: "email-id" }, error: null });
  process.env.RESEND_API_KEY = "test-key";
});

describe("sendVerificationEmail", () => {
  it("rejects non-academic email domains without sending", async () => {
    const result = await sendVerificationEmail({ email: "user@gmail.com" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.email).toBeDefined();
    }
    expect(mocks.userUpdate).not.toHaveBeenCalled();
    expect(mocks.resendSend).not.toHaveBeenCalled();
  });

  it.each(["student@kampus.ac.id", "person@university.edu"])(
    "sends a verification link to %s and stores a single-use token",
    async (email) => {
      const result = await sendVerificationEmail({ email });

      expect(result).toEqual({ success: true, data: { email } });
      expect(mocks.userUpdate).toHaveBeenCalledWith({
        where: { id: "test-user-id" },
        data: {
          verificationToken: expect.any(String),
          verificationTokenExpiresAt: expect.any(Date),
        },
      });
      expect(mocks.resendSend).toHaveBeenCalledWith(
        expect.objectContaining({ to: email, subject: expect.any(String), html: expect.any(String) }),
      );
    },
  );

  it("surfaces a Resend failure with a generic message", async () => {
    mocks.resendSend.mockResolvedValue({ data: null, error: { message: "domain not verified" } });

    const result = await sendVerificationEmail({ email: "student@kampus.ac.id" });

    expect(result).toEqual({
      success: false,
      error: "Gagal mengirim email verifikasi. Coba lagi nanti.",
    });
  });

  it("fails when Resend is not configured", async () => {
    delete process.env.RESEND_API_KEY;

    const result = await sendVerificationEmail({ email: "student@kampus.ac.id" });

    expect(result).toEqual({ success: false, error: "Verifikasi email belum dikonfigurasi." });
    expect(mocks.userUpdate).not.toHaveBeenCalled();
    expect(mocks.resendSend).not.toHaveBeenCalled();
  });
});
