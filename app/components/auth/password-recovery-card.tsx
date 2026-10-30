import type { ReactNode } from "react";
import Navbar from "../navigation-bar/guestnavbar";
import ProjectMatchLogo from "../brand/projectmatch-logo";

export default function PasswordRecoveryCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-9">
          <ProjectMatchLogo variant="stacked" className="mx-auto mb-7 h-auto w-[150px] sm:w-[168px]" decorative />
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          {children}
        </section>
      </main>
    </>
  );
}
