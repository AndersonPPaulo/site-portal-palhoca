"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import bannerPost from "@/assets/banner-post.png";

const PostBanner = () => {
  const pathname = usePathname();

  // Hide banner if route starts with /comercios
  if (pathname?.startsWith("/comercios")) {
    return null;
  }

  return (
      <div className="flex flex-col md:flex-row mx-auto px-0 md:px-8 py-3 items-center relative">
        <span className="block w-full min-w-[360px] md:w-18 md:min-w-0 text-[12px] text-gray-400 md:absolute md:left-[-30px] md:top-1/2 md:-translate-y-1/2 mb-1 md:mb-0 md:transform md:-rotate-90">
          PUBLICIDADE
        </span>
        <div className="rounded-2xl flex justify-center bg-white shadow-md">
          <Link
            href="https://www.hospitalveterinariasantavida.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block"
          >
            <Image
              src={bannerPost}
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
