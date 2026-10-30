import { Suspense } from "react";
import { redirect } from "next/navigation";

import { ActivitySkeleton } from "../../../../components/activity/activity-states";
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

  if (project.status !== "OPEN_RECRUITMENT") {
    redirect(`/activity/project/${id}`);
  }

  return (
    <>
      <Navbar />
      <UbahPosisiForm project={project} />
    </>
  );
}
