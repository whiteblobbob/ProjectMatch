import Image from "next/image"

export default function projectdetail(){
    return(
        <>
        <div className="container flex justify-center mt-10">
            <div className="h-45.5 w-89.5 pt-6 pl-6 bg-border-main border rounded-2xl border-border-default md:w-300 flex" id="card-content-container">
                <div className="w-[97%] flex flex-col" id="title-content">
                    <div className="flex flex-row justify-between" id="title">
                        <h1 className="text-[20px]">EcoTrack</h1>
                    <div className="bg-warning-background w-auto rounded-lg">
                    <h1 className="text-center font-bold text-[12px] text-text-warning p-1">Mencari Anggota</h1>
                    </div>
                </div>
                <h3 className="text-[14px] font-normal text-text-subheading pt-1.5" id="subtitle">UINIC 2026</h3>
                <div className="flex flex-row" id="title">
                    <Image
                    className="h-9 w-auto mt-5 mr-4"
                    src="/img/inisial-pemilik.png"
                    alt="Compass logo"
                    width={80}
                    height={80}
                   priority
                />
                <div className="flex flex-col" id="title">
                <h1 className="pt-4.5 text-[12px]">Flow</h1>
                <h3 className="text-[12px] font-normal text-text-subheading" id="subtitle"><span className="">Universitas Primakara</span> · <span className="">Pemilik tim</span></h3>
                </div>
                </div>
                <div className="flex flex-row mt-2" id="title">
                    <Image
                    className="h-3 w-auto flex mt-0.5 mr-1"
                    src="/img/person.png"
                    alt="Compass logo"
                    width={80}
                    height={80}
                   priority
                />
                <h3 className="text-[12px] font-normal text-text-subheading mr-4">
                    Tim 2/3</h3>

                    <Image
                    className="h-3 w-auto flex mt-0.5 mr-1"
                    src="/img/calendar-days.png"
                    alt="Compass logo"
                    width={80}
                    height={80}
                   priority
                />
                <h3 className="text-[12px] font-semibold text-text-warning">Tenggat 30 Okt</h3>
                </div>
            </div>
        </div>
        </div>
        
        <hr className="border-border-default mt-8.5" />

            <div className="container flex justify-center mt-10">
            <div className="h-45.5 w-89.5 pt-6 pl-6 bg-border-main border rounded-2xl border-border-default md:w-300 flex" id="card-content-container">
                <div className="w-[97%] flex flex-col" id="title-content">
                <h1 className="text-[12px] text-text-warning">1 posisi terbuka</h1>
                <div className="flex flex-row justify-between" id="title">
                <h1 className="text-[20px] font-bold pt-2">UI/UX Designer</h1>
                </div>
                <h1 className="pt-2 text-[14px]">Rancang user flow dan tiga layar utama untuk website lingkungan.</h1>
                <div className="flex flex-row mt-2" id="title">
                    <Image
                    className="h-3 w-auto flex mt-0.5 mr-1"
                    src="/img/laptop.png"
                    alt="Compass logo"
                    width={80}
                    height={80}
                   priority
                />
                <h3 className="text-[12px] font-normal text-text-subheading mr-4">
                    Remote</h3>

                    <Image
                    className="h-3 w-auto flex mt-0.5 mr-1"
                    src="/img/clock.png"
                    alt="Compass logo"
                    width={80}
                    height={80}
                   priority
                />
                <h3 className="text-[12px] text-text-subheading mr-4">±6 jam/minggu</h3>

                <Image
                    className="h-3 w-auto flex mt-0.5 mr-1"
                    src="/img/figma.png"
                    alt="Compass logo"
                    width={80}
                    height={80}
                   priority
                />
                <h3 className="text-[12px] text-text-subheading">Figma</h3>
                </div>
            </div>

            </div>
            </div>

             <div className="container flex justify-center mt-10">
                <a href="projectdetail/pengajuanbergabung" className="w-[80vw] h-12 text-center content-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded">
                    Ajukan Bergabung
                </a>
             </div>

        </>
    )
}