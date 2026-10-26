import { describe, expect, it } from "vitest";
import { LoginValidator, SignupValidator } from "../validator/auth";
import { IdValidator } from "../validator/global";
import { NotificationValidator } from "../validator/notification";
import { ProfileValidator } from "../validator/profile";
import {
  ApplicationValidator,
  CreateProjectValidator,
  PeerReviewValidator,
  QueryProjectsValidator,
} from "../validator/project";

describe("Validators", () => {
  it("validates application payload with valid roleId and portfolio link", () => {
    const result = ApplicationValidator.safeParse({
      roleId: "role-1",
      portfolioLink: "https://portfolio.example.com",
      message: "Ready to contribute",
    });

    expect(result.success).toBe(true);
  });

  it("validates project creation payload with required fields", () => {
    const result = CreateProjectValidator.safeParse({
      title: "Test Project",
      description: "A test project description",
      deadline: new Date("2030-01-01"),
      categoryId: "category-id",
      workHoursPerWeek: 15,
      projectStatusCriteria: ["status-id"],
      projectRoles: [{ roleId: "role-id", slotsAvailable: 2 }],
    });

    expect(result.success).toBe(true);
  });

  it("validates peer review payload with score and feedback", () => {
    const result = PeerReviewValidator.safeParse({
      projectId: "project-id",
      revieweeId: "reviewee-id",
      commitmentScore: 5,
      feedback: "Great teammate",
    });

    expect(result.success).toBe(true);
  });

  it("validates user profile payload with roles", () => {
    const result = ProfileValidator.safeParse({
      name: "Jane Doe",
      instance: "University",
      bio: "Software developer",
      statusId: "status-id",
      userRoles: [{ roleId: "role-id" }],
    });

    expect(result.success).toBe(true);
  });

  it("validates notification payload with message", () => {
    const result = NotificationValidator.safeParse({
      userId: "user-id",
      title: "New Alert",
      message: "This is a notification",
    });

    expect(result.success).toBe(true);
  });

  it("validates signup payload with email and password", () => {
    const result = SignupValidator.safeParse({
      email: "user@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("validates login payload with credentials", () => {
    const result = LoginValidator.safeParse({
      email: "user@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("validates a valid ID string", () => {
    const result = IdValidator.safeParse("valid-entity-id-123");

    expect(result.success).toBe(true);
  });

  it("validates project query filters with role and pagination defaults", () => {
    const result = QueryProjectsValidator.safeParse({
      status: "OPEN_RECRUITMENT",
      projectRoles: ["role-id"],
    });

    expect(result).toEqual({
      success: true,
      data: {
        status: "OPEN_RECRUITMENT",
        projectRoles: ["role-id"],
        page: 1,
        pageSize: 10,
      },
    });
  });
});
