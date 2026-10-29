"use server";
import { User } from "@supabase/supabase-js";
import prisma from "../lib/prisma";
import actionWrapper from "../lib/actionWrapper";
import { IdValidator, parseOrThrow } from "../lib/validator/global";
import { ActionError } from "../lib/errors";

/**
 * Fetch all notifications for the authenticated user,
 * ordered by most recent first.
 */
export const fetchNotifications = actionWrapper(async (user: User) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return notifications;
}, { auth: true });

/**
 * Mark a specific notification as read.
 * Verifies the notification belongs to the authenticated user.
 */
export const markNotificationRead = actionWrapper(async (user: User, notificationId: string) => {
  const idResult = parseOrThrow(IdValidator, notificationId);

  const notification = await prisma.notification.findUnique({
    where: { id: idResult },
  });

  if (!notification) {
    throw new ActionError("Notification not found");
  }

  if (notification.userId !== user.id) {
    throw new ActionError("You are not authorized to update this notification");
  }

  await prisma.notification.update({
    where: { id: idResult },
    data: { read: true },
  });
}, { auth: true });
