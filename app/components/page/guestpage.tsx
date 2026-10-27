import Image from "next/image"
import Projectcard from "../card/projectcard"

export default function guestpage(){
    return(
        <>
         <main className="min-h-screen w-full bg-background">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-9 px-6 py-10 lg:px-12">

                {/* Hero */}
                <section className="flex flex-col gap-2">
                    <h1 className="text-[40px] font-bold leading-tight text-text-heading">
                        Temukan tim yang butuh kamu.
                    </h1>
                    <p className="text-base text-text-subheading">
                        Bangun proyek bersama teman lintas sekolah dan kampus.
                    </p>
                </section>

                {/* Main desktop layout */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

                    {/* LEFT COLUMN */}
                    <div className="flex min-w-0 flex-col gap-6">

                        {/* Project cards */}
                        <section className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-text-heading">
                                    Posisi terbuka
                                </h2>

                                <button
                                    type="button"
                                    className="flex items-center gap-2 text-sm text-text-subheading hover:text-brand-primary"
                                >
                                    Terbaru
                                    <span aria-hidden="true">⌄</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
                                <Projectcard 
                                title="EcoTrack"
                                category="Kompetisi"
                                roles={["UI/UX Designer", "Frontend Dev"]}
                                onSite={false}
                                workHoursPerWeek={6}
                                deadline={new Date("2026-10-30")}
                                slotsAvailable={1}
                                teamSize={2}
                                owner="Raka Aditya"
                                />
                                <Projectcard 
                                title="EcoTrack"
                                category="Kompetisi"
                                roles={["UI/UX Designer", "Frontend Dev"]}
                                onSite={false}
                                workHoursPerWeek={6}
                                deadline={new Date("2026-10-30")}
                                slotsAvailable={1}
                                teamSize={2}
                                owner="Raka Aditya"
                                />
                                <Projectcard 
                                title="EcoTrack"
                                category="Kompetisi"
                                roles={["UI/UX Designer", "Frontend Dev"]}
                                onSite={false}
                                workHoursPerWeek={6}
                                deadline={new Date("2026-10-30")}
                                slotsAvailable={1}
                                teamSize={2}
                                owner="Raka Aditya"
                                />
                                <Projectcard 
                                title="EcoTrack"
                                category="Kompetisi"
                                roles={["UI/UX Designer", "Frontend Dev"]}
                                onSite={false}
                                workHoursPerWeek={6}
                                deadline={new Date("2026-10-30")}
                                slotsAvailable={1}
                                teamSize={2}
                                owner="Raka Aditya"
                                />
                            </div>
                        </section>

                        {/* Long open-position card */}
                        <section className="overflow-hidden rounded-xl border border-border-default bg-white">
                            <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
                                <div>
                                    <h2 className="font-bold text-text-heading">
                                        Daftar posisi
                                    </h2>
                                    <p className="mt-1 text-sm text-text-subheading">
                                        Ringkasan proyek yang sedang mencari anggota
                                    </p>
                                </div>

                                <span className="text-sm text-text-subheading">
                                    2 posisi
                                </span>
                            </div>

                            {/* Position row 1 */}
                            <div className="flex flex-col gap-3 border-b border-border-default px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-text-heading">
                                        EcoTrack
                                    </h3>
                                    <p className="mt-1 text-sm text-text-subheading">
                                        Peneliti Lingkungan · UINIC 2026
                                    </p>
                                </div>

                                <a
                                    href="/projectdetail"
                                    className="shrink-0 text-sm font-semibold text-brand-primary hover:text-brand-secondary"
                                >
                                    Lihat detail proyek →
                                </a>
                            </div>

                            {/* Position row 2 */}
                            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-text-heading">
                                        PanganHub
                                    </h3>
                                    <p className="mt-1 text-sm text-text-subheading">
                                        Rekan Pengembangan Bisnis · Ide bisnis
                                    </p>
                                </div>

                                <a
                                    href="/projectdetail"
                                    className="shrink-0 text-sm font-semibold text-brand-primary hover:text-brand-secondary"
                                >
                                    Lihat detail proyek →
                                </a>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: SEARCH AND FILTER */}
                    <aside className="flex min-w-0 flex-col gap-5 rounded-xl border border-border-default bg-white p-5 lg:sticky lg:top-6">
                        <div>
                            <h2 className="text-lg font-bold text-text-heading">
                                Cari proyek
                            </h2>
                            <p className="mt-1 text-sm text-text-subheading">
                                Temukan peluang yang sesuai denganmu.
                            </p>
                        </div>

                        {/* Search input */}
                        <div className="relative">
                            <Image
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                                src="/img/search.png"
                                alt=""
                                width={20}
                                height={20}
                            />

                            <input
                                type="search"
                                name="search"
                                placeholder="Cari proyek, peran, atau topik"
                                className="h-11 w-full rounded-lg border border-border-input bg-white pl-10 pr-3 text-sm text-text-heading placeholder:text-text-subheading focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-semibold text-text-heading">
                                Filter proyek
                            </h3>

                            <label className="flex flex-col gap-2 text-sm text-text-subheading">
                                Jenis proyek
                                <select
                                    name="jenis"
                                    defaultValue=""
                                    className="h-11 w-full rounded-lg border border-border-default bg-white px-3 text-sm text-text-heading"
                                >
                                    <option value="">Semua jenis</option>
                                    <option value="kompetisi">Kompetisi</option>
                                    <option value="ide-bisnis">Ide bisnis</option>
                                    <option value="personal">Proyek pribadi</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-2 text-sm text-text-subheading">
                                Topik
                                <select
                                    name="topik"
                                    defaultValue=""
                                    className="h-11 w-full rounded-lg border border-border-default bg-white px-3 text-sm text-text-heading"
                                >
                                    <option value="">Semua topik</option>
                                    <option value="teknologi">Teknologi</option>
                                    <option value="lingkungan">Lingkungan</option>
                                    <option value="pendidikan">Pendidikan</option>
                                    <option value="bisnis">Bisnis</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-2 text-sm text-text-subheading">
                                Lokasi & mode
                                <select
                                    name="lokasi"
                                    defaultValue=""
                                    className="h-11 w-full rounded-lg border border-border-default bg-white px-3 text-sm text-text-heading"
                                >
                                    <option value="">Semua lokasi</option>
                                    <option value="remote">Daring</option>
                                    <option value="onsite">Luring</option>
                                    <option value="hybrid">Hibrida</option>
                                </select>
                            </label>
                        </div>

                        <button
                            type="button"
                            className="flex h-11 w-full items-center justify-center rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary"
                        >
                            Terapkan filter
                        </button>
                    </aside>
                </div>
            </div>
        </main>
        </>
    )
}