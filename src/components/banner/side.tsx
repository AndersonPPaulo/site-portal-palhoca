"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useContext, useEffect, useState } from "react";
import { BannerContext, BannerItem } from "@/provider/banner";
import { BannerAnalyticsContext } from "@/provider/analytics/banner";
import { useBannerViewTracking } from "@/hooks/useIntersectionObserverBanner";

const SideBanner = () => {
  const { ListBannersSidebar, bannersSidebar } = useContext(BannerContext);
  const { TrackBannerView, TrackBannerClick } = useContext(
    BannerAnalyticsContext
  );

  const [isVisible, setIsVisible] = useState(false);
  const [randomBanner, setRandomBanner] = useState<BannerItem | null>(null);
  const pathname = usePathname();
  const shouldDisplayBanner = !pathname?.startsWith("/comercio");

  // Dados para tracking
  const trackingData = randomBanner
    ? {
        page: pathname,
        section: "side-banner",
        bannerStyle: randomBanner.banner_style,
        bannerName: randomBanner.name,
        company: randomBanner.company?.name,
        selectedFrom: bannersSidebar?.data?.length || 0,
      }
    : {};

  // Hook personalizado para intersection tracking
  const {
    ref: bannerRef,
    registerInitialView,
    hasInitialView,
  } = useBannerViewTracking(
    randomBanner?.id || "",
    trackingData,
    TrackBannerView
  );

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

  // Registrar view inicial quando banner for exibido
  useEffect(() => {
    if (randomBanner && isVisible) {
      registerInitialView();
    }
  }, [randomBanner, isVisible, registerInitialView]);

  // Analytics: Função para registrar clique
  const handleBannerClick = () => {
    if (randomBanner) {
      TrackBannerClick(randomBanner.id, {
        ...trackingData,
        targetUrl: randomBanner.link_direction,
        clickPosition: "side-banner-image",
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsVisible(false);
    }
  };

  if (!isVisible || !randomBanner) return null;

  return (
    <div
      ref={bannerRef}
      className="flex flex-col mx-auto px-0 py-3 max-w-[315px] lg:ms-10 items-end"
    >
      <span className="w-full text-[12px] text-gray-400">PUBLICIDADE</span>
      <Link
        href={randomBanner.link_direction}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl shadow-lg"
        onClick={handleBannerClick}
      >
        <Image
          src={randomBanner.url}
          width={330}
          height={500}
          alt={randomBanner.name}
          priority
          unoptimized
          className="bg-cover rounded-lg"
        />
      </Link>
    </div>
  );
};

export default SideBanner;
