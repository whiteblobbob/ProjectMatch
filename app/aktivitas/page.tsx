import Navbar from "../components/navigation-bar/guestnavbar";
import Botnav from "../components/navigation-bar/bottomnav";
import Aktivitascard from "../components/card/aktivitascard";
import Notifikasirequest from "../components/notification/notifikasirequest";
import Notifikasilamar from "../components/notification/notifikasilamar";

export default function aktivitas() {
    return (
        <>
            <Navbar />

            <main className="w-full h-auto min-w-0 px-4 md:px-8 mt-5">
                <header className="flex flex-col">
                    <h1 className="text-2xl font-bold text-text-heading">
                        Aktivitas
                    </h1>
                    <h3 className="text-[14px] font-normal text-text-subheading">
                        Pantau lamaran dan proyekmu
                    </h3>
                </header>

                <section className="w-full min-w-0 mt-8">
                    <div className="flex items-center mb-4">
                        <h1 className="text-[16px] font-bold text-text-heading">
                            Postingan Saya
                        </h1>
                        <h1 className="text-[16px] bg-accent-opportunity font-normal text-text-subheading rounded-lg ml-3 p-2 pl-4 pr-4">
                            <span className="text-text-heading" id="notificationAmount">2</span>
                        </h1>
                    </div>

                    <Notifikasirequest />
                    <Notifikasilamar />
                </section>

                <section className="w-full min-w-0 mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-[16px] font-bold text-text-heading">
                            Postingan Saya
                        </h1>
                        <a
                            href=""
                            className="text-[13px] font-bold text-brand-primary hover:text-brand-secondary"
                        >
                            Lihat Semua
                        </a>
                    </div>

                    <Aktivitascard />
                </section>
            </main>

            <Botnav />
        </>
    );
}