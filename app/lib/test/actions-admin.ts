import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActionError } from "../errors";

vi.mock("../../lib/actionWrapper", () => ({
  default: (
    action: (user: { id: string }, ...args: unknown[]) => unknown,
    options: { auth?: boolean } = {},
  ) =>
    async (...args: unknown[]) => {
      try {
        let data;
        if (options.auth) {
          data = await action({ id: "admin-user-id" }, ...args);
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
  verificationDocumentFindUnique: vi.fn(),
  verificationDocumentDelete: vi.fn(),
  transaction: vi.fn(),
  destroyImage: vi.fn(),
  findMany: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
}));

vi.mock("../prisma", () => {
  const delegate = () => ({
    findMany: mocks.findMany,
    create: mocks.create,
    update: mocks.update,
    delete: mocks.delete,
    count: mocks.count,
  });

  const model = () => ({ ...delegate() });

  const prisma = {
    user: { ...delegate(), findUnique: mocks.userFindUnique },
    category: model(),
    role: model(),
    contactInfo: model(),
    project: model(),
    projectReport: model(),
    projectRole: model(),
    application: model(),
    projectMember: model(),
    peerReview: model(),
    notification: model(),
    verificationDocument: {
      ...delegate(),
      findUnique: mocks.verificationDocumentFindUnique,
      delete: mocks.verificationDocumentDelete,
    },
    $transaction: mocks.transaction,
  };

  return { default: prisma, prisma };
});

vi.mock("../../lib/cloudinary", () => ({
  destroyImage: mocks.destroyImage,
}));

import {
  acceptVerificationDocument,
  createAdminRecord,
  deleteAdminRecord,
  fetchAdminCounts,
  rejectVerificationDocument,
  updateAdminRecord,
} from "../../actions/admin";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.userFindUnique.mockResolvedValue({ role: "ADMIN" });
  mocks.verificationDocumentFindUnique.mockResolvedValue({ userId: "user-1", documentCloudId: "cloudinary/document-1" });
  mocks.verificationDocumentDelete.mockResolvedValue({});
  mocks.transaction.mockImplementation(async (callback: (tx: unknown) => unknown) => callback({
    verificationDocument: { delete: mocks.verificationDocumentDelete },
    notification: { create: mocks.create },
  }));
  mocks.destroyImage.mockResolvedValue(undefined);
  mocks.count.mockResolvedValue(0);
  mocks.findMany.mockResolvedValue([]);
  mocks.create.mockResolvedValue({});
  mocks.update.mockResolvedValue({});
  mocks.delete.mockResolvedValue({});
});

describe("admin access control", () => {
  it("rejects users without the ADMIN role", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "USER" });

    const result = await fetchAdminCounts();

    expect(result).toEqual({ success: false, error: "Anda tidak memiliki akses" });
    expect(mocks.count).not.toHaveBeenCalled();
  });

  it("allows admins to read table counts", async () => {
    mocks.count.mockResolvedValue(5);

    const result = await fetchAdminCounts();

    expect(result.success).toBe(true);
    expect("data" in result && result.data.user).toBe(5);
  });

  it("rejects unknown tables", async () => {
    const result = await createAdminRecord("not_a_table", { name: "x" });

    expect(result).toEqual({ success: false, error: "Tabel tidak ditemukan" });
  });
});

describe("createAdminRecord", () => {
  it("never writes the user role, even when it is supplied", async () => {
    const result = await createAdminRecord("user", {
      id: "supabase-user-id",
      name: "Ada Lovelace",
      role: "ADMIN",
    });

    expect(result).toEqual({ success: true });
    expect(mocks.create).toHaveBeenCalledWith({
      data: { id: "supabase-user-id", name: "Ada Lovelace" },
    });
  });

  it("returns field errors for invalid required fields", async () => {
    const result = await createAdminRecord("category", { name: "" });

    expect(result).toEqual({
      success: false,
      error: "Please check your input",
      fieldErrors: { name: ["Nama wajib diisi"] },
    });
    expect(mocks.create).not.toHaveBeenCalled();
  });
});

