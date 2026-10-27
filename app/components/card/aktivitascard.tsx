import {
    ArrowUpRightIcon,
    CalendarIcon,
    LaptopIcon,
    UserAddIcon,
    UsersIcon,
} from "../ui/icons";

export default function aktivitascard(){
    return(
        <>
    <div className="container flex justify-center mt-2 pb-2">
            <div className="h-90.5 w-89.5 pt-4 pl-6 bg-border-main border border-border-default md:w-300 flex" id="card-content-container">
                <div className="w-[97%] flex flex-col" id="title-content">
                    <div className="flex flex-col justify-between" id="title">
                    <div className="bg-warning-background w-30 rounded-[20px]">
                    <h1 className="text-center font-bold text-[12px] text-text-warning p-0.75" id="Status">Mencari Anggota</h1>
                    </div>
                    <h1 className="text-[14px] text-text-subheading pt-5"><span>EcoTrack</span> · <span>UINIC 2026</span></h1>
                <div className="flex flex-row justify-between" id="title">
                <h1 className="text-[20px] text-text-heading font-bold pt-1.5" id="subtitle">Mencari UI/UX Designer</h1>
                <ArrowUpRightIcon className="mt-3 size-5 transition-transform duration-300 hover:rotate-45" />
                </div>
                </div>
                
                <div className="flex flex-row mt-2" id="title">
                    <LaptopIcon className="mr-1 mt-0.5 size-3 shrink-0" />
                <h3 className="text-[12px] font-normal text-text-subheading mr-4">
                    Remote</h3>

                    <CalendarIcon className="mr-1 mt-0.5 size-3 shrink-0" />
                <h3 className="text-[12px] font-normal text-text-subheading">6 jam/minggu</h3>
                </div>
                <div className="flex flex-row mt-2 justify-between" id="title">
                    <div className="flex flex-row" id="title">
                    <CalendarIcon className="mr-1 mt-0.5 size-3 shrink-0" />
                <h3 className="text-[12px] font-normal text-text-warning">Tenggat 30 Okt</h3>
                </div>

                <div className="flex flex-row" id="title">
                <UsersIcon className="mr-1 mt-2 size-3 shrink-0" />
                <h3 className="text-[12px] font-semibold text-text-subheading pt-1.5">Tim 2/3</h3>
                </div>

                </div>
                <hr className="border-t border-border-default mb-2" />
                <div className="flex flex-row justify-between" id="title">
                <p className="text-[13px] font-normal text-text-subheading">Universitas Indonesia</p>
                <div className="bg-warning-background w-30 rounded-[20px]">
                    <h1 className="text-center font-bold text-[12px] text-text-warning p-0.75"><span>1</span> Posisi Terbuka</h1>
                 </div>
                </div>
                <hr className="border-t border-border-default mt-3"/>
                <div className="flex flex-col pt-3" id="title">
                <p className="text-[14px] font-normal text-text-subheading">Posisi UI/UX Designer</p>
                    
                <div className="flex flex-row mt-2" id="title">
                <UserAddIcon className="mr-1 mt-2 size-3 shrink-0" />
                <h1 className="font-bold text-[14px] text-text-warning p-0.75"><span>1</span> Pelamar Baru</h1>
                </div>
                </div>
                <div className="container flex justify-center mt-3">
                <a href="../../aktivitas/kelolapostingan" className="w-[80vw] h-12 text-center content-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded">
                    Kelola Postingan
                </a>
             </div>
            </div>
        </div>
        </div>
        </>
        )}
