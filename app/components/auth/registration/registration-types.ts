export type RegistrationStepId =
  | "account"
  | "education"
  | "verification"
  | "guardian"
  | "review";

export type EducationStatus = "student" | "university";
export type VerificationMethod = "institutional-email" | "document";

export type RegistrationData = {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  educationStatus: EducationStatus;
  institutionId: string;
  institutionName: string;
  studyProgram: string;
  schoolGrade: string;
  educationLevel: string;
  entryYear: string;
  graduationYear: string;
  dateOfBirth: string;
  verificationMethod: VerificationMethod;
  institutionalEmail: string;
  documentType: string;
  guardianName: string;
  guardianRelationship: string;
  guardianEmail: string;
  guardianConfirmed: boolean;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  confirmedAccuracy: boolean;
};

export type RegistrationField = keyof RegistrationData | "document";
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

export const initialRegistrationData: RegistrationData = {
  fullName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  educationStatus: "student",
  institutionId: "",
  institutionName: "",
  studyProgram: "",
  schoolGrade: "",
  educationLevel: "",
  entryYear: "",
  graduationYear: "",
  dateOfBirth: "",
  verificationMethod: "institutional-email",
  institutionalEmail: "",
  documentType: "student-card",
  guardianName: "",
  guardianRelationship: "",
  guardianEmail: "",
  guardianConfirmed: false,
  acceptedTerms: false,
  acceptedPrivacy: false,
  confirmedAccuracy: false,
};

export function calculateAge(dateOfBirth: string, today = new Date()) {
  const parts = dateOfBirth.split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part))) return null;

  const [year, month, day] = parts;
  const candidate = new Date(year, month - 1, day);
  if (
    candidate.getFullYear() !== year ||
    candidate.getMonth() !== month - 1 ||
    candidate.getDate() !== day
  ) return null;

  let age = today.getFullYear() - year;
  const birthdayHasPassed =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);
  if (!birthdayHasPassed) age -= 1;
  return age;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
