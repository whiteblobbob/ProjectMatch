import Image from "next/image";

type RequirementStatus = "met" | "unmet" | "review";

export type Requirement = {
    id: string;
    label: string;
    status: RequirementStatus;
};

type CekPersyaratanProps = {
    requirements?: Requirement[];
    aturanUrl?: string;
};

const defaultRequirements: Requirement[] = [
    {
        id: "position",
        label: "Posisi masih tersedia",
        status: "met",
    },
    {
        id: "collaboration",
        label: "Kolaborasi lintas sekolah dan kampus diizinkan",
        status: "met",
    },
    {
        id: "education",
        label: "Cek syarat pendidikan pada aturan resmi",
        status: "review",
    },
];

export default function CekPersyaratan({
    requirements = defaultRequirements,
    aturanUrl = "#",
}: CekPersyaratanProps) {
    const hasUnmetRequirement = requirements.some(
        (requirement) => requirement.status === "unmet"
    );

    return (
        <section className="flex w-full min-w-0 flex-col rounded-xl border border-border-default bg-white p-3">
            <h2 className="text-base font-semibold leading-6 text-text-heading">
                Cek persyaratan
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
                                {isMet ? "✓" : isUnmet ? "!" : "?"}
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

            <a
                href={aturanUrl}
                target={aturanUrl === "#" ? undefined : "_blank"}
                rel={aturanUrl === "#" ? undefined : "noreferrer"}
                className="flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-brand-primary hover:text-brand-secondary"
            >
                Lihat aturan lomba
                <Image
                    src="/img/external-link.png"
                    alt=""
                    width={16}
                    height={16}
                />
            </a>

            <p className="text-xs leading-5 text-text-subheading">
                Informasi persyaratan diisi pembuat proyek. Periksa sumber
                resmi sebelum mendaftar.
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