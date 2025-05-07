"use client";

import { useState, useEffect } from "react";
import { mockCompanys } from "@/utils/mock-data";
import { CardCompany } from "@/components/companys/card-company";
import { X, AlertCircle } from "lucide-react";

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
  showMap 
}: FilteredCommerceListProps) {
  interface Company {
    name: string;
    address: string;
    category: string;
    image: any;
  }

  const typedMockCompanys = mockCompanys as Company[];
  
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [categoryExists, setCategoryExists] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Lista de categorias válidas
  const validCategories = [
    "Todos", "Academia", "Advogados", "Agência de viagem", "Alimentação", 
    "Barbearia", "Bares", "Casa e construção", "Compras várias",
    "Eletrônico", "Empresa médica", "Escolas e faculdades", "Farmácia",
    "Festas e eventos", "Floricultura", "Imobiliárias", 
    "Internet e informática", "Limpeza e organização", 
    "Marketing e publicidade", "Oficina mecânica", "Outra", 
    "Pet shop", "Posto de combustível", "Produto e serviço",
    "Restaurante japonês", "Revenda de carros", "Saúde e beleza",
    "Serviço público", "Supermercado", "Viagem e transporte"
  ];

  // Correção importante: iniciar com array vazio e mostrar loading até verificar a categoria
  useEffect(() => {
    // Primeiro, definir loading para true antes de qualquer verificação
    setIsLoading(true);
    
    // Dar um curto timeout para garantir que a UI mostre o estado de loading
    const timer = setTimeout(() => {
      // Verificar se a categoria existe na lista de categorias válidas
      const categoryNormalized = normalizeText(activeCategory);
      const categoryValid = validCategories.some(cat => 
        normalizeText(cat) === categoryNormalized
      ) || activeCategory === "Todos";
      
      setCategoryExists(categoryValid);
      
      // Filtrar os comércios se a categoria existe
      if (categoryValid) {
        if (activeCategory === "Todos") {
          setFilteredCompanies(typedMockCompanys);
        } else {
          const filtered = typedMockCompanys.filter(
            company => normalizeText(company.category) === categoryNormalized
          );
          
          // Mostra apenas os resultados filtrados
          setFilteredCompanies(filtered);
        }
      } else {
        // Se a categoria não existir, a lista fica vazia
        setFilteredCompanies([]);
      }
      
      setIsLoading(false);
    }, 10); // Um pequeno delay para garantir que a UI mostre o loading state
    
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const closeMap = () => {
    if (typeof window !== "undefined") {
      const win = window as any;
      if (win.toggleMap) {
        win.toggleMap();
      }
    }
  };

  // Componente para mensagem de categoria não encontrada
  const CategoryNotFoundMessage = () => (
    <div className="w-full py-12 text-center bg-red-50 rounded-lg border border-red-200 px-4">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-red-600 mb-2">Categoria não encontrada</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        A categoria <strong>"{activeCategory}"</strong> não existe em nosso sistema.
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

  // Componente para mensagem de categoria sem comércios
  const NoCommercesMessage = () => (
    <div className="w-full py-12 text-center bg-red-50 rounded-lg border border-red-200 px-4">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-red-600 mb-2">Nenhum comércio encontrado</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Não encontramos comércios cadastrados na categoria <strong>"{activeCategory}"</strong>.
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
      <div className="animate-spin inline-block w-10 h-10 border-4 border-current border-t-transparent text-red-600 rounded-full" role="status">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCompanies.map((company, index) => (
              <div className="w-full" key={index}>
                <CardCompany company={company} />
              </div>
            ))}
          </div>
        ) : (
          <NoCommercesMessage />
        )}
      </div>

      {showMap && (
        <div className="lg:sticky lg:top-20 w-full lg:w-1/3 h-[350px] lg:h-[500px] bg-red-600 rounded-lg shadow-xl mb-5 self-start">
          <div className="h-full flex items-center justify-center text-white relative">
            <button 
              className="absolute top-2 right-2 bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
              onClick={closeMap}
            >
              <X className="h-4 w-4 text-white" />
            </button>
            <p className="text-xl font-bold">Componente de Mapa</p>
          </div>
        </div>
      )}
    </div>
  );
}