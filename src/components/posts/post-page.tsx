"use client";

import Image from "next/image";
import PostTopGridSection from "./sections/post-top-grid-section";
import { useParams, usePathname } from "next/navigation";
import PostBanner from "../banner/post-banner";
import { CompanyGridSection } from "../companys/company-grid-section";
import ButtonCTAWhatsAppButton from "../custom-button/cta-whatsapp-group-button";
import SideBanner from "../banner/side";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { useContext, useEffect, useRef, useState } from "react";
import { ArticleContext, type Article } from "@/provider/article";
import { formatDate } from "@/utils/formatDate";
import { ArticleAnalyticsContext } from "@/provider/analytics/article";
import default_image from "@/assets/no-img.png";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, ""); // Remove spaces
}

export default function PostPage() {
  const { GetArticleBySlug, articleBySlug, GetPublishedArticles } =
    useContext(ArticleContext);

  const {
    TrackArticleViewEnd,
    TrackArticleView,
    TrackArticleClick,
    TrackArticleWhatsappClick,
  } = useContext(ArticleAnalyticsContext);

  const slug = useParams();
  const pathname = usePathname();
  const whatsappButtonRef = useRef<HTMLDivElement>(null);
  const viewEndTrackedRef = useRef(false);
  const [hasTrackedInitialView, setHasTrackedInitialView] = useState(false);
  const lastTrackedArticleId = useRef<string | null>(null);
  const currentSlugRef = useRef<string | null>(null);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [sidePosts, setSidePosts] = useState<Article[]>([]);

  useEffect(() => {
    if (slug.slug?.toString()) {
      console.log("🔄 [RESET] Trocando para novo artigo:", slug.slug);

      const newSlug = slug.slug.toString();
      currentSlugRef.current = newSlug;
      setCurrentSlug(newSlug);
      setSidePosts([]); // limpa imediatamente para não mostrar dados antigos

      // Reset do tracking ANTES de carregar novo artigo
      setHasTrackedInitialView(false);
      viewEndTrackedRef.current = false;
      lastTrackedArticleId.current = null;

      console.log("🔄 [RESET] Estados resetados");

      GetArticleBySlug(newSlug);
    }
  }, [slug.slug, slug.name]);

  // Busca e popula side posts usando a resposta direta da Promise
  // (evita usar publishedArticles do contexto que pode estar desatualizado)
  useEffect(() => {
    if (!articleBySlug || articleBySlug.slug !== currentSlugRef.current) return;

    const articleId = articleBySlug.id;
    const articleSlug = articleBySlug.slug;
    const isColumnist =
      articleBySlug.creator?.role?.name?.toLowerCase() === "colunista";

    const fetchParams = isColumnist
      ? { creatorId: articleBySlug.creator.id, limit: 6 }
      : { category_name: articleBySlug.category.name, limit: 6 };

    GetPublishedArticles(fetchParams)
      .then((response) => {
        // Ignora resultado se o usuário já navegou para outro artigo
        if (currentSlugRef.current !== articleSlug) return;

        const data = response?.data ?? [];

        const filtered = data
          .filter((post) => {
            if (post.id === articleId) return false;
            if (isColumnist) return true; // API já filtrou por creatorId, todos são deste colunista
            // notícia normal: exclui colunistas apenas quando o dado de role está disponível
            if (!post.creator?.role) return true;
            return post.creator.role.name?.toLowerCase() !== "colunista";
          })
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 5);

        setSidePosts(filtered);
      })
      .catch((err) => {
        console.error("[SidePosts] erro ao buscar:", err);
      });
  }, [articleBySlug?.id]);

  // Tracking de view inicial quando o artigo é carregado
  useEffect(() => {
    // console.log("🔍 [TRACK DEBUG] Verificando condições:", {
    //   articleId: articleBySlug?.id,
    //   articleSlug: articleBySlug?.slug,
    //   currentSlug: currentSlugRef.current,
    //   slugsMatch: articleBySlug?.slug === currentSlugRef.current,
    //   hasTrackedInitialView,
    //   lastTrackedArticleId: lastTrackedArticleId.current,
    //   shouldTrack:
    //     articleBySlug?.id &&
    //     articleBySlug?.slug === currentSlugRef.current &&
    //     !hasTrackedInitialView &&
    //     lastTrackedArticleId.current !== articleBySlug.id,
    // });

    // CRÍTICO: Só rastreia se o artigo carregado corresponde ao slug atual
    if (
      articleBySlug?.id &&
      articleBySlug?.slug === currentSlugRef.current &&
      !hasTrackedInitialView &&
      lastTrackedArticleId.current !== articleBySlug.id
    ) {
      // console.log(
      //   "✅ [TRACK] Disparando view para artigo:",
      //   articleBySlug.title,
      // );

      TrackArticleView(articleBySlug.id, {
        page: window.location.pathname,
        section: "post-page",
        position: "main-article",
        categoryName: articleBySlug.category.name,
        articleTitle: articleBySlug.title,
        viewType: "page_open",
        timestamp: new Date().toISOString(),
      });

      setHasTrackedInitialView(true);
      lastTrackedArticleId.current = articleBySlug.id;

      console.log("✅ [TRACK] View registrado. Estado atualizado.");
    } else if (articleBySlug?.slug !== currentSlugRef.current) {
      console.log(
        "⚠️ [TRACK] Ignorando artigo antigo:",
        articleBySlug?.title,
        "(slug não corresponde)",
      );
    }
  }, [articleBySlug?.id, articleBySlug?.slug]);

  // Observer para detectar quando o usuário passa pelo botão WhatsApp
  useEffect(() => {
    if (
      !whatsappButtonRef.current ||
      !articleBySlug?.id ||
      viewEndTrackedRef.current ||
      articleBySlug?.slug !== currentSlugRef.current // Só observa se for o artigo atual
    )
      return;

    const currentRef = whatsappButtonRef.current;
    const currentArticleId = articleBySlug.id;
    const currentArticleSlug = articleBySlug.slug;

    // console.log(
    //   "👁️ [OBSERVER] Iniciando observer para artigo:",
    //   articleBySlug.title,
    // );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // console.log("👁️ [OBSERVER] Entry:", {
          //   isIntersecting: entry.isIntersecting,
          //   currentArticleId,
          //   currentArticleSlug,
          //   articleBySlugId: articleBySlug?.id,
          //   articleBySlugSlug: articleBySlug?.slug,
          //   currentSlug: currentSlugRef.current,
          //   viewEndTracked: viewEndTrackedRef.current,
          //   isSameArticle:
          //     articleBySlug?.id === currentArticleId &&
          //     articleBySlug?.slug === currentArticleSlug,
          //   slugMatches: currentArticleSlug === currentSlugRef.current,
          // });

          // CRÍTICO: Verifica se ainda é o mesmo artigo E se o slug corresponde
          if (
            entry.isIntersecting &&
            !viewEndTrackedRef.current &&
            articleBySlug?.id === currentArticleId &&
            articleBySlug?.slug === currentArticleSlug &&
            currentArticleSlug === currentSlugRef.current
          ) {
            TrackArticleViewEnd(currentArticleId, {
              article_title: articleBySlug.title,
              trigger: "scroll_to_whatsapp_button",
              timestamp: new Date().toISOString(),
            });

            viewEndTrackedRef.current = true;
            console.log("✅ [OBSERVER] view_end registrado");
          } else if (currentArticleSlug !== currentSlugRef.current) {
            console.log("⚠️ [OBSERVER] Ignorando evento de artigo antigo");
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(currentRef);

    // Cleanup: desconectar observer ao desmontar ou trocar de artigo
    return () => {
      // console.log("🧹 [OBSERVER] Desconectando observer");
      observer.disconnect();
    };
  }, [articleBySlug?.id, articleBySlug?.slug, articleBySlug?.title]);

  // Artigo exibido somente quando corresponde ao slug atual (evita flash de dado antigo)
  const displayArticle =
    articleBySlug?.slug === currentSlug ? articleBySlug : null;

  return (
    <section className="flex flex-col gap-6 mx-auto max-w-[1272px] justify-between">
      <Breadcrumb className="hidden md:block font-semibold">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Portal</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              className="capitalize"
              href={`/noticia/${slug.name}`}
            >
              {slug.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize text-primary font-semibold">
              {displayArticle?.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col lg:flex-row w-full gap-2 rounded-2xl">
          {
            <div className="flex flex-col gap-3 rounded-xl p-2 transition">
              {/* aqui está autor, breadcrumb, categoria */}

              <div className="flex flex-col gap-4 justify-between">
                <h1 className="text-4xl max-w-[820px] font-[700] ">
                  {displayArticle?.title}
                </h1>

                <span
                  className={`${
                    displayArticle?.resume_content ? "block" : "hidden"
                  } max-w-[850px] text-sm text-[#363636] line-clamp-5`}
                >
                  {displayArticle?.resume_content}
                </span>

                <div className="flex w-full justify-between">
                  <div className="flex items-center mt-2 gap-4">
                    <span className="w-min text-xs bg-secondary text-primary px-3 py-1 rounded-2xl">
                      {displayArticle?.category.name}
                    </span>
                    {displayArticle && (
                      <p className="text-xs text-gray-500">
                        {formatDate(displayArticle.created_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* imagem */}
              <div className="relative max-w-[340px] lg:max-w-[840px] h-[250px] md:h-[475px] rounded-md overflow-hidden">
                {displayArticle?.thumbnail?.url ? (
                  <Image
                    unoptimized
                    src={
                      displayArticle.thumbnail.url
                        ? displayArticle.thumbnail.url
                        : default_image
                    }
                    alt={
                      displayArticle.title
                        ? displayArticle.title
                        : "Imagem do portal Palhoça"
                    }
                    fill
                    className="object-contain"
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

              <span className="text-xs text-[#757575]">
                Foto:{" "}
                {displayArticle?.thumbnail?.description
                  ? displayArticle?.thumbnail?.description
                  : !displayArticle?.thumbnail?.url
                    ? "Sem imagem cadastrada no momento"
                    : "Imagem pertencente a noticia do Portal"}
              </span>

              {/* post banner */}
              <div className="my-4">
                <PostBanner />
              </div>

              {/* conteudo */}
              <div
                className="
    text-[16px] text-[#363636] max-w-[840px] mb-1
    [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4
    [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mb-3
    [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-2
    [&_p]:mb-4
    [&_a]:text-blue-600 [&_a]:underline
    [&_strong]:font-bold
    [&_em]:italic
    [&_u]:underline
    [&_br]:block
    [&_img]:w-full [&_img]:h-auto [&_img]:my-4 [&_img]:rounded-md
  "
                dangerouslySetInnerHTML={{
                  __html: displayArticle?.content || "",
                }}
              />

              {/* Galeria de fotos */}
              {displayArticle?.gallery &&
                (() => {
                  try {
                    const gallery = JSON.parse(displayArticle.gallery);
                    return Array.isArray(gallery) && gallery.length > 0 ? (
                      <div className="max-w-[800px] lg:max-w-[1200px] mb-10">
                        <h3 className="text-2xl font-semibold mb-4">
                          Galeria de Fotos
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                          {gallery.map((image: any, index: number) => (
                            <div
                              key={index}
                              className="relative flex-shrink-0 w-[320px] h-[240px] rounded-md overflow-hidden snap-start"
                            >
                              <Image
                                unoptimized
                                src={image.url || image}
                                alt={
                                  image.description ||
                                  `Imagem da galeria ${index + 1}`
                                }
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        {gallery.some((img: any) => img.description) && (
                          <div className="mt-2">
                            {gallery.map((image: any, index: number) =>
                              image.description ? (
                                <p
                                  key={index}
                                  className="text-xs text-[#757575] mb-1"
                                >
                                  Foto {index + 1}: {image.description}
                                </p>
                              ) : null,
                            )}
                          </div>
                        )}
                      </div>
                    ) : null;
                  } catch (e) {
                    console.error("Erro ao parsear galeria:", e);
                    return null;
                  }
                })()}

              {/* Botão CTA com observer para view_end */}
              <div
                ref={whatsappButtonRef}
                className="mb-5"
                onClick={() => {
                  if (displayArticle?.id) {
                    TrackArticleWhatsappClick(displayArticle.id);
                  }
                }}
              >
                <ButtonCTAWhatsAppButton />
              </div>
            </div>
          }
        </div>

        {/* Side Posts */}
        <div className="hidden lg:flex flex-col max-w-[356px]">
          <div className="shadow-md">
            {sidePosts &&
              sidePosts.map((post, idx) => (
                <Link
                  key={post.id}
                  href={`/noticia/${normalizeText(post.category.name)}/${
                    post.slug
                  }`}
                  onClick={() => {
                    TrackArticleClick(post.id, {
                      page: pathname,
                      section: "side-posts",
                      position: "sidebar",
                      categoryName: post.category.name,
                      articleTitle: post.title,
                      targetUrl: `/noticia/${normalizeText(
                        post.category.name,
                      )}/${post.slug}`,
                      clickPosition: "side-post-item",
                      sidePostIndex: idx,
                      currentPostId: displayArticle?.id,
                      timestamp: new Date().toISOString(),
                    });
                  }}
                >
                  <div className="flex gap-3 rounded-xl p-2 transition">
                    <div className="relative min-w-[151px] h-[110px] rounded-sm overflow-hidden">
                      {post?.thumbnail?.url ? (
                        <Image
                          src={
                            post.thumbnail.url
                              ? post.thumbnail.url
                              : default_image
                          }
                          alt={post.thumbnail.description || "Imagem do artigo"}
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
                        {post.title}
                      </h3>
                      <div className="flex w-full justify-between">
                        <span className="w-min text-xs bg-secondary text-primary px-3 py-1 rounded-2xl">
                          {post.category.name}
                        </span>
                        <p className="text-xs text-gray-500">
                          {formatDate(post.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>

          <SideBanner />
        </div>
      </div>

      <CompanyGridSection />
      <PostTopGridSection currentPostId={displayArticle?.id} />
    </section>
  );
}
