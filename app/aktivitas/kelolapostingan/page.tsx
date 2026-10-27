import { Suspense } from "react";
import { LoginRequiredFallback } from "../../components/auth/login-required";
import Navbar from "../../components/navigation-bar/guestnavbar";
import KelolaPostingan from "../../components/page/kelolapostingan";

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
  return <KelolaPostingan />;
}
