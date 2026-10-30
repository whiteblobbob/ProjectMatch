import { describe, expect, it } from "vitest";
import { getAdminTable } from "../admin/registry";
import { buildAdminValidator } from "../validator/admin";
import { ProfileValidator } from "../validator/profile";
import { ApplicationValidator, CreateProjectValidator, QueryProjectsValidator } from "../validator/project";

describe("free-text role names", () => {
  const profileRoles = ProfileValidator.pick({ roles: true });
  const positions = CreateProjectValidator.pick({ projectRoles: true });

  it("accepts custom profile roles and preserves display capitalization", () => {
    expect(profileRoles.parse({ roles: ["  Robotics Mentor  ", "UX Researcher"] })).toEqual({
      roles: ["Robotics Mentor", "UX Researcher"],
    });
  });

  it.each([{ roles: [] }, { roles: ["  "] }, { roles: ["Designer", " designer "] }])("rejects invalid profile roles $roles", ({ roles }) => {
    expect(profileRoles.safeParse({ roles }).success).toBe(false);
  });

  it("accepts custom project positions and requires positive integer slots", () => {
    expect(positions.parse({ projectRoles: [{ roleName: "  Robotics Mentor ", slotsAvailable: 2 }] })).toEqual({
      projectRoles: [{ roleName: "Robotics Mentor", slotsAvailable: 2 }],
    });
    for (const slotsAvailable of [0, -1, 1.5]) {
      expect(positions.safeParse({ projectRoles: [{ roleName: "Mentor", slotsAvailable }] }).success).toBe(false);
    }
  });

  it("rejects duplicate project positions ignoring case and whitespace", () => {
    expect(positions.safeParse({ projectRoles: [
      { roleName: "Designer", slotsAvailable: 1 },
      { roleName: " designer ", slotsAvailable: 2 },
    ] }).success).toBe(false);
  });

  it("validates application names without requiring a catalog ID", () => {
    expect(ApplicationValidator.parse({ roleName: " Robotics Mentor " })).toEqual({ roleName: "Robotics Mentor" });
    expect(ApplicationValidator.safeParse({ roleName: " " }).success).toBe(false);
    expect(ApplicationValidator.safeParse({ roleId: "old-catalog-id" }).success).toBe(false);
  });

  it("accepts trimmed name fragments in project filters", () => {
    expect(QueryProjectsValidator.parse({ projectRoles: [" DESIGN ", "mentor"] }).projectRoles).toEqual(["DESIGN", "mentor"]);
    expect(QueryProjectsValidator.safeParse({ projectRoles: [" "] }).success).toBe(false);
  });

  it("validates admin role inputs with the same name rules", () => {
    const user = buildAdminValidator(getAdminTable("user")!, "edit").pick({ roles: true });
    expect(user.parse({ roles: [" Mentor "] })).toEqual({ roles: ["Mentor"] });
    expect(user.safeParse({ roles: ["Mentor", " mentor "] }).success).toBe(false);
    expect(user.parse({ roles: [] })).toEqual({ roles: [] });

    const projectRole = buildAdminValidator(getAdminTable("project_role")!, "create");
    expect(projectRole.parse({ projectId: "project", roleName: " Mentor ", slotsAvailable: "0" })).toEqual({
      projectId: "project", roleName: "Mentor", slotsAvailable: 0,
    });
    expect(projectRole.safeParse({ projectId: "project", roleName: " ", slotsAvailable: 1 }).success).toBe(false);
    expect(projectRole.safeParse({ projectId: "project", roleName: "Mentor", slotsAvailable: -1 }).success).toBe(false);
  });

  it("removes the user-role join table and catalog references from admin", () => {
    expect(getAdminTable("user_role")).toBeUndefined();
    for (const table of ["project_role", "project_member", "application"]) {
      const field = getAdminTable(table)!.fields.find((field) => field.name === "roleName");
      expect(field).toMatchObject({ type: "text", required: true });
      expect(field).not.toHaveProperty("relation");
    }
    expect(getAdminTable("user")!.fields.find((field) => field.name === "role")).toMatchObject({
      displayOnly: true, options: ["USER", "ADMIN"],
    });
  });
});
