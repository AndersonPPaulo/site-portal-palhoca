"use client";

import { useEffect, useState, useMemo } from "react";
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
// Interface para o formato esperado pelo CardCompany (alinhada com ICardCompanyData)
interface IDisplayCompany {
  id: string;
  name: string;
  address: string;
  district?: string;
  company_category: ICompanyCategory[];
  image?: string;
  phone?: string;
  highlight?: boolean;
}

export function CompanyGridSection() {
  const { highlightedCompanies, loading, error, listHighlightedCompanies } =
    usePublicCompany();

  // Carregar empresas em destaque na inicialização
  useEffect(() => {
    // Carregar apenas se ainda não tiver dados
    if (!highlightedCompanies) {
      listHighlightedCompanies(1, 4); // Carregar apenas 4 destaques
    }
  }, [highlightedCompanies, listHighlightedCompanies]);

  // Converter e memoizar dados da API para o formato esperado pelo CardCompany
  const displayCompanies = useMemo<IDisplayCompany[]>(() => {
    if (!highlightedCompanies?.data) return [];

    return highlightedCompanies.data.map((company) => {
      // Extrair todas as categorias
      const allCategories = company.company_category?.map(
        (cat) => cat.name
      ) || ["Comércio"];

      return {
        id: company.id,
        name: company.name,
        address: company.address,
        district: company.district,
        company_category: company.company_category || [],
        image:
          company.company_image?.url || company.company_image?.original_name,
        phone: company.phone,
        highlight: company.highlight, // Sempre true para highlightedCompanies
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
    return null; // Não exibir a seção se não houver destaques
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

      {/* Grid de empresas */}
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

// =====================================================
// VERSÃO ALTERNATIVA COM SKELETON LOADING
// =====================================================

export function CompanyGridSectionWithSkeleton() {
  const { highlightedCompanies, loading, error, listHighlightedCompanies } =
    usePublicCompany();

  // Carregar empresas em destaque na inicialização
  useEffect(() => {
    if (!highlightedCompanies) {
      listHighlightedCompanies(1, 4);
    }
  }, [highlightedCompanies, listHighlightedCompanies]);

  // Converter dados
  const displayCompanies = useMemo<IDisplayCompany[]>(() => {
    if (!highlightedCompanies?.data) return [];

    return highlightedCompanies.data.map((company) => {
      const allCategories = company.company_category?.map(
        (cat) => cat.name
      ) || ["Comércio"];

      return {
        id: company.id,
        name: company.name,
        address: company.address,
        district: company.district,
        company_category: company.company_category || [],
        image:
          company.company_image?.url || company.company_image?.original_name,
        phone: company.phone,
        highlight: company.highlight,
      };
    });
  }, [highlightedCompanies]);

  // Componente Skeleton que imita o visual do CardCompany
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
          ? // Mostrar skeletons enquanto carrega
            Array.from({ length: 4 }).map((_, index) => (
              <CompanySkeleton key={`skeleton-${index}`} />
            ))
          : // Mostrar empresas com props otimizadas
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
