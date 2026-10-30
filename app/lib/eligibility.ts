import type { EducationLevel } from "./validator/profile";

export type ProjectRangeValue =
  | "ALL"
  | "INTERNAL"
  | "PROVINCE"
  | "CITY"
  | "INSTITUTIONS";

export type EligibilityApplicant = {
  educationLevel: EducationLevel | null;
  institution?: string | null;
  province?: string | null;
  city?: string | null;
};

export type EligibilityProject = {
  educationLevels?: EducationLevel[] | null;
  range?: ProjectRangeValue | null;
  allowedInstitutions?: string[] | null;
  owner?: {
    institution?: string | null;
    province?: string | null;
    city?: string | null;
  } | null;
};

export type Eligibility = {
  education: boolean;
  audience: boolean;
  eligible: boolean;
};

function sameRegion(value?: string | null, expected?: string | null) {
  if (!expected) return true;
  if (!value) return false;
  return value.trim().toLocaleLowerCase("id-ID") === expected.trim().toLocaleLowerCase("id-ID");
}

export function checkEducationEligibility(
  applicant: EligibilityApplicant,
  project: EligibilityProject,
) {
  const levels = project.educationLevels ?? [];
  if (levels.length === 0) return true;
  return applicant.educationLevel !== null && levels.includes(applicant.educationLevel);
}

export function checkAudienceEligibility(
  applicant: EligibilityApplicant,
  project: EligibilityProject,
) {
  const allowedInstitutions = project.allowedInstitutions ?? [];
  const owner = project.owner ?? undefined;

  switch (project.range ?? "ALL") {
    case "ALL":
      return true;
    case "INTERNAL":
      if (!owner?.institution) return true;
      return typeof applicant.institution === "string" && applicant.institution === owner.institution;
    case "INSTITUTIONS":
      if (allowedInstitutions.length === 0) return true;
      return (
        typeof applicant.institution === "string" &&
        allowedInstitutions.includes(applicant.institution)
      );
    case "CITY":
      return sameRegion(applicant.city, owner?.city);
    case "PROVINCE":
      return sameRegion(applicant.province, owner?.province);
  }
}

export function checkProjectEligibility(
  applicant: EligibilityApplicant,
  project: EligibilityProject,
): Eligibility {
  const education = checkEducationEligibility(applicant, project);
  const audience = checkAudienceEligibility(applicant, project);

  return { education, audience, eligible: education && audience };
}
