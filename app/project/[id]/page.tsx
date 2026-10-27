import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "../../components/navigation-bar/guestnavbar";
import Botnav from "../../components/navigation-bar/bottomnav";
import { fetchProject } from "@/app/actions/project";

type Props = {
    params: Promise<{ id: string }>;
};

const projectStatusLabels = {
    OPEN_RECRUITMENT: "Mencari Anggota",
    IN_PROGRESS: "Sedang Berjalan",
    COMPLETED: "Selesai",
} as const;

export default async function ProjectDetail({ params }: Props) {
    const { id } = await params;
    const result = await fetchProject(id);

    if (!result.success || !("data" in result)) {
        notFound();
    }

    const project = result.data;
    const teamSize = project.projectMembers.length;
    const totalSlots = project.projectRoles.reduce(
        (total, projectRole) => total + projectRole.slotsAvailable,
        0,
    );
    const formattedDeadline = project.deadline
        ? project.deadline.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
          })
        : "Belum ditentukan";
    const criteria = project.projectStatusCriteria
        .map((criterion) => criterion.status.name)
        .join(", ");
    const isOpenForApplications = project.status === "OPEN_RECRUITMENT";

    return (
        <>
            <Navbar />
            <div className="min-h-screen">
                <div className="container flex justify-center mt-10">
                    <div className="h-45.5 w-89.5 pt-6 pl-6 bg-border-main border rounded-2xl border-border-default md:w-300 flex" id="card-content-container">
                        <div className="w-[97%] flex flex-col" id="title-content">
                            <div className="flex flex-row justify-between" id="title">
                                <h1 className="text-[20px]">{project.title}</h1>
                                <div className="bg-warning-background w-auto rounded-lg">
                                    <h1 className="text-center font-bold text-[12px] text-text-warning p-1">
                                        {projectStatusLabels[project.status]}
                                    </h1>
                                </div>
                            </div>
                            <h3 className="text-[14px] font-normal text-text-subheading pt-1.5" id="subtitle">
                                {project.category.name}
                            </h3>
                            <div className="flex flex-row" id="title">
                                <Image
                                    className="h-9 w-auto mt-5 mr-4"
                                    src="/img/inisial-pemilik.png"
                                    alt="Inisial pemilik proyek"
                                    width={80}
                                    height={80}
                                    priority
                                />
                                <div className="flex flex-col" id="title">
                                    <h1 className="pt-4.5 text-[12px]">
                                        {project.owner.name ?? "Pemilik proyek"}
                                    </h1>
                                    <h3 className="text-[12px] font-normal text-text-subheading" id="subtitle">
                                        <span>{project.owner.instance ?? "Instansi tidak tersedia"}</span> ·{" "}
                                        <span>Pemilik tim</span>
                                    </h3>
                                </div>
                            </div>
                            <div className="flex flex-row mt-2" id="title">
                                <Image
                                    className="h-3 w-auto flex mt-0.5 mr-1"
                                    src="/img/person.png"
                                    alt="Jumlah anggota tim"
                                    width={80}
                                    height={80}
                                    priority
                                />
                                <h3 className="text-[12px] font-normal text-text-subheading mr-4">
                                    Tim {teamSize}/{teamSize + totalSlots}
                                </h3>

                                <Image
                                    className="h-3 w-auto flex mt-0.5 mr-1"
                                    src="/img/calendar-days.png"
                                    alt="Tenggat proyek"
                                    width={80}
                                    height={80}
                                    priority
                                />
                                <h3 className="text-[12px] font-semibold text-text-warning">
                                    Tenggat {formattedDeadline}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-border-default mt-8.5" />

                <div className="container flex justify-center mt-10">
                    <div className="w-89.5 pt-6 pl-6 pb-6 bg-border-main border rounded-2xl border-border-default md:w-300 flex">
                        <div className="w-[97%] flex flex-col">
                            <h1 className="text-[14px] font-bold">Tentang proyek</h1>
                            <p className="pt-2 text-[14px]">{project.description}</p>
                            <div className="flex flex-row flex-wrap mt-3 gap-x-4 gap-y-2">
                                <span className="text-[12px] text-text-subheading">
                                    Mode: {project.onSite ? "On-site" : "Remote"}
                                </span>
                                <span className="text-[12px] text-text-subheading">
                                    ±{project.workHoursPerWeek} jam/minggu
                                </span>
                                {criteria && (
                                    <span className="text-[12px] text-text-subheading">
                                        Kriteria: {criteria}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container flex flex-col items-center gap-6 mt-10">
                    {project.projectRoles.map((projectRole) => (
                        <div
                            className="w-89.5 pt-6 pl-6 pb-6 bg-border-main border rounded-2xl border-border-default md:w-300 flex"
                            key={projectRole.roleId}
                        >
                            <div className="w-[97%] flex flex-col">
                                <h1 className="text-[12px] text-text-warning">
                                    {projectRole.slotsAvailable} posisi terbuka
                                </h1>
                                <h2 className="text-[20px] font-bold pt-2">
                                    {projectRole.role.name}
                                </h2>
                                <div className="flex flex-row flex-wrap mt-3 gap-x-4 gap-y-2">
                                    <span className="text-[12px] text-text-subheading">
                                        {project.onSite ? "On-site" : "Remote"}
                                    </span>
                                    <span className="text-[12px] text-text-subheading">
                                        ±{project.workHoursPerWeek} jam/minggu
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="container flex justify-center mt-10 pb-24">
                    {isOpenForApplications ? (
                        <Link
                            href={`/project/${id}/apply`}
                            className="w-[80vw] h-12 text-center content-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded"
                        >
                            Ajukan Bergabung
                        </Link>
                    ) : (
                        <span className="w-[80vw] h-12 text-center content-center bg-border-default text-text-subheading font-bold py-2 px-4 rounded">
                            Pendaftaran ditutup
                        </span>
                    )}
                </div>
            </div>
            <Botnav />
        </>
    );
}
