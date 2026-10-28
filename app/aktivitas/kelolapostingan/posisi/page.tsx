import { Suspense } from "react";

import LoginRequired, { LoginRequiredFallback } from "../../../components/auth/login-required";
import Navbar from "../../../components/navigation-bar/guestnavbar";
import UbahPosisi from "../../../components/page/ubahposisi";
import { getSessionUser } from "../../../lib/ui/session";

export default function UbahPosisiPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoginRequiredFallback />}>
        <UbahPosisiAccess />
      </Suspense>
    </>
  );
}

async function UbahPosisiAccess() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <LoginRequired
        area="Aktivitas"
        returnTo="/aktivitas/kelolapostingan/posisi"
        description="Masuk untuk mengubah kebutuhan posisi di proyekmu."
      />
    );
  }

  return <UbahPosisi />;
}
