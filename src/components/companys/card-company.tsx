"use client";

import { memo, useCallback, useMemo } from "react";
import Image, { StaticImageData } from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import { useCompanyAnalytics } from "@/provider/analytics/company";
import default_image from "@/assets/default image.webp";

// ==================== INTERFACES ====================
// Interface para categorias da empresa
interface ICompanyCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ICardCompanyData {
  id?: string;
  name: string;
  address: string;
  district?: string;
  company_category: ICompanyCategory[];
  image?: StaticImageData | string;
  phone?: string;
  highlight?: boolean;
}

export interface ICardCompanyProps {
  company: ICardCompanyData;
  className?: string;
  gridIndex?: number;
  section?: string;
  variant?: "default" | "compact" | "detailed";
  onAnalyticsEvent?: (eventData: any) => void;
}

interface IAnalyticsData {
  page: string;
  section: string;
  position: string;
  companyName: string;
  primaryCategory: string;
  allCategories: string[];
  hasMultipleCategories: boolean;
  gridIndex?: number;
  address: string;
  clickType: string;
  targetUrl: string;
  timestamp: string;
  isHighlight?: boolean;
}

// ==================== FUNÇÕES AUXILIARES ====================
/**
 * Gera um slug amigável para URLs
 */
const generateSlug = (text: string): string => {
  if (!text) return "";

  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, ""); // Remove hífens no início e fim
};

/**
 * Processa categorias para garantir formato de array
 */
const processCategories = (category: string[]): string[] => {
  const categoryString = category.join(",");
  const categoryArray = categoryString
    .split(",")
    .map((cat) => cat.trim())
    .filter((cat) => cat.length > 0);
  return categoryArray;
};

/**
 * Formata endereço para exibição
 */

const formatAddress = (address: string, district?: string): string => {
  if (!address) return "Endereço não disponível";

  let formatted = address.replace(/\b\d{5}-?\d{3}\b/g, "").trim();

  formatted = formatted.replace(/[\/-]\s*[A-Z]{2}\b/g, "").trim();

  formatted = formatted
    .replace(/[\/-]\s*[A-Z][a-záêçõãí]+(\s+[A-Z][a-záêçõãí]+)*\s*$/g, "")
    .trim();

  formatted = formatted.replace(/[\/-]\s*$/, "").trim();

  if (district && !formatted.toLowerCase().includes(district.toLowerCase())) {
    formatted = `${formatted} - ${district}`;
  }

  return address;
};

