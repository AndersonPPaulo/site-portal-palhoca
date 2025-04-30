"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Import icons (you'll need to create or source these icons)
import todosIcon from "@/assets/icons/company/todos.png";
import academiaIcon from "@/assets/icons/company/academia.png";
import advogadosIcon from "@/assets/icons/company/advogados.png";
import agenciaViagemIcon from "@/assets/icons/company/agencia-viagem.png";
import alimentacaoIcon from "@/assets/icons/company/alimentacao.png";
import barbeariaIcon from "@/assets/icons/company/barbearia.png";
import baresIcon from "@/assets/icons/company/bares.png";
import casaConstrucaoIcon from "@/assets/icons/company/casa-construcao.png";
import comprasVariasIcon from "@/assets/icons/company/compras-varias.png";
import eletronico from "@/assets/icons/company/eletronico.png";
import empresa_medical from "@/assets/icons/company/empresa-medica.png";
import escola_faculdade from "@/assets/icons/company/escolas-faculdades.png";
import farmacia from "@/assets/icons/company/farmácias.png";
import festa_eventos from "@/assets/icons/company/festas-eventos.png";
import floricultura from "@/assets/icons/company/floricultura.png";
import imobiliaria from "@/assets/icons/company/imobiliárias.png";
import internet_informatica from "@/assets/icons/company/internet-informática.png";
import limpeza_organizacao from "@/assets/icons/company/limpeza-organizacao.png";
import marketing_publicidade from "@/assets/icons/company/marketing-publicidade.png";
import oficina_mecanica from "@/assets/icons/company/oficina-mecanica.png";
import outras from "@/assets/icons/company/outra.png";
import pet_shop from "@/assets/icons/company/pet-shop.png";
import posto_combustivel from "@/assets/icons/company/posto-combustivel.png";
import produto_servico from "@/assets/icons/company/produto-servico.png";
import rest_japones from "@/assets/icons/company/restaurante-japones.png";
import revenda_carros from "@/assets/icons/company/revenda-carros.png";
import saude_beleza from "@/assets/icons/company/saude-beleza.png";
import servico_publico from "@/assets/icons/company/servico-publico.png";
import supermercado from "@/assets/icons/company/supermercado.png";
import viagem_transportes from "@/assets/icons/company/viagem-transporte.png";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import ButtonMap from "./button-map";

// Helper function to normalize text
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, "-"); // Replace spaces with hyphens for URL format
}

