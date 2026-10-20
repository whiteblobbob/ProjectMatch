import { prisma } from "./prisma";
import { NotificationForm, NotificationValidator } from "./validator/notification";

/**
 * Create a notification for a user.
 * Internal utility — called from server actions, not exposed to clients.
 */
export async function createNotification(formData: NotificationForm) {
    const result = NotificationValidator.safeParse(formData);

    if (!result.success) {
        throw new Error(result.error.message);
    }

    const data = result.data;

    await prisma.notification.create({
        data: {
            userId: data.userId,
            title: data.title,
            message: data.message,
        }
    });
}
