import { describe, expect, it } from "vitest";
import z from "zod";
import { LoginValidator, SignupValidator } from "../validator/auth";
import { IdValidator } from "../validator/global";
import { NotificationValidator } from "../validator/notification";
import { ProfileValidator } from "../validator/profile";
import { VerificationDocumentValidator } from "../validator/verification";
import {
  ApplicationValidator,
  CreateProjectValidator,
  PeerReviewValidator,
  QueryProjectsValidator,
  UpdateProjectValidator,
  validateMeetingRequirements,
} from "../validator/project";
import { ActionError } from "../errors";

describe("Validators", () => {
  it("validates application payload with valid roleId and message", () => {
    const result = ApplicationValidator.safeParse({
      roleId: "role-1",
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
      collaborationMode: "ONLINE",
      onlinePlatform: "GOOGLE_MEET",
      onlineLink: "https://meet.google.com/abc-defg-hij",
      meetDescription: "Weekly sync meeting",
      workHoursPerWeek: 15,
      educationLevels: ["SMP", "SMA"],
      projectRoles: [{ roleId: "role-id", slotsAvailable: 2 }],
    });

    expect(result.success).toBe(true);
  });

  it("does not retain project roles in project updates", () => {
    const result = UpdateProjectValidator.safeParse({
      title: "Updated Project",
      projectRoles: [{ roleId: "role-id", slotsAvailable: 2 }],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("projectRoles");
    }
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
      institution: "93145",
      bio: "Software developer",
      educationLevel: "MAHASISWA",
      userRoles: [{ roleId: "role-id" }],
    });

    expect(result.success).toBe(true);
  });

  it("validates a verification document payload with a file and type", () => {
    const document = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "card.png", {
      type: "image/png",
    });

    const result = VerificationDocumentValidator.safeParse({
      documentType: "enrollment-letter",
      document,
    });

    expect(result.success).toBe(true);
  });

  it("requires a file for verification documents", () => {
    const result = VerificationDocumentValidator.safeParse({
      documentType: "student-card",
      document: null,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      expect(fieldErrors.document).toEqual(["Dokumen wajib dipilih"]);
    }
  });

  it("rejects an unknown verification document type", () => {
    const document = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "card.png", {
      type: "image/png",
    });

    const result = VerificationDocumentValidator.safeParse({
      documentType: "passport",
      document,
    });

    expect(result.success).toBe(false);
  });

  it("validates notification payload with message", () => {
    const result = NotificationValidator.safeParse({
      userId: "user-id",
      title: "New Alert",
      message: "This is a notification",
    });

    expect(result.success).toBe(true);
  });

  it("validates signup payload with name, email, and password", () => {
    const result = SignupValidator.safeParse({
      name: "Jane Doe",
      email: "user@example.com",
      password: "password123",
      educationLevel: "MAHASISWA",
      institution: "93145",
      province: "Jawa Barat",
      city: "Kota Bandung",
    });

    expect(result.success).toBe(true);
  });

  it("requires an institution for signup", () => {
    const result = SignupValidator.safeParse({
      name: "Jane Doe",
      email: "user@example.com",
      password: "password123",
      educationLevel: "MAHASISWA",
      province: "Jawa Barat",
      city: "Kota Bandung",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      expect(fieldErrors.institution).toEqual(["Institution is required"]);
    }
  });

  it("requires a province and city for signup", () => {
    const result = SignupValidator.safeParse({
      name: "Jane Doe",
      email: "user@example.com",
      password: "password123",
      educationLevel: "MAHASISWA",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      expect(fieldErrors.province).toEqual(["Province is required"]);
      expect(fieldErrors.city).toEqual(["City is required"]);
    }
  });

  it("requires a name for signup", () => {
    const result = SignupValidator.safeParse({
      email: "user@example.com",
      password: "password123",
    });

    expect(result.success).toBe(false);
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

describe("validateMeetingRequirements", () => {
  it("accepts a complete online meeting plan", () => {
    expect(() =>
      validateMeetingRequirements({
        collaborationMode: "ONLINE",
        onlinePlatform: "GOOGLE_MEET",
        onlineLink: "https://meet.google.com/abc-defg-hij",
      }),
    ).not.toThrow();
  });

  it("accepts a complete offline meeting plan", () => {
    expect(() =>
      validateMeetingRequirements({
        collaborationMode: "OFFLINE",
        offlinePlace: "KAMPUS",
        offlineLink: "https://maps.google.com/?q=Kampus",
      }),
    ).not.toThrow();
  });

  it("requires a platform and link for online collaboration", () => {
    try {
      validateMeetingRequirements({ collaborationMode: "ONLINE" });
      throw new Error("expected validateMeetingRequirements to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ActionError);
      expect((error as ActionError).fieldErrors).toEqual({
        onlinePlatform: ["Online platform is required for online collaboration"],
        onlineLink: ["Online meeting link is required for online collaboration"],
      });
    }
  });

  it("requires a place and map link for offline collaboration", () => {
    try {
      validateMeetingRequirements({ collaborationMode: "OFFLINE" });
      throw new Error("expected validateMeetingRequirements to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ActionError);
      expect((error as ActionError).fieldErrors).toEqual({
        offlinePlace: ["Offline place is required for offline collaboration"],
        offlineLink: ["Offline map link is required for offline collaboration"],
      });
    }
  });

  it("requires both online and offline details for hybrid collaboration", () => {
    try {
      validateMeetingRequirements({
        collaborationMode: "HYBRID",
        onlinePlatform: "ZOOM",
        onlineLink: "https://zoom.us/j/123",
      });
      throw new Error("expected validateMeetingRequirements to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ActionError);
      expect((error as ActionError).fieldErrors).toEqual({
        offlinePlace: ["Offline place is required for offline collaboration"],
        offlineLink: ["Offline map link is required for offline collaboration"],
      });
    }
  });
});
