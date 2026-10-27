import z from "zod";

export const NotificationValidator = z.object({
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
});
export type NotificationForm = z.infer<typeof NotificationValidator>;
