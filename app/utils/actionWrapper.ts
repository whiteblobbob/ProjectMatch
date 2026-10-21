import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createClient } from "./supabase/server";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: true }
  | { success: false; error: string };

type ActionOptions = { auth?: false };
type AuthenticatedActionOptions = { auth: true };

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred";
}

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
        const supabase = createClient(await cookies());
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
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
      return { success: false, error: getErrorMessage(error) };
    }
  };
}
