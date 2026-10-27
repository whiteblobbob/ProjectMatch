import { Suspense } from "react";

import LoginRequired, { LoginRequiredFallback } from "../../../components/auth/login-required";
import Navbar from "../../../components/navigation-bar/guestnavbar";
import KelolaAnggota from "../../../components/page/kelolaanggota";
import { getAuthUser } from "../../../lib/supabase/getAuthUser";

export default function KelolaAnggotaPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoginRequiredFallback />}>
        <KelolaAnggotaAccess />
      </Suspense>
    </>
  );
}

async function KelolaAnggotaAccess() {
  const user = await getAuthUser();

  if (!user) {
    return (
      <LoginRequired
        area="Aktivitas"
        returnTo="/aktivitas/kelolapostingan/anggota"
        description="Masuk untuk melihat anggota dan pembagian kontribusi di proyekmu."
      />
    );
  }

  return <KelolaAnggota />;
}
