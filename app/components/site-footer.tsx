import Link from "next/link";
import ProjectMatchLogo from "@/app/components/brand/projectmatch-logo";

const platformLinks = [
  { href: "/", label: "Jelajah proyek" },
  { href: "/aktivitas", label: "Aktivitas" },
  { href: "/profil", label: "Profil" },
];

const accountLinks = [
  { href: "/login", label: "Masuk" },
  { href: "/register", label: "Daftar" },
];

const copyrightYear = 2026;

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer ProjectMatch</h2>

      <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-2xl bg-brand-soft px-5 py-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-7 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">Mulai berkolaborasi</p>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">Punya ide dan sedang mencari rekan satu tim?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Buka posisi untuk pelajar atau mahasiswa dengan keahlian yang proyekmu perlukan.</p>
          </div>
          <Link
            href="/proyek/baru"
            className="mt-5 inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 sm:mt-0"
          >
            Cari anggota tim
          </Link>
        </div>

        <div className="grid gap-9 py-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(160px,0.5fr)_minmax(160px,0.5fr)] lg:gap-12">
          <div className="max-w-md sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="ProjectMatch — ke halaman Jelajah"
              className="inline-flex rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              <ProjectMatchLogo variant="horizontal" className="h-auto w-[168px]" decorative />
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Tempat pelajar dan mahasiswa menemukan rekan untuk belajar, mengikuti kompetisi, dan membangun proyek bersama.
            </p>
          </div>

          <nav aria-label="Navigasi footer">
            <h3 className="text-sm font-bold text-slate-950">Platform</h3>
            <ul className="mt-4 space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm text-slate-600 transition-colors hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Navigasi akun">
            <h3 className="text-sm font-bold text-slate-950">Akun</h3>
            <ul className="mt-4 space-y-3">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm text-slate-600 transition-colors hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {copyrightYear} ProjectMatch. Platform kolaborasi untuk pelajar dan mahasiswa.</p>
          <p>Belajar bersama · Berkarya bersama</p>
        </div>
      </div>
    </footer>
  );
}
