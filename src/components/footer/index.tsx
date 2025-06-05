import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/Group.png";
import { Facebook, Instagram } from "lucide-react";
import ButtonCTAWhatsAppButton from "../custom-button/cta-whatsapp-group-button";

export function Footer() {
  return (
    <footer className="w-full pt-12 pb-4 border-t border-[#e6e6e6] mt-10">
      <div className="flex flex-col justify-between px-4">
        <div className="flex flex-col md:flex-row mx-auto justify-between w-full p-4 gap-8">
          {/* Logo and description */}
          <div className="max-w-[380px]">
            <Link href="#" className="flex items-center">
            <Image src={logo} alt="Portal Palhoça" width={200} height={50} />
            </Link>
            <p className="mt-4 text-black font-[400] text-md">
              Sua fonte completa de notícias e comércios em Palhoça
            </p>
            <div className="flex gap-4 mt-4">
              <Link
                href="#"
                className="w-8 h-8 p-2 bg-green-500 rounded-full flex items-center justify-center"
              >
                <Facebook color="#FFF" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 p-2 bg-green-500 rounded-full flex items-center justify-center"
              >
                <Instagram color="#FFF" />
              </Link>
            </div>
          </div>

              {/* Receba nossas notícias mobile*/}
        <div className="mt-8 px-4 flex flex-col max-w-[340px] lg:hidden">
          <h3 className="font-semibold text-lg mb-4">Receba nossas notícias</h3>
          <Link
            href="#"
            className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2  rounded-3xl hover:bg-green-200"
          >
            <i className="fab fa-whatsapp"></i>
            Entrar em nosso grupo de WhatsApp
          </Link>
        </div>

          {/* Sobre o Portal */}
          <div className="mt-6 md:mt-0">
            <h3 className="font-semibold text-lg mb-4">Sobre o Portal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-500">
                  Quem somos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-500">
                  Denuncie
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-500">
                  Fale conosco
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-500">
                  Imprensa
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-500">
                  SAC
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-500">
                  Segurança e privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div className="mt-6 md:mt-0">
            <h3 className="font-semibold text-lg mb-4">Categorias</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/noticia/agenda"
                      className="text-gray-600 hover:text-green-500"
                    >
                      Agenda
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/noticia/comunidade"
                      className="text-gray-600 hover:text-green-500"
                    >
                      Comunidade
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/noticia/economia"
                      className="text-gray-600 hover:text-green-500"
                    >
                      Economia
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/noticia/educacao"
                      className="text-gray-600 hover:text-green-500"
                    >
                      Educação
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/noticia/esporte"
                      className="text-gray-600 hover:text-green-500"
                    >
                      Esporte
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/noticia/estilo"
                      className="text-gray-600 hover:text-green-500"
                    >
                      Estilo
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/noticia/politica"
                      className="text-gray-600 hover:text-green-500"
                    >
                      Polícia
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/noticia/policia"
                      className="text-gray-600 hover:text-green-500"
                    >
                      Política
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/noticia/saude"
                      className="text-gray-600 hover:text-green-500"
                    >
                      Saúde
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/noticia/transito"
                      className="text-gray-600 hover:text-green-500"
                    >
                      Trânsito
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/noticia/variedades"
                      className="text-gray-600 hover:text-green-500"
                    >
                      Variedades
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Nossos parceiros */}
          <div className="mt-6 md:mt-0">
            <h3 className="font-semibold text-lg mb-4">Nossos parceiros</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/comercios"
                  className="text-gray-600 hover:text-green-500"
                >
                  Buscador de comércios
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Receba nossas notícias */}
        <div className="mt-8 px-4 hidden lg:flex lg:flex-col">
          <h3 className="font-semibold text-lg mb-4">Receba nossas notícias</h3>
          <ButtonCTAWhatsAppButton/>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-4 text-center text-sm text-gray-600">
          Copyright © 2025 Portal Palhoça | Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
