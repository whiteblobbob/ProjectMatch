"use client";

import { useEffect, useId, useRef } from "react";
import { WarningIcon, XIcon } from "./icons";

type DestructiveConfirmationDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  note?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DestructiveConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  note,
  onCancel,
  onConfirm,
}: DestructiveConfirmationDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => cancelButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), [href]"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
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
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button type="button" aria-label="Tutup dialog" tabIndex={-1} onClick={onCancel} className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative w-full rounded-t-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.25)] outline-none sm:max-w-[480px] sm:rounded-3xl sm:p-7"
      >
        <button type="button" onClick={onCancel} aria-label="Tutup dialog" className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
          <XIcon className="size-5" />
        </button>

        <span className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <WarningIcon className="size-6" />
        </span>
        <div className="mt-5 pr-8">
          <h2 id={titleId} className="text-xl font-bold tracking-tight text-slate-950">{title}</h2>
          <p id={descriptionId} className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>

        {note && <p className="mt-4 rounded-xl bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-800">{note}</p>}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button ref={cancelButtonRef} type="button" onClick={onCancel} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
            Batal
          </button>
          <button type="button" onClick={onConfirm} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
