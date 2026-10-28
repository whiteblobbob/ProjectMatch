import Link from "next/link";
import { Suspense } from "react";
import ActivityItem from "../components/activity/activity-item";
import ApplicationCard from "../components/activity/application-card";
import ActivitySection from "../components/activity/activity-section";
import { ActivityError, ActivitySkeleton, EmptyState } from "../components/activity/activity-states";
import ProjectPostCard from "../components/activity/project-post-card";
import LoginRequired from "../components/auth/login-required";
import Navbar from "../components/navigation-bar/guestnavbar";
import { getActivityOverview } from "../lib/ui/activity";
import { getSessionUser } from "../lib/ui/session";

export default function AktivitasPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<ActivitySkeleton />}>
        <AktivitasAccess />
      </Suspense>
    </>
  );
}

async function AktivitasAccess() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <LoginRequired
        area="Aktivitas"
        returnTo="/aktivitas"
        description="Masuk untuk memantau lamaran, undangan tim, dan perkembangan proyekmu di satu tempat."
      />
    );
  }

  const result = await getActivityOverview(user.id)
    .then((data) => ({ data, error: null }))
    .catch((error: unknown) => ({ data: null, error }));

  if (!result.data) {
    console.error("Failed to load activity overview", result.error);
    return <ActivityError />;
  }

  return <AktivitasContent data={result.data} />;
}

function AktivitasContent({ data }: { data: Awaited<ReturnType<typeof getActivityOverview>> }) {
  const summary = [
    { label: "Perlu respons", value: data.incomingApplications.length, attention: true },
    { label: "Lamaran aktif", value: data.activeApplications.length, attention: false },
    { label: "Postingan aktif", value: data.activeProjectPosts.length, attention: false },
  ];

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Aktivitas</h1>
          <p className="mt-1.5 text-sm text-slate-600 sm:text-base">Pantau lamaran, undangan, dan proyekmu.</p>
        </header>

        <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {summary.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <dt className="text-sm text-slate-600">{item.label}</dt>
              <dd className={`mt-1 text-2xl font-bold ${item.attention && item.value > 0 ? "text-accent-text" : "text-slate-950"}`}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 space-y-10">
          <ActivitySection title="Perlu respons" count={data.incomingApplications.length} attention>
            {data.incomingApplications.length > 0 ? (
              <div className="space-y-3">
                {data.incomingApplications.map((application) => (
                  <ActivityItem key={application.id} application={application} />
                ))}
              </div>
            ) : (
              <EmptyState>Belum ada aktivitas yang perlu kamu respons.</EmptyState>
            )}
          </ActivitySection>

          <ActivitySection
            title="Postingan saya"
            count={data.activeProjectPosts.length}
            action={
              <Link
                href="/aktivitas/kelolapostingan"
                className="rounded-md px-2 py-2 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-soft hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Lihat semua
              </Link>
            }
          >
            {data.activeProjectPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {data.activeProjectPosts.map((project) => (
                  <ProjectPostCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState>Kamu belum memiliki postingan aktif.</EmptyState>
            )}
          </ActivitySection>

          <ActivitySection title="Lamaran saya" count={data.activeApplications.length}>
            {data.activeApplications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {data.activeApplications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            ) : (
              <EmptyState>Kamu belum mengajukan lamaran.</EmptyState>
            )}
          </ActivitySection>
        </div>
      </div>
    </main>
  );
}
