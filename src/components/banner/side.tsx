"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import bannerSide from "@/assets/banner-side.png";

const SideBanner = () => {
  const pathname = usePathname();

  // Hide banner if route starts with /comercios
  if (pathname?.startsWith("/comercios")) {
    return null;
  }

  return (
      <div className="flex flex-col mx-auto px-0 py-3 max-w-[315px] lg:ms-10 items-end">
        <span className="w-full text-[12px] text-gray-400 ">
          PUBLICIDADE
        </span>
          <Link
            href="https://www.hospitalveterinariasantavida.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl shadow-lg"
          >
            <Image
              src={bannerSide}
              alt="Hospital Veterinário Santa Vida"
              priority
              className="bg-cover rounded-lg "
            />
          </Link>
    </div>
  );
};

export default SideBanner;
