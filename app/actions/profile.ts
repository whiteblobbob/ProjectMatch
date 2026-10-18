import { User } from "@supabase/supabase-js";
import { prisma } from "../lib/prisma";
import { ProfileForm, ProfileValidator } from "../lib/validator/profile";
import authWrapper from "../utils/authWrapper";

export const fetchProfile = authWrapper(async (user: User) => {
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
});

export const updateProfile = authWrapper(async (user: User, formData: Partial<ProfileForm>) => {
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
            statusId: data.statusId,
            userRoles: {
                deleteMany: {}, // Remove existing roles
                create: data.userRoles?.map(role => ({
                    role: {
                        connect: { id: role.roleId }
                    }
                })),
            },
        }
    });
});