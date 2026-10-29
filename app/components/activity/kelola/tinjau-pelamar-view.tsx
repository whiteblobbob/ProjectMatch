import type { ProjectApplication, ProjectDetail } from "@/app/lib/ui/kelola-project";
import { getCollaborationModeLabel } from "../../ui/collaboration-mode";
import Breadcrumbs from "../../ui/breadcrumbs";
import { CalendarIcon, ClockIcon, UsersIcon, VideoIcon } from "../../ui/icons";
import ApplicantReviewCard from "./applicant-review-card";

type TinjauPelamarViewProps = {
  project: ProjectDetail;
  applications: ProjectApplication[];
};

export default function TinjauPelamarView({ project, applications }: TinjauPelamarViewProps) {
  const memberCount = project.projectMembers.length;
  const openSlots = project.projectRoles.reduce((total, projectRole) => total + projectRole.slotsAvailable, 0);
  const capacity = memberCount + openSlots;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Aktivitas", href: "/activity" },
              { label: "Kelola postingan", href: `/activity/project/${project.id}` },
              { label: "Tinjau pelamar" },
            ]}
          />

          <div className="mt-5">
            <p className="text-sm font-semibold text-brand-primary">{project.title}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Tinjau pelamar</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Cocokkan kontribusi, komitmen waktu, dan persyaratan sebelum menambahkan calon anggota ke tim.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1180px] items-start gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-12 lg:px-8">
        <section className="space-y-5 lg:col-span-8" aria-label="Daftar pelamar">
          {applications.length > 0 ? (
            applications.map((application) => (
              <ApplicantReviewCard key={application.id} application={application} />
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-600">
              Belum ada pelamar untuk postingan ini.
            </p>
          )}
        </section>

        <aside className="space-y-4 lg:col-span-4" aria-label="Konteks proyek dan pertemuan">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Proyek</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">{project.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {project.category.name} · {getCollaborationModeLabel(project.collaborationMode)}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Aktif</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <UsersIcon className="size-4 text-slate-400" />
                <p className="mt-2 text-xs text-slate-500">Tim</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">{memberCount} dari {capacity}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <ClockIcon className="size-4 text-slate-400" />
                <p className="mt-2 text-xs text-slate-500">Komitmen</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">±{project.workHoursPerWeek} jam/minggu</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <VideoIcon className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Jika bergabung</p>
                <h2 className="mt-0.5 text-sm font-bold text-slate-950">Pertemuan pertama</h2>
              </div>
            </div>

            <div className="mt-3 space-y-2.5 text-sm text-slate-600">
              {/* Placeholder: the backend has no meeting date/time field yet. */}
              <p className="flex items-center gap-2"><CalendarIcon className="size-4 text-slate-400" />28 Okt 2026</p>
              <p className="flex items-center gap-2"><ClockIcon className="size-4 text-slate-400" />19.00–20.00 WITA</p>
            </div>
            <p className="mt-4 rounded-xl bg-brand-soft p-3 text-xs leading-5 text-brand-secondary">{project.meetDescription}</p>
          </article>
        </aside>
      </div>
    </main>
  );
}
