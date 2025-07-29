"use client";

import { ArticleContext } from "@/provider/article";
import SlugToText from "@/utils/slugToText";
import { generateSlug } from "@/utils/string-utils";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";

export const ColumnistsSection = () => {
  const params = useParams();

  const { ListArticlesColumnists, listArticlesColumnists } =
    useContext(ArticleContext);

  useEffect(() => {
    const titleColumn = Array.isArray(params.titleColumn)
      ? params.titleColumn[0]
      : params.titleColumn;
    ListArticlesColumnists(SlugToText(titleColumn ?? ""));
  }, []);

  return (
    <div className="p-4 rounded-xl shadow-sm max-w-[420px]">
      <h2 className="text-green-700 text-xl font-semibold mb-3">Colunistas</h2>
      <ul className="flex flex-col gap-4">
        {listArticlesColumnists?.slice(0,4).map((col, index) => (
          <li
            key={col.id}
            className={`flex gap-4 items-center ${
              index !== listArticlesColumnists.length - 1
                ? "border-b border-[#e6e6e6] pb-3"
                : ""
            }`}
          >
            <div className="min-w-[60px] min-h-[60px] relative">
              {col.creator.user_image?.url && (
                <Image
                  src={col.creator.user_image.url}
                  alt="Imagem de perfil do colunista"
                  layout="fill"
                  className="rounded-full bg-[#d3d3d3]"
                  unoptimized
                />
              )}
            </div>
            <Link
              href={`/colunista/${generateSlug(
                col.creator.name
              )}/${generateSlug(col.creator.topic ?? "")}`}
              className="cursor-pointer"
            >
              <div>
                <p className="text-sm font-thin italic text-[#757575]">
                  {col.creator.topic}
                </p>
                <p className="text-lg font-bold">{col.title}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
