"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { ArticleContext } from "@/provider/article";
import { formatDate } from "@/utils/formatDate";
import { useParams } from "next/navigation";
import normalizeTextToslug from "@/utils/normalize-text";

export default function PostGridSection() {
  const slug = useParams();

  const {
    GetArticlesByPortalHighlightPositionThree,
    articlesByPortalHighlightPositionThree,
  } = useContext(ArticleContext);

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

  return (
    <section className="flex gap-6 max-w-[1272px] mx-auto py-4 justify-between">
      <div className="flex flex-col lg:flex-row justify-between gap-7">
        {articlesByPortalHighlightPositionThree?.data
          .slice(0, 3)
          .map((post, idx) => (
            <Link
              key={idx}
              href={`/noticia/${normalizeTextToslug(post.category.name)}/${post.slug}`}
            >
              <div className="flex flex-col rounded-xl transition max-w-[405px]">
                <div className="relative min-w-[300px] md:w-[405px] h-[310px] rounded-md overflow-hidden">
                  <Image
                    src={post.thumbnail.url}
                    alt={post.title}
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
