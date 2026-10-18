import Image from "next/image"

export default function guestpage(){
    return(
        <>
        <div className="h-auto flex-col" id="wrapper">
        <div className="h-70 w-[90%] flex flex-col ml-4" id="header">
        <h1 className="font-bold text-[28px]">Temukan tim yang butuh <span className="block">kamu.</span></h1>
        <h4 className="text-[#576477] text-[14px]">Bangun proyek bersama teman lintas kampus.</h4>
       <div className="relative w-full">
        <Image
            className="absolute left-3 top-1/2 -translate-y-1/2"
            src="/img/search.png"
            alt="Search"
            width={20}
            height={20}
        />

        <input
            className="block w-full rounded-md border border-[#E5E7EB] py-2 pr-3 pl-9 text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline focus:outline-sky-500 sm:text-sm dark:border-gray-600"
            placeholder="Cari proyek, peran, atau topik"
            type="text"
            name="search"
        />
        </div>
        <div className="flex flex-row justify-around mt-2.5 gap-3 text-[#576477]" id="filter">
        <select className="w-35 h-10 rounded-4xl border border-[#E5E7EB] text-center md:w-200" name="" id="">
            <option value="">Jenis Proyek</option>
            <option value="">wasd</option>
            <option value="">wasd</option>
        </select>

        <select className="w-25 h-10 rounded-4xl border border-[#E5E7EB] text-center md:w-200" name="" id="">
            <option value="">Topik</option>
            <option value="">wasd</option>
            <option value="">wasd</option>
        </select>

        <select className="w-35 h-10 rounded-4xl border border-[#E5E7EB] text-center md:w-200" name="" id="">
            <option value="">Lokasi & Mode</option>
            <option value="">wasd</option>
            <option value="">wasd</option>
        </select>
        </div>
        </div>
        <div className="h-400" id="Base">
    
        </div>
        </div>
        </>
    )
}