import Link from "next/link";
import type { CompletedProject } from "@/app/actions/activity";
import { getCollaborationModeLabel } from "@/app/components/ui/collaboration-mode";
import ProjectStatusBadge from "./project-status-badge";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function CompletedProjectCard({ project }: { project: CompletedProject }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <ProjectStatusBadge status="COMPLETED" />
          <h3 className="mt-3 truncate text-lg font-bold text-slate-950">{project.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{project.categoryName}</p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {project.viewerRole === "OWNER" ? "Pembuat proyek" : `Peranmu: ${project.memberRoleName ?? "Anggota"}`}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 text-sm">
        <div>
          <dt className="text-xs text-slate-500">Mode kolaborasi</dt>
          <dd className="mt-0.5 font-medium text-slate-800">{getCollaborationModeLabel(project.collaborationMode)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Komitmen</dt>
          <dd className="mt-0.5 font-medium text-slate-800">{project.workHoursPerWeek} jam/minggu</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Tim</dt>
          <dd className="mt-0.5 font-medium text-slate-800">{project.memberCount} anggota</dd>
        </div>
        {project.deadline && (
          <div>
            <dt className="text-xs text-slate-500">Tenggat</dt>
            <dd className="mt-0.5 font-medium text-slate-800">{dateFormatter.format(project.deadline)}</dd>
          </div>
        )}
      </dl>

      <Link
        href={`/activity/project/${project.id}`}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-brand-primary bg-white px-4 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
      >
        Lihat riwayat
      </Link>
    </article>
  );
}
