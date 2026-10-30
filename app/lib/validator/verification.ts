import z from "zod";

export const VerificationDocumentTypeValidator = z.enum(["student-card", "enrollment-letter"]);
export type VerificationDocumentType = z.infer<typeof VerificationDocumentTypeValidator>;

export const VerificationDocumentValidator = z.object({
  documentType: VerificationDocumentTypeValidator,
  document: z.custom<File>((value) => value instanceof File, {
    message: "Dokumen wajib dipilih",
  }),
});
export type VerificationDocumentForm = z.infer<typeof VerificationDocumentValidator>;
