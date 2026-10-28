"use server";

import { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import actionWrapper from "../lib/actionWrapper";
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

function educationLevelFromStatus(statusName?: string | null): ProfileEducationLevel | null {
  return profileEducationOptions.find(
    (option) => option.statusName.toLocaleLowerCase("id-ID") === statusName?.toLocaleLowerCase("id-ID"),
  )?.value ?? null;
}

export const fetchProfile = actionWrapper(async (user: User): Promise<ProfileView> => {
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
