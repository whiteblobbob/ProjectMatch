import z from "zod";
import { RoleNameValidator, RoleNamesValidator } from "./role";
import { editableFields, type AdminField, type AdminTableConfig } from "../admin/registry";

const emptyToNull = <Schema extends z.ZodType>(schema: Schema) =>
  z.preprocess((value) => (value === "" ? null : value), schema.nullish());

const requiredNumber = (integer: boolean) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    integer ? z.coerce.number().int() : z.coerce.number(),
  );

function fieldValidator(field: AdminField): z.ZodType {
  switch (field.type) {
    case "text":
    case "textarea": {
      const base = z.string();
      return field.required ? base.min(1, `${field.label} wajib diisi`) : base.nullish();
    }
    case "number":
      return field.required ? requiredNumber(true) : emptyToNull(z.coerce.number().int());
    case "float":
      return field.required ? requiredNumber(false) : emptyToNull(z.coerce.number());
    case "boolean":
      return z.boolean().optional();
    case "datetime":
      return field.required ? z.coerce.date() : emptyToNull(z.coerce.date());
    case "enum": {
      const options = field.options as [string, ...string[]];
      return field.required ? z.enum(options) : emptyToNull(z.enum(options));
    }
    case "enumArray": {
      const options = field.options as [string, ...string[]];
      return z.array(z.enum(options)).min(1, `${field.label} wajib dipilih`);
    }
    case "stringArray":
      return field.required
        ? z.array(z.string().min(1)).min(1, `${field.label} wajib diisi`)
        : z.array(z.string()).optional();
    case "relation":
      return z.string().min(1, `${field.label} wajib dipilih`);
  }
}

export function buildAdminValidator(config: AdminTableConfig, mode: "create" | "edit") {
  const shape: Record<string, z.ZodType> = {};

  for (const field of editableFields(config, mode)) {
    if (field.name === "roleName" || (config.key === "role" && field.name === "name")) {
      shape[field.name] = RoleNameValidator;
    } else if (config.key === "user" && field.name === "roles") {
      shape[field.name] = RoleNamesValidator.optional();
    } else if (config.key === "project_role" && field.name === "slotsAvailable") {
      shape[field.name] = requiredNumber(true).pipe(z.number().min(0));
    } else {
      shape[field.name] = fieldValidator(field);
    }
  }

  return z.object(shape);
}
