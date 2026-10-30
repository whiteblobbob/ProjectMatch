"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { createProject } from "@/app/actions/project";
import type { InstitutionOption } from "@/app/lib/institution";
import { educationLevelOptions } from "@/app/lib/ui/profile";
import type { EducationLevel } from "@/app/lib/validator/profile";
import type { ProjectRange } from "@/app/lib/validator/project";
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
} from "@/app/components/ui/collaboration-mode";
import { MapPinIcon, PencilIcon, PlusIcon, TrashIcon, VideoIcon, WarningIcon, XIcon } from "../ui/icons";
import { SelectControl } from "../ui/select-control";
import ProjectAudienceScope, { type AudienceScope } from "./project-audience-scope";

type CatalogOption = {
  id: string;
  name: string;
};

type Position = {
  roleName: string;
  slotsAvailable: number;
};

const rangeForScope: Record<AudienceScope, ProjectRange> = {
  all: "ALL",
  institution: "INTERNAL",
  city: "CITY",
  province: "PROVINCE",
  selected: "INSTITUTIONS",
};

export default function CreateProjectForm({
  categories,
  roles,
}: {
  categories: CatalogOption[];
  roles: CatalogOption[];
}) {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [collaborationMode, setCollaborationMode] = useState<CollaborationMode>("ONLINE");
  const [positionDialogOpen, setPositionDialogOpen] = useState(false);
  const [editingPositionIndex, setEditingPositionIndex] = useState<number | null>(null);
  const [hasCustomRequirements, setHasCustomRequirements] = useState(false);
  const [audienceScope, setAudienceScope] = useState<AudienceScope>("all");
  const [selectedInstitutions, setSelectedInstitutions] = useState<InstitutionOption[]>([]);

  function openAddPositionDialog() {
    setEditingPositionIndex(null);
    setPositionDialogOpen(true);
  }

  function openEditPositionDialog(index: number) {
    setEditingPositionIndex(index);
    setPositionDialogOpen(true);
  }

  function savePosition(position: Position) {
    if (editingPositionIndex === null) {
      setPositions((current) => [...current, position]);
    } else {
      setPositions((current) => current.map((item, index) => index === editingPositionIndex ? position : item));
    }
    setPositionDialogOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const selectedEducationLevels = formData.getAll("educationLevels").map(String) as EducationLevel[];
    const selectedPositions = positions.filter((position) => position.roleName);

    if (selectedEducationLevels.length === 0) {
      setError("Pilih minimal satu jenjang pelajar.");
      return;
    }

    if (selectedPositions.length === 0) {
      setError("Tambahkan minimal satu posisi yang dicari.");
      return;
    }

    if (audienceScope === "selected" && selectedInstitutions.length === 0) {
      setError("Pilih minimal satu sekolah atau kampus yang diizinkan mendaftar.");
      return;
    }

    if (new Set(selectedPositions.map((position) => position.roleName.trim().toLocaleLowerCase("id-ID"))).size !== selectedPositions.length) {
      setError("Setiap posisi hanya boleh ditambahkan sekali.");
      return;
    }

    setIsPending(true);
    const deadlineValue = String(formData.get("deadline") ?? "");
    const hasOnline = collaborationMode === "ONLINE" || collaborationMode === "HYBRID";
    const hasOffline = collaborationMode === "OFFLINE" || collaborationMode === "HYBRID";
    const collaborationTool = String(formData.get("collaborationTools") ?? "").trim();
    const extraCriteria = String(formData.get("customRequirements") ?? "").trim();
    const sourceLink = String(formData.get("requirementsSourceUrl") ?? "").trim();
    const meetingDate = String(formData.get("meetingDate") ?? "");
    const meetingStart = String(formData.get("meetingStartTime") ?? "");
    const meetingEnd = String(formData.get("meetingEndTime") ?? "");
    const meetAt = meetingDate && meetingStart ? new Date(`${meetingDate}T${meetingStart}`) : undefined;
    const meetEndAt = meetingDate && meetingEnd ? new Date(`${meetingDate}T${meetingEnd}`) : undefined;
    const result = await createProject({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      deadline: new Date(`${deadlineValue}T23:59:59`),
      categoryId: String(formData.get("categoryId") ?? ""),
      collaborationMode,
      onlinePlatform: hasOnline ? (String(formData.get("meetingPlatform") ?? "") as OnlinePlatform) : undefined,
      onlineLink: hasOnline ? String(formData.get("meetingUrl") ?? "") : undefined,
      offlinePlace: hasOffline ? (String(formData.get("meetingPlaceCategory") ?? "") as OfflinePlace) : undefined,
      offlineLink: hasOffline ? String(formData.get("meetingMapsUrl") ?? "") : undefined,
      meetDescription: String(formData.get("meetingDescription") ?? ""),
      meetAt,
      meetEndAt,
      collaborationTool: collaborationTool || undefined,
      workHoursPerWeek: Number(formData.get("workHoursPerWeek")),
      educationLevels: selectedEducationLevels,
      range: rangeForScope[audienceScope],
      allowedInstitutions: selectedInstitutions.map((institution) => institution.npsn),
      extraCriteria: extraCriteria || undefined,
      sourceLink: sourceLink || undefined,
      projectRoles: selectedPositions.map((position) => ({
        roleName: position.roleName,
        slotsAvailable: position.slotsAvailable,
      })),
    });

    if (!result.success) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    router.push("/activity");
    router.refresh();
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="project-basics">
        <h2 id="project-basics" className="text-lg font-bold text-slate-950">Informasi proyek</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="project-title" className="block text-sm font-semibold text-slate-900">Nama proyek</label>
            <input id="project-title" name="title" required disabled={isPending} placeholder="Contoh: EcoTrack" className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="project-description" className="block text-sm font-semibold text-slate-900">Deskripsi</label>
            <textarea id="project-description" name="description" required disabled={isPending} rows={5} placeholder="Jelaskan tujuan, ruang lingkup, dan hasil yang ingin dicapai." className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
          </div>
          <div>
            <label htmlFor="project-category" className="block text-sm font-semibold text-slate-900">Jenis proyek</label>
            <SelectControl id="project-category" name="categoryId" required disabled={isPending} defaultValue="" containerClassName="mt-2">
              <option value="" disabled>Pilih jenis proyek</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </SelectControl>
          </div>
          <div>
            <label htmlFor="project-deadline" className="block text-sm font-semibold text-slate-900">Tenggat lamaran</label>
            <input id="project-deadline" name="deadline" type="date" required disabled={isPending} min={new Date().toISOString().slice(0, 10)} className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
          </div>
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">Mode kolaborasi</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {collaborationModes.map((mode) => (
                <label key={mode} className="flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 has-checked:border-brand-primary has-checked:bg-brand-soft has-checked:text-brand-primary">
                  <input type="radio" name="collaborationMode" value={mode} checked={collaborationMode === mode} onChange={() => setCollaborationMode(mode)} disabled={isPending} className="size-4 accent-blue-600" />
                  {getCollaborationModeLabel(mode)}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="project-hours" className="block text-sm font-semibold text-slate-900">Komitmen per minggu</label>
            <div className="relative mt-2">
              <input id="project-hours" name="workHoursPerWeek" type="number" min={1} max={80} defaultValue={6} required disabled={isPending} className="min-h-12 w-full rounded-lg border border-slate-300 px-3 pr-28 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">jam/minggu</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="meeting-plan-heading">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
            {collaborationMode === "OFFLINE" ? <MapPinIcon className="size-5" /> : <VideoIcon className="size-5" />}
          </span>
          <div>
            <h2 id="meeting-plan-heading" className="text-lg font-bold text-slate-950">Rencana pertemuan</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Berikan gambaran awal agar calon anggota mengetahui cara dan tempat tim akan berkolaborasi.</p>
          </div>
        </div>

        {(collaborationMode === "ONLINE" || collaborationMode === "HYBRID") ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Platform pertemuan</span>
              <SelectControl name="meetingPlatform" defaultValue="GOOGLE_MEET" disabled={isPending} containerClassName="mt-2">
                {onlinePlatforms.map((platform) => <option key={platform} value={platform}>{getOnlinePlatformLabel(platform)}</option>)}
              </SelectControl>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Tautan pertemuan</span>
              <input name="meetingUrl" type="url" required disabled={isPending} placeholder="https://meet.google.com/..." className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
            </label>
          </div>
        ) : null}

        {(collaborationMode === "OFFLINE" || collaborationMode === "HYBRID") ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Kategori tempat aman</span>
              <SelectControl name="meetingPlaceCategory" defaultValue="" required disabled={isPending} containerClassName="mt-2">
                <option value="" disabled>Pilih kategori</option>
                {offlinePlaces.map((place) => <option key={place} value={place}>{getOfflinePlaceLabel(place)}</option>)}
              </SelectControl>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Tautan Google Maps</span>
              <input name="meetingMapsUrl" type="url" required disabled={isPending} placeholder="https://maps.google.com/..." className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
            </label>
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Tanggal pertemuan</span>
            <input name="meetingDate" type="date" disabled={isPending} className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Mulai</span>
            <input name="meetingStartTime" type="time" disabled={isPending} className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Selesai</span>
            <input name="meetingEndTime" type="time" disabled={isPending} className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
          </label>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-slate-900">Deskripsi dan petunjuk pertemuan</span>
          <span className="mt-1 block text-xs leading-5 text-slate-500">Jelaskan agenda, patokan tempat, atau hal yang perlu disiapkan. Jangan mencantumkan alamat rumah atau data pribadi.</span>
          <textarea key={collaborationMode} name="meetingDescription" required disabled={isPending} rows={3} placeholder={collaborationMode === "ONLINE" ? "Contoh: Masuk 10 menit lebih awal untuk perkenalan." : "Contoh: Bertemu di taman kampus dekat perpustakaan utama."} className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-slate-900">Alat kolaborasi <span className="font-normal text-slate-400">(opsional)</span></span>
          <span className="mt-1 block text-xs leading-5 text-slate-500">Kosongkan jika belum ditentukan. Kamu dapat mengubahnya nanti.</span>
          <input name="collaborationTools" disabled={isPending} placeholder="Contoh: Figma, Google Drive, Notion" className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
        </label>

        {(collaborationMode === "OFFLINE" || collaborationMode === "HYBRID") ? (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-amber-900">
            <WarningIcon className="mt-0.5 size-5 shrink-0" />
            <p className="text-xs leading-5">Gunakan sekolah, kampus, ruang publik, atau kafe yang mudah diverifikasi. Hindari rumah pribadi dan tempat sepi.</p>
          </div>
        ) : null}

      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="positions-heading">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 id="positions-heading" className="text-lg font-bold text-slate-950">Posisi yang dicari</h2>
            <p className="mt-1 text-sm text-slate-600">Tulis peran apa pun yang dibutuhkan, dari bidang seni, sosial, sains, bisnis, hingga teknologi.</p>
          </div>
          <button type="button" disabled={isPending || positions.length >= 10} onClick={openAddPositionDialog} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-brand-primary hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50">
            <PlusIcon className="size-4 shrink-0" /> Tambah posisi
          </button>
        </div>
        {positions.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-7 text-center">
            <p className="text-sm font-semibold text-slate-800">Belum ada posisi ditambahkan</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Tambahkan minimal satu peran yang dibutuhkan tim.</p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {positions.map((position, index) => (
              <article key={`${position.roleName}-${index}`} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-950">{position.roleName}</p>
                  <p className="mt-1 text-xs text-slate-500">Membutuhkan {position.slotsAvailable} orang</p>
                </div>
                <div className="flex gap-2 sm:shrink-0">
                  <button type="button" disabled={isPending} onClick={() => openEditPositionDialog(index)} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary sm:flex-none">
                    <PencilIcon className="size-4 shrink-0" /> Ubah
                  </button>
                  <button type="button" disabled={isPending} onClick={() => setPositions((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Hapus posisi ${position.roleName}`} className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="criteria-heading">
        <h2 id="criteria-heading" className="text-lg font-bold text-slate-950">Jenjang pelajar</h2>
        <p className="mt-1 text-sm text-slate-600">ProjectMatch khusus pelajar. Pilih jenjang yang dapat mendaftar ke proyek ini.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {educationLevelOptions.map((level) => (
            <label key={level.value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50 has-checked:border-brand-primary has-checked:bg-brand-soft">
              <input type="checkbox" name="educationLevels" value={level.value} disabled={isPending} className="size-4 rounded accent-blue-600" />
              {level.label}
            </label>
          ))}
        </div>
      </section>

      <ProjectAudienceScope
        scope={audienceScope}
        selectedInstitutions={selectedInstitutions}
        onScopeChange={setAudienceScope}
        onSelectedInstitutionsChange={setSelectedInstitutions}
        disabled={isPending}
      />

      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="custom-requirements-heading">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="custom-requirements-heading" className="text-lg font-bold text-slate-950">Persyaratan tambahan <span className="text-sm font-normal text-slate-400">(opsional)</span></h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Tambahkan hanya jika proyek memiliki ketentuan khusus di luar jenjang pelajar yang sudah dipilih.</p>
          </div>
          <label className="relative inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-3">
            <input type="checkbox" checked={hasCustomRequirements} onChange={(event) => setHasCustomRequirements(event.target.checked)} disabled={isPending} className="peer sr-only" />
            <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-brand-primary peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary peer-focus-visible:ring-offset-2 after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" aria-hidden="true" />
            <span className="sr-only">Aktifkan persyaratan tambahan</span>
          </label>
        </div>

        {hasCustomRequirements ? (
          <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Daftar persyaratan</span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">Tulis satu persyaratan pada setiap baris.</span>
              <textarea name="customRequirements" required disabled={isPending} rows={4} placeholder={"Contoh:\nPelajar SMA/SMK atau mahasiswa aktif\nBersedia mengikuti pertemuan awal"} className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Tautan sumber <span className="font-normal text-slate-400">(opsional)</span></span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">Gunakan jika persyaratan berasal dari penyelenggara, sekolah, kampus, atau organisasi tertentu.</span>
              <input name="requirementsSourceUrl" type="url" disabled={isPending} placeholder="https://..." className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
            </label>
          </div>
        ) : null}
      </section>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Batal</Link>
        <button type="submit" disabled={isPending} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-primary px-6 text-sm font-semibold text-white hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">
          {isPending ? "Menerbitkan…" : "Terbitkan postingan"}
        </button>
      </div>
    </form>

    {positionDialogOpen ? (
      <PositionDialog
        key={`${editingPositionIndex ?? "new"}-${editingPositionIndex === null ? "" : positions[editingPositionIndex]?.roleName}`}
        initialPosition={editingPositionIndex === null ? undefined : positions[editingPositionIndex]}
        existingPositions={positions}
        editingIndex={editingPositionIndex}
        roles={roles}
        onCancel={() => setPositionDialogOpen(false)}
        onSave={savePosition}
      />
    ) : null}
    </>
  );
}

type PositionDialogProps = {
  initialPosition?: Position;
  existingPositions: Position[];
  editingIndex: number | null;
  roles: CatalogOption[];
  onCancel: () => void;
  onSave: (position: Position) => void;
};

function PositionDialog({ initialPosition, existingPositions, editingIndex, roles, onCancel, onSave }: PositionDialogProps) {
  const [roleName, setRoleName] = useState(initialPosition?.roleName ?? "");
  const [slotsAvailable, setSlotsAvailable] = useState(initialPosition?.slotsAvailable ?? 1);
  const [dialogError, setDialogError] = useState("");
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() =>
      dialogRef.current?.querySelector<HTMLElement>("input")?.focus(),
    );

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input, select"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onCancel]);

  function handleDialogSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = roleName.trim();
    if (!name) {
      setDialogError("Tulis posisi terlebih dahulu.");
      return;
    }
    const isDuplicate = existingPositions.some((position, index) => index !== editingIndex && position.roleName.toLocaleLowerCase("id-ID") === name.toLocaleLowerCase("id-ID"));
    if (isDuplicate) {
      setDialogError("Posisi tersebut sudah ditambahkan.");
      return;
    }
    onSave({ roleName: name, slotsAvailable });
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button type="button" aria-label="Tutup modal posisi" tabIndex={-1} onClick={onCancel} className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative w-full rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-[480px] sm:rounded-3xl sm:p-7">
        <button type="button" aria-label="Tutup" onClick={onCancel} className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"><XIcon className="size-5" /></button>
        <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand-primary"><PlusIcon className="size-5" /></span>
        <h2 id={titleId} className="mt-4 pr-10 text-xl font-bold text-slate-950">{editingIndex === null ? "Tambah posisi" : "Ubah posisi"}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">Tentukan peran dan jumlah anggota yang dibutuhkan.</p>

        <form onSubmit={handleDialogSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Posisi</span>
            <input list={`${titleId}-suggestions`} value={roleName} onChange={(event) => setRoleName(event.target.value)} required placeholder="Tulis posisi atau pilih saran" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-blue-100" />
            <datalist id={`${titleId}-suggestions`}>
              {roles.map((role) => <option key={role.id} value={role.name} />)}
            </datalist>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Jumlah anggota</span>
            <input type="number" min={1} max={20} value={slotsAvailable} onChange={(event) => setSlotsAvailable(Number(event.target.value))} required className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-blue-100" />
          </label>
          {dialogError ? <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-3 text-xs font-medium text-rose-700">{dialogError}</p> : null}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={onCancel} className="min-h-11 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
            <button type="submit" className="min-h-11 rounded-xl bg-brand-primary px-4 text-sm font-semibold text-white hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">Simpan posisi</button>
          </div>
        </form>
      </div>
    </div>
  );
}
