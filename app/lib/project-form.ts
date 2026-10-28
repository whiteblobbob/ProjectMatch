import { prisma } from "./prisma";

export type ProjectFormOption = {
  id: string;
  name: string;
};

export type ProjectFormOptions = {
  categories: ProjectFormOption[];
};

export async function getProjectFormOptions(): Promise<ProjectFormOptions> {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return { categories };
}
