"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { BannerContext, BannerItem } from "@/provider/banner";
import { BannerAnalyticsContext } from "@/provider/analytics/banner";

export const Banner = () => {
  const { ListBannersWelcome, bannersWelcome } = useContext(BannerContext);
  const { TrackBannerView, TrackBannerClick } = useContext(
    BannerAnalyticsContext
  );

  const [isVisible, setIsVisible] = useState(false);
  const [randomBanner, setRandomBanner] = useState<BannerItem | null>(null);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const pathname = usePathname();
  const shouldDisplayBanner = !pathname?.startsWith("/comercio");

  // Requisição dos banners quando o componente carrega
  useEffect(() => {
    if (shouldDisplayBanner) {
      ListBannersWelcome({});
    }
  }, [shouldDisplayBanner, pathname]);

  // Escolher o banner aleatório assim que os banners forem carregados
  useEffect(() => {
    if (bannersWelcome?.data?.length > 0 && shouldDisplayBanner) {
      const randomIndex = Math.floor(
        Math.random() * bannersWelcome.data.length
      );
      setRandomBanner(bannersWelcome.data[randomIndex]);
      setIsVisible(true);
    }
  }, [bannersWelcome, shouldDisplayBanner, pathname]);

  // Analytics: Registrar VIEW inicial quando o banner modal for exibido
  useEffect(() => {
    if (randomBanner && isVisible && !hasTrackedView) {
      TrackBannerView(randomBanner.id, {
        page: pathname,
        section: "welcome-banner",
        bannerStyle: randomBanner.banner_style,
        bannerName: randomBanner.name,
        company: randomBanner.company?.name,
        selectedFrom: bannersWelcome?.data?.length || 0,
        viewType: "initial",
        modalType: "welcome-overlay",
        timestamp: new Date().toISOString(),
      });
      setHasTrackedView(true);
    }
  }, [
    randomBanner,
    isVisible,
    hasTrackedView,
    TrackBannerView,
    pathname,
    bannersWelcome?.data?.length,
  ]);

  // Analytics: Função para registrar clique no banner
  const handleBannerClick = () => {
    if (randomBanner) {
      TrackBannerClick(randomBanner.id, {
        page: pathname,
        section: "welcome-banner",
        bannerStyle: randomBanner.banner_style,
        bannerName: randomBanner.name,
        company: randomBanner.company?.name,
        targetUrl: randomBanner.link_direction,
        clickPosition: "welcome-banner-overlay",
        modalType: "welcome-overlay",
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Analytics: Função para registrar fechamento do modal
  const handleCloseModal = () => {
    if (randomBanner) {
      TrackBannerClick(randomBanner.id, {
        page: pathname,
        section: "welcome-banner",
        bannerStyle: randomBanner.banner_style,
        bannerName: randomBanner.name,
        company: randomBanner.company?.name,
        clickPosition: "close-button",
        modalType: "welcome-overlay",
        action: "modal-close",
        timestamp: new Date().toISOString(),
      });
    }
    setIsVisible(false);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (randomBanner) {
        TrackBannerClick(randomBanner.id, {
          page: pathname,
          section: "welcome-banner",
          bannerStyle: randomBanner.banner_style,
          bannerName: randomBanner.name,
          company: randomBanner.company?.name,
          clickPosition: "outside-click",
          modalType: "welcome-overlay",
          action: "modal-close",
          timestamp: new Date().toISOString(),
        });
      }
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
          onClick={handleCloseModal}
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
              alt={randomBanner.name}
              className="h-[560px] w-[900px] object-cover"
              priority
              unoptimized
            />
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <Image
              src={randomBanner.url}
              width={360}
              height={225}
              alt={randomBanner.name}
              className="h-[225px] w-[360px] object-cover"
              priority
              unoptimized
            />
          </div>

          {/* Link dinâmico */}
          <a
            href={randomBanner.link_direction}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
            onClick={handleBannerClick}
          >
            <span className="sr-only">
              Saiba mais sobre {randomBanner.name}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
