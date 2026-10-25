import Image from "next/image";
import Projectcarddisabled from "../card/projectcarddisabled";

export default function Profil() {
    const skills = ["Figma", "User flow", "Prototipe"];

    return (
        <>

        <main className="w-full min-w-0 bg-background px-4 py-6">
            <div className="flex flex-col gap-6">

                {/* Identitas utama */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-18 shrink-0 items-center justify-center rounded-full bg-brand-primary text-2xl font-bold text-white">
                            JK
                        </div>

                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl font-bold leading-tight text-text-heading">
                                Joshua Kevin
                            </h1>
                            <p className="mt-1 text-sm leading-5 text-text-subheading">
                                Email akun · Hanya terlihat olehmu
                            </p>
                            <p className="text-sm leading-5 text-text-subheading">
                                Universitas Primakara
                            </p>
                        </div>
                    </div>

                    <div>
                        <span className="inline-flex rounded-md bg-accent-soft px-2.5 py-1.5 text-[13px] font-semibold text-accent-text">
                            Tersedia 8 jam/minggu
                        </span>
                    </div>

                    {/* Keahlian */}
                    <div className="flex flex-col gap-2">
                        <h2 className="text-[15px] font-semibold text-text-heading">
                            Keahlian yang dapat dikontribusikan
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="flex h-11 items-center rounded-full border border-border-default bg-white px-4 text-sm text-text-subheading"
                                >
                                    {skill}
                                </span>
                            ))}

                            <button
                                type="button"
                                aria-label="Tambah keahlian"
                                className="flex size-11 items-center justify-center rounded-full border border-border-default bg-white text-2xl text-text-subheading hover:border-brand-primary hover:text-brand-primary"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="self-start text-[13px] font-semibold text-brand-primary hover:text-brand-secondary"
                    >
                        Ubah profil →
                    </button>
                </section>

                {/* Tentang */}
                <section className="flex flex-col gap-2">
                    <h2 className="text-[15px] font-semibold text-text-heading">
                        Tentang
                    </h2>
                    <p className="text-sm leading-normal text-text-subheading">
                        Merancang user flow dan layar utama di Figma serta
                        menyiapkan prototipe untuk diuji bersama tim.
                    </p>
                </section>

                {/* Minat belajar */}
                <section className="flex flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                    <h2 className="text-base font-semibold text-text-heading">
                        Ingin dipelajari
                    </h2>
                    <p className="text-[13px] text-text-subheading">
                        Riset pengguna · Pengujian kegunaan
                    </p>
                    <p className="text-[13px] text-text-subheading">
                        Ketersediaan waktu diisi sendiri oleh pengguna.
                    </p>
                </section>

                {/* Privasi */}
                <section className="flex flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                    <h2 className="text-base font-semibold text-text-heading">
                        Privasi kontak
                    </h2>
                    <p className="text-[13px] text-text-subheading">
                        Email akun hanya terlihat olehmu.
                    </p>
                    <p className="text-[13px] text-text-subheading">
                        Kontak publik: tidak ditampilkan.
                    </p>
                    <button
                        type="button"
                        className="self-start text-[13px] font-semibold text-brand-primary hover:text-brand-secondary"
                    >
                        Ubah visibilitas kontak →
                    </button>
                </section>

                {/* Portofolio */}
                <section className="flex flex-col gap-2">
                    <h2 className="text-[15px] font-semibold text-text-heading">
                        Portofolio
                    </h2>
                    <a
                        href="https://figma.com"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full break-all rounded-xl border border-border-default bg-white p-3 text-sm text-brand-primary hover:text-brand-secondary"
                    >
                        figma.com/@joshuakevin/eco-flow
                    </a>
                </section>

                {/* Riwayat proyek: handled by you */}
                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[15px] font-semibold text-text-heading">
                            Riwayat proyek
                        </h2>
                        <span className="text-[13px] text-text-subheading">
                            1 proyek
                        </span>
                    </div>

                    <Projectcarddisabled />
                </section>
            </div>
        </main>
        </>
    );
}