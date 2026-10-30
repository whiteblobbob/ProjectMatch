"use server"
import { createClient } from "../lib/supabase/server";
import { ensureAppUser } from "../lib/supabase/ensureAppUser";
import { ForgotPasswordForm, ForgotPasswordValidator, LoginForm, LoginValidator, RegistrationProfileValidator, ResetPasswordForm, ResetPasswordValidator, SignupForm, SignupValidator } from "../lib/validator/auth";
import { parseOrThrow } from "../lib/validator/global";
import { ActionError } from "../lib/errors";
import actionWrapper from "../lib/actionWrapper";
import { validateRegion } from "../lib/regions";
import { findInstitution, institutionKindForLevel } from "../lib/institution";

export const signup = actionWrapper(async (formData: SignupForm) => {
  const data = parseOrThrow(SignupValidator, formData);

  const regionErrors = validateRegion(data.province, data.city);
  if (Object.keys(regionErrors).length > 0) {
    throw new ActionError("Please check your input", regionErrors);
  }

  const institution = await findInstitution(
    data.institution,
    institutionKindForLevel(data.educationLevel),
  );

  if (!institution) {
    throw new ActionError("Please check your input", {
      institution: ["Pilih institusi dari daftar"],
    });
  }

  const registrationProfile = RegistrationProfileValidator.parse(data);
  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { data: { registrationProfile } },
  });

  // Supabase auth messages (invalid credentials, unconfirmed email, ...) are
  // written for end users.
  if (error) {
    throw new ActionError(error.message);
  }

  if (!userData.user?.id) {
    throw new ActionError("Account could not be created. Please try again.");
  }

  // Supabase can return an obfuscated user with no identities for an already
  // registered email. Do not provision a local row for that placeholder ID.
  if (userData.user.identities?.length === 0) return;

  await ensureAppUser({
    ...userData.user,
    user_metadata: { ...userData.user.user_metadata, registrationProfile },
  });
});

export const login = actionWrapper(async (formData: LoginForm) => {
    const data = parseOrThrow(LoginValidator, formData);

    const supabase = await createClient();
    const { data: userData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new ActionError(error.message);
    }

    if (!userData.user) {
      throw new ActionError("Account could not be signed in. Please try again.");
    }

    await ensureAppUser(userData.user);
});

export const forgotPassword = actionWrapper(async (formData: ForgotPasswordForm) => {
  const data = parseOrThrow(ForgotPasswordValidator, formData);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw new ActionError("Pemulihan kata sandi belum dikonfigurasi.");
  }

  const redirectTo = new URL("/api/reset-password", siteUrl).toString();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(data.email, { redirectTo });

  if (error) {
    throw new ActionError("Gagal mengirim tautan pemulihan. Silakan coba lagi nanti.");
  }
});

export const resetPassword = actionWrapper(async (_user, formData: ResetPasswordForm) => {
  const data = parseOrThrow(ResetPasswordValidator, formData);
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: data.password });

  if (error) {
    throw new ActionError(error.message);
  }
}, { auth: true, ensureProfile: false });
