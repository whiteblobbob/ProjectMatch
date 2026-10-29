import { Suspense } from "react";

import { fetchRoles } from "@/app/actions/catalog";
import { ActivityError, ActivitySkeleton } from "../../../../components/activity/activity-states";
import UbahPosisiForm from "../../../../components/activity/kelola/ubah-posisi-form";
import Navbar from "../../../../components/navigation-bar/guestnavbar";
import { loadOwnedProject } from "../../../../lib/ui/kelola-project";

type UbahPosisiPageProps = {
  params: Promise<{ id: string }>;
};

export default function UbahPosisiPage({ params }: UbahPosisiPageProps) {
  return (
    <Suspense fallback={<ActivitySkeleton />}>
      <UbahPosisiAccess params={params} />
    </Suspense>
  );
}

async function UbahPosisiAccess({ params }: UbahPosisiPageProps) {
  const { id } = await params;
  const { project } = await loadOwnedProject(id);

  const roles = await fetchRoles();

  if (!roles.success || !("data" in roles)) {
    console.error("Failed to load roles");
    return (
      <>
        <Navbar />
        <ActivityError />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <UbahPosisiForm project={project} roles={roles.data} />
    </>
  );
}
