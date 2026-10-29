import { Suspense } from "react";

import { fetchProjectApplications } from "@/app/actions/project";
import { ActivityError, ActivitySkeleton } from "../../../components/activity/activity-states";
import KelolaPostinganView from "../../../components/activity/kelola/kelola-postingan-view";
import Navbar from "../../../components/navigation-bar/guestnavbar";
import { loadOwnedProject } from "../../../lib/ui/kelola-project";

type KelolaPostinganPageProps = {
  params: Promise<{ id: string }>;
};

export default function KelolaPostinganPage({ params }: KelolaPostinganPageProps) {
  return (
    <Suspense fallback={<ActivitySkeleton />}>
      <KelolaPostinganAccess params={params} />
    </Suspense>
  );
}

async function KelolaPostinganAccess({ params }: KelolaPostinganPageProps) {
  const { id } = await params;
  const { project } = await loadOwnedProject(id);

  const applications = await fetchProjectApplications(id);

  if (!applications.success || !("data" in applications)) {
    console.error("Failed to load project applications", applications.success ? "No data" : applications.error);
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
      <KelolaPostinganView project={project} applications={applications.data} />
    </>
  );
}
