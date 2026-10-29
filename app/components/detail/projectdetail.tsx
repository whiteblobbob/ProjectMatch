import Link from "next/link";

import CekPersyaratan from "../card/cekpersyaratan";
import ReportProjectButton from "../project/report-project-button";
import {
    CalendarIcon,
    ClockIcon,
    ExternalLinkIcon,
    LaptopIcon,
    MapPinIcon,
    UsersIcon,
    VideoIcon,
    WarningIcon,
} from "../ui/icons";
import {
    getCollaborationModeLabel,
    getOfflinePlaceLabel,
    getOnlinePlatformLabel,
    type CollaborationMode,
    type OfflinePlace,
    type OnlinePlatform,
} from "../ui/collaboration-mode";

type ProjectDetailProps = {
    project: {
        id: string;
        title: string;
        description: string;
        deadline: Date | null;
        collaborationMode: CollaborationMode;
        onlinePlatform: OnlinePlatform | null;
        onlineLink: string | null;
        offlinePlace: OfflinePlace | null;
        offlineLink: string | null;
        meetDescription: string;
        collaborationTool: string | null;
        workHoursPerWeek: number;
        status: "OPEN_RECRUITMENT" | "IN_PROGRESS" | "COMPLETED";
        category: { name: string };
        owner: { name: string | null; instance: string | null };
        projectStatusCriteria: Array<{ status: { id: string; name: string } }>;
        projectRoles: Array<{ slotsAvailable: number; role: { id: string; name: string } }>;
        projectMembers: Array<{ user: { id: string; name: string | null } }>;
    };
};

const statusStyles = {
    OPEN_RECRUITMENT: { label: "Mencari anggota", className: "bg-warning-background text-text-warning" },
    IN_PROGRESS: { label: "Sedang berjalan", className: "bg-brand-soft text-brand-primary" },
    COMPLETED: { label: "Selesai", className: "bg-slate-100 text-slate-600" },
} as const;

const deadlineFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

