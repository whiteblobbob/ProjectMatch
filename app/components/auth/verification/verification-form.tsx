"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

import { sendVerificationEmail } from "@/app/actions/verification";
import { CheckIcon } from "@/app/components/ui/icons";
import { isAcademicEmail } from "@/app/lib/validator/auth";
import { Field, TextInput, inputClass } from "../registration/registration-steps";

export type VerificationMethod = "institutional-email" | "document";

type VerificationErrors = Partial<Record<"institutionalEmail" | "documentType" | "document", string>>;

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type InstitutionalEmailFieldProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function InstitutionalEmailField({ value, error, onChange, disabled }: InstitutionalEmailFieldProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <TextInput field="institutionalEmail" label="Email sekolah atau kampus" value={value} error={error} onChange={onChange} type="email" placeholder="nama@institusi.ac.id" disabled={disabled} />
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Gunakan alamat email yang berakhiran <span className="font-semibold">.ac.id</span> atau <span className="font-semibold">.edu</span>. Kami mengirim tautan verifikasi ke alamat tersebut.
      </p>
    </div>
  );
}

type VerificationDocumentFieldProps = {
  file: File | null;
  error?: string;
  onFileChange: (file: File | null) => void;
  onValidationError: (message: string) => void;
  disabled?: boolean;
};

