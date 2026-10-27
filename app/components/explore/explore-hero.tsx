"use client";

import { FormEvent } from "react";
import { SelectControl } from "@/app/components/ui/select-control";

type ExploreHeroProps = {
  searchInput: string;
  category: string;
  mode: string;
  role: string;
  categories: string[];
  roles: string[];
  onSearchInputChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onModeChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onSubmit: () => void;
};

export default function ExploreHero({
  searchInput,
  category,
  mode,
  role,
  categories,
  roles,
  onSearchInputChange,
  onCategoryChange,
  onModeChange,
  onRoleChange,
  onSubmit,
}: ExploreHeroProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1240px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">Kolaborasi lintas sekolah dan kampus</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl">Temukan tim yang membutuhkan keahlianmu.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">Jelajahi proyek, lomba, dan ide kolaborasi dari pelajar dan mahasiswa.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid min-w-0 gap-2 rounded-xl border border-slate-300 bg-white p-2 shadow-sm sm:grid-cols-2 lg:grid-cols-[minmax(240px,1.5fr)_minmax(140px,.75fr)_minmax(140px,.75fr)_minmax(150px,.8fr)_auto] lg:items-center lg:gap-0 lg:p-1.5">
          <div className="relative min-w-0 rounded-lg border border-slate-200 transition focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-blue-100 sm:col-span-2 lg:col-span-1 lg:rounded-none lg:border-0 lg:border-r lg:border-slate-200">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" strokeLinecap="round" /></svg>
            <label htmlFor="explore-search" className="sr-only">Cari proyek, posisi, topik, atau lomba</label>
            <input id="explore-search" type="search" value={searchInput} onChange={(event) => onSearchInputChange(event.target.value)} placeholder="Cari proyek, posisi, topik, atau lomba" className="min-h-12 w-full bg-transparent py-2 pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400" />
          </div>

          <div className="min-w-0 lg:border-r lg:border-slate-200">
            <label htmlFor="search-category" className="sr-only">Jenis proyek</label>
            <SelectControl id="search-category" value={category} onChange={(event) => onCategoryChange(event.target.value)} className="lg:rounded-none lg:border-0 lg:bg-transparent">
              <option value="">Semua jenis</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </SelectControl>
          </div>

          <div className="min-w-0 lg:border-r lg:border-slate-200">
            <label htmlFor="search-mode" className="sr-only">Mode kolaborasi</label>
            <SelectControl id="search-mode" value={mode} onChange={(event) => onModeChange(event.target.value)} className="lg:rounded-none lg:border-0 lg:bg-transparent">
              <option value="">Semua mode</option>
              <option value="remote">Daring</option>
              <option value="onsite">Tatap muka</option>
            </SelectControl>
          </div>

          <div className="min-w-0">
            <label htmlFor="search-role" className="sr-only">Peran</label>
            <SelectControl id="search-role" value={role} onChange={(event) => onRoleChange(event.target.value)} className="lg:rounded-none lg:border-0 lg:bg-transparent">
              <option value="">Semua peran</option>
              {roles.map((item) => <option key={item} value={item}>{item}</option>)}
            </SelectControl>
          </div>

          <button type="submit" className="inline-flex min-h-12 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 lg:w-auto">
            Cari proyek
          </button>
        </form>
      </div>
    </section>
  );
}
