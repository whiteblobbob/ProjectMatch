import Link from "next/link";

import { ArrowLeftIcon, UsersIcon } from "./components/ui/icons";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-16">
      <div aria-hidden="true" className="absolute -left-24 top-12 size-72 rounded-full bg-blue-100/70 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-24 bottom-12 size-80 rounded-full bg-indigo-100/70 blur-3xl" />

      <section className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-200/60 sm:p-10">
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-brand-soft text-brand-primary">
          <UsersIcon className="size-10" />
        </div>

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.25em] text-brand-primary">Error 404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Halaman ini belum bergabung ke tim</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
          Tautan yang kamu buka mungkin sudah berubah atau belum tersedia. Yuk, kembali menjelajah kesempatan kolaborasi bersama pelajar dan mahasiswa lainnya.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
            <ArrowLeftIcon className="size-4" /> Kembali ke Jelajah
          </Link>
          <Link href="/activity" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:bg-brand-soft hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
            Lihat aktivitas
          </Link>
        </div>

        <div className="mt-9 border-t border-slate-100 pt-6">
          <p className="text-xs leading-5 text-slate-400">ProjectMatch · Tempat menemukan teman belajar dan berkolaborasi lintas sekolah maupun kampus.</p>
        </div>
      </section>
    </main>
  );
}
