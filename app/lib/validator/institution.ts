import z from "zod";

export const SearchInstitutionValidator = z.object({
  query: z.string().max(120),
  kind: z.enum(["school", "university", "all"]),
});
export type SearchInstitutionForm = z.infer<typeof SearchInstitutionValidator>;
