import z from "zod";

export const SignupValidator = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
export type SignupForm = z.infer<typeof SignupValidator>;

export const LoginValidator = SignupValidator; // Reuse the same validator for login since the fields are the same
export type LoginForm = z.infer<typeof LoginValidator>;