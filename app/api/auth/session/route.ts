import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/app/lib/demo-account";
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
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
  }

  return NextResponse.json({ success: true });
}
