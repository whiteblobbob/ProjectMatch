export default function projectcard(){
    return(
        <>
        <a href="/projectdetail">
        <div className="container flex justify-center mt-10">
            <div className="h-56.5 w-89.5 pt-6 pl-6 bg-border-main border rounded-2xl border-border-default hover:bg-brand-soft transition duration-300 md:w-300 flex" id="card-content-container">
                <div className="w-[90%] flex flex-col" id="title-content">
                    <div className="flex flex-row justify-between gap-30" id="title">
                        <h1 className="text-[20px]">EcoTrack</h1>
                    <div className="bg-background w-23">
                    <h1 className="text-center text-[14px] text-text-subheading rounded-sm p-1">Kompetisi</h1>
                    </div>
                    
                </div>
                <h3 className="text-[12px] font-normal text-text-subheading pt-1.5" id="subtitle">UINIC 2026</h3>
                <h1 className="pt-1.5">Mencari UI/UX Designer</h1>
                <h3 className="text-[12px] font-normal text-text-subheading pt-1.5" id="subtitle"><span className="mr-2">Lingkungan</span> · <span className="ml-2">Remote</span></h3>
                <div className="flex flex-row justify-between" id="title">
                <h3 className="text-[12px] font-normal text-text-subheading pt-1.5">±6 jam/minggu</h3>
                <h3 className="text-[12px] font-semibold text-text-subheading pt-1.5">Tim 2/3</h3>
                </div>
                <h3 className="text-[12px] font-normal text-text-warning pt-1.5">Tenggat 30 Okt</h3>
                <hr className="border-border-default mt-1.5" />
                <h3 className="text-[12px] font-normal text-text-subheading pt-1.5">Pemilik: Raka Aditya</h3>
            </div>
        </div>
        </div>
        </a>
        </>
    )

}