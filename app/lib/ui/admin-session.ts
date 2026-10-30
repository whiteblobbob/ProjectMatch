import "server-only";

import { notFound } from "next/navigation";

import prisma from "../prisma";
import { getSessionUser, type SessionUser } from "./session";

export async function requireAdminUser(): Promise<SessionUser> {
  const user = await getSessionUser();

  if (!user) {
    notFound();
  }

  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (record?.role !== "ADMIN") {
    notFound();
  }

  return user;
}
