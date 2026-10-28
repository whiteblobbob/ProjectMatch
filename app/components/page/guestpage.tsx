"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { queryProjects } from "@/app/actions/project";
import { fetchProfile } from "@/app/actions/profile";
import { institutionOptions } from "@/app/components/auth/registration/institution-combobox";
import { SelectControl } from "@/app/components/ui/select-control";
import { decodeProfilePublicInfo } from "@/app/lib/profile-public-info";
import ExploreHero from "../explore/explore-hero";
import { EmptyProjectState, ProjectListSkeleton } from "../explore/explore-states";
import {
  ActiveFilterChips,
  ExploreFilters,
  type ExploreViewerContext,
  ProjectFilters,
} from "../explore/project-filters";
import ProjectCard from "../card/projectcard";
import { FilterIcon, XIcon } from "../ui/icons";

type ProjectSummary = {
  id: string;
  title: string;
  description: string;
  deadline: Date | string | null;
  onSite: boolean;
  workHoursPerWeek: number;
  createdAt: Date | string;
  totalAvailableSlot: number;
  category: { name: string };
  owner: { name: string | null; instance: string | null };
  projectRoles: Array<{ role: { name: string } }>;
  _count: { projectMembers: number };
};

type SortOption = "relevant" | "newest" | "deadline";

const initialFilters: ExploreFilters = {
  search: "",
  category: "",
  topic: "",
  role: "",
  mode: "",
  commitment: "",
  proximity: "",
  institution: "",
};

function normalize(value?: string | null) {
  return value?.trim().toLocaleLowerCase("id-ID") ?? "";
}

function institutionLocation(name?: string | null) {
  const normalizedName = normalize(name);
  return institutionOptions.find((institution) => normalize(institution.name) === normalizedName) ?? null;
}

function projectRelevance(project: ProjectSummary, viewerContext: ExploreViewerContext | null) {
  if (!viewerContext) return 3;
  if (viewerContext.institution && normalize(project.owner.instance) === normalize(viewerContext.institution)) return 0;

  const location = institutionLocation(project.owner.instance);
  if (location?.city && normalize(location.city) === normalize(viewerContext.city)) return 1;
  if (location?.province && normalize(location.province) === normalize(viewerContext.province)) return 2;
  return 3;
}

function relevanceLabel(project: ProjectSummary, viewerContext: ExploreViewerContext | null) {
  const relevance = projectRelevance(project, viewerContext);
  if (relevance === 0) return "Institusi yang sama";
  if (relevance === 1) return "Satu kota/kabupaten";
  if (relevance === 2) return "Satu provinsi";
  return undefined;
}

