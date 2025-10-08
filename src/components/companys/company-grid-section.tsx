"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { CardCompany } from "./card-company";
import { usePublicCompany } from "@/provider/company";

interface ICompanyCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface ICompanyImage {
  id: string;
  key: string;
  url: string;
  original_name?: string;
  mime_type?: string;
  size?: number;
  uploaded_at?: Date;
  company_id: string;
}

// Interface para o formato esperado pelo CardCompany (alinhada com ICardCompanyData)
interface IDisplayCompany {
  id: string;
  name: string;
  address: string;
  district?: string;
  company_category: ICompanyCategory[];
  company_image?: ICompanyImage;
  phone?: string;
  highlight?: boolean;
}

export function CompanyGridSection() {
  const pathname = usePathname();
  const { highlightedCompanies, loading, error, listHighlightedCompanies } =
    usePublicCompany();

  // Estado para garantir que só carregamos uma vez
  const [hasLoaded, setHasLoaded] = useState(false);

  // Verificar se está na página de comércios
  const isComercioPage =
    pathname === "/comercio" || pathname?.startsWith("/comercio");

  // Carregar empresas em destaque na inicialização - SEMPRE 4 itens fora de /comercio
  useEffect(() => {
    // Se estiver na página de comércios, não carregar aqui (deixa o outro componente carregar)
    if (isComercioPage) {
      return;
    }

    // Carregar apenas uma vez ou se não tiver dados
    if (!hasLoaded || !highlightedCompanies) {
      listHighlightedCompanies(1, 4); // SEMPRE 4 empresas
      setHasLoaded(true);
    }
  }, [
    isComercioPage,
    hasLoaded,
    highlightedCompanies,
    listHighlightedCompanies,
  ]);

  // Reset quando sair da página de comércios
  useEffect(() => {
    if (!isComercioPage) {
      setHasLoaded(false);
    }
  }, [isComercioPage]);

  // Converter e memoizar dados da API - LIMITAR A 4 EMPRESAS
  const displayCompanies = useMemo<IDisplayCompany[]>(() => {
    if (!highlightedCompanies?.data) return [];

    // GARANTIR que sempre retorna no máximo 4 empresas
    const limitedData = highlightedCompanies.data.slice(0, 4);

    return limitedData.map((company) => {
      return {
        id: company.id,
        name: company.name,
        address: company.address,
        district: company.district,
        company_category: company.company_category || [],
        company_image: company.company_image || undefined,
        phone: company.phone,
        highlight: company.highlight,
      };
    });
  }, [highlightedCompanies]);

  // Estados de carregamento e erro
  if (loading && !highlightedCompanies) {
    return (
      <section className="w-full py-12 max-w-[1272px] mx-auto px-4">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-red-500" size={32} />
        </div>
      </section>
    );
  }

  // Se houver erro
  if (error) {
    return (
      <section className="w-full py-12 max-w-[1272px] mx-auto px-4">
        <div className="text-center py-20">
          <p className="text-gray-600">
            Não foi possível carregar os destaques.
          </p>
        </div>
      </section>
    );
  }

  // Se não houver empresas em destaque
  if (!displayCompanies.length) {
    return null;
  }

  return (
    <section className="w-full mt-32 py-12 max-w-[1272px] mx-auto px-4">
      {/* Linha decorativa */}
      <div className="w-[106px] h-2 bg-red-500 rounded-full" />

      {/* Cabeçalho da seção */}
      <div className="flex flex-col md:flex-row items-start gap-3 md:items-center justify-between">
        <h2 className="text-2xl font-semibold text-red-500 py-6">
          Comércios que são destaques em Palhoça!
        </h2>

        <Link
          href="/comercio"
          className="flex items-center font-semibold gap-2 text-zinc-900 hover:text-red-500 transition-colors group"
        >
          Veja mais
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* Grid de empresas - SEMPRE 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayCompanies.map((company, index) => (
          <CardCompany
            key={company.id}
            company={company}
            gridIndex={index}
            section="featured-companies"
            variant="default"
          />
        ))}
      </div>
    </section>
  );
}

// VERSÃO ALTERNATIVA COM SKELETON LOADING
export function CompanyGridSectionWithSkeleton() {
  const pathname = usePathname();
  const { highlightedCompanies, loading, error, listHighlightedCompanies } =
    usePublicCompany();

  const [hasLoaded, setHasLoaded] = useState(false);
  const isComercioPage =
    pathname === "/comercio" || pathname?.startsWith("/comercio");

  // Carregar empresas - SEMPRE 4 fora de /comercio
  useEffect(() => {
    if (isComercioPage) {
      return;
    }

    if (!hasLoaded || !highlightedCompanies) {
      listHighlightedCompanies(1, 4); // SEMPRE 4 empresas
      setHasLoaded(true);
    }
  }, [
    isComercioPage,
    hasLoaded,
    highlightedCompanies,
    listHighlightedCompanies,
  ]);

  // Reset quando sair de /comercio
  useEffect(() => {
    if (!isComercioPage) {
      setHasLoaded(false);
    }
  }, [isComercioPage]);

  // Converter dados - LIMITAR A 4
  const displayCompanies = useMemo<IDisplayCompany[]>(() => {
    if (!highlightedCompanies?.data) return [];

    // GARANTIR máximo de 4 empresas
    const limitedData = highlightedCompanies.data.slice(0, 4);

    return limitedData.map((company) => ({
      id: company.id,
      name: company.name,
      address: company.address,
      district: company.district,
      company_category: company.company_category || [],
      company_image: company.company_image || undefined,
      phone: company.phone,
      highlight: company.highlight,
    }));
  }, [highlightedCompanies]);

  // Componente Skeleton
  const CompanySkeleton = () => (
    <div className="overflow-hidden rounded-3xl shadow-lg h-full w-full animate-pulse">
      <div className="h-[156px] w-full bg-gray-200"></div>
      <div className="p-4 lg:p-6">
        <div className="flex gap-1 mb-3">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 w-full bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );

  // Se houver erro
  if (error) {
    return (
      <section className="w-full mt-32 py-12 max-w-[1272px] mx-auto px-4">
        <div className="text-center py-20">
          <p className="text-gray-600 mb-4">
            Não foi possível carregar os destaques.
          </p>
          <button
            onClick={() => listHighlightedCompanies(1, 4)}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Tentar novamente
          </button>
        </div>
      </section>
    );
  }

  // Se não houver empresas e não estiver carregando
  if (!loading && !displayCompanies.length) {
    return null;
  }

  return (
    <section className="w-full mt-32 py-12 max-w-[1272px] mx-auto px-4">
      <div className="w-[106px] h-2 bg-red-500 rounded-full" />

      <div className="flex flex-col md:flex-row items-start gap-3 md:items-center justify-between">
        <h2 className="text-2xl font-semibold text-red-500 py-6">
          Comércios que são destaques em Palhoça!
        </h2>

        <Link
          href="/comercio"
          className="flex items-center font-semibold gap-2 text-zinc-900 hover:text-red-500 transition-colors group"
        >
          Veja mais
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && !highlightedCompanies
          ? // Mostrar 4 skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <CompanySkeleton key={`skeleton-${index}`} />
            ))
          : // Mostrar no máximo 4 empresas
            displayCompanies.map((company, index) => (
              <CardCompany
                key={company.id}
                company={company}
                gridIndex={index}
                section="featured-companies"
                variant="default"
              />
            ))}
      </div>
    </section>
  );
}
