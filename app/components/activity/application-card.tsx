import Link from "next/link";
import type { ActiveApplication } from "@/app/lib/activity";
import StatusBadge from "./status-badge";

export default function ApplicationCard({ application }: { application: ActiveApplication }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">{application.categoryName}</p>
          <h3 className="mt-1 text-base font-bold text-slate-950">{application.roleName}</h3>
          <p className="mt-1 text-sm text-slate-600">
            {application.projectTitle}
            {application.ownerName ? ` · ${application.ownerName}` : ""}
          </p>
        </div>
        <StatusBadge tone="attention">Menunggu</StatusBadge>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
        <span>{application.onSite ? "On-site" : "Remote"}</span>
        <span>{application.workHoursPerWeek} jam/minggu</span>
      </div>
      <Link
        href="/projectdetail"
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition-colors hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
      >
        Lihat proyek
      </Link>
    </article>
  );
}
