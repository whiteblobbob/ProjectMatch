import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../utils/authWrapper", () => ({
  default: (handler: (user: { id: string }, ...args: unknown[]) => unknown) =>
    (...args: unknown[]) => handler({ id: "test-user-id" }, ...args),
}));

const mocks = vi.hoisted(() => ({
  notificationFindMany: vi.fn(),
  notificationFindUnique: vi.fn(),
  notificationUpdate: vi.fn(),
}));

vi.mock("../prisma", () => ({
  prisma: {
    notification: {
      findMany: mocks.notificationFindMany,
      findUnique: mocks.notificationFindUnique,
      update: mocks.notificationUpdate,
    },
  },
}));

import { fetchNotifications, markNotificationRead } from "../../actions/notification";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.notificationUpdate.mockResolvedValue({});
});

describe("fetchNotifications", () => {
  it("fetches all notifications for the authenticated user ordered by newest first", async () => {
    const notifications = [
      { id: "notif-1", title: "First", createdAt: new Date("2026-01-02") },
      { id: "notif-2", title: "Second", createdAt: new Date("2026-01-01") },
    ];
    mocks.notificationFindMany.mockResolvedValue(notifications);

    await expect(fetchNotifications()).resolves.toBe(notifications);

    expect(mocks.notificationFindMany).toHaveBeenCalledWith({
      where: { userId: "test-user-id" },
      orderBy: { createdAt: "desc" },
    });
  });

  it("returns an empty list when the user has no notifications", async () => {
    mocks.notificationFindMany.mockResolvedValue([]);

    await expect(fetchNotifications()).resolves.toEqual([]);
  });
});

describe("markNotificationRead", () => {
  it("marks a notification as read when owned by the authenticated user", async () => {
    mocks.notificationFindUnique.mockResolvedValue({
      id: "notif-id",
      userId: "test-user-id",
      read: false,
    });

    await expect(markNotificationRead("notif-id")).resolves.toBeUndefined();

    expect(mocks.notificationFindUnique).toHaveBeenCalledWith({
      where: { id: "notif-id" },
    });
    expect(mocks.notificationUpdate).toHaveBeenCalledWith({
      where: { id: "notif-id" },
      data: { read: true },
    });
  });

  it("rejects an invalid notification ID", async () => {
    await expect(markNotificationRead("")).rejects.toThrow("ID is required");

    expect(mocks.notificationFindUnique).not.toHaveBeenCalled();
    expect(mocks.notificationUpdate).not.toHaveBeenCalled();
  });

  it("rejects when the notification does not exist", async () => {
    mocks.notificationFindUnique.mockResolvedValue(null);

    await expect(markNotificationRead("notif-id")).rejects.toThrow("Notification not found");

    expect(mocks.notificationUpdate).not.toHaveBeenCalled();
  });

  it("rejects when the notification belongs to another user", async () => {
    mocks.notificationFindUnique.mockResolvedValue({
      id: "notif-id",
      userId: "other-user-id",
      read: false,
    });

    await expect(markNotificationRead("notif-id"))
      .rejects.toThrow("You are not authorized to update this notification");

    expect(mocks.notificationUpdate).not.toHaveBeenCalled();
  });
});
