import Link from "next/link";
import { ArrowRightIcon } from "../ui/icons";

export default function KelolaPelamar() {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-indigo-500 text-sm font-bold text-white shadow-sm">
            JK
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-950">Joshua Kevin</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Baru</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">Universitas Primakara · UI/UX Designer</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
              <span>8 jam/minggu</span>
              <span>Portofolio tersedia</span>
            </div>
          </div>
        </div>

        <Link
          href="/aktivitas/kelolapostingan/tinjaupelamar"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          Tinjau pengajuan
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
