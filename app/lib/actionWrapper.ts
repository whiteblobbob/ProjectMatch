import { User } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";
import { ActionError } from "./errors";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

type ActionOptions = { auth?: false };
type AuthenticatedActionOptions = { auth: true };

export default function actionWrapper<Args extends unknown[], Result>(
  action: (user: User, ...args: Args) => Result | Promise<Result>,
  options: AuthenticatedActionOptions,
): (...args: Args) => Promise<ActionResult<Result>>;
export default function actionWrapper<Args extends unknown[], Result>(
  action: (...args: Args) => Result | Promise<Result>,
  options?: ActionOptions,
): (...args: Args) => Promise<ActionResult<Result>>;
export default function actionWrapper<Args extends unknown[], Result>(
  action:
    | ((...args: Args) => Result | Promise<Result>)
    | ((user: User, ...args: Args) => Result | Promise<Result>),
  options: ActionOptions | AuthenticatedActionOptions = {},
) {
  return async (...args: Args): Promise<ActionResult<Result>> => {
    try {
      let data: Result | undefined;

      if (options.auth) {
        const supabase = await createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          return { success: false, error: "User is not authenticated" };
        }

        data = await (action as (user: User, ...args: Args) => Result | Promise<Result>)(
          user,
          ...args,
        );
      } else {
        data = await (action as (...args: Args) => Result | Promise<Result>)(...args);
      }

      if (data === undefined) {
        return { success: true };
      }

      return { success: true, data };
    } catch (error) {
      // ActionError is an expected, user-facing failure: show its message.
      if (error instanceof ActionError) {
        return error.fieldErrors
          ? { success: false, error: error.message, fieldErrors: error.fieldErrors }
          : { success: false, error: error.message };
      }

      // Anything else is an unexpected server error: log the details and give
      // the user a generic message so internals never leak to the client.
      console.error("[action error]", error);
      return { success: false, error: "Something went wrong. Please try again." };
    }
  };
}
