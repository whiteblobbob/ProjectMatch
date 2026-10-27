import Image from "next/image";

import CekPersyaratan, { type Requirement } from "../card/cekpersyaratan";

type ProjectStatus = "OPEN_RECRUITMENT" | "IN_PROGRESS" | "COMPLETED";

export type ProjectDetailData = {
    id: string;
    title: string;
    description: string;
    deadline: Date | null;
    onSite: boolean;
    workHoursPerWeek: number;
    status: ProjectStatus;
    category: { name: string };
    owner: { name: string | null; instance: string | null };
    projectRoles: Array<{ slotsAvailable: number; role: { id: string; name: string } }>;
    projectMembers: Array<{ role: { name: string } }>;
    projectStatusCriteria: Array<{ status: { name: string } }>;
};

const statusMeta: Record<ProjectStatus, { label: string; className: string }> = {
    OPEN_RECRUITMENT: {
        label: "Mencari anggota",
        className: "bg-warning-background text-text-warning",
    },
    IN_PROGRESS: {
        label: "Sedang berjalan",
        className: "bg-brand-soft text-brand-primary",
    },
    COMPLETED: {
        label: "Selesai",
        className: "bg-success-background text-success-text",
    },
};

// Fallback used by the static preview route so it keeps rendering without data.
const sampleProject: ProjectDetailData = {
    id: "sample-project",
    title: "EcoTrack",
    description:
        "Bersama tim, pelajari riset pengguna dan perancangan solusi lingkungan.",
    deadline: new Date("2026-10-27"),
    onSite: false,
    workHoursPerWeek: 6,
    status: "OPEN_RECRUITMENT",
    category: { name: "UINIC 2026" },
    owner: { name: "Raka Aditya", instance: "Universitas Indonesia" },
    projectRoles: [
        { slotsAvailable: 1, role: { id: "sample-role", name: "UI/UX Designer" } },
    ],
    projectMembers: [
        { role: { name: "Anggota tim" } },
        { role: { name: "Anggota tim" } },
    ],
    projectStatusCriteria: [],
};

function formatDeadline(deadline: Date) {
    return new Date(deadline).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
    });
}

