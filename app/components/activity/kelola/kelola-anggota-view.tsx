import Link from "next/link";

import type { ProjectDetail } from "@/app/lib/ui/kelola-project";
import MemberList from "../member-list";
import Breadcrumbs from "../../ui/breadcrumbs";
import { ArrowLeftIcon, UsersIcon } from "../../ui/icons";

export default function KelolaAnggotaView({ project }: { project: ProjectDetail }) {
  const members = project.projectMembers;
  const memberCount = members.length + 1;
  const openRoles = project.projectRoles.filter((projectRole) => projectRole.slotsAvailable > 0);
  const openSlots = openRoles.reduce((total, projectRole) => total + projectRole.slotsAvailable, 0);
  const capacity = memberCount + openSlots;
  const progress = capacity > 0 ? Math.round((memberCount / capacity) * 100) : 0;
  const canManage = project.status === "OPEN_RECRUITMENT";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1100px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Aktivitas", href: "/activity" },
              { label: "Proyek", href: `/activity/project/${project.id}` },
              { label: "Anggota" },
            ]}
          />

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-primary">{project.title}</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Anggota tim</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Kenali peran, kontribusi, dan komitmen setiap anggota agar proses belajar bersama tetap terarah.
              </p>
            </div>
            <Link
              href={`/activity/project/${project.id}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <ArrowLeftIcon className="size-4" />
              Kembali ke kelola
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="team-progress-heading">
          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
                  <UsersIcon className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Susunan tim</p>
                  <h2 id="team-progress-heading" className="mt-0.5 text-lg font-bold text-slate-950">
                    {memberCount} dari {capacity} anggota terkonfirmasi
                  </h2>
                </div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100" aria-label={`${memberCount} dari ${capacity} anggota terisi`}>
                <div className="h-full rounded-full bg-brand-primary" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {openSlots > 0 ? `Masih ada ${openSlots} tempat untuk ${openRoles.map((role) => role.roleName).join(", ")}.` : "Semua tempat sudah terisi."}
              </p>
            </div>
            {canManage ? (
              <Link
                href={`/activity/project/${project.id}/applicants`}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                Tinjau pelamar
              </Link>
            ) : null}
          </div>
        </section>

        <section className="mt-7" aria-labelledby="confirmed-members-heading">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 id="confirmed-members-heading" className="text-lg font-bold text-slate-950">Anggota terkonfirmasi</h2>
              <p className="mt-1 text-sm text-slate-500">Informasi ringkas untuk membantu pembagian kontribusi.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{memberCount} anggota</span>
          </div>

          <MemberList project={project} />
        </section>

        {canManage && openRoles.length > 0 ? (
          <section className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-5 sm:p-6" aria-labelledby="open-member-heading">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{openSlots} tempat tersedia</p>
                <h2 id="open-member-heading" className="mt-1 text-lg font-bold text-slate-950">
                  {openRoles.map((role) => role.roleName).join(", ")}
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Buka posisi ini agar calon anggota yang tepat dapat bergabung dengan tim.
                </p>
              </div>
              <Link
                href={`/activity/project/${project.id}/edit`}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-brand-primary px-4 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Ubah kebutuhan posisi
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
