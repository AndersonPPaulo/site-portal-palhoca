import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { districtsPalhoca } from "@/utils/mock-data";

// Tipagem para o array de distritos
type District = string;

// Interface para as props do DistrictSelect
interface DistrictSelectProps {
  onSelect?: (district: District) => void;
  placeholder?: string;
  value?: string;
  className?: string;
}

const DistrictSelect: React.FC<DistrictSelectProps> = ({
  onSelect,
  placeholder = "Selecione o Bairro",
  value = "",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(value);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Filtra os distritos baseado na busca
  const filteredDistricts: District[] =
    districtsPalhoca?.filter((district: District) =>
      district.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Calcula a posição do dropdown
  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  // Fecha o dropdown quando clica fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const handleInputClick = (): void => {
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const handleDistrictSelect = (district: District): void => {
    setSelectedDistrict(district);
    setIsOpen(false);
    setSearchTerm("");

    // Chama a função onSelect se fornecida
    if (onSelect) {
      onSelect(district);
    }

    // Dispara o evento customizado que o FilteredCommerceList está escutando
    const districtSelectedEvent = new CustomEvent("districtSelected", {
      detail: district,
    });
    window.dispatchEvent(districtSelectedEvent);
  };

  // Função para limpar a seleção
  const handleClearSelection = (): void => {
    setSelectedDistrict("");

    // Chama a função onSelect com string vazia
    if (onSelect) {
      onSelect("");
    }

    // Dispara o evento com string vazia para limpar o filtro
    const districtSelectedEvent = new CustomEvent("districtSelected", {
      detail: "",
    });
    window.dispatchEvent(districtSelectedEvent);
    setIsOpen(!isOpen)
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  // Componente do dropdown que será renderizado via portal
  const DropdownPortal = () => {
    if (!isOpen) return null;

    return createPortal(
      <div
        ref={dropdownRef}
        className="bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-hidden"
        style={{
          position: "absolute",
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          zIndex: 999999,
        }}
      >
        {/* Campo de busca */}
        <div className="p-2 border-b border-gray-100">
          <Input
            type="text"
            placeholder="Digite o bairro"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary"
            autoFocus
          />
        </div>

        {/* Lista de opções */}
        <div className="max-h-60 overflow-y-auto">
          {/* Opção para limpar seleção */}
          <div
            className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 text-sm border-b border-gray-100 font-medium text-gray-600"
            onClick={handleClearSelection}
          >
            Todos os bairros
          </div>

          {filteredDistricts.length > 0 ? (
            filteredDistricts.map((district, index) => (
              <div
                key={index}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 text-sm border-b border-gray-100 last:border-b-0"
                onClick={() => handleDistrictSelect(district)}
              >
                {district}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-sm">
              Nenhum bairro encontrado
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={inputRef}
        className="flex items-center relative cursor-pointer w-full"
        onClick={handleInputClick}
      >
        <Input
          type="text"
          placeholder={placeholder}
          value={selectedDistrict}
          className="h-[44px] outline-none border-none rounded-none shadow-none focus:ring-0 focus:border-none placeholder:text-gray-400 cursor-pointer w-full pr-12 bg-transparent"
          readOnly
        />
        {selectedDistrict ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleClearSelection();
            }}
            className="absolute right-10 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none shadow-none p-1 h-auto min-h-0"
            type="button"
            variant={"outline"}
          >
            <X size={16} />
          </Button>
        ) : null}
        <ChevronDown
          className={`absolute right-4 text-gray-400 transition-transform duration-200 pointer-events-none ${
            isOpen ? "rotate-180" : ""
          }`}
          size={20}
        />
      </div>

      {/* Dropdown renderizado via portal */}
      <DropdownPortal />
    </div>
  );
};

export default DistrictSelect;
