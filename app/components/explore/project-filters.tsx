import { XIcon } from "@/app/components/ui/icons";
import { SelectControl } from "@/app/components/ui/select-control";

export type ExploreFilters = {
  search: string;
  category: string;
  topic: string;
  role: string;
  mode: string;
  commitment: string;
};

type ProjectFiltersProps = {
  idPrefix: string;
  categories: string[];
  roles: string[];
  filters: ExploreFilters;
  onChange: (key: keyof ExploreFilters, value: string) => void;
};

const inputClass = "mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition hover:border-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100";

export function ProjectFilters({
  idPrefix,
  categories,
  roles,
  filters,
  onChange,
}: ProjectFiltersProps) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={`${idPrefix}-category`} className="text-sm font-semibold text-slate-900">Jenis proyek</label>
        <SelectControl id={`${idPrefix}-category`} value={filters.category} onChange={(event) => onChange("category", event.target.value)} containerClassName="mt-2">
          <option value="">Semua jenis</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </SelectControl>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-topic`} className="text-sm font-semibold text-slate-900">Topik atau bidang</label>
        <input id={`${idPrefix}-topic`} type="search" value={filters.topic} onChange={(event) => onChange("topic", event.target.value)} placeholder="Contoh: lingkungan" className={`${inputClass} placeholder:text-slate-400`} />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-role`} className="text-sm font-semibold text-slate-900">Peran</label>
        <SelectControl id={`${idPrefix}-role`} value={filters.role} onChange={(event) => onChange("role", event.target.value)} containerClassName="mt-2">
          <option value="">Semua peran</option>
          {roles.map((item) => <option key={item} value={item}>{item}</option>)}
        </SelectControl>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-slate-900">Mode kolaborasi</legend>
        <div className="mt-2 space-y-1">
          {[
            ["", "Semua mode"],
            ["remote", "Daring"],
            ["onsite", "Tatap muka"],
          ].map(([value, label]) => (
            <label key={label} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm text-slate-700 hover:bg-slate-50">
              <input type="radio" name={`${idPrefix}-mode`} value={value} checked={filters.mode === value} onChange={(event) => onChange("mode", event.target.value)} className="size-4 accent-blue-600" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${idPrefix}-commitment`} className="text-sm font-semibold text-slate-900">Komitmen waktu</label>
        <SelectControl id={`${idPrefix}-commitment`} value={filters.commitment} onChange={(event) => onChange("commitment", event.target.value)} containerClassName="mt-2">
          <option value="">Semua durasi</option>
          <option value="light">Maks. 5 jam/minggu</option>
          <option value="medium">6–10 jam/minggu</option>
          <option value="high">Lebih dari 10 jam/minggu</option>
        </SelectControl>
      </div>
    </div>
  );
}

type ActiveFilterChipsProps = {
  filters: ExploreFilters;
  onRemove: (key: keyof ExploreFilters) => void;
  onClear: () => void;
};

export function ActiveFilterChips({ filters, onRemove, onClear }: ActiveFilterChipsProps) {
  const chips: Array<{ key: keyof ExploreFilters; label: string }> = [
    filters.search ? { key: "search", label: `Kata kunci: ${filters.search}` } : null,
    filters.category ? { key: "category", label: `Jenis: ${filters.category}` } : null,
    filters.topic ? { key: "topic", label: `Topik: ${filters.topic}` } : null,
    filters.role ? { key: "role", label: `Peran: ${filters.role}` } : null,
    filters.mode ? { key: "mode", label: filters.mode === "onsite" ? "Tatap muka" : "Daring" } : null,
    filters.commitment ? {
      key: "commitment",
      label: filters.commitment === "light" ? "Maks. 5 jam" : filters.commitment === "medium" ? "6–10 jam" : ">10 jam",
    } : null,
  ].filter((chip): chip is { key: keyof ExploreFilters; label: string } => chip !== null);

  if (chips.length === 0) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Filter aktif">
      {chips.map((chip) => (
        <button key={chip.key} type="button" onClick={() => onRemove(chip.key)} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-800 transition hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" aria-label={`Hapus filter ${chip.label}`}>
          <span className="max-w-52 truncate">{chip.label}</span>
          <XIcon className="size-4 shrink-0" />
        </button>
      ))}
      <button type="button" onClick={onClear} className="min-h-9 rounded-lg px-2 text-xs font-semibold text-brand-primary hover:bg-blue-50 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
        Hapus semua
      </button>
    </div>
  );
}
