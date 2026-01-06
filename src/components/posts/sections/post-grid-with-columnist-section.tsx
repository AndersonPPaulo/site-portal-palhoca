"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { ArticleContext } from "@/provider/article";
import { ArticleAnalyticsContext } from "@/provider/analytics/article";
import { formatDate } from "@/utils/formatDate";
import normalizeTextToslug from "@/utils/normalize-text-to-slug";
import default_image from "@/assets/no-img.png";
import { useArticleViewTracking } from "@/hooks/useIntersectionObserverArticle";

// Componente wrapper para columnist post com tracking de view
function ColumnistPostItem({
  post,
  index,
  pathname,
  noSlug,
  handleGridPostClick,
  TrackArticleView,
  gridSize,
}: any) {
  const trackingData = {
    page: pathname,
    section: "post-grid-columnist",
    position: "grid-item",
    categoryName: post.category.name,
    articleTitle: post.title,
    gridIndex: index,
    highlightPosition: 4,
    gridSize: gridSize,
    hasSlug: !noSlug,
    layoutType: noSlug ? "with-columnist" : "category-focused",
  };

  const { ref: columnistPostRef, registerInitialView } = useArticleViewTracking(
    post.id,
    trackingData,
    TrackArticleView
  );

  useEffect(() => {
    registerInitialView();
  }, [registerInitialView]);

  return (
    <Link
      key={post.id}
      href={`/noticia/${normalizeTextToslug(post.category.name)}/${post.slug}`}
      onClick={() => handleGridPostClick(post, index)}
    >
      <div
        ref={columnistPostRef}
        className={`flex flex-col gap-3 rounded-xl p-2 transition hover:shadow-lg hover:transform hover:scale-105 ${
          !noSlug
            ? "max-w-[405px] min-w-[300px] md:w-[405px] min-h-[310px]"
            : "min-w-[300px] md:w-[264px] md:min-w-[260px] md:h-[200px]"
        }`}
      >
        <div
          className={`relative overflow-hidden rounded-md ${
            !noSlug
              ? "min-w-[300px] md:w-[405px] min-h-[310px]"
              : "min-w-[300px] md:w-[264px] md:min-w-[260px] md:min-h-[200px]"
          }`}
        >
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
        <div className="flex flex-col justify-between">
          <h3 className="text-2xl font-semibold leading-tight line-clamp-3">
            {post.title}
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
  );
}

export default function PostGridWwithColumnistSection() {
  const slug = useParams();
  const pathname = usePathname();
  const slugName = slug.name?.toString();
  const noSlug = !slugName;

  const {
    GetArticlesByPortalHighlightPositionFour,
    articlesByPortalHighlightPositionFour,
  } = useContext(ArticleContext);

  const { TrackArticleClick, TrackArticleView } = useContext(
    ArticleAnalyticsContext
  );

  useEffect(() => {
    const fetchArticles = async () => {
      await GetArticlesByPortalHighlightPositionFour({
        category_name: slugName,
        highlight: true,
        highlightPosition: 4,
      });
    };

    fetchArticles();
  }, []);

  const gridPosts =
    articlesByPortalHighlightPositionFour?.data.slice(0, 4) || [];

  // Analytics: Função para registrar clique no post do grid
  const handleGridPostClick = (post: any, index: number) => {
    TrackArticleClick(post.id, {
      page: pathname,
      section: "post-grid-columnist",
      position: "grid-item",
      categoryName: post.category.name,
      articleTitle: post.title,
      targetUrl: `/noticia/${normalizeTextToslug(post.category.name)}/${
        post.slug
      }`,
      clickPosition: "grid-columnist-post",
      gridIndex: index,
      highlightPosition: 4,
      gridSize: gridPosts.length,
      hasSlug: !noSlug,
      layoutType: noSlug ? "with-columnist" : "category-focused",
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <section className="w-full sm:px-6 lg:px-10 mx-auto max-w-7xl">
      <div
        className={`flex flex-col ${
          noSlug ? "lg:flex-row" : "lg:flex-row"
        } gap-10`}
      >
        {gridPosts.map((post, idx) => (
          <ColumnistPostItem
            key={post.id}
            post={post}
            index={idx}
            pathname={pathname}
            noSlug={noSlug}
            handleGridPostClick={handleGridPostClick}
            TrackArticleView={TrackArticleView}
            gridSize={gridPosts.length}
          />
        ))}
      </div>
    </section>
  );
}
