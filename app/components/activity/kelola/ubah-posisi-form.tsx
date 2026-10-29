"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useId, useRef, useState } from "react";

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
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
  VideoIcon,
  WarningIcon,
  XIcon,
} from "../../ui/icons";
import { SelectControl } from "../../ui/select-control";

type CatalogOption = {
  id: string;
  name: string;
};

type Position = {
  roleId: string;
  name: string;
  slotsAvailable: number;
};

type UbahPosisiFormProps = {
  project: ProjectDetail;
  roles: CatalogOption[];
};

export default function UbahPosisiForm({ project, roles }: UbahPosisiFormProps) {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>(
    project.projectRoles.map((projectRole) => ({
      roleId: projectRole.roleId,
      name: projectRole.role.name,
      slotsAvailable: projectRole.slotsAvailable,
    })),
  );
  const [collaborationMode, setCollaborationMode] = useState<CollaborationMode>(project.collaborationMode);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function openAddDialog() {
    setEditingIndex(null);
    setDialogOpen(true);
  }

  function openEditDialog(index: number) {
    setEditingIndex(index);
    setDialogOpen(true);
  }

  function savePosition(position: Position) {
    setPositions((current) =>
      editingIndex === null
        ? [...current, position]
        : current.map((item, index) => (index === editingIndex ? position : item)),
    );
    setDialogOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setSaved(false);

    if (positions.length === 0) {
      setError("Tambahkan minimal satu posisi yang dicari.");
      return;
    }

    if (new Set(positions.map((position) => position.roleId)).size !== positions.length) {
      setError("Setiap posisi hanya boleh ditambahkan sekali.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const hasOnline = collaborationMode === "ONLINE" || collaborationMode === "HYBRID";
    const hasOffline = collaborationMode === "OFFLINE" || collaborationMode === "HYBRID";
    const collaborationTool = String(formData.get("collaborationTools") ?? "").trim();

    const payload: UpdateProjectForm = {
      collaborationMode,
      onlinePlatform: hasOnline ? (String(formData.get("meetingPlatform") ?? "") as OnlinePlatform) : undefined,
      onlineLink: hasOnline ? String(formData.get("meetingUrl") ?? "") : undefined,
      offlinePlace: hasOffline ? (String(formData.get("meetingPlaceCategory") ?? "") as OfflinePlace) : undefined,
      offlineLink: hasOffline ? String(formData.get("meetingMapsUrl") ?? "") : undefined,
      meetDescription: String(formData.get("meetingDescription") ?? ""),
      collaborationTool: collaborationTool || undefined,
      projectRoles: positions.map((position) => ({
        roleId: position.roleId,
        slotsAvailable: position.slotsAvailable,
      })),
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
              { label: "Ubah postingan" },
            ]}
          />
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-primary">{project.title}</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Ubah postingan</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Atur kebutuhan posisi dan detail pertemuan agar calon anggota memahami cara mereka akan belajar dan berkolaborasi bersama tim.
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
            <div><p className="text-sm font-bold">Perubahan berhasil disimpan</p><p className="mt-1 text-xs leading-5">Detail postingan telah diperbarui.</p></div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-primary"><UsersIcon className="size-5" /></span>
              <div><h2 className="text-xl font-bold text-slate-950">Detail posisi</h2><p className="mt-1 text-sm text-slate-500">Atur posisi yang dibuka beserta jumlah anggotanya.</p></div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <section aria-labelledby="positions-heading">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 id="positions-heading" className="text-base font-bold text-slate-950">Posisi yang dicari</h3>
                  <p className="mt-1 text-sm text-slate-600">Ketuk posisi untuk mengubah peran atau jumlah anggotanya.</p>
                </div>
                <button
                  type="button"
                  disabled={isPending || positions.length >= 10}
                  onClick={openAddDialog}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-brand-primary hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50"
                >
                  <PlusIcon className="size-4 shrink-0" /> Tambah posisi
                </button>
              </div>

              {positions.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-7 text-center">
                  <p className="text-sm font-semibold text-slate-800">Belum ada posisi</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Tambahkan minimal satu peran yang dibutuhkan tim.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {positions.map((position, index) => (
                    <article key={`${position.roleId}-${index}`} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-950">{position.name}</p>
                        <p className="mt-1 text-xs text-slate-500">Membutuhkan {position.slotsAvailable} orang</p>
                      </div>
                      <div className="flex gap-2 sm:shrink-0">
                        <button type="button" disabled={isPending} onClick={() => openEditDialog(index)} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary sm:flex-none">
                          <PencilIcon className="size-4 shrink-0" /> Ubah
                        </button>
                        <button type="button" disabled={isPending} onClick={() => setPositions((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Hapus posisi ${position.name}`} className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50">
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

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
              <span className="mt-1 block text-xs leading-5 text-slate-500">Kosongkan jika belum ditentukan. Kamu dapat menambahkannya nanti.</span>
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

      {dialogOpen ? (
        <PositionDialog
          key={`${editingIndex ?? "new"}-${editingIndex === null ? "" : positions[editingIndex]?.roleId}`}
          initialPosition={editingIndex === null ? undefined : positions[editingIndex]}
          existingPositions={positions}
          editingIndex={editingIndex}
          roles={roles}
          onCancel={() => setDialogOpen(false)}
          onSave={savePosition}
        />
      ) : null}
    </main>
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
  const [roleId, setRoleId] = useState(initialPosition?.roleId ?? "");
  const [slotsAvailable, setSlotsAvailable] = useState(initialPosition?.slotsAvailable ?? 1);
  const [dialogError, setDialogError] = useState("");
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() =>
      dialogRef.current?.querySelector<HTMLElement>("select")?.focus(),
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
    const role = roles.find((item) => item.id === roleId);
    if (!role) {
      setDialogError("Pilih posisi terlebih dahulu.");
      return;
    }
    const isDuplicate = existingPositions.some((position, index) => index !== editingIndex && position.roleId === roleId);
    if (isDuplicate) {
      setDialogError("Posisi tersebut sudah ditambahkan.");
      return;
    }
    onSave({ roleId: role.id, name: role.name, slotsAvailable });
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
            <SelectControl value={roleId} onChange={(event) => setRoleId(event.target.value)} required containerClassName="mt-2" className="rounded-xl">
              <option value="" disabled>Pilih posisi</option>
              {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
            </SelectControl>
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
