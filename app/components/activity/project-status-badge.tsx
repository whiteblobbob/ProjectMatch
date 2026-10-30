import StatusBadge from "./status-badge";

type ProjectStatus = "OPEN_RECRUITMENT" | "IN_PROGRESS" | "COMPLETED";

const statusMeta = {
  OPEN_RECRUITMENT: { label: "Sedang mencari anggota", tone: "success" },
  IN_PROGRESS: { label: "Sedang berjalan", tone: "brand" },
  COMPLETED: { label: "Selesai", tone: "neutral" },
} as const;

export default function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const meta = statusMeta[status];

  return <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>;
}
