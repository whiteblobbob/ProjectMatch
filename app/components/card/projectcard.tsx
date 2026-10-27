import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "@/app/components/ui/icons";

type Props = {
  title: string;
  description: string;
  category: string;
  roles: string[];
  onSite: boolean;
  workHoursPerWeek: number;
  deadline: Date | null;
  slotsAvailable: number;
  teamSize: number;
  owner: string;
  institution: string | null;
};

export default function ProjectCard({
  title,
  description,
  category,
  roles,
  onSite,
  workHoursPerWeek,
  deadline,
  slotsAvailable,
  teamSize,
  owner,
  institution,
}: Props) {
  const formattedDeadline = deadline
    ? deadline.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "Fleksibel";
  const primaryRole = roles[0] ?? "Anggota tim";
  const otherRoles = roles.slice(1);
  const initials = title.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("id-ID") || "PM";
  const teamCapacity = teamSize + slotsAvailable;

  return (
    <article className="group rounded-xl border border-slate-200 bg-white p-5 transition-[border-color,box-shadow] duration-200 hover:border-blue-300 hover:shadow-sm sm:p-6">
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-brand-primary ring-1 ring-inset ring-blue-100">{initials}</span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">{category}</span>
                <span className="font-medium text-slate-500">{title}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold leading-snug text-slate-950 sm:text-xl">
                <Link href="/projectdetail" className="rounded-sm outline-none transition-colors group-hover:text-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">{primaryRole}</Link>
              </h3>
              {otherRoles.length > 0 && <p className="mt-1 text-xs leading-5 text-slate-500">Juga mencari {otherRoles.join(", ")}</p>}
            </div>

            <div className="shrink-0 sm:text-right">
              <p className="text-xs font-medium text-slate-500">Posisi tersedia</p>
              <p className="mt-0.5 text-xl font-bold text-slate-950">{slotsAvailable}</p>
            </div>
          </div>

          <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>

          <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-y border-slate-100 py-4 text-sm">
            <div className="flex items-center gap-2">
              <ClockIcon className="size-4 text-slate-400" />
              <dt className="sr-only">Komitmen</dt><dd className="font-medium text-slate-700">±{workHoursPerWeek} jam/minggu</dd>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-slate-400" />
              <dt className="sr-only">Tenggat</dt><dd className="font-medium text-slate-700">Tenggat {formattedDeadline}</dd>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4 text-slate-400" />
              <dt className="sr-only">Ukuran tim</dt><dd className="font-medium text-slate-700">Tim {teamSize}/{teamCapacity}</dd>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-4 text-slate-400" />
              <dt className="sr-only">Mode kolaborasi</dt><dd className="font-medium text-slate-700">{onSite ? "Tatap muka" : "Daring"}</dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Dibuat oleh</p>
              <p className="truncate text-sm font-semibold text-slate-800">{owner}{institution ? <span className="font-normal text-slate-500"> · {institution}</span> : null}</p>
            </div>
            <Link href="/projectdetail" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition-colors hover:border-brand-primary hover:bg-brand-soft hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
              Lihat detail
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
