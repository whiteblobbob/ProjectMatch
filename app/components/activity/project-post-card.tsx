import Link from "next/link";
import type { ActiveProjectPost } from "@/app/lib/ui/activity";
import { getCollaborationModeLabel } from "@/app/components/ui/collaboration-mode";
import StatusBadge from "./status-badge";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function ProjectPostCard({ project }: { project: ActiveProjectPost }) {
  const availableSlots = project.roles.reduce((sum, role) => sum + role.slotsAvailable, 0);
  const roleNames = project.roles.map((role) => role.name).join(", ");

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <StatusBadge tone="success">Mencari anggota</StatusBadge>
          <h3 className="mt-3 truncate text-lg font-bold text-slate-950">{project.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{project.categoryName}</p>
        </div>
        {project.applicantCount > 0 && (
          <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent-text">
            {project.applicantCount} pelamar
          </span>
        )}
      </div>

      {roleNames && <p className="mt-4 text-sm font-semibold text-slate-800">{roleNames}</p>}

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <dt className="text-xs text-slate-500">Mode kolaborasi</dt>
          <dd className="mt-0.5 font-medium text-slate-800">{getCollaborationModeLabel(project.onSite ? "ONSITE" : "REMOTE")}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Komitmen</dt>
          <dd className="mt-0.5 font-medium text-slate-800">{project.workHoursPerWeek} jam/minggu</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Tim saat ini</dt>
          <dd className="mt-0.5 font-medium text-slate-800">{project.memberCount} anggota</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Posisi tersedia</dt>
          <dd className="mt-0.5 font-medium text-slate-800">{availableSlots} slot</dd>
        </div>
        {project.deadline && (
          <div className="col-span-2">
            <dt className="text-xs text-slate-500">Tenggat lamaran</dt>
            <dd className="mt-0.5 font-medium text-slate-800">{dateFormatter.format(project.deadline)}</dd>
          </div>
        )}
      </dl>

      <Link
        href="/aktivitas/kelolapostingan"
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
      >
        Kelola postingan
      </Link>
    </article>
  );
}
