import prisma from "@/app/lib/prisma";
import schoolData from "./sma_smk.json";
import universityData from "./universitas.json";

const seed = async () => {
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

  await prisma.role.createMany({
    data: [
      { name: "Frontend Developer" },
      { name: "Backend Developer" },
      { name: "Full-Stack Developer" },
      { name: "UI/UX Designer" },
      { name: "Project Manager" },
    ],
    skipDuplicates: true,
  });

  await prisma.category.createMany({
    data: [
      { name: "Proyek" },
      { name: "Lomba" },
      { name: "Karya Ilimiah dan Riset" },
      { name: "Sosial dan Pengabdian" },
      { name: "Startup" },
    ],
    skipDuplicates: true,
  });
};

seed();