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

  // Analytics: Track inicial das empresas visíveis (APENAS UMA VEZ)
  useEffect(() => {
    if (
      !hasInitialView &&
      companies?.data &&
      companies.data.length > 0 &&
      !loading &&
      TrackCompanyView
    ) {
      console.log(
        "📊 Registrando views iniciais para",
        companies.data.length,
        "empresas"
      );

      // Registra view para todas as empresas da primeira página
      companies.data.forEach((company, index) => {
        if (company.id && !trackedCompaniesRef.current.has(company.id)) {
          TrackCompanyView(company.id, {
            page: pathname,
            section: "commerce-page",
            position: "company-list",
            companyName: company.name,
            categories: company.company_category?.map((cat) => cat.name) || [],
            activeCategory: activeCategory,
            selectedDistrict: selectedDistrict,
            showMapMode: showMap,
            gridIndex: index,
            viewType: "initial",
            timestamp: new Date().toISOString(),
          });

          // Marcar como já rastreado
          trackedCompaniesRef.current.add(company.id);
        }
      });

      setHasInitialView(true);
    }
  }, [companies?.data?.length, hasInitialView, loading]); // Dependências mínimas

  // Analytics: Track quando filtros mudam (sem loop)
  useEffect(() => {
    const currentFilterState = `${activeCategory}|${selectedDistrict}`;

    if (
      hasInitialView &&
      companies?.data &&
      currentFilterState !== lastFilterStateRef.current &&
      lastFilterStateRef.current !== ""
    ) {
      // Não executar na primeira vez

      console.log("🔍 Filtros mudaram:", currentFilterState);

      // Limpar empresas já rastreadas quando filtros mudam
      trackedCompaniesRef.current.clear();

      // Track das empresas com novos filtros
      companies.data.forEach((company, index) => {
        if (company.id && TrackCompanyView) {
          TrackCompanyView(company.id, {
            page: pathname,
            section: "commerce-page",
            position: "company-list",
            companyName: company.name,
            categories: company.company_category?.map((cat) => cat.name) || [],
            activeCategory: activeCategory,
            selectedDistrict: selectedDistrict,
            showMapMode: showMap,
            gridIndex: index,
            viewType: "filter_change",
            timestamp: new Date().toISOString(),
          });

          trackedCompaniesRef.current.add(company.id);
        }
      });
    }

    // Atualizar o estado dos filtros
    lastFilterStateRef.current = currentFilterState;
  }, [activeCategory, selectedDistrict]); // Só quando filtros mudam

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
        />
      </div>
    </DefaultPage>
  );
}
