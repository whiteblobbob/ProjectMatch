/**
 * An error that is safe to show to the end user.
 *
 * Actions throw this for expected failures: validation problems, missing
 * records, permission denied. Any other error that escapes an action is an
 * unexpected server error — the action wrapper hides its message behind a
 * generic one and only logs the details server-side.
 */
export class ActionError extends Error {
  /** Per-field validation messages, keyed by form field path. */
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ActionError";

    if (fieldErrors) {
      this.fieldErrors = fieldErrors;
    }
  }
}
