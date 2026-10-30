import Link from "next/link";

import type { ProjectDetail } from "@/app/lib/ui/kelola-project";
import { ArrowRightIcon, UsersIcon } from "../../ui/icons";

type MemberCardProps = {
  project: ProjectDetail;
  projectId: string;
  canManage?: boolean;
};

const avatarTones = ["bg-slate-900", "bg-indigo-500", "bg-emerald-500", "bg-amber-500"];

function initialsOf(name: string | null | undefined) {
  const initials = (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return initials || "PM";
}

export default function MemberCard({ project, projectId, canManage = true }: MemberCardProps) {
  const members = [
    { userId: project.owner.id, name: project.owner.name },
    ...project.projectMembers
      .filter((member) => member.userId !== project.ownerId)
      .map((member) => ({ userId: member.userId, name: member.user.name })),
  ];
  const memberCount = members.length;
  const openSlots = project.projectRoles.reduce((total, projectRole) => total + projectRole.slotsAvailable, 0);
  const capacity = memberCount + openSlots;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
          <UsersIcon className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tim saat ini</p>
          <h3 className="mt-0.5 text-sm font-bold text-slate-950">
            {memberCount} dari {capacity} anggota
          </h3>
        </div>
      </div>

      <div className="mt-4 flex -space-x-2" aria-label={`${memberCount} anggota terkonfirmasi`}>
        {members.slice(0, 4).map((member, index) => (
          <span
            key={member.userId}
            className={`flex size-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white ${avatarTones[index % avatarTones.length]}`}
          >
            {initialsOf(member.name)}
          </span>
        ))}
        {openSlots > 0 ? (
          <span className="flex size-9 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white text-xs font-bold text-slate-400">
            +{openSlots}
          </span>
        ) : null}
      </div>

      {canManage ? (
        <Link
          href={`/activity/project/${projectId}/members`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          Lihat anggota
          <ArrowRightIcon className="size-4" />
        </Link>
      ) : null}
    </article>
  );
}
