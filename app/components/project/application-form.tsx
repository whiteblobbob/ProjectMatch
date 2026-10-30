"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { sendApplication } from "@/app/actions/project";
import { formatRegion } from "@/app/lib/regions";
import type { ProfileView } from "@/app/lib/ui/profile";
import Breadcrumbs from "../ui/breadcrumbs";
import { ExternalLinkIcon, MapPinIcon } from "../ui/icons";
import { SelectControl } from "../ui/select-control";

type ApplicationProject = {
    id: string;
    title: string;
    category: { name: string };
    projectRoles: Array<{
        slotsAvailable: number;
        role: { id: string; name: string };
    }>;
};

type ApplicationFormProps = {
    project: ApplicationProject;
    profile: ProfileView;
    ownedRoleIds: string[];
};

export default function ApplicationForm({ project, profile, ownedRoleIds }: ApplicationFormProps) {
    const router = useRouter();
    const [roleId, setRoleId] = useState("");
    const [message, setMessage] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const publicInfo = { location: formatRegion(profile.city, profile.province), portfolioUrl: profile.portfolioLink };
    const openRoles = project.projectRoles.filter((projectRole) => projectRole.slotsAvailable > 0);
    const ownedOpenRoles = openRoles.filter((projectRole) => ownedRoleIds.includes(projectRole.role.id));

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (!roleId) {
            setError("Pilih posisi yang ingin dilamar.");
            return;
        }

        if (!ownedRoleIds.includes(roleId)) {
            setError("Posisi ini belum ada di peran profilmu. Tambahkan peran tersebut di profil terlebih dahulu.");
            return;
        }

        setIsPending(true);
        const result = await sendApplication(project.id, {
            roleId,
            message: message.trim() || undefined,
        });

        if (!result.success) {
            setError(result.error);
            setIsPending(false);
            return;
        }

        setSubmitted(true);
        setIsPending(false);
        router.refresh();
    }

    return (
        <div id="wrapper" className="min-h-screen w-full min-w-0 bg-background">
            <main className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-5 px-4 pb-6 pt-4">
                <Breadcrumbs
                    items={[
                        { label: "Jelajah", href: "/" },
                        { label: "Detail postingan", href: `/project/${project.id}` },
                        { label: "Ajukan bergabung" },
                    ]}
                />

                {submitted ? (
                    <section className="flex min-w-0 flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
                        <div>
                            <h1 className="text-lg font-bold">Pengajuan terkirim</h1>
                            <p className="mt-2 text-sm leading-6">
                                Pengajuanmu untuk {project.title} sudah dikirim. Kamu bisa memantau statusnya di halaman Aktivitas.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Link href="/activity" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-primary px-5 text-sm font-semibold text-white hover:bg-brand-secondary">
                                Lihat aktivitas
                            </Link>
                            <Link href={`/project/${project.id}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300 px-5 text-sm font-semibold text-emerald-900 hover:bg-emerald-100">
                                Kembali ke detail proyek
                            </Link>
                        </div>
                    </section>
                ) : (
                    <form onSubmit={handleSubmit} className="flex w-full min-w-0 flex-col gap-6">
                        {/* Position applied for */}
                        <section className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-border-default bg-white p-4">
                            <p className="text-[13px] text-text-subheading">{project.category.name}</p>
                            <h1 className="text-lg font-semibold text-text-heading">{project.title}</h1>
                        </section>

                        {/* Applicant profile */}
                        <section className="rounded-2xl border border-border-default bg-white p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-text-subheading">Data dari profil</p>
                                    <h2 className="mt-1 text-base font-bold text-text-heading">{profile.name || "Profil belum lengkap"}</h2>
                                    <p className="mt-1 text-[13px] leading-5 text-text-subheading">{profile.institutionName || "Sekolah atau kampus belum diisi"}</p>
                                    <p className="mt-2 flex items-center gap-1.5 text-xs text-text-subheading">
                                        <MapPinIcon className="size-3.5" />
                                        {publicInfo.location || "Lokasi belum diisi"}
                                    </p>
                                </div>

                                <Link
                                    href="/profile"
                                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-brand-primary transition hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                                >
                                    Ubah profil
                                    <ExternalLinkIcon className="size-4" />
                                </Link>
                            </div>
                        </section>

                        {/* Application details */}
                        <section className="flex min-w-0 flex-col gap-5">
                            {openRoles.length > 0 ? (
                                <div className="flex min-w-0 flex-col gap-2">
                                    <label htmlFor="role" className="text-sm font-semibold text-text-heading">
                                        Posisi yang ingin dilamar
                                    </label>

                                    <SelectControl
                                        id="role"
                                        value={roleId}
                                        onChange={(event) => setRoleId(event.target.value)}
                                        disabled={isPending}
                                        required
                                        className="border-border-input text-text-heading focus:ring-2 focus:ring-brand-soft"
                                    >
                                        <option value="" disabled>Pilih posisi yang kamu inginkan</option>
                                        {openRoles.map((projectRole) => {
                                            const isOwned = ownedRoleIds.includes(projectRole.role.id);

                                            return (
                                                <option
                                                    key={projectRole.role.id}
                                                    value={projectRole.role.id}
                                                    disabled={!isOwned}
                                                >
                                                    {projectRole.role.name} ({projectRole.slotsAvailable} slot)
                                                    {isOwned ? "" : " · belum ada di profil"}
                                                </option>
                                            );
                                        })}
                                    </SelectControl>
                                </div>
                            ) : (
                                <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                                    Proyek ini tidak memiliki posisi terbuka saat ini.
                                </p>
                            )}

                            {openRoles.length > 0 && ownedOpenRoles.length === 0 ? (
                                <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                                    Belum ada posisi terbuka yang cocok dengan peran di profilmu. Tambahkan peran yang sesuai di profil terlebih dahulu.
                                </p>
                            ) : null}

                            {/* Contribution */}
                            <div className="flex min-w-0 flex-col gap-2">
                                <label htmlFor="message" className="text-sm font-semibold text-text-heading">
                                    Kontribusi apa yang bisa kamu berikan?
                                </label>

                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                    disabled={isPending}
                                    rows={5}
                                    placeholder="Deskripsikan kemampuan, pengalaman, dan kontribusi yang bisa kamu berikan."
                                    className="w-full min-w-0 resize-y rounded-lg border border-border-input bg-white px-3 py-3 text-sm leading-5 text-text-heading placeholder:text-text-subheading focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                                />
                            </div>

                            {/* Portfolio from profile */}
                            <section className="rounded-2xl border border-border-default bg-white p-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-text-subheading">Portofolio dari profil</p>
                                        {publicInfo.portfolioUrl ? (
                                            <a href={publicInfo.portfolioUrl} target="_blank" rel="noreferrer" className="mt-2 flex min-w-0 items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary">
                                                <span className="truncate">{publicInfo.portfolioUrl}</span>
                                                <ExternalLinkIcon className="size-4 shrink-0" />
                                            </a>
                                        ) : (
                                            <p className="mt-2 text-sm text-text-warning">Belum ada portofolio utama di profilmu.</p>
                                        )}
                                        <p className="mt-2 text-xs leading-5 text-text-subheading">Tautan ini otomatis disertakan bersama pengajuanmu.</p>
                                    </div>
                                    <Link href="/profile" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-brand-primary hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                                        {publicInfo.portfolioUrl ? "Ganti portofolio" : "Tambah portofolio"}
                                    </Link>
                                </div>
                            </section>
                        </section>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                                {error}
                            </div>
                        )}

                        {/* Fixed action */}
                        <div className="sticky bottom-0 -mx-4 border-t border-border-default bg-background/95 px-4 pb-4 pt-3 backdrop-blur-sm">
                            <button
                                type="submit"
                                disabled={isPending || ownedOpenRoles.length === 0}
                                className="flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isPending ? "Mengirim pengajuan…" : "Kirim pengajuan"}
                            </button>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}
