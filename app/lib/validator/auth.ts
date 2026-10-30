import z from "zod";
import { EducationLevelValidator } from "./profile";

const CredentialsValidator = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const SignupValidator = CredentialsValidator.extend({
  name: z.string().min(1, "Name is required"),
  educationLevel: EducationLevelValidator,
  institution: z.string({ error: "Institution is required" }).min(1, "Institution is required"),
  province: z.string({ error: "Province is required" }).min(1, "Province is required"),
  city: z.string({ error: "City is required" }).min(1, "City is required"),
  studyProgram: z.string().optional(),
  schoolGrade: z.string().optional(),
  entryYear: z.number().int().optional(),
  graduationYear: z.number().int().optional(),
  dateOfBirth: z.string().optional(),
});
export type SignupForm = z.infer<typeof SignupValidator>;

export const LoginValidator = CredentialsValidator;
export type LoginForm = z.infer<typeof LoginValidator>;

export const ForgotPasswordValidator = z.object({
  email: z.email("Masukkan alamat email yang valid."),
});
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordValidator>;

export const ResetPasswordValidator = z.object({
  password: CredentialsValidator.shape.password,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi kata sandi tidak cocok.",
  path: ["confirmPassword"],
});
export type ResetPasswordForm = z.infer<typeof ResetPasswordValidator>;

const ACADEMIC_EMAIL_DOMAINS = [".ac.id", ".edu"];

export function isAcademicEmail(value: string) {
  const normalized = value.trim().toLowerCase();
  return ACADEMIC_EMAIL_DOMAINS.some((domain) => normalized.endsWith(domain));
}

export const SendVerificationValidator = z.object({
  email: z
    .email("Email must be a valid address")
    .refine(isAcademicEmail, "Gunakan email resmi sekolah atau kampus (.ac.id atau .edu)"),
});
export type SendVerificationForm = z.infer<typeof SendVerificationValidator>;
