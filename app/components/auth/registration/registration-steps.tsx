"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  type RegistrationData,
  type RegistrationErrors,
  type RegistrationStepId,
} from "./registration-types";

type UpdateField = <Field extends keyof RegistrationData>(field: Field, value: RegistrationData[Field]) => void;

type StepProps = {
  data: RegistrationData;
  errors: RegistrationErrors;
  onChange: UpdateField;
  disabled?: boolean;
};

export const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50";

export function Field({
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

export function TextInput({
  field,
  label,
  value,
  error,
  onChange,
  hint,
  ...props
}: {
  field: string;
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
          eyebrow="Langkah 1"
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

const schoolLevels = ["SMP/sederajat", "SMA/sederajat", "SMK/sederajat"];
const juniorSecondaryGrades = ["Kelas 7", "Kelas 8", "Kelas 9"];
const seniorSecondaryGrades = ["Kelas 10", "Kelas 11", "Kelas 12"];
const universityLevels = ["Diploma", "Sarjana", "Magister"];

export function EducationStep({ data, errors, onChange, disabled }: StepProps) {
  const educationLevels = data.educationStatus === "student" ? schoolLevels : universityLevels;
  const schoolGrades = data.educationLevel === "SMP/sederajat" ? juniorSecondaryGrades : seniorSecondaryGrades;

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
                  onChange("studyProgram", "");
                  onChange("schoolGrade", "");
                  onChange("entryYear", "");
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
          <TextInput field="institutionName" label={data.educationStatus === "student" ? "Nama sekolah" : "Nama universitas"} value={data.institutionName} error={errors.institutionName} onChange={(value) => onChange("institutionName", value)} placeholder={data.educationStatus === "student" ? "Contoh: SMA Negeri 1 Denpasar" : "Contoh: Universitas Indonesia"} disabled={disabled} />
        </div>
        {data.educationStatus === "university" ? (
          <TextInput field="studyProgram" label="Program studi" value={data.studyProgram} error={errors.studyProgram} onChange={(value) => onChange("studyProgram", value)} placeholder="Contoh: Desain Komunikasi Visual" disabled={disabled} />
        ) : null}
        <Field id="registration-educationLevel" label={data.educationStatus === "student" ? "Jenjang sekolah" : "Jenjang pendidikan"} error={errors.educationLevel}>
          <select
            id="registration-educationLevel"
            value={data.educationLevel}
            onChange={(event) => {
              onChange("educationLevel", event.target.value);
              if (data.educationStatus === "student") onChange("schoolGrade", "");
            }}
            disabled={disabled}
            aria-invalid={Boolean(errors.educationLevel)}
            aria-describedby={errors.educationLevel ? "registration-educationLevel-error" : undefined}
            className={`${inputClass} ${errors.educationLevel ? "border-red-400" : ""}`}
          >
            <option value="">{data.educationStatus === "student" ? "Pilih jenjang sekolah" : "Pilih jenjang pendidikan"}</option>
            {educationLevels.map((level) => <option key={level} value={level}>{level}</option>)}
          </select>
        </Field>
        {data.educationStatus === "student" ? (
          <Field id="registration-schoolGrade" label="Kelas saat ini" error={errors.schoolGrade}>
            <select id="registration-schoolGrade" value={data.schoolGrade} onChange={(event) => onChange("schoolGrade", event.target.value)} disabled={disabled || !data.educationLevel} aria-invalid={Boolean(errors.schoolGrade)} aria-describedby={errors.schoolGrade ? "registration-schoolGrade-error" : undefined} className={`${inputClass} ${errors.schoolGrade ? "border-red-400" : ""}`}>
              <option value="">{data.educationLevel ? "Pilih kelas" : "Pilih jenjang dahulu"}</option>
              {schoolGrades.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
            </select>
          </Field>
        ) : (
          <TextInput field="entryYear" label="Tahun masuk kuliah" value={data.entryYear} error={errors.entryYear} onChange={(value) => onChange("entryYear", value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" placeholder="2024" disabled={disabled} />
        )}
        <TextInput field="graduationYear" label="Perkiraan tahun lulus" value={data.graduationYear} error={errors.graduationYear} onChange={(value) => onChange("graduationYear", value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" placeholder="2027" disabled={disabled} />
        <div className="sm:col-span-2">
          <TextInput field="dateOfBirth" label="Tanggal lahir" value={data.dateOfBirth} error={errors.dateOfBirth} onChange={(value) => onChange("dateOfBirth", value)} type="date" autoComplete="bday" hint="Tanggal lahir digunakan untuk menentukan apakah persetujuan wali diperlukan." disabled={disabled} />
        </div>
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
        Gunakan alamat email wali yang aktif agar proses persetujuan dapat dilakukan dengan jelas.
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

export function RegistrationReviewStep({ data, errors, onChange, needsGuardian, onEdit }: StepProps & {
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
          {data.educationStatus === "student" ? (
            <SummaryItem term="Kelas" detail={data.schoolGrade} />
          ) : (
            <SummaryItem term="Program studi" detail={data.studyProgram} />
          )}
          <SummaryItem term="Jenjang" detail={data.educationLevel} />
          <SummaryItem term={data.educationStatus === "student" ? "Perkiraan lulus" : "Periode kuliah"} detail={data.educationStatus === "student" ? data.graduationYear : `${data.entryYear}–${data.graduationYear}`} />
          <SummaryItem term="Tanggal lahir" detail={data.dateOfBirth} />
        </SummaryCard>
        {needsGuardian && (
          <SummaryCard title="Orang tua atau wali" onEdit={() => onEdit("guardian")}>
            <SummaryItem term="Nama" detail={data.guardianName} />
            <SummaryItem term="Hubungan" detail={data.guardianRelationship} />
            <SummaryItem term="Email" detail={data.guardianEmail} />
          </SummaryCard>
        )}
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
        <CheckIcon className="size-6" />
      </span>
      <h2 className="mt-4 text-2xl font-bold text-emerald-950">Akun berhasil dibuat</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-emerald-900">Periksa kotak masuk emailmu untuk konfirmasi akunmu sebelum login.</p>
      <Link href="/login" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-5 text-sm font-semibold text-white hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">Lanjut ke login</Link>
    </div>
  );
}
