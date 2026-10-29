import { Suspense } from "react";
import { ActivitySkeleton } from "../../../components/activity/activity-states";
import Navbar from "../../../components/navigation-bar/guestnavbar";
import TinjauPelamar from "../../../components/page/tinjaupelamar";

export default function TinjauPelamarPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<ActivitySkeleton />}>
        <TinjauPelamarAccess />
      </Suspense>
    </>
  );
}

async function TinjauPelamarAccess() {
  return <TinjauPelamar />;
}
