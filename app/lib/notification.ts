import prisma from "./prisma";
import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { NotificationForm, NotificationValidator } from "./validator/notification";
import { parseOrThrow } from "./validator/global";

/**
 * A Prisma client instance that can be either the top-level client or a
 * transaction-scoped client (the `tx` handed to `prisma.$transaction` callbacks).
 */
export type DbClient = PrismaClient | Prisma.TransactionClient;

/**
 * Create a notification for a user.
 * Internal utility — called from server actions, not exposed to clients.
 * Pass a transaction client (`tx`) to run the write inside the surrounding
 * `prisma.$transaction`; defaults to the top-level client.
 */
export async function createNotification(db: DbClient = prisma, formData: NotificationForm) {
  const data = parseOrThrow(NotificationValidator, formData);

  await db.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
    }
  });
}
