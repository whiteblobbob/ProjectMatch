import { NextResponse, type NextRequest } from "next/server";

import prisma from "@/app/lib/prisma";

/**
 * Academic-email verification callback. Reads the single-use token from the
 * query string, marks the owner as verified, then redirects to the profile
 * with a status flag.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const redirectUrl = new URL("/profile", request.url);

  if (!token) {
    redirectUrl.searchParams.set("verification", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const user = await prisma.user.findUnique({
    where: { verificationToken: token },
  });

  const isExpired =
    user?.verificationTokenExpiresAt != null && user.verificationTokenExpiresAt.getTime() < Date.now();

  if (!user || isExpired) {
    redirectUrl.searchParams.set("verification", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verified: true,
      verificationToken: null,
      verificationTokenExpiresAt: null,
    },
  });

  redirectUrl.searchParams.set("verification", "success");
  return NextResponse.redirect(redirectUrl);
}
