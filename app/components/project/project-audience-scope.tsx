"use client";

import { InstitutionPicker } from "@/app/components/ui/institution-picker";
import type { InstitutionOption } from "@/app/lib/institution";
import { CheckIcon, MapPinIcon, UsersIcon, XIcon } from "@/app/components/ui/icons";

export type AudienceScope = "all" | "institution" | "city" | "province" | "selected";

type ProjectAudienceScopeProps = {
  scope: AudienceScope;
  selectedInstitutions: InstitutionOption[];
  onScopeChange: (scope: AudienceScope) => void;
  onSelectedInstitutionsChange: (institutions: InstitutionOption[]) => void;
  disabled?: boolean;
};

const MAX_INSTITUTIONS = 6;

const scopeOptions: Array<{
  value: AudienceScope;
  title: string;
  description: string;
}> = [
  { value: "all", title: "Semua sekolah dan kampus", description: "Terbuka untuk pelajar dan mahasiswa dari seluruh Indonesia." },
  { value: "institution", title: "Hanya institusi saya", description: "Hanya pengguna dari sekolah atau kampus yang sama dengan profilmu." },
  { value: "city", title: "Institusi di kota/kabupaten saya", description: "Terbuka untuk sekolah dan kampus yang berada di kota atau kabupaten yang sama." },
  { value: "province", title: "Institusi di provinsi saya", description: "Terbuka untuk sekolah dan kampus dalam provinsi yang sama." },
  { value: "selected", title: "Institusi tertentu", description: "Pilih sekolah atau kampus yang diizinkan mendaftar." },
];

export default function ProjectAudienceScope({
  scope,
  selectedInstitutions,
  onScopeChange,
  onSelectedInstitutionsChange,
  disabled,
}: ProjectAudienceScopeProps) {
  const isFull = selectedInstitutions.length >= MAX_INSTITUTIONS;

  function addInstitution(option: InstitutionOption | null) {
    if (!option || isFull) return;
    if (selectedInstitutions.some((item) => item.npsn === option.npsn)) return;
    onSelectedInstitutionsChange([...selectedInstitutions, option]);
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="audience-scope-heading">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-primary">
          <UsersIcon className="size-5" />
        </span>
        <div>
          <h2 id="audience-scope-heading" className="text-lg font-bold text-slate-950">Jangkauan calon anggota</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Tentukan asal sekolah atau kampus pengguna yang boleh mengajukan diri.</p>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="sr-only">Pilih jangkauan calon anggota</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {scopeOptions.map((option) => (
            <label
              key={option.value}
              className={`relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 pr-10 transition ${
                scope === option.value
                  ? "border-brand-primary bg-brand-soft ring-1 ring-brand-primary"
                  : "border-slate-200 bg-white hover:border-slate-400"
              }`}
            >
              <input
                type="radio"
                name="audienceScope"
                value={option.value}
                checked={scope === option.value}
                onChange={() => onScopeChange(option.value)}
                disabled={disabled}
                className="mt-1 size-4 shrink-0 accent-blue-600"
              />
              <span>
                <span className="block text-sm font-bold text-slate-900">{option.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{option.description}</span>
              </span>
              {scope === option.value ? <CheckIcon className="absolute right-3 top-3 size-5 text-brand-primary" /> : null}
            </label>
          ))}
        </div>
      </fieldset>

      {scope === "institution" || scope === "city" || scope === "province" ? (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3.5 text-blue-900">
          <MapPinIcon className="mt-0.5 size-5 shrink-0" />
          <p className="text-xs leading-5">
            {scope === "institution"
              ? "Institusi akan mengikuti sekolah atau kampus yang tersimpan di profilmu."
              : scope === "city"
                ? "Kota atau kabupaten akan mengikuti lokasi yang tersimpan di profilmu."
                : "Provinsi akan mengikuti lokasi yang tersimpan di profilmu."}
          </p>
        </div>
      ) : null}

      {scope === "selected" ? (
        <div className="mt-5 border-t border-slate-100 pt-5">
          {selectedInstitutions.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-2" aria-label="Institusi terpilih">
              {selectedInstitutions.map((institution) => (
                <span key={institution.npsn} className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-800">
                  <span className="truncate">{institution.name}</span>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      onSelectedInstitutionsChange(
                        selectedInstitutions.filter((item) => item.npsn !== institution.npsn),
                      )
                    }
                    className="grid size-6 shrink-0 place-items-center rounded-md hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    aria-label={`Hapus ${institution.name}`}
                  >
                    <XIcon className="size-4" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}

          <InstitutionPicker
            key={`allowed-institution-${selectedInstitutions.length}`}
            id="allowed-institution-input"
            label="Sekolah atau kampus yang diizinkan"
            kind="all"
            value={null}
            onChange={addInstitution}
            hint={`Cari dan pilih institusi dari daftar resmi. Maksimal ${MAX_INSTITUTIONS} institusi.`}
            disabled={disabled || isFull}
          />
        </div>
      ) : null}
    </section>
  );
}
