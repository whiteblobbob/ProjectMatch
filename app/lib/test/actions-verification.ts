import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActionError } from "../errors";

const mocks = vi.hoisted(() => ({
  userUpdate: vi.fn(),
  userFindUnique: vi.fn(),
  verificationDocumentFindFirst: vi.fn(),
  verificationDocumentCreate: vi.fn(),
  resendSend: vi.fn(),
  uploadImage: vi.fn(),
}));

vi.mock("../cloudinary", () => ({
  uploadImage: mocks.uploadImage,
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
      findUnique: mocks.userFindUnique,
    },
    verificationDocument: {
      findFirst: mocks.verificationDocumentFindFirst,
      create: mocks.verificationDocumentCreate,
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

import { sendVerificationEmail, submitVerificationDocument } from "../../actions/verification";

function documentFile() {
  return new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], "card.png", {
    type: "image/png",
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.userUpdate.mockResolvedValue({});
  mocks.userFindUnique.mockResolvedValue({ verified: false });
  mocks.verificationDocumentFindFirst.mockResolvedValue(null);
  mocks.verificationDocumentCreate.mockResolvedValue({ id: "document-id" });
  mocks.resendSend.mockResolvedValue({ data: { id: "email-id" }, error: null });
  mocks.uploadImage.mockResolvedValue("projectmatch/verification-documents/test-user-id/card");
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

describe("submitVerificationDocument", () => {
  it("uploads the document and stores a pending submission without verifying the account", async () => {
    const file = documentFile();

    const result = await submitVerificationDocument({ documentType: "student-card", document: file });

    expect(result).toEqual({
      success: true,
      data: { documentCloudId: "projectmatch/verification-documents/test-user-id/card" },
    });
    expect(mocks.uploadImage).toHaveBeenCalledWith(file, {
      userId: "test-user-id",
      kind: "verification-document",
    });
    expect(mocks.verificationDocumentCreate).toHaveBeenCalledWith({
      data: {
        userId: "test-user-id",
        documentCloudId: "projectmatch/verification-documents/test-user-id/card",
        documentType: "student-card",
      },
    });
    expect(mocks.userUpdate).not.toHaveBeenCalled();
  });

  it("rejects an account that is already verified", async () => {
    mocks.userFindUnique.mockResolvedValue({ verified: true });

    const result = await submitVerificationDocument({ documentType: "student-card", document: documentFile() });

    expect(result).toEqual({ success: false, error: "Akun sudah terverifikasi." });
    expect(mocks.uploadImage).not.toHaveBeenCalled();
    expect(mocks.verificationDocumentCreate).not.toHaveBeenCalled();
  });

  it("rejects a second document while the first submission is pending", async () => {
    mocks.verificationDocumentFindFirst.mockResolvedValue({ id: "pending-document-id" });

    const result = await submitVerificationDocument({ documentType: "student-card", document: documentFile() });

    expect(result).toEqual({ success: false, error: "Dokumen verifikasi sedang ditinjau admin." });
    expect(mocks.uploadImage).not.toHaveBeenCalled();
    expect(mocks.verificationDocumentCreate).not.toHaveBeenCalled();
  });

  it("rejects a payload without a file", async () => {
    const result = await submitVerificationDocument({
      documentType: "student-card",
      document: null as unknown as File,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.document).toBeDefined();
    }
    expect(mocks.uploadImage).not.toHaveBeenCalled();
    expect(mocks.verificationDocumentCreate).not.toHaveBeenCalled();
  });

  it("surfaces an invalid document without creating a submission", async () => {
    mocks.uploadImage.mockRejectedValue(
      new ActionError("Format dokumen harus JPG atau PNG.", {
        document: ["Format dokumen harus JPG atau PNG."],
      }),
    );

    const result = await submitVerificationDocument({ documentType: "student-card", document: documentFile() });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.document).toEqual(["Format dokumen harus JPG atau PNG."]);
    }
    expect(mocks.verificationDocumentCreate).not.toHaveBeenCalled();
  });
});
