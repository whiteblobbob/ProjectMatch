
export default function Register() {
    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-8">
            <section className="w-full max-w-md">
                {/* Brand */}
                <a
                    href="../"
                    className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-brand-primary"
                >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-brand-primary text-sm text-white">
                        PM
                    </span>
                    ProjectMatch
                </a>

                {/* Register form */}
                <div className="rounded-2xl border border-border-default bg-white p-5 sm:p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-text-heading">
                            Buat akun baru
                        </h1>
                        <p className="mt-2 text-sm leading-5 text-text-subheading">
                            Bergabung dan temukan orang yang cocok untuk
                            membangun proyek bersama.
                        </p>
                    </div>

                    <form
                        action="/register"
                        method="POST"
                        className="flex flex-col gap-5"
                    >
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="nama"
                                className="text-sm font-semibold text-text-heading"
                            >
                                Nama lengkap
                            </label>
                            <input
                                id="nama"
                                name="nama"
                                type="text"
                                autoComplete="name"
                                placeholder="Masukkan nama lengkap"
                                required
                                className="min-h-12 w-full rounded-lg border border-border-input bg-white px-3 py-2 text-sm text-text-heading placeholder:text-text-subheading focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-semibold text-text-heading"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="nama@email.com"
                                required
                                className="min-h-12 w-full rounded-lg border border-border-input bg-white px-3 py-2 text-sm text-text-heading placeholder:text-text-subheading focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-semibold text-text-heading"
                            >
                                Kata sandi
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Buat kata sandi"
                                minLength={8}
                                required
                                className="min-h-12 w-full rounded-lg border border-border-input bg-white px-3 py-2 text-sm text-text-heading placeholder:text-text-subheading focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                            />
                            <p className="text-xs text-text-subheading">
                                Minimal 8 karakter.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                        >
                            Buat akun
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-text-subheading">
                        Sudah punya akun?{" "}
                        <a
                            href="/login"
                            className="font-semibold text-brand-primary hover:text-brand-secondary"
                        >
                            Masuk
                        </a>
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-text-subheading">
                    Mulai perjalanan proyekmu bersama ProjectMatch.
                </p>
            </section>
        </main>
    );
}
