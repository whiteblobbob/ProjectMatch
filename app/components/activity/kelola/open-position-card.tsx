import { UsersIcon } from "../../ui/icons";

type OpenPositionCardProps = {
  role: {
    name: string;
    slotsAvailable: number;
  };
};

export default function OpenPositionCard({ role }: OpenPositionCardProps) {
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
    </article>
  );
}
