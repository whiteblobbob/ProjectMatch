import Link from "next/link";
import type { IncomingApplication } from "@/app/actions/activity";
import StatusBadge from "./status-badge";

export default function ActivityItem({ application }: { application: IncomingApplication }) {
  const applicantName = application.applicantName?.trim() || "Seorang kandidat";
  const initials = applicantName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 sm:p-5">
      <span className="absolute inset-y-0 left-0 w-1 bg-accent-opportunity" aria-hidden="true" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent-text" aria-hidden="true">
            {initials || "PM"}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold leading-6 text-slate-950 sm:text-base">
                {applicantName} ingin bergabung dengan {application.projectTitle}
              </h3>
              <span className="size-2 rounded-full bg-accent-opportunity" aria-label="Belum ditinjau" />
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Posisi {application.roleName}
              {application.applicantInstitution ? ` · ${application.applicantInstitution}` : ""}
            </p>
            <div className="mt-2">
              <StatusBadge tone="attention">Kamu pemilik proyek</StatusBadge>
            </div>
          </div>
        </div>
        <Link
          href={`/activity/project/${application.projectId}/applicants`}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          Tinjau pelamar
        </Link>
      </div>
    </article>
  );
}
