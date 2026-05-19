"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BriefcaseIcon,
  CaretDownIcon,
  ShoppingCartIcon,
  TicketIcon,
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

interface UserMenuItem {
  href?: string
  label: string
  description?: string
  icon: React.ComponentType<{ className?: string; weight?: "regular" | "fill" | "bold" }>
  highlight?: boolean
  onClick?: () => void
}

interface UserMenuDropdownProps {
  user: AuthenticatedNavbarUser
  displayName: string
  items: UserMenuItem[]
  onSignOut: () => void
  isSigningOut: boolean
}

function UserMenuDropdown({
  user,
  displayName,
  items,
  onSignOut,
  isSigningOut,
}: UserMenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const initials = (() => {
    const source = [user.nombre, user.apellido].filter(Boolean).join(" ").trim()
    if (source) {
      return source
        .split(/\s+/)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase() ?? "")
        .join("")
    }
    return (user.email?.[0] ?? "U").toUpperCase()
  })()

  function openImmediate() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsOpen(true)
  }

  function closeWithDelay() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => setIsOpen(false), 140)
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
        className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 text-[13px] text-white/90 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Menú de cuenta"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[11px] font-bold text-primary">
          {initials}
        </span>
        <span className="hidden xl:inline max-w-[120px] truncate">{displayName}</span>
        <CaretDownIcon
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          weight="bold"
        />
      </button>

      <div
        className={`absolute right-0 top-full pt-3 transition-opacity duration-150 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        role="menu"
      >
        <div className="w-[300px] bg-white border border-neutral-200 shadow-xl">
          <div className="px-4 py-3 border-b border-neutral-100">
            <p className="text-xs uppercase tracking-wider text-neutral-400">
              Sesión iniciada como
            </p>
            <p className="text-sm font-semibold text-neutral-900 truncate mt-0.5">
              {displayName}
            </p>
            {user.email ? (
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
            ) : null}
          </div>

          <div className="py-1">
            {items.map((item, idx) => {
              const Icon = item.icon
              const content = (
                <div
                  className={`flex items-start gap-3 px-4 py-2.5 transition-colors cursor-pointer ${
                    item.highlight
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-neutral-50"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      item.highlight
                        ? "bg-primary text-white"
                        : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" weight={item.highlight ? "fill" : "regular"} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        item.highlight ? "text-primary" : "text-neutral-900"
                      }`}
                    >
                      {item.label}
                    </p>
                    {item.description ? (
                      <p className="text-xs text-neutral-500 mt-0.5 leading-snug">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              )
              if (item.href) {
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    role="menuitem"
                  >
                    {content}
                  </Link>
                )
              }
              return (
                <button
                  key={idx}
                  type="button"
                  className="w-full text-left"
                  onClick={() => {
                    setIsOpen(false)
                    item.onClick?.()
                  }}
                  role="menuitem"
                >
                  {content}
                </button>
              )
            })}
          </div>

          <div className="border-t border-neutral-100 py-1">
            <button
              type="button"
              onClick={onSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 cursor-pointer"
              role="menuitem"
            >
              <LogOutIcon className="h-4 w-4" />
              {isSigningOut ? "Saliendo..." : "Cerrar sesión"}
            </button>
          </div>
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

  const primaryCta = (() => {
    if (user?.tipo === "admin") {
      return { href: "/dashboard", label: "Ir al dashboard" }
    }
    if (user?.tipo === "operador") {
      return { href: "/operador", label: "Ir al panel de operador" }
    }
    return { href: "/account/operador", label: "Convertirme en operador" }
  })()

  const userMenuItems: UserMenuItem[] = user
    ? [
        {
          href: "/mis-reservas",
          label: "Mis reservas",
          description: "Tus compras y vouchers",
          icon: TicketIcon,
        },
      ]
    : []

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
          <div className="hidden items-center gap-3 lg:flex">
            <Button
              asChild
              variant="default"
              className="h-10 text-sm text-primary hover:text-primary bg-white hover:bg-white/90 cursor-pointer"
            >
              <Link href={primaryCta.href}>
                <BriefcaseIcon className="h-4 w-4" weight="fill" />
                {primaryCta.label}
              </Link>
            </Button>

            <div className="flex items-center gap-1 text-white/90">
              {/* Carrito (siempre visible) */}
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
                <UserMenuDropdown
                  user={user}
                  displayName={displayName}
                  items={userMenuItems}
                  onSignOut={handleSignOut}
                  isSigningOut={isSigningOut}
                />
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 h-10 transition-colors hover:bg-white/10 hover:text-white text-[13px]"
                  aria-label="Ingresar"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Ingresar</span>
                </Link>
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
            href={primaryCta.href}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full text-center bg-white text-primary font-sans font-semibold text-sm py-3.5 mb-3 transition-colors hover:bg-white/90 cursor-pointer"
          >
            <BriefcaseIcon className="h-4 w-4" weight="fill" />
            {primaryCta.label}
          </Link>

          {user ? (
            <>
              {/* User card */}
              <div className="mb-2 flex items-center gap-3 rounded-md bg-white/10 px-3 py-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-primary">
                  {(displayName?.[0] ?? "U").toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {displayName}
                  </p>
                  {user.email ? (
                    <p className="text-[11px] text-white/60 truncate">{user.email}</p>
                  ) : null}
                </div>
              </div>

              {userMenuItems.map((item, idx) => {
                const Icon = item.icon
                return (
                  <Link
                    key={idx}
                    href={item.href ?? "#"}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 py-3 text-sm transition-colors border-b border-white/10 ${
                      item.highlight
                        ? "text-white font-semibold"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" weight={item.highlight ? "fill" : "regular"} />
                    <span>{item.label}</span>
                    {item.highlight ? (
                      <span className="ml-auto inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wider">
                        Nuevo
                      </span>
                    ) : null}
                  </Link>
                )
              })}

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
            </>
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
