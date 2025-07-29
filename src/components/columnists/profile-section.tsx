"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SideBanner from "../banner/side";
import PostBanner from "../banner/post-banner";
import { useContext, useEffect } from "react";
import { ArticleContext } from "@/provider/article";
import { formatDate } from "@/utils/formatDate";
import normalizeText from "@/utils/normalize-text-to-slug";
import { generateSlug } from "@/utils/string-utils";
import SlugToText from "@/utils/slugToText";
import default_image from "@/assets/default image.webp";

export default function ProfileColumnist() {
  const params = useParams();

  const { ListArticlesColumnists, listArticlesColumnists } =
    useContext(ArticleContext);

  useEffect(() => {
    const titleColumn = Array.isArray(params.titleColumn)
      ? params.titleColumn[0]
      : params.titleColumn;

    const fetchData = async () => {
      await ListArticlesColumnists(SlugToText(titleColumn ?? ""));
    };

    fetchData();
  }, []);

  const sidePosts = listArticlesColumnists?.slice(0, 5);
  const filteredCol = listArticlesColumnists?.find(
    (item) =>
      generateSlug(item.creator.name.toString()) ===
      params.titleColumn?.toString()
  );

  return (
    <section className="flex flex-col lg:flex-row gap-6 mx-auto max-w-[1272px] justify-between">
      <div className="flex flex-col gap-4 max-w-[840px]">
        {/* Profile section */}
        {filteredCol && (
          <div className="flex gap-4 bg-secondary ms-2 items-center rounded-2xl p-2">
            <Image
              src={
                filteredCol &&
                filteredCol.creator &&
                filteredCol.creator.user_image
                  ? filteredCol.creator.user_image?.url
                  : default_image
              }
              width={140}
              height={140}
              alt="Imagem perfil do colunista"
              unoptimized
              className="w-[64px] h-[64px] md:w-[120px] md:h-[120px] rounded-lg"
            />

            <div className="flex flex-col mt-3">
              <h2 className="text-dark text-2xl font-semibold md:my-2">
                {filteredCol.creator.name}
              </h2>
              <p className="text-gray-700 text-md">
                {filteredCol.creator.topic}
              </p>
            </div>
          </div>
        )}

        {/* conteudo */}
        <h1 className="font-semibold text-3xl">{filteredCol?.title}</h1>
        <div
          className="text-[16px] text-[#363636] max-w-[840px] mb-10"
          dangerouslySetInnerHTML={{
            __html: filteredCol?.content || "",
          }}
        />

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[840px] gap-2 rounded-2xl">
          {listArticlesColumnists?.map((post, idx) => (
            <Link
              key={idx}
              href={`/noticia/${normalizeText(post.category.name)}/${
                post.slug
              }`}
            >
              <div className="flex flex-col gap-3 rounded-xl p-2 transition">
                <div className="relative min-w-[300px]  h-[310px] md:w-[264px] md:min-w-[260px] md:h-[200px] rounded-md overflow-hidden">
                  <Image
                    src={
                      post && post.thumbnail && post.thumbnail.url
                        ? post.thumbnail.url
                        : default_image
                    }
                    alt={post && post.title && post.title
                        ? post.title
                        : "Imagem do portal palhoça"}
                    fill
                    className="object-cover "
                    unoptimized
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

        <PostBanner />
      </div>

      {/* adicionar postagens do colunista aqui quando for consumir API */}
      <div className="flex flex-col max-w-[356px]">
        <div className="shadow-md rounded-lg p-1">
          <h2 className="ms-2 text-primary text-2xl font-semibold my-2">
            Mais lidas
          </h2>
          {sidePosts?.slice(0, 4).map((post, idx) => (
            <Link
              key={idx}
              href={`/noticia/${normalizeText(post.category?.name)}/${
                post.slug
              }`}
            >
              <div className="flex gap-3 rounded-xl p-2 transition">
                <div className="relative min-w-[151px] h-[110px] rounded-sm overflow-hidden">
                  <Image
                    src={
                      post && post.thumbnail && post.thumbnail.url
                        ? post.thumbnail.url
                        : default_image
                    }
                    alt={post.thumbnail?.description ?? "Imagem da notícia"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <h3 className="text-xl font-semibold leading-tight line-clamp-3">
                    {post.title}
                  </h3>
                  <div className="flex w-full justify-between">
                    <span className="w-min text-xs bg-secondary text-primary px-3 py-1 rounded-2xl">
                      {post.category?.name || "Sem categoria"}
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

        <SideBanner />
      </div>
    </section>
  );
}
