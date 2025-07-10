"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArticleContext } from "@/provider/article";
import { ArticleAnalyticsContext } from "@/provider/analytics/article";
import { formatDate } from "@/utils/formatDate";
import { useParams } from "next/navigation";
import normalizeTextToslug from "@/utils/normalize-text-to-slug";
import default_image from "@/assets/default image.webp";

export default function HeroSection() {
  const slug = useParams();
  const pathname = usePathname();

  const {
    GetArticlesByPortalHighlightPositionOne,
    articlesByPortalHighlightPositionOne,
    articlesByPortalHighlightPositionTwo,
    GetArticlesByPortalHighlightPositionTwo,
  } = useContext(ArticleContext);

  const { TrackArticleView, TrackArticleClick } = useContext(
    ArticleAnalyticsContext
  );

  // Estados para controle de analytics
  const [hasInitialView, setHasInitialView] = useState(false);

  // Refs para Intersection Observer
  const heroSectionRef = useRef<HTMLElement>(null);
  const mainPostRef = useRef<HTMLDivElement>(null);
  const sidePostsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      await GetArticlesByPortalHighlightPositionOne({
        category_name: slug.name?.toString(),
        highlight: true,
        highlightPosition: 1,
      });

      await GetArticlesByPortalHighlightPositionTwo({
        category_name: slug.name?.toString(),
        highlight: true,
        highlightPosition: 2,
      });
    };

    fetchArticles();
  }, []);

  const mainPost = articlesByPortalHighlightPositionOne?.data[0];
  const sidePosts = articlesByPortalHighlightPositionTwo?.data.slice(0, 3);

  // Analytics: Registrar view inicial quando componente carrega
  useEffect(() => {
    if (!hasInitialView && (mainPost || (sidePosts?.length ?? 0) > 0)) {
      if (mainPost) {
        TrackArticleView(mainPost.id, {
          page: pathname,
          section: "hero-section",
          position: "main-article",
          categoryName: mainPost.category.name,
          articleTitle: mainPost.title,
          highlightPosition: 1,
          viewType: "initial",
          timestamp: new Date().toISOString(),
        });
      }

      // Registra view dos artigos laterais
      sidePosts?.forEach((post, index) => {
        TrackArticleView(post.id, {
          page: pathname,
          section: "hero-section",
          position: "side-article",
          categoryName: post.category.name,
          articleTitle: post.title,
          highlightPosition: 2,
          sidePostIndex: index,
          viewType: "initial",
          timestamp: new Date().toISOString(),
        });
      });

      setHasInitialView(true);
    }
  }, [mainPost, sidePosts, hasInitialView, TrackArticleView, pathname]);

  // Intersection Observer: Para detectar quando hero section sai/volta à tela
  useEffect(() => {
    if (!heroSectionRef.current || !hasInitialView) return;

    let hasLeft = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (hasLeft) {
              if (mainPost) {
                TrackArticleView(mainPost.id, {
                  page: pathname,
                  section: "hero-section",
                  position: "main-article",
                  categoryName: mainPost.category.name,
                  articleTitle: mainPost.title,
                  viewType: "reappear",
                  intersectionRatio: entry.intersectionRatio,
                  timestamp: new Date().toISOString(),
                });
              }

              // Registra reappear para artigos laterais
              sidePosts?.forEach((post, index) => {
                TrackArticleView(post.id, {
                  page: pathname,
                  section: "hero-section",
                  position: "side-article",
                  categoryName: post.category.name,
                  articleTitle: post.title,
                  sidePostIndex: index,
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

    observer.observe(heroSectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasInitialView, mainPost, sidePosts, TrackArticleView, pathname]);

  // Analytics: Função para registrar clique no artigo principal
  const handleMainPostClick = () => {
    if (mainPost) {
      TrackArticleClick(mainPost.id, {
        page: pathname,
        section: "hero-section",
        position: "main-article",
        categoryName: mainPost.category.name,
        articleTitle: mainPost.title,
        targetUrl: `/noticia/${normalizeTextToslug(mainPost.category.name)}/${
          mainPost.slug
        }`,
        clickPosition: "main-hero-article",
        highlightPosition: 1,
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Analytics: Função para registrar clique nos artigos laterais
  const handleSidePostClick = (post: any, index: number) => {
    TrackArticleClick(post.id, {
      page: pathname,
      section: "hero-section",
      position: "side-article",
      categoryName: post.category.name,
      articleTitle: post.title,
      targetUrl: `/noticia/${normalizeTextToslug(post.category.name)}/${
        post.slug
      }`,
      clickPosition: "side-hero-article",
      sidePostIndex: index,
      highlightPosition: 2,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <section
      ref={heroSectionRef}
      className={`${
        !mainPost && !sidePosts
          ? "hidden"
          : "flex flex-col lg:flex-row w-full max-w-[360px] gap-6 py-4 lg:max-w-[1272px] mx-auto border-t border-[#e6e6e6]"
      } `}
    >
      {/* Main Post */}
      {mainPost && (
        <Link
          key={mainPost.id}
          href={`/noticia/${normalizeTextToslug(mainPost.category.name)}/${
            mainPost.slug
          }`}
          onClick={handleMainPostClick}
        >
          <div
            ref={mainPostRef}
            className="flex flex-col lg:flex-row gap-6 rounded-xl"
          >
            <div className="relative md:min-w-[490px] max-w-[490px] min-h-[406px] max-h-[406px] rounded-xl overflow-hidden">
              <Image
                src={mainPost?.thumbnail?.url ?? default_image}
                alt={
                  mainPost && mainPost.title && mainPost.title
                    ? mainPost.title
                    : "Imagem do portal palhoça"
                }
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between pb-9">
              <div>
                <h1 className="text-2xl font-semibold leading-tight">
                  {mainPost.title}
                </h1>
                <span className="text-sm bg-secondary text-primary my-4 px-2 py-1 rounded-full inline-block mb-2">
                  {mainPost.category.name}
                </span>
                <p className="text-md text-gray-600 line-clamp-12">
                  {mainPost.resume_content}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                {formatDate(mainPost.created_at)}
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* Side Posts */}
      {sidePosts?.length !== 0 && (
        <div
          ref={sidePostsRef}
          className="flex flex-col gap-4 shadow-md p-4 rounded-2xl min-w-[300px] md:min-w-[415px] max-w-[415px]"
        >
          {sidePosts?.map((post, idx) => (
            <Link
              key={idx}
              href={`/noticia/${normalizeTextToslug(post.category.name)}/${
                post.slug
              }`}
              onClick={() => handleSidePostClick(post, idx)}
            >
              <div className="flex gap-3 rounded-xl p-2 transition">
                <div className="relative min-w-[151px] h-[110px] rounded-sm overflow-hidden">
                  <Image
                    src={
                      post && post.thumbnail && post.thumbnail.url
                        ? post.thumbnail.url
                        : default_image
                    }
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between gap-4">
                  <h3 className="text-xl font-semibold leading-tight line-clamp-3">
                    {post.title}
                  </h3>
                  <div className="flex w-full justify-between items-center">
                    <span className="w-min text-xs bg-secondary text-primary px-3 py-1 rounded-2xl">
                      {post.category.name}
                    </span>
                    <p className="text-xs text-gray-500">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
