import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  notificationCreate: vi.fn(),
}));

vi.mock("../prisma", () => ({
  prisma: {
    notification: {
      create: mocks.notificationCreate,
    },
  },
}));

import { createNotification } from "../notification";
import { prisma } from "../prisma";

beforeEach(() => {
  vi.clearAllMocks();
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
