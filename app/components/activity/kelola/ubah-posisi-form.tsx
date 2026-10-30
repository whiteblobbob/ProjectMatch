"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { updateProject } from "@/app/actions/project";
import type { ProjectDetail } from "@/app/lib/ui/kelola-project";
import type { UpdateProjectForm } from "@/app/lib/validator/project";
import Breadcrumbs from "../../ui/breadcrumbs";
import {
  collaborationModes,
  getCollaborationModeLabel,
  getOfflinePlaceLabel,
  getOnlinePlatformLabel,
  offlinePlaces,
  onlinePlatforms,
  type CollaborationMode,
  type OfflinePlace,
  type OnlinePlatform,
} from "../../ui/collaboration-mode";
import {
  ArrowLeftIcon,
  CheckIcon,
  MapPinIcon,
  VideoIcon,
  WarningIcon,
} from "../../ui/icons";
import { SelectControl } from "../../ui/select-control";

type UbahPosisiFormProps = {
  project: ProjectDetail;
};

function toDateInputValue(value: Date | null) {
  if (!value) return "";
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function toTimeInputValue(value: Date | null) {
  if (!value) return "";
  const date = new Date(value);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export default function UbahPosisiForm({ project }: UbahPosisiFormProps) {
  const router = useRouter();
  const [collaborationMode, setCollaborationMode] = useState<CollaborationMode>(project.collaborationMode);
  const [isPending, setIsPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setSaved(false);

    const formData = new FormData(event.currentTarget);
    const hasOnline = collaborationMode === "ONLINE" || collaborationMode === "HYBRID";
    const hasOffline = collaborationMode === "OFFLINE" || collaborationMode === "HYBRID";
    const collaborationTool = String(formData.get("collaborationTools") ?? "").trim();
    const meetingDate = String(formData.get("meetingDate") ?? "");
    const meetingStart = String(formData.get("meetingStartTime") ?? "");
    const meetingEnd = String(formData.get("meetingEndTime") ?? "");

    const payload: UpdateProjectForm = {
      collaborationMode,
      onlinePlatform: hasOnline ? (String(formData.get("meetingPlatform") ?? "") as OnlinePlatform) : undefined,
      onlineLink: hasOnline ? String(formData.get("meetingUrl") ?? "") : undefined,
      offlinePlace: hasOffline ? (String(formData.get("meetingPlaceCategory") ?? "") as OfflinePlace) : undefined,
      offlineLink: hasOffline ? String(formData.get("meetingMapsUrl") ?? "") : undefined,
      meetDescription: String(formData.get("meetingDescription") ?? ""),
      meetAt: meetingDate && meetingStart ? new Date(`${meetingDate}T${meetingStart}`) : undefined,
      meetEndAt: meetingDate && meetingEnd ? new Date(`${meetingDate}T${meetingEnd}`) : undefined,
      collaborationTool: collaborationTool || undefined,
    };

    setIsPending(true);
    const result = await updateProject(project.id, payload);
    setIsPending(false);

    if (!result.success) {
      setError(result.error);
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      return;
    }

    setSaved(true);
    router.refresh();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const hasOnline = collaborationMode === "ONLINE" || collaborationMode === "HYBRID";
  const hasOffline = collaborationMode === "OFFLINE" || collaborationMode === "HYBRID";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[980px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Aktivitas", href: "/activity" },
              { label: "Kelola postingan", href: `/activity/project/${project.id}` },
              { label: "Ubah pertemuan" },
            ]}
          />
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-primary">{project.title}</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Ubah detail pertemuan</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Perbarui mode kolaborasi dan detail pertemuan pertama agar anggota tim mengetahui cara mereka akan berkolaborasi.
              </p>
            </div>
            <Link
              href={`/activity/project/${project.id}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <ArrowLeftIcon className="size-4" /> Kembali
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[980px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {saved ? (
          <div role="status" className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"><CheckIcon className="size-4" /></span>
            <div><p className="text-sm font-bold">Perubahan berhasil disimpan</p><p className="mt-1 text-xs leading-5">Detail pertemuan telah diperbarui.</p></div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-primary"><VideoIcon className="size-5" /></span>
              <div><h2 className="text-xl font-bold text-slate-950">Detail pertemuan</h2><p className="mt-1 text-sm text-slate-500">Atur mode kolaborasi dan informasi pertemuan pertama.</p></div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
              Posisi proyek dikunci setelah postingan dibuat dan tidak dapat diubah dari halaman ini.
            </p>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Mode kolaborasi</span>
              <SelectControl value={collaborationMode} onChange={(event) => setCollaborationMode(event.target.value as CollaborationMode)} disabled={isPending} containerClassName="mt-2" className="rounded-xl">
                {collaborationModes.map((mode) => <option key={mode} value={mode}>{getCollaborationModeLabel(mode)}</option>)}
              </SelectControl>
            </label>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5" aria-labelledby="meeting-detail-heading">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-primary shadow-sm">
                  {collaborationMode === "OFFLINE" ? <MapPinIcon className="size-5" /> : <VideoIcon className="size-5" />}
                </span>
                <div>
                  <h3 id="meeting-detail-heading" className="text-base font-bold text-slate-950">Detail pertemuan pertama</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Field menyesuaikan mode {getCollaborationModeLabel(collaborationMode).toLowerCase()} yang dipilih.</p>
                </div>
              </div>

              {hasOnline ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">Platform pertemuan</span>
                    <SelectControl name="meetingPlatform" defaultValue={project.onlinePlatform ?? "GOOGLE_MEET"} disabled={isPending} containerClassName="mt-2" className="rounded-xl">
                      {onlinePlatforms.map((platform) => <option key={platform} value={platform}>{getOnlinePlatformLabel(platform)}</option>)}
                    </SelectControl>
                    {fieldErrors.onlinePlatform ? <span className="mt-1 block text-xs text-rose-600">{fieldErrors.onlinePlatform[0]}</span> : null}
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">Tautan pertemuan</span>
                    <input name="meetingUrl" type="url" required defaultValue={project.onlineLink ?? ""} disabled={isPending} placeholder="https://meet.google.com/..." className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
                    {fieldErrors.onlineLink ? <span className="mt-1 block text-xs text-rose-600">{fieldErrors.onlineLink[0]}</span> : null}
                  </label>
                </div>
              ) : null}

              {hasOffline ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">Kategori tempat aman</span>
                    <SelectControl name="meetingPlaceCategory" defaultValue={project.offlinePlace ?? ""} required disabled={isPending} containerClassName="mt-2" className="rounded-xl">
                      <option value="" disabled>Pilih kategori</option>
                      {offlinePlaces.map((place) => <option key={place} value={place}>{getOfflinePlaceLabel(place)}</option>)}
                    </SelectControl>
                    {fieldErrors.offlinePlace ? <span className="mt-1 block text-xs text-rose-600">{fieldErrors.offlinePlace[0]}</span> : null}
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-900">Tautan Google Maps</span>
                    <input name="meetingMapsUrl" type="url" required defaultValue={project.offlineLink ?? ""} disabled={isPending} placeholder="https://maps.google.com/..." className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
                    {fieldErrors.offlineLink ? <span className="mt-1 block text-xs text-rose-600">{fieldErrors.offlineLink[0]}</span> : null}
                  </label>
                </div>
              ) : null}

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-900">Tanggal pertemuan</span>
                  <input name="meetingDate" type="date" defaultValue={toDateInputValue(project.meetAt)} disabled={isPending} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-900">Mulai</span>
                  <input name="meetingStartTime" type="time" defaultValue={toTimeInputValue(project.meetAt)} disabled={isPending} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-900">Selesai</span>
                  <input name="meetingEndTime" type="time" defaultValue={toTimeInputValue(project.meetEndAt)} disabled={isPending} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="text-sm font-semibold text-slate-900">Deskripsi dan petunjuk pertemuan</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">Berikan patokan yang jelas tanpa membagikan informasi pribadi atau alamat rumah.</span>
                <textarea key={collaborationMode} name="meetingDescription" defaultValue={project.meetDescription} rows={3} required disabled={isPending} className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
                {fieldErrors.meetDescription ? <span className="mt-1 block text-xs text-rose-600">{fieldErrors.meetDescription[0]}</span> : null}
              </label>

              {hasOffline ? (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-amber-900">
                  <WarningIcon className="mt-0.5 size-5 shrink-0" />
                  <p className="text-xs leading-5">Gunakan sekolah, kampus, ruang publik, atau kafe yang dapat diverifikasi. Jangan mengarahkan calon anggota ke rumah pribadi atau tempat sepi.</p>
                </div>
              ) : null}
            </section>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Alat kolaborasi <span className="font-normal text-slate-400">(opsional)</span></span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">Kosongkan jika belum ditentukan.</span>
              <input name="collaborationTools" defaultValue={project.collaborationTool ?? ""} disabled={isPending} placeholder="Contoh: Figma, Google Drive, Notion" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
            </label>

            <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
              Persyaratan tambahan, jangkauan institusi, dan komitmen per minggu belum dapat disimpan dari backend.
            </p>

            {error ? (
              <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
            <Link href={`/activity/project/${project.id}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Batal</Link>
            <button type="submit" disabled={isPending} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-primary px-6 text-sm font-semibold text-white hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">
              {isPending ? "Menyimpan…" : "Simpan perubahan"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
