import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Interface para as props do SearchInputCompany
interface SearchInputCompanyProps {
  onSearch?: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number; // Tempo de delay para evitar muitas chamadas
}

const SearchInputCompany: React.FC<SearchInputCompanyProps> = ({
  onSearch,
  placeholder = "Pesquisar o nome",
  className = "",
  debounceMs = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Efeito para fazer debounce da busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Chama a função onSearch se fornecida
      if (onSearch) {
        onSearch(searchTerm);
      }

      // Dispara o evento customizado que outros componentes podem escutar
      const searchEvent = new CustomEvent("companyNameSearch", {
        detail: searchTerm.trim(),
      });
      window.dispatchEvent(searchEvent);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch, debounceMs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = (): void => {
    setSearchTerm("");
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Input de pesquisa + lupa */}
      <div className="flex items-center w-full relative">
        <Input
          type="search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          className="bg-transparent h-[44px] shadow-none outline-none border-none rounded-t-[12px] rounded-b-none placeholder:text-gray-400 w-full pr-12"
        />
        {searchTerm ? (
          <Button
            onClick={handleClearSearch}
            className="absolute right-10 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none shadow-none p-1 h-auto min-h-0"
            type="button"
            variant={"outline"}
          >
            <X />
          </Button>
        ) : null}
        <Search className="absolute right-4 text-gray-400" size={20} />
      </div>
    </div>
  );
};

export default SearchInputCompany;
