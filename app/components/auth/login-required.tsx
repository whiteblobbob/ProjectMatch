import Link from "next/link";

type Props = {
  area: "Aktivitas" | "Profil";
  description: string;
  returnTo: string;
};

export default function LoginRequired({ area, description, returnTo }: Props) {
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-blue-50 text-brand-primary" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 10V8a5 5 0 0 1 10 0v2" strokeLinecap="round" />
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M12 14v2" strokeLinecap="round" />
          </svg>
        </div>

        <p className="mt-5 text-sm font-semibold text-brand-primary">Akses khusus anggota</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Masuk untuk membuka {area}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600 sm:text-base">
          {description}
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            Kembali ke Jelajah
          </Link>
          <Link
            href={`/login?next=${encodeURIComponent(returnTo)}`}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            Masuk ke akun
          </Link>
        </div>

        <p className="mt-6 text-xs leading-5 text-slate-500">
          ProjectMatch menjaga aktivitas dan informasi profilmu tetap privat.
        </p>
      </section>
    </main>
  );
}

export function LoginRequiredFallback() {
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-slate-50 px-4 py-12" aria-label="Memeriksa sesi">
      <div className="w-full max-w-lg animate-pulse rounded-2xl border border-slate-200 bg-white px-6 py-12">
        <div className="mx-auto size-14 rounded-full bg-slate-200" />
        <div className="mx-auto mt-6 h-7 w-2/3 rounded bg-slate-200" />
        <div className="mx-auto mt-4 h-4 w-4/5 rounded bg-slate-100" />
        <div className="mx-auto mt-2 h-4 w-3/5 rounded bg-slate-100" />
        <div className="mx-auto mt-8 h-12 w-44 rounded-lg bg-slate-200" />
      </div>
    </main>
  );
}
