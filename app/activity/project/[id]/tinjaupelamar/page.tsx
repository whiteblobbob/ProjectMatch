import { Suspense } from "react";

import { fetchProjectApplications } from "@/app/actions/project";
import { ActivityError, ActivitySkeleton } from "../../../../components/activity/activity-states";
import TinjauPelamarView from "../../../../components/activity/kelola/tinjau-pelamar-view";
import Navbar from "../../../../components/navigation-bar/guestnavbar";
import { loadOwnedProject } from "../../../../lib/ui/kelola-project";

type TinjauPelamarPageProps = {
  params: Promise<{ id: string }>;
};

export default function TinjauPelamarPage({ params }: TinjauPelamarPageProps) {
  return (
    <Suspense fallback={<ActivitySkeleton />}>
      <TinjauPelamarAccess params={params} />
    </Suspense>
  );
}

async function TinjauPelamarAccess({ params }: TinjauPelamarPageProps) {
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
      <TinjauPelamarView project={project} applications={applications.data} />
    </>
  );
}
