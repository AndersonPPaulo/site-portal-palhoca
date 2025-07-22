"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { useContext, useEffect, useRef, useState } from "react";
import { ArticleContext } from "@/provider/article";
import { Button } from "../ui/button";
import SearchResults from "./search-results";
import DistrictSelect from "@/components/custom-input/custom-select-company";
import SearchInputCompany from "./search-results-company";

export default function CustomInput({ pathname }: { pathname: string | null }) {
  const { GetPublishedArticlesBySearch, publishedArticlesBySearch } =
    useContext(ArticleContext);
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    if (input.trim()) {
      setIsSearching(true);
      const debounceTimer = setTimeout(() => {
        GetPublishedArticlesBySearch({ page: page, title: input });
        setShowResults(true);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setShowResults(false);
      setIsSearching(false);
    }
  }, [input, page]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setInput("");
    setShowResults(false);
  };

  // Função para verificar se é página de comércio (tanto /comercios quanto /comercios/categoria)
  const isComercio = pathname?.startsWith("/comercio") || false;

  return (
    <div className="w-full max-w-[628px] mx-auto -mb-4 md:mb-2 lg:mt-2">
      {isComercio ? (
        <div className="flex flex-col md:flex-row w-full overflow-hidden rounded-[12px] border border-[#e6e6e6]">
          {/* Input de pesquisa + lupa */}
          <div className="flex items-center w-full">
            <SearchInputCompany />
          </div>

          {/* Divisor */}
          <div className="w-full md:w-px h-px md:h-[52px] bg-[#E6E6E6]" />
          
          {/* Input/select de bairros */}
          <div className="p-1 w-full mx-auto border-none">
            <DistrictSelect value={selectedDistrict} />
          </div>
        </div>
      ) : (
        <div className="relative w-full" ref={searchRef}>
          <form onSubmit={handleSearch}>
            <Input
              type="text"
              placeholder="Pesquisar"
              className="w-full h-[44px] px-4 py-2 outline-none border border-[#e6e6e6] rounded-[16px] focus:border-primary"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="absolute right-3 top-5 transform -translate-y-1/2 flex items-center gap-2">
              {input && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X size={14} className="text-gray-400" />
                </Button>
              )}
              <Search className="text-gray-400" size={20} />
            </div>
          </form>

          {/* Loading indicator */}
          {isSearching && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">
                    Pesquisando...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          <SearchResults
            isVisible={showResults && !isSearching}
            searchTerm={input}
            publishedArticlesBySearch={publishedArticlesBySearch}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  );
}