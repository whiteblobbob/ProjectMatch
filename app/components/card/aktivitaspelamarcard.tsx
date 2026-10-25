import Image from "next/image";

export default function KelolaPelamar() {
    return (
        <article className="flex w-full min-w-0 flex-col gap-4 rounded-xl border border-border-default bg-white p-4">
            <div className="flex min-w-0 items-center gap-3">
                <Image
                    src="/img/Avatar.png"
                    alt="Foto Joshua Kevin"
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-semibold text-text-heading">
                        Joshua Kevin
                    </h3>
                    <p className="text-[13px] text-text-subheading">
                        UI/UX Designer
                    </p>
                </div>
            </div>

            <div className="flex min-w-0 gap-2">
                <a
                    href="/aktivitas/kelolapostingan/tinjaupelamar"
                    className="flex h-11 min-w-0 flex-1 items-center justify-center rounded-lg border border-brand-primary bg-brand-primary px-2 text-center text-sm font-semibold text-white transition-colors hover:border-brand-secondary hover:bg-brand-secondary"
                >
                    Tinjau pengajuan
                </a>

                <a
                    href="/aktivitas/kelolapostingan/tinjaupelamar"
                    className="flex h-11 w-24 shrink-0 items-center justify-center rounded-lg border border-danger-text bg-white text-sm font-semibold text-danger-text transition-colors hover:bg-danger-text hover:text-white"
                >
                    Tolak
                </a>
            </div>
        </article>
    );
}