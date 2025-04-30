import { MapPin } from "lucide-react"
import Link from "next/link"

export default function ButtonMap(){
    return (
        <div className="fixed bottom-0 left-0 right-0 justify-center lg:static flex items-center pb-6 lg:pb-0">
        <Link 
            href="#abrir-mapa" 
            className="fixed bottom-8 lg:static flex items-center bg-red-primary py-2 px-4 space-x-2 text-white rounded-full shadow-lg hover:bg-red-primary/80 cursor-pointer transition duration-300 ease-in-out z-50"
        >
            <MapPin className="min-h-5 min-w-5 text-white" />
            <span className="min-w-[40px] text-[14px] font-medium">Ver no mapa</span>
        </Link>
        </div>
    )
}