'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import anuncio from "@/assets/anuncio.png"
import { Button } from '../ui/button'

export const Banner = () => {
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  // Check if banner should be displayed based on route
  const shouldDisplayBanner = !pathname?.startsWith('/comercio')

  useEffect(() => {
    if (!shouldDisplayBanner) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
  }, [pathname, shouldDisplayBanner])

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsVisible(false)
    }
  }

  if (!isVisible || !shouldDisplayBanner) {
    return null
  } 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={handleOutsideClick}>
      <div className="relative">
        {/* Close button */}
        <Button
          onClick={() => setIsVisible(false)}
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

        {/* Banner content */}
        <div className="relative overflow-hidden rounded-lg shadow-xl">
          {/* Desktop version */}
          <div className="hidden md:block">
            <Image
              src={anuncio} // Make sure to add this image to your public folder
              width={900}
              height={560}
              alt="Outubro Rosa Pet - Campanha de castração"
              className="h-[560px] w-[900px] object-cover"
              priority
            />
          </div>

          {/* Mobile version */}
          <div className="md:hidden">
            <Image
              src={anuncio} // Make sure to add this image to your public folder
              width={360}
              height={225}
              alt="Outubro Rosa Pet - Campanha de castração"
              className="h-[225px] w-[360px] object-cover"
              priority
            />
          </div>

          {/* Optional: Add a link wrapper if the banner should be clickable */}
          <a
            href="https://api.whatsapp.com/send?phone=554831971100"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0"
          >
            <span className="sr-only">Saiba mais sobre a campanha</span>
          </a>
        </div>
      </div>
    </div>
  )
}
