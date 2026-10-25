export default function KelolaRingkasanProyek() {
    return (
        <article className="w-full min-w-0 rounded-xl border border-border-default bg-white p-4">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-text-heading">
                    EcoTrack
                </h3>
                <span className="shrink-0 rounded-md bg-background px-2 py-1 text-[11px] font-semibold text-text-subheading">
                    Kompetisi
                </span>
            </div>

            <p className="mt-1 text-xs text-text-subheading">
                UINIC 2026
            </p>

            <h4 className="mt-2 text-base font-semibold text-text-heading">
                Mencari UI/UX Designer
            </h4>

            <p className="mt-2 text-xs text-text-subheading">
                Lingkungan · Daring
            </p>

            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-text-subheading">
                <span>±6 jam/minggu</span>
                <span className="font-semibold">Tim 2/3</span>
            </div>

            <p className="mt-2 text-xs text-text-warning">
                Batas pengajuan 27 Okt
            </p>

            <hr className="my-3 border-border-default" />

            <p className="text-xs text-text-subheading">
                Pembuat: Raka Aditya
            </p>
        </article>
    );
}