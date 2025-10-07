"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CardCompany } from "@/components/companys/card-company";
import { AlertCircle } from "lucide-react";
import CompanyPagination from "../companysPagination";
import { IPublicCompany, usePublicCompany } from "@/provider/company";
import default_image from "@/assets/no-img.png";

interface FilteredCommerceListProps {
  activeCategory: string;
  showMap: boolean;
  showHighlightedOnly?: boolean; // Nova prop para controlar se mostra apenas destaques
  onPageChange?: (page: number) => void;
}

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
export default function FilteredCommerceList({
  activeCategory,
  showMap,
  showHighlightedOnly = false,
  onPageChange,
}: FilteredCommerceListProps) {
  // Hooks do contexto - usar funções apropriadas baseado em showHighlightedOnly
  const {
    highlightedCompanies,
    normalCompanies,
    loading,
    error,
    listNormalCompanies,
  } = usePublicCompany();

  // Estados locais
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 9;

  // Determinar qual conjunto de dados usar
  const companies = useMemo(() => {
    if (showHighlightedOnly) return highlightedCompanies;
    return normalCompanies;
  }, [showHighlightedOnly, highlightedCompanies, normalCompanies]);

  // Reset página ao mudar filtros principais
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedDistrict, searchTerm, showHighlightedOnly]);

  // Função para buscar empresas com os filtros apropriados
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

      await listNormalCompanies(currentPage, itemsPerPage, filters);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    }
  }, [
    activeCategory,
    selectedDistrict,
    searchTerm,
    currentPage,
    itemsPerPage,
    showHighlightedOnly,
    listNormalCompanies,
  ]);

  // Buscar dados quando filtros mudarem
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Event listeners para comunicação entre componentes
  useEffect(() => {
    const handleDistrictSelected = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setSelectedDistrict(customEvent.detail);
    };

    const handleCompanyNameSearch = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setSearchTerm(customEvent.detail);
    };

    window.addEventListener("districtSelected", handleDistrictSelected);
    window.addEventListener("companyNameSearch", handleCompanyNameSearch);

    return () => {
      window.removeEventListener("districtSelected", handleDistrictSelected);
      window.removeEventListener("companyNameSearch", handleCompanyNameSearch);
    };
  }, []);


  // Converter dados da API para formato do componente
  const convertApiDataToCompany = useCallback((apiCompany: IPublicCompany) => {
    return {
      id: apiCompany.id,
      name: apiCompany.name,
      address: apiCompany.address,
      company_category: apiCompany.company_category,
      district: apiCompany.district,
      company_image: apiCompany.company_image
        ? apiCompany.company_image
        : {
            id: "default",
            key: "default",
            company_id: apiCompany.id,
            url: default_image.src,
          },
    };
  }, []);

  // Dados paginados e convertidos
  const paginatedCompanies = useMemo(() => {
    return companies?.data?.map(convertApiDataToCompany) || [];
  }, [companies?.data, convertApiDataToCompany]);

  // Total de páginas
  const totalPages = useMemo(() => {
    return companies?.totalPages || 1;
  }, [companies?.totalPages]);

  // Handler para mudança de página
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      onPageChange?.(page);

      // Scroll suave para o topo da lista
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [onPageChange]
  );

  const NoCompanyMessage = () => {
    const filters = [];
    if (activeCategory !== "Todos")
      filters.push(`categoria "${activeCategory}"`);
    if (selectedDistrict) filters.push(`bairro "${selectedDistrict}"`);
    if (searchTerm) filters.push(`nome "${searchTerm}"`);
    if (showHighlightedOnly) filters.push("apenas destaques");

    const filterText = filters.length ? ` com ${filters.join(", ")}` : "";

    return (
      <div className="w-full py-12 text-center bg-red-50 rounded-lg border border-red-200 px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          Nenhum comércio encontrado
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Não encontramos comércios cadastrados{filterText}.
        </p>
        <div className="mt-6 space-x-3">
          {(selectedDistrict || searchTerm) && (
            <button
              onClick={() => {
                setSelectedDistrict("");
                setSearchTerm("");
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              Limpar filtros
            </button>
          )}
          <button
            onClick={() => (window.location.href = "/comercio")}
            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Ver todos os comércios
          </button>
        </div>
      </div>
    );
  };

  const ErrorMessage = () => (
    <div className="w-full py-12 text-center bg-red-50 rounded-lg border border-red-200 px-4">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-red-600 mb-2">
        Erro ao carregar comércios
      </h3>
      <p className="text-gray-600 max-w-md mx-auto mb-4">{error}</p>
      <button
        onClick={fetchCompanies}
        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );

  const SkeletonCompanyCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <div key={`skeleton-${index}`} className="w-full">
          <div className="overflow-hidden rounded-3xl shadow-lg h-full w-full animate-pulse">
            <div className="h-[156px] w-full bg-gray-300"></div>
            <div className="p-4 lg:p-6">
              <div className="flex gap-1 mb-3">
                <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
              </div>
              <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <div className="h-4 w-full bg-gray-300 rounded"></div>
              </div>
              <div className="h-10 w-full bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ==================== RENDERIZAÇÃO ====================
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div
        className={`${
          showMap ? "flex-1" : "w-full"
        } transition-all duration-300`}
      >
        {/* Estado de erro */}
        {error && !loading && <ErrorMessage />}

        {/* Estado de carregamento */}
        {loading && !error && <SkeletonCompanyCards />}

        {/* Conteúdo principal */}
        {!loading && !error && (
          <>
            {paginatedCompanies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paginatedCompanies.map((company) => (
                    <div className="w-full" key={company.id}>
                      <CardCompany company={company} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <CompanyPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={companies?.total || 0}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    className="mt-8"
                  />
                )}
              </>
            ) : (
              <NoCompanyMessage />
            )}
          </>
        )}
      </div>
    </div>
  );
}
