import z from "zod";

export function roleNameKey(name: string) {
  return name.trim().toLocaleLowerCase("id-ID");
}

export const RoleNameValidator = z.string().trim().min(1, "Role name is required");

export function hasUniqueRoleNames(names: string[]) {
  return new Set(names.map(roleNameKey)).size === names.length;
}

export const RoleNamesValidator = z.array(RoleNameValidator).refine(hasUniqueRoleNames, {
  message: "Role names must be unique (ignoring capitalization)",
});
