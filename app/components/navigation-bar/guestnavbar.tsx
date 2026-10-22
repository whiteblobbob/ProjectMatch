import Image from "next/image";

export default function guestnavbar(){
    return(
        
        <nav className="sticky top-0 p-4 border-b-2 border-gray-200 bg-white z-10">
            <ul className="flex flex-row justify-between list-none text-[14px]">
            <li className="text=[#182230] flex flex-row align-middle">
                <Image
                className="h-6 w-6"
                src="/img/logo.png"
                alt="logo"
                width={100}
                height={100}
                priority
                />
                <a href="#" className="ml-1">ProjectMatch</a></li>
            <li className=""><a href="#" className="text-[#2459C4] transition duration-300 hover:text-[#182230]">Login</a></li>
            </ul>
        </nav>
    )
        
}