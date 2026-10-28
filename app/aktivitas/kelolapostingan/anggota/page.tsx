import { Suspense } from "react";

import { ActivitySkeleton } from "../../../components/activity/activity-states";
import Navbar from "../../../components/navigation-bar/guestnavbar";
import KelolaAnggota from "../../../components/page/kelolaanggota";
import { requireSessionUser } from "../../../lib/ui/session";

export default function KelolaAnggotaPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<ActivitySkeleton />}>
        <KelolaAnggotaAccess />
      </Suspense>
    </>
  );
}

async function KelolaAnggotaAccess() {
  await requireSessionUser();

  return <KelolaAnggota />;
}
