import { User } from "@supabase/supabase-js";
import { prisma } from "../lib/prisma";
import { ProfileForm, ProfileValidator } from "../lib/validator/profile";
import authWrapper from "../utils/authWrapper";

export const updateProfile = authWrapper(async (user: User, formData: Partial<ProfileForm>) => {
    const result = ProfileValidator.partial().safeParse(formData);

    if (!result.success) {
        throw new Error(result.error.message);
    }

    const data = result.data;

    await prisma.user.update({
        where: { id: "1" }, // TODO Replace with the actual user ID
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