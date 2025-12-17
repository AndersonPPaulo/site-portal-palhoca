"use client";

import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArticleContext } from "@/provider/article";
import { ArticleAnalyticsContext } from "@/provider/analytics/article";
import { formatDate } from "@/utils/formatDate";
import normalizeTextToslug from "@/utils/normalize-text-to-slug";
import default_image from "@/assets/no-img.png";

export default function PostTopGridSection({
  currentPostId,
}: {
  currentPostId?: string;
}) {
  const pathname = usePathname();

  const { GetPublishedArticles, publishedArticles } =
    useContext(ArticleContext);
  const { TrackArticleClick } = useContext(ArticleAnalyticsContext);

  useEffect(() => {
    GetPublishedArticles({});
  }, []);

  // Filtra para remover o post atual antes de ordenar
  const filteredPosts =
    publishedArticles?.data.filter((post) => post.id !== currentPostId) || [];

  const sortedPosts = filteredPosts
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.created_at.split("/").map(Number);
      const [dayB, monthB, yearB] = b.created_at.split("/").map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateB.getTime() - dateA.getTime(); // Mais recentes primeiro
    })
    .slice(0, 9);

  const topPosts = sortedPosts || [];

  // Clique no post
  const handleTopGridPostClick = (post: any, index: number) => {
    TrackArticleClick(post.id, {
      page: pathname,
      section: "top-portal-grid",
      position: "grid-item",
      categoryName: post.category.name,
      articleTitle: post.title,
      targetUrl: `/noticia/${normalizeTextToslug(post.category.name)}/${
        post.slug
      }`,
      clickPosition: "top-portal-post",
      gridIndex: index,
      gridPosition: `${Math.floor(index / 3) + 1}-${(index % 3) + 1}`,
      gridSize: topPosts.length,
      gridRows: Math.ceil(topPosts.length / 3),
      gridCols: 3,
      sortOrder: "newest_first",
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <section className="flex flex-col gap-6 max-w-[1272px] mx-auto py-4 justify-between">
      <div className="w-[106px] h-2 bg-primary rounded-full" />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-primary">
          Top Portal Palhoça
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between gap-7">
        {topPosts.map((post, idx) => (
          <Link
            key={post.id}
            href={`/noticia/${normalizeTextToslug(post.category.name)}/${
              post.slug
            }`}
            onClick={() => handleTopGridPostClick(post, idx)}
          >
            <div className="flex flex-col rounded-xl transition hover:shadow-lg hover:transform hover:scale-105">
              <div className="relative min-w-[300px] md:w-[405px] h-[310px] rounded-md overflow-hidden">
                {post?.thumbnail?.url ? (
                  <Image
                    unoptimized
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
