import { Suspense } from "react";
import Navbar from "../../components/navigation-bar/guestnavbar";
import CreateProjectForm from "../../components/project/create-project-form";
import VerificationGate from "../../components/project/verification-gate";
import { fetchCategories, fetchRoles, type CatalogOption } from "../../actions/catalog";
import { fetchProfile } from "../../actions/profile";
import { requireSessionUser } from "../../lib/ui/session";

export default function CreateProjectPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<CreateProjectSkeleton />}>
        <CreateProjectAccess />
      </Suspense>
    </>
  );
}

async function CreateProjectAccess() {
  await requireSessionUser();

  const [categories, roles, profile] = await Promise.all([
    fetchCategories(),
    fetchRoles(),
    fetchProfile(),
  ]);

  const isOk = (result: { success: boolean }): result is { success: true; data: CatalogOption[] } =>
    result.success && "data" in result;

  if (!isOk(categories) || !isOk(roles) || !profile.success || !("data" in profile)) {
    console.error("Failed to load project form options");
    return (
      <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-10 sm:px-6">
        <div role="alert" className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-white p-6">
          <h1 className="text-lg font-bold text-slate-950">Formulir belum dapat dimuat</h1>
          <p className="mt-2 text-sm text-slate-600">Coba muat ulang halaman setelah beberapa saat.</p>
        </div>
      </main>
    );
  }

  if (!profile.data.verified) {
    return <VerificationGate />;
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50">
      <div className="mx-auto w-full max-w-[900px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-8">
          <p className="text-sm font-semibold text-brand-primary">Posting proyek baru</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Cari anggota tim</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Ceritakan proyekmu dan tentukan posisi yang dibutuhkan agar kandidat yang tepat dapat menemukannya.
          </p>
        </header>
        <CreateProjectForm categories={categories.data} roles={roles.data} />
      </div>
    </main>
  );
}

function CreateProjectSkeleton() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-10" aria-label="Memuat formulir proyek">
      <div className="mx-auto max-w-[900px] animate-pulse">
        <div className="h-8 w-64 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-full max-w-lg rounded bg-slate-200" />
        <div className="mt-8 h-96 rounded-xl bg-white" />
      </div>
    </main>
  );
}
