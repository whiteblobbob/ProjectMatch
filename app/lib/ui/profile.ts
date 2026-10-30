import type { EducationLevel } from "../validator/profile";

export const educationLevelOptions = [
  { value: "SMP", label: "SMP/sederajat" },
  { value: "SMA", label: "SMA/SMK/sederajat" },
  { value: "MAHASISWA", label: "Mahasiswa" },
] as const;

export type ProfileForm = {
  name: string;
  institution: string;
  institutionName: string;
  educationLevel: EducationLevel;
  bio: string;
  province: string;
  city: string;
  portfolioLink: string;
  contacts: string[];
  skills: string[];
};

export type ProfileView = Omit<ProfileForm, "educationLevel"> & {
  educationLevel: EducationLevel | null;
  email: string;
  verified: boolean;
  profileCloudId: string | null;
  totalProjectsCompleted: number;
  avgCommitmentScore: number;
};

export type ProfileRecord = {
  name: string | null;
  institution: string | null;
  institutionName: string | null;
  bio: string | null;
  province: string | null;
  city: string | null;
  portfolioLink: string | null;
  profileCloudId: string | null;
  verified: boolean;
  educationLevel: EducationLevel | null;
  contactInfos: Array<{ value: string }>;
  roles: string[];
  totalProjectsCompleted: number;
  avgCommitmentScore: number;
};

export function educationLevelLabel(level?: EducationLevel | null) {
  return educationLevelOptions.find((option) => option.value === level)?.label ?? null;
}

export function toProfileView(record: ProfileRecord, email: string): ProfileView {
  return {
    name: record.name ?? "",
    institution: record.institution ?? "",
    institutionName: record.institutionName ?? "",
    educationLevel: record.educationLevel,
    bio: record.bio ?? "",
    province: record.province ?? "",
    city: record.city ?? "",
    portfolioLink: record.portfolioLink ?? "",
    verified: record.verified,
    profileCloudId: record.profileCloudId ?? null,
    contacts: record.contactInfos.map((contact) => contact.value),
    skills: record.roles,
    email,
    totalProjectsCompleted: record.totalProjectsCompleted,
    avgCommitmentScore: record.avgCommitmentScore,
  };
}
