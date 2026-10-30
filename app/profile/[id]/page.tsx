import { notFound } from "next/navigation";
import { Suspense } from "react";

import { fetchPublicProfile } from "../../actions/profile";
import { ActivitySkeleton } from "../../components/activity/activity-states";
import Navbar from "../../components/navigation-bar/guestnavbar";
import PublicProfile from "../../components/page/profilpelamar";
import { getCloudinaryCloudName } from "../../lib/cloudinary";
import { requireSessionUser } from "../../lib/ui/session";

type CandidateProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default function CandidateProfilePage({ params }: CandidateProfilePageProps) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<ActivitySkeleton />}>
        <CandidateProfileAccess params={params} />
      </Suspense>
    </>
  );
}

async function CandidateProfileAccess({ params }: CandidateProfilePageProps) {
  const { id } = await params;
  await requireSessionUser();

  const profile = await fetchPublicProfile(id);

  if (!profile.success || !("data" in profile)) {
    notFound();
  }

  return <PublicProfile profile={profile.data} cloudName={getCloudinaryCloudName()} />;
}
