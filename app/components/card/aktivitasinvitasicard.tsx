export default function Aktivitasinvitasicard() {
    return (
        <article className="flex w-full min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
            <h3 className="text-base font-semibold text-text-heading">
                Undangan menunggu konfirmasi
            </h3>

            <p className="text-[13px] leading-relaxed text-text-subheading">
                Belum ada undangan tertunda.
            </p>

            <p className="text-[13px] leading-relaxed text-text-subheading">
                Anggota resmi bertambah setelah calon anggota mengonfirmasi.
            </p>
        </article>
    );
}