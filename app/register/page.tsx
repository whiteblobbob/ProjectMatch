import Navbar from "../components/navigation-bar/guestnavbar";
import RegisterForm from "../components/auth/register-form";
import { Suspense } from "react";
import ProjectMatchLogo from "../components/brand/projectmatch-logo";
import { CheckIcon } from "../components/ui/icons";

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto grid min-w-0 w-full max-w-[1180px] grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10">
          <aside className="min-w-0 rounded-2xl bg-brand-primary p-6 text-white shadow-sm sm:p-8 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">Khusus pelajar</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Mulai proyek bersama tim yang tepat.</h1>
            <p className="mt-4 text-sm leading-7 text-blue-50">ProjectMatch mempertemukan pelajar SMP hingga mahasiswa dari berbagai jurusan untuk belajar, berkarya, dan membangun portofolio bersama.</p>
            <ul className="mt-7 space-y-4 text-sm text-blue-50">
              {["Temukan proyek lintas bidang", "Bangun tim berdasarkan peran", "Tunjukkan kontribusi dan pengalaman"].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/15" aria-hidden="true">
                    <CheckIcon className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl border border-white/20 bg-white/10 p-4 text-xs leading-5 text-blue-50">
              Data verifikasi pada alur ini belum dikirim atau disimpan. Integrasi backend akan dilakukan pada tahap terpisah.
            </div>
          </aside>

          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
            <ProjectMatchLogo
              variant="stacked"
              className="mx-auto mb-7 h-auto w-[142px] sm:w-[156px]"
              decorative
            />
            <p className="text-sm font-semibold text-brand-primary">Buat akun ProjectMatch</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Daftar sebagai pelajar</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Lengkapi setiap langkah. Kamu dapat kembali dan mengubah jawaban sebelum membuat akun.</p>
            <Suspense>
              <RegisterForm />
            </Suspense>
          </section>
        </div>
      </main>
    </>
  );
}
