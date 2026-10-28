"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CheckIcon, MapPinIcon, SearchIcon } from "@/app/components/ui/icons";

export type InstitutionOption = {
  id: string;
  name: string;
  category: string;
  city: string;
  province: string;
  kind: "student" | "university";
};

export const institutionOptions: InstitutionOption[] = [
  {
    id: "school-sman-1-denpasar",
    name: "SMA Negeri 1 Denpasar",
    category: "SMA",
    city: "Denpasar",
    province: "Bali",
    kind: "student",
  },
  {
    id: "school-smkn-1-denpasar",
    name: "SMK Negeri 1 Denpasar",
    category: "SMK",
    city: "Denpasar",
    province: "Bali",
    kind: "student",
  },
  {
    id: "school-sman-1-badung",
    name: "SMA Negeri 1 Kuta Utara",
    category: "SMA",
    city: "Badung",
    province: "Bali",
    kind: "student",
  },
  {
    id: "school-smpn-1-denpasar",
    name: "SMP Negeri 1 Denpasar",
    category: "SMP",
    city: "Denpasar",
    province: "Bali",
    kind: "student",
  },
  {
    id: "university-unud",
    name: "Universitas Udayana",
    category: "Universitas",
    city: "Badung",
    province: "Bali",
    kind: "university",
  },
  {
    id: "university-primakara",
    name: "Universitas Primakara",
    category: "Universitas",
    city: "Denpasar",
    province: "Bali",
    kind: "university",
  },
  {
    id: "university-itb",
    name: "Institut Teknologi Bandung",
    category: "Institut",
    city: "Bandung",
    province: "Jawa Barat",
    kind: "university",
  },
  {
    id: "university-ui",
    name: "Universitas Indonesia",
    category: "Universitas",
    city: "Depok",
    province: "Jawa Barat",
    kind: "university",
  },
];

type InstitutionComboboxProps = {
  kind: "student" | "university";
  value: string;
  selectedId: string;
  error?: string;
  disabled?: boolean;
  onQueryChange: (value: string) => void;
  onSelect: (option: InstitutionOption) => void;
};

export function InstitutionCombobox({
  kind,
  value,
  selectedId,
  error,
  disabled,
  onQueryChange,
  onSelect,
}: InstitutionComboboxProps) {
  const generatedId = useId();
  const inputId = `institution-${generatedId}`;
  const listboxId = `${inputId}-results`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const query = value.trim().toLocaleLowerCase("id-ID");
  const results = useMemo(() => {
    if (query.length < 2) return [];

    return institutionOptions
      .filter((option) => option.kind === kind)
      .filter((option) =>
        [option.name, option.category, option.city, option.province]
          .join(" ")
          .toLocaleLowerCase("id-ID")
          .includes(query),
      )
      .slice(0, 6);
  }, [kind, query]);

  const selectedOption = institutionOptions.find(
    (option) => option.id === selectedId && option.kind === kind,
  );
  const showResults = isOpen && query.length >= 2;

  const chooseOption = (option: InstitutionOption) => {
    onSelect(option);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => Math.min(current + 1, results.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter" && showResults && activeIndex >= 0) {
      event.preventDefault();
      chooseOption(results[activeIndex]);
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <label htmlFor={inputId} className="block text-sm font-semibold text-slate-900">
        {kind === "student" ? "Nama sekolah" : "Nama universitas"}
      </label>
      <div className="relative mt-2">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
        <input
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showResults}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${results[activeIndex]?.id}` : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={[helperId, error ? errorId : ""].filter(Boolean).join(" ")}
          value={value}
          disabled={disabled}
          placeholder={kind === "student" ? "Ketik nama sekolah" : "Ketik nama universitas"}
          onFocus={() => {
            if (query.length >= 2) setIsOpen(true);
          }}
          onChange={(event) => {
            onQueryChange(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className={`min-h-12 w-full rounded-xl border bg-white py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-300 focus:border-brand-primary focus:ring-blue-100"
          }`}
        />
        {selectedOption && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckIcon className="size-4" />
          </span>
        )}
      </div>

      <p id={helperId} className={`mt-1.5 text-xs leading-5 ${selectedOption ? "font-medium text-emerald-700" : "text-slate-500"}`}>
        {selectedOption
          ? `Terpilih: ${selectedOption.name} · ${selectedOption.city}`
          : "Ketik minimal 2 karakter, lalu pilih satu hasil."}
      </p>
      {error && <p id={errorId} className="mt-1 text-xs font-medium text-red-700">{error}</p>}

      {showResults && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          {results.length > 0 ? (
            <ul id={listboxId} role="listbox" aria-label={kind === "student" ? "Hasil pencarian sekolah" : "Hasil pencarian universitas"} className="max-h-72 overflow-y-auto p-1.5">
              {results.map((option, index) => (
                <li
                  id={`${listboxId}-${option.id}`}
                  key={option.id}
                  role="option"
                  aria-selected={selectedId === option.id}
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => chooseOption(option)}
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                      activeIndex === index ? "bg-blue-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                      <MapPinIcon className="size-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-900">{option.name}</span>
                      <span className="mt-0.5 block text-xs text-slate-500">{option.category} · {option.city}, {option.province}</span>
                    </span>
                    {selectedId === option.id && <CheckIcon className="mt-1 size-5 shrink-0 text-emerald-600" />}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div id={listboxId} className="px-4 py-5 text-center">
              <p className="text-sm font-semibold text-slate-800">
                {kind === "student" ? "Sekolah belum ditemukan" : "Universitas belum ditemukan"}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Coba periksa ejaan atau gunakan kata kunci lain.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
