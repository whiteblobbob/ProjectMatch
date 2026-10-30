import { educationLevelLabel } from "@/app/lib/ui/profile";
import { cloudinaryAvatarUrl } from "@/app/lib/ui/cloudinary";
import { formatRegion } from "@/app/lib/regions";
import type { EducationLevel } from "@/app/lib/validator/profile";
import Breadcrumbs from "../ui/breadcrumbs";
import { CheckIcon, ExternalLinkIcon, MapPinIcon, UsersIcon } from "../ui/icons";

type PublicProfileRecord = {
  id: string;
  name: string | null;
  institutionName: string | null;
  bio: string | null;
  province: string | null;
  city: string | null;
  portfolioLink: string | null;
  profileCloudId: string | null;
  verified: boolean;
  educationLevel: EducationLevel | null;
  avgCommitmentScore: number;
  totalProjectsCompleted: number;
  userRoles: Array<{ role: { name: string } }>;
};

function initials(name: string | null) {
  const value = name?.trim() || "PM";
  return value.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("id-ID");
}

export default function PublicProfile({ profile, cloudName }: { profile: PublicProfileRecord; cloudName: string }) {
  const name = profile.name?.trim() || "Pengguna ProjectMatch";
  const skills = profile.userRoles.map(({ role }) => role.name);
  const educationLabel = educationLevelLabel(profile.educationLevel);
  const avatarUrl = profile.profileCloudId ? cloudinaryAvatarUrl(profile.profileCloudId, cloudName) : null;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <Breadcrumbs items={[{ label: "Jelajah", href: "/" }, { label: "Profil" }]} />
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              role="img"
              aria-label={avatarUrl ? `Foto profil ${name}` : `Inisial profil ${name}`}
              className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-primary to-indigo-500 bg-cover bg-center text-2xl font-bold text-white shadow-sm"
              style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
            >
              {!avatarUrl && initials(profile.name)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">{name}</h1>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${profile.verified ? "bg-emerald-50 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                  {profile.verified ? "Terverifikasi" : "Belum terverifikasi"}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-700">{profile.institutionName || "Institusi belum diisi"}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                {educationLabel ? <span>{educationLabel}</span> : null}
                {formatRegion(profile.city, profile.province) ? <span className="flex items-center gap-1.5"><MapPinIcon className="size-3.5" />{formatRegion(profile.city, profile.province)}</span> : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1180px] items-start gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-12 lg:px-8">
        <article className="space-y-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:col-span-8">
          <section aria-labelledby="about-heading">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tentang</p>
            <h2 id="about-heading" className="mt-2 text-lg font-bold text-slate-950">Perkenalan</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{profile.bio?.trim() || "Pengguna ini belum menuliskan bio."}</p>
          </section>

          <section aria-labelledby="skills-heading">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Keahlian</p>
            <h2 id="skills-heading" className="sr-only">Daftar keahlian</h2>
            {skills.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{skill}</span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Belum ada keahlian yang dicantumkan.</p>
            )}
          </section>

          <section aria-labelledby="portfolio-heading">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Portofolio</p>
            <h2 id="portfolio-heading" className="sr-only">Portofolio</h2>
            {profile.portfolioLink ? (
              <a href={profile.portfolioLink} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary">
                <span className="truncate">{profile.portfolioLink}</span>
                <ExternalLinkIcon className="size-4 shrink-0" />
              </a>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Belum ada portofolio.</p>
            )}
          </section>
        </article>

        <aside className="space-y-4 lg:col-span-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Rekam kolaborasi</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><CheckIcon className="size-4" /></span>
                <div><p className="text-sm font-bold text-slate-950">{profile.totalProjectsCompleted} proyek selesai</p><p className="mt-0.5 text-xs text-slate-500">Total kontribusi terselesaikan</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-primary"><UsersIcon className="size-4" /></span>
                <div><p className="text-sm font-bold text-slate-950">Skor komitmen {profile.avgCommitmentScore.toFixed(1)}/5</p><p className="mt-0.5 text-xs text-slate-500">Dari penilaian rekan tim</p></div>
              </div>
            </div>
          </article>
        </aside>
      </div>
    </main>
  );
}
