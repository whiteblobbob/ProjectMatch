import { Suspense } from "react";

import { fetchProjectApplications, fetchProjectPeerReviews } from "@/app/actions/project";
import { ActivityError, ActivitySkeleton } from "../../../components/activity/activity-states";
import KelolaPostinganView from "../../../components/activity/kelola/kelola-postingan-view";
import ProjectHistoryView from "../../../components/activity/project-history-view";
import ProjectWorkspaceView from "../../../components/activity/project-workspace-view";
import Navbar from "../../../components/navigation-bar/guestnavbar";
import { loadActivityProject, type ProjectApplication } from "../../../lib/ui/kelola-project";

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
  const { user, project, isOwner } = await loadActivityProject(id);

  if (project.status === "COMPLETED") {
    const reviews = await fetchProjectPeerReviews(id);

    if (!reviews.success || !("data" in reviews)) {
      console.error("Failed to load project reviews", reviews.success ? "No data" : reviews.error);
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
        <ProjectHistoryView project={project} currentUserId={user.id} reviews={reviews.data} />
      </>
    );
  }

  if (!isOwner) {
    const membership = project.projectMembers.find((member) => member.userId === user.id);

    return (
      <>
        <Navbar />
        <ProjectWorkspaceView project={project} memberRoleName={membership?.role.name ?? null} />
      </>
    );
  }

  let applications: ProjectApplication[] = [];

  if (project.status === "OPEN_RECRUITMENT") {
    const result = await fetchProjectApplications(id);

    if (!result.success || !("data" in result)) {
      console.error("Failed to load project applications", result.success ? "No data" : result.error);
      return (
        <>
          <Navbar />
          <ActivityError />
        </>
      );
    }

    applications = result.data;
  }

  return (
    <>
      <Navbar />
      <KelolaPostinganView project={project} applications={applications} />
    </>
  );
}