// ==================== COMPONENTE PRINCIPAL ====================
export const CardCompany = memo(function CardCompany({
  company,
  className = "",
  gridIndex,
  section = "company-list",
  variant = "default",
  onAnalyticsEvent,
}: ICardCompanyProps) {
  const company_category_response = company.company_category?.map(
    (cat) => cat.name
  );

  const router = useRouter();
  const pathname = usePathname();

  // Hook de analytics com fallback
  const analytics = useCompanyAnalytics();
  const TrackCompanyClick = analytics?.TrackCompanyClick;

  // Dados processados e memoizados
  const processedData = useMemo(() => {
    const categories = processCategories(company_category_response || []);
    const primaryCategory = categories[0];
    const hasMultipleCategories = categories.length > 1;
    const district = company.district || "Palhoça";
    const companyId = company.id || generateSlug(company.name);
    const companySlug = generateSlug(company.name);
    const districtSlug = generateSlug(district);
    const targetUrl = `/comercio/${districtSlug}/${companySlug}`;
    const formattedAddress = formatAddress(company.address, district);

    return {
      categories,
      primaryCategory,
      hasMultipleCategories,
      district,
      companyId,
      companySlug,
      districtSlug,
      targetUrl,
      formattedAddress,
    };
  }, [company]);

  // Função para registrar analytics
  const trackAnalytics = useCallback(
    (clickType: string) => {
      const analyticsData: IAnalyticsData = {
        page: pathname,
        section,
        position: "company-card",
        companyName: company.name,
        primaryCategory: processedData.primaryCategory,
        allCategories: processedData.categories,
        hasMultipleCategories: processedData.hasMultipleCategories,
        gridIndex,
        address: company.address,
        clickType,
        targetUrl: processedData.targetUrl,
        timestamp: new Date().toISOString(),
        isHighlight: company.highlight,
      };

      // Enviar para analytics interno se disponível
      if (TrackCompanyClick && processedData.companyId) {
        TrackCompanyClick(processedData.companyId, analyticsData);
      }

      // Callback personalizado se fornecido
      onAnalyticsEvent?.(analyticsData);
    },
    [
      pathname,
      section,
      gridIndex,
      company,
      processedData,
      TrackCompanyClick,
      onAnalyticsEvent,
    ]
  );

  // Handler para navegação com analytics
  const handleNavigation = useCallback(
    (clickType: string) => {
      trackAnalytics(clickType);

      // Pequeno delay para garantir envio do analytics
      setTimeout(() => {
        router.push(processedData.targetUrl);
      }, 50);
    },
    [router, processedData.targetUrl, trackAnalytics]
  );

  // Renderização de categorias
  const renderCategories = useMemo(() => {
    const { categories, hasMultipleCategories, primaryCategory } =
      processedData;
    const maxVisible = variant === "detailed" ? 4 : 3;
    const visibleCategories = categories.slice(0, maxVisible);
    const remainingCount = categories.length - maxVisible;

    return (
      <div className="flex flex-wrap gap-1 mb-2">
        {visibleCategories.map((cat, index) => (
          <span
            key={`${cat}-${index}`}
            className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium"
          >
            {cat}
          </span>
        ))}
        {remainingCount > 0 && (
          <span
            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium"
            title={categories.slice(maxVisible).join(", ")}
          >
            +{remainingCount}
          </span>
        )}
      </div>
    );
  }, [processedData, variant]);

  // Classes dinâmicas baseadas na variante
  const cardClasses = useMemo(() => {
    const baseClasses =
      "overflow-hidden rounded-3xl shadow-lg h-full w-full transition-all duration-300";
    const hoverClasses = "hover:shadow-xl hover:transform hover:scale-105";
    const variantClasses = {
      default: "",
      compact: "rounded-2xl",
      detailed: "rounded-3xl shadow-xl",
    };

    return `${baseClasses} ${hoverClasses} ${variantClasses[variant]} ${className}`;
  }, [variant, className]);

  // Altura da imagem baseada na variante
  const imageHeight = variant === "compact" ? "h-[120px]" : "h-[156px]";

  return (
    <article
      data-company-id={processedData.companyId}
      data-company-name={company.name}
      data-company-category={processedData.primaryCategory}
      data-testid="card-company"
      className={cardClasses}
    >
      {/* Imagem clicável */}
      <div
        className={`relative ${imageHeight} w-full cursor-pointer group`}
        onClick={() => handleNavigation("image")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNavigation("image");
          }
        }}
        aria-label={`Ver detalhes de ${company.name}`}
      >
        <Image
          src={company.image || default_image}
          alt={`Imagem de ${company.name}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={gridIndex !== undefined && gridIndex < 4}
        />

        {/* Badge de destaque (opcional) */}
        {company.highlight && (
          <div className="absolute top-2 right-2 bg-green-800 text-amber-50 px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            Destaque
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className={variant === "compact" ? "p-3" : "p-4 lg:p-6"}>
        {/* Categorias */}
        {renderCategories}

        {/* Nome da empresa */}
        <h3
          className={`font-semibold mb-2 cursor-pointer hover:text-red-600 transition-colors line-clamp-1 ${
            processedData.hasMultipleCategories ? "mt-3" : "mt-4"
          } ${
            variant === "compact"
              ? "text-sm lg:text-base"
              : "text-base lg:text-xl"
          }`}
          onClick={() => handleNavigation("title")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleNavigation("title");
            }
          }}
          title={company.name}
        >
          {company.name}
        </h3>

        {/* Endereço */}
        <div className="flex items-start gap-2 text-muted-foreground mb-4">
          <MapPin
            size={variant === "compact" ? 14 : 16}
            className="text-red-500 flex-shrink-0 mt-0.5"
          />
          <span
            className={`line-clamp-2 ${
              variant === "compact" ? "text-xs" : "text-sm"
            }`}
            title={processedData.formattedAddress}
          >
            {processedData.formattedAddress}
          </span>
        </div>

        {/* Botão de ação */}
        <Button
          className="w-full rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
          variant="outline"
          size={variant === "compact" ? "sm" : "default"}
          onClick={() => handleNavigation("button")}
          aria-label={`Ver detalhes de ${company.name}`}
        >
          <Phone className="mr-2 flex-shrink-0" size={16} />
          Ver detalhes
        </Button>
      </div>
    </article>
  );
});

export default CardCompany;
