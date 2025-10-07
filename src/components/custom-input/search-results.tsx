"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArticleResponse } from "@/provider/article";
import { formatDate } from "@/utils/formatDate";
import default_image from "@/assets/no-img.png";

interface SearchResultsProps {
  isVisible: boolean;
  searchTerm: string;
  publishedArticlesBySearch: ArticleResponse | null;
  onPageChange: (page: number) => void;
}

export default function SearchResults({
  isVisible,
  searchTerm,
  publishedArticlesBySearch,
  onPageChange,
}: SearchResultsProps) {
  const router = useRouter();

  if (
    !isVisible ||
    !searchTerm.trim() ||
    !publishedArticlesBySearch?.data?.length
  ) {
    return null;
  }

  const { data: articles, meta } = publishedArticlesBySearch;

  // Otimização: useCallback para evitar re-renders desnecessários
  const handlePageChange = useCallback(
    (page: number) => {
      onPageChange(page);
    },
    [onPageChange]
  );

  // Função para converter nome em slug
  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");
  };

  // Navegação otimizada com prefetch automático usando categoria e slug
  const handleArticleClick = useCallback(
    (article: any, event: React.MouseEvent) => {
      const categorySlug =
        article.category?.slug ||
        createSlug(article.category?.name || "noticia");
      const articleSlug = article.slug || createSlug(article.title);
      const url = `/noticia/${categorySlug}/${articleSlug}`;

      // Permitir Ctrl+Click ou Command+Click para abrir em nova aba
      if (event.metaKey || event.ctrlKey) {
        window.open(url, "_blank");
        return;
      }

      // Navegação normal
      router.push(url);
    },
    [router]
  );

  // Suporte a navegação por teclado (acessibilidade)
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, article: any) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const categorySlug =
          article.category?.slug ||
          createSlug(article.category?.name || "noticia");
        const articleSlug = article.slug || createSlug(article.title);
        router.push(`/noticia/${categorySlug}/${articleSlug}`);
      }
    },
    [router]
  );

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-2">
      <Card className="w-full shadow-2xl border-0 p-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 border-b rounded-t-2xl bg-gradient-to-r from-blue-50 to-indigo-50">
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
                onClick={(e) => handleArticleClick(article, e)}
                onKeyDown={(e) => handleKeyDown(e, article)}
                tabIndex={0}
                role="button"
                aria-label={`Ler artigo: ${article.title}`}
                className={cn(
                  "flex gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-all cursor-pointer group",
                  index === articles.length - 1 && "border-b-0"
                )}
              >
                {/* Image com Link interno para melhor SEO */}
                <div className="w-28 h-28 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 group-hover:shadow-md transition-shadow">
                  <img
                    src={
                      article && article.thumbnail && article.thumbnail.url
                        ? article.thumbnail.url
                        : default_image
                    }
                    alt={
                      article && article.title && article.title
                        ? article.title
                        : "Imagem do portal palhoça"
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between space-y-2 w-full">
                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
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

                {/* Link invisível para melhor SEO e acessibilidade */}
                <Link
                  href={`/noticia/${
                    article.category?.slug ||
                    createSlug(article.category?.name || "noticia")
                  }/${article.slug || createSlug(article.title)}`}
                  className="sr-only"
                  tabIndex={-1}
                  prefetch={true}
                >
                  {article.title}
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {publishedArticlesBySearch.meta.totalPages > 1 && (
            <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Página {publishedArticlesBySearch.meta.page} de{" "}
                  {publishedArticlesBySearch.meta.totalPages}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePageChange(publishedArticlesBySearch.meta.page - 1);
                    }}
                    disabled={publishedArticlesBySearch.meta.page <= 1}
                    className="h-8 w-8 p-0 cursor-pointer"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft size={14} />
                  </Button>

                  <div className="flex items-center gap-1">
                    {publishedArticlesBySearch.meta.totalPages <= 7 ? (
                      Array.from(
                        { length: publishedArticlesBySearch.meta.totalPages },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePageChange(pageNum);
                              }}
                              className={`h-8 w-8 p-0 text-xs cursor-pointer ${
                                pageNum === publishedArticlesBySearch.meta.page
                                  ? "text-primary border-primary"
                                  : ""
                              }`}
                              aria-label={`Ir para página ${pageNum}`}
                              aria-current={
                                pageNum === publishedArticlesBySearch.meta.page
                                  ? "page"
                                  : undefined
                              }
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )
                    ) : (
                      <>
                        <Button
                          variant={
                            publishedArticlesBySearch.meta.page === 1
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePageChange(1);
                          }}
                          className="h-8 w-8 p-0 text-xs cursor-pointer"
                          aria-label="Primeira página"
                        >
                          1
                        </Button>

                        {publishedArticlesBySearch.meta.page > 4 && (
                          <span className="px-1">...</span>
                        )}

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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePageChange(pageNum);
                                }}
                                className={`h-8 w-8 p-0 text-xs cursor-pointer ${
                                  pageNum ===
                                  publishedArticlesBySearch.meta.page
                                    ? "text-primary border-primary"
                                    : ""
                                }`}
                                aria-label={`Ir para página ${pageNum}`}
                                aria-current={
                                  pageNum ===
                                  publishedArticlesBySearch.meta.page
                                    ? "page"
                                    : undefined
                                }
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                          return null;
                        })}

                        {publishedArticlesBySearch.meta.page <
                          publishedArticlesBySearch.meta.totalPages - 3 && (
                          <span className="px-1">...</span>
                        )}

                        <Button
                          variant={
                            publishedArticlesBySearch.meta.page ===
                            publishedArticlesBySearch.meta.totalPages
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePageChange(
                              publishedArticlesBySearch.meta.totalPages
                            );
                          }}
                          className="h-8 w-8 p-0 text-xs cursor-pointer"
                          aria-label="Última página"
                        >
                          {publishedArticlesBySearch.meta.totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePageChange(publishedArticlesBySearch.meta.page + 1);
                    }}
                    disabled={
                      publishedArticlesBySearch.meta.page >=
                      publishedArticlesBySearch.meta.totalPages
                    }
                    className="h-8 w-8 p-0 cursor-pointer"
                    aria-label="Próxima página"
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
