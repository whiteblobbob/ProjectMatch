"use server";

import { User } from "@supabase/supabase-js";
import { Prisma } from "@/generated/prisma/client";
import actionWrapper from "../lib/actionWrapper";
import { destroyImage } from "../lib/cloudinary";
import { ActionError } from "../lib/errors";
import prisma from "../lib/prisma";
import { createNotification } from "../lib/notification";
import {
  createAdminRow,
  deleteAdminRow,
  queryAdminCounts,
  queryAdminRecords,
  queryAdminRelationOptions,
  toPrismaData,
  updateAdminRow,
} from "../lib/admin/data";
import { getAdminTable, type AdminRow, type AdminTableConfig } from "../lib/admin/registry";
import { buildAdminValidator } from "../lib/validator/admin";
import { IdValidator, parseOrThrow } from "../lib/validator/global";

async function assertAdmin(userId: string) {
  const record = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (record?.role !== "ADMIN") {
    throw new ActionError("Anda tidak memiliki akses");
  }
}

function requireConfig(slug: string): AdminTableConfig {
  const config = getAdminTable(slug);

  if (!config) {
    throw new ActionError("Tabel tidak ditemukan");
  }

  return config;
}

function requirePrimaryKey(config: AdminTableConfig, primaryKey: AdminRow): AdminRow {
  for (const key of config.primaryKey) {
    const value = primaryKey[key];

    if (typeof value !== "string" || value.length === 0) {
      throw new ActionError("Kunci data tidak valid", { [key]: ["Kunci data tidak valid"] });
    }
  }

  return primaryKey;
}

function mapPrismaError(error: unknown): unknown {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return new ActionError("Data dengan kunci yang sama sudah ada");
    }

    if (error.code === "P2003") {
      return new ActionError("Data masih dipakai oleh tabel lain");
    }

    if (error.code === "P2025") {
      return new ActionError("Data tidak ditemukan");
    }
  }

  return error;
}

export const fetchAdminCounts = actionWrapper(async (user: User) => {
  await assertAdmin(user.id);
  return queryAdminCounts();
}, { auth: true });

export const fetchAdminRecords = actionWrapper(async (user: User, slug: string) => {
  await assertAdmin(user.id);
  return queryAdminRecords(requireConfig(slug));
}, { auth: true });

export const fetchAdminRelationOptions = actionWrapper(async (user: User, slug: string) => {
  await assertAdmin(user.id);
  return queryAdminRelationOptions(requireConfig(slug));
}, { auth: true });

export const createAdminRecord = actionWrapper(async (user: User, slug: string, input: unknown) => {
  await assertAdmin(user.id);

  const config = requireConfig(slug);
  const parsed = parseOrThrow(buildAdminValidator(config, "create"), input) as AdminRow;

  try {
    await createAdminRow(config, toPrismaData(config, parsed, "create"));
  } catch (error) {
    throw mapPrismaError(error);
  }
}, { auth: true });

export const updateAdminRecord = actionWrapper(
  async (user: User, slug: string, primaryKey: AdminRow, input: unknown) => {
    await assertAdmin(user.id);

    const config = requireConfig(slug);
    const key = requirePrimaryKey(config, primaryKey);
    const parsed = parseOrThrow(buildAdminValidator(config, "edit"), input) as AdminRow;

    try {
      await updateAdminRow(config, key, toPrismaData(config, parsed, "edit"));
    } catch (error) {
      throw mapPrismaError(error);
    }
  },
  { auth: true },
);

export const deleteAdminRecord = actionWrapper(async (user: User, slug: string, primaryKey: AdminRow) => {
  await assertAdmin(user.id);

  const config = requireConfig(slug);
  const key = requirePrimaryKey(config, primaryKey);

  try {
    await deleteAdminRow(config, key);
  } catch (error) {
    throw mapPrismaError(error);
  }
}, { auth: true });

/**
 * Approve a document-verification submission by marking its owner as verified.
 * Used by the dedicated action buttons on the verification document table.
 */
export const acceptVerificationDocument = actionWrapper(async (user: User, documentId: string) => {
  await assertAdmin(user.id);

  const id = parseOrThrow(IdValidator, documentId);

  const document = await prisma.verificationDocument.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!document) {
    throw new ActionError("Dokumen verifikasi tidak ditemukan");
  }

  await prisma.user.update({
    where: { id: document.userId },
    data: { verified: true },
  });

  return { userId: document.userId };
}, { auth: true });

/**
 * Reject a document-verification submission, clean up its uploaded asset, and
 * notify the owner so they can submit a corrected document.
 */
export const rejectVerificationDocument = actionWrapper(async (user: User, documentId: string) => {
  await assertAdmin(user.id);

  const id = parseOrThrow(IdValidator, documentId);

  const document = await prisma.verificationDocument.findUnique({
    where: { id },
    select: { userId: true, documentCloudId: true },
  });

  if (!document) {
    throw new ActionError("Dokumen verifikasi tidak ditemukan");
  }

  await destroyImage(document.documentCloudId);

  await prisma.$transaction(async (tx) => {
    await tx.verificationDocument.delete({ where: { id } });
    await createNotification(tx, {
      userId: document.userId,
      title: "Dokumen verifikasi ditolak",
      message: "Dokumen verifikasimu ditolak. Silakan kirim dokumen pendidikan yang sesuai untuk mencoba lagi.",
    });
  });

  return { userId: document.userId };
}, { auth: true });
