"use server";
import { User } from "@supabase/supabase-js";
import prisma from "../lib/prisma";
import { ProfileForm, ProfileValidator } from "../lib/validator/profile";
import { IdValidator, parseOrThrow } from "../lib/validator/global";
import { ActionError } from "../lib/errors";
import actionWrapper from "../lib/actionWrapper";
import { validateRegion } from "../lib/regions";
import { destroyImage, uploadImage } from "../lib/cloudinary";
import { findInstitution, institutionKindForLevel } from "../lib/institution";

export const fetchProfile = actionWrapper(async (user: User) => {
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      userRoles: {
        include: { role: true },
      },
      contactInfos: true,
    },
  });

  if (!profile) {
    throw new ActionError("Profile not found");
  }

  return profile;
}, { auth: true });

export const fetchPublicProfile = actionWrapper(async (userId: string) => {
  const id = parseOrThrow(IdValidator, userId);

  const profile = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      institution: true,
      institutionName: true,
      bio: true,
      province: true,
      city: true,
      profileCloudId: true,
      portfolioLink: true,
      verified: true,
      educationLevel: true,
      avgCommitmentScore: true,
      totalProjectsCompleted: true,
      userRoles: {
        include: { role: true },
      },
    },
  });

  if (!profile) {
    throw new ActionError("User not found");
  }

  return profile;
});

export const fetchReviews = actionWrapper(async (user: User) => {
  const reviews = await prisma.peerReview.findMany({
    where: { revieweeId: user.id },
    include: {
      reviewer: {
        select: {
          name: true,
          institutionName: true,
        },
      },
      project: {
        select: {
          title: true,
        },
      },
    },
  });

  return reviews;
}, { auth: true });

export const updateProfile = actionWrapper(async (
  user: User,
  formData: Partial<ProfileForm>,
  media: { avatar?: File; removeAvatar?: boolean } = {},
) => {
  const data = parseOrThrow(ProfileValidator.partial(), formData);

  const regionErrors = validateRegion(data.province, data.city);
  if (Object.keys(regionErrors).length > 0) {
    throw new ActionError("Please check your input", regionErrors);
  }

  let institution: { npsn: string; name: string } | undefined;

  if (data.institution) {
    let educationLevel = data.educationLevel;

    if (!educationLevel) {
      const current = await prisma.user.findUnique({
        where: { id: user.id },
        select: { educationLevel: true },
      });
      educationLevel = current?.educationLevel ?? undefined;
    }

    const found = await findInstitution(
      data.institution,
      institutionKindForLevel(educationLevel),
    );

    if (!found) {
      throw new ActionError("Please check your input", {
        institution: ["Pilih institusi dari daftar"],
      });
    }

    institution = found;
  }

  let profileCloudId: string | null | undefined;
  let previousCloudId: string | null = null;

  if (media.avatar || media.removeAvatar) {
    const current = await prisma.user.findUnique({
      where: { id: user.id },
      select: { profileCloudId: true },
    });
    previousCloudId = current?.profileCloudId ?? null;
  }

  if (media.avatar) {
    profileCloudId = await uploadImage(media.avatar, { userId: user.id, kind: "avatar" });
  } else if (media.removeAvatar) {
    profileCloudId = null;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      institution: institution?.npsn,
      institutionName: institution?.name,
      bio: data.bio,
      province: data.province,
      city: data.city,
      portfolioLink: data.portfolioLink === undefined ? undefined : (data.portfolioLink || null),
      educationLevel: data.educationLevel,
      ...(profileCloudId !== undefined ? { profileCloudId } : {}),
      userRoles: (data.userRoles) ? {
        deleteMany: {},
        create: data.userRoles.map(role => ({
          role: {
            connect: { id: role.roleId }
          }
        })),
      } : undefined,
      contactInfos: (data.contacts) ? {
        deleteMany: {},
        create: data.contacts.map(value => ({ value })),
      } : undefined,
    }
  });

  if (previousCloudId && previousCloudId !== profileCloudId) {
    await destroyImage(previousCloudId);
  }

  if (profileCloudId !== undefined) {
    return { profileCloudId };
  }
}, { auth: true });
