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

beforeEach(() => {
  vi.clearAllMocks();
  mocks.notificationCreate.mockResolvedValue({});
});

describe("createNotification", () => {
  it("creates a notification with valid data", async () => {
    await expect(createNotification({
      userId: "user-id",
      title: "New Application",
      message: "You received a new application",
    })).resolves.toBeUndefined();

    expect(mocks.notificationCreate).toHaveBeenCalledWith({
      data: {
        userId: "user-id",
        title: "New Application",
        message: "You received a new application",
      },
    });
  });

  it("rejects when userId is empty", async () => {
    await expect(createNotification({
      userId: "",
      title: "Title",
      message: "Message",
    })).rejects.toThrow("User ID is required");

    expect(mocks.notificationCreate).not.toHaveBeenCalled();
  });

  it("rejects when title is empty", async () => {
    await expect(createNotification({
      userId: "user-id",
      title: "",
      message: "Message",
    })).rejects.toThrow("Title is required");

    expect(mocks.notificationCreate).not.toHaveBeenCalled();
  });

  it("rejects when message is empty", async () => {
    await expect(createNotification({
      userId: "user-id",
      title: "Title",
      message: "",
    })).rejects.toThrow("Message is required");

    expect(mocks.notificationCreate).not.toHaveBeenCalled();
  });
});
