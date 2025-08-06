"use client";

import Image from "next/image";
import PostTopGridSection from "./sections/post-top-grid-section";
import { useParams } from "next/navigation";
import PostBanner from "../banner/post-banner";
import { CompanyGridSection } from "../companys/company-grid-section";
import ButtonCTAWhatsAppButton from "../custom-button/cta-whatsapp-group-button";
import { Share2 } from "lucide-react";
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
import { useContext, useEffect, useRef } from "react";
import { ArticleContext } from "@/provider/article";
import { formatDate } from "@/utils/formatDate";
import { ArticleAnalyticsContext } from "@/provider/analytics/article";
import default_image from "@/assets/default image.webp";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, ""); // Remove spaces
}

export default function PostPage() {
  const {
    GetArticleBySlug,
    articleBySlug,
    GetPublishedArticles,
    publishedArticles,
  } = useContext(ArticleContext);

  const { TrackArticleViewEnd } = useContext(ArticleAnalyticsContext);

  const slug = useParams();
  const whatsappButtonRef = useRef<HTMLDivElement>(null);
  const viewEndTrackedRef = useRef(false); // Para evitar múltiplos disparos

  useEffect(() => {
    if (slug.slug?.toString()) {
      Promise.all([
        GetArticleBySlug(slug.slug?.toString()),
        GetPublishedArticles({ category_name: slug.name?.toString() }),
      ]);
    }
  }, [slug]);

  // Observer para detectar quando o usuário passa pelo botão WhatsApp
  useEffect(() => {
    if (
      !whatsappButtonRef.current ||
      !articleBySlug?.id ||
      viewEndTrackedRef.current
    )
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !viewEndTrackedRef.current) {
            // Dispara o view_end quando o botão entra na viewport
            TrackArticleViewEnd(articleBySlug.id, {
              article_title: articleBySlug.title,
              trigger: "scroll_to_whatsapp_button",
              timestamp: new Date().toISOString(),
            });

            viewEndTrackedRef.current = true; // Marca como já disparado
          }
        });
      },
      {
        threshold: 0.5, // Dispara quando 50% do botão está visível
        rootMargin: "0px 0px -10% 0px", // Margem para garantir que o usuário realmente chegou lá
      }
    );

    observer.observe(whatsappButtonRef.current);

    return () => {
      observer.disconnect();
    };
  }, [articleBySlug?.id, TrackArticleViewEnd]);

  // Reset do tracking quando mudar de artigo
  useEffect(() => {
    viewEndTrackedRef.current = false;
  }, [articleBySlug?.id]);

  useEffect(() => {
    if (slug.slug?.toString()) {
      Promise.all([
        GetArticleBySlug(slug.slug?.toString()),
        GetPublishedArticles({ category_name: slug.name?.toString() }),
      ]);
    }
  }, [slug]);

  const sidePosts = publishedArticles?.data.slice(0, 5);

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
              {articleBySlug?.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col lg:flex-row w-full gap-2 rounded-2xl">
          {
            <div className="flex flex-col gap-3 rounded-xl p-2 transition">
              {/* aqui está autor, breadcrumb, categoria e compartilhar */}

              <div className="flex flex-col gap-4 justify-between">
                <h1 className="text-4xl max-w-[820px] font-[700] ">
                  {articleBySlug?.title}
                </h1>

                <span
                  className={`${
                    articleBySlug?.resume_content ? "block" : "hidden"
                  } max-w-[850px] text-sm text-[#363636] line-clamp-5`}
                >
                  {articleBySlug?.resume_content}
                </span>

                <div className="flex w-full justify-between">
                  <div className="flex items-center mt-2 gap-4">
                    <span className="w-min text-xs bg-secondary text-primary px-3 py-1 rounded-2xl">
                      {articleBySlug?.category.name}
                    </span>
                    {articleBySlug && (
                      <p className="text-xs text-gray-500">
                        {formatDate(articleBySlug.created_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* imagem */}
              <div className="relative max-w-[340px] lg:max-w-[840px] h-[475px] rounded-md overflow-hidden">
                {articleBySlug?.thumbnail?.url ? (
                  <Image
                    unoptimized
                    src={
                      articleBySlug &&
                      articleBySlug.thumbnail &&
                      articleBySlug.thumbnail.url
                        ? articleBySlug.thumbnail.url
                        : default_image
                    }
                    alt={
                      articleBySlug &&
                      articleBySlug.title &&
                      articleBySlug.title
                        ? articleBySlug.title
                        : "Imagem do portal palhoça"
                    }
                    fill
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

              <span className="text-xs text-[#757575]">
                Foto:{" "}
                {articleBySlug?.thumbnail?.description
                  ? articleBySlug?.thumbnail?.description
                  : !articleBySlug?.thumbnail?.url
                  ? "Sem imagem cadastrada no momento"
                  : "Imagem pertencente a noticia do Portal"}
              </span>

              {/* post banner */}
              <PostBanner />

              {/* conteudo */}
              <div
                className="
    text-[16px] text-[#363636] max-w-[840px] mb-10
    [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4
    [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mb-3
    [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-2
    [&_p]:mb-4
    [&_a]:text-blue-600 [&_a]:underline
    [&_strong]:font-bold
    [&_em]:italic
    [&_u]:underline
    [&_br]:block
  "
                dangerouslySetInnerHTML={{
                  __html: articleBySlug?.content || "",
                }}
              />

              {/* Botão CTA com observer para view_end */}
              <div ref={whatsappButtonRef}>
                <ButtonCTAWhatsAppButton />
              </div>
            </div>
          }
        </div>

        {/* Side Posts */}
        <div className="flex flex-col max-w-[356px]">
          <div className="shadow-md">
            {sidePosts &&
              sidePosts.map((post, idx) => (
                <Link
                  key={idx}
                  href={`/noticia/${normalizeText(post.category.name)}/${
                    post.slug
                  }`}
                >
                  <div className="flex gap-3 rounded-xl p-2 transition">
                    <div className="relative min-w-[151px] h-[110px] rounded-sm overflow-hidden">
                      {post?.thumbnail?.url && (
                        <Image
                          src={post.thumbnail.url}
                          alt={post.thumbnail.description || "Imagem do artigo"}
                          fill
                          unoptimized
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
      <PostTopGridSection />
    </section>
  );
}
