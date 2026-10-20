"use server"
import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";
import { createClient } from "../utils/supabase/server";
import { LoginForm, LoginValidator, SignupForm, SignupValidator } from "../lib/validator/auth";

export async function signup(formData: SignupForm) {
    const result = SignupValidator.safeParse(formData);

    if (!result.success) {
        throw new Error(result.error.message);
    }

    const data = result.data;
    const supabase = createClient(await cookies());
    const { data: userData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
    });

    if (error) {
        throw new Error(error.message);
    }

    await prisma.user.create({
        data: {
            id: userData.user?.id,
        }
    });
}

export async function login(formData: LoginForm) {
    const result = LoginValidator.safeParse(formData);

    if (!result.success) {
        throw new Error(result.error.message);
    }

    const data = result.data;
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });

    if (error) {
        throw new Error(error.message);
    }
}