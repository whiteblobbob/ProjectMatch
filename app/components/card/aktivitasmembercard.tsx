import Link from "next/link";
import { ArrowRightIcon, UsersIcon } from "../ui/icons";

export default function Aktivitasmembercard() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
          <UsersIcon className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tim saat ini</p>
          <h3 className="mt-0.5 text-sm font-bold text-slate-950">2 dari 3 anggota</h3>
        </div>
      </div>

      <div className="mt-4 flex -space-x-2" aria-label="Dua anggota terkonfirmasi">
        <span className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-xs font-bold text-white">RA</span>
        <span className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-xs font-bold text-white">DP</span>
        <span className="flex size-9 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white text-xs font-bold text-slate-400">+1</span>
      </div>

      <Link
        href="/aktivitas/kelolapostingan/anggota"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        Lihat anggota
        <ArrowRightIcon className="size-4" />
      </Link>
    </article>
  );
}
