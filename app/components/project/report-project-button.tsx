"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";

import { reportProject } from "@/app/actions/project";
import { CheckIcon, WarningIcon, XIcon } from "../ui/icons";

const reportReasons = [
  "Informasi proyek mencurigakan atau penipuan",
  "Lokasi pertemuan tidak aman",
  "Identitas pembuat tidak sesuai",
  "Konten tidak pantas",
  "Alasan lainnya",
];

export default function ReportProjectButton({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => cancelRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input, textarea"));
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
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const reason = String(formData.get("reportReason") ?? "");
    const details = String(formData.get("reportDetails") ?? "").trim();

    setIsPending(true);
    const result = await reportProject({ projectId, reason, details: details || undefined });
    setIsPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
    setOpen(false);
  }

  if (submitted) {
    return (
      <div role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700">
        <CheckIcon className="size-4" /> Laporan diterima untuk ditinjau
      </div>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
        <WarningIcon className="size-4" /> Laporkan postingan
      </button>

      {open ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <button type="button" aria-label="Tutup dialog laporan" tabIndex={-1} onClick={() => setOpen(false)} className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" />
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-[520px] sm:rounded-3xl sm:p-7">
            <button type="button" aria-label="Tutup" onClick={() => setOpen(false)} className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"><XIcon className="size-5" /></button>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><WarningIcon className="size-6" /></span>
            <h2 id={titleId} className="mt-5 pr-10 text-xl font-bold text-slate-950">Laporkan postingan ini?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Laporan membantu menjaga ProjectMatch aman bagi pelajar dan mahasiswa.</p>

            <form onSubmit={handleSubmit} className="mt-5">
              <fieldset>
                <legend className="text-sm font-semibold text-slate-900">Pilih alasan</legend>
                <div className="mt-3 space-y-2">
                  {reportReasons.map((reason, index) => (
                    <label key={reason} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 text-sm leading-5 text-slate-700 hover:bg-slate-50 has-checked:border-rose-300 has-checked:bg-rose-50">
                      <input type="radio" name="reportReason" value={reason} required defaultChecked={index === 0} disabled={isPending} className="mt-0.5 size-4 accent-rose-600" />
                      {reason}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="mt-4 block">
                <span className="text-sm font-semibold text-slate-900">Detail tambahan <span className="font-normal text-slate-400">(opsional)</span></span>
                <textarea name="reportDetails" rows={3} maxLength={500} disabled={isPending} placeholder="Jelaskan hal yang membuatmu merasa tidak aman atau curiga." className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100" />
              </label>

              {error ? (
                <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-3.5 py-3 text-xs font-medium text-rose-700">{error}</p>
              ) : null}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button ref={cancelRef} type="button" onClick={() => setOpen(false)} disabled={isPending} className="min-h-11 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">Batal</button>
                <button type="submit" disabled={isPending} className="min-h-11 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">{isPending ? "Mengirim…" : "Kirim laporan"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
