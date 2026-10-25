export default function KelolaPosisiTerbuka() {
    return (
        <article className="flex w-full min-w-0 flex-col items-start gap-2 rounded-xl border border-border-default bg-white p-4">
            <h3 className="text-base font-semibold text-text-heading">
                UI/UX Designer
            </h3>

            <p className="text-[13px] text-text-subheading">
                1 posisi terbuka · Tim 2/3
            </p>

            <a
                href="/aktivitas/kelolapostingan/posisi"
                className="mt-1 flex h-11 w-40 items-center justify-center rounded-lg border border-brand-primary bg-white px-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
            >
                Ubah posisi
            </a>
        </article>
    );
}