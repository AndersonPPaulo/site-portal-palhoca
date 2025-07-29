import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

// ICONS
import agendaIcon from "@/assets/icons/agenda.png";
import comunidadeIcon from "@/assets/icons/comunidade.png";
import economiaIcon from "@/assets/icons/economia.png";
import educacaoIcon from "@/assets/icons/educacao.png";
import esportesIcon from "@/assets/icons/esportes.png";
import estiloIcon from "@/assets/icons/estilo.png";
import policiaIcon from "@/assets/icons/policia.png";
import politicaIcon from "@/assets/icons/politica.png";
import saudeIcon from "@/assets/icons/saude.png";
import transitoIcon from "@/assets/icons/transito.png";
import variedadesIcon from "@/assets/icons/variedades.png";
import todosIcon from "@/assets/icons/todos.png"; 

// Helper function to normalize text (remove accents, special chars)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, ""); // Remove spaces
}

export default function NewsCategoryMenu({ pathname }: { pathname: string | null }) {
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    // Parse the current path and set active category on component mount or pathname change
    if (pathname === "/") {
      setActiveCategory("Todos");
    } else {
      const pathSegments = pathname!.split("/");
      const rawPath = pathSegments[2] || "";

      // Find the matching category by comparing normalized names
      const matchedCategory = categories.find(
        (cat) => normalizeText(cat.name) === normalizeText(rawPath)
      );

      if (matchedCategory) {
        setActiveCategory(matchedCategory.name);
      }
    }
  }, [pathname]);

  const categories = [
    { name: "Todos", icon: todosIcon, path: "/" },
    { name: "Agenda", icon: agendaIcon, path: "/noticia/agenda" },
    { name: "Comunidade", icon: comunidadeIcon, path: "/noticia/comunidade" },
    { name: "Economia", icon: economiaIcon, path: "/noticia/economia" },
    { name: "Educação", icon: educacaoIcon, path: "/noticia/educacao" },
    { name: "Esporte", icon: esportesIcon, path: "/noticia/esporte" },
    { name: "Estilo", icon: estiloIcon, path: "/noticia/estilo" },
    { name: "Polícia", icon: policiaIcon, path: "/noticia/policia" },
    { name: "Política", icon: politicaIcon, path: "/noticia/politica" },
    { name: "Saúde", icon: saudeIcon, path: "/noticia/saude" },
    { name: "Trânsito", icon: transitoIcon, path: "/noticia/transito" },
    { name: "Variedades", icon: variedadesIcon, path: "/noticia/variedades" },
  ];

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  return (
    <nav className="flex xl:justify-center w-full bg-white overflow-x-auto mx-auto mt-6">
      <ul className="flex space-x-4 pt-3 whitespace-nowrap border-b border-[#E6E6E6] xl:min-w-[1220px] lg:justify-between">
        {categories.map((category) => (
          <li
            key={category.name}
            className={` px-2 ${
              activeCategory === category.name
                ? "border-b-2 border-gray-300"
                : ""
            }`}
          >
            <Link
              href={category.path}
              onClick={() => handleCategoryClick(category.name)}
              className={`flex gap-2 lg:flex lg:flex-col items-center p-2 rounded-lg transition-colors ${
                activeCategory === category.name
                  ? "text-gray-600 font-medium"
                  : "text-gray-600 hover:text-gray-700"
              }`}
            >
              <div className="w-6 h-6 relative">
                <Image
                  src={category.icon}
                  alt={category.name}
                  unoptimized
                  width={24}
                  height={24}
                />
              </div>
              <span className="text-xs mt-1">{category.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
