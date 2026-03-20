"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCartIcon, SquaresFourIcon, UserIcon, XIcon } from "@phosphor-icons/react"
import { LogOutIcon, MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
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
  { href: "/contacto", label: "Viaje a medida" },
]

interface NavbarClientProps {
  user: AuthenticatedNavbarUser | null
}

function resolveDisplayName(user: AuthenticatedNavbarUser | null) {
  if (!user) return "Mi cuenta"
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
    <>
      <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-1rem)] max-w-[1440px] -translate-x-1/2">
        <nav className="flex items-center justify-between bg-primary px-4 py-2.5 lg:px-6 lg:py-3">

          {/* Logo */}
          <Link href="/" className="flex shrink-0">
            <Image
              src="/logo.png"
              alt="Apacheta Viajes"
              width={200}
              height={120}
              className="h-9 w-auto sm:h-10 lg:h-auto lg:w-auto"
              priority
            />
          </Link>

          {/* Desktop — nav links */}
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

          {/* Desktop — actions */}
          <div className="hidden items-center gap-6 lg:flex">
            <Button
              asChild
              variant="outline"
              className="h-12 text-sm text-primary hover:text-primary"
            >
              <Link href="/paquetes">Explorar Paquetes</Link>
            </Button>

            <div className="flex items-center gap-6 text-white/90">
              {user ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/mis-reservas"
                        className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Mis reservas"
                      >
                        <UserIcon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{displayName}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-white/10 hover:text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        aria-label={
                          isSigningOut ? "Cerrando sesión" : "Cerrar sesión"
                        }
                      >
                        <LogOutIcon className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{isSigningOut ? "Saliendo..." : "Cerrar sesión"}</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/login"
                      className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Ingresar"
                    >
                      <UserIcon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Ingresar</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {user?.tipo === "admin" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard"
                      className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Dashboard"
                    >
                      <SquaresFourIcon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Dashboard</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/carrito"
                    className="relative flex h-10 w-10 items-center justify-center transition-colors hover:bg-white/10 hover:text-white"
                    aria-label={
                      totalItems > 0 ? `Carrito (${totalItems})` : "Carrito"
                    }
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{totalItems > 0 ? `Carrito (${totalItems})` : "Carrito"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Mobile — cart + hamburger */}
          <div className="flex items-center gap-1 lg:hidden">
            <Link
              href="/carrito"
              className="relative flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10"
              aria-label={totalItems > 0 ? `Carrito (${totalItems})` : "Carrito"}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10"
              aria-label="Abrir menú"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer — manual, sin Radix Portal, sin scroll lock */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-60 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-70 h-full w-[min(320px,90vw)] bg-primary flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header del panel */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/15">
          <Image
            src="/logo.png"
            alt="Apacheta Viajes"
            width={200}
            height={120}
            className="h-8 w-auto"
          />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar menú"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-6 py-4">
          <ul className="flex flex-col">
            {resolvedNavLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center py-3.5 text-base text-white/85 border-b border-white/10 transition-colors hover:text-white last:border-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer del panel */}
        <div className="px-6 pb-8 pt-4 border-t border-white/15 flex flex-col gap-3">
          <Link
            href="/paquetes"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center bg-white text-primary font-sans font-semibold text-sm py-3 transition-colors hover:bg-white/90"
          >
            Explorar Paquetes
          </Link>

          <div className="flex items-center justify-between pt-1">
            {user ? (
              <button
                type="button"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                onClick={() => {
                  setIsOpen(false)
                  handleSignOut()
                }}
                disabled={isSigningOut}
              >
                <UserIcon className="h-4 w-4" />
                <span>{isSigningOut ? "Saliendo..." : "Cerrar sesión"}</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <UserIcon className="h-4 w-4" />
                <span>Ingresar</span>
              </Link>
            )}

            <div className="flex items-center gap-4">
              {user?.tipo === "admin" && (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                  aria-label="Dashboard"
                >
                  <SquaresFourIcon className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              )}

              <Link
                href="/carrito"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <ShoppingCartIcon className="h-4 w-4" />
                <span>Carrito{totalItems > 0 ? ` (${totalItems})` : ""}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
