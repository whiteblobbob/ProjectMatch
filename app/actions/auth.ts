import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";
import { LoginFormData, SignupFormData } from "../types/auth";
import { createClient } from "../utils/supabase/server";

export async function signup(formData: SignupFormData) {
    const supabase = createClient(await cookies());
    const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
    });

    if (error) {
        throw new Error(error.message);
    }

    await prisma.user.create({
        data: {
            id: data.user?.id,
        }
    });
}

export async function login(formData: LoginFormData) {
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
    });

    if (error) {
        throw new Error(error.message);
    }
}