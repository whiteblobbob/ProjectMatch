import Link from "next/link";

import { ShieldCheckIcon } from "../ui/icons";

type VerificationGateProps = {
  title?: string;
  message?: string;
};

export default function VerificationGate({
  title = "Verifikasi dulu untuk melanjutkan",
  message = "Hanya pelajar atau mahasiswa terverifikasi yang dapat membuat proyek dan melamar. Verifikasi email sekolah atau kampusmu terlebih dahulu.",
}: VerificationGateProps) {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-12 sm:px-6">
      <section
        role="note"
        aria-labelledby="verification-gate-title"
        className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm sm:p-8"
      >
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <ShieldCheckIcon className="size-6" />
        </span>
        <h1 id="verification-gate-title" className="mt-4 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
        <Link
          href="/profil"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          Verifikasi sekarang
        </Link>
      </section>
    </main>
  );
}
