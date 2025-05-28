"use client";

import Image from "next/image";
import Link from "next/link";
import { ColumnistsSection } from "../../columnists/columnist-section";
import { useContext, useEffect } from "react";
import { ArticleContext } from "@/provider/article";
import { formatDate } from "@/utils/formatDate";
import { useParams } from "next/navigation";
import normalizeTextToslug from "@/utils/normalize-text";

export default function PostGridWwithColumnistSection() {
  const slug = useParams();
  const slugName = slug.name?.toString();
  const noSlug = !slugName;

  const {
    GetArticlesByPortalHighlightPositionFour,
    articlesByPortalHighlightPositionFour,
  } = useContext(ArticleContext);

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

  return (
    <section className="flex flex-col lg:flex-row gap-6 mx-auto max-w-[1272px] justify-between py-4">
      <div
        className={`flex flex-col ${
          noSlug ? "lg:flex-row" : "lg:flex-row"
        } gap-7`}
      >
        {articlesByPortalHighlightPositionFour?.data
          .slice(0, 3)
          .map((post, idx) => (
            <Link
              key={idx}
              href={`/noticia/${normalizeTextToslug(post.category.name)}/${
                post.slug
              }`}
            >
              <div
                className={`flex flex-col gap-3 rounded-xl p-2 transition ${
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
                    src={post.thumbnail.url}
                    alt={post.title}
                    fill
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

      {noSlug && <ColumnistsSection />}
    </section>
  );
}
