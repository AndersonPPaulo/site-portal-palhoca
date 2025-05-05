"use client";

import { useState } from "react";
import logo from "@/assets/Group.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import CustomInput from "../custom-input/custom-input";
import CompanyCategorysMenu from "../menus/company-categorys-menu";
import NewsCategoryMenu from "../menus/news-categorys-menu";
import { Menu, Search, X } from "lucide-react";
import TopBanner from "../banner/top";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if we're on commerce related pages
  const isComercioPath =
    pathname === "/comercios" || pathname?.startsWith("/comercios/");

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-3 p-0 xl:px-0 flex flex-col max-w-[1272px] mx-auto">
      <div className="flex justify-between items-center p-4 bg-white">
        {/* Mobile menu button - visible only on mobile (<lg) */}
        <button
          onClick={toggleMenu}
          className="lg:hidden flex items-center"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo - centered on mobile, left-aligned on desktop */}
        <div className="flex items-center lg:space-x-4 mx-auto lg:mx-0">
          <Image src={logo} alt="Logo" className="h-10 min-w-[159px]" />
        </div>

        {/* Desktop Navigation - hidden on mobile, visible on desktop (lg+) */}
        <nav className="hidden lg:block space-x-4">
          <Link
            href="/"
            className={`hover:text-primary px-4 py-3 ${
              !isComercioPath
                ? "text-primary font-[700] border-b-2 border-primary"
                : "text-[#363636]"
            }`}
          >
            Portal
          </Link>
          <Link
            href="/comercios"
            className={`hover:text-red px-4 py-3 ${
              isComercioPath
                ? "text-red font-[700] border-b-2 border-red"
                : "text-[#363636]"
            }`}
          >
            Buscar Comércio
          </Link>
        </nav>

        {/* CTA Button on desktop / Search icon on mobile */}
        <div className="flex items-center">
          <button className="lg:hidden" aria-label="Search">
            <Search size={24} />
          </button>
          <Button className="hidden lg:block text-[#FFF] rounded-full h-10 px-6 bg-primary font-[600] hover:bg-primary/80 cursor-pointer transition duration-300 ease-in-out">
            Mostre sua marca
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel - only shows when menu is open */}
      {isMenuOpen && (
        <div className="bg-white shadow-lg p-4 flex flex-col gap-4 lg:hidden">
          <Link
            href="/"
            className={`block py-2 ${
              !isComercioPath ? "text-primary font-[700]" : "text-[#363636]"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Portal
          </Link>
          <Link
            href="/comercios"
            className={`block py-2 ${
              isComercioPath ? "text-red font-[700]" : "text-[#363636]"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Buscar Comércio
          </Link>
          <Button className="text-[#FFF] rounded-full py-3 px-6 bg-primary font-[600] hover:bg-primary/80 cursor-pointer transition duration-300 ease-in-out w-full mt-2">
            Mostre sua marca
          </Button>
        </div>
      )}

      {/* Mobile Navigation Tabs - always visible on mobile */}
      <nav className="lg:hidden space-x-4 flex justify-center items-center p-4">
        <Link
          href="/"
          className={`hover:text-primary px-4 py-3 ${
            !isComercioPath
              ? "text-primary font-[700] border-b-2 border-primary"
              : "text-[#363636]"
          }`}
        >
          Portal
        </Link>
        <Link
          href="/comercios"
          className={`hover:text-red px-4 py-3 ${
            isComercioPath
              ? "text-red font-[700] border-b-2 border-red"
              : "text-[#363636]"
          }`}
        >
          Buscar Comércio
        </Link>
      </nav>

      {/* Search bar - Only visible when menu is closed */}
      {!isMenuOpen && <CustomInput pathname={pathname} />}

      {/* Category menus - Only visible when menu is closed */}
      {!isMenuOpen && (
        <>
          {!pathname?.startsWith("/comercios") ||
          pathname?.startsWith("/noticia") ? (
            <NewsCategoryMenu pathname={pathname} />
          ) : (
            pathname.startsWith("/comercios") && (
              <CompanyCategorysMenu pathname={pathname} />
            )
          )}
        </>
      )}

      <TopBanner />

     
    </header>
  );
}
