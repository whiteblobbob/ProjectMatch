"use client";

import { useMemo, useState } from "react";
import { institutionOptions, type InstitutionOption } from "@/app/components/auth/registration/institution-combobox";
import { CheckIcon, MapPinIcon, SearchIcon, UsersIcon, XIcon } from "@/app/components/ui/icons";

export type AudienceScope = "all" | "institution" | "city" | "province" | "selected";

type ProjectAudienceScopeProps = {
  scope: AudienceScope;
  selectedInstitutions: InstitutionOption[];
  onScopeChange: (scope: AudienceScope) => void;
  onSelectedInstitutionsChange: (institutions: InstitutionOption[]) => void;
  disabled?: boolean;
};

const scopeOptions: Array<{
  value: AudienceScope;
  title: string;
  description: string;
}> = [
  { value: "all", title: "Semua sekolah dan kampus", description: "Terbuka untuk pelajar dan mahasiswa dari seluruh Indonesia." },
  { value: "institution", title: "Hanya institusi saya", description: "Hanya pengguna dari sekolah atau kampus yang sama dengan profilmu." },
  { value: "city", title: "Institusi di kota/kabupaten saya", description: "Terbuka untuk sekolah dan kampus yang berada di kota atau kabupaten yang sama." },
  { value: "province", title: "Institusi di provinsi saya", description: "Terbuka untuk sekolah dan kampus dalam provinsi yang sama." },
  { value: "selected", title: "Institusi tertentu", description: "Pilih sendiri sekolah atau kampus yang diizinkan mendaftar." },
];

export default function ProjectAudienceScope({
  scope,
  selectedInstitutions,
  onScopeChange,
  onSelectedInstitutionsChange,
  disabled,
}: ProjectAudienceScopeProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");

  const results = useMemo(() => {
    if (normalizedQuery.length < 2) return [];

    const selectedIds = new Set(selectedInstitutions.map((institution) => institution.id));
    return institutionOptions
      .filter((institution) => !selectedIds.has(institution.id))
      .filter((institution) =>
        [institution.name, institution.category, institution.city, institution.province]
          .join(" ")
          .toLocaleLowerCase("id-ID")
          .includes(normalizedQuery),
      )
      .slice(0, 6);
  }, [normalizedQuery, selectedInstitutions]);

  const addInstitution = (institution: InstitutionOption) => {
    if (selectedInstitutions.length >= 6) return;
    onSelectedInstitutionsChange([...selectedInstitutions, institution]);
    setQuery("");
  };

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
          <label htmlFor="allowed-institution-search" className="text-sm font-semibold text-slate-900">Sekolah atau kampus yang diizinkan</label>
          <p className="mt-1 text-xs leading-5 text-slate-500">Ketik minimal 2 karakter dan pilih hasil. Maksimal 6 institusi.</p>

          {selectedInstitutions.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Institusi terpilih">
              {selectedInstitutions.map((institution) => (
                <span key={institution.id} className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-800">
                  <span className="truncate">{institution.name}</span>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectedInstitutionsChange(selectedInstitutions.filter((item) => item.id !== institution.id))}
                    className="grid size-6 shrink-0 place-items-center rounded-md hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    aria-label={`Hapus ${institution.name}`}
                  >
                    <XIcon className="size-4" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}

          <div className="relative mt-3">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              id="allowed-institution-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={disabled || selectedInstitutions.length >= 6}
              placeholder={selectedInstitutions.length >= 6 ? "Maksimal 6 institusi" : "Cari nama sekolah atau kampus"}
              autoComplete="off"
              className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          {normalizedQuery.length >= 2 ? (
            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {results.length > 0 ? (
                <ul className="max-h-64 overflow-y-auto p-1.5">
                  {results.map((institution) => (
                    <li key={institution.id}>
                      <button
                        type="button"
                        onClick={() => addInstitution(institution)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                      >
                        <MapPinIcon className="size-5 shrink-0 text-slate-400" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-900">{institution.name}</span>
                          <span className="mt-0.5 block text-xs text-slate-500">{institution.category} · {institution.city}, {institution.province}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-5 text-center text-sm text-slate-500">Institusi belum ditemukan. Coba periksa ejaan.</p>
              )}
            </div>
          ) : null}

          <input type="hidden" name="allowedInstitutionIds" value={selectedInstitutions.map((institution) => institution.id).join(",")} />
        </div>
      ) : null}
    </section>
  );
}
