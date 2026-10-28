import { Suspense } from "react";

import { getProfileView } from "../../lib/ui/actions";
import { ActivitySkeleton } from "../../components/activity/activity-states";
import Navbar from "../../components/navigation-bar/guestnavbar";
import Lamarproject from "../../components/page/lamarproject";
import { requireSessionUser } from "../../lib/ui/session";

export default function ProjectApplicationPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<ActivitySkeleton />}>
        <ProjectApplicationAccess />
      </Suspense>
    </>
  );
}

async function ProjectApplicationAccess() {
  await requireSessionUser();

  const profile = await getProfileView();

  if (!profile.success) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6" role="alert">
          <h1 className="text-xl font-bold text-red-950">Data profil belum dapat dimuat</h1>
          <p className="mt-2 text-sm text-red-800">{profile.error}</p>
        </section>
      </main>
    );
  }

  if (!("data" in profile)) {
    return null;
  }

  return <Lamarproject profile={profile.data} />;
}
