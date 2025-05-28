"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { BannerContext, BannerItem } from "@/provider/banner";

export const Banner = () => {
  const { ListBannersWelcome, bannersWelcome } = useContext(BannerContext);
  const [isVisible, setIsVisible] = useState(false);
  const [randomBanner, setRandomBanner] = useState<BannerItem | null>(null);
  const pathname = usePathname();
  const shouldDisplayBanner = !pathname?.startsWith("/comercios");

  // Requisição dos banners quando o componente carrega
  useEffect(() => {
    if (shouldDisplayBanner) {
      ListBannersWelcome({});
    }
  }, [shouldDisplayBanner, pathname]);

  // Escolher o banner aleatório assim que os banners forem carregados
  useEffect(() => {
    if (bannersWelcome?.data?.length > 0 && shouldDisplayBanner) {
      const randomIndex = Math.floor(Math.random() * bannersWelcome.data.length);
      setRandomBanner(bannersWelcome.data[randomIndex]);
      setIsVisible(true);
    }
  }, [bannersWelcome, shouldDisplayBanner, pathname]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsVisible(false);
    }
  };

  if (!isVisible || !randomBanner) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleOutsideClick}
    >
      <div className="relative">
        {/* Botão de fechar */}
        <Button
          onClick={() => setIsVisible(false)}
          className="absolute -right-5 -top-5 z-10 rounded-full bg-white p-1 shadow-lg hover:bg-gray-100 hover:cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>

        {/* Conteúdo do banner */}
        <div className="relative overflow-hidden rounded-lg shadow-xl">
          {/* Desktop */}
          <div className="hidden md:block">
            <Image
              src={randomBanner.url}
              width={900}
              height={560}
              alt="Banner"
              className="h-[560px] w-[900px] object-cover"
              priority
            />
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <Image
              src={randomBanner.url}
              width={360}
              height={225}
              alt="Banner"
              className="h-[225px] w-[360px] object-cover"
              priority
            />
          </div>

          {/* Link opcional */}
          <a
            href="https://api.whatsapp.com/send?phone=554831971100"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
          >
            <span className="sr-only">Saiba mais sobre a campanha</span>
          </a>
        </div>
      </div>
    </div>
  );
};
