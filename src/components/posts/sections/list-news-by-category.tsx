"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useRef } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { ArticleContext } from "@/provider/article";
import { ArticleAnalyticsContext } from "@/provider/analytics/article";
import { formatDate } from "@/utils/formatDate";
import SideBanner from "@/components/banner/side";
import normalizeTextToslug from "@/utils/normalize-text-to-slug";
import { ArrowLeft, ArrowRight } from "lucide-react";
import default_image from "@/assets/no-img.png";

export default function ListArticlesByCategory() {
  const slug = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;
  const postsPerPage = 6; // ou qualquer número que deseje por página

  const { GetPublishedArticles, publishedArticles } =
    useContext(ArticleContext);
  const { TrackArticleClick } = useContext(ArticleAnalyticsContext);

  useEffect(() => {
    GetPublishedArticles({
      category_name: slug.name?.toString(),
      highlight: false,
      page: currentPage,
      limit: postsPerPage,
    });
  }, [slug.name, currentPage]);

  const totalPages = publishedArticles?.meta?.totalPages || 1;
  const articles = publishedArticles?.data || [];

  // Analytics: Função para registrar clique no artigo
  const handleArticleClick = (article: any, index: number) => {
    TrackArticleClick(article.id, {
      page: pathname,
      section: "article-list",
      position: "list-item",
      categoryName: article.category.name,
      articleTitle: article.title,
      targetUrl: `/noticia/${normalizeTextToslug(article.category.name)}/${
        article.slug
      }`,
      clickPosition: "list-article",
      listIndex: index,
      currentPage: currentPage,
      totalPages: totalPages,
      timestamp: new Date().toISOString(),
    });
  };

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    router.push(url.pathname + url.search);
  };

  const getVisiblePages = (current: number, total: number) => {
    const pages = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", total);
      } else if (current >= total - 3) {
        pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, "...", current - 1, current, current + 1, "...", total);
      }
    }

    return pages;
  };

  return (
    <section className="flex flex-col lg:flex-row gap-6 max-w-[1272px] mx-auto py-4 justify-between">
      <div className="flex flex-col gap-6 w-full max-w-[948px]">
        {articles.map((post, idx) => (
          <Link
            key={post.id}
            href={`/noticia/${normalizeTextToslug(post.category.name)}/${
              post.slug
            }`}
            className="w-full"
            onClick={() => handleArticleClick(post, idx)}
          >
            <div className="flex flex-col md:flex-row rounded-xl transition w-full hover:shadow-md hover:bg-gray-50">
              <div className="relative min-w-[300px] md:w-[328px] h-[310px] md:h-[227px] rounded-md overflow-hidden">
                <Image
                  src={
                    post && post.thumbnail && post.thumbnail.url
                      ? post.thumbnail.url
                      : default_image
                  }
                  alt={
                    post && post.title && post.title
                      ? post.title
                      : "Imagem do portal palhoça"
                  }
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-3 p-4 w-full">
                <h2 className="text-2xl mt-2 font-semibold leading-tight line-clamp-3">
                  {post.title}
                </h2>
                <h3 className="leading-tight line-clamp-5 mr-4">
                  {post.resume_content}
                </h3>
                <div className="flex w-full justify-between">
                  <div className="flex items-center mt-2 gap-4">
                    <span className="w-min text-xs bg-secondary text-primary px-3 py-1 rounded-2xl">
                      {post.category.name}
                    </span>
                    <p className="text-xs text-gray-500">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Pagination */}
        <div className="flex justify-center gap-2 my-4 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md border border-[#757575] text-[#757575] disabled:opacity-50 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {getVisiblePages(currentPage, totalPages).map((page, idx) =>
            page === "..." ? (
              <span
                key={`dots-${idx}`}
                className="px-3 py-2 text-[#757575] select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => handlePageChange(page as number)}
                className={`px-4 py-2 rounded-md hover:bg-gray-100 ${
                  currentPage === page
                    ? "border-2 border-primary text-primary font-bold"
                    : "border border-[#757575] text-[#757575]"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md border border-[#757575] text-[#757575] disabled:opacity-50 hover:bg-gray-100"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <SideBanner />
    </section>
  );
}
