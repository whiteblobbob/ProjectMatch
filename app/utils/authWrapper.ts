import { cookies } from "next/headers";
import { createClient } from "./supabase/server";
import { User } from "@supabase/supabase-js";

export default function authWrapper<Args extends unknown[], Result>(fn: (user: User, ...args: Args) => Result | Promise<Result>) {
  return async (...args: Args) => {
    const supabase = createClient(await cookies());
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("User is not authenticated");
    }

    return await fn(user, ...args);
  };
}