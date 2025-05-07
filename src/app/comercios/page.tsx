"use client";
import FilteredCommerceList from "@/components/companys/filterCompany";
import DefaultPage from "@/components/default-page";
import Header from "@/components/header";
import CompanyCategoryMenu from "@/components/menus/company-categorys-menu";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Helper function para normalizar texto
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
}

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!('showMap' in window)) {
        window.showMap = false;
      }
      
      if (!('activeCategory' in window)) {
        window.activeCategory = "Todos";
      }
    }
  }, []);

  useEffect(() => {
    const updateMapState = () => {
      if (typeof window !== "undefined" && 'showMap' in window) {
        setShowMap(window.showMap === true);
      }
    };

    updateMapState();
    window.addEventListener("mapToggled", updateMapState);
    return () => window.removeEventListener("mapToggled", updateMapState);
  }, []);

  useEffect(() => {
    if (pathname === "/comercios") {
      setActiveCategory("Todos");
      if (typeof window !== "undefined") {
        window.activeCategory = "Todos";
      }
    } else if (pathname?.startsWith("/comercios/")) {
      const pathSegments = pathname.split("/");
      const categorySlug = pathSegments[2] || "";
      
      if (categorySlug) {
        const categories = [
          "Academia", "Advogados", "Agência de viagem", "Alimentação", 
          "Barbearia", "Bares", "Casa e construção", "Compras várias",
          "Eletrônico", "Empresa médica", "Escolas e faculdades", "Farmácia",
          "Festas e eventos", "Floricultura", "Imobiliárias", 
          "Internet e informática", "Limpeza e organização", 
          "Marketing e publicidade", "Oficina mecânica", "Outra", 
          "Pet shop", "Posto de combustível", "Produto e serviço",
          "Restaurante japonês", "Revenda de carros", "Saúde e beleza",
          "Serviço público", "Supermercado", "Viagem e transporte"
        ];
        
        const matchedCategory = categories.find(
          cat => normalizeText(cat) === categorySlug
        );
        
        if (matchedCategory) {
          setActiveCategory(matchedCategory);
          if (typeof window !== "undefined") {
            window.activeCategory = matchedCategory;
          }
        }
      }
    }
  }, [pathname]);

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