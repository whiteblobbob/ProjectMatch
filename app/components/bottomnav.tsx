import Image from "next/image";

export default function bottomnavbar(){
    return(
        <>
        <nav className="sticky bottom-0 border-t-2 border-gray-200">
            <ul className="flex flex-row justify-between text-sm w-[90%] h-15 mx-auto mt-4 text-[12px]">
            <li className="flex flex-col items-center">
                <a href="" className="flex flex-col items-center transition duration-300 hover:scale-120">
            <Image
            className="h-6 w-6"
            src="/img/compass.png"
            alt="Compass logo"
            width={80}
            height={80}
            priority
            />
                Jelajahi
                </a>
                </li>
            <li>
            <a href="" className="flex flex-col items-center transition duration-300 hover:scale-120">
            <Image
            className="h-6 w-6"
            src="/img/inbox.png"
            alt="Compass logo"
            width={80}
            height={80}
            priority
            />
                Aktivitas
                </a>
                </li>
            <li className="flex flex-col items-center">
                <a href="" className="flex flex-col items-center transition duration-300 hover:scale-120">
            <Image
            className="h-6 w-6"
            src="/img/user-round.png"
            alt="Compass logo"
            width={100}
            height={100}
            priority
            />
                Profil
                </a>
                </li>
            </ul>

        </nav>
        </>
    )
}