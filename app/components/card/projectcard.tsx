export default function projectcard() {
    return (
        <a
            href="/projectdetail"
            className="block h-full min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
            <article
                className="flex h-full min-h-[254px] w-full flex-col gap-2 rounded-2xl border border-border-default bg-white p-4 transition duration-200 hover:border-brand-primary hover:bg-brand-soft"
                id="card-content-container"
            >
                <div
                    className="flex items-center justify-between gap-3"
                    id="title"
                >
                    <h2 className="min-w-0 truncate text-xl font-semibold text-text-heading">
                        EcoTrack
                    </h2>

                    <span className="shrink-0 rounded-md bg-background px-2 py-1 text-[11px] font-semibold text-text-subheading">
                        Kompetisi
                    </span>
                </div>

                <p
                    className="text-xs text-text-subheading"
                    id="subtitle"
                >
                    UINIC 2026
                </p>

                <h3 className="text-base font-semibold leading-snug text-text-heading">
                    Mencari UI/UX Designer
                </h3>

                <p className="flex flex-wrap items-center gap-x-2 text-xs text-text-subheading">
                    <span>Lingkungan</span>
                    <span aria-hidden="true">·</span>
                    <span>Remote</span>
                </p>

                <div className="flex items-center justify-between gap-2 text-xs text-text-subheading">
                    <span>±6 jam/minggu</span>
                    <span className="shrink-0 font-semibold">Tim 2/3</span>
                </div>

                <p className="text-xs font-medium text-text-warning">
                    Tenggat 30 Okt
                </p>

                <div className="mt-auto">
                    <hr className="mb-2 border-border-default" />

                    <p className="text-xs text-text-subheading">
                        Pemilik: Raka Aditya
                    </p>
                </div>
            </article>
        </a>
    );
}