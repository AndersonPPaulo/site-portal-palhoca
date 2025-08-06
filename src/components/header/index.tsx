"use client";
import { useState } from "react";
import logo from "@/assets/Group.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import CustomInput from "../custom-input/custom-input";
import CompanyCategorysMenu from "../menus/company-categorys-menu";
import NewsCategoryMenu from "../menus/news-categorys-menu";
import { Menu, X } from "lucide-react";
import TopBanner from "../banner/top";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isComercioPath =
    pathname === "/comercio/" || pathname.startsWith("/comercio/?categoria=");

  const isNoticiaPath = pathname?.startsWith("/noticia/") || pathname === "/";

  const isContatoPath = pathname === "/contato";

  const isHiddenMobileTabs =
    pathname?.startsWith("/colunista/") || pathname?.startsWith("/noticia/");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleContactsClick = () => {
    router.push("/contato");
  };

  return (
    <>
      {/* 🔒 PARTE FIXA */}
      <header
        className="
          lg:py-3 p-0 xl:px-0 flex flex-col
          fixed top-0 left-0 right-0 w-full z-40 bg-white
          lg:static lg:max-w-[1272px] mx-auto
        "
      >
        <div className="flex justify-between items-center p-4 bg-white w-full max-w-[1272px] mx-auto">
          <button
            onClick={toggleMenu}
            className="lg:hidden flex items-center"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center lg:space-x-4 mx-auto lg:mx-0">
            <Link href="/" className="flex items-center">
              <Image
                src={logo}
                alt="Logo"
                className="h-10 min-w-[159px]"
                unoptimized
              />
            </Link>
          </div>

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
              href="/comercio"
              className={`hover:text-red px-4 py-3 ${
                isComercioPath
                  ? "text-red font-[700] border-b-2 border-red"
                  : "text-[#363636]"
              }`}
            >
              Buscar Comércio
            </Link>
          </nav>

          <div className="flex items-center">
            {/* <button className="lg:hidden" aria-label="Search">
              <Search size={24} />
            </button> */}
            <Button
              onClick={handleContactsClick}
              className="hidden lg:block text-[#FFF] rounded-full h-10 px-6 bg-primary font-[600] hover:bg-primary/80 cursor-pointer transition duration-300 ease-in-out"
            >
              Anúncie sua marca
            </Button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="bg-white shadow-lg p-4 flex flex-col gap-4 lg:hidden">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block py-2 ${
                !isComercioPath ? "text-primary font-[700]" : "text-[#363636]"
              }`}
            >
              Portal
            </Link>
            <Link
              href="/comercio"
              onClick={() => setIsMenuOpen(false)}
              className={`block py-2 ${
                isComercioPath ? "text-red font-[700]" : "text-[#363636]"
              }`}
            >
              Buscar Comércio
            </Link>
            <Button
              onClick={handleContactsClick}
              className="text-[#FFF] rounded-full py-3 px-6 bg-primary font-[600] hover:bg-primary/80 cursor-pointer transition duration-300 ease-in-out w-full mt-2"
            >
              Anúncie sua marca
            </Button>
          </div>
        )}

        {/* Mobile nav tabs */}
        {!isHiddenMobileTabs && (
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
              href="/comercio"
              className={`hover:text-red px-4 py-3 ${
                isComercioPath
                  ? "text-red font-[700] border-b-2 border-red"
                  : "text-[#363636]"
              }`}
            >
              Buscar Comércio
            </Link>
          </nav>
        )}
      </header>

      {/* 🌱 PARTE QUE NÃO É FIXA */}
      {!isMenuOpen && (
        <div
          className={`${
            !isHiddenMobileTabs
              ? "mb-4 mt-[160px] lg:mt-0"
              : "mb-4 mt-[90px] lg:mt-0"
          }`}
        >
          {/* mt-[130px]: espaço para header fixo (ajuste conforme altura real do header fixo) */}
          {isComercioPath || isNoticiaPath ? (
            <CustomInput pathname={pathname} />
          ) : null}
        </div>
      )}

      {!isMenuOpen && !isContatoPath && (
        <>
          {pathname?.startsWith("/comercio") && (
            <CompanyCategorysMenu pathname={pathname} />
          )}
          {(pathname?.startsWith("/noticia") || pathname === "/") && (
            <NewsCategoryMenu pathname={pathname} />
          )}
        </>
      )}

      {!isContatoPath && <TopBanner />}
    </>
  );
}
