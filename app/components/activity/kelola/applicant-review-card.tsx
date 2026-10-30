"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { acceptApplication, rejectApplication } from "@/app/actions/project";
import { formatRegion } from "@/app/lib/regions";
import { educationLevelLabel } from "@/app/lib/ui/profile";
import type { ProjectApplication } from "@/app/lib/ui/kelola-project";
import DestructiveConfirmationDialog from "../../ui/destructive-confirmation-dialog";
import { CheckIcon, WarningIcon } from "../../ui/icons";

export default function ApplicantReviewCard({ application }: { application: ProjectApplication }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const name = application.applicant.name?.trim() || "Kandidat";
  const initials =
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "PM";

  async function handleAccept() {
    setIsPending(true);
    setError("");

    const result = await acceptApplication(application.id);

    setIsPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  async function handleReject() {
    setIsPending(true);
    setError("");

    const result = await rejectApplication(application.id);

    setIsPending(false);
    setDialogOpen(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-indigo-500 text-base font-bold text-white shadow-sm">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-950">{name}</h2>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    Pelamar baru
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{application.applicant.institutionName || "Institusi belum diisi"}</p>
                <p className="mt-1 text-sm font-medium text-slate-700">Melamar sebagai {application.role.name}</p>
              </div>
            </div>

            <Link
              href={`/profile/${application.applicant.id}`}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:bg-brand-soft hover:text-brand-primary"
            >
              Lihat profil
            </Link>
          </div>

          <div className="grid gap-6 py-6 md:grid-cols-2">
            <section aria-labelledby={`contribution-${application.id}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Kontribusi yang ditawarkan</p>
              <h3 id={`contribution-${application.id}`} className="mt-2 text-base font-bold text-slate-950">
                {application.applicant.userRoles.map(({ role }) => role.name).join(", ") || `Melamar ${application.role.name}`}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {application.message?.trim() || "Pelamar belum menuliskan pesan."}
              </p>
            </section>

            <section aria-labelledby={`about-${application.id}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tentang pelamar</p>
              <h3 id={`about-${application.id}`} className="mt-2 text-base font-bold text-slate-950">
                {formatRegion(application.applicant.city, application.applicant.province) || "Lokasi belum diisi"}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {application.applicant.bio?.trim() || "Pelamar belum menuliskan bio."}
              </p>
            </section>
          </div>

          <section aria-labelledby={`fit-${application.id}`} className="rounded-2xl bg-slate-50 p-4 sm:p-5">
            <h3 id={`fit-${application.id}`} className="text-sm font-bold text-slate-950">Ringkasan kecocokan</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="flex items-start gap-2 rounded-xl bg-white p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckIcon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Portofolio</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {application.applicant.portfolioLink ? "Tersedia" : "Belum ada"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-white p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckIcon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Komitmen</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {application.applicant.avgCommitmentScore.toFixed(1)}/5
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-white p-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <WarningIcon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Prasyarat</p>
                  <p className="mt-0.5 text-xs text-slate-500">{educationLevelLabel(application.applicant.educationLevel) ?? "Perlu diperiksa"}</p>
                </div>
              </div>
            </div>
          </section>

          {error ? (
            <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-3.5 py-3 text-sm font-medium text-rose-700">
              {error}
            </p>
          ) : null}
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-xs leading-5 text-slate-500">
              Menerima pengajuan ini akan langsung menambahkan {name} ke tim.
            </p>
            <div className="flex gap-2 sm:shrink-0">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setDialogOpen(true)}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:cursor-wait disabled:opacity-70 sm:flex-none"
              >
                Tolak
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleAccept}
                className="inline-flex min-h-11 flex-[1.5] items-center justify-center rounded-xl bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70 sm:flex-none"
              >
                {isPending ? "Memproses…" : "Terima ke tim"}
              </button>
            </div>
          </div>
        </div>
      </article>

      <DestructiveConfirmationDialog
        open={dialogOpen}
        title={`Tolak pengajuan ${name}?`}
        description="Pelamar tidak akan melanjutkan ke tahap berikutnya untuk posisi ini."
        note="Pastikan kamu sudah meninjau kontribusi, komitmen waktu, dan portofolionya sebelum mengambil keputusan."
        confirmLabel="Ya, tolak"
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleReject}
      />
    </>
  );
}
