"use client";

import { useState, type KeyboardEvent } from "react";
import { CheckIcon, MapPinIcon, UsersIcon, XIcon } from "@/app/components/ui/icons";

export type AudienceScope = "all" | "institution" | "city" | "province" | "selected";

type ProjectAudienceScopeProps = {
  scope: AudienceScope;
  selectedInstitutions: string[];
  onScopeChange: (scope: AudienceScope) => void;
  onSelectedInstitutionsChange: (institutions: string[]) => void;
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
  { value: "selected", title: "Institusi tertentu", description: "Tulis sendiri sekolah atau kampus yang diizinkan mendaftar." },
];

export default function ProjectAudienceScope({
  scope,
  selectedInstitutions,
  onScopeChange,
  onSelectedInstitutionsChange,
  disabled,
}: ProjectAudienceScopeProps) {
  const [query, setQuery] = useState("");

  const addInstitution = () => {
    const name = query.trim();
    if (!name || selectedInstitutions.length >= 6) return;
    const exists = selectedInstitutions.some((item) => item.toLocaleLowerCase("id-ID") === name.toLocaleLowerCase("id-ID"));
    if (!exists) onSelectedInstitutionsChange([...selectedInstitutions, name]);
    setQuery("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addInstitution();
    }
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
          <label htmlFor="allowed-institution-input" className="text-sm font-semibold text-slate-900">Sekolah atau kampus yang diizinkan</label>
          <p className="mt-1 text-xs leading-5 text-slate-500">Tulis nama sekolah atau kampus, lalu tekan Enter. Maksimal 6 institusi.</p>

          {selectedInstitutions.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Institusi terpilih">
              {selectedInstitutions.map((institution) => (
                <span key={institution} className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-800">
                  <span className="truncate">{institution}</span>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectedInstitutionsChange(selectedInstitutions.filter((item) => item !== institution))}
                    className="grid size-6 shrink-0 place-items-center rounded-md hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    aria-label={`Hapus ${institution}`}
                  >
                    <XIcon className="size-4" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}

          <input
            id="allowed-institution-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || selectedInstitutions.length >= 6}
            placeholder={selectedInstitutions.length >= 6 ? "Maksimal 6 institusi" : "Ketik nama sekolah atau kampus, tekan Enter"}
            autoComplete="off"
            className="mt-3 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />

          <input type="hidden" name="allowedInstitutions" value={selectedInstitutions.join(", ")} />
        </div>
      ) : null}
    </section>
  );
}
