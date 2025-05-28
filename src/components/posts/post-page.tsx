"use client";

import Image from "next/image";
import { mockPosts } from "@/utils/mock-data";
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
import { useContext, useEffect } from "react";
import { ArticleContext } from "@/provider/article";
import { formatDate } from "@/utils/formatDate";

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
  const slug = useParams();

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
      <Breadcrumb className="font-semibold">
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
              {slug.slug}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col lg:flex-row w-full gap-2 rounded-2xl">
          {
            <div className="flex flex-col gap-3 rounded-xl p-2 transition">
              {/* aqui está autor, breadcrumb, categoria e compartilhar */}

              <div className="flex flex-col justify-between">
                <h3 className="text-4xl max-w-[820px] font-[700] ">
                  {articleBySlug?.title}
                </h3>
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

                    <span className="flex gap-1 items-center hover:underline hover:cursor-pointer">
                      <Share2 className="h-3 w-3" /> Compartilhar
                    </span>
                  </div>
                </div>
              </div>

              {/* imagem */}
              <div className="relative max-w-[340px] lg:max-w-[840px] h-[475px] rounded-md overflow-hidden">
                {articleBySlug?.thumbnail?.url && (
                  <Image
                    src={articleBySlug.thumbnail.url}
                    alt={
                      articleBySlug.thumbnail.description || "Imagem do artigo"
                    }
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <span className="text-xs text-[#757575]">
                Foto:{" "}
                {articleBySlug?.thumbnail.description ??
                  "Imagem pertencente a noticia do Portal"}
              </span>

              {/* post banner */}
              <PostBanner />

              {/* conteudo */}
              <div
                className="text-[16px] text-[#363636] max-w-[840px] mb-10"
                dangerouslySetInnerHTML={{
                  __html: articleBySlug?.content || "",
                }}
              />
              <ButtonCTAWhatsAppButton />
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
