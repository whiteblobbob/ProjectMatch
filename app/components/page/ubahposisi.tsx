"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import Breadcrumbs from "../ui/breadcrumbs";
import { ArrowLeftIcon, CheckIcon, MapPinIcon, VideoIcon, WarningIcon, UsersIcon } from "../ui/icons";
import { SelectControl } from "../ui/select-control";

type CollaborationMode = "Daring" | "Luring" | "Hybrid";

export default function UbahPosisi() {
  const [saved, setSaved] = useState(false);
  const [collaborationMode, setCollaborationMode] = useState<CollaborationMode>("Daring");
  const [hasCustomRequirements, setHasCustomRequirements] = useState(true);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[980px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Aktivitas", href: "/aktivitas" },
              { label: "Kelola postingan", href: "/aktivitas/kelolapostingan" },
              { label: "Ubah postingan" },
            ]}
          />
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-primary">EcoTrack · UINIC 2026</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Ubah postingan</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Atur kebutuhan posisi dan detail pertemuan agar calon anggota memahami cara mereka akan belajar dan berkolaborasi bersama tim.
              </p>
            </div>
            <Link
              href="/aktivitas/kelolapostingan"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <ArrowLeftIcon className="size-4" /> Kembali
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[980px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {saved ? (
          <div role="status" className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"><CheckIcon className="size-4" /></span>
            <div><p className="text-sm font-bold">Perubahan berhasil disimpan</p><p className="mt-1 text-xs leading-5">Detail postingan telah diperbarui.</p></div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-primary"><UsersIcon className="size-5" /></span>
              <div><h2 className="text-xl font-bold text-slate-950">Detail posisi</h2><p className="mt-1 text-sm text-slate-500">Saat ini tersedia 1 tempat di tim.</p></div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Nama peran</span>
                <input defaultValue="UI/UX Designer" required className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Jumlah anggota</span>
                <SelectControl defaultValue="1" containerClassName="mt-2" className="rounded-xl">
                  <option value="1">1 orang</option>
                  <option value="2">2 orang</option>
                  <option value="3">3 orang</option>
                </SelectControl>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Kontribusi yang dibutuhkan</span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">Gunakan tugas yang jelas dan cocok untuk proses belajar siswa atau mahasiswa.</span>
              <textarea defaultValue="Merancang user flow, tiga layar utama, dan prototipe di Figma untuk diuji bersama tim." rows={4} required className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Mode kolaborasi</span>
                <SelectControl value={collaborationMode} onChange={(event) => setCollaborationMode(event.target.value as CollaborationMode)} containerClassName="mt-2" className="rounded-xl">
                  <option>Daring</option><option>Luring</option><option>Hybrid</option>
                </SelectControl>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-900">Komitmen belajar per minggu</span>
                <input defaultValue="6 jam/minggu" required className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
              </label>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5" aria-labelledby="meeting-detail-heading">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-primary shadow-sm">
                  {collaborationMode === "Luring" ? <MapPinIcon className="size-5" /> : <VideoIcon className="size-5" />}
                </span>
                <div>
                  <h3 id="meeting-detail-heading" className="text-base font-bold text-slate-950">Detail pertemuan pertama</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Field menyesuaikan mode {collaborationMode.toLowerCase()} yang dipilih.</p>
                </div>
              </div>

              {(collaborationMode === "Daring" || collaborationMode === "Hybrid") ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">Platform pertemuan</span>
                    <SelectControl defaultValue="Google Meet" containerClassName="mt-2" className="rounded-xl">
                      <option>Google Meet</option><option>Zoom</option><option>Microsoft Teams</option><option>Discord</option>
                    </SelectControl>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">Tautan pertemuan</span>
                    <input type="url" required placeholder="https://meet.google.com/..." className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
                  </label>
                </div>
              ) : null}

              {(collaborationMode === "Luring" || collaborationMode === "Hybrid") ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">Kategori tempat aman</span>
                    <SelectControl defaultValue="" required containerClassName="mt-2" className="rounded-xl">
                      <option value="" disabled>Pilih kategori</option>
                      <option>Sekolah</option><option>Kampus</option><option>Ruang publik</option><option>Kafe</option>
                    </SelectControl>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">Tautan Google Maps</span>
                    <input type="url" required placeholder="https://maps.google.com/..." className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
                  </label>
                </div>
              ) : null}

              <label className="mt-4 block">
                <span className="text-sm font-semibold text-slate-900">Deskripsi dan petunjuk pertemuan</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">Berikan patokan yang jelas tanpa membagikan informasi pribadi atau alamat rumah.</span>
                <textarea key={collaborationMode} defaultValue={collaborationMode === "Daring" ? "Masuk 10 menit lebih awal untuk perkenalan dan pembagian peran." : "Bertemu di area taman kampus, dekat perpustakaan utama."} rows={3} required className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
              </label>

              {(collaborationMode === "Luring" || collaborationMode === "Hybrid") ? (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-amber-900">
                  <WarningIcon className="mt-0.5 size-5 shrink-0" />
                  <p className="text-xs leading-5">Gunakan sekolah, kampus, ruang publik, atau kafe yang dapat diverifikasi. Jangan mengarahkan calon anggota ke rumah pribadi atau tempat sepi.</p>
                </div>
              ) : null}
            </section>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Alat kolaborasi <span className="font-normal text-slate-400">(opsional)</span></span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">Kosongkan jika belum ditentukan. Kamu dapat menambahkannya nanti.</span>
              <input defaultValue="Figma, Google Drive" placeholder="Contoh: Figma, Google Drive, Notion" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
            </label>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5" aria-labelledby="edit-requirements-heading">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="edit-requirements-heading" className="text-lg font-bold text-slate-950">
                    Persyaratan tambahan <span className="text-sm font-normal text-slate-400">(opsional)</span>
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Tambahkan hanya jika proyek memiliki ketentuan khusus di luar jenjang pelajar yang sudah dipilih.
                  </p>
                </div>
                <label className="relative inline-flex min-h-11 shrink-0 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={hasCustomRequirements}
                    onChange={(event) => setHasCustomRequirements(event.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-brand-primary peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary peer-focus-visible:ring-offset-2 after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" aria-hidden="true" />
                  <span className="sr-only">Aktifkan persyaratan tambahan</span>
                </label>
              </div>

              {hasCustomRequirements ? (
                <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">Daftar persyaratan</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">Tulis satu persyaratan pada setiap baris.</span>
                    <textarea
                      defaultValue={"Pelajar SMA/SMK atau mahasiswa aktif\nBersedia mengikuti pertemuan awal"}
                      rows={4}
                      required
                      placeholder={"Contoh:\nPelajar SMA/SMK atau mahasiswa aktif\nBersedia mengikuti pertemuan awal"}
                      className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">Tautan sumber <span className="font-normal text-slate-400">(opsional)</span></span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">Gunakan jika persyaratan berasal dari penyelenggara, sekolah, kampus, atau organisasi tertentu.</span>
                    <input
                      type="url"
                      placeholder="https://..."
                      className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </label>
                </div>
              ) : null}
            </section>

            <aside className="rounded-2xl bg-brand-soft p-4 sm:p-5">
              <p className="text-sm font-bold text-slate-950">Tips membuat posisi yang ramah pelajar</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li className="flex gap-2"><CheckIcon className="mt-1 size-4 shrink-0 text-brand-primary" />Jelaskan kontribusi yang dapat dipelajari, bukan hanya hasil akhirnya.</li>
                <li className="flex gap-2"><CheckIcon className="mt-1 size-4 shrink-0 text-brand-primary" />Gunakan komitmen waktu yang realistis untuk jadwal sekolah atau kuliah.</li>
              </ul>
            </aside>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
            <Link href="/aktivitas/kelolapostingan" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Batal</Link>
            <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-primary px-6 text-sm font-semibold text-white hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">Simpan perubahan</button>
          </div>
        </form>
      </div>
    </main>
  );
}
