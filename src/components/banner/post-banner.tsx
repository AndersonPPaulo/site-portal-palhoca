"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useContext, useEffect, useState } from "react";
import { BannerContext, BannerItem } from "@/provider/banner";
import { BannerAnalyticsContext, EventType } from "@/provider/analytics/banner";
import { useBannerViewTracking } from "@/hooks/useIntersectionObserverBanner"; // Hook corrigido
import { PublicCompanyContext } from "@/provider/company";

const PostBanner = () => {
  const { ListBannersNews, bannersNews } = useContext(BannerContext);
  const { TrackBannerView, TrackBannerClick } = useContext(
    BannerAnalyticsContext
  );

  const {highlightedCompanies} =useContext(PublicCompanyContext)

  const [isVisible, setIsVisible] = useState(false);
  const [randomBanner, setRandomBanner] = useState<BannerItem | null>(null);
  const pathname = usePathname();
  const shouldDisplayBanner = !pathname?.startsWith("/comercio");

  // Dados para tracking
  const trackingData = randomBanner
    ? {
        page: pathname,
        section: "post-banner",
        bannerStyle: randomBanner.banner_style,
        bannerName: randomBanner.name,
        company: randomBanner.company?.name,
        selectedFrom: bannersNews?.data?.length || 0,
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
        clickPosition: "banner-image",
        timestamp: new Date().toISOString(),
      });
    }
  };

  if (!isVisible || !randomBanner) return null;

  return (
    <div
      ref={bannerRef} // Ref do hook personalizado
      className={`flex flex-col md:flex-row mx-auto px-0 md:px-8 py-3 items-center relative ${highlightedCompanies?.data.length === 0 ? "mt-40" : "mt-0"}`}
    >
      <span className="block w-full min-w-[360px] md:w-18 md:min-w-0 text-[12px] text-gray-400 md:absolute md:left-[-30px] md:top-1/2 md:-translate-y-1/2 mb-1 md:mb-0 md:transform md:-rotate-90">
        PUBLICIDADE
      </span>
      <div className="rounded-2xl bg-white shadow-md max-h-[110px] lg:max-h-[240px]">
        <Link
          href={randomBanner.link_direction}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block"
          onClick={handleBannerClick}
        >
          <Image
            src={randomBanner.url}
            width={730}
            height={250}
            alt={randomBanner.name}
            priority 
            unoptimized
            className="bg-cover rounded-lg min-h-[110px] lg:min-h-[240px] max-h-[110px] lg:max-h-[240px]"
          />
        </Link>
      </div>
    </div>
  );
};

export default PostBanner;
