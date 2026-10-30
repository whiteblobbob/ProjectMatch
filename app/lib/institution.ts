import prisma from "./prisma";
import type { EducationLevel } from "./validator/profile";

export type InstitutionKind = "school" | "university";
export type InstitutionSearchKind = InstitutionKind | "all";
export type InstitutionOption = { npsn: string; name: string };

export function institutionKindForLevel(level: EducationLevel | null | undefined): InstitutionKind {
  return level === "MAHASISWA" ? "university" : "school";
}

export async function findInstitution(
  npsn: string,
  kind: InstitutionKind,
): Promise<InstitutionOption | null> {
  if (kind === "university") {
    return prisma.universityInstitution.findUnique({
      where: { npsn },
      select: { npsn: true, name: true },
    });
  }

  return prisma.schoolInstitution.findUnique({
    where: { npsn },
    select: { npsn: true, name: true },
  });
}

export async function searchInstitutionOptions(
  query: string,
  kind: InstitutionSearchKind,
  limit = 20,
): Promise<InstitutionOption[]> {
  const normalizedQuery = query.trim();
  const where = normalizedQuery
    ? {
        OR: [
          { name: { contains: normalizedQuery, mode: "insensitive" as const } },
          { npsn: { startsWith: normalizedQuery } },
        ],
      }
    : undefined;

  if (kind === "university") {
    return prisma.universityInstitution.findMany({
      where,
      select: { npsn: true, name: true },
      orderBy: { name: "asc" },
      take: limit,
    });
  }

  if (kind === "school") {
    return prisma.schoolInstitution.findMany({
      where,
      select: { npsn: true, name: true },
      orderBy: { name: "asc" },
      take: limit,
    });
  }

  const [schools, universities] = await Promise.all([
    prisma.schoolInstitution.findMany({
      where,
      select: { npsn: true, name: true },
      orderBy: { name: "asc" },
      take: limit,
    }),
    prisma.universityInstitution.findMany({
      where,
      select: { npsn: true, name: true },
      orderBy: { name: "asc" },
      take: limit,
    }),
  ]);

  return [...schools, ...universities]
    .sort((a, b) => a.name.localeCompare(b.name, "id-ID"))
    .slice(0, limit);
}
