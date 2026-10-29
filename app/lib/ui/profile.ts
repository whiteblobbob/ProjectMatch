import type { ProfileEducationLevel } from "../validator/profile";

export const profileEducationOptions = [
  {
    value: "JUNIOR_SECONDARY",
    label: "SMP/sederajat",
    statusName: "SMP/sederajat",
  },
  {
    value: "SENIOR_SECONDARY",
    label: "SMA/SMK/sederajat",
    statusName: "SMA/SMAK/sederajat",
  },
  {
    value: "HIGHER_EDUCATION",
    label: "Mahasiswa",
    statusName: "Mahasiswa",
  },
] as const;

export type ProfileForm = {
  name: string;
  instance: string;
  educationLevel: ProfileEducationLevel;
  bio: string;
  location: string;
  portfolioLink: string;
  contacts: string[];
  skills: string[];
};

export type ProfileView = Omit<ProfileForm, "educationLevel"> & {
  educationLevel: ProfileEducationLevel | null;
  email: string;
  verified: boolean;
  totalProjectsCompleted: number;
  avgCommitmentScore: number;
};

export type ProfileRecord = {
  name: string | null;
  instance: string | null;
  bio: string | null;
  location: string | null;
  portfolioLink: string | null;
  verified: boolean;
  contactInfos: Array<{ value: string }>;
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
    location: record.location ?? "",
    portfolioLink: record.portfolioLink ?? "",
    verified: record.verified,
    contacts: record.contactInfos.map((contact) => contact.value),
    skills: record.userRoles.map(({ role }) => role.name),
    email,
    totalProjectsCompleted: record.totalProjectsCompleted,
    avgCommitmentScore: record.avgCommitmentScore,
  };
}
