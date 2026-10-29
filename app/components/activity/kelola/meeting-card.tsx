import Link from "next/link";

import type { ProjectDetail } from "@/app/lib/ui/kelola-project";
import { getOfflinePlaceLabel, getOnlinePlatformLabel } from "../../ui/collaboration-mode";
import { CalendarIcon, ClockIcon, MapPinIcon, VideoIcon } from "../../ui/icons";

type MeetingCardProps = {
  project: ProjectDetail;
  projectId: string;
};

export default function MeetingCard({ project, projectId }: MeetingCardProps) {
  const hasOnline = project.collaborationMode !== "OFFLINE";
  const hasOffline = project.collaborationMode !== "ONLINE";
  const PlaceIcon = project.collaborationMode === "OFFLINE" ? MapPinIcon : VideoIcon;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            <PlaceIcon className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pertemuan pertama</p>
            <h3 className="mt-0.5 text-sm font-bold text-slate-950">{project.title}</h3>
          </div>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Terjadwal</span>
      </div>

      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
        {/* Placeholder: the backend has no meeting date/time field yet. */}
        <p className="flex items-center gap-2"><CalendarIcon className="size-4 text-slate-400" />28 Okt 2026</p>
        <p className="flex items-center gap-2"><ClockIcon className="size-4 text-slate-400" />19.00–20.00 WITA</p>
        {hasOnline && project.onlinePlatform ? (
          <p className="flex items-center gap-2">
            <VideoIcon className="size-4 text-slate-400" />
            Daring melalui {getOnlinePlatformLabel(project.onlinePlatform)}
          </p>
        ) : null}
        {hasOffline && project.offlinePlace ? (
          <p className="flex items-center gap-2">
            <MapPinIcon className="size-4 text-slate-400" />
            Luring di {getOfflinePlaceLabel(project.offlinePlace)}
          </p>
        ) : null}
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-500">{project.meetDescription}</p>

      <Link
        href={`/activity/project/${projectId}/posisi`}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-primary hover:bg-brand-soft hover:text-brand-primary"
      >
        Ubah detail pertemuan
      </Link>
    </article>
  );
}
