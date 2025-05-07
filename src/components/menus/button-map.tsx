import { MapPin, X } from "lucide-react";

interface ButtonMapProps {
  onClick?: () => void;
  isMapOpen?: boolean;
}

export default function ButtonMap({
  onClick,
  isMapOpen = false,
}: ButtonMapProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center bg-red-600 py-2 px-4  text-white rounded-full shadow-lg hover:bg-red-700 transition duration-300 ease-in-out"
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
          <span className="min-w-[60px] text-[14px] font-medium">
            Ver no mapa
          </span>
        </>
      )}
    </button>
  );
}
