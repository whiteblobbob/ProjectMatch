import { Suspense } from "react";
import LoginRequired, { LoginRequiredFallback } from "../../../components/auth/login-required";
import Navbar from "../../../components/navigation-bar/guestnavbar";
import TinjauPelamar from "../../../components/page/tinjaupelamar";
import { getSessionUser } from "../../../lib/ui/session";

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
  const user = await getSessionUser();

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
