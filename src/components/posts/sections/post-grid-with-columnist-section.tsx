"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { ArticleContext } from "@/provider/article";
import { ArticleAnalyticsContext } from "@/provider/analytics/article";
import { formatDate } from "@/utils/formatDate";
import normalizeTextToslug from "@/utils/normalize-text-to-slug";
import default_image from "@/assets/no-img.png";

export default function PostGridWwithColumnistSection() {
  const slug = useParams();
  const pathname = usePathname();
  const slugName = slug.name?.toString();
  const noSlug = !slugName;

  const {
    GetArticlesByPortalHighlightPositionFour,
    articlesByPortalHighlightPositionFour,
  } = useContext(ArticleContext);

  const { TrackArticleView, TrackArticleClick } = useContext(
    ArticleAnalyticsContext
  );

  // Estados para controle de analytics
  const [hasInitialView, setHasInitialView] = useState(false);

  // Refs para Intersection Observer
  const gridColumnistSectionRef = useRef<HTMLElement>(null);
  const postsRef = useRef<Record<string, HTMLDivElement | null>>({});

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

  // Analytics: Registrar view inicial quando componente carrega
  useEffect(() => {
    if (!hasInitialView && gridPosts.length > 0) {
      gridPosts.forEach((post, index) => {
        TrackArticleView(post.id, {
          page: pathname,
          section: "post-grid-columnist",
          position: "grid-item",
          categoryName: post.category.name,
          articleTitle: post.title,
          gridIndex: index,
          highlightPosition: 4,
          gridSize: gridPosts.length,
          hasSlug: !noSlug,
          layoutType: noSlug ? "with-columnist" : "category-focused",
          viewType: "initial",
          timestamp: new Date().toISOString(),
        });
      });

      setHasInitialView(true);
    }
  }, [gridPosts, hasInitialView, TrackArticleView, pathname, noSlug]);

  // Intersection Observer: Para detectar quando grid sai/volta à tela
  useEffect(() => {
    if (
      !gridColumnistSectionRef.current ||
      !hasInitialView ||
      gridPosts.length === 0
    )
      return;

    let hasLeft = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (hasLeft) {
              // Registra reappear para todos os posts do grid
              gridPosts.forEach((post, index) => {
                TrackArticleView(post.id, {
                  page: pathname,
                  section: "post-grid-columnist",
                  position: "grid-item",
                  categoryName: post.category.name,
                  articleTitle: post.title,
                  gridIndex: index,
                  highlightPosition: 4,
                  gridSize: gridPosts.length,
                  hasSlug: !noSlug,
                  layoutType: noSlug ? "with-columnist" : "category-focused",
                  viewType: "reappear",
                  intersectionRatio: entry.intersectionRatio,
                  timestamp: new Date().toISOString(),
                });
              });

              hasLeft = false;
            }
          } else {
            hasLeft = true;
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px",
      }
    );

    observer.observe(gridColumnistSectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasInitialView, gridPosts, TrackArticleView, pathname, noSlug]);

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
    <section
      ref={gridColumnistSectionRef}
      className="w-full sm:px-6 lg:px-10 mx-auto max-w-7xl"
    >
      <div
        className={`flex flex-col ${
          noSlug ? "lg:flex-row" : "lg:flex-row"
        } gap-10`}
      >
        {gridPosts.map((post, idx) => (
          <Link
            key={post.id}
            href={`/noticia/${normalizeTextToslug(post.category.name)}/${
              post.slug
            }`}
            onClick={() => handleGridPostClick(post, idx)}
          >
            <div
              ref={(el) => {
                if (el) postsRef.current[post.id] = el;
              }}
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
        ))}
      </div>
    </section>
  );
}
