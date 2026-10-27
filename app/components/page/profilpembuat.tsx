import Link from "next/link";

import Breadcrumbs from "../ui/breadcrumbs";
import { ArrowLeftIcon, CheckIcon, MapPinIcon, UsersIcon } from "../ui/icons";

export default function ProfilPembuat() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[960px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <Breadcrumbs items={[{ label: "Jelajah", href: "/" }, { label: "Detail postingan", href: "/projectdetail" }, { label: "Profil pembuat" }]} />
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-semibold text-brand-primary">Pembuat proyek EcoTrack</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Profil pembuat</h1></div>
            <Link href="/projectdetail" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-brand-primary hover:text-brand-primary"><ArrowLeftIcon className="size-4" /> Kembali ke postingan</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[960px] items-start gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[1fr_300px] lg:px-8">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-brand-soft via-white to-indigo-50 p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white">RA</div>
              <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-bold text-slate-950">Raka Aditya</h2><span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">Identitas pelajar terverifikasi</span></div><p className="mt-1 text-sm font-medium text-slate-700">Universitas Indonesia</p><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><MapPinIcon className="size-3.5" />Depok, Jawa Barat</p></div>
            </div>
          </div>
          <div className="space-y-7 p-5 sm:p-7">
            <section><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tentang</p><h3 className="mt-2 text-lg font-bold text-slate-950">Belajar membangun solusi lingkungan bersama tim lintas kampus</h3><p className="mt-2 text-sm leading-7 text-slate-600">Mahasiswa yang tertarik pada riset lingkungan dan pengembangan produk digital. Mengutamakan pembagian peran yang jelas serta komunikasi yang terbuka.</p></section>
            <section><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Keahlian</p><div className="mt-3 flex flex-wrap gap-2">{["Riset lingkungan", "Strategi produk", "Presentasi", "Koordinasi tim"].map((skill) => <span key={skill} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{skill}</span>)}</div></section>
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Rekam kolaborasi</p><div className="mt-4 space-y-4"><div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><CheckIcon className="size-4" /></span><div><p className="text-sm font-bold text-slate-950">1 proyek selesai</p><p className="mt-0.5 text-xs text-slate-500">Riwayat tersedia di profil</p></div></div><div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-primary"><UsersIcon className="size-4" /></span><div><p className="text-sm font-bold text-slate-950">Tim lintas kampus</p><p className="mt-0.5 text-xs leading-5 text-slate-500">Terbuka untuk siswa dan mahasiswa</p></div></div></div></article>
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="text-sm font-bold text-amber-950">Tetap lakukan verifikasi</p><p className="mt-2 text-xs leading-5 text-amber-800">Status profil membantu, tetapi selalu cocokkan identitas, tempat pertemuan, dan informasi proyek sebelum bergabung.</p></article>
        </aside>
      </div>
    </main>
  );
}
