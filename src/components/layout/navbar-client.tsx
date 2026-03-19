"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChartBarIcon, ShoppingCartIcon, UserIcon } from "@phosphor-icons/react"
import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCart } from "@/hooks/use-cart"
import { createClient } from "@/lib/supabase/client"
import type { AuthenticatedNavbarUser } from "@/types/auth/auth.types"

const supabase = createClient()

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/paquetes", label: "Paquetes NOA" },
  { href: "/experiencias", label: "Experiencias" },
  { href: "/hoteleria", label: "Hotelería" },
  { href: "/para-agencias", label: "Para Agencias" },
  { href: "/emisivo", label: "Emisivo" },
]

interface NavbarClientProps {
  user: AuthenticatedNavbarUser | null
}

function resolveDisplayName(user: AuthenticatedNavbarUser | null) {
  if (!user) {
    return "Mi cuenta"
  }

  const fullName = [user.nombre, user.apellido].filter(Boolean).join(" ").trim()

  return fullName || user.email || "Mi cuenta"
}

export function NavbarClient({ user }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSigningOut, startSigningOut] = useTransition()
  const { totalItems } = useCart()
  const router = useRouter()
  const displayName = resolveDisplayName(user)
  const resolvedNavLinks = user
    ? [...navLinks, { href: "/mis-reservas", label: "Mis reservas" }]
    : navLinks

  function handleSignOut() {
    startSigningOut(async () => {
      await supabase.auth.signOut()
      router.replace("/")
      router.refresh()
    })
  }

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-1rem)] max-w-[1440px] -translate-x-1/2">
      <nav className="flex items-center justify-between gap-4 rounded-none bg-primary px-6 py-3">
        <Link href="/" className="flex shrink-0 flex-col">
          <Image
            src="/logo.png"
            alt="Apacheta Viajes"
            width={200}
            height={120}
            className="h-auto w-auto"
          />
        </Link>

        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          {resolvedNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="whitespace-nowrap text-[13px] text-white/90 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <Button
            asChild
            variant="outline"
            className="h-12 text-sm text-primary hover:text-primary"
          >
            <Link href="/#paquetes">Explorar Paquetes</Link>
          </Button>

          <div className="flex items-center gap-2 text-white/90">
            {/* Carrito */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/carrito"
                  className="relative flex size-9 items-center justify-center transition-colors duration-150 hover:bg-white/20"
                  aria-label={totalItems > 0 ? `Carrito (${totalItems})` : "Carrito"}
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {totalItems > 0 ? `Carrito (${totalItems})` : "Carrito"}
              </TooltipContent>
            </Tooltip>

            {/* Usuario */}
            <Tooltip>
              <TooltipTrigger asChild>
                {user ? (
                  <button
                    type="button"
                    className="flex size-9 items-center justify-center transition-colors duration-150 hover:bg-white/20"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    aria-label={isSigningOut ? "Saliendo..." : "Cerrar sesión"}
                  >
                    <UserIcon className="h-5 w-5" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex size-9 items-center justify-center transition-colors duration-150 hover:bg-white/20"
                    aria-label="Ingresar"
                  >
                    <UserIcon className="h-5 w-5" />
                  </Link>
                )}
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {user
                  ? isSigningOut
                    ? "Saliendo..."
                    : `Cerrar sesión (${displayName})`
                  : "Ingresar"}
              </TooltipContent>
            </Tooltip>

            {/* Dashboard — solo admin */}
            {user?.tipo === "admin" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard"
                    className="flex size-9 items-center justify-center transition-colors duration-150 hover:bg-white/20"
                    aria-label="Dashboard"
                  >
                    <ChartBarIcon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">Dashboard admin</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

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
            className="w-[300px] border-primary bg-primary sm:w-[350px]"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Menú de navegación</SheetTitle>
              <SheetDescription>
                Navegación principal del sitio
              </SheetDescription>
            </SheetHeader>

            <nav className="mt-8 flex flex-col gap-2">
              {resolvedNavLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="border-b border-white/10 py-3 text-base text-white/90 transition-colors last:border-0 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-6 flex flex-col gap-3 border-t border-white/20 pt-4">
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-sm border-white bg-transparent text-white hover:bg-white hover:text-primary"
                >
                  <Link href="/#paquetes" onClick={() => setIsOpen(false)}>
                    Explorar Paquetes
                  </Link>
                </Button>

                <div className="mt-2 flex items-center justify-center gap-6 text-white/90">
                  {user?.tipo === "admin" && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 transition-colors hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <ChartBarIcon className="h-5 w-5" />
                      <span className="text-sm">Dashboard</span>
                    </Link>
                  )}

                  {user ? (
                    <button
                      type="button"
                      className="flex items-center gap-2 transition-colors hover:text-white"
                      onClick={() => {
                        setIsOpen(false)
                        handleSignOut()
                      }}
                      disabled={isSigningOut}
                    >
                      <UserIcon className="h-5 w-5" />
                      <span className="max-w-[140px] truncate text-sm">
                        {isSigningOut ? "Saliendo..." : displayName}
                      </span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center gap-2 transition-colors hover:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserIcon className="h-5 w-5" />
                      <span className="text-sm">Ingresar</span>
                    </Link>
                  )}

                  <Link
                    href="/carrito"
                    className="flex items-center gap-2 transition-colors hover:text-white"
                    aria-label={
                      totalItems > 0 ? `Carrito (${totalItems})` : "Carrito"
                    }
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span className="text-sm">Carrito</span>
                  </Link>
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
