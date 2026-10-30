import rawData from "./data.json";
export const regionData: Record<string, string[]> = rawData;

export const provinces: string[] = Object.keys(regionData).sort((a, b) => a.localeCompare(b, "id-ID"));

export function citiesOf(province: string) {
  return Object.hasOwn(regionData, province) ? regionData[province] : [];
}

export function queryProvinces(query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return Object.keys(regionData)
    .filter((province) => province.toLocaleLowerCase().includes(normalizedQuery));
}

export function queryCities(province: string, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!Object.hasOwn(regionData, province)) {
    return [];
  }

  const cities = regionData[province];

  return cities.filter((city) => city.toLocaleLowerCase().includes(normalizedQuery));
}

export type RegionErrors = {
  province?: string[];
  city?: string[];
};

function normalizeRegionValue(value?: string | null) {
  return value?.trim() ?? "";
}

export function validateRegion(province?: string | null, city?: string | null): RegionErrors {
  const normalizedProvince = normalizeRegionValue(province);
  const normalizedCity = normalizeRegionValue(city);
  const errors: RegionErrors = {};

  if (!normalizedProvince && !normalizedCity) return errors;

  if (!normalizedProvince) {
    errors.province = ["Province is required"];
    return errors;
  }

  if (!Object.hasOwn(regionData, normalizedProvince)) {
    errors.province = ["Unknown province"];
  }

  if (!normalizedCity) {
    errors.city = ["City is required"];
  } else if (!errors.province && !regionData[normalizedProvince].includes(normalizedCity)) {
    errors.city = ["City does not belong to the selected province"];
  }

  return errors;
}

export function formatRegion(city?: string | null, province?: string | null) {
  return [normalizeRegionValue(city), normalizeRegionValue(province)].filter(Boolean).join(", ");
}
