"use client";

import { useContext, useEffect } from "react";
import { ColumnistContext } from "@/provider/columnist";
import Image from "next/image";
import Link from "next/link";
import default_image from "@/assets/no-img.png";
import normalizeTextToslug from "@/utils/normalize-text-to-slug";

interface ColumnistCardWidgetProps {
  noSlug?: boolean;
}

export default function ColumnistCardWidget({
  noSlug,
}: ColumnistCardWidgetProps) {
  const { GetColumnists, columnists, loading } = useContext(ColumnistContext);

  useEffect(() => {
    GetColumnists(4);
  }, []);

  return (
    <div
      className={`flex flex-col ${
        !noSlug
          ? "max-w-[405px] min-w-[300px] md:w-[405px]"
          : "min-w-[300px] md:w-[264px] md:min-w-[260px]"
      }`}
    >
      <h3 className="text-2xl font-bold text-primary mb-1">Colunistas</h3>

      <div className="flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-gray-500">Carregando...</p>
          </div>
        ) : columnists && columnists.length > 0 ? (
          columnists.map((columnist, index) => {
            const lastArticle = columnist.articles?.[0];
            return (
              <div
                key={columnist.id}
                className={`py-4 ${
                  index < columnists.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                {/* Link do Colunista */}
                <Link
                  href={`/colunista/autor/${columnist.id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {columnist.user_image?.url ? (
                      <Image
                        src={columnist.user_image.url}
                        alt={columnist.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <Image
                        src={default_image}
                        alt={columnist.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 truncate">
                      {columnist.topic}
                    </h4>
                    {columnist.topic && (
                      <p className="text-xs text-gray-600 truncate">
                        {columnist.name}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-gray-500">Nenhum colunista encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
