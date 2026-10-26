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
        return {
          success: false,
          error: "Something went wrong. Please try again.",
        };
      }
    },
}));

const mocks = vi.hoisted(() => ({
  notificationFindMany: vi.fn(),
  notificationFindUnique: vi.fn(),
  notificationUpdate: vi.fn(),
  notificationCreate: vi.fn(),
}));

vi.mock("../prisma", () => ({
  prisma: {
    notification: {
      findMany: mocks.notificationFindMany,
      findUnique: mocks.notificationFindUnique,
      update: mocks.notificationUpdate,
      create: mocks.notificationCreate,
    },
  },
}));

import { fetchNotifications, markNotificationRead } from "../../actions/notification";
import { createNotification } from "../notification";
import { prisma } from "../prisma";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.notificationUpdate.mockResolvedValue({});
  mocks.notificationCreate.mockResolvedValue({});
});

describe("createNotification", () => {
  it("creates a notification record in prisma with valid data", async () => {
    await expect(
      createNotification(prisma, {
        userId: "user-id",
        title: "New Notification",
        message: "You have a new update",
      }),
    ).resolves.toBeUndefined();

    expect(mocks.notificationCreate).toHaveBeenCalledWith({
      data: {
        userId: "user-id",
        title: "New Notification",
        message: "You have a new update",
      },
    });
  });
});

describe("fetchNotifications", () => {
  it("fetches all notifications for the authenticated user ordered by newest first", async () => {
    const notifications = [
      { id: "notif-1", title: "First", createdAt: new Date("2026-01-02") },
      { id: "notif-2", title: "Second", createdAt: new Date("2026-01-01") },
    ];
    mocks.notificationFindMany.mockResolvedValue(notifications);

    const result = await fetchNotifications();

    expect(result).toEqual({ success: true, data: notifications });
    expect(mocks.notificationFindMany).toHaveBeenCalledWith({
      where: { userId: "test-user-id" },
      orderBy: { createdAt: "desc" },
    });
  });
});

describe("markNotificationRead", () => {
  it("marks a notification as read when owned by the authenticated user", async () => {
    mocks.notificationFindUnique.mockResolvedValue({
      id: "notif-id",
      userId: "test-user-id",
      read: false,
    });

    const result = await markNotificationRead("notif-id");

    expect(result).toEqual({ success: true });
    expect(mocks.notificationFindUnique).toHaveBeenCalledWith({
      where: { id: "notif-id" },
    });
    expect(mocks.notificationUpdate).toHaveBeenCalledWith({
      where: { id: "notif-id" },
      data: { read: true },
    });
  });

  it("rejects an invalid notification ID", async () => {
    const result = await markNotificationRead("");

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("ID is required"),
    });
    expect(mocks.notificationFindUnique).not.toHaveBeenCalled();
    expect(mocks.notificationUpdate).not.toHaveBeenCalled();
  });

  it("rejects when the notification does not exist", async () => {
    mocks.notificationFindUnique.mockResolvedValue(null);

    const result = await markNotificationRead("notif-id");

    expect(result).toEqual({ success: false, error: "Notification not found" });
    expect(mocks.notificationUpdate).not.toHaveBeenCalled();
  });

  it("rejects when the notification belongs to another user", async () => {
    mocks.notificationFindUnique.mockResolvedValue({
      id: "notif-id",
      userId: "other-user-id",
      read: false,
    });

    const result = await markNotificationRead("notif-id");

    expect(result).toEqual({
      success: false,
      error: "You are not authorized to update this notification",
    });
    expect(mocks.notificationUpdate).not.toHaveBeenCalled();
  });
});