export function VerificationDocumentField({ file, error, onFileChange, onValidationError, disabled }: VerificationDocumentFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = (candidate?: File) => {
    if (!candidate) return;
    const acceptedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!acceptedTypes.includes(candidate.type)) {
      onValidationError("Format dokumen harus JPG, PNG, atau PDF.");
      return;
    }
    if (candidate.size > 5 * 1024 * 1024) {
      onValidationError("Ukuran dokumen maksimal 5 MB.");
      return;
    }
    onValidationError("");
    onFileChange(candidate);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) validateAndSelect(event.dataTransfer.files[0]);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        onChange={(event: ChangeEvent<HTMLInputElement>) => validateAndSelect(event.target.files?.[0])}
        disabled={disabled}
        className="sr-only"
        aria-describedby={error ? "verification-document-error" : "verification-document-hint"}
      />
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-5 text-center ${error ? "border-red-300 bg-red-50" : "border-slate-300 bg-slate-50"}`}
      >
        <svg viewBox="0 0 24 24" className="mx-auto size-8 text-brand-primary" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-2 text-sm font-semibold text-slate-900">Tarik dokumen ke sini atau pilih dari perangkat</p>
        <p id="verification-document-hint" className="mt-1 text-xs text-slate-500">JPG, PNG, atau PDF · Maksimal 5 MB</p>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={disabled} className="mt-4 min-h-11 rounded-xl bg-white px-4 text-sm font-semibold text-brand-primary ring-1 ring-inset ring-slate-300 hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-60">
          {file ? "Ganti dokumen" : "Pilih dokumen"}
        </button>
      </div>
      {file && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-left">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
            <p className="mt-0.5 text-xs text-slate-600">{formatFileSize(file.size)} · Dipilih di perangkat, belum diunggah</p>
          </div>
          <button type="button" onClick={() => { onFileChange(null); if (inputRef.current) inputRef.current.value = ""; }} className="min-h-11 shrink-0 rounded-lg px-3 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
            Hapus
          </button>
        </div>
      )}
      {error && <p id="verification-document-error" className="mt-2 text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}

export default function VerificationForm() {
  const [method, setMethod] = useState<VerificationMethod>("institutional-email");
  const [institutionalEmail, setInstitutionalEmail] = useState("");
  const [documentType, setDocumentType] = useState("student-card");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<VerificationErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [submitError, setSubmitError] = useState("");

  const methods: Array<{ value: VerificationMethod; title: string; description: string }> = [
    { value: "institutional-email", title: "Email sekolah atau kampus", description: "Gunakan alamat email resmi institusimu." },
    { value: "document", title: "Dokumen pendidikan", description: "Pilih kartu pelajar/mahasiswa atau surat aktif." },
  ];

  async function handleEmailSubmit() {
    setSubmitError("");
    setSentTo("");

    const email = institutionalEmail.trim();
    if (!email) {
      setErrors((current) => ({ ...current, institutionalEmail: "Masukkan email sekolah atau kampus." }));
      return;
    }
    if (!isAcademicEmail(email)) {
      setErrors((current) => ({ ...current, institutionalEmail: "Gunakan email resmi sekolah atau kampus (.ac.id atau .edu)." }));
      return;
    }

    setIsPending(true);
    const result = await sendVerificationEmail({ email });
    setIsPending(false);

    if (!result.success) {
      const emailFieldError = result.fieldErrors?.email?.[0];
      if (emailFieldError) {
        setErrors((current) => ({ ...current, institutionalEmail: emailFieldError }));
      } else {
        setSubmitError(result.error);
      }
      return;
    }

    setSentTo("data" in result ? result.data.email : email);
  }

  function handleSubmit() {
    // Document verification is intentionally not wired up yet.
    if (method !== "institutional-email") return;
    void handleEmailSubmit();
  }

  return (
    <section aria-labelledby="verification-form-title">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">Verifikasi pendidikan</p>
      <h2 id="verification-form-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Verifikasi status pelajar atau mahasiswa</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">ProjectMatch hanya ditujukan untuk pelajar dan mahasiswa aktif. Pilih salah satu cara verifikasi di bawah ini.</p>

      <div className="mt-5 mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
        <strong>Verifikasi email akademik</strong> sudah tersedia. Verifikasi melalui dokumen masih dalam pengembangan.
      </div>

      <fieldset>
        <legend className="sr-only">Metode verifikasi</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {methods.map((item) => (
            <label key={item.value} className={`cursor-pointer rounded-xl border p-4 transition ${method === item.value ? "border-brand-primary bg-brand-soft ring-1 ring-brand-primary" : "border-slate-200 bg-white hover:border-slate-400"}`}>
              <span className="flex items-start gap-3">
                <input
                  type="radio"
                  name="verification-method"
                  value={item.value}
                  checked={method === item.value}
                  onChange={() => {
                    setMethod(item.value);
                    setErrors({});
                    setSubmitError("");
                    setSentTo("");
                  }}
                  className="mt-1 size-4 accent-blue-700"
                />
                <span>
                  <span className="block text-sm font-bold text-slate-900">{item.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">{item.description}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        {method === "institutional-email" ? (
          sentTo ? (
            <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-white" aria-hidden="true">
                  <CheckIcon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-bold">Tautan verifikasi terkirim</p>
                  <p className="mt-1 text-sm leading-6">
                    Kami mengirim tautan verifikasi ke <span className="font-semibold">{sentTo}</span>. Buka emailmu dan klik tautan untuk menyelesaikan verifikasi.
                  </p>
                  <button type="button" onClick={() => setSentTo("")} className="mt-3 text-sm font-semibold text-brand-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
                    Kirim ke alamat lain
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <InstitutionalEmailField
              value={institutionalEmail}
              error={errors.institutionalEmail}
              onChange={(value) => {
                setInstitutionalEmail(value);
                setErrors((current) => ({ ...current, institutionalEmail: undefined }));
              }}
              disabled={isPending}
            />
          )
        ) : (
          <div className="space-y-4">
            <Field id="verification-documentType" label="Jenis dokumen" error={errors.documentType}>
              <select id="verification-documentType" value={documentType} onChange={(event) => setDocumentType(event.target.value)} className={inputClass}>
                <option value="student-card">Kartu pelajar/mahasiswa</option>
                <option value="enrollment-letter">Surat keterangan aktif</option>
              </select>
            </Field>
            <p className="rounded-xl bg-slate-100 p-3 text-xs leading-5 text-slate-700">
              Pastikan nama dan institusi terlihat. Tutupi NIS/NIM, alamat, barcode, dan informasi lain yang tidak diperlukan.
            </p>
            <VerificationDocumentField
              file={file}
              error={errors.document}
              onFileChange={setFile}
              onValidationError={(message) => setErrors((current) => ({ ...current, document: message || undefined }))}
            />
          </div>
        )}
      </div>

      {submitError ? (
        <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || (method === "institutional-email" && Boolean(sentTo))}
          className="min-h-12 rounded-xl bg-brand-primary px-6 text-sm font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Mengirim…" : "Kirim verifikasi"}
        </button>
      </div>
    </section>
  );
}
