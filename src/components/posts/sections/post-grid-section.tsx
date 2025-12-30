"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { ArticleContext } from "@/provider/article";
import { ArticleAnalyticsContext } from "@/provider/analytics/article";
import { formatDate } from "@/utils/formatDate";
import normalizeTextToslug from "@/utils/normalize-text-to-slug";
import default_image from "@/assets/no-img.png";
import { useArticleViewTracking } from "@/hooks/useIntersectionObserverArticle";

// Componente wrapper para grid post com tracking de view
function GridPostItem({
  post,
  index,
  pathname,
  handleGridPostClick,
  TrackArticleView,
  gridSize,
}: any) {
  const trackingData = {
    page: pathname,
    section: "post-grid",
    position: "grid-item",
    categoryName: post.category.name,
    articleTitle: post.title,
    gridIndex: index,
    highlightPosition: 3,
    gridSize: gridSize,
  };

  const { ref: gridPostRef, registerInitialView } = useArticleViewTracking(
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
        ref={gridPostRef}
        className="flex flex-col rounded-xl transition max-w-[405px]  hover:transform hover:scale-105"
      >
        <div className="relative min-w-[300px] md:w-[405px] h-[310px] rounded-md overflow-hidden">
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
        <div>
          <h3 className="text-2xl mt-2 ml-1 font-semibold leading-tight line-clamp-3">
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

export default function PostGridSection() {
  const slug = useParams();
  const pathname = usePathname();

  const {
    GetArticlesByPortalHighlightPositionThree,
    articlesByPortalHighlightPositionThree,
  } = useContext(ArticleContext);

  const { TrackArticleClick, TrackArticleView } = useContext(
    ArticleAnalyticsContext
  );

  useEffect(() => {
    const fetchArticles = async () => {
      await GetArticlesByPortalHighlightPositionThree({
        category_name: slug.name?.toString(),
        highlight: true,
        highlightPosition: 3,
      });
    };

    fetchArticles();
  }, []);

  const gridPosts =
    articlesByPortalHighlightPositionThree?.data.slice(0, 3) || [];

  // Analytics: Função para registrar clique no post do grid
  const handleGridPostClick = (post: any, index: number) => {
    TrackArticleClick(post.id, {
      page: pathname,
      section: "post-grid",
      position: "grid-item",
      categoryName: post.category.name,
      articleTitle: post.title,
      targetUrl: `/noticia/${normalizeTextToslug(post.category.name)}/${
        post.slug
      }`,
      clickPosition: "grid-post",
      gridIndex: index,
      highlightPosition: 3,
      gridSize: gridPosts.length,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <section
      className={`${
        !gridPosts
          ? "hidden"
          : "flex gap-6 max-w-[1272px] mx-auto py-4 justify-between"
      }`}
    >
      <div className="flex flex-col lg:flex-row justify-between gap-7">
        {gridPosts.map((post, idx) => (
          <GridPostItem
            key={post.id}
            post={post}
            index={idx}
            pathname={pathname}
            handleGridPostClick={handleGridPostClick}
            TrackArticleView={TrackArticleView}
            gridSize={gridPosts.length}
          />
        ))}
      </div>
    </section>
  );
}
