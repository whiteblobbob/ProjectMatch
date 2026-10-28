import { Suspense } from "react";

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

  return <UbahPosisi />;
}
