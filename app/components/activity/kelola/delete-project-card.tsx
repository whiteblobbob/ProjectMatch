"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteProject } from "@/app/actions/project";
import DestructiveConfirmationDialog from "../../ui/destructive-confirmation-dialog";

type DeleteProjectCardProps = {
  projectId: string;
  projectTitle: string;
};

export default function DeleteProjectCard({ projectId, projectTitle }: DeleteProjectCardProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setIsPending(true);
    setError("");

    const result = await deleteProject(projectId);

    setIsPending(false);

    if (!result.success) {
      setError(result.error);
      setDialogOpen(false);
      return;
    }

    setDialogOpen(false);
    router.push("/activity");
    router.refresh();
  }

  return (
    <>
      <article className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">Hapus proyek</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Proyek yang masih membuka rekrutmen dapat dihapus permanen beserta lamarannya.
        </p>

        <button
          type="button"
          disabled={isPending}
          onClick={() => setDialogOpen(true)}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-rose-300 px-4 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:cursor-wait disabled:opacity-70"
        >
          Hapus proyek
        </button>

        {error ? (
          <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3.5 py-3 text-xs font-medium text-rose-700">
            {error}
          </p>
        ) : null}
      </article>

      <DestructiveConfirmationDialog
        open={dialogOpen}
        title={`Hapus "${projectTitle}"?`}
        description="Proyek akan dihapus permanen dan tidak dapat dikembalikan."
        note="Semua lamaran dan data posisi pada proyek ini juga akan terhapus. Tindakan ini hanya tersedia selama rekrutmen masih dibuka."
        confirmLabel={isPending ? "Menghapus..." : "Ya, hapus"}
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
