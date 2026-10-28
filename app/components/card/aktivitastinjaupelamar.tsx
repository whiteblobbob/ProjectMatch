"use client";

import Link from "next/link";
import { useState } from "react";
import DestructiveConfirmationDialog from "../ui/destructive-confirmation-dialog";
import { CheckIcon, ExternalLinkIcon, WarningIcon } from "../ui/icons";

export default function Aktivitastinjaupelamar() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-5 sm:p-7">
        <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-indigo-500 text-base font-bold text-white shadow-sm">
              JK
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-950">Joshua Kevin</h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Pelamar baru</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">Universitas Primakara</p>
              <p className="mt-1 text-sm font-medium text-slate-700">Melamar sebagai UI/UX Designer</p>
            </div>
          </div>

          <Link
            href="/profil/joshua-kevin"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:bg-brand-soft hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Lihat profil
            <ExternalLinkIcon className="size-4" />
          </Link>
        </div>

        <div className="grid gap-6 py-6 md:grid-cols-2">
          <section aria-labelledby="contribution-heading">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Kontribusi yang ditawarkan</p>
            <h3 id="contribution-heading" className="mt-2 text-base font-bold text-slate-950">Membawa ide menjadi prototipe</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Saya bisa merancang user flow dan tiga layar utama di Figma, lalu menyiapkan prototipe untuk diuji bersama tim.
            </p>
          </section>

          <section aria-labelledby="motivation-heading">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Alasan ingin bergabung</p>
            <h3 id="motivation-heading" className="mt-2 text-base font-bold text-slate-950">Belajar bersama tim lintas institusi</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Saya ingin belajar riset pengguna dan membuat prototipe bersama tim lintas institusi.
            </p>
          </section>
        </div>

        <section aria-labelledby="fit-heading" className="rounded-2xl bg-slate-50 p-4 sm:p-5">
          <h3 id="fit-heading" className="text-sm font-bold text-slate-950">Ringkasan kecocokan</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="flex items-start gap-2 rounded-xl bg-white p-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckIcon className="size-4" /></span>
              <div><p className="text-sm font-semibold text-slate-900">Portofolio</p><p className="mt-0.5 text-xs text-slate-500">Tersedia</p></div>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-white p-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckIcon className="size-4" /></span>
              <div><p className="text-sm font-semibold text-slate-900">Komitmen</p><p className="mt-0.5 text-xs text-slate-500">8 jam/minggu</p></div>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-white p-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"><WarningIcon className="size-4" /></span>
              <div><p className="text-sm font-semibold text-slate-900">Prasyarat</p><p className="mt-0.5 text-xs text-slate-500">Perlu diperiksa</p></div>
            </div>
          </div>
        </section>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-5 py-5 sm:px-7">
        {isRejected ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-950">Pengajuan telah ditolak</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Pengajuan Joshua tidak lagi masuk dalam daftar yang perlu ditinjau.</p>
            </div>
            <span className="w-fit rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">Ditolak</span>
          </div>
        ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-xs leading-5 text-slate-500">
            Joshua resmi menjadi anggota setelah menerima undangan. Detail pertemuan akan terbuka setelah konfirmasi.
          </p>
          <div className="flex gap-2 sm:shrink-0">
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 sm:flex-none"
            >
              Tolak
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 flex-[1.5] items-center justify-center rounded-xl bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 sm:flex-none"
            >
              Undang ke tim
            </button>
          </div>
        </div>
        )}
      </div>
      </article>

    <DestructiveConfirmationDialog
      open={dialogOpen}
      title="Tolak pengajuan Joshua?"
      description="Joshua tidak akan melanjutkan ke tahap undangan untuk posisi UI/UX Designer di EcoTrack."
      note="Pastikan kamu sudah meninjau kontribusi, komitmen waktu, dan portofolionya sebelum mengambil keputusan."
      confirmLabel="Ya, tolak"
      onCancel={() => setDialogOpen(false)}
      onConfirm={() => {
        setIsRejected(true);
        setDialogOpen(false);
      }}
    />
    </>
  );
}
