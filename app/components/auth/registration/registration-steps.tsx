"use client";

import Link from "next/link";
import { useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import {
  formatFileSize,
  type RegistrationData,
  type RegistrationErrors,
  type RegistrationField,
  type RegistrationStepId,
  type VerificationMethod,
} from "./registration-types";

type UpdateField = <Field extends keyof RegistrationData>(field: Field, value: RegistrationData[Field]) => void;

type StepProps = {
  data: RegistrationData;
  errors: RegistrationErrors;
  onChange: UpdateField;
  disabled?: boolean;
};

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50";

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-900">{label}</label>
      {hint && <p id={`${id}-hint`} className="mt-1 text-xs leading-5 text-slate-500">{hint}</p>}
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}

function TextInput({
  field,
  label,
  value,
  error,
  onChange,
  hint,
  ...props
}: {
  field: RegistrationField;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  hint?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  const id = `registration-${field}`;
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;

  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <input
        {...props}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`${inputClass} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
      />
    </Field>
  );
}

function StepHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="mb-7">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
    </header>
  );
}

export function AccountStep({ data, errors, onChange, disabled }: StepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <section aria-labelledby="account-step-title">
      <div id="account-step-title">
        <StepHeading
          eyebrow="Langkah 1 dari 4"
          title="Buat akunmu"
          description="Gunakan email aktif untuk masuk ke ProjectMatch. Data pendidikan akan dilengkapi di langkah berikutnya."
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextInput
            field="fullName"
            label="Nama lengkap"
            value={data.fullName}
            error={errors.fullName}
            onChange={(value) => onChange("fullName", value)}
            autoComplete="name"
            placeholder="Nama sesuai identitas"
            disabled={disabled}
          />
        </div>
        <div className="sm:col-span-2">
          <TextInput
            field="email"
            label="Email"
            value={data.email}
            error={errors.email}
            onChange={(value) => onChange("email", value)}
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            disabled={disabled}
          />
        </div>
        <div className="relative">
          <TextInput
            field="password"
            label="Kata sandi"
            value={data.password}
            error={errors.password}
            onChange={(value) => onChange("password", value)}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            hint="Gunakan minimal 8 karakter."
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-2 top-[52px] min-h-10 rounded-lg px-2 text-xs font-semibold text-brand-primary outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? "Sembunyikan" : "Lihat"}
          </button>
        </div>
        <div className="relative">
          <TextInput
            field="passwordConfirmation"
            label="Konfirmasi kata sandi"
            value={data.passwordConfirmation}
            error={errors.passwordConfirmation}
            onChange={(value) => onChange("passwordConfirmation", value)}
            type={showConfirmation ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Ketik ulang kata sandi"
            hint="Harus sama dengan kata sandi."
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => setShowConfirmation((value) => !value)}
            className="absolute right-2 top-[52px] min-h-10 rounded-lg px-2 text-xs font-semibold text-brand-primary outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            aria-label={showConfirmation ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
          >
            {showConfirmation ? "Sembunyikan" : "Lihat"}
          </button>
        </div>
      </div>
      <p className="mt-6 text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-brand-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">
          Masuk
        </Link>
      </p>
    </section>
  );
}

const schoolLevels = ["SMP/sederajat", "SMA/SMK/sederajat"];
const universityLevels = ["Diploma", "Sarjana", "Magister", "Doktor"];

export function EducationStep({ data, errors, onChange, disabled }: StepProps) {
  const educationLevels = data.educationStatus === "student" ? schoolLevels : universityLevels;

  return (
    <section aria-labelledby="education-step-title">
      <div id="education-step-title">
        <StepHeading
          eyebrow="Langkah 2"
          title="Informasi pendidikan"
          description="Bantu kami menampilkan pengalaman yang relevan bagi pelajar dan mahasiswa dari berbagai bidang."
        />
      </div>
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900">Status pendidikan</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {(["student", "university"] as const).map((status) => (
            <label key={status} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm font-semibold transition ${data.educationStatus === status ? "border-brand-primary bg-brand-soft text-brand-primary ring-1 ring-brand-primary" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"}`}>
              <input
                type="radio"
                name="education-status"
                value={status}
                checked={data.educationStatus === status}
                onChange={() => {
                  onChange("educationStatus", status);
                  onChange("educationLevel", "");
                }}
                disabled={disabled}
                className="size-4 accent-blue-700"
              />
              {status === "student" ? "Pelajar" : "Mahasiswa"}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextInput field="institutionName" label="Nama sekolah atau universitas" value={data.institutionName} error={errors.institutionName} onChange={(value) => onChange("institutionName", value)} placeholder="Contoh: Universitas Indonesia" disabled={disabled} />
        </div>
        <TextInput field="studyProgram" label="Program studi atau jurusan" value={data.studyProgram} error={errors.studyProgram} onChange={(value) => onChange("studyProgram", value)} placeholder="Contoh: Desain Komunikasi Visual" disabled={disabled} />
        <Field id="registration-educationLevel" label="Jenjang pendidikan" error={errors.educationLevel}>
          <select
            id="registration-educationLevel"
            value={data.educationLevel}
            onChange={(event) => onChange("educationLevel", event.target.value)}
            disabled={disabled}
            aria-invalid={Boolean(errors.educationLevel)}
            aria-describedby={errors.educationLevel ? "registration-educationLevel-error" : undefined}
            className={`${inputClass} ${errors.educationLevel ? "border-red-400" : ""}`}
          >
            <option value="">Pilih jenjang</option>
            {educationLevels.map((level) => <option key={level} value={level}>{level}</option>)}
          </select>
        </Field>
        <TextInput field="entryYear" label="Tahun masuk" value={data.entryYear} error={errors.entryYear} onChange={(value) => onChange("entryYear", value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" placeholder="2024" disabled={disabled} />
        <TextInput field="graduationYear" label="Perkiraan tahun lulus" value={data.graduationYear} error={errors.graduationYear} onChange={(value) => onChange("graduationYear", value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" placeholder="2027" disabled={disabled} />
        <div className="sm:col-span-2">
          <TextInput field="dateOfBirth" label="Tanggal lahir" value={data.dateOfBirth} error={errors.dateOfBirth} onChange={(value) => onChange("dateOfBirth", value)} type="date" autoComplete="bday" hint="Tanggal lahir digunakan untuk menentukan kebutuhan persetujuan wali di tampilan ini." disabled={disabled} />
        </div>
      </div>
    </section>
  );
}

type InstitutionalEmailFieldProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onRequestCode?: (email: string) => void;
  disabled?: boolean;
};

export function InstitutionalEmailField({ value, error, onChange, onRequestCode, disabled }: InstitutionalEmailFieldProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <TextInput field="institutionalEmail" label="Email sekolah atau kampus" value={value} error={error} onChange={onChange} type="email" placeholder="nama@institusi.ac.id" disabled={disabled} />
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={disabled || !onRequestCode}
          onClick={() => onRequestCode?.(value)}
          className="min-h-11 rounded-xl border border-brand-primary bg-white px-4 text-sm font-semibold text-brand-primary disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
        >
          Kirim kode
        </button>
        <input aria-label="Kode verifikasi" placeholder="6 digit kode" inputMode="numeric" disabled className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-slate-100 px-3 text-sm text-slate-500" />
      </div>
      <p className="mt-3 text-xs leading-5 text-amber-800">Verifikasi akan diproses setelah integrasi backend tersedia.</p>
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
        aria-describedby={error ? "registration-document-error" : "registration-document-hint"}
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
        <p id="registration-document-hint" className="mt-1 text-xs text-slate-500">JPG, PNG, atau PDF · Maksimal 5 MB</p>
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
      {error && <p id="registration-document-error" className="mt-2 text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}

export function VerificationStep({ data, errors, onChange, file, onFileChange, onFileError, disabled }: StepProps & {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onFileError: (message: string) => void;
}) {
  const methods: Array<{ value: VerificationMethod; title: string; description: string }> = [
    { value: "institutional-email", title: "Email sekolah atau kampus", description: "Gunakan alamat email resmi institusimu." },
    { value: "document", title: "Dokumen pendidikan", description: "Pilih kartu pelajar/mahasiswa atau surat aktif." },
  ];

  return (
    <section aria-labelledby="verification-step-title">
      <div id="verification-step-title">
        <StepHeading eyebrow="Langkah 3" title="Pilih cara verifikasi" description="ProjectMatch hanya ditujukan untuk pelajar dan mahasiswa aktif. Verifikasi membantu menjaga komunitas tetap aman dan relevan." />
      </div>
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <strong>Status integrasi:</strong> Verifikasi akan diproses setelah integrasi backend tersedia. Pilihanmu saat ini hanya disimpan sementara di halaman ini.
      </div>
      <fieldset>
        <legend className="sr-only">Metode verifikasi</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {methods.map((method) => (
            <label key={method.value} className={`cursor-pointer rounded-xl border p-4 transition ${data.verificationMethod === method.value ? "border-brand-primary bg-brand-soft ring-1 ring-brand-primary" : "border-slate-200 bg-white hover:border-slate-400"}`}>
              <span className="flex items-start gap-3">
                <input type="radio" name="verification-method" value={method.value} checked={data.verificationMethod === method.value} onChange={() => onChange("verificationMethod", method.value)} disabled={disabled} className="mt-1 size-4 accent-blue-700" />
                <span>
                  <span className="block text-sm font-bold text-slate-900">{method.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">{method.description}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-5">
        {data.verificationMethod === "institutional-email" ? (
          <InstitutionalEmailField value={data.institutionalEmail} error={errors.institutionalEmail} onChange={(value) => onChange("institutionalEmail", value)} disabled={disabled} />
        ) : (
          <div className="space-y-4">
            <Field id="registration-documentType" label="Jenis dokumen" error={errors.documentType}>
              <select id="registration-documentType" value={data.documentType} onChange={(event) => onChange("documentType", event.target.value)} disabled={disabled} className={inputClass}>
                <option value="student-card">Kartu pelajar/mahasiswa</option>
                <option value="enrollment-letter">Surat keterangan aktif</option>
              </select>
            </Field>
            <p className="rounded-xl bg-slate-100 p-3 text-xs leading-5 text-slate-700">
              Pastikan nama dan institusi terlihat. Tutupi NIS/NIM, alamat, barcode, dan informasi lain yang tidak diperlukan.
            </p>
            <VerificationDocumentField file={file} error={errors.document} onFileChange={onFileChange} onValidationError={onFileError} disabled={disabled} />
          </div>
        )}
      </div>
    </section>
  );
}

export function GuardianStep({ data, errors, onChange, disabled }: StepProps) {
  return (
    <section aria-labelledby="guardian-step-title">
      <div id="guardian-step-title">
        <StepHeading eyebrow="Langkah tambahan" title="Persetujuan orang tua atau wali" description="Karena kamu belum berusia 18 tahun, informasi orang tua atau wali diperlukan untuk proses persetujuan." />
      </div>
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Tahap ini masih berupa tampilan. ProjectMatch tidak akan mengirim email atau menyimpan data wali dari formulir ini.
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextInput field="guardianName" label="Nama orang tua/wali" value={data.guardianName} error={errors.guardianName} onChange={(value) => onChange("guardianName", value)} autoComplete="name" placeholder="Nama lengkap wali" disabled={disabled} />
        </div>
        <TextInput field="guardianRelationship" label="Hubungan dengan pengguna" value={data.guardianRelationship} error={errors.guardianRelationship} onChange={(value) => onChange("guardianRelationship", value)} placeholder="Contoh: Ibu, ayah, kakak" disabled={disabled} />
        <TextInput field="guardianEmail" label="Email orang tua/wali" value={data.guardianEmail} error={errors.guardianEmail} onChange={(value) => onChange("guardianEmail", value)} type="email" autoComplete="email" placeholder="wali@email.com" disabled={disabled} />
      </div>
      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-700">
        <input type="checkbox" checked={data.guardianConfirmed} onChange={(event) => onChange("guardianConfirmed", event.target.checked)} disabled={disabled} className="mt-1 size-4 shrink-0 accent-blue-700" aria-describedby={errors.guardianConfirmed ? "guardian-confirmed-error" : undefined} />
        <span>Saya memastikan informasi wali di atas benar dan diisi dengan sepengetahuan wali.</span>
      </label>
      {errors.guardianConfirmed && <p id="guardian-confirmed-error" className="mt-2 text-xs font-medium text-red-700">{errors.guardianConfirmed}</p>}
    </section>
  );
}

function SummaryCard({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-bold text-slate-950">{title}</h3>
        <button type="button" onClick={onEdit} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-brand-primary hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary">Ubah</button>
      </div>
      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function SummaryItem({ term, detail }: { term: string; detail: string }) {
  return <div><dt className="text-xs font-medium text-slate-500">{term}</dt><dd className="mt-1 break-words font-semibold text-slate-800">{detail || "—"}</dd></div>;
}

function ConsentCheckbox({ checked, onChange, error, id, children }: { checked: boolean; onChange: (value: boolean) => void; error?: string; id: string; children: ReactNode }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-700">
        <input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 size-4 shrink-0 accent-blue-700" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
        <span>{children}</span>
      </label>
      {error && <p id={`${id}-error`} className="ml-7 mt-1 text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}

export function RegistrationReviewStep({ data, errors, onChange, file, needsGuardian, onEdit }: StepProps & {
  file: File | null;
  needsGuardian: boolean;
  onEdit: (step: RegistrationStepId) => void;
}) {
  return (
    <section aria-labelledby="review-step-title">
      <div id="review-step-title">
        <StepHeading eyebrow="Langkah terakhir" title="Tinjau pendaftaran" description="Pastikan informasi yang kamu masukkan sudah benar sebelum membuat akun." />
      </div>
      <div className="space-y-4">
        <SummaryCard title="Akun" onEdit={() => onEdit("account")}>
          <SummaryItem term="Nama lengkap" detail={data.fullName} />
          <SummaryItem term="Email" detail={data.email} />
        </SummaryCard>
        <SummaryCard title="Pendidikan" onEdit={() => onEdit("education")}>
          <SummaryItem term="Status" detail={data.educationStatus === "student" ? "Pelajar" : "Mahasiswa"} />
          <SummaryItem term="Institusi" detail={data.institutionName} />
          <SummaryItem term="Jurusan" detail={data.studyProgram} />
          <SummaryItem term="Jenjang" detail={data.educationLevel} />
          <SummaryItem term="Periode" detail={`${data.entryYear}–${data.graduationYear}`} />
          <SummaryItem term="Tanggal lahir" detail={data.dateOfBirth} />
        </SummaryCard>
        <SummaryCard title="Verifikasi" onEdit={() => onEdit("verification")}>
          <SummaryItem term="Metode" detail={data.verificationMethod === "institutional-email" ? "Email sekolah atau kampus" : "Dokumen pendidikan"} />
          <SummaryItem term={data.verificationMethod === "institutional-email" ? "Email institusi" : "Dokumen lokal"} detail={data.verificationMethod === "institutional-email" ? data.institutionalEmail : file?.name ?? "—"} />
        </SummaryCard>
        {needsGuardian && (
          <SummaryCard title="Orang tua atau wali" onEdit={() => onEdit("guardian")}>
            <SummaryItem term="Nama" detail={data.guardianName} />
            <SummaryItem term="Hubungan" detail={data.guardianRelationship} />
            <SummaryItem term="Email" detail={data.guardianEmail} />
          </SummaryCard>
        )}
      </div>
      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <strong>Pengingat privasi:</strong> saat ini hanya email dan kata sandi yang dikirim untuk membuat akun. Informasi pendidikan, metode verifikasi, dokumen, dan data wali tidak dikirim atau disimpan.
      </div>
      <fieldset className="mt-5 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <legend className="px-1 text-sm font-bold text-slate-900">Konfirmasi</legend>
        <ConsentCheckbox id="accepted-terms" checked={data.acceptedTerms} onChange={(value) => onChange("acceptedTerms", value)} error={errors.acceptedTerms}>Saya menyetujui syarat penggunaan ProjectMatch.</ConsentCheckbox>
        <ConsentCheckbox id="accepted-privacy" checked={data.acceptedPrivacy} onChange={(value) => onChange("acceptedPrivacy", value)} error={errors.acceptedPrivacy}>Saya memahami kebijakan privasi dan penggunaan data.</ConsentCheckbox>
        <ConsentCheckbox id="confirmed-accuracy" checked={data.confirmedAccuracy} onChange={(value) => onChange("confirmedAccuracy", value)} error={errors.confirmedAccuracy}>Saya memastikan seluruh informasi yang ditampilkan sudah benar.</ConsentCheckbox>
      </fieldset>
    </section>
  );
}

export function RegistrationStatusCard() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8" role="status" aria-live="polite">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-600 text-white" aria-hidden="true">
        <svg viewBox="0 0 20 20" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m4 10.5 3.5 3.5L16 5.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <h2 className="mt-4 text-2xl font-bold text-emerald-950">Akun berhasil dibuat</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-emerald-900">Jika verifikasi email akun diaktifkan, periksa kotak masukmu sebelum masuk. Data verifikasi pendidikan belum dikirim karena integrasinya belum tersedia.</p>
      <Link href="/login" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-5 text-sm font-semibold text-white hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">Lanjut ke login</Link>
    </div>
  );
}
