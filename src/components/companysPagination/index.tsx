"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function CompanyPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}: PaginationProps) {
  // Funções de navegação
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPage = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Gerar números de página para exibição
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      // Se tiver menos páginas que o máximo de botões, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Estratégia para mostrar páginas em torno da atual
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

      // Ajustar se estivermos próximos do fim
      if (endPage - startPage < maxPageButtons - 1) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      // Adicionar primeira página
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push("...");
      }

      // Adicionar páginas intermediárias
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Adicionar última página
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Se não houver várias páginas, não exibir a paginação
  if (totalPages <= 1) return null;

  // Calcular intervalo de itens sendo exibidos
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`${className} space-y-4 `}>
      {/* Navegação por páginas */}
      <div className="flex justify-center md:gap-2 items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="h-10 w-10 rounded-full cursor-pointer"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4 cursor-pointer" />
        </Button>

        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => goToPage(page)}
              className={`h-10 w-10 rounded-full cursor-pointer ${
                currentPage === page ? "text-white bg-red-600 hover:bg-red-700" : "hover:bg-gray-100"
              }`}
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="px-1">
              {page}
            </span>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="h-10 w-10 rounded-full cursor-pointer"
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Contador de resultados */}
      <div className="text-center text-sm text-muted-foreground">
        Mostrando {start}-{end} de {totalItems} resultados
      </div>
    </div>
  );
}

export default CompanyPagination;
