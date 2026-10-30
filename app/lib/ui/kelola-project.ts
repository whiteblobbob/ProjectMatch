import "server-only";

import { notFound, redirect } from "next/navigation";

import { fetchProject, fetchProjectApplications } from "@/app/actions/project";
import { requireSessionUser } from "./session";

export type ProjectDetail = Extract<
  Awaited<ReturnType<typeof fetchProject>>,
  { success: true; data: unknown }
>["data"];

export type ProjectApplication = Extract<
  Awaited<ReturnType<typeof fetchProjectApplications>>,
  { success: true; data: unknown }
>["data"][number];

/**
 * Load a project for the kelola (manage) screens, restricted to its owner.
 * Redirects unauthenticated visitors to login and non-owners to the public
 * project detail page.
 */
export async function loadOwnedProject(id: string) {
  const user = await requireSessionUser();

  const result = await fetchProject(id);

  if (!result.success || !("data" in result)) {
    notFound();
  }

  if (result.data.ownerId !== user.id) {
    redirect(`/project/${id}`);
  }

  return { user, project: result.data };
}

/**
 * Load a project for the activity screens, open to its owner and confirmed
 * members. Unauthenticated visitors go to login; everyone else is sent to the
 * public project page.
 */
export async function loadActivityProject(id: string) {
  const user = await requireSessionUser();

  const result = await fetchProject(id);

  if (!result.success || !("data" in result)) {
    notFound();
  }

  const project = result.data;
  const isOwner = project.ownerId === user.id;
  const isMember = project.projectMembers.some((member) => member.userId === user.id);

  if (!isOwner && !isMember) {
    redirect(`/project/${id}`);
  }

  return { user, project, isOwner, isMember };
}
