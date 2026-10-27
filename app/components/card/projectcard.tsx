type Props = {
    id: string;
    title: string;
    category: string;
    roles: string[];
    onSite: boolean;
    workHoursPerWeek: number;
    deadline: Date;
    slotsAvailable: number;
    teamSize: number;
    owner: string;
};

export default function ProjectCard({
    id,
    title,
    category,
    roles,
    onSite,
    workHoursPerWeek,
    deadline,
    slotsAvailable,
    teamSize,
    owner,
}: Props){
    const formattedDeadline = deadline.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
    });

    return(
        <>
        
        <div className="container flex justify-center mt-10">
            <a href={`/project/${id}`}>
            <div className="h-56.5 w-89.5 pt-6 pl-6 bg-border-main border rounded-2xl border-border-default hover:bg-brand-soft transition duration-300 md:w-300 flex" id="card-content-container">
                <div className="w-[97%] flex flex-col" id="title-content">
                    <div className="flex flex-row justify-between gap-30" id="title">
                        <h1 className="text-[20px]">{title}</h1>
                    <div className="bg-background w-23">
                    <h1 className="text-center text-[14px] text-text-subheading rounded-sm p-1">{category}</h1>
                    </div>
                    
                </div>
                <h1 className="pt-1.5">Mencari {roles.join(", ")}</h1>
                <h3 className="text-[12px] font-normal text-text-subheading pt-1.5" id="subtitle">
                    <span className="mr-2">{category}</span> · <span className="ml-2">{onSite ? "On-site" : "Remote"}</span>
                </h3>
                <div className="flex flex-row justify-between" id="title">
                <h3 className="text-[12px] font-normal text-text-subheading pt-1.5">±{workHoursPerWeek} jam/minggu</h3>
                <h3 className="text-[12px] font-semibold text-text-subheading pt-1.5">Tim {teamSize}/{teamSize + slotsAvailable}</h3>
                </div>
                <h3 className="text-[12px] font-normal text-text-warning pt-1.5">Tenggat {formattedDeadline}</h3>
                <hr className="border-border-default mt-1.5" />
                <h3 className="text-[12px] font-normal text-text-subheading pt-1.5">Pemilik: {owner}</h3>
            </div>
        </div>
        </a>
        </div>       
        </>
    )

}