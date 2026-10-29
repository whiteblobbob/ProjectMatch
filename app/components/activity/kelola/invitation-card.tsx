import { ClockIcon } from "../../ui/icons";

export default function InvitationCard() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
          <ClockIcon className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Undangan</p>
          <h3 className="mt-0.5 text-sm font-bold text-slate-950">Tidak ada yang menunggu</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Penerimaan pelamar saat ini langsung menambahkan mereka ke tim.
          </p>
        </div>
      </div>
    </article>
  );
}
