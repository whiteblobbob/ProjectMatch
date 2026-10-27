import Image from "next/image"
import { queryProjects } from "@/app/actions/project";
import ProjectCard from "../card/projectcard";
import { notFound } from "next/navigation";

export default async function GuestPage(){
    const result = await queryProjects({ status: "OPEN_RECRUITMENT" });

    if (!(result.success && "data" in result)) {
        notFound();
    }

    const projects = result.data.projects;

    return(
        <>
        <div className="h-auto min-h-screen flex-col" id="wrapper">
        <div className="h-70 w-[90%] flex flex-col ml-4" id="header">
        <h1 className="font-bold text-[28px] text-text-heading md:text-[40px]">Temukan tim yang butuh <span className="block">kamu.</span></h1>
        <h4 className="text-text-subheading text-[14px]">Bangun proyek bersama teman lintas kampus.</h4>
       <div className="relative w-full">
        <Image
            className="absolute left-3 top-1/2 -translate-y-1/2"
            src="/img/search.png"
            alt="Search"
            width={20}
            height={20}
        />

        <input
            className="block w-full rounded-md border border-border-input py-2 pr-3 pl-9 text-text-heading shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline focus:outline-sky-500 sm:text-sm"
            placeholder="Cari proyek, peran, atau topik"
            type="text"
            name="search"
        />
        </div>
        <div className="flex flex-row justify-around mt-2.5 gap-3 text-text-subheading" id="filter">
        <select className="w-35 h-10 rounded-4xl border border-border-default text-center md:w-200" name="" id="">
            <option value="">Jenis Proyek</option>
            <option value="">wasd</option>
            <option value="">wasd</option>
        </select>

        <select className="w-25 h-10 rounded-4xl border border-border-default text-center md:w-200" name="" id="">
            <option value="">Topik</option>
            <option value="">wasd</option>
            <option value="">wasd</option>
        </select>

        <select className="w-35 h-10 rounded-4xl border border-border-default text-center md:w-200" name="" id="">
            <option value="">Lokasi & Mode</option>
            <option value="">wasd</option>
            <option value="">wasd</option>
        </select>
        </div>
        </div>
        <div className="font-semibold" id="Base">
        <div className="flex flex-row justify-around w-90%" id="projectheader">
        <div>
        <h1 className="mr-30">Posisi terbuka</h1>
        </div>
        <div>
        <h1 className="text-center content-center text-text-subheading">Terbaru</h1>
        </div>
        </div>
        {  projects && projects.map((project) => (
            <ProjectCard
                id={project.id  }
                title={project.title}
                category={project.category.name}
                roles={project.projectRoles.map((role: any) => role.role.name)}
                onSite={project.onSite}
                workHoursPerWeek={project.workHoursPerWeek}
                deadline={new Date(project.deadline)}
                slotsAvailable={project.totalAvailableSlot}
                teamSize={project._count.projectMembers}
                owner={project.owner.name}
                key={project.id}
            />
        )) }
        </div>
        </div>
        </>
    )
}