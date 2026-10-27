"use client";

import { useEffect, useId, useRef } from "react";
import { LoaderIcon, LogoutIcon, XIcon } from "@/app/components/ui/icons";

type LogoutConfirmationDialogProps = {
  open: boolean;
  isPending: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function LogoutConfirmationDialog({
  open,
  isPending,
  error,
  onCancel,
  onConfirm,
}: LogoutConfirmationDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const isPendingRef = useRef(isPending);

  useEffect(() => {
    isPendingRef.current = isPending;
  }, [isPending]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => cancelButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!isPendingRef.current) onCancel();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onCancel, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Tutup dialog"
        disabled={isPending}
        className="logout-dialog-backdrop absolute inset-0 bg-slate-950/55 backdrop-blur-[2px] disabled:cursor-wait"
        onClick={onCancel}
      />

      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={isPending}
        tabIndex={-1}
        className="logout-dialog-panel relative w-full max-w-[460px] rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.24)] outline-none sm:p-7"
      >
        <button
          type="button"
          aria-label="Tutup dialog"
          disabled={isPending}
          onClick={onCancel}
          className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-50"
        >
          <XIcon className="size-5" />
        </button>

        <div className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <LogoutIcon className="size-6" />
        </div>

        <div className="mt-5 pr-8">
          <h2 id={titleId} className="text-xl font-bold tracking-tight text-slate-950">
            Keluar dari ProjectMatch?
          </h2>
          <p id={descriptionId} className="mt-2 text-sm leading-6 text-slate-600">
            Kamu perlu masuk kembali untuk melihat aktivitas, mengelola postingan, dan melanjutkan kolaborasi.
          </p>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            disabled={isPending}
            onClick={onCancel}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:bg-red-500"
          >
            {isPending && (
              <LoaderIcon className="size-4 animate-spin" />
            )}
            {isPending ? "Sedang keluar…" : "Ya, keluar"}
          </button>
        </div>
      </div>
    </div>
  );
}
