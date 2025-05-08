"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import DefaultPage from "@/components/default-page";
import Header from "@/components/header";
import CompanyCategoryMenu from "@/components/menus/company-categorys-menu";
import FilteredCommerceList from "@/components/companys/filterCompany";

// Definir tipos para window global
declare global {
  interface Window {
    showMap?: boolean;
    activeCategory?: string;
    toggleMap?: () => void;
  }
}

export default function Comercio() {
  const pathname = usePathname();
  const [showMap, setShowMap] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");

  // Efeito para sincronizar com o estado global de mapa
  useEffect(() => {
    const updateMapState = () => {
      if (typeof window !== "undefined" && 'showMap' in window) {
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

  // Efeito para definir a categoria ativa com base na URL
  useEffect(() => {
    if (pathname === "/comercios") {
      setActiveCategory("Todos");
    } else if (pathname?.startsWith("/comercios/")) {
      // Usar a categoria da URL ou do estado global
      if (typeof window !== "undefined" && window.activeCategory) {
        setActiveCategory(window.activeCategory);
      }
    }
  }, [pathname]);

  // Efeito para ouvir as mudanças de categoria
  useEffect(() => {
    const handleCategoryChange = () => {
      if (typeof window !== "undefined" && 'activeCategory' in window) {
        setActiveCategory(window.activeCategory || "Todos");
      }
    };
  
    window.addEventListener("categoryChanged", handleCategoryChange);
    return () => window.removeEventListener("categoryChanged", handleCategoryChange);
  }, []);

  return (
    <DefaultPage>
      <Header />
      <div className="max-w-[1272px] mx-auto px-7 py-5">
        <h1 className="max-w-[756px] text-[29px] font-[600] text-red-600 mb-3">
          {activeCategory === "Todos" 
            ? "Comércios de Palhoça" 
            : `Comércios de Palhoça - ${activeCategory}`}
        </h1>
        <FilteredCommerceList
          activeCategory={activeCategory}
          showMap={showMap}
        />
      </div>
    </DefaultPage>
  );
}