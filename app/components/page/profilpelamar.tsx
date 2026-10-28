import Link from "next/link";

import Breadcrumbs from "../ui/breadcrumbs";
import { ArrowLeftIcon, CheckIcon, ClockIcon, ExternalLinkIcon, MapPinIcon, UsersIcon } from "../ui/icons";

const skills = ["Figma", "User flow", "Prototype", "Riset pengguna"];

export default function ProfilPelamar() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Aktivitas", href: "/aktivitas" },
              { label: "Kelola postingan", href: "/aktivitas/kelolapostingan" },
              { label: "Tinjau pelamar", href: "/aktivitas/kelolapostingan/tinjaupelamar" },
              { label: "Profil Joshua" },
            ]}
          />

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-primary">Calon anggota · UI/UX Designer</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Profil pelamar</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Kenali pengalaman, keahlian, dan kesiapan kandidat sebelum mengambil keputusan.
              </p>
            </div>
            <Link
              href="/aktivitas/kelolapostingan/tinjaupelamar"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <ArrowLeftIcon className="size-4" />
              Kembali meninjau
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1180px] items-start gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-12 lg:px-8">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-8">
          <div className="bg-gradient-to-r from-brand-soft via-white to-indigo-50 p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-indigo-500 text-2xl font-bold text-white shadow-sm">
                JK
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-950">Joshua Kevin</h2>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">Terverifikasi sebagai pelajar</span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-700">Universitas Primakara</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><MapPinIcon className="size-3.5" />Denpasar, Bali</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">UI/UX Designer yang tertarik pada produk pendidikan dan lingkungan.</p>
              </div>
            </div>
          </div>

          <div className="space-y-7 p-5 sm:p-7">
            <section aria-labelledby="about-applicant">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tentang</p>
              <h3 id="about-applicant" className="mt-2 text-lg font-bold text-slate-950">Merancang pengalaman yang jelas dan mudah diuji</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Saya terbiasa menyusun user flow, wireframe, dan prototipe interaktif di Figma. Saya ingin mengembangkan kemampuan riset pengguna melalui proyek kolaboratif lintas kampus.
              </p>
            </section>

            <section aria-labelledby="applicant-skills">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Keahlian yang dapat dikontribusikan</p>
              <h3 id="applicant-skills" className="sr-only">Daftar keahlian</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section aria-labelledby="portfolio-heading" className="rounded-2xl border border-slate-200 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Portofolio pilihan</p>
                  <h3 id="portfolio-heading" className="mt-1 text-base font-bold text-slate-950">Eco Flow — aplikasi kebiasaan ramah lingkungan</h3>
                  <p className="mt-1 text-sm text-slate-500">User flow, wireframe, dan prototype interaktif</p>
                </div>
                <button
                  type="button"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:bg-brand-soft hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  Lihat karya
                  <ExternalLinkIcon className="size-4" />
                </button>
              </div>
            </section>
          </div>
        </article>

        <aside className="space-y-4 lg:col-span-4" aria-label="Ringkasan profil pelamar">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Kesiapan berkolaborasi</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ClockIcon className="size-4" /></span>
                <div><p className="text-sm font-bold text-slate-950">8 jam/minggu</p><p className="mt-0.5 text-xs leading-5 text-slate-500">Sesuai kebutuhan proyek ±6 jam</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-primary"><UsersIcon className="size-4" /></span>
                <div><p className="text-sm font-bold text-slate-950">Terbuka untuk tim lintas kampus</p><p className="mt-0.5 text-xs leading-5 text-slate-500">Lebih nyaman berkolaborasi secara daring</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><CheckIcon className="size-4" /></span>
                <div><p className="text-sm font-bold text-slate-950">Portofolio tersedia</p><p className="mt-0.5 text-xs leading-5 text-slate-500">Satu karya relevan telah ditambahkan</p></div>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Privasi kontak</p>
            <h3 className="mt-1 text-sm font-bold text-slate-950">Kontak belum ditampilkan</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Email atau kanal komunikasi tersedia setelah Joshua menerima undangan ke tim.</p>
          </article>
        </aside>
      </div>
    </main>
  );
}
