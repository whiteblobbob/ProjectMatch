export default function Aktivitasmembercard() {
    return (
        <article className="flex w-full min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
            <h3 className="text-base font-semibold text-text-heading">
                Anggota terkonfirmasi · 2/3
            </h3>

            <p className="text-[13px] leading-relaxed text-text-subheading">
                Raka Aditya · Pembuat proyek
            </p>

            <p className="text-[13px] leading-relaxed text-text-subheading">
                1 anggota lain · Sudah dikonfirmasi
            </p>

            <a
                href="/aktivitas/kelolapostingan/anggota"
                className="w-fit text-[13px] font-semibold text-brand-primary transition-colors hover:text-brand-secondary"
            >
                Lihat tim →
            </a>
        </article>
    );
}