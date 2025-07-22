"use client";

import { useState, useEffect } from "react";
import { CardCompany } from "@/components/companys/card-company";
import { AlertCircle } from "lucide-react";

import dynamic from "next/dynamic";

const CommercialMap = dynamic(() => import("../mapCompany"), {
  ssr: false,
});

import CompanyPagination from "../companysPagination";
import { IPublicCompany, usePublicCompany } from "@/provider/company";
import default_image from "@/assets/default image.webp";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/ç/g, "c") // transforma cedilha
    .replace(/[^\w\s]/g, ""); // remove especiais
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

export default function FilteredCommerceList({
  activeCategory,
  showMap,
  onPageChange,
}: FilteredCommerceListProps) {
  const { companies, loading, error, listCompanies } = usePublicCompany();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  // Reset página ao mudar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedDistrict, searchTerm]);

  // Buscar dados da API sempre que filtros mudarem
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        await listCompanies(currentPage, itemsPerPage, {
          category:
            activeCategory !== "Todos"
              ? normalizeText(activeCategory)
              : undefined,
          district: selectedDistrict || undefined,
          search: searchTerm || undefined,
        });
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
      }
    };

    fetchCompanies();
  }, [activeCategory, selectedDistrict, searchTerm, currentPage]);

  // Atualizar total de páginas quando os dados mudarem
  useEffect(() => {
    if (companies?.total) {
      setTotalPages(Math.ceil(companies.total / itemsPerPage));
    }
  }, [companies]);

  // Event listeners
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

  const convertApiDataToCompany = (apiCompany: IPublicCompany) => {
    const allCategories = apiCompany.company_category?.map(
      (cat) => cat.name
    ) || ["Comércio"];

    return {
      name: apiCompany.name,
      address: apiCompany.address,
      category: allCategories.length === 1 ? allCategories[0] : allCategories,
      district: apiCompany.district,
      image: apiCompany.company_image?.url ?? default_image,
      id: apiCompany.id,
    };
  };

  const paginatedCompanies =
    companies?.data?.map(convertApiDataToCompany) || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

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
          href="/comercio"
          className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
        >
          Ver todas as categorias
        </a>
      </div>
    </div>
  );

  const NoCompanyMessage = () => {
    const filters = [];
    if (activeCategory !== "Todos")
      filters.push(`categoria "${activeCategory}"`);
    if (selectedDistrict) filters.push(`bairro "${selectedDistrict}"`);
    if (searchTerm) filters.push(`nome "${searchTerm}"`);

    const filterText = filters.length ? `com ${filters.join(", ")}` : "";
    return (
      <div className="w-full py-12 text-center bg-red-50 rounded-lg border border-red-200 px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          Nenhum comércio encontrado
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Não encontramos comércios cadastrados {filterText}.
        </p>
        <div className="mt-6">
          <a
            href="/comercio"
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

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div
        className={`${
          showMap ? "flex-1" : "w-full"
        } transition-all duration-300`}
      >
        {loading ? (
          <SkeletonCompanyCards />
        ) : paginatedCompanies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedCompanies.map((company) => (
                <div className="w-full" key={company.id}>
                  <CardCompany company={company} />
                </div>
              ))}
            </div>

            <CompanyPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={companies?.total || 0}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          </>
        ) : activeCategory !== "Todos" ? (
          <CategoryNotFoundMessage />
        ) : (
          <NoCompanyMessage />
        )}
      </div>

      {showMap && (
        <CommercialMap
          companies={companies?.data || []}
          height="h-[1100px]"
          width="w-[408px]"
          currentPage={currentPage}
        />
      )}
    </div>
  );
}