function initials(name: string | null) {
    const value = name?.trim() || "PM";
    return value
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toLocaleUpperCase("id-ID");
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
    const openRoles = project.projectRoles.filter((role) => role.slotsAvailable > 0);
    const openSlots = openRoles.reduce((total, role) => total + role.slotsAvailable, 0);
    const memberCount = project.projectMembers.length;
    const status = statusStyles[project.status];
    const canApply = project.status === "OPEN_RECRUITMENT" && openSlots > 0;
    const requirements = project.projectStatusCriteria.map((criterion) => ({
        id: criterion.status.id,
        label: criterion.status.name,
        status: "review" as const,
    }));

    return (
        <main className="min-h-screen w-full min-w-0 bg-background pb-8">
            <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-4 px-4 py-4">
                {/* Breadcrumb */}
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-2 text-xs"
                >
                    <Link
                        href="/"
                        className="text-text-subheading hover:text-brand-primary"
                    >
                        Jelajah
                    </Link>

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

                        <span className={`shrink-0 rounded-lg px-2 py-1 text-xs font-semibold ${status.className}`}>
                            {status.label}
                        </span>
                    </div>

                    <p className="text-sm font-medium leading-5 text-text-subheading">
                        {project.category.name}
                    </p>

                    <div className="flex min-w-0 items-center gap-2.5">
                        <span
                            aria-hidden="true"
                            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white"
                        >
                            {initials(project.owner.name)}
                        </span>

                        <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium text-text-heading">
                                {project.owner.name ?? "Pengguna ProjectMatch"}
                            </p>

                            <p className="text-xs leading-5 text-text-subheading">
                                {project.owner.instance ?? "Institusi belum diisi"} · Pembuat proyek
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <div className="flex items-center gap-1.5">
                            <UsersIcon className="size-4 text-text-subheading" />
                            <span className="text-[13px] text-text-subheading">
                                Tim {memberCount}/{memberCount + openSlots}
                            </span>
                        </div>

                        {project.deadline ? (
                            <div className="flex items-center gap-1.5">
                                <CalendarIcon className="size-4 text-text-warning" />
                                <span className="text-[13px] text-text-warning">
                                    Batas pengajuan {deadlineFormatter.format(project.deadline)}
                                </span>
                            </div>
                        ) : null}
                    </div>
                </section>

                {/* Project description */}
                <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                    <h2 className="text-base font-semibold text-text-heading">
                        Tentang proyek
                    </h2>

                    <p className="whitespace-pre-line text-[13px] leading-5 text-text-subheading">
                        {project.description}
                    </p>
                </section>

                <hr className="border-border-default" />

                {/* Open positions */}
                <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                    <p className="text-xs font-medium text-accent-text">
                        {openSlots} posisi terbuka
                    </p>

                    {openRoles.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {openRoles.map((role) => (
                                <div
                                    key={role.role.id}
                                    className="flex min-w-0 flex-col gap-2 rounded-lg border border-border-default p-3"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <h2 className="text-[17px] font-semibold leading-tight text-text-heading">
                                            {role.role.name}
                                        </h2>

                                        <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-primary">
                                            {role.slotsAvailable} slot
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                        <div className="flex items-center gap-1.5">
                                            {project.collaborationMode === "OFFLINE" ? (
                                                <MapPinIcon className="size-4 text-text-subheading" />
                                            ) : (
                                                <LaptopIcon className="size-4 text-text-subheading" />
                                            )}
                                            <span className="text-[13px] text-text-subheading">
                                                {getCollaborationModeLabel(project.collaborationMode)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <ClockIcon className="size-4 text-text-subheading" />
                                            <span className="text-[13px] text-text-subheading">
                                                ±{project.workHoursPerWeek} jam/minggu
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[13px] leading-5 text-text-subheading">
                            Tidak ada posisi terbuka saat ini.
                        </p>
                    )}
                </section>

                {/* Meeting plan */}
                <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-border-default bg-white p-4">
                    <div className="flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
                            {project.collaborationMode === "OFFLINE" ? <MapPinIcon className="size-5" /> : <VideoIcon className="size-5" />}
                        </span>
                        <div>
                            <h2 className="text-base font-semibold text-text-heading">Rencana pertemuan</h2>
                            <p className="mt-0.5 text-[13px] text-text-subheading">{getCollaborationModeLabel(project.collaborationMode)}</p>
                        </div>
                    </div>

                    <p className="whitespace-pre-line text-[13px] leading-5 text-text-subheading">
                        {project.meetDescription}
                    </p>

                    <div className="flex flex-col gap-2">
                        {(project.collaborationMode === "ONLINE" || project.collaborationMode === "HYBRID") ? (
                            <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-border-default p-3">
                                <span className="text-xs text-text-subheading">Pertemuan daring</span>
                                <span className="text-[13px] font-medium text-text-heading">
                                    {project.onlinePlatform ? getOnlinePlatformLabel(project.onlinePlatform) : "Platform belum diisi"}
                                </span>
                                {project.onlineLink ? (
                                    <a href={project.onlineLink} target="_blank" rel="noreferrer" className="inline-flex min-w-0 items-center gap-1.5 text-[13px] font-semibold text-brand-primary hover:text-brand-secondary">
                                        <span className="truncate">{project.onlineLink}</span>
                                        <ExternalLinkIcon className="size-3.5 shrink-0" />
                                    </a>
                                ) : null}
                            </div>
                        ) : null}

                        {(project.collaborationMode === "OFFLINE" || project.collaborationMode === "HYBRID") ? (
                            <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-border-default p-3">
                                <span className="text-xs text-text-subheading">Pertemuan luring</span>
                                <span className="text-[13px] font-medium text-text-heading">
                                    {project.offlinePlace ? getOfflinePlaceLabel(project.offlinePlace) : "Tempat belum diisi"}
                                </span>
                                {project.offlineLink ? (
                                    <a href={project.offlineLink} target="_blank" rel="noreferrer" className="inline-flex min-w-0 items-center gap-1.5 text-[13px] font-semibold text-brand-primary hover:text-brand-secondary">
                                        <span className="truncate">{project.offlineLink}</span>
                                        <ExternalLinkIcon className="size-3.5 shrink-0" />
                                    </a>
                                ) : null}
                            </div>
                        ) : null}

                        {project.collaborationTool ? (
                            <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-border-default p-3">
                                <span className="text-xs text-text-subheading">Alat kolaborasi</span>
                                <span className="text-[13px] font-medium text-text-heading">{project.collaborationTool}</span>
                            </div>
                        ) : null}
                    </div>
                </section>

                <section className="rounded-xl border border-amber-200 bg-amber-50 p-4" aria-labelledby="safety-heading">
                    <div className="flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700"><WarningIcon className="size-5" /></span>
                        <div>
                            <h2 id="safety-heading" className="text-base font-semibold text-amber-950">Cek keamanan sebelum bergabung</h2>
                            <ul className="mt-2 space-y-1.5 text-[13px] leading-5 text-amber-900">
                                <li>• Cocokkan identitas pembuat dan institusinya sebelum bergabung.</li>
                                <li>• Untuk pertemuan luring, pilih tempat publik yang jelas dan mudah diverifikasi.</li>
                                <li>• Jangan membayar biaya atau membagikan data pribadi sensitif.</li>
                            </ul>
                            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                <ReportProjectButton />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Eligibility check */}
                <CekPersyaratan requirements={requirements} />

                {/* Application action */}
                <div className="sticky bottom-0 -mx-4 border-t border-border-default bg-background/95 px-4 py-3 backdrop-blur-sm">
                    {canApply ? (
                        <Link
                            href={`/project/${project.id}/apply`}
                            className="flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-brand-secondary"
                        >
                            Ajukan Bergabung
                        </Link>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-lg bg-border-default px-4 py-3 text-center text-sm font-bold text-text-subheading"
                        >
                            {project.status === "OPEN_RECRUITMENT" ? "Belum ada posisi terbuka" : "Pendaftaran ditutup"}
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}
