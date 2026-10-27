"use client";

import { type FormEvent, useMemo, useRef, useState } from "react";
import { signup } from "@/app/actions/auth";
import RegistrationStepper, { type RegistrationStep } from "./registration/registration-stepper";
import {
  AccountStep,
  EducationStep,
  GuardianStep,
  RegistrationReviewStep,
  RegistrationStatusCard,
} from "./registration/registration-steps";
import {
  calculateAge,
  initialRegistrationData,
  type RegistrationData,
  type RegistrationErrors,
  type RegistrationStepId,
} from "./registration/registration-types";

const baseSteps: RegistrationStep[] = [
  { id: "account", label: "Akun" },
  { id: "education", label: "Pendidikan" },
  { id: "review", label: "Tinjau" },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateAccount(data: RegistrationData): RegistrationErrors {
  const errors: RegistrationErrors = {};
  if (data.fullName.trim().length < 2) errors.fullName = "Masukkan nama lengkap minimal 2 karakter.";
  if (!emailPattern.test(data.email.trim())) errors.email = "Masukkan alamat email yang valid.";
  if (data.password.length < 8) errors.password = "Kata sandi harus terdiri dari minimal 8 karakter.";
  if (data.password !== data.passwordConfirmation) errors.passwordConfirmation = "Konfirmasi kata sandi belum sama.";
  return errors;
}

function validateEducation(data: RegistrationData): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const currentYear = new Date().getFullYear();
  const entryYear = Number(data.entryYear);
  const graduationYear = Number(data.graduationYear);
  const age = calculateAge(data.dateOfBirth, new Date());

  if (data.institutionName.trim().length < 2) errors.institutionName = data.educationStatus === "student" ? "Masukkan nama sekolah." : "Masukkan nama universitas.";
  if (!data.educationLevel) errors.educationLevel = data.educationStatus === "student" ? "Pilih jenjang sekolah." : "Pilih jenjang pendidikan.";

  if (data.educationStatus === "student") {
    if (!data.schoolGrade) errors.schoolGrade = "Pilih kelas saat ini.";
    if (!/^\d{4}$/.test(data.graduationYear) || graduationYear < currentYear || graduationYear > currentYear + 8) errors.graduationYear = "Masukkan perkiraan tahun lulus yang valid.";
  } else {
    if (data.studyProgram.trim().length < 2) errors.studyProgram = "Masukkan program studi.";
    if (!/^\d{4}$/.test(data.entryYear) || entryYear < 2000 || entryYear > currentYear + 1) errors.entryYear = "Masukkan tahun masuk yang valid.";
    if (!/^\d{4}$/.test(data.graduationYear) || graduationYear < entryYear || graduationYear > currentYear + 12) errors.graduationYear = "Tahun lulus harus setelah tahun masuk dan masuk akal.";
  }
  if (age === null || age < 10 || age > 100) errors.dateOfBirth = "Masukkan tanggal lahir yang valid.";
  return errors;
}

function validateGuardian(data: RegistrationData): RegistrationErrors {
  const errors: RegistrationErrors = {};
  if (data.guardianName.trim().length < 2) errors.guardianName = "Masukkan nama orang tua atau wali.";
  if (data.guardianRelationship.trim().length < 2) errors.guardianRelationship = "Masukkan hubungan dengan pengguna.";
  if (!emailPattern.test(data.guardianEmail.trim())) errors.guardianEmail = "Masukkan email wali yang valid.";
  if (!data.guardianConfirmed) errors.guardianConfirmed = "Konfirmasi informasi wali untuk melanjutkan.";
  return errors;
}

function validateReview(data: RegistrationData): RegistrationErrors {
  const errors: RegistrationErrors = {};
  if (!data.acceptedTerms) errors.acceptedTerms = "Persetujuan syarat penggunaan diperlukan.";
  if (!data.acceptedPrivacy) errors.acceptedPrivacy = "Persetujuan kebijakan privasi diperlukan.";
  if (!data.confirmedAccuracy) errors.confirmedAccuracy = "Konfirmasi kebenaran informasi diperlukan.";
  return errors;
}

