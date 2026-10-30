"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

import { acceptVerificationDocument, rejectVerificationDocument } from "../../actions/admin";
import type {
  AdminField,
  AdminOption,
  AdminRelationTable,
  AdminRow,
  AdminTableConfig,
} from "../../lib/admin/registry";
import { cloudinaryDocumentUrl } from "../../lib/ui/cloudinary";
import {
  CheckIcon,
  ExternalLinkIcon,
  LoaderIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  XIcon,
} from "../ui/icons";
import AdminDeleteDialog from "./admin-delete-dialog";
import AdminRecordDialog from "./admin-record-dialog";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    text: sortFn_text,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
  },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const helper = createColumnHelper<typeof features, AdminRow>();

type DialogState = { mode: "create" } | { mode: "edit"; row: AdminRow };

type AdminTableViewProps = {
  config: AdminTableConfig;
  records: AdminRow[];
  relationOptions: Partial<Record<AdminRelationTable, AdminOption[]>>;
  cloudName: string;
};

const PAGE_SIZES = [10, 25, 50, 100];

export default function AdminTableView({ config, records, relationOptions, cloudName }: AdminTableViewProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminRow | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const lookups = useMemo(() => {
    const map: Partial<Record<AdminRelationTable, Map<string, string>>> = {};

    for (const [table, options] of Object.entries(relationOptions)) {
      map[table as AdminRelationTable] = new Map((options ?? []).map((option) => [option.id, option.label]));
    }

    return map;
  }, [relationOptions]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return records;
    }

    return records.filter((row) =>
      config.fields.some((field) => {
        const value = row[field.name];

        if (field.relation) {
          const label = lookups[field.relation.table]?.get(String(value ?? ""));
          if (label?.toLowerCase().includes(term)) return true;
        }

        if (Array.isArray(value)) {
          return value.join(" ").toLowerCase().includes(term);
        }

        return String(value ?? "").toLowerCase().includes(term);
      }),
    );
  }, [config.fields, lookups, records, search]);

  const openEdit = useCallback((row: AdminRow) => setDialog({ mode: "edit", row }), []);
  const openDelete = useCallback((row: AdminRow) => setDeleteTarget(row), []);

  const acceptVerification = useCallback(
    async (row: AdminRow) => {
      const id = String(row.id ?? "");
      if (!id) return;

      setAcceptingId(id);
      setActionError(null);
      setNotice(null);

      const result = await acceptVerificationDocument(id);
      setAcceptingId(null);

      if (!result.success) {
        setActionError(result.error);
        return;
      }

      setNotice("Verifikasi pengguna berhasil diterima.");
      router.refresh();
    },
    [router],
  );

  const rejectVerification = useCallback(
    async (row: AdminRow) => {
      const id = String(row.id ?? "");
      if (!id) return;

      setRejectingId(id);
      setActionError(null);
      setNotice(null);

      const result = await rejectVerificationDocument(id);
      setRejectingId(null);

      if (!result.success) {
        setActionError(result.error);
        return;
      }

      setNotice("Verifikasi pengguna berhasil ditolak.");
      router.refresh();
    },
    [router],
  );

  const columns = useMemo(
    () => [
      ...config.fields.map((field) =>
        helper.accessor((row) => row[field.name], {
          id: field.name,
          header: field.label,
          sortFn:
            field.type === "number" || field.type === "float"
              ? "basic"
              : field.type === "datetime"
                ? "datetime"
                : "text",
          cell: (info) => <CellValue field={field} value={info.getValue()} lookups={lookups} />,
        }),
      ),
      helper.display({
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const isVerificationTable = config.key === "verification_document";
          const documentCloudId = String(row.original.documentCloudId ?? "");
          const documentUrl =
            isVerificationTable && documentCloudId && cloudName
              ? cloudinaryDocumentUrl(documentCloudId, cloudName)
              : null;
          const isAccepting = acceptingId === String(row.original.id ?? "");
          const isRejecting = rejectingId === String(row.original.id ?? "");
          const isProcessing = isAccepting || isRejecting;

          return (
            <div className="flex items-center justify-end gap-1">
              {isVerificationTable ? (
                <>
                  {documentUrl ? (
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Buka dokumen"
                      title="Buka dokumen"
                      className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-brand-soft hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                    >
                      <ExternalLinkIcon className="size-4" />
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => acceptVerification(row.original)}
                    disabled={isProcessing}
                    aria-label="Terima verifikasi"
                    title="Terima verifikasi"
                    className="inline-flex size-9 items-center justify-center rounded-lg text-emerald-600 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-wait disabled:opacity-50"
                  >
                    {isAccepting ? <LoaderIcon className="size-4 animate-spin" /> : <CheckIcon className="size-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectVerification(row.original)}
                    disabled={isProcessing}
                    aria-label="Tolak verifikasi"
                    title="Tolak verifikasi"
                    className="inline-flex size-9 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:cursor-wait disabled:opacity-50"
                  >
                    {isRejecting ? <LoaderIcon className="size-4 animate-spin" /> : <XIcon className="size-4" />}
                  </button>
                </>
              ) : null}
              <button
                type="button"
                onClick={() => openEdit(row.original)}
                aria-label="Ubah baris"
                className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-brand-soft hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <PencilIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => openDelete(row.original)}
                aria-label="Hapus baris"
                className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <TrashIcon className="size-4" />
              </button>
            </div>
          );
        },
      }),
    ],
    [acceptVerification, acceptingId, cloudName, config.fields, config.key, lookups, openDelete, openEdit, rejectVerification, rejectingId],
  );

  const table = useTable({
    features,
    columns,
    data: filtered,
    initialState: { pagination: { pageIndex: 0, pageSize: PAGE_SIZES[0] } },
  });

  const pagination = table.state.pagination;
  const pageCount = Math.max(table.getPageCount(), 1);
  const rows = table.getRowModel().rows;

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-brand-primary">{config.group}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">{config.label}</h1>
          <div className="mt-1 flex items-center gap-2">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">{config.key}</code>
            <span className="text-xs text-slate-400">{records.length} baris</span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{config.description}</p>
        </div>
        <button
          type="button"
          onClick={() => setDialog({ mode: "create" })}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 sm:self-auto"
        >
          <PlusIcon className="size-4" />
          Tambah data
        </button>
      </header>

      {actionError ? (
        <div
          role="alert"
          className="mt-4 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <span>{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError(null)}
            aria-label="Tutup pesan"
            className="shrink-0 rounded px-1 text-lg leading-none text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      ) : null}

      {notice ? (
        <div
          role="status"
          className="mt-4 flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Tutup pesan"
            className="shrink-0 rounded px-1 text-lg leading-none text-emerald-600 hover:text-emerald-800"
          >
            ×
          </button>
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative flex min-h-11 flex-1 items-center sm:max-w-sm">
            <span className="sr-only">Cari {config.label}</span>
            <SearchIcon className="pointer-events-none absolute left-3 size-4 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Cari ${config.label.toLowerCase()}…`}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition hover:border-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <p className="text-xs text-slate-400">
            {search ? `${filtered.length} hasil dari ${records.length} baris` : "Urutkan dengan menekan judul kolom"}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-slate-200 bg-slate-50">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} scope="col" className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                        >
                          <table.FlexRender header={header} />
                          <SortIndicator direction={header.column.getIsSorted()} />
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 align-top last:border-0 hover:bg-slate-50/70">
                    {row.getAllCells().map((cell) => (
                      <td key={cell.id} className="max-w-[280px] px-4 py-3">
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-slate-500">
                    {search ? "Tidak ada baris yang cocok dengan pencarian." : "Belum ada data pada tabel ini."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Baris per halaman</span>
            <select
              value={pagination.pageSize}
              onChange={(event) => table.setPageSize(Number(event.target.value))}
              className="min-h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-700 focus:border-brand-primary focus:outline-none"
              aria-label="Baris per halaman"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="mr-2 text-xs text-slate-500">
              Halaman {pagination.pageIndex + 1} dari {pageCount}
            </span>
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="inline-flex min-h-9 items-center rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="inline-flex min-h-9 items-center rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {dialog ? (
        <AdminRecordDialog
          config={config}
          mode={dialog.mode}
          row={dialog.mode === "edit" ? dialog.row : null}
          relationOptions={relationOptions}
          onClose={() => setDialog(null)}
          onSaved={() => {
            setDialog(null);
            router.refresh();
          }}
        />
      ) : null}

      {deleteTarget ? (
        <AdminDeleteDialog
          config={config}
          row={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setDeleteTarget(null);
            router.refresh();
          }}
        />
      ) : null}
    </div>
  );
}

const pad = (value: number) => String(value).padStart(2, "0");

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
}

function CellValue({
  field,
  value,
  lookups,
}: {
  field: AdminField;
  value: unknown;
  lookups: Partial<Record<AdminRelationTable, Map<string, string>>>;
}) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-300">—</span>;
  }

  if (field.relation) {
    const label = lookups[field.relation.table]?.get(String(value));
    return <span className="font-medium text-slate-800">{label ?? String(value)}</span>;
  }

  if (field.type === "boolean") {
    return (
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
          value ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
        }`}
      >
        {value ? "Ya" : "Tidak"}
      </span>
    );
  }

  if (field.type === "datetime") {
    return <span className="whitespace-nowrap text-slate-700">{formatDateTime(String(value))}</span>;
  }

  if (field.type === "enumArray" || field.type === "stringArray") {
    const values = Array.isArray(value) ? value : [value];
    return <span className="text-slate-700">{values.map(String).join(", ")}</span>;
  }

  if (field.type === "enum") {
    return (
      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
        {String(value)}
      </span>
    );
  }

  if (field.name === "id" || field.primaryKey) {
    return (
      <span className="block truncate font-mono text-xs text-slate-600" title={String(value)}>
        {String(value)}
      </span>
    );
  }

  return <span className="text-slate-700">{String(value)}</span>;
}

function SortIndicator({ direction }: { direction: false | "asc" | "desc" }) {
  if (!direction) {
    return <span aria-hidden="true" className="text-slate-300">↕</span>;
  }

  return <span aria-hidden="true" className="text-brand-primary">{direction === "asc" ? "↑" : "↓"}</span>;
}
