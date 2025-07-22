"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { BannerContext, BannerItem } from "@/provider/banner";
import { BannerAnalyticsContext } from "@/provider/analytics/banner";
import { useBannerViewTracking } from "@/hooks/useIntersectionObserverBanner";

export const TopBanner = () => {
  const { ListBannersTop, bannersTop } = useContext(BannerContext);
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
        section: "top-banner",
        bannerStyle: randomBanner.banner_style,
        bannerName: randomBanner.name,
        company: randomBanner.company?.name,
        selectedFrom: bannersTop?.data?.length || 0,
      }
    : {};

  // Hook personalizado para intersection tracking (SEM LOOP)
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
        clickPosition: "top-banner-image",
        timestamp: new Date().toISOString(),
      });
    }
  };

  if (!isVisible || !randomBanner) return null;

  return (
    <div
      ref={bannerRef}
      className=" flex flex-col md:flex-row min-w-[360px] min-h-max-[150px] sm:max-w-[670px] mx-auto px-0 md:px-4 py-3 items-center relative"
    >
      <span className="block w-full min-w-[360px] md:w-18 md:min-w-0 text-[12px] text-gray-400 md:absolute md:left-[-30px] md:top-1/2 md:-translate-y-1/2 mb-1 md:mb-0 md:transform md:-rotate-90">
        PUBLICIDADE
      </span>
      <div className="rounded-2xl flex justify-center min-h-[50px] max-h-[120px] w-full min-w-[360px] md:min-w-[640px] md:max-w-[650px] shadow-md">
        <Link
          href={randomBanner.link_direction}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block"
          onClick={handleBannerClick}
        >
          <img
            src={randomBanner.url}
            alt={randomBanner.name}
            className="rounded-lg max-h-[120px] object-cover w-full"
          />
        </Link>
      </div>
    </div>
  );
};

export default TopBanner;
