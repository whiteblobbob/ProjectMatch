"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createProjectPosting } from "@/app/actions/project";
import type { ProjectFormOptions } from "@/app/lib/project-form";

type Position = {
  name: string;
  slotsAvailable: number;
};

const educationLevels = [
  { value: "JUNIOR_SECONDARY", label: "SMP/sederajat" },
  { value: "SENIOR_SECONDARY", label: "SMA/SMK/sederajat" },
  { value: "HIGHER_EDUCATION", label: "Mahasiswa" },
] as const;

export default function CreateProjectForm({ options }: { options: ProjectFormOptions }) {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([{ name: "", slotsAvailable: 1 }]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const updatePosition = (index: number, nextPosition: Position) => {
    setPositions((current) => current.map((position, itemIndex) => itemIndex === index ? nextPosition : position));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const selectedEducationLevels = formData.getAll("educationLevels").map(String) as Array<(typeof educationLevels)[number]["value"]>;
    const selectedPositions = positions
      .map((position) => ({ ...position, name: position.name.trim() }))
      .filter((position) => position.name);

    if (selectedEducationLevels.length === 0) {
      setError("Pilih minimal satu jenjang pelajar.");
      return;
    }

    if (selectedPositions.length === 0) {
      setError("Tambahkan minimal satu posisi yang dicari.");
      return;
    }

    if (new Set(selectedPositions.map((position) => position.name.toLocaleLowerCase("id-ID"))).size !== selectedPositions.length) {
      setError("Nama setiap posisi harus berbeda.");
      return;
    }

    setIsPending(true);
    const deadlineValue = String(formData.get("deadline") ?? "");
    const result = await createProjectPosting({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      deadline: new Date(`${deadlineValue}T23:59:59`),
      categoryId: String(formData.get("categoryId") ?? ""),
      onSite: formData.get("workMode") === "onsite",
      workHoursPerWeek: Number(formData.get("workHoursPerWeek")),
      educationLevels: selectedEducationLevels,
      positions: selectedPositions,
    });

    if (!result.success) {
      setError(result.error);
      setIsPending(false);
      return;
    }

    router.push("/aktivitas");
    router.refresh();
  }

  return (
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
            <select id="project-category" name="categoryId" required disabled={isPending} defaultValue="" className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-blue-100">
              <option value="" disabled>Pilih jenis proyek</option>
              {options.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="project-deadline" className="block text-sm font-semibold text-slate-900">Tenggat lamaran</label>
            <input id="project-deadline" name="deadline" type="date" required disabled={isPending} min={new Date().toISOString().slice(0, 10)} className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-primary focus:ring-4 focus:ring-blue-100" />
          </div>
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">Mode kerja</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[{ value: "remote", label: "Remote" }, { value: "onsite", label: "On-site" }].map((mode) => (
                <label key={mode.value} className="flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 has-checked:border-brand-primary has-checked:bg-brand-soft has-checked:text-brand-primary">
                  <input type="radio" name="workMode" value={mode.value} defaultChecked={mode.value === "remote"} disabled={isPending} className="size-4 accent-blue-600" />
                  {mode.label}
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

      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="positions-heading">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 id="positions-heading" className="text-lg font-bold text-slate-950">Posisi yang dicari</h2>
            <p className="mt-1 text-sm text-slate-600">Tulis peran apa pun yang dibutuhkan, dari bidang seni, sosial, sains, bisnis, hingga teknologi.</p>
          </div>
          <button type="button" disabled={isPending || positions.length >= 10} onClick={() => setPositions((current) => [...current, { name: "", slotsAvailable: 1 }])} className="min-h-11 shrink-0 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-brand-primary hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-50">
            Tambah posisi
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {positions.map((position, index) => (
            <div key={index} className="grid gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-[minmax(0,1fr)_130px_auto] sm:items-end">
              <div>
                <label htmlFor={`project-role-${index}`} className="block text-xs font-semibold text-slate-700">Nama posisi</label>
                <input id={`project-role-${index}`} value={position.name} required minLength={2} maxLength={80} disabled={isPending} onChange={(event) => updatePosition(index, { ...position, name: event.target.value })} placeholder="Contoh: Ilustrator, Peneliti sejarah, Bendahara" className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label htmlFor={`project-slots-${index}`} className="block text-xs font-semibold text-slate-700">Jumlah orang</label>
                <input id={`project-slots-${index}`} type="number" min={1} max={20} required disabled={isPending} value={position.slotsAvailable} onChange={(event) => updatePosition(index, { ...position, slotsAvailable: Number(event.target.value) })} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-blue-100" />
              </div>
              <button type="button" disabled={isPending || positions.length === 1} onClick={() => setPositions((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Hapus posisi ${index + 1}`} className="inline-flex size-11 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-30">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="criteria-heading">
        <h2 id="criteria-heading" className="text-lg font-bold text-slate-950">Jenjang pelajar</h2>
        <p className="mt-1 text-sm text-slate-600">ProjectMatch khusus pelajar. Pilih jenjang yang dapat mendaftar ke proyek ini.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {educationLevels.map((level) => (
            <label key={level.value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50 has-checked:border-brand-primary has-checked:bg-brand-soft">
              <input type="checkbox" name="educationLevels" value={level.value} disabled={isPending} className="size-4 rounded accent-blue-600" />
              {level.label}
            </label>
          ))}
        </div>
      </section>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Batal</Link>
        <button type="submit" disabled={isPending} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-primary px-6 text-sm font-semibold text-white hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">
          {isPending ? "Menerbitkan…" : "Terbitkan postingan"}
        </button>
      </div>
    </form>
  );
}
