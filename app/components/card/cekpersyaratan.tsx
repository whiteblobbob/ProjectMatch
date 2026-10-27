import {
    CheckIcon,
    ExternalLinkIcon,
    InformationIcon,
    XIcon,
} from "../ui/icons";

type RequirementStatus = "met" | "unmet" | "review";

export type Requirement = {
    id: string;
    label: string;
    status: RequirementStatus;
};

type CekPersyaratanProps = {
    requirements?: Requirement[];
    sourceUrl?: string;
};

export default function CekPersyaratan({
    requirements,
    sourceUrl,
}: CekPersyaratanProps) {
    if (!requirements?.length) return null;

    const hasUnmetRequirement = requirements.some(
        (requirement) => requirement.status === "unmet"
    );

    return (
        <section className="flex w-full min-w-0 flex-col rounded-xl border border-border-default bg-white p-3">
            <h2 className="text-base font-semibold leading-6 text-text-heading">
                Persyaratan tambahan
            </h2>

            <div className="mt-1 flex flex-col">
                {requirements.map((requirement) => {
                    const isMet = requirement.status === "met";
                    const isUnmet = requirement.status === "unmet";

                    return (
                        <div
                            key={requirement.id}
                            className="flex min-w-0 items-start gap-2.5 py-1.5"
                        >
                            <span
                                aria-hidden="true"
                                className={`mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    isMet
                                        ? "bg-success-background text-success-text"
                                        : isUnmet
                                          ? "bg-danger-background text-danger-text"
                                          : "bg-warning-background text-text-warning"
                                }`}
                            >
                                {isMet ? (
                                    <CheckIcon className="size-3.5" />
                                ) : isUnmet ? (
                                    <XIcon className="size-3.5" />
                                ) : (
                                    <InformationIcon className="size-3.5" />
                                )}
                            </span>

                            <p
                                className={`min-w-0 flex-1 text-[13px] leading-5 ${
                                    isUnmet
                                        ? "text-danger-text"
                                        : requirement.status === "review"
                                          ? "text-text-warning"
                                          : "text-text-heading"
                                }`}
                            >
                                {requirement.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {sourceUrl ? (
                <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-brand-primary hover:text-brand-secondary"
                >
                    Lihat sumber persyaratan
                    <ExternalLinkIcon className="size-4 shrink-0" />
                </a>
            ) : null}

            <p className="text-xs leading-5 text-text-subheading">
                Persyaratan ini ditulis oleh pembuat proyek. Pastikan
                informasinya sesuai sebelum bergabung.
            </p>

            {hasUnmetRequirement && (
                <p
                    role="status"
                    className="mt-3 rounded-lg bg-danger-background p-3 text-sm text-danger-text"
                >
                    Kamu belum memenuhi semua persyaratan untuk mengajukan
                    bergabung.
                </p>
            )}
        </section>
    );
}
