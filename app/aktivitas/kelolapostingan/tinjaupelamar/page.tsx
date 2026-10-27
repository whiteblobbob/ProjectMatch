import { Suspense } from "react";
import LoginRequired, { LoginRequiredFallback } from "../../../components/auth/login-required";
import Navbar from "../../../components/navigation-bar/guestnavbar";
import TinjauPelamar from "../../../components/page/tinjaupelamar";
import { getAuthUser } from "../../../lib/supabase/getAuthUser";

export default function TinjauPelamarPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoginRequiredFallback />}>
        <TinjauPelamarAccess />
      </Suspense>
    </>
  );
}

async function TinjauPelamarAccess() {
  const user = await getAuthUser();

  if (!user) {
    return (
      <LoginRequired
        area="Aktivitas"
        returnTo="/aktivitas"
        description="Masuk untuk meninjau pelamar dan mengelola permintaan bergabung ke proyekmu."
      />
    );
  }

  return <TinjauPelamar />;
}
