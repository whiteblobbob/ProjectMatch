import Link from "next/link";

import { fetchAdminCounts } from "../actions/admin";
import { ArrowUpRightIcon, ShieldCheckIcon } from "../components/ui/icons";
import { ADMIN_TABLES, adminTableHref, type AdminTableGroup } from "../lib/admin/registry";
import { requireAdminUser } from "../lib/ui/admin-session";

const GROUPS: AdminTableGroup[] = ["Data master", "Proyek", "Aktivitas"];

export default async function AdminDashboardPage() {
  await requireAdminUser();

  const result = await fetchAdminCounts();
  const counts = result.success && "data" in result ? result.data : null;

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-primary">Panel administrasi</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Ringkasan data</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Setiap tabel basis data punya halaman sendiri untuk melihat dan mengelola data. Gunakan menu di samping untuk
            berpindah tabel.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:self-auto">
          <ShieldCheckIcon className="size-4" />
          Akses admin aktif
        </span>
      </header>

      <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        Peran akun (USER/ADMIN) sengaja tidak dapat diubah dari panel ini. Ubah langsung melalui basis data.
      </p>

      {counts ? (
        <div className="mt-8 space-y-8">
          {GROUPS.map((group) => (
            <section key={group} aria-labelledby={`group-${group}`}>
              <h2 id={`group-${group}`} className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                {group}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {ADMIN_TABLES.filter((table) => table.group === group).map((table) => (
                  <Link
                    key={table.key}
                    href={adminTableHref(table.key)}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-slate-950">{table.label}</p>
                        <code className="mt-0.5 block truncate text-xs text-slate-400">{table.key}</code>
                      </div>
                      <ArrowUpRightIcon className="size-4 shrink-0 text-slate-400 group-hover:text-brand-primary" />
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{table.description}</p>
                    <p className="mt-4 text-2xl font-bold text-slate-950">
                      {counts[table.key]}
                      <span className="ml-1.5 text-xs font-medium text-slate-400">baris</span>
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-bold text-red-950">Data tidak dapat dimuat</h2>
          <p className="mt-2 text-sm text-red-800">
            {result.success ? "Terjadi kesalahan saat menghitung data." : result.error}
          </p>
        </section>
      )}
    </div>
  );
}
