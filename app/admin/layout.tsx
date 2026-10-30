import type { Metadata } from "next";
import type { ReactNode } from "react";

import AdminShell from "../components/admin/admin-shell";
import { getSessionUser } from "../lib/ui/session";

export const metadata: Metadata = {
  title: "Admin · ProjectMatch",
  description: "Panel administrasi ProjectMatch.",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  return <AdminShell email={user?.email ?? null}>{children}</AdminShell>;
}
