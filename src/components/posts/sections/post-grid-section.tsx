"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { ArticleContext } from "@/provider/article";
import { ArticleAnalyticsContext } from "@/provider/analytics/article";
import { formatDate } from "@/utils/formatDate";
import normalizeTextToslug from "@/utils/normalize-text-to-slug";
import default_image from "@/assets/default image.webp";

export default function PostGridSection() {
  const slug = useParams();
  const pathname = usePathname();

  const {
    GetArticlesByPortalHighlightPositionThree,
    articlesByPortalHighlightPositionThree,
  } = useContext(ArticleContext);

  const { TrackArticleView, TrackArticleClick } = useContext(
    ArticleAnalyticsContext
  );

  // Estados para controle de analytics
  const [hasInitialView, setHasInitialView] = useState(false);

  // Refs para Intersection Observer
  const gridSectionRef = useRef<HTMLElement>(null);
  const postsRef = useRef<Record<string, HTMLDivElement | null>>({});

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
  console.log("gridPosts", gridPosts);

  // Analytics: Registrar view inicial quando componente carrega
  useEffect(() => {
    if (!hasInitialView && gridPosts.length > 0) {
      gridPosts.forEach((post, index) => {
        TrackArticleView(post.id, {
          page: pathname,
          section: "post-grid",
          position: "grid-item",
          categoryName: post.category.name,
          articleTitle: post.title,
          gridIndex: index,
          highlightPosition: 3,
          gridSize: gridPosts.length,
          viewType: "initial",
          timestamp: new Date().toISOString(),
        });
      });

      setHasInitialView(true);
    }
  }, [gridPosts, hasInitialView, TrackArticleView, pathname]);

  // Intersection Observer: Para detectar quando grid sai/volta à tela
  useEffect(() => {
    if (!gridSectionRef.current || !hasInitialView || gridPosts.length === 0)
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
                  section: "post-grid",
                  position: "grid-item",
                  categoryName: post.category.name,
                  articleTitle: post.title,
                  gridIndex: index,
                  highlightPosition: 3,
                  gridSize: gridPosts.length,
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

    observer.observe(gridSectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasInitialView, gridPosts, TrackArticleView, pathname]);

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
      ref={gridSectionRef}
      className={`${
        !gridPosts
          ? "hidden"
          : "flex gap-6 max-w-[1272px] mx-auto py-4 justify-between"
      }`}
    >
      <div className="flex flex-col lg:flex-row justify-between gap-7">
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
        ))}
      </div>
    </section>
  );
}
