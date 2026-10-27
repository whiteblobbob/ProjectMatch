"use server";

import { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import actionWrapper from "../lib/actionWrapper";
import {
  DEMO_PROFILE_COOKIE,
  DEMO_USER_ID,
  isDemoAccountEnabled,
} from "../lib/demo-account";
import { ActionError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { parseOrThrow } from "../lib/validator/global";
import {
  ProfileEducationLevel,
  ProfileForm,
  ProfileValidator,
  ProfileView,
  profileEducationOptions,
} from "../lib/validator/profile";

const demoProfile: ProfileView = {
  name: "Akun Demo ProjectMatch",
  email: "demo@projectmatch.test",
  instance: "Universitas Contoh Indonesia",
  educationLevel: "HIGHER_EDUCATION",
  bio: "Pelajar yang terbuka untuk berkolaborasi dalam proyek lintas jurusan dan belajar hal baru bersama tim.",
  contactInfo: "",
  skills: ["Komunikasi", "Riset", "Desain presentasi"],
  totalProjectsCompleted: 0,
  avgCommitmentScore: 0,
};

function educationLevelFromStatus(statusName?: string | null): ProfileEducationLevel | null {
  return profileEducationOptions.find(
    (option) => option.statusName.toLocaleLowerCase("id-ID") === statusName?.toLocaleLowerCase("id-ID"),
  )?.value ?? null;
}

async function getDemoProfile(email?: string | null): Promise<ProfileView> {
  const savedProfile = (await cookies()).get(DEMO_PROFILE_COOKIE)?.value;

  if (savedProfile) {
    try {
      const parsed = ProfileValidator.safeParse(JSON.parse(savedProfile));
      if (parsed.success) {
        return {
          ...demoProfile,
          ...parsed.data,
          email: email ?? demoProfile.email,
        };
      }
    } catch {
      // A malformed preview cookie falls back to the safe demo profile below.
    }
  }

  return { ...demoProfile, email: email ?? demoProfile.email };
}

export const fetchProfile = actionWrapper(async (user: User): Promise<ProfileView> => {
  if (isDemoAccountEnabled() && user.id === DEMO_USER_ID) {
    return getDemoProfile(user.email);
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      status: true,
      userRoles: { include: { role: true } },
    },
  });

  if (!profile) {
    throw new ActionError("Profil tidak ditemukan");
  }

  return {
    name: profile.name ?? "",
    email: user.email ?? "",
    instance: profile.instance ?? "",
    educationLevel: educationLevelFromStatus(profile.status?.name),
    bio: profile.bio ?? "",
    contactInfo: profile.contactInfo ?? "",
    skills: profile.userRoles.map(({ role }) => role.name),
    totalProjectsCompleted: profile.totalProjectsCompleted,
    avgCommitmentScore: profile.avgCommitmentScore,
  };
}, { auth: true });

export const fetchReviews = actionWrapper(async (user: User) => {
  return prisma.peerReview.findMany({
    where: { revieweeId: user.id },
    include: {
      reviewer: { select: { name: true, instance: true } },
      project: { select: { title: true } },
    },
  });
}, { auth: true });

export const updateProfile = actionWrapper(async (user: User, formData: ProfileForm): Promise<ProfileView> => {
  const data = parseOrThrow(ProfileValidator, formData);

  if (isDemoAccountEnabled() && user.id === DEMO_USER_ID) {
    const cookieStore = await cookies();
    cookieStore.set(DEMO_PROFILE_COOKIE, JSON.stringify(data), {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    revalidatePath("/profil");
    return { ...demoProfile, ...data, email: user.email ?? demoProfile.email };
  }

  const updatedProfile = await prisma.$transaction(async (tx) => {
    const statusName = profileEducationOptions.find(
      (option) => option.value === data.educationLevel,
    )?.statusName;

    if (!statusName) {
      throw new ActionError("Jenjang pendidikan tidak valid");
    }

    const existingStatus = await tx.status.findFirst({
      where: { name: { equals: statusName, mode: "insensitive" } },
      select: { id: true },
    });
    const status = existingStatus ?? await tx.status.create({
      data: { name: statusName },
      select: { id: true },
    });

    const roleIds: string[] = [];
    for (const skillName of data.skills) {
      const existingRole = await tx.role.findFirst({
        where: { name: { equals: skillName, mode: "insensitive" } },
        select: { id: true },
      });
      const role = existingRole ?? await tx.role.create({
        data: { name: skillName },
        select: { id: true },
      });
      roleIds.push(role.id);
    }

    return tx.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        instance: data.instance,
        bio: data.bio || null,
        contactInfo: data.contactInfo || null,
        statusId: status.id,
        userRoles: {
          deleteMany: {},
          create: roleIds.map((roleId) => ({ role: { connect: { id: roleId } } })),
        },
      },
      include: {
        status: true,
        userRoles: { include: { role: true } },
      },
    });
  });

  revalidatePath("/profil");

  return {
    name: updatedProfile.name ?? data.name,
    email: user.email ?? "",
    instance: updatedProfile.instance ?? data.instance,
    educationLevel: educationLevelFromStatus(updatedProfile.status?.name),
    bio: updatedProfile.bio ?? "",
    contactInfo: updatedProfile.contactInfo ?? "",
    skills: updatedProfile.userRoles.map(({ role }) => role.name),
    totalProjectsCompleted: updatedProfile.totalProjectsCompleted,
    avgCommitmentScore: updatedProfile.avgCommitmentScore,
  };
}, { auth: true });
