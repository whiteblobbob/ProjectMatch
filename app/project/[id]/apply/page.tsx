"use client";
import Navbar from "../../../components/navigation-bar/guestnavbar";
import { fetchProject, sendApplication } from "@/app/actions/project";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectApplicationPage({ params }: { params: Promise<{ id: string }> }) {
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            const { id } = await params;
            const result = await fetchProject(id);

            if (!result.success || !("data" in result)) {
                notFound();
            }

            setProject(result.data);
        };

        init();
    }, [params]);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const { id } = await params;
        const result = await sendApplication(id, {
            roleId: "role-id",
            message: data.message as string,
            portfolioLink: data.portfolioLink as string,
        });

        if (result.success) {
            // Handle successful application submission
            console.log("Application submitted successfully");
        } else {
            // Handle error in application submission
            console.error("Error submitting application:", result.error);
        }
    };

    if (!project) {
        return <div>Loading...</div>;
    }

    return(
        <>
        <Navbar />
        <div className="flex-col h-screen md:h-[110vh]" id="wrapper">
        <div className="container flex justify-center mt-10">
            <div className="h-25 w-90.5 pt-6 pl-6 bg-white border rounded-2xl border-border-default md:w-300 flex" id="card-content-container">
                <div className="w-[90%] flex flex-col gap-2" id="title-content">
                <h3 className="text-text-subheading"><span>{project.title}</span> / <span>{project.category.name}</span></h3>    
                <h1>UI/UX Designer</h1>  
                </div>
            </div>
        </div>
        <form onSubmit={handleSubmit} className="mx-auto mt-10 flex w-full max-w-5xl flex-col gap-5 px-4" id="card-content-container">
        <div className="w-[90%] flex flex-col gap-2" id="title-content">
            <label htmlFor="Nama" className="block text-[14px] font-bold text-text-heading">Nama</label>
            <input
            className="block w-full rounded-md bg-white border border-border-input py-2 pr-3 pl-2 text-text-heading shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline focus:outline-sky-500 sm:text-sm"
            placeholder="Masukkan nama anda"
            type="text"
            name="name"
        />
        </div>

        <div className="w-[90%] flex flex-col gap-2" id="title-content">
            <label htmlFor="Instansi" className="block text-[14px] font-bold text-text-heading">Instansi</label>
            <input
            className="block w-full rounded-md bg-white border border-border-input py-2 pr-3 pl-2 text-text-heading shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline focus:outline-sky-500 sm:text-sm"
            placeholder="Masukkan nama instansi anda"
            type="text"
            name="instance"
        />
        </div>

        <div className="w-[90%] flex flex-col gap-2" id="title-content">
            <label htmlFor="portofolio" className="block text-[14px] font-bold text-text-heading">Link Portofolio</label>
            <input
            className="block w-full rounded-md bg-white border border-border-input py-2 pr-3 pl-2 text-text-heading shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline focus:outline-sky-500 sm:text-sm"
            placeholder="Masukkan link portofolio anda"
            type="text"
            name="portfolioLink"
        />
        <p className="text-[12px] text-text-subheading">Bisa tautan GitHub, Figma, Behance, atau lainnya.</p>
        </div>

        <div className="w-[90%] flex flex-col gap-2" id="title-content">
            <label htmlFor="waktu" className="block text-[14px] font-bold text-text-heading">Komitmen waktu per minggu</label>
            <input
            className="block w-full rounded-md bg-white border border-border-input py-2 pr-3 pl-2 text-text-heading shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline focus:outline-sky-500 sm:text-sm"
            placeholder="Masukkan komitmen waktu per minggu"
            type="text"
            name="waktu"
        />
        </div>

        <div className="w-[90%] flex flex-col gap-2" id="title-content">
            <label htmlFor="Nama" className="block text-[14px] font-bold text-text-heading">Apa yang bisa kamu kerjakan?</label>
            <textarea name="tugas" id="tugas" className="block w-full rounded-md bg-white border border-border-input py-2 pr-3 pl-2 text-text-heading shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline focus:outline-sky-500 sm:text-sm"
            placeholder="Deskripsikan kemampuan anda, pengalaman, dan hal lain yang relevan dengan posisi ini.">
        </textarea>
        </div>

            <button
                type="submit"
                className="w-[58vw] h-12 mt-4 text-center content-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded"
            >
                    Ajukan Bergabung
            </button>

        </form>
        </div>
        </>
    )
}