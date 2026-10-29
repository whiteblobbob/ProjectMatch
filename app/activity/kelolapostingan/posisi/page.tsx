import { Suspense } from "react";

import { fetchRoles } from "../../../actions/catalog";
import { ActivitySkeleton } from "../../../components/activity/activity-states";
import Navbar from "../../../components/navigation-bar/guestnavbar";
import UbahPosisi from "../../../components/page/ubahposisi";
import { requireSessionUser } from "../../../lib/ui/session";

export default function UbahPosisiPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<ActivitySkeleton />}>
        <UbahPosisiAccess />
      </Suspense>
    </>
  );
}

async function UbahPosisiAccess() {
  await requireSessionUser();

  const roles = await fetchRoles();

  if (!roles.success || !("data" in roles)) {
    console.error("Failed to load roles");
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6" role="alert">
          <h1 className="text-xl font-bold text-red-950">Data posisi belum dapat dimuat</h1>
          <p className="mt-2 text-sm text-red-800">Coba muat ulang halaman setelah beberapa saat.</p>
        </section>
      </main>
    );
  }

  return <UbahPosisi roles={roles.data} />;
}
