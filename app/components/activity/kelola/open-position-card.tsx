import Link from "next/link";

import { ArrowRightIcon, UsersIcon } from "../../ui/icons";

type OpenPositionCardProps = {
  role: {
    name: string;
    slotsAvailable: number;
  };
  projectId: string;
};

export default function OpenPositionCard({ role, projectId }: OpenPositionCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
          <UsersIcon className="size-5" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-slate-950">{role.name}</h3>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              {role.slotsAvailable} posisi
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Butuh {role.slotsAvailable} anggota untuk posisi ini.
          </p>
        </div>
      </div>

      <Link
        href={`/activity/project/${projectId}/posisi`}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:bg-brand-soft hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        Ubah posisi
        <ArrowRightIcon className="size-4" />
      </Link>
    </article>
  );
}
