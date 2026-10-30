import { notFound } from "next/navigation";
import { Suspense } from "react";

import { fetchProfile } from "../../../actions/profile";
import { fetchProject } from "../../../actions/project";
import Navbar from "../../../components/navigation-bar/guestnavbar";
import ApplicationForm from "../../../components/project/application-form";
import VerificationGate from "../../../components/project/verification-gate";
import { checkProjectEligibility } from "../../../lib/eligibility";
import { toProfileView } from "../../../lib/ui/profile";
import { requireSessionUser } from "../../../lib/ui/session";

type ProjectApplicationPageProps = {
  params: Promise<{ id: string }>;
};

export default function ProjectApplicationPage({ params }: ProjectApplicationPageProps) {
  return (
    <Suspense fallback={<ApplicationSkeleton />}>
      <ProjectApplicationAccess params={params} />
    </Suspense>
  );
}

async function ProjectApplicationAccess({ params }: ProjectApplicationPageProps) {
  const { id } = await params;
  const user = await requireSessionUser();

  const [project, profile] = await Promise.all([fetchProject(id), fetchProfile()]);

  if (!project.success || !("data" in project)) {
    notFound();
  }

  if (!profile.success || !("data" in profile)) {
    return (
      <>
        <Navbar />
        <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6" role="alert">
            <h1 className="text-xl font-bold text-red-950">Data profil belum dapat dimuat</h1>
            <p className="mt-2 text-sm text-red-800">
              {profile.success ? "Profil tidak ditemukan." : profile.error}
            </p>
          </section>
        </main>
      </>
    );
  }

  if (!profile.data.verified) {
    return (
      <>
        <Navbar />
        <VerificationGate />
      </>
    );
  }

  const eligibility = checkProjectEligibility(
    {
      educationLevel: profile.data.educationLevel,
      institution: profile.data.institution,
      province: profile.data.province,
      city: profile.data.city,
    },
    project.data,
  );
  const ineligibilityReasons = [
    eligibility.education
      ? null
      : "Jenjang pendidikanmu tidak termasuk yang diminta proyek ini.",
    eligibility.audience
      ? null
      : "Institusi atau wilayahmu berada di luar jangkauan proyek ini.",
  ].filter((reason): reason is string => reason !== null);

  if (ineligibilityReasons.length > 0) {
    return (
      <>
        <Navbar />
        <VerificationGate
          title="Kamu belum memenuhi persyaratan"
          message={`${ineligibilityReasons.join(" ")} Perbarui profilmu untuk melamar proyek ini.`}
          actionLabel="Perbarui profil"
        />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ApplicationForm
        project={project.data}
        profile={toProfileView(profile.data, user.email ?? "")}
      />
    </>
  );
}

function ApplicationSkeleton() {
  return (
    <>
      <div className="h-16 border-b border-slate-200 bg-white" aria-hidden="true" />
      <main className="mx-auto w-full max-w-3xl animate-pulse px-4 py-8" aria-label="Memuat formulir pengajuan">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="mt-4 h-24 rounded-xl bg-slate-200" />
        <div className="mt-4 h-40 rounded-xl bg-slate-200" />
        <div className="mt-4 h-12 rounded-xl bg-slate-200" />
      </main>
    </>
  );
}
