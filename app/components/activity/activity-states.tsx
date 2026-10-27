export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-600">
      {children}
    </div>
  );
}

export function ActivityError() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
      <div role="alert" className="rounded-xl border border-red-200 bg-white px-5 py-6">
        <h1 className="text-lg font-bold text-slate-950">Aktivitas belum dapat dimuat</h1>
        <p className="mt-2 text-sm text-slate-600">Coba muat ulang halaman. Data aktivitasmu tetap aman.</p>
      </div>
    </main>
  );
}

export function ActivitySkeleton() {
  return (
    <main className="mx-auto w-full max-w-[1240px] animate-pulse px-4 py-8 sm:px-6 lg:px-8" aria-label="Memuat aktivitas">
      <div className="h-8 w-36 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-200" />
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => <div key={item} className="h-20 rounded-xl bg-slate-200" />)}
      </div>
      <div className="mt-10 h-6 w-44 rounded bg-slate-200" />
      <div className="mt-4 h-28 rounded-xl bg-slate-200" />
      <div className="mt-10 h-6 w-40 rounded bg-slate-200" />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-72 rounded-xl bg-slate-200" />
        <div className="h-72 rounded-xl bg-slate-200" />
      </div>
    </main>
  );
}
