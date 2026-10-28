import "server-only";

import { createClient } from "./server";
import { connection } from "next/server";
import { redirect } from "next/navigation";

export type AuthUser = {
  id: string;
  email: string | null;
};

export async function getAuthUser(): Promise<AuthUser | null> {
  await connection();

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return null;
  }

  const supabase = await createClient();
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

export async function requireAuthUser(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
