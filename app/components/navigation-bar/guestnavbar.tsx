"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import LogoutConfirmationDialog from "@/app/components/auth/logout-confirmation-dialog";
import ProjectMatchLogo from "@/app/components/brand/projectmatch-logo";
import { MenuIcon, XIcon } from "@/app/components/ui/icons";
import { createClient } from "@/app/lib/supabase/client";

const navigation = [
  { href: "/", label: "Jelajah" },
  { href: "/activity", label: "Aktivitas" },
  { href: "/profil", label: "Profil" },
];

const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

type AuthStatus = "loading" | "guest" | "authenticated";

export default function GuestNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const drawerId = useId();
  const pathname = usePathname();
  const router = useRouter();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const logoutTriggerRef = useRef<HTMLButtonElement | null>(null);
  const signOutInFlightRef = useRef(false);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    const syncSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const session = await response.json() as { authenticated: boolean; email: string | null };

        if (!active) return;
        setAuthStatus(session.authenticated ? "authenticated" : "guest");
      } catch {
        if (active) setAuthStatus("guest");
      }
    };

    void syncSession();
    window.addEventListener("projectmatch-auth-change", syncSession);

    if (hasSupabaseConfig) {
      const supabase = createClient();
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!active) return;
        setAuthStatus(session?.user ? "authenticated" : "guest");
      });
      unsubscribe = () => listener.subscription.unsubscribe();
    }

    return () => {
      active = false;
      window.removeEventListener("projectmatch-auth-change", syncSession);
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!isOpen || isLogoutOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusableElements = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) return;
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isLogoutOpen, isOpen]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeDrawer = (restoreFocus = true) => {
    setIsOpen(false);
    if (restoreFocus) requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  const requestSignOut = (trigger: HTMLButtonElement) => {
    logoutTriggerRef.current = trigger;
    setLogoutError(null);
    setIsLogoutOpen(true);
  };

  const closeLogoutDialog = useCallback(() => {
    if (signOutInFlightRef.current) return;

    setIsLogoutOpen(false);
    setLogoutError(null);
    requestAnimationFrame(() => logoutTriggerRef.current?.focus());
  }, []);

  const signOut = async () => {
    if (signOutInFlightRef.current) return;

    signOutInFlightRef.current = true;
    setIsSigningOut(true);
    setLogoutError(null);
    const response = await fetch("/api/auth/session", { method: "POST" }).catch(() => null);

    if (!response?.ok) {
      signOutInFlightRef.current = false;
      setIsSigningOut(false);
      setLogoutError("Gagal keluar. Silakan coba lagi.");
      return;
    }

    signOutInFlightRef.current = false;
    setAuthStatus("guest");
    setIsLogoutOpen(false);
    setIsSigningOut(false);
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="ProjectMatch — ke halaman Jelajah"
          className="flex shrink-0 items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          <ProjectMatchLogo variant="horizontal" priority className="h-auto w-[150px] sm:w-[168px]" decorative />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <nav aria-label="Navigasi utama">
            <ul className="flex items-center gap-1 text-sm font-medium text-slate-600">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`rounded-lg px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ${
                      isActive(item.href)
                        ? "bg-brand-soft font-semibold text-brand-primary"
                        : "hover:bg-slate-50 hover:text-brand-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/project/create"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              Cari anggota tim
            </Link>
            <AccountActions
              authStatus={authStatus}
              onRequestSignOut={requestSignOut}
            />
          </div>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-lg border border-slate-300 text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 lg:hidden"
          aria-label="Buka navigasi"
          aria-expanded={isOpen}
          aria-controls={drawerId}
          onClick={() => setIsOpen(true)}
        >
          <MenuIcon className="size-5" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby={`${drawerId}-title`}>
          <button
            type="button"
            aria-label="Tutup navigasi"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => closeDrawer()}
          />
          <div ref={drawerRef} id={drawerId} className="absolute right-0 top-0 flex h-dvh w-[min(86vw,360px)] flex-col bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span id={`${drawerId}-title`}>
                <ProjectMatchLogo variant="horizontal" className="h-auto w-[156px]" decorative />
                <span className="sr-only">Navigasi ProjectMatch</span>
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                aria-label="Tutup navigasi"
                onClick={() => closeDrawer()}
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <nav aria-label="Navigasi seluler" className="mt-7">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      onClick={() => closeDrawer(false)}
                      className={`flex min-h-12 items-center rounded-lg px-3 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                        isActive(item.href)
                          ? "bg-brand-soft font-semibold text-brand-primary"
                          : "text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto space-y-3 border-t border-slate-200 pt-5">
              <Link
                href="/project/create"
                onClick={() => closeDrawer(false)}
                className="flex min-h-12 items-center justify-center rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                Cari anggota tim
              </Link>
              <MobileAccountActions
                authStatus={authStatus}
                onNavigate={() => closeDrawer(false)}
                onRequestSignOut={requestSignOut}
              />
            </div>
          </div>
        </div>
      )}

      <LogoutConfirmationDialog
        open={isLogoutOpen}
        isPending={isSigningOut}
        error={logoutError}
        onCancel={closeLogoutDialog}
        onConfirm={() => void signOut()}
      />
    </header>
  );
}

type AccountProps = {
  authStatus: AuthStatus;
  onRequestSignOut: (trigger: HTMLButtonElement) => void;
};

function AccountActions({ authStatus, onRequestSignOut }: AccountProps) {
  if (authStatus === "loading") {
    return <span className="h-11 w-20 animate-pulse rounded-lg bg-slate-100" aria-label="Memuat akun" />;
  }

  if (authStatus === "guest") {
    return (
      <Link
        href="/login"
        className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        Masuk
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => onRequestSignOut(event.currentTarget)}
      className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      Keluar
    </button>
  );
}

function MobileAccountActions({
  authStatus,
  onNavigate,
  onRequestSignOut,
}: AccountProps & { onNavigate: () => void }) {
  if (authStatus === "loading") {
    return <span className="block h-12 animate-pulse rounded-lg bg-slate-100" aria-label="Memuat akun" />;
  }

  if (authStatus === "guest") {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className="flex min-h-12 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-brand-primary hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        Masuk
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => onRequestSignOut(event.currentTarget)}
      className="flex min-h-12 w-full items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      Keluar
    </button>
  );
}
