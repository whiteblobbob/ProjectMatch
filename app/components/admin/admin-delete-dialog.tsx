"use client";

import { useEffect, useRef, useState } from "react";

import { deleteAdminRecord } from "../../actions/admin";
import type { AdminRow, AdminTableConfig } from "../../lib/admin/registry";
import { LoaderIcon, WarningIcon, XIcon } from "../ui/icons";

type AdminDeleteDialogProps = {
  config: AdminTableConfig;
  row: AdminRow;
  onClose: () => void;
  onDeleted: () => void;
};

const CASCADE_NOTE: Record<string, string> = {
  user: "Menghapus pengguna juga menghapus proyek, lamaran, keanggotaan, ulasan, kontak, notifikasi, dan laporan miliknya.",
  project: "Menghapus proyek juga menghapus posisi, lamaran, anggota, ulasan, dan laporan terkait proyek tersebut.",
  role: "Menghapus peran juga menghapus relasi peran pengguna, posisi proyek, lamaran, dan anggota proyek yang memakainya.",
  category: "Menghapus kategori juga menghapus seluruh proyek yang memakainya beserta posisi, lamaran, anggota, ulasan, dan laporannya.",
};

export default function AdminDeleteDialog({ config, row, onClose, onDeleted }: AdminDeleteDialogProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => cancelRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, pending]);

  const handleDelete = async () => {
    setPending(true);
    setError(null);

    const primaryKey = Object.fromEntries(
      config.primaryKey.map((key) => [key, String(row[key] ?? "")]),
    );

    const result = await deleteAdminRecord(config.key, primaryKey);
    setPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onDeleted();
  };

  const keyLabel = config.primaryKey.map((key) => `${key}: ${String(row[key] ?? "")}`).join(", ");

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Tutup dialog"
        tabIndex={-1}
        onClick={() => !pending && onClose()}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-delete-title"
        className="relative w-full rounded-t-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.25)] sm:max-w-[480px] sm:rounded-3xl sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          aria-label="Tutup dialog"
          className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
        >
          <XIcon className="size-5" />
        </button>

        <span className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <WarningIcon className="size-6" />
        </span>
        <div className="mt-5 pr-8">
          <h2 id="admin-delete-title" className="text-xl font-bold tracking-tight text-slate-950">
            Hapus data {config.label}?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Tindakan ini tidak dapat dibatalkan. Baris akan dihapus permanen dari tabel{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5">{config.key}</code>.
          </p>
          <p className="mt-3 break-all rounded-xl bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600">{keyLabel}</p>
        </div>

        {CASCADE_NOTE[config.key] ? (
          <p className="mt-4 rounded-xl bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-800">
            {CASCADE_NOTE[config.key]}
          </p>
        ) : null}

        {error ? (
          <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={pending}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {pending ? <LoaderIcon className="size-4 animate-spin" /> : null}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
