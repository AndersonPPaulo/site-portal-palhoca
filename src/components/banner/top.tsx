"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import bannerTop from "@/assets/banner-top.png";

export const TopBanner = () => {
  const pathname = usePathname();

  // Hide banner if route starts with /comercios
  if (pathname?.startsWith("/comercios")) {
    return null;
  }

  return (
    <div className="w-full border-b border-[#e6e6e6] pb-4 px-20">
      <div className="flex flex-col md:flex-row max-w-[670px] mx-auto px-4 items-center relative">
        <span className="block w-full min-w-[360px] md:w-18 md:min-w-0 text-[12px] text-gray-400 md:absolute md:left-[-30px] md:top-1/2 md:-translate-y-1/2 mb-1 md:mb-0 md:transform md:-rotate-90">
          PUBLICIDADE
        </span>
        <div className="rounded-2xl flex justify-center w-full min-w-[360px] md:max-w-[650px]  bg-white shadow-md">
          <Link
            href="https://www.hospitalveterinariasantavida.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block"
          >
            <Image
              src={bannerTop}
              alt="Hospital Veterinário Santa Vida"
              priority
              className="rounded-lg"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
