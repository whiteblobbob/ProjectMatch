"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { forgotPassword, resetPassword } from "@/app/actions/auth";

const inputClass = "mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50";
const linkClass = "font-semibold text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary";

export default function PasswordRecoveryForm({ mode, invalidLink = false }: {
  mode: "forgot" | "reset";
  invalidLink?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSent, setIsSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;
    const formData = new FormData(event.currentTarget);
    setError("");
    setFieldErrors({});

    startTransition(async () => {
      try {
        const result = mode === "forgot"
          ? await forgotPassword({ email: String(formData.get("email") ?? "") })
          : await resetPassword({
            password: String(formData.get("password") ?? ""),
            confirmPassword: String(formData.get("confirmPassword") ?? ""),
          });

        if (!result.success) {
          setError(result.error);
          setFieldErrors(result.fieldErrors ?? {});
          return;
        }

        if (mode === "forgot") {
          setIsSent(true);
          return;
        }

        window.dispatchEvent(new Event("projectmatch-auth-change"));
        router.replace("/");
        router.refresh();
      } catch {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5" aria-busy={isPending}>
      {invalidLink && !isSent && (
        <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Tautan pemulihan tidak valid atau sudah kedaluwarsa. Minta tautan baru dan buka di browser yang sama dengan saat mengajukan pemulihan.
        </p>
      )}

      {isSent ? (
        <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Jika email tersebut terdaftar, tautan pemulihan akan dikirim. Periksa kotak masuk dan folder spam, lalu buka tautan di browser ini.
        </p>
      ) : (
        <>
          {mode === "forgot" ? (
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required disabled={isPending} placeholder="nama@email.com" className={inputClass} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "email-error" : undefined} />
              {fieldErrors.email && <p id="email-error" className="mt-2 text-sm text-red-700">{fieldErrors.email.join(" ")}</p>}
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-900">Kata sandi baru</label>
                <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required disabled={isPending} className={inputClass} aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? "password-error" : undefined} />
                {fieldErrors.password && <p id="password-error" className="mt-2 text-sm text-red-700">{fieldErrors.password.join(" ")}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-900">Konfirmasi kata sandi baru</label>
                <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required disabled={isPending} className={inputClass} aria-invalid={Boolean(fieldErrors.confirmPassword)} aria-describedby={fieldErrors.confirmPassword ? "confirm-password-error" : undefined} />
                {fieldErrors.confirmPassword && <p id="confirm-password-error" className="mt-2 text-sm text-red-700">{fieldErrors.confirmPassword.join(" ")}</p>}
              </div>
            </>
          )}

          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={isPending} className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">
            {isPending ? "Sedang memproses…" : mode === "forgot" ? "Kirim tautan pemulihan" : "Simpan kata sandi baru"}
          </button>
        </>
      )}

      <p className="text-center text-sm text-slate-600">
        <Link href={mode === "forgot" ? "/login" : "/forgot-password"} className={linkClass}>
          {mode === "forgot" ? "Kembali masuk" : "Minta tautan pemulihan baru"}
        </Link>
      </p>
    </form>
  );
}
