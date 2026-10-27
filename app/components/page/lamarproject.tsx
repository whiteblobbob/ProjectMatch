import Image from "next/image";

export default function lamarproject() {
    return (
        <div
            id="wrapper"
            className="min-h-screen w-full min-w-0 bg-background "
        >
            <main className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-5 px-4 pb-6 pt-4">
                {/* Breadcrumb */}
                <nav
                    aria-label="Breadcrumb"
                    className="flex flex-wrap items-center gap-1 text-xs text-text-subheading"
                >
                    <a href="/guest" className="hover:text-brand-primary">
                        Jelajah
                    </a>
                    <span>/</span>
                    <a
                        href="/projectdetail"
                        className="hover:text-brand-primary"
                    >
                        Detail Postingan
                    </a>
                    <span>/</span>
                    <span className="font-semibold text-text-heading">
                        Form Bergabung
                    </span>
                </nav>

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
                    <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                        <h2 className="text-base font-semibold text-text-heading">
                            Data dari profil
                        </h2>

                        <p className="text-[13px] leading-5 text-text-heading">
                            Joshua Kevin · Universitas Primakara
                        </p>

                        <a
                            href="/profil"
                            className="flex min-h-11 items-center text-sm font-semibold text-brand-primary hover:text-brand-secondary"
                        >
                            Ubah profil
                            <span aria-hidden="true" className="ml-1">
                                <Image
                                    src="/img/external-link.png"
                                    alt=""
                                    width={16}
                                    height={16}
                                />
                            </span>
                        </a>
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

                        <select
                            id="role"
                            name="role"
                            required
                            defaultValue=""
                            className="min-h-12 w-full min-w-0 appearance-none rounded-lg border border-border-input bg-white px-3 py-2 text-sm text-text-heading focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
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
                        </select>

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
                                Apa yang bisa kamu kerjakan?
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

                        {/* Optional portfolio */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <label
                                htmlFor="portofolio"
                                className="text-sm font-semibold text-text-heading"
                            >
                                Link Portofolio (opsional)
                            </label>

                            <input
                                id="portofolio"
                                name="portofolio"
                                type="url"
                                placeholder="https://..."
                                className="min-h-12 w-full min-w-0 rounded-lg border border-border-input bg-white px-3 py-2 text-sm text-text-heading placeholder:text-text-subheading focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                            />

                            <p className="text-xs leading-5 text-text-subheading">
                                Bisa tautan GitHub, Figma, Behance, atau lainnya.
                            </p>
                        </div>
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
