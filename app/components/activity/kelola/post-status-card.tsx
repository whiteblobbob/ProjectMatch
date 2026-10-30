"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { completeProject } from "@/app/actions/project";
import DestructiveConfirmationDialog from "../../ui/destructive-confirmation-dialog";

type PostStatusCardProps = {
  projectId: string;
  status: "OPEN_RECRUITMENT" | "IN_PROGRESS" | "COMPLETED";
};

export default function PostStatusCard({ projectId, status }: PostStatusCardProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const isCompleted = status === "COMPLETED";
  const canComplete = status === "IN_PROGRESS";

  async function handleComplete() {
    setIsPending(true);
    setError("");

    const result = await completeProject(projectId);

    setIsPending(false);

    if (!result.success) {
      setError(result.error);
      setDialogOpen(false);
      return;
    }

    setDialogOpen(false);
    router.refresh();
  }

  return (
    <>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status proyek</p>
            <h3 className="mt-1 text-sm font-bold text-slate-950">
              {isCompleted ? "Selesai" : canComplete ? "Sedang berjalan" : "Aktif dan dapat ditemukan"}
            </h3>
          </div>
          <span className={`relative flex size-3 ${!isCompleted && !canComplete ? "animate-pulse" : ""}`}>
            <span
              className={`relative inline-flex size-3 rounded-full ${
                isCompleted ? "bg-slate-400" : canComplete ? "bg-blue-500" : "bg-emerald-500"
              }`}
            />
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {isCompleted
            ? "Proyek telah selesai dan tersimpan di riwayat."
            : canComplete
              ? "Semua posisi terisi. Tandai proyek selesai setelah kolaborasi usai."
              : "Proyek tampil di Jelajah hingga seluruh posisi terisi atau proyek ditandai selesai."}
        </p>

        {canComplete ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => setDialogOpen(true)}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-brand-primary px-4 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-wait disabled:opacity-70"
          >
            Selesaikan proyek
          </button>
        ) : null}

        {error ? (
          <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3.5 py-3 text-xs font-medium text-rose-700">
            {error}
          </p>
        ) : null}
      </article>

      <DestructiveConfirmationDialog
        open={dialogOpen}
        title="Selesaikan proyek ini?"
        description="Proyek akan ditandai selesai dan tidak lagi menerima pengajuan."
        note="Pelamar, anggota, dan riwayat proyek tetap tersimpan. Anggota dan pembuat proyek akan menerima kredit proyek selesai."
        confirmLabel="Ya, selesaikan"
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleComplete}
      />
    </>
  );
}
