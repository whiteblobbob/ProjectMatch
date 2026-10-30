import { Suspense } from "react";

import { ActivitySkeleton } from "../../../../components/activity/activity-states";
import KelolaAnggotaView from "../../../../components/activity/kelola/kelola-anggota-view";
import Navbar from "../../../../components/navigation-bar/guestnavbar";
import { loadOwnedProject } from "../../../../lib/ui/kelola-project";

type KelolaAnggotaPageProps = {
  params: Promise<{ id: string }>;
};

export default function KelolaAnggotaPage({ params }: KelolaAnggotaPageProps) {
  return (
    <Suspense fallback={<ActivitySkeleton />}>
      <KelolaAnggotaAccess params={params} />
    </Suspense>
  );
}

async function KelolaAnggotaAccess({ params }: KelolaAnggotaPageProps) {
  const { id } = await params;
  const { project } = await loadOwnedProject(id);

  return (
    <>
      <Navbar />
      <KelolaAnggotaView project={project} />
    </>
  );
}
