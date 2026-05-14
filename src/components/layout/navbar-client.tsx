"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CaretDownIcon,
  ShoppingCartIcon,
  SquaresFourIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react"
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

type NavItem =
  | { kind: "link"; href: string; label: string }
  | { kind: "group"; label: string; items: { href: string; label: string }[] }

const navItems: NavItem[] = [
  { kind: "link", href: "/", label: "Inicio" },
  {
    kind: "group",
    label: "Paquetes",
    items: [
      { href: "/paquetes", label: "Nacionales" },
      { href: "/emisivo", label: "Internacionales" },
      { href: "/contacto", label: "Viaje a medida" },
    ],
  },
  {
    kind: "group",
    label: "Servicios",
    items: [
      { href: "/experiencias", label: "Experiencias" },
      { href: "/hoteleria", label: "Hotelería" },
      { href: "/traslados", label: "Traslados" },
    ],
  },
  { kind: "link", href: "/para-agencias", label: "Para Agencias" },
]

interface NavbarClientProps {
  user: AuthenticatedNavbarUser | null
}

function resolveDisplayName(user: AuthenticatedNavbarUser | null) {
  if (!user) return "Mi cuenta"
  const fullName = [user.nombre, user.apellido].filter(Boolean).join(" ").trim()
  return fullName || user.email || "Mi cuenta"
}

interface DesktopDropdownProps {
  label: string
  items: { href: string; label: string }[]
}

function DesktopDropdown({ label, items }: DesktopDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function openImmediate() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsOpen(true)
  }

  function closeWithDelay() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => setIsOpen(false), 120)
  }

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openImmediate}
      onMouseLeave={closeWithDelay}
    >
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex items-center gap-1 whitespace-nowrap text-[13px] text-white/90 transition-colors hover:text-white cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <CaretDownIcon
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          weight="bold"
        />
      </button>

      <div
        className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-opacity duration-150 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        role="menu"
      >
        <div className="min-w-[200px] bg-primary border border-white/15 shadow-lg py-1.5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-[13px] text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              role="menuitem"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

interface MobileDropdownProps {
  label: string
  items: { href: string; label: string }[]
  onItemClick: () => void
}

function MobileDropdown({ label, items, onItemClick }: MobileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between py-3.5 text-base text-white/85 transition-colors hover:text-white cursor-pointer"
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <CaretDownIcon
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          weight="bold"
        />
      </button>
      <div
        className={`grid transition-all duration-200 ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col pl-3 pb-2">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onItemClick}
                  className="block py-2.5 text-sm text-white/75 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function NavbarClient({ user }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSigningOut, startSigningOut] = useTransition()
  const { totalItems } = useCart()
  const router = useRouter()
  const displayName = resolveDisplayName(user)

  function handleSignOut() {
    startSigningOut(async () => {
      await supabase.auth.signOut()
      router.replace("/")
      router.refresh()
    })
  }

  function closeMobile() {
    setIsOpen(false)
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
            {navItems.map((item) =>
              item.kind === "link" ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="whitespace-nowrap text-[13px] text-white/90 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <DesktopDropdown
                  key={item.label}
                  label={item.label}
                  items={item.items}
                />
              ),
            )}
          </div>

          {/* Desktop — actions */}
          <div className="hidden items-center gap-4 lg:flex">
            <Button
              asChild
              variant="default"
              className="h-10 text-sm text-primary hover:text-primary bg-white hover:bg-white/90 cursor-pointer"
            >
              <Link href="/paquetes">Explorar paquetes nacionales</Link>
            </Button>

            <div className="flex items-center gap-1 text-white/90">
              {/* Dashboard (solo admin) */}
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
                  <TooltipContent side="bottom"><p>Dashboard</p></TooltipContent>
                </Tooltip>
              )}

              {/* Carrito */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/carrito"
                    className="relative flex h-10 w-10 items-center justify-center transition-colors hover:bg-white/10 hover:text-white"
                    aria-label={totalItems > 0 ? `Carrito (${totalItems})` : "Carrito"}
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

              {user ? (
                <>
                  {/* Mis reservas */}
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
                    <TooltipContent side="bottom"><p>{displayName}</p></TooltipContent>
                  </Tooltip>

                  {/* Cerrar sesión */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                        aria-label="Cerrar sesión"
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
                /* Ingresar (solo cuando no hay usuario) */
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
                  <TooltipContent side="bottom"><p>Ingresar</p></TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Mobile — cart + hamburger */}
          <div className="flex items-center gap-1 lg:hidden">
            <Link
              href="/carrito"
              className="relative flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10"
              aria-label={
                totalItems > 0 ? `Carrito (${totalItems})` : "Carrito"
              }
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
              className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10 cursor-pointer"
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
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
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
            className="flex h-9 w-9 items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar menú"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-6 py-2">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.kind === "link" ? (
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className="flex items-center py-3.5 text-base text-white/85 border-b border-white/10 transition-colors hover:text-white last:border-0"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <MobileDropdown
                    label={item.label}
                    items={item.items}
                    onItemClick={closeMobile}
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer del panel */}
        <div className="px-6 pb-safe-or-8 pb-8 pt-4 border-t border-white/15 flex flex-col gap-1">
          <Link
            href="/paquetes"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center bg-white text-primary font-sans font-semibold text-sm py-3.5 mb-2 transition-colors hover:bg-white/90 cursor-pointer"
          >
            Explorar paquetes nacionales
          </Link>

          {/* Links secundarios — uno por fila */}
          <Link
            href="/carrito"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 py-3 text-white/80 hover:text-white transition-colors text-sm border-b border-white/10"
          >
            <ShoppingCartIcon className="h-4 w-4 shrink-0" />
            <span>Carrito{totalItems > 0 ? ` (${totalItems})` : ""}</span>
          </Link>

          {user?.tipo === "admin" && (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 py-3 text-white/80 hover:text-white transition-colors text-sm border-b border-white/10"
              aria-label="Dashboard"
            >
              <SquaresFourIcon className="h-4 w-4 shrink-0" />
              <span>Dashboard</span>
            </Link>
          )}

          {user ? (
            <button
              type="button"
              className="flex items-center gap-3 py-3 text-white/80 hover:text-white transition-colors text-sm w-full cursor-pointer"
              onClick={() => {
                setIsOpen(false)
                handleSignOut()
              }}
              disabled={isSigningOut}
            >
              <LogOutIcon className="h-4 w-4 shrink-0" />
              <span>{isSigningOut ? "Saliendo..." : "Cerrar sesión"}</span>
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 py-3 text-white/80 hover:text-white transition-colors text-sm"
            >
              <UserIcon className="h-4 w-4 shrink-0" />
              <span>Ingresar</span>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
