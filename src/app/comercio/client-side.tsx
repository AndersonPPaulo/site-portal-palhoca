"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import DefaultPage from "@/components/default-page";
import Header from "@/components/header";
import FilteredCommerceList from "@/components/companys/filterCompany";
import { usePublicCompany } from "@/provider/company";
import { CompanyAnalyticsContext } from "@/provider/analytics/company";
import SlugToText from "@/utils/slugToText";

type TrackCompanyViewParams = {
  page: string;
  section: string;
  position: string;
  companyName: string;
  categories: string[];
  activeCategory: string;
  selectedDistrict: string;
  showMapMode: boolean;
  gridIndex: number;
  globalIndex: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalCompanies: number;
  pageCompaniesCount: number;
  viewType: string;
  timestamp: string;
};

// Definir tipos para window global
declare global {
  interface Window {
    showMap?: boolean;
    activeCategory?: string;
    activeCategoryId?: string;
    toggleMap?: () => void;
  }
}

export default function ClientListArticlesByCategory() {
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get("categoria");

  const { companies, loading } = usePublicCompany();
  const { TrackCompanyView } = useContext(CompanyAnalyticsContext);

  const [showMap, setShowMap] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const trackCompanyViews = (
    companies: any[],
    viewType: string,
    page: number = 1,
    itemsPerPage: number = 9
  ) => {
    if (!TrackCompanyView || !companies?.length) return;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageCompanies = companies.slice(startIndex, endIndex);

    pageCompanies.forEach((company, index) => {
      if (company.id) {
        TrackCompanyView(
          company.id as string,
          {
            page: pathname,
            section: "commerce-page",
            position: "company-list",
            companyName: company.name as string,
            categories: (company.company_category?.map(
              (cat: { name: string }) => cat.name
            ) || []) as string[],
            activeCategory: categoryQuery ? categoryQuery : "Todos",
            selectedDistrict: selectedDistrict as string,
            showMapMode: showMap as boolean,
            gridIndex: index as number,
            globalIndex: (startIndex + index) as number,
            currentPage: page as number,
            totalPages: Math.ceil(companies.length / itemsPerPage) as number,
            itemsPerPage: itemsPerPage as number,
            totalCompanies: companies.length as number,
            pageCompaniesCount: pageCompanies.length as number,
            viewType: viewType as string,
            timestamp: new Date().toISOString(),
          } as TrackCompanyViewParams
        );
      }
    });
  };

  // Handler para mudança de página
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (companies?.data) {
      trackCompanyViews(companies.data, "pagination", newPage, 9);
    }
  };

  const capitalize = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Gerar título dinâmico
  const getPageTitle = () => {
    const activeCategory =
      categoryQuery === undefined ? "Todos" : categoryQuery;

    if (activeCategory === "Todos") {
      return `Comércios em Palhoça${
        selectedDistrict ? ` - ${selectedDistrict}` : ""
      }`;
    }
    return `${
      activeCategory ? capitalize(SlugToText(activeCategory)) : "Comércios"
    } em Palhoça${selectedDistrict ? ` - ${selectedDistrict}` : ""}`;
  };

  // Configurar mapa global
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.showMap = showMap;
      window.toggleMap = () => {
        const newState = !showMap;
        setShowMap(newState);
        window.showMap = newState;
        window.dispatchEvent(new Event("mapToggled"));
      };

      const handleMapToggle = () => {
        setShowMap(window.showMap === true);
      };

      window.addEventListener("mapToggled", handleMapToggle);
      return () => {
        window.removeEventListener("mapToggled", handleMapToggle);
      };
    }
  }, [showMap]);

  // Analytics inicial
  useEffect(() => {
    if (!loading && companies?.data?.length && currentPage === 1) {
      trackCompanyViews(companies.data, "initial", 1, 9);
    }
  }, [companies?.data?.length, loading]);

  // Listener para mudanças de distrito
  useEffect(() => {
    const handleDistrictChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSelectedDistrict(customEvent.detail);
      setCurrentPage(1);

      // Track mudança de filtro
      if (companies?.data) {
        trackCompanyViews(companies.data, "filter_change", 1, 9);
      }
    };

    window.addEventListener("districtSelected", handleDistrictChange);
    return () =>
      window.removeEventListener("districtSelected", handleDistrictChange);
  }, [companies?.data]);

  return (
    <DefaultPage>
      <Header />
      <div className="max-w-[1272px] mx-auto px-7 py-5">
        <h1 className="max-w-[756px] text-[29px] font-[600] text-red-600 mb-3">
          {loading ? "Carregando comércios..." : getPageTitle()}
        </h1>
        <FilteredCommerceList
          activeCategory={categoryQuery ? categoryQuery : "Todos"}
          showMap={showMap}
          onPageChange={handlePageChange}
        />
      </div>
    </DefaultPage>
  );
}
