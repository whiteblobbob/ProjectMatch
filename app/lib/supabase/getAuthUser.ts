import "server-only";

import { cookies } from "next/headers";
import { createClient } from "./server";
import { DEMO_SESSION_COOKIE, DEMO_USER_ID, isDemoAccountEnabled } from "../demo-account";

export type AuthUser = {
  id: string;
  email: string | null;
};

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();

  if (isDemoAccountEnabled() && cookieStore.get(DEMO_SESSION_COOKIE)?.value === "active") {
    return {
      id: DEMO_USER_ID,
      email: process.env.DEMO_ACCOUNT_EMAIL ?? "demo@projectmatch.test",
    };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return null;
  }

  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}
