/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ColumnistContext } from "@/provider/columnist";
import { ArticleContext } from "@/provider/article";
import Image from "next/image";
import Link from "next/link";
import normalizeTextToslug from "@/utils/normalize-text-to-slug";
import { formatDate } from "@/utils/formatDate";
import default_image from "@/assets/no-img.png";
import DefaultPage from "@/components/default-page";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import PostBanner from "@/components/banner/post-banner";

export default function ColumnistPage() {
  const { id } = useParams();
  const {
    GetColumnistArticles,
    columnistArticles,
    loading,
    columnists,
    GetColumnists,
  } = useContext(ColumnistContext);
  const { GetPublishedArticles, publishedArticles } =
    useContext(ArticleContext);
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  useEffect(() => {
    if (id && typeof id === "string") {
      GetColumnistArticles(id, page, LIMIT);
    }
  }, [id, page]);

  useEffect(() => {
    if (!columnists) {
      GetColumnists(100);
    }
    // Buscar artigos mais lidos para o sidebar
    GetPublishedArticles({ page: 1, limit: 5, highlight: false });
  }, []);

  const columnist = columnists?.find((c) => c.id === id);
  const sidebarArticles = publishedArticles?.data?.slice(0, 5) || [];

  return (
    <DefaultPage>
      <Header />
      <main>
        {/* Conteúdo Principal */}
        <section className="flex flex-col lg:flex-row gap-6 mx-auto max-w-7xl px-4 py-8">
          {/* Coluna Principal - Colunista */}
          <div className="flex-1">
            {/* Cabeçalho do Colunista */}
            {columnist && (
              <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-xl border-2 border-primary/20 mb-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  {columnist?.user_image?.url ? (
                    <Image
                      src={columnist.user_image.url}
                      alt={columnist.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src={default_image}
                      alt={columnist?.name || "Colunista"}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">
                    {columnist?.name}
                  </h1>
                  {columnist?.topic && (
                    <p className="text-lg text-gray-600 mt-1">
                      {columnist.topic}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Artigos do Colunista */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Artigos</h2>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <p className="text-gray-500">Carregando artigos...</p>
                </div>
              ) : columnistArticles && columnistArticles.data.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {columnistArticles.data.slice(0, 6).map((article) => (
                      <Link
                        key={article.id}
                        href={`/noticia/${normalizeTextToslug(
                          article.category.name,
                        )}/${article.slug}`}
                        className="flex flex-col gap-3 rounded-xl p-2 transition hover:shadow-lg hover:transform hover:scale-105"
                      >
                        <div className="relative w-full h-[200px] rounded-md overflow-hidden">
                          {article.thumbnail?.url ? (
                            <Image
                              src={article.thumbnail.url}
                              alt={article.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <Image
                              src={default_image}
                              alt={article.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="text-xl font-semibold leading-tight line-clamp-2">
                            {article.title}
                          </h3>
                          {article.resume_content && (
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {article.resume_content}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs bg-secondary text-primary px-3 py-1 rounded-2xl">
                              {article.category.name}
                            </span>
                            <p className="text-xs text-gray-500">
                              {formatDate(article.created_at)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Banner no meio */}
                  {columnistArticles.data.length > 6 && (
                    <div className="my-8">
                      <PostBanner />
                    </div>
                  )}

                  {/* Restante dos artigos */}
                  {columnistArticles.data.length > 6 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {columnistArticles.data.slice(6).map((article) => (
                        <Link
                          key={article.id}
                          href={`/noticia/${normalizeTextToslug(
                            article.category.name,
                          )}/${article.slug}`}
                          className="flex flex-col gap-3 rounded-xl p-2 transition hover:shadow-lg hover:transform hover:scale-105"
                        >
                          <div className="relative w-full h-[200px] rounded-md overflow-hidden">
                            {article.thumbnail?.url ? (
                              <Image
                                src={article.thumbnail.url}
                                alt={article.title}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <Image
                                src={default_image}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-semibold leading-tight line-clamp-2">
                              {article.title}
                            </h3>
                            {article.resume_content && (
                              <p className="text-sm text-gray-600 line-clamp-3">
                                {article.resume_content}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs bg-secondary text-primary px-3 py-1 rounded-2xl">
                                {article.category.name}
                              </span>
                              <p className="text-xs text-gray-500">
                                {formatDate(article.created_at)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Paginação */}
                  {columnistArticles.meta.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition"
                      >
                        Anterior
                      </button>
                      <span className="px-4 py-2 text-gray-600 font-semibold">
                        Página {page} de {columnistArticles.meta.totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setPage((p) =>
                            Math.min(columnistArticles.meta.totalPages, p + 1),
                          )
                        }
                        disabled={page === columnistArticles.meta.totalPages}
                        className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition"
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center py-20">
                  <p className="text-gray-500">Nenhum artigo encontrado</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Notícias Mais Lidas */}
          <aside className="w-full lg:w-[356px]">
            <div className="sticky top-4">
              <h3 className="text-2xl font-bold mb-4">Mais Lidas</h3>
              <div className="shadow-md rounded-xl overflow-hidden">
                {sidebarArticles.map((article, idx) => (
                  <Link
                    key={article.id}
                    href={`/noticia/${normalizeTextToslug(
                      article.category.name,
                    )}/${article.slug}`}
                    className="flex gap-3 rounded-xl p-2 transition hover:bg-gray-50"
                  >
                    <div className="relative min-w-[151px] h-[110px] rounded-sm overflow-hidden">
                      {article?.thumbnail?.url ? (
                        <Image
                          src={article.thumbnail.url}
                          alt={
                            article.thumbnail.description || "Imagem do artigo"
                          }
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <Image
                          unoptimized
                          src={default_image}
                          alt={"Sem imagem cadastrada na noticia"}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-between">
                      <h3 className="text-xl font-semibold leading-tight line-clamp-3">
                        {article.title}
                      </h3>
                      <div className="flex w-full justify-between">
                        <span className="w-min text-xs bg-secondary text-primary px-3 py-1 rounded-2xl">
                          {article.category.name}
                        </span>
                        <p className="text-xs text-gray-500">
                          {formatDate(article.updated_at)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </DefaultPage>
  );
}
