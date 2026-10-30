"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { createAdminRecord, updateAdminRecord } from "../../actions/admin";
import {
  editableFields,
  type AdminField,
  type AdminOption,
  type AdminRelationTable,
  type AdminRow,
  type AdminTableConfig,
} from "../../lib/admin/registry";
import { LoaderIcon, XIcon } from "../ui/icons";
import { SelectControl } from "../ui/select-control";

type FieldValue = string | boolean | string[];
type FormState = Record<string, FieldValue>;

type AdminRecordDialogProps = {
  config: AdminTableConfig;
  mode: "create" | "edit";
  row: AdminRow | null;
  relationOptions: Partial<Record<AdminRelationTable, AdminOption[]>>;
  onClose: () => void;
  onSaved: () => void;
};

const pad = (value: number) => String(value).padStart(2, "0");

const inputClassName =
  "min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition hover:border-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

function toDateTimeLocal(value: unknown) {
  if (typeof value !== "string" || value.length === 0) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toIsoString(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function initialForm(config: AdminTableConfig, mode: "create" | "edit", row: AdminRow | null): FormState {
  const form: FormState = {};

  for (const field of editableFields(config, mode)) {
    const value = row?.[field.name];

    if (field.type === "boolean") {
      form[field.name] = Boolean(value);
    } else if (field.type === "enumArray") {
      form[field.name] = Array.isArray(value) ? value.map(String) : [];
    } else if (field.type === "stringArray") {
      form[field.name] = Array.isArray(value) ? value.map(String).join("\n") : "";
    } else if (field.type === "enum" && field.required && (value === null || value === undefined)) {
      form[field.name] = field.options?.[0] ?? "";
    } else if (field.type === "datetime") {
      form[field.name] = toDateTimeLocal(value);
    } else {
      form[field.name] = value === null || value === undefined ? "" : String(value);
    }
  }

  return form;
}

function buildPayload(fields: AdminField[], form: FormState) {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    const value = form[field.name];

    if (field.type === "stringArray") {
      payload[field.name] = String(value ?? "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
      continue;
    }

    payload[field.name] = field.type === "datetime" ? toIsoString(String(value ?? "")) : value;
  }

  return payload;
}

export default function AdminRecordDialog({
  config,
  mode,
  row,
  relationOptions,
  onClose,
  onSaved,
}: AdminRecordDialogProps) {
  const fields = editableFields(config, mode);
  const [form, setForm] = useState<FormState>(() => initialForm(config, mode, row));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      const target =
        panelRef.current?.querySelector<HTMLElement>("form input, form textarea, form select") ??
        panelRef.current?.querySelector<HTMLElement>("button");
      target?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, pending]);

  const updateField = (name: string, value: FieldValue) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setFieldErrors({});

    const payload = buildPayload(fields, form);
    const result =
      mode === "create"
        ? await createAdminRecord(config.key, payload)
        : await updateAdminRecord(
            config.key,
            Object.fromEntries(config.primaryKey.map((key) => [key, String(row?.[key] ?? "")])),
            payload,
          );

    setPending(false);

    if (!result.success) {
      setError(result.error);
      if ("fieldErrors" in result && result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }
      return;
    }

    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Tutup dialog"
        tabIndex={-1}
        onClick={() => !pending && onClose()}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-record-title"
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.25)] sm:max-w-2xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-7">
          <div>
            <h2 id="admin-record-title" className="text-xl font-bold tracking-tight text-slate-950">
              {mode === "create" ? `Tambah ${config.label}` : `Ubah ${config.label}`}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Tabel <code className="rounded bg-slate-100 px-1 py-0.5">{config.key}</code>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            aria-label="Tutup dialog"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
            {error ? (
              <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800">
                {error}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={field.type === "textarea" || field.type === "enumArray" || field.type === "stringArray" ? "sm:col-span-2" : undefined}
                >
                  <FieldControl
                    field={field}
                    value={form[field.name]}
                    error={fieldErrors[field.name]}
                    relationOptions={relationOptions}
                    onChange={(value) => updateField(field.name, value)}
                  />
                </div>
              ))}
            </div>

            {config.key === "user" ? (
              <p className="mt-5 rounded-xl bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-800">
                Peran akun (USER/ADMIN) tidak dapat diubah dari panel ini maupun dari aplikasi. Ubah langsung melalui basis data.
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-7">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 text-sm font-semibold text-white hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {pending ? <LoaderIcon className="size-4 animate-spin" /> : null}
              {mode === "create" ? "Tambah" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldControl({
  field,
  value,
  error,
  relationOptions,
  onChange,
}: {
  field: AdminField;
  value: FieldValue | undefined;
  error?: string[];
  relationOptions: Partial<Record<AdminRelationTable, AdminOption[]>>;
  onChange: (value: FieldValue) => void;
}) {
  const id = `admin-field-${field.name}`;
  const textValue = typeof value === "string" ? value : "";
  const errorId = `${id}-error`;

  let control: React.ReactNode;

  if (field.type === "textarea" || field.type === "stringArray") {
    control = (
      <textarea
        id={id}
        value={textValue}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        rows={3}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={inputClassName}
      />
    );
  } else if (field.type === "boolean") {
    const checked = Boolean(value);

    control = (
      <label
        htmlFor={id}
        className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="size-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
        />
        {checked ? "Ya" : "Tidak"}
      </label>
    );
  } else if (field.type === "enumArray") {
    const selected = Array.isArray(value) ? value : [];

    control = (
      <div className="flex flex-wrap gap-2">
        {field.options?.map((option) => {
          const checked = selected.includes(option);

          return (
            <label
              key={option}
              className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm ${
                checked ? "border-brand-primary bg-brand-soft text-brand-primary" : "border-slate-300 text-slate-700"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) =>
                  onChange(
                    event.target.checked
                      ? [...selected, option]
                      : selected.filter((item) => item !== option),
                  )
                }
                className="size-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
              />
              {option}
            </label>
          );
        })}
      </div>
    );
  } else if (field.type === "enum") {
    control = (
      <SelectControl
        id={id}
        value={textValue}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      >
        {field.required ? null : <option value="">— Tidak diisi —</option>}
        {field.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </SelectControl>
    );
  } else if (field.type === "relation") {
    const options = field.relation ? relationOptions[field.relation.table] ?? [] : [];

    control = (
      <SelectControl
        id={id}
        value={textValue}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      >
        <option value="">— Pilih —</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </SelectControl>
    );
  } else if (field.type === "datetime") {
    control = (
      <input
        id={id}
        type="datetime-local"
        value={textValue}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={inputClassName}
      />
    );
  } else if (field.type === "number" || field.type === "float") {
    control = (
      <input
        id={id}
        type="number"
        step={field.type === "float" ? "any" : "1"}
        value={textValue}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={inputClassName}
      />
    );
  } else {
    control = (
      <input
        id={id}
        type="text"
        value={textValue}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={inputClassName}
      />
    );
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
        {field.label}
        {field.required ? <span className="text-red-500">*</span> : null}
        <code className="ml-auto text-[11px] font-normal text-slate-400">{field.name}</code>
      </label>
      {control}
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error.join(", ")}
        </p>
      ) : null}
    </div>
  );
}