export default function GuestPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<ExploreFilters>(initialFilters);
  const [sort, setSort] = useState<SortOption>("relevant");
  const [viewerContext, setViewerContext] = useState<ExploreViewerContext | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterDrawerId = useId();
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterCloseRef = useRef<HTMLButtonElement>(null);
  const filterDrawerRef = useRef<HTMLDivElement>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError("");
    const result = await queryProjects({ status: "OPEN_RECRUITMENT", pageSize: 50 });

    if (!result.success || !("data" in result)) {
      setProjects([]);
      setError("Proyek belum dapat dimuat. Silakan coba lagi.");
      setIsLoading(false);
      return;
    }

    setProjects(result.data.projects as ProjectSummary[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void queryProjects({ status: "OPEN_RECRUITMENT", pageSize: 50 }).then((result) => {
      if (cancelled) return;
      if (!result.success || !("data" in result)) {
        setProjects([]);
        setError("Proyek belum dapat dimuat. Silakan coba lagi.");
        setIsLoading(false);
        return;
      }
      setProjects(result.data.projects as ProjectSummary[]);
      setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
        const session = await sessionResponse.json() as { authenticated: boolean };
        if (!session.authenticated || cancelled) return;

        const profileResult = await fetchProfile();
        if (!profileResult.success || !("data" in profileResult) || cancelled) return;

        const profile = profileResult.data;
        const publicInfo = decodeProfilePublicInfo(profile.contactInfo);
        const locationParts = publicInfo.location.split(",").map((part) => part.trim()).filter(Boolean);
        const catalogInstitution = institutionLocation(profile.instance);

        setViewerContext({
          institution: profile.instance,
          city: locationParts[0] ?? catalogInstitution?.city ?? "",
          province: locationParts[1] ?? catalogInstitution?.province ?? "",
        });
      } catch {
        // Guests and incomplete profiles fall back to a neutral newest-first order.
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const closeFilters = useCallback((restoreFocus = true) => {
    setFiltersOpen(false);
    if (restoreFocus) requestAnimationFrame(() => filterButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!filtersOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    filterCloseRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFilters();
        return;
      }
      if (event.key !== "Tab" || !filterDrawerRef.current) return;

      const focusable = Array.from(filterDrawerRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
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
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeFilters, filtersOpen]);

  const categories = useMemo(
    () => [...new Set(projects.map((project) => project.category.name))].sort(),
    [projects],
  );
  const roles = useMemo(
    () => [...new Set(projects.flatMap((project) => project.projectRoles.map((item) => item.role.name)))].sort(),
    [projects],
  );
  const institutions = useMemo(
    () => [...new Set(projects.map((project) => project.owner.instance).filter((item): item is string => Boolean(item)))].sort(),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const searchTerm = filters.search.trim().toLocaleLowerCase("id-ID");
    const topicTerm = filters.topic.trim().toLocaleLowerCase("id-ID");

    return projects
      .filter((project) => {
        const projectRoles = project.projectRoles.map((item) => item.role.name);
        const searchable = [project.title, project.description, project.category.name, project.owner.name ?? "", project.owner.instance ?? "", ...projectRoles].join(" ").toLocaleLowerCase("id-ID");
        const matchesCommitment = !filters.commitment
          || (filters.commitment === "light" && project.workHoursPerWeek <= 5)
          || (filters.commitment === "medium" && project.workHoursPerWeek >= 6 && project.workHoursPerWeek <= 10)
          || (filters.commitment === "high" && project.workHoursPerWeek > 10);
        const location = institutionLocation(project.owner.instance);
        const matchesProximity = !filters.proximity
          || (filters.proximity === "institution" && normalize(project.owner.instance) === normalize(viewerContext?.institution))
          || (filters.proximity === "city" && Boolean(viewerContext?.city) && normalize(location?.city) === normalize(viewerContext?.city))
          || (filters.proximity === "province" && Boolean(viewerContext?.province) && normalize(location?.province) === normalize(viewerContext?.province));

        return (
          (!searchTerm || searchable.includes(searchTerm))
          && (!topicTerm || searchable.includes(topicTerm))
          && (!filters.category || project.category.name === filters.category)
          && (!filters.role || projectRoles.includes(filters.role))
          && (!filters.mode || (project.onSite ? "ONSITE" : "REMOTE") === filters.mode)
          && (!filters.institution || project.owner.instance === filters.institution)
          && matchesProximity
          && matchesCommitment
        );
      })
      .sort((a, b) => {
        if (sort === "relevant") {
          const relevanceDifference = projectRelevance(a, viewerContext) - projectRelevance(b, viewerContext);
          if (relevanceDifference !== 0) return relevanceDifference;
        }
        if (sort === "deadline") {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [filters, projects, sort, viewerContext]);

  const hasFilters = Object.values(filters).some(Boolean);

  function updateFilter(key: keyof ExploreFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function removeFilter(key: keyof ExploreFilters) {
    updateFilter(key, "");
    if (key === "search") setSearchInput("");
  }

  function resetFilters() {
    setFilters(initialFilters);
    setSearchInput("");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <ExploreHero
        searchInput={searchInput}
        category={filters.category}
        mode={filters.mode}
        role={filters.role}
        categories={categories}
        roles={roles}
        onSearchInputChange={setSearchInput}
        onCategoryChange={(value) => updateFilter("category", value)}
        onModeChange={(value) => updateFilter("mode", value)}
        onRoleChange={(value) => updateFilter("role", value)}
        onSubmit={() => updateFilter("search", searchInput.trim())}
      />

      <div className="mx-auto max-w-[1240px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-7 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block" aria-label="Filter proyek">
            <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="font-bold text-slate-950">Filter proyek</h2>
                {hasFilters && <button type="button" onClick={resetFilters} className="rounded px-1 text-xs font-semibold text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Hapus semua</button>}
              </div>
              <ProjectFilters idPrefix="desktop-filter" categories={categories} roles={roles} institutions={institutions} viewerContext={viewerContext} filters={filters} onChange={updateFilter} />
            </div>
          </aside>

          <section aria-labelledby="results-heading" className="min-w-0">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="results-heading" className="text-xl font-bold text-slate-950">Posisi terbuka</h2>
                <p className="mt-1 text-sm text-slate-500" aria-live="polite">{isLoading ? "Mencari peluang…" : `${filteredProjects.length} proyek ditemukan`}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <button ref={filterButtonRef} type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary lg:hidden" aria-expanded={filtersOpen} aria-controls={filterDrawerId} onClick={() => setFiltersOpen(true)}>
                  <FilterIcon className="size-4" />
                  Filter
                  {hasFilters && <span className="size-2 rounded-full bg-blue-600" aria-label="Filter aktif" />}
                </button>
                <label htmlFor="sort-projects" className="sr-only">Urutkan proyek</label>
                <SelectControl id="sort-projects" value={sort} onChange={(event) => setSort(event.target.value as SortOption)} containerClassName="w-full sm:w-auto" className="sm:w-auto">
                  <option value="relevant">{viewerContext ? "Paling relevan" : "Terbaru"}</option>
                  {viewerContext ? <option value="newest">Terbaru</option> : null}
                  <option value="deadline">Tenggat terdekat</option>
                </SelectControl>
              </div>
            </div>

            <ActiveFilterChips filters={filters} onRemove={removeFilter} onClear={resetFilters} />

            {isLoading ? (
              <ProjectListSkeleton />
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-white px-6 py-12 text-center" role="alert">
                <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-red-50 font-bold text-red-600" aria-hidden="true">!</div>
                <h3 className="mt-4 font-bold text-slate-950">Gagal memuat proyek</h3>
                <p className="mt-2 text-sm text-slate-600">{error}</p>
                <button type="button" onClick={() => void loadProjects()} className="mt-5 min-h-11 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">Coba lagi</button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <EmptyProjectState filtered={hasFilters} onClear={resetFilters} />
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    description={project.description}
                    category={project.category.name}
                    roles={project.projectRoles.map((item) => item.role.name)}
                    collaborationMode={project.onSite ? "ONSITE" : "REMOTE"}
                    workHoursPerWeek={project.workHoursPerWeek}
                    deadline={project.deadline ? new Date(project.deadline) : null}
                    slotsAvailable={project.totalAvailableSlot}
                    teamSize={project._count.projectMembers}
                    owner={project.owner.name ?? "Pengguna ProjectMatch"}
                    institution={project.owner.instance}
                    relevanceLabel={relevanceLabel(project, viewerContext)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby={`${filterDrawerId}-title`}>
          <button type="button" aria-label="Tutup filter" className="absolute inset-0 bg-slate-950/40" onClick={() => closeFilters()} />
          <div ref={filterDrawerRef} id={filterDrawerId} className="absolute bottom-0 left-0 right-0 flex max-h-[90dvh] flex-col rounded-t-2xl bg-white shadow-2xl sm:bottom-auto sm:left-auto sm:right-0 sm:top-0 sm:h-dvh sm:max-h-none sm:w-[380px] sm:rounded-none">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div><h2 id={`${filterDrawerId}-title`} className="text-lg font-bold text-slate-950">Filter proyek</h2><p className="mt-0.5 text-xs text-slate-500">Persempit peluang yang paling sesuai.</p></div>
              <button ref={filterCloseRef} type="button" onClick={() => closeFilters()} className="inline-flex size-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" aria-label="Tutup filter"><XIcon className="size-5" /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5"><ProjectFilters idPrefix="mobile-filter" categories={categories} roles={roles} institutions={institutions} viewerContext={viewerContext} filters={filters} onChange={updateFilter} /></div>
            <div className="flex gap-3 border-t border-slate-200 bg-white p-4">
              <button type="button" onClick={resetFilters} className="min-h-11 flex-1 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Reset</button>
              <button type="button" onClick={() => closeFilters()} className="min-h-11 flex-1 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">Lihat {filteredProjects.length} hasil</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
