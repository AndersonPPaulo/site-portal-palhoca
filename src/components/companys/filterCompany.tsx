"use client";

import { useState, useEffect } from "react";
import { mockCompanys } from "@/utils/mock-data";
import { CardCompany } from "@/components/companys/card-company";
import { AlertCircle } from "lucide-react";
import CommercialMap from "../mapCompany";
import CompanyPagination from "../companysPagination";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
}

interface FilteredCommerceListProps {
  activeCategory: string;
  showMap: boolean;
}

export default function FilteredCommerceList({
  activeCategory,
  showMap,
}: FilteredCommerceListProps) {
  interface Company {
    name: string;
    address: string;
    category: string;
    district?: string; // Adicionado o campo district opcional
    image: any;
  }

  const typedMockCompanys = mockCompanys as Company[];

  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [categoryExists, setCategoryExists] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedCompanies, setPaginatedCompanies] = useState<Company[]>([]);
  const [totalPages, setTotalPages] = useState(1);
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

  // Ouvir o evento de seleção de bairro
  useEffect(() => {
    const handleDistrictSelected = (event: Event) => {
      const customEvent = event as CustomEvent;
      const district = customEvent.detail;
      setSelectedDistrict(district);
      setCurrentPage(1); // Resetar para a primeira página ao mudar de bairro
    };

    window.addEventListener('districtSelected', handleDistrictSelected);
    return () => {
      window.removeEventListener('districtSelected', handleDistrictSelected);
    };
  }, []);

  // Verificar a categoria e filtrar os comércios
  useEffect(() => {
    // Primeiro, definir loading para true antes de qualquer verificação
    setIsLoading(true);
    setCurrentPage(1); // Resetar para a primeira página ao mudar de categoria

    // Dar um curto timeout para garantir que a UI mostre o estado de loading
    const timer = setTimeout(() => {
      // Verificar se a categoria existe na lista de categorias válidas
      const categoryNormalized = normalizeText(activeCategory);
      const categoryValid =
        validCategories.some(
          (cat) => normalizeText(cat) === categoryNormalized
        ) || activeCategory === "Todos";

      setCategoryExists(categoryValid);

      // Filtrar os comércios pela categoria e bairro
      if (categoryValid) {
        let filtered = typedMockCompanys;
        
        // Filtrar por categoria
        if (activeCategory !== "Todos") {
          filtered = filtered.filter(
            (company) => normalizeText(company.category) === categoryNormalized
          );
        }
        
        // Filtrar por bairro, se houver um selecionado
        if (selectedDistrict) {
          filtered = filtered.filter(
            (company) => company.district && company.district === selectedDistrict
          );
        }

        setFilteredCompanies(filtered);
      } else {
        setFilteredCompanies([]);
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [activeCategory, selectedDistrict]); // Adicionei selectedDistrict como dependência

  // Efeito para calcular o total de páginas quando os dados filtrados mudam
  useEffect(() => {
    setTotalPages(Math.ceil(filteredCompanies.length / itemsPerPage));
  }, [filteredCompanies]);

  // Efeito para atualizar as empresas paginadas quando a página atual ou dados filtrados mudam
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedCompanies(filteredCompanies.slice(start, end));
  }, [filteredCompanies, currentPage]);

  // Handler para mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

// Componente para mensagem de categoria não encontrada
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
      <a href="/comercios"
        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
        Ver todas as categorias
      </a>
    </div>
  </div>
);

// Componente para mensagem de nenhum comércio encontrado
const NoCompanyMessage = () => (
  <div className="w-full py-12 text-center bg-red-50 rounded-lg border border-red-200 px-4">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
      <AlertCircle className="h-6 w-6 text-red-500" />
    </div>
    <h3 className="text-xl font-semibold text-red-600 mb-2">
      Nenhum comércio encontrado
    </h3>
    <p className="text-gray-600 max-w-md mx-auto">
      {selectedDistrict 
        ? `Não encontramos comércios cadastrados na categoria "${activeCategory}" no bairro "${selectedDistrict}".`
        : `Não encontramos comércios cadastrados na categoria "${activeCategory}".`
      }
    </p>
    <div className="mt-6">
      <a 
        href="/comercios"
        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
        Ver todas as categorias
      </a>
    </div>
  </div>
);
  // Componente para estado de carregamento
  const LoadingState = () => (
    <div className="w-full py-20 text-center">
      <div
        className="animate-spin inline-block w-10 h-10 border-4 border-current border-t-transparent text-red-600 rounded-full"
        role="status"
      >
        <span className="sr-only">Carregando...</span>
      </div>
      <p className="mt-4 text-gray-500 text-lg">Buscando comércios...</p>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div
        className={`${
          showMap ? "lg:w-2/3" : "w-full"
        } transition-all duration-300`}
      >
        {isLoading ? (
          <LoadingState />
        ) : !categoryExists ? (
          <CategoryNotFoundMessage />
        ) : filteredCompanies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedCompanies.map((company, index) => (
                <div className="w-full" key={`company-${currentPage}-${index}`}>
                  <CardCompany company={company} />
                </div>
              ))}
            </div>
            
            {/* Componente de paginação separado */}
            <CompanyPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCompanies.length}
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
          height="h-screen"
        />
      )}
    </div>
  );
}