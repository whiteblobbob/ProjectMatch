import { notFound } from "next/navigation";
import { Suspense } from "react";

import LoginRequired, { LoginRequiredFallback } from "../../components/auth/login-required";
import Navbar from "../../components/navigation-bar/guestnavbar";
import ProfilPelamar from "../../components/page/profilpelamar";
import ProfilPembuat from "../../components/page/profilpembuat";
import { getAuthUser } from "../../lib/supabase/getAuthUser";

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
      <Suspense fallback={<LoginRequiredFallback />}>
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

  const user = await getAuthUser();

  if (!user) {
    return (
      <LoginRequired
        area="Profil"
        returnTo={`/profil/${slug}`}
        description="Masuk untuk melihat profil anggota ProjectMatch."
      />
    );
  }

  return slug === "raka-aditya" ? <ProfilPembuat /> : <ProfilPelamar />;
}
