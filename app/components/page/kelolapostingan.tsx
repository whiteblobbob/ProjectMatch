import Image from "next/image";

import Projectcarddisabledyek from "../card/projectcarddisabled";
import Aktivitasposisiterbukacard from "../card/aktivitasposisiterbukacard";
import Aktivitaspelamarcard from "../card/aktivitaspelamarcard";
import KelolaStatusPostingan from "../card/aktivitasstatuspostingan";
import Aktivitasinvitasicard from "../card/aktivitasinvitasicard";
import Aktivitasmeetingcard from "../card/aktivitasmeetingcard";
import Aktivitasmembercard from "../card/aktivitasmembercard";

export default function KelolaPostingan() {
    return (
        <main className="min-h-screen w-full min-w-0 bg-background pb-8">
            {/* Back button below the navbar */}
            <header className="flex w-full min-w-0 items-center gap-3 border-b border-border-default bg-white px-4 py-5">
                <a
                    href="/aktivitas"
                    aria-label="Kembali ke aktivitas"
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border-default bg-white transition-colors hover:bg-background"
                >
                    <Image
                        src="/img/arrow-left.png"
                        alt=""
                        width={20}
                        height={20}
                    />
                </a>

                <div className="min-w-0">
                    <h1 className="text-2xl font-bold leading-tight text-text-heading">
                        Kelola proyek
                    </h1>
                    <p className="mt-1 text-sm text-text-subheading">
                        EcoTrack · UINIC 2026
                    </p>
                </div>
            </header>

            <div className="flex w-full min-w-0 flex-col gap-5 px-4 pt-4">
                <section className="flex min-w-0 flex-col gap-3">
                    <h2 className="text-base font-bold text-text-heading">
                        Ringkasan proyek
                    </h2>
                    <Projectcarddisabledyek />
                </section>

                <section className="flex min-w-0 flex-col gap-3">
                    <h2 className="text-base font-bold text-text-heading">
                        Posisi terbuka
                    </h2>
                    <Aktivitasposisiterbukacard />
                </section>

                <section className="flex min-w-0 flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-base font-bold text-text-heading">
                            Pengajuan masuk
                        </h2>

                        <span className="shrink-0 rounded-lg bg-accent-soft px-2 py-1 text-xs font-semibold text-accent-text">
                            1 pengajuan
                        </span>
                    </div>

                    <Aktivitaspelamarcard />
                </section>

                <section className="flex min-w-0 flex-col gap-3">
                <h2 className="text-base font-bold text-text-heading">
                    Undangan
                </h2>
                <Aktivitasinvitasicard />
            </section>

            <section className="flex min-w-0 flex-col gap-3">
                <h2 className="text-base font-bold text-text-heading">
                    Pertemuan
                </h2>
                <Aktivitasmeetingcard />
            </section>

            <section className="flex min-w-0 flex-col gap-3">
                <h2 className="text-base font-bold text-text-heading">
                    Anggota
                </h2>
                <Aktivitasmembercard />
            </section>

                <section className="flex min-w-0 flex-col gap-3">
                    <h2 className="text-base font-bold text-text-heading">
                        Status postingan
                    </h2>
                    <KelolaStatusPostingan />
                </section>
            </div>
            
        </main>
    );
}