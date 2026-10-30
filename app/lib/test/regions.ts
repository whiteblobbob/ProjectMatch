import { describe, expect, it } from "vitest";
import { citiesOf, formatRegion, provinces, validateRegion } from "../regions";

describe("regions", () => {
  it("lists provinces without duplicates", () => {
    expect(provinces).toContain("Jawa Barat");
    expect(provinces).toContain("Bali");
    expect(new Set(provinces).size).toBe(provinces.length);
  });

  it("returns the cities of a known province", () => {
    expect(citiesOf("Bali")).toContain("Kota Denpasar");
  });

  it("returns no cities for an unknown or inherited province name", () => {
    expect(citiesOf("Atlantis")).toEqual([]);
    expect(citiesOf("toString")).toEqual([]);
  });

  it("accepts an empty region pair", () => {
    expect(validateRegion()).toEqual({});
    expect(validateRegion("", "")).toEqual({});
    expect(validateRegion(null, null)).toEqual({});
  });

  it("requires the province when only a city is provided", () => {
    expect(validateRegion("", "Kota Bandung")).toEqual({ province: ["Province is required"] });
  });

  it("requires the city when only a province is provided", () => {
    expect(validateRegion("Jawa Barat", "")).toEqual({ city: ["City is required"] });
  });

  it("rejects an unknown province", () => {
    expect(validateRegion("Atlantis", "Kota Bandung")).toEqual({ province: ["Unknown province"] });
  });

  it("rejects a city from another province", () => {
    expect(validateRegion("Bali", "Kota Bandung")).toEqual({
      city: ["City does not belong to the selected province"],
    });
  });

  it("accepts a matching province and city pair", () => {
    expect(validateRegion("Jawa Barat", "Kota Bandung")).toEqual({});
  });

  it("formats a region for display", () => {
    expect(formatRegion("Kota Bandung", "Jawa Barat")).toBe("Kota Bandung, Jawa Barat");
    expect(formatRegion("", "Jawa Barat")).toBe("Jawa Barat");
    expect(formatRegion("", "")).toBe("");
  });
});
