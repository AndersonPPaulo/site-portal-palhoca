"use client";

import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useContext } from "react";
import { CompanyAnalyticsContext } from "@/provider/analytics/company";
import default_image from "@/assets/default image.webp";

interface CardCompanyProps {
  name: string;
  address: string;
  category: string | string[];
  image: StaticImageData | string;
  id?: string;
}

interface Props {
  company: CardCompanyProps;
  className?: string;
  gridIndex?: number; // Índice na lista/grid (opcional)
  section?: string; // Seção onde o card está sendo exibido
}

export function CardCompany({
  company,
  className,
  gridIndex,
  section = "company-list",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const companyAnalytics = useContext(CompanyAnalyticsContext);

  // Verificação se o contexto está disponível
  if (!companyAnalytics) {
    console.warn(
      "CompanyAnalyticsContext não encontrado. Verifique se o provider está configurado."
    );
  }

  const { TrackCompanyClick } = companyAnalytics || {};

  // Função para processar categorias (string ou array)
  const processCategories = () => {
    if (typeof company.category === "string") {
      return [company.category];
    }
    return company.category || [];
  };

  const categories = processCategories();
  const primaryCategory = categories[0] || "Comércio";
  const hasMultipleCategories = categories.length > 1;

  // Função para gerar slug amigável para URL
  const generateSlug = (text: string): string => {
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  const companyId = company.id || generateSlug(company.name);

  // Analytics: Função para registrar clique
  const handleCompanyClick = (clickType: string) => {
    if (companyId && TrackCompanyClick) {
      TrackCompanyClick(companyId, {
        page: pathname,
        section: section,
        position: "company-card",
        companyName: company.name,
        primaryCategory: primaryCategory,
        allCategories: categories,
        hasMultipleCategories: hasMultipleCategories,
        gridIndex: gridIndex,
        address: company.address,
        clickType: clickType,
        targetUrl: `/comercios/detalhes/${companyId}`,
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Função para redirecionar para a página de detalhes
  const handleViewDetails = (clickType: string = "button") => {
    // Registra o clique antes de navegar
    handleCompanyClick(clickType);

    // Pequeno delay para garantir que o evento seja enviado
    setTimeout(() => {
      router.push(`/comercios/detalhes/${companyId}`);
    }, 100);
  };

  return (
    <div
      data-company-id={companyId}
      data-company-name={company.name}
      data-company-category={primaryCategory}
      className={`overflow-hidden rounded-3xl shadow-lg h-full w-full hover:shadow-xl hover:transform hover:scale-105 transition-all duration-300 ${className}`}
    >
      <div
        className="relative h-[156px] w-full cursor-pointer"
        onClick={() => handleViewDetails("image")}
      >
        <Image
          src={company && company.image ? company.image : default_image}
          alt={company && company.name ? company.name : "Imagem da empresa"}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 lg:p-6">
        {/* Renderização dinâmica das categorias */}
        {hasMultipleCategories ? (
          <div className="flex flex-wrap gap-1 mb-2">
            {categories.slice(0, 3).map((cat, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-500 px-2 py-1 rounded-full text-xs font-medium"
              >
                {cat}
              </span>
            ))}
            {categories.length > 3 && (
              <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-medium">
                +{categories.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full -ms-1">
            {primaryCategory}
          </span>
        )}
        <h3
          className={`text-base lg:text-xl font-semibold mb-2 truncate cursor-pointer hover:text-red-600 transition-colors ${
            hasMultipleCategories ? "mt-3" : "mt-4"
          }`}
          onClick={() => handleViewDetails("title")}
        >
          {company.name}
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin size={16} className="text-red-500 flex-shrink-0" />
          <span className="text-sm truncate">{company.address}</span>
        </div>
        <Button
          className="w-full rounded-full hover:text-red-600 cursor-pointer"
          variant="outline"
          onClick={() => handleViewDetails("button")}
        >
          <Phone className="mr-2 flex-shrink-0" /> Ver detalhes
        </Button>
      </div>
    </div>
  );
}

export default CardCompany;
