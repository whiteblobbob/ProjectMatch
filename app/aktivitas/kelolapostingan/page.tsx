import { Suspense } from "react";
import LoginRequired, { LoginRequiredFallback } from "../../components/auth/login-required";
import Navbar from "../../components/navigation-bar/guestnavbar";
import KelolaPostingan from "../../components/page/kelolapostingan";
import { getSessionUser } from "../../lib/ui/session";

export default function KelolaPostinganPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoginRequiredFallback />}>
        <KelolaPostinganAccess />
      </Suspense>
    </>
  );
}

async function KelolaPostinganAccess() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <LoginRequired
        area="Aktivitas"
        returnTo="/aktivitas"
        description="Masuk untuk mengelola postingan proyek dan memantau calon anggota timmu."
      />
    );
  }

  return <KelolaPostingan />;
}
