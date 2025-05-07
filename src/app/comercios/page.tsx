"use client";
import FilteredCommerceList from "@/components/companys/filterCompany";
import DefaultPage from "@/components/default-page";
import Header from "@/components/header";
import CompanyCategoryMenu from "@/components/menus/company-categorys-menu";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
    } else if (pathname?.startsWith("/comercios/")) {
      const categorySlug = pathname.split("/")[2] || "";
      
      if (typeof window !== "undefined" && window.activeCategory) {
        setActiveCategory(window.activeCategory);
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