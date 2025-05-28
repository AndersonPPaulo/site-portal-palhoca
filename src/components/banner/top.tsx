"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { BannerContext, BannerItem } from "@/provider/banner";

export const TopBanner = () => {
  const { ListBannersTop, bannersTop } = useContext(BannerContext);
  const [isVisible, setIsVisible] = useState(false);
  const [randomBanner, setRandomBanner] = useState<BannerItem | null>(null);
  const pathname = usePathname();
  const shouldDisplayBanner = !pathname?.startsWith("/comercios");

  // Requisição dos banners quando o componente carrega
  useEffect(() => {
    if (shouldDisplayBanner) {
      ListBannersTop({});
    }
  }, [shouldDisplayBanner, pathname]);

  // Escolher o banner aleatório assim que os banners forem carregados
  useEffect(() => {
    if (bannersTop?.data?.length > 0 && shouldDisplayBanner) {
      const randomIndex = Math.floor(Math.random() * bannersTop.data.length);
      setRandomBanner(bannersTop.data[randomIndex]);
      setIsVisible(true);
    }
  }, [bannersTop, shouldDisplayBanner, pathname]);

  if (!isVisible || !randomBanner) return null;

  return (
    <div className="flex flex-col md:flex-row max-w-[670px] mx-auto px-0 md:px-4 py-3  items-center relative">
      <span className="block w-full min-w-[360px] md:w-18 md:min-w-0 text-[12px] text-gray-400 md:absolute md:left-[-30px] md:top-1/2 md:-translate-y-1/2 mb-1 md:mb-0 md:transform md:-rotate-90">
        PUBLICIDADE
      </span>
      <div className="rounded-2xl flex justify-center w-full min-w-[360px] md:max-w-[650px] bg-white shadow-md">
        <Link
          href="https://www.hospitalveterinariasantavida.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="relative block"
        >
          <img
            src={randomBanner.url}
            alt="Hospital Veterinário Santa Vida"
            className="rounded-lg"
          />
        </Link>
      </div>
    </div>
  );
};

export default TopBanner;
