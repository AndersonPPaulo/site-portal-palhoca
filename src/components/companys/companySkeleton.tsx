"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CardCompany } from "@/components/companys/card-company";
import { AlertCircle } from "lucide-react";
import CompanyPagination from "../companysPagination";
import { usePublicCompany } from "@/provider/company";

interface UnifiedCommerceListProps {
  activeCategory: string;
  showMap: boolean;
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
export default function CompanySkeleton({
  activeCategory,
  showMap,
  onPageChange,
}: UnifiedCommerceListProps) {
  const {
    highlightedCompanies,
    normalCompanies,
    loading,
    error,
    listNormalCompanies,
    listHighlightedCompanies,
  } = usePublicCompany();

  // Estados locais
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 9;
  const highlightedItemsPerPage = 6;

  // ✅ Verificar se não há empresas em NENHUM dos conjuntos
  const hasNoCompanies = useMemo(() => {
    const hasNormalCompanies = normalCompanies?.data && normalCompanies.data.length > 0;
    const hasHighlightedCompanies = highlightedCompanies?.data && highlightedCompanies.data.length > 0;
    return !hasNormalCompanies && !hasHighlightedCompanies;
  }, [normalCompanies, highlightedCompanies]);

  // Reset página ao mudar filtros principais
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedDistrict, searchTerm]);

  // ✅ Função para buscar empresas com os filtros apropriados
  const fetchCompanies = useCallback(async () => {
    try {
      const filters: any = {};

      // ✅ Só adiciona filtro se tiver valor
      if (activeCategory && activeCategory !== "Todos") {
        filters.category = normalizeText(activeCategory);
      }

      if (selectedDistrict && selectedDistrict.trim() !== "") {
        filters.district = selectedDistrict;
      }

      if (searchTerm && searchTerm.trim() !== "") {
        filters.search = searchTerm;
      }

      console.log("🔍 Buscando empresas com filtros:", filters);

      // Buscar destacadas (sempre 6 itens na primeira página)
      await listHighlightedCompanies(1, highlightedItemsPerPage, filters);
      
      // Buscar normais (com paginação)
      await listNormalCompanies(currentPage, itemsPerPage, filters);
    } catch (error) {
      console.error("❌ Erro ao buscar empresas:", error);
    }
  }, [
    activeCategory,
    selectedDistrict,
    searchTerm,
    currentPage,
    itemsPerPage,
    highlightedItemsPerPage,
    listHighlightedCompanies,
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
      console.log("📍 Distrito selecionado:", customEvent.detail);
      setSelectedDistrict(customEvent.detail);
    };

    const handleCompanyNameSearch = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      console.log("🔎 Busca:", customEvent.detail);
      setSearchTerm(customEvent.detail);
    };

    window.addEventListener("districtSelected", handleDistrictSelected);
    window.addEventListener("companyNameSearch", handleCompanyNameSearch);

    return () => {
      window.removeEventListener("districtSelected", handleDistrictSelected);
      window.removeEventListener("companyNameSearch", handleCompanyNameSearch);
    };
  }, []);

  // Total de páginas (apenas para empresas normais)
  const totalPages = useMemo(() => {
    return normalCompanies?.totalPages || 1;
  }, [normalCompanies?.totalPages]);

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

  // ==================== COMPONENTES INTERNOS ====================
  
  const NoCompanyMessage = () => {
    const filters = [];
    if (activeCategory !== "Todos") filters.push(`categoria "${activeCategory}"`);
    if (selectedDistrict) filters.push(`bairro "${selectedDistrict}"`);
    if (searchTerm) filters.push(`nome "${searchTerm}"`);

    const filterText = filters.length ? ` com ${filters.join(", ")}` : "";

    // ✅ Função para limpar todos os filtros
    const handleClearFilters = () => {
      console.log("🧹 Limpando todos os filtros...");
      
      setSelectedDistrict("");
      setSearchTerm("");
      setCurrentPage(1);
      
      // Disparar eventos globais
      window.dispatchEvent(new CustomEvent("districtSelected", { detail: "" }));
      window.dispatchEvent(new CustomEvent("companyNameSearch", { detail: "" }));
      
      // Forçar nova busca após limpar
      setTimeout(() => {
        fetchCompanies();
      }, 100);
    };

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
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 text-xs text-gray-500 bg-red-50 p-2 rounded max-w-md mx-auto">
            <div>Categoria: {activeCategory || "Nenhuma"}</div>
            <div>Bairro: {selectedDistrict || "Nenhum"}</div>
            <div>Busca: {searchTerm || "Nenhuma"}</div>
          </div>
        )}
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

  const SkeletonCompanyCards = ({ count = 9 }: { count?: number }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, index) => (
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
    <div className="flex flex-col gap-8">
      {/* Estado de erro */}
      {error && !loading && <ErrorMessage />}

      {/* Estado de carregamento */}
      {loading && !error && (
        <>
          <SkeletonCompanyCards count={6} />
          <SkeletonCompanyCards count={9} />
        </>
      )}

      {/* ✅ Mensagem quando não há empresas */}
      {!loading && !error && hasNoCompanies && <NoCompanyMessage />}

      {/* ✅ Conteúdo principal - só mostra se houver empresas */}
      {!loading && !error && !hasNoCompanies && (
        <>
          {/* Empresas Destacadas */}
          {highlightedCompanies?.data && highlightedCompanies.data.length > 0 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {highlightedCompanies.data.map((company, index) => (
                  <CardCompany
                    key={company.id}
                    company={company}
                    gridIndex={index}
                    section="highlighted-companies"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empresas Normais */}
          {normalCompanies?.data && normalCompanies.data.length > 0 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {normalCompanies.data.map((company, index) => (
                  <CardCompany
                    key={company.id}
                    company={company}
                    gridIndex={index}
                    section="normal-companies"
                  />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <CompanyPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={normalCompanies?.total || 0}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  className="mt-8"
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}