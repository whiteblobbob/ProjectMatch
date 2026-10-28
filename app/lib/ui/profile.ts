import z from "zod";

export const ProfileEducationLevelValidator = z.enum([
  "JUNIOR_SECONDARY",
  "SENIOR_SECONDARY",
  "HIGHER_EDUCATION",
]);

export const profileEducationOptions = [
  {
    value: "JUNIOR_SECONDARY",
    label: "SMP/sederajat",
    statusName: "Pelajar SMP/sederajat",
  },
  {
    value: "SENIOR_SECONDARY",
    label: "SMA/SMK/sederajat",
    statusName: "Pelajar SMA/SMK/sederajat",
  },
  {
    value: "HIGHER_EDUCATION",
    label: "Mahasiswa",
    statusName: "Mahasiswa",
  },
] as const;

export const ProfileValidator = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80, "Nama maksimal 80 karakter"),
  instance: z.string().trim().min(2, "Nama sekolah atau kampus minimal 2 karakter").max(120, "Nama sekolah atau kampus maksimal 120 karakter"),
  educationLevel: ProfileEducationLevelValidator,
  bio: z.string().trim().max(500, "Tentang diri maksimal 500 karakter"),
  contactInfo: z.string().trim().max(2000, "Informasi publik profil terlalu panjang").optional(),
  skills: z.array(
    z.string().trim().min(2, "Nama keahlian minimal 2 karakter").max(50, "Nama keahlian maksimal 50 karakter"),
  ).max(12, "Maksimal 12 keahlian").superRefine((skills, context) => {
    const normalized = skills.map((skill) => skill.toLocaleLowerCase("id-ID"));
    if (new Set(normalized).size !== normalized.length) {
      context.addIssue({
        code: "custom",
        message: "Keahlian tidak boleh sama",
      });
    }
  }),
});

export type ProfileEducationLevel = z.infer<typeof ProfileEducationLevelValidator>;
export type ProfileForm = z.infer<typeof ProfileValidator>;

export type ProfileView = Omit<ProfileForm, "educationLevel"> & {
  educationLevel: ProfileEducationLevel | null;
  email: string;
  totalProjectsCompleted: number;
  avgCommitmentScore: number;
};

export type ProfileRecord = {
  name: string | null;
  instance: string | null;
  bio: string | null;
  contactInfo: string | null;
  status: { name: string } | null;
  userRoles: Array<{ role: { name: string } }>;
  totalProjectsCompleted: number;
  avgCommitmentScore: number;
};

export function educationLevelFromStatusName(statusName?: string | null): ProfileEducationLevel | null {
  return profileEducationOptions.find(
    (option) => option.statusName.toLocaleLowerCase("id-ID") === statusName?.toLocaleLowerCase("id-ID"),
  )?.value ?? null;
}

export function toProfileView(record: ProfileRecord, email: string): ProfileView {
  return {
    name: record.name ?? "",
    instance: record.instance ?? "",
    educationLevel: educationLevelFromStatusName(record.status?.name),
    bio: record.bio ?? "",
    contactInfo: record.contactInfo ?? "",
    skills: record.userRoles.map(({ role }) => role.name),
    email,
    totalProjectsCompleted: record.totalProjectsCompleted,
    avgCommitmentScore: record.avgCommitmentScore,
  };
}