export default function CompanyCategoryMenu({
  pathname,
}: {
  pathname: string | null
}) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const categories = [
    { name: "Todos", icon: todosIcon, path: "/comercio" },
    { name: "Academia", icon: academiaIcon, path: "/comercio/academia" },
    { name: "Advogados", icon: advogadosIcon, path: "/comercio/advogados" },
    {
      name: "Agência de viagem",
      icon: agenciaViagemIcon,
      path: "/comercio/agencia-de-viagem",
    },
    {
      name: "Alimentação",
      icon: alimentacaoIcon,
      path: "/comercio/alimentacao",
    },
    { name: "Barbearia", icon: barbeariaIcon, path: "/comercio/barbearia" },
    { name: "Bares", icon: baresIcon, path: "/comercio/bares" },
    {
      name: "Casa e construção",
      icon: casaConstrucaoIcon,
      path: "/comercio/casa-construcao",
    },
    {
      name: "Compras várias",
      icon: comprasVariasIcon,
      path: "/comercio/compras-varias",
    },
    { name: "Eletrônico", icon: eletronico, path: "/comercio/eletronico" },
    {
      name: "Empresa médica",
      icon: empresa_medical,
      path: "/comercio/empresa-medica",
    },
    {
      name: "Escolas e faculdades",
      icon: escola_faculdade,
      path: "/comercio/escolas-faculdades",
    },
    { name: "Farmácia", icon: farmacia, path: "/comercio/farmacia" },
    {
      name: "Festas e eventos",
      icon: festa_eventos,
      path: "/comercio/festas-eventos",
    },
    {
      name: "Floricultura",
      icon: floricultura,
      path: "/comercio/floricultura",
    },
    { name: "Imobiliárias", icon: imobiliaria, path: "/comercio/imobiliarias" },
    {
      name: "Internet e informática",
      icon: internet_informatica,
      path: "/comercio/internet-informatica",
    },
    {
      name: "Limpeza e organização",
      icon: limpeza_organizacao,
      path: "/comercio/limpeza-organizacao",
    },
    {
      name: "Marketing e publicidade",
      icon: marketing_publicidade,
      path: "/comercio/marketing-publicidade",
    },
    {
      name: "Oficina mecânica",
      icon: oficina_mecanica,
      path: "/comercio/oficina-mecanica",
    },
    { name: "Outra", icon: outras, path: "/comercio/outra" },
    { name: "Pet shop", icon: pet_shop, path: "/comercio/pet-shop" },
    {
      name: "Posto de combustível",
      icon: posto_combustivel,
      path: "/comercio/posto-combustivel",
    },
    {
      name: "Produto e serviço",
      icon: produto_servico,
      path: "/comercio/produto-servico",
    },
    {
      name: "Restaurante japonês",
      icon: rest_japones,
      path: "/comercio/restaurante-japones",
    },
    {
      name: "Revenda de carros",
      icon: revenda_carros,
      path: "/comercio/revenda-carros",
    },
    {
      name: "Saúde e beleza",
      icon: saude_beleza,
      path: "/comercio/saude-beleza",
    },
    {
      name: "Serviço público",
      icon: servico_publico,
      path: "/comercio/servico-publico",
    },
    {
      name: "Supermercado",
      icon: supermercado,
      path: "/comercio/supermercado",
    },
    {
      name: "Viagem e transporte",
      icon: viagem_transportes,
      path: "/comercio/viagem-transporte",
    },
  ];

  useEffect(() => {
    // Only process if we're on a commerce route
    if (pathname === "/comercio" || pathname?.startsWith("/comercio/")) {
      if (pathname === "/comercio") {
        setActiveCategory("Todos");
      } else {
        const pathSegments = pathname.split("/");
        const rawPath = pathSegments[2] || "";

        // Find the matching category by comparing normalized paths
        const matchedCategory = categories.find(
          (cat) => normalizeText(cat.name) === rawPath
        );

        if (matchedCategory) {
          setActiveCategory(matchedCategory.name);
        }
      }
    }
  }, [pathname]);

  useEffect(() => {
    // Check if we need to show navigation arrows
    const checkScrollPosition = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
      }
    };

    // Initial check
    checkScrollPosition();

    // Add scroll event listener
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollPosition);
    }

    // Clean up
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Only render this menu on commerce routes
  if (!pathname?.startsWith("/comercio")) {
    return null;
  }

  return (
    <nav className="flex justify-center w-full bg-white mx-auto mt-6 lg:overflow-x-hidden">
      <div className="max-w-[1350px] w-full flex justify-between border-b border-[#E6E6E6] items-center relative">
        {/* Left scroll button */}
        {showLeftArrow && (
          <div className="absolute left-0 h-full hidden lg:flex items-center justify-center z-30">
            <div
              className="h-full w-16 rounded-r-lg"
              style={{
                background:
                  "linear-gradient(to left, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.3))",
              }}
            />
            <Button
              onClick={scrollLeft}
              className="absolute z-40 rounded-full py-5 bg-red-light shadow-md hover:bg-red-light/80 text-red-primary transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </Button>
          </div>
        )}

        <ul
          ref={scrollContainerRef}
          className="flex items-center space-x-4 py-3 lg:mx-10 whitespace-nowrap overflow-x-auto lg:scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => (
            <li key={category.name} className="flex-shrink-0">
              <Link
                href={category.path}
                onClick={() => handleCategoryClick(category.name)}
                className={`flex gap-2 lg:flex-col items-center p-2 transition-colors ${
                  activeCategory === category.name
                    ? "text-[#363636] font-medium border-b-2 border-[#363636]"
                    : "text-[#363636] hover:text-gray-700"
                }`}
              >
                <div className="w-5 h-5 md:w-6 md:h-6 relative">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <span className="text-[12.5px] mt-1">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {showRightArrow && (
          <div className="absolute right-33 h-full hidden lg:flex items-center justify-center z-30">
            <div
              className="h-full w-16 rounded-l-lg"
              style={{
                background:
                  "linear-gradient(to left, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.3))",
              }}
            />
            <Button
              onClick={scrollRight}
              className="absolute z-40 -right-2 rounded-full py-5 bg-red-light shadow-md hover:bg-red-light/80 text-red-primary transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </Button>
          </div>
        )}

          <ButtonMap />
      </div>
    </nav>
  );
}
