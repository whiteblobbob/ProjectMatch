import { SearchIcon } from "@/app/components/ui/icons";

export function ProjectListSkeleton() {
  return (
    <div className="space-y-4" aria-label="Memuat proyek" aria-live="polite">
      {[0, 1, 2].map((item) => (
        <div key={item} className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex gap-4">
            <div className="size-12 shrink-0 rounded-lg bg-slate-200" />
            <div className="flex-1"><div className="h-5 w-1/3 rounded bg-slate-200" /><div className="mt-3 h-6 w-2/3 rounded bg-slate-200" /></div>
          </div>
          <div className="mt-5 h-10 rounded bg-slate-100" />
          <div className="mt-5 grid grid-cols-3 gap-3"><div className="h-8 rounded bg-slate-100" /><div className="h-8 rounded bg-slate-100" /><div className="h-8 rounded bg-slate-100" /></div>
        </div>
      ))}
    </div>
  );
}

export function EmptyProjectState({ filtered, onClear }: { filtered: boolean; onClear: () => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-50 text-brand-primary" aria-hidden="true">
        <SearchIcon className="size-6" />
      </div>
      <h3 className="mt-4 font-bold text-slate-950">Belum ada proyek yang sesuai</h3>
      <p className="mt-2 text-sm text-slate-600">{filtered ? "Coba ubah kata pencarian atau kurangi beberapa filter." : "Belum ada posisi terbuka. Coba kembali lagi nanti."}</p>
      {filtered && <button type="button" onClick={onClear} className="mt-5 min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Hapus filter</button>}
    </div>
  );
}
