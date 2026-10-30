import { getCloudinaryCloudName } from "@/app/lib/cloudinary";
import UserAvatar from "@/app/components/ui/user-avatar";
import Link from "next/link";

import CekPersyaratan from "../card/cekpersyaratan";
import ReportProjectButton from "../project/report-project-button";
import {
    CalendarIcon,
    ClockIcon,
    LaptopIcon,
    MapPinIcon,
    UsersIcon,
    WarningIcon,
} from "../ui/icons";
import {
    getCollaborationModeLabel,
    type CollaborationMode,
} from "../ui/collaboration-mode";
import { checkProjectEligibility } from "@/app/lib/eligibility";
import { educationLevelOptions } from "@/app/lib/ui/profile";
import type { EducationLevel } from "@/app/lib/validator/profile";
import type { ProjectRange } from "@/app/lib/validator/project";

type ProjectDetailProps = {
    viewer: {
        id: string | null;
        authenticated: boolean;
        verified: boolean;
        isOwner: boolean;
        educationLevel: EducationLevel | null;
        roleIds: string[];
        institution: string | null;
        city: string | null;
        province: string | null;
    };
    project: {
        id: string;
        title: string;
        description: string;
        deadline: Date | null;
        collaborationMode: CollaborationMode;
        collaborationTool: string | null;
        workHoursPerWeek: number;
        status: "OPEN_RECRUITMENT" | "IN_PROGRESS" | "COMPLETED";
        category: { name: string };
        owner: {
            profileCloudId?: string | null;
            id: string;
            name: string | null;
            institutionName: string | null;
            institution: string | null;
            province: string | null;
            city: string | null;
        };
        educationLevels: EducationLevel[];
        range: ProjectRange;
        allowedInstitutions: string[];
        extraCriteria: string | null;
        sourceLink: string | null;
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



export default function ProjectDetail({ project, viewer }: ProjectDetailProps) {
    const openRoles = project.projectRoles.filter((role) => role.slotsAvailable > 0);
    const openSlots = openRoles.reduce((total, role) => total + role.slotsAvailable, 0);
    const memberCount = project.projectMembers.length;
    const status = statusStyles[project.status];
    const canApply = project.status === "OPEN_RECRUITMENT" && openSlots > 0;
    const requirements = project.educationLevels.map((level) => ({
        id: level,
        label: educationLevelOptions.find((option) => option.value === level)?.label ?? level,
        status: viewer.educationLevel == null
            ? ("review" as const)
            : viewer.educationLevel === level
                ? ("met" as const)
                : ("unmet" as const),
    }));
    const eligibility = checkProjectEligibility(
        {
            educationLevel: viewer.educationLevel,
            institution: viewer.institution,
            province: viewer.province,
            city: viewer.city,
            roleIds: viewer.roleIds,
        },
        project,
    );
    const ownedOpenRoles = openRoles.filter((role) => viewer.roleIds.includes(role.role.id));
    const isEligible = eligibility.eligible && ownedOpenRoles.length > 0;
    const audienceLabel =
        project.range === "INTERNAL"
            ? "Terbuka hanya untuk institusi yang sama dengan pembuat proyek."
            : project.range === "CITY"
                ? "Terbuka untuk institusi di kota/kabupaten pembuat proyek."
                : project.range === "PROVINCE"
                    ? "Terbuka untuk institusi di provinsi pembuat proyek."
                    : project.range === "INSTITUTIONS"
                        ? "Terbuka untuk institusi tertentu saja."
                        : null;

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
                        <UserAvatar 
                            
                            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white"
                         cloudName={getCloudinaryCloudName()} name={project.owner.name} profileCloudId={project.owner.profileCloudId} />

                        <div className="min-w-0 flex-1">
                            <Link href={`/profile/${project.owner.id}`} className="text-[13px] font-medium text-text-heading hover:text-brand-primary hover:underline">
                                {project.owner.name ?? "Pengguna ProjectMatch"}
                            </Link>

                            <p className="text-xs leading-5 text-text-subheading">
                                {project.owner.institutionName ?? "Institusi belum diisi"} · Pembuat proyek
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

                {!viewer.isOwner ? (
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
                                    <ReportProjectButton projectId={project.id} />
                                </div>
                            </div>
                        </div>
                    </section>
                ) : null}

                {audienceLabel ? (
                    <p className="rounded-xl border border-border-default bg-white p-3 text-[13px] leading-5 text-text-subheading">
                        {audienceLabel}
                    </p>
                ) : null}

                {/* Eligibility check */}
                <CekPersyaratan
                    requirements={requirements}
                    extraCriteria={project.extraCriteria}
                    sourceUrl={project.sourceLink ?? undefined}
                />

                {/* Application action */}
                <div className="sticky bottom-0 -mx-4 border-t border-border-default bg-background/95 px-4 py-3 backdrop-blur-sm">
                    {viewer.isOwner ? (
                        <Link
                            href={`/activity/project/${project.id}`}
                            className="flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-brand-secondary"
                        >
                            Kelola proyek
                        </Link>
                    ) : canApply ? (
                        viewer.authenticated && !viewer.verified ? (
                            <Link
                                href="/profile"
                                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm font-bold text-amber-900 transition-colors hover:bg-amber-100"
                            >
                                <WarningIcon className="size-4" />
                                Verifikasi untuk melamar
                            </Link>
                        ) : viewer.authenticated && !isEligible ? (
                            <button
                                type="button"
                                disabled
                                className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-lg bg-border-default px-4 py-3 text-center text-sm font-bold text-text-subheading"
                            >
                                Kamu belum memenuhi persyaratan
                            </button>
                        ) : (viewer.id && project.projectMembers.map(data => data.user.id).includes(viewer.id)) ? (
                            <button
                                type="button"   
                                disabled
                                className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-lg bg-border-default px-4 py-3 text-center text-sm font-bold text-text-subheading"
                            >
                                Kamu sudah menjadi anggota tim
                            </button>
                        ) : viewer.authenticated && !isEligible ? (
                            <button
                                type="button"
                                disabled
                                className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-lg bg-border-default px-4 py-3 text-center text-sm font-bold text-text-subheading"
                            >
                                Kamu belum memenuhi persyaratan
                            </button>
                        ) : (
                            <Link
                                href={`/project/${project.id}/apply`}
                                className="flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-brand-secondary"
                            >
                                Ajukan Bergabung
                            </Link>
                        )
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
