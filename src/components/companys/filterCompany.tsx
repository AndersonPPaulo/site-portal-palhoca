"use client";

import { useState, useEffect, useMemo } from "react";
import { CardCompany } from "@/components/companys/card-company";
import { AlertCircle } from "lucide-react";
import CommercialMap from "../mapCompany";
import CompanyPagination from "../companysPagination";
import { IPublicCompany, usePublicCompany } from "@/provider/company";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
}

function normalizeDistrict(district: string): string {
  return district
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

interface FilteredCommerceListProps {
  activeCategory: string;
  showMap: boolean;
  onPageChange?: (page: number) => void;
}

interface Company {
  name: string;
  address: string;
  category: string | string[];
  district?: string;
  image: any;
  id?: string;
}

export default function FilteredCommerceList({
  activeCategory,
  showMap,
  onPageChange,
}: FilteredCommerceListProps) {
  const { companies, loading, error, listCompanies } = usePublicCompany();

  // Estados principais
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  // Lista de categorias válidas
  const validCategories = [
    "Todos",
    "Academia",
    "Advogados",
    "Agência de viagem",
    "Alimentação",
    "Barbearia",
    "Bares",
    "Casa e construção",
    "Compras várias",
    "Eletrônico",
    "Empresa médica",
    "Escolas e faculdades",
    "Farmácia",
    "Festas e eventos",
    "Floricultura",
    "Imobiliárias",
    "Internet e informática",
    "Limpeza e organização",
    "Marketing e publicidade",
    "Oficina mecânica",
    "Outra",
    "Pet shop",
    "Posto de combustível",
    "Produto e serviço",
    "Restaurante japonês",
    "Revenda de carros",
    "Saúde e beleza",
    "Serviço público",
    "Supermercado",
    "Viagem e transporte",
  ];

  // Carregar dados da API
  useEffect(() => {
    if (!companies?.data && !loading) {
      listCompanies(1, 20);
    }
  }, [companies?.data, loading, listCompanies]);

  // Converter dados da API para formato do CardCompany
  const convertApiDataToCompany = (apiCompany: IPublicCompany): Company => {
    const allCategories = apiCompany.company_category?.map(
      (cat) => cat.name
    ) || ["Comércio"];

    return {
      name: apiCompany.name,
      address: apiCompany.address,
      category: allCategories.length === 1 ? allCategories[0] : allCategories,
      district: apiCompany.district,
      image: apiCompany.company_image?.url || "/placeholder-business.jpg",
      id: apiCompany.id,
    };
  };

  // Verificar se categoria existe
  const categoryExists = useMemo(() => {
    if (!activeCategory) return true;
    const categoryNormalized = normalizeText(activeCategory);
    return (
      validCategories.some(
        (cat) => normalizeText(cat) === categoryNormalized
      ) || activeCategory === "Todos"
    );
  }, [activeCategory]);

  // Filtrar empresas
  const filteredData = useMemo(() => {
    if (!companies?.data || !categoryExists) {
      return { companies: [], apiCompanies: [] };
    }

    let filteredOriginal = companies.data;
    const categoryNormalized = normalizeText(activeCategory);

    // Filtrar por categoria
    if (activeCategory !== "Todos") {
      filteredOriginal = filteredOriginal.filter((company) =>
        company.company_category?.some(
          (cat) => normalizeText(cat.name) === categoryNormalized
        )
      );
    }

    // Filtrar por bairro
    if (selectedDistrict) {
      const normalizedSelectedDistrict = normalizeDistrict(selectedDistrict);
      filteredOriginal = filteredOriginal.filter(
        (company) =>
          company.district &&
          normalizeDistrict(company.district) === normalizedSelectedDistrict
      );
    }

    // Filtrar por nome
    if (searchTerm) {
      const normalizedSearchTerm = normalizeText(searchTerm);
      filteredOriginal = filteredOriginal.filter((company) =>
        normalizeText(company.name).includes(normalizedSearchTerm)
      );
    }

    const convertedCompanies = filteredOriginal.map(convertApiDataToCompany);

    return {
      companies: convertedCompanies,
      apiCompanies: filteredOriginal,
    };
  }, [
    companies?.data,
    activeCategory,
    selectedDistrict,
    searchTerm,
    categoryExists,
  ]);

  // Dados paginados
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return {
      companies: filteredData.companies.slice(start, end),
      apiCompanies: filteredData.apiCompanies.slice(start, end),
      totalPages: Math.ceil(filteredData.companies.length / itemsPerPage),
    };
  }, [filteredData, currentPage, itemsPerPage]);

  // Handler para mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedDistrict, searchTerm]);

  // Listeners para eventos externos
  useEffect(() => {
    const handleDistrictSelected = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSelectedDistrict(customEvent.detail);
    };

    const handleCompanyNameSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSearchTerm(customEvent.detail);
    };

    window.addEventListener("districtSelected", handleDistrictSelected);
    window.addEventListener("companyNameSearch", handleCompanyNameSearch);

    return () => {
      window.removeEventListener("districtSelected", handleDistrictSelected);
      window.removeEventListener("companyNameSearch", handleCompanyNameSearch);
    };
  }, []);

  // Componentes de mensagem
  const CategoryNotFoundMessage = () => (
    <div className="w-full py-12 text-center bg-red-50 rounded-lg border border-red-200 px-4">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-red-600 mb-2">
        Categoria não encontrada
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        A categoria <strong>"{activeCategory}"</strong> não existe em nosso
        sistema.
      </p>
      <div className="mt-6">
        <a
          href="/comercios"
          className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
        >
          Ver todas as categorias
        </a>
      </div>
    </div>
  );

  const NoCompanyMessage = () => {
    const getNoResultsMessage = () => {
      const filters = [];
      if (activeCategory !== "Todos")
        filters.push(`categoria "${activeCategory}"`);
      if (selectedDistrict) filters.push(`bairro "${selectedDistrict}"`);
      if (searchTerm) filters.push(`nome "${searchTerm}"`);

      if (filters.length === 0) {
        return "Não encontramos comércios cadastrados.";
      }

      return `Não encontramos comércios cadastrados com ${filters.join(", ")}.`;
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
          {getNoResultsMessage()}
        </p>
        <div className="mt-6">
          <a
            href="/comercios"
            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Ver todas as categorias
          </a>
        </div>
      </div>
    );
  };

  const SkeletonCompanyCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(itemsPerPage)].map((_, index) => (
        <div key={index} className="w-full">
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

  // Renderização
  if (loading && !companies?.data) {
    return (
      <div
        className={`${
          showMap ? "flex-1" : "w-full"
        } transition-all duration-300`}
      >
        <SkeletonCompanyCards />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${
          showMap ? "flex-1" : "w-full"
        } transition-all duration-300`}
      >
        <div className="w-full py-12 text-center bg-red-50 rounded-lg border border-red-200 px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Erro ao carregar
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div
        className={`${
          showMap ? "flex-1" : "w-full"
        } transition-all duration-300`}
      >
        {!categoryExists ? (
          <CategoryNotFoundMessage />
        ) : filteredData.companies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedData.companies.map((company, index) => (
                <div
                  className="w-full"
                  key={`${company.id}-${currentPage}-${index}`}
                >
                  <CardCompany company={company} />
                </div>
              ))}
            </div>

            <CompanyPagination
              currentPage={currentPage}
              totalPages={paginatedData.totalPages}
              totalItems={filteredData.companies.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          </>
        ) : (
          <NoCompanyMessage />
        )}
      </div>

      {showMap && (
        <CommercialMap
          companies={paginatedData.apiCompanies}
          height="h-[1100px]"
          width="w-[408px]"
          currentPage={currentPage}
        />
      )}
    </div>
  );
}
