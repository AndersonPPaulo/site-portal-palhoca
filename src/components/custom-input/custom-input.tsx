import { ChevronDown, Search } from "lucide-react";
import { Input } from "../ui/input";

export default function CustomInput({ pathname }: { pathname: string | null }) {
  const isComercio = pathname === "/comercios";

  return (
    <div className="w-full max-w-[628px] mx-auto -mb-4 md:mb-2 lg:mt-2">
      {isComercio ? (
        <div className="flex flex-col md:flex-row w-full overflow-hidden  rounded-[12px] border border-[#e6e6e6]">
          {/* Input de pesquisa + lupa */}
          <div className="flex items-center flex-grow relative ">
            <Input
              type="text"
              placeholder="Pesquisar"
              className="bg-transparent h-[44px] shadow-none outline-none border-none rounded-t-[12px] rounded-b-none placeholder:text-gray-400 "
            />
            <Search className="absolute right-4 text-gray-400" size={20} />
          </div>

          {/* Divisor */}
          <div className="w-full md:w-px h-px md:h-[44px] bg-[#E6E6E6]" />
          {/* Input/select de bairros */}
          <div className="flex items-center flex-grow relative cursor-pointer">
            <Input
              type="text"
              placeholder="Selecione Bairro"
              className="bg-transparent h-[44px] outline-none border-none rounded-b-[12px] rounded-t-none placeholder:text-gray-400 cursor-pointer"
              readOnly
            />
            <ChevronDown className="absolute right-4 text-gray-400" size={20} />
          </div>
        </div>

      ) : (
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Pesquisar"
            className="w-full h-[44px] px-4 py-2 outline-none border border-[#e6e6e6] rounded-[16px] focus:border-primary"
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
