export default function KelolaStatusPostingan() {
    return (
        <article className="flex w-full min-w-0 flex-col items-start rounded-xl border border-border-default bg-white p-4">
            <span className="rounded-lg bg-warning-background px-2 py-1 text-xs font-bold text-text-warning">
                Mencari anggota
            </span>

            <p className="mt-3 text-[13px] leading-5 text-text-subheading">
                Postingan aktif dan terlihat oleh calon anggota.
                Setelah ditutup, postingan tetap tersimpan di riwayat.
            </p>

            <a
                href="/aktivitas/kelolapostingan/tutup"
                className="mt-4 flex h-11 w-full items-center justify-center rounded-lg border border-danger-text bg-white px-4 text-sm font-semibold text-danger-text transition-colors hover:bg-danger-text hover:text-white"
            >
                Tutup postingan
            </a>
        </article>
    );
}