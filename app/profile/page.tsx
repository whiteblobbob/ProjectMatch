import { Suspense } from "react";
import Navbar from "../components/navigation-bar/guestnavbar";
import Mainprofil from "../components/page/mainprofil";
import { ActivitySkeleton } from "../components/activity/activity-states";
import { fetchProfile } from "../actions/profile";
import { fetchRoles } from "../actions/catalog";
import { getCloudinaryCloudName } from "../lib/cloudinary";
import { toProfileView } from "../lib/ui/profile";
import { requireSessionUser } from "../lib/ui/session";

export default function ProfilPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<ActivitySkeleton />}>
        <ProfilAccess />
      </Suspense>
    </>
  );
}

async function ProfilAccess() {
  const user = await requireSessionUser();
  const [profile, roles] = await Promise.all([
    fetchProfile(),
    fetchRoles(),
  ]);

  if (!profile.success) {
    return (
      <main className="mx-auto w-full max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6" role="alert">
          <h1 className="text-xl font-bold text-red-950">Profil belum dapat dimuat</h1>
          <p className="mt-2 text-sm text-red-800">{profile.error}</p>
        </section>
      </main>
    );
  }

  if (
    !("data" in profile) ||
    !roles.success ||
    !("data" in roles)
  ) {
    return null;
  }

  return (
    <Mainprofil
      initialProfile={toProfileView(profile.data, user.email ?? "")}
      roles={roles.data}
      cloudName={getCloudinaryCloudName()}
    />
  );
}
