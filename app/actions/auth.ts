"use server"
import { Prisma } from "@/generated/prisma/client";
import prisma from "../lib/prisma";
import { createClient } from "../lib/supabase/server";
import { LoginForm, LoginValidator, SignupForm, SignupValidator } from "../lib/validator/auth";
import { parseOrThrow } from "../lib/validator/global";
import { ActionError } from "../lib/errors";
import actionWrapper from "../lib/actionWrapper";

export const signup = actionWrapper(async (formData: SignupForm) => {
  const data = parseOrThrow(SignupValidator, formData);

  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  // Supabase auth messages (invalid credentials, unconfirmed email, ...) are
  // written for end users.
  if (error) {
    throw new ActionError(error.message);
  }

  const userId = userData.user?.id;
  if (!userId) {
    throw new ActionError("Account could not be created. Please try again.");
  }

  try {
    await prisma.user.create({
      data: {
        id: userId,
        name: data.name,
      }
    });
  } catch (error) {
    // A unique constraint here means the local user row already exists.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ActionError("An account with this email already exists");
    }

    throw error;
  }
});

export const login = actionWrapper(async (formData: LoginForm) => {
    const data = parseOrThrow(LoginValidator, formData);

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new ActionError(error.message);
    }
});
