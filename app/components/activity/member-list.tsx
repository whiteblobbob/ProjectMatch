import UserAvatar from "@/app/components/ui/user-avatar";
import Link from "next/link";

import type { ProjectDetail } from "@/app/lib/ui/kelola-project";
import { CheckIcon, ClockIcon } from "../ui/icons";

const avatarTones = ["bg-slate-900", "bg-indigo-500", "bg-emerald-500", "bg-amber-500"];



type MemberEntry = {
  profileCloudId: string | null;
  userId: string;
  name: string | null;
  roleName: string;
  institutionName: string | null;
  bio: string | null;
  avgCommitmentScore: number;
  isOwner: boolean;
};

type MemberListProps = {
  project: ProjectDetail;
};

export default function MemberList({ project }: MemberListProps) {
  const entries: MemberEntry[] = [
    {
      userId: project.owner.id,
      name: project.owner.name, profileCloudId: project.owner.profileCloudId,
      roleName: "Pembuat proyek",
      institutionName: project.owner.institutionName,
      bio: project.owner.bio,
      avgCommitmentScore: project.owner.avgCommitmentScore,
      isOwner: true,
    },
    ...project.projectMembers
      .filter((member) => member.userId !== project.ownerId)
      .map((member) => ({
        userId: member.userId,
        name: member.user.name, profileCloudId: member.user.profileCloudId,
        roleName: member.role.name,
        institutionName: member.user.institutionName,
        bio: member.user.bio,
        avgCommitmentScore: member.user.avgCommitmentScore,
        isOwner: false,
      })),
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {entries.map((member, index) => (
        <article key={member.userId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-4">
            <UserAvatar  className={`flex size-14 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarTones[index % avatarTones.length]}`} name={member.name} profileCloudId={member.profileCloudId} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/profile/${member.userId}`} className="text-lg font-bold text-slate-950 hover:text-brand-primary hover:underline">{member.name}</Link>
                {member.isOwner ? (
                  <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-primary">Pembuat proyek</span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-slate-500">{member.institutionName || "Institusi belum diisi"}</p>
            </div>
          </div>

          <dl className="mt-5 space-y-3 border-t border-slate-100 pt-5">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-sm text-slate-500">Peran</dt>
              <dd className="text-right text-sm font-semibold text-slate-900">{member.roleName}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-sm text-slate-500">Kontribusi</dt>
              <dd className="max-w-[65%] text-right text-sm font-semibold text-slate-900">{member.bio || "Belum diisi"}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-1.5 text-sm text-slate-500"><ClockIcon className="size-4" /> Skor komitmen</dt>
              <dd className="text-sm font-semibold text-slate-900">{member.avgCommitmentScore.toFixed(1)}/5</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">
            <CheckIcon className="size-4" />
            Siap berkolaborasi
          </div>
        </article>
      ))}
    </div>
  );
}
