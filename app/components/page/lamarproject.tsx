import Link from "next/link";

import { ProfileView } from "@/app/lib/ui/profile";
import { decodeProfilePublicInfo } from "@/app/lib/ui/profile-public-info";
import Breadcrumbs from "../ui/breadcrumbs";
import { ExternalLinkIcon, MapPinIcon } from "../ui/icons";
import { SelectControl } from "../ui/select-control";

type LamarProjectProps = {
    profile: ProfileView;
};

export default function Lamarproject({ profile }: LamarProjectProps) {
    const publicInfo = decodeProfilePublicInfo(profile.contactInfo);

    return (
        <div
            id="wrapper"
            className="min-h-screen w-full min-w-0 bg-background "
        >
            <main className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-5 px-4 pb-6 pt-4">
                <Breadcrumbs
                    items={[
                        { label: "Jelajah", href: "/" },
                        { label: "Detail postingan", href: "/projectdetail" },
                        { label: "Ajukan bergabung" },
                    ]}
                />

                <form
                    action="/submit"
                    method="POST"
                    className="flex w-full min-w-0 flex-col gap-6"
                >
                    {/* Position applied for */}
                    <section className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-border-default bg-white p-4">
                        <p className="text-[13px] text-text-subheading">
                            EcoTrack / UINIC 2026
                        </p>

                        <h1 className="text-lg font-semibold text-text-heading">
                            UI/UX Designer
                        </h1>
                    </section>

                    {/* Applicant profile */}
                    <section className="rounded-2xl border border-border-default bg-white p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wide text-text-subheading">Data dari profil</p>
                                <h2 className="mt-1 text-base font-bold text-text-heading">{profile.name || "Profil belum lengkap"}</h2>
                                <p className="mt-1 text-[13px] leading-5 text-text-subheading">{profile.instance || "Sekolah atau kampus belum diisi"}</p>
                                <p className="mt-2 flex items-center gap-1.5 text-xs text-text-subheading">
                                    <MapPinIcon className="size-3.5" />
                                    {publicInfo.location || "Lokasi belum diisi"}
                                </p>
                            </div>

                            <Link
                                href="/profil"
                                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-brand-primary transition hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                            >
                                Ubah profil
                                <ExternalLinkIcon className="size-4" />
                            </Link>
                        </div>
                    </section>

                    {/* Application details */}
                    <section className="flex min-w-0 flex-col gap-5">
                        {/* Role selection */}
                    <div className="flex min-w-0 flex-col gap-2">
                        <label
                            htmlFor="role"
                            className="text-sm font-semibold text-text-heading"
                        >
                            Posisi yang ingin dilamar
                        </label>

                        <SelectControl
                            id="role"
                            name="role"
                            required
                            defaultValue=""
                            className="border-border-input text-text-heading focus:ring-2 focus:ring-brand-soft"
                        >
                            <option value="" disabled>
                                Pilih posisi yang kamu inginkan
                            </option>
                            <option value="UI/UX Designer">UI/UX Designer</option>
                            <option value="Frontend Developer">Frontend Developer</option>
                            <option value="Backend Developer">Backend Developer</option>
                            <option value="Fullstack Developer">Fullstack Developer</option>
                            <option value="Mobile Developer">Mobile Developer</option>
                            <option value="Data Analyst">Data Analyst</option>
                            <option value="Project Manager">Project Manager</option>
                            <option value="Other">Lainnya</option>
                        </SelectControl>

                        <p className="text-xs leading-5 text-text-subheading">
                            Pilih posisi yang paling sesuai dengan kemampuan dan kontribusimu.
                        </p>
                    </div>

                        {/* Weekly commitment */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <label
                                htmlFor="waktu"
                                className="text-sm font-semibold text-text-heading"
                            >
                                Komitmen waktu per minggu
                            </label>

                            <input
                                id="waktu"
                                name="waktu"
                                type="text"
                                required
                                placeholder="Contoh: 6–8 jam"
                                className="min-h-12 w-full min-w-0 rounded-lg border border-border-input bg-white px-3 py-2 text-sm text-text-heading placeholder:text-text-subheading focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                            />
                        </div>

                        {/* Contribution */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <label
                                htmlFor="tugas"
                                className="text-sm font-semibold text-text-heading"
                            >
                                Kontribusi apa yang bisa kamu berikan?
                            </label>

                            <textarea
                                id="tugas"
                                name="tugas"
                                required
                                rows={4}
                                placeholder="Deskripsikan kemampuan, pengalaman, dan kontribusi yang bisa kamu berikan."
                                className="w-full min-w-0 resize-y rounded-lg border border-border-input bg-white px-3 py-3 text-sm leading-5 text-text-heading placeholder:text-text-subheading focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                            />
                        </div>

                        {/* Motivation */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <label
                                htmlFor="alasan"
                                className="text-sm font-semibold text-text-heading"
                            >
                                Alasan ingin bergabung
                            </label>

                            <textarea
                                id="alasan"
                                name="alasan"
                                required
                                rows={4}
                                placeholder="Ceritakan alasanmu ingin bergabung dengan proyek ini."
                                className="w-full min-w-0 resize-y rounded-lg border border-border-input bg-white px-3 py-3 text-sm leading-5 text-text-heading placeholder:text-text-subheading focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                            />
                        </div>

                        {/* Portfolio from profile */}
                        <section className="rounded-2xl border border-border-default bg-white p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-text-subheading">Portofolio dari profil</p>
                                    {publicInfo.portfolioUrl ? (
                                        <a href={publicInfo.portfolioUrl} target="_blank" rel="noreferrer" className="mt-2 flex min-w-0 items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary">
                                            <span className="truncate">{publicInfo.portfolioUrl}</span>
                                            <ExternalLinkIcon className="size-4 shrink-0" />
                                        </a>
                                    ) : (
                                        <p className="mt-2 text-sm text-text-warning">Belum ada portofolio utama di profilmu.</p>
                                    )}
                                    <p className="mt-2 text-xs leading-5 text-text-subheading">Tautan ini otomatis disertakan bersama pengajuanmu.</p>
                                </div>
                                <Link href="/profil" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-brand-primary hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                                    {publicInfo.portfolioUrl ? "Ganti portofolio" : "Tambah portofolio"}
                                </Link>
                            </div>
                            <input type="hidden" name="portfolioLink" value={publicInfo.portfolioUrl} />
                        </section>
                    </section>

                    {/* First meeting */}
                    <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                        <h2 className="text-base font-semibold text-text-heading">
                            Pertemuan pertama
                        </h2>

                        <p className="text-[13px] leading-5 text-text-heading">
                            Perkenalan dan pembagian peran
                        </p>

                        <p className="text-[13px] leading-5 text-text-subheading">
                            28 Okt 2026 · 19.00–20.00 WITA
                        </p>

                        <p className="text-[13px] leading-5 text-text-subheading">
                            Daring melalui Zoom
                        </p>

                        <p className="text-[13px] leading-5 text-text-subheading">
                            Detail akses tersedia setelah kamu mengonfirmasi
                            bergabung.
                        </p>
                    </section>

                    {/* Commitment confirmation */}
                    <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                        <h2 className="text-base font-semibold text-text-heading">
                            Konfirmasi komitmen
                        </h2>

                        <label className="flex min-w-0 cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                name="konfirmasiKomitmen"
                                value="true"
                                required
                                className="mt-1 size-4 shrink-0 accent-brand-primary"
                            />

                            <span className="text-[13px] leading-5 text-text-heading">
                                Saya memahami kebutuhan waktu dan rencana
                                pertemuan proyek ini.
                            </span>
                        </label>

                        <p className="text-[13px] leading-5 text-text-subheading">
                            Jika diundang, kamu perlu mengonfirmasi sebelum
                            resmi menjadi anggota.
                        </p>
                    </section>

                    {/* Profile reminder */}
                    <div className="flex min-w-0 items-start gap-2">
                        <span
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-sm text-brand-primary"
                        >
                            ⓘ
                        </span>

                        <p className="text-[13px] leading-5 text-text-subheading">
                            Data profil digunakan otomatis. Ubah profil jika
                            ada informasi yang keliru.
                        </p>
                    </div>

                    {/* Fixed action */}
                    <div className="sticky bottom-0 -mx-4 border-t border-border-default px-4 pb-4 pt-3">
                        <button
                            type="submit"
                            className="flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary  focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                        >
                            Kirim pengajuan
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
