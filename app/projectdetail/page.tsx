import Navbar from "../components/navigation-bar/guestnavbar";
import Detail from "../components/detail/projectdetail";

export default function detail(){
    return(
        <>
        <Navbar />
        <div className="min-h-screen">
        <Detail />
        </div>
        </>
    )
        
    
}