describe("updateAdminRecord", () => {
  it("never writes the user role on update", async () => {
    const result = await updateAdminRecord("user", { id: "supabase-user-id" }, {
      name: "Grace Hopper",
      role: "ADMIN",
    });

    expect(result).toEqual({ success: true });
    expect(mocks.update).toHaveBeenCalledWith({
      where: { id: "supabase-user-id" },
      data: { name: "Grace Hopper" },
    });
  });

  it("builds a compound where key and keeps primary keys out of the data", async () => {
    const result = await updateAdminRecord(
      "project_role",
      { projectId: "project-1", roleName: "role-1" },
      { slotsAvailable: "3" },
    );

    expect(result).toEqual({ success: true });
    expect(mocks.update).toHaveBeenCalledWith({
      where: { projectId_roleName: { projectId: "project-1", roleName: "role-1" } },
      data: { slotsAvailable: 3 },
    });
  });
});

describe("acceptVerificationDocument", () => {
  it("marks the owner of the submission as verified", async () => {
    const result = await acceptVerificationDocument("document-1");

    expect(result).toEqual({ success: true, data: { userId: "user-1" } });
    expect(mocks.verificationDocumentFindUnique).toHaveBeenCalledWith({
      where: { id: "document-1" },
      select: { userId: true },
    });
    expect(mocks.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { verified: true },
    });
  });

  it("rejects a missing document without updating a user", async () => {
    mocks.verificationDocumentFindUnique.mockResolvedValue(null);

    const result = await acceptVerificationDocument("document-1");

    expect(result).toEqual({ success: false, error: "Dokumen verifikasi tidak ditemukan" });
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it("rejects non-admin users", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "USER" });

    const result = await acceptVerificationDocument("document-1");

    expect(result).toEqual({ success: false, error: "Anda tidak memiliki akses" });
    expect(mocks.verificationDocumentFindUnique).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
  });
});

describe("rejectVerificationDocument", () => {
  it("removes the asset and submission, then notifies the owner", async () => {
    const result = await rejectVerificationDocument("document-1");

    expect(result).toEqual({ success: true, data: { userId: "user-1" } });
    expect(mocks.destroyImage).toHaveBeenCalledWith("cloudinary/document-1");
    expect(mocks.verificationDocumentDelete).toHaveBeenCalledWith({
      where: { id: "document-1" },
    });
    expect(mocks.create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        title: "Dokumen verifikasi ditolak",
        message: "Dokumen verifikasimu ditolak. Silakan kirim dokumen pendidikan yang sesuai untuk mencoba lagi.",
      },
    });
  });

  it("rejects a missing document without cleanup or notification", async () => {
    mocks.verificationDocumentFindUnique.mockResolvedValue(null);

    const result = await rejectVerificationDocument("document-1");

    expect(result).toEqual({ success: false, error: "Dokumen verifikasi tidak ditemukan" });
    expect(mocks.destroyImage).not.toHaveBeenCalled();
    expect(mocks.verificationDocumentDelete).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("rejects non-admin users", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "USER" });

    const result = await rejectVerificationDocument("document-1");

    expect(result).toEqual({ success: false, error: "Anda tidak memiliki akses" });
    expect(mocks.verificationDocumentFindUnique).not.toHaveBeenCalled();
    expect(mocks.destroyImage).not.toHaveBeenCalled();
  });
});

describe("deleteAdminRecord", () => {
  it("builds the compound unique key for join tables", async () => {
    const result = await deleteAdminRecord("project_role", { projectId: "project-1", roleName: "role-1" });

    expect(result).toEqual({ success: true });
    expect(mocks.delete).toHaveBeenCalledWith({
      where: { projectId_roleName: { projectId: "project-1", roleName: "role-1" } },
    });
  });

  it("rejects missing primary key values", async () => {
    const result = await deleteAdminRecord("project_role", { projectId: "project-1" });

    expect(result.success).toBe(false);
    expect(mocks.delete).not.toHaveBeenCalled();
  });
});
