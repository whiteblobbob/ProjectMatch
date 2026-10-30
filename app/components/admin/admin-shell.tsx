"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  ADMIN_TABLES,
  adminTableHref,
  type AdminTableGroup,
} from "../../lib/admin/registry";
import { ArrowLeftIcon, HomeIcon, ShieldCheckIcon } from "../ui/icons";

const GROUPS: AdminTableGroup[] = ["Data master", "Proyek", "Aktivitas"];

function isActive(pathname: string, href: string) {
  return pathname === href;
}

export default function AdminShell({ email, children }: { email: string | null; children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
            <ShieldCheckIcon className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-950">Admin ProjectMatch</p>
            <p className="text-xs text-slate-500">{email ?? "Sesi tidak dikenal"}</p>
          </div>
        </div>

        <nav aria-label="Navigasi admin" className="flex-1 overflow-y-auto px-3 py-4">
          <Link
            href="/admin"
            aria-current={isActive(pathname, "/admin") ? "page" : undefined}
            className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
              isActive(pathname, "/admin")
                ? "bg-brand-soft text-brand-primary"
                : "text-slate-700 hover:bg-slate-50 hover:text-brand-primary"
            }`}
          >
            <HomeIcon className="size-4" />
            Ringkasan
          </Link>

          {GROUPS.map((group) => {
            const tables = ADMIN_TABLES.filter((table) => table.group === group);

            return (
              <div key={group} className="mt-5">
                <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{group}</p>
                <ul className="mt-2 space-y-1">
                  {tables.map((table) => {
                    const href = adminTableHref(table.key);

                    return (
                      <li key={table.key}>
                        <Link
                          href={href}
                          aria-current={isActive(pathname, href) ? "page" : undefined}
                          className={`flex min-h-10 items-center justify-between gap-2 rounded-lg px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                            isActive(pathname, href)
                              ? "bg-brand-soft font-semibold text-brand-primary"
                              : "text-slate-700 hover:bg-slate-50 hover:text-brand-primary"
                          }`}
                        >
                          <span className="truncate">{table.label}</span>
                          <code className="shrink-0 text-[11px] text-slate-400">{table.key}</code>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <Link
            href="/"
            className="flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <ArrowLeftIcon className="size-4" />
            Kembali ke situs
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="border-b border-slate-200 bg-white lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-bold text-slate-950">Admin ProjectMatch</p>
            <Link href="/" className="text-xs font-semibold text-brand-primary">
              Kembali ke situs
            </Link>
          </div>
          <nav aria-label="Navigasi admin seluler" className="flex gap-2 overflow-x-auto px-4 pb-3">
            <Link
              href="/admin"
              aria-current={isActive(pathname, "/admin") ? "page" : undefined}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold ${
                isActive(pathname, "/admin") ? "bg-brand-soft text-brand-primary" : "bg-slate-100 text-slate-700"
              }`}
            >
              Ringkasan
            </Link>
            {ADMIN_TABLES.map((table) => {
              const href = adminTableHref(table.key);

              return (
                <Link
                  key={table.key}
                  href={href}
                  aria-current={isActive(pathname, href) ? "page" : undefined}
                  className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive(pathname, href) ? "bg-brand-soft text-brand-primary" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {table.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
