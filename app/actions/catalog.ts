"use server";

import prisma from "../lib/prisma";
import actionWrapper from "../lib/actionWrapper";

export type CatalogOption = {
  id: string;
  name: string;
};

export const fetchCategories = actionWrapper(async () =>
  prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  }),
);

export const fetchRoles = actionWrapper(async () =>
  prisma.role.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  }),
);

export const fetchStatuses = actionWrapper(async () =>
  prisma.status.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  }),
);
