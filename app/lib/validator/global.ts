import z, { type ZodType } from "zod";
import { ActionError } from "../errors";

export const IdValidator = z.string().min(1, "ID is required");

/**
 * Validate `input` with a Zod schema, converting failures into an ActionError
 * so users get readable messages instead of a serialized ZodError.
 *
 * Issues with a field path (form-level schemas) are attached to
 * `ActionError.fieldErrors`; issues without a path (bare validators such as
 * `IdValidator`) are joined into the error message.
 */
export function parseOrThrow<Schema extends ZodType>(validator: Schema, input: unknown): z.output<Schema> {
  const result = validator.safeParse(input);

  if (!result.success) {
    const { formErrors, fieldErrors } = z.flattenError(result.error);
    const fields = Object.entries(fieldErrors).filter(
      (entry): entry is [string, string[]] => entry[1] !== undefined,
    );

    if (fields.length > 0) {
      throw new ActionError("Please check your input", Object.fromEntries(fields));
    }

    throw new ActionError(
      formErrors.length > 0 ? formErrors.join(", ") : "Please check your input",
    );
  }

  return result.data;
}
