"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArticleResponse } from "@/provider/article";
import { formatDate } from "@/utils/formatDate";

interface SearchResultsProps {
  isVisible: boolean;
  searchTerm: string;
  publishedArticlesBySearch: ArticleResponse | null;
  onPageChange: (page: number) => void; // <-- adicione isso
}

export default function SearchResults({
  isVisible,
  searchTerm,
  publishedArticlesBySearch,
  onPageChange,
}: SearchResultsProps) {
  if (
    !isVisible ||
    !searchTerm.trim() ||
    !publishedArticlesBySearch?.data?.length
  ) {
    return null;
  }

  const { data: articles, meta } = publishedArticlesBySearch;

  const handlePageChange = (page: number) => {
    onPageChange(page); // <-- executa a função que realmente faz o fetch
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-2">
      <Card className="w-full shadow-2xl border-0 p-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Resultados da pesquisa
              </h3>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {meta.total} {meta.total === 1 ? "resultado" : "resultados"}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Pesquisando por:{" "}
              <span className="font-medium">"{searchTerm}"</span>
            </p>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto">
            {articles.map((article: any, index: number) => (
              <div
                key={article.id || index}
                className={cn(
                  "flex gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer",
                  index === articles.length - 1 && "border-b-0"
                )}
              >
                {/* Image */}
                <div className="w-28 h-28 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={article.thumbnail.url || "/placeholder.png"}
                    alt={
                      article.thumbnail.description ||
                      "imagem da noticia publicada"
                    }
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between space-y-2 w-full">
                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <h4 className="text-md text-gray-600 line-clamp-2">
                    {article.resume_content}
                  </h4>

                  {/* Description */}
                  {article.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {truncateText(article.description, 150)}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    {article.author && (
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{article.author}</span>
                      </div>
                    )}

                    {article.category && (
                      <span className="w-min text-xs bg-secondary text-primary px-3 py-1 rounded-2xl">
                        {article.category.name}
                      </span>
                    )}

                    {article.created_at && (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{formatDate(article.created_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {publishedArticlesBySearch.meta.totalPages > 1 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Página {publishedArticlesBySearch.meta.page} de{" "}
                  {publishedArticlesBySearch.meta.totalPages}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(publishedArticlesBySearch.meta.page - 1)
                    }
                    disabled={publishedArticlesBySearch.meta.page <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft size={14} />
                  </Button>

                  <div className="flex items-center gap-1">
                    {publishedArticlesBySearch.meta.totalPages <= 7 ? (
                      // Caso simples: poucas páginas, mostra todas
                      Array.from(
                        { length: publishedArticlesBySearch.meta.totalPages },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className={`h-8 w-8 p-0 text-xs ${
                                pageNum && "border-primary text-primary"
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )
                    ) : (
                      <>
                        {/* Primeiro botão */}
                        <Button
                          variant={
                            publishedArticlesBySearch.meta.page === 1
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(1)}
                          className="h-8 w-8 p-0 text-xs"
                        >
                          1
                        </Button>

                        {/* Reticências após o primeiro botão */}
                        {publishedArticlesBySearch.meta.page > 4 && (
                          <span className="px-1">...</span>
                        )}

                        {/* Janela de 3 páginas antes e depois do atual */}
                        {Array.from({ length: 5 }, (_, i) => {
                          const pageNum =
                            publishedArticlesBySearch.meta.page - 2 + i;
                          if (
                            pageNum > 1 &&
                            pageNum < publishedArticlesBySearch.meta.totalPages
                          ) {
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  pageNum ===
                                  publishedArticlesBySearch.meta.page
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                                className="h-8 w-8 p-0 text-xs"
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                          return null;
                        })}

                        {/* Reticências antes do último botão */}
                        {publishedArticlesBySearch.meta.page <
                          publishedArticlesBySearch.meta.totalPages - 3 && (
                          <span className="px-1">...</span>
                        )}

                        {/* Último botão */}
                        <Button
                          variant={
                            publishedArticlesBySearch.meta.page ===
                            publishedArticlesBySearch.meta.totalPages
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handlePageChange(
                              publishedArticlesBySearch.meta.totalPages
                            )
                          }
                          className="h-8 w-8 p-0 text-xs"
                        >
                          {publishedArticlesBySearch.meta.totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(publishedArticlesBySearch.meta.page + 1)
                    }
                    disabled={
                      publishedArticlesBySearch.meta.page >=
                      publishedArticlesBySearch.meta.totalPages
                    }
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
