"use server";
import { User } from "@supabase/supabase-js";
import { prisma } from "../lib/prisma";
import { ProfileForm, ProfileValidator } from "../lib/validator/profile";
import actionWrapper from "../utils/actionWrapper";

export const fetchProfile = actionWrapper(async (user: User) => {
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      status: true,
      userRoles: {
        include: { role: true },
      },
    },
  });

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
}, { auth: true });

export const fetchReviews = actionWrapper(async (user: User) => {
  const reviews = await prisma.peerReview.findMany({
    where: { revieweeId: user.id },
    include: {
      reviewer: {
        select: {
          name: true,
          instance: true,
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

export const updateProfile = actionWrapper(async (user: User, formData: Partial<ProfileForm>) => {
  const result = ProfileValidator.partial().safeParse(formData);

  if (!result.success) {
    throw new Error(result.error.message);
  }

  const data = result.data;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      instance: data.instance,
      bio: data.bio,
      contactInfo: data.contactInfo,
      statusId: data.statusId,
      userRoles: {
        deleteMany: (data.userRoles) ? {} : undefined,
        create: data.userRoles?.map(role => ({
          role: {
            connect: { id: role.roleId }
          }
        })),
      },
    }
  });
}, { auth: true });