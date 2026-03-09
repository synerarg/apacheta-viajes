"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import Image from "next/image"
import { ShoppingCartIcon, UserIcon } from "@phosphor-icons/react"
import { MenuIcon } from "lucide-react"

const navLinks = [
  { href: "#", label: "Inicio" },
  { href: "#paquetes", label: "Paquetes NOA" },
  { href: "#experiencias", label: "Experiencias" },
  { href: "#hoteleria", label: "Hotelería" },
  { href: "#agencias", label: "Para Agencias" },
  { href: "#emisivo", label: "Emisivo" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1rem)] max-w-[1440px]">
      <nav className="flex items-center justify-between gap-4 rounded-none bg-primary px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex flex-col shrink-0">
          <Image
            src="/logo.png"
            alt="Apacheta Viajes"
            width={200}
            height={120}
            className="w-auto h-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] text-white/90 hover:text-white transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA & Icons */}
        <div className="hidden lg:flex items-center gap-6">
          <Button
            variant="outline"
            className="text-primary h-12 text-sm hover:text-primary"
          >
            Explorar Paquetes
          </Button>
          <div className="flex items-center gap-6 text-white/90">
            <button
              className="hover:bg-white/20 size-8 flex items-center justify-center transition-colors duration-150"
              aria-label="Mi cuenta"
            >
              <UserIcon className="h-5 w-5" />
            </button>
            <button
              className="hover:bg-white/20 size-8 flex items-center justify-center transition-colors duration-150"
              aria-label="Carrito"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-white hover:bg-white/10 hover:text-white"
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[350px] bg-primary border-primary"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Menú de navegación</SheetTitle>
              <SheetDescription>
                Navegación principal del sitio
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base text-white/90 hover:text-white transition-colors py-3 border-b border-white/10 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-white/20">
                <Button
                  variant="outline"
                  className="border-white text-white bg-transparent hover:bg-white hover:text-primary w-full rounded-sm"
                >
                  Explorar Paquetes
                </Button>
                <div className="flex items-center justify-center gap-6 mt-2 text-white/90">
                  <button
                    className="flex items-center gap-2 hover:text-white transition-colors"
                    aria-label="Mi cuenta"
                  >
                    <UserIcon className="h-5 w-5" />
                    <span className="text-sm">Mi cuenta</span>
                  </button>
                  <button
                    className="flex items-center gap-2 hover:text-white transition-colors"
                    aria-label="Carrito"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span className="text-sm">Carrito</span>
                  </button>
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