export default function ProjectDetail({
    project = sampleProject,
}: {
    project?: ProjectDetailData;
}) {
    const totalAvailableSlot = project.projectRoles.reduce(
        (total, projectRole) => total + projectRole.slotsAvailable,
        0,
    );
    const openRoles = project.projectRoles.filter(
        (projectRole) => projectRole.slotsAvailable > 0,
    );
    const memberCount = project.projectMembers.length;
    const teamCapacity = memberCount + totalAvailableSlot;
    const status = statusMeta[project.status];
    const deadlineLabel = project.deadline
        ? `Batas pengajuan ${formatDeadline(project.deadline)}`
        : "Tanpa batas waktu";
    const requirementsMet =
        project.status === "OPEN_RECRUITMENT" && totalAvailableSlot > 0;

    const requirements: Requirement[] = [
        {
            id: "position",
            label: "Posisi masih tersedia",
            status: totalAvailableSlot > 0 ? "met" : "unmet",
        },
        {
            id: "status",
            label: `Status proyek: ${status.label}`,
            status: project.status === "OPEN_RECRUITMENT" ? "met" : "unmet",
        },
        ...project.projectStatusCriteria.map((criteria, index) => ({
            id: `criteria-${index}`,
            label: `Syarat: ${criteria.status.name}`,
            status: "review" as const,
        })),
    ];

    return (
        <main className="min-h-screen w-full min-w-0 bg-background pb-8">
            <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-4 px-4 py-4">
                {/* Breadcrumb */}
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-2 text-xs"
                >
                    <a
                        href="/guest"
                        className="text-text-subheading hover:text-brand-primary"
                    >
                        Jelajah
                    </a>

                    <span className="text-text-subheading">/</span>

                    <span className="font-semibold text-text-heading">
                        Detail Postingan
                    </span>
                </nav>

                {/* Project summary */}
                <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                        <h1 className="min-w-0 text-[21px] font-semibold leading-tight text-text-heading">
                            {project.title}
                        </h1>

                        <span
                            className={`shrink-0 rounded-lg px-2 py-1 text-xs font-semibold ${status.className}`}
                        >
                            {status.label}
                        </span>
                    </div>

                    <p className="text-sm font-medium leading-5 text-text-subheading">
                        {project.category.name}
                    </p>

                    <div className="flex min-w-0 items-center gap-2.5">
                        <Image
                            src="/img/inisial-pemilik.png"
                            alt="Avatar pemilik proyek"
                            width={36}
                            height={36}
                            className="size-9 shrink-0 rounded-full object-cover"
                        />

                        <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium text-text-heading">
                                {project.owner.name ?? "Pengguna ProjectMatch"}
                            </p>

                            <p className="text-xs leading-5 text-text-subheading">
                                {project.owner.instance
                                    ? `${project.owner.instance} · Pembuat proyek`
                                    : "Pembuat proyek"}
                            </p>
                        </div>
                    </div>

                    <a
                        href="/profil"
                        className="flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary"
                    >
                        Lihat profil
                        <Image
                            src="/img/external-link.png"
                            alt="Link eksternal"
                            width={16}
                            height={16}
                            className="size-4"
                        />

                    </a>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <div className="flex items-center gap-1.5">
                            <Image
                                src="/img/person.png"
                                alt=""
                                width={16}
                                height={16}
                                className="size-4"
                            />
                            <span className="text-[13px] text-text-subheading">
                                Tim {memberCount}/{teamCapacity}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Image
                                src="/img/calendar-days.png"
                                alt=""
                                width={16}
                                height={16}
                                className="size-4"
                            />
                            <span className="text-[13px] text-text-warning">
                                {deadlineLabel}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Project goals */}
                <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                    <h2 className="text-base font-semibold text-text-heading">
                        Belajar melalui proyek
                    </h2>

                    <p className="text-[13px] leading-5 text-text-subheading">
                        {project.description}
                    </p>

                    <p className="text-[13px] leading-5 text-text-subheading">
                        Hasil: user flow, tiga layar utama, dan prototipe yang
                        diuji.
                    </p>
                </section>

                <hr className="border-border-default" />

                {/* Open position */}
                {openRoles.length > 0 && (
                    <section className="flex min-w-0 flex-col gap-4">
                        <p className="text-xs font-medium text-accent-text">
                            {openRoles.length} posisi terbuka
                        </p>

                        {openRoles.map((projectRole) => (
                            <div
                                key={projectRole.role.id}
                                className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4"
                            >
                                <h2 className="text-[21px] font-semibold leading-tight text-text-heading">
                                    {projectRole.role.name}
                                </h2>

                                <p className="text-sm leading-5 text-text-heading">
                                    Rancang user flow dan tiga layar utama untuk
                                    website lingkungan.
                                </p>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <div className="flex items-center gap-1.5">
                                        <Image
                                            src="/img/laptop.png"
                                            alt=""
                                            width={16}
                                            height={16}
                                            className="size-4"
                                        />
                                        <span className="text-[13px] text-text-subheading">
                                            {project.onSite
                                                ? "Tatap muka"
                                                : "Daring"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <Image
                                            src="/img/clock.png"
                                            alt=""
                                            width={16}
                                            height={16}
                                            className="size-4"
                                        />
                                        <span className="text-[13px] text-text-subheading">
                                            ±{project.workHoursPerWeek} jam/minggu
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <Image
                                            src="/img/figma.png"
                                            alt=""
                                            width={16}
                                            height={16}
                                            className="size-4"
                                        />
                                        <span className="text-[13px] text-text-subheading">
                                            Figma
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Meeting information */}
                <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                    <h2 className="text-base font-semibold text-text-heading">
                        Pertemuan pertama
                    </h2>

                    <p className="text-[13px] leading-5 text-text-subheading">
                        Perkenalan dan pembagian peran
                    </p>

                    <p className="text-[13px] leading-5 text-text-subheading">
                        28 Okt 2026 · 19.00–20.00 WITA
                    </p>

                    <p className="text-[13px] leading-5 text-text-subheading">
                        Daring melalui Zoom
                    </p>

                    <p className="text-[13px] leading-5 text-text-subheading">
                        Detail akses tersedia setelah kamu mengonfirmasi
                        bergabung.
                    </p>
                </section>

                {/* Eligibility check */}
                <CekPersyaratan requirements={requirements} />

                {/* Application action */}
                <div className="sticky bottom-0 -mx-4 border-t border-border-default bg-background/95 px-4 py-3 backdrop-blur-sm">
                    {requirementsMet ? (
                        <a
                            href={`/project/${project.id}/apply`}
                            className="flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-brand-secondary"
                        >
                            Ajukan Bergabung
                        </a>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-lg bg-border-default px-4 py-3 text-center text-sm font-bold text-text-subheading"
                        >
                            Belum memenuhi persyaratan
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}
