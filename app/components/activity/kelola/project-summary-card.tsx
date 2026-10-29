import type { ProjectDetail } from "@/app/lib/ui/kelola-project";
import { getCollaborationModeLabel } from "../../ui/collaboration-mode";
import { CalendarIcon, ClockIcon, LaptopIcon, UsersIcon } from "../../ui/icons";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const statusMeta = {
  OPEN_RECRUITMENT: { label: "Sedang mencari anggota", className: "bg-emerald-50 text-emerald-700" },
  IN_PROGRESS: { label: "Sedang berjalan", className: "bg-blue-50 text-blue-700" },
  COMPLETED: { label: "Selesai", className: "bg-slate-100 text-slate-600" },
} as const;

export default function ProjectSummaryCard({ project }: { project: ProjectDetail }) {
  const memberCount = project.projectMembers.length;
  const openSlots = project.projectRoles.reduce((total, projectRole) => total + projectRole.slotsAvailable, 0);
  const capacity = memberCount + openSlots;
  const roleNames = project.projectRoles.map((projectRole) => projectRole.role.name).join(", ");
  const status = statusMeta[project.status];

  const facts = [
    { label: "Mode kolaborasi", value: getCollaborationModeLabel(project.collaborationMode), icon: LaptopIcon },
    { label: "Komitmen", value: `${project.workHoursPerWeek} jam/minggu`, icon: ClockIcon },
    { label: "Anggota", value: `${memberCount} dari ${capacity}`, icon: UsersIcon },
    {
      label: "Batas pengajuan",
      value: project.deadline ? dateFormatter.format(project.deadline) : "Tanpa batas",
      icon: CalendarIcon,
    },
  ];

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-primary">
                {project.category.name}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                {status.label}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{project.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {getCollaborationModeLabel(project.collaborationMode)} · {project.workHoursPerWeek} jam/minggu
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Posisi dicari</p>
            <p className="mt-1 text-sm font-bold text-slate-950">{roleNames || "Belum ada posisi"}</p>
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">
        {facts.map(({ label, value, icon: Icon }) => (
          <div key={label} className="min-w-0 p-4 sm:p-5">
            <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Icon className="size-4 shrink-0 text-slate-400" />
              {label}
            </dt>
            <dd className="mt-2 text-sm font-semibold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
