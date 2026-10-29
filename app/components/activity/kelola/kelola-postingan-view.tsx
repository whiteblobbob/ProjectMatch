import Link from "next/link";

import type { ProjectApplication, ProjectDetail } from "@/app/lib/ui/kelola-project";
import Breadcrumbs from "../../ui/breadcrumbs";
import ApplicantCard from "./applicant-card";
import InvitationCard from "./invitation-card";
import MeetingCard from "./meeting-card";
import MemberCard from "./member-card";
import OpenPositionCard from "./open-position-card";
import PostStatusCard from "./post-status-card";
import ProjectSummaryCard from "./project-summary-card";

type KelolaPostinganViewProps = {
  project: ProjectDetail;
  applications: ProjectApplication[];
};

export default function KelolaPostinganView({ project, applications }: KelolaPostinganViewProps) {
  const openRoles = project.projectRoles.filter((projectRole) => projectRole.slotsAvailable > 0);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Aktivitas", href: "/activity" },
              { label: "Kelola postingan" },
            ]}
          />

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-primary">{project.title}</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Kelola postingan</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Pantau posisi yang dibuka, tinjau pelamar, dan siapkan langkah pertama bersama timmu.
              </p>
            </div>
            <Link
              href={`/activity/project/${project.id}/posisi`}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              Edit postingan
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <ProjectSummaryCard project={project} />

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-12">
          <div className="space-y-7 lg:col-span-8">
            <section aria-labelledby="open-position-heading">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 id="open-position-heading" className="text-lg font-bold text-slate-950">Posisi terbuka</h2>
                <span className="text-sm text-slate-500">{openRoles.length} posisi</span>
              </div>
              {openRoles.length > 0 ? (
                <div className="space-y-3">
                  {openRoles.map((projectRole) => (
                    <OpenPositionCard
                      key={projectRole.roleId}
                      role={{ name: projectRole.role.name, slotsAvailable: projectRole.slotsAvailable }}
                      projectId={project.id}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6 text-sm text-slate-600">
                  Semua posisi sudah terisi.
                </p>
              )}
            </section>

            <section aria-labelledby="applicants-heading">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 id="applicants-heading" className="text-lg font-bold text-slate-950">Pelamar terbaru</h2>
                  <p className="mt-1 text-sm text-slate-500">Tinjau kecocokan kandidat sebelum menambahkan mereka ke tim.</p>
                </div>
                <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-primary">
                  {applications.length} pelamar
                </span>
              </div>
              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map((application) => (
                    <ApplicantCard key={application.id} application={application} projectId={project.id} />
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6 text-sm text-slate-600">
                  Belum ada pelamar untuk postingan ini.
                </p>
              )}
            </section>
          </div>

          <aside className="space-y-4 lg:col-span-4" aria-label="Informasi pendukung proyek">
            <MeetingCard project={project} projectId={project.id} />
            <InvitationCard />
            <MemberCard project={project} projectId={project.id} />
            <PostStatusCard projectId={project.id} status={project.status} />
          </aside>
        </div>
      </div>
    </main>
  );
}
