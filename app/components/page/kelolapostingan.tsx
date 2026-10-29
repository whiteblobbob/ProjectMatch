import Link from "next/link";

import Aktivitasinvitasicard from "../card/aktivitasinvitasicard";
import Aktivitasmeetingcard from "../card/aktivitasmeetingcard";
import Aktivitasmembercard from "../card/aktivitasmembercard";
import Aktivitaspelamarcard from "../card/aktivitaspelamarcard";
import Aktivitasposisiterbukacard from "../card/aktivitasposisiterbukacard";
import KelolaStatusPostingan from "../card/aktivitasstatuspostingan";
import Projectcarddisabledyek from "../card/projectcarddisabled";
import Breadcrumbs from "../ui/breadcrumbs";

export default function KelolaPostingan() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Aktivitas", href: "/activity" },
              { label: "Kelola postingan" },
            ]}
          />

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-primary">EcoTrack · UINIC 2026</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Kelola postingan</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Pantau posisi yang dibuka, tinjau pelamar, dan siapkan langkah pertama bersama timmu.
              </p>
            </div>
            <Link
              href="/activity/kelolapostingan/posisi"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              Edit postingan
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Projectcarddisabledyek />

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-12">
          <div className="space-y-7 lg:col-span-8">
            <section aria-labelledby="open-position-heading">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 id="open-position-heading" className="text-lg font-bold text-slate-950">Posisi terbuka</h2>
                <span className="text-sm text-slate-500">1 posisi</span>
              </div>
              <Aktivitasposisiterbukacard />
            </section>

            <section aria-labelledby="applicants-heading">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 id="applicants-heading" className="text-lg font-bold text-slate-950">Pelamar terbaru</h2>
                  <p className="mt-1 text-sm text-slate-500">Tinjau kecocokan kandidat sebelum mengundang mereka ke tim.</p>
                </div>
                <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-primary">1 baru</span>
              </div>
              <Aktivitaspelamarcard />
            </section>
          </div>

          <aside className="space-y-4 lg:col-span-4" aria-label="Informasi pendukung proyek">
            <Aktivitasmeetingcard />
            <Aktivitasinvitasicard />
            <Aktivitasmembercard />
            <KelolaStatusPostingan />
          </aside>
        </div>
      </div>
    </main>
  );
}
