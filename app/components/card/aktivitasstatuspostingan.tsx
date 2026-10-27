"use client";

import { useState } from "react";
import DestructiveConfirmationDialog from "../ui/destructive-confirmation-dialog";

export default function KelolaStatusPostingan() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  return (
    <>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status postingan</p>
            <h3 className="mt-1 text-sm font-bold text-slate-950">{isClosed ? "Ditutup" : "Aktif dan dapat ditemukan"}</h3>
          </div>
          <span className={`relative flex size-3 ${isClosed ? "" : "animate-pulse"}`}>
            <span className={`relative inline-flex size-3 rounded-full ${isClosed ? "bg-slate-400" : "bg-emerald-500"}`} />
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {isClosed ? "Postingan tidak lagi muncul di Jelajah dan tetap tersimpan di riwayat." : "Postingan tetap tersimpan di riwayat setelah ditutup."}
        </p>

        {!isClosed && (
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-rose-200 px-4 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            Tutup postingan
          </button>
        )}
      </article>

      <DestructiveConfirmationDialog
        open={dialogOpen}
        title="Tutup postingan EcoTrack?"
        description="Calon anggota tidak akan dapat menemukan atau mengajukan bergabung ke postingan ini."
        note="Pelamar, anggota, dan riwayat proyek tidak akan dihapus. Kamu dapat menemukannya kembali melalui riwayat."
        confirmLabel="Ya, tutup"
        onCancel={() => setDialogOpen(false)}
        onConfirm={() => {
          setIsClosed(true);
          setDialogOpen(false);
        }}
      />
    </>
  );
}
