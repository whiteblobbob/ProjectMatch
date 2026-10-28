import "server-only";

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";

export type SessionUser = {
  id: string;
  email: string | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return null;
  }

  const supabase = createClient(await cookies());
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
