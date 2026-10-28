import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ActivitySkeleton } from "../../components/activity/activity-states";
import Navbar from "../../components/navigation-bar/guestnavbar";
import ProfilPelamar from "../../components/page/profilpelamar";
import ProfilPembuat from "../../components/page/profilpembuat";
import { requireSessionUser } from "../../lib/ui/session";

type CandidateProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [{ slug: "joshua-kevin" }, { slug: "raka-aditya" }];
}

export default function CandidateProfilePage({ params }: CandidateProfilePageProps) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<ActivitySkeleton />}>
        <CandidateProfileAccess params={params} />
      </Suspense>
    </>
  );
}

async function CandidateProfileAccess({ params }: CandidateProfilePageProps) {
  const { slug } = await params;

  if (slug !== "joshua-kevin" && slug !== "raka-aditya") {
    notFound();
  }

  await requireSessionUser();

  return slug === "raka-aditya" ? <ProfilPembuat /> : <ProfilPelamar />;
}
