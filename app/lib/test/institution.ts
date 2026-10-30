import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  schoolFindMany: vi.fn(),
  universityFindMany: vi.fn(),
}));

vi.mock("../prisma", () => {
  const prisma = {
    schoolInstitution: {
      findMany: mocks.schoolFindMany,
    },
    universityInstitution: {
      findMany: mocks.universityFindMany,
    },
  };
  return { default: prisma, prisma };
});

import { searchInstitutions } from "../../actions/institution";
import { institutionKindForLevel } from "../institution";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.schoolFindMany.mockResolvedValue([{ npsn: "20100158", name: "SMKN 14 JAKARTA" }]);
  mocks.universityFindMany.mockResolvedValue([{ npsn: "93145", name: "Universitas Tamansiswa" }]);
});

describe("institutionKindForLevel", () => {
  it("maps MAHASISWA to the university table and the rest to the school table", () => {
    expect(institutionKindForLevel("MAHASISWA")).toBe("university");
    expect(institutionKindForLevel("SMP")).toBe("school");
    expect(institutionKindForLevel("SMA")).toBe("school");
    expect(institutionKindForLevel(null)).toBe("school");
    expect(institutionKindForLevel(undefined)).toBe("school");
  });
});

describe("searchInstitutions", () => {
  it("searches the school table by name and NPSN", async () => {
    const result = await searchInstitutions({ query: "SMKN", kind: "school" });

    expect(result).toEqual({
      success: true,
      data: [{ npsn: "20100158", name: "SMKN 14 JAKARTA" }],
    });
    expect(mocks.schoolFindMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: "SMKN", mode: "insensitive" } },
          { npsn: { startsWith: "SMKN" } },
        ],
      },
      select: { npsn: true, name: true },
      orderBy: { name: "asc" },
      take: 20,
    });
    expect(mocks.universityFindMany).not.toHaveBeenCalled();
  });

  it("searches the university table for mahasiswa", async () => {
    const result = await searchInstitutions({ query: "Universitas", kind: "university" });

    expect(result).toEqual({
      success: true,
      data: [{ npsn: "93145", name: "Universitas Tamansiswa" }],
    });
    expect(mocks.universityFindMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: "Universitas", mode: "insensitive" } },
          { npsn: { startsWith: "Universitas" } },
        ],
      },
      select: { npsn: true, name: true },
      orderBy: { name: "asc" },
      take: 20,
    });
    expect(mocks.schoolFindMany).not.toHaveBeenCalled();
  });

  it("lists the first options when the query is empty", async () => {
    await searchInstitutions({ query: "  ", kind: "school" });

    expect(mocks.schoolFindMany).toHaveBeenCalledWith({
      where: undefined,
      select: { npsn: true, name: true },
      orderBy: { name: "asc" },
      take: 20,
    });
  });

  it("rejects an unknown institution kind", async () => {
    const result = await searchInstitutions({ query: "SMKN", kind: "college" as "school" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Please check your input");
      expect(result.fieldErrors?.kind).toBeDefined();
    }
    expect(mocks.schoolFindMany).not.toHaveBeenCalled();
    expect(mocks.universityFindMany).not.toHaveBeenCalled();
  });
});
