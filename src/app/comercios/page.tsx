"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { usePathname } from "next/navigation";
import DefaultPage from "@/components/default-page";
import Header from "@/components/header";
import FilteredCommerceList from "@/components/companys/filterCompany";
import { usePublicCompany } from "@/provider/company";
import DistrictSelect from "@/components/custom-input/custom-select-company";
import { CompanyAnalyticsContext } from "@/provider/analytics/company";

// Definir tipos para window global
declare global {
  interface Window {
    showMap?: boolean;
    activeCategory?: string;
    activeCategoryId?: string;
    toggleMap?: () => void;
  }
}

export default function Comercio() {
  const pathname = usePathname();
  const { companies, loading } = usePublicCompany();
  const { TrackCompanyView } = useContext(CompanyAnalyticsContext);

  const [showMap, setShowMap] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Estados para controle de analytics
  const [hasInitialView, setHasInitialView] = useState(false);
  const trackedCompaniesRef = useRef(new Set<string>());
  const lastFilterStateRef = useRef("");
  const lastPageRef = useRef(1);

  // Analytics: Função para trackear apenas empresas da página atual
  const trackCurrentPageCompanies = (
    viewType: string,
    currentPage: number = 1,
    itemsPerPage: number = 9
  ) => {
    if (!TrackCompanyView || !companies?.data) return;

    // Calcular índices da página atual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Pegar apenas as empresas da página atual
    const currentPageCompanies = companies.data.slice(startIndex, endIndex);

    currentPageCompanies.forEach((company, pageIndex) => {
      const trackingKey = `${viewType}-${currentPage}-${company.id}`;

      if (company.id && !trackedCompaniesRef.current.has(trackingKey)) {
        TrackCompanyView(company.id, {
          page: pathname,
          section: "commerce-page",
          position: "company-list",
          companyName: company.name,
          categories: company.company_category?.map((cat) => cat.name) || [],
          activeCategory: activeCategory,
          selectedDistrict: selectedDistrict,
          showMapMode: showMap,
          gridIndex: pageIndex, // Índice na página (0-8)
          globalIndex: startIndex + pageIndex, // Índice global
          currentPage: currentPage,
          totalPages: Math.ceil(companies.data.length / itemsPerPage),
          itemsPerPage: itemsPerPage,
          totalCompanies: companies.data.length,
          pageCompaniesCount: currentPageCompanies.length,
          viewType: viewType,
          timestamp: new Date().toISOString(),
        });

        // Marcar como já rastreado
        trackedCompaniesRef.current.add(trackingKey);
      }
    });
  };

  // Função para ser chamada quando a página mudar (será passada para o componente de paginação)
  const handlePageChange = (newPage: number) => {
    if (newPage !== lastPageRef.current) {
      // Limpar tracking de paginação anterior
      trackedCompaniesRef.current.forEach((key) => {
        if (key.startsWith("pagination-")) {
          trackedCompaniesRef.current.delete(key);
        }
      });

      // Track da nova página
      trackCurrentPageCompanies("pagination", newPage, 9);
      lastPageRef.current = newPage;
    }
  };

  // Handler para seleção de distrito
  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
  };

  // Gerar título dinâmico
  const getPageTitle = () => {
    if (activeCategory === "Todos") {
      return `Comércios em Palhoça${
        selectedDistrict ? ` - ${selectedDistrict}` : ""
      }`;
    }
    return `${activeCategory} em Palhoça${
      selectedDistrict ? ` - ${selectedDistrict}` : ""
    }`;
  };

  // Efeito para sincronizar com o estado global de mapa
  useEffect(() => {
    const updateMapState = () => {
      if (typeof window !== "undefined" && "showMap" in window) {
        setShowMap(window.showMap === true);
      }
    };

    // Configurar a função toggleMap no objeto window
    if (typeof window !== "undefined") {
      window.toggleMap = () => {
        const newState = !showMap;
        window.showMap = newState;
        setShowMap(newState);
        window.dispatchEvent(new Event("mapToggled"));
      };
    }

    updateMapState();
    window.addEventListener("mapToggled", updateMapState);

    return () => {
      window.removeEventListener("mapToggled", updateMapState);
      // Limpar referência para evitar vazamento de memória
      if (typeof window !== "undefined") {
        window.toggleMap = undefined;
      }
    };
  }, [showMap]);

  // Efeito para definir a categoria ativa com base na URL e dados da API
  useEffect(() => {
    if (pathname === "/comercios") {
      setActiveCategory("Todos");
      if (typeof window !== "undefined") {
        window.activeCategory = "Todos";
      }
    } else if (pathname?.startsWith("/comercios/")) {
      // Extrair categoria da URL se necessário
      const categoryFromUrl = pathname.split("/comercios/")[1];

      // Se há dados de empresas, verificar categorias disponíveis
      if (companies?.data && categoryFromUrl) {
        // Buscar categoria pelo slug/nome na URL
        const allCategories = companies.data.flatMap(
          (company) => company.company_category || []
        );

        const uniqueCategories = allCategories.filter(
          (category, index, self) =>
            index === self.findIndex((c) => c.id === category.id)
        );

        const foundCategory = uniqueCategories.find(
          (cat) =>
            cat.name.toLowerCase().replace(/\s+/g, "-") ===
            categoryFromUrl.toLowerCase()
        );

        if (foundCategory) {
          setActiveCategory(foundCategory.name);
          if (typeof window !== "undefined") {
            window.activeCategory = foundCategory.name;
          }
        }
      }

      // Usar a categoria do estado global se disponível
      if (typeof window !== "undefined" && window.activeCategory) {
        setActiveCategory(window.activeCategory);
      }
    }
  }, [pathname, companies]);

  // Efeito para ouvir as mudanças de categoria
  useEffect(() => {
    const handleCategoryChange = () => {
      if (typeof window !== "undefined" && "activeCategory" in window) {
        setActiveCategory(window.activeCategory || "Todos");
      }
    };

    window.addEventListener("categoryChanged", handleCategoryChange);
    return () =>
      window.removeEventListener("categoryChanged", handleCategoryChange);
  }, []);

  // Analytics: Track inicial da primeira página
  useEffect(() => {
    if (
      !hasInitialView &&
      !loading &&
      companies?.data &&
      companies.data.length > 0
    ) {
      setHasInitialView(true);
      lastPageRef.current = 1;

      // Track apenas da primeira página (9 empresas ou menos)
      trackCurrentPageCompanies("initial", 1, 9);
    }
  }, [companies?.data?.length, hasInitialView, loading]);

  // Analytics: Track quando filtros mudam
  useEffect(() => {
    const currentFilterState = `${activeCategory}|${selectedDistrict}`;

    if (
      hasInitialView &&
      currentFilterState !== lastFilterStateRef.current &&
      lastFilterStateRef.current !== ""
    ) {
      // Limpar tracking anterior de filtros
      trackedCompaniesRef.current.forEach((key) => {
        if (key.startsWith("filter_change-") || key.startsWith("initial-")) {
          trackedCompaniesRef.current.delete(key);
        }
      });

      // Reset para página 1 quando filtros mudam
      lastPageRef.current = 1;

      // Track apenas da primeira página com novos filtros
      trackCurrentPageCompanies("filter_change", 1, 9);
    }

    lastFilterStateRef.current = currentFilterState;
  }, [activeCategory, selectedDistrict]);

  return (
    <DefaultPage>
      <Header />
      <div className="max-w-[1272px] mx-auto px-7 py-5">
        <h1 className="max-w-[756px] text-[29px] font-[600] text-red-600 mb-3">
          {loading ? "Carregando comércios..." : getPageTitle()}
        </h1>
        <FilteredCommerceList
          activeCategory={activeCategory}
          showMap={showMap}
          onPageChange={handlePageChange}
        />
      </div>
    </DefaultPage>
  );
}
