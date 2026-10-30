"use client";

import { citiesOf, provinces } from "@/app/lib/regions";
import { SelectControl } from "./select-control";

type LocationPickerProps = {
  idPrefix: string;
  province: string;
  city: string;
  onProvinceChange: (value: string) => void;
  onCityChange: (value: string) => void;
  provinceError?: string;
  cityError?: string;
  disabled?: boolean;
  className?: string;
};

export function LocationPicker({
  idPrefix,
  province,
  city,
  onProvinceChange,
  onCityChange,
  provinceError,
  cityError,
  disabled = false,
  className = "",
}: LocationPickerProps) {
  const provinceId = `${idPrefix}-province`;
  const cityId = `${idPrefix}-city`;
  const cities = citiesOf(province);

  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${className}`}>
      <div>
        <label htmlFor={provinceId} className="block text-sm font-semibold text-slate-900">Provinsi</label>
        <SelectControl
          id={provinceId}
          value={province}
          onChange={(event) => onProvinceChange(event.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(provinceError)}
          aria-describedby={provinceError ? `${provinceId}-error` : undefined}
          containerClassName="mt-2"
          className={`rounded-xl ${provinceError ? "border-red-400" : ""}`}
        >
          <option value="">Pilih provinsi</option>
          {provinces.map((name) => <option key={name} value={name}>{name}</option>)}
        </SelectControl>
        {provinceError && <p id={`${provinceId}-error`} className="mt-1.5 text-xs font-medium text-red-700">{provinceError}</p>}
      </div>

      <div>
        <label htmlFor={cityId} className="block text-sm font-semibold text-slate-900">Kota/Kabupaten</label>
        <SelectControl
          id={cityId}
          value={city}
          onChange={(event) => onCityChange(event.target.value)}
          disabled={disabled || !province}
          aria-invalid={Boolean(cityError)}
          aria-describedby={cityError ? `${cityId}-error` : undefined}
          containerClassName="mt-2"
          className={`rounded-xl ${cityError ? "border-red-400" : ""}`}
        >
          <option value="">{province ? "Pilih kota/kabupaten" : "Pilih provinsi dahulu"}</option>
          {cities.map((name) => <option key={name} value={name}>{name}</option>)}
        </SelectControl>
        {cityError && <p id={`${cityId}-error`} className="mt-1.5 text-xs font-medium text-red-700">{cityError}</p>}
      </div>
    </div>
  );
}
