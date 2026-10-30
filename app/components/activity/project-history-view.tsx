import type { ProjectDetail } from "@/app/lib/ui/kelola-project";
import Breadcrumbs from "../ui/breadcrumbs";
import MemberList from "./member-list";
import MeetingCard from "./kelola/meeting-card";
import ProjectSummaryCard from "./kelola/project-summary-card";
import PeerReviewSection, {
  type ParticipantReview,
  type PeerReviewParticipant,
} from "./peer-review-section";

type ProjectHistoryViewProps = {
  project: ProjectDetail;
  currentUserId: string;
  reviews: ParticipantReview[];
};

export default function ProjectHistoryView({ project, currentUserId, reviews }: ProjectHistoryViewProps) {
  const participants: PeerReviewParticipant[] = [
    {
      userId: project.owner.id,
      name: project.owner.name,
      roleName: "Pembuat proyek",
      isOwner: true,
    },
    ...project.projectMembers
      .filter((member) => member.userId !== project.ownerId)
      .map((member) => ({
        userId: member.userId,
        name: member.user.name,
        roleName: member.roleName,
        isOwner: false,
      })),
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Aktivitas", href: "/activity" },
              { label: "Riwayat proyek" },
            ]}
          />

          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-primary">
                {project.category.name}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Selesai
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{project.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Proyek telah selesai. Lihat ringkasan tim dan berikan penilaian untuk rekan kolaborasimu.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <ProjectSummaryCard project={project} />

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-12">
          <section className="space-y-4 lg:col-span-8" aria-labelledby="history-team-heading">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 id="history-team-heading" className="text-lg font-bold text-slate-950">Tim proyek</h2>
                <p className="mt-1 text-sm text-slate-500">Anggota yang berkolaborasi di proyek ini.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {project.projectMembers.length + 1} anggota
              </span>
            </div>
            <MemberList project={project} />
          </section>

          <aside className="space-y-4 lg:col-span-4" aria-label="Informasi pertemuan proyek">
            <MeetingCard project={project} projectId={project.id} canManage={false} />
          </aside>
        </div>

        <div className="mt-8">
          <PeerReviewSection
            projectId={project.id}
            currentUserId={currentUserId}
            participants={participants}
            reviews={reviews}
          />
        </div>
      </div>
    </main>
  );
}
