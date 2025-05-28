"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useContext, useEffect, useState } from "react";
import { BannerContext, BannerItem } from "@/provider/banner";

const PostBanner = () => {
  const { ListBannersNews, bannersNews } = useContext(BannerContext);
  const [isVisible, setIsVisible] = useState(false);
  const [randomBanner, setRandomBanner] = useState<BannerItem | null>(null);
  const pathname = usePathname();
  const shouldDisplayBanner = !pathname?.startsWith("/comercios");

  // Requisição dos banners quando o componente carrega
  useEffect(() => {
    if (shouldDisplayBanner) {
      ListBannersNews({});
    }
  }, [shouldDisplayBanner, pathname]);

  // Escolher o banner aleatório assim que os banners forem carregados
  useEffect(() => {
    if (bannersNews?.data?.length > 0 && shouldDisplayBanner) {
      const randomIndex = Math.floor(Math.random() * bannersNews.data.length);
      setRandomBanner(bannersNews.data[randomIndex]);
      setIsVisible(true);
    }
  }, [bannersNews, shouldDisplayBanner, pathname]);

  if (!isVisible || !randomBanner) return null;

  return (
    <div className="flex flex-col md:flex-row mx-auto px-0 md:px-8 py-3 items-center relative">
      <span className="block w-full min-w-[360px] md:w-18 md:min-w-0 text-[12px] text-gray-400 md:absolute md:left-[-30px] md:top-1/2 md:-translate-y-1/2 mb-1 md:mb-0 md:transform md:-rotate-90">
        PUBLICIDADE
      </span>
      <div className="rounded-2xl bg-white shadow-md">
        <Link
          href="https://www.hospitalveterinariasantavida.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="relative block"
        >
          <Image
            src={randomBanner.url}
            width={730}
            height={250}
            alt="Hospital Veterinário Santa Vida"
            priority
            className="bg-cover rounded-lg min-h-[110px] lg:min-h-[240px]"
          />
        </Link>
      </div>
    </div>
  );
};

export default PostBanner;
