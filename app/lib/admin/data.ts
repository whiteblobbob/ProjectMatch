import "server-only";

import prisma from "../prisma";
import {
  ADMIN_TABLES,
  getAdminTable,
  isReferenceField,
  type AdminOption,
  type AdminRelationTable,
  type AdminRow,
  type AdminTableConfig,
  type AdminTableKey,
} from "./registry";

type AdminDelegate = {
  findMany: (args?: unknown) => Promise<AdminRow[]>;
  create: (args: { data: AdminRow }) => Promise<AdminRow>;
  update: (args: { where: AdminRow; data: AdminRow }) => Promise<AdminRow>;
  delete: (args: { where: AdminRow }) => Promise<AdminRow>;
  count: (args?: unknown) => Promise<number>;
};

function getDelegate(prismaModel: string): AdminDelegate {
  return (prisma as unknown as Record<string, AdminDelegate>)[prismaModel];
}

export function serializeRow(row: AdminRow): AdminRow {
  const serialized: AdminRow = {};

  for (const [key, value] of Object.entries(row)) {
    serialized[key] = value instanceof Date ? value.toISOString() : value;
  }

  return serialized;
}

export async function queryAdminRecords(config: AdminTableConfig): Promise<AdminRow[]> {
  const rows = await getDelegate(config.prismaModel).findMany({
    orderBy: { [config.defaultSort]: "asc" },
  });

  return rows.map(serializeRow);
}

export async function queryAdminOptions(table: AdminRelationTable, labelField: string): Promise<AdminOption[]> {
  const config = getAdminTable(table);

  if (!config) {
    return [];
  }

  const rows = await getDelegate(config.prismaModel).findMany({
    select: { id: true, [labelField]: true },
  });

  return rows.map((row) => ({
    id: String(row.id),
    label: String(row[labelField] ?? row.id),
  }));
}

export async function queryAdminRelationOptions(
  config: AdminTableConfig,
): Promise<Partial<Record<AdminRelationTable, AdminOption[]>>> {
  const relations = new Map<AdminRelationTable, string>();

  for (const field of config.fields) {
    if (isReferenceField(field)) {
      relations.set(field.relation.table, field.relation.labelField);
    }
  }

  const entries = await Promise.all(
    [...relations.entries()].map(async ([table, labelField]) => [table, await queryAdminOptions(table, labelField)] as const),
  );

  return Object.fromEntries(entries);
}

export async function queryAdminCounts(): Promise<Record<AdminTableKey, number>> {
  const entries = await Promise.all(
    ADMIN_TABLES.map(async (table) => [table.key, await getDelegate(table.prismaModel).count()] as const),
  );

  return Object.fromEntries(entries) as Record<AdminTableKey, number>;
}

export function buildUniqueWhere(config: AdminTableConfig, primaryKey: AdminRow): AdminRow {
  if (config.primaryKey.length === 1) {
    return { [config.primaryKey[0]]: primaryKey[config.primaryKey[0]] };
  }

  return {
    [config.primaryKey.join("_")]: Object.fromEntries(
      config.primaryKey.map((key) => [key, primaryKey[key]]),
    ),
  };
}

export function toPrismaData(
  config: AdminTableConfig,
  parsed: Record<string, unknown>,
  mode: "create" | "edit",
): AdminRow {
  const data: AdminRow = {};

  for (const field of config.fields) {
    if (field.readOnly || field.displayOnly) continue;
    if (mode === "edit" && field.primaryKey) continue;
    if (!(field.name in parsed)) continue;

    const value = parsed[field.name];

    if (value === undefined) continue;
    if (value === "" || value === null) {
      if (field.required) continue;
      data[field.name] = null;
      continue;
    }

    data[field.name] = value;
  }

  return data;
}

export async function createAdminRow(config: AdminTableConfig, data: AdminRow) {
  return getDelegate(config.prismaModel).create({ data });
}

export async function updateAdminRow(config: AdminTableConfig, primaryKey: AdminRow, data: AdminRow) {
  return getDelegate(config.prismaModel).update({
    where: buildUniqueWhere(config, primaryKey),
    data,
  });
}

export async function deleteAdminRow(config: AdminTableConfig, primaryKey: AdminRow) {
  return getDelegate(config.prismaModel).delete({
    where: buildUniqueWhere(config, primaryKey),
  });
}
