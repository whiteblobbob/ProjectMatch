import prisma from "@/app/lib/prisma";
import schoolData from "./sma_smk.json";
import universityData from "./universitas.json";

const seedInstitutions = async () => {
  // Seed schools
  await prisma.schoolInstitution.createMany({
    data: Object.entries(schoolData).map(([npsn, name]) => ({
      npsn,
      name,
    })),
    skipDuplicates: true,
  });

  // Seed universities
  await prisma.universityInstitution.createMany({
    data: Object.entries(universityData).map(([npsn, name]) => ({
      npsn,
      name,
    })),
    skipDuplicates: true,
  });
};

seedInstitutions();