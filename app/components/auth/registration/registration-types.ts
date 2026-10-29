export type RegistrationStepId =
  | "account"
  | "education"
  | "review";

export type EducationStatus = "student" | "university";

export type RegistrationData = {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  educationStatus: EducationStatus;
  studyProgram: string;
  schoolGrade: string;
  educationLevel: string;
  entryYear: string;
  graduationYear: string;
  dateOfBirth: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  confirmedAccuracy: boolean;
};

export type RegistrationField = keyof RegistrationData;
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

export const initialRegistrationData: RegistrationData = {
  fullName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  educationStatus: "student",
  studyProgram: "",
  schoolGrade: "",
  educationLevel: "",
  entryYear: "",
  graduationYear: "",
  dateOfBirth: "",
  acceptedTerms: false,
  acceptedPrivacy: false,
  confirmedAccuracy: false,
};

export function calculateAge(dateOfBirth: string, today: Date) {
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
