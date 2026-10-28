import { NextResponse } from "next/server";
import { getAuthUser } from "@/app/lib/supabase/getAuthUser";
import { createClient } from "@/app/lib/supabase/server";

export async function GET() {
  const user = await getAuthUser();

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
