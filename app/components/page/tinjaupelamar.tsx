import Aktivitastinjaupelamar from "../../components/card/aktivitastinjaupelamar";
import Image from "next/image";

export default function TinjauPelamar() {
    return (
        <main className="min-h-screen w-full min-w-0 bg-background pb-8">
            {/* Back navigation */}
            <div className="flex h-16 w-full min-w-0 items-center gap-2 border-b border-border-default bg-white px-4">
            <a
                href="../kelolapostingan"
                className="flex h-11 items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary"
            >
                <Image
                    src="/img/arrow-left.png"
                    alt=""
                    width={16}
                    height={16}
                    className="shrink-0"
                />  
            </a>

                <h1 className="min-w-0 flex-1 text-base font-semibold text-text-heading">
                    Tinjau pengajuan
                </h1>

                <span className="shrink-0 text-xs text-text-subheading">
                    Pembuat proyek
                </span>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-6 p-4">
                {/* Project summary */}
                <section className="flex w-full min-w-0 flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-[21px] font-semibold text-text-heading">
                            EcoTrack
                        </h2>

                        <p className="shrink-0 text-[13px] font-medium text-text-subheading">
                            Tim 2/3
                        </p>
                    </div>

                    <p className="text-[13px] leading-normal text-text-subheading">
                        UINIC 2026 · UI/UX Designer
                    </p>

                    <div className="self-start rounded-lg bg-accent-soft px-2 py-1">
                        <p className="text-xs font-semibold text-accent-text">
                            1 posisi terbuka
                        </p>
                    </div>
                </section>

                {/* First meeting */}
                <section className="flex w-full min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                    <h2 className="text-base font-semibold text-text-heading">
                        Pertemuan pertama
                    </h2>

                    <p className="text-[13px] leading-normal text-text-heading">
                        Perkenalan dan pembagian peran
                    </p>

                    <p className="text-[13px] leading-normal text-text-heading">
                        28 Okt 2026 · 19.00-20.00 WITA
                    </p>

                    <p className="text-[13px] leading-normal text-text-heading">
                        Daring melalui Zoom
                    </p>

                    <p className="text-[13px] leading-normal text-text-subheading">
                        Detail akses tersedia setelah kamu mengonfirmasi bergabung.
                    </p>
                </section>

                {/* Incoming applications */}
                <section className="flex w-full min-w-0 flex-col gap-3">
                    <h2 className="text-[15px] font-semibold leading-normal text-text-heading">
                        Pengajuan masuk · <span>1</span>
                    </h2>

                    <Aktivitastinjaupelamar />
                </section>
            </div>
        </main>
    );
}