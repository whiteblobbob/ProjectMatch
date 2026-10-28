"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login } from "@/app/actions/auth";

function safeReturnPath() {
  const requestedPath = new URLSearchParams(window.location.search).get("next");

  if (
    requestedPath &&
    requestedPath.startsWith("/") &&
    !requestedPath.startsWith("//")
  ) {
    return requestedPath;
  }

  return "/";
}

export default function LoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await login({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    if (!result.success) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    window.dispatchEvent(new Event("projectmatch-auth-change"));
    router.push(safeReturnPath());
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          placeholder="nama@email.com"
          className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="password" className="block text-sm font-semibold text-slate-900">
            Kata sandi
          </label>
          <span className="text-xs text-slate-500">Minimal 8 karakter</span>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={8}
          required
          disabled={isPending}
          placeholder="Masukkan kata sandi"
          className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
      >
        {isPending ? "Sedang masuk…" : "Masuk"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
          Daftar sekarang
        </Link>
      </p>
      <p className="text-center text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
          Kembali menjelajahi proyek
        </Link>
      </p>
    </form>
  );
}
