import type { CatalogOption } from "@/app/actions/catalog";
import type { InstitutionOption } from "@/app/lib/institution";
import { InstitutionPicker } from "@/app/components/ui/institution-picker";
import { XIcon } from "@/app/components/ui/icons";
import { SelectControl } from "@/app/components/ui/select-control";

export type ExploreFilters = {
  search: string;
  categoryId: string;
  roleName: string;
  collaborationTool: string;
  mode: string;
  commitment: string;
  proximity: string;
  institution: string;
};

export type ExploreViewerContext = {
  institution: string;
  city: string;
  province: string;
};

type ProjectFiltersProps = {
  idPrefix: string;
  categories: CatalogOption[];
  roles: CatalogOption[];
  viewerContext: ExploreViewerContext | null;
  filters: ExploreFilters;
  institutionOption: InstitutionOption | null;
  onChange: (key: keyof ExploreFilters, value: string) => void;
  onInstitutionChange: (value: InstitutionOption | null) => void;
};

const inputClass = "mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition hover:border-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100";

export function ProjectFilters({
  idPrefix,
  categories,
  roles,
  viewerContext,
  filters,
  institutionOption,
  onChange,
  onInstitutionChange,
}: ProjectFiltersProps) {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor={`${idPrefix}-proximity`} className="text-sm font-semibold text-slate-900">Kedekatan</label>
        <SelectControl id={`${idPrefix}-proximity`} value={filters.proximity} onChange={(event) => onChange("proximity", event.target.value)} containerClassName="mt-2">
          <option value="">Semua wilayah</option>
          <option value="institution" disabled={!viewerContext?.institution}>Institusi saya</option>
          <option value="city" disabled={!viewerContext?.city}>Kota/kabupaten saya</option>
          <option value="province" disabled={!viewerContext?.province}>Provinsi saya</option>
        </SelectControl>
        {!viewerContext ? <p className="mt-1.5 text-xs leading-5 text-slate-500">Masuk dan lengkapi profil untuk memakai filter terdekat.</p> : null}
      </div>

      <InstitutionPicker
        id={`${idPrefix}-institution`}
        label="Sekolah atau kampus"
        kind="all"
        value={institutionOption}
        onChange={onInstitutionChange}
        hint="Cari dan pilih institusi dari daftar resmi."
      />

      <div>
        <label htmlFor={`${idPrefix}-category`} className="text-sm font-semibold text-slate-900">Jenis proyek</label>
        <SelectControl id={`${idPrefix}-category`} value={filters.categoryId} onChange={(event) => onChange("categoryId", event.target.value)} containerClassName="mt-2">
          <option value="">Semua jenis</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </SelectControl>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-tool`} className="text-sm font-semibold text-slate-900">Alat kolaborasi</label>
        <input id={`${idPrefix}-tool`} type="search" value={filters.collaborationTool} onChange={(event) => onChange("collaborationTool", event.target.value)} placeholder="Contoh: Figma, Notion" className={`${inputClass} placeholder:text-slate-400`} />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-role`} className="text-sm font-semibold text-slate-900">Peran</label>
        <input id={`${idPrefix}-role`} list={`${idPrefix}-role-suggestions`} value={filters.roleName} onChange={(event) => onChange("roleName", event.target.value)} placeholder="Semua peran" className={inputClass} />
        <datalist id={`${idPrefix}-role-suggestions`}>
          {roles.map((item) => <option key={item.id} value={item.name} />)}
        </datalist>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-slate-900">Mode kolaborasi</legend>
        <div className="mt-2 space-y-1">
          {[
            ["", "Semua mode"],
            ["ONLINE", "Daring"],
            ["OFFLINE", "Luring"],
            ["HYBRID", "Hybrid"],
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
  categories: CatalogOption[];
  roles: CatalogOption[];
  institutionOption: InstitutionOption | null;
  onRemove: (key: keyof ExploreFilters) => void;
  onClear: () => void;
};

export function ActiveFilterChips({
  filters,
  categories,
  institutionOption,
  onRemove,
  onClear,
}: ActiveFilterChipsProps) {
  const categoryName = categories.find((item) => item.id === filters.categoryId)?.name;
  const roleName = filters.roleName.trim();

  const chips: Array<{ key: keyof ExploreFilters; label: string }> = [
    filters.search ? { key: "search", label: `Kata kunci: ${filters.search}` } : null,
    categoryName ? { key: "categoryId", label: `Jenis: ${categoryName}` } : null,
    filters.collaborationTool ? { key: "collaborationTool", label: `Alat kolaborasi: ${filters.collaborationTool}` } : null,
    roleName ? { key: "roleName", label: `Peran: ${roleName}` } : null,
    filters.mode ? { key: "mode", label: filters.mode === "OFFLINE" ? "Luring" : filters.mode === "HYBRID" ? "Hybrid" : "Daring" } : null,
    filters.commitment ? {
      key: "commitment",
      label: filters.commitment === "light" ? "Maks. 5 jam" : filters.commitment === "medium" ? "6–10 jam" : ">10 jam",
    } : null,
    filters.proximity ? {
      key: "proximity",
      label: filters.proximity === "institution" ? "Institusi saya" : filters.proximity === "city" ? "Kota/kabupaten saya" : "Provinsi saya",
    } : null,
    institutionOption ? { key: "institution", label: `Institusi: ${institutionOption.name}` } : null,
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
