import Image from "next/image";
import Link from "next/link";

import CekPersyaratan from "../card/cekpersyaratan";
import ReportProjectButton from "../project/report-project-button";
import {
    CalendarIcon,
    ClockIcon,
    ExternalLinkIcon,
    LaptopIcon,
    LinkIcon,
    ToolsIcon,
    UsersIcon,
    VideoIcon,
    WarningIcon,
} from "../ui/icons";

export default function projectdetail() {
    // Temporary sample data.
    // Replace these values with backend data when the integration is ready.
    const requirementsMet = true;

    return (
        <main className="min-h-screen w-full min-w-0 bg-background pb-8">
            <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-4 px-4 py-4">
                {/* Breadcrumb */}
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-2 text-xs"
                >
                    <Link
                        href="/"
                        className="text-text-subheading hover:text-brand-primary"
                    >
                        Jelajah
                    </Link>

                    <span className="text-text-subheading">/</span>

                    <span className="font-semibold text-text-heading">
                        Detail Postingan
                    </span>
                </nav>

                {/* Project summary */}
                <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                        <h1 className="min-w-0 text-[21px] font-semibold leading-tight text-text-heading">
                            EcoTrack
                        </h1>

                        <span className="shrink-0 rounded-lg bg-warning-background px-2 py-1 text-xs font-semibold text-text-warning">
                            Mencari anggota
                        </span>
                    </div>

                    <p className="text-sm font-medium leading-5 text-text-subheading">
                        UINIC 2026
                    </p>

                    <div className="flex min-w-0 items-center gap-2.5">
                        <Image
                            src="/img/inisial-pemilik.png"
                            alt="Avatar pemilik proyek"
                            width={36}
                            height={36}
                            className="size-9 shrink-0 rounded-full object-cover"
                        />

                        <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium text-text-heading">
                                Raka Aditya
                            </p>

                            <p className="text-xs leading-5 text-text-subheading">
                                Universitas Indonesia · Pembuat proyek
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/profil/raka-aditya"
                        className="flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary"
                    >
                        Lihat profil pembuat
                        <ExternalLinkIcon className="size-4" />
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <div className="flex items-center gap-1.5">
                            <UsersIcon className="size-4 text-text-subheading" />
                            <span className="text-[13px] text-text-subheading">
                                Tim 2/3
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <CalendarIcon className="size-4 text-text-warning" />
                            <span className="text-[13px] text-text-warning">
                                Batas pengajuan 27 Okt
                            </span>
                        </div>
                    </div>
                </section>

                {/* Project goals */}
                <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                    <h2 className="text-base font-semibold text-text-heading">
                        Belajar melalui proyek
                    </h2>

                    <p className="text-[13px] leading-5 text-text-subheading">
                        Bersama tim, pelajari riset pengguna dan perancangan
                        solusi lingkungan.
                    </p>

                    <p className="text-[13px] leading-5 text-text-subheading">
                        Hasil: user flow, tiga layar utama, dan prototipe yang
                        diuji.
                    </p>
                </section>

                <hr className="border-border-default" />

                {/* Open position */}
                <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                    <p className="text-xs font-medium text-accent-text">
                        1 posisi terbuka
                    </p>

                    <h2 className="text-[21px] font-semibold leading-tight text-text-heading">
                        UI/UX Designer
                    </h2>

                    <p className="text-sm leading-5 text-text-heading">
                        Rancang user flow dan tiga layar utama untuk website
                        lingkungan.
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="flex items-center gap-1.5">
                            <LaptopIcon className="size-4 text-text-subheading" />
                            <span className="text-[13px] text-text-subheading">
                                Daring
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <ClockIcon className="size-4 text-text-subheading" />
                            <span className="text-[13px] text-text-subheading">
                                ±6 jam/minggu
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <ToolsIcon className="size-4 text-text-subheading" />
                            <span className="text-[13px] text-text-subheading">
                                Figma
                            </span>
                        </div>
                    </div>
                </section>

                {/* Meeting information */}
                <section className="overflow-hidden rounded-xl border border-border-default bg-white">
                    <div className="flex items-start gap-3 p-4">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-primary"><VideoIcon className="size-5" /></span>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h2 className="text-base font-semibold text-text-heading">Pertemuan pertama</h2>
                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-brand-primary">Daring</span>
                            </div>
                            <p className="mt-2 text-[13px] leading-5 text-text-heading">Perkenalan dan pembagian peran</p>
                            <p className="mt-1 text-[13px] leading-5 text-text-subheading">28 Okt 2026 · 19.00–20.00 WITA</p>
                            <p className="mt-1 text-[13px] leading-5 text-text-subheading">Google Meet · Masuk 10 menit lebih awal</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 border-t border-border-default bg-slate-50 px-4 py-3 text-xs leading-5 text-text-subheading">
                        <LinkIcon className="mt-0.5 size-4 shrink-0" />
                        Tautan meeting dibuka setelah kamu diterima dan mengonfirmasi bergabung.
                    </div>
                </section>

                <section className="rounded-xl border border-amber-200 bg-amber-50 p-4" aria-labelledby="safety-heading">
                    <div className="flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700"><WarningIcon className="size-5" /></span>
                        <div>
                            <h2 id="safety-heading" className="text-base font-semibold text-amber-950">Cek keamanan sebelum bergabung</h2>
                            <ul className="mt-2 space-y-1.5 text-[13px] leading-5 text-amber-900">
                                <li>• Buka profil pembuat dan cocokkan identitas serta institusinya.</li>
                                <li>• Untuk pertemuan luring, periksa tautan Google Maps dan pilih tempat publik yang jelas.</li>
                                <li>• Jangan membayar biaya atau membagikan data pribadi sensitif.</li>
                            </ul>
                            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                <Link href="/profil/raka-aditya" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-900 px-4 text-sm font-semibold text-white hover:bg-amber-950">
                                    Cek profil pembuat <ExternalLinkIcon className="size-4" />
                                </Link>
                                <ReportProjectButton />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Eligibility check */}
                <CekPersyaratan
                    requirements={[
                        {
                            id: "active-student",
                            label: "Pelajar SMA/SMK atau mahasiswa aktif",
                            status: "review",
                        },
                    ]}
                />

                {/* Application action */}
                <div className="sticky bottom-0 -mx-4 border-t border-border-default bg-background/95 px-4 py-3 backdrop-blur-sm">
                    {requirementsMet ? (
                        <a
                            href="/projectdetail/pengajuanbergabung"
                            className="flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-brand-secondary"
                        >
                            Ajukan Bergabung
                        </a>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-lg bg-border-default px-4 py-3 text-center text-sm font-bold text-text-subheading"
                        >
                            Belum memenuhi persyaratan
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}
