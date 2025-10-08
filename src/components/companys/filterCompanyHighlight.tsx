"use client";

import { useState, useEffect, useCallback } from "react";
import { usePublicCompany } from "@/provider/company";
import CardCompany from "./card-company";

// ==================== FUNÇÕES AUXILIARES ====================
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "c")
    .replace(/[^\w\s]/g, "")
    .trim();
};

// ==================== COMPONENTE PRINCIPAL ====================
export default function FilteredCommerceListHighlight() {
  const { highlightedCompanies, loading, listHighlightedCompanies } =
    usePublicCompany();

  // Estados locais para filtros
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Função para buscar empresas destacadas com os filtros
  const fetchCompanies = useCallback(async () => {
    try {
      const filters = {
        category:
          activeCategory !== "Todos"
            ? normalizeText(activeCategory)
            : undefined,
        district: selectedDistrict || undefined,
        search: searchTerm || undefined,
      };

      await listHighlightedCompanies(1, 6, filters);
    } catch (error) {
      console.error("Erro ao buscar empresas destacadas:", error);
    }
  }, [activeCategory, selectedDistrict, searchTerm, listHighlightedCompanies]);

  // Buscar dados quando filtros mudarem
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Event listeners para comunicação entre componentes
  useEffect(() => {
    const handleCategorySelected = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setActiveCategory(customEvent.detail);
    };

    const handleDistrictSelected = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setSelectedDistrict(customEvent.detail);
    };

    const handleCompanyNameSearch = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setSearchTerm(customEvent.detail);
    };

    window.addEventListener("categorySelected", handleCategorySelected);
    window.addEventListener("districtSelected", handleDistrictSelected);
    window.addEventListener("companyNameSearch", handleCompanyNameSearch);

    return () => {
      window.removeEventListener("categorySelected", handleCategorySelected);
      window.removeEventListener("districtSelected", handleDistrictSelected);
      window.removeEventListener("companyNameSearch", handleCompanyNameSearch);
    };
  }, []);

  // ==================== RENDERIZAÇÃO ====================
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {highlightedCompanies?.data &&
        highlightedCompanies.data.length > 0 &&
        !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlightedCompanies.data.map((company) => (
              <div className="w-full" key={company.id}>
                <CardCompany company={company} />
              </div>
            ))}
          </div>
        )}
    </div>
  );
}