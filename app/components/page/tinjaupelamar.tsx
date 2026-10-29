import Aktivitastinjaupelamar from "../../components/card/aktivitastinjaupelamar";
import Breadcrumbs from "../ui/breadcrumbs";
import { CalendarIcon, ClockIcon, UsersIcon, VideoIcon } from "../ui/icons";

export default function TinjauPelamar() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Aktivitas", href: "/activity" },
              { label: "Kelola postingan", href: "/activity/kelolapostingan" },
              { label: "Tinjau pelamar" },
            ]}
          />

          <div className="mt-5">
            <p className="text-sm font-semibold text-brand-primary">EcoTrack · UI/UX Designer</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Tinjau pelamar</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Cocokkan kontribusi, komitmen waktu, dan persyaratan sebelum mengundang calon anggota.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1180px] items-start gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-12 lg:px-8">
        <section className="lg:col-span-8" aria-label="Detail pelamar">
          <Aktivitastinjaupelamar />
        </section>

        <aside className="space-y-4 lg:col-span-4" aria-label="Konteks proyek dan pertemuan">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Proyek</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">EcoTrack</h2>
                <p className="mt-1 text-sm text-slate-500">UINIC 2026 · Kompetisi</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Aktif</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <UsersIcon className="size-4 text-slate-400" />
                <p className="mt-2 text-xs text-slate-500">Tim</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">2 dari 3</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <ClockIcon className="size-4 text-slate-400" />
                <p className="mt-2 text-xs text-slate-500">Komitmen</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">±6 jam/minggu</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <VideoIcon className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Jika bergabung</p>
                <h2 className="mt-0.5 text-sm font-bold text-slate-950">Pertemuan pertama</h2>
              </div>
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-900">Perkenalan dan pembagian peran</p>
            <div className="mt-3 space-y-2.5 text-sm text-slate-600">
              <p className="flex items-center gap-2"><CalendarIcon className="size-4 text-slate-400" />28 Okt 2026</p>
              <p className="flex items-center gap-2"><ClockIcon className="size-4 text-slate-400" />19.00–20.00 WITA</p>
              <p className="flex items-center gap-2"><VideoIcon className="size-4 text-slate-400" />Zoom</p>
            </div>
            <p className="mt-4 rounded-xl bg-brand-soft p-3 text-xs leading-5 text-brand-secondary">
              Tautan pertemuan hanya diberikan setelah calon anggota menerima undangan.
            </p>
          </article>
        </aside>
      </div>
    </main>
  );
}
