import { MapPin, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface ButtonMapProps {
  onClick?: () => void;
  isMapOpen?: boolean;
}

export default function ButtonMap({
  onClick,
  isMapOpen = false,
}: ButtonMapProps) {
  const pathname = usePathname();

  // Verifica se estamos na página de detalhes de um comércio
  const isComercioDetailsPage =
    pathname === "/comercio/" || pathname.startsWith("/comercio/?categoria=");

  // Se estiver na página de detalhes, não renderiza nada
  if (!isComercioDetailsPage) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="hidden lg:flex items-center cursor-pointer bg-red-600 py-2 px-4 text-white rounded-full shadow-lg hover:bg-red-700 transition duration-300 ease-in-out"
    >
      {isMapOpen ? (
        <>
          <X className="min-h-5 min-w-5 text-white" />
          <span className="min-w-[60px] text-[14px] font-medium">
            Fechar mapa
          </span>
        </>
      ) : (
        <>
          <MapPin className="min-h-5 min-w-5 text-white" />
          <span className="min-w-[60px] text-[14px] font-medium ">
            Ver no mapa
          </span>
        </>
      )}
    </button>
  );
}
