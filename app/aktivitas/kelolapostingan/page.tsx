import { Suspense } from "react";
import { ActivitySkeleton } from "../../components/activity/activity-states";
import Navbar from "../../components/navigation-bar/guestnavbar";
import KelolaPostingan from "../../components/page/kelolapostingan";

export default function KelolaPostinganPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<ActivitySkeleton />}>
        <KelolaPostinganAccess />
      </Suspense>
    </>
  );
}

async function KelolaPostinganAccess() {
  return <KelolaPostingan />;
}
