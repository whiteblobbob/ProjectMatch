import { Suspense } from "react";
import { LoginRequiredFallback } from "../../../components/auth/login-required";
import Navbar from "../../../components/navigation-bar/guestnavbar";
import TinjauPelamar from "../../../components/page/tinjaupelamar";

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
  return <TinjauPelamar />;
}
