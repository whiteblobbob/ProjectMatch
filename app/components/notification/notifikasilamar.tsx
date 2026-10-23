export default function notifikasilamar(){
    return(
        <>
    <div className="w-full px-4 mt-10 flex justify-center" id="request-notification">
    <div className="w-full max-w-300 h-24 p-6
        bg-warning-background border rounded-2xl
        border-border-default">
        <div className="flex flex-row justify-between">
        <div className="flex flex-col">
        <h1 className="text-sm">
        Tawaran dari <span id="company-name">PanganHub</span>
        </h1>
        <h3 className="text-[13px] text-text-subheading font-normal">
        Frontend Developer · sebagai pelamar
        </h3>
        </div>
        
        <a href="" className="text-[13px] font-bold text-brand-primary bg-background outline-1 outline-brand-primary p-2 pl-4 pr-4 rounded-lg hover:bg-brand-primary hover:text-white">
            Lihat
        </a>
        </div>
    </div>
    </div>
        </>
    )}