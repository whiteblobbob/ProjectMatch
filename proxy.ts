import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";
import { createProxyClient } from "@/app/lib/supabase/proxy-client";

const PUBLIC_PATHS = new Set(["/", "/login", "/register", "/forgot-password", "/404", "/legal"]);

function notFound(request: NextRequest) {
  return NextResponse.rewrite(new URL("/404", request.url));
}

function redirectToLogin(request: NextRequest, response: NextResponse) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = `?next=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}`;

  const redirectResponse = NextResponse.redirect(loginUrl);
  response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
  return redirectResponse;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabase, response } = createProxyClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminPath) {
    if (!user) {
      return notFound(request);
    }

    const admin = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (admin?.role !== "ADMIN") {
      return notFound(request);
    }

    return response;
  }

  if (user || PUBLIC_PATHS.has(pathname)) {
    return response;
  }

  return redirectToLogin(request, response);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2)$).*)",
  ],
};
