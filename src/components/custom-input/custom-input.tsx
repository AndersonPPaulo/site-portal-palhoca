"use client";

import { ChevronDown, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useEffect, useRef } from "react";
import { mockCompanys } from "@/utils/mock-data";

export default function CustomInput({ pathname }: { pathname: string | null }) {
  const isComercio = pathname === "/comercios" || pathname?.startsWith("/comercios/");
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Lista manual de bairros para caso o mock não tenha a propriedade district
  const fallbackDistricts = [
    "Centro", 
    "Jardim Eldorado", 
    "Caminho Novo", 
    "Brejaru", 
    "Ponte do Imaruim", 
    "Pachecos", 
    "Aririú"
  ];
  
  // Tentar extrair bairros do mock ou usar fallback
  const districtsFromMock = Array.from(
    new Set(
      mockCompanys
        .filter(company => company.district)
        .map(company => company.district)
    )
  );
  
  // Usar os bairros do mock se disponíveis, caso contrário usar o fallback
  const uniqueDistricts = districtsFromMock.length > 0 
    ? districtsFromMock.sort() 
    : fallbackDistricts.sort();
  
  // Debug
  useEffect(() => {
    console.log("Mock Companies:", mockCompanys);
    console.log("Districts from mock:", districtsFromMock);
    console.log("Unique districts being used:", uniqueDistricts);
  }, []);
  
  // Fechar dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDistrictDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Função para selecionar um distrito
  const handleSelectDistrict = (district: string) => {
    console.log("Distrito selecionado:", district);
    setSelectedDistrict(district);
    setDistrictDropdownOpen(false);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("districtSelected", { detail: district }));
    }
  };
  
  // Limpar filtro de distrito
  const clearDistrict = () => {
    console.log("Limpando seleção de distrito");
    setSelectedDistrict("");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("districtSelected", { detail: "" }));
    }
  };
  
  // Toggle do dropdown
  const toggleDropdown = () => {
    console.log("Toggle dropdown. Estado atual:", districtDropdownOpen);
    setDistrictDropdownOpen(prev => !prev);
  };

  return (
    <div className="w-full z-20 max-w-[628px] mx-auto -mb-4 md:mb-2 lg:mt-2">
      {isComercio ? (
        <div className="flex flex-col md:flex-row w-full overflow-visible rounded-[12px] border border-[#e6e6e6]">
          {/* Input de pesquisa + lupa */}
          <div className="flex items-center flex-grow relative">
            <Input
              type="text"
              placeholder="Pesquisar"
              className="bg-transparent h-[44px] shadow-none outline-none border-none rounded-t-[12px] md:rounded-r-none md:rounded-bl-[12px] placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-4 text-gray-400" size={20} />
          </div>

          {/* Divisor */}
          <div className="w-full md:w-px h-px md:h-[44px] bg-[#E6E6E6]" />
          
          {/* Dropdown de bairros */}
          <div className="relative z-20 flex-grow overflow-visible" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="flex items-center w-full justify-between bg-transparent h-[44px] px-4 text-left text-gray-700 rounded-b-[12px] md:rounded-l-none md:rounded-tr-[12px]"
            >
              <span className={selectedDistrict ? "" : "text-gray-400"}>
                {selectedDistrict || "Selecione Bairro"}
              </span>
              <ChevronDown 
                className={`text-gray-400 z-20 transition-transform duration-200 ${districtDropdownOpen ? 'rotate-180' : ''}`} 
                size={20} 
              />
            </button>
            
            {/* Dropdown menu para bairros - Usando posicionamento absoluto com offset maior */}
            {districtDropdownOpen && (
              <div className="fixed inset-0 z-20 overflow-y-auto bg-black bg-opacity-20 md:bg-transparent md:absolute md:inset-auto md:top-full md:left-0 md:right-0">
                <div className="absolute md:static bg-white p-2 md:mt-1 w-full max-w-md mx-auto md:mx-0 rounded-lg shadow-lg md:max-h-60 md:overflow-y-auto">
                  {/* Botão para fechar em dispositivos móveis */}
                  <button 
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 md:hidden"
                    onClick={() => setDistrictDropdownOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" >
                    </svg>
                  </button>
                  
                  <div className="mt-2 mb-2 md:mt-0 md:mb-0">
                    <div
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-700"
                      onClick={clearDistrict}
                    >
                      Todos os bairros
                    </div>
                    {uniqueDistricts.map((district, index) => (
                      <div
                        key={index}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-700"
                        onClick={() => handleSelectDistrict(district)}
                      >
                        {district}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Pesquisar"
            className="w-full h-[44px] px-4 py-2 outline-none border border-[#e6e6e6] rounded-[16px] focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute right-3 top-5 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      )}
    </div>
  );
}