"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import { prisma } from "../prisma";
import { fetchProfile, updateProfile } from "../../actions/profile";
import { createProject, queryProjects } from "../../actions/project";
import type { QueryProjectsForm } from "../validator/project";
import { getSessionUser } from "./session";
import {
  ProfileValidator,
  profileEducationOptions,
  toProfileView,
  type ProfileEducationLevel,
  type ProfileForm,
  type ProfileView,
} from "./profile";

export type UiActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export type CreateProjectPostingForm = {
  title: string;
  description: string;
  deadline: Date;
  categoryId: string;
  onSite?: boolean;
  workHoursPerWeek: number;
  educationLevels: ProfileEducationLevel[];
  positions: Array<{ name: string; slotsAvailable: number }>;
};

async function findOrCreateStatus(name: string) {
  const existing = await prisma.status.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
    select: { id: true },
  });

  if (existing) return existing;

  return prisma.status.create({ data: { name }, select: { id: true } });
}

async function findOrCreateRole(name: string) {
  const existing = await prisma.role.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
    select: { id: true },
  });

  if (existing) return existing;

  return prisma.role.create({ data: { name }, select: { id: true } });
}

export async function getProfileView(): Promise<UiActionResult<ProfileView>> {
  const [profileResult, session] = await Promise.all([fetchProfile(), getSessionUser()]);

  if (!profileResult.success) {
    return { success: false, error: profileResult.error };
  }

  if (!("data" in profileResult) || !profileResult.data) {
    return { success: false, error: "Profil tidak ditemukan" };
  }

  return { success: true, data: toProfileView(profileResult.data, session?.email ?? "") };
}

export async function saveProfileView(form: ProfileForm): Promise<UiActionResult<ProfileView>> {
  const parsed = ProfileValidator.safeParse(form);

  if (!parsed.success) {
    const { formErrors, fieldErrors } = z.flattenError(parsed.error);
    const fields = Object.entries(fieldErrors).filter(
      (entry): entry is [string, string[]] => entry[1] !== undefined,
    );

    return {
      success: false,
      error: formErrors.length > 0 ? formErrors.join(", ") : "Please check your input",
      fieldErrors: Object.fromEntries(fields),
    };
  }

  const data = parsed.data;
  const statusName = profileEducationOptions.find((option) => option.value === data.educationLevel)?.statusName;

  if (!statusName) {
    return { success: false, error: "Jenjang pendidikan tidak valid" };
  }

  const [status, roles] = await Promise.all([
    findOrCreateStatus(statusName),
    Promise.all(data.skills.map((skill) => findOrCreateRole(skill))),
  ]);

  const result = await updateProfile({
    name: data.name,
    instance: data.instance,
    bio: data.bio,
    contactInfo: data.contactInfo,
    statusId: status.id,
    ...(roles.length > 0
      ? { userRoles: roles.map((role) => ({ roleId: role.id })) }
      : {}),
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      ...("fieldErrors" in result && result.fieldErrors ? { fieldErrors: result.fieldErrors } : {}),
    };
  }

  revalidatePath("/profil");

  return getProfileView();
}

export async function createProjectPosting(
  form: CreateProjectPostingForm,
): Promise<UiActionResult<{ id: string }>> {
  const statusNames = form.educationLevels.map(
    (level) => profileEducationOptions.find((option) => option.value === level)?.statusName,
  );

  if (statusNames.some((name) => !name)) {
    return { success: false, error: "Jenjang pelajar tidak valid" };
  }

  const positions = form.positions.map((position) => ({
    ...position,
    name: position.name.trim(),
  }));

  if (positions.length === 0) {
    return { success: false, error: "At least one position is required" };
  }

  const [statuses, roles] = await Promise.all([
    Promise.all((statusNames as string[]).map((name) => findOrCreateStatus(name))),
    Promise.all(positions.map((position) => findOrCreateRole(position.name))),
  ]);

  const result = await createProject({
    title: form.title,
    description: form.description,
    deadline: form.deadline,
    categoryId: form.categoryId,
    onSite: form.onSite,
    workHoursPerWeek: form.workHoursPerWeek,
    projectStatusCriteria: statuses.map((status) => status.id),
    projectRoles: roles.map((role, index) => ({
      roleId: role.id,
      slotsAvailable: positions[index].slotsAvailable,
    })),
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      ...("fieldErrors" in result && result.fieldErrors ? { fieldErrors: result.fieldErrors } : {}),
    };
  }

  if (!("data" in result) || !result.data) {
    return { success: false, error: "Proyek belum dapat dibuat" };
  }

  return { success: true, data: result.data };
}

export async function listGuestProjects(query: QueryProjectsForm) {
  const result = await queryProjects(query);

  if (!result.success) {
    return result;
  }

  if (!("data" in result) || !result.data) {
    return { success: false as const, error: "Proyek belum dapat dimuat" };
  }

  const ownerIds = [...new Set(result.data.projects.map((project) => project.ownerId))];
  const owners = await prisma.user.findMany({
    where: { id: { in: ownerIds } },
    select: { id: true, instance: true },
  });
  const instanceById = new Map(owners.map((owner) => [owner.id, owner.instance]));

  const projects = result.data.projects.map((project) => ({
    ...project,
    owner: { ...project.owner, instance: instanceById.get(project.ownerId) ?? null },
  }));

  return { success: true as const, data: { ...result.data, projects } };
}
