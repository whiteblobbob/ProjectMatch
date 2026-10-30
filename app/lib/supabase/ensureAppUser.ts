import "server-only";

import type { User } from "@supabase/supabase-js";
import { Prisma } from "@/generated/prisma/client";
import prisma from "../prisma";
import { findInstitution, institutionKindForLevel } from "../institution";
import { validateRegion } from "../regions";
import { RegistrationProfileValidator, type RegistrationProfile } from "../validator/auth";

/** Call only with a user returned by server-side Supabase authentication. */
export async function ensureAppUser(user: User) {
  const existing = await prisma.user.findUnique({ where: { id: user.id } });
  if (existing) return existing;

  // User metadata can be edited by its owner. Validate fields independently so
  // one malformed value cannot discard the rest of a recoverable profile.
  const rawProfile: unknown = user.user_metadata?.registrationProfile;
  const metadata = rawProfile && typeof rawProfile === "object" && !Array.isArray(rawProfile)
    ? rawProfile as Record<string, unknown>
    : {};

  function field<K extends keyof RegistrationProfile>(key: K): RegistrationProfile[K] | undefined {
    const result = RegistrationProfileValidator.shape[key].safeParse(metadata[key]);
    return result.success ? result.data as RegistrationProfile[K] : undefined;
  }

  const legacyName = RegistrationProfileValidator.shape.name.safeParse(user.user_metadata?.name);
  const name = field("name") ?? (legacyName.success ? legacyName.data : user.email ?? "Pengguna");
  const educationLevel = field("educationLevel");
  const institutionId = field("institution");
  const institution = institutionId && educationLevel
    ? await findInstitution(institutionId, institutionKindForLevel(educationLevel))
    : null;
  const province = field("province");
  const city = field("city");
  const validRegion = Object.keys(validateRegion(province, city)).length === 0;
  const dateOfBirth = field("dateOfBirth");

  try {
    // Explicitly enumerate profile fields. Roles, verification and statistics
    // always use database defaults, regardless of anything in metadata.
    return await prisma.user.create({
      data: {
        id: user.id,
        name,
        educationLevel: educationLevel ?? null,
        institution: institution?.npsn ?? null,
        institutionName: institution?.name ?? null,
        province: validRegion ? province ?? null : null,
        city: validRegion ? city ?? null : null,
        studyProgram: field("studyProgram") || null,
        schoolGrade: field("schoolGrade") || null,
        entryYear: field("entryYear") ?? null,
        graduationYear: field("graduationYear") ?? null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
    });
  } catch (error) {
    // Another request may have created this same user after our first read.
    // Recover only primary-key conflicts; unrelated errors must still fail.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.length === 1 &&
      error.meta.target[0] === "id"
    ) {
      return await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    }
    throw error;
  }
}
