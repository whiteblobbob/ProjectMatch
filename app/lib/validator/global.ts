import z from "zod";

export const IdValidator = z.string().min(1, "ID is required");