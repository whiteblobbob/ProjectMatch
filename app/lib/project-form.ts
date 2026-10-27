import { prisma } from "./prisma";
import { DEMO_USER_ID, isDemoAccountEnabled } from "./demo-account";

export type ProjectFormOption = {
  id: string;
  name: string;
};

export type ProjectFormOptions = {
  categories: ProjectFormOption[];
};

export async function getProjectFormOptions(userId: string): Promise<ProjectFormOptions> {
  if (isDemoAccountEnabled() && userId === DEMO_USER_ID) {
    return {
      categories: [
        { id: "demo-category-competition", name: "Kompetisi" },
        { id: "demo-category-startup", name: "Startup" },
        { id: "demo-category-research", name: "Riset" },
        { id: "demo-category-portfolio", name: "Proyek portofolio" },
      ],
    };
  }

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return { categories };
}
