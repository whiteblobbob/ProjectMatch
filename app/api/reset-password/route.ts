import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const failureUrl = new URL("/forgot-password?error=invalid_reset_link", request.url);

  if (code && !request.nextUrl.searchParams.has("error")) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.session) {
        // The server client's cookies() writes are included by Next.js on this redirect.
        return NextResponse.redirect(new URL("/reset-password", request.url));
      }
    } catch {
      // Never expose recovery codes or provider diagnostics in the redirect.
    }
  }

  return NextResponse.redirect(failureUrl);
}
