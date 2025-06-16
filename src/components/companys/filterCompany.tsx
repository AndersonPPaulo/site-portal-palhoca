"use client";

import { useState, useEffect } from "react";
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

interface FilteredCommerceListProps {
  activeCategory: string;
  showMap: boolean;
}

export default function FilteredCommerceList({
  activeCategory,
  showMap,
}: FilteredCommerceListProps) {
  const { companies, loading, error, listCompanies } = usePublicCompany();

  // Adaptar dados da API para o formato esperado pelos componentes
  interface Company {
    name: string;
    address: string;
    category: string | string[]; // Pode ser string ou array
    district?: string;
    image: any;
    id?: string;
  }

  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [filteredApiCompanies, setFilteredApiCompanies] = useState<
    IPublicCompany[]
  >([]);
  const [categoryExists, setCategoryExists] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedCompanies, setPaginatedCompanies] = useState<Company[]>([]);
  const [paginatedApiCompanies, setPaginatedApiCompanies] = useState<
    IPublicCompany[]
  >([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  // Carregar dados da API
  useEffect(() => {
    const loadData = async () => {
      try {
        await listCompanies(1, 20);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
      }
    };

    if (!companies) {
      loadData();
    }
  }, []);

  // Converter dados da API para o formato esperado
  const convertApiDataToCompany = (apiCompany: IPublicCompany): Company => {
    // Extrair todas as categorias ou usar categoria padrão
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

  // Lista de categorias válidas extraída dos dados da API
  const [validCategories, setValidCategories] = useState<string[]>([
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
  ]);

  // Atualizar categorias válidas com base nos dados da API
  useEffect(() => {
    if (companies?.data) {
      const apiCategories = companies.data.flatMap(
        (company) => company.company_category?.map((cat) => cat.name) || []
      );
      const uniqueApiCategories = Array.from(new Set(apiCategories));

      // Manter categorias originais e adicionar novas da API
      const allCategories = [
        ...new Set([...validCategories, ...uniqueApiCategories]),
      ];
      setValidCategories(allCategories);
    }
  }, [companies]);

  // Ouvir o evento de seleção de bairro
  useEffect(() => {
    const handleDistrictSelected = (event: Event) => {
      const customEvent = event as CustomEvent;
      const district = customEvent.detail;
      setSelectedDistrict(district);
      setCurrentPage(1); // Resetar para a primeira página ao mudar de bairro
    };

    window.addEventListener("districtSelected", handleDistrictSelected);
    return () => {
      window.removeEventListener("districtSelected", handleDistrictSelected);
    };
  }, []);

  // Controlar loading inicial da API
  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    }
  }, [loading]);

  // Verificar a categoria e filtrar os comércios
  useEffect(() => {
    // Primeiro, definir loading para true antes de qualquer verificação
    setIsLoading(loading);
    setCurrentPage(1);
    // Dar um curto timeout para garantir que a UI mostre o estado de loading
    const timer = setTimeout(() => {
      if (companies?.data) {
        // Converter dados da API para formato esperado
        const convertedCompanies = companies.data.map(convertApiDataToCompany);

        // Verificar se a categoria existe na lista de categorias válidas
        const categoryNormalized = normalizeText(activeCategory);
        const categoryValid =
          validCategories.some(
            (cat) => normalizeText(cat) === categoryNormalized
          ) || activeCategory === "Todos";

        setCategoryExists(categoryValid);

        // Filtrar os comércios pela categoria e bairro
        if (categoryValid) {
          let filteredConverted = convertedCompanies;
          let filteredOriginal = companies.data;

          // Filtrar por categoria
          if (activeCategory !== "Todos") {
            filteredConverted = filteredConverted.filter((company) => {
              const companyCategories = Array.isArray(company.category)
                ? company.category
                : [company.category];

              return companyCategories.some(
                (cat) => normalizeText(cat) === categoryNormalized
              );
            });

            filteredOriginal = filteredOriginal.filter((company) =>
              company.company_category?.some(
                (cat) => normalizeText(cat.name) === categoryNormalized
              )
            );
          }

          // Filtrar por bairro, se houver um selecionado
          if (selectedDistrict) {
            filteredConverted = filteredConverted.filter(
              (company) =>
                company.district && company.district === selectedDistrict
            );

            filteredOriginal = filteredOriginal.filter(
              (company) =>
                company.district && company.district === selectedDistrict
            );
          }

          setFilteredCompanies(filteredConverted);
          setFilteredApiCompanies(filteredOriginal);
        } else {
          setFilteredCompanies([]);
          setFilteredApiCompanies([]);
        }
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [activeCategory, selectedDistrict, companies, validCategories, loading]);

  // Efeito para calcular o total de páginas quando os dados filtrados mudam
  useEffect(() => {
    setTotalPages(Math.ceil(filteredCompanies.length / itemsPerPage));
  }, [filteredCompanies]);

  // Efeito para atualizar as empresas paginadas quando a página atual ou dados filtrados mudam
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setPaginatedCompanies(filteredCompanies.slice(start, end));
    setPaginatedApiCompanies(filteredApiCompanies.slice(start, end));
  }, [filteredCompanies, filteredApiCompanies, currentPage]);

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
        <a
          href="/comercios"
          className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
        >
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
          : `Não encontramos comércios cadastrados na categoria "${activeCategory}".`}
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

  // Componente skeleton para cards de comércio
  const SkeletonCompanyCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(itemsPerPage)].map((_, index) => (
        <div key={index} className="w-full">
          <div className="overflow-hidden rounded-3xl shadow-lg h-full w-full animate-pulse">
            {/* Skeleton da imagem */}
            <div className="h-[156px] w-full bg-gray-300"></div>

            {/* Skeleton do conteúdo */}
            <div className="p-4 lg:p-6">
              {/* Skeleton das categorias */}
              <div className="flex gap-1 mb-3">
                <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
              </div>

              {/* Skeleton do nome */}
              <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>

              {/* Skeleton do endereço */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <div className="h-4 w-full bg-gray-300 rounded"></div>
              </div>

              {/* Skeleton do botão */}
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
        {isLoading || loading ? (
          <SkeletonCompanyCards />
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
          companies={paginatedApiCompanies}
          height="h-[778px]"
          width="w-[408px]"
          currentPage={currentPage}
        />
      )}
    </div>
  );
}
