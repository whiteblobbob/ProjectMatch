import { User } from "@supabase/supabase-js";
import prisma from "../prisma";

export async function getUser(user: User) {
  const record = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (record) {
    return record;
  }

  return await prisma.user.create({
    data: {
      id: user.id,
      name: String(user.user_metadata?.name ?? user.email ?? "Pengguna"),
    },
  });
}