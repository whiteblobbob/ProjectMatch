import Image from "next/image";

export default function Aktivitastinjaupelamar() {
    return (
<article className="w-full min-w-0 rounded-xl border border-border-default bg-white p-4">
            {/* Applicant */}
            <div className="flex w-full min-w-0 items-center gap-2">
                <div className="size-13 shrink-0 rounded-full border border-border-default bg-[#D9D9D9]" />

                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold leading-[1.4] text-text-heading">
                        Joshua Kevin
                    </h2>
                    <p className="text-xs font-medium leading-[1.4] text-text-subheading">
                        Universitas Primakara
                    </p>
                </div>
            </div>

            <a
                href="#"
                className="flex h-11 items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary"
            >
                <Image
                    src="/img/external-link.png"
                    alt=""
                    width={16}
                    height={16}
                    className="shrink-0"
                />
                Lihat profil calon anggota
            </a>

            <section className="flex flex-col gap-1">
                <h3 className="text-xs font-medium leading-normal text-text-subheading">
                    Kontribusi yang ditawarkan
                </h3>
                <p className="text-[13px] leading-normal text-text-heading">
                    Saya bisa merancang user flow dan tiga layar utama di
                    Figma, lalu menyiapkan prototipe untuk diuji bersama tim.
                </p>
            </section>

            <section className="flex flex-col gap-1">
                <h3 className="text-xs font-medium leading-normal text-text-subheading">
                    Alasan ingin bergabung
                </h3>
                <p className="text-[13px] leading-normal text-text-heading">
                    Saya ingin belajar riset pengguna dan membuat prototipe
                    bersama tim lintas institusi.
                </p>
            </section>

            <div className="flex w-full min-w-0 flex-col gap-2.5 rounded-lg bg-background p-3">
                <div className="flex items-start gap-2">
                    <span className="shrink-0 font-bold text-success-text">
                        ✓
                    </span>
                    <p className="min-w-0 flex-1 text-[13px] leading-normal text-text-heading">
                        Portofolio tersedia
                    </p>
                </div>

                <div className="flex items-start gap-2">
                    <span className="shrink-0 font-bold text-success-text">
                        ✓
                    </span>
                    <p className="min-w-0 flex-1 text-[13px] leading-normal text-text-heading">
                        Tersedia 8 jam/minggu · Diisi calon anggota
                    </p>
                </div>

                <div className="flex items-start gap-2">
                    <span className="shrink-0 font-bold text-text-warning">
                        ⚠
                    </span>
                    <p className="min-w-0 flex-1 text-[13px] leading-normal text-text-warning">
                        Persyaratan kegiatan perlu diperiksa pembuat proyek.
                    </p>
                </div>
            </div>

            <div className="border-t border-border-default pt-3">
                <div className="flex min-w-0 gap-2">
                    <button
                        type="button"
                        className="flex h-12 min-w-0 flex-1 items-center justify-center rounded-lg border border-brand-primary bg-brand-primary px-2 text-[13px] font-semibold text-white transition-colors hover:border-brand-secondary hover:bg-brand-secondary sm:text-[15px]"
                    >
                        Undang bergabung
                    </button>

                    <button
                        type="button"
                        className="h-12 w-24 shrink-0 rounded-lg border border-danger-text bg-white text-[15px] font-semibold text-danger-text transition-colors hover:bg-danger-text hover:text-white"
                    >
                        Tolak
                    </button>
                </div>

                <p className="mt-3 text-xs leading-normal text-text-subheading">
                    Joshua resmi menjadi anggota setelah mengonfirmasi undangan.
                </p>
            </div>
        </article>
    );
}