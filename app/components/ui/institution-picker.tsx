"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { searchInstitutions } from "@/app/actions/institution";
import type { InstitutionOption } from "@/app/lib/institution";
import { CheckIcon, LoaderIcon, SearchIcon, XIcon } from "./icons";

type InstitutionPickerProps = {
  id: string;
  label: string;
  kind: "school" | "university" | "all";
  value: InstitutionOption | null;
  onChange: (value: InstitutionOption | null) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
};

export function InstitutionPicker({
  id,
  label,
  kind,
  value,
  onChange,
  error,
  hint,
  disabled = false,
}: InstitutionPickerProps) {
  const listboxId = `${id}-listbox`;
  const [query, setQuery] = useState(value?.name ?? "");
  const [options, setOptions] = useState<InstitutionOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef(0);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const trimmedQuery = query.trim();
    const requestId = ++requestRef.current;

    const timeout = setTimeout(async () => {
      if (trimmedQuery.length === 1) {
        setOptions([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const result = await searchInstitutions({ query: trimmedQuery, kind });
      if (requestId !== requestRef.current) return;

      setIsSearching(false);
      setOptions(result.success && "data" in result ? result.data : []);
      setActiveIndex(-1);
    }, 250);

    return () => clearTimeout(timeout);
  }, [isOpen, kind, query]);

  const selectOption = (option: InstitutionOption) => {
    setQuery(option.name);
    setOptions([]);
    setActiveIndex(-1);
    setIsOpen(false);
    onChange(option);
    inputRef.current?.focus();
  };

  const clearSelection = () => {
    setQuery("");
    setOptions([]);
    setActiveIndex(-1);
    setIsOpen(true);
    onChange(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      if (isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
      return;
    }

    if (event.key === "Tab") {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setActiveIndex((current) => Math.min(options.length - 1, current + 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setActiveIndex((current) => Math.max(0, current - 1));
      return;
    }

    if (event.key === "Home" && isOpen) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End" && isOpen) {
      event.preventDefault();
      setActiveIndex(options.length - 1);
      return;
    }

    if (event.key === "Enter") {
      if (isOpen && activeIndex >= 0 && options[activeIndex]) {
        event.preventDefault();
        selectOption(options[activeIndex]);
      }
    }
  };

  const describedBy =
    [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-900">{label}</label>
      {hint && <p id={`${id}-hint`} className="mt-1 text-xs leading-5 text-slate-500">{hint}</p>}

      <div className="relative mt-2">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={isOpen && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setIsOpen(true);
            setActiveIndex(-1);
            if (value && nextQuery !== value.name) onChange(null);
          }}
          onFocus={(event) => {
            setIsOpen(true);
            event.currentTarget.select();
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={
            kind === "university"
              ? "Cari nama kampus"
              : kind === "school"
                ? "Cari nama sekolah"
                : "Cari nama sekolah atau kampus"
          }
          className={`min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {isSearching && (
            <LoaderIcon className="size-4 animate-spin text-slate-400" aria-hidden="true" />
          )}
          {value && !disabled && (
            <button
              type="button"
              onClick={clearSelection}
              aria-label={`Hapus ${label.toLowerCase()}`}
              className="grid size-8 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <ul id={listboxId} role="listbox" className="max-h-72 overflow-y-auto py-1">
            {options.length === 0 ? (
              <li role="presentation" className="px-4 py-3 text-sm text-slate-500">
                {query.trim().length === 1
                  ? "Ketik minimal 2 karakter."
                  : isSearching
                    ? "Mencari institusi…"
                    : "Tidak ada institusi yang cocok."}
              </li>
            ) : (
              options.map((option, index) => {
                const isSelected = value?.npsn === option.npsn;
                const isActive = index === activeIndex;

                return (
                  <li
                    key={option.npsn}
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      selectOption(option);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm ${isActive ? "bg-brand-soft text-brand-primary" : "text-slate-700"}`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{option.name}</span>
                      <span className="block text-xs text-slate-500">NPSN {option.npsn}</span>
                    </span>
                    {isSelected && <CheckIcon className="size-4 shrink-0" aria-hidden="true" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {error && <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}
