import Navbar from "../components/navigation-bar/guestnavbar";
import LoginForm from "../components/auth/login-form";
import ProjectMatchLogo from "../components/brand/projectmatch-logo";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-9">
          <ProjectMatchLogo
            variant="stacked"
            className="mx-auto mb-7 h-auto w-[150px] sm:w-[168px]"
            decorative
          />
          <p className="text-sm font-semibold text-brand-primary">Selamat datang kembali</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Masuk ke ProjectMatch</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Lanjutkan mengelola aktivitas, lamaran, dan profil kolaborasimu.
          </p>
          <LoginForm />
        </section>
      </main>
    </>
  );
}
