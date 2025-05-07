"use client";
import { CardCompany } from "@/components/companys/card-company";
import DefaultPage from "@/components/default-page";
import Header from "@/components/header";
import CompanyCategoryMenu from "@/components/menus/company-categorys-menu";
import { mockCompanys } from "@/utils/mock-data";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Comercio() {
  const pathname = usePathname();
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const updateMapState = () => {
      if (typeof window !== "undefined" && "showMap" in window) {
        setShowMap(window.showMap);
      }
    };

    updateMapState();

    window.addEventListener("mapToggled", updateMapState);

    return () => {
      window.removeEventListener("mapToggled", updateMapState);
    };
  }, []);

  return (
    <DefaultPage>
      <Header />
      <div className="max-w-[1272px] mx-auto px-7 py-2">
        <h1 className="text-[24px] font-[600] text-red-600 mb-3">
          Comércios de Palhoça
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Área de cards - redimensiona quando o mapa está visível */}
          <div
            className={`${
              showMap ? "lg:w-2/3" : "w-full"
            } transition-all duration-300`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mockCompanys.map((company, index) => (
                <div className="w-full" key={index}>
                  <CardCompany company={company} />
                </div>
              ))}
            </div>
          </div>

          {/* Área do mapa - visível apenas quando showMap é true */}
          {showMap && (
            <div className="lg:w-1/3 min-h-full bg-red-600 rounded-lg sticky top-[120px] transition-all duration-300">
              <div className="h-full flex items-center justify-center text-white">
                <p className="text-xl font-bold">Componente de Mapa</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultPage>
  );
}