export default function RegisterForm() {
  const [data, setData] = useState(initialRegistrationData);
  const [currentStep, setCurrentStep] = useState<RegistrationStepId>("account");
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [announcement, setAnnouncement] = useState("Langkah Akun dibuka.");
  const formRef = useRef<HTMLFormElement>(null);

  const age = calculateAge(data.dateOfBirth, new Date());
  const needsGuardian = age !== null && age < 18;
  const steps = useMemo<RegistrationStep[]>(() => needsGuardian
    ? [
        ...baseSteps.slice(0, baseSteps.length - 1),
        { id: "guardian", label: "Wali" },
        baseSteps[baseSteps.length - 1],
      ]
    : baseSteps,
  [needsGuardian]);

  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  const updateField = <Field extends keyof RegistrationData>(field: Field, value: RegistrationData[Field]) => {
    setData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  };

  const getStepErrors = (step: RegistrationStepId) => {
    if (step === "account") return validateAccount(data);
    if (step === "education") return validateEducation(data);
    if (step === "guardian") return validateGuardian(data);
    return validateReview(data);
  };

  const openStep = (step: RegistrationStepId) => {
    const targetStep = step === "guardian" && !needsGuardian ? "review" : step;
    setCurrentStep(targetStep);
    setErrors({});
    setSubmitError("");
    const label = steps.find((item) => item.id === targetStep)?.label ?? "Pendaftaran";
    setAnnouncement(`Langkah ${label} dibuka.`);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      formRef.current?.querySelector<HTMLElement>("input:not([disabled]), select:not([disabled]), button:not([disabled])")?.focus();
    });
  };

  const goNext = () => {
    const nextErrors = getStepErrors(currentStep);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setAnnouncement("Periksa kembali kolom yang ditandai sebelum melanjutkan.");
      return;
    }
    const nextStep = steps[currentIndex + 1];
    if (nextStep) openStep(nextStep.id);
  };

  const goBack = () => {
    const previousStep = steps[currentIndex - 1];
    if (previousStep) openStep(previousStep.id);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (currentStep !== "review") {
      goNext();
      return;
    }

    const reviewErrors = validateReview(data);
    if (Object.keys(reviewErrors).length > 0) {
      setErrors(reviewErrors);
      setAnnouncement("Lengkapi seluruh konfirmasi sebelum membuat akun.");
      return;
    }

    setErrors({});
    setSubmitError("");
    setIsPending(true);

    // Keep the existing production contract intact. Every other field in this
    // flow is intentionally client-only until a backend integration exists.
    const result = await signup({ email: data.email.trim(), password: data.password });

    if (!result.success) {
      setSubmitError(result.error);
      setAnnouncement("Akun belum berhasil dibuat. Periksa pesan kesalahan.");
      setIsPending(false);
      return;
    }

    setIsComplete(true);
    setIsPending(false);
  }

  if (isComplete) return <RegistrationStatusCard />;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-8 min-w-0">
      <p className="sr-only" aria-live="polite">{announcement}</p>
      <RegistrationStepper steps={steps} activeStep={currentStep} onStepSelect={openStep} />

      <div className="mt-7 border-t border-slate-200 pt-7">
        {currentStep === "account" && <AccountStep data={data} errors={errors} onChange={updateField} disabled={isPending} />}
        {currentStep === "education" && <EducationStep data={data} errors={errors} onChange={updateField} disabled={isPending} />}
        {currentStep === "guardian" && <GuardianStep data={data} errors={errors} onChange={updateField} disabled={isPending} />}
        {currentStep === "review" && <RegistrationReviewStep data={data} errors={errors} onChange={updateField} needsGuardian={needsGuardian} onEdit={openStep} disabled={isPending} />}
      </div>

      {submitError && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        {currentIndex > 0 ? (
          <button type="button" onClick={goBack} disabled={isPending} className="min-h-12 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-60">
            Kembali
          </button>
        ) : <span />}

        {currentStep === "review" ? (
          <button key="submit-registration" type="submit" disabled={isPending} className="min-h-12 rounded-xl bg-brand-primary px-6 text-sm font-semibold text-white shadow-sm hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70">
            {isPending ? "Membuat akun…" : "Buat akun"}
          </button>
        ) : (
          <button key="next-registration-step" type="button" onClick={goNext} disabled={isPending} className="min-h-12 rounded-xl bg-brand-primary px-6 text-sm font-semibold text-white shadow-sm hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:opacity-70">
            Lanjutkan
          </button>
        )}
      </div>
    </form>
  );
}
