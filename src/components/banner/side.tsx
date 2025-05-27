"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useContext, useEffect, useState } from "react";
import { BannerContext, BannerItem } from "@/provider/banner";

const SideBanner = () => {
  const { ListBannersSidebar, bannersSidebar } = useContext(BannerContext);
  const [isVisible, setIsVisible] = useState(false);
  const [randomBanner, setRandomBanner] = useState<BannerItem | null>(null);
  const pathname = usePathname();
  const shouldDisplayBanner = !pathname?.startsWith("/comercios");

  // Requisição dos banners quando o componente carrega
  useEffect(() => {
    if (shouldDisplayBanner) {
      ListBannersSidebar({});
    }
  }, [shouldDisplayBanner, pathname]);

  // Escolher o banner aleatório assim que os banners forem carregados
  useEffect(() => {
    if (bannersSidebar?.data?.length > 0 && shouldDisplayBanner) {
      const randomIndex = Math.floor(
        Math.random() * bannersSidebar.data.length
      );
      setRandomBanner(bannersSidebar.data[randomIndex]);
      setIsVisible(true);
    }
  }, [bannersSidebar, shouldDisplayBanner, pathname]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsVisible(false);
    }
  };

  if (!isVisible || !randomBanner) return null;

  return (
    <div className="flex flex-col mx-auto px-0 py-3 max-w-[315px] lg:ms-10 items-end">
      <span className="w-full text-[12px] text-gray-400 ">PUBLICIDADE</span>
      <Link
        href="https://www.hospitalveterinariasantavida.com.br"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl shadow-lg"
      >
        <Image
          src={randomBanner.url}
          width={330}
          height={500}
          alt="Hospital Veterinário Santa Vida"
          priority
          className="bg-cover rounded-lg "
        />
      </Link>
    </div>
  );
};

export default SideBanner;
