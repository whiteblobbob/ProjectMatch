import z from "zod";

const CredentialsValidator = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const SignupValidator = CredentialsValidator.extend({
  name: z.string().min(1, "Name is required"),
});
export type SignupForm = z.infer<typeof SignupValidator>;

export const LoginValidator = CredentialsValidator;
export type LoginForm = z.infer<typeof LoginValidator>;

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