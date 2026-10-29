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