import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { getSessionUser } from "@/app/lib/ui/session";

export async function GET() {
  const user = await getSessionUser();

  return NextResponse.json({
    authenticated: Boolean(user),
    email: user?.email ?? null,
  });
}

export async function POST() {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  return NextResponse.json({ success: true });
}
